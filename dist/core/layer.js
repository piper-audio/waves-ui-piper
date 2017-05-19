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
      overflow: 'hidden', // usefull ?
      describer: null
    };

    /**
     * Parameters of the layers, `defaults` overrided with options.
     * @type {Object}
     */
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
      var before = performance.now();

      if (typeof this.describer !== 'undefined' && this.describer !== null) {
        return this.describer(x - this.start);
      }

      var description = null;
      var n = 0;
      var _iteratorNormalCompletion10 = true;
      var _didIteratorError10 = false;
      var _iteratorError10 = undefined;

      try {
        for (var _iterator10 = _getIterator(this._$itemDataMap.entries()), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
          var _step10$value = _slicedToArray(_step10.value, 2);

          var $item = _step10$value[0];
          var datum = _step10$value[1];

          var shape = this._$itemShapeMap.get($item);
          description = shape.describe(datum, x - this.start);
          n++;
          if (description !== null && description.length > 0) {
            break;
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

      console.log("layer describe: inspected " + n + " of " + this._$itemDataMap.size + " shape(s)");
      var after = performance.now();
      console.log("layer describe time = " + Math.round(after - before));
      return description;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFHLEtBQUssQ0FBQztLQUN0Qjs7O1NBZ0xnQixlQUFHO0FBQ2xCLGFBQU8sSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7S0FDM0Q7OztXQXhWa0Msc0NBQUMsSUFBSSxFQUFFO0FBQ3hDLDZCQUF1QixHQUFHLElBQUksQ0FBQztLQUNoQzs7O1NBeEhrQixLQUFLO0dBQVMsb0JBQU8sWUFBWTs7cUJBQWpDLEtBQUsiLCJmaWxlIjoic3JjL2NvcmUvbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZXZlbnRzIGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgbnMgZnJvbSAnLi9uYW1lc3BhY2UnO1xuaW1wb3J0IHNjYWxlcyBmcm9tICcuLi91dGlscy9zY2FsZXMnO1xuaW1wb3J0IFNlZ21lbnQgZnJvbSAnLi4vc2hhcGVzL3NlZ21lbnQnO1xuaW1wb3J0IFRpbWVDb250ZXh0QmVoYXZpb3IgZnJvbSAnLi4vYmVoYXZpb3JzL3RpbWUtY29udGV4dC1iZWhhdmlvcic7XG5cbi8vIHRpbWUgY29udGV4dCBiYWhldmlvclxubGV0IHRpbWVDb250ZXh0QmVoYXZpb3IgPSBudWxsO1xubGV0IHRpbWVDb250ZXh0QmVoYXZpb3JDdG9yID0gVGltZUNvbnRleHRCZWhhdmlvcjtcblxuLyoqXG4gKiBUaGUgbGF5ZXIgY2xhc3MgaXMgdGhlIG1haW4gdmlzdWFsaXphdGlvbiBjbGFzcy4gSXQgaXMgbWFpbmx5IGRlZmluZXMgYnkgaXRzXG4gKiByZWxhdGVkIGBMYXllclRpbWVDb250ZXh0YCB3aGljaCBkZXRlcm1pbmVzIGl0cyBwb3NpdGlvbiBpbiB0aGUgb3ZlcmFsbFxuICogdGltZWxpbmUgKHRocm91Z2ggdGhlIGBzdGFydGAsIGBkdXJhdGlvbmAsIGBvZmZzZXRgIGFuZCBgc3RyZXRjaFJhdGlvYFxuICogYXR0cmlidXRlcykgYW5kIGJ5IGl0J3MgcmVnaXN0ZXJlZCBTaGFwZSB3aGljaCBkZWZpbmVzIGhvdyB0byBkaXNwbGF5IHRoZVxuICogZGF0YSBhc3NvY2lhdGVkIHRvIHRoZSBsYXllci4gRWFjaCBjcmVhdGVkIGxheWVyIG11c3QgYmUgaW5zZXJ0ZWQgaW50byBhXG4gKiBgVHJhY2tgIGluc3RhbmNlIGluIG9yZGVyIHRvIGJlIGRpc3BsYXllZC5cbiAqXG4gKiBfTm90ZTogaW4gdGhlIGNvbnRleHQgb2YgdGhlIGxheWVyLCBhbiBfX2l0ZW1fXyBpcyB0aGUgU1ZHIGVsZW1lbnRcbiAqIHJldHVybmVkIGJ5IGEgYFNoYXBlYCBpbnN0YW5jZSBhbmQgYXNzb2NpYXRlZCB3aXRoIGEgcGFydGljdWxhciBfX2RhdHVtX18uX1xuICpcbiAqICMjIyBMYXllciBET00gc3RydWN0dXJlXG4gKiBgYGBcbiAqIDxnIGNsYXNzPVwibGF5ZXJcIiB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoJHtzdGFydH0sIDApXCI+XG4gKiAgIDxzdmcgY2xhc3M9XCJib3VuZGluZy1ib3hcIiB3aWR0aD1cIiR7ZHVyYXRpb259XCI+XG4gKiAgICAgPGcgY2xhc3M9XCJtYWluZ3JvdXBcIj5cbiAqICAgICAgIDwhLS0gYmFja2dyb3VuZCAtLT5cbiAqICAgICAgIDxyZWN0IGNsYXNzPVwiYmFja2dyb3VuZFwiPjwvcmVjdD5cbiAqICAgICAgIDwhLS0gc2hhcGVzIGFuZCBjb21tb24gc2hhcGVzIGFyZSBpbnNlcnRlZCBoZXJlIC0tPlxuICogICAgIDwvZz5cbiAqICAgICA8ZyBjbGFzcz1cImludGVyYWN0aW9uc1wiPjwhLS0gZm9yIGZlZWRiYWNrIC0tPjwvZz5cbiAqICAgPC9zdmc+XG4gKiA8L2c+XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGF5ZXIgZXh0ZW5kcyBldmVudHMuRXZlbnRFbWl0dGVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhVHlwZSAtIERlZmluZXMgaG93IHRoZSBsYXllciBzaG91bGQgbG9vayBhdCB0aGUgZGF0YS5cbiAgICogICAgQ2FuIGJlICdlbnRpdHknIG9yICdjb2xsZWN0aW9uJy5cbiAgICogQHBhcmFtIHsoQXJyYXl8T2JqZWN0KX0gZGF0YSAtIFRoZSBkYXRhIGFzc29jaWF0ZWQgdG8gdGhlIGxheWVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIENvbmZpZ3VyZXMgdGhlIGxheWVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuaGVpZ2h0PTEwMF0gLSBEZWZpbmVzIHRoZSBoZWlnaHQgb2YgdGhlIGxheWVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMudG9wPTBdIC0gRGVmaW5lcyB0aGUgdG9wIHBvc2l0aW9uIG9mIHRoZSBsYXllci5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLm9wYWNpdHk9MV0gLSBEZWZpbmVzIHRoZSBvcGFjaXR5IG9mIHRoZSBsYXllci5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnlEb21haW49WzAsMV1dIC0gRGVmaW5lcyBib3VuZGFyaWVzIG9mIHRoZSBkYXRhXG4gICAqICAgIHZhbHVlcyBpbiB5IGF4aXMgKGZvciBleGVtcGxlIHRvIGRpc3BsYXkgYW4gYXVkaW8gYnVmZmVyLCB0aGlzIGF0dHJpYnV0ZVxuICAgKiAgICBzaG91bGQgYmUgc2V0IHRvIFstMSwgMV0uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jbGFzc05hbWU9bnVsbF0gLSBBbiBvcHRpb25uYWwgY2xhc3MgdG8gYWRkIHRvIGVhY2hcbiAgICogICAgY3JlYXRlZCBzaGFwZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNsYXNzTmFtZT0nc2VsZWN0ZWQnXSAtIFRoZSBjbGFzcyB0byBhZGQgdG8gYSBzaGFwZVxuICAgKiAgICB3aGVuIHNlbGVjdGVkLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuY29udGV4dEhhbmRsZXJXaWR0aD0yXSAtIFRoZSB3aWR0aCBvZiB0aGUgaGFuZGxlcnNcbiAgICogICAgZGlzcGxheWVkIHRvIGVkaXQgdGhlIGxheWVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuaGl0dGFibGU9ZmFsc2VdIC0gRGVmaW5lcyBpZiB0aGUgbGF5ZXIgY2FuIGJlIGludGVyYWN0ZWRcbiAgICogICAgd2l0aC4gQmFzaWNhbGx5LCB0aGUgbGF5ZXIgaXMgbm90IHJldHVybmVkIGJ5IGBCYXNlU3RhdGUuZ2V0SGl0TGF5ZXJzYCB3aGVuXG4gICAqICAgIHNldCB0byBmYWxzZSAoYSBjb21tb24gdXNlIGNhc2UgaXMgYSBsYXllciB0aGF0IGNvbnRhaW5zIGEgY3Vyc29yKVxuICAgKi9cbiAgY29uc3RydWN0b3IoZGF0YVR5cGUsIGRhdGEsIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKCk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGhlaWdodDogMTAwLFxuICAgICAgdG9wOiAwLFxuICAgICAgb3BhY2l0eTogMSxcbiAgICAgIHlEb21haW46IFswLCAxXSxcbiAgICAgIGNsYXNzTmFtZTogbnVsbCxcbiAgICAgIHNlbGVjdGVkQ2xhc3NOYW1lOiAnc2VsZWN0ZWQnLFxuICAgICAgY29udGV4dEhhbmRsZXJXaWR0aDogMixcbiAgICAgIGhpdHRhYmxlOiB0cnVlLCAvLyB3aGVuIGZhbHNlIHRoZSBsYXllciBpcyBub3QgcmV0dXJuZWQgYnkgYEJhc2VTdGF0ZS5nZXRIaXRMYXllcnNgXG4gICAgICBpZDogJycsIC8vIHVzZWQgP1xuICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLCAvLyB1c2VmdWxsID9cbiAgICAgIGRlc2NyaWJlcjogbnVsbFxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBQYXJhbWV0ZXJzIG9mIHRoZSBsYXllcnMsIGBkZWZhdWx0c2Agb3ZlcnJpZGVkIHdpdGggb3B0aW9ucy5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMucGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgIC8qKlxuICAgICAqIERlZmluZXMgaG93IHRoZSBsYXllciBzaG91bGQgbG9vayBhdCB0aGUgZGF0YSAoYCdlbnRpdHknYCBvciBgJ2NvbGxlY3Rpb24nYCkuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLmRhdGFUeXBlID0gZGF0YVR5cGU7IC8vICdlbnRpdHknIHx8ICdjb2xsZWN0aW9uJztcbiAgICAvKiogQHR5cGUge0xheWVyVGltZUNvbnRleHR9ICovXG4gICAgdGhpcy50aW1lQ29udGV4dCA9IG51bGw7XG4gICAgLyoqIEB0eXBlIHtFbGVtZW50fSAqL1xuICAgIHRoaXMuJGVsID0gbnVsbDtcbiAgICAvKiogQHR5cGUge0VsZW1lbnR9ICovXG4gICAgdGhpcy4kYmFja2dyb3VuZCA9IG51bGw7XG4gICAgLyoqIEB0eXBlIHtFbGVtZW50fSAqL1xuICAgIHRoaXMuJGJvdW5kaW5nQm94ID0gbnVsbDtcbiAgICAvKiogQHR5cGUge0VsZW1lbnR9ICovXG4gICAgdGhpcy4kbWFpbmdyb3VwID0gbnVsbDtcbiAgICAvKiogQHR5cGUge0VsZW1lbnR9ICovXG4gICAgdGhpcy4kaW50ZXJhY3Rpb25zID0gbnVsbDtcbiAgICAvKipcbiAgICAgKiBBIFNlZ21lbnQgaW5zdGFuY2lhdGVkIHRvIGludGVyYWN0IHdpdGggdGhlIExheWVyIGl0c2VsZi5cbiAgICAgKiBAdHlwZSB7U2VnbWVudH1cbiAgICAgKi9cbiAgICB0aGlzLmNvbnRleHRTaGFwZSA9IG51bGw7XG5cbiAgICB0aGlzLl9zaGFwZUNvbmZpZ3VyYXRpb24gPSBudWxsOyAgICAgICAvLyB7IGN0b3IsIGFjY2Vzc29ycywgb3B0aW9ucyB9XG4gICAgdGhpcy5fY29tbW9uU2hhcGVDb25maWd1cmF0aW9uID0gbnVsbDsgLy8geyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfVxuICAgIHRoaXMuXyRpdGVtU2hhcGVNYXAgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5fJGl0ZW1EYXRhTWFwID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuXyRpdGVtQ29tbW9uU2hhcGVNYXAgPSBuZXcgTWFwKCk7XG5cbiAgICB0aGlzLl9pc0NvbnRleHRFZGl0YWJsZSA9IGZhbHNlO1xuICAgIHRoaXMuX2JlaGF2aW9yID0gbnVsbDtcblxuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG5cbiAgICB0aGlzLl92YWx1ZVRvUGl4ZWwgPSBzY2FsZXMubGluZWFyKClcbiAgICAgIC5kb21haW4odGhpcy5wYXJhbXMueURvbWFpbilcbiAgICAgIC5yYW5nZShbMCwgdGhpcy5wYXJhbXMuaGVpZ2h0XSk7XG5cbiAgICAvLyBpbml0aWFsaXplIHRpbWVDb250ZXh0IGxheW91dFxuICAgIHRoaXMuX3JlbmRlckNvbnRhaW5lcigpO1xuICAgIC8vIGNyZWF0ZXMgdGhlIHRpbWVDb250ZXh0QmVoYXZpb3IgZm9yIGFsbCBsYXllcnNcbiAgICBpZiAodGltZUNvbnRleHRCZWhhdmlvciA9PT0gbnVsbCkge1xuICAgICAgdGltZUNvbnRleHRCZWhhdmlvciA9IG5ldyB0aW1lQ29udGV4dEJlaGF2aW9yQ3RvcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95IHRoZSBsYXllciwgY2xlYXIgYWxsIHJlZmVyZW5jZXMuXG4gICAqL1xuICBkZXN0cm95KCkge1xuXG4gICAgaWYgKHRoaXMuZGF0YVR5cGUgPT0gJ2VudGl0eScpIHtcbiAgICAgIGlmICh0eXBlb2YodGhpcy5kYXRhLmRpc3Bvc2UpICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aGlzLmRhdGEuZGlzcG9zZSgpO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICB0aGlzLnRpbWVDb250ZXh0ID0gbnVsbDtcbiAgICB0aGlzLmRhdGEgPSBudWxsO1xuICAgIHRoaXMucGFyYW1zID0gbnVsbDtcbiAgICB0aGlzLl9iZWhhdmlvciA9IG51bGw7XG5cbiAgICB0aGlzLl8kaXRlbVNoYXBlTWFwLmNsZWFyKCk7XG4gICAgdGhpcy5fJGl0ZW1EYXRhTWFwLmNsZWFyKCk7XG4gICAgdGhpcy5fJGl0ZW1Db21tb25TaGFwZU1hcC5jbGVhcigpO1xuXG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbGxvd3MgdG8gb3ZlcnJpZGUgZGVmYXVsdCB0aGUgYFRpbWVDb250ZXh0QmVoYXZpb3JgIHVzZWQgdG8gZWRpdCB0aGUgbGF5ZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjdG9yXG4gICAqL1xuICBzdGF0aWMgY29uZmlndXJlVGltZUNvbnRleHRCZWhhdmlvcihjdG9yKSB7XG4gICAgdGltZUNvbnRleHRCZWhhdmlvckN0b3IgPSBjdG9yO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYExheWVyVGltZUNvbnRleHRgJ3MgYHN0YXJ0YCB0aW1lIGRvbWFpbiB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBzdGFydCgpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC5zdGFydDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGBMYXllclRpbWVDb250ZXh0YCdzIGBzdGFydGAgdGltZSBkb21haW4gdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBzZXQgc3RhcnQodmFsdWUpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0LnN0YXJ0ID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgTGF5ZXJUaW1lQ29udGV4dGAncyBgb2Zmc2V0YCB0aW1lIGRvbWFpbiB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBvZmZzZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQub2Zmc2V0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYExheWVyVGltZUNvbnRleHRgJ3MgYG9mZnNldGAgdGltZSBkb21haW4gdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBzZXQgb2Zmc2V0KHZhbHVlKSB7XG4gICAgdGhpcy50aW1lQ29udGV4dC5vZmZzZXQgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGBMYXllclRpbWVDb250ZXh0YCdzIGBkdXJhdGlvbmAgdGltZSBkb21haW4gdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgZHVyYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQuZHVyYXRpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBgTGF5ZXJUaW1lQ29udGV4dGAncyBgZHVyYXRpb25gIHRpbWUgZG9tYWluIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgc2V0IGR1cmF0aW9uKHZhbHVlKSB7XG4gICAgdGhpcy50aW1lQ29udGV4dC5kdXJhdGlvbiA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYExheWVyVGltZUNvbnRleHRgJ3MgYHN0cmV0Y2hSYXRpb2AgdGltZSBkb21haW4gdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgc3RyZXRjaFJhdGlvKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0LnN0cmV0Y2hSYXRpbztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGBMYXllclRpbWVDb250ZXh0YCdzIGBzdHJldGNoUmF0aW9gIHRpbWUgZG9tYWluIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgc2V0IHN0cmV0Y2hSYXRpbyh2YWx1ZSkge1xuICAgIHRoaXMudGltZUNvbnRleHQuc3RyZXRjaFJhdGlvID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBkb21haW4gYm91bmRhcmllcyBvZiB0aGUgZGF0YSBmb3IgdGhlIHkgYXhpcy5cbiAgICpcbiAgICogQHR5cGUge0FycmF5fVxuICAgKi9cbiAgc2V0IHlEb21haW4oZG9tYWluKSB7XG4gICAgdGhpcy5wYXJhbXMueURvbWFpbiA9IGRvbWFpbjtcbiAgICB0aGlzLl92YWx1ZVRvUGl4ZWwuZG9tYWluKGRvbWFpbik7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZG9tYWluIGJvdW5kYXJpZXMgb2YgdGhlIGRhdGEgZm9yIHRoZSB5IGF4aXMuXG4gICAqXG4gICAqIEB0eXBlIHtBcnJheX1cbiAgICovXG4gIGdldCB5RG9tYWluKCkge1xuICAgIHJldHVybiB0aGlzLnBhcmFtcy55RG9tYWluO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIG9wYWNpdHkgb2YgdGhlIHdob2xlIGxheWVyLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgc2V0IG9wYWNpdHkodmFsdWUpIHtcbiAgICB0aGlzLnBhcmFtcy5vcGFjaXR5ID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgb3BhY2l0eSBvZiB0aGUgd2hvbGUgbGF5ZXIuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgb3BhY2l0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJhbXMub3BhY2l0eTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0cmFuc2ZlcnQgZnVuY3Rpb24gdXNlZCB0byBkaXNwbGF5IHRoZSBkYXRhIGluIHRoZSB4IGF4aXMuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgdGltZVRvUGl4ZWwoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQudGltZVRvUGl4ZWw7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdHJhbnNmZXJ0IGZ1bmN0aW9uIHVzZWQgdG8gZGlzcGxheSB0aGUgZGF0YSBpbiB0aGUgeSBheGlzLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IHZhbHVlVG9QaXhlbCgpIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWVUb1BpeGVsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyBhbGwgdGhlIGRpc3BsYXllZCBpdGVtcy5cbiAgICpcbiAgICogQHR5cGUge0FycmF5PEVsZW1lbnQ+fVxuICAgKi9cbiAgZ2V0IGl0ZW1zKCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuXyRpdGVtRGF0YU1hcC5rZXlzKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGRhdGEgYXNzb2NpYXRlZCB0byB0aGUgbGF5ZXIuXG4gICAqXG4gICAqIEB0eXBlIHtPYmplY3RbXX1cbiAgICovXG4gIGdldCBkYXRhKCkgeyByZXR1cm4gdGhpcy5fZGF0YTsgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCB0aGUgbGF5ZXIuXG4gICAqXG4gICAqIEB0eXBlIHtPYmplY3R8T2JqZWN0W119XG4gICAqL1xuICBzZXQgZGF0YShkYXRhKSB7XG4gICAgc3dpdGNoICh0aGlzLmRhdGFUeXBlKSB7XG4gICAgY2FzZSAnZW50aXR5JzpcbiAgICAgIGlmICh0aGlzLl9kYXRhKSB7ICAvLyBpZiBkYXRhIGFscmVhZHkgZXhpc3RzLCByZXVzZSB0aGUgcmVmZXJlbmNlXG4gICAgICAgIHRoaXMuX2RhdGFbMF0gPSBkYXRhO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZGF0YSA9IFtkYXRhXTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2NvbGxlY3Rpb24nOlxuICAgICAgdGhpcy5fZGF0YSA9IGRhdGE7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgdGhpcy5fY2FjaGVkID0gZmFsc2U7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBJbml0aWFsaXphdGlvblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBSZW5kZXJzIHRoZSBET00gaW4gbWVtb3J5IG9uIGxheWVyIGNyZWF0aW9uIHRvIGJlIGFibGUgdG8gdXNlIGl0IGJlZm9yZVxuICAgKiB0aGUgbGF5ZXIgaXMgYWN0dWFsbHkgaW5zZXJ0ZWQgaW4gdGhlIERPTS5cbiAgICovXG4gIF9yZW5kZXJDb250YWluZXIoKSB7XG4gICAgLy8gd3JhcHBlciBncm91cCBmb3IgYHN0YXJ0LCB0b3AgYW5kIGNvbnRleHQgZmxpcCBtYXRyaXhcbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICB0aGlzLiRlbC5jbGFzc0xpc3QuYWRkKCdsYXllcicpO1xuICAgIGlmICh0aGlzLnBhcmFtcy5jbGFzc05hbWUgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuJGVsLmNsYXNzTGlzdC5hZGQodGhpcy5wYXJhbXMuY2xhc3NOYW1lKTtcbiAgICB9XG4gICAgLy8gY2xpcCB0aGUgY29udGV4dCB3aXRoIGEgYHN2Z2AgZWxlbWVudFxuICAgIHRoaXMuJGJvdW5kaW5nQm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnc3ZnJyk7XG4gICAgdGhpcy4kYm91bmRpbmdCb3guY2xhc3NMaXN0LmFkZCgnYm91bmRpbmctYm94Jyk7XG4gICAgdGhpcy4kYm91bmRpbmdCb3guc3R5bGUub3ZlcmZsb3cgPSB0aGlzLnBhcmFtcy5vdmVyZmxvdztcbiAgICAvLyBncm91cCB0byBjb250YWluIGxheWVyIGl0ZW1zXG4gICAgdGhpcy4kbWFpbmdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIHRoaXMuJG1haW5ncm91cC5jbGFzc0xpc3QuYWRkKCdtYWluZ3JvdXAnLCAnaXRlbXMnKTtcbiAgICAvLyBsYXllciBiYWNrZ3JvdW5kXG4gICAgdGhpcy4kYmFja2dyb3VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3JlY3QnKTtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCAnMTAwJScpO1xuICAgIHRoaXMuJGJhY2tncm91bmQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgJzEwMCUnKTtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLmNsYXNzTGlzdC5hZGQoJ2JhY2tncm91bmQnKTtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLnN0eWxlLmZpbGxPcGFjaXR5ID0gMDtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XG5cbiAgICAvLyBjcmVhdGUgdGhlIERPTSB0cmVlXG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kYm91bmRpbmdCb3gpO1xuICAgIHRoaXMuJGJvdW5kaW5nQm94LmFwcGVuZENoaWxkKHRoaXMuJG1haW5ncm91cCk7XG4gICAgdGhpcy4kbWFpbmdyb3VwLmFwcGVuZENoaWxkKHRoaXMuJGJhY2tncm91bmQpO1xuXG4gICAgaWYgKHRoaXMuX2lzQ29udGV4dEVkaXRhYmxlKSB7XG4gICAgICB0aGlzLl9hZGRJbnRlcmFjdGlvbnNFbGVtZW50cygpO1xuICAgIH1cbiAgfVxuXG4gIF9hZGRJbnRlcmFjdGlvbnNFbGVtZW50cygpIHtcblxuICAgIGlmICh0aGlzLiRpbnRlcmFjdGlvbnMgIT09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBjb250ZXh0IGludGVyYWN0aW9uc1xuICAgIHRoaXMuJGludGVyYWN0aW9ucyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICB0aGlzLiRpbnRlcmFjdGlvbnMuY2xhc3NMaXN0LmFkZCgnaW50ZXJhY3Rpb25zJyk7XG5cbiAgICBjb25zdCBkaXNwbGF5ID0gdGhpcy5faXNDb250ZXh0RWRpdGFibGUgPyAnYmxvY2snIDogJ25vbmUnO1xuICAgIHRoaXMuJGludGVyYWN0aW9ucy5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheTtcblxuICAgIC8vIEBOT1RFOiB3b3JrcyBidXQga2luZyBvZiB1Z2x5Li4uIHNob3VsZCBiZSBjbGVhbmVkXG4gICAgdGhpcy5jb250ZXh0U2hhcGUgPSBuZXcgU2VnbWVudCgpO1xuICAgIHRoaXMuY29udGV4dFNoYXBlLmluc3RhbGwoe1xuICAgICAgb3BhY2l0eTogKCkgPT4gMC4xLFxuICAgICAgY29sb3IgIDogKCkgPT4gJyM3ODc4NzgnLFxuICAgICAgd2lkdGggIDogKCkgPT4gdGhpcy50aW1lQ29udGV4dC5kdXJhdGlvbixcbiAgICAgIGhlaWdodCA6ICgpID0+IHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsLmRvbWFpbigpWzFdLFxuICAgICAgeSAgICAgIDogKCkgPT4gdGhpcy5fcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwuZG9tYWluKClbMF1cbiAgICB9KTtcbiAgICBcbiAgICB0aGlzLiRpbnRlcmFjdGlvbnMuYXBwZW5kQ2hpbGQodGhpcy5jb250ZXh0U2hhcGUucmVuZGVyKCkpO1xuICAgIHRoaXMuJGJvdW5kaW5nQm94LmFwcGVuZENoaWxkKHRoaXMuJGludGVyYWN0aW9ucyk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBDb21wb25lbnQgQ29uZmlndXJhdGlvblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBjb250ZXh0IG9mIHRoZSBsYXllciwgdGh1cyBkZWZpbmluZyBpdHMgYHN0YXJ0YCwgYGR1cmF0aW9uYCxcbiAgICogYG9mZnNldGAgYW5kIGBzdHJldGNoUmF0aW9gLlxuICAgKlxuICAgKiBAcGFyYW0ge1RpbWVDb250ZXh0fSB0aW1lQ29udGV4dCAtIFRoZSB0aW1lQ29udGV4dCBpbiB3aGljaCB0aGUgbGF5ZXIgaXMgZGlzcGxheWVkLlxuICAgKi9cbiAgc2V0VGltZUNvbnRleHQodGltZUNvbnRleHQpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0ID0gdGltZUNvbnRleHQ7XG4gICAgLy8gY3JlYXRlIGEgbWl4aW4gdG8gcGFzcyB0byB0aGUgc2hhcGVzXG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dCA9IHt9O1xuICAgIHRoaXMuX3VwZGF0ZVJlbmRlcmluZ0NvbnRleHQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIHNoYXBlIGFuZCBpdHMgY29uZmlndXJhdGlvbiB0byB1c2UgaW4gb3JkZXIgdG8gcmVuZGVyIHRoZSBkYXRhLlxuICAgKlxuICAgKiBAcGFyYW0ge0Jhc2VTaGFwZX0gY3RvciAtIFRoZSBjb25zdHJ1Y3RvciBvZiB0aGUgc2hhcGUgdG8gYmUgdXNlZC5cbiAgICogQHBhcmFtIHtPYmplY3R9IFthY2Nlc3NvcnM9e31dIC0gRGVmaW5lcyBob3cgdGhlIHNoYXBlIHNob3VsZCBhZGFwdCB0byBhIHBhcnRpY3VsYXIgZGF0YSBzdHJ1dHVyZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSAtIEdsb2JhbCBjb25maWd1cmF0aW9uIGZvciB0aGUgc2hhcGVzLCBpcyBzcGVjaWZpYyB0byBlYWNoIGBTaGFwZWAuXG4gICAqL1xuICBjb25maWd1cmVTaGFwZShjdG9yLCBhY2Nlc3NvcnMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5fc2hhcGVDb25maWd1cmF0aW9uID0geyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPcHRpb25hbGx5IHJlZ2lzdGVyIGEgc2hhcGUgdG8gYmUgdXNlZCBhY3Jvc3MgdGhlIGVudGlyZSBjb2xsZWN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge0Jhc2VTaGFwZX0gY3RvciAtIFRoZSBjb25zdHJ1Y3RvciBvZiB0aGUgc2hhcGUgdG8gYmUgdXNlZC5cbiAgICogQHBhcmFtIHtPYmplY3R9IFthY2Nlc3NvcnM9e31dIC0gRGVmaW5lcyBob3cgdGhlIHNoYXBlIHNob3VsZCBhZGFwdCB0byBhIHBhcnRpY3VsYXIgZGF0YSBzdHJ1dHVyZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSAtIEdsb2JhbCBjb25maWd1cmF0aW9uIGZvciB0aGUgc2hhcGVzLCBpcyBzcGVjaWZpYyB0byBlYWNoIGBTaGFwZWAuXG4gICAqL1xuICBjb25maWd1cmVDb21tb25TaGFwZShjdG9yLCBhY2Nlc3NvcnMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5fY29tbW9uU2hhcGVDb25maWd1cmF0aW9uID0geyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciB0aGUgYmVoYXZpb3IgdG8gdXNlIHdoZW4gaW50ZXJhY3Rpbmcgd2l0aCBhIHNoYXBlLlxuICAgKlxuICAgKiBAcGFyYW0ge0Jhc2VCZWhhdmlvcn0gYmVoYXZpb3JcbiAgICovXG4gIHNldEJlaGF2aW9yKGJlaGF2aW9yKSB7XG4gICAgYmVoYXZpb3IuaW5pdGlhbGl6ZSh0aGlzKTtcbiAgICB0aGlzLl9iZWhhdmlvciA9IGJlaGF2aW9yO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHZhbHVlcyBzdG9yZWQgaW4gdGhlIGBfcmVuZGVyaW5nQ29udGV4dGAgcGFzc2VkICB0byBzaGFwZXNcbiAgICogZm9yIHJlbmRlcmluZyBhbmQgdXBkYXRpbmcuXG4gICAqL1xuICBfdXBkYXRlUmVuZGVyaW5nQ29udGV4dCgpIHtcblxuICAgIC8vIFBMQU5cbiAgICAvL1xuICAgIC8vIFRoZSB0aW1lIGNvbnRleHQgc3RydWN0dXJlcyBzdGF5IHRoZSBzYW1lLiBUaGV5IGNvbnRpbnVlIHRvIG1hcFxuICAgIC8vIHRpbWUgaW4gc2Vjb25kcyBvbnRvIGFuIGFic29sdXRlIHBpeGVsIGF4aXMgdGhhdCBzdGFydHMgYXRcbiAgICAvLyBwaXhlbCAwID09IHRpbWUgMCBhbmQgcGl4ZWwgTiA9PSB0aW1lIChOIC8gcGl4ZWxzLXBlci1zZWNvbmQpLlxuICAgIC8vXG4gICAgLy8gVGhlIHJlbmRlcmluZyBjb250ZXh0LCBvbiB0aGUgb3RoZXIgaGFuZCwgaGFzIHBpeGVsIDAgYXQgdGhlXG4gICAgLy8gbGVmdCBlZGdlIG9mIHRoZSB2aXNpYmxlIGFyZWEsIHNvIHRoYXQgdGhlIHJlbmRlcmVkIFNWRyBoYXNcbiAgICAvLyB3aWR0aCAoaW4gaXRzIGNvb3JkaW5hdGUgc2NoZW1lKSBlcXVhbCB0byB0aGUgdmlzaWJsZSBhcmVhLiBXZVxuICAgIC8vIGFsd2F5cyByZXNpdHVhdGUgb3Vyc2VsdmVzIHRoZXJlIHNvIGFzIHRvIGF2b2lkIGV4dHJlbWVseSBsYXJnZVxuICAgIC8vIFNWRyBjb29yZGluYXRlcyB3aGVuIGJvdGggem9vbWVkIGluIGEgbG9uZyB3YXkgYW5kIHNjcm9sbGVkIGFcbiAgICAvLyBsb25nIHdheSB0byB0aGUgcmlnaHQsIGFzIGJyb3dzZXIgcmVuZGVyZXJzIGdlbmVyYWxseSBzZWVtIHRvXG4gICAgLy8gYmxvdyB1cCB3aGVuIHByZXNlbnRlZCB3aXRoIGNvb3JkcyBhYm92ZSAyXjI0IG9yIHNvLlxuICAgIC8vIFxuICAgIC8vIFRvIGFycmFuZ2UgcGl4ZWwgMCBhdCB0aGUgbGVmdCBlZGdlLCB3ZSBuZWVkIHRvIGVuc3VyZSB0aGF0IHRoZVxuICAgIC8vIHRpbWUtdG8tcGl4ZWwgbWFwcGluZyBwbGFjZXMgdGltZSAwIGF0IHBpeGVsIC1taW5YIHdoZXJlIG1pblhcbiAgICAvLyBpcyB0aGUgdGltZSBjb250ZXh0J3MgdGltZVRvUGl4ZWwgbWFwcGluZyBvZiB0aGUgc3VtIG9mIGFsbFxuICAgIC8vIGFwcGxpY2FibGUgdGltZSBvZmZzZXRzLlxuICAgIFxuICAgIGNvbnN0IGxheWVyU3RhcnRUaW1lID0gdGhpcy50aW1lQ29udGV4dC5zdGFydDtcbiAgICBjb25zdCBsYXllck9mZnNldFRpbWUgPSB0aGlzLnRpbWVDb250ZXh0Lm9mZnNldDtcbiAgICBjb25zdCB0cmFja09mZnNldFRpbWUgPSB0aGlzLnRpbWVDb250ZXh0LnBhcmVudC5vZmZzZXQ7XG5cbiAgICBjb25zdCBsYXllck9yaWdpblRpbWUgPSB0cmFja09mZnNldFRpbWUgKyBsYXllclN0YXJ0VGltZTtcblxuICAgIGNvbnN0IHZpZXdTdGFydFRpbWUgPSAtbGF5ZXJPcmlnaW5UaW1lIC0gbGF5ZXJPZmZzZXRUaW1lO1xuICAgIFxuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwgPSBzY2FsZXMubGluZWFyKClcbiAgICAgIC5kb21haW4oW3ZpZXdTdGFydFRpbWUsIHZpZXdTdGFydFRpbWUgKyAxXSlcbiAgICAgIC5yYW5nZShbMCwgdGhpcy50aW1lQ29udGV4dC50aW1lVG9QaXhlbCgxKV0pO1xuICAgIFxuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQubWluWCA9IDA7XG5cbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnZpc2libGVXaWR0aCA9IHRoaXMudGltZUNvbnRleHQucGFyZW50LnZpc2libGVXaWR0aDtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LndpZHRoID0gdGhpcy5fcmVuZGVyaW5nQ29udGV4dC52aXNpYmxlV2lkdGg7XG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC5tYXhYID0gdGhpcy5fcmVuZGVyaW5nQ29udGV4dC52aXNpYmxlV2lkdGg7XG4gICAgXG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwgPSB0aGlzLl92YWx1ZVRvUGl4ZWw7XG5cbi8vICAgIGNvbnNvbGUubG9nKFwiUmVuZGVyaW5nIGNvbnRleHQ6IHdpZHRoID0gXCIgKyB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LndpZHRoICsgXCIsIHZpc2libGVXaWR0aCA9IFwiICsgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC52aXNpYmxlV2lkdGggKyBcIiwgbWluWCA9IFwiICsgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC5taW5YICsgXCIgKHRpbWUgPSBcIiArIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHRoaXMuX3JlbmRlcmluZ0NvbnRleHQubWluWCkgKyBcIiksIG1heFggPSBcIiArIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQubWF4WCArIFwiICh0aW1lID0gXCIgKyB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydCh0aGlzLl9yZW5kZXJpbmdDb250ZXh0Lm1heFgpICsgXCIpXCIpO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQmVoYXZpb3IgQWNjZXNzb3JzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGl0ZW1zIG1hcmtlZCBhcyBzZWxlY3RlZC5cbiAgICpcbiAgICogQHR5cGUge0FycmF5PEVsZW1lbnQ+fVxuICAgKi9cbiAgZ2V0IHNlbGVjdGVkSXRlbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2JlaGF2aW9yID8gdGhpcy5fYmVoYXZpb3Iuc2VsZWN0ZWRJdGVtcyA6IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcmsgaXRlbShzKSBhcyBzZWxlY3RlZC5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fEVsZW1lbnRbXX0gJGl0ZW1zXG4gICAqL1xuICBzZWxlY3QoLi4uJGl0ZW1zKSB7XG4gICAgaWYgKCF0aGlzLl9iZWhhdmlvcikgeyByZXR1cm47IH1cbiAgICBpZiAoISRpdGVtcy5sZW5ndGgpIHsgJGl0ZW1zID0gdGhpcy5fJGl0ZW1EYXRhTWFwLmtleXMoKTsgfVxuICAgIGlmIChBcnJheS5pc0FycmF5KCRpdGVtc1swXSkpIHsgJGl0ZW1zID0gJGl0ZW1zWzBdOyB9XG5cbiAgICBmb3IgKGxldCAkaXRlbSBvZiAkaXRlbXMpIHtcbiAgICAgIGNvbnN0IGRhdHVtID0gdGhpcy5fJGl0ZW1EYXRhTWFwLmdldCgkaXRlbSk7XG4gICAgICB0aGlzLl9iZWhhdmlvci5zZWxlY3QoJGl0ZW0sIGRhdHVtKTtcbiAgICAgIHRoaXMuX3RvRnJvbnQoJGl0ZW0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGl0ZW0ocykgZnJvbSBzZWxlY3RlZCBpdGVtcy5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fEVsZW1lbnRbXX0gJGl0ZW1zXG4gICAqL1xuICB1bnNlbGVjdCguLi4kaXRlbXMpIHtcbiAgICBpZiAoIXRoaXMuX2JlaGF2aW9yKSB7IHJldHVybjsgfVxuICAgIGlmICghJGl0ZW1zLmxlbmd0aCkgeyAkaXRlbXMgPSB0aGlzLl8kaXRlbURhdGFNYXAua2V5cygpOyB9XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoJGl0ZW1zWzBdKSkgeyAkaXRlbXMgPSAkaXRlbXNbMF07IH1cblxuICAgIGZvciAobGV0ICRpdGVtIG9mICRpdGVtcykge1xuICAgICAgY29uc3QgZGF0dW0gPSB0aGlzLl8kaXRlbURhdGFNYXAuZ2V0KCRpdGVtKTtcbiAgICAgIHRoaXMuX2JlaGF2aW9yLnVuc2VsZWN0KCRpdGVtLCBkYXR1bSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZSBpdGVtKHMpIHNlbGVjdGlvbiBzdGF0ZSBhY2NvcmRpbmcgdG8gdGhlaXIgY3VycmVudCBzdGF0ZS5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fEVsZW1lbnRbXX0gJGl0ZW1zXG4gICAqL1xuICB0b2dnbGVTZWxlY3Rpb24oLi4uJGl0ZW1zKSB7XG4gICAgaWYgKCF0aGlzLl9iZWhhdmlvcikgeyByZXR1cm47IH1cbiAgICBpZiAoISRpdGVtcy5sZW5ndGgpIHsgJGl0ZW1zID0gdGhpcy5fJGl0ZW1EYXRhTWFwLmtleXMoKTsgfVxuICAgIGlmIChBcnJheS5pc0FycmF5KCRpdGVtc1swXSkpIHsgJGl0ZW1zID0gJGl0ZW1zWzBdOyB9XG5cbiAgICBmb3IgKGxldCAkaXRlbSBvZiAkaXRlbXMpIHtcbiAgICAgIGNvbnN0IGRhdHVtID0gdGhpcy5fJGl0ZW1EYXRhTWFwLmdldCgkaXRlbSk7XG4gICAgICB0aGlzLl9iZWhhdmlvci50b2dnbGVTZWxlY3Rpb24oJGl0ZW0sIGRhdHVtKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRWRpdCBpdGVtKHMpIGFjY29yZGluZyB0byB0aGUgYGVkaXRgIGRlZmluZWQgaW4gdGhlIHJlZ2lzdGVyZWQgYEJlaGF2aW9yYC5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fEVsZW1lbnRbXX0gJGl0ZW1zIC0gVGhlIGl0ZW0ocykgdG8gZWRpdC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGR4IC0gVGhlIG1vZGlmaWNhdGlvbiB0byBhcHBseSBpbiB0aGUgeCBheGlzIChpbiBwaXhlbHMpLlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHkgLSBUaGUgbW9kaWZpY2F0aW9uIHRvIGFwcGx5IGluIHRoZSB5IGF4aXMgKGluIHBpeGVscykuXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJHRhcmdldCAtIFRoZSB0YXJnZXQgb2YgdGhlIGludGVyYWN0aW9uIChmb3IgZXhhbXBsZSwgbGVmdFxuICAgKiAgICBoYW5kbGVyIERPTSBlbGVtZW50IGluIGEgc2VnbWVudCkuXG4gICAqL1xuICBlZGl0KCRpdGVtcywgZHgsIGR5LCAkdGFyZ2V0KSB7XG4gICAgaWYgKCF0aGlzLl9iZWhhdmlvcikgeyByZXR1cm47IH1cbiAgICAkaXRlbXMgPSAhQXJyYXkuaXNBcnJheSgkaXRlbXMpID8gWyRpdGVtc10gOiAkaXRlbXM7XG5cbiAgICBmb3IgKGxldCAkaXRlbSBvZiAkaXRlbXMpIHtcbiAgICAgIGNvbnN0IHNoYXBlID0gdGhpcy5fJGl0ZW1TaGFwZU1hcC5nZXQoJGl0ZW0pO1xuICAgICAgY29uc3QgZGF0dW0gPSB0aGlzLl8kaXRlbURhdGFNYXAuZ2V0KCRpdGVtKTtcblxuICAgICAgdGhpcy5fYmVoYXZpb3IuZWRpdCh0aGlzLl9yZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgJHRhcmdldCk7XG4gICAgICB0aGlzLmVtaXQoJ2VkaXQnLCBzaGFwZSwgZGF0dW0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGlmIHRoZSBgTGF5ZXJgLCBhbmQgdGh1cyB0aGUgYExheWVyVGltZUNvbnRleHRgIGlzIGVkaXRhYmxlIG9yIG5vdC5cbiAgICpcbiAgICogQHBhcmFtcyB7Qm9vbGVhbn0gW2Jvb2w9dHJ1ZV1cbiAgICovXG4gIHNldENvbnRleHRFZGl0YWJsZShib29sID0gdHJ1ZSkge1xuICAgIFxuICAgIHRoaXMuX2lzQ29udGV4dEVkaXRhYmxlID0gYm9vbDtcbiAgICBcbiAgICBpZiAodGhpcy4kaW50ZXJhY3Rpb25zID09PSBudWxsKSB7XG4gICAgICB0aGlzLl9hZGRJbnRlcmFjdGlvbnNFbGVtZW50cygpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBkaXNwbGF5ID0gYm9vbCA/ICdibG9jaycgOiAnbm9uZSc7XG4gICAgICB0aGlzLiRpbnRlcmFjdGlvbnMuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEVkaXQgdGhlIGxheWVyIGFuZCB0aHVzIGl0cyByZWxhdGVkIGBMYXllclRpbWVDb250ZXh0YCBhdHRyaWJ1dGVzLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHggLSBUaGUgbW9kaWZpY2F0aW9uIHRvIGFwcGx5IGluIHRoZSB4IGF4aXMgKGluIHBpeGVscykuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkeSAtIFRoZSBtb2RpZmljYXRpb24gdG8gYXBwbHkgaW4gdGhlIHkgYXhpcyAoaW4gcGl4ZWxzKS5cbiAgICogQHBhcmFtIHtFbGVtZW50fSAkdGFyZ2V0IC0gVGhlIHRhcmdldCBvZiB0aGUgZXZlbnQgb2YgdGhlIGludGVyYWN0aW9uLlxuICAgKi9cbiAgZWRpdENvbnRleHQoZHgsIGR5LCAkdGFyZ2V0KSB7XG4gICAgdGltZUNvbnRleHRCZWhhdmlvci5lZGl0KHRoaXMsIGR4LCBkeSwgJHRhcmdldCk7XG4gIH1cblxuICAvKipcbiAgICogU3RyZXRjaCB0aGUgbGF5ZXIgYW5kIHRodXMgaXRzIHJlbGF0ZWQgYExheWVyVGltZUNvbnRleHRgIGF0dHJpYnV0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkeCAtIFRoZSBtb2RpZmljYXRpb24gdG8gYXBwbHkgaW4gdGhlIHggYXhpcyAoaW4gcGl4ZWxzKS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGR5IC0gVGhlIG1vZGlmaWNhdGlvbiB0byBhcHBseSBpbiB0aGUgeSBheGlzIChpbiBwaXhlbHMpLlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICR0YXJnZXQgLSBUaGUgdGFyZ2V0IG9mIHRoZSBldmVudCBvZiB0aGUgaW50ZXJhY3Rpb24uXG4gICAqL1xuICBzdHJldGNoQ29udGV4dChkeCwgZHksICR0YXJnZXQpIHtcbiAgICB0aW1lQ29udGV4dEJlaGF2aW9yLnN0cmV0Y2godGhpcywgZHgsIGR5LCAkdGFyZ2V0KTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEhlbHBlcnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBpdGVtIGZyb20gYSBET00gZWxlbWVudCByZWxhdGVkIHRvIHRoZSBzaGFwZSwgbnVsbCBvdGhlcndpc2UuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGVsIC0gdGhlIGVsZW1lbnQgdG8gYmUgdGVzdGVkXG4gICAqIEByZXR1cm4ge0VsZW1lbnR8bnVsbH1cbiAgICovXG4gIGdldEl0ZW1Gcm9tRE9NRWxlbWVudCgkZWwpIHtcbiAgICBsZXQgJGl0ZW07XG5cbiAgICBkbyB7XG4gICAgICBpZiAoJGVsLmNsYXNzTGlzdCAmJiAkZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdpdGVtJykpIHtcbiAgICAgICAgJGl0ZW0gPSAkZWw7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICAkZWwgPSAkZWwucGFyZW50Tm9kZTtcbiAgICB9IHdoaWxlICgkZWwgIT09IG51bGwpO1xuXG4gICAgcmV0dXJuIHRoaXMuaGFzSXRlbSgkaXRlbSkgPyAkaXRlbSA6wqBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGRhdHVtIGFzc29jaWF0ZWQgdG8gYSBzcGVjaWZpYyBpdGVtLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRpdGVtXG4gICAqIEByZXR1cm4ge09iamVjdHxBcnJheXxudWxsfVxuICAgKi9cbiAgZ2V0RGF0dW1Gcm9tSXRlbSgkaXRlbSkge1xuICAgIGNvbnN0IGRhdHVtID0gdGhpcy5fJGl0ZW1EYXRhTWFwLmdldCgkaXRlbSk7XG4gICAgcmV0dXJuIGRhdHVtID8gZGF0dW0gOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGRhdHVtIGFzc29jaWF0ZWQgdG8gYSBzcGVjaWZpYyBpdGVtIGZyb20gYW55IERPTSBlbGVtZW50XG4gICAqIGNvbXBvc2luZyB0aGUgc2hhcGUuIEJhc2ljYWxseSBhIHNob3J0Y3V0IGZvciBgZ2V0SXRlbUZyb21ET01FbGVtZW50YCBhbmRcbiAgICogYGdldERhdHVtRnJvbUl0ZW1gIG1ldGhvZHMuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGVsXG4gICAqIEByZXR1cm4ge09iamVjdHxBcnJheXxudWxsfVxuICAgKi9cbiAgZ2V0RGF0dW1Gcm9tRE9NRWxlbWVudCgkZWwpIHtcbiAgICB2YXIgJGl0ZW0gPSB0aGlzLmdldEl0ZW1Gcm9tRE9NRWxlbWVudCgkZWwpO1xuICAgIGlmICgkaXRlbSA9PT0gbnVsbCkgeyByZXR1cm4gbnVsbDsgfVxuICAgIHJldHVybiB0aGlzLmdldERhdHVtRnJvbUl0ZW0oJGl0ZW0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRlc3RzIGlmIHRoZSBnaXZlbiBET00gZWxlbWVudCBpcyBhbiBpdGVtIG9mIHRoZSBsYXllci5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fSAkaXRlbSAtIFRoZSBpdGVtIHRvIGJlIHRlc3RlZC5cbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG4gIGhhc0l0ZW0oJGl0ZW0pIHtcbiAgICByZXR1cm4gdGhpcy5fJGl0ZW1EYXRhTWFwLmhhcygkaXRlbSk7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lcyBpZiBhIGdpdmVuIGVsZW1lbnQgYmVsb25ncyB0byB0aGUgbGF5ZXIuIElzIG1vcmUgZ2VuZXJhbCB0aGFuXG4gICAqIGBoYXNJdGVtYCwgY2FuIG1vc3RseSB1c2VkIHRvIGNoZWNrIGludGVyYWN0aW9ucyBlbGVtZW50cy5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fSAkZWwgLSBUaGUgRE9NIGVsZW1lbnQgdG8gYmUgdGVzdGVkLlxuICAgKiBAcmV0dXJuIHtib29sfVxuICAgKi9cbiAgaGFzRWxlbWVudCgkZWwpIHtcbiAgICBkbyB7XG4gICAgICBpZiAoJGVsID09PSB0aGlzLiRlbCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgJGVsID0gJGVsLnBhcmVudE5vZGU7XG4gICAgfSB3aGlsZSAoJGVsICE9PSBudWxsKTtcblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBhbGwgdGhlIGl0ZW1zIGluIGEgZ2l2ZW4gYXJlYSBhcyBkZWZpbmVkIGluIHRoZSByZWdpc3RlcmVkIGBTaGFwZX5pbkFyZWFgIG1ldGhvZC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGFyZWEgLSBUaGUgYXJlYSAoaW4gdmlld3BvcnQgY29vcmRpbmF0ZSBzcGFjZSkgaW4gd2hpY2ggdG8gZmluZCB0aGUgZWxlbWVudHNcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGFyZWEudG9wXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBhcmVhLmxlZnRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGFyZWEud2lkdGhcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGFyZWEuaGVpZ2h0XG4gICAqIEByZXR1cm4ge0FycmF5fSAtIGxpc3Qgb2YgdGhlIGl0ZW1zIHByZXNlbnRzIGluIHRoZSBhcmVhXG4gICAqL1xuICBnZXRJdGVtc0luQXJlYShhcmVhKSB7XG5cbiAgICBsZXQgeDEgPSBhcmVhLmxlZnQ7XG4gICAgbGV0IHgyID0gYXJlYS5sZWZ0ICsgYXJlYS53aWR0aDtcblxuICAgIC8vIGtlZXAgY29uc2lzdGVudCB3aXRoIGNvbnRleHQgeSBjb29yZGluYXRlcyBzeXN0ZW1cbiAgICBsZXQgeTEgPSB0aGlzLnBhcmFtcy5oZWlnaHQgLSAoYXJlYS50b3AgKyBhcmVhLmhlaWdodCk7XG4gICAgbGV0IHkyID0gdGhpcy5wYXJhbXMuaGVpZ2h0IC0gYXJlYS50b3A7XG5cbiAgICB5MSArPSB0aGlzLnBhcmFtcy50b3A7XG4gICAgeTIgKz0gdGhpcy5wYXJhbXMudG9wO1xuXG4gICAgY29uc3QgJGZpbHRlcmVkSXRlbXMgPSBbXTtcblxuICAgIGZvciAobGV0IFskaXRlbSwgZGF0dW1dIG9mIHRoaXMuXyRpdGVtRGF0YU1hcC5lbnRyaWVzKCkpIHtcbiAgICAgIGNvbnN0IHNoYXBlID0gdGhpcy5fJGl0ZW1TaGFwZU1hcC5nZXQoJGl0ZW0pO1xuICAgICAgY29uc3QgaW5BcmVhID0gc2hhcGUuaW5BcmVhKHRoaXMuX3JlbmRlcmluZ0NvbnRleHQsIGRhdHVtLCB4MSwgeTEsIHgyLCB5Mik7XG5cbiAgICAgIGlmIChpbkFyZWEpIHsgJGZpbHRlcmVkSXRlbXMucHVzaCgkaXRlbSk7IH1cbiAgICB9XG5cbiAgICByZXR1cm4gJGZpbHRlcmVkSXRlbXM7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBSZW5kZXJpbmcgLyBEaXNwbGF5IG1ldGhvZHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogTW92ZXMgYW4gaXRlbSB0byB0aGUgZW5kIG9mIHRoZSBsYXllciB0byBkaXNwbGF5IGl0IGZyb250IG9mIGl0c1xuICAgKiBzaWJsaW5ncyAoc3ZnIHotaW5kZXguLi4pLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRpdGVtIC0gVGhlIGl0ZW0gdG8gYmUgbW92ZWQuXG4gICAqL1xuICBfdG9Gcm9udCgkaXRlbSkge1xuICAgIHRoaXMuJG1haW5ncm91cC5hcHBlbmRDaGlsZCgkaXRlbSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIHRoZSBET00gc3RydWN0dXJlIG9mIHRoZSBzaGFwZXMgYWNjb3JkaW5nIHRvIHRoZSBnaXZlbiBkYXRhLiBJbnNwaXJlZFxuICAgKiBmcm9tIHRoZSBgZW50ZXJgIGFuZCBgZXhpdGAgZDMuanMgcGFyYWRpZ20sIHRoaXMgbWV0aG9kIHNob3VsZCBiZSBjYWxsZWRcbiAgICogZWFjaCB0aW1lIGEgZGF0dW0gaXMgYWRkZWQgb3IgcmVtb3ZlZCBmcm9tIHRoZSBkYXRhLiBXaGlsZSB0aGUgRE9NIGlzXG4gICAqIGNyZWF0ZWQgdGhlIGB1cGRhdGVgIG1ldGhvZCBtdXN0IGJlIGNhbGxlZCBpbiBvcmRlciB0byB1cGRhdGUgdGhlIHNoYXBlc1xuICAgKiBhdHRyaWJ1dGVzIGFuZCB0aHVzIHBsYWNlIHRoZW0gd2hlcmUgdGhleSBzaG91bGQuXG4gICAqL1xuICByZW5kZXIoKSB7XG5cbiAgICBjb25zdCBiZWZvcmUgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICBcbiAgICAvLyByZW5kZXIgYGNvbW1vblNoYXBlYCBvbmx5IG9uY2VcbiAgICBpZiAoXG4gICAgICB0aGlzLl9jb21tb25TaGFwZUNvbmZpZ3VyYXRpb24gIT09IG51bGwgJiZcbiAgICAgIHRoaXMuXyRpdGVtQ29tbW9uU2hhcGVNYXAuc2l6ZSA9PT0gMFxuICAgICkge1xuICAgICAgY29uc3QgeyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfSA9IHRoaXMuX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbjtcbiAgICAgIGNvbnN0ICRncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICAgIGNvbnN0IHNoYXBlID0gbmV3IGN0b3Iob3B0aW9ucyk7XG5cbiAgICAgIHNoYXBlLmluc3RhbGwoYWNjZXNzb3JzKTtcbiAgICAgICRncm91cC5hcHBlbmRDaGlsZChzaGFwZS5yZW5kZXIoKSk7XG4gICAgICAkZ3JvdXAuY2xhc3NMaXN0LmFkZCgnaXRlbScsICdjb21tb24nLCBzaGFwZS5nZXRDbGFzc05hbWUoKSk7XG5cbiAgICAgIHRoaXMuXyRpdGVtQ29tbW9uU2hhcGVNYXAuc2V0KCRncm91cCwgc2hhcGUpO1xuICAgICAgdGhpcy4kbWFpbmdyb3VwLmFwcGVuZENoaWxkKCRncm91cCk7XG4gICAgfVxuXG4gICAgLy8gYXBwZW5kIGVsZW1lbnRzIGFsbCBhdCBvbmNlXG4gICAgY29uc3QgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgY29uc3QgdmFsdWVzID0gdGhpcy5fJGl0ZW1EYXRhTWFwLnZhbHVlcygpOyAvLyBpdGVyYXRvclxuXG4gICAgLy8gZW50ZXJcbiAgICBpZiAodGhpcy5fc2hhcGVDb25maWd1cmF0aW9uICE9PSBudWxsKSB7XG4gICAgICB0aGlzLmRhdGEuZm9yRWFjaCgoZGF0dW0pID0+IHtcbiAgICAgICAgZm9yIChsZXQgdmFsdWUgb2YgdmFsdWVzKSB7IGlmICh2YWx1ZSA9PT0gZGF0dW0pIHsgcmV0dXJuOyB9IH1cblxuICAgICAgICBjb25zdCB7IGN0b3IsIGFjY2Vzc29ycywgb3B0aW9ucyB9ID0gdGhpcy5fc2hhcGVDb25maWd1cmF0aW9uO1xuICAgICAgICBjb25zdCBzaGFwZSA9IG5ldyBjdG9yKG9wdGlvbnMpO1xuICAgICAgICBzaGFwZS5pbnN0YWxsKGFjY2Vzc29ycyk7XG5cbiAgICAgICAgY29uc3QgJGVsID0gc2hhcGUucmVuZGVyKHRoaXMuX3JlbmRlcmluZ0NvbnRleHQpO1xuICAgICAgICAkZWwuY2xhc3NMaXN0LmFkZCgnaXRlbScsIHNoYXBlLmdldENsYXNzTmFtZSgpKTtcblxuICAgICAgICB0aGlzLl8kaXRlbVNoYXBlTWFwLnNldCgkZWwsIHNoYXBlKTtcbiAgICAgICAgdGhpcy5fJGl0ZW1EYXRhTWFwLnNldCgkZWwsIGRhdHVtKTtcblxuICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZCgkZWwpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuJG1haW5ncm91cC5hcHBlbmRDaGlsZChmcmFnbWVudCk7XG4gICAgfVxuXG4gICAgLy8gcmVtb3ZlXG4gICAgZm9yIChsZXQgWyRpdGVtLCBkYXR1bV0gb2YgdGhpcy5fJGl0ZW1EYXRhTWFwLmVudHJpZXMoKSkge1xuICAgICAgaWYgKHRoaXMuZGF0YS5pbmRleE9mKGRhdHVtKSAhPT0gLTEpIHsgY29udGludWU7IH1cblxuICAgICAgY29uc3Qgc2hhcGUgPSB0aGlzLl8kaXRlbVNoYXBlTWFwLmdldCgkaXRlbSk7XG5cbiAgICAgIHRoaXMuJG1haW5ncm91cC5yZW1vdmVDaGlsZCgkaXRlbSk7XG4gICAgICBzaGFwZS5kZXN0cm95KCk7XG4gICAgICAvLyBhIHJlbW92ZWQgaXRlbSBjYW5ub3QgYmUgc2VsZWN0ZWRcbiAgICAgIGlmICh0aGlzLl9iZWhhdmlvcikge1xuICAgICAgICB0aGlzLl9iZWhhdmlvci51bnNlbGVjdCgkaXRlbSwgZGF0dW0pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl8kaXRlbURhdGFNYXAuZGVsZXRlKCRpdGVtKTtcbiAgICAgIHRoaXMuXyRpdGVtU2hhcGVNYXAuZGVsZXRlKCRpdGVtKTtcbiAgICB9XG5cbiAgICBjb25zdCBhZnRlciA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIGNvbnNvbGUubG9nKFwibGF5ZXIgcmVuZGVyIHRpbWUgPSBcIiArIE1hdGgucm91bmQoYWZ0ZXIgLSBiZWZvcmUpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBjb250YWluZXIgb2YgdGhlIGxheWVyIGFuZCB0aGUgYXR0cmlidXRlcyBvZiB0aGUgZXhpc3Rpbmcgc2hhcGVzLlxuICAgKi9cbiAgdXBkYXRlKCkge1xuICAgIHRoaXMuX3VwZGF0ZUNvbnRhaW5lcigpO1xuICAgIHRoaXMuX3VwZGF0ZVNoYXBlcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGNvbnRhaW5lciBvZiB0aGUgbGF5ZXIuXG4gICAqL1xuICBfdXBkYXRlQ29udGFpbmVyKCkge1xuICAgIHRoaXMuX3VwZGF0ZVJlbmRlcmluZ0NvbnRleHQoKTtcblxuICAgIGNvbnN0IHRpbWVDb250ZXh0ID0gdGhpcy50aW1lQ29udGV4dDtcblxuICAgIGxldCB3aWR0aCA9IHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy50aW1lQ29udGV4dC5kdXJhdGlvbik7XG4gICAgaWYgKHdpZHRoID4gdGhpcy5fcmVuZGVyaW5nQ29udGV4dC52aXNpYmxlV2lkdGgpIHtcbiAgICAgIHdpZHRoID0gdGhpcy5fcmVuZGVyaW5nQ29udGV4dC52aXNpYmxlV2lkdGg7XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IHRvcCA9IHRoaXMucGFyYW1zLnRvcDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgXG4gICAgLy8gbWF0cml4IHRvIGludmVydCB0aGUgY29vcmRpbmF0ZSBzeXN0ZW1cbiAgICBjb25zdCB0cmFuc2xhdGVNYXRyaXggPSBgbWF0cml4KDEsIDAsIDAsIC0xLCAwLCAke3RvcCArIGhlaWdodH0pYDtcblxuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCB0cmFuc2xhdGVNYXRyaXgpO1xuXG4gICAgdGhpcy4kYm91bmRpbmdCb3guc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgd2lkdGgpO1xuICAgIHRoaXMuJGJvdW5kaW5nQm94LnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBoZWlnaHQpO1xuICAgIHRoaXMuJGJvdW5kaW5nQm94LnN0eWxlLm9wYWNpdHkgPSB0aGlzLnBhcmFtcy5vcGFjaXR5O1xuXG4gICAgaWYgKHRoaXMuY29udGV4dFNoYXBlICE9PSBudWxsKSB7XG4gICAgICAvLyBtYWludGFpbiBjb250ZXh0IHNoYXBlXG4gICAgICB0aGlzLmNvbnRleHRTaGFwZS51cGRhdGUodGhpcy5fcmVuZGVyaW5nQ29udGV4dCwgdGhpcy50aW1lQ29udGV4dCwgMCk7XG4gICAgfVxuICB9XG5cbiAgX2VuY2FjaGVFbnRpdHkoKSB7XG5cbiAgICBpZiAodGhpcy5kYXRhVHlwZSAhPT0gJ2VudGl0eScpIHJldHVybjtcbiAgICBpZiAodGhpcy5fY2FjaGVkKSByZXR1cm47XG4gICAgaWYgKHRoaXMuX2RhdGEgPT09IFtdKSByZXR1cm47XG4gICAgXG4gICAgbGV0IG9yaWdEYXRhID0gdGhpcy5fZGF0YVswXTtcblxuICAgIGZvciAobGV0IFskaXRlbSwgZGF0dW1dIG9mIHRoaXMuXyRpdGVtRGF0YU1hcC5lbnRyaWVzKCkpIHtcbiAgICAgIGlmIChkYXR1bSA9PT0gb3JpZ0RhdGEpIHtcbiAgICAgICAgY29uc3Qgc2hhcGUgPSB0aGlzLl8kaXRlbVNoYXBlTWFwLmdldCgkaXRlbSk7XG4gICAgICAgIGNvbnN0IGNhY2hlID0gc2hhcGUuZW5jYWNoZShkYXR1bSk7XG5cdGlmIChjYWNoZSkge1xuXHQgIHRoaXMuXyRpdGVtRGF0YU1hcC5zZXQoJGl0ZW0sIGNhY2hlKTtcbiAgICAgICAgICBpZiAodHlwZW9mKG9yaWdEYXRhLmRpc3Bvc2UpICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgb3JpZ0RhdGEuZGlzcG9zZSgpO1xuICAgICAgICAgIH1cblx0ICB0aGlzLmRhdGEgPSBjYWNoZTtcblx0fVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX2NhY2hlZCA9IHRydWU7XG4gIH1cbiAgXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBhdHRyaWJ1dGVzIG9mIGFsbCB0aGUgYFNoYXBlYCBpbnN0YW5jZXMgcmVuZGVyZWQgaW50byB0aGUgbGF5ZXIuXG4gICAqL1xuICBfdXBkYXRlU2hhcGVzKCkge1xuXG4gICAgY29uc3QgYmVmb3JlID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgXG4gICAgdGhpcy5fdXBkYXRlUmVuZGVyaW5nQ29udGV4dCgpO1xuXG4gICAgdGhpcy5fZW5jYWNoZUVudGl0eSgpO1xuICAgIFxuICAgIC8vIFVwZGF0ZSBjb21tb24gc2hhcGUsIGlmIGFueVxuICAgIHRoaXMuXyRpdGVtQ29tbW9uU2hhcGVNYXAuZm9yRWFjaCgoc2hhcGUsICRpdGVtKSA9PiB7XG4gICAgICBzaGFwZS51cGRhdGUodGhpcy5fcmVuZGVyaW5nQ29udGV4dCwgdGhpcy5kYXRhKTtcbiAgICB9KTtcblxuICAgIC8vIFVwZGF0ZSBzcGVjaWZpYyBzaGFwZXNcbiAgICBmb3IgKGxldCBbJGl0ZW0sIGRhdHVtXSBvZiB0aGlzLl8kaXRlbURhdGFNYXAuZW50cmllcygpKSB7XG4gICAgICBjb25zdCBzaGFwZSA9IHRoaXMuXyRpdGVtU2hhcGVNYXAuZ2V0KCRpdGVtKTtcbiAgICAgIHNoYXBlLnVwZGF0ZSh0aGlzLl9yZW5kZXJpbmdDb250ZXh0LCBkYXR1bSk7XG4gICAgfVxuXG4gICAgY29uc3QgYWZ0ZXIgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICBjb25zb2xlLmxvZyhcImxheWVyIHVwZGF0ZSB0aW1lID0gXCIgKyBNYXRoLnJvdW5kKGFmdGVyIC0gYmVmb3JlKSk7XG4gIH1cblxuICBkZXNjcmliZSh4KSB7XG4gICAgY29uc3QgYmVmb3JlID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cbiAgICBpZiAodHlwZW9mKHRoaXMuZGVzY3JpYmVyKSAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgdGhpcy5kZXNjcmliZXIgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmRlc2NyaWJlcih4IC0gdGhpcy5zdGFydCk7XG4gICAgfVxuICAgIFxuICAgIGxldCBkZXNjcmlwdGlvbiA9IG51bGw7XG4gICAgbGV0IG4gPSAwO1xuICAgIGZvciAobGV0IFskaXRlbSwgZGF0dW1dIG9mIHRoaXMuXyRpdGVtRGF0YU1hcC5lbnRyaWVzKCkpIHtcbiAgICAgIGNvbnN0IHNoYXBlID0gdGhpcy5fJGl0ZW1TaGFwZU1hcC5nZXQoJGl0ZW0pO1xuICAgICAgZGVzY3JpcHRpb24gPSBzaGFwZS5kZXNjcmliZShkYXR1bSwgeCAtIHRoaXMuc3RhcnQpO1xuICAgICAgbisrO1xuICAgICAgaWYgKGRlc2NyaXB0aW9uICE9PSBudWxsICYmIGRlc2NyaXB0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKFwibGF5ZXIgZGVzY3JpYmU6IGluc3BlY3RlZCBcIiArIG4gKyBcIiBvZiBcIiArIHRoaXMuXyRpdGVtRGF0YU1hcC5zaXplICsgXCIgc2hhcGUocylcIik7XG4gICAgY29uc3QgYWZ0ZXIgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICBjb25zb2xlLmxvZyhcImxheWVyIGRlc2NyaWJlIHRpbWUgPSBcIiArIE1hdGgucm91bmQoYWZ0ZXIgLSBiZWZvcmUpKTtcbiAgICByZXR1cm4gZGVzY3JpcHRpb247XG4gIH1cbn1cbiJdfQ==