'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _Map = require('babel-runtime/core-js/map')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _Array$from = require('babel-runtime/core-js/array/from')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _namespace = require('./namespace');

var _namespace2 = _interopRequireDefault(_namespace);

var _utilsScales = require('../utils/scales');

var _utilsScales2 = _interopRequireDefault(_utilsScales);

var _shapesSegment = require('../shapes/segment');

var _shapesSegment2 = _interopRequireDefault(_shapesSegment);

var _behaviorsTimeContextBehavior = require('../behaviors/time-context-behavior');

var _behaviorsTimeContextBehavior2 = _interopRequireDefault(_behaviorsTimeContextBehavior);

// time context bahevior
var timeContextBehavior = null;
var timeContextBehaviorCtor = _behaviorsTimeContextBehavior2['default'];

/**
 * The layer class is the main visualization class. It is mainly defines by its
 * related `LayerTimeContext` which determines its position in the overall
 * timeline (through the `start`, `duration`, `offset` and `stretchRatio`
 * attributes) and by it's registered Shape which defines how to display the
 * data associated to the layer. Each created layer must be inserted into a
 * `Track` instance in order to be displayed.
 *
 * _Note: in the context of the layer, an __item__ is the SVG element
 * returned by a `Shape` instance and associated with a particular __datum__._
 *
 * ### Layer DOM structure
 * ```
 * <g class="layer" transform="translate(${start}, 0)">
 *   <svg class="bounding-box" width="${duration}">
 *     <g class="maingroup">
 *       <!-- background -->
 *       <rect class="background"></rect>
 *       <!-- shapes and common shapes are inserted here -->
 *     </g>
 *     <g class="interactions"><!-- for feedback --></g>
 *   </svg>
 * </g>
 * ```
 */

var Layer = (function (_events$EventEmitter) {
  _inherits(Layer, _events$EventEmitter);

  /**
   * @param {String} dataType - Defines how the layer should look at the data.
   *    Can be 'entity' or 'collection'.
   * @param {(Array|Object)} data - The data associated to the layer.
   * @param {Object} options - Configures the layer.
   * @param {Number} [options.height=100] - Defines the height of the layer.
   * @param {Number} [options.top=0] - Defines the top position of the layer.
   * @param {Number} [options.opacity=1] - Defines the opacity of the layer.
   * @param {Number} [options.yDomain=[0,1]] - Defines boundaries of the data
   *    values in y axis (for exemple to display an audio buffer, this attribute
   *    should be set to [-1, 1].
   * @param {String} [options.className=null] - An optionnal class to add to each
   *    created shape.
   * @param {String} [options.className='selected'] - The class to add to a shape
   *    when selected.
   * @param {Number} [options.contextHandlerWidth=2] - The width of the handlers
   *    displayed to edit the layer.
   * @param {Number} [options.hittable=false] - Defines if the layer can be interacted
   *    with. Basically, the layer is not returned by `BaseState.getHitLayers` when
   *    set to false (a common use case is a layer that contains a cursor)
   */

  function Layer(dataType, data) {
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, Layer);

    _get(Object.getPrototypeOf(Layer.prototype), 'constructor', this).call(this);

    var defaults = {
      height: 100,
      top: 0,
      opacity: 1,
      yDomain: [0, 1],
      className: null,
      selectedClassName: 'selected',
      contextHandlerWidth: 2,
      hittable: true, // when false the layer is not returned by `BaseState.getHitLayers`
      id: '', // used ?
      overflow: 'hidden' };

    /**
     * Parameters of the layers, `defaults` overrided with options.
     * @type {Object}
     */
    // usefull ?
    this.params = _Object$assign({}, defaults, options);
    /**
     * Defines how the layer should look at the data (`'entity'` or `'collection'`).
     * @type {String}
     */
    this.dataType = dataType; // 'entity' || 'collection';
    /** @type {LayerTimeContext} */
    this.timeContext = null;
    /** @type {Element} */
    this.$el = null;
    /** @type {Element} */
    this.$background = null;
    /** @type {Element} */
    this.$boundingBox = null;
    /** @type {Element} */
    this.$maingroup = null;
    /** @type {Element} */
    this.$interactions = null;
    /**
     * A Segment instanciated to interact with the Layer itself.
     * @type {Segment}
     */
    this.contextShape = null;

    this._shapeConfiguration = null; // { ctor, accessors, options }
    this._commonShapeConfiguration = null; // { ctor, accessors, options }
    this._$itemShapeMap = new _Map();
    this._$itemDataMap = new _Map();
    this._$itemCommonShapeMap = new _Map();

    this._isContextEditable = false;
    this._behavior = null;

    this.data = data;

    this._valueToPixel = _utilsScales2['default'].linear().domain(this.params.yDomain).range([0, this.params.height]);

    // initialize timeContext layout
    this._renderContainer();
    // creates the timeContextBehavior for all layers
    if (timeContextBehavior === null) {
      timeContextBehavior = new timeContextBehaviorCtor();
    }
  }

  /**
   * Destroy the layer, clear all references.
   */

  _createClass(Layer, [{
    key: 'destroy',
    value: function destroy() {

      if (this.dataType == 'entity') {
        if (typeof this.data.dispose !== 'undefined') {
          this.data.dispose();
        }
      }

      this.timeContext = null;
      this.data = null;
      this.params = null;
      this._behavior = null;

      this._$itemShapeMap.clear();
      this._$itemDataMap.clear();
      this._$itemCommonShapeMap.clear();

      this.removeAllListeners();
    }

    /**
     * Allows to override default the `TimeContextBehavior` used to edit the layer.
     *
     * @param {Object} ctor
     */
  }, {
    key: '_renderContainer',

    // --------------------------------------
    // Initialization
    // --------------------------------------

    /**
     * Renders the DOM in memory on layer creation to be able to use it before
     * the layer is actually inserted in the DOM.
     */
    value: function _renderContainer() {
      // wrapper group for `start, top and context flip matrix
      this.$el = document.createElementNS(_namespace2['default'], 'g');
      this.$el.classList.add('layer');
      if (this.params.className !== null) {
        this.$el.classList.add(this.params.className);
      }
      // clip the context with a `svg` element
      this.$boundingBox = document.createElementNS(_namespace2['default'], 'svg');
      this.$boundingBox.classList.add('bounding-box');
      this.$boundingBox.style.overflow = this.params.overflow;
      // group to contain layer items
      this.$maingroup = document.createElementNS(_namespace2['default'], 'g');
      this.$maingroup.classList.add('maingroup', 'items');
      // layer background
      this.$background = document.createElementNS(_namespace2['default'], 'rect');
      this.$background.setAttributeNS(null, 'height', '100%');
      this.$background.setAttributeNS(null, 'width', '100%');
      this.$background.classList.add('background');
      this.$background.style.fillOpacity = 0;
      this.$background.style.pointerEvents = 'none';

      // create the DOM tree
      this.$el.appendChild(this.$boundingBox);
      this.$boundingBox.appendChild(this.$maingroup);
      this.$maingroup.appendChild(this.$background);

      if (this._isContextEditable) {
        this._addInteractionsElements();
      }
    }
  }, {
    key: '_addInteractionsElements',
    value: function _addInteractionsElements() {
      var _this = this;

      if (this.$interactions !== null) {
        return;
      }

      // context interactions
      this.$interactions = document.createElementNS(_namespace2['default'], 'g');
      this.$interactions.classList.add('interactions');

      var display = this._isContextEditable ? 'block' : 'none';
      this.$interactions.style.display = display;

      // @NOTE: works but king of ugly... should be cleaned
      this.contextShape = new _shapesSegment2['default']();
      this.contextShape.install({
        opacity: function opacity() {
          return 0.1;
        },
        color: function color() {
          return '#787878';
        },
        width: function width() {
          return _this.timeContext.duration;
        },
        height: function height() {
          return _this._renderingContext.valueToPixel.domain()[1];
        },
        y: function y() {
          return _this._renderingContext.valueToPixel.domain()[0];
        }
      });

      this.$interactions.appendChild(this.contextShape.render());
      this.$boundingBox.appendChild(this.$interactions);
    }

    // --------------------------------------
    // Component Configuration
    // --------------------------------------

    /**
     * Sets the context of the layer, thus defining its `start`, `duration`,
     * `offset` and `stretchRatio`.
     *
     * @param {TimeContext} timeContext - The timeContext in which the layer is displayed.
     */
  }, {
    key: 'setTimeContext',
    value: function setTimeContext(timeContext) {
      this.timeContext = timeContext;
      // create a mixin to pass to the shapes
      this._renderingContext = {};
      this._updateRenderingContext();
    }

    /**
     * Register a shape and its configuration to use in order to render the data.
     *
     * @param {BaseShape} ctor - The constructor of the shape to be used.
     * @param {Object} [accessors={}] - Defines how the shape should adapt to a particular data struture.
     * @param {Object} [options={}] - Global configuration for the shapes, is specific to each `Shape`.
     */
  }, {
    key: 'configureShape',
    value: function configureShape(ctor) {
      var accessors = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      this._shapeConfiguration = { ctor: ctor, accessors: accessors, options: options };
    }

    /**
     * Optionally register a shape to be used across the entire collection.
     *
     * @param {BaseShape} ctor - The constructor of the shape to be used.
     * @param {Object} [accessors={}] - Defines how the shape should adapt to a particular data struture.
     * @param {Object} [options={}] - Global configuration for the shapes, is specific to each `Shape`.
     */
  }, {
    key: 'configureCommonShape',
    value: function configureCommonShape(ctor) {
      var accessors = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      this._commonShapeConfiguration = { ctor: ctor, accessors: accessors, options: options };
    }

    /**
     * Register the behavior to use when interacting with a shape.
     *
     * @param {BaseBehavior} behavior
     */
  }, {
    key: 'setBehavior',
    value: function setBehavior(behavior) {
      behavior.initialize(this);
      this._behavior = behavior;
    }

    /**
     * Updates the values stored in the `_renderingContext` passed  to shapes
     * for rendering and updating.
     */
  }, {
    key: '_updateRenderingContext',
    value: function _updateRenderingContext() {

      // PLAN
      //
      // The time context structures stay the same. They continue to map
      // time in seconds onto an absolute pixel axis that starts at
      // pixel 0 == time 0 and pixel N == time (N / pixels-per-second).
      //
      // The rendering context, on the other hand, has pixel 0 at the
      // left edge of the visible area, so that the rendered SVG has
      // width (in its coordinate scheme) equal to the visible area. We
      // always resituate ourselves there so as to avoid extremely large
      // SVG coordinates when both zoomed in a long way and scrolled a
      // long way to the right, as browser renderers generally seem to
      // blow up when presented with coords above 2^24 or so.
      //
      // To arrange pixel 0 at the left edge, we need to ensure that the
      // time-to-pixel mapping places time 0 at pixel -minX where minX
      // is the time context's timeToPixel mapping of the sum of all
      // applicable time offsets.

      var layerStartTime = this.timeContext.start;
      var layerOffsetTime = this.timeContext.offset;
      var trackOffsetTime = this.timeContext.parent.offset;

      var layerOriginTime = trackOffsetTime + layerStartTime;

      var viewStartTime = -layerOriginTime - layerOffsetTime;

      this._renderingContext.timeToPixel = _utilsScales2['default'].linear().domain([viewStartTime, viewStartTime + 1]).range([0, this.timeContext.timeToPixel(1)]);

      this._renderingContext.minX = 0;

      this._renderingContext.visibleWidth = this.timeContext.parent.visibleWidth;
      this._renderingContext.width = this._renderingContext.visibleWidth;
      this._renderingContext.maxX = this._renderingContext.visibleWidth;

      this._renderingContext.height = this.params.height;
      this._renderingContext.valueToPixel = this._valueToPixel;

      //    console.log("Rendering context: width = " + this._renderingContext.width + ", visibleWidth = " + this._renderingContext.visibleWidth + ", minX = " + this._renderingContext.minX + " (time = " + this._renderingContext.timeToPixel.invert(this._renderingContext.minX) + "), maxX = " + this._renderingContext.maxX + " (time = " + this._renderingContext.timeToPixel.invert(this._renderingContext.maxX) + ")");
    }

    // --------------------------------------
    // Behavior Accessors
    // --------------------------------------

    /**
     * Returns the items marked as selected.
     *
     * @type {Array<Element>}
     */
  }, {
    key: 'select',

    /**
     * Mark item(s) as selected.
     *
     * @param {Element|Element[]} $items
     */
    value: function select() {
      for (var _len = arguments.length, $items = Array(_len), _key = 0; _key < _len; _key++) {
        $items[_key] = arguments[_key];
      }

      if (!this._behavior) {
        return;
      }
      if (!$items.length) {
        $items = this._$itemDataMap.keys();
      }
      if (Array.isArray($items[0])) {
        $items = $items[0];
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _getIterator($items), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var $item = _step.value;

          var datum = this._$itemDataMap.get($item);
          this._behavior.select($item, datum);
          this._toFront($item);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    /**
     * Removes item(s) from selected items.
     *
     * @param {Element|Element[]} $items
     */
  }, {
    key: 'unselect',
    value: function unselect() {
      for (var _len2 = arguments.length, $items = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        $items[_key2] = arguments[_key2];
      }

      if (!this._behavior) {
        return;
      }
      if (!$items.length) {
        $items = this._$itemDataMap.keys();
      }
      if (Array.isArray($items[0])) {
        $items = $items[0];
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = _getIterator($items), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var $item = _step2.value;

          var datum = this._$itemDataMap.get($item);
          this._behavior.unselect($item, datum);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2['return']) {
            _iterator2['return']();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }

    /**
     * Toggle item(s) selection state according to their current state.
     *
     * @param {Element|Element[]} $items
     */
  }, {
    key: 'toggleSelection',
    value: function toggleSelection() {
      for (var _len3 = arguments.length, $items = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        $items[_key3] = arguments[_key3];
      }

      if (!this._behavior) {
        return;
      }
      if (!$items.length) {
        $items = this._$itemDataMap.keys();
      }
      if (Array.isArray($items[0])) {
        $items = $items[0];
      }

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = _getIterator($items), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var $item = _step3.value;

          var datum = this._$itemDataMap.get($item);
          this._behavior.toggleSelection($item, datum);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3['return']) {
            _iterator3['return']();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }

    /**
     * Edit item(s) according to the `edit` defined in the registered `Behavior`.
     *
     * @param {Element|Element[]} $items - The item(s) to edit.
     * @param {Number} dx - The modification to apply in the x axis (in pixels).
     * @param {Number} dy - The modification to apply in the y axis (in pixels).
     * @param {Element} $target - The target of the interaction (for example, left
     *    handler DOM element in a segment).
     */
  }, {
    key: 'edit',
    value: function edit($items, dx, dy, $target) {
      if (!this._behavior) {
        return;
      }
      $items = !Array.isArray($items) ? [$items] : $items;

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = _getIterator($items), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var $item = _step4.value;

          var shape = this._$itemShapeMap.get($item);
          var datum = this._$itemDataMap.get($item);

          this._behavior.edit(this._renderingContext, shape, datum, dx, dy, $target);
          this.emit('edit', shape, datum);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4['return']) {
            _iterator4['return']();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    }

    /**
     * Defines if the `Layer`, and thus the `LayerTimeContext` is editable or not.
     *
     * @params {Boolean} [bool=true]
     */
  }, {
    key: 'setContextEditable',
    value: function setContextEditable() {
      var bool = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      this._isContextEditable = bool;

      if (this.$interactions === null) {
        this._addInteractionsElements();
      } else {
        var display = bool ? 'block' : 'none';
        this.$interactions.style.display = display;
      }
    }

    /**
     * Edit the layer and thus its related `LayerTimeContext` attributes.
     *
     * @param {Number} dx - The modification to apply in the x axis (in pixels).
     * @param {Number} dy - The modification to apply in the y axis (in pixels).
     * @param {Element} $target - The target of the event of the interaction.
     */
  }, {
    key: 'editContext',
    value: function editContext(dx, dy, $target) {
      timeContextBehavior.edit(this, dx, dy, $target);
    }

    /**
     * Stretch the layer and thus its related `LayerTimeContext` attributes.
     *
     * @param {Number} dx - The modification to apply in the x axis (in pixels).
     * @param {Number} dy - The modification to apply in the y axis (in pixels).
     * @param {Element} $target - The target of the event of the interaction.
     */
  }, {
    key: 'stretchContext',
    value: function stretchContext(dx, dy, $target) {
      timeContextBehavior.stretch(this, dx, dy, $target);
    }

    // --------------------------------------
    // Helpers
    // --------------------------------------

    /**
     * Returns an item from a DOM element related to the shape, null otherwise.
     *
     * @param {Element} $el - the element to be tested
     * @return {Element|null}
     */
  }, {
    key: 'getItemFromDOMElement',
    value: function getItemFromDOMElement($el) {
      var $item = undefined;

      do {
        if ($el.classList && $el.classList.contains('item')) {
          $item = $el;
          break;
        }

        $el = $el.parentNode;
      } while ($el !== null);

      return this.hasItem($item) ? $item : null;
    }

    /**
     * Returns the datum associated to a specific item.
     *
     * @param {Element} $item
     * @return {Object|Array|null}
     */
  }, {
    key: 'getDatumFromItem',
    value: function getDatumFromItem($item) {
      var datum = this._$itemDataMap.get($item);
      return datum ? datum : null;
    }

    /**
     * Returns the datum associated to a specific item from any DOM element
     * composing the shape. Basically a shortcut for `getItemFromDOMElement` and
     * `getDatumFromItem` methods.
     *
     * @param {Element} $el
     * @return {Object|Array|null}
     */
  }, {
    key: 'getDatumFromDOMElement',
    value: function getDatumFromDOMElement($el) {
      var $item = this.getItemFromDOMElement($el);
      if ($item === null) {
        return null;
      }
      return this.getDatumFromItem($item);
    }

    /**
     * Tests if the given DOM element is an item of the layer.
     *
     * @param {Element} $item - The item to be tested.
     * @return {Boolean}
     */
  }, {
    key: 'hasItem',
    value: function hasItem($item) {
      return this._$itemDataMap.has($item);
    }

    /**
     * Defines if a given element belongs to the layer. Is more general than
     * `hasItem`, can mostly used to check interactions elements.
     *
     * @param {Element} $el - The DOM element to be tested.
     * @return {bool}
     */
  }, {
    key: 'hasElement',
    value: function hasElement($el) {
      do {
        if ($el === this.$el) {
          return true;
        }

        $el = $el.parentNode;
      } while ($el !== null);

      return false;
    }

    /**
     * Retrieve all the items in a given area as defined in the registered `Shape~inArea` method.
     *
     * @param {Object} area - The area (in viewport coordinate space) in which to find the elements
     * @param {Number} area.top
     * @param {Number} area.left
     * @param {Number} area.width
     * @param {Number} area.height
     * @return {Array} - list of the items presents in the area
     */
  }, {
    key: 'getItemsInArea',
    value: function getItemsInArea(area) {

      var x1 = area.left;
      var x2 = area.left + area.width;

      // keep consistent with context y coordinates system
      var y1 = this.params.height - (area.top + area.height);
      var y2 = this.params.height - area.top;

      y1 += this.params.top;
      y2 += this.params.top;

      var $filteredItems = [];

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = _getIterator(this._$itemDataMap.entries()), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var _step5$value = _slicedToArray(_step5.value, 2);

          var $item = _step5$value[0];
          var datum = _step5$value[1];

          var shape = this._$itemShapeMap.get($item);
          var inArea = shape.inArea(this._renderingContext, datum, x1, y1, x2, y2);

          if (inArea) {
            $filteredItems.push($item);
          }
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5['return']) {
            _iterator5['return']();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      return $filteredItems;
    }

    // --------------------------------------
    // Rendering / Display methods
    // --------------------------------------

    /**
     * Moves an item to the end of the layer to display it front of its
     * siblings (svg z-index...).
     *
     * @param {Element} $item - The item to be moved.
     */
  }, {
    key: '_toFront',
    value: function _toFront($item) {
      this.$maingroup.appendChild($item);
    }

    /**
     * Create the DOM structure of the shapes according to the given data. Inspired
     * from the `enter` and `exit` d3.js paradigm, this method should be called
     * each time a datum is added or removed from the data. While the DOM is
     * created the `update` method must be called in order to update the shapes
     * attributes and thus place them where they should.
     */
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var before = performance.now();

      // render `commonShape` only once
      if (this._commonShapeConfiguration !== null && this._$itemCommonShapeMap.size === 0) {
        var _commonShapeConfiguration = this._commonShapeConfiguration;
        var ctor = _commonShapeConfiguration.ctor;
        var accessors = _commonShapeConfiguration.accessors;
        var options = _commonShapeConfiguration.options;

        var $group = document.createElementNS(_namespace2['default'], 'g');
        var shape = new ctor(options);

        shape.install(accessors);
        $group.appendChild(shape.render());
        $group.classList.add('item', 'common', shape.getClassName());

        this._$itemCommonShapeMap.set($group, shape);
        this.$maingroup.appendChild($group);
      }

      // append elements all at once
      var fragment = document.createDocumentFragment();
      var values = this._$itemDataMap.values(); // iterator

      // enter
      if (this._shapeConfiguration !== null) {
        this.data.forEach(function (datum) {
          var _iteratorNormalCompletion6 = true;
          var _didIteratorError6 = false;
          var _iteratorError6 = undefined;

          try {
            for (var _iterator6 = _getIterator(values), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
              var value = _step6.value;
              if (value === datum) {
                return;
              }
            }
          } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion6 && _iterator6['return']) {
                _iterator6['return']();
              }
            } finally {
              if (_didIteratorError6) {
                throw _iteratorError6;
              }
            }
          }

          var _shapeConfiguration = _this2._shapeConfiguration;
          var ctor = _shapeConfiguration.ctor;
          var accessors = _shapeConfiguration.accessors;
          var options = _shapeConfiguration.options;

          var shape = new ctor(options);
          shape.install(accessors);

          var $el = shape.render(_this2._renderingContext);
          $el.classList.add('item', shape.getClassName());

          _this2._$itemShapeMap.set($el, shape);
          _this2._$itemDataMap.set($el, datum);

          fragment.appendChild($el);
        });

        this.$maingroup.appendChild(fragment);
      }

      // remove
      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = _getIterator(this._$itemDataMap.entries()), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var _step7$value = _slicedToArray(_step7.value, 2);

          var $item = _step7$value[0];
          var datum = _step7$value[1];

          if (this.data.indexOf(datum) !== -1) {
            continue;
          }

          var shape = this._$itemShapeMap.get($item);

          this.$maingroup.removeChild($item);
          shape.destroy();
          // a removed item cannot be selected
          if (this._behavior) {
            this._behavior.unselect($item, datum);
          }

          this._$itemDataMap['delete']($item);
          this._$itemShapeMap['delete']($item);
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7['return']) {
            _iterator7['return']();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }

      var after = performance.now();
      console.log("layer render time = " + Math.round(after - before));
    }

    /**
     * Updates the container of the layer and the attributes of the existing shapes.
     */
  }, {
    key: 'update',
    value: function update() {
      this._updateContainer();
      this._updateShapes();
    }

    /**
     * Updates the container of the layer.
     */
  }, {
    key: '_updateContainer',
    value: function _updateContainer() {
      this._updateRenderingContext();

      var timeContext = this.timeContext;

      var width = this._renderingContext.timeToPixel(this.timeContext.duration);
      if (width > this._renderingContext.visibleWidth) {
        width = this._renderingContext.visibleWidth;
      }

      var top = this.params.top;
      var height = this.params.height;

      // matrix to invert the coordinate system
      var translateMatrix = 'matrix(1, 0, 0, -1, 0, ' + (top + height) + ')';

      this.$el.setAttributeNS(null, 'transform', translateMatrix);

      this.$boundingBox.setAttributeNS(null, 'width', width);
      this.$boundingBox.setAttributeNS(null, 'height', height);
      this.$boundingBox.style.opacity = this.params.opacity;

      if (this.contextShape !== null) {
        // maintain context shape
        this.contextShape.update(this._renderingContext, this.timeContext, 0);
      }
    }
  }, {
    key: '_encacheEntity',
    value: function _encacheEntity() {

      if (this.dataType !== 'entity') return;
      if (this._cached) return;
      if (this._data === []) return;

      var origData = this._data[0];

      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = _getIterator(this._$itemDataMap.entries()), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var _step8$value = _slicedToArray(_step8.value, 2);

          var $item = _step8$value[0];
          var datum = _step8$value[1];

          if (datum === origData) {
            var shape = this._$itemShapeMap.get($item);
            var cache = shape.encache(datum);
            if (cache) {
              this._$itemDataMap.set($item, cache);
              if (typeof origData.dispose !== 'undefined') {
                origData.dispose();
              }
              this.data = cache;
            }
          }
        }
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8['return']) {
            _iterator8['return']();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }

      this._cached = true;
    }

    /**
     * Updates the attributes of all the `Shape` instances rendered into the layer.
     */
  }, {
    key: '_updateShapes',
    value: function _updateShapes() {
      var _this3 = this;

      var before = performance.now();

      this._updateRenderingContext();

      this._encacheEntity();

      // Update common shape, if any
      this._$itemCommonShapeMap.forEach(function (shape, $item) {
        shape.update(_this3._renderingContext, _this3.data);
      });

      // Update specific shapes
      var _iteratorNormalCompletion9 = true;
      var _didIteratorError9 = false;
      var _iteratorError9 = undefined;

      try {
        for (var _iterator9 = _getIterator(this._$itemDataMap.entries()), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
          var _step9$value = _slicedToArray(_step9.value, 2);

          var $item = _step9$value[0];
          var datum = _step9$value[1];

          var shape = this._$itemShapeMap.get($item);
          shape.update(this._renderingContext, datum);
        }
      } catch (err) {
        _didIteratorError9 = true;
        _iteratorError9 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion9 && _iterator9['return']) {
            _iterator9['return']();
          }
        } finally {
          if (_didIteratorError9) {
            throw _iteratorError9;
          }
        }
      }

      var after = performance.now();
      console.log("layer update time = " + Math.round(after - before));
    }
  }, {
    key: 'describe',
    value: function describe(x) {
      var _iteratorNormalCompletion10 = true;
      var _didIteratorError10 = false;
      var _iteratorError10 = undefined;

      try {
        for (var _iterator10 = _getIterator(this._$itemDataMap.entries()), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
          var _step10$value = _slicedToArray(_step10.value, 2);

          var $item = _step10$value[0];
          var datum = _step10$value[1];

          var shape = this._$itemShapeMap.get($item);
          var description = shape.describe(datum, x - this.start);
          if (description !== null) {
            return description;
          }
        }
      } catch (err) {
        _didIteratorError10 = true;
        _iteratorError10 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion10 && _iterator10['return']) {
            _iterator10['return']();
          }
        } finally {
          if (_didIteratorError10) {
            throw _iteratorError10;
          }
        }
      }
    }
  }, {
    key: 'start',

    /**
     * Returns `LayerTimeContext`'s `start` time domain value.
     *
     * @type {Number}
     */
    get: function get() {
      return this.timeContext.start;
    },

    /**
     * Sets `LayerTimeContext`'s `start` time domain value.
     *
     * @type {Number}
     */
    set: function set(value) {
      this.timeContext.start = value;
    }

    /**
     * Returns `LayerTimeContext`'s `offset` time domain value.
     *
     * @type {Number}
     */
  }, {
    key: 'offset',
    get: function get() {
      return this.timeContext.offset;
    },

    /**
     * Sets `LayerTimeContext`'s `offset` time domain value.
     *
     * @type {Number}
     */
    set: function set(value) {
      this.timeContext.offset = value;
    }

    /**
     * Returns `LayerTimeContext`'s `duration` time domain value.
     *
     * @type {Number}
     */
  }, {
    key: 'duration',
    get: function get() {
      return this.timeContext.duration;
    },

    /**
     * Sets `LayerTimeContext`'s `duration` time domain value.
     *
     * @type {Number}
     */
    set: function set(value) {
      this.timeContext.duration = value;
    }

    /**
     * Returns `LayerTimeContext`'s `stretchRatio` time domain value.
     *
     * @type {Number}
     */
  }, {
    key: 'stretchRatio',
    get: function get() {
      return this.timeContext.stretchRatio;
    },

    /**
     * Sets `LayerTimeContext`'s `stretchRatio` time domain value.
     *
     * @type {Number}
     */
    set: function set(value) {
      this.timeContext.stretchRatio = value;
    }

    /**
     * Set the domain boundaries of the data for the y axis.
     *
     * @type {Array}
     */
  }, {
    key: 'yDomain',
    set: function set(domain) {
      this.params.yDomain = domain;
      this._valueToPixel.domain(domain);
    },

    /**
     * Returns the domain boundaries of the data for the y axis.
     *
     * @type {Array}
     */
    get: function get() {
      return this.params.yDomain;
    }

    /**
     * Sets the opacity of the whole layer.
     *
     * @type {Number}
     */
  }, {
    key: 'opacity',
    set: function set(value) {
      this.params.opacity = value;
    },

    /**
     * Returns the opacity of the whole layer.
     *
     * @type {Number}
     */
    get: function get() {
      return this.params.opacity;
    }

    /**
     * Returns the transfert function used to display the data in the x axis.
     *
     * @type {Number}
     */
  }, {
    key: 'timeToPixel',
    get: function get() {
      return this.timeContext.timeToPixel;
    }

    /**
     * Returns the transfert function used to display the data in the y axis.
     *
     * @type {Number}
     */
  }, {
    key: 'valueToPixel',
    get: function get() {
      return this._valueToPixel;
    }

    /**
     * Returns an array containing all the displayed items.
     *
     * @type {Array<Element>}
     */
  }, {
    key: 'items',
    get: function get() {
      return _Array$from(this._$itemDataMap.keys());
    }

    /**
     * Returns the data associated to the layer.
     *
     * @type {Object[]}
     */
  }, {
    key: 'data',
    get: function get() {
      return this._data;
    },

    /**
     * Sets the data associated with the layer.
     *
     * @type {Object|Object[]}
     */
    set: function set(data) {
      switch (this.dataType) {
        case 'entity':
          if (this._data) {
            // if data already exists, reuse the reference
            this._data[0] = data;
          } else {
            this._data = [data];
          }
          break;
        case 'collection':
          this._data = data;
          break;
      }
      this._cached = false;
    }
  }, {
    key: 'selectedItems',
    get: function get() {
      return this._behavior ? this._behavior.selectedItems : [];
    }
  }], [{
    key: 'configureTimeContextBehavior',
    value: function configureTimeContextBehavior(ctor) {
      timeContextBehaviorCtor = ctor;
    }
  }]);

  return Layer;
})(_events2['default'].EventEmitter);

exports['default'] = Layer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jb3JlL2xheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQUFtQixRQUFROzs7O3lCQUNaLGFBQWE7Ozs7MkJBQ1QsaUJBQWlCOzs7OzZCQUNoQixtQkFBbUI7Ozs7NENBQ1Asb0NBQW9DOzs7OztBQUdwRSxJQUFJLG1CQUFtQixHQUFHLElBQUksQ0FBQztBQUMvQixJQUFJLHVCQUF1Qiw0Q0FBc0IsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTJCN0IsS0FBSztZQUFMLEtBQUs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXNCYixXQXRCUSxLQUFLLENBc0JaLFFBQVEsRUFBRSxJQUFJLEVBQWdCO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkF0QnJCLEtBQUs7O0FBdUJ0QiwrQkF2QmlCLEtBQUssNkNBdUJkOztBQUVSLFFBQU0sUUFBUSxHQUFHO0FBQ2YsWUFBTSxFQUFFLEdBQUc7QUFDWCxTQUFHLEVBQUUsQ0FBQztBQUNOLGFBQU8sRUFBRSxDQUFDO0FBQ1YsYUFBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNmLGVBQVMsRUFBRSxJQUFJO0FBQ2YsdUJBQWlCLEVBQUUsVUFBVTtBQUM3Qix5QkFBbUIsRUFBRSxDQUFDO0FBQ3RCLGNBQVEsRUFBRSxJQUFJO0FBQ2QsUUFBRSxFQUFFLEVBQUU7QUFDTixjQUFRLEVBQUUsUUFBUSxFQUNuQixDQUFDOzs7Ozs7O0FBTUYsUUFBSSxDQUFDLE1BQU0sR0FBRyxlQUFjLEVBQUUsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7Ozs7O0FBS25ELFFBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDOztBQUV6QixRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQzs7QUFFeEIsUUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7O0FBRWhCLFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDOztBQUV4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RTs7Ozs7OztTQU96QixhQUFDLElBQUksRUFBRTtBQUNiLGNBQVEsSUFBSSxDQUFDLFFBQVE7QUFDckIsYUFBSyxRQUFRO0FBQ1gsY0FBSSxJQUFJLENBQUMsS0FBSyxFQUFFOztBQUNkLGdCQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztXQUN0QixNQUFNO0FBQ0wsZ0JBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztXQUNyQjtBQUNELGdCQUFNO0FBQUEsQUFDUixhQUFLLFlBQVk7QUFDZixjQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNsQixnQkFBTTtBQUFBLE9BQ1A7QUFDRCxVQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztLQUN0Qjs7O1NBZ0xnQixlQUFHO0FBQ2xCLGFBQU8sSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7S0FDM0Q7OztXQXhWa0Msc0NBQUMsSUFBSSxFQUFFO0FBQ3hDLDZCQUF1QixHQUFHLElBQUksQ0FBQztLQUNoQzs7O1NBdkhrQixLQUFLO0dBQVMsb0JBQU8sWUFBWTs7cUJBQWpDLEtBQUsiLCJmaWxlIjoic3JjL2NvcmUvbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZXZlbnRzIGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgbnMgZnJvbSAnLi9uYW1lc3BhY2UnO1xuaW1wb3J0IHNjYWxlcyBmcm9tICcuLi91dGlscy9zY2FsZXMnO1xuaW1wb3J0IFNlZ21lbnQgZnJvbSAnLi4vc2hhcGVzL3NlZ21lbnQnO1xuaW1wb3J0IFRpbWVDb250ZXh0QmVoYXZpb3IgZnJvbSAnLi4vYmVoYXZpb3JzL3RpbWUtY29udGV4dC1iZWhhdmlvcic7XG5cbi8vIHRpbWUgY29udGV4dCBiYWhldmlvclxubGV0IHRpbWVDb250ZXh0QmVoYXZpb3IgPSBudWxsO1xubGV0IHRpbWVDb250ZXh0QmVoYXZpb3JDdG9yID0gVGltZUNvbnRleHRCZWhhdmlvcjtcblxuLyoqXG4gKiBUaGUgbGF5ZXIgY2xhc3MgaXMgdGhlIG1haW4gdmlzdWFsaXphdGlvbiBjbGFzcy4gSXQgaXMgbWFpbmx5IGRlZmluZXMgYnkgaXRzXG4gKiByZWxhdGVkIGBMYXllclRpbWVDb250ZXh0YCB3aGljaCBkZXRlcm1pbmVzIGl0cyBwb3NpdGlvbiBpbiB0aGUgb3ZlcmFsbFxuICogdGltZWxpbmUgKHRocm91Z2ggdGhlIGBzdGFydGAsIGBkdXJhdGlvbmAsIGBvZmZzZXRgIGFuZCBgc3RyZXRjaFJhdGlvYFxuICogYXR0cmlidXRlcykgYW5kIGJ5IGl0J3MgcmVnaXN0ZXJlZCBTaGFwZSB3aGljaCBkZWZpbmVzIGhvdyB0byBkaXNwbGF5IHRoZVxuICogZGF0YSBhc3NvY2lhdGVkIHRvIHRoZSBsYXllci4gRWFjaCBjcmVhdGVkIGxheWVyIG11c3QgYmUgaW5zZXJ0ZWQgaW50byBhXG4gKiBgVHJhY2tgIGluc3RhbmNlIGluIG9yZGVyIHRvIGJlIGRpc3BsYXllZC5cbiAqXG4gKiBfTm90ZTogaW4gdGhlIGNvbnRleHQgb2YgdGhlIGxheWVyLCBhbiBfX2l0ZW1fXyBpcyB0aGUgU1ZHIGVsZW1lbnRcbiAqIHJldHVybmVkIGJ5IGEgYFNoYXBlYCBpbnN0YW5jZSBhbmQgYXNzb2NpYXRlZCB3aXRoIGEgcGFydGljdWxhciBfX2RhdHVtX18uX1xuICpcbiAqICMjIyBMYXllciBET00gc3RydWN0dXJlXG4gKiBgYGBcbiAqIDxnIGNsYXNzPVwibGF5ZXJcIiB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoJHtzdGFydH0sIDApXCI+XG4gKiAgIDxzdmcgY2xhc3M9XCJib3VuZGluZy1ib3hcIiB3aWR0aD1cIiR7ZHVyYXRpb259XCI+XG4gKiAgICAgPGcgY2xhc3M9XCJtYWluZ3JvdXBcIj5cbiAqICAgICAgIDwhLS0gYmFja2dyb3VuZCAtLT5cbiAqICAgICAgIDxyZWN0IGNsYXNzPVwiYmFja2dyb3VuZFwiPjwvcmVjdD5cbiAqICAgICAgIDwhLS0gc2hhcGVzIGFuZCBjb21tb24gc2hhcGVzIGFyZSBpbnNlcnRlZCBoZXJlIC0tPlxuICogICAgIDwvZz5cbiAqICAgICA8ZyBjbGFzcz1cImludGVyYWN0aW9uc1wiPjwhLS0gZm9yIGZlZWRiYWNrIC0tPjwvZz5cbiAqICAgPC9zdmc+XG4gKiA8L2c+XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGF5ZXIgZXh0ZW5kcyBldmVudHMuRXZlbnRFbWl0dGVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhVHlwZSAtIERlZmluZXMgaG93IHRoZSBsYXllciBzaG91bGQgbG9vayBhdCB0aGUgZGF0YS5cbiAgICogICAgQ2FuIGJlICdlbnRpdHknIG9yICdjb2xsZWN0aW9uJy5cbiAgICogQHBhcmFtIHsoQXJyYXl8T2JqZWN0KX0gZGF0YSAtIFRoZSBkYXRhIGFzc29jaWF0ZWQgdG8gdGhlIGxheWVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIENvbmZpZ3VyZXMgdGhlIGxheWVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuaGVpZ2h0PTEwMF0gLSBEZWZpbmVzIHRoZSBoZWlnaHQgb2YgdGhlIGxheWVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMudG9wPTBdIC0gRGVmaW5lcyB0aGUgdG9wIHBvc2l0aW9uIG9mIHRoZSBsYXllci5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLm9wYWNpdHk9MV0gLSBEZWZpbmVzIHRoZSBvcGFjaXR5IG9mIHRoZSBsYXllci5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnlEb21haW49WzAsMV1dIC0gRGVmaW5lcyBib3VuZGFyaWVzIG9mIHRoZSBkYXRhXG4gICAqICAgIHZhbHVlcyBpbiB5IGF4aXMgKGZvciBleGVtcGxlIHRvIGRpc3BsYXkgYW4gYXVkaW8gYnVmZmVyLCB0aGlzIGF0dHJpYnV0ZVxuICAgKiAgICBzaG91bGQgYmUgc2V0IHRvIFstMSwgMV0uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jbGFzc05hbWU9bnVsbF0gLSBBbiBvcHRpb25uYWwgY2xhc3MgdG8gYWRkIHRvIGVhY2hcbiAgICogICAgY3JlYXRlZCBzaGFwZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNsYXNzTmFtZT0nc2VsZWN0ZWQnXSAtIFRoZSBjbGFzcyB0byBhZGQgdG8gYSBzaGFwZVxuICAgKiAgICB3aGVuIHNlbGVjdGVkLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuY29udGV4dEhhbmRsZXJXaWR0aD0yXSAtIFRoZSB3aWR0aCBvZiB0aGUgaGFuZGxlcnNcbiAgICogICAgZGlzcGxheWVkIHRvIGVkaXQgdGhlIGxheWVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuaGl0dGFibGU9ZmFsc2VdIC0gRGVmaW5lcyBpZiB0aGUgbGF5ZXIgY2FuIGJlIGludGVyYWN0ZWRcbiAgICogICAgd2l0aC4gQmFzaWNhbGx5LCB0aGUgbGF5ZXIgaXMgbm90IHJldHVybmVkIGJ5IGBCYXNlU3RhdGUuZ2V0SGl0TGF5ZXJzYCB3aGVuXG4gICAqICAgIHNldCB0byBmYWxzZSAoYSBjb21tb24gdXNlIGNhc2UgaXMgYSBsYXllciB0aGF0IGNvbnRhaW5zIGEgY3Vyc29yKVxuICAgKi9cbiAgY29uc3RydWN0b3IoZGF0YVR5cGUsIGRhdGEsIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKCk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGhlaWdodDogMTAwLFxuICAgICAgdG9wOiAwLFxuICAgICAgb3BhY2l0eTogMSxcbiAgICAgIHlEb21haW46IFswLCAxXSxcbiAgICAgIGNsYXNzTmFtZTogbnVsbCxcbiAgICAgIHNlbGVjdGVkQ2xhc3NOYW1lOiAnc2VsZWN0ZWQnLFxuICAgICAgY29udGV4dEhhbmRsZXJXaWR0aDogMixcbiAgICAgIGhpdHRhYmxlOiB0cnVlLCAvLyB3aGVuIGZhbHNlIHRoZSBsYXllciBpcyBub3QgcmV0dXJuZWQgYnkgYEJhc2VTdGF0ZS5nZXRIaXRMYXllcnNgXG4gICAgICBpZDogJycsIC8vIHVzZWQgP1xuICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLCAvLyB1c2VmdWxsID9cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUGFyYW1ldGVycyBvZiB0aGUgbGF5ZXJzLCBgZGVmYXVsdHNgIG92ZXJyaWRlZCB3aXRoIG9wdGlvbnMuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLnBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcbiAgICAvKipcbiAgICAgKiBEZWZpbmVzIGhvdyB0aGUgbGF5ZXIgc2hvdWxkIGxvb2sgYXQgdGhlIGRhdGEgKGAnZW50aXR5J2Agb3IgYCdjb2xsZWN0aW9uJ2ApLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5kYXRhVHlwZSA9IGRhdGFUeXBlOyAvLyAnZW50aXR5JyB8fCAnY29sbGVjdGlvbic7XG4gICAgLyoqIEB0eXBlIHtMYXllclRpbWVDb250ZXh0fSAqL1xuICAgIHRoaXMudGltZUNvbnRleHQgPSBudWxsO1xuICAgIC8qKiBAdHlwZSB7RWxlbWVudH0gKi9cbiAgICB0aGlzLiRlbCA9IG51bGw7XG4gICAgLyoqIEB0eXBlIHtFbGVtZW50fSAqL1xuICAgIHRoaXMuJGJhY2tncm91bmQgPSBudWxsO1xuICAgIC8qKiBAdHlwZSB7RWxlbWVudH0gKi9cbiAgICB0aGlzLiRib3VuZGluZ0JveCA9IG51bGw7XG4gICAgLyoqIEB0eXBlIHtFbGVtZW50fSAqL1xuICAgIHRoaXMuJG1haW5ncm91cCA9IG51bGw7XG4gICAgLyoqIEB0eXBlIHtFbGVtZW50fSAqL1xuICAgIHRoaXMuJGludGVyYWN0aW9ucyA9IG51bGw7XG4gICAgLyoqXG4gICAgICogQSBTZWdtZW50IGluc3RhbmNpYXRlZCB0byBpbnRlcmFjdCB3aXRoIHRoZSBMYXllciBpdHNlbGYuXG4gICAgICogQHR5cGUge1NlZ21lbnR9XG4gICAgICovXG4gICAgdGhpcy5jb250ZXh0U2hhcGUgPSBudWxsO1xuXG4gICAgdGhpcy5fc2hhcGVDb25maWd1cmF0aW9uID0gbnVsbDsgICAgICAgLy8geyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfVxuICAgIHRoaXMuX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbiA9IG51bGw7IC8vIHsgY3RvciwgYWNjZXNzb3JzLCBvcHRpb25zIH1cbiAgICB0aGlzLl8kaXRlbVNoYXBlTWFwID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuXyRpdGVtRGF0YU1hcCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl8kaXRlbUNvbW1vblNoYXBlTWFwID0gbmV3IE1hcCgpO1xuXG4gICAgdGhpcy5faXNDb250ZXh0RWRpdGFibGUgPSBmYWxzZTtcbiAgICB0aGlzLl9iZWhhdmlvciA9IG51bGw7XG5cbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuXG4gICAgdGhpcy5fdmFsdWVUb1BpeGVsID0gc2NhbGVzLmxpbmVhcigpXG4gICAgICAuZG9tYWluKHRoaXMucGFyYW1zLnlEb21haW4pXG4gICAgICAucmFuZ2UoWzAsIHRoaXMucGFyYW1zLmhlaWdodF0pO1xuXG4gICAgLy8gaW5pdGlhbGl6ZSB0aW1lQ29udGV4dCBsYXlvdXRcbiAgICB0aGlzLl9yZW5kZXJDb250YWluZXIoKTtcbiAgICAvLyBjcmVhdGVzIHRoZSB0aW1lQ29udGV4dEJlaGF2aW9yIGZvciBhbGwgbGF5ZXJzXG4gICAgaWYgKHRpbWVDb250ZXh0QmVoYXZpb3IgPT09IG51bGwpIHtcbiAgICAgIHRpbWVDb250ZXh0QmVoYXZpb3IgPSBuZXcgdGltZUNvbnRleHRCZWhhdmlvckN0b3IoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGVzdHJveSB0aGUgbGF5ZXIsIGNsZWFyIGFsbCByZWZlcmVuY2VzLlxuICAgKi9cbiAgZGVzdHJveSgpIHtcblxuICAgIGlmICh0aGlzLmRhdGFUeXBlID09ICdlbnRpdHknKSB7XG4gICAgICBpZiAodHlwZW9mKHRoaXMuZGF0YS5kaXNwb3NlKSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhpcy5kYXRhLmRpc3Bvc2UoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgdGhpcy50aW1lQ29udGV4dCA9IG51bGw7XG4gICAgdGhpcy5kYXRhID0gbnVsbDtcbiAgICB0aGlzLnBhcmFtcyA9IG51bGw7XG4gICAgdGhpcy5fYmVoYXZpb3IgPSBudWxsO1xuXG4gICAgdGhpcy5fJGl0ZW1TaGFwZU1hcC5jbGVhcigpO1xuICAgIHRoaXMuXyRpdGVtRGF0YU1hcC5jbGVhcigpO1xuICAgIHRoaXMuXyRpdGVtQ29tbW9uU2hhcGVNYXAuY2xlYXIoKTtcblxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCk7XG4gIH1cblxuICAvKipcbiAgICogQWxsb3dzIHRvIG92ZXJyaWRlIGRlZmF1bHQgdGhlIGBUaW1lQ29udGV4dEJlaGF2aW9yYCB1c2VkIHRvIGVkaXQgdGhlIGxheWVyLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gY3RvclxuICAgKi9cbiAgc3RhdGljIGNvbmZpZ3VyZVRpbWVDb250ZXh0QmVoYXZpb3IoY3Rvcikge1xuICAgIHRpbWVDb250ZXh0QmVoYXZpb3JDdG9yID0gY3RvcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGBMYXllclRpbWVDb250ZXh0YCdzIGBzdGFydGAgdGltZSBkb21haW4gdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgc3RhcnQoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQuc3RhcnQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBgTGF5ZXJUaW1lQ29udGV4dGAncyBgc3RhcnRgIHRpbWUgZG9tYWluIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgc2V0IHN0YXJ0KHZhbHVlKSB7XG4gICAgdGhpcy50aW1lQ29udGV4dC5zdGFydCA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYExheWVyVGltZUNvbnRleHRgJ3MgYG9mZnNldGAgdGltZSBkb21haW4gdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgb2Zmc2V0KCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0Lm9mZnNldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGBMYXllclRpbWVDb250ZXh0YCdzIGBvZmZzZXRgIHRpbWUgZG9tYWluIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgc2V0IG9mZnNldCh2YWx1ZSkge1xuICAgIHRoaXMudGltZUNvbnRleHQub2Zmc2V0ID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgTGF5ZXJUaW1lQ29udGV4dGAncyBgZHVyYXRpb25gIHRpbWUgZG9tYWluIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IGR1cmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0LmR1cmF0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYExheWVyVGltZUNvbnRleHRgJ3MgYGR1cmF0aW9uYCB0aW1lIGRvbWFpbiB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHNldCBkdXJhdGlvbih2YWx1ZSkge1xuICAgIHRoaXMudGltZUNvbnRleHQuZHVyYXRpb24gPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGBMYXllclRpbWVDb250ZXh0YCdzIGBzdHJldGNoUmF0aW9gIHRpbWUgZG9tYWluIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IHN0cmV0Y2hSYXRpbygpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC5zdHJldGNoUmF0aW87XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBgTGF5ZXJUaW1lQ29udGV4dGAncyBgc3RyZXRjaFJhdGlvYCB0aW1lIGRvbWFpbiB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHNldCBzdHJldGNoUmF0aW8odmFsdWUpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0LnN0cmV0Y2hSYXRpbyA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgZG9tYWluIGJvdW5kYXJpZXMgb2YgdGhlIGRhdGEgZm9yIHRoZSB5IGF4aXMuXG4gICAqXG4gICAqIEB0eXBlIHtBcnJheX1cbiAgICovXG4gIHNldCB5RG9tYWluKGRvbWFpbikge1xuICAgIHRoaXMucGFyYW1zLnlEb21haW4gPSBkb21haW47XG4gICAgdGhpcy5fdmFsdWVUb1BpeGVsLmRvbWFpbihkb21haW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGRvbWFpbiBib3VuZGFyaWVzIG9mIHRoZSBkYXRhIGZvciB0aGUgeSBheGlzLlxuICAgKlxuICAgKiBAdHlwZSB7QXJyYXl9XG4gICAqL1xuICBnZXQgeURvbWFpbigpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJhbXMueURvbWFpbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBvcGFjaXR5IG9mIHRoZSB3aG9sZSBsYXllci5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHNldCBvcGFjaXR5KHZhbHVlKSB7XG4gICAgdGhpcy5wYXJhbXMub3BhY2l0eSA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG9wYWNpdHkgb2YgdGhlIHdob2xlIGxheWVyLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IG9wYWNpdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zLm9wYWNpdHk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdHJhbnNmZXJ0IGZ1bmN0aW9uIHVzZWQgdG8gZGlzcGxheSB0aGUgZGF0YSBpbiB0aGUgeCBheGlzLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IHRpbWVUb1BpeGVsKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHRyYW5zZmVydCBmdW5jdGlvbiB1c2VkIHRvIGRpc3BsYXkgdGhlIGRhdGEgaW4gdGhlIHkgYXhpcy5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCB2YWx1ZVRvUGl4ZWwoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlVG9QaXhlbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIHRoZSBkaXNwbGF5ZWQgaXRlbXMuXG4gICAqXG4gICAqIEB0eXBlIHtBcnJheTxFbGVtZW50Pn1cbiAgICovXG4gIGdldCBpdGVtcygpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLl8kaXRlbURhdGFNYXAua2V5cygpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBkYXRhIGFzc29jaWF0ZWQgdG8gdGhlIGxheWVyLlxuICAgKlxuICAgKiBAdHlwZSB7T2JqZWN0W119XG4gICAqL1xuICBnZXQgZGF0YSgpIHsgcmV0dXJuIHRoaXMuX2RhdGE7IH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgZGF0YSBhc3NvY2lhdGVkIHdpdGggdGhlIGxheWVyLlxuICAgKlxuICAgKiBAdHlwZSB7T2JqZWN0fE9iamVjdFtdfVxuICAgKi9cbiAgc2V0IGRhdGEoZGF0YSkge1xuICAgIHN3aXRjaCAodGhpcy5kYXRhVHlwZSkge1xuICAgIGNhc2UgJ2VudGl0eSc6XG4gICAgICBpZiAodGhpcy5fZGF0YSkgeyAgLy8gaWYgZGF0YSBhbHJlYWR5IGV4aXN0cywgcmV1c2UgdGhlIHJlZmVyZW5jZVxuICAgICAgICB0aGlzLl9kYXRhWzBdID0gZGF0YTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2RhdGEgPSBbZGF0YV07XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlICdjb2xsZWN0aW9uJzpcbiAgICAgIHRoaXMuX2RhdGEgPSBkYXRhO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHRoaXMuX2NhY2hlZCA9IGZhbHNlO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gSW5pdGlhbGl6YXRpb25cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogUmVuZGVycyB0aGUgRE9NIGluIG1lbW9yeSBvbiBsYXllciBjcmVhdGlvbiB0byBiZSBhYmxlIHRvIHVzZSBpdCBiZWZvcmVcbiAgICogdGhlIGxheWVyIGlzIGFjdHVhbGx5IGluc2VydGVkIGluIHRoZSBET00uXG4gICAqL1xuICBfcmVuZGVyQ29udGFpbmVyKCkge1xuICAgIC8vIHdyYXBwZXIgZ3JvdXAgZm9yIGBzdGFydCwgdG9wIGFuZCBjb250ZXh0IGZsaXAgbWF0cml4XG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgdGhpcy4kZWwuY2xhc3NMaXN0LmFkZCgnbGF5ZXInKTtcbiAgICBpZiAodGhpcy5wYXJhbXMuY2xhc3NOYW1lICE9PSBudWxsKSB7XG4gICAgICB0aGlzLiRlbC5jbGFzc0xpc3QuYWRkKHRoaXMucGFyYW1zLmNsYXNzTmFtZSk7XG4gICAgfVxuICAgIC8vIGNsaXAgdGhlIGNvbnRleHQgd2l0aCBhIGBzdmdgIGVsZW1lbnRcbiAgICB0aGlzLiRib3VuZGluZ0JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3N2ZycpO1xuICAgIHRoaXMuJGJvdW5kaW5nQm94LmNsYXNzTGlzdC5hZGQoJ2JvdW5kaW5nLWJveCcpO1xuICAgIHRoaXMuJGJvdW5kaW5nQm94LnN0eWxlLm92ZXJmbG93ID0gdGhpcy5wYXJhbXMub3ZlcmZsb3c7XG4gICAgLy8gZ3JvdXAgdG8gY29udGFpbiBsYXllciBpdGVtc1xuICAgIHRoaXMuJG1haW5ncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICB0aGlzLiRtYWluZ3JvdXAuY2xhc3NMaXN0LmFkZCgnbWFpbmdyb3VwJywgJ2l0ZW1zJyk7XG4gICAgLy8gbGF5ZXIgYmFja2dyb3VuZFxuICAgIHRoaXMuJGJhY2tncm91bmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdyZWN0Jyk7XG4gICAgdGhpcy4kYmFja2dyb3VuZC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgJzEwMCUnKTtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsICcxMDAlJyk7XG4gICAgdGhpcy4kYmFja2dyb3VuZC5jbGFzc0xpc3QuYWRkKCdiYWNrZ3JvdW5kJyk7XG4gICAgdGhpcy4kYmFja2dyb3VuZC5zdHlsZS5maWxsT3BhY2l0eSA9IDA7XG4gICAgdGhpcy4kYmFja2dyb3VuZC5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xuXG4gICAgLy8gY3JlYXRlIHRoZSBET00gdHJlZVxuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRoaXMuJGJvdW5kaW5nQm94KTtcbiAgICB0aGlzLiRib3VuZGluZ0JveC5hcHBlbmRDaGlsZCh0aGlzLiRtYWluZ3JvdXApO1xuICAgIHRoaXMuJG1haW5ncm91cC5hcHBlbmRDaGlsZCh0aGlzLiRiYWNrZ3JvdW5kKTtcblxuICAgIGlmICh0aGlzLl9pc0NvbnRleHRFZGl0YWJsZSkge1xuICAgICAgdGhpcy5fYWRkSW50ZXJhY3Rpb25zRWxlbWVudHMoKTtcbiAgICB9XG4gIH1cblxuICBfYWRkSW50ZXJhY3Rpb25zRWxlbWVudHMoKSB7XG5cbiAgICBpZiAodGhpcy4kaW50ZXJhY3Rpb25zICE9PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gY29udGV4dCBpbnRlcmFjdGlvbnNcbiAgICB0aGlzLiRpbnRlcmFjdGlvbnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgdGhpcy4kaW50ZXJhY3Rpb25zLmNsYXNzTGlzdC5hZGQoJ2ludGVyYWN0aW9ucycpO1xuXG4gICAgY29uc3QgZGlzcGxheSA9IHRoaXMuX2lzQ29udGV4dEVkaXRhYmxlID8gJ2Jsb2NrJyA6ICdub25lJztcbiAgICB0aGlzLiRpbnRlcmFjdGlvbnMuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXk7XG5cbiAgICAvLyBATk9URTogd29ya3MgYnV0IGtpbmcgb2YgdWdseS4uLiBzaG91bGQgYmUgY2xlYW5lZFxuICAgIHRoaXMuY29udGV4dFNoYXBlID0gbmV3IFNlZ21lbnQoKTtcbiAgICB0aGlzLmNvbnRleHRTaGFwZS5pbnN0YWxsKHtcbiAgICAgIG9wYWNpdHk6ICgpID0+IDAuMSxcbiAgICAgIGNvbG9yICA6ICgpID0+ICcjNzg3ODc4JyxcbiAgICAgIHdpZHRoICA6ICgpID0+IHRoaXMudGltZUNvbnRleHQuZHVyYXRpb24sXG4gICAgICBoZWlnaHQgOiAoKSA9PiB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbC5kb21haW4oKVsxXSxcbiAgICAgIHkgICAgICA6ICgpID0+IHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsLmRvbWFpbigpWzBdXG4gICAgfSk7XG4gICAgXG4gICAgdGhpcy4kaW50ZXJhY3Rpb25zLmFwcGVuZENoaWxkKHRoaXMuY29udGV4dFNoYXBlLnJlbmRlcigpKTtcbiAgICB0aGlzLiRib3VuZGluZ0JveC5hcHBlbmRDaGlsZCh0aGlzLiRpbnRlcmFjdGlvbnMpO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQ29tcG9uZW50IENvbmZpZ3VyYXRpb25cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogU2V0cyB0aGUgY29udGV4dCBvZiB0aGUgbGF5ZXIsIHRodXMgZGVmaW5pbmcgaXRzIGBzdGFydGAsIGBkdXJhdGlvbmAsXG4gICAqIGBvZmZzZXRgIGFuZCBgc3RyZXRjaFJhdGlvYC5cbiAgICpcbiAgICogQHBhcmFtIHtUaW1lQ29udGV4dH0gdGltZUNvbnRleHQgLSBUaGUgdGltZUNvbnRleHQgaW4gd2hpY2ggdGhlIGxheWVyIGlzIGRpc3BsYXllZC5cbiAgICovXG4gIHNldFRpbWVDb250ZXh0KHRpbWVDb250ZXh0KSB7XG4gICAgdGhpcy50aW1lQ29udGV4dCA9IHRpbWVDb250ZXh0O1xuICAgIC8vIGNyZWF0ZSBhIG1peGluIHRvIHBhc3MgdG8gdGhlIHNoYXBlc1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQgPSB7fTtcbiAgICB0aGlzLl91cGRhdGVSZW5kZXJpbmdDb250ZXh0KCk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBzaGFwZSBhbmQgaXRzIGNvbmZpZ3VyYXRpb24gdG8gdXNlIGluIG9yZGVyIHRvIHJlbmRlciB0aGUgZGF0YS5cbiAgICpcbiAgICogQHBhcmFtIHtCYXNlU2hhcGV9IGN0b3IgLSBUaGUgY29uc3RydWN0b3Igb2YgdGhlIHNoYXBlIHRvIGJlIHVzZWQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbYWNjZXNzb3JzPXt9XSAtIERlZmluZXMgaG93IHRoZSBzaGFwZSBzaG91bGQgYWRhcHQgdG8gYSBwYXJ0aWN1bGFyIGRhdGEgc3RydXR1cmUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gLSBHbG9iYWwgY29uZmlndXJhdGlvbiBmb3IgdGhlIHNoYXBlcywgaXMgc3BlY2lmaWMgdG8gZWFjaCBgU2hhcGVgLlxuICAgKi9cbiAgY29uZmlndXJlU2hhcGUoY3RvciwgYWNjZXNzb3JzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuX3NoYXBlQ29uZmlndXJhdGlvbiA9IHsgY3RvciwgYWNjZXNzb3JzLCBvcHRpb25zIH07XG4gIH1cblxuICAvKipcbiAgICogT3B0aW9uYWxseSByZWdpc3RlciBhIHNoYXBlIHRvIGJlIHVzZWQgYWNyb3NzIHRoZSBlbnRpcmUgY29sbGVjdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtCYXNlU2hhcGV9IGN0b3IgLSBUaGUgY29uc3RydWN0b3Igb2YgdGhlIHNoYXBlIHRvIGJlIHVzZWQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbYWNjZXNzb3JzPXt9XSAtIERlZmluZXMgaG93IHRoZSBzaGFwZSBzaG91bGQgYWRhcHQgdG8gYSBwYXJ0aWN1bGFyIGRhdGEgc3RydXR1cmUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gLSBHbG9iYWwgY29uZmlndXJhdGlvbiBmb3IgdGhlIHNoYXBlcywgaXMgc3BlY2lmaWMgdG8gZWFjaCBgU2hhcGVgLlxuICAgKi9cbiAgY29uZmlndXJlQ29tbW9uU2hhcGUoY3RvciwgYWNjZXNzb3JzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbiA9IHsgY3RvciwgYWNjZXNzb3JzLCBvcHRpb25zIH07XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgdGhlIGJlaGF2aW9yIHRvIHVzZSB3aGVuIGludGVyYWN0aW5nIHdpdGggYSBzaGFwZS5cbiAgICpcbiAgICogQHBhcmFtIHtCYXNlQmVoYXZpb3J9IGJlaGF2aW9yXG4gICAqL1xuICBzZXRCZWhhdmlvcihiZWhhdmlvcikge1xuICAgIGJlaGF2aW9yLmluaXRpYWxpemUodGhpcyk7XG4gICAgdGhpcy5fYmVoYXZpb3IgPSBiZWhhdmlvcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSB2YWx1ZXMgc3RvcmVkIGluIHRoZSBgX3JlbmRlcmluZ0NvbnRleHRgIHBhc3NlZCAgdG8gc2hhcGVzXG4gICAqIGZvciByZW5kZXJpbmcgYW5kIHVwZGF0aW5nLlxuICAgKi9cbiAgX3VwZGF0ZVJlbmRlcmluZ0NvbnRleHQoKSB7XG5cbiAgICAvLyBQTEFOXG4gICAgLy9cbiAgICAvLyBUaGUgdGltZSBjb250ZXh0IHN0cnVjdHVyZXMgc3RheSB0aGUgc2FtZS4gVGhleSBjb250aW51ZSB0byBtYXBcbiAgICAvLyB0aW1lIGluIHNlY29uZHMgb250byBhbiBhYnNvbHV0ZSBwaXhlbCBheGlzIHRoYXQgc3RhcnRzIGF0XG4gICAgLy8gcGl4ZWwgMCA9PSB0aW1lIDAgYW5kIHBpeGVsIE4gPT0gdGltZSAoTiAvIHBpeGVscy1wZXItc2Vjb25kKS5cbiAgICAvL1xuICAgIC8vIFRoZSByZW5kZXJpbmcgY29udGV4dCwgb24gdGhlIG90aGVyIGhhbmQsIGhhcyBwaXhlbCAwIGF0IHRoZVxuICAgIC8vIGxlZnQgZWRnZSBvZiB0aGUgdmlzaWJsZSBhcmVhLCBzbyB0aGF0IHRoZSByZW5kZXJlZCBTVkcgaGFzXG4gICAgLy8gd2lkdGggKGluIGl0cyBjb29yZGluYXRlIHNjaGVtZSkgZXF1YWwgdG8gdGhlIHZpc2libGUgYXJlYS4gV2VcbiAgICAvLyBhbHdheXMgcmVzaXR1YXRlIG91cnNlbHZlcyB0aGVyZSBzbyBhcyB0byBhdm9pZCBleHRyZW1lbHkgbGFyZ2VcbiAgICAvLyBTVkcgY29vcmRpbmF0ZXMgd2hlbiBib3RoIHpvb21lZCBpbiBhIGxvbmcgd2F5IGFuZCBzY3JvbGxlZCBhXG4gICAgLy8gbG9uZyB3YXkgdG8gdGhlIHJpZ2h0LCBhcyBicm93c2VyIHJlbmRlcmVycyBnZW5lcmFsbHkgc2VlbSB0b1xuICAgIC8vIGJsb3cgdXAgd2hlbiBwcmVzZW50ZWQgd2l0aCBjb29yZHMgYWJvdmUgMl4yNCBvciBzby5cbiAgICAvLyBcbiAgICAvLyBUbyBhcnJhbmdlIHBpeGVsIDAgYXQgdGhlIGxlZnQgZWRnZSwgd2UgbmVlZCB0byBlbnN1cmUgdGhhdCB0aGVcbiAgICAvLyB0aW1lLXRvLXBpeGVsIG1hcHBpbmcgcGxhY2VzIHRpbWUgMCBhdCBwaXhlbCAtbWluWCB3aGVyZSBtaW5YXG4gICAgLy8gaXMgdGhlIHRpbWUgY29udGV4dCdzIHRpbWVUb1BpeGVsIG1hcHBpbmcgb2YgdGhlIHN1bSBvZiBhbGxcbiAgICAvLyBhcHBsaWNhYmxlIHRpbWUgb2Zmc2V0cy5cbiAgICBcbiAgICBjb25zdCBsYXllclN0YXJ0VGltZSA9IHRoaXMudGltZUNvbnRleHQuc3RhcnQ7XG4gICAgY29uc3QgbGF5ZXJPZmZzZXRUaW1lID0gdGhpcy50aW1lQ29udGV4dC5vZmZzZXQ7XG4gICAgY29uc3QgdHJhY2tPZmZzZXRUaW1lID0gdGhpcy50aW1lQ29udGV4dC5wYXJlbnQub2Zmc2V0O1xuXG4gICAgY29uc3QgbGF5ZXJPcmlnaW5UaW1lID0gdHJhY2tPZmZzZXRUaW1lICsgbGF5ZXJTdGFydFRpbWU7XG5cbiAgICBjb25zdCB2aWV3U3RhcnRUaW1lID0gLWxheWVyT3JpZ2luVGltZSAtIGxheWVyT2Zmc2V0VGltZTtcbiAgICBcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsID0gc2NhbGVzLmxpbmVhcigpXG4gICAgICAuZG9tYWluKFt2aWV3U3RhcnRUaW1lLCB2aWV3U3RhcnRUaW1lICsgMV0pXG4gICAgICAucmFuZ2UoWzAsIHRoaXMudGltZUNvbnRleHQudGltZVRvUGl4ZWwoMSldKTtcbiAgICBcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0Lm1pblggPSAwO1xuXG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC52aXNpYmxlV2lkdGggPSB0aGlzLnRpbWVDb250ZXh0LnBhcmVudC52aXNpYmxlV2lkdGg7XG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC53aWR0aCA9IHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudmlzaWJsZVdpZHRoO1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQubWF4WCA9IHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudmlzaWJsZVdpZHRoO1xuICAgIFxuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQuaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsID0gdGhpcy5fdmFsdWVUb1BpeGVsO1xuXG4vLyAgICBjb25zb2xlLmxvZyhcIlJlbmRlcmluZyBjb250ZXh0OiB3aWR0aCA9IFwiICsgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC53aWR0aCArIFwiLCB2aXNpYmxlV2lkdGggPSBcIiArIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudmlzaWJsZVdpZHRoICsgXCIsIG1pblggPSBcIiArIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQubWluWCArIFwiICh0aW1lID0gXCIgKyB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydCh0aGlzLl9yZW5kZXJpbmdDb250ZXh0Lm1pblgpICsgXCIpLCBtYXhYID0gXCIgKyB0aGlzLl9yZW5kZXJpbmdDb250ZXh0Lm1heFggKyBcIiAodGltZSA9IFwiICsgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQodGhpcy5fcmVuZGVyaW5nQ29udGV4dC5tYXhYKSArIFwiKVwiKTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEJlaGF2aW9yIEFjY2Vzc29yc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBpdGVtcyBtYXJrZWQgYXMgc2VsZWN0ZWQuXG4gICAqXG4gICAqIEB0eXBlIHtBcnJheTxFbGVtZW50Pn1cbiAgICovXG4gIGdldCBzZWxlY3RlZEl0ZW1zKCkge1xuICAgIHJldHVybiB0aGlzLl9iZWhhdmlvciA/IHRoaXMuX2JlaGF2aW9yLnNlbGVjdGVkSXRlbXMgOiBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrIGl0ZW0ocykgYXMgc2VsZWN0ZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudHxFbGVtZW50W119ICRpdGVtc1xuICAgKi9cbiAgc2VsZWN0KC4uLiRpdGVtcykge1xuICAgIGlmICghdGhpcy5fYmVoYXZpb3IpIHsgcmV0dXJuOyB9XG4gICAgaWYgKCEkaXRlbXMubGVuZ3RoKSB7ICRpdGVtcyA9IHRoaXMuXyRpdGVtRGF0YU1hcC5rZXlzKCk7IH1cbiAgICBpZiAoQXJyYXkuaXNBcnJheSgkaXRlbXNbMF0pKSB7ICRpdGVtcyA9ICRpdGVtc1swXTsgfVxuXG4gICAgZm9yIChsZXQgJGl0ZW0gb2YgJGl0ZW1zKSB7XG4gICAgICBjb25zdCBkYXR1bSA9IHRoaXMuXyRpdGVtRGF0YU1hcC5nZXQoJGl0ZW0pO1xuICAgICAgdGhpcy5fYmVoYXZpb3Iuc2VsZWN0KCRpdGVtLCBkYXR1bSk7XG4gICAgICB0aGlzLl90b0Zyb250KCRpdGVtKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBpdGVtKHMpIGZyb20gc2VsZWN0ZWQgaXRlbXMuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudHxFbGVtZW50W119ICRpdGVtc1xuICAgKi9cbiAgdW5zZWxlY3QoLi4uJGl0ZW1zKSB7XG4gICAgaWYgKCF0aGlzLl9iZWhhdmlvcikgeyByZXR1cm47IH1cbiAgICBpZiAoISRpdGVtcy5sZW5ndGgpIHsgJGl0ZW1zID0gdGhpcy5fJGl0ZW1EYXRhTWFwLmtleXMoKTsgfVxuICAgIGlmIChBcnJheS5pc0FycmF5KCRpdGVtc1swXSkpIHsgJGl0ZW1zID0gJGl0ZW1zWzBdOyB9XG5cbiAgICBmb3IgKGxldCAkaXRlbSBvZiAkaXRlbXMpIHtcbiAgICAgIGNvbnN0IGRhdHVtID0gdGhpcy5fJGl0ZW1EYXRhTWFwLmdldCgkaXRlbSk7XG4gICAgICB0aGlzLl9iZWhhdmlvci51bnNlbGVjdCgkaXRlbSwgZGF0dW0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGUgaXRlbShzKSBzZWxlY3Rpb24gc3RhdGUgYWNjb3JkaW5nIHRvIHRoZWlyIGN1cnJlbnQgc3RhdGUuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudHxFbGVtZW50W119ICRpdGVtc1xuICAgKi9cbiAgdG9nZ2xlU2VsZWN0aW9uKC4uLiRpdGVtcykge1xuICAgIGlmICghdGhpcy5fYmVoYXZpb3IpIHsgcmV0dXJuOyB9XG4gICAgaWYgKCEkaXRlbXMubGVuZ3RoKSB7ICRpdGVtcyA9IHRoaXMuXyRpdGVtRGF0YU1hcC5rZXlzKCk7IH1cbiAgICBpZiAoQXJyYXkuaXNBcnJheSgkaXRlbXNbMF0pKSB7ICRpdGVtcyA9ICRpdGVtc1swXTsgfVxuXG4gICAgZm9yIChsZXQgJGl0ZW0gb2YgJGl0ZW1zKSB7XG4gICAgICBjb25zdCBkYXR1bSA9IHRoaXMuXyRpdGVtRGF0YU1hcC5nZXQoJGl0ZW0pO1xuICAgICAgdGhpcy5fYmVoYXZpb3IudG9nZ2xlU2VsZWN0aW9uKCRpdGVtLCBkYXR1bSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEVkaXQgaXRlbShzKSBhY2NvcmRpbmcgdG8gdGhlIGBlZGl0YCBkZWZpbmVkIGluIHRoZSByZWdpc3RlcmVkIGBCZWhhdmlvcmAuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudHxFbGVtZW50W119ICRpdGVtcyAtIFRoZSBpdGVtKHMpIHRvIGVkaXQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkeCAtIFRoZSBtb2RpZmljYXRpb24gdG8gYXBwbHkgaW4gdGhlIHggYXhpcyAoaW4gcGl4ZWxzKS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGR5IC0gVGhlIG1vZGlmaWNhdGlvbiB0byBhcHBseSBpbiB0aGUgeSBheGlzIChpbiBwaXhlbHMpLlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICR0YXJnZXQgLSBUaGUgdGFyZ2V0IG9mIHRoZSBpbnRlcmFjdGlvbiAoZm9yIGV4YW1wbGUsIGxlZnRcbiAgICogICAgaGFuZGxlciBET00gZWxlbWVudCBpbiBhIHNlZ21lbnQpLlxuICAgKi9cbiAgZWRpdCgkaXRlbXMsIGR4LCBkeSwgJHRhcmdldCkge1xuICAgIGlmICghdGhpcy5fYmVoYXZpb3IpIHsgcmV0dXJuOyB9XG4gICAgJGl0ZW1zID0gIUFycmF5LmlzQXJyYXkoJGl0ZW1zKSA/IFskaXRlbXNdIDogJGl0ZW1zO1xuXG4gICAgZm9yIChsZXQgJGl0ZW0gb2YgJGl0ZW1zKSB7XG4gICAgICBjb25zdCBzaGFwZSA9IHRoaXMuXyRpdGVtU2hhcGVNYXAuZ2V0KCRpdGVtKTtcbiAgICAgIGNvbnN0IGRhdHVtID0gdGhpcy5fJGl0ZW1EYXRhTWFwLmdldCgkaXRlbSk7XG5cbiAgICAgIHRoaXMuX2JlaGF2aW9yLmVkaXQodGhpcy5fcmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksICR0YXJnZXQpO1xuICAgICAgdGhpcy5lbWl0KCdlZGl0Jywgc2hhcGUsIGRhdHVtKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lcyBpZiB0aGUgYExheWVyYCwgYW5kIHRodXMgdGhlIGBMYXllclRpbWVDb250ZXh0YCBpcyBlZGl0YWJsZSBvciBub3QuXG4gICAqXG4gICAqIEBwYXJhbXMge0Jvb2xlYW59IFtib29sPXRydWVdXG4gICAqL1xuICBzZXRDb250ZXh0RWRpdGFibGUoYm9vbCA9IHRydWUpIHtcbiAgICBcbiAgICB0aGlzLl9pc0NvbnRleHRFZGl0YWJsZSA9IGJvb2w7XG4gICAgXG4gICAgaWYgKHRoaXMuJGludGVyYWN0aW9ucyA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5fYWRkSW50ZXJhY3Rpb25zRWxlbWVudHMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZGlzcGxheSA9IGJvb2wgPyAnYmxvY2snIDogJ25vbmUnO1xuICAgICAgdGhpcy4kaW50ZXJhY3Rpb25zLnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFZGl0IHRoZSBsYXllciBhbmQgdGh1cyBpdHMgcmVsYXRlZCBgTGF5ZXJUaW1lQ29udGV4dGAgYXR0cmlidXRlcy5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGR4IC0gVGhlIG1vZGlmaWNhdGlvbiB0byBhcHBseSBpbiB0aGUgeCBheGlzIChpbiBwaXhlbHMpLlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHkgLSBUaGUgbW9kaWZpY2F0aW9uIHRvIGFwcGx5IGluIHRoZSB5IGF4aXMgKGluIHBpeGVscykuXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJHRhcmdldCAtIFRoZSB0YXJnZXQgb2YgdGhlIGV2ZW50IG9mIHRoZSBpbnRlcmFjdGlvbi5cbiAgICovXG4gIGVkaXRDb250ZXh0KGR4LCBkeSwgJHRhcmdldCkge1xuICAgIHRpbWVDb250ZXh0QmVoYXZpb3IuZWRpdCh0aGlzLCBkeCwgZHksICR0YXJnZXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0cmV0Y2ggdGhlIGxheWVyIGFuZCB0aHVzIGl0cyByZWxhdGVkIGBMYXllclRpbWVDb250ZXh0YCBhdHRyaWJ1dGVzLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHggLSBUaGUgbW9kaWZpY2F0aW9uIHRvIGFwcGx5IGluIHRoZSB4IGF4aXMgKGluIHBpeGVscykuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkeSAtIFRoZSBtb2RpZmljYXRpb24gdG8gYXBwbHkgaW4gdGhlIHkgYXhpcyAoaW4gcGl4ZWxzKS5cbiAgICogQHBhcmFtIHtFbGVtZW50fSAkdGFyZ2V0IC0gVGhlIHRhcmdldCBvZiB0aGUgZXZlbnQgb2YgdGhlIGludGVyYWN0aW9uLlxuICAgKi9cbiAgc3RyZXRjaENvbnRleHQoZHgsIGR5LCAkdGFyZ2V0KSB7XG4gICAgdGltZUNvbnRleHRCZWhhdmlvci5zdHJldGNoKHRoaXMsIGR4LCBkeSwgJHRhcmdldCk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBIZWxwZXJzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gaXRlbSBmcm9tIGEgRE9NIGVsZW1lbnQgcmVsYXRlZCB0byB0aGUgc2hhcGUsIG51bGwgb3RoZXJ3aXNlLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRlbCAtIHRoZSBlbGVtZW50IHRvIGJlIHRlc3RlZFxuICAgKiBAcmV0dXJuIHtFbGVtZW50fG51bGx9XG4gICAqL1xuICBnZXRJdGVtRnJvbURPTUVsZW1lbnQoJGVsKSB7XG4gICAgbGV0ICRpdGVtO1xuXG4gICAgZG8ge1xuICAgICAgaWYgKCRlbC5jbGFzc0xpc3QgJiYgJGVsLmNsYXNzTGlzdC5jb250YWlucygnaXRlbScpKSB7XG4gICAgICAgICRpdGVtID0gJGVsO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgJGVsID0gJGVsLnBhcmVudE5vZGU7XG4gICAgfSB3aGlsZSAoJGVsICE9PSBudWxsKTtcblxuICAgIHJldHVybiB0aGlzLmhhc0l0ZW0oJGl0ZW0pID8gJGl0ZW0gOsKgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBkYXR1bSBhc3NvY2lhdGVkIHRvIGEgc3BlY2lmaWMgaXRlbS5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fSAkaXRlbVxuICAgKiBAcmV0dXJuIHtPYmplY3R8QXJyYXl8bnVsbH1cbiAgICovXG4gIGdldERhdHVtRnJvbUl0ZW0oJGl0ZW0pIHtcbiAgICBjb25zdCBkYXR1bSA9IHRoaXMuXyRpdGVtRGF0YU1hcC5nZXQoJGl0ZW0pO1xuICAgIHJldHVybiBkYXR1bSA/IGRhdHVtIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBkYXR1bSBhc3NvY2lhdGVkIHRvIGEgc3BlY2lmaWMgaXRlbSBmcm9tIGFueSBET00gZWxlbWVudFxuICAgKiBjb21wb3NpbmcgdGhlIHNoYXBlLiBCYXNpY2FsbHkgYSBzaG9ydGN1dCBmb3IgYGdldEl0ZW1Gcm9tRE9NRWxlbWVudGAgYW5kXG4gICAqIGBnZXREYXR1bUZyb21JdGVtYCBtZXRob2RzLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRlbFxuICAgKiBAcmV0dXJuIHtPYmplY3R8QXJyYXl8bnVsbH1cbiAgICovXG4gIGdldERhdHVtRnJvbURPTUVsZW1lbnQoJGVsKSB7XG4gICAgdmFyICRpdGVtID0gdGhpcy5nZXRJdGVtRnJvbURPTUVsZW1lbnQoJGVsKTtcbiAgICBpZiAoJGl0ZW0gPT09IG51bGwpIHsgcmV0dXJuIG51bGw7IH1cbiAgICByZXR1cm4gdGhpcy5nZXREYXR1bUZyb21JdGVtKCRpdGVtKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUZXN0cyBpZiB0aGUgZ2l2ZW4gRE9NIGVsZW1lbnQgaXMgYW4gaXRlbSBvZiB0aGUgbGF5ZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGl0ZW0gLSBUaGUgaXRlbSB0byBiZSB0ZXN0ZWQuXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuICBoYXNJdGVtKCRpdGVtKSB7XG4gICAgcmV0dXJuIHRoaXMuXyRpdGVtRGF0YU1hcC5oYXMoJGl0ZW0pO1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmluZXMgaWYgYSBnaXZlbiBlbGVtZW50IGJlbG9uZ3MgdG8gdGhlIGxheWVyLiBJcyBtb3JlIGdlbmVyYWwgdGhhblxuICAgKiBgaGFzSXRlbWAsIGNhbiBtb3N0bHkgdXNlZCB0byBjaGVjayBpbnRlcmFjdGlvbnMgZWxlbWVudHMuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGVsIC0gVGhlIERPTSBlbGVtZW50IHRvIGJlIHRlc3RlZC5cbiAgICogQHJldHVybiB7Ym9vbH1cbiAgICovXG4gIGhhc0VsZW1lbnQoJGVsKSB7XG4gICAgZG8ge1xuICAgICAgaWYgKCRlbCA9PT0gdGhpcy4kZWwpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgICRlbCA9ICRlbC5wYXJlbnROb2RlO1xuICAgIH0gd2hpbGUgKCRlbCAhPT0gbnVsbCk7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgYWxsIHRoZSBpdGVtcyBpbiBhIGdpdmVuIGFyZWEgYXMgZGVmaW5lZCBpbiB0aGUgcmVnaXN0ZXJlZCBgU2hhcGV+aW5BcmVhYCBtZXRob2QuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhcmVhIC0gVGhlIGFyZWEgKGluIHZpZXdwb3J0IGNvb3JkaW5hdGUgc3BhY2UpIGluIHdoaWNoIHRvIGZpbmQgdGhlIGVsZW1lbnRzXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBhcmVhLnRvcFxuICAgKiBAcGFyYW0ge051bWJlcn0gYXJlYS5sZWZ0XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBhcmVhLndpZHRoXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBhcmVhLmhlaWdodFxuICAgKiBAcmV0dXJuIHtBcnJheX0gLSBsaXN0IG9mIHRoZSBpdGVtcyBwcmVzZW50cyBpbiB0aGUgYXJlYVxuICAgKi9cbiAgZ2V0SXRlbXNJbkFyZWEoYXJlYSkge1xuXG4gICAgbGV0IHgxID0gYXJlYS5sZWZ0O1xuICAgIGxldCB4MiA9IGFyZWEubGVmdCArIGFyZWEud2lkdGg7XG5cbiAgICAvLyBrZWVwIGNvbnNpc3RlbnQgd2l0aCBjb250ZXh0IHkgY29vcmRpbmF0ZXMgc3lzdGVtXG4gICAgbGV0IHkxID0gdGhpcy5wYXJhbXMuaGVpZ2h0IC0gKGFyZWEudG9wICsgYXJlYS5oZWlnaHQpO1xuICAgIGxldCB5MiA9IHRoaXMucGFyYW1zLmhlaWdodCAtIGFyZWEudG9wO1xuXG4gICAgeTEgKz0gdGhpcy5wYXJhbXMudG9wO1xuICAgIHkyICs9IHRoaXMucGFyYW1zLnRvcDtcblxuICAgIGNvbnN0ICRmaWx0ZXJlZEl0ZW1zID0gW107XG5cbiAgICBmb3IgKGxldCBbJGl0ZW0sIGRhdHVtXSBvZiB0aGlzLl8kaXRlbURhdGFNYXAuZW50cmllcygpKSB7XG4gICAgICBjb25zdCBzaGFwZSA9IHRoaXMuXyRpdGVtU2hhcGVNYXAuZ2V0KCRpdGVtKTtcbiAgICAgIGNvbnN0IGluQXJlYSA9IHNoYXBlLmluQXJlYSh0aGlzLl9yZW5kZXJpbmdDb250ZXh0LCBkYXR1bSwgeDEsIHkxLCB4MiwgeTIpO1xuXG4gICAgICBpZiAoaW5BcmVhKSB7ICRmaWx0ZXJlZEl0ZW1zLnB1c2goJGl0ZW0pOyB9XG4gICAgfVxuXG4gICAgcmV0dXJuICRmaWx0ZXJlZEl0ZW1zO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUmVuZGVyaW5nIC8gRGlzcGxheSBtZXRob2RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIE1vdmVzIGFuIGl0ZW0gdG8gdGhlIGVuZCBvZiB0aGUgbGF5ZXIgdG8gZGlzcGxheSBpdCBmcm9udCBvZiBpdHNcbiAgICogc2libGluZ3MgKHN2ZyB6LWluZGV4Li4uKS5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fSAkaXRlbSAtIFRoZSBpdGVtIHRvIGJlIG1vdmVkLlxuICAgKi9cbiAgX3RvRnJvbnQoJGl0ZW0pIHtcbiAgICB0aGlzLiRtYWluZ3JvdXAuYXBwZW5kQ2hpbGQoJGl0ZW0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSB0aGUgRE9NIHN0cnVjdHVyZSBvZiB0aGUgc2hhcGVzIGFjY29yZGluZyB0byB0aGUgZ2l2ZW4gZGF0YS4gSW5zcGlyZWRcbiAgICogZnJvbSB0aGUgYGVudGVyYCBhbmQgYGV4aXRgIGQzLmpzIHBhcmFkaWdtLCB0aGlzIG1ldGhvZCBzaG91bGQgYmUgY2FsbGVkXG4gICAqIGVhY2ggdGltZSBhIGRhdHVtIGlzIGFkZGVkIG9yIHJlbW92ZWQgZnJvbSB0aGUgZGF0YS4gV2hpbGUgdGhlIERPTSBpc1xuICAgKiBjcmVhdGVkIHRoZSBgdXBkYXRlYCBtZXRob2QgbXVzdCBiZSBjYWxsZWQgaW4gb3JkZXIgdG8gdXBkYXRlIHRoZSBzaGFwZXNcbiAgICogYXR0cmlidXRlcyBhbmQgdGh1cyBwbGFjZSB0aGVtIHdoZXJlIHRoZXkgc2hvdWxkLlxuICAgKi9cbiAgcmVuZGVyKCkge1xuXG4gICAgY29uc3QgYmVmb3JlID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgXG4gICAgLy8gcmVuZGVyIGBjb21tb25TaGFwZWAgb25seSBvbmNlXG4gICAgaWYgKFxuICAgICAgdGhpcy5fY29tbW9uU2hhcGVDb25maWd1cmF0aW9uICE9PSBudWxsICYmXG4gICAgICB0aGlzLl8kaXRlbUNvbW1vblNoYXBlTWFwLnNpemUgPT09IDBcbiAgICApIHtcbiAgICAgIGNvbnN0IHsgY3RvciwgYWNjZXNzb3JzLCBvcHRpb25zIH0gPSB0aGlzLl9jb21tb25TaGFwZUNvbmZpZ3VyYXRpb247XG4gICAgICBjb25zdCAkZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgICBjb25zdCBzaGFwZSA9IG5ldyBjdG9yKG9wdGlvbnMpO1xuXG4gICAgICBzaGFwZS5pbnN0YWxsKGFjY2Vzc29ycyk7XG4gICAgICAkZ3JvdXAuYXBwZW5kQ2hpbGQoc2hhcGUucmVuZGVyKCkpO1xuICAgICAgJGdyb3VwLmNsYXNzTGlzdC5hZGQoJ2l0ZW0nLCAnY29tbW9uJywgc2hhcGUuZ2V0Q2xhc3NOYW1lKCkpO1xuXG4gICAgICB0aGlzLl8kaXRlbUNvbW1vblNoYXBlTWFwLnNldCgkZ3JvdXAsIHNoYXBlKTtcbiAgICAgIHRoaXMuJG1haW5ncm91cC5hcHBlbmRDaGlsZCgkZ3JvdXApO1xuICAgIH1cblxuICAgIC8vIGFwcGVuZCBlbGVtZW50cyBhbGwgYXQgb25jZVxuICAgIGNvbnN0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMuXyRpdGVtRGF0YU1hcC52YWx1ZXMoKTsgLy8gaXRlcmF0b3JcblxuICAgIC8vIGVudGVyXG4gICAgaWYgKHRoaXMuX3NoYXBlQ29uZmlndXJhdGlvbiAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5kYXRhLmZvckVhY2goKGRhdHVtKSA9PiB7XG4gICAgICAgIGZvciAobGV0IHZhbHVlIG9mIHZhbHVlcykgeyBpZiAodmFsdWUgPT09IGRhdHVtKSB7IHJldHVybjsgfSB9XG5cbiAgICAgICAgY29uc3QgeyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfSA9IHRoaXMuX3NoYXBlQ29uZmlndXJhdGlvbjtcbiAgICAgICAgY29uc3Qgc2hhcGUgPSBuZXcgY3RvcihvcHRpb25zKTtcbiAgICAgICAgc2hhcGUuaW5zdGFsbChhY2Nlc3NvcnMpO1xuXG4gICAgICAgIGNvbnN0ICRlbCA9IHNoYXBlLnJlbmRlcih0aGlzLl9yZW5kZXJpbmdDb250ZXh0KTtcbiAgICAgICAgJGVsLmNsYXNzTGlzdC5hZGQoJ2l0ZW0nLCBzaGFwZS5nZXRDbGFzc05hbWUoKSk7XG5cbiAgICAgICAgdGhpcy5fJGl0ZW1TaGFwZU1hcC5zZXQoJGVsLCBzaGFwZSk7XG4gICAgICAgIHRoaXMuXyRpdGVtRGF0YU1hcC5zZXQoJGVsLCBkYXR1bSk7XG5cbiAgICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoJGVsKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLiRtYWluZ3JvdXAuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xuICAgIH1cblxuICAgIC8vIHJlbW92ZVxuICAgIGZvciAobGV0IFskaXRlbSwgZGF0dW1dIG9mIHRoaXMuXyRpdGVtRGF0YU1hcC5lbnRyaWVzKCkpIHtcbiAgICAgIGlmICh0aGlzLmRhdGEuaW5kZXhPZihkYXR1bSkgIT09IC0xKSB7IGNvbnRpbnVlOyB9XG5cbiAgICAgIGNvbnN0IHNoYXBlID0gdGhpcy5fJGl0ZW1TaGFwZU1hcC5nZXQoJGl0ZW0pO1xuXG4gICAgICB0aGlzLiRtYWluZ3JvdXAucmVtb3ZlQ2hpbGQoJGl0ZW0pO1xuICAgICAgc2hhcGUuZGVzdHJveSgpO1xuICAgICAgLy8gYSByZW1vdmVkIGl0ZW0gY2Fubm90IGJlIHNlbGVjdGVkXG4gICAgICBpZiAodGhpcy5fYmVoYXZpb3IpIHtcbiAgICAgICAgdGhpcy5fYmVoYXZpb3IudW5zZWxlY3QoJGl0ZW0sIGRhdHVtKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fJGl0ZW1EYXRhTWFwLmRlbGV0ZSgkaXRlbSk7XG4gICAgICB0aGlzLl8kaXRlbVNoYXBlTWFwLmRlbGV0ZSgkaXRlbSk7XG4gICAgfVxuXG4gICAgY29uc3QgYWZ0ZXIgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICBjb25zb2xlLmxvZyhcImxheWVyIHJlbmRlciB0aW1lID0gXCIgKyBNYXRoLnJvdW5kKGFmdGVyIC0gYmVmb3JlKSk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgY29udGFpbmVyIG9mIHRoZSBsYXllciBhbmQgdGhlIGF0dHJpYnV0ZXMgb2YgdGhlIGV4aXN0aW5nIHNoYXBlcy5cbiAgICovXG4gIHVwZGF0ZSgpIHtcbiAgICB0aGlzLl91cGRhdGVDb250YWluZXIoKTtcbiAgICB0aGlzLl91cGRhdGVTaGFwZXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBjb250YWluZXIgb2YgdGhlIGxheWVyLlxuICAgKi9cbiAgX3VwZGF0ZUNvbnRhaW5lcigpIHtcbiAgICB0aGlzLl91cGRhdGVSZW5kZXJpbmdDb250ZXh0KCk7XG5cbiAgICBjb25zdCB0aW1lQ29udGV4dCA9IHRoaXMudGltZUNvbnRleHQ7XG5cbiAgICBsZXQgd2lkdGggPSB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMudGltZUNvbnRleHQuZHVyYXRpb24pO1xuICAgIGlmICh3aWR0aCA+IHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudmlzaWJsZVdpZHRoKSB7XG4gICAgICB3aWR0aCA9IHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudmlzaWJsZVdpZHRoO1xuICAgIH1cbiAgICBcbiAgICBjb25zdCB0b3AgPSB0aGlzLnBhcmFtcy50b3A7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuICAgIFxuICAgIC8vIG1hdHJpeCB0byBpbnZlcnQgdGhlIGNvb3JkaW5hdGUgc3lzdGVtXG4gICAgY29uc3QgdHJhbnNsYXRlTWF0cml4ID0gYG1hdHJpeCgxLCAwLCAwLCAtMSwgMCwgJHt0b3AgKyBoZWlnaHR9KWA7XG5cbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgdHJhbnNsYXRlTWF0cml4KTtcblxuICAgIHRoaXMuJGJvdW5kaW5nQm94LnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHdpZHRoKTtcbiAgICB0aGlzLiRib3VuZGluZ0JveC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgaGVpZ2h0KTtcbiAgICB0aGlzLiRib3VuZGluZ0JveC5zdHlsZS5vcGFjaXR5ID0gdGhpcy5wYXJhbXMub3BhY2l0eTtcblxuICAgIGlmICh0aGlzLmNvbnRleHRTaGFwZSAhPT0gbnVsbCkge1xuICAgICAgLy8gbWFpbnRhaW4gY29udGV4dCBzaGFwZVxuICAgICAgdGhpcy5jb250ZXh0U2hhcGUudXBkYXRlKHRoaXMuX3JlbmRlcmluZ0NvbnRleHQsIHRoaXMudGltZUNvbnRleHQsIDApO1xuICAgIH1cbiAgfVxuXG4gIF9lbmNhY2hlRW50aXR5KCkge1xuXG4gICAgaWYgKHRoaXMuZGF0YVR5cGUgIT09ICdlbnRpdHknKSByZXR1cm47XG4gICAgaWYgKHRoaXMuX2NhY2hlZCkgcmV0dXJuO1xuICAgIGlmICh0aGlzLl9kYXRhID09PSBbXSkgcmV0dXJuO1xuICAgIFxuICAgIGxldCBvcmlnRGF0YSA9IHRoaXMuX2RhdGFbMF07XG5cbiAgICBmb3IgKGxldCBbJGl0ZW0sIGRhdHVtXSBvZiB0aGlzLl8kaXRlbURhdGFNYXAuZW50cmllcygpKSB7XG4gICAgICBpZiAoZGF0dW0gPT09IG9yaWdEYXRhKSB7XG4gICAgICAgIGNvbnN0IHNoYXBlID0gdGhpcy5fJGl0ZW1TaGFwZU1hcC5nZXQoJGl0ZW0pO1xuICAgICAgICBjb25zdCBjYWNoZSA9IHNoYXBlLmVuY2FjaGUoZGF0dW0pO1xuXHRpZiAoY2FjaGUpIHtcblx0ICB0aGlzLl8kaXRlbURhdGFNYXAuc2V0KCRpdGVtLCBjYWNoZSk7XG4gICAgICAgICAgaWYgKHR5cGVvZihvcmlnRGF0YS5kaXNwb3NlKSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIG9yaWdEYXRhLmRpc3Bvc2UoKTtcbiAgICAgICAgICB9XG5cdCAgdGhpcy5kYXRhID0gY2FjaGU7XG5cdH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9jYWNoZWQgPSB0cnVlO1xuICB9XG4gIFxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgYXR0cmlidXRlcyBvZiBhbGwgdGhlIGBTaGFwZWAgaW5zdGFuY2VzIHJlbmRlcmVkIGludG8gdGhlIGxheWVyLlxuICAgKi9cbiAgX3VwZGF0ZVNoYXBlcygpIHtcblxuICAgIGNvbnN0IGJlZm9yZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIFxuICAgIHRoaXMuX3VwZGF0ZVJlbmRlcmluZ0NvbnRleHQoKTtcblxuICAgIHRoaXMuX2VuY2FjaGVFbnRpdHkoKTtcbiAgICBcbiAgICAvLyBVcGRhdGUgY29tbW9uIHNoYXBlLCBpZiBhbnlcbiAgICB0aGlzLl8kaXRlbUNvbW1vblNoYXBlTWFwLmZvckVhY2goKHNoYXBlLCAkaXRlbSkgPT4ge1xuICAgICAgc2hhcGUudXBkYXRlKHRoaXMuX3JlbmRlcmluZ0NvbnRleHQsIHRoaXMuZGF0YSk7XG4gICAgfSk7XG5cbiAgICAvLyBVcGRhdGUgc3BlY2lmaWMgc2hhcGVzXG4gICAgZm9yIChsZXQgWyRpdGVtLCBkYXR1bV0gb2YgdGhpcy5fJGl0ZW1EYXRhTWFwLmVudHJpZXMoKSkge1xuICAgICAgY29uc3Qgc2hhcGUgPSB0aGlzLl8kaXRlbVNoYXBlTWFwLmdldCgkaXRlbSk7XG4gICAgICBzaGFwZS51cGRhdGUodGhpcy5fcmVuZGVyaW5nQ29udGV4dCwgZGF0dW0pO1xuICAgIH1cblxuICAgIGNvbnN0IGFmdGVyID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgY29uc29sZS5sb2coXCJsYXllciB1cGRhdGUgdGltZSA9IFwiICsgTWF0aC5yb3VuZChhZnRlciAtIGJlZm9yZSkpO1xuICB9XG5cbiAgZGVzY3JpYmUoeCkge1xuICAgIGZvciAobGV0IFskaXRlbSwgZGF0dW1dIG9mIHRoaXMuXyRpdGVtRGF0YU1hcC5lbnRyaWVzKCkpIHtcbiAgICAgIGNvbnN0IHNoYXBlID0gdGhpcy5fJGl0ZW1TaGFwZU1hcC5nZXQoJGl0ZW0pO1xuICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSBzaGFwZS5kZXNjcmliZShkYXR1bSwgeCAtIHRoaXMuc3RhcnQpO1xuICAgICAgaWYgKGRlc2NyaXB0aW9uICE9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBkZXNjcmlwdGlvbjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==