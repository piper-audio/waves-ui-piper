(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.wavesUI = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreNamespace = require('../core/namespace');

var _coreNamespace2 = _interopRequireDefault(_coreNamespace);

var _coreLayer = require('../core/layer');

var _coreLayer2 = _interopRequireDefault(_coreLayer);

/**
 * Simplified Layer for Axis. The main difference with a regular layer is that
 * an axis layer use the `Timeline~timeContext` attributes to render it's layout
 * and stay synchronized with the tracks visible area. All getters and setters
 * to the `TimelineTimeContext` attributes are bypassed.
 *
 * It also handle it's own data and its updates. The `_generateData` method is
 * responsible to create some usefull data to visualize
 *
 * [example usage of the layer-axis](./examples/layer-axis.html)
 */

var AxisLayer = (function (_Layer) {
  _inherits(AxisLayer, _Layer);

  /**
   * @param {Function} generator - A function to create data according to
   *    the `Timeline~timeContext`.
   * @param {Object} options - Layer options, cf. Layer for available options.
   */

  function AxisLayer(generator, options) {
    _classCallCheck(this, AxisLayer);

    _get(Object.getPrototypeOf(AxisLayer.prototype), 'constructor', this).call(this, 'entity', [], options);
    this._generator = generator;
  }

  /** @private */

  _createClass(AxisLayer, [{
    key: '_generateData',

    /**
     * This method is the main difference with a classical layer. An `AxisLayer`
     * instance generates and maintains it's own data.
     */
    value: function _generateData() {
      var data = this._generator(this.timeContext);
      // prepend first arguments of splice for an apply
      data.unshift(0, this.data[0].length);
      // make sure to keep the same reference
      Array.prototype.splice.apply(this.data[0], data);
    }

    /**
     * Updates the rendering context for the shapes.
     */
  }, {
    key: '_updateRenderingContext',
    value: function _updateRenderingContext() {
      this._renderingContext.timeToPixel = this.timeContext.timeToPixel;
      this._renderingContext.valueToPixel = this._valueToPixel;
      this._renderingContext.height = this.params.height;
      this._renderingContext.width = this.timeContext.timeToPixel(this.timeContext.duration);

      // for foreign object issue in chrome
      this._renderingContext.offsetX = this.timeContext.timeToPixel(this.timeContext.offset);

      // expose some timeline attributes - allow to improve perf in some cases - cf. Waveform
      this._renderingContext.trackOffsetX = this.timeContext.timeToPixel(this.timeContext.offset);
      this._renderingContext.visibleWidth = this.timeContext.visibleWidth;
    }

    /**
     * Generates the data and update the layer.
     */
  }, {
    key: 'update',
    value: function update() {
      this._generateData();
      _get(Object.getPrototypeOf(AxisLayer.prototype), 'update', this).call(this);
    }

    /**
     * Render the DOM in memory on layer creation to be able to use it before
     * the layer is actually inserted in the DOM
     */
  }, {
    key: '_renderContainer',
    value: function _renderContainer() {
      // wrapper group for `start, top and context flip matrix
      this.$el = document.createElementNS(_coreNamespace2['default'], 'g');
      if (this.params.className !== null) {
        this.$el.classList.add('layer', this.params.className);
      }

      // group to apply offset
      this.$offset = document.createElementNS(_coreNamespace2['default'], 'g');
      this.$offset.classList.add('offset', 'items');
      // layer background
      this.$background = document.createElementNS(_coreNamespace2['default'], 'rect');
      this.$background.setAttributeNS(null, 'height', '100%');
      this.$background.classList.add('background');
      this.$background.style.fillOpacity = 0;
      this.$background.style.pointerEvents = 'none';
      // create the DOM tree
      this.$el.appendChild(this.$offset);
      this.$offset.appendChild(this.$background);
    }

    /**
     * Updates the layout of the layer.
     */
  }, {
    key: 'updateContainer',
    value: function updateContainer() {
      this._updateRenderingContext();

      var top = this.params.top;
      var height = this.params.height;
      // matrix to invert the coordinate system
      var translateMatrix = 'matrix(1, 0, 0, -1, 0, ' + (top + height) + ')';
      this.$el.setAttributeNS(null, 'transform', translateMatrix);

      this.$background.setAttributeNS(null, 'width', height);
    }
  }, {
    key: 'stretchRatio',
    set: function set(value) {
      return;
    },

    /** @private */

    /** @private */
    get: function get() {
      return;
    }

    /** @private */
  }, {
    key: 'offset',
    set: function set(value) {
      return;
    },

    /** @private */
    get: function get() {
      return;
    }

    /** @private */
  }, {
    key: 'start',
    set: function set(value) {
      return;
    },

    /** @private */
    get: function get() {
      return;
    }

    /** @private */
  }, {
    key: 'duration',
    set: function set(value) {
      return;
    },
    get: function get() {
      return;
    }

    /**
     * The generator that creates the data to be rendered to display the axis.
     *
     * @type {Function}
     */
  }, {
    key: 'generator',
    set: function set(func) {
      this._generator = func;
    },

    /**
     * The generator that creates the data to be rendered to display the axis.
     *
     * @type {Function}
     */
    get: function get() {
      return this._generator;
    }
  }]);

  return AxisLayer;
})(_coreLayer2['default']);

exports['default'] = AxisLayer;
module.exports = exports['default'];

},{"../core/layer":11,"../core/namespace":12,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],2:[function(require,module,exports){
/**
 * A generator to create data for grid axis according to a `bpm` and a `meter`.
 *
 * [example usage](./examples/layer-axis.html)
 *
 * @param {Number} bpm - The number of beats per minutes.
 * @param {String} signature - The meter of the mesure (`'4/4'`, `'3/8'`, ...).
 * @return {Function} - The configured function returning the data when called.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = gridAxisGenerator;

function gridAxisGenerator(bpm, signature) {
  var _bps = bpm / 60; // sec
  var _unit = 1 / parseInt(signature.split('/')[1], 10);
  var _nbrUnitsPerMesure = parseInt(signature.split('/')[0], 10);

  return function (timeContext) {
    var duration = timeContext.visibleDuration;
    var offset = timeContext.offset;
    var data = [];

    // const min = Math.min(-offset, 0);
    var min = -offset;
    // remove the timeline's offset to keep the layer centered
    var max = duration - offset;

    // define pixels for 1 second
    var pixelsPerSecond = timeContext.computedPixelsPerSecond;
    // time for one _unit
    var unitTime = 1 / _bps;
    // define the first tick > min
    var modulo = min % unitTime;
    var mult = (min - modulo) / unitTime;
    var firstTickTime = unitTime * mult;
    // track which position of current beat in the mesure
    var positionInMesure = mult % _nbrUnitsPerMesure;

    // remove not focused beats, if zoomed out
    var pixelsPerTick = pixelsPerSecond / _bps;
    var minStep = 5;

    // time should be
    for (var time = firstTickTime; time < max; time += unitTime) {
      // find first beat
      var focused = positionInMesure++ % _nbrUnitsPerMesure === 0;
      // ignore if pixels per ticks is too small
      if (pixelsPerTick <= minStep && !focused) {
        continue;
      }

      data.push({ time: time, focused: focused });
    }

    return data;
  };
}

module.exports = exports['default'];

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = timeAxisGenerator;

var _utilsFormat = require('../utils/format');

/**
 * A generator to create data for time axis.
 *
 * [example usage](./examples/layer-axis.html)
 *
 * @return {Function} - The configured function returning the data when called.
 */

function timeAxisGenerator() {
  // add factory to share API with bpmGenerator
  return function (timeContext) {
    var duration = timeContext.visibleDuration;
    var offset = timeContext.offset;
    var data = [];

    // const min = Math.min(-offset, 0);
    var min = -offset;
    // remove the timeline's offset to keep the layer centered
    var max = duration - offset;

    // define pixels for 1 second
    var pixelsPerSecond = timeContext.computedPixelsPerSecond;
    var minStep = 7;

    // define all display information according to the pixelsPerSecond ratio
    var step = undefined,
        type = undefined,
        toFixed = undefined,
        markerModulo = undefined,
        includeModulo = undefined;

    if (pixelsPerSecond * 4 > minStep) {
      step = 1; // the step to use to compute time
      toFixed = 0;
      markerModulo = 60; // a timestamp every 5 stepixelsPerSecond
      includeModulo = 5; // a tick every 5 stepixelsPerSecond
      type = '60sec';
    }

    if (pixelsPerSecond * 2 > minStep) {
      step = 1;
      toFixed = 0;
      markerModulo = 30;
      includeModulo = 1;
      type = '30sec';
    }

    if (pixelsPerSecond > minStep) {
      step = 1;
      toFixed = 0;
      markerModulo = 10;
      includeModulo = 1;
      type = 'sec';
    }

    if (pixelsPerSecond / 10 > minStep) {
      step = 1 / 10;
      toFixed = 1;
      markerModulo = 10;
      includeModulo = 1;
      type = 'ds';
    }

    if (pixelsPerSecond / 100 > minStep) {
      step = 1 / 100;
      toFixed = 2;
      markerModulo = 10;
      includeModulo = 1;
      type = 'cs';
    }

    if (pixelsPerSecond / 1000 > minStep) {
      step = 1 / 1000;
      toFixed = 3;
      markerModulo = 10;
      includeModulo = 1;
      type = 'ms';
    }

    for (var time = min; time < max; time += step) {
      var formattedTime = time.toFixed(toFixed);

      if (Math.round(formattedTime / step) % includeModulo !== 0) {
        continue;
      }

      // avoid floating point errors
      var focused = Math.round(formattedTime / step) % markerModulo === 0 ? true : false;

      var datum = { time: formattedTime, focused: focused };

      if (focused === true) {
        var date = new Date(1000 * formattedTime);
        var _min = (0, _utilsFormat.padLeft)(date.getMinutes(), 0, 2);
        var sec = (0, _utilsFormat.padLeft)(date.getSeconds(), 0, 2);
        var milli = (0, _utilsFormat.padLeft)(date.getMilliseconds(), 0, 3);
        var label = _min + ':' + sec + ':' + milli;

        datum.label = label;
      }

      data.push(datum);
    }

    return data;
  };
}

module.exports = exports['default'];

},{"../utils/format":55}],4:[function(require,module,exports){
/**
 * Is an abstract class or interface to be overriden in order to define the way
 * a given shape should behave when selected or edited by a user. Instances of
 * `BaseBehavior` are internally used by `Layer` instances to modify the data
 * according to a user interaction and a given shape. A single instance of
 * `Behavior` is created in one given shape.
 *
 * By default, the only method to override to define a new behavior for a
 * shape is the `edit` method. However, if needed in special cases, all the
 * selection handling can be overriden too.
 *
 * The flow is the following:
 * `Event`  - (forwarded to) -> `Layer` - (command) -> `Behavior` - (modify) -> `data` - (upates) -> `Shape`
 *
 * The behavior responsability is then to modify the data according to the
 * user interactions, while shapes are always a view of the current state of the
 * data.
 */
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];

var _Set = require('babel-runtime/core-js/set')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var BaseBehavior = (function () {
  function BaseBehavior() {
    _classCallCheck(this, BaseBehavior);

    this._selectedItems = new _Set(); // no duplicate in Set
    this._selectedClass = null;
    this._layer = null;
  }

  _createClass(BaseBehavior, [{
    key: 'initialize',
    value: function initialize(layer) {
      this._layer = layer;
      this._selectedClass = layer.params.selectedClassName;
    }

    /**
     * Destroy the references to the selected items.
     *
     * @type {String}
     * @todo - rename to `clearSelection` (removing the class) ?
     */
  }, {
    key: 'destroy',
    value: function destroy() {
      this._selectedItems.clear();
    }

    /**
     * The class to add to the shapes when selected.
     *
     * @type {String}
     */
  }, {
    key: 'select',

    /**
     * @param {Element} $item - The item to select.
     * @param {Object} datum - Not used in this implementation. Could be
     *    used to mark the data as selected.
     * @todo - Pass the shape object to get the accessors ?
     */
    value: function select($item, datum) {
      $item.classList.add(this.selectedClass);
      this._selectedItems.add($item);
    }

    /**
     * @param {Element} $item - The item to unselect.
     * @param {Object} datum - Not used in this implementation. Could be
     *    used to mark the data as selected.
     * @todo - Pass the shape object to get the accessors ?
     */
  }, {
    key: 'unselect',
    value: function unselect($item, datum) {
      $item.classList.remove(this.selectedClass);
      this._selectedItems['delete']($item);
    }

    /**
     * @param {Element} $item - The item to toggle selection.
     * @param {Object} datum - Not used in this implementation. Could be
     *    used to mark the data as selected.
     * @todo - Pass the shape object to get the accessors ?
     */
  }, {
    key: 'toggleSelection',
    value: function toggleSelection($item, datum) {
      var method = this._selectedItems.has($item) ? 'unselect' : 'select';
      this[method]($item);
    }

    /**
     * Interface method to override in order to define its particular behavior when
     * interacted with.
     *
     * @param {Object} renderingContext - The layer rendering context.
     * @param {BaseShape} shape - The shape object to be edited.
     * @param {Object|Array} datum - The related datum to modify.
     * @param {Number} dx - The value of the interaction in the x axis (in pixels).
     * @param {Number} dy - The value of the interaction in the y axis (in pixels).
     * @param {Element} $target - The target DOM element of the interaction.
     */
  }, {
    key: 'edit',
    value: function edit(renderingContext, shape, datum, dx, dy, $target) {
      // must be implemented in children
    }
  }, {
    key: 'selectedClass',
    set: function set(value) {
      this._selectedClass = value;
    },

    /**
     * The class to add to the shapes when selected.
     *
     * @type {String}
     */
    get: function get() {
      return this._selectedClass;
    }

    /**
     * An array containing all the selected items of the layer.
     *
     * @type {Array}
     */
  }, {
    key: 'selectedItems',
    get: function get() {
      return [].concat(_toConsumableArray(this._selectedItems));
    }
  }]);

  return BaseBehavior;
})();

exports['default'] = BaseBehavior;
module.exports = exports['default'];

},{"babel-runtime/core-js/set":74,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78,"babel-runtime/helpers/to-consumable-array":83}],5:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseBehavior = require('./base-behavior');

var _baseBehavior2 = _interopRequireDefault(_baseBehavior);

/**
 * Defines the default behavior for a breakpoint function.
 *
 * [example usage](./examples/layer-breakpoint.html)
 */

var BreakpointBehavior = (function (_BaseBehavior) {
  _inherits(BreakpointBehavior, _BaseBehavior);

  function BreakpointBehavior() {
    _classCallCheck(this, BreakpointBehavior);

    _get(Object.getPrototypeOf(BreakpointBehavior.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(BreakpointBehavior, [{
    key: 'edit',
    value: function edit(renderingContext, shape, datum, dx, dy, target) {
      var data = this._layer.data;
      var layerHeight = renderingContext.height;
      // current position
      var x = renderingContext.timeToPixel(shape.cx(datum));
      var y = renderingContext.valueToPixel(shape.cy(datum));
      // target position
      var targetX = x + dx;
      var targetY = y - dy;

      if (data.length > 2) {
        // create a sorted map of all `x` positions
        var xMap = data.map(function (d) {
          return renderingContext.timeToPixel(shape.cx(d));
        });
        xMap.sort(function (a, b) {
          return a < b ? -1 : 1;
        });
        // find index of our shape x position
        var index = xMap.indexOf(x);
        // lock to next siblings
        if (targetX < xMap[index - 1] || targetX > xMap[index + 1]) {
          targetX = x;
        }
      }

      // lock in y axis
      if (targetY < 0) {
        targetY = 0;
      } else if (targetY > layerHeight) {
        targetY = layerHeight;
      }

      // update datum with new values
      shape.cx(datum, renderingContext.timeToPixel.invert(targetX));
      shape.cy(datum, renderingContext.valueToPixel.invert(targetY));
    }
  }]);

  return BreakpointBehavior;
})(_baseBehavior2['default']);

exports['default'] = BreakpointBehavior;
module.exports = exports['default'];

},{"./base-behavior":4,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],6:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseBehavior = require('./base-behavior');

var _baseBehavior2 = _interopRequireDefault(_baseBehavior);

/**
 * Defines the default behavior for a marker.
 *
 * [example usage](./examples/layer-marker.html)
 */

var MarkerBehavior = (function (_BaseBehavior) {
  _inherits(MarkerBehavior, _BaseBehavior);

  function MarkerBehavior() {
    _classCallCheck(this, MarkerBehavior);

    _get(Object.getPrototypeOf(MarkerBehavior.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(MarkerBehavior, [{
    key: 'edit',
    value: function edit(renderingContext, shape, datum, dx, dy, target) {
      var x = renderingContext.timeToPixel(shape.x(datum));
      var targetX = x + dx > 0 ? x + dx : 0;

      shape.x(datum, renderingContext.timeToPixel.invert(targetX));
    }
  }]);

  return MarkerBehavior;
})(_baseBehavior2['default']);

exports['default'] = MarkerBehavior;
module.exports = exports['default'];

},{"./base-behavior":4,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],7:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseBehavior = require('./base-behavior');

var _baseBehavior2 = _interopRequireDefault(_baseBehavior);

/**
 * Defines the default behavior for a segment.
 *
 * [example usage](./examples/layer-marker.html)
 */

var SegmentBehavior = (function (_BaseBehavior) {
  _inherits(SegmentBehavior, _BaseBehavior);

  function SegmentBehavior() {
    _classCallCheck(this, SegmentBehavior);

    _get(Object.getPrototypeOf(SegmentBehavior.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(SegmentBehavior, [{
    key: 'edit',
    value: function edit(renderingContext, shape, datum, dx, dy, target) {
      var classList = target.classList;
      var action = 'move';

      if (classList.contains('handler') && classList.contains('left')) {
        action = 'resizeLeft';
      } else if (classList.contains('handler') && classList.contains('right')) {
        action = 'resizeRight';
      }

      this['_' + action](renderingContext, shape, datum, dx, dy, target);
    }
  }, {
    key: '_move',
    value: function _move(renderingContext, shape, datum, dx, dy, target) {
      var layerHeight = renderingContext.height;
      // current values
      var x = renderingContext.timeToPixel(shape.x(datum));
      var y = renderingContext.valueToPixel(shape.y(datum));
      var height = renderingContext.valueToPixel(shape.height(datum));
      // target values
      var targetX = Math.max(x + dx, 0);
      var targetY = y - dy;

      // lock in layer's y axis
      if (targetY < 0) {
        targetY = 0;
      } else if (targetY + height > layerHeight) {
        targetY = layerHeight - height;
      }

      shape.x(datum, renderingContext.timeToPixel.invert(targetX));
      shape.y(datum, renderingContext.valueToPixel.invert(targetY));
    }
  }, {
    key: '_resizeLeft',
    value: function _resizeLeft(renderingContext, shape, datum, dx, dy, target) {
      // current values
      var x = renderingContext.timeToPixel(shape.x(datum));
      var width = renderingContext.timeToPixel(shape.width(datum));
      // target values
      var maxTargetX = x + width;
      var targetX = x + dx < maxTargetX ? Math.max(x + dx, 0) : x;
      var targetWidth = targetX !== 0 ? Math.max(width - dx, 1) : width;

      shape.x(datum, renderingContext.timeToPixel.invert(targetX));
      shape.width(datum, renderingContext.timeToPixel.invert(targetWidth));
    }
  }, {
    key: '_resizeRight',
    value: function _resizeRight(renderingContext, shape, datum, dx, dy, target) {
      // current values
      var width = renderingContext.timeToPixel(shape.width(datum));
      // target values
      var targetWidth = Math.max(width + dx, 1);

      shape.width(datum, renderingContext.timeToPixel.invert(targetWidth));
    }
  }]);

  return SegmentBehavior;
})(_baseBehavior2['default']);

exports['default'] = SegmentBehavior;
module.exports = exports['default'];

},{"./base-behavior":4,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],8:[function(require,module,exports){
/**
 * TimeContextBehavior is used internally in Layers to modify their TimeContext.
 * This object is different from other Shapes Behaviors and exists mostly to decrease the size of the Layer.
 * All the code here could be considered as part of the layer.
 */
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var TimeContextBehavior = (function () {
  function TimeContextBehavior() {
    _classCallCheck(this, TimeContextBehavior);
  }

  _createClass(TimeContextBehavior, [{
    key: 'edit',
    value: function edit(layer, dx, dy, target) {
      var timeContext = layer.timeContext;

      if (target.classList.contains('handler') && target.classList.contains('left')) {
        this._editLeft(timeContext, dx);
      } else if (target.classList.contains('handler') && target.classList.contains('right')) {
        this._editRight(timeContext, dx);
      } else if (target.classList.contains('segment')) {
        this._move(timeContext, dx);
      }
    }
  }, {
    key: '_editLeft',
    value: function _editLeft(timeContext, dx) {
      // edit `start`, `offset` and `duration`
      var x = timeContext.parent.timeToPixel(timeContext.start);
      var offset = timeContext.timeToPixel(timeContext.offset);
      var width = timeContext.timeToPixel(timeContext.duration);

      var targetX = x + dx;
      var targetOffset = offset - dx;
      var targetWidth = Math.max(width - dx, 1);

      timeContext.start = timeContext.parent.timeToPixel.invert(targetX);
      timeContext.offset = timeContext.timeToPixel.invert(targetOffset);
      timeContext.duration = timeContext.timeToPixel.invert(targetWidth);
    }
  }, {
    key: '_editRight',
    value: function _editRight(timeContext, dx) {
      var width = timeContext.timeToPixel(timeContext.duration);
      var targetWidth = Math.max(width + dx, 1);

      timeContext.duration = timeContext.timeToPixel.invert(targetWidth);
    }
  }, {
    key: '_move',
    value: function _move(timeContext, dx) {
      var x = timeContext.parent.timeToPixel(timeContext.start);
      var targetX = Math.max(x + dx, 0);

      timeContext.start = timeContext.parent.timeToPixel.invert(targetX);
    }
  }, {
    key: 'stretch',
    value: function stretch(layer, dx, dy, target) {
      var timeContext = layer.timeContext;
      var lastDuration = timeContext.duration;
      var lastOffset = timeContext.offset;

      this.edit(layer, dx, dy, target);

      var newDuration = timeContext.duration;
      var ratio = newDuration / lastDuration;

      timeContext.stretchRatio *= ratio;
      timeContext.offset = lastOffset;
      timeContext.duration = lastDuration;
    }
  }]);

  return TimeContextBehavior;
})();

exports['default'] = TimeContextBehavior;
module.exports = exports['default'];

},{"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78}],9:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseBehavior = require('./base-behavior');

var _baseBehavior2 = _interopRequireDefault(_baseBehavior);

/**
 * Defines the default behavior for a trace visualization.
 *
 * [example usage](./examples/layer-trace.html)
 */

var TraceBehavior = (function (_BaseBehavior) {
  _inherits(TraceBehavior, _BaseBehavior);

  function TraceBehavior() {
    _classCallCheck(this, TraceBehavior);

    _get(Object.getPrototypeOf(TraceBehavior.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(TraceBehavior, [{
    key: 'edit',
    value: function edit(renderingContext, shape, datum, dx, dy, target) {
      if (target.classList.contains('min')) {
        this._editRange(renderingContext, shape, datum, dx, dy, 'min');
      } else if (target.classList.contains('max')) {
        this._editRange(renderingContext, shape, datum, dx, dy, 'max');
      } else {
        this._editMean(renderingContext, shape, datum, dx, dy);
      }
    }
  }, {
    key: '_editMean',
    value: function _editMean(renderingContext, shape, datum, dx, dy) {
      // work in pixel domain
      var x = renderingContext.timeToPixel(shape.x(datum));
      var y = renderingContext.valueToPixel(shape.mean(datum));

      var targetX = x + dx;
      var targetY = y - dy;

      shape.x(datum, renderingContext.timeToPixel.invert(targetX));
      shape.mean(datum, renderingContext.valueToPixel.invert(targetY));
    }
  }, {
    key: '_editRange',
    value: function _editRange(renderingContext, shape, datum, dx, dy, rangeSide) {
      var range = renderingContext.valueToPixel(shape.range(datum));

      var targetRange = rangeSide === 'min' ? range + 2 * dy : range - 2 * dy;
      targetRange = Math.max(targetRange, 0);

      shape.range(datum, renderingContext.valueToPixel.invert(targetRange));
    }
  }]);

  return TraceBehavior;
})(_baseBehavior2['default']);

exports['default'] = TraceBehavior;
module.exports = exports['default'];

},{"./base-behavior":4,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],10:[function(require,module,exports){
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _utilsScales = require('../utils/scales');

var _utilsScales2 = _interopRequireDefault(_utilsScales);

/**
 * A `LayerTimeContext` instance represents a time segment into a `TimelineTimeContext`.
 * It must be attached to a `TimelineTimeContext` (the one of the timeline it
 * belongs to). It relies on its parent's `timeToPixel` (time to pixel transfert
 * function) to create the time to pixel representation of the Layer (the view) it is attached to.
 *
 * The `layerTimeContext` has four important attributes:
 * - `start` represent the time at which temporal data must be represented
 *   in the timeline (for instance the begining of a soundfile in a DAW).
 * - `offset` represents offset time of the data in the context of a Layer.
 *   (@TODO give a use case example here "crop ?", and/or explain that it's not a common use case).
 * - `duration` is the duration of the view on the data.
 * - `stretchRatio` is the stretch applyed to the temporal data contained in
 *   the view (this value can be seen as a local zoom on the data, or as a stretch
 *   on the time components of the data). When applyed, the stretch ratio maintain
 *   the start position of the view in the timeline.
 *
 * ```
 * + timeline -----------------------------------------------------------------
 * 0         5         10          15          20        25          30 seconds
 * +---+*****************+------------------------------------------+*******+--
 *     |*** soundfile ***|Layer (view on the sound file)            |*******|
 *     +*****************+------------------------------------------+*******+
 *
 *     <---- offset ----><--------------- duration ----------------->
 * <-------- start ----->
 *
 * The parts of the sound file represented with '*' are hidden from the view
 * ```
 *
 * [example usage](./examples/time-contexts.html)
 */

var LayerTimeContext = (function () {
  /**
   * @param {TimelineTimeContext} parent - The `TimelineTimeContext` instance of the timeline.
   */

  function LayerTimeContext(parent) {
    _classCallCheck(this, LayerTimeContext);

    if (!parent) {
      throw new Error('LayerTimeContext must have a parent');
    }

    /**
     * The `TimelineTimeContext` instance of the timeline.
     *
     * @type {TimelineTimeContext}
     */
    this.parent = parent;

    this._timeToPixel = null;
    this._start = 0;
    this._duration = parent.visibleDuration;
    this._offset = 0;
    this._stretchRatio = 1;
    // register into the timeline's TimeContext
    this.parent._children.push(this);
  }

  /**
   * Creates a clone of the current time context.
   *
   * @return {LayerTimeContext}
   */

  _createClass(LayerTimeContext, [{
    key: 'clone',
    value: function clone() {
      var ctx = new this();

      ctx.parent = this.parent;
      ctx.start = this.start;
      ctx.duration = this.duration;
      ctx.offset = this.offset;
      ctx.stretchRatio = this.stretchRatio; // creates the local scale if needed

      return ctx;
    }

    /**
     * Returns the start position of the time context (in seconds).
     *
     * @type {Number}
     */
  }, {
    key: 'pixelToTime',

    /**
     * Helper function to convert pixel to time.
     *
     * @param {Number} px
     * @return {Number}
     */
    value: function pixelToTime(px) {
      if (!this._timeToPixel) {
        return this.parent.timeToPixel.invert(px);
      }

      return this._timeToPixel.invert(px);
    }
  }, {
    key: 'start',
    get: function get() {
      return this._start;
    },

    /**
     * Sets the start position of the time context (in seconds).
     *
     * @type {Number}
     */
    set: function set(value) {
      this._start = value;
    }

    /**
     * Returns the duration of the time context (in seconds).
     *
     * @type {Number}
     */
  }, {
    key: 'duration',
    get: function get() {
      return this._duration;
    },

    /**
     * Sets the duration of the time context (in seconds).
     *
     * @type {Number}
     */
    set: function set(value) {
      this._duration = value;
    }

    /**
     * Returns the offset of the time context (in seconds).
     *
     * @type {Number}
     */
  }, {
    key: 'offset',
    get: function get() {
      return this._offset;
    },

    /**
     * Sets the offset of the time context (in seconds).
     *
     * @type {Number}
     */
    set: function set(value) {
      this._offset = value;
    }

    /**
     * Returns the stretch ratio of the time context.
     *
     * @type {Number}
     */
  }, {
    key: 'stretchRatio',
    get: function get() {
      return this._stretchRatio;
    },

    /**
     * Sets the stretch ratio of the time context.
     *
     * @type {Number}
     */
    set: function set(value) {
      // remove local scale if ratio = 1
      if (value === 1) {
        this._timeToPixel = null;
        return;
      }
      // reuse previsously created local scale if exists
      var timeToPixel = this._timeToPixel ? this._timeToPixel : _utilsScales2['default'].linear().domain([0, 1]);

      timeToPixel.range([0, this.parent.computedPixelsPerSecond * value]);

      this._timeToPixel = timeToPixel;
      this._stretchRatio = value;
    }

    /**
     * Returns the time to pixel transfert function of the time context. If
     * the `stretchRatio` attribute is equal to 1, this function is the global
     * one from the `TimelineTimeContext` instance.
     *
     * @type {Function}
     */
  }, {
    key: 'timeToPixel',
    get: function get() {
      if (!this._timeToPixel) {
        return this.parent.timeToPixel;
      }

      return this._timeToPixel;
    }
  }]);

  return LayerTimeContext;
})();

exports['default'] = LayerTimeContext;
module.exports = exports['default'];

},{"../utils/scales":60,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78,"babel-runtime/helpers/interop-require-default":81}],11:[function(require,module,exports){
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
 *     <g class="offset" transform="translate(${offset, 0})">
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
    this.$offset = null;
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
      var _this = this;

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
      // group to apply offset
      this.$offset = document.createElementNS(_namespace2['default'], 'g');
      this.$offset.classList.add('offset', 'items');
      // layer background
      this.$background = document.createElementNS(_namespace2['default'], 'rect');
      this.$background.setAttributeNS(null, 'height', '100%');
      this.$background.setAttributeNS(null, 'width', '100%');
      this.$background.classList.add('background');
      this.$background.style.fillOpacity = 0;
      this.$background.style.pointerEvents = 'none';
      // context interactions
      this.$interactions = document.createElementNS(_namespace2['default'], 'g');
      this.$interactions.classList.add('interactions');
      this.$interactions.style.display = 'none';
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
      // create the DOM tree
      this.$el.appendChild(this.$boundingBox);
      this.$boundingBox.appendChild(this.$offset);
      this.$offset.appendChild(this.$background);
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
     * Optionnaly register a shape to be used accros the entire collection.
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
     * Updates the values stored int the `_renderingContext` passed  to shapes
     * for rendering and updating.
     */
  }, {
    key: '_updateRenderingContext',
    value: function _updateRenderingContext() {

      this._renderingContext.timeToPixel = this.timeContext.timeToPixel;
      this._renderingContext.valueToPixel = this._valueToPixel;

      this._renderingContext.height = this.params.height;
      this._renderingContext.width = this.timeContext.timeToPixel(this.timeContext.duration);
      // for foreign object issue in chrome
      this._renderingContext.offsetX = this.timeContext.timeToPixel(this.timeContext.offset);
      this._renderingContext.startX = this.timeContext.parent.timeToPixel(this.timeContext.start);

      this._renderingContext.trackOffsetX = this.timeContext.parent.timeToPixel(this.timeContext.parent.offset);
      this._renderingContext.visibleWidth = this.timeContext.parent.visibleWidth;

      // and calculate the visible area, storing it so shapes can
      // determine which bits they need to redraw
      // @TODO refactor this ununderstandable mess

      var minX = Math.max(-this._renderingContext.offsetX, 0);

      var trackDecay = this._renderingContext.trackOffsetX + this._renderingContext.startX;
      if (trackDecay < 0) {
        minX = -trackDecay;
      }

      var maxX = minX;
      maxX += this._renderingContext.width - minX < this._renderingContext.visibleWidth ? this._renderingContext.width : this._renderingContext.visibleWidth;

      this._renderingContext.minX = minX;
      this._renderingContext.maxX = maxX;
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

      var display = bool ? 'block' : 'none';
      this.$interactions.style.display = display;
      this._isContextEditable = bool;
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
     * @param {Object} area - The area in which to find the elements
     * @param {Number} area.top
     * @param {Number} area.left
     * @param {Number} area.width
     * @param {Number} area.height
     * @return {Array} - list of the items presents in the area
     */
  }, {
    key: 'getItemsInArea',
    value: function getItemsInArea(area) {
      var start = this.timeContext.parent.timeToPixel(this.timeContext.start);
      var duration = this.timeContext.timeToPixel(this.timeContext.duration);
      var offset = this.timeContext.timeToPixel(this.timeContext.offset);
      var top = this.params.top;
      // be aware af context's translations - constrain in working view
      var x1 = Math.max(area.left, start);
      var x2 = Math.min(area.left + area.width, start + duration);
      x1 -= start + offset;
      x2 -= start + offset;
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
      this.$offset.appendChild($item);
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
        this.$offset.appendChild($group);
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

        this.$offset.appendChild(fragment);
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

          this.$offset.removeChild($item);
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
      this.updateContainer();
      this.updateShapes();
    }

    /**
     * Updates the container of the layer.
     */
  }, {
    key: 'updateContainer',
    value: function updateContainer() {
      this._updateRenderingContext();

      var timeContext = this.timeContext;
      var width = timeContext.timeToPixel(timeContext.duration);
      // x is relative to timeline's timeContext
      var x = timeContext.parent.timeToPixel(timeContext.start);
      var offset = timeContext.timeToPixel(timeContext.offset);
      var top = this.params.top;
      var height = this.params.height;
      // matrix to invert the coordinate system
      var translateMatrix = 'matrix(1, 0, 0, -1, ' + x + ', ' + (top + height) + ')';

      this.$el.setAttributeNS(null, 'transform', translateMatrix);

      this.$boundingBox.setAttributeNS(null, 'width', width);
      this.$boundingBox.setAttributeNS(null, 'height', height);
      this.$boundingBox.style.opacity = this.params.opacity;

      this.$offset.setAttributeNS(null, 'transform', 'translate(' + offset + ', 0)');
      // maintain context shape
      this.contextShape.update(this._renderingContext, this.timeContext, 0);
    }

    /**
     * Updates the attributes of all the `Shape` instances rendered into the layer.
     */
  }, {
    key: 'updateShapes',
    value: function updateShapes() {
      var _this3 = this;

      var before = performance.now();

      this._updateRenderingContext();

      if (this.dataType === 'entity') {
        if (!this._cached) {
          if (this._data !== []) {
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
                    console.log("replacing our entity data with cached value");
                    this._$itemDataMap.set($item, cache);
                    if (typeof origData.dispose !== 'undefined') {
                      console.log("and calling dispose on entity data");
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
        }
      }

      // Update common shape, if any
      this._$itemCommonShapeMap.forEach(function (shape, $item) {
        shape.update(_this3._renderingContext, _this3.data);
      });

      console.log("item data map contains " + this._$itemDataMap.size + " entries");

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

},{"../behaviors/time-context-behavior":8,"../shapes/segment":42,"../utils/scales":60,"./namespace":12,"babel-runtime/core-js/array/from":62,"babel-runtime/core-js/get-iterator":63,"babel-runtime/core-js/map":65,"babel-runtime/core-js/object/assign":67,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81,"babel-runtime/helpers/sliced-to-array":82,"events":177}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = 'http://www.w3.org/2000/svg';
module.exports = exports['default'];

},{}],13:[function(require,module,exports){
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _utilsScales = require('../utils/scales');

var _utilsScales2 = _interopRequireDefault(_utilsScales);

/**
 * Defines and maintains global aspects of the visualization concerning the
 * relations between time and pixels.
 *
 * The `TimelineTimeContext` instance (unique across a visualization) keeps the
 * main reference on how many pixels should be used to represent one second
 * though its `timeToPixel` method. The attributes `zoom`, `offset` (i.e. from
 * origin) and `visibleWidth` allow for navigating in time and for maintaining
 * view consistency upon the DOM structure (`<svg>` and `<g>` tags) created by
 * the registered tracks.
 *
 * It also maintain an array of all references to `LayerTimeContext` instances
 * to propagate to `layers`, changes made on the time to pixel representation.
 *
 * [example usage](./examples/time-contexts.html)
 */

var TimelineTimeContext = (function () {
  /**
   * @param {Number} pixelsPerSecond - The number of pixels that should be
   *    used to display one second.
   * @param {Number} visibleWidth - The default with of the visible area
   *    displayed in `tracks` (in pixels).
   */

  function TimelineTimeContext(pixelsPerSecond, visibleWidth) {
    _classCallCheck(this, TimelineTimeContext);

    this._children = [];

    this._timeToPixel = null;
    this._offset = 0;
    this._zoom = 1;
    this._computedPixelsPerSecond = pixelsPerSecond;
    // params
    this._visibleWidth = visibleWidth;
    this._maintainVisibleDuration = false;

    // create the timeToPixel scale
    var scale = _utilsScales2['default'].linear().domain([0, 1]).range([0, pixelsPerSecond]);

    this._timeToPixel = scale;

    this._originalPixelsPerSecond = this._computedPixelsPerSecond;
  }

  /**
   * Returns the number of pixels per seconds ignoring the current zoom value.
   *
   * @type {Number}
   */

  _createClass(TimelineTimeContext, [{
    key: '_updateTimeToPixelRange',
    value: function _updateTimeToPixelRange() {
      this.timeToPixel.range([0, this._computedPixelsPerSecond]);
    }
  }, {
    key: 'pixelsPerSecond',
    get: function get() {
      return this._originalPixelsPerSecond;
    },

    /**
     * Updates all the caracteristics of this object according to the new
     * given value of pixels per seconds. Propagates the changes to the
     * `LayerTimeContext` children.
     *
     * @type {Number}
     */
    set: function set(value) {
      this._computedPixelsPerSecond = value * this.zoom;
      this._originalPixelsPerSecond = value;
      this._updateTimeToPixelRange();

      // force children scale update
      this._children.forEach(function (child) {
        if (child.stretchRatio === 1) {
          return;
        }
        child.stretchRatio = child.stretchRatio;
      });
    }

    /**
     * Returns the number of pixels per seconds including the current zoom value.
     *
     * @type {Number}
     */
  }, {
    key: 'computedPixelsPerSecond',
    get: function get() {
      return this._computedPixelsPerSecond;
    }

    /**
     * Returns the current offset applied to the registered `Track` instances
     * from origin (in seconds).
     *
     * @type {Number}
     */
  }, {
    key: 'offset',
    get: function get() {
      return this._offset;
    },

    /**
     * Sets the offset to apply to the registered `Track` instances from origin
     * (in seconds).
     *
     * @type {Number}
     */
    set: function set(value) {
      this._offset = value;
    }

    /**
     * Returns the current zoom level applied to the whole visualization.
     *
     * @type {Number}
     */
  }, {
    key: 'zoom',
    get: function get() {
      return this._zoom;
    },

    /**
     * Sets the zoom ratio for the whole visualization.
     *
     * @type {Number}
     */
    set: function set(value) {
      // Compute change to propagate to children who have their own timeToPixel
      var ratioChange = value / this._zoom;
      this._zoom = value;
      this._computedPixelsPerSecond = this._originalPixelsPerSecond * value;
      this._updateTimeToPixelRange();

      this._children.forEach(function (child) {
        if (child.stretchRatio === 1) {
          return;
        }
        child.stretchRatio = child.stretchRatio * ratioChange;
      });
    }

    /**
     * Returns the visible width of the `Track` instances.
     *
     * @type {Number}
     */
  }, {
    key: 'visibleWidth',
    get: function get() {
      return this._visibleWidth;
    },

    /**
     * Sets the visible width of the `Track` instances.
     *
     * @type {Number}
     */
    set: function set(value) {
      var widthRatio = value / this.visibleWidth;
      this._visibleWidth = value;

      if (this.maintainVisibleDuration) {
        this.pixelsPerSecond = this._computedPixelsPerSecond * widthRatio;
      }
    }

    /**
     * Returns the duration displayed by `Track` instances.
     *
     * @type {Number}
     */
  }, {
    key: 'visibleDuration',
    get: function get() {
      return this.visibleWidth / this._computedPixelsPerSecond;
    }

    /**
     * Returns if the duration displayed by tracks should be maintained when
     * their width is updated.
     *
     * @type {Number}
     */
  }, {
    key: 'maintainVisibleDuration',
    get: function get() {
      return this._maintainVisibleDuration;
    },

    /**
     * Defines if the duration displayed by tracks should be maintained when
     * their width is updated.
     *
     * @type {Boolean}
     */
    set: function set(bool) {
      this._maintainVisibleDuration = bool;
    }

    /**
     * Returns the time to pixel trasfert function.
     *
     * @type {Function}
     */
  }, {
    key: 'timeToPixel',
    get: function get() {
      return this._timeToPixel;
    }
  }]);

  return TimelineTimeContext;
})();

exports['default'] = TimelineTimeContext;
module.exports = exports['default'];

},{"../utils/scales":60,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78,"babel-runtime/helpers/interop-require-default":81}],14:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Symbol$iterator = require('babel-runtime/core-js/symbol/iterator')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _interactionsKeyboard = require('../interactions/keyboard');

var _interactionsKeyboard2 = _interopRequireDefault(_interactionsKeyboard);

var _layerTimeContext = require('./layer-time-context');

var _layerTimeContext2 = _interopRequireDefault(_layerTimeContext);

var _interactionsSurface = require('../interactions/surface');

var _interactionsSurface2 = _interopRequireDefault(_interactionsSurface);

var _timelineTimeContext = require('./timeline-time-context');

var _timelineTimeContext2 = _interopRequireDefault(_timelineTimeContext);

var _track2 = require('./track');

var _track3 = _interopRequireDefault(_track2);

var _trackCollection = require('./track-collection');

var _trackCollection2 = _interopRequireDefault(_trackCollection);

/**
 * Is the main entry point to create a temporal visualization.
 *
 * A `timeline` instance mainly provides the context for any visualization of
 * temporal data and maintains the hierarchy of `Track`, `Layer` and `Shape`
 * over the entiere visualisation.
 *
 * Its main responsabilites are:
 * - maintaining the temporal consistency accross the visualisation through
 *   its `timeContext` property (instance of `TimelineTimeContext`).
 * - handling interactions to its current state (acting here as a simple
 *   state machine).
 *
 * @TODO insert figure
 *
 * It also contains a reference to all the register track allowing to `render`
 * or `update` all the layer from a single entry point.
 *
 * ## Example Usage
 *
 * ```js
 * const visibleWidth = 500; // default width in pixels for all created `Track`
 * const duration = 10; // the visible area represents 10 seconds
 * const pixelsPerSeconds = visibleWidth / duration;
 * const timeline = new ui.core.Timeline(pixelsPerSecond, width);
 * ```
 */

var Timeline = (function (_events$EventEmitter) {
  _inherits(Timeline, _events$EventEmitter);

  /**
   * @param {Number} [pixelsPerSecond=100] - the default scaling between time and pixels.
   * @param {Number} [visibleWidth=1000] - the default visible area for all registered tracks.
   */

  function Timeline() {
    var pixelsPerSecond = arguments.length <= 0 || arguments[0] === undefined ? 100 : arguments[0];
    var visibleWidth = arguments.length <= 1 || arguments[1] === undefined ? 1000 : arguments[1];

    var _ref = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    var _ref$registerKeyboard = _ref.registerKeyboard;
    var registerKeyboard = _ref$registerKeyboard === undefined ? true : _ref$registerKeyboard;

    _classCallCheck(this, Timeline);

    _get(Object.getPrototypeOf(Timeline.prototype), 'constructor', this).call(this);

    this._tracks = new _trackCollection2['default'](this);
    this._state = null;

    // default interactions
    this._surfaceCtor = _interactionsSurface2['default'];

    if (registerKeyboard) {
      this.createInteraction(_interactionsKeyboard2['default'], document);
    }

    // stores
    this._trackById = {};
    this._groupedLayers = {};

    /** @type {TimelineTimeContext} - master time context for the visualization. */
    this.timeContext = new _timelineTimeContext2['default'](pixelsPerSecond, visibleWidth);
  }

  /**
   * Returns `TimelineTimeContext`'s `offset` time domain value.
   *
   * @type {Number} [offset=0]
   */

  _createClass(Timeline, [{
    key: 'configureSurface',

    /**
     * Overrides the default `Surface` that is instanciated on each `Track`
     * instance. This methos should be called before adding any `Track` instance
     * to the current `timeline`.
     *
     * @param {EventSource} ctor - The constructor to use in order to catch mouse
     *    events on each `Track` instances.
     */
    value: function configureSurface(ctor) {
      this._surfaceCtor = ctor;
    }

    /**
     * Factory method to add interaction modules the timeline should listen to.
     * By default, the timeline instanciate a global `Keyboard` instance and a
     * `Surface` instance on each container.
     * Should be used to install new interactions implementing the `EventSource` interface.
     *
     * @param {EventSource} ctor - The contructor of the interaction module to instanciate.
     * @param {Element} $el - The DOM element which will be binded to the `EventSource` module.
     * @param {Object} [options={}] - Options to be applied to the `ctor`.
     */
  }, {
    key: 'createInteraction',
    value: function createInteraction(ctor, $el) {
      var _this = this;

      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var interaction = new ctor($el, options);
      interaction.on('event', function (e) {
        return _this._handleEvent(e);
      });
    }

    /**
     * Returns a list of the layers situated under the position of a `WaveEvent`.
     *
     * @param {WavesEvent} e - An event triggered by a `WaveEvent`
     * @return {Array} - Matched layers
     */
  }, {
    key: 'getHitLayers',
    value: function getHitLayers(e) {
      var clientX = e.originalEvent.clientX;
      var clientY = e.originalEvent.clientY;
      var layers = [];

      this.layers.forEach(function (layer) {
        if (!layer.params.hittable) {
          return;
        }
        var br = layer.$el.getBoundingClientRect();

        if (clientX > br.left && clientX < br.right && clientY > br.top && clientY < br.bottom) {
          layers.push(layer);
        }
      });

      return layers;
    }

    /**
     * The callback that is used to listen to interactions modules.
     *
     * @param {WaveEvent} e - An event generated by an interaction modules (`EventSource`).
     */
  }, {
    key: '_handleEvent',
    value: function _handleEvent(e) {
      var hitLayers = e.source === 'surface' ? this.getHitLayers(e) : null;
      // emit event as a middleware
      this.emit('event', e, hitLayers);
      // propagate to the state
      if (!this._state) {
        return;
      }
      this._state.handleEvent(e, hitLayers);
    }

    /**
     * Updates the state of the timeline.
     *
     * @type {BaseState}
     */
  }, {
    key: 'add',

    /**
     * Adds a new track to the timeline.
     *
     * @param {Track} track - The new track to be registered in the timeline.
     * @param {String} [trackId=null] - Optionnal unique id to associate with
     *    the track, this id only exists in timeline's context and should be used
     *    in conjonction with `addLayer` method.
     */
    value: function add(track) {
      var trackId = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      if (this.tracks.indexOf(track) !== -1) {
        throw new Error('track already added to the timeline');
      }

      this._registerTrackId(track, trackId);
      track.configure(this.timeContext);

      this.tracks.push(track);
      this.createInteraction(this._surfaceCtor, track.$el);
    }

    /**
     * Removes a track from the timeline.
     *
     * @param {Track} track - the track to remove from the timeline.
     * @todo not implemented.
     */
  }, {
    key: 'remove',
    value: function remove(track) {}
    // should destroy interaction too, avoid ghost eventListeners

    /**
     * Helper to create a new `Track` instance. The `track` is added,
     * rendered and updated before being returned.
     *
     * @param {Element} $el - The DOM element where the track should be inserted.
     * @param {Number} trackHeight - The height of the newly created track.
     * @param {String} [trackId=null] - Optionnal unique id to associate with
     *    the track, this id only exists in timeline's context and should be used in
     *    conjonction with `addLayer` method.
     * @return {Track}
     */

  }, {
    key: 'createTrack',
    value: function createTrack($el) {
      var trackHeight = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];
      var trackId = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

      var track = new _track3['default']($el, trackHeight);
      // Add track to the timeline
      this.add(track, trackId);
      track.render();
      track.update();

      return track;
    }

    /**
     * If track id is defined, associate a track with a unique id.
     */
  }, {
    key: '_registerTrackId',
    value: function _registerTrackId(track, trackId) {
      if (trackId !== null) {
        if (this._trackById[trackId] !== undefined) {
          throw new Error('trackId: "' + trackId + '" is already used');
        }

        this._trackById[trackId] = track;
      }
    }

    /**
     * Helper to add a `Layer` instance into a given `Track`. Is designed to be
     * used in conjonction with the `Timeline~getLayersByGroup` method. The
     * layer is internally rendered and updated.
     *
     * @param {Layer} layer - The `Layer` instance to add into the visualization.
     * @param {(Track|String)} trackOrTrackId - The `Track` instance (or its `id`
     *    as defined in the `createTrack` method) where the `Layer` instance should be inserted.
     * @param {String} [groupId='default'] - An optionnal group id in which the
     *    `Layer` should be inserted.
     * @param {Boolean} [isAxis] - Set to `true` if the added `layer` is an
     *    instance of `AxisLayer` (these layers shares the `TimlineTimeContext` instance
     *    of the timeline).
     */
  }, {
    key: 'addLayer',
    value: function addLayer(layer, trackOrTrackId) {
      var groupId = arguments.length <= 2 || arguments[2] === undefined ? 'default' : arguments[2];
      var isAxis = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

      var track = trackOrTrackId;

      if (typeof trackOrTrackId === 'string') {
        track = this.getTrackById(trackOrTrackId);
      }

      // creates the `LayerTimeContext` if not present
      if (!layer.timeContext) {
        var timeContext = isAxis ? this.timeContext : new _layerTimeContext2['default'](this.timeContext);

        layer.setTimeContext(timeContext);
      }

      // we should have a Track instance at this point
      track.add(layer);

      if (!this._groupedLayers[groupId]) {
        this._groupedLayers[groupId] = [];
      }

      this._groupedLayers[groupId].push(layer);

      layer.render();
      layer.update();
    }

    /**
     * Removes a layer from its track. The layer is detatched from the DOM but
     * can still be reused later.
     *
     * @param {Layer} layer - The layer to remove.
     */
  }, {
    key: 'removeLayer',
    value: function removeLayer(layer) {
      this.tracks.forEach(function (track) {
        var index = track.layers.indexOf(layer);
        if (index !== -1) {
          track.remove(layer);
        }
      });

      // clean references in helpers
      for (var groupId in this._groupedLayers) {
        var group = this._groupedLayers[groupId];
        var index = group.indexOf(layer);

        if (index !== -1) {
          group.splice(layer, 1);
        }

        if (!group.length) {
          delete this._groupedLayers[groupId];
        }
      }
    }

    /**
     * Returns a `Track` instance from it's given id.
     *
     * @param {String} trackId
     * @return {Track}
     */
  }, {
    key: 'getTrackById',
    value: function getTrackById(trackId) {
      return this._trackById[trackId];
    }

    /**
     * Returns the track containing a given DOM Element, returns null if no match found.
     *
     * @param {Element} $el - The DOM Element to be tested.
     * @return {Track}
     */
  }, {
    key: 'getTrackFromDOMElement',
    value: function getTrackFromDOMElement($el) {
      var $svg = null;
      var track = null;
      // find the closest `.track` element
      do {
        if ($el.classList.contains('track')) {
          $svg = $el;
        }
        $el = $el.parentNode;
      } while ($svg === null);
      // find the related `Track`
      this.tracks.forEach(function (_track) {
        if (_track.$svg === $svg) {
          track = _track;
        }
      });

      return track;
    }

    /**
     * Returns an array of layers from their given group id.
     *
     * @param {String} groupId - The id of the group as defined in `addLayer`.
     * @return {(Array|undefined)}
     */
  }, {
    key: 'getLayersByGroup',
    value: function getLayersByGroup(groupId) {
      return this._groupedLayers[groupId];
    }

    /**
     * Iterates through the added tracks.
     */
  }, {
    key: _Symbol$iterator,
    value: _regeneratorRuntime.mark(function value() {
      return _regeneratorRuntime.wrap(function value$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            return context$2$0.delegateYield(_getIterator(this.tracks), 't0', 1);

          case 1:
          case 'end':
            return context$2$0.stop();
        }
      }, value, this);
    })
  }, {
    key: 'offset',
    get: function get() {
      return this.timeContext.offset;
    },

    /**
     * Updates `TimelineTimeContext`'s `offset` time domain value.
     *
     * @type {Number} [offset=0]
     */
    set: function set(value) {
      this.timeContext.offset = value;
    }

    /**
     * Returns the `TimelineTimeContext`'s `zoom` value.
     *
     * @type {Number} [offset=0]
     */
  }, {
    key: 'zoom',
    get: function get() {
      return this.timeContext.zoom;
    },

    /**
     * Updates the `TimelineTimeContext`'s `zoom` value.
     *
     * @type {Number} [offset=0]
     */
    set: function set(value) {
      this.timeContext.zoom = value;
    }

    /**
     * Returns the `TimelineTimeContext`'s `pixelsPerSecond` ratio.
     *
     * @type {Number} [offset=0]
     */
  }, {
    key: 'pixelsPerSecond',
    get: function get() {
      return this.timeContext.pixelsPerSecond;
    },

    /**
     * Updates the `TimelineTimeContext`'s `pixelsPerSecond` ratio.
     *
     * @type {Number} [offset=0]
     */
    set: function set(value) {
      this.timeContext.pixelsPerSecond = value;
    }

    /**
     * Returns the `TimelineTimeContext`'s `visibleWidth` pixel domain value.
     *
     * @type {Number} [offset=0]
     */
  }, {
    key: 'visibleWidth',
    get: function get() {
      return this.timeContext.visibleWidth;
    },

    /**
     * Updates the `TimelineTimeContext`'s `visibleWidth` pixel domain value.
     *
     * @type {Number} [offset=0]
     */
    set: function set(value) {
      this.timeContext.visibleWidth = value;
    }

    /**
     * Returns `TimelineTimeContext`'s `timeToPixel` transfert function.
     *
     * @type {Function}
     */
  }, {
    key: 'timeToPixel',
    get: function get() {
      return this.timeContext.timeToPixel;
    }

    /**
     * Returns `TimelineTimeContext`'s `visibleDuration` helper value.
     *
     * @type {Number}
     */
  }, {
    key: 'visibleDuration',
    get: function get() {
      return this.timeContext.visibleDuration;
    }

    /**
     * Updates the `TimelineTimeContext`'s `maintainVisibleDuration` value.
     * Defines if the duration of the visible area should be maintain when
     * the `visibleWidth` attribute is updated.
     *
     * @type {Boolean}
     */
  }, {
    key: 'maintainVisibleDuration',
    set: function set(bool) {
      this.timeContext.maintainVisibleDuration = bool;
    },

    /**
     * Returns `TimelineTimeContext`'s `maintainVisibleDuration` current value.
     *
     * @type {Boolean}
     */
    get: function get() {
      return this.timeContext.maintainVisibleDuration;
    }

    /**
     * Object maintaining arrays of `Layer` instances ordered by their `groupId`.
     * Is used internally by the `TrackCollection` instance.
     *
     * @type {Object}
     */
  }, {
    key: 'groupedLayers',
    get: function get() {
      return this._groupedLayers;
    }
  }, {
    key: 'state',
    set: function set(state) {
      if (this._state) {
        this._state.exit();
      }
      this._state = state;
      if (this._state) {
        this._state.enter();
      }
    },

    /**
     * Returns the current state of the timeline.
     *
     * @type {BaseState}
     */
    get: function get() {
      return this._state;
    }

    /**
     * Returns the `TrackCollection` instance.
     *
     * @type {TrackCollection}
     */
  }, {
    key: 'tracks',
    get: function get() {
      return this._tracks;
    }

    /**
     * Returns the list of all registered layers.
     *
     * @type {Array}
     */
  }, {
    key: 'layers',
    get: function get() {
      return this._tracks.layers;
    }
  }]);

  return Timeline;
})(_events2['default'].EventEmitter);

exports['default'] = Timeline;
module.exports = exports['default'];

},{"../interactions/keyboard":31,"../interactions/surface":32,"./layer-time-context":10,"./timeline-time-context":13,"./track":16,"./track-collection":15,"babel-runtime/core-js/get-iterator":63,"babel-runtime/core-js/symbol/iterator":76,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81,"babel-runtime/regenerator":84,"events":177}],15:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _layer = require('./layer');

var _layer2 = _interopRequireDefault(_layer);

/**
 * Collection hosting all the `Track` instances registered into the timeline.
 * It provides shorcuts to trigger `render` / `update` methods on tracks or
 * layers. Extend built-in Array
 */

var TrackCollection = (function (_Array) {
  _inherits(TrackCollection, _Array);

  function TrackCollection(timeline) {
    _classCallCheck(this, TrackCollection);

    _get(Object.getPrototypeOf(TrackCollection.prototype), 'constructor', this).call(this);

    this._timeline = timeline;
  }

  // @note - should be in the timeline ?
  // @todo - allow to pass an array of layers

  _createClass(TrackCollection, [{
    key: '_getLayersOrGroups',
    value: function _getLayersOrGroups() {
      var layerOrGroup = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      var layers = null;

      if (typeof layerOrGroup === 'string') {
        layers = this._timeline.groupedLayers[layerOrGroup];
      } else if (layerOrGroup instanceof _layer2['default']) {
        layers = [layerOrGroup];
      } else {
        layers = this.layers;
      }

      return layers;
    }

    // @NOTE keep this ?
    // could prepare some vertical resizing ability
    // this should be able to modify the layers yScale to be really usefull

    /**
     * @type {Number} - Updates the height of all tracks at once.
     * @todo - Propagate to layers, not usefull for now.
     */
  }, {
    key: 'render',

    /**
     * Render all tracks and layers. When done, the timeline triggers a `render` event.
     */
    value: function render() {
      this.forEach(function (track) {
        return track.render();
      });
      this._timeline.emit('render');
    }

    /**
     * Updates all tracks and layers. When done, the timeline triggers a
     * `update` event.
     *
     * @param {Layer|String} layerOrGroup - Filter the layers to update by
     *    passing the `Layer` instance to update or a `groupId`
     */
  }, {
    key: 'update',
    value: function update(layerOrGroup) {
      var layers = this._getLayersOrGroups(layerOrGroup);
      this.forEach(function (track) {
        return track.update(layers);
      });
      this._timeline.emit('update', layers);
    }

    /**
     * Updates all `Track` containers, layers are not updated with this method.
     * When done, the timeline triggers a `update:containers` event.
     */
  }, {
    key: 'updateContainer',
    value: function updateContainer() /* trackOrTrackIds */{
      this.forEach(function (track) {
        return track.updateContainer();
      });
      this._timeline.emit('update:containers');
    }

    /**
     * Updates all layers. When done, the timeline triggers a `update:layers` event.
     *
     * @param {Layer|String} layerOrGroup - Filter the layers to update by
     *    passing the `Layer` instance to update or a `groupId`
     */
  }, {
    key: 'updateLayers',
    value: function updateLayers(layerOrGroup) {
      var layers = this._getLayersOrGroups(layerOrGroup);
      this.forEach(function (track) {
        return track.updateLayers(layers);
      });
      this._timeline.emit('update:layers', layers);
    }
  }, {
    key: 'height',
    set: function set(value) {
      this.forEach(function (track) {
        return track.height = value;
      });
    }

    /**
     * An array of all registered layers.
     *
     * @type {Array<Layer>}
     */
  }, {
    key: 'layers',
    get: function get() {
      var layers = [];
      this.forEach(function (track) {
        return layers = layers.concat(track.layers);
      });

      return layers;
    }
  }]);

  return TrackCollection;
})(Array);

exports['default'] = TrackCollection;
module.exports = exports['default'];

},{"./layer":11,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],16:[function(require,module,exports){
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _Symbol$iterator = require('babel-runtime/core-js/symbol/iterator')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _namespace = require('./namespace');

var _namespace2 = _interopRequireDefault(_namespace);

/**
 * Acts as a placeholder to organize the vertical layout of the visualization
 * and the horizontal alignement to an abscissa that correspond to a common
 * time reference. It basically offer a view on the overall timeline.
 *
 * Tracks are inserted into a given DOM element, allowing to create DAW like
 * representations. Each `Track` instance can host multiple `Layer` instances.
 * A track must be added to a timeline before being updated.
 *
 * ### A timeline with 3 tracks:
 *
 * ```
 * 0                 6                               16
 * +- - - - - - - - -+-------------------------------+- - - - - - -
 * |                 |x track 1 xxxxxxxxxxxxxxxxxxxxx|
 * +- - - - - - - - -+-------------------------------+- - - - - - -
 * |                 |x track 2 xxxxxxxxxxxxxxxxxxxxx|
 * +- - - - - - - - -+-------------------------------+- - - - - - -
 * |                 |x track 3 xxxxxxxxxxxxxxxxxxxxx|
 * +- - - - - - - - ---------------------------------+- - - - - - -
 * +----------------->
 * timeline.timeContext.timeToPixel(timeline.timeContext.offset)
 *
 *                   <------------------------------->
 *                   timeline's tracks defaults to 1000px
 *                   with a default pixelsPerSecond of 100px/s.
 *                   and a default `stretchRatio = 1`
 *                   track1 shows 10 seconds of the timeline
 * ```
 *
 * ### Track DOM structure
 *
 * ```html
 * <svg width="${visibleWidth}">
 *   <!-- background -->
 *   <rect><rect>
 *   <!-- main view -->
 *   <g class="offset" transform="translate(${offset}, 0)">
 *     <g class="layout">
 *       <!-- layers -->
 *     </g>
 *   </g>
 *   <g class="interactions"><!-- for feedback --></g>
 * </svg>
 * ```
 */

var Track = (function () {
  /**
   * @param {DOMElement} $el
   * @param {Number} [height = 100]
   */

  function Track($el) {
    var height = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];

    _classCallCheck(this, Track);

    this._height = height;

    /**
     * The DOM element in which the track is created.
     * @type {Element}
     */
    this.$el = $el;
    /**
     * A placeholder to add shapes for interactions feedback.
     * @type {Element}
     */
    this.$interactions = null;
    /** @type {Element} */
    this.$layout = null;
    /** @type {Element} */
    this.$offset = null;
    /** @type {Element} */
    this.$svg = null;
    /** @type {Element} */
    this.$background = null;

    /**
     * An array of all the layers belonging to the track.
     * @type {Array<Layer>}
     */
    this.layers = [];
    /**
     * The context used to maintain the DOM structure of the track.
     * @type {TimelineTimeContext}
     */
    this.renderingContext = null;

    this._createContainer();
  }

  /**
   * Returns the height of the track.
   *
   * @type {Number}
   */

  _createClass(Track, [{
    key: 'configure',

    /**
     * This method is called when the track is added to the timeline. The
     * track cannot be updated without being added to a timeline.
     *
     * @private
     * @param {TimelineTimeContext} renderingContext
     */
    value: function configure(renderingContext) {
      this.renderingContext = renderingContext;
    }

    /**
     * Destroy the track. The layers from this track can still be reused elsewhere.
     */
  }, {
    key: 'destroy',
    value: function destroy() {
      var _this = this;

      // Detach everything from the DOM
      this.$el.removeChild(this.$svg);
      this.layers.forEach(function (layer) {
        return _this.$layout.removeChild(layer.$el);
      });
      // clean references
      this.$el = null;
      this.renderingContext = null;
      this.layers.length = 0;
    }

    /**
     * Creates the DOM structure of the track.
     */
  }, {
    key: '_createContainer',
    value: function _createContainer() {
      var $svg = document.createElementNS(_namespace2['default'], 'svg');
      $svg.setAttributeNS(null, 'shape-rendering', 'optimizeSpeed');
      $svg.setAttributeNS(null, 'height', this.height);
      $svg.setAttribute('xmlns:xhtml', 'http://www.w3.org/1999/xhtml');
      $svg.classList.add('track');

      var $background = document.createElementNS(_namespace2['default'], 'rect');
      $background.setAttributeNS(null, 'height', '100%');
      $background.setAttributeNS(null, 'width', '100%');
      $background.style.fillOpacity = 0;
      // $background.style.pointerEvents = 'none';

      var $defs = document.createElementNS(_namespace2['default'], 'defs');

      var $offsetGroup = document.createElementNS(_namespace2['default'], 'g');
      $offsetGroup.classList.add('offset');

      var $layoutGroup = document.createElementNS(_namespace2['default'], 'g');
      $layoutGroup.classList.add('layout');

      var $interactionsGroup = document.createElementNS(_namespace2['default'], 'g');
      $interactionsGroup.classList.add('interactions');

      $offsetGroup.appendChild($layoutGroup);
      $svg.appendChild($defs);
      $svg.appendChild($background);
      $svg.appendChild($offsetGroup);
      $svg.appendChild($interactionsGroup);
      this.$el.appendChild($svg);
      // removes additionnal height added who knows why...
      this.$el.style.fontSize = 0;
      // fixes one of the (many ?) weird canvas rendering bugs in Chrome
      this.$el.style.transform = 'translateZ(0)';

      this.$layout = $layoutGroup;
      this.$offset = $offsetGroup;
      this.$interactions = $interactionsGroup;
      this.$svg = $svg;
      this.$background = $background;
    }

    /**
     * Adds a layer to the track.
     *
     * @param {Layer} layer - the layer to add to the track.
     */
  }, {
    key: 'add',
    value: function add(layer) {
      console.log(layer);
      this.layers.push(layer);
      // Create a default renderingContext for the layer if missing
      this.$layout.appendChild(layer.$el);
    }

    /**
     * Removes a layer from the track. The layer can be reused elsewhere.
     *
     * @param {Layer} layer - the layer to remove from the track.
     */
  }, {
    key: 'remove',
    value: function remove(layer) {
      this.layers.splice(this.layers.indexOf(layer), 1);
      // Removes layer from its container
      this.$layout.removeChild(layer.$el);
    }

    /**
     * Tests if a given element belongs to the track.
     *
     * @param {Element} $el
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
     * Render all the layers added to the track.
     */
  }, {
    key: 'render',
    value: function render() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _getIterator(this), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var layer = _step.value;
          layer.render();
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
     * Updates the track DOM structure and updates the layers.
     *
     * @param {Array<Layer>} [layers=null] - if not null, a subset of the layers to update.
     */
  }, {
    key: 'update',
    value: function update() {
      var layers = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      this.updateContainer();
      this.updateLayers(layers);
    }

    /**
     * Updates the track DOM structure.
     */
  }, {
    key: 'updateContainer',
    value: function updateContainer() {
      var $svg = this.$svg;
      var $offset = this.$offset;
      // Should be in some update layout
      var renderingContext = this.renderingContext;
      var height = this.height;
      var width = Math.round(renderingContext.visibleWidth);
      var offsetX = Math.round(renderingContext.timeToPixel(renderingContext.offset));
      var translate = 'translate(' + offsetX + ', 0)';

      $svg.setAttributeNS(null, 'height', height);
      $svg.setAttributeNS(null, 'width', width);
      $svg.setAttributeNS(null, 'viewbox', '0 0 ' + width + ' ' + height);

      $offset.setAttributeNS(null, 'transform', translate);
    }

    /**
     * Updates the layers.
     *
     * @param {Array<Layer>} [layers=null] - if not null, a subset of the layers to update.
     */
  }, {
    key: 'updateLayers',
    value: function updateLayers() {
      var _this2 = this;

      var layers = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      layers = layers === null ? this.layers : layers;

      layers.forEach(function (layer) {
        if (_this2.layers.indexOf(layer) === -1) {
          return;
        }
        layer.update();
      });
    }

    /**
     * Iterates through the added layers.
     */
  }, {
    key: _Symbol$iterator,
    value: _regeneratorRuntime.mark(function value() {
      return _regeneratorRuntime.wrap(function value$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            return context$2$0.delegateYield(_getIterator(this.layers), 't0', 1);

          case 1:
          case 'end':
            return context$2$0.stop();
        }
      }, value, this);
    })
  }, {
    key: 'height',
    get: function get() {
      return this._height;
    },

    /**
     * Sets the height of the track.
     *
     * @todo propagate to layers, keeping ratio? could be handy for vertical
     *    resize. This is why a set/get is implemented here.
     * @type {Number}
     */
    set: function set(value) {
      this._height = value;
    }
  }]);

  return Track;
})();

exports['default'] = Track;
module.exports = exports['default'];

},{"./namespace":12,"babel-runtime/core-js/get-iterator":63,"babel-runtime/core-js/symbol/iterator":76,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78,"babel-runtime/helpers/interop-require-default":81,"babel-runtime/regenerator":84}],17:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _shapesAnnotatedMarker = require('../shapes/annotated-marker');

var _shapesAnnotatedMarker2 = _interopRequireDefault(_shapesAnnotatedMarker);

var _coreLayer = require('../core/layer');

var _coreLayer2 = _interopRequireDefault(_coreLayer);

var _behaviorsMarkerBehavior = require('../behaviors/marker-behavior');

var _behaviorsMarkerBehavior2 = _interopRequireDefault(_behaviorsMarkerBehavior);

/**
 * Helper to create a annotated marker layer
 *
 * [example usage](./examples/layer-marker.html)
 */

var AnnotatedMarkerLayer = (function (_Layer) {
  _inherits(AnnotatedMarkerLayer, _Layer);

  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @todo - Add accessors and options for the shape.
   */

  function AnnotatedMarkerLayer(data) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, AnnotatedMarkerLayer);

    _get(Object.getPrototypeOf(AnnotatedMarkerLayer.prototype), 'constructor', this).call(this, 'collection', data, options);

    this.configureShape(_shapesAnnotatedMarker2['default']);
    this.setBehavior(new _behaviorsMarkerBehavior2['default']());
  }

  return AnnotatedMarkerLayer;
})(_coreLayer2['default']);

exports['default'] = AnnotatedMarkerLayer;
module.exports = exports['default'];

},{"../behaviors/marker-behavior":6,"../core/layer":11,"../shapes/annotated-marker":34,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],18:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreLayer = require('../core/layer');

var _coreLayer2 = _interopRequireDefault(_coreLayer);

var _shapesAnnotatedSegment = require('../shapes/annotated-segment');

var _shapesAnnotatedSegment2 = _interopRequireDefault(_shapesAnnotatedSegment);

var _behaviorsSegmentBehavior = require('../behaviors/segment-behavior');

var _behaviorsSegmentBehavior2 = _interopRequireDefault(_behaviorsSegmentBehavior);

/**
 * Helper to create a annotated segment layer.
 *
 * [example usage](./examples/layer-segment.html)
 */

var AnnotatedSegmentLayer = (function (_Layer) {
  _inherits(AnnotatedSegmentLayer, _Layer);

  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */

  function AnnotatedSegmentLayer(data) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var accessors = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, AnnotatedSegmentLayer);

    _get(Object.getPrototypeOf(AnnotatedSegmentLayer.prototype), 'constructor', this).call(this, 'collection', data, options);

    options = _Object$assign({
      displayHandlers: true,
      opacity: 0.6
    }, options);

    this.configureShape(_shapesAnnotatedSegment2['default'], accessors, {
      displayHandlers: options.displayHandlers,
      opacity: options.opacity
    });

    this.setBehavior(new _behaviorsSegmentBehavior2['default']());
  }

  return AnnotatedSegmentLayer;
})(_coreLayer2['default']);

exports['default'] = AnnotatedSegmentLayer;
module.exports = exports['default'];

},{"../behaviors/segment-behavior":7,"../core/layer":11,"../shapes/annotated-segment":35,"babel-runtime/core-js/object/assign":67,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],19:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _behaviorsBreakpointBehavior = require('../behaviors/breakpoint-behavior');

var _behaviorsBreakpointBehavior2 = _interopRequireDefault(_behaviorsBreakpointBehavior);

var _shapesDot = require('../shapes/dot');

var _shapesDot2 = _interopRequireDefault(_shapesDot);

var _coreLayer = require('../core/layer');

var _coreLayer2 = _interopRequireDefault(_coreLayer);

var _shapesLine = require('../shapes/line');

var _shapesLine2 = _interopRequireDefault(_shapesLine);

/**
 * Helper to create a breakpoint function layer.
 *
 * [example usage](./examples/layer-breakpoint.html)
 */

var BreakpointLayer = (function (_Layer) {
  _inherits(BreakpointLayer, _Layer);

  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */

  function BreakpointLayer(data) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var accessors = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, BreakpointLayer);

    _get(Object.getPrototypeOf(BreakpointLayer.prototype), 'constructor', this).call(this, 'collection', data, options);

    var color = options.color;
    var commonShapeOptions = {};

    if (color) {
      accessors.color = function () {
        return color;
      };
      commonShapeOptions.color = color;
    }

    this.configureCommonShape(_shapesLine2['default'], accessors, commonShapeOptions);
    this.configureShape(_shapesDot2['default'], accessors, {});
    this.setBehavior(new _behaviorsBreakpointBehavior2['default']());
  }

  return BreakpointLayer;
})(_coreLayer2['default']);

exports['default'] = BreakpointLayer;
module.exports = exports['default'];

},{"../behaviors/breakpoint-behavior":5,"../core/layer":11,"../shapes/dot":38,"../shapes/line":39,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],20:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreLayer = require('../core/layer');

var _coreLayer2 = _interopRequireDefault(_coreLayer);

var _shapesCursor = require('../shapes/cursor');

var _shapesCursor2 = _interopRequireDefault(_shapesCursor);

/**
 * Helper to create a cursor layer.
 *
 * [example usage](./examples/layer-cursor.html)
 */

var CursorLayer = (function (_Layer) {
  _inherits(CursorLayer, _Layer);

  /**
   * @param {Object} options - An object to configure the layer.
   */

  function CursorLayer() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, CursorLayer);

    var defaults = {
      color: 'red',
      hittable: false };

    // kind of pass through layer
    var data = { currentPosition: 0 };

    options = _Object$assign(defaults, options);
    _get(Object.getPrototypeOf(CursorLayer.prototype), 'constructor', this).call(this, 'entity', data, options);

    this.configureShape(_shapesCursor2['default'], { x: function x(d) {
        return d.currentPosition;
      } }, {
      color: options.color
    });
  }

  _createClass(CursorLayer, [{
    key: 'currentPosition',
    set: function set(value) {
      this.data[0].currentPosition = value;
    },
    get: function get() {
      return this.data[0].currentPosition;
    }
  }]);

  return CursorLayer;
})(_coreLayer2['default']);

exports['default'] = CursorLayer;
module.exports = exports['default'];

},{"../core/layer":11,"../shapes/cursor":37,"babel-runtime/core-js/object/assign":67,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],21:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _axisAxisLayer = require('../axis/axis-layer');

var _axisAxisLayer2 = _interopRequireDefault(_axisAxisLayer);

var _shapesTicks = require('../shapes/ticks');

var _shapesTicks2 = _interopRequireDefault(_shapesTicks);

var _axisGridAxisGenerator = require('../axis/grid-axis-generator');

var _axisGridAxisGenerator2 = _interopRequireDefault(_axisGridAxisGenerator);

/**
 * Helper to create a grid layer
 *
 * [example usage](./examples/layer-axis.html)
 */

var GridAxisLayer = (function (_AxisLayer) {
  _inherits(GridAxisLayer, _AxisLayer);

  /**
   * @param {Object} options - An object to configure the layer.
   */

  function GridAxisLayer(options) {
    _classCallCheck(this, GridAxisLayer);

    options = _Object$assign({
      color: 'steelblue',
      bpm: 60,
      signature: '4/4'
    }, options);

    _get(Object.getPrototypeOf(GridAxisLayer.prototype), 'constructor', this).call(this, (0, _axisGridAxisGenerator2['default'])(options.bpm, options.signature), options);

    this.configureShape(_shapesTicks2['default'], {}, {
      color: options.color
    });
  }

  return GridAxisLayer;
})(_axisAxisLayer2['default']);

exports['default'] = GridAxisLayer;
module.exports = exports['default'];

},{"../axis/axis-layer":1,"../axis/grid-axis-generator":2,"../shapes/ticks":43,"babel-runtime/core-js/object/assign":67,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],22:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _shapesDot = require('../shapes/dot');

var _shapesDot2 = _interopRequireDefault(_shapesDot);

var _coreLayer = require('../core/layer');

var _coreLayer2 = _interopRequireDefault(_coreLayer);

var _shapesLine = require('../shapes/line');

var _shapesLine2 = _interopRequireDefault(_shapesLine);

/**
 * Helper to create a line layer.
 */

var LineLayer = (function (_Layer) {
  _inherits(LineLayer, _Layer);

  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */

  function LineLayer(data) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var accessors = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, LineLayer);

    _get(Object.getPrototypeOf(LineLayer.prototype), 'constructor', this).call(this, 'entity', data, options);

    var color = options.color;
    var lineOptions = {};

    if (color) {
      accessors.color = function () {
        return color;
      };
      lineOptions.color = color;
    }

    this.configureShape(_shapesLine2['default'], accessors, lineOptions);
  }

  return LineLayer;
})(_coreLayer2['default']);

exports['default'] = LineLayer;
module.exports = exports['default'];

},{"../core/layer":11,"../shapes/dot":38,"../shapes/line":39,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],23:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreLayer = require('../core/layer');

var _coreLayer2 = _interopRequireDefault(_coreLayer);

var _shapesMarker = require('../shapes/marker');

var _shapesMarker2 = _interopRequireDefault(_shapesMarker);

var _behaviorsMarkerBehavior = require('../behaviors/marker-behavior');

var _behaviorsMarkerBehavior2 = _interopRequireDefault(_behaviorsMarkerBehavior);

/**
 * Helper to create a marker layer.
 *
 * [example usage](./examples/layer-breakpoint.html)
 */

var MarkerLayer = (function (_Layer) {
  _inherits(MarkerLayer, _Layer);

  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */

  function MarkerLayer(data) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var accessors = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, MarkerLayer);

    _get(Object.getPrototypeOf(MarkerLayer.prototype), 'constructor', this).call(this, 'collection', data, options);

    options = _Object$assign({ displayHandlers: true }, options);
    var color = options.color;
    if (color) {
      accessors.color = function () {
        return color;
      };
    }

    this.configureShape(_shapesMarker2['default'], accessors, {
      displayHandlers: options.displayHandlers
    });

    this.setBehavior(new _behaviorsMarkerBehavior2['default']());
  }

  return MarkerLayer;
})(_coreLayer2['default']);

exports['default'] = MarkerLayer;
module.exports = exports['default'];

},{"../behaviors/marker-behavior":6,"../core/layer":11,"../shapes/marker":40,"babel-runtime/core-js/object/assign":67,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],24:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreLayer = require('../core/layer');

var _coreLayer2 = _interopRequireDefault(_coreLayer);

var _shapesMatrix = require('../shapes/matrix');

var _shapesMatrix2 = _interopRequireDefault(_shapesMatrix);

var defaults = {
  normalise: 'none',
  gain: 1.0,
  channel: 0
};

/**
 * Helper to create a matrix layer.
 */

var MatrixLayer = (function (_Layer) {
  _inherits(MatrixLayer, _Layer);

  /**
   * @param {AudioBuffer} buffer - The audio buffer to display.
   * @param {Object} options - An object to configure the layer.
   */

  function MatrixLayer(matrixEntity, options) {
    _classCallCheck(this, MatrixLayer);

    options = _Object$assign({}, defaults, options);

    _get(Object.getPrototypeOf(MatrixLayer.prototype), 'constructor', this).call(this, 'entity', matrixEntity, options);

    this.configureShape(_shapesMatrix2['default'], {}, options);
  }

  return MatrixLayer;
})(_coreLayer2['default']);

exports['default'] = MatrixLayer;
module.exports = exports['default'];

},{"../core/layer":11,"../shapes/matrix":41,"babel-runtime/core-js/object/assign":67,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],25:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreLayer = require('../core/layer');

var _coreLayer2 = _interopRequireDefault(_coreLayer);

var _shapesSegment = require('../shapes/segment');

var _shapesSegment2 = _interopRequireDefault(_shapesSegment);

var _behaviorsSegmentBehavior = require('../behaviors/segment-behavior');

var _behaviorsSegmentBehavior2 = _interopRequireDefault(_behaviorsSegmentBehavior);

/**
 * Helper to create a segment layer.
 *
 * [example usage](./examples/layer-segment.html)
 */

var SegmentLayer = (function (_Layer) {
  _inherits(SegmentLayer, _Layer);

  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */

  function SegmentLayer(data) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var accessors = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, SegmentLayer);

    _get(Object.getPrototypeOf(SegmentLayer.prototype), 'constructor', this).call(this, 'collection', data, options);

    options = _Object$assign({
      displayHandlers: true,
      opacity: 0.6
    }, options);

    this.configureShape(_shapesSegment2['default'], accessors, {
      displayHandlers: options.displayHandlers,
      opacity: options.opacity
    });

    this.setBehavior(new _behaviorsSegmentBehavior2['default']());
  }

  return SegmentLayer;
})(_coreLayer2['default']);

exports['default'] = SegmentLayer;
module.exports = exports['default'];

},{"../behaviors/segment-behavior":7,"../core/layer":11,"../shapes/segment":42,"babel-runtime/core-js/object/assign":67,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],26:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreLayer = require('../core/layer');

var _coreLayer2 = _interopRequireDefault(_coreLayer);

var _shapesTicks = require('../shapes/ticks');

var _shapesTicks2 = _interopRequireDefault(_shapesTicks);

/**
 * Helper to create a tick layer. Can be seen as a grid axis with user defined data
 * or as a marker layer with entity based data.
 */

var TickLayer = (function (_Layer) {
  _inherits(TickLayer, _Layer);

  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */

  function TickLayer(data, options, accessors) {
    _classCallCheck(this, TickLayer);

    options = _Object$assign({}, options);

    _get(Object.getPrototypeOf(TickLayer.prototype), 'constructor', this).call(this, 'entity', data, options);

    var config = options.color ? { color: options.color } : undefined;
    this.configureShape(_shapesTicks2['default'], accessors, config);
  }

  return TickLayer;
})(_coreLayer2['default']);

exports['default'] = TickLayer;
module.exports = exports['default'];

},{"../core/layer":11,"../shapes/ticks":43,"babel-runtime/core-js/object/assign":67,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],27:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _axisAxisLayer = require('../axis/axis-layer');

var _axisAxisLayer2 = _interopRequireDefault(_axisAxisLayer);

var _shapesTicks = require('../shapes/ticks');

var _shapesTicks2 = _interopRequireDefault(_shapesTicks);

var _axisTimeAxisGenerator = require('../axis/time-axis-generator');

var _axisTimeAxisGenerator2 = _interopRequireDefault(_axisTimeAxisGenerator);

/**
 * Helper to create a time axis layer
 *
 * [example usage](./examples/layer-axis.html)
 */

var TimeAxisLayer = (function (_AxisLayer) {
  _inherits(TimeAxisLayer, _AxisLayer);

  /**
   * @param {Object} options - An object to configure the layer.
   */

  function TimeAxisLayer(options) {
    _classCallCheck(this, TimeAxisLayer);

    options = _Object$assign({ color: 'steelblue' }, options);
    _get(Object.getPrototypeOf(TimeAxisLayer.prototype), 'constructor', this).call(this, (0, _axisTimeAxisGenerator2['default'])(), options);

    this.configureShape(_shapesTicks2['default'], {}, {
      color: options.color
    });
  }

  return TimeAxisLayer;
})(_axisAxisLayer2['default']);

exports['default'] = TimeAxisLayer;
module.exports = exports['default'];

},{"../axis/axis-layer":1,"../axis/time-axis-generator":3,"../shapes/ticks":43,"babel-runtime/core-js/object/assign":67,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],28:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreLayer = require('../core/layer');

var _coreLayer2 = _interopRequireDefault(_coreLayer);

var _shapesTracePath = require('../shapes/trace-path');

var _shapesTracePath2 = _interopRequireDefault(_shapesTracePath);

var _shapesTraceDots = require('../shapes/trace-dots');

var _shapesTraceDots2 = _interopRequireDefault(_shapesTraceDots);

var _behaviorsTraceBehavior = require('../behaviors/trace-behavior');

var _behaviorsTraceBehavior2 = _interopRequireDefault(_behaviorsTraceBehavior);

/**
 * Helper to create a trace layer.
 *
 * [example usage](./examples/layer-trace.html)
 */

var TraceLayer = (function (_Layer) {
  _inherits(TraceLayer, _Layer);

  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */

  function TraceLayer(data) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var accessors = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, TraceLayer);

    options = _Object$assign({ displayDots: true }, options);
    _get(Object.getPrototypeOf(TraceLayer.prototype), 'constructor', this).call(this, options.displayDots ? 'collection' : 'entity', data, options);

    var shapeOptions = {};
    if (options.meanColor !== undefined) {
      shapeOptions.meanColor = options.meanColor;
    }
    if (options.rangeColor !== undefined) {
      shapeOptions.rangeColor = options.rangeColor;
    }
    if (options.displayMean !== undefined) {
      shapeOptions.displayMean = options.displayMean;
    }

    if (options.displayDots) {
      this.configureCommonShape(_shapesTracePath2['default'], accessors, shapeOptions);
      this.configureShape(_shapesTraceDots2['default'], accessors, shapeOptions);
    } else {
      this.configureShape(_shapesTracePath2['default'], accessors, shapeOptions);
    }

    this.setBehavior(new _behaviorsTraceBehavior2['default']());
  }

  return TraceLayer;
})(_coreLayer2['default']);

exports['default'] = TraceLayer;
module.exports = exports['default'];

},{"../behaviors/trace-behavior":9,"../core/layer":11,"../shapes/trace-dots":44,"../shapes/trace-path":45,"babel-runtime/core-js/object/assign":67,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],29:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreLayer = require('../core/layer');

var _coreLayer2 = _interopRequireDefault(_coreLayer);

var _shapesWaveform = require('../shapes/waveform');

var _shapesWaveform2 = _interopRequireDefault(_shapesWaveform);

var defaults = {
  yDomain: [-1, 1],
  channel: 0,
  color: 'steelblue',
  renderingStrategy: 'svg'
};

/**
 * Helper to create a waveform layer.
 *
 * [example usage](./examples/layer-waveform.html)
 */

var WaveformLayer = (function (_Layer) {
  _inherits(WaveformLayer, _Layer);

  /**
   * @param {AudioBuffer} buffer - The audio buffer to display.
   * @param {Object} options - An object to configure the layer.
   */

  function WaveformLayer(buffer, options) {
    _classCallCheck(this, WaveformLayer);

    options = _Object$assign({}, defaults, options);

    _get(Object.getPrototypeOf(WaveformLayer.prototype), 'constructor', this).call(this, 'entity', buffer.getChannelData(options.channel), options);

    this.configureShape(_shapesWaveform2['default'], {}, {
      sampleRate: buffer.sampleRate,
      color: options.color,
      renderingStrategy: options.renderingStrategy
    });
  }

  return WaveformLayer;
})(_coreLayer2['default']);

exports['default'] = WaveformLayer;
module.exports = exports['default'];

},{"../core/layer":11,"../shapes/waveform":46,"babel-runtime/core-js/object/assign":67,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],30:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

/**
 * Abstract class to extend to create new sources of interactions.
 * A `Surface` and `Keyboard` event sources are provided.
 */

var EventSource = (function (_events$EventEmitter) {
  _inherits(EventSource, _events$EventEmitter);

  function EventSource($el) {
    _classCallCheck(this, EventSource);

    _get(Object.getPrototypeOf(EventSource.prototype), 'constructor', this).call(this);
    /**
     * The element on which the listener is added
     * @type {Element}
     */
    this.$el = $el;

    this._bindEvents();
  }

  _createClass(EventSource, [{
    key: '_createEvent',
    value: function _createEvent(type, e) {}
  }, {
    key: '_bindEvents',
    value: function _bindEvents() {}
  }]);

  return EventSource;
})(_events2['default'].EventEmitter);

exports['default'] = EventSource;
module.exports = exports['default'];

},{"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81,"events":177}],31:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _eventSource = require('./event-source');

var _eventSource2 = _interopRequireDefault(_eventSource);

var _waveEvent = require('./wave-event');

var _waveEvent2 = _interopRequireDefault(_waveEvent);

/**
 * A global event sourve for the keyboard. Only one instance of this source
 * can be created. The first created timeline instanciate the singleton, each
 * subsequent instanciation returns the first created instance.
 */

var Keyboard = (function (_EventSource) {
  _inherits(Keyboard, _EventSource);

  /**
   * @param {Element} $el - The element on which to install the listener.
   */

  function Keyboard($el) {
    _classCallCheck(this, Keyboard);

    // kind of singleton
    if (Keyboard._instance) {
      return Keyboard._instance;
    }

    _get(Object.getPrototypeOf(Keyboard.prototype), 'constructor', this).call(this, $el);
    /**
     * The name of the source
     * @type {String}
     */
    this.sourceName = 'keyboard';

    Keyboard._instance = this;
  }

  _createClass(Keyboard, [{
    key: '_createEvent',
    value: function _createEvent(type, e) {
      var event = new _waveEvent2['default'](this.sourceName, type, e);

      event.shiftKey = e.shiftKey;
      event.ctrlKey = e.ctrlKey;
      event.altKey = e.altKey;
      event.metaKey = e.metaKey;
      event.char = String.fromCharCode(e.keyCode);

      return event;
    }
  }, {
    key: '_bindEvents',
    value: function _bindEvents() {
      var _this = this;

      var onKeyDown = function onKeyDown(e) {
        var event = _this._createEvent('keydown', e);
        _this.emit('event', event);
      };

      var onKeyUp = function onKeyUp(e) {
        var event = _this._createEvent('keyup', e);
        _this.emit('event', event);
      };

      this.$el.addEventListener('keydown', onKeyDown, false);
      this.$el.addEventListener('keyup', onKeyUp, false);
    }
  }]);

  return Keyboard;
})(_eventSource2['default']);

exports['default'] = Keyboard;
module.exports = exports['default'];

},{"./event-source":30,"./wave-event":33,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],32:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _eventSource = require('./event-source');

var _eventSource2 = _interopRequireDefault(_eventSource);

var _waveEvent = require('./wave-event');

var _waveEvent2 = _interopRequireDefault(_waveEvent);

/**
 * Normalizes mouse user interactions with the timeline upon the DOM
 * container element of `Track` instances. As soon as a `track` is added to a
 * `timeline`, its attached `Surface` instance will emit the mouse events.
 */

var Surface = (function (_EventSource) {
  _inherits(Surface, _EventSource);

  /**
   * @param {DOMElement} el - The DOM element to listen.
   * @todo - Add some padding to the surface.
   */

  function Surface($el) {
    _classCallCheck(this, Surface);

    _get(Object.getPrototypeOf(Surface.prototype), 'constructor', this).call(this, $el);

    /**
     * The name of the event source.
     * @type {String}
     */
    this.sourceName = 'surface';
    this._mouseDownEvent = null;
    this._lastEvent = null;
  }

  /**
   * Factory method for `Event` class
   */

  _createClass(Surface, [{
    key: '_createEvent',
    value: function _createEvent(type, e) {
      var event = new _waveEvent2['default'](this.sourceName, type, e);

      var pos = this._getRelativePosition(e);
      event.x = pos.x;
      event.y = pos.y;

      return event;
    }

    /**
     * Returns the x, y coordinates coordinates relative to the surface element.
     *
     * @param {Event} e - Raw event from listener.
     * @return {Object}
     * @todo - handle padding.
     */
  }, {
    key: '_getRelativePosition',
    value: function _getRelativePosition(e) {
      // @TODO: should be able to ignore padding
      var x = 0;
      var y = 0;
      var clientRect = this.$el.getBoundingClientRect();
      var scrollLeft = document.body.scrollLeft + document.documentElement.scrollLeft;
      var scrollTop = document.body.scrollTop + document.documentElement.scrollTop;

      // Adapted from http://www.quirksmode.org/js/events_properties.html#position
      if (e.pageX || e.pageY) {
        x = e.pageX;
        y = e.pageY;
      } else if (e.clientX || e.clientY) {
        // Normalize to pageX, pageY
        x = e.clientX + scrollLeft;
        y = e.clientY + scrollTop;
      }

      // clientRect refers to the client, not to the page
      x = x - (clientRect.left + scrollLeft);
      y = y - (clientRect.top + scrollTop);

      return { x: x, y: y };
    }
  }, {
    key: '_defineArea',
    value: function _defineArea(e, mouseDownEvent, lastEvent) {
      if (!mouseDownEvent || !lastEvent) {
        return;
      }
      e.dx = e.x - lastEvent.x;
      e.dy = e.y - lastEvent.y;

      var left = mouseDownEvent.x < e.x ? mouseDownEvent.x : e.x;
      var top = mouseDownEvent.y < e.y ? mouseDownEvent.y : e.y;
      var width = Math.abs(Math.round(e.x - mouseDownEvent.x));
      var height = Math.abs(Math.round(e.y - mouseDownEvent.y));

      e.area = { left: left, top: top, width: width, height: height };
    }

    /**
     * Keep this private to avoid double event binding. Main logic of the surface
     * is here. Should be extended with needed events (mouseenter, mouseleave,
     * wheel ...).
     */
  }, {
    key: '_bindEvents',
    value: function _bindEvents() {
      var _this = this;

      var onMouseDown = function onMouseDown(e) {
        // By removing the previous selection we prevent bypassing the mousemove events coming from SVG in Firefox.
        window.getSelection().removeAllRanges();
        var event = _this._createEvent('mousedown', e);

        _this._mouseDownEvent = event;
        _this._lastEvent = event;
        // Register mousemove and mouseup listeners on window
        window.addEventListener('mousemove', onMouseMove, false);
        window.addEventListener('mouseup', onMouseUp, false);

        _this.emit('event', event);
      };

      var onMouseMove = function onMouseMove(e) {
        var event = _this._createEvent('mousemove', e);
        _this._defineArea(event, _this._mouseDownEvent, _this._lastEvent);
        // Update `lastEvent` for next call
        _this._lastEvent = event;

        _this.emit('event', event);
      };

      var onMouseUp = function onMouseUp(e) {
        var event = _this._createEvent('mouseup', e);
        _this._defineArea(event, _this._mouseDownEvent, _this._lastEvent);

        _this._mouseDownEvent = null;
        _this._lastEvent = null;
        // Remove mousemove and mouseup listeners on window
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);

        _this.emit('event', event);
      };

      var onClick = function onClick(e) {
        var event = _this._createEvent('click', e);
        _this.emit('event', event);
      };

      var onDblClick = function onDblClick(e) {
        var event = _this._createEvent('dblclick', e);
        _this.emit('event', event);
      };

      var onMouseOver = function onMouseOver(e) {
        var event = _this._createEvent('mouseover', e);
        _this.emit('event', event);
      };

      var onMouseOut = function onMouseOut(e) {
        var event = _this._createEvent('mouseout', e);
        _this.emit('event', event);
      };

      // Bind callbacks
      this.$el.addEventListener('mousedown', onMouseDown, false);
      this.$el.addEventListener('click', onClick, false);
      this.$el.addEventListener('dblclick', onDblClick, false);
      this.$el.addEventListener('mouseover', onMouseOver, false);
      this.$el.addEventListener('mouseout', onMouseOut, false);
    }
  }]);

  return Surface;
})(_eventSource2['default']);

exports['default'] = Surface;
module.exports = exports['default'];

},{"./event-source":30,"./wave-event":33,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],33:[function(require,module,exports){
/**
 * Object template for all events. Event sources should use this event template
 * in order to keep consistency with existing sources.
 */
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var WaveEvent =
/**
 * @param {String} source - The name of the source (`keyboard`, `surface`, ...).
 * @param {String} type - The type of the source (`mousedown`, `keyup`, ...).
 * @param {Event} originalEvent - The original event as emitted by the browser.
 */
function WaveEvent(source, type, originalEvent) {
  _classCallCheck(this, WaveEvent);

  this.source = source;
  this.type = type;
  this.originalEvent = originalEvent;

  this.target = originalEvent.target;
  this.currentTarget = originalEvent.currentTarget;
};

exports["default"] = WaveEvent;
module.exports = exports["default"];

},{"babel-runtime/helpers/class-call-check":77}],34:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _marker = require('./marker');

var _marker2 = _interopRequireDefault(_marker);

/**
 * A shape to display a marker with annotation.
 *
 * [example usage](./examples/layer-marker.html)
 */

var AnnotatedMarker = (function (_Marker) {
  _inherits(AnnotatedMarker, _Marker);

  function AnnotatedMarker() {
    _classCallCheck(this, AnnotatedMarker);

    _get(Object.getPrototypeOf(AnnotatedMarker.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(AnnotatedMarker, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'annotated-marker';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      var list = _get(Object.getPrototypeOf(AnnotatedMarker.prototype), '_getAccessorList', this).call(this);
      list.text = 'default';
      return list;
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      this.$el = _get(Object.getPrototypeOf(AnnotatedMarker.prototype), 'render', this).call(this, renderingContext);
      var height = renderingContext.height;

      this.$label = document.createElementNS(this.ns, 'text');
      this.$label.setAttributeNS(null, 'x', 8);
      this.$label.setAttributeNS(null, 'y', 8);
      this.$label.setAttributeNS(null, 'transform', 'matrix(1, 0, 0, -1, 0, ' + height + ')');
      this.$label.style.fontSize = '10px';
      this.$label.style.fontFamily = 'monospace';
      this.$label.style.color = '#242424';
      this.$label.style.mozUserSelect = 'none';
      this.$label.style.webkitUserSelect = 'none';
      this.$label.style.userSelect = 'none';

      this.$el.appendChild(this.$label);

      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, datum) {
      _get(Object.getPrototypeOf(AnnotatedMarker.prototype), 'update', this).call(this, renderingContext, datum);

      if (this.$label.firstChild) {
        this.$label.removeChild(this.$label.firstChild);
      }

      var $text = document.createTextNode(this.text(datum));
      this.$label.appendChild($text);
    }
  }]);

  return AnnotatedMarker;
})(_marker2['default']);

exports['default'] = AnnotatedMarker;
module.exports = exports['default'];

},{"./marker":40,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],35:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _segment = require('./segment');

var _segment2 = _interopRequireDefault(_segment);

/**
 * A shape to display a segment with annotation.
 *
 * [example usage](./examples/layer-segment.html)
 */

var AnnotatedSegment = (function (_Segment) {
  _inherits(AnnotatedSegment, _Segment);

  function AnnotatedSegment() {
    _classCallCheck(this, AnnotatedSegment);

    _get(Object.getPrototypeOf(AnnotatedSegment.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(AnnotatedSegment, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'annotated-segment';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      var list = _get(Object.getPrototypeOf(AnnotatedSegment.prototype), '_getAccessorList', this).call(this);
      list.text = 'default';
      return list;
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      this.$el = _get(Object.getPrototypeOf(AnnotatedSegment.prototype), 'render', this).call(this, renderingContext);
      var height = renderingContext.height;

      this.$label = document.createElementNS(this.ns, 'text');
      this.$label.setAttributeNS(null, 'x', 3);
      this.$label.setAttributeNS(null, 'y', 11);
      this.$label.setAttributeNS(null, 'transform', 'matrix(1, 0, 0, -1, 0, ' + height + ')');
      this.$label.style.fontSize = '10px';
      this.$label.style.fontFamily = 'monospace';
      this.$label.style.color = '#242424';
      this.$label.style.mozUserSelect = 'none';
      this.$label.style.webkitUserSelect = 'none';
      this.$label.style.userSelect = 'none';

      this.$el.appendChild(this.$label);

      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, datum) {
      _get(Object.getPrototypeOf(AnnotatedSegment.prototype), 'update', this).call(this, renderingContext, datum);

      if (this.$label.firstChild) {
        this.$label.removeChild(this.$label.firstChild);
      }

      var $text = document.createTextNode(this.text(datum));
      this.$label.appendChild($text);
    }
  }]);

  return AnnotatedSegment;
})(_segment2['default']);

exports['default'] = AnnotatedSegment;
module.exports = exports['default'];

},{"./segment":42,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],36:[function(require,module,exports){
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreNamespace = require('../core/namespace');

var _coreNamespace2 = _interopRequireDefault(_coreNamespace);

/**
 * Is an abstract class or interface to be overriden in order to define new
 * shapes. Shapes define the way a given datum should be rendered, they are
 * the smallest unit of rendering into a timeline.
 *
 * All the life cycle of `Shape` instances is handled into the `Layer` instance
 * they are attach to. As a consequence, they should be mainly considered as
 * private objects. The only place they should be interacted with is in `Behavior`
 * definitions, to test which element of the shape is the target of the
 * interaction and define the interaction according to that test.
 *
 * Depending of its implementation a `Shape` can be used along with `entity` or
 * `collection` data type. Some shapes are then created to use data considered
 * as a single entity (Waveform, TracePath, Line), while others are defined to
 * be used with data seen as a collection, each shape rendering a single entry
 * of the collection. The shapes working with entity type data should therefore
 * be used in an `entity` configured `Layer`. Note that if they are registered
 * as "commonShape" in a `collection` type `Layer`, they will behave the exact
 * same way. These kind of shapes are noted: "entity shape".
 *
 * ### Available `collection` shapes:
 * - Marker / Annotated Marker
 * - Segment / Annotated Segment
 * - Dot
 * - TraceDots
 *
 * ### Available `entity` shapes:
 * - Line
 * - Tick (for axis)
 * - Waveform
 * - TracePath
 * - Matrix
 */

var BaseShape = (function () {
  /**
   * @param {Object} options - override default configuration
   */

  function BaseShape() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, BaseShape);

    /** @type {Element} - Svg element to be returned by the `render` method. */
    this.$el = null;
    /** @type {String} - Svg namespace. */
    this.ns = _coreNamespace2['default'];
    /** @type {Object} - Object containing the global parameters of the shape */
    this.params = _Object$assign({}, this._getDefaults(), options);
    // create accessors methods and set default accessor functions
    var accessors = this._getAccessorList();
    this._createAccessors(accessors);
    this._setDefaultAccessors(accessors);
  }

  /**
   * Destroy the shape and clean references. Interface method called from the `layer`.
   */

  _createClass(BaseShape, [{
    key: 'destroy',
    value: function destroy() {
      // this.group = null;
      this.$el = null;
    }

    /**
     * Interface method to override when extending this base class. The method
     * is called by the `Layer~render` method. Returns the name of the shape,
     * used as a class in the element group (defaults to `'shape'`).
     *
     * @return {String}
     */
  }, {
    key: 'getClassName',
    value: function getClassName() {
      return 'shape';
    }

    /**
     * @todo not implemented
     * allow to install defs in the track svg element. Should be called when
     * adding the `Layer` to the `Track`.
     */
    // setSvgDefinition(defs) {}

    /**
     * Returns the defaults for global configuration of the shape.
     * @protected
     * @return {Object}
     */
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {};
    }

    /**
     * Returns an object where keys are the accessors methods names to create
     * and values are the default values for each given accessor.
     *
     * @protected
     * @todo rename ?
     * @return {Object}
     */
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return {};
    }

    /**
     * Interface method called by Layer when creating a shape. Install the
     * given accessors on the shape, overriding the default accessors.
     *
     * @param {Object<String, function>} accessors
     */
  }, {
    key: 'install',
    value: function install(accessors) {
      for (var key in accessors) {
        this[key] = accessors[key];
      }
    }

    /**
     * Generic method to create accessors. Adds getters en setters to the
     * prototype if not already present.
     */
  }, {
    key: '_createAccessors',
    value: function _createAccessors(accessors) {
      this._accessors = {};
      // add it to the prototype
      var proto = Object.getPrototypeOf(this);
      // create a getter / setter for each accessors
      // setter : `this.x = callback`
      // getter : `this.x(datum)`
      _Object$keys(accessors).forEach(function (name) {
        if (proto.hasOwnProperty(name)) {
          return;
        }

        _Object$defineProperty(proto, name, {
          get: function get() {
            return this._accessors[name];
          },
          set: function set(func) {
            this._accessors[name] = func;
          }
        });
      });
    }

    /**
     * Create a function to be used as a default accessor for each accesors
     */
  }, {
    key: '_setDefaultAccessors',
    value: function _setDefaultAccessors(accessors) {
      var _this = this;

      _Object$keys(accessors).forEach(function (name) {
        var defaultValue = accessors[name];
        var accessor = function accessor(d) {
          var v = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

          if (v === null) {
            return d[name] || defaultValue;
          }
          d[name] = v;
        };
        // set accessor as the default one
        _this[name] = accessor;
      });
    }

    /**
     * Interface method called by `Layer~render`. Creates the DOM structure of
     * the shape.
     *
     * @param {Object} renderingContext - the renderingContext of the layer
     *    which owns this shape.
     * @return {Element} - the DOM element to insert in the item's group.
     */
  }, {
    key: 'render',
    value: function render(renderingContext) {}

    /**
     * Interface method called by `Layer~update`, only for shapes with
     * `entity` type.
     *
     * Called once for a given entity, to return any information derived
     * from it that will be used subsequently when rendering. If this
     * method returns a non-null object, then that object will be passed
     * to the update method subsequently instead of the original entity
     * datum. (If you want to retain access to the original entity,
     * stash it in your cache object as well. Otherwise it may be GC'd
     * if nobody else needs it.)
     *
     * @param {Object|Array} datum - Entity associated with this shape.
     * @return {Object} - Cache data (opaque to caller) to pass to
     *     `update` subsequently in place of the original entity datum.
     */
  }, {
    key: 'encache',
    value: function encache(datum) {
      return null;
    }

    /**
     * Interface method called by `Layer~update`. Updates the DOM structure of the shape.
     *
     * @param {Object} renderingContext - The `renderingContext` of the
     *    layer which owns this shape.
     * @param {Object|Array} datum - The datum or cache associated with
     *    the shape. If the shape has collection type, this will be the
     *    single item from the dataset that the shape is dedicated to
     *    displaying. If it has entity type, then this will be the
     *    object previously returned from the shape's `encache` method
     *    (if any), or else the entity object itself.
     */
  }, {
    key: 'update',
    value: function update(renderingContext, datumOrCache) {}

    /**
     * Interface method to override called by `Layer~getItemsInArea`. Defines if
     * the shape is considered to be the given area. Arguments are passed in pixel domain.
     *
     * @param {Object} renderingContext - the renderingContext of the layer which
     *    owns this shape.
     * @param {Object|Array} datum - The datum associated to the shape.
     * @param {Number} x1 - The x component of the top-left corner of the area to test.
     * @param {Number} y1 - The y component of the top-left corner of the area to test.
     * @param {Number} x2 - The x component of the bottom-right corner of the area to test.
     * @param {Number} y2 - The y component of the bottom-right corner of the area to test.
     * @return {Boolean} - Returns `true` if the is considered to be in the given area, `false` otherwise.
     */
  }, {
    key: 'inArea',
    value: function inArea(renderingContext, datum, x1, y1, x2, y2) {}
  }]);

  return BaseShape;
})();

exports['default'] = BaseShape;
module.exports = exports['default'];

},{"../core/namespace":12,"babel-runtime/core-js/object/assign":67,"babel-runtime/core-js/object/define-property":69,"babel-runtime/core-js/object/keys":71,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78,"babel-runtime/helpers/interop-require-default":81}],37:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseShape = require('./base-shape');

var _baseShape2 = _interopRequireDefault(_baseShape);

var _coreNamespace = require('../core/namespace');

var _coreNamespace2 = _interopRequireDefault(_coreNamespace);

/**
 * A shape to display a cursor.
 *
 * [example usage](./examples/layer-cursor.html)
 */

var Cursor = (function (_BaseShape) {
  _inherits(Cursor, _BaseShape);

  function Cursor() {
    _classCallCheck(this, Cursor);

    _get(Object.getPrototypeOf(Cursor.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Cursor, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'cursor';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return { x: 0 };
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {
        color: '#000000',
        opacity: 1
      };
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      if (this.$el) {
        return this.$el;
      }

      this.$el = document.createElementNS(_coreNamespace2['default'], 'line');
      this.$el.setAttributeNS(null, 'x', 0);
      this.$el.setAttributeNS(null, 'y1', 0);
      this.$el.setAttributeNS(null, 'y2', renderingContext.height);
      this.$el.setAttributeNS(null, 'shape-rendering', 'crispEdges');
      this.$el.style.stroke = this.params.color;

      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, datum) {
      var x = Math.round(renderingContext.timeToPixel(this.x(datum))) + 0.5;
      this.$el.setAttributeNS(null, 'transform', 'translate(' + x + ', 0)');
    }

    /**
     * The cursor cannot be selected.
     * @return {Boolean} false
     */
  }, {
    key: 'inArea',
    value: function inArea() {
      return false;
    }
  }]);

  return Cursor;
})(_baseShape2['default']);

exports['default'] = Cursor;
module.exports = exports['default'];

},{"../core/namespace":12,"./base-shape":36,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],38:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseShape = require('./base-shape');

var _baseShape2 = _interopRequireDefault(_baseShape);

/**
 * A shape to display a dot.
 *
 * [example usage](./examples/layer-breakpoint.html)
 */

var Dot = (function (_BaseShape) {
  _inherits(Dot, _BaseShape);

  function Dot() {
    _classCallCheck(this, Dot);

    _get(Object.getPrototypeOf(Dot.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Dot, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'dot';
    }

    // @TODO rename : confusion between accessors and meta-accessors
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return { cx: 0, cy: 0, r: 3, color: '#000000' };
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.$el) {
        return this.$el;
      }

      this.$el = document.createElementNS(this.ns, 'circle');

      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, datum) {
      var cx = renderingContext.timeToPixel(this.cx(datum));
      var cy = renderingContext.valueToPixel(this.cy(datum));
      var r = this.r(datum);
      var color = this.color(datum);

      this.$el.setAttributeNS(null, 'transform', 'translate(' + cx + ', ' + cy + ')');
      this.$el.setAttributeNS(null, 'r', r);
      this.$el.style.fill = color;
    }

    // x1, x2, y1, y2 => in pixel domain
  }, {
    key: 'inArea',
    value: function inArea(renderingContext, datum, x1, y1, x2, y2) {
      var cx = renderingContext.timeToPixel(this.cx(datum));
      var cy = renderingContext.valueToPixel(this.cy(datum));

      if (cx > x1 && cx < x2 && cy > y1 && cy < y2) {
        return true;
      }

      return false;
    }
  }]);

  return Dot;
})(_baseShape2['default']);

exports['default'] = Dot;
module.exports = exports['default'];

},{"./base-shape":36,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],39:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseShape = require('./base-shape');

var _baseShape2 = _interopRequireDefault(_baseShape);

/**
 * A shape to display a line. Its main use is as common shape to create a
 * breakpoint visualization. (entity shape)
 *
 * [example usage](./examples/layer-breakpoint.html)
 */

var Line = (function (_BaseShape) {
  _inherits(Line, _BaseShape);

  function Line() {
    _classCallCheck(this, Line);

    _get(Object.getPrototypeOf(Line.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Line, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'line';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return { cx: 0, cy: 0 };
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return { color: '#000000' };
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      if (this.$el) {
        return this.$el;
      }

      this.$el = document.createElementNS(this.ns, 'path');
      // this.el.setAttributeNS(null, 'shape-rendering', 'crispEdges');
      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, data) {
      var _this = this;

      var before = performance.now();

      data = data.slice(0);
      data.sort(function (a, b) {
        return _this.cx(a) < _this.cx(b) ? -1 : 1;
      });

      var minX = Math.floor(renderingContext.minX);
      var maxX = Math.floor(renderingContext.maxX);

      var instructions = [];
      var n = data.length;

      if (n > 0) {

        // We want to start with the last element to the left of the
        // visible region, and end with the first element beyond the
        // right of it

        var nextX = renderingContext.timeToPixel(this.cx(data[0]));

        for (var i = 0; i < n; ++i) {

          var x = nextX;

          if (i + 1 < n) {
            nextX = renderingContext.timeToPixel(this.cx(data[i + 1]));
          }
          if (nextX < minX) {
            continue;
          }

          var y = renderingContext.valueToPixel(this.cy(data[i])) - 0.5;

          instructions.push(x + ',' + y);

          if (x > maxX) {
            break;
          }
        }
      }

      console.log("line instructions have " + instructions.length + " elements");

      this.$el.setAttributeNS(null, 'd', 'M' + instructions.join('L'));

      this.$el.style.stroke = this.params.color;
      this.$el.style.strokeWidth = 2;
      this.$el.style.fill = 'none';

      var after = performance.now();
      console.log("line update time = " + Math.round(after - before));

      data = null;
    }

    // builds the `path.d` attribute
    // @TODO create some ShapeHelper ?
  }, {
    key: '_buildLine',
    value: function _buildLine(renderingContext, data) {
      var _this2 = this;

      if (!data.length) {
        return '';
      }
      // sort data
      var instructions = data.map(function (datum, index) {
        var x = renderingContext.timeToPixel(_this2.cx(datum));
        var y = renderingContext.valueToPixel(_this2.cy(datum)) - 0.5;
        return x + ',' + y;
      });

      return 'M' + instructions.join('L');
    }
  }]);

  return Line;
})(_baseShape2['default']);

exports['default'] = Line;
module.exports = exports['default'];

},{"./base-shape":36,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],40:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseShape = require('./base-shape');

var _baseShape2 = _interopRequireDefault(_baseShape);

/**
 * A shape to display a marker.
 *
 * [example usage](./examples/layer-marker.html)
 */

var Marker = (function (_BaseShape) {
  _inherits(Marker, _BaseShape);

  function Marker() {
    _classCallCheck(this, Marker);

    _get(Object.getPrototypeOf(Marker.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Marker, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'marker';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return { x: 0, color: '#ff0000' };
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {
        handlerWidth: 7,
        handlerHeight: 10,
        displayHandlers: true,
        opacity: 1,
        color: 'red'
      };
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      if (this.$el) {
        return this.$el;
      }

      console.log("marker render");

      var height = renderingContext.height;

      this.$el = document.createElementNS(this.ns, 'g');
      this.$line = document.createElementNS(this.ns, 'line');

      // draw line
      this.$line.setAttributeNS(null, 'x', 0);
      this.$line.setAttributeNS(null, 'y1', 0);
      this.$line.setAttributeNS(null, 'y2', height);
      this.$line.setAttributeNS(null, 'shape-rendering', 'crispEdges');

      this.$el.appendChild(this.$line);

      if (this.params.displayHandlers) {
        this.$handler = document.createElementNS(this.ns, 'rect');

        this.$handler.setAttributeNS(null, 'x', -(this.params.handlerWidth / 2));
        this.$handler.setAttributeNS(null, 'y', renderingContext.height - this.params.handlerHeight);
        this.$handler.setAttributeNS(null, 'width', this.params.handlerWidth);
        this.$handler.setAttributeNS(null, 'height', this.params.handlerHeight);
        this.$handler.setAttributeNS(null, 'shape-rendering', 'crispEdges');

        this.$el.appendChild(this.$handler);
      }

      this.$el.style.opacity = this.params.opacity;

      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, datum) {

      console.log("marker update");

      var x = renderingContext.timeToPixel(this.x(datum)) - 0.5;

      var minX = renderingContext.minX;
      var maxX = renderingContext.maxX;

      if (x < minX || x > maxX) {

        this.$el.style.visibility = 'hidden';
      } else {

        this.$el.style.visibility = 'visible';

        var color = this.color(datum);

        this.$el.setAttributeNS(null, 'transform', 'translate(' + x + ', 0)');
        this.$line.style.stroke = color;

        if (this.params.displayHandlers) {
          this.$handler.style.fill = color;
        }
      }
    }
  }, {
    key: 'inArea',
    value: function inArea(renderingContext, datum, x1, y1, x2, y2) {
      // handlers only are selectable
      var x = renderingContext.timeToPixel(this.x(datum));
      var shapeX1 = x - (this.params.handlerWidth - 1) / 2;
      var shapeX2 = shapeX1 + this.params.handlerWidth;
      var shapeY1 = renderingContext.height - this.params.handlerHeight;
      var shapeY2 = renderingContext.height;

      var xOverlap = Math.max(0, Math.min(x2, shapeX2) - Math.max(x1, shapeX1));
      var yOverlap = Math.max(0, Math.min(y2, shapeY2) - Math.max(y1, shapeY1));
      var area = xOverlap * yOverlap;

      return area > 0;
    }
  }]);

  return Marker;
})(_baseShape2['default']);

exports['default'] = Marker;
module.exports = exports['default'];

},{"./base-shape":36,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],41:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _Math$log10 = require('babel-runtime/core-js/math/log10')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseShape = require('./base-shape');

var _baseShape2 = _interopRequireDefault(_baseShape);

var _coreTimelineTimeContext = require('../core/timeline-time-context');

var _coreTimelineTimeContext2 = _interopRequireDefault(_coreTimelineTimeContext);

var _coreLayerTimeContext = require('../core/layer-time-context');

var _coreLayerTimeContext2 = _interopRequireDefault(_coreLayerTimeContext);

var _utilsPngJs = require('../utils/png.js');

var _utilsPngJs2 = _interopRequireDefault(_utilsPngJs);

var xhtmlNS = 'http://www.w3.org/1999/xhtml';

var Matrix = (function (_BaseShape) {
  _inherits(Matrix, _BaseShape);

  function Matrix() {
    _classCallCheck(this, Matrix);

    _get(Object.getPrototypeOf(Matrix.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Matrix, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'matrix';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      // return { y: 0 };
      return {};
    }

    // TODO determine suitable implementations for _getAccessorList and _getDefaults
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {
        normalise: 'none',
        mapper: function mapper(value) {
          // The mapper accepts a value, which is guaranteed to be in
          // the range [0,1], and returns r, g, b components which are
          // also in the range [0,1]. This example mapper just returns a
          // grey level.
          var level = 1.0 - value;
          return [level, level, level];
        },
        gain: 1.0
      };
    }
  }, {
    key: 'render',
    value: function render(renderingCtx) {
      console.log("matrix render called");
      if (this.$el) {
        return this.$el;
      }
      this.$el = document.createElementNS(this.ns, 'g');
      this.lastUpdateHop = 0;
      console.log("matrix render returning");
      return this.$el;
    }
  }, {
    key: '_hybridNormalise',
    value: function _hybridNormalise(gain) {
      return function (col) {
        var max = 0.0;
        for (var i = 0; i < col.length; ++i) {
          var value = Math.abs(col[i]);
          if (value > max) {
            max = value;
          }
        }
        var scale = gain;
        if (max > 0.0) {
          scale = scale * (_Math$log10(max + 1.0) / max);
        }
        var n = [];
        for (var i = 0; i < col.length; ++i) {
          var value = col[i];
          n.push(value * scale);
        }
        return n;
      };
    }
  }, {
    key: '_columnNormalise',
    value: function _columnNormalise(gain) {
      return function (col) {
        var max = 0.0;
        for (var i = 0; i < col.length; ++i) {
          var value = Math.abs(col[i]);
          if (value > max) {
            max = value;
          }
        }
        var scale = gain;
        if (max > 0.0) {
          scale = scale * (1.0 / max);
        }
        var n = [];
        for (var i = 0; i < col.length; ++i) {
          var value = col[i];
          n.push(value * scale);
        }
        return n;
      };
    }
  }, {
    key: '_noNormalise',
    value: function _noNormalise(gain) {
      return function (col) {
        var n = [];
        for (var i = 0; i < col.length; ++i) {
          var value = col[i];
          n.push(value * gain);
        }
        return n;
      };
    }
  }, {
    key: 'encache',
    value: function encache(matrixEntity) {

      var before = performance.now();

      console.log("matrix cache called");

      var height = matrixEntity.getColumnHeight();
      var totalWidth = matrixEntity.getColumnCount();
      var tileWidth = 100;
      if (totalWidth < tileWidth * 2) {
        tileWidth = totalWidth;
      }

      console.log("totalWidth = " + totalWidth + ", tileWidth = " + tileWidth);

      var resources = [];
      var widths = [];

      var normalise = null;

      switch (this.params.normalise) {
        case 'hybrid':
          normalise = this._hybridNormalise(this.params.gain);
          break;
        case 'column':
          normalise = this._columnNormalise(this.params.gain);
          break;
        default:
          normalise = this._noNormalise(this.params.gain);
          break;
      }

      var condition = function condition(col) {
        var n = [];
        for (var i = 0; i < col.length; ++i) {
          if (col[i] === Infinity || isNaN(col[i])) n.push(0.0);else n.push(col[i]);
        }
        return n;
      };

      for (var x0 = 0; x0 < totalWidth; x0 += tileWidth) {

        var w = tileWidth;
        if (totalWidth - x0 < tileWidth) {
          w = totalWidth - x0;
        }

        var p = new _utilsPngJs2['default'](w, height, 256);

        for (var i = 0; i < w; ++i) {

          var x = x0 + i;
          var col = matrixEntity.getColumn(x);
          col = normalise(condition(col));

          for (var y = 0; y < height; ++y) {
            var value = col[y];
            // The value must be in the range [0,1] to pass to the
            // mapper. We also quantize the range, as the PNG encoder
            // uses a 256-level palette.
            if (value < 0) value = 0;
            if (value > 1) value = 1;
            value = Math.round(value * 255) / 255;

            var _params$mapper = this.params.mapper(value);

            var _params$mapper2 = _slicedToArray(_params$mapper, 3);

            var r = _params$mapper2[0];
            var g = _params$mapper2[1];
            var b = _params$mapper2[2];

            if (r < 0) r = 0;
            if (r > 1) r = 1;
            if (g < 0) g = 0;
            if (g > 1) g = 1;
            if (b < 0) b = 0;
            if (b > 1) b = 1;
            var colour = p.color(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), 255);
            var index = p.index(i, y);
            p.buffer[index] = colour;
          }
        }

        var resource = 'data:image/png;base64,' + p.getBase64();
        resources.push(resource);
        widths.push(w);

        console.log("image " + resources.length + ": length " + resource.length + " (dimensions " + w + " x " + height + ")");
      }

      console.log("drawing complete");

      var after = performance.now();
      console.log("matrix cache time = " + Math.round(after - before));

      return {
        resources: resources,
        tileWidths: widths,
        totalWidth: totalWidth,
        height: height,
        startTime: matrixEntity.getStartTime(),
        stepDuration: matrixEntity.getStepDuration(),
        elements: [] // will be installed in first call to update
      };
    }
  }, {
    key: 'update',
    value: function update(renderingContext, cache) {

      var before = performance.now();

      console.log("matrix update called");

      if (!cache.totalWidth || !cache.height || !renderingContext.width || !renderingContext.height) {
        console.log("nothing to update");
        return;
      }

      var hop = renderingContext.timeToPixel(1) - renderingContext.timeToPixel(0);
      if (hop === this.lastUpdateHop) {
        console.log("zoom level unchanged, still a hop of " + hop + " pps");
        return;
      } else {
        this.lastUpdateHop = hop;
      }

      if (cache.elements.length === 0) {
        console.log("About to add " + cache.resources.length + " image resources to SVG...");
        for (var i = 0; i < cache.resources.length; ++i) {
          var resource = cache.resources[i];
          var elt = document.createElementNS(this.ns, 'image');
          elt.setAttributeNS('http://www.w3.org/1999/xlink', 'href', resource);
          elt.setAttributeNS(null, 'preserveAspectRatio', 'none');
          elt.setAttributeNS(null, 'image-rendering', 'optimizeSpeed');
          elt.addEventListener('dragstart', function (e) {
            e.preventDefault();
          }, false);
          this.$el.appendChild(elt);
          cache.elements.push(elt);
        }
        console.log("Done that");
      }

      console.log("Render width = " + renderingContext.width);

      var startX = renderingContext.timeToPixel(cache.startTime);
      var drawnWidth = renderingContext.width - startX;
      var widthScaleFactor = drawnWidth / cache.totalWidth;

      if (cache.stepDuration > 0) {
        var totalDuration = cache.stepDuration * cache.totalWidth;
        var endX = renderingContext.timeToPixel(cache.startTime + totalDuration);
        widthScaleFactor = (endX - startX) / cache.totalWidth;
      }

      var widthAccumulated = 0;

      for (var i = 0; i < cache.elements.length; ++i) {
        var elt = cache.elements[i];
        var tileWidth = cache.tileWidths[i];
        var x = startX + widthAccumulated * widthScaleFactor;
        var w = tileWidth * widthScaleFactor;
        elt.setAttributeNS(null, 'x', Math.floor(x));
        elt.setAttributeNS(null, 'width', Math.ceil(x + w) - Math.floor(x));
        elt.setAttributeNS(null, 'y', 0);
        elt.setAttributeNS(null, 'height', renderingContext.height);
        widthAccumulated += tileWidth;
      }

      var after = performance.now();
      console.log("matrix update time = " + Math.round(after - before));
    }
  }]);

  return Matrix;
})(_baseShape2['default']);

exports['default'] = Matrix;
module.exports = exports['default'];

},{"../core/layer-time-context":10,"../core/timeline-time-context":13,"../utils/png.js":58,"./base-shape":36,"babel-runtime/core-js/math/log10":66,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81,"babel-runtime/helpers/sliced-to-array":82}],42:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseShape = require('./base-shape');

var _baseShape2 = _interopRequireDefault(_baseShape);

/**
 * A shape to display a segment.
 *
 * [example usage](./examples/layer-segment.html)
 */

var Segment = (function (_BaseShape) {
  _inherits(Segment, _BaseShape);

  function Segment() {
    _classCallCheck(this, Segment);

    _get(Object.getPrototypeOf(Segment.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Segment, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'segment';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return { x: 0, y: 0, width: 0, height: 1, color: '#000000', opacity: 1 };
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {
        displayHandlers: true,
        handlerWidth: 2,
        handlerOpacity: 0.8,
        opacity: 0.6
      };
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      if (this.$el) {
        return this.$el;
      }

      this.$el = document.createElementNS(this.ns, 'g');

      this.$segment = document.createElementNS(this.ns, 'rect');
      this.$segment.classList.add('segment');
      this.$segment.style.opacity = this.params.opacity;
      this.$segment.setAttributeNS(null, 'shape-rendering', 'crispEdges');

      this.$el.appendChild(this.$segment);

      if (this.params.displayHandlers) {
        this.$leftHandler = document.createElementNS(this.ns, 'rect');
        this.$leftHandler.classList.add('left', 'handler');
        this.$leftHandler.setAttributeNS(null, 'width', this.params.handlerWidth);
        this.$leftHandler.setAttributeNS(null, 'shape-rendering', 'crispEdges');
        this.$leftHandler.style.opacity = this.params.handlerOpacity;
        this.$leftHandler.style.cursor = 'ew-resize';

        this.$rightHandler = document.createElementNS(this.ns, 'rect');
        this.$rightHandler.classList.add('right', 'handler');
        this.$rightHandler.setAttributeNS(null, 'width', this.params.handlerWidth);
        this.$rightHandler.setAttributeNS(null, 'shape-rendering', 'crispEdges');
        this.$rightHandler.style.opacity = this.params.handlerOpacity;
        this.$rightHandler.style.cursor = 'ew-resize';

        this.$el.appendChild(this.$leftHandler);
        this.$el.appendChild(this.$rightHandler);
      }

      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, datum) {
      var x = renderingContext.timeToPixel(this.x(datum));
      var y = renderingContext.valueToPixel(this.y(datum));

      var width = renderingContext.timeToPixel(this.width(datum));
      var height = renderingContext.valueToPixel(this.height(datum));
      var color = this.color(datum);
      var opacity = this.opacity(datum);

      this.$el.setAttributeNS(null, 'transform', 'translate(' + x + ', ' + y + ')');
      this.$el.style.opacity = opacity;

      this.$segment.setAttributeNS(null, 'width', Math.max(width, 0));
      this.$segment.setAttributeNS(null, 'height', height);
      this.$segment.style.fill = color;

      if (this.params.displayHandlers) {
        // display handlers
        this.$leftHandler.setAttributeNS(null, 'height', height);
        this.$leftHandler.setAttributeNS(null, 'transform', 'translate(0, 0)');
        this.$leftHandler.style.fill = color;

        var rightHandlerTranslate = 'translate(' + (width - this.params.handlerWidth) + ', 0)';
        this.$rightHandler.setAttributeNS(null, 'height', height);
        this.$rightHandler.setAttributeNS(null, 'transform', rightHandlerTranslate);
        this.$rightHandler.style.fill = color;
      }
    }
  }, {
    key: 'inArea',
    value: function inArea(renderingContext, datum, x1, y1, x2, y2) {
      var shapeX1 = renderingContext.timeToPixel(this.x(datum));
      var shapeX2 = renderingContext.timeToPixel(this.x(datum) + this.width(datum));
      var shapeY1 = renderingContext.valueToPixel(this.y(datum));
      var shapeY2 = renderingContext.valueToPixel(this.y(datum) + this.height(datum));

      // http://jsfiddle.net/uthyZ/ - check overlaping area
      var xOverlap = Math.max(0, Math.min(x2, shapeX2) - Math.max(x1, shapeX1));
      var yOverlap = Math.max(0, Math.min(y2, shapeY2) - Math.max(y1, shapeY1));
      var area = xOverlap * yOverlap;

      return area > 0;
    }
  }]);

  return Segment;
})(_baseShape2['default']);

exports['default'] = Segment;
module.exports = exports['default'];

},{"./base-shape":36,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],43:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseShape = require('./base-shape');

var _baseShape2 = _interopRequireDefault(_baseShape);

/**
 * Kind of Marker for entity oriented data. Usefull to display a grid.
 */

var Ticks = (function (_BaseShape) {
  _inherits(Ticks, _BaseShape);

  function Ticks() {
    _classCallCheck(this, Ticks);

    _get(Object.getPrototypeOf(Ticks.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Ticks, [{
    key: '_getClassName',
    value: function _getClassName() {
      return 'tick';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return { time: 0, focused: true, label: '' };
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {
        color: 'steelblue',
        focusedOpacity: 0.8,
        defaultOpacity: 0.3
      };
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      this.$el = document.createElementNS(this.ns, 'g');
      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, data) {
      var _this = this;

      var before = performance.now();

      while (this.$el.firstChild) {
        this.$el.removeChild(this.$el.firstChild);
      }

      var fragment = document.createDocumentFragment();
      var layerHeight = renderingContext.height; // valueToPixel(1);

      data.forEach(function (datum) {
        var x = renderingContext.timeToPixel(_this.time(datum));
        var opacity = _this.focused(datum) ? _this.params.focusedOpacity : _this.params.defaultOpacity;

        var height = layerHeight;

        var tick = document.createElementNS(_this.ns, 'line');
        tick.classList.add('tick');

        tick.setAttributeNS(null, 'x1', 0);
        tick.setAttributeNS(null, 'x2', 0);
        tick.setAttributeNS(null, 'y1', 0);
        tick.setAttributeNS(null, 'y2', height);

        tick.setAttributeNS(null, 'fill', 'none');
        tick.setAttributeNS(null, 'stroke', _this.params.color);
        tick.setAttributeNS(null, 'stroke-width', 2);
        tick.setAttributeNS(null, 'transform', 'translate(' + x + ', 0)');
        tick.setAttributeNS(null, 'opacity', opacity);

        _this.$el.appendChild(tick);

        var label = _this.label(datum);
        if (label) {
          var $label = document.createElementNS(_this.ns, 'text');
          $label.classList.add('label');
          var $text = document.createTextNode(label);
          $label.appendChild($text);
          $label.setAttributeNS(null, 'transform', 'matrix(1, 0, 0, -1, ' + (x + 2) + ', ' + (height + 2) + ')');
          // firefox problem here
          // $label.setAttributeNS(null, 'alignment-baseline', 'text-before-edge');
          $label.setAttributeNS(null, 'y', '10');

          $label.style.fontSize = '10px';
          $label.style.lineHeight = '10px';
          $label.style.fontFamily = 'monospace';
          $label.style.color = '#676767';
          $label.style.opacity = 0.9;
          $label.style.mozUserSelect = 'none';
          $label.style.webkitUserSelect = 'none';
          $label.style.userSelect = 'none';

          // const bg = document.createElementNS(this.ns, 'rect');
          // bg.setAttributeNS(null, 'width', '100%');
          // bg.setAttributeNS(null, 'height', '100%');
          // bg.setAttributeNS(null, 'fill', '#ffffff');
          // label.appendChild(bg);

          _this.$el.appendChild($label);
        }
      });

      this.$el.appendChild(fragment);

      var after = performance.now();
      console.log("ticks update time = " + Math.round(after - before));
    }
  }]);

  return Ticks;
})(_baseShape2['default']);

exports['default'] = Ticks;
module.exports = exports['default'];

},{"./base-shape":36,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],44:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseShape = require('./base-shape');

var _baseShape2 = _interopRequireDefault(_baseShape);

/**
 * A shape to display dots in a trace visualization (mean / range).
 *
 * [example usage](./examples/layer-trace.html)
 */

var TraceDots = (function (_BaseShape) {
  _inherits(TraceDots, _BaseShape);

  function TraceDots() {
    _classCallCheck(this, TraceDots);

    _get(Object.getPrototypeOf(TraceDots.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(TraceDots, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'trace-dots';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return { x: 0, mean: 0, range: 0 };
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {
        meanRadius: 3,
        rangeRadius: 3,
        meanColor: '#232323',
        rangeColor: 'steelblue'
      };
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      if (this.$el) {
        return this.$el;
      }
      // container
      this.$el = document.createElementNS(this.ns, 'g');
      // draw mean dot
      this.$mean = document.createElementNS(this.ns, 'circle');
      this.$mean.setAttributeNS(null, 'r', this.params.meanRadius);
      this.$mean.setAttributeNS(null, 'stroke', this.params.meanColor);
      this.$mean.setAttributeNS(null, 'fill', 'transparent');
      this.$mean.classList.add('mean');
      // range dots (0 => top, 1 => bottom)
      this.$max = document.createElementNS(this.ns, 'circle');
      this.$max.setAttributeNS(null, 'r', this.params.meanRadius);
      this.$max.setAttributeNS(null, 'stroke', this.params.rangeColor);
      this.$max.setAttributeNS(null, 'fill', 'transparent');
      this.$max.classList.add('max');

      this.$min = document.createElementNS(this.ns, 'circle');
      this.$min.setAttributeNS(null, 'r', this.params.meanRadius);
      this.$min.setAttributeNS(null, 'stroke', this.params.rangeColor);
      this.$min.setAttributeNS(null, 'fill', 'transparent');
      this.$min.classList.add('min');

      this.$el.appendChild(this.$mean);
      this.$el.appendChild(this.$max);
      this.$el.appendChild(this.$min);

      return this.$el;
    }

    // @TODO use accessors
  }, {
    key: 'update',
    value: function update(renderingContext, datum) {
      var mean = this.mean(datum);
      var range = this.range(datum);
      var x = this.x(datum);
      // y positions
      var meanPos = '' + renderingContext.valueToPixel(mean);
      this.$mean.setAttributeNS(null, 'transform', 'translate(0, ' + meanPos + ')');

      var halfRange = range / 2;
      var max = renderingContext.valueToPixel(mean + halfRange);
      var min = renderingContext.valueToPixel(mean - halfRange);
      var xPos = renderingContext.timeToPixel(x);

      this.$max.setAttributeNS(null, 'transform', 'translate(0, ' + max + ')');
      this.$min.setAttributeNS(null, 'transform', 'translate(0, ' + min + ')');
      this.$el.setAttributeNS(null, 'transform', 'translate(' + xPos + ', 0)');
    }
  }, {
    key: 'inArea',
    value: function inArea(renderingContext, datum, x1, y1, x2, y2) {
      var x = renderingContext.timeToPixel(this.x(datum));
      var mean = renderingContext.valueToPixel(this.mean(datum));
      var range = renderingContext.valueToPixel(this.range(datum));
      var min = mean - range / 2;
      var max = mean + range / 2;

      if (x > x1 && x < x2 && (min > y1 || max < y2)) {
        return true;
      }

      return false;
    }
  }]);

  return TraceDots;
})(_baseShape2['default']);

exports['default'] = TraceDots;
module.exports = exports['default'];

},{"./base-shape":36,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],45:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseShape = require('./base-shape');

var _baseShape2 = _interopRequireDefault(_baseShape);

/**
 * A shape to display paths in a trace visualization (mean / range). (entity shape)
 *
 * [example usage](./examples/layer-trace.html)
 */

var TracePath = (function (_BaseShape) {
  _inherits(TracePath, _BaseShape);

  function TracePath() {
    _classCallCheck(this, TracePath);

    _get(Object.getPrototypeOf(TracePath.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(TracePath, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'trace-common';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return { x: 0, mean: 0, range: 0 };
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {
        rangeColor: 'steelblue',
        meanColor: '#232323',
        displayMean: true
      };
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      if (this.$el) {
        return this.$el;
      }
      this.$el = document.createElementNS(this.ns, 'g');
      // range path
      this.$range = document.createElementNS(this.ns, 'path');
      this.$el.appendChild(this.$range);

      // mean line
      if (this.params.displayMean) {
        this.$mean = document.createElementNS(this.ns, 'path');
        this.$el.appendChild(this.$mean);
      }

      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, data) {
      var _this = this;

      // order data by x position
      data = data.slice(0);
      data.sort(function (a, b) {
        return _this.x(a) < _this.x(b) ? -1 : 1;
      });

      if (this.params.displayMean) {
        this.$mean.setAttributeNS(null, 'd', this._buildMeanLine(renderingContext, data));
        this.$mean.setAttributeNS(null, 'stroke', this.params.meanColor);
        this.$mean.setAttributeNS(null, 'fill', 'none');
      }

      this.$range.setAttributeNS(null, 'd', this._buildRangeZone(renderingContext, data));
      this.$range.setAttributeNS(null, 'stroke', 'none');
      this.$range.setAttributeNS(null, 'fill', this.params.rangeColor);
      this.$range.setAttributeNS(null, 'opacity', '0.4');

      data = null;
    }
  }, {
    key: '_buildMeanLine',
    value: function _buildMeanLine(renderingContext, data) {
      var _this2 = this;

      var instructions = data.map(function (datum, index) {
        var x = renderingContext.timeToPixel(_this2.x(datum));
        var y = renderingContext.valueToPixel(_this2.mean(datum));
        return x + ',' + y;
      });

      return 'M' + instructions.join('L');
    }
  }, {
    key: '_buildRangeZone',
    value: function _buildRangeZone(renderingContext, data) {
      var length = data.length;
      // const lastIndex = data
      var instructionsStart = '';
      var instructionsEnd = '';

      for (var i = 0; i < length; i++) {
        var datum = data[i];
        var mean = this.mean(datum);
        var halfRange = this.range(datum) / 2;

        var x = renderingContext.timeToPixel(this.x(datum));
        var y0 = renderingContext.valueToPixel(mean + halfRange);
        var y1 = renderingContext.valueToPixel(mean - halfRange);

        var start = x + ',' + y0;
        var end = x + ',' + y1;

        instructionsStart = instructionsStart === '' ? start : instructionsStart + 'L' + start;

        instructionsEnd = instructionsEnd === '' ? end : end + 'L' + instructionsEnd;
      }

      var instructions = 'M' + instructionsStart + 'L' + instructionsEnd + 'Z';
      return instructions;
    }
  }]);

  return TracePath;
})(_baseShape2['default']);

exports['default'] = TracePath;
module.exports = exports['default'];

},{"./base-shape":36,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],46:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseShape = require('./base-shape');

var _baseShape2 = _interopRequireDefault(_baseShape);

var xhtmlNS = 'http://www.w3.org/1999/xhtml';

/**
 * A shape to display a waveform. (for entity data)
 *
 * [example usage](./examples/layer-waveform.html)
 *
 * @todo - fix problems with canvas strategy.
 */

var Waveform = (function (_BaseShape) {
  _inherits(Waveform, _BaseShape);

  function Waveform() {
    _classCallCheck(this, Waveform);

    _get(Object.getPrototypeOf(Waveform.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Waveform, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'waveform';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      // return { y: 0 };
      return {};
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {
        sampleRate: 44100,
        color: '#000000',
        opacity: 1
      };
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      if (this.$el) {
        return this.$el;
      }

      this.$el = document.createElementNS(this.ns, 'path');
      this.$el.setAttributeNS(null, 'fill', 'none');
      this.$el.setAttributeNS(null, 'shape-rendering', 'crispEdges');
      this.$el.setAttributeNS(null, 'stroke', this.params.color);
      this.$el.style.opacity = this.params.opacity;

      return this.$el;
    }
  }, {
    key: 'encache',
    value: function encache(samples) {

      console.log("waveform encache called");

      // The cache is an array of peak caches (holding the min and max
      // values within each block for a given block size) with each peak
      // cache represented as an object with blockSize, min array, and
      // max array properties.
      //
      // For example:
      //   
      // [ {
      //     blockSize: 16,
      //     max: [ 0.7,  0.5, 0.25, -0.1 ],
      //     min: [ 0.5, -0.1, -0.8, -0.2 ]
      //   }, {
      //     blockSize: 32,
      //     max: [  0.7,  0.25 ],
      //     min: [ -0.1, -0.8  ]
      //   }
      // ]
      //
      // As it happens we are only creating a cache with a single block
      // size at the moment, but it's useful to record that block size
      // in the cache rather than have to fix it here in the shape.

      var before = performance.now();

      var peakCacheFor = function peakCacheFor(arr, blockSize) {

        var peaks = [],
            troughs = [];

        var len = arr.length;

        for (var i = 0; i < len; i = i + blockSize) {
          var min = arr[i];
          var max = arr[i];
          for (var j = 0; j < blockSize; j++) {
            var sample = arr[i + j];
            if (sample < min) {
              min = sample;
            }
            if (sample > max) {
              max = sample;
            }
          }
          peaks.push(max);
          troughs.push(min);
        }

        return [peaks, troughs];
      };

      // For a single peak cache, experiment suggests smallish block
      // sizes are better. There's no benefit in having multiple layers
      // of cache (e.g. 32 and 512) unless update() can take advantage
      // of both in a single summarise action (e.g. when asked for a
      // read from 310 to 1050, start by reading single samples from 310
      // to 320, then from the 32-sample cache from 320 to 512, then
      // switch to the 512 sample cache, rather than having to read
      // single samples all the way from 310 to 512)... but at the
      // moment it can't. And the more complex logic would carry its own
      // overhead.

      var blockSize = 32;

      var _peakCacheFor = peakCacheFor(samples, blockSize);

      var _peakCacheFor2 = _slicedToArray(_peakCacheFor, 2);

      var peaks = _peakCacheFor2[0];
      var troughs = _peakCacheFor2[1];

      return {
        samples: samples,
        peakCaches: [{ blockSize: blockSize,
          max: peaks,
          min: troughs
        }]
      };
    }
  }, {
    key: 'summarise',
    value: function summarise(cache, minX, maxX, pixelToSample) {

      var before = performance.now();

      var samples = cache.samples;

      var px0 = Math.floor(minX);
      var px1 = Math.floor(maxX);

      var peakCache = null;
      var peakCacheBlockSize = 0;

      if (cache && cache.peakCaches.length > 0) {

        // Find a suitable peak cache if we have one.

        // "step" is the distance in samples from one pixel to the next.
        // We want the largest cache whose block size is no larger than
        // half this, so as to avoid situations where our step is always
        // straddling cache block boundaries.
        var step = pixelToSample(px0 + 1) - pixelToSample(px0);

        for (var i = 0; i < cache.peakCaches.length; ++i) {
          var blockSize = cache.peakCaches[i].blockSize;
          if (blockSize > peakCacheBlockSize && blockSize <= step / 2) {
            peakCache = cache.peakCaches[i];
            peakCacheBlockSize = peakCache.blockSize;
          }
        }
      }

      var sampleRate = this.params.sampleRate;
      var minMax = [];

      for (var px = px0; px < px1; px++) {

        var startSample = pixelToSample(px);
        if (startSample >= samples.length) break;

        var endSample = pixelToSample(px + 1);
        if (endSample >= samples.length) endSample = samples.length;

        var min = samples[startSample];
        var max = min;

        var ix = startSample;

        if (peakCache && peakCacheBlockSize > 0) {

          while (ix < endSample && ix % peakCacheBlockSize !== 0) {
            var sample = samples[ix];
            if (sample < min) {
              min = sample;
            }
            if (sample > max) {
              max = sample;
            }
            ++ix;
          }

          var cacheIx = ix / peakCacheBlockSize;
          var cacheMax = peakCache.max;
          var cacheMin = peakCache.min;

          while (ix + peakCacheBlockSize <= endSample) {
            if (cacheMax[cacheIx] > max) max = cacheMax[cacheIx];
            if (cacheMin[cacheIx] < min) min = cacheMin[cacheIx];
            ++cacheIx;
            ix = ix + peakCacheBlockSize;
          }
        }

        while (ix < endSample) {
          var sample = samples[ix];
          if (sample < min) {
            min = sample;
          }
          if (sample > max) {
            max = sample;
          }
          ++ix;
        }

        minMax.push([px, min, max]);
      }

      var after = performance.now();
      console.log("waveform summarisation time = " + Math.round(after - before));

      return minMax;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, cache) {

      var before = performance.now();

      var minX = renderingContext.minX;
      var maxX = renderingContext.maxX;

      var sampleRate = this.params.sampleRate;
      var pixelToSample = function pixelToSample(pixel) {
        return Math.floor(sampleRate * renderingContext.timeToPixel.invert(pixel));
      };

      // get min/max per pixels, clamped to the visible area
      var minMax = this.summarise(cache, minX, maxX, pixelToSample);
      if (!minMax.length) {
        return;
      }

      var PIXEL = 0;
      var MIN = 1;
      var MAX = 2;
      var ZERO = renderingContext.valueToPixel(0);

      var instructions = minMax.map(function (datum, index) {
        var x = datum[PIXEL];
        var y1 = Math.round(renderingContext.valueToPixel(datum[MIN]));
        var y2 = Math.round(renderingContext.valueToPixel(datum[MAX]));
        return x + ',' + y1 + 'L' + x + ',' + y2;
      });

      var d = 'M' + instructions.join('L');
      this.$el.setAttributeNS(null, 'd', d);

      var after = performance.now();
      console.log("waveform update time = " + Math.round(after - before));
    }
  }]);

  return Waveform;
})(_baseShape2['default']);

exports['default'] = Waveform;
module.exports = exports['default'];

},{"./base-shape":36,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81,"babel-runtime/helpers/sliced-to-array":82}],47:[function(require,module,exports){
/**
 * `State` instances are used to define the application logic by precising
 * specific user interaction cases, and how they impact the overal temporal
 * representation. The abstractions extending this base class should be
 * considered as the main interface between the visualization and the
 * application logic. All provided states should be seen as simple examples for
 * rapid prototyping,
 *
 * States manage interactions like zooming, browsing, or editing the timeline.
 * Customized states should extend this BaseState.
 */
"use strict";

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var BaseState = (function () {
  /**
   * Returns timeline tracks collection.
   *
   * @type {TrackCollection}
   */

  function BaseState(timeline) {
    _classCallCheck(this, BaseState);

    /**
     * A reference to the timeline on which the state should be installed.
     * @type {Timeline}
     */
    this.timeline = timeline;
  }

  /**
   * Returns timeline tracks collection.
   *
   * @type {TrackCollection<Track>}
   */

  _createClass(BaseState, [{
    key: "enter",

    /**
     * Called when the timeline is entering the state.
     */
    value: function enter() {}

    /**
     * Called when the timeline is leaving the state.
     */
  }, {
    key: "exit",
    value: function exit() {}

    /**
     * Main interface method to override when creating a new `State`. Handle event
     * from mouse or keyboard, should define behavior according to the event
     * (aka. mousedown, mouseup, ...).
     *
     * @param {WaveEvent} e - the event to process.
     * @param {Array} hitLayers - the layers hit by the mouse event (if surface
     * event).
     */
  }, {
    key: "handleEvent",
    value: function handleEvent(e, hitLayers) {}
  }, {
    key: "tracks",
    get: function get() {
      return this.timeline.tracks;
    }

    /**
     * Returns all registered layers.
     *
     * @type {Array<Layer>}
     */
  }, {
    key: "layers",
    get: function get() {
      return this.timeline.tracks.layers;
    }
  }]);

  return BaseState;
})();

exports["default"] = BaseState;
module.exports = exports["default"];

},{"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78}],48:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseState = require('./base-state');

var _baseState2 = _interopRequireDefault(_baseState);

/**
 * A state to interact with a breakpoint function, mimicing Max/MSP's
 * breakpoint function interactions.
 *
 * [example usage](./examples/layer-breakpint.html)
 */

var BreakpointState = (function (_BaseState) {
  _inherits(BreakpointState, _BaseState);

  function BreakpointState(timeline, datumGenerator) {
    _classCallCheck(this, BreakpointState);

    _get(Object.getPrototypeOf(BreakpointState.prototype), 'constructor', this).call(this, timeline);

    this.datumGenerator = datumGenerator;
    this.currentEditedLayer = null;
    this.currentTarget = null;
  }

  _createClass(BreakpointState, [{
    key: 'enter',
    value: function enter() {}
  }, {
    key: 'exit',
    value: function exit() {}
  }, {
    key: 'handleEvent',
    value: function handleEvent(e, hitLayers) {
      switch (e.type) {
        case 'mousedown':
          this.onMouseDown(e, hitLayers);
          break;
        case 'mousemove':
          this.onMouseMove(e, hitLayers);
          break;
        case 'mouseup':
          this.onMouseUp(e, hitLayers);
          break;
      }
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(e, hitLayers) {
      var _this = this;

      this.mouseDown = true;
      // keep target consistent with mouse down
      this.currentTarget = e.target;
      var updatedLayer = null;

      var layers = hitLayers;

      layers.forEach(function (layer) {
        layer.unselect();
        var item = layer.getItemFromDOMElement(e.target);

        if (item === null) {
          // create an item
          var time = layer.timeToPixel.invert(e.x) - _this.timeline.offset;
          var value = layer.valueToPixel.invert(layer.params.height - e.y);
          var datum = _this.datumGenerator(time, value);

          layer.data.push(datum);
          updatedLayer = layer;
        } else {
          // if shift is pressed, remove the item
          if (e.originalEvent.shiftKey) {
            var data = layer.data;
            var datum = layer.getDatumFromItem(item);
            data.splice(data.indexOf(datum), 1);

            updatedLayer = layer;
          } else {
            _this.currentEditedLayer = layer;
            layer.select(item);
          }
        }
      });

      if (updatedLayer) {
        this.timeline.tracks.render(updatedLayer);
        this.timeline.tracks.update(updatedLayer);
      }
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      var _this2 = this;

      if (!this.mouseDown || !this.currentEditedLayer) {
        return;
      }

      var layer = this.currentEditedLayer;
      var items = layer.selectedItems;
      // the loop should be in layer to match select / unselect API
      items.forEach(function (item) {
        layer.edit(item, e.dx, e.dy, _this2.currentTarget);
      });

      layer.update(items);
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(e) {
      this.currentEditedLayer = null;
      this.mouseDown = false;
    }
  }]);

  return BreakpointState;
})(_baseState2['default']);

exports['default'] = BreakpointState;
module.exports = exports['default'];

},{"./base-state":47,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],49:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreNamespace = require('../core/namespace');

var _coreNamespace2 = _interopRequireDefault(_coreNamespace);

var _baseState = require('./base-state');

var _baseState2 = _interopRequireDefault(_baseState);

/**
 * Protools like zoom with zone selection. Press space bar to reset zoom.
 *
 * [example usage](./examples/states-zoom.html)
 *
 * @todo - could also handle `g` and `h` keys to zoom-in, zoom-out.
 */

var BrushZoomState = (function (_BaseState) {
  _inherits(BrushZoomState, _BaseState);

  function BrushZoomState(timeline) {
    _classCallCheck(this, BrushZoomState);

    _get(Object.getPrototypeOf(BrushZoomState.prototype), 'constructor', this).call(this, timeline);
  }

  _createClass(BrushZoomState, [{
    key: 'handleEvent',
    value: function handleEvent(e) {
      switch (e.type) {
        case 'mousedown':
          this.onMouseDown(e);
          break;
        case 'mousemove':
          this.onMouseMove(e);
          break;
        case 'mouseup':
          this.onMouseUp(e);
          break;
        case 'keydown':
          this.onKeyDown(e);
          break;
      }
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(e) {
      var _this = this;

      this.brushes = [];
      this.startX = e.x;
      // create brush in each containers
      this.tracks.forEach(function (track) {
        var interactions = track.$interactions;

        var brush = document.createElementNS(_coreNamespace2['default'], 'rect');
        brush.setAttributeNS(null, 'height', track.height);
        brush.setAttributeNS(null, 'y', 0);
        brush.style.fill = '#787878';
        brush.style.opacity = 0.2;

        interactions.appendChild(brush);

        _this.brushes.push(brush);
      });
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      // update brush
      var width = Math.abs(e.x - this.startX);
      var x = Math.min(e.x, this.startX);

      this.brushes.forEach(function (brush) {
        brush.setAttributeNS(null, 'width', width);
        brush.setAttributeNS(null, 'x', x);
      });
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(e) {
      // remove brush
      this.brushes.forEach(function (brush) {
        brush.parentNode.removeChild(brush);
      });

      // update timeContext
      var startX = this.startX;
      var endX = e.x;
      // return if no drag
      if (Math.abs(startX - endX) < 1) {
        return;
      }

      var leftX = Math.max(0, Math.min(startX, endX));
      var rightX = Math.max(startX, endX);

      var minTime = this.timeline.timeToPixel.invert(leftX);
      var maxTime = this.timeline.timeToPixel.invert(rightX);

      var deltaDuration = maxTime - minTime;
      var zoom = this.timeline.visibleDuration / deltaDuration;

      this.timeline.offset -= minTime;
      this.timeline.zoom *= zoom;

      this.tracks.update();
    }
  }, {
    key: 'onKeyDown',
    value: function onKeyDown(e) {
      // reset on space bar
      if (e.originalEvent.keyCode === 32) {
        this.timeline.offset = 0;
        this.timeline.zoom = 1;
        this.tracks.update();
      }
    }
  }]);

  return BrushZoomState;
})(_baseState2['default']);

exports['default'] = BrushZoomState;
module.exports = exports['default'];

},{"../core/namespace":12,"./base-state":47,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],50:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _utilsScales = require('../utils/scales');

var _utilsScales2 = _interopRequireDefault(_utilsScales);

var _baseState = require('./base-state');

var _baseState2 = _interopRequireDefault(_baseState);

/**
 * `CenteredZoomState` is a timeline state mimicing the `Live` zoom interaction. It allows the user to browse the timeline by clicking on a track, and then
 * - moving down to zoom in
 * - moving up to zoom out
 * - moving left to move in time, after
 * - moving right to move in time, before
 *
 * [example usage](./examples/states-zoom.html)
 */

var CenteredZoomState = (function (_BaseState) {
  _inherits(CenteredZoomState, _BaseState);

  function CenteredZoomState(timeline) {
    _classCallCheck(this, CenteredZoomState);

    _get(Object.getPrototypeOf(CenteredZoomState.prototype), 'constructor', this).call(this, timeline);
    this.currentLayer = null;
    // Set max/min zoom
    // maxZoom: 1px per sample
    // minZoom: 10 000 px per 1 hour
    // with a default to 44.1kHz sample rate
    this.maxZoom = 44100 * 1 / this.timeline.timeContext.pixelsPerSecond;
    this.minZoom = 10000 / 3600 / this.timeline.timeContext.pixelsPerSecond;
  }

  _createClass(CenteredZoomState, [{
    key: 'handleEvent',
    value: function handleEvent(e) {
      switch (e.type) {
        case 'mousedown':
          this.onMouseDown(e);
          break;
        case 'mousemove':
          this.onMouseMove(e);
          break;
        case 'mouseup':
          this.onMouseUp(e);
          break;
      }
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(e) {

      this.initialX = e.x;
      this.initialOffset = this.timeline.timeContext.offset;
      this.initialCenterTime = this.timeline.timeContext.timeToPixel.invert(e.x) - this.initialOffset;

      this.initialY = e.y;
      this.initialZoom = this.timeline.timeContext.zoom;

      this.dragMode = 'unresolved';

      this._pixelToExponent = _utilsScales2['default'].linear().domain([0, 100]) // 100px => factor 2
      .range([0, 1]);
    }
  }, {
    key: 'updateDragMode',
    value: function updateDragMode(e) {

      var dx = Math.abs(e.x - this.initialX);
      var dy = Math.abs(e.y - this.initialY);

      var smallThreshold = 10,
          bigThreshold = 50;

      if (this.dragMode === 'unresolved') {
        if (dy > smallThreshold && dy > dx * 2) {
          this.dragMode = 'vertical';
        } else if (dx > smallThreshold && dx > dy * 2) {
          this.dragMode = 'horizontal';
        } else if (dx > smallThreshold && dy > smallThreshold) {
          this.dragMode = 'free';
        }
      }

      if (this.dragMode === 'vertical' && dx > bigThreshold) {
        this.dragMode = 'free';
      }
      if (this.dragMode === 'horizontal' && dy > bigThreshold) {
        this.dragMode = 'free';
      }
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      // prevent annoying text selection when dragging
      e.originalEvent.preventDefault();

      this.updateDragMode(e);

      var timeContext = this.timeline.timeContext;

      var changed = false;

      if (this.dragMode === 'vertical' || this.dragMode === 'free') {

        var exponent = this._pixelToExponent(e.y - this.initialY);

        // -1...1 -> 1/2...2 :
        var targetZoom = this.initialZoom * Math.pow(2, exponent);

        var clampedZoom = Math.min(Math.max(targetZoom, this.minZoom), this.maxZoom);

        if (timeContext.zoom !== clampedZoom) {
          timeContext.zoom = clampedZoom;
          changed = true;
        }
      }

      // We want to keep the same time under the mouse as we originally
      // had (this.initialCenterTime). We actually need to do this
      // regardless of drag mode -- even if we're only intending to drag
      // vertically (i.e. zooming), we still want to ensure the point
      // under the mouse doesn't wander off
      var timeMovedTo = timeContext.timeToPixel(this.initialCenterTime + timeContext.offset);

      var delta = e.x - timeMovedTo;
      var deltaTime = timeContext.timeToPixel.invert(delta);

      if (deltaTime !== 0) {
        timeContext.offset += deltaTime;
        changed = true;
      }

      // Other possible experiments with centered-zoom-state
      //
      // Example 1: Prevent timeline.offset to be negative
      // timeContext.offset = Math.min(timeContext.offset, 0);
      //
      // Example 2: Keep in container when zoomed out
      // if (timeContext.stretchRatio < 1) {
      //   const minOffset = timeContext.timeToPixel.invert(0);
      //   const maxOffset = timeContext.timeToPixel.invert(view.width - timeContext.timeToPixel(timeContext.duration));
      //   timeContext.offset = Math.max(timeContext.offset, minOffset);
      //   timeContext.offset = Math.min(timeContext.offset, maxOffset);
      // }

      if (changed) {
        this.timeline.tracks.update();
      }
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(e) {}
  }]);

  return CenteredZoomState;
})(_baseState2['default']);

exports['default'] = CenteredZoomState;
module.exports = exports['default'];

},{"../utils/scales":60,"./base-state":47,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],51:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseState = require('./base-state');

var _baseState2 = _interopRequireDefault(_baseState);

var _behaviorsTimeContextBehavior = require('../behaviors/time-context-behavior');

var _behaviorsTimeContextBehavior2 = _interopRequireDefault(_behaviorsTimeContextBehavior);

/**
 * A state to interact directly with layers time contexts.
 *
 * [example usage, see. advanced usage](./examples/layer-waveform.html)
 */

var ContextEditionState = (function (_BaseState) {
  _inherits(ContextEditionState, _BaseState);

  function ContextEditionState(timeline) {
    _classCallCheck(this, ContextEditionState);

    _get(Object.getPrototypeOf(ContextEditionState.prototype), 'constructor', this).call(this, timeline);
  }

  _createClass(ContextEditionState, [{
    key: 'handleEvent',
    value: function handleEvent(e) {
      switch (e.type) {
        case 'mousedown':
          this.onMouseDown(e);
          break;
        case 'mousemove':
          this.onMouseMove(e);
          break;
        case 'mouseup':
          this.onMouseUp(e);
          break;
      }
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(e) {
      this.mouseDown = true;
      this.currentTarget = e.target;

      for (var i = 0, l = this.layers.length; i < l; i++) {
        var layer = this.layers[i];
        if (layer.hasElement(e.target)) {
          this.currentLayer = layer;
          break;
        }
      }
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      if (!this.mouseDown || !this.currentLayer) {
        return;
      }

      var layer = this.currentLayer;
      var target = this.currentTarget;

      // in this example the context is stretched when shift is pressed
      if (!e.originalEvent.shiftKey) {
        layer.editContext(e.dx, e.dy, target);
      } else {
        layer.stretchContext(e.dx, e.dy, target);
      }

      this.timeline.tracks.update(layer);
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(e) {
      this.mouseDown = false;
      this.currentTarget = null;
      this.currentLayer = null;
    }
  }]);

  return ContextEditionState;
})(_baseState2['default']);

exports['default'] = ContextEditionState;
module.exports = exports['default'];

},{"../behaviors/time-context-behavior":8,"./base-state":47,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],52:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseState = require('./base-state');

var _baseState2 = _interopRequireDefault(_baseState);

/**
 * A state to edit shapes in the more general way. Interact only with selected shapes.
 */

var EditionState = (function (_BaseState) {
  _inherits(EditionState, _BaseState);

  function EditionState(timeline) {
    _classCallCheck(this, EditionState);

    _get(Object.getPrototypeOf(EditionState.prototype), 'constructor', this).call(this, timeline);

    this.currentEditedLayer = null;
    this.currentTarget = null;
  }

  _createClass(EditionState, [{
    key: 'enter',
    value: function enter() {}
  }, {
    key: 'exit',
    value: function exit() {}
  }, {
    key: 'handleEvent',
    value: function handleEvent(e) {
      switch (e.type) {
        case 'mousedown':
          this.onMouseDown(e);
          break;
        case 'mousemove':
          this.onMouseMove(e);
          break;
        case 'mouseup':
          this.onMouseUp(e);
          break;
      }
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(e) {
      this.currentTarget = e.target;
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      var _this = this;

      this.layers.forEach(function (layer) {
        var items = layer.selectedItems;

        layer.edit(items, e.dx, e.dy, _this.currentTarget);
        layer.update(items);
      });
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(e) {
      this.currentEditedLayer = null;
      this.mouseDown = false;
    }
  }]);

  return EditionState;
})(_baseState2['default']);

exports['default'] = EditionState;
module.exports = exports['default'];

},{"./base-state":47,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],53:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Map = require('babel-runtime/core-js/map')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseState = require('./base-state');

var _baseState2 = _interopRequireDefault(_baseState);

var _coreNamespace = require('../core/namespace');

var _coreNamespace2 = _interopRequireDefault(_coreNamespace);

/**
 * A state to select shapes.
 */

var SelectionState = (function (_BaseState) {
  _inherits(SelectionState, _BaseState);

  function SelectionState(timeline /*, options = {} */) {
    _classCallCheck(this, SelectionState);

    _get(Object.getPrototypeOf(SelectionState.prototype), 'constructor', this).call(this, timeline /*, options */);

    this.currentLayer = null;
    // need a cached
    this.selectedItems = null;
    this.mouseDown = false;
    this.shiftKey = false;

    this._layerSelectedItemsMap = new _Map();
  }

  _createClass(SelectionState, [{
    key: 'enter',
    value: function enter() {}
  }, {
    key: 'exit',
    value: function exit() {
      var containers = this.timeline.containers;

      for (var id in containers) {
        this._removeBrush(containers[id]);
      }
    }
  }, {
    key: 'handleEvent',
    value: function handleEvent(e) {
      switch (e.type) {
        case 'mousedown':
          this.onMouseDown(e);
          break;
        case 'mousemove':
          this.onMouseMove(e);
          break;
        case 'mouseup':
          this.onMouseUp(e);
          break;
        case 'click':
          this.onClick(e);
          break;
        case 'keydown':
          this.onKey(e);
          break;
        case 'keyup':
          this.onKey(e);
          break;
      }
    }
  }, {
    key: '_addBrush',
    value: function _addBrush(track) {
      if (track.$brush) {
        return;
      }

      var brush = document.createElementNS(_coreNamespace2['default'], 'rect');
      brush.style.fill = '#686868';
      brush.style.opacity = 0.2;

      track.$interactions.appendChild(brush);
      track.$brush = brush;
    }
  }, {
    key: '_removeBrush',
    value: function _removeBrush(track) {
      if (track.$brush === null) {
        return;
      }

      this._resetBrush(track);
      track.$interactions.removeChild(track.$brush);
      delete track.$brush;
    }
  }, {
    key: '_resetBrush',
    value: function _resetBrush(track) {
      var $brush = track.$brush;
      // reset brush element
      $brush.setAttributeNS(null, 'transform', 'translate(0, 0)');
      $brush.setAttributeNS(null, 'width', 0);
      $brush.setAttributeNS(null, 'height', 0);
    }
  }, {
    key: '_updateBrush',
    value: function _updateBrush(e, track) {
      var $brush = track.$brush;
      var translate = 'translate(' + e.area.left + ', ' + e.area.top + ')';

      $brush.setAttributeNS(null, 'transform', translate);
      $brush.setAttributeNS(null, 'width', e.area.width);
      $brush.setAttributeNS(null, 'height', e.area.height);
    }
  }, {
    key: 'onKey',
    value: function onKey(e) {
      this.shiftKey = e.shiftKey;
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(e) {
      var _this = this;

      this._currentTrack = this.timeline.getTrackFromDOMElement(e.target);
      if (!this._currentTrack) {
        return;
      }

      this._addBrush(this._currentTrack);

      // recreate the map
      this._layerSelectedItemsMap = new _Map();
      this._currentTrack.layers.forEach(function (layer) {
        _this._layerSelectedItemsMap.set(layer, layer.selectedItems.slice(0));
      });
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      var _this2 = this;

      this._updateBrush(e, this._currentTrack);

      this._currentTrack.layers.forEach(function (layer) {
        var currentSelection = layer.selectedItems;
        var currentItems = layer.getItemsInArea(e.area);

        // if is not pressed
        if (!e.originalEvent.shiftKey) {
          layer.unselect(currentSelection);
          layer.select(currentItems);
        } else {
          (function () {
            var toSelect = [];
            var toUnselect = [];
            // use the selection from the previous drag
            var previousSelection = _this2._layerSelectedItemsMap.get(layer);
            // toUnselect = toUnselect.concat(previousSelectedItems);

            currentItems.forEach(function (item) {
              if (previousSelection.indexOf(item) === -1) {
                toSelect.push(item);
              } else {
                toUnselect.push(item);
              }
            });

            currentSelection.forEach(function (item) {
              if (currentItems.indexOf(item) === -1 && previousSelection.indexOf(item) === -1) {
                toUnselect.push(item);
              }
            });

            layer.unselect(toUnselect);
            layer.select(toSelect);
          })();
        }
      });
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(e) {
      this._removeBrush(this._currentTrack);
    }
  }, {
    key: 'onClick',
    value: function onClick(e) {
      if (!this._currentTrack) {
        return;
      }

      this._currentTrack.layers.forEach(function (layer) {
        var item = layer.getItemFromDOMElement(e.target);

        if (!e.originalEvent.shiftKey) {
          layer.unselect();
        }

        if (item) {
          layer.toggleSelection(item);
        }
      });
    }
  }]);

  return SelectionState;
})(_baseState2['default']);

exports['default'] = SelectionState;
module.exports = exports['default'];

},{"../core/namespace":12,"./base-state":47,"babel-runtime/core-js/map":65,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],54:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseState = require('./base-state');

var _baseState2 = _interopRequireDefault(_baseState);

/**
 * A state to select and edit shapes in a simple way. (kind of plug n play state)
 */

var SimpleEditionState = (function (_BaseState) {
  _inherits(SimpleEditionState, _BaseState);

  function SimpleEditionState(timeline) {
    _classCallCheck(this, SimpleEditionState);

    _get(Object.getPrototypeOf(SimpleEditionState.prototype), 'constructor', this).call(this, timeline);

    this.currentEditedLayer = null;
    this.currentTarget = null;
  }

  _createClass(SimpleEditionState, [{
    key: 'enter',
    value: function enter() {}
  }, {
    key: 'exit',
    value: function exit() {}
  }, {
    key: 'handleEvent',
    value: function handleEvent(e) {
      switch (e.type) {
        case 'mousedown':
          this.onMouseDown(e);
          break;
        case 'mousemove':
          this.onMouseMove(e);
          break;
        case 'mouseup':
          this.onMouseUp(e);
          break;
      }
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(e) {
      var _this = this;

      // keep target consistent with mouse down
      this.currentTarget = e.target;

      this.layers.forEach(function (layer) {
        if (!layer.hasElement(_this.currentTarget)) {
          return;
        }

        if (!e.originalEvent.shiftKey) {
          layer.unselect();
        }

        var item = layer.getItemFromDOMElement(_this.currentTarget);

        if (item === null) {
          return;
        }

        _this.currentEditedLayer = layer;
        requestAnimationFrame(function () {
          layer.select(item);
        });
      });
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      if (!this.currentEditedLayer) {
        return;
      }

      var layer = this.currentEditedLayer;
      var items = layer.selectedItems;

      layer.edit(items, e.dx, e.dy, this.currentTarget);
      requestAnimationFrame(function () {
        layer.update(items);
      });
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(e) {
      this.currentEditedLayer = null;
    }
  }]);

  return SimpleEditionState;
})(_baseState2['default']);

exports['default'] = SimpleEditionState;
module.exports = exports['default'];

},{"./base-state":47,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],55:[function(require,module,exports){
/**
 * Formatting helpers functions.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  /**
   * Add a `sign` to the left of a given `input` to match `length`
   *
   * @param {String} input - The string to format.
   * @param {String} sign - The character to add to the left.
   * @param {Number} length - The length of the output string.
   */
  padLeft: function padLeft(input, sign, length) {
    input += '';
    while (input.length < length) {
      input = sign + input;
    }
    return input;
  }
};
module.exports = exports['default'];

},{}],56:[function(require,module,exports){
"use strict";

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var MatrixEntity = (function () {
  function MatrixEntity() {
    _classCallCheck(this, MatrixEntity);
  }

  _createClass(MatrixEntity, [{
    key: "getColumnCount",
    value: function getColumnCount() {
      // Return here the total number of columns in the matrix.
      return 0;
    }
  }, {
    key: "getColumnHeight",
    value: function getColumnHeight() {
      // Return here the height of a column in the matrix. All columns
      // are expected to be of equal height.
      return 0;
    }
  }, {
    key: "getColumn",
    value: function getColumn(n) {
      // Return here a single column (of index n) as an array or
      // Float32Array.
      return [];
    }
  }, {
    key: "getStepDuration",
    value: function getStepDuration() {
      // Return the time interval in seconds between consecutive
      // columns. Columns are expected to be equally spaced in time.  If
      // this returns 0, the matrix is considered to span the entire
      // duration of any associated timeline.
      return 0;
    }
  }, {
    key: "getStartTime",
    value: function getStartTime() {
      // Return the location in time of the first column in seconds.
      return 0;
    }
  }, {
    key: "dispose",
    value: function dispose() {
      // Called when this object is no longer going to be used.
    }
  }]);

  return MatrixEntity;
})();

exports["default"] = MatrixEntity;
module.exports = exports["default"];

},{"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78}],57:[function(require,module,exports){
/**
 * OrthogonalData transforms an object of arrays `{foo: [1, 2], bar: [3, 4]}`
 * to or from an array of objects `[{foo: 1, bar: 3}, {foo: 2, bar: 4}]`
 */
"use strict";

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _Object$keys = require("babel-runtime/core-js/object/keys")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var OrthogonalData = (function () {
  function OrthogonalData() {
    _classCallCheck(this, OrthogonalData);

    this._cols = null; // Object of arrays
    this._rows = null; // Array of objects
  }

  /**
   * Check the consistency of the data.
   */

  _createClass(OrthogonalData, [{
    key: "_checkConsistency",
    value: function _checkConsistency() {
      var size = null;

      for (var key in this._cols) {
        var col = this._cols[key];
        var colLength = col.length;

        if (size !== null && size !== colLength) {
          throw new Error(this.prototype.constructor.name + ": inconsistent data");
        } else if (size === null) {
          size = colLength;
        }
      }
    }

    /**
     * Updates array of objects from object of arrays.
     */
  }, {
    key: "updateFromCols",
    value: function updateFromCols() {
      var _this = this;

      var keys = _Object$keys(this._cols);

      keys.forEach(function (key, i) {
        var col = _this._cols[key];

        col.forEach(function (value, index) {
          if (_this._rows[index] === undefined) _this._rows[index] = {};
          _this._rows[index][key] = value;
        });
      });

      this._checkConsistency();
    }

    /**
     * Updates object of arrays from array of objects.
     */
  }, {
    key: "updateFromRows",
    value: function updateFromRows() {
      var _this2 = this;

      this._rows.forEach(function (obj, index) {
        for (var key in obj) {
          if (index === 0) _this2._cols[key] = [];
          _this2._cols[key].push(obj[key]);
        }
      });

      this._checkConsistency();
    }

    /**
     * Sets an object of arrays.
     *
     * @type {Object<String, Array>}
     */
  }, {
    key: "cols",
    set: function set(obj) {
      this._cols = obj;
      this._rows = [];

      this.updateFromCols();
    },

    /**
     * Returns an object of arrays.
     *
     * @type {Object<String, Array>}
     */
    get: function get() {
      return this._cols;
    }

    /**
     * Sets an array of objects.
     *
     * @type {Array<Object>}
     */
  }, {
    key: "rows",
    set: function set(arr) {
      this._rows = arr;
      this._cols = {};

      this.updateFromRows();
    },

    /**
     * Returns an array of objects.
     *
     * @type {Array<Object>}
     */
    get: function get() {
      return this._rows;
    }
  }]);

  return OrthogonalData;
})();

exports["default"] = OrthogonalData;
module.exports = exports["default"];

},{"babel-runtime/core-js/object/keys":71,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78}],58:[function(require,module,exports){
/**
* @author Robert Eisele <robert@xarg.org>
* @copyright Copyright (c) 2010, Robert Eisele
* @link http://www.xarg.org/2010/03/generate-client-side-png-files-using-javascript/
* @license http://www.opensource.org/licenses/bsd-license.php BSD License
*/
"use strict";

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var PNGEncoder = (function () {
  function PNGEncoder(width, height, depth) {
    _classCallCheck(this, PNGEncoder);

    this.width = width;
    this.height = height;
    this.depth = depth;

    // pixel data and row filter identifier size
    this.pix_size = height * (width + 1);

    // deflate header, pix_size, block headers, adler32 checksum
    this.data_size = 2 + this.pix_size + 5 * Math.floor((0xfffe + this.pix_size) / 0xffff) + 4;

    // offsets and sizes of Png chunks
    this.ihdr_offs = 0; // IHDR offset and size
    this.ihdr_size = 4 + 4 + 13 + 4;
    this.plte_offs = this.ihdr_offs + this.ihdr_size; // PLTE offset and size
    this.plte_size = 4 + 4 + 3 * depth + 4;
    this.trns_offs = this.plte_offs + this.plte_size; // tRNS offset and size
    this.trns_size = 4 + 4 + depth + 4;
    this.idat_offs = this.trns_offs + this.trns_size; // IDAT offset and size
    this.idat_size = 4 + 4 + this.data_size + 4;
    this.iend_offs = this.idat_offs + this.idat_size; // IEND offset and size
    this.iend_size = 4 + 4 + 4;
    this.buffer_size = this.iend_offs + this.iend_size; // total PNG size

    this.buffer = [];
    this.palette = {};
    this.pindex = 0;

    var _crc32 = [];

    var i;

    // initialize buffer with zero bytes
    for (i = 0; i < this.buffer_size; i++) {
      this.buffer[i] = "\x00";
    }

    // initialize non-zero elements
    PNGEncoder._write(this.buffer, this.ihdr_offs, PNGEncoder._byte4(this.ihdr_size - 12), 'IHDR', PNGEncoder._byte4(width), PNGEncoder._byte4(height), "\x08\x03");
    PNGEncoder._write(this.buffer, this.plte_offs, PNGEncoder._byte4(this.plte_size - 12), 'PLTE');
    PNGEncoder._write(this.buffer, this.trns_offs, PNGEncoder._byte4(this.trns_size - 12), 'tRNS');
    PNGEncoder._write(this.buffer, this.idat_offs, PNGEncoder._byte4(this.idat_size - 12), 'IDAT');
    PNGEncoder._write(this.buffer, this.iend_offs, PNGEncoder._byte4(this.iend_size - 12), 'IEND');

    // initialize deflate header
    var header = 8 + (7 << 4) << 8 | 3 << 6;
    header += 31 - header % 31;

    PNGEncoder._write(this.buffer, this.idat_offs + 8, PNGEncoder._byte2(header));

    // initialize deflate block headers
    for (i = 0; (i << 16) - 1 < this.pix_size; i++) {
      var size, bits;
      if (i + 0xffff < this.pix_size) {
        size = 0xffff;
        bits = "\x00";
      } else {
        size = this.pix_size - (i << 16) - i;
        bits = "\x01";
      }
      PNGEncoder._write(this.buffer, this.idat_offs + 8 + 2 + (i << 16) + (i << 2), bits, PNGEncoder._byte2lsb(size), PNGEncoder._byte2lsb(~size));
    }

    /* Create crc32 lookup table */
    for (i = 0; i < 256; i++) {
      var c = i;
      for (var j = 0; j < 8; j++) {
        if (c & 1) {
          c = -306674912 ^ c >> 1 & 0x7fffffff;
        } else {
          c = c >> 1 & 0x7fffffff;
        }
      }
      _crc32[i] = c;
    }

    this._crc32 = _crc32;
  }

  _createClass(PNGEncoder, [{
    key: "index",

    // compute the index into a png for a given pixel
    value: function index(x, y) {
      var i = y * (this.width + 1) + x + 1;
      var j = this.idat_offs + 8 + 2 + 5 * Math.floor(i / 0xffff + 1) + i;
      return j;
    }

    // convert a color and build up the palette
  }, {
    key: "color",
    value: function color(red, green, blue, alpha) {

      alpha = alpha >= 0 ? alpha : 255;
      var color = ((alpha << 8 | red) << 8 | green) << 8 | blue;

      if (typeof this.palette[color] == "undefined") {
        if (this.pindex == this.depth) return "\x00";

        var ndx = this.plte_offs + 8 + 3 * this.pindex;

        this.buffer[ndx + 0] = String.fromCharCode(red);
        this.buffer[ndx + 1] = String.fromCharCode(green);
        this.buffer[ndx + 2] = String.fromCharCode(blue);
        this.buffer[this.trns_offs + 8 + this.pindex] = String.fromCharCode(alpha);

        this.palette[color] = String.fromCharCode(this.pindex++);

        //      console.log("Added colour [" + red + "," + green + "," + blue +
        //                  "], palette now has " + this.pindex + " colour(s)");
      }
      return this.palette[color];
    }

    // output a PNG string, Base64 encoded
  }, {
    key: "getBase64",
    value: function getBase64() {

      var s = this.getDump();

      // If the current browser supports the Base64 encoding
      // function, then offload the that to the browser as it
      // will be done in native code.
      if (typeof window.btoa !== 'undefined' && window.btoa !== null) {
        return window.btoa(s);
      }

      var ch = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      var c1, c2, c3, e1, e2, e3, e4;
      var l = s.length;
      var i = 0;
      var r = "";

      do {
        c1 = s.charCodeAt(i);
        e1 = c1 >> 2;
        c2 = s.charCodeAt(i + 1);
        e2 = (c1 & 3) << 4 | c2 >> 4;
        c3 = s.charCodeAt(i + 2);
        if (l < i + 2) {
          e3 = 64;
        } else {
          e3 = (c2 & 0xf) << 2 | c3 >> 6;
        }
        if (l < i + 3) {
          e4 = 64;
        } else {
          e4 = c3 & 0x3f;
        }
        r += ch.charAt(e1) + ch.charAt(e2) + ch.charAt(e3) + ch.charAt(e4);
      } while ((i += 3) < l);
      return r;
    }

    // output a PNG string
  }, {
    key: "getDump",
    value: function getDump() {

      // compute adler32 of output pixels + row filter bytes
      var BASE = 65521; /* largest prime smaller than 65536 */
      var NMAX = 5552; /* NMAX is the largest n such that 255n(n+1)/2 + (n+1)(BASE-1) <= 2^32-1 */
      var s1 = 1;
      var s2 = 0;
      var n = NMAX;

      for (var y = 0; y < this.height; y++) {
        for (var x = -1; x < this.width; x++) {
          s1 += this.buffer[this.index(x, y)].charCodeAt(0);
          s2 += s1;
          if ((n -= 1) === 0) {
            s1 %= BASE;
            s2 %= BASE;
            n = NMAX;
          }
        }
      }
      s1 %= BASE;
      s2 %= BASE;
      PNGEncoder._write(this.buffer, this.idat_offs + this.idat_size - 8, PNGEncoder._byte4(s2 << 16 | s1));

      // compute crc32 of the PNG chunks
      function crc32(png, offs, size, crctable) {
        var crc = -1;
        for (var i = 4; i < size - 4; i += 1) {
          crc = crctable[(crc ^ png[offs + i].charCodeAt(0)) & 0xff] ^ crc >> 8 & 0x00ffffff;
        }
        PNGEncoder._write(png, offs + size - 4, PNGEncoder._byte4(crc ^ -1));
      }

      crc32(this.buffer, this.ihdr_offs, this.ihdr_size, this._crc32);
      crc32(this.buffer, this.plte_offs, this.plte_size, this._crc32);
      crc32(this.buffer, this.trns_offs, this.trns_size, this._crc32);
      crc32(this.buffer, this.idat_offs, this.idat_size, this._crc32);
      crc32(this.buffer, this.iend_offs, this.iend_size, this._crc32);

      // convert PNG to string
      return "\x89PNG\r\n\x1a\n" + this.buffer.join('');
    }
  }], [{
    key: "_write",
    value: function _write(buffer, offs) {
      for (var i = 2; i < arguments.length; i++) {
        for (var j = 0; j < arguments[i].length; j++) {
          buffer[offs++] = arguments[i].charAt(j);
        }
      }
    }
  }, {
    key: "_byte2",
    value: function _byte2(w) {
      return String.fromCharCode(w >> 8 & 255, w & 255);
    }
  }, {
    key: "_byte4",
    value: function _byte4(w) {
      return String.fromCharCode(w >> 24 & 255, w >> 16 & 255, w >> 8 & 255, w & 255);
    }
  }, {
    key: "_byte2lsb",
    value: function _byte2lsb(w) {
      return String.fromCharCode(w & 255, w >> 8 & 255);
    }
  }]);

  return PNGEncoder;
})();

exports["default"] = PNGEncoder;
module.exports = exports["default"];

},{"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78}],59:[function(require,module,exports){
"use strict";

var _get = require("babel-runtime/helpers/get")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _matrixEntityJs = require('./matrix-entity.js');

var _matrixEntityJs2 = _interopRequireDefault(_matrixEntityJs);

var PrefilledMatrixEntity = (function (_MatrixEntity) {
  _inherits(PrefilledMatrixEntity, _MatrixEntity);

  function PrefilledMatrixEntity(data, startTime, stepDuration) {
    _classCallCheck(this, PrefilledMatrixEntity);

    _get(Object.getPrototypeOf(PrefilledMatrixEntity.prototype), "constructor", this).call(this);

    // data should be Float32Array[] or number[][]
    this.data = data;

    this.stepDuration = 0;
    this.startTime = 0;

    if (typeof startTime !== "undefined") {
      this.startTime = startTime;
    }
    if (typeof stepDuration !== "undefined") {
      this.stepDuration = stepDuration;
    }
  }

  _createClass(PrefilledMatrixEntity, [{
    key: "getColumnCount",
    value: function getColumnCount() {
      return this.data.length;
    }
  }, {
    key: "getColumnHeight",
    value: function getColumnHeight() {
      if (this.data.length > 0) {
        return this.data[0].length;
      } else {
        return 0;
      }
    }
  }, {
    key: "getColumn",
    value: function getColumn(n) {
      return this.data[n];
    }
  }, {
    key: "getStepDuration",
    value: function getStepDuration() {
      return this.stepDuration;
    }
  }, {
    key: "getStartTime",
    value: function getStartTime() {
      return this.startTime;
    }
  }, {
    key: "dispose",
    value: function dispose() {
      this.data = [];
    }
  }]);

  return PrefilledMatrixEntity;
})(_matrixEntityJs2["default"]);

exports["default"] = PrefilledMatrixEntity;
module.exports = exports["default"];

},{"./matrix-entity.js":56,"babel-runtime/helpers/class-call-check":77,"babel-runtime/helpers/create-class":78,"babel-runtime/helpers/get":79,"babel-runtime/helpers/inherits":80,"babel-runtime/helpers/interop-require-default":81}],60:[function(require,module,exports){
/**
 * Lightweight scales mimicing the `d3.js` functionnal API.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = {
  /**
   * A linear scale interpolating values between a `domain` and a `range`.
   * @return {Function}
   */
  linear: function linear() {
    var _domain = [0, 1];
    var _range = [0, 1];

    var _slope = 1;
    var _intercept = 0;

    function _updateCoefs() {
      _slope = (_range[1] - _range[0]) / (_domain[1] - _domain[0]);
      _intercept = _range[0] - _slope * _domain[0];
    }

    function scale(value) {
      return _slope * value + _intercept;
    }

    scale.invert = function (value) {
      return (value - _intercept) / _slope;
    };

    scale.domain = function () {
      var arr = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (arr === null) {
        return _domain;
      }

      _domain = arr;
      _updateCoefs();

      return scale;
    };

    scale.range = function () {
      var arr = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (arr === null) {
        return _range;
      }

      _range = arr;
      _updateCoefs();

      return scale;
    };

    return scale;
  }
};
module.exports = exports["default"];

},{}],61:[function(require,module,exports){
// core
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreLayerTimeContext = require('./core/layer-time-context');

var _coreLayerTimeContext2 = _interopRequireDefault(_coreLayerTimeContext);

var _coreLayer = require('./core/layer');

var _coreLayer2 = _interopRequireDefault(_coreLayer);

var _coreNamespace = require('./core/namespace');

var _coreNamespace2 = _interopRequireDefault(_coreNamespace);

var _coreTimelineTimeContext = require('./core/timeline-time-context');

var _coreTimelineTimeContext2 = _interopRequireDefault(_coreTimelineTimeContext);

var _coreTimeline = require('./core/timeline');

var _coreTimeline2 = _interopRequireDefault(_coreTimeline);

var _coreTrackCollection = require('./core/track-collection');

var _coreTrackCollection2 = _interopRequireDefault(_coreTrackCollection);

var _coreTrack = require('./core/track');

var _coreTrack2 = _interopRequireDefault(_coreTrack);

// shapes

var _shapesAnnotatedMarker = require('./shapes/annotated-marker');

var _shapesAnnotatedMarker2 = _interopRequireDefault(_shapesAnnotatedMarker);

var _shapesAnnotatedSegment = require('./shapes/annotated-segment');

var _shapesAnnotatedSegment2 = _interopRequireDefault(_shapesAnnotatedSegment);

var _shapesBaseShape = require('./shapes/base-shape');

var _shapesBaseShape2 = _interopRequireDefault(_shapesBaseShape);

var _shapesCursor = require('./shapes/cursor');

var _shapesCursor2 = _interopRequireDefault(_shapesCursor);

var _shapesDot = require('./shapes/dot');

var _shapesDot2 = _interopRequireDefault(_shapesDot);

var _shapesLine = require('./shapes/line');

var _shapesLine2 = _interopRequireDefault(_shapesLine);

var _shapesMarker = require('./shapes/marker');

var _shapesMarker2 = _interopRequireDefault(_shapesMarker);

var _shapesMatrix = require('./shapes/matrix');

var _shapesMatrix2 = _interopRequireDefault(_shapesMatrix);

var _shapesSegment = require('./shapes/segment');

var _shapesSegment2 = _interopRequireDefault(_shapesSegment);

var _shapesTicks = require('./shapes/ticks');

var _shapesTicks2 = _interopRequireDefault(_shapesTicks);

var _shapesTracePath = require('./shapes/trace-path');

var _shapesTracePath2 = _interopRequireDefault(_shapesTracePath);

var _shapesTraceDots = require('./shapes/trace-dots');

var _shapesTraceDots2 = _interopRequireDefault(_shapesTraceDots);

var _shapesWaveform = require('./shapes/waveform');

var _shapesWaveform2 = _interopRequireDefault(_shapesWaveform);

// behaviors

var _behaviorsBaseBehavior = require('./behaviors/base-behavior');

var _behaviorsBaseBehavior2 = _interopRequireDefault(_behaviorsBaseBehavior);

var _behaviorsBreakpointBehavior = require('./behaviors/breakpoint-behavior');

var _behaviorsBreakpointBehavior2 = _interopRequireDefault(_behaviorsBreakpointBehavior);

var _behaviorsMarkerBehavior = require('./behaviors/marker-behavior');

var _behaviorsMarkerBehavior2 = _interopRequireDefault(_behaviorsMarkerBehavior);

var _behaviorsSegmentBehavior = require('./behaviors/segment-behavior');

var _behaviorsSegmentBehavior2 = _interopRequireDefault(_behaviorsSegmentBehavior);

var _behaviorsTimeContextBehavior = require('./behaviors/time-context-behavior');

var _behaviorsTimeContextBehavior2 = _interopRequireDefault(_behaviorsTimeContextBehavior);

var _behaviorsTraceBehavior = require('./behaviors/trace-behavior');

var _behaviorsTraceBehavior2 = _interopRequireDefault(_behaviorsTraceBehavior);

// interactions

var _interactionsEventSource = require('./interactions/event-source');

var _interactionsEventSource2 = _interopRequireDefault(_interactionsEventSource);

var _interactionsKeyboard = require('./interactions/keyboard');

var _interactionsKeyboard2 = _interopRequireDefault(_interactionsKeyboard);

var _interactionsSurface = require('./interactions/surface');

var _interactionsSurface2 = _interopRequireDefault(_interactionsSurface);

var _interactionsWaveEvent = require('./interactions/wave-event');

var _interactionsWaveEvent2 = _interopRequireDefault(_interactionsWaveEvent);

// states

var _statesBaseState = require('./states/base-state');

var _statesBaseState2 = _interopRequireDefault(_statesBaseState);

var _statesBreakpointState = require('./states/breakpoint-state');

var _statesBreakpointState2 = _interopRequireDefault(_statesBreakpointState);

var _statesBrushZoomState = require('./states/brush-zoom-state');

var _statesBrushZoomState2 = _interopRequireDefault(_statesBrushZoomState);

var _statesCenteredZoomState = require('./states/centered-zoom-state');

var _statesCenteredZoomState2 = _interopRequireDefault(_statesCenteredZoomState);

var _statesContextEditionState = require('./states/context-edition-state');

var _statesContextEditionState2 = _interopRequireDefault(_statesContextEditionState);

var _statesEditionState = require('./states/edition-state');

var _statesEditionState2 = _interopRequireDefault(_statesEditionState);

var _statesSelectionState = require('./states/selection-state');

var _statesSelectionState2 = _interopRequireDefault(_statesSelectionState);

var _statesSimpleEditionState = require('./states/simple-edition-state');

var _statesSimpleEditionState2 = _interopRequireDefault(_statesSimpleEditionState);

// helpers

var _helpersAnnotatedMarkerLayer = require('./helpers/annotated-marker-layer');

var _helpersAnnotatedMarkerLayer2 = _interopRequireDefault(_helpersAnnotatedMarkerLayer);

var _helpersAnnotatedSegmentLayer = require('./helpers/annotated-segment-layer');

var _helpersAnnotatedSegmentLayer2 = _interopRequireDefault(_helpersAnnotatedSegmentLayer);

var _helpersBreakpointLayer = require('./helpers/breakpoint-layer');

var _helpersBreakpointLayer2 = _interopRequireDefault(_helpersBreakpointLayer);

var _helpersCursorLayer = require('./helpers/cursor-layer');

var _helpersCursorLayer2 = _interopRequireDefault(_helpersCursorLayer);

var _helpersGridAxisLayer = require('./helpers/grid-axis-layer');

var _helpersGridAxisLayer2 = _interopRequireDefault(_helpersGridAxisLayer);

var _helpersLineLayer = require('./helpers/line-layer');

var _helpersLineLayer2 = _interopRequireDefault(_helpersLineLayer);

var _helpersMarkerLayer = require('./helpers/marker-layer');

var _helpersMarkerLayer2 = _interopRequireDefault(_helpersMarkerLayer);

var _helpersMatrixLayer = require('./helpers/matrix-layer');

var _helpersMatrixLayer2 = _interopRequireDefault(_helpersMatrixLayer);

var _helpersSegmentLayer = require('./helpers/segment-layer');

var _helpersSegmentLayer2 = _interopRequireDefault(_helpersSegmentLayer);

var _helpersTickLayer = require('./helpers/tick-layer');

var _helpersTickLayer2 = _interopRequireDefault(_helpersTickLayer);

var _helpersTimeAxisLayer = require('./helpers/time-axis-layer');

var _helpersTimeAxisLayer2 = _interopRequireDefault(_helpersTimeAxisLayer);

var _helpersTraceLayer = require('./helpers/trace-layer');

var _helpersTraceLayer2 = _interopRequireDefault(_helpersTraceLayer);

var _helpersWaveformLayer = require('./helpers/waveform-layer');

var _helpersWaveformLayer2 = _interopRequireDefault(_helpersWaveformLayer);

// axis

var _axisAxisLayer = require('./axis/axis-layer');

var _axisAxisLayer2 = _interopRequireDefault(_axisAxisLayer);

var _axisTimeAxisGenerator = require('./axis/time-axis-generator');

var _axisTimeAxisGenerator2 = _interopRequireDefault(_axisTimeAxisGenerator);

var _axisGridAxisGenerator = require('./axis/grid-axis-generator');

var _axisGridAxisGenerator2 = _interopRequireDefault(_axisGridAxisGenerator);

// utils

var _utilsFormat = require('./utils/format');

var _utilsFormat2 = _interopRequireDefault(_utilsFormat);

var _utilsMatrixEntity = require('./utils/matrix-entity');

var _utilsMatrixEntity2 = _interopRequireDefault(_utilsMatrixEntity);

var _utilsOrthogonalData = require('./utils/orthogonal-data');

var _utilsOrthogonalData2 = _interopRequireDefault(_utilsOrthogonalData);

var _utilsPrefilledMatrixEntity = require('./utils/prefilled-matrix-entity');

var _utilsPrefilledMatrixEntity2 = _interopRequireDefault(_utilsPrefilledMatrixEntity);

var _utilsScales = require('./utils/scales');

var _utilsScales2 = _interopRequireDefault(_utilsScales);

exports['default'] = {
  core: {
    LayerTimeContext: _coreLayerTimeContext2['default'], Layer: _coreLayer2['default'], namespace: _coreNamespace2['default'],
    TimelineTimeContext: _coreTimelineTimeContext2['default'], Timeline: _coreTimeline2['default'], TrackCollection: _coreTrackCollection2['default'], Track: _coreTrack2['default']
  },
  shapes: {
    AnnotatedMarker: _shapesAnnotatedMarker2['default'], AnnotatedSegment: _shapesAnnotatedSegment2['default'], BaseShape: _shapesBaseShape2['default'], Cursor: _shapesCursor2['default'],
    Dot: _shapesDot2['default'], Line: _shapesLine2['default'], Marker: _shapesMarker2['default'], Matrix: _shapesMatrix2['default'], Segment: _shapesSegment2['default'], Ticks: _shapesTicks2['default'], TracePath: _shapesTracePath2['default'], TraceDots: _shapesTraceDots2['default'], Waveform: _shapesWaveform2['default']
  },
  behaviors: {
    BaseBehavior: _behaviorsBaseBehavior2['default'], BreakpointBehavior: _behaviorsBreakpointBehavior2['default'], MarkerBehavior: _behaviorsMarkerBehavior2['default'], SegmentBehavior: _behaviorsSegmentBehavior2['default'],
    TimeContextBehavior: _behaviorsTimeContextBehavior2['default'], TraceBehavior: _behaviorsTraceBehavior2['default']
  },
  interactions: { EventSource: _interactionsEventSource2['default'], Keyboard: _interactionsKeyboard2['default'], Surface: _interactionsSurface2['default'], WaveEvent: _interactionsWaveEvent2['default'] },
  states: {
    BaseState: _statesBaseState2['default'], BreakpointState: _statesBreakpointState2['default'], BrushZoomState: _statesBrushZoomState2['default'], CenteredZoomState: _statesCenteredZoomState2['default'],
    ContextEditionState: _statesContextEditionState2['default'], EditionState: _statesEditionState2['default'], SelectionState: _statesSelectionState2['default'], SimpleEditionState: _statesSimpleEditionState2['default']
  },
  helpers: {
    AnnotatedMarkerLayer: _helpersAnnotatedMarkerLayer2['default'], AnnotatedSegmentLayer: _helpersAnnotatedSegmentLayer2['default'], BreakpointLayer: _helpersBreakpointLayer2['default'],
    CursorLayer: _helpersCursorLayer2['default'], GridAxisLayer: _helpersGridAxisLayer2['default'], LineLayer: _helpersLineLayer2['default'], MarkerLayer: _helpersMarkerLayer2['default'], MatrixLayer: _helpersMatrixLayer2['default'], SegmentLayer: _helpersSegmentLayer2['default'],
    TickLayer: _helpersTickLayer2['default'], TimeAxisLayer: _helpersTimeAxisLayer2['default'], TraceLayer: _helpersTraceLayer2['default'], WaveformLayer: _helpersWaveformLayer2['default']
  },
  axis: {
    AxisLayer: _axisAxisLayer2['default'], timeAxisGenerator: _axisTimeAxisGenerator2['default'], gridAxisGenerator: _axisGridAxisGenerator2['default']
  },
  utils: {
    format: _utilsFormat2['default'], MatrixEntity: _utilsMatrixEntity2['default'], OrthogonalData: _utilsOrthogonalData2['default'], PrefilledMatrixEntity: _utilsPrefilledMatrixEntity2['default'], scales: _utilsScales2['default']
  }
};
module.exports = exports['default'];

},{"./axis/axis-layer":1,"./axis/grid-axis-generator":2,"./axis/time-axis-generator":3,"./behaviors/base-behavior":4,"./behaviors/breakpoint-behavior":5,"./behaviors/marker-behavior":6,"./behaviors/segment-behavior":7,"./behaviors/time-context-behavior":8,"./behaviors/trace-behavior":9,"./core/layer":11,"./core/layer-time-context":10,"./core/namespace":12,"./core/timeline":14,"./core/timeline-time-context":13,"./core/track":16,"./core/track-collection":15,"./helpers/annotated-marker-layer":17,"./helpers/annotated-segment-layer":18,"./helpers/breakpoint-layer":19,"./helpers/cursor-layer":20,"./helpers/grid-axis-layer":21,"./helpers/line-layer":22,"./helpers/marker-layer":23,"./helpers/matrix-layer":24,"./helpers/segment-layer":25,"./helpers/tick-layer":26,"./helpers/time-axis-layer":27,"./helpers/trace-layer":28,"./helpers/waveform-layer":29,"./interactions/event-source":30,"./interactions/keyboard":31,"./interactions/surface":32,"./interactions/wave-event":33,"./shapes/annotated-marker":34,"./shapes/annotated-segment":35,"./shapes/base-shape":36,"./shapes/cursor":37,"./shapes/dot":38,"./shapes/line":39,"./shapes/marker":40,"./shapes/matrix":41,"./shapes/segment":42,"./shapes/ticks":43,"./shapes/trace-dots":44,"./shapes/trace-path":45,"./shapes/waveform":46,"./states/base-state":47,"./states/breakpoint-state":48,"./states/brush-zoom-state":49,"./states/centered-zoom-state":50,"./states/context-edition-state":51,"./states/edition-state":52,"./states/selection-state":53,"./states/simple-edition-state":54,"./utils/format":55,"./utils/matrix-entity":56,"./utils/orthogonal-data":57,"./utils/prefilled-matrix-entity":59,"./utils/scales":60,"babel-runtime/helpers/interop-require-default":81}],62:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/array/from"), __esModule: true };
},{"core-js/library/fn/array/from":86}],63:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/get-iterator"), __esModule: true };
},{"core-js/library/fn/get-iterator":87}],64:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/is-iterable"), __esModule: true };
},{"core-js/library/fn/is-iterable":88}],65:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/map"), __esModule: true };
},{"core-js/library/fn/map":89}],66:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/math/log10"), __esModule: true };
},{"core-js/library/fn/math/log10":90}],67:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/assign"), __esModule: true };
},{"core-js/library/fn/object/assign":91}],68:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/create"), __esModule: true };
},{"core-js/library/fn/object/create":92}],69:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":93}],70:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/get-own-property-descriptor"), __esModule: true };
},{"core-js/library/fn/object/get-own-property-descriptor":94}],71:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/keys"), __esModule: true };
},{"core-js/library/fn/object/keys":95}],72:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/set-prototype-of"), __esModule: true };
},{"core-js/library/fn/object/set-prototype-of":96}],73:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/promise"), __esModule: true };
},{"core-js/library/fn/promise":97}],74:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/set"), __esModule: true };
},{"core-js/library/fn/set":98}],75:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol"), __esModule: true };
},{"core-js/library/fn/symbol":99}],76:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol/iterator"), __esModule: true };
},{"core-js/library/fn/symbol/iterator":100}],77:[function(require,module,exports){
"use strict";

exports["default"] = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

exports.__esModule = true;
},{}],78:[function(require,module,exports){
"use strict";

var _Object$defineProperty = require("babel-runtime/core-js/object/define-property")["default"];

exports["default"] = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;

      _Object$defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

exports.__esModule = true;
},{"babel-runtime/core-js/object/define-property":69}],79:[function(require,module,exports){
"use strict";

var _Object$getOwnPropertyDescriptor = require("babel-runtime/core-js/object/get-own-property-descriptor")["default"];

exports["default"] = function get(_x, _x2, _x3) {
  var _again = true;

  _function: while (_again) {
    var object = _x,
        property = _x2,
        receiver = _x3;
    _again = false;
    if (object === null) object = Function.prototype;

    var desc = _Object$getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        _x = parent;
        _x2 = property;
        _x3 = receiver;
        _again = true;
        desc = parent = undefined;
        continue _function;
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  }
};

exports.__esModule = true;
},{"babel-runtime/core-js/object/get-own-property-descriptor":70}],80:[function(require,module,exports){
"use strict";

var _Object$create = require("babel-runtime/core-js/object/create")["default"];

var _Object$setPrototypeOf = require("babel-runtime/core-js/object/set-prototype-of")["default"];

exports["default"] = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = _Object$create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _Object$setPrototypeOf ? _Object$setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

exports.__esModule = true;
},{"babel-runtime/core-js/object/create":68,"babel-runtime/core-js/object/set-prototype-of":72}],81:[function(require,module,exports){
"use strict";

exports["default"] = function (obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
};

exports.__esModule = true;
},{}],82:[function(require,module,exports){
"use strict";

var _getIterator = require("babel-runtime/core-js/get-iterator")["default"];

var _isIterable = require("babel-runtime/core-js/is-iterable")["default"];

exports["default"] = (function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = _getIterator(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (_isIterable(Object(arr))) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
})();

exports.__esModule = true;
},{"babel-runtime/core-js/get-iterator":63,"babel-runtime/core-js/is-iterable":64}],83:[function(require,module,exports){
"use strict";

var _Array$from = require("babel-runtime/core-js/array/from")["default"];

exports["default"] = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return _Array$from(arr);
  }
};

exports.__esModule = true;
},{"babel-runtime/core-js/array/from":62}],84:[function(require,module,exports){
(function (global){
// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g =
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this;

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = require("./runtime");

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}

module.exports = { "default": module.exports, __esModule: true };

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./runtime":85}],85:[function(require,module,exports){
(function (process,global){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

"use strict";

var _Symbol = require("babel-runtime/core-js/symbol")["default"];

var _Object$create = require("babel-runtime/core-js/object/create")["default"];

var _Object$setPrototypeOf = require("babel-runtime/core-js/object/set-prototype-of")["default"];

var _Promise = require("babel-runtime/core-js/promise")["default"];

!(function (global) {
  "use strict";

  var hasOwn = Object.prototype.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof _Symbol === "function" ? _Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided, then outerFn.prototype instanceof Generator.
    var generator = _Object$create((outerFn || Generator).prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      prototype[method] = function (arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function (genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor ? ctor === GeneratorFunction ||
    // For the native GeneratorFunction constructor, the best we can
    // do is to check its .name property.
    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
  };

  runtime.mark = function (genFun) {
    if (_Object$setPrototypeOf) {
      _Object$setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = _Object$create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `value instanceof AwaitArgument` to determine if the yielded value is
  // meant to be awaited. Some may consider the name of this method too
  // cutesy, but they are curmudgeons.
  runtime.awrap = function (arg) {
    return new AwaitArgument(arg);
  };

  function AwaitArgument(arg) {
    this.arg = arg;
  }

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value instanceof AwaitArgument) {
          return _Promise.resolve(value.arg).then(function (value) {
            invoke("next", value, resolve, reject);
          }, function (err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return _Promise.resolve(value).then(function (unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof process === "object" && process.domain) {
      invoke = process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new _Promise(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
      // If enqueue has been called before, then we want to wait until
      // all previous Promises have been resolved before calling invoke,
      // so that results are always delivered in the correct order. If
      // enqueue has not been called before, then it is important to
      // call invoke immediately, without waiting on a callback to fire,
      // so that the async generator function has the opportunity to do
      // any necessary setup in a predictable way. This predictability
      // is why the Promise constructor synchronously invokes its
      // executor callback, and why async functions synchronously
      // execute code before the first await. Since we implement simple
      // async functions in terms of async generators, it is especially
      // important to get this right, even though it requires care.
      previousPromise ? previousPromise.then(callInvokeWithMethodAndArg,
      // Avoid propagating failures to Promises returned by later
      // invocations of the iterator.
      callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function (innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));

    return runtime.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
    : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          if (method === "return" || method === "throw" && delegate.iterator[method] === undefined) {
            // A return or throw (when the delegate iterator has no throw
            // method) always terminates the yield* loop.
            context.delegate = null;

            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            var returnMethod = delegate.iterator["return"];
            if (returnMethod) {
              var record = tryCatch(returnMethod, delegate.iterator, arg);
              if (record.type === "throw") {
                // If the return method threw an exception, let that
                // exception prevail over the original return or throw.
                method = "throw";
                arg = record.arg;
                continue;
              }
            }

            if (method === "return") {
              // Continue with the outer return, now that the delegate
              // iterator has been terminated.
              continue;
            }
          }

          var record = tryCatch(delegate.iterator[method], delegate.iterator, arg);

          if (record.type === "throw") {
            context.delegate = null;

            // Like returning generator.throw(uncaught), but without the
            // overhead of an extra function call.
            method = "throw";
            arg = record.arg;
            continue;
          }

          // Delegate generator ran and handled its own exceptions so
          // regardless of what the method was, we continue as if it is
          // "next" with an undefined arg.
          method = "next";
          arg = undefined;

          var info = record.arg;
          if (info.done) {
            context[delegate.resultName] = info.value;
            context.next = delegate.nextLoc;
          } else {
            state = GenStateSuspendedYield;
            return info;
          }

          context.delegate = null;
        }

        if (method === "next") {
          if (state === GenStateSuspendedYield) {
            context.sent = arg;
          } else {
            context.sent = undefined;
          }
        } else if (method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw arg;
          }

          if (context.dispatchException(arg)) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            method = "next";
            arg = undefined;
          }
        } else if (method === "return") {
          context.abrupt("return", arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done ? GenStateCompleted : GenStateSuspendedYield;

          var info = {
            value: record.arg,
            done: context.done
          };

          if (record.arg === ContinueSentinel) {
            if (context.delegate && method === "next") {
              // Deliberately forget the last sent value so that we don't
              // accidentally pass it on to the delegate.
              arg = undefined;
            }
          } else {
            return info;
          }
        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(arg) call above.
          method = "throw";
          arg = record.arg;
        }
      }
    };
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[iteratorSymbol] = function () {
    return this;
  };

  Gp[toStringTagSymbol] = "Generator";

  Gp.toString = function () {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function (object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1,
            next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function reset(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      this.sent = undefined;
      this.done = false;
      this.delegate = null;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function stop() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function dispatchException(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;
        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }
          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.next = finallyEntry.finallyLoc;
      } else {
        this.complete(record);
      }

      return ContinueSentinel;
    },

    complete: function complete(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" || record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = record.arg;
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }
    },

    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      return ContinueSentinel;
    }
  };
})(
// Among the various tricks for obtaining a reference to the global
// object, this seems to be the most reliable technique that does not
// use indirect eval (which violates Content Security Policy).
typeof global === "object" ? global : typeof window === "object" ? window : typeof self === "object" ? self : undefined);
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"_process":178,"babel-runtime/core-js/object/create":68,"babel-runtime/core-js/object/set-prototype-of":72,"babel-runtime/core-js/promise":73,"babel-runtime/core-js/symbol":75}],86:[function(require,module,exports){
require('../../modules/es6.string.iterator');
require('../../modules/es6.array.from');
module.exports = require('../../modules/$.core').Array.from;
},{"../../modules/$.core":109,"../../modules/es6.array.from":161,"../../modules/es6.string.iterator":172}],87:[function(require,module,exports){
require('../modules/web.dom.iterable');
require('../modules/es6.string.iterator');
module.exports = require('../modules/core.get-iterator');
},{"../modules/core.get-iterator":159,"../modules/es6.string.iterator":172,"../modules/web.dom.iterable":176}],88:[function(require,module,exports){
require('../modules/web.dom.iterable');
require('../modules/es6.string.iterator');
module.exports = require('../modules/core.is-iterable');
},{"../modules/core.is-iterable":160,"../modules/es6.string.iterator":172,"../modules/web.dom.iterable":176}],89:[function(require,module,exports){
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.map');
require('../modules/es7.map.to-json');
module.exports = require('../modules/$.core').Map;
},{"../modules/$.core":109,"../modules/es6.map":163,"../modules/es6.object.to-string":169,"../modules/es6.string.iterator":172,"../modules/es7.map.to-json":174,"../modules/web.dom.iterable":176}],90:[function(require,module,exports){
require('../../modules/es6.math.log10');
module.exports = require('../../modules/$.core').Math.log10;
},{"../../modules/$.core":109,"../../modules/es6.math.log10":164}],91:[function(require,module,exports){
require('../../modules/es6.object.assign');
module.exports = require('../../modules/$.core').Object.assign;
},{"../../modules/$.core":109,"../../modules/es6.object.assign":165}],92:[function(require,module,exports){
var $ = require('../../modules/$');
module.exports = function create(P, D){
  return $.create(P, D);
};
},{"../../modules/$":134}],93:[function(require,module,exports){
var $ = require('../../modules/$');
module.exports = function defineProperty(it, key, desc){
  return $.setDesc(it, key, desc);
};
},{"../../modules/$":134}],94:[function(require,module,exports){
var $ = require('../../modules/$');
require('../../modules/es6.object.get-own-property-descriptor');
module.exports = function getOwnPropertyDescriptor(it, key){
  return $.getDesc(it, key);
};
},{"../../modules/$":134,"../../modules/es6.object.get-own-property-descriptor":166}],95:[function(require,module,exports){
require('../../modules/es6.object.keys');
module.exports = require('../../modules/$.core').Object.keys;
},{"../../modules/$.core":109,"../../modules/es6.object.keys":167}],96:[function(require,module,exports){
require('../../modules/es6.object.set-prototype-of');
module.exports = require('../../modules/$.core').Object.setPrototypeOf;
},{"../../modules/$.core":109,"../../modules/es6.object.set-prototype-of":168}],97:[function(require,module,exports){
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.promise');
module.exports = require('../modules/$.core').Promise;
},{"../modules/$.core":109,"../modules/es6.object.to-string":169,"../modules/es6.promise":170,"../modules/es6.string.iterator":172,"../modules/web.dom.iterable":176}],98:[function(require,module,exports){
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.set');
require('../modules/es7.set.to-json');
module.exports = require('../modules/$.core').Set;
},{"../modules/$.core":109,"../modules/es6.object.to-string":169,"../modules/es6.set":171,"../modules/es6.string.iterator":172,"../modules/es7.set.to-json":175,"../modules/web.dom.iterable":176}],99:[function(require,module,exports){
require('../../modules/es6.symbol');
require('../../modules/es6.object.to-string');
module.exports = require('../../modules/$.core').Symbol;
},{"../../modules/$.core":109,"../../modules/es6.object.to-string":169,"../../modules/es6.symbol":173}],100:[function(require,module,exports){
require('../../modules/es6.string.iterator');
require('../../modules/web.dom.iterable');
module.exports = require('../../modules/$.wks')('iterator');
},{"../../modules/$.wks":157,"../../modules/es6.string.iterator":172,"../../modules/web.dom.iterable":176}],101:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],102:[function(require,module,exports){
module.exports = function(){ /* empty */ };
},{}],103:[function(require,module,exports){
var isObject = require('./$.is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./$.is-object":127}],104:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./$.cof')
  , TAG = require('./$.wks')('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"./$.cof":105,"./$.wks":157}],105:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],106:[function(require,module,exports){
'use strict';
var $            = require('./$')
  , hide         = require('./$.hide')
  , redefineAll  = require('./$.redefine-all')
  , ctx          = require('./$.ctx')
  , strictNew    = require('./$.strict-new')
  , defined      = require('./$.defined')
  , forOf        = require('./$.for-of')
  , $iterDefine  = require('./$.iter-define')
  , step         = require('./$.iter-step')
  , ID           = require('./$.uid')('id')
  , $has         = require('./$.has')
  , isObject     = require('./$.is-object')
  , setSpecies   = require('./$.set-species')
  , DESCRIPTORS  = require('./$.descriptors')
  , isExtensible = Object.isExtensible || isObject
  , SIZE         = DESCRIPTORS ? '_s' : 'size'
  , id           = 0;

var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!$has(it, ID)){
    // can't set id to frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add id
    if(!create)return 'E';
    // add missing object id
    hide(it, ID, ++id);
  // return object id with prefix
  } return 'O' + it[ID];
};

var getEntry = function(that, key){
  // fast case
  var index = fastKey(key), entry;
  if(index !== 'F')return that._i[index];
  // frozen object case
  for(entry = that._f; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      strictNew(that, C, NAME);
      that._i = $.create(null); // index
      that._f = undefined;      // first entry
      that._l = undefined;      // last entry
      that[SIZE] = 0;           // size
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear(){
        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
          entry.r = true;
          if(entry.p)entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function(key){
        var that  = this
          , entry = getEntry(that, key);
        if(entry){
          var next = entry.n
            , prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if(prev)prev.n = next;
          if(next)next.p = prev;
          if(that._f == entry)that._f = next;
          if(that._l == entry)that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */){
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
          , entry;
        while(entry = entry ? entry.n : this._f){
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while(entry && entry.r)entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key){
        return !!getEntry(this, key);
      }
    });
    if(DESCRIPTORS)$.setDesc(C.prototype, 'size', {
      get: function(){
        return defined(this[SIZE]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry){
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if(!that._f)that._f = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index !== 'F')that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function(C, NAME, IS_MAP){
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function(iterated, kind){
      this._t = iterated;  // target
      this._k = kind;      // kind
      this._l = undefined; // previous
    }, function(){
      var that  = this
        , kind  = that._k
        , entry = that._l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if(kind == 'keys'  )return step(0, entry.k);
      if(kind == 'values')return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};
},{"./$":134,"./$.ctx":110,"./$.defined":111,"./$.descriptors":112,"./$.for-of":117,"./$.has":120,"./$.hide":121,"./$.is-object":127,"./$.iter-define":130,"./$.iter-step":132,"./$.redefine-all":141,"./$.set-species":145,"./$.strict-new":149,"./$.uid":156}],107:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var forOf   = require('./$.for-of')
  , classof = require('./$.classof');
module.exports = function(NAME){
  return function toJSON(){
    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
    var arr = [];
    forOf(this, false, arr.push, arr);
    return arr;
  };
};
},{"./$.classof":104,"./$.for-of":117}],108:[function(require,module,exports){
'use strict';
var $              = require('./$')
  , global         = require('./$.global')
  , $export        = require('./$.export')
  , fails          = require('./$.fails')
  , hide           = require('./$.hide')
  , redefineAll    = require('./$.redefine-all')
  , forOf          = require('./$.for-of')
  , strictNew      = require('./$.strict-new')
  , isObject       = require('./$.is-object')
  , setToStringTag = require('./$.set-to-string-tag')
  , DESCRIPTORS    = require('./$.descriptors');

module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
  var Base  = global[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  if(!DESCRIPTORS || typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function(){
    new C().entries().next();
  }))){
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
  } else {
    C = wrapper(function(target, iterable){
      strictNew(target, C, NAME);
      target._c = new Base;
      if(iterable != undefined)forOf(iterable, IS_MAP, target[ADDER], target);
    });
    $.each.call('add,clear,delete,forEach,get,has,set,keys,values,entries'.split(','),function(KEY){
      var IS_ADDER = KEY == 'add' || KEY == 'set';
      if(KEY in proto && !(IS_WEAK && KEY == 'clear'))hide(C.prototype, KEY, function(a, b){
        if(!IS_ADDER && IS_WEAK && !isObject(a))return KEY == 'get' ? undefined : false;
        var result = this._c[KEY](a === 0 ? 0 : a, b);
        return IS_ADDER ? this : result;
      });
    });
    if('size' in proto)$.setDesc(C.prototype, 'size', {
      get: function(){
        return this._c.size;
      }
    });
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F, O);

  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

  return C;
};
},{"./$":134,"./$.descriptors":112,"./$.export":115,"./$.fails":116,"./$.for-of":117,"./$.global":119,"./$.hide":121,"./$.is-object":127,"./$.redefine-all":141,"./$.set-to-string-tag":146,"./$.strict-new":149}],109:[function(require,module,exports){
var core = module.exports = {version: '1.2.6'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],110:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./$.a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./$.a-function":101}],111:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],112:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./$.fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./$.fails":116}],113:[function(require,module,exports){
var isObject = require('./$.is-object')
  , document = require('./$.global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./$.global":119,"./$.is-object":127}],114:[function(require,module,exports){
// all enumerable object keys, includes symbols
var $ = require('./$');
module.exports = function(it){
  var keys       = $.getKeys(it)
    , getSymbols = $.getSymbols;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = $.isEnum
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))keys.push(key);
  }
  return keys;
};
},{"./$":134}],115:[function(require,module,exports){
var global    = require('./$.global')
  , core      = require('./$.core')
  , ctx       = require('./$.ctx')
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && key in target;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(param){
        return this instanceof C ? new C(param) : C(param);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    if(IS_PROTO)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
  }
};
// type bitmap
$export.F = 1;  // forced
$export.G = 2;  // global
$export.S = 4;  // static
$export.P = 8;  // proto
$export.B = 16; // bind
$export.W = 32; // wrap
module.exports = $export;
},{"./$.core":109,"./$.ctx":110,"./$.global":119}],116:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],117:[function(require,module,exports){
var ctx         = require('./$.ctx')
  , call        = require('./$.iter-call')
  , isArrayIter = require('./$.is-array-iter')
  , anObject    = require('./$.an-object')
  , toLength    = require('./$.to-length')
  , getIterFn   = require('./core.get-iterator-method');
module.exports = function(iterable, entries, fn, that){
  var iterFn = getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    call(iterator, f, step.value, entries);
  }
};
},{"./$.an-object":103,"./$.ctx":110,"./$.is-array-iter":125,"./$.iter-call":128,"./$.to-length":154,"./core.get-iterator-method":158}],118:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./$.to-iobject')
  , getNames  = require('./$').getNames
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return getNames(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.get = function getOwnPropertyNames(it){
  if(windowNames && toString.call(it) == '[object Window]')return getWindowNames(it);
  return getNames(toIObject(it));
};
},{"./$":134,"./$.to-iobject":153}],119:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],120:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],121:[function(require,module,exports){
var $          = require('./$')
  , createDesc = require('./$.property-desc');
module.exports = require('./$.descriptors') ? function(object, key, value){
  return $.setDesc(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./$":134,"./$.descriptors":112,"./$.property-desc":140}],122:[function(require,module,exports){
module.exports = require('./$.global').document && document.documentElement;
},{"./$.global":119}],123:[function(require,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};
},{}],124:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./$.cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./$.cof":105}],125:[function(require,module,exports){
// check on default Array iterator
var Iterators  = require('./$.iterators')
  , ITERATOR   = require('./$.wks')('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};
},{"./$.iterators":133,"./$.wks":157}],126:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./$.cof');
module.exports = Array.isArray || function(arg){
  return cof(arg) == 'Array';
};
},{"./$.cof":105}],127:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],128:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./$.an-object');
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};
},{"./$.an-object":103}],129:[function(require,module,exports){
'use strict';
var $              = require('./$')
  , descriptor     = require('./$.property-desc')
  , setToStringTag = require('./$.set-to-string-tag')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./$.hide')(IteratorPrototype, require('./$.wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = $.create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};
},{"./$":134,"./$.hide":121,"./$.property-desc":140,"./$.set-to-string-tag":146,"./$.wks":157}],130:[function(require,module,exports){
'use strict';
var LIBRARY        = require('./$.library')
  , $export        = require('./$.export')
  , redefine       = require('./$.redefine')
  , hide           = require('./$.hide')
  , has            = require('./$.has')
  , Iterators      = require('./$.iterators')
  , $iterCreate    = require('./$.iter-create')
  , setToStringTag = require('./$.set-to-string-tag')
  , getProto       = require('./$').getProto
  , ITERATOR       = require('./$.wks')('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , methods, key;
  // Fix native
  if($native){
    var IteratorPrototype = getProto($default.call(new Base));
    // Set @@toStringTag to native iterators
    setToStringTag(IteratorPrototype, TAG, true);
    // FF fix
    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    // fix Array#{values, @@iterator}.name in V8 / FF
    if(DEF_VALUES && $native.name !== VALUES){
      VALUES_BUG = true;
      $default = function values(){ return $native.call(this); };
    }
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES  ? $default : getMethod(VALUES),
      keys:    IS_SET      ? $default : getMethod(KEYS),
      entries: !DEF_VALUES ? $default : getMethod('entries')
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};
},{"./$":134,"./$.export":115,"./$.has":120,"./$.hide":121,"./$.iter-create":129,"./$.iterators":133,"./$.library":136,"./$.redefine":142,"./$.set-to-string-tag":146,"./$.wks":157}],131:[function(require,module,exports){
var ITERATOR     = require('./$.wks')('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ return {done: safe = true}; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};
},{"./$.wks":157}],132:[function(require,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],133:[function(require,module,exports){
module.exports = {};
},{}],134:[function(require,module,exports){
var $Object = Object;
module.exports = {
  create:     $Object.create,
  getProto:   $Object.getPrototypeOf,
  isEnum:     {}.propertyIsEnumerable,
  getDesc:    $Object.getOwnPropertyDescriptor,
  setDesc:    $Object.defineProperty,
  setDescs:   $Object.defineProperties,
  getKeys:    $Object.keys,
  getNames:   $Object.getOwnPropertyNames,
  getSymbols: $Object.getOwnPropertySymbols,
  each:       [].forEach
};
},{}],135:[function(require,module,exports){
var $         = require('./$')
  , toIObject = require('./$.to-iobject');
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = $.getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
},{"./$":134,"./$.to-iobject":153}],136:[function(require,module,exports){
module.exports = true;
},{}],137:[function(require,module,exports){
var global    = require('./$.global')
  , macrotask = require('./$.task').set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , Promise   = global.Promise
  , isNode    = require('./$.cof')(process) == 'process'
  , head, last, notify;

var flush = function(){
  var parent, domain, fn;
  if(isNode && (parent = process.domain)){
    process.domain = null;
    parent.exit();
  }
  while(head){
    domain = head.domain;
    fn     = head.fn;
    if(domain)domain.enter();
    fn(); // <- currently we use it only for Promise - try / catch not required
    if(domain)domain.exit();
    head = head.next;
  } last = undefined;
  if(parent)parent.enter();
};

// Node.js
if(isNode){
  notify = function(){
    process.nextTick(flush);
  };
// browsers with MutationObserver
} else if(Observer){
  var toggle = 1
    , node   = document.createTextNode('');
  new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
  notify = function(){
    node.data = toggle = -toggle;
  };
// environments with maybe non-completely correct, but existent Promise
} else if(Promise && Promise.resolve){
  notify = function(){
    Promise.resolve().then(flush);
  };
// for other environments - macrotask based on:
// - setImmediate
// - MessageChannel
// - window.postMessag
// - onreadystatechange
// - setTimeout
} else {
  notify = function(){
    // strange IE + webpack dev server bug - use .call(global)
    macrotask.call(global, flush);
  };
}

module.exports = function asap(fn){
  var task = {fn: fn, next: undefined, domain: isNode && process.domain};
  if(last)last.next = task;
  if(!head){
    head = task;
    notify();
  } last = task;
};
},{"./$.cof":105,"./$.global":119,"./$.task":151}],138:[function(require,module,exports){
// 19.1.2.1 Object.assign(target, source, ...)
var $        = require('./$')
  , toObject = require('./$.to-object')
  , IObject  = require('./$.iobject');

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = require('./$.fails')(function(){
  var a = Object.assign
    , A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return a({}, A)[S] != 7 || Object.keys(a({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , $$    = arguments
    , $$len = $$.length
    , index = 1
    , getKeys    = $.getKeys
    , getSymbols = $.getSymbols
    , isEnum     = $.isEnum;
  while($$len > index){
    var S      = IObject($$[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  }
  return T;
} : Object.assign;
},{"./$":134,"./$.fails":116,"./$.iobject":124,"./$.to-object":155}],139:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
var $export = require('./$.export')
  , core    = require('./$.core')
  , fails   = require('./$.fails');
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};
},{"./$.core":109,"./$.export":115,"./$.fails":116}],140:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],141:[function(require,module,exports){
var redefine = require('./$.redefine');
module.exports = function(target, src){
  for(var key in src)redefine(target, key, src[key]);
  return target;
};
},{"./$.redefine":142}],142:[function(require,module,exports){
module.exports = require('./$.hide');
},{"./$.hide":121}],143:[function(require,module,exports){
// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y){
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};
},{}],144:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var getDesc  = require('./$').getDesc
  , isObject = require('./$.is-object')
  , anObject = require('./$.an-object');
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = require('./$.ctx')(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};
},{"./$":134,"./$.an-object":103,"./$.ctx":110,"./$.is-object":127}],145:[function(require,module,exports){
'use strict';
var core        = require('./$.core')
  , $           = require('./$')
  , DESCRIPTORS = require('./$.descriptors')
  , SPECIES     = require('./$.wks')('species');

module.exports = function(KEY){
  var C = core[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])$.setDesc(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};
},{"./$":134,"./$.core":109,"./$.descriptors":112,"./$.wks":157}],146:[function(require,module,exports){
var def = require('./$').setDesc
  , has = require('./$.has')
  , TAG = require('./$.wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./$":134,"./$.has":120,"./$.wks":157}],147:[function(require,module,exports){
var global = require('./$.global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./$.global":119}],148:[function(require,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject  = require('./$.an-object')
  , aFunction = require('./$.a-function')
  , SPECIES   = require('./$.wks')('species');
module.exports = function(O, D){
  var C = anObject(O).constructor, S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};
},{"./$.a-function":101,"./$.an-object":103,"./$.wks":157}],149:[function(require,module,exports){
module.exports = function(it, Constructor, name){
  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
  return it;
};
},{}],150:[function(require,module,exports){
var toInteger = require('./$.to-integer')
  , defined   = require('./$.defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"./$.defined":111,"./$.to-integer":152}],151:[function(require,module,exports){
var ctx                = require('./$.ctx')
  , invoke             = require('./$.invoke')
  , html               = require('./$.html')
  , cel                = require('./$.dom-create')
  , global             = require('./$.global')
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listner = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(require('./$.cof')(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listner;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listner, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};
},{"./$.cof":105,"./$.ctx":110,"./$.dom-create":113,"./$.global":119,"./$.html":122,"./$.invoke":123}],152:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],153:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./$.iobject')
  , defined = require('./$.defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./$.defined":111,"./$.iobject":124}],154:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./$.to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./$.to-integer":152}],155:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./$.defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./$.defined":111}],156:[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],157:[function(require,module,exports){
var store  = require('./$.shared')('wks')
  , uid    = require('./$.uid')
  , Symbol = require('./$.global').Symbol;
module.exports = function(name){
  return store[name] || (store[name] =
    Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
};
},{"./$.global":119,"./$.shared":147,"./$.uid":156}],158:[function(require,module,exports){
var classof   = require('./$.classof')
  , ITERATOR  = require('./$.wks')('iterator')
  , Iterators = require('./$.iterators');
module.exports = require('./$.core').getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};
},{"./$.classof":104,"./$.core":109,"./$.iterators":133,"./$.wks":157}],159:[function(require,module,exports){
var anObject = require('./$.an-object')
  , get      = require('./core.get-iterator-method');
module.exports = require('./$.core').getIterator = function(it){
  var iterFn = get(it);
  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};
},{"./$.an-object":103,"./$.core":109,"./core.get-iterator-method":158}],160:[function(require,module,exports){
var classof   = require('./$.classof')
  , ITERATOR  = require('./$.wks')('iterator')
  , Iterators = require('./$.iterators');
module.exports = require('./$.core').isIterable = function(it){
  var O = Object(it);
  return O[ITERATOR] !== undefined
    || '@@iterator' in O
    || Iterators.hasOwnProperty(classof(O));
};
},{"./$.classof":104,"./$.core":109,"./$.iterators":133,"./$.wks":157}],161:[function(require,module,exports){
'use strict';
var ctx         = require('./$.ctx')
  , $export     = require('./$.export')
  , toObject    = require('./$.to-object')
  , call        = require('./$.iter-call')
  , isArrayIter = require('./$.is-array-iter')
  , toLength    = require('./$.to-length')
  , getIterFn   = require('./core.get-iterator-method');
$export($export.S + $export.F * !require('./$.iter-detect')(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , $$      = arguments
      , $$len   = $$.length
      , mapfn   = $$len > 1 ? $$[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, $$len > 2 ? $$[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        result[index] = mapping ? call(iterator, mapfn, [step.value, index], true) : step.value;
      }
    } else {
      length = toLength(O.length);
      for(result = new C(length); length > index; index++){
        result[index] = mapping ? mapfn(O[index], index) : O[index];
      }
    }
    result.length = index;
    return result;
  }
});

},{"./$.ctx":110,"./$.export":115,"./$.is-array-iter":125,"./$.iter-call":128,"./$.iter-detect":131,"./$.to-length":154,"./$.to-object":155,"./core.get-iterator-method":158}],162:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./$.add-to-unscopables')
  , step             = require('./$.iter-step')
  , Iterators        = require('./$.iterators')
  , toIObject        = require('./$.to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./$.iter-define')(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');
},{"./$.add-to-unscopables":102,"./$.iter-define":130,"./$.iter-step":132,"./$.iterators":133,"./$.to-iobject":153}],163:[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.1 Map Objects
require('./$.collection')('Map', function(get){
  return function Map(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key){
    var entry = strong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value){
    return strong.def(this, key === 0 ? 0 : key, value);
  }
}, strong, true);
},{"./$.collection":108,"./$.collection-strong":106}],164:[function(require,module,exports){
// 20.2.2.21 Math.log10(x)
var $export = require('./$.export');

$export($export.S, 'Math', {
  log10: function log10(x){
    return Math.log(x) / Math.LN10;
  }
});
},{"./$.export":115}],165:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $export = require('./$.export');

$export($export.S + $export.F, 'Object', {assign: require('./$.object-assign')});
},{"./$.export":115,"./$.object-assign":138}],166:[function(require,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = require('./$.to-iobject');

require('./$.object-sap')('getOwnPropertyDescriptor', function($getOwnPropertyDescriptor){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});
},{"./$.object-sap":139,"./$.to-iobject":153}],167:[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./$.to-object');

require('./$.object-sap')('keys', function($keys){
  return function keys(it){
    return $keys(toObject(it));
  };
});
},{"./$.object-sap":139,"./$.to-object":155}],168:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./$.export');
$export($export.S, 'Object', {setPrototypeOf: require('./$.set-proto').set});
},{"./$.export":115,"./$.set-proto":144}],169:[function(require,module,exports){

},{}],170:[function(require,module,exports){
'use strict';
var $          = require('./$')
  , LIBRARY    = require('./$.library')
  , global     = require('./$.global')
  , ctx        = require('./$.ctx')
  , classof    = require('./$.classof')
  , $export    = require('./$.export')
  , isObject   = require('./$.is-object')
  , anObject   = require('./$.an-object')
  , aFunction  = require('./$.a-function')
  , strictNew  = require('./$.strict-new')
  , forOf      = require('./$.for-of')
  , setProto   = require('./$.set-proto').set
  , same       = require('./$.same-value')
  , SPECIES    = require('./$.wks')('species')
  , speciesConstructor = require('./$.species-constructor')
  , asap       = require('./$.microtask')
  , PROMISE    = 'Promise'
  , process    = global.process
  , isNode     = classof(process) == 'process'
  , P          = global[PROMISE]
  , empty      = function(){ /* empty */ }
  , Wrapper;

var testResolve = function(sub){
  var test = new P(empty), promise;
  if(sub)test.constructor = function(exec){
    exec(empty, empty);
  };
  (promise = P.resolve(test))['catch'](empty);
  return promise === test;
};

var USE_NATIVE = function(){
  var works = false;
  function P2(x){
    var self = new P(x);
    setProto(self, P2.prototype);
    return self;
  }
  try {
    works = P && P.resolve && testResolve();
    setProto(P2, P);
    P2.prototype = $.create(P.prototype, {constructor: {value: P2}});
    // actual Firefox has broken subclass support, test that
    if(!(P2.resolve(5).then(function(){}) instanceof P2)){
      works = false;
    }
    // actual V8 bug, https://code.google.com/p/v8/issues/detail?id=4162
    if(works && require('./$.descriptors')){
      var thenableThenGotten = false;
      P.resolve($.setDesc({}, 'then', {
        get: function(){ thenableThenGotten = true; }
      }));
      works = thenableThenGotten;
    }
  } catch(e){ works = false; }
  return works;
}();

// helpers
var sameConstructor = function(a, b){
  // library wrapper special case
  if(LIBRARY && a === P && b === Wrapper)return true;
  return same(a, b);
};
var getConstructor = function(C){
  var S = anObject(C)[SPECIES];
  return S != undefined ? S : C;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var PromiseCapability = function(C){
  var resolve, reject;
  this.promise = new C(function($$resolve, $$reject){
    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject  = $$reject;
  });
  this.resolve = aFunction(resolve),
  this.reject  = aFunction(reject)
};
var perform = function(exec){
  try {
    exec();
  } catch(e){
    return {error: e};
  }
};
var notify = function(record, isReject){
  if(record.n)return;
  record.n = true;
  var chain = record.c;
  asap(function(){
    var value = record.v
      , ok    = record.s == 1
      , i     = 0;
    var run = function(reaction){
      var handler = ok ? reaction.ok : reaction.fail
        , resolve = reaction.resolve
        , reject  = reaction.reject
        , result, then;
      try {
        if(handler){
          if(!ok)record.h = true;
          result = handler === true ? value : handler(value);
          if(result === reaction.promise){
            reject(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(result)){
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch(e){
        reject(e);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    chain.length = 0;
    record.n = false;
    if(isReject)setTimeout(function(){
      var promise = record.p
        , handler, console;
      if(isUnhandled(promise)){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(handler = global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      } record.a = undefined;
    }, 1);
  });
};
var isUnhandled = function(promise){
  var record = promise._d
    , chain  = record.a || record.c
    , i      = 0
    , reaction;
  if(record.h)return false;
  while(chain.length > i){
    reaction = chain[i++];
    if(reaction.fail || !isUnhandled(reaction.promise))return false;
  } return true;
};
var $reject = function(value){
  var record = this;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  record.v = value;
  record.s = 2;
  record.a = record.c.slice();
  notify(record, true);
};
var $resolve = function(value){
  var record = this
    , then;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  try {
    if(record.p === value)throw TypeError("Promise can't be resolved itself");
    if(then = isThenable(value)){
      asap(function(){
        var wrapper = {r: record, d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      record.v = value;
      record.s = 1;
      notify(record, false);
    }
  } catch(e){
    $reject.call({r: record, d: false}, e); // wrap
  }
};

// constructor polyfill
if(!USE_NATIVE){
  // 25.4.3.1 Promise(executor)
  P = function Promise(executor){
    aFunction(executor);
    var record = this._d = {
      p: strictNew(this, P, PROMISE),         // <- promise
      c: [],                                  // <- awaiting reactions
      a: undefined,                           // <- checked in isUnhandled reactions
      s: 0,                                   // <- state
      d: false,                               // <- done
      v: undefined,                           // <- value
      h: false,                               // <- handled rejection
      n: false                                // <- notify
    };
    try {
      executor(ctx($resolve, record, 1), ctx($reject, record, 1));
    } catch(err){
      $reject.call(record, err);
    }
  };
  require('./$.redefine-all')(P.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var reaction = new PromiseCapability(speciesConstructor(this, P))
        , promise  = reaction.promise
        , record   = this._d;
      reaction.ok   = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      record.c.push(reaction);
      if(record.a)record.a.push(reaction);
      if(record.s)notify(record, false);
      return promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: P});
require('./$.set-to-string-tag')(P, PROMISE);
require('./$.set-species')(PROMISE);
Wrapper = require('./$.core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    var capability = new PromiseCapability(this)
      , $$reject   = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (!USE_NATIVE || testResolve(true)), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if(x instanceof P && sameConstructor(x.constructor, this))return x;
    var capability = new PromiseCapability(this)
      , $$resolve  = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
$export($export.S + $export.F * !(USE_NATIVE && require('./$.iter-detect')(function(iter){
  P.all(iter)['catch'](function(){});
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C          = getConstructor(this)
      , capability = new PromiseCapability(C)
      , resolve    = capability.resolve
      , reject     = capability.reject
      , values     = [];
    var abrupt = perform(function(){
      forOf(iterable, false, values.push, values);
      var remaining = values.length
        , results   = Array(remaining);
      if(remaining)$.each.call(values, function(promise, index){
        var alreadyCalled = false;
        C.resolve(promise).then(function(value){
          if(alreadyCalled)return;
          alreadyCalled = true;
          results[index] = value;
          --remaining || resolve(results);
        }, reject);
      });
      else resolve(results);
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C          = getConstructor(this)
      , capability = new PromiseCapability(C)
      , reject     = capability.reject;
    var abrupt = perform(function(){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  }
});
},{"./$":134,"./$.a-function":101,"./$.an-object":103,"./$.classof":104,"./$.core":109,"./$.ctx":110,"./$.descriptors":112,"./$.export":115,"./$.for-of":117,"./$.global":119,"./$.is-object":127,"./$.iter-detect":131,"./$.library":136,"./$.microtask":137,"./$.redefine-all":141,"./$.same-value":143,"./$.set-proto":144,"./$.set-species":145,"./$.set-to-string-tag":146,"./$.species-constructor":148,"./$.strict-new":149,"./$.wks":157}],171:[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.2 Set Objects
require('./$.collection')('Set', function(get){
  return function Set(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);
},{"./$.collection":108,"./$.collection-strong":106}],172:[function(require,module,exports){
'use strict';
var $at  = require('./$.string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./$.iter-define')(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});
},{"./$.iter-define":130,"./$.string-at":150}],173:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var $              = require('./$')
  , global         = require('./$.global')
  , has            = require('./$.has')
  , DESCRIPTORS    = require('./$.descriptors')
  , $export        = require('./$.export')
  , redefine       = require('./$.redefine')
  , $fails         = require('./$.fails')
  , shared         = require('./$.shared')
  , setToStringTag = require('./$.set-to-string-tag')
  , uid            = require('./$.uid')
  , wks            = require('./$.wks')
  , keyOf          = require('./$.keyof')
  , $names         = require('./$.get-names')
  , enumKeys       = require('./$.enum-keys')
  , isArray        = require('./$.is-array')
  , anObject       = require('./$.an-object')
  , toIObject      = require('./$.to-iobject')
  , createDesc     = require('./$.property-desc')
  , getDesc        = $.getDesc
  , setDesc        = $.setDesc
  , _create        = $.create
  , getNames       = $names.get
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , setter         = false
  , HIDDEN         = wks('_hidden')
  , isEnum         = $.isEnum
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , useNative      = typeof $Symbol == 'function'
  , ObjectProto    = Object.prototype;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(setDesc({}, 'a', {
    get: function(){ return setDesc(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = getDesc(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  setDesc(it, key, D);
  if(protoDesc && it !== ObjectProto)setDesc(ObjectProto, key, protoDesc);
} : setDesc;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol.prototype);
  sym._k = tag;
  DESCRIPTORS && setter && setSymbolDesc(ObjectProto, tag, {
    configurable: true,
    set: function(value){
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    }
  });
  return sym;
};

var isSymbol = function(it){
  return typeof it == 'symbol';
};

var $defineProperty = function defineProperty(it, key, D){
  if(D && has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))setDesc(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return setDesc(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key);
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key]
    ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  var D = getDesc(it = toIObject(it), key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = getNames(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN)result.push(key);
  return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var names  = getNames(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);
  return result;
};
var $stringify = function stringify(it){
  if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
  var args = [it]
    , i    = 1
    , $$   = arguments
    , replacer, $replacer;
  while($$.length > i)args.push($$[i++]);
  replacer = args[1];
  if(typeof replacer == 'function')$replacer = replacer;
  if($replacer || !isArray(replacer))replacer = function(key, value){
    if($replacer)value = $replacer.call(this, key, value);
    if(!isSymbol(value))return value;
  };
  args[1] = replacer;
  return _stringify.apply($JSON, args);
};
var buggyJSON = $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
});

// 19.4.1.1 Symbol([description])
if(!useNative){
  $Symbol = function Symbol(){
    if(isSymbol(this))throw TypeError('Symbol is not a constructor');
    return wrap(uid(arguments.length > 0 ? arguments[0] : undefined));
  };
  redefine($Symbol.prototype, 'toString', function toString(){
    return this._k;
  });

  isSymbol = function(it){
    return it instanceof $Symbol;
  };

  $.create     = $create;
  $.isEnum     = $propertyIsEnumerable;
  $.getDesc    = $getOwnPropertyDescriptor;
  $.setDesc    = $defineProperty;
  $.setDescs   = $defineProperties;
  $.getNames   = $names.get = $getOwnPropertyNames;
  $.getSymbols = $getOwnPropertySymbols;

  if(DESCRIPTORS && !require('./$.library')){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }
}

var symbolStatics = {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    return keyOf(SymbolRegistry, key);
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
};
// 19.4.2.2 Symbol.hasInstance
// 19.4.2.3 Symbol.isConcatSpreadable
// 19.4.2.4 Symbol.iterator
// 19.4.2.6 Symbol.match
// 19.4.2.8 Symbol.replace
// 19.4.2.9 Symbol.search
// 19.4.2.10 Symbol.species
// 19.4.2.11 Symbol.split
// 19.4.2.12 Symbol.toPrimitive
// 19.4.2.13 Symbol.toStringTag
// 19.4.2.14 Symbol.unscopables
$.each.call((
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,' +
  'species,split,toPrimitive,toStringTag,unscopables'
).split(','), function(it){
  var sym = wks(it);
  symbolStatics[it] = useNative ? sym : wrap(sym);
});

setter = true;

$export($export.G + $export.W, {Symbol: $Symbol});

$export($export.S, 'Symbol', symbolStatics);

$export($export.S + $export.F * !useNative, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!useNative || buggyJSON), 'JSON', {stringify: $stringify});

// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);
},{"./$":134,"./$.an-object":103,"./$.descriptors":112,"./$.enum-keys":114,"./$.export":115,"./$.fails":116,"./$.get-names":118,"./$.global":119,"./$.has":120,"./$.is-array":126,"./$.keyof":135,"./$.library":136,"./$.property-desc":140,"./$.redefine":142,"./$.set-to-string-tag":146,"./$.shared":147,"./$.to-iobject":153,"./$.uid":156,"./$.wks":157}],174:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = require('./$.export');

$export($export.P, 'Map', {toJSON: require('./$.collection-to-json')('Map')});
},{"./$.collection-to-json":107,"./$.export":115}],175:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = require('./$.export');

$export($export.P, 'Set', {toJSON: require('./$.collection-to-json')('Set')});
},{"./$.collection-to-json":107,"./$.export":115}],176:[function(require,module,exports){
require('./es6.array.iterator');
var Iterators = require('./$.iterators');
Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;
},{"./$.iterators":133,"./es6.array.iterator":162}],177:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],178:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[61])(61)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2F4aXMvc3JjL2F4aXMvYXhpcy1sYXllci5qcyIsImRpc3QvYXhpcy9zcmMvYXhpcy9ncmlkLWF4aXMtZ2VuZXJhdG9yLmpzIiwiZGlzdC9heGlzL3NyYy9heGlzL3RpbWUtYXhpcy1nZW5lcmF0b3IuanMiLCJkaXN0L2JlaGF2aW9ycy9zcmMvYmVoYXZpb3JzL2Jhc2UtYmVoYXZpb3IuanMiLCJkaXN0L2JlaGF2aW9ycy9zcmMvYmVoYXZpb3JzL2JyZWFrcG9pbnQtYmVoYXZpb3IuanMiLCJkaXN0L2JlaGF2aW9ycy9zcmMvYmVoYXZpb3JzL21hcmtlci1iZWhhdmlvci5qcyIsImRpc3QvYmVoYXZpb3JzL3NyYy9iZWhhdmlvcnMvc2VnbWVudC1iZWhhdmlvci5qcyIsImRpc3QvYmVoYXZpb3JzL3NyYy9iZWhhdmlvcnMvdGltZS1jb250ZXh0LWJlaGF2aW9yLmpzIiwiZGlzdC9iZWhhdmlvcnMvc3JjL2JlaGF2aW9ycy90cmFjZS1iZWhhdmlvci5qcyIsImRpc3QvY29yZS9zcmMvY29yZS9sYXllci10aW1lLWNvbnRleHQuanMiLCJkaXN0L2NvcmUvc3JjL2NvcmUvbGF5ZXIuanMiLCJkaXN0L2NvcmUvc3JjL2NvcmUvbmFtZXNwYWNlLmpzIiwiZGlzdC9jb3JlL3NyYy9jb3JlL3RpbWVsaW5lLXRpbWUtY29udGV4dC5qcyIsImRpc3QvY29yZS9zcmMvY29yZS90aW1lbGluZS5qcyIsImRpc3QvY29yZS9zcmMvY29yZS90cmFjay1jb2xsZWN0aW9uLmpzIiwiZGlzdC9jb3JlL3NyYy9jb3JlL3RyYWNrLmpzIiwiZGlzdC9oZWxwZXJzL3NyYy9oZWxwZXJzL2Fubm90YXRlZC1tYXJrZXItbGF5ZXIuanMiLCJkaXN0L2hlbHBlcnMvc3JjL2hlbHBlcnMvYW5ub3RhdGVkLXNlZ21lbnQtbGF5ZXIuanMiLCJkaXN0L2hlbHBlcnMvc3JjL2hlbHBlcnMvYnJlYWtwb2ludC1sYXllci5qcyIsImRpc3QvaGVscGVycy9zcmMvaGVscGVycy9jdXJzb3ItbGF5ZXIuanMiLCJkaXN0L2hlbHBlcnMvc3JjL2hlbHBlcnMvZ3JpZC1heGlzLWxheWVyLmpzIiwiZGlzdC9oZWxwZXJzL3NyYy9oZWxwZXJzL2xpbmUtbGF5ZXIuanMiLCJkaXN0L2hlbHBlcnMvc3JjL2hlbHBlcnMvbWFya2VyLWxheWVyLmpzIiwiZGlzdC9oZWxwZXJzL3NyYy9oZWxwZXJzL21hdHJpeC1sYXllci5qcyIsImRpc3QvaGVscGVycy9zcmMvaGVscGVycy9zZWdtZW50LWxheWVyLmpzIiwiZGlzdC9oZWxwZXJzL3NyYy9oZWxwZXJzL3RpY2stbGF5ZXIuanMiLCJkaXN0L2hlbHBlcnMvc3JjL2hlbHBlcnMvdGltZS1heGlzLWxheWVyLmpzIiwiZGlzdC9oZWxwZXJzL3NyYy9oZWxwZXJzL3RyYWNlLWxheWVyLmpzIiwiZGlzdC9oZWxwZXJzL3NyYy9oZWxwZXJzL3dhdmVmb3JtLWxheWVyLmpzIiwiZGlzdC9pbnRlcmFjdGlvbnMvc3JjL2ludGVyYWN0aW9ucy9ldmVudC1zb3VyY2UuanMiLCJkaXN0L2ludGVyYWN0aW9ucy9zcmMvaW50ZXJhY3Rpb25zL2tleWJvYXJkLmpzIiwiZGlzdC9pbnRlcmFjdGlvbnMvc3JjL2ludGVyYWN0aW9ucy9zdXJmYWNlLmpzIiwiZGlzdC9pbnRlcmFjdGlvbnMvc3JjL2ludGVyYWN0aW9ucy93YXZlLWV2ZW50LmpzIiwiZGlzdC9zaGFwZXMvc3JjL3NoYXBlcy9hbm5vdGF0ZWQtbWFya2VyLmpzIiwiZGlzdC9zaGFwZXMvc3JjL3NoYXBlcy9hbm5vdGF0ZWQtc2VnbWVudC5qcyIsImRpc3Qvc2hhcGVzL3NyYy9zaGFwZXMvYmFzZS1zaGFwZS5qcyIsImRpc3Qvc2hhcGVzL3NyYy9zaGFwZXMvY3Vyc29yLmpzIiwiZGlzdC9zaGFwZXMvc3JjL3NoYXBlcy9kb3QuanMiLCJkaXN0L3NoYXBlcy9zcmMvc2hhcGVzL2xpbmUuanMiLCJkaXN0L3NoYXBlcy9zcmMvc2hhcGVzL21hcmtlci5qcyIsImRpc3Qvc2hhcGVzL3NyYy9zaGFwZXMvbWF0cml4LmpzIiwiZGlzdC9zaGFwZXMvc3JjL3NoYXBlcy9zZWdtZW50LmpzIiwiZGlzdC9zaGFwZXMvc3JjL3NoYXBlcy90aWNrcy5qcyIsImRpc3Qvc2hhcGVzL3NyYy9zaGFwZXMvdHJhY2UtZG90cy5qcyIsImRpc3Qvc2hhcGVzL3NyYy9zaGFwZXMvdHJhY2UtcGF0aC5qcyIsImRpc3Qvc2hhcGVzL3NyYy9zaGFwZXMvd2F2ZWZvcm0uanMiLCJkaXN0L3N0YXRlcy9zcmMvc3RhdGVzL2Jhc2Utc3RhdGUuanMiLCJkaXN0L3N0YXRlcy9zcmMvc3RhdGVzL2JyZWFrcG9pbnQtc3RhdGUuanMiLCJkaXN0L3N0YXRlcy9zcmMvc3RhdGVzL2JydXNoLXpvb20tc3RhdGUuanMiLCJkaXN0L3N0YXRlcy9zcmMvc3RhdGVzL2NlbnRlcmVkLXpvb20tc3RhdGUuanMiLCJkaXN0L3N0YXRlcy9zcmMvc3RhdGVzL2NvbnRleHQtZWRpdGlvbi1zdGF0ZS5qcyIsImRpc3Qvc3RhdGVzL3NyYy9zdGF0ZXMvZWRpdGlvbi1zdGF0ZS5qcyIsImRpc3Qvc3RhdGVzL3NyYy9zdGF0ZXMvc2VsZWN0aW9uLXN0YXRlLmpzIiwiZGlzdC9zdGF0ZXMvc3JjL3N0YXRlcy9zaW1wbGUtZWRpdGlvbi1zdGF0ZS5qcyIsImRpc3QvdXRpbHMvc3JjL3V0aWxzL2Zvcm1hdC5qcyIsImRpc3QvdXRpbHMvc3JjL3V0aWxzL21hdHJpeC1lbnRpdHkuanMiLCJkaXN0L3V0aWxzL3NyYy91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiLCJkaXN0L3V0aWxzL3NyYy91dGlscy9wbmcuanMiLCJkaXN0L3V0aWxzL3NyYy91dGlscy9wcmVmaWxsZWQtbWF0cml4LWVudGl0eS5qcyIsImRpc3QvdXRpbHMvc3JjL3V0aWxzL3NjYWxlcy5qcyIsImRpc3Qvc3JjL3dhdmVzLXVpLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9hcnJheS9mcm9tLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9nZXQtaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL2lzLWl0ZXJhYmxlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9tYXAuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL21hdGgvbG9nMTAuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9kZWZpbmUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3IuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3Qvc2V0LXByb3RvdHlwZS1vZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvcHJvbWlzZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvc2V0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9zeW1ib2wuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL3N5bWJvbC9pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvY2xhc3MtY2FsbC1jaGVjay5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvY3JlYXRlLWNsYXNzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9nZXQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2luaGVyaXRzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9pbnRlcm9wLXJlcXVpcmUtZGVmYXVsdC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvc2xpY2VkLXRvLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy90by1jb25zdW1hYmxlLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvcmVnZW5lcmF0b3IvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9yZWdlbmVyYXRvci9ydW50aW1lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9hcnJheS9mcm9tLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9nZXQtaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL2lzLWl0ZXJhYmxlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9tYXAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL21hdGgvbG9nMTAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9kZWZpbmUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9vYmplY3Qvc2V0LXByb3RvdHlwZS1vZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vcHJvbWlzZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vc2V0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9zeW1ib2wvaW5kZXguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL3N5bWJvbC9pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmEtZnVuY3Rpb24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5hZGQtdG8tdW5zY29wYWJsZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5hbi1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5jbGFzc29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuY29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuY29sbGVjdGlvbi1zdHJvbmcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5jb2xsZWN0aW9uLXRvLWpzb24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5jb2xsZWN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuY29yZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmN0eC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmRlZmluZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5kZXNjcmlwdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmRvbS1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5lbnVtLWtleXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5leHBvcnQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5mYWlscy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmZvci1vZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmdldC1uYW1lcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmdsb2JhbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmhhcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmhpZGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5odG1sLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaW52b2tlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmlzLWFycmF5LWl0ZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pcy1hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmlzLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLml0ZXItY2FsbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLml0ZXItY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaXRlci1kZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pdGVyLWRldGVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLml0ZXItc3RlcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLml0ZXJhdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQua2V5b2YuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5saWJyYXJ5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQubWljcm90YXNrLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQub2JqZWN0LWFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLm9iamVjdC1zYXAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5wcm9wZXJ0eS1kZXNjLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQucmVkZWZpbmUtYWxsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQucmVkZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5zYW1lLXZhbHVlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuc2V0LXByb3RvLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuc2V0LXNwZWNpZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5zZXQtdG8tc3RyaW5nLXRhZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLnNoYXJlZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLnNwZWNpZXMtY29uc3RydWN0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5zdHJpY3QtbmV3LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuc3RyaW5nLWF0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQudGFzay5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLnRvLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC50by1pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQudG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQudG8tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQudWlkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQud2tzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9jb3JlLmlzLWl0ZXJhYmxlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5hcnJheS5mcm9tLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5hcnJheS5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYubWFwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5tYXRoLmxvZzEwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuYXNzaWduLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3Qua2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LnNldC1wcm90b3R5cGUtb2YuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnByb21pc2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnNldC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zeW1ib2wuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM3Lm1hcC50by1qc29uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNy5zZXQudG8tanNvbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlLmpzIiwibm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7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QUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDdkQsVUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUVqQyxVQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUN4RCxVQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDNUQsVUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2pFLFVBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDdEQsVUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUUvQixVQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUN4RCxVQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDNUQsVUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2pFLFVBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDdEQsVUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFD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QUFDL0YsY0FBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQy9GLGNBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUMvRixjQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7OztBQUcvRixRQUFJLE1BQU0sR0FBRyxBQUFDLEFBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUEsQUFBQyxJQUFLLENBQUMsR0FBSyxDQUFDLElBQUksQ0FBQyxBQUFDLENBQUM7QUFDOUMsVUFBTSxJQUFHLEVBQUUsR0FBSSxNQUFNLEdBQUcsRUFBRSxBQUFDLENBQUM7O0FBRTVCLGNBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRSxVQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7OztBQUc5RSxTQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFBLEdBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDOUMsVUFBSSxJQUFJLEVBQUUsSUFBSSxDQUFDO0FBQ2YsVUFBSSxDQUFDLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDckMsWUFBSSxHQUFHLE1BQU0sQ0FBQztB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDdG9CQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTs7QUNEQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTs7QUNEQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTs7QUNGQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7O0FDRkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbE9BO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgbnMgZnJvbSAnLi4vY29yZS9uYW1lc3BhY2UnO1xuaW1wb3J0IExheWVyIGZyb20gJy4uL2NvcmUvbGF5ZXInO1xuXG5cbi8qKlxuICogU2ltcGxpZmllZCBMYXllciBmb3IgQXhpcy4gVGhlIG1haW4gZGlmZmVyZW5jZSB3aXRoIGEgcmVndWxhciBsYXllciBpcyB0aGF0XG4gKiBhbiBheGlzIGxheWVyIHVzZSB0aGUgYFRpbWVsaW5lfnRpbWVDb250ZXh0YCBhdHRyaWJ1dGVzIHRvIHJlbmRlciBpdCdzIGxheW91dFxuICogYW5kIHN0YXkgc3luY2hyb25pemVkIHdpdGggdGhlIHRyYWNrcyB2aXNpYmxlIGFyZWEuIEFsbCBnZXR0ZXJzIGFuZCBzZXR0ZXJzXG4gKiB0byB0aGUgYFRpbWVsaW5lVGltZUNvbnRleHRgIGF0dHJpYnV0ZXMgYXJlIGJ5cGFzc2VkLlxuICpcbiAqIEl0IGFsc28gaGFuZGxlIGl0J3Mgb3duIGRhdGEgYW5kIGl0cyB1cGRhdGVzLiBUaGUgYF9nZW5lcmF0ZURhdGFgIG1ldGhvZCBpc1xuICogcmVzcG9uc2libGUgdG8gY3JlYXRlIHNvbWUgdXNlZnVsbCBkYXRhIHRvIHZpc3VhbGl6ZVxuICpcbiAqIFtleGFtcGxlIHVzYWdlIG9mIHRoZSBsYXllci1heGlzXSguL2V4YW1wbGVzL2xheWVyLWF4aXMuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXhpc0xheWVyIGV4dGVuZHMgTGF5ZXIge1xuICAvKipcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZ2VuZXJhdG9yIC0gQSBmdW5jdGlvbiB0byBjcmVhdGUgZGF0YSBhY2NvcmRpbmcgdG9cbiAgICogICAgdGhlIGBUaW1lbGluZX50aW1lQ29udGV4dGAuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gTGF5ZXIgb3B0aW9ucywgY2YuIExheWVyIGZvciBhdmFpbGFibGUgb3B0aW9ucy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGdlbmVyYXRvciwgb3B0aW9ucykge1xuICAgIHN1cGVyKCdlbnRpdHknLCBbXSwgb3B0aW9ucyk7XG4gICAgdGhpcy5fZ2VuZXJhdG9yID0gZ2VuZXJhdG9yO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHNldCBzdHJldGNoUmF0aW8odmFsdWUpIHsgcmV0dXJuOyB9XG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzZXQgb2Zmc2V0KHZhbHVlKSB7IHJldHVybjsgfVxuICAvKiogQHByaXZhdGUgKi9cbiAgc2V0IHN0YXJ0KHZhbHVlKSB7IHJldHVybjsgfVxuICAvKiogQHByaXZhdGUgKi9cbiAgc2V0IGR1cmF0aW9uKHZhbHVlKSB7IHJldHVybjsgfVxuICAvKiogQHByaXZhdGUgKi9cbiAgZ2V0IHN0cmV0Y2hSYXRpbygpIHsgcmV0dXJuOyB9XG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBnZXQgb2Zmc2V0KCkgeyByZXR1cm47IH1cbiAgLyoqIEBwcml2YXRlICovXG4gIGdldCBzdGFydCgpIHsgcmV0dXJuOyB9XG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBnZXQgZHVyYXRpb24oKSB7IHJldHVybjsgfVxuXG5cbiAgLyoqXG4gICAqIFRoZSBnZW5lcmF0b3IgdGhhdCBjcmVhdGVzIHRoZSBkYXRhIHRvIGJlIHJlbmRlcmVkIHRvIGRpc3BsYXkgdGhlIGF4aXMuXG4gICAqXG4gICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICovXG4gIHNldCBnZW5lcmF0b3IoZnVuYykge1xuICAgIHRoaXMuX2dlbmVyYXRvciA9IGZ1bmM7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGdlbmVyYXRvciB0aGF0IGNyZWF0ZXMgdGhlIGRhdGEgdG8gYmUgcmVuZGVyZWQgdG8gZGlzcGxheSB0aGUgYXhpcy5cbiAgICpcbiAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgKi9cbiAgZ2V0IGdlbmVyYXRvcigpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2VuZXJhdG9yO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGlzIHRoZSBtYWluIGRpZmZlcmVuY2Ugd2l0aCBhIGNsYXNzaWNhbCBsYXllci4gQW4gYEF4aXNMYXllcmBcbiAgICogaW5zdGFuY2UgZ2VuZXJhdGVzIGFuZCBtYWludGFpbnMgaXQncyBvd24gZGF0YS5cbiAgICovXG4gIF9nZW5lcmF0ZURhdGEoKSB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuX2dlbmVyYXRvcih0aGlzLnRpbWVDb250ZXh0KTtcbiAgICAvLyBwcmVwZW5kIGZpcnN0IGFyZ3VtZW50cyBvZiBzcGxpY2UgZm9yIGFuIGFwcGx5XG4gICAgZGF0YS51bnNoaWZ0KDAsIHRoaXMuZGF0YVswXS5sZW5ndGgpO1xuICAgIC8vIG1ha2Ugc3VyZSB0byBrZWVwIHRoZSBzYW1lIHJlZmVyZW5jZVxuICAgIEFycmF5LnByb3RvdHlwZS5zcGxpY2UuYXBwbHkodGhpcy5kYXRhWzBdLCBkYXRhKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSByZW5kZXJpbmcgY29udGV4dCBmb3IgdGhlIHNoYXBlcy5cbiAgICovXG4gIF91cGRhdGVSZW5kZXJpbmdDb250ZXh0KCkge1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwgPSB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsO1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsID0gdGhpcy5fdmFsdWVUb1BpeGVsO1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQuaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQud2lkdGggID0gdGhpcy50aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLnRpbWVDb250ZXh0LmR1cmF0aW9uKTtcblxuICAgIC8vIGZvciBmb3JlaWduIG9iamVjdCBpc3N1ZSBpbiBjaHJvbWVcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0Lm9mZnNldFggPSB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMudGltZUNvbnRleHQub2Zmc2V0KTtcblxuICAgIC8vIGV4cG9zZSBzb21lIHRpbWVsaW5lIGF0dHJpYnV0ZXMgLSBhbGxvdyB0byBpbXByb3ZlIHBlcmYgaW4gc29tZSBjYXNlcyAtIGNmLiBXYXZlZm9ybVxuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudHJhY2tPZmZzZXRYID0gdGhpcy50aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLnRpbWVDb250ZXh0Lm9mZnNldCk7XG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC52aXNpYmxlV2lkdGggPSB0aGlzLnRpbWVDb250ZXh0LnZpc2libGVXaWR0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgdGhlIGRhdGEgYW5kIHVwZGF0ZSB0aGUgbGF5ZXIuXG4gICAqL1xuICB1cGRhdGUoKSB7XG4gICAgdGhpcy5fZ2VuZXJhdGVEYXRhKCk7XG4gICAgc3VwZXIudXBkYXRlKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHRoZSBET00gaW4gbWVtb3J5IG9uIGxheWVyIGNyZWF0aW9uIHRvIGJlIGFibGUgdG8gdXNlIGl0IGJlZm9yZVxuICAgKiB0aGUgbGF5ZXIgaXMgYWN0dWFsbHkgaW5zZXJ0ZWQgaW4gdGhlIERPTVxuICAgKi9cbiAgX3JlbmRlckNvbnRhaW5lcigpIHtcbiAgICAvLyB3cmFwcGVyIGdyb3VwIGZvciBgc3RhcnQsIHRvcCBhbmQgY29udGV4dCBmbGlwIG1hdHJpeFxuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIGlmICh0aGlzLnBhcmFtcy5jbGFzc05hbWUgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuJGVsLmNsYXNzTGlzdC5hZGQoJ2xheWVyJywgdGhpcy5wYXJhbXMuY2xhc3NOYW1lKTtcbiAgICB9XG5cbiAgICAvLyBncm91cCB0byBhcHBseSBvZmZzZXRcbiAgICB0aGlzLiRvZmZzZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgdGhpcy4kb2Zmc2V0LmNsYXNzTGlzdC5hZGQoJ29mZnNldCcsICdpdGVtcycpO1xuICAgIC8vIGxheWVyIGJhY2tncm91bmRcbiAgICB0aGlzLiRiYWNrZ3JvdW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAncmVjdCcpO1xuICAgIHRoaXMuJGJhY2tncm91bmQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsICcxMDAlJyk7XG4gICAgdGhpcy4kYmFja2dyb3VuZC5jbGFzc0xpc3QuYWRkKCdiYWNrZ3JvdW5kJyk7XG4gICAgdGhpcy4kYmFja2dyb3VuZC5zdHlsZS5maWxsT3BhY2l0eSA9IDA7XG4gICAgdGhpcy4kYmFja2dyb3VuZC5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xuICAgIC8vIGNyZWF0ZSB0aGUgRE9NIHRyZWVcbiAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRvZmZzZXQpO1xuICAgIHRoaXMuJG9mZnNldC5hcHBlbmRDaGlsZCh0aGlzLiRiYWNrZ3JvdW5kKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBsYXlvdXQgb2YgdGhlIGxheWVyLlxuICAgKi9cbiAgdXBkYXRlQ29udGFpbmVyKCkge1xuICAgIHRoaXMuX3VwZGF0ZVJlbmRlcmluZ0NvbnRleHQoKTtcblxuICAgIGNvbnN0IHRvcCAgICA9IHRoaXMucGFyYW1zLnRvcDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgLy8gbWF0cml4IHRvIGludmVydCB0aGUgY29vcmRpbmF0ZSBzeXN0ZW1cbiAgICBjb25zdCB0cmFuc2xhdGVNYXRyaXggPSBgbWF0cml4KDEsIDAsIDAsIC0xLCAwLCAke3RvcCArIGhlaWdodH0pYDtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgdHJhbnNsYXRlTWF0cml4KTtcblxuICAgIHRoaXMuJGJhY2tncm91bmQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgaGVpZ2h0KTtcbiAgfVxufVxuIiwiLyoqXG4gKiBBIGdlbmVyYXRvciB0byBjcmVhdGUgZGF0YSBmb3IgZ3JpZCBheGlzIGFjY29yZGluZyB0byBhIGBicG1gIGFuZCBhIGBtZXRlcmAuXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItYXhpcy5odG1sKVxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBicG0gLSBUaGUgbnVtYmVyIG9mIGJlYXRzIHBlciBtaW51dGVzLlxuICogQHBhcmFtIHtTdHJpbmd9IHNpZ25hdHVyZSAtIFRoZSBtZXRlciBvZiB0aGUgbWVzdXJlIChgJzQvNCdgLCBgJzMvOCdgLCAuLi4pLlxuICogQHJldHVybiB7RnVuY3Rpb259IC0gVGhlIGNvbmZpZ3VyZWQgZnVuY3Rpb24gcmV0dXJuaW5nIHRoZSBkYXRhIHdoZW4gY2FsbGVkLlxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBncmlkQXhpc0dlbmVyYXRvcihicG0sIHNpZ25hdHVyZSkge1xuICBjb25zdCBfYnBzID0gIGJwbSAvIDYwOyAvLyBzZWNcbiAgY29uc3QgX3VuaXQgPSAxIC8gcGFyc2VJbnQoc2lnbmF0dXJlLnNwbGl0KCcvJylbMV0sIDEwKTtcbiAgY29uc3QgX25iclVuaXRzUGVyTWVzdXJlID0gcGFyc2VJbnQoc2lnbmF0dXJlLnNwbGl0KCcvJylbMF0sIDEwKTtcblxuICByZXR1cm4gZnVuY3Rpb24odGltZUNvbnRleHQpIHtcbiAgICBjb25zdCBkdXJhdGlvbiA9IHRpbWVDb250ZXh0LnZpc2libGVEdXJhdGlvbjtcbiAgICBjb25zdCBvZmZzZXQgPSB0aW1lQ29udGV4dC5vZmZzZXQ7XG4gICAgY29uc3QgZGF0YSA9IFtdO1xuXG4gICAgLy8gY29uc3QgbWluID0gTWF0aC5taW4oLW9mZnNldCwgMCk7XG4gICAgY29uc3QgbWluID0gLSBvZmZzZXQ7XG4gICAgLy8gcmVtb3ZlIHRoZSB0aW1lbGluZSdzIG9mZnNldCB0byBrZWVwIHRoZSBsYXllciBjZW50ZXJlZFxuICAgIGNvbnN0IG1heCA9IGR1cmF0aW9uIC0gb2Zmc2V0O1xuXG4gICAgLy8gZGVmaW5lIHBpeGVscyBmb3IgMSBzZWNvbmRcbiAgICBjb25zdCBwaXhlbHNQZXJTZWNvbmQgPSB0aW1lQ29udGV4dC5jb21wdXRlZFBpeGVsc1BlclNlY29uZDtcbiAgICAvLyB0aW1lIGZvciBvbmUgX3VuaXRcbiAgICBjb25zdCB1bml0VGltZSA9IDEgLyBfYnBzO1xuICAgIC8vIGRlZmluZSB0aGUgZmlyc3QgdGljayA+IG1pblxuICAgIGNvbnN0IG1vZHVsbyA9IG1pbiAlIHVuaXRUaW1lO1xuICAgIGNvbnN0IG11bHQgPSAobWluIC0gbW9kdWxvKSAvIHVuaXRUaW1lO1xuICAgIGNvbnN0IGZpcnN0VGlja1RpbWUgPSB1bml0VGltZSAqIG11bHQ7XG4gICAgLy8gdHJhY2sgd2hpY2ggcG9zaXRpb24gb2YgY3VycmVudCBiZWF0IGluIHRoZSBtZXN1cmVcbiAgICBsZXQgcG9zaXRpb25Jbk1lc3VyZSA9IG11bHQgJSBfbmJyVW5pdHNQZXJNZXN1cmU7XG5cbiAgICAvLyByZW1vdmUgbm90IGZvY3VzZWQgYmVhdHMsIGlmIHpvb21lZCBvdXRcbiAgICBjb25zdCBwaXhlbHNQZXJUaWNrID0gcGl4ZWxzUGVyU2Vjb25kIC8gX2JwcztcbiAgICBjb25zdCBtaW5TdGVwID0gNTtcblxuICAgIC8vIHRpbWUgc2hvdWxkIGJlXG4gICAgZm9yIChsZXQgdGltZSA9IGZpcnN0VGlja1RpbWU7IHRpbWUgPCBtYXg7IHRpbWUgKz0gdW5pdFRpbWUpIHtcbiAgICAgIC8vIGZpbmQgZmlyc3QgYmVhdFxuICAgICAgY29uc3QgZm9jdXNlZCA9IChwb3NpdGlvbkluTWVzdXJlKysgJSBfbmJyVW5pdHNQZXJNZXN1cmUgPT09IDApO1xuICAgICAgLy8gaWdub3JlIGlmIHBpeGVscyBwZXIgdGlja3MgaXMgdG9vIHNtYWxsXG4gICAgICBpZiAoKHBpeGVsc1BlclRpY2sgPD0gbWluU3RlcCkgJiYgIWZvY3VzZWQpIHsgY29udGludWU7IH1cblxuICAgICAgZGF0YS5wdXNoKHsgdGltZSwgZm9jdXNlZCB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfTtcbn0iLCJpbXBvcnQgeyBwYWRMZWZ0IH0gZnJvbSAnLi4vdXRpbHMvZm9ybWF0JztcblxuXG4vKipcbiAqIEEgZ2VuZXJhdG9yIHRvIGNyZWF0ZSBkYXRhIGZvciB0aW1lIGF4aXMuXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItYXhpcy5odG1sKVxuICpcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSAtIFRoZSBjb25maWd1cmVkIGZ1bmN0aW9uIHJldHVybmluZyB0aGUgZGF0YSB3aGVuIGNhbGxlZC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdGltZUF4aXNHZW5lcmF0b3IoKSB7XG4gIC8vIGFkZCBmYWN0b3J5IHRvIHNoYXJlIEFQSSB3aXRoIGJwbUdlbmVyYXRvclxuICByZXR1cm4gZnVuY3Rpb24odGltZUNvbnRleHQpIHtcbiAgICBjb25zdCBkdXJhdGlvbiA9IHRpbWVDb250ZXh0LnZpc2libGVEdXJhdGlvbjtcbiAgICBjb25zdCBvZmZzZXQgPSB0aW1lQ29udGV4dC5vZmZzZXQ7XG4gICAgY29uc3QgZGF0YSA9IFtdO1xuXG4gICAgLy8gY29uc3QgbWluID0gTWF0aC5taW4oLW9mZnNldCwgMCk7XG4gICAgY29uc3QgbWluID0gLSBvZmZzZXQ7XG4gICAgLy8gcmVtb3ZlIHRoZSB0aW1lbGluZSdzIG9mZnNldCB0byBrZWVwIHRoZSBsYXllciBjZW50ZXJlZFxuICAgIGNvbnN0IG1heCA9IGR1cmF0aW9uIC0gb2Zmc2V0O1xuXG4gICAgLy8gZGVmaW5lIHBpeGVscyBmb3IgMSBzZWNvbmRcbiAgICBjb25zdCBwaXhlbHNQZXJTZWNvbmQgPSB0aW1lQ29udGV4dC5jb21wdXRlZFBpeGVsc1BlclNlY29uZDtcbiAgICBjb25zdCBtaW5TdGVwID0gNztcblxuICAgIC8vIGRlZmluZSBhbGwgZGlzcGxheSBpbmZvcm1hdGlvbiBhY2NvcmRpbmcgdG8gdGhlIHBpeGVsc1BlclNlY29uZCByYXRpb1xuICAgIGxldCBzdGVwLCB0eXBlLCB0b0ZpeGVkLCBtYXJrZXJNb2R1bG8sIGluY2x1ZGVNb2R1bG87XG5cbiAgICBpZiAocGl4ZWxzUGVyU2Vjb25kICogNCA+IG1pblN0ZXApIHtcbiAgICAgIHN0ZXAgPSAxOyAvLyB0aGUgc3RlcCB0byB1c2UgdG8gY29tcHV0ZSB0aW1lXG4gICAgICB0b0ZpeGVkID0gMDtcbiAgICAgIG1hcmtlck1vZHVsbyA9IDYwOyAvLyBhIHRpbWVzdGFtcCBldmVyeSA1IHN0ZXBpeGVsc1BlclNlY29uZFxuICAgICAgaW5jbHVkZU1vZHVsbyA9IDU7IC8vIGEgdGljayBldmVyeSA1IHN0ZXBpeGVsc1BlclNlY29uZFxuICAgICAgdHlwZSA9ICc2MHNlYyc7XG4gICAgfVxuXG4gICAgaWYgKHBpeGVsc1BlclNlY29uZCAqIDIgPiBtaW5TdGVwKSB7XG4gICAgICBzdGVwID0gMTtcbiAgICAgIHRvRml4ZWQgPSAwO1xuICAgICAgbWFya2VyTW9kdWxvID0gMzA7XG4gICAgICBpbmNsdWRlTW9kdWxvID0gMTtcbiAgICAgIHR5cGUgPSAnMzBzZWMnO1xuICAgIH1cblxuICAgIGlmIChwaXhlbHNQZXJTZWNvbmQgPiBtaW5TdGVwKSB7XG4gICAgICBzdGVwID0gMTtcbiAgICAgIHRvRml4ZWQgPSAwO1xuICAgICAgbWFya2VyTW9kdWxvID0gMTA7XG4gICAgICBpbmNsdWRlTW9kdWxvID0gMTtcbiAgICAgIHR5cGUgPSAnc2VjJztcbiAgICB9XG5cbiAgICBpZiAocGl4ZWxzUGVyU2Vjb25kIC8gMTAgPiBtaW5TdGVwKSB7XG4gICAgICBzdGVwID0gMSAvIDEwO1xuICAgICAgdG9GaXhlZCA9IDE7XG4gICAgICBtYXJrZXJNb2R1bG8gPSAxMDtcbiAgICAgIGluY2x1ZGVNb2R1bG8gPSAxO1xuICAgICAgdHlwZSA9ICdkcyc7XG4gICAgfVxuXG4gICAgaWYgKHBpeGVsc1BlclNlY29uZCAvIDEwMCA+IG1pblN0ZXApIHtcbiAgICAgIHN0ZXAgPSAxIC8gMTAwO1xuICAgICAgdG9GaXhlZCA9IDI7XG4gICAgICBtYXJrZXJNb2R1bG8gPSAxMDtcbiAgICAgIGluY2x1ZGVNb2R1bG8gPSAxO1xuICAgICAgdHlwZSA9ICdjcyc7XG4gICAgfVxuXG4gICAgaWYgKHBpeGVsc1BlclNlY29uZCAvIDEwMDAgPiBtaW5TdGVwKSB7XG4gICAgICBzdGVwID0gMSAvIDEwMDA7XG4gICAgICB0b0ZpeGVkID0gMztcbiAgICAgIG1hcmtlck1vZHVsbyA9IDEwO1xuICAgICAgaW5jbHVkZU1vZHVsbyA9IDE7XG4gICAgICB0eXBlID0gJ21zJztcbiAgICB9XG5cbiAgICBmb3IgKGxldCB0aW1lID0gbWluOyB0aW1lIDwgbWF4OyB0aW1lICs9IHN0ZXApIHtcbiAgICAgIGNvbnN0IGZvcm1hdHRlZFRpbWUgPSB0aW1lLnRvRml4ZWQodG9GaXhlZCk7XG5cbiAgICAgIGlmIChNYXRoLnJvdW5kKGZvcm1hdHRlZFRpbWUgLyBzdGVwKSAlIGluY2x1ZGVNb2R1bG8gIT09IDApIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGF2b2lkIGZsb2F0aW5nIHBvaW50IGVycm9yc1xuICAgICAgY29uc3QgZm9jdXNlZCA9IE1hdGgucm91bmQoZm9ybWF0dGVkVGltZSAvIHN0ZXApICUgbWFya2VyTW9kdWxvID09PSAwID8gdHJ1ZSA6IGZhbHNlO1xuXG4gICAgICBjb25zdCBkYXR1bSA9IHsgdGltZTogZm9ybWF0dGVkVGltZSwgZm9jdXNlZCB9O1xuXG4gICAgICBpZiAoZm9jdXNlZCA9PT0gdHJ1ZSkge1xuICAgICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoMTAwMCAqIGZvcm1hdHRlZFRpbWUpO1xuICAgICAgICBjb25zdCBtaW4gPSBwYWRMZWZ0KGRhdGUuZ2V0TWludXRlcygpLCAwLCAyKTtcbiAgICAgICAgY29uc3Qgc2VjID0gcGFkTGVmdChkYXRlLmdldFNlY29uZHMoKSwgMCwgMik7XG4gICAgICAgIGNvbnN0IG1pbGxpID0gcGFkTGVmdChkYXRlLmdldE1pbGxpc2Vjb25kcygpLCAwLCAzKTtcbiAgICAgICAgY29uc3QgbGFiZWwgPSBgJHttaW59OiR7c2VjfToke21pbGxpfWA7XG5cbiAgICAgICAgZGF0dW0ubGFiZWwgPSBsYWJlbDtcbiAgICAgIH1cblxuICAgICAgZGF0YS5wdXNoKGRhdHVtKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfTtcbn0iLCIvKipcbiAqIElzIGFuIGFic3RyYWN0IGNsYXNzIG9yIGludGVyZmFjZSB0byBiZSBvdmVycmlkZW4gaW4gb3JkZXIgdG8gZGVmaW5lIHRoZSB3YXlcbiAqIGEgZ2l2ZW4gc2hhcGUgc2hvdWxkIGJlaGF2ZSB3aGVuIHNlbGVjdGVkIG9yIGVkaXRlZCBieSBhIHVzZXIuIEluc3RhbmNlcyBvZlxuICogYEJhc2VCZWhhdmlvcmAgYXJlIGludGVybmFsbHkgdXNlZCBieSBgTGF5ZXJgIGluc3RhbmNlcyB0byBtb2RpZnkgdGhlIGRhdGFcbiAqIGFjY29yZGluZyB0byBhIHVzZXIgaW50ZXJhY3Rpb24gYW5kIGEgZ2l2ZW4gc2hhcGUuIEEgc2luZ2xlIGluc3RhbmNlIG9mXG4gKiBgQmVoYXZpb3JgIGlzIGNyZWF0ZWQgaW4gb25lIGdpdmVuIHNoYXBlLlxuICpcbiAqIEJ5IGRlZmF1bHQsIHRoZSBvbmx5IG1ldGhvZCB0byBvdmVycmlkZSB0byBkZWZpbmUgYSBuZXcgYmVoYXZpb3IgZm9yIGFcbiAqIHNoYXBlIGlzIHRoZSBgZWRpdGAgbWV0aG9kLiBIb3dldmVyLCBpZiBuZWVkZWQgaW4gc3BlY2lhbCBjYXNlcywgYWxsIHRoZVxuICogc2VsZWN0aW9uIGhhbmRsaW5nIGNhbiBiZSBvdmVycmlkZW4gdG9vLlxuICpcbiAqIFRoZSBmbG93IGlzIHRoZSBmb2xsb3dpbmc6XG4gKiBgRXZlbnRgICAtIChmb3J3YXJkZWQgdG8pIC0+IGBMYXllcmAgLSAoY29tbWFuZCkgLT4gYEJlaGF2aW9yYCAtIChtb2RpZnkpIC0+IGBkYXRhYCAtICh1cGF0ZXMpIC0+IGBTaGFwZWBcbiAqXG4gKiBUaGUgYmVoYXZpb3IgcmVzcG9uc2FiaWxpdHkgaXMgdGhlbiB0byBtb2RpZnkgdGhlIGRhdGEgYWNjb3JkaW5nIHRvIHRoZVxuICogdXNlciBpbnRlcmFjdGlvbnMsIHdoaWxlIHNoYXBlcyBhcmUgYWx3YXlzIGEgdmlldyBvZiB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGVcbiAqIGRhdGEuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VCZWhhdmlvciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX3NlbGVjdGVkSXRlbXMgPSBuZXcgU2V0KCk7IC8vIG5vIGR1cGxpY2F0ZSBpbiBTZXRcbiAgICB0aGlzLl9zZWxlY3RlZENsYXNzID0gbnVsbDtcbiAgICB0aGlzLl9sYXllciA9IG51bGw7XG4gIH1cblxuICBpbml0aWFsaXplKGxheWVyKSB7XG4gICAgdGhpcy5fbGF5ZXIgPSBsYXllcjtcbiAgICB0aGlzLl9zZWxlY3RlZENsYXNzID0gbGF5ZXIucGFyYW1zLnNlbGVjdGVkQ2xhc3NOYW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIERlc3Ryb3kgdGhlIHJlZmVyZW5jZXMgdG8gdGhlIHNlbGVjdGVkIGl0ZW1zLlxuICAgKlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKiBAdG9kbyAtIHJlbmFtZSB0byBgY2xlYXJTZWxlY3Rpb25gIChyZW1vdmluZyB0aGUgY2xhc3MpID9cbiAgICovXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5fc2VsZWN0ZWRJdGVtcy5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBjbGFzcyB0byBhZGQgdG8gdGhlIHNoYXBlcyB3aGVuIHNlbGVjdGVkLlxuICAgKlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgc2V0IHNlbGVjdGVkQ2xhc3ModmFsdWUpIHtcbiAgICB0aGlzLl9zZWxlY3RlZENsYXNzID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGNsYXNzIHRvIGFkZCB0byB0aGUgc2hhcGVzIHdoZW4gc2VsZWN0ZWQuXG4gICAqXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICBnZXQgc2VsZWN0ZWRDbGFzcygpIHtcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWRDbGFzcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBhcnJheSBjb250YWluaW5nIGFsbCB0aGUgc2VsZWN0ZWQgaXRlbXMgb2YgdGhlIGxheWVyLlxuICAgKlxuICAgKiBAdHlwZSB7QXJyYXl9XG4gICAqL1xuICBnZXQgc2VsZWN0ZWRJdGVtcygpIHtcbiAgICByZXR1cm4gWy4uLnRoaXMuX3NlbGVjdGVkSXRlbXNdO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGl0ZW0gLSBUaGUgaXRlbSB0byBzZWxlY3QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXR1bSAtIE5vdCB1c2VkIGluIHRoaXMgaW1wbGVtZW50YXRpb24uIENvdWxkIGJlXG4gICAqICAgIHVzZWQgdG8gbWFyayB0aGUgZGF0YSBhcyBzZWxlY3RlZC5cbiAgICogQHRvZG8gLSBQYXNzIHRoZSBzaGFwZSBvYmplY3QgdG8gZ2V0IHRoZSBhY2Nlc3NvcnMgP1xuICAgKi9cbiAgc2VsZWN0KCRpdGVtLCBkYXR1bSkge1xuICAgICRpdGVtLmNsYXNzTGlzdC5hZGQodGhpcy5zZWxlY3RlZENsYXNzKTtcbiAgICB0aGlzLl9zZWxlY3RlZEl0ZW1zLmFkZCgkaXRlbSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSAkaXRlbSAtIFRoZSBpdGVtIHRvIHVuc2VsZWN0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0dW0gLSBOb3QgdXNlZCBpbiB0aGlzIGltcGxlbWVudGF0aW9uLiBDb3VsZCBiZVxuICAgKiAgICB1c2VkIHRvIG1hcmsgdGhlIGRhdGEgYXMgc2VsZWN0ZWQuXG4gICAqIEB0b2RvIC0gUGFzcyB0aGUgc2hhcGUgb2JqZWN0IHRvIGdldCB0aGUgYWNjZXNzb3JzID9cbiAgICovXG4gIHVuc2VsZWN0KCRpdGVtLCBkYXR1bSkge1xuICAgICRpdGVtLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5zZWxlY3RlZENsYXNzKTtcbiAgICB0aGlzLl9zZWxlY3RlZEl0ZW1zLmRlbGV0ZSgkaXRlbSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSAkaXRlbSAtIFRoZSBpdGVtIHRvIHRvZ2dsZSBzZWxlY3Rpb24uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXR1bSAtIE5vdCB1c2VkIGluIHRoaXMgaW1wbGVtZW50YXRpb24uIENvdWxkIGJlXG4gICAqICAgIHVzZWQgdG8gbWFyayB0aGUgZGF0YSBhcyBzZWxlY3RlZC5cbiAgICogQHRvZG8gLSBQYXNzIHRoZSBzaGFwZSBvYmplY3QgdG8gZ2V0IHRoZSBhY2Nlc3NvcnMgP1xuICAgKi9cbiAgdG9nZ2xlU2VsZWN0aW9uKCRpdGVtLCBkYXR1bSkge1xuICAgIGNvbnN0IG1ldGhvZCA9IHRoaXMuX3NlbGVjdGVkSXRlbXMuaGFzKCRpdGVtKSA/ICd1bnNlbGVjdCcgOiAnc2VsZWN0JztcbiAgICB0aGlzW21ldGhvZF0oJGl0ZW0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgdG8gb3ZlcnJpZGUgaW4gb3JkZXIgdG8gZGVmaW5lIGl0cyBwYXJ0aWN1bGFyIGJlaGF2aW9yIHdoZW5cbiAgICogaW50ZXJhY3RlZCB3aXRoLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcmVuZGVyaW5nQ29udGV4dCAtIFRoZSBsYXllciByZW5kZXJpbmcgY29udGV4dC5cbiAgICogQHBhcmFtIHtCYXNlU2hhcGV9IHNoYXBlIC0gVGhlIHNoYXBlIG9iamVjdCB0byBiZSBlZGl0ZWQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBkYXR1bSAtIFRoZSByZWxhdGVkIGRhdHVtIHRvIG1vZGlmeS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGR4IC0gVGhlIHZhbHVlIG9mIHRoZSBpbnRlcmFjdGlvbiBpbiB0aGUgeCBheGlzIChpbiBwaXhlbHMpLlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHkgLSBUaGUgdmFsdWUgb2YgdGhlIGludGVyYWN0aW9uIGluIHRoZSB5IGF4aXMgKGluIHBpeGVscykuXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJHRhcmdldCAtIFRoZSB0YXJnZXQgRE9NIGVsZW1lbnQgb2YgdGhlIGludGVyYWN0aW9uLlxuICAgKi9cbiAgZWRpdChyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgJHRhcmdldCkge1xuICAgIC8vIG11c3QgYmUgaW1wbGVtZW50ZWQgaW4gY2hpbGRyZW5cbiAgfVxufVxuIiwiaW1wb3J0IEJhc2VCZWhhdmlvciBmcm9tICcuL2Jhc2UtYmVoYXZpb3InO1xuXG5cbi8qKlxuICogRGVmaW5lcyB0aGUgZGVmYXVsdCBiZWhhdmlvciBmb3IgYSBicmVha3BvaW50IGZ1bmN0aW9uLlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLWJyZWFrcG9pbnQuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnJlYWtwb2ludEJlaGF2aW9yIGV4dGVuZHMgQmFzZUJlaGF2aW9yIHtcbiAgZWRpdChyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgY29uc3QgZGF0YSAgPSB0aGlzLl9sYXllci5kYXRhO1xuICAgIGNvbnN0IGxheWVySGVpZ2h0ID0gcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQ7XG4gICAgLy8gY3VycmVudCBwb3NpdGlvblxuICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHNoYXBlLmN4KGRhdHVtKSk7XG4gICAgY29uc3QgeSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHNoYXBlLmN5KGRhdHVtKSk7XG4gICAgLy8gdGFyZ2V0IHBvc2l0aW9uXG4gICAgbGV0IHRhcmdldFggPSB4ICsgZHg7XG4gICAgbGV0IHRhcmdldFkgPSB5IC0gZHk7XG5cbiAgICBpZiAoZGF0YS5sZW5ndGggPiAyKSB7XG4gICAgICAvLyBjcmVhdGUgYSBzb3J0ZWQgbWFwIG9mIGFsbCBgeGAgcG9zaXRpb25zXG4gICAgICBjb25zdCB4TWFwID0gZGF0YS5tYXAoKGQpID0+IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoc2hhcGUuY3goZCkpKTtcbiAgICAgIHhNYXAuc29ydCgoYSwgYikgPT4gYSA8IGIgPyAtMSA6IDEpO1xuICAgICAgLy8gZmluZCBpbmRleCBvZiBvdXIgc2hhcGUgeCBwb3NpdGlvblxuICAgICAgY29uc3QgaW5kZXggPSB4TWFwLmluZGV4T2YoeCk7XG4gICAgICAvLyBsb2NrIHRvIG5leHQgc2libGluZ3NcbiAgICAgIGlmICh0YXJnZXRYIDwgeE1hcFtpbmRleCAtIDFdIHx8wqB0YXJnZXRYID4geE1hcFtpbmRleCArIDFdKSB7XG4gICAgICAgIHRhcmdldFggPSB4O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGxvY2sgaW4geSBheGlzXG4gICAgaWYgKHRhcmdldFkgPCAwKSB7XG4gICAgICB0YXJnZXRZID0gMDtcbiAgICB9IGVsc2UgaWYgKHRhcmdldFkgPiBsYXllckhlaWdodCkge1xuICAgICAgdGFyZ2V0WSA9IGxheWVySGVpZ2h0O1xuICAgIH1cblxuICAgIC8vIHVwZGF0ZSBkYXR1bSB3aXRoIG5ldyB2YWx1ZXNcbiAgICBzaGFwZS5jeChkYXR1bSwgcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQodGFyZ2V0WCkpO1xuICAgIHNoYXBlLmN5KGRhdHVtLCByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbC5pbnZlcnQodGFyZ2V0WSkpO1xuICB9XG59XG4iLCJpbXBvcnQgQmFzZUJlaGF2aW9yIGZyb20gJy4vYmFzZS1iZWhhdmlvcic7XG5cblxuLyoqXG4gKiBEZWZpbmVzIHRoZSBkZWZhdWx0IGJlaGF2aW9yIGZvciBhIG1hcmtlci5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1tYXJrZXIuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFya2VyQmVoYXZpb3IgZXh0ZW5kcyBCYXNlQmVoYXZpb3Ige1xuICBlZGl0KHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICBjb25zdCB4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChzaGFwZS54KGRhdHVtKSk7XG4gICAgbGV0IHRhcmdldFggPSAoeCArIGR4KSA+IDAgPyB4ICsgZHggOiAwO1xuXG4gICAgc2hhcGUueChkYXR1bSwgcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQodGFyZ2V0WCkpO1xuICB9XG59XG4iLCJpbXBvcnQgQmFzZUJlaGF2aW9yIGZyb20gJy4vYmFzZS1iZWhhdmlvcic7XG5cblxuLyoqXG4gKiBEZWZpbmVzIHRoZSBkZWZhdWx0IGJlaGF2aW9yIGZvciBhIHNlZ21lbnQuXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItbWFya2VyLmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlZ21lbnRCZWhhdmlvciBleHRlbmRzIEJhc2VCZWhhdmlvciB7XG4gIGVkaXQocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCkge1xuICAgIGNvbnN0IGNsYXNzTGlzdCA9IHRhcmdldC5jbGFzc0xpc3Q7XG4gICAgbGV0IGFjdGlvbiA9ICdtb3ZlJztcblxuICAgIGlmIChjbGFzc0xpc3QuY29udGFpbnMoJ2hhbmRsZXInKSAmJiBjbGFzc0xpc3QuY29udGFpbnMoJ2xlZnQnKSkge1xuICAgICAgYWN0aW9uID0gJ3Jlc2l6ZUxlZnQnO1xuICAgIH0gZWxzZSBpZiAoY2xhc3NMaXN0LmNvbnRhaW5zKCdoYW5kbGVyJykgJiYgY2xhc3NMaXN0LmNvbnRhaW5zKCdyaWdodCcpKSB7XG4gICAgICBhY3Rpb24gPSAncmVzaXplUmlnaHQnO1xuICAgIH1cblxuICAgIHRoaXNbYF8ke2FjdGlvbn1gXShyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgdGFyZ2V0KTtcbiAgfVxuXG4gIF9tb3ZlKHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICBjb25zdCBsYXllckhlaWdodCA9IHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0O1xuICAgIC8vIGN1cnJlbnQgdmFsdWVzXG4gICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoc2hhcGUueChkYXR1bSkpO1xuICAgIGNvbnN0IHkgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChzaGFwZS55KGRhdHVtKSk7XG4gICAgY29uc3QgaGVpZ2h0ID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwoc2hhcGUuaGVpZ2h0KGRhdHVtKSk7XG4gICAgLy8gdGFyZ2V0IHZhbHVlc1xuICAgIGxldCB0YXJnZXRYID0gTWF0aC5tYXgoeCArIGR4LCAwKTtcbiAgICBsZXQgdGFyZ2V0WSA9IHkgLSBkeTtcblxuICAgIC8vIGxvY2sgaW4gbGF5ZXIncyB5IGF4aXNcbiAgICBpZiAodGFyZ2V0WSA8IDApIHtcbiAgICAgIHRhcmdldFkgPSAwO1xuICAgIH0gZWxzZSBpZiAodGFyZ2V0WSArIGhlaWdodCA+IGxheWVySGVpZ2h0KSB7XG4gICAgICB0YXJnZXRZID0gbGF5ZXJIZWlnaHQgLSBoZWlnaHQ7XG4gICAgfVxuXG4gICAgc2hhcGUueChkYXR1bSwgcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQodGFyZ2V0WCkpO1xuICAgIHNoYXBlLnkoZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsLmludmVydCh0YXJnZXRZKSk7XG4gIH1cblxuICBfcmVzaXplTGVmdChyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgLy8gY3VycmVudCB2YWx1ZXNcbiAgICBjb25zdCB4ICAgICA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoc2hhcGUueChkYXR1bSkpO1xuICAgIGNvbnN0IHdpZHRoID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChzaGFwZS53aWR0aChkYXR1bSkpO1xuICAgIC8vIHRhcmdldCB2YWx1ZXNcbiAgICBsZXQgbWF4VGFyZ2V0WCAgPSB4ICsgd2lkdGg7XG4gICAgbGV0IHRhcmdldFggICAgID0geCArIGR4IDwgbWF4VGFyZ2V0WCA/IE1hdGgubWF4KHggKyBkeCwgMCkgOiB4O1xuICAgIGxldCB0YXJnZXRXaWR0aCA9IHRhcmdldFggIT09IDAgPyBNYXRoLm1heCh3aWR0aCAtIGR4LCAxKSA6IHdpZHRoO1xuXG4gICAgc2hhcGUueChkYXR1bSwgcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQodGFyZ2V0WCkpO1xuICAgIHNoYXBlLndpZHRoKGRhdHVtLCByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydCh0YXJnZXRXaWR0aCkpO1xuICB9XG5cbiAgX3Jlc2l6ZVJpZ2h0KHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICAvLyBjdXJyZW50IHZhbHVlc1xuICAgIGNvbnN0IHdpZHRoID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChzaGFwZS53aWR0aChkYXR1bSkpO1xuICAgIC8vIHRhcmdldCB2YWx1ZXNcbiAgICBsZXQgdGFyZ2V0V2lkdGggPSBNYXRoLm1heCh3aWR0aCArIGR4LCAxKTtcblxuICAgIHNoYXBlLndpZHRoKGRhdHVtLCByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydCh0YXJnZXRXaWR0aCkpO1xuICB9XG59XG4iLCIvKipcbiAqIFRpbWVDb250ZXh0QmVoYXZpb3IgaXMgdXNlZCBpbnRlcm5hbGx5IGluIExheWVycyB0byBtb2RpZnkgdGhlaXIgVGltZUNvbnRleHQuXG4gKiBUaGlzIG9iamVjdCBpcyBkaWZmZXJlbnQgZnJvbSBvdGhlciBTaGFwZXMgQmVoYXZpb3JzIGFuZCBleGlzdHMgbW9zdGx5IHRvIGRlY3JlYXNlIHRoZSBzaXplIG9mIHRoZSBMYXllci5cbiAqIEFsbCB0aGUgY29kZSBoZXJlIGNvdWxkIGJlIGNvbnNpZGVyZWQgYXMgcGFydCBvZiB0aGUgbGF5ZXIuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbWVDb250ZXh0QmVoYXZpb3Ige1xuICBlZGl0KGxheWVyLCBkeCwgZHksIHRhcmdldCkge1xuICAgIGNvbnN0IHRpbWVDb250ZXh0ID0gbGF5ZXIudGltZUNvbnRleHQ7XG5cbiAgICBpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnaGFuZGxlcicpICYmIHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2xlZnQnKSkge1xuICAgICAgdGhpcy5fZWRpdExlZnQodGltZUNvbnRleHQsIGR4KTtcbiAgICB9IGVsc2UgaWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2hhbmRsZXInKSAmJiB0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdyaWdodCcpKSB7XG4gICAgICB0aGlzLl9lZGl0UmlnaHQodGltZUNvbnRleHQsIGR4KTtcbiAgICB9IGVsc2UgaWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3NlZ21lbnQnKSkge1xuICAgICAgdGhpcy5fbW92ZSh0aW1lQ29udGV4dCwgZHgpO1xuICAgIH1cbiAgfVxuXG4gIF9lZGl0TGVmdCh0aW1lQ29udGV4dCwgZHgpIHtcbiAgICAvLyBlZGl0IGBzdGFydGAsIGBvZmZzZXRgIGFuZCBgZHVyYXRpb25gXG4gICAgY29uc3QgeCA9IHRpbWVDb250ZXh0LnBhcmVudC50aW1lVG9QaXhlbCh0aW1lQ29udGV4dC5zdGFydCk7XG4gICAgY29uc3Qgb2Zmc2V0ID0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwodGltZUNvbnRleHQub2Zmc2V0KTtcbiAgICBjb25zdCB3aWR0aCA9IHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRpbWVDb250ZXh0LmR1cmF0aW9uKTtcblxuICAgIGNvbnN0IHRhcmdldFggPSB4ICsgZHg7XG4gICAgY29uc3QgdGFyZ2V0T2Zmc2V0ID0gb2Zmc2V0IC0gZHg7XG4gICAgY29uc3QgdGFyZ2V0V2lkdGggPSBNYXRoLm1heCh3aWR0aCAtIGR4LCAxKTtcblxuICAgIHRpbWVDb250ZXh0LnN0YXJ0ID0gdGltZUNvbnRleHQucGFyZW50LnRpbWVUb1BpeGVsLmludmVydCh0YXJnZXRYKTtcbiAgICB0aW1lQ29udGV4dC5vZmZzZXQgPSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQodGFyZ2V0T2Zmc2V0KTtcbiAgICB0aW1lQ29udGV4dC5kdXJhdGlvbiA9IHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydCh0YXJnZXRXaWR0aCk7XG4gIH1cblxuICBfZWRpdFJpZ2h0KHRpbWVDb250ZXh0LCBkeCkge1xuICAgIGNvbnN0IHdpZHRoID0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwodGltZUNvbnRleHQuZHVyYXRpb24pO1xuICAgIGNvbnN0IHRhcmdldFdpZHRoID0gTWF0aC5tYXgod2lkdGggKyBkeCwgMSk7XG5cbiAgICB0aW1lQ29udGV4dC5kdXJhdGlvbiA9IHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydCh0YXJnZXRXaWR0aCk7XG4gIH1cblxuICBfbW92ZSh0aW1lQ29udGV4dCwgZHgpIHtcbiAgICBjb25zdCB4ID0gdGltZUNvbnRleHQucGFyZW50LnRpbWVUb1BpeGVsKHRpbWVDb250ZXh0LnN0YXJ0KTtcbiAgICBjb25zdCB0YXJnZXRYID0gTWF0aC5tYXgoeCArIGR4LCAwKTtcblxuICAgIHRpbWVDb250ZXh0LnN0YXJ0ID0gdGltZUNvbnRleHQucGFyZW50LnRpbWVUb1BpeGVsLmludmVydCh0YXJnZXRYKTtcbiAgfVxuXG4gIHN0cmV0Y2gobGF5ZXIsIGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgY29uc3QgdGltZUNvbnRleHQgPSBsYXllci50aW1lQ29udGV4dDtcbiAgICBjb25zdCBsYXN0RHVyYXRpb24gPSB0aW1lQ29udGV4dC5kdXJhdGlvbjtcbiAgICBjb25zdCBsYXN0T2Zmc2V0ID0gdGltZUNvbnRleHQub2Zmc2V0O1xuXG4gICAgdGhpcy5lZGl0KGxheWVyLCBkeCwgZHksIHRhcmdldCk7XG5cbiAgICBjb25zdCBuZXdEdXJhdGlvbiA9IHRpbWVDb250ZXh0LmR1cmF0aW9uO1xuICAgIGNvbnN0IHJhdGlvID0gKG5ld0R1cmF0aW9uIC8gbGFzdER1cmF0aW9uKTtcblxuICAgIHRpbWVDb250ZXh0LnN0cmV0Y2hSYXRpbyAqPSByYXRpbztcbiAgICB0aW1lQ29udGV4dC5vZmZzZXQgPSBsYXN0T2Zmc2V0O1xuICAgIHRpbWVDb250ZXh0LmR1cmF0aW9uID0gbGFzdER1cmF0aW9uO1xuICB9XG59XG4iLCJpbXBvcnQgQmFzZUJlaGF2aW9yIGZyb20gJy4vYmFzZS1iZWhhdmlvcic7XG5cblxuLyoqXG4gKiBEZWZpbmVzIHRoZSBkZWZhdWx0IGJlaGF2aW9yIGZvciBhIHRyYWNlIHZpc3VhbGl6YXRpb24uXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItdHJhY2UuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhY2VCZWhhdmlvciBleHRlbmRzIEJhc2VCZWhhdmlvciB7XG4gIGVkaXQocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCkge1xuICAgIGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtaW4nKSkge1xuICAgICAgdGhpcy5fZWRpdFJhbmdlKHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCAnbWluJyk7XG4gICAgfSBlbHNlIGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtYXgnKSkge1xuICAgICAgdGhpcy5fZWRpdFJhbmdlKHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCAnbWF4Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2VkaXRNZWFuKHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5KTtcbiAgICB9XG4gIH1cblxuICBfZWRpdE1lYW4ocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHkpIHtcbiAgICAvLyB3b3JrIGluIHBpeGVsIGRvbWFpblxuICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHNoYXBlLngoZGF0dW0pKTtcbiAgICBjb25zdCB5ID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwoc2hhcGUubWVhbihkYXR1bSkpO1xuXG4gICAgbGV0IHRhcmdldFggPSB4ICsgZHg7XG4gICAgbGV0IHRhcmdldFkgPSB5IC0gZHk7XG5cbiAgICBzaGFwZS54KGRhdHVtLCByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydCh0YXJnZXRYKSk7XG4gICAgc2hhcGUubWVhbihkYXR1bSwgcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFkpKTtcbiAgfVxuXG4gIF9lZGl0UmFuZ2UocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHJhbmdlU2lkZSkge1xuICAgIGNvbnN0IHJhbmdlID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwoc2hhcGUucmFuZ2UoZGF0dW0pKTtcblxuICAgIGxldCB0YXJnZXRSYW5nZSA9IHJhbmdlU2lkZSA9PT0gJ21pbicgPyByYW5nZSArIDIgKiBkeSA6IHJhbmdlIC0gMiAqIGR5O1xuICAgIHRhcmdldFJhbmdlID0gTWF0aC5tYXgodGFyZ2V0UmFuZ2UsIDApO1xuXG4gICAgc2hhcGUucmFuZ2UoZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsLmludmVydCh0YXJnZXRSYW5nZSkpO1xuICB9XG59XG4iLCJpbXBvcnQgc2NhbGVzIGZyb20gJy4uL3V0aWxzL3NjYWxlcyc7XG5cblxuLyoqXG4gKiBBIGBMYXllclRpbWVDb250ZXh0YCBpbnN0YW5jZSByZXByZXNlbnRzIGEgdGltZSBzZWdtZW50IGludG8gYSBgVGltZWxpbmVUaW1lQ29udGV4dGAuXG4gKiBJdCBtdXN0IGJlIGF0dGFjaGVkIHRvIGEgYFRpbWVsaW5lVGltZUNvbnRleHRgICh0aGUgb25lIG9mIHRoZSB0aW1lbGluZSBpdFxuICogYmVsb25ncyB0bykuIEl0IHJlbGllcyBvbiBpdHMgcGFyZW50J3MgYHRpbWVUb1BpeGVsYCAodGltZSB0byBwaXhlbCB0cmFuc2ZlcnRcbiAqIGZ1bmN0aW9uKSB0byBjcmVhdGUgdGhlIHRpbWUgdG8gcGl4ZWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIExheWVyICh0aGUgdmlldykgaXQgaXMgYXR0YWNoZWQgdG8uXG4gKlxuICogVGhlIGBsYXllclRpbWVDb250ZXh0YCBoYXMgZm91ciBpbXBvcnRhbnQgYXR0cmlidXRlczpcbiAqIC0gYHN0YXJ0YCByZXByZXNlbnQgdGhlIHRpbWUgYXQgd2hpY2ggdGVtcG9yYWwgZGF0YSBtdXN0IGJlIHJlcHJlc2VudGVkXG4gKiAgIGluIHRoZSB0aW1lbGluZSAoZm9yIGluc3RhbmNlIHRoZSBiZWdpbmluZyBvZiBhIHNvdW5kZmlsZSBpbiBhIERBVykuXG4gKiAtIGBvZmZzZXRgIHJlcHJlc2VudHMgb2Zmc2V0IHRpbWUgb2YgdGhlIGRhdGEgaW4gdGhlIGNvbnRleHQgb2YgYSBMYXllci5cbiAqICAgKEBUT0RPIGdpdmUgYSB1c2UgY2FzZSBleGFtcGxlIGhlcmUgXCJjcm9wID9cIiwgYW5kL29yIGV4cGxhaW4gdGhhdCBpdCdzIG5vdCBhIGNvbW1vbiB1c2UgY2FzZSkuXG4gKiAtIGBkdXJhdGlvbmAgaXMgdGhlIGR1cmF0aW9uIG9mIHRoZSB2aWV3IG9uIHRoZSBkYXRhLlxuICogLSBgc3RyZXRjaFJhdGlvYCBpcyB0aGUgc3RyZXRjaCBhcHBseWVkIHRvIHRoZSB0ZW1wb3JhbCBkYXRhIGNvbnRhaW5lZCBpblxuICogICB0aGUgdmlldyAodGhpcyB2YWx1ZSBjYW4gYmUgc2VlbiBhcyBhIGxvY2FsIHpvb20gb24gdGhlIGRhdGEsIG9yIGFzIGEgc3RyZXRjaFxuICogICBvbiB0aGUgdGltZSBjb21wb25lbnRzIG9mIHRoZSBkYXRhKS4gV2hlbiBhcHBseWVkLCB0aGUgc3RyZXRjaCByYXRpbyBtYWludGFpblxuICogICB0aGUgc3RhcnQgcG9zaXRpb24gb2YgdGhlIHZpZXcgaW4gdGhlIHRpbWVsaW5lLlxuICpcbiAqIGBgYFxuICogKyB0aW1lbGluZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogMCAgICAgICAgIDUgICAgICAgICAxMCAgICAgICAgICAxNSAgICAgICAgICAyMCAgICAgICAgMjUgICAgICAgICAgMzAgc2Vjb25kc1xuICogKy0tLSsqKioqKioqKioqKioqKioqKistLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rKioqKioqKistLVxuICogICAgIHwqKiogc291bmRmaWxlICoqKnxMYXllciAodmlldyBvbiB0aGUgc291bmQgZmlsZSkgICAgICAgICAgICB8KioqKioqKnxcbiAqICAgICArKioqKioqKioqKioqKioqKiorLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKyoqKioqKiorXG4gKlxuICogICAgIDwtLS0tIG9mZnNldCAtLS0tPjwtLS0tLS0tLS0tLS0tLS0gZHVyYXRpb24gLS0tLS0tLS0tLS0tLS0tLS0+XG4gKiA8LS0tLS0tLS0gc3RhcnQgLS0tLS0+XG4gKlxuICogVGhlIHBhcnRzIG9mIHRoZSBzb3VuZCBmaWxlIHJlcHJlc2VudGVkIHdpdGggJyonIGFyZSBoaWRkZW4gZnJvbSB0aGUgdmlld1xuICogYGBgXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvdGltZS1jb250ZXh0cy5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMYXllclRpbWVDb250ZXh0IHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7VGltZWxpbmVUaW1lQ29udGV4dH0gcGFyZW50IC0gVGhlIGBUaW1lbGluZVRpbWVDb250ZXh0YCBpbnN0YW5jZSBvZiB0aGUgdGltZWxpbmUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwYXJlbnQpIHtcbiAgICBpZiAoIXBhcmVudCkgeyB0aHJvdyBuZXcgRXJyb3IoJ0xheWVyVGltZUNvbnRleHQgbXVzdCBoYXZlIGEgcGFyZW50Jyk7IH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBgVGltZWxpbmVUaW1lQ29udGV4dGAgaW5zdGFuY2Ugb2YgdGhlIHRpbWVsaW5lLlxuICAgICAqXG4gICAgICogQHR5cGUge1RpbWVsaW5lVGltZUNvbnRleHR9XG4gICAgICovXG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG5cbiAgICB0aGlzLl90aW1lVG9QaXhlbCA9IG51bGw7XG4gICAgdGhpcy5fc3RhcnQgPSAwO1xuICAgIHRoaXMuX2R1cmF0aW9uID0gcGFyZW50LnZpc2libGVEdXJhdGlvbjtcbiAgICB0aGlzLl9vZmZzZXQgPSAwO1xuICAgIHRoaXMuX3N0cmV0Y2hSYXRpbyA9IDE7XG4gICAgLy8gcmVnaXN0ZXIgaW50byB0aGUgdGltZWxpbmUncyBUaW1lQ29udGV4dFxuICAgIHRoaXMucGFyZW50Ll9jaGlsZHJlbi5wdXNoKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBjbG9uZSBvZiB0aGUgY3VycmVudCB0aW1lIGNvbnRleHQuXG4gICAqXG4gICAqIEByZXR1cm4ge0xheWVyVGltZUNvbnRleHR9XG4gICAqL1xuICBjbG9uZSgpIHtcbiAgICBjb25zdCBjdHggPSBuZXcgdGhpcygpO1xuXG4gICAgY3R4LnBhcmVudCA9IHRoaXMucGFyZW50O1xuICAgIGN0eC5zdGFydCA9IHRoaXMuc3RhcnQ7XG4gICAgY3R4LmR1cmF0aW9uID0gdGhpcy5kdXJhdGlvbjtcbiAgICBjdHgub2Zmc2V0ID0gdGhpcy5vZmZzZXQ7XG4gICAgY3R4LnN0cmV0Y2hSYXRpbyA9IHRoaXMuc3RyZXRjaFJhdGlvOyAvLyBjcmVhdGVzIHRoZSBsb2NhbCBzY2FsZSBpZiBuZWVkZWRcblxuICAgIHJldHVybiBjdHg7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgc3RhcnQgcG9zaXRpb24gb2YgdGhlIHRpbWUgY29udGV4dCAoaW4gc2Vjb25kcykuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgc3RhcnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXJ0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSB0aW1lIGNvbnRleHQgKGluIHNlY29uZHMpLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgc2V0IHN0YXJ0KHZhbHVlKSB7XG4gICAgdGhpcy5fc3RhcnQgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBkdXJhdGlvbiBvZiB0aGUgdGltZSBjb250ZXh0IChpbiBzZWNvbmRzKS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBkdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fZHVyYXRpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgZHVyYXRpb24gb2YgdGhlIHRpbWUgY29udGV4dCAoaW4gc2Vjb25kcykuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBzZXQgZHVyYXRpb24odmFsdWUpIHtcbiAgICB0aGlzLl9kdXJhdGlvbiA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG9mZnNldCBvZiB0aGUgdGltZSBjb250ZXh0IChpbiBzZWNvbmRzKS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBvZmZzZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX29mZnNldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBvZmZzZXQgb2YgdGhlIHRpbWUgY29udGV4dCAoaW4gc2Vjb25kcykuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBzZXQgb2Zmc2V0KHZhbHVlKSB7XG4gICAgdGhpcy5fb2Zmc2V0ID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgc3RyZXRjaCByYXRpbyBvZiB0aGUgdGltZSBjb250ZXh0LlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IHN0cmV0Y2hSYXRpbygpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RyZXRjaFJhdGlvO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHN0cmV0Y2ggcmF0aW8gb2YgdGhlIHRpbWUgY29udGV4dC5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHNldCBzdHJldGNoUmF0aW8odmFsdWUpIHtcbiAgICAvLyByZW1vdmUgbG9jYWwgc2NhbGUgaWYgcmF0aW8gPSAxXG4gICAgaWYgKHZhbHVlID09PSAgMSkge1xuICAgICAgdGhpcy5fdGltZVRvUGl4ZWwgPSBudWxsO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyByZXVzZSBwcmV2aXNvdXNseSBjcmVhdGVkIGxvY2FsIHNjYWxlIGlmIGV4aXN0c1xuICAgIGNvbnN0IHRpbWVUb1BpeGVsID0gdGhpcy5fdGltZVRvUGl4ZWwgP1xuICAgICAgdGhpcy5fdGltZVRvUGl4ZWwgOiBzY2FsZXMubGluZWFyKCkuZG9tYWluKFswLCAxXSk7XG5cbiAgICB0aW1lVG9QaXhlbC5yYW5nZShbMCwgdGhpcy5wYXJlbnQuY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmQgKiB2YWx1ZV0pO1xuXG4gICAgdGhpcy5fdGltZVRvUGl4ZWwgPSB0aW1lVG9QaXhlbDtcbiAgICB0aGlzLl9zdHJldGNoUmF0aW8gPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0aW1lIHRvIHBpeGVsIHRyYW5zZmVydCBmdW5jdGlvbiBvZiB0aGUgdGltZSBjb250ZXh0LiBJZlxuICAgKiB0aGUgYHN0cmV0Y2hSYXRpb2AgYXR0cmlidXRlIGlzIGVxdWFsIHRvIDEsIHRoaXMgZnVuY3Rpb24gaXMgdGhlIGdsb2JhbFxuICAgKiBvbmUgZnJvbSB0aGUgYFRpbWVsaW5lVGltZUNvbnRleHRgIGluc3RhbmNlLlxuICAgKlxuICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAqL1xuICBnZXQgdGltZVRvUGl4ZWwoKSB7XG4gICAgaWYgKCF0aGlzLl90aW1lVG9QaXhlbCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyZW50LnRpbWVUb1BpeGVsO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl90aW1lVG9QaXhlbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBIZWxwZXIgZnVuY3Rpb24gdG8gY29udmVydCBwaXhlbCB0byB0aW1lLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcHhcbiAgICogQHJldHVybiB7TnVtYmVyfVxuICAgKi9cbiAgcGl4ZWxUb1RpbWUocHgpIHtcbiAgICBpZiAoIXRoaXMuX3RpbWVUb1BpeGVsKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnQudGltZVRvUGl4ZWwuaW52ZXJ0KHB4KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fdGltZVRvUGl4ZWwuaW52ZXJ0KHB4KTtcbiAgfVxufVxuIiwiaW1wb3J0IGV2ZW50cyBmcm9tICdldmVudHMnO1xuaW1wb3J0IG5zIGZyb20gJy4vbmFtZXNwYWNlJztcbmltcG9ydCBzY2FsZXMgZnJvbSAnLi4vdXRpbHMvc2NhbGVzJztcbmltcG9ydCBTZWdtZW50IGZyb20gJy4uL3NoYXBlcy9zZWdtZW50JztcbmltcG9ydCBUaW1lQ29udGV4dEJlaGF2aW9yIGZyb20gJy4uL2JlaGF2aW9ycy90aW1lLWNvbnRleHQtYmVoYXZpb3InO1xuXG4vLyB0aW1lIGNvbnRleHQgYmFoZXZpb3JcbmxldCB0aW1lQ29udGV4dEJlaGF2aW9yID0gbnVsbDtcbmxldCB0aW1lQ29udGV4dEJlaGF2aW9yQ3RvciA9IFRpbWVDb250ZXh0QmVoYXZpb3I7XG5cbi8qKlxuICogVGhlIGxheWVyIGNsYXNzIGlzIHRoZSBtYWluIHZpc3VhbGl6YXRpb24gY2xhc3MuIEl0IGlzIG1haW5seSBkZWZpbmVzIGJ5IGl0c1xuICogcmVsYXRlZCBgTGF5ZXJUaW1lQ29udGV4dGAgd2hpY2ggZGV0ZXJtaW5lcyBpdHMgcG9zaXRpb24gaW4gdGhlIG92ZXJhbGxcbiAqIHRpbWVsaW5lICh0aHJvdWdoIHRoZSBgc3RhcnRgLCBgZHVyYXRpb25gLCBgb2Zmc2V0YCBhbmQgYHN0cmV0Y2hSYXRpb2BcbiAqIGF0dHJpYnV0ZXMpIGFuZCBieSBpdCdzIHJlZ2lzdGVyZWQgU2hhcGUgd2hpY2ggZGVmaW5lcyBob3cgdG8gZGlzcGxheSB0aGVcbiAqIGRhdGEgYXNzb2NpYXRlZCB0byB0aGUgbGF5ZXIuIEVhY2ggY3JlYXRlZCBsYXllciBtdXN0IGJlIGluc2VydGVkIGludG8gYVxuICogYFRyYWNrYCBpbnN0YW5jZSBpbiBvcmRlciB0byBiZSBkaXNwbGF5ZWQuXG4gKlxuICogX05vdGU6IGluIHRoZSBjb250ZXh0IG9mIHRoZSBsYXllciwgYW4gX19pdGVtX18gaXMgdGhlIFNWRyBlbGVtZW50XG4gKiByZXR1cm5lZCBieSBhIGBTaGFwZWAgaW5zdGFuY2UgYW5kIGFzc29jaWF0ZWQgd2l0aCBhIHBhcnRpY3VsYXIgX19kYXR1bV9fLl9cbiAqXG4gKiAjIyMgTGF5ZXIgRE9NIHN0cnVjdHVyZVxuICogYGBgXG4gKiA8ZyBjbGFzcz1cImxheWVyXCIgdHJhbnNmb3JtPVwidHJhbnNsYXRlKCR7c3RhcnR9LCAwKVwiPlxuICogICA8c3ZnIGNsYXNzPVwiYm91bmRpbmctYm94XCIgd2lkdGg9XCIke2R1cmF0aW9ufVwiPlxuICogICAgIDxnIGNsYXNzPVwib2Zmc2V0XCIgdHJhbnNmb3JtPVwidHJhbnNsYXRlKCR7b2Zmc2V0LCAwfSlcIj5cbiAqICAgICAgIDwhLS0gYmFja2dyb3VuZCAtLT5cbiAqICAgICAgIDxyZWN0IGNsYXNzPVwiYmFja2dyb3VuZFwiPjwvcmVjdD5cbiAqICAgICAgIDwhLS0gc2hhcGVzIGFuZCBjb21tb24gc2hhcGVzIGFyZSBpbnNlcnRlZCBoZXJlIC0tPlxuICogICAgIDwvZz5cbiAqICAgICA8ZyBjbGFzcz1cImludGVyYWN0aW9uc1wiPjwhLS0gZm9yIGZlZWRiYWNrIC0tPjwvZz5cbiAqICAgPC9zdmc+XG4gKiA8L2c+XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGF5ZXIgZXh0ZW5kcyBldmVudHMuRXZlbnRFbWl0dGVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhVHlwZSAtIERlZmluZXMgaG93IHRoZSBsYXllciBzaG91bGQgbG9vayBhdCB0aGUgZGF0YS5cbiAgICogICAgQ2FuIGJlICdlbnRpdHknIG9yICdjb2xsZWN0aW9uJy5cbiAgICogQHBhcmFtIHsoQXJyYXl8T2JqZWN0KX0gZGF0YSAtIFRoZSBkYXRhIGFzc29jaWF0ZWQgdG8gdGhlIGxheWVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIENvbmZpZ3VyZXMgdGhlIGxheWVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuaGVpZ2h0PTEwMF0gLSBEZWZpbmVzIHRoZSBoZWlnaHQgb2YgdGhlIGxheWVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMudG9wPTBdIC0gRGVmaW5lcyB0aGUgdG9wIHBvc2l0aW9uIG9mIHRoZSBsYXllci5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLm9wYWNpdHk9MV0gLSBEZWZpbmVzIHRoZSBvcGFjaXR5IG9mIHRoZSBsYXllci5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnlEb21haW49WzAsMV1dIC0gRGVmaW5lcyBib3VuZGFyaWVzIG9mIHRoZSBkYXRhXG4gICAqICAgIHZhbHVlcyBpbiB5IGF4aXMgKGZvciBleGVtcGxlIHRvIGRpc3BsYXkgYW4gYXVkaW8gYnVmZmVyLCB0aGlzIGF0dHJpYnV0ZVxuICAgKiAgICBzaG91bGQgYmUgc2V0IHRvIFstMSwgMV0uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jbGFzc05hbWU9bnVsbF0gLSBBbiBvcHRpb25uYWwgY2xhc3MgdG8gYWRkIHRvIGVhY2hcbiAgICogICAgY3JlYXRlZCBzaGFwZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNsYXNzTmFtZT0nc2VsZWN0ZWQnXSAtIFRoZSBjbGFzcyB0byBhZGQgdG8gYSBzaGFwZVxuICAgKiAgICB3aGVuIHNlbGVjdGVkLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuY29udGV4dEhhbmRsZXJXaWR0aD0yXSAtIFRoZSB3aWR0aCBvZiB0aGUgaGFuZGxlcnNcbiAgICogICAgZGlzcGxheWVkIHRvIGVkaXQgdGhlIGxheWVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuaGl0dGFibGU9ZmFsc2VdIC0gRGVmaW5lcyBpZiB0aGUgbGF5ZXIgY2FuIGJlIGludGVyYWN0ZWRcbiAgICogICAgd2l0aC4gQmFzaWNhbGx5LCB0aGUgbGF5ZXIgaXMgbm90IHJldHVybmVkIGJ5IGBCYXNlU3RhdGUuZ2V0SGl0TGF5ZXJzYCB3aGVuXG4gICAqICAgIHNldCB0byBmYWxzZSAoYSBjb21tb24gdXNlIGNhc2UgaXMgYSBsYXllciB0aGF0IGNvbnRhaW5zIGEgY3Vyc29yKVxuICAgKi9cbiAgY29uc3RydWN0b3IoZGF0YVR5cGUsIGRhdGEsIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKCk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGhlaWdodDogMTAwLFxuICAgICAgdG9wOiAwLFxuICAgICAgb3BhY2l0eTogMSxcbiAgICAgIHlEb21haW46IFswLCAxXSxcbiAgICAgIGNsYXNzTmFtZTogbnVsbCxcbiAgICAgIHNlbGVjdGVkQ2xhc3NOYW1lOiAnc2VsZWN0ZWQnLFxuICAgICAgY29udGV4dEhhbmRsZXJXaWR0aDogMixcbiAgICAgIGhpdHRhYmxlOiB0cnVlLCAvLyB3aGVuIGZhbHNlIHRoZSBsYXllciBpcyBub3QgcmV0dXJuZWQgYnkgYEJhc2VTdGF0ZS5nZXRIaXRMYXllcnNgXG4gICAgICBpZDogJycsIC8vIHVzZWQgP1xuICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLCAvLyB1c2VmdWxsID9cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUGFyYW1ldGVycyBvZiB0aGUgbGF5ZXJzLCBgZGVmYXVsdHNgIG92ZXJyaWRlZCB3aXRoIG9wdGlvbnMuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLnBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcbiAgICAvKipcbiAgICAgKiBEZWZpbmVzIGhvdyB0aGUgbGF5ZXIgc2hvdWxkIGxvb2sgYXQgdGhlIGRhdGEgKGAnZW50aXR5J2Agb3IgYCdjb2xsZWN0aW9uJ2ApLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5kYXRhVHlwZSA9IGRhdGFUeXBlOyAvLyAnZW50aXR5JyB8fCAnY29sbGVjdGlvbic7XG4gICAgLyoqIEB0eXBlIHtMYXllclRpbWVDb250ZXh0fSAqL1xuICAgIHRoaXMudGltZUNvbnRleHQgPSBudWxsO1xuICAgIC8qKiBAdHlwZSB7RWxlbWVudH0gKi9cbiAgICB0aGlzLiRlbCA9IG51bGw7XG4gICAgLyoqIEB0eXBlIHtFbGVtZW50fSAqL1xuICAgIHRoaXMuJGJhY2tncm91bmQgPSBudWxsO1xuICAgIC8qKiBAdHlwZSB7RWxlbWVudH0gKi9cbiAgICB0aGlzLiRib3VuZGluZ0JveCA9IG51bGw7XG4gICAgLyoqIEB0eXBlIHtFbGVtZW50fSAqL1xuICAgIHRoaXMuJG9mZnNldCA9IG51bGw7XG4gICAgLyoqIEB0eXBlIHtFbGVtZW50fSAqL1xuICAgIHRoaXMuJGludGVyYWN0aW9ucyA9IG51bGw7XG4gICAgLyoqXG4gICAgICogQSBTZWdtZW50IGluc3RhbmNpYXRlZCB0byBpbnRlcmFjdCB3aXRoIHRoZSBMYXllciBpdHNlbGYuXG4gICAgICogQHR5cGUge1NlZ21lbnR9XG4gICAgICovXG4gICAgdGhpcy5jb250ZXh0U2hhcGUgPSBudWxsO1xuXG4gICAgdGhpcy5fc2hhcGVDb25maWd1cmF0aW9uID0gbnVsbDsgICAgICAgLy8geyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfVxuICAgIHRoaXMuX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbiA9IG51bGw7IC8vIHsgY3RvciwgYWNjZXNzb3JzLCBvcHRpb25zIH1cbiAgICB0aGlzLl8kaXRlbVNoYXBlTWFwID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuXyRpdGVtRGF0YU1hcCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl8kaXRlbUNvbW1vblNoYXBlTWFwID0gbmV3IE1hcCgpO1xuXG4gICAgdGhpcy5faXNDb250ZXh0RWRpdGFibGUgPSBmYWxzZTtcbiAgICB0aGlzLl9iZWhhdmlvciA9IG51bGw7XG5cbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuXG4gICAgdGhpcy5fdmFsdWVUb1BpeGVsID0gc2NhbGVzLmxpbmVhcigpXG4gICAgICAuZG9tYWluKHRoaXMucGFyYW1zLnlEb21haW4pXG4gICAgICAucmFuZ2UoWzAsIHRoaXMucGFyYW1zLmhlaWdodF0pO1xuXG4gICAgLy8gaW5pdGlhbGl6ZSB0aW1lQ29udGV4dCBsYXlvdXRcbiAgICB0aGlzLl9yZW5kZXJDb250YWluZXIoKTtcbiAgICAvLyBjcmVhdGVzIHRoZSB0aW1lQ29udGV4dEJlaGF2aW9yIGZvciBhbGwgbGF5ZXJzXG4gICAgaWYgKHRpbWVDb250ZXh0QmVoYXZpb3IgPT09IG51bGwpIHtcbiAgICAgIHRpbWVDb250ZXh0QmVoYXZpb3IgPSBuZXcgdGltZUNvbnRleHRCZWhhdmlvckN0b3IoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGVzdHJveSB0aGUgbGF5ZXIsIGNsZWFyIGFsbCByZWZlcmVuY2VzLlxuICAgKi9cbiAgZGVzdHJveSgpIHtcblxuICAgIGlmICh0aGlzLmRhdGFUeXBlID09ICdlbnRpdHknKSB7XG4gICAgICBpZiAodHlwZW9mKHRoaXMuZGF0YS5kaXNwb3NlKSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhpcy5kYXRhLmRpc3Bvc2UoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgdGhpcy50aW1lQ29udGV4dCA9IG51bGw7XG4gICAgdGhpcy5kYXRhID0gbnVsbDtcbiAgICB0aGlzLnBhcmFtcyA9IG51bGw7XG4gICAgdGhpcy5fYmVoYXZpb3IgPSBudWxsO1xuXG4gICAgdGhpcy5fJGl0ZW1TaGFwZU1hcC5jbGVhcigpO1xuICAgIHRoaXMuXyRpdGVtRGF0YU1hcC5jbGVhcigpO1xuICAgIHRoaXMuXyRpdGVtQ29tbW9uU2hhcGVNYXAuY2xlYXIoKTtcblxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCk7XG4gIH1cblxuICAvKipcbiAgICogQWxsb3dzIHRvIG92ZXJyaWRlIGRlZmF1bHQgdGhlIGBUaW1lQ29udGV4dEJlaGF2aW9yYCB1c2VkIHRvIGVkaXQgdGhlIGxheWVyLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gY3RvclxuICAgKi9cbiAgc3RhdGljIGNvbmZpZ3VyZVRpbWVDb250ZXh0QmVoYXZpb3IoY3Rvcikge1xuICAgIHRpbWVDb250ZXh0QmVoYXZpb3JDdG9yID0gY3RvcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGBMYXllclRpbWVDb250ZXh0YCdzIGBzdGFydGAgdGltZSBkb21haW4gdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgc3RhcnQoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQuc3RhcnQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBgTGF5ZXJUaW1lQ29udGV4dGAncyBgc3RhcnRgIHRpbWUgZG9tYWluIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgc2V0IHN0YXJ0KHZhbHVlKSB7XG4gICAgdGhpcy50aW1lQ29udGV4dC5zdGFydCA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYExheWVyVGltZUNvbnRleHRgJ3MgYG9mZnNldGAgdGltZSBkb21haW4gdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgb2Zmc2V0KCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0Lm9mZnNldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGBMYXllclRpbWVDb250ZXh0YCdzIGBvZmZzZXRgIHRpbWUgZG9tYWluIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgc2V0IG9mZnNldCh2YWx1ZSkge1xuICAgIHRoaXMudGltZUNvbnRleHQub2Zmc2V0ID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgTGF5ZXJUaW1lQ29udGV4dGAncyBgZHVyYXRpb25gIHRpbWUgZG9tYWluIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IGR1cmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0LmR1cmF0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYExheWVyVGltZUNvbnRleHRgJ3MgYGR1cmF0aW9uYCB0aW1lIGRvbWFpbiB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHNldCBkdXJhdGlvbih2YWx1ZSkge1xuICAgIHRoaXMudGltZUNvbnRleHQuZHVyYXRpb24gPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGBMYXllclRpbWVDb250ZXh0YCdzIGBzdHJldGNoUmF0aW9gIHRpbWUgZG9tYWluIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IHN0cmV0Y2hSYXRpbygpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC5zdHJldGNoUmF0aW87XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBgTGF5ZXJUaW1lQ29udGV4dGAncyBgc3RyZXRjaFJhdGlvYCB0aW1lIGRvbWFpbiB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHNldCBzdHJldGNoUmF0aW8odmFsdWUpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0LnN0cmV0Y2hSYXRpbyA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgZG9tYWluIGJvdW5kYXJpZXMgb2YgdGhlIGRhdGEgZm9yIHRoZSB5IGF4aXMuXG4gICAqXG4gICAqIEB0eXBlIHtBcnJheX1cbiAgICovXG4gIHNldCB5RG9tYWluKGRvbWFpbikge1xuICAgIHRoaXMucGFyYW1zLnlEb21haW4gPSBkb21haW47XG4gICAgdGhpcy5fdmFsdWVUb1BpeGVsLmRvbWFpbihkb21haW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGRvbWFpbiBib3VuZGFyaWVzIG9mIHRoZSBkYXRhIGZvciB0aGUgeSBheGlzLlxuICAgKlxuICAgKiBAdHlwZSB7QXJyYXl9XG4gICAqL1xuICBnZXQgeURvbWFpbigpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJhbXMueURvbWFpbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBvcGFjaXR5IG9mIHRoZSB3aG9sZSBsYXllci5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHNldCBvcGFjaXR5KHZhbHVlKSB7XG4gICAgdGhpcy5wYXJhbXMub3BhY2l0eSA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG9wYWNpdHkgb2YgdGhlIHdob2xlIGxheWVyLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IG9wYWNpdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zLm9wYWNpdHk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdHJhbnNmZXJ0IGZ1bmN0aW9uIHVzZWQgdG8gZGlzcGxheSB0aGUgZGF0YSBpbiB0aGUgeCBheGlzLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IHRpbWVUb1BpeGVsKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHRyYW5zZmVydCBmdW5jdGlvbiB1c2VkIHRvIGRpc3BsYXkgdGhlIGRhdGEgaW4gdGhlIHkgYXhpcy5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCB2YWx1ZVRvUGl4ZWwoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlVG9QaXhlbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIHRoZSBkaXNwbGF5ZWQgaXRlbXMuXG4gICAqXG4gICAqIEB0eXBlIHtBcnJheTxFbGVtZW50Pn1cbiAgICovXG4gIGdldCBpdGVtcygpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLl8kaXRlbURhdGFNYXAua2V5cygpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBkYXRhIGFzc29jaWF0ZWQgdG8gdGhlIGxheWVyLlxuICAgKlxuICAgKiBAdHlwZSB7T2JqZWN0W119XG4gICAqL1xuICBnZXQgZGF0YSgpIHsgcmV0dXJuIHRoaXMuX2RhdGE7IH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgZGF0YSBhc3NvY2lhdGVkIHdpdGggdGhlIGxheWVyLlxuICAgKlxuICAgKiBAdHlwZSB7T2JqZWN0fE9iamVjdFtdfVxuICAgKi9cbiAgc2V0IGRhdGEoZGF0YSkge1xuICAgIHN3aXRjaCAodGhpcy5kYXRhVHlwZSkge1xuICAgIGNhc2UgJ2VudGl0eSc6XG4gICAgICBpZiAodGhpcy5fZGF0YSkgeyAgLy8gaWYgZGF0YSBhbHJlYWR5IGV4aXN0cywgcmV1c2UgdGhlIHJlZmVyZW5jZVxuICAgICAgICB0aGlzLl9kYXRhWzBdID0gZGF0YTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2RhdGEgPSBbZGF0YV07XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlICdjb2xsZWN0aW9uJzpcbiAgICAgIHRoaXMuX2RhdGEgPSBkYXRhO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHRoaXMuX2NhY2hlZCA9IGZhbHNlO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gSW5pdGlhbGl6YXRpb25cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogUmVuZGVycyB0aGUgRE9NIGluIG1lbW9yeSBvbiBsYXllciBjcmVhdGlvbiB0byBiZSBhYmxlIHRvIHVzZSBpdCBiZWZvcmVcbiAgICogdGhlIGxheWVyIGlzIGFjdHVhbGx5IGluc2VydGVkIGluIHRoZSBET00uXG4gICAqL1xuICBfcmVuZGVyQ29udGFpbmVyKCkge1xuICAgIC8vIHdyYXBwZXIgZ3JvdXAgZm9yIGBzdGFydCwgdG9wIGFuZCBjb250ZXh0IGZsaXAgbWF0cml4XG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgdGhpcy4kZWwuY2xhc3NMaXN0LmFkZCgnbGF5ZXInKTtcbiAgICBpZiAodGhpcy5wYXJhbXMuY2xhc3NOYW1lICE9PSBudWxsKSB7XG4gICAgICB0aGlzLiRlbC5jbGFzc0xpc3QuYWRkKHRoaXMucGFyYW1zLmNsYXNzTmFtZSk7XG4gICAgfVxuICAgIC8vIGNsaXAgdGhlIGNvbnRleHQgd2l0aCBhIGBzdmdgIGVsZW1lbnRcbiAgICB0aGlzLiRib3VuZGluZ0JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3N2ZycpO1xuICAgIHRoaXMuJGJvdW5kaW5nQm94LmNsYXNzTGlzdC5hZGQoJ2JvdW5kaW5nLWJveCcpO1xuICAgIHRoaXMuJGJvdW5kaW5nQm94LnN0eWxlLm92ZXJmbG93ID0gdGhpcy5wYXJhbXMub3ZlcmZsb3c7XG4gICAgLy8gZ3JvdXAgdG8gYXBwbHkgb2Zmc2V0XG4gICAgdGhpcy4kb2Zmc2V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIHRoaXMuJG9mZnNldC5jbGFzc0xpc3QuYWRkKCdvZmZzZXQnLCAnaXRlbXMnKTtcbiAgICAvLyBsYXllciBiYWNrZ3JvdW5kXG4gICAgdGhpcy4kYmFja2dyb3VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3JlY3QnKTtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCAnMTAwJScpO1xuICAgIHRoaXMuJGJhY2tncm91bmQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgJzEwMCUnKTtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLmNsYXNzTGlzdC5hZGQoJ2JhY2tncm91bmQnKTtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLnN0eWxlLmZpbGxPcGFjaXR5ID0gMDtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XG4gICAgLy8gY29udGV4dCBpbnRlcmFjdGlvbnNcbiAgICB0aGlzLiRpbnRlcmFjdGlvbnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgdGhpcy4kaW50ZXJhY3Rpb25zLmNsYXNzTGlzdC5hZGQoJ2ludGVyYWN0aW9ucycpO1xuICAgIHRoaXMuJGludGVyYWN0aW9ucy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIC8vIEBOT1RFOiB3b3JrcyBidXQga2luZyBvZiB1Z2x5Li4uIHNob3VsZCBiZSBjbGVhbmVkXG4gICAgdGhpcy5jb250ZXh0U2hhcGUgPSBuZXcgU2VnbWVudCgpO1xuICAgIHRoaXMuY29udGV4dFNoYXBlLmluc3RhbGwoe1xuICAgICAgb3BhY2l0eTogKCkgPT4gMC4xLFxuICAgICAgY29sb3IgIDogKCkgPT4gJyM3ODc4NzgnLFxuICAgICAgd2lkdGggIDogKCkgPT4gdGhpcy50aW1lQ29udGV4dC5kdXJhdGlvbixcbiAgICAgIGhlaWdodCA6ICgpID0+IHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsLmRvbWFpbigpWzFdLFxuICAgICAgeSAgICAgIDogKCkgPT4gdGhpcy5fcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwuZG9tYWluKClbMF1cbiAgICB9KTtcblxuICAgIHRoaXMuJGludGVyYWN0aW9ucy5hcHBlbmRDaGlsZCh0aGlzLmNvbnRleHRTaGFwZS5yZW5kZXIoKSk7XG4gICAgLy8gY3JlYXRlIHRoZSBET00gdHJlZVxuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRoaXMuJGJvdW5kaW5nQm94KTtcbiAgICB0aGlzLiRib3VuZGluZ0JveC5hcHBlbmRDaGlsZCh0aGlzLiRvZmZzZXQpO1xuICAgIHRoaXMuJG9mZnNldC5hcHBlbmRDaGlsZCh0aGlzLiRiYWNrZ3JvdW5kKTtcbiAgICB0aGlzLiRib3VuZGluZ0JveC5hcHBlbmRDaGlsZCh0aGlzLiRpbnRlcmFjdGlvbnMpO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQ29tcG9uZW50IENvbmZpZ3VyYXRpb25cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogU2V0cyB0aGUgY29udGV4dCBvZiB0aGUgbGF5ZXIsIHRodXMgZGVmaW5pbmcgaXRzIGBzdGFydGAsIGBkdXJhdGlvbmAsXG4gICAqIGBvZmZzZXRgIGFuZCBgc3RyZXRjaFJhdGlvYC5cbiAgICpcbiAgICogQHBhcmFtIHtUaW1lQ29udGV4dH0gdGltZUNvbnRleHQgLSBUaGUgdGltZUNvbnRleHQgaW4gd2hpY2ggdGhlIGxheWVyIGlzIGRpc3BsYXllZC5cbiAgICovXG4gIHNldFRpbWVDb250ZXh0KHRpbWVDb250ZXh0KSB7XG4gICAgdGhpcy50aW1lQ29udGV4dCA9IHRpbWVDb250ZXh0O1xuICAgIC8vIGNyZWF0ZSBhIG1peGluIHRvIHBhc3MgdG8gdGhlIHNoYXBlc1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQgPSB7fTtcbiAgICB0aGlzLl91cGRhdGVSZW5kZXJpbmdDb250ZXh0KCk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBzaGFwZSBhbmQgaXRzIGNvbmZpZ3VyYXRpb24gdG8gdXNlIGluIG9yZGVyIHRvIHJlbmRlciB0aGUgZGF0YS5cbiAgICpcbiAgICogQHBhcmFtIHtCYXNlU2hhcGV9IGN0b3IgLSBUaGUgY29uc3RydWN0b3Igb2YgdGhlIHNoYXBlIHRvIGJlIHVzZWQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbYWNjZXNzb3JzPXt9XSAtIERlZmluZXMgaG93IHRoZSBzaGFwZSBzaG91bGQgYWRhcHQgdG8gYSBwYXJ0aWN1bGFyIGRhdGEgc3RydXR1cmUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gLSBHbG9iYWwgY29uZmlndXJhdGlvbiBmb3IgdGhlIHNoYXBlcywgaXMgc3BlY2lmaWMgdG8gZWFjaCBgU2hhcGVgLlxuICAgKi9cbiAgY29uZmlndXJlU2hhcGUoY3RvciwgYWNjZXNzb3JzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuX3NoYXBlQ29uZmlndXJhdGlvbiA9IHsgY3RvciwgYWNjZXNzb3JzLCBvcHRpb25zIH07XG4gIH1cblxuICAvKipcbiAgICogT3B0aW9ubmFseSByZWdpc3RlciBhIHNoYXBlIHRvIGJlIHVzZWQgYWNjcm9zIHRoZSBlbnRpcmUgY29sbGVjdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtCYXNlU2hhcGV9IGN0b3IgLSBUaGUgY29uc3RydWN0b3Igb2YgdGhlIHNoYXBlIHRvIGJlIHVzZWQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbYWNjZXNzb3JzPXt9XSAtIERlZmluZXMgaG93IHRoZSBzaGFwZSBzaG91bGQgYWRhcHQgdG8gYSBwYXJ0aWN1bGFyIGRhdGEgc3RydXR1cmUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gLSBHbG9iYWwgY29uZmlndXJhdGlvbiBmb3IgdGhlIHNoYXBlcywgaXMgc3BlY2lmaWMgdG8gZWFjaCBgU2hhcGVgLlxuICAgKi9cbiAgY29uZmlndXJlQ29tbW9uU2hhcGUoY3RvciwgYWNjZXNzb3JzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbiA9IHsgY3RvciwgYWNjZXNzb3JzLCBvcHRpb25zIH07XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgdGhlIGJlaGF2aW9yIHRvIHVzZSB3aGVuIGludGVyYWN0aW5nIHdpdGggYSBzaGFwZS5cbiAgICpcbiAgICogQHBhcmFtIHtCYXNlQmVoYXZpb3J9IGJlaGF2aW9yXG4gICAqL1xuICBzZXRCZWhhdmlvcihiZWhhdmlvcikge1xuICAgIGJlaGF2aW9yLmluaXRpYWxpemUodGhpcyk7XG4gICAgdGhpcy5fYmVoYXZpb3IgPSBiZWhhdmlvcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSB2YWx1ZXMgc3RvcmVkIGludCB0aGUgYF9yZW5kZXJpbmdDb250ZXh0YCBwYXNzZWQgIHRvIHNoYXBlc1xuICAgKiBmb3IgcmVuZGVyaW5nIGFuZCB1cGRhdGluZy5cbiAgICovXG4gIF91cGRhdGVSZW5kZXJpbmdDb250ZXh0KCkge1xuICAgIFxuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwgPSB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsO1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsID0gdGhpcy5fdmFsdWVUb1BpeGVsO1xuXG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC53aWR0aCAgPSB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMudGltZUNvbnRleHQuZHVyYXRpb24pO1xuICAgIC8vIGZvciBmb3JlaWduIG9iamVjdCBpc3N1ZSBpbiBjaHJvbWVcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0Lm9mZnNldFggPSB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMudGltZUNvbnRleHQub2Zmc2V0KTtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnN0YXJ0WCA9IHRoaXMudGltZUNvbnRleHQucGFyZW50LnRpbWVUb1BpeGVsKHRoaXMudGltZUNvbnRleHQuc3RhcnQpO1xuXG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC50cmFja09mZnNldFggPSB0aGlzLnRpbWVDb250ZXh0LnBhcmVudC50aW1lVG9QaXhlbCh0aGlzLnRpbWVDb250ZXh0LnBhcmVudC5vZmZzZXQpO1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudmlzaWJsZVdpZHRoID0gdGhpcy50aW1lQ29udGV4dC5wYXJlbnQudmlzaWJsZVdpZHRoO1xuXG4gICAgLy8gYW5kIGNhbGN1bGF0ZSB0aGUgdmlzaWJsZSBhcmVhLCBzdG9yaW5nIGl0IHNvIHNoYXBlcyBjYW5cbiAgICAvLyBkZXRlcm1pbmUgd2hpY2ggYml0cyB0aGV5IG5lZWQgdG8gcmVkcmF3XG4gICAgLy8gQFRPRE8gcmVmYWN0b3IgdGhpcyB1bnVuZGVyc3RhbmRhYmxlIG1lc3NcbiAgICBcbiAgICBsZXQgbWluWCA9IE1hdGgubWF4KC10aGlzLl9yZW5kZXJpbmdDb250ZXh0Lm9mZnNldFgsIDApO1xuXG4gICAgbGV0IHRyYWNrRGVjYXkgPVxuICAgICAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnRyYWNrT2Zmc2V0WCArXG4gICAgICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQuc3RhcnRYO1xuICAgIGlmICh0cmFja0RlY2F5IDwgMCkgeyBtaW5YID0gLXRyYWNrRGVjYXk7IH1cblxuICAgIGxldCBtYXhYID0gbWluWDtcbiAgICBtYXhYICs9ICh0aGlzLl9yZW5kZXJpbmdDb250ZXh0LndpZHRoIC0gbWluWCA8XG4gICAgICAgICAgICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC52aXNpYmxlV2lkdGgpID9cbiAgICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQud2lkdGggOiB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnZpc2libGVXaWR0aDtcblxuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQubWluWCA9IG1pblg7XG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC5tYXhYID0gbWF4WDtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEJlaGF2aW9yIEFjY2Vzc29yc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBpdGVtcyBtYXJrZWQgYXMgc2VsZWN0ZWQuXG4gICAqXG4gICAqIEB0eXBlIHtBcnJheTxFbGVtZW50Pn1cbiAgICovXG4gIGdldCBzZWxlY3RlZEl0ZW1zKCkge1xuICAgIHJldHVybiB0aGlzLl9iZWhhdmlvciA/IHRoaXMuX2JlaGF2aW9yLnNlbGVjdGVkSXRlbXMgOiBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrIGl0ZW0ocykgYXMgc2VsZWN0ZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudHxFbGVtZW50W119ICRpdGVtc1xuICAgKi9cbiAgc2VsZWN0KC4uLiRpdGVtcykge1xuICAgIGlmICghdGhpcy5fYmVoYXZpb3IpIHsgcmV0dXJuOyB9XG4gICAgaWYgKCEkaXRlbXMubGVuZ3RoKSB7ICRpdGVtcyA9IHRoaXMuXyRpdGVtRGF0YU1hcC5rZXlzKCk7IH1cbiAgICBpZiAoQXJyYXkuaXNBcnJheSgkaXRlbXNbMF0pKSB7ICRpdGVtcyA9ICRpdGVtc1swXTsgfVxuXG4gICAgZm9yIChsZXQgJGl0ZW0gb2YgJGl0ZW1zKSB7XG4gICAgICBjb25zdCBkYXR1bSA9IHRoaXMuXyRpdGVtRGF0YU1hcC5nZXQoJGl0ZW0pO1xuICAgICAgdGhpcy5fYmVoYXZpb3Iuc2VsZWN0KCRpdGVtLCBkYXR1bSk7XG4gICAgICB0aGlzLl90b0Zyb250KCRpdGVtKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBpdGVtKHMpIGZyb20gc2VsZWN0ZWQgaXRlbXMuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudHxFbGVtZW50W119ICRpdGVtc1xuICAgKi9cbiAgdW5zZWxlY3QoLi4uJGl0ZW1zKSB7XG4gICAgaWYgKCF0aGlzLl9iZWhhdmlvcikgeyByZXR1cm47IH1cbiAgICBpZiAoISRpdGVtcy5sZW5ndGgpIHsgJGl0ZW1zID0gdGhpcy5fJGl0ZW1EYXRhTWFwLmtleXMoKTsgfVxuICAgIGlmIChBcnJheS5pc0FycmF5KCRpdGVtc1swXSkpIHsgJGl0ZW1zID0gJGl0ZW1zWzBdOyB9XG5cbiAgICBmb3IgKGxldCAkaXRlbSBvZiAkaXRlbXMpIHtcbiAgICAgIGNvbnN0IGRhdHVtID0gdGhpcy5fJGl0ZW1EYXRhTWFwLmdldCgkaXRlbSk7XG4gICAgICB0aGlzLl9iZWhhdmlvci51bnNlbGVjdCgkaXRlbSwgZGF0dW0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGUgaXRlbShzKSBzZWxlY3Rpb24gc3RhdGUgYWNjb3JkaW5nIHRvIHRoZWlyIGN1cnJlbnQgc3RhdGUuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudHxFbGVtZW50W119ICRpdGVtc1xuICAgKi9cbiAgdG9nZ2xlU2VsZWN0aW9uKC4uLiRpdGVtcykge1xuICAgIGlmICghdGhpcy5fYmVoYXZpb3IpIHsgcmV0dXJuOyB9XG4gICAgaWYgKCEkaXRlbXMubGVuZ3RoKSB7ICRpdGVtcyA9IHRoaXMuXyRpdGVtRGF0YU1hcC5rZXlzKCk7IH1cbiAgICBpZiAoQXJyYXkuaXNBcnJheSgkaXRlbXNbMF0pKSB7ICRpdGVtcyA9ICRpdGVtc1swXTsgfVxuXG4gICAgZm9yIChsZXQgJGl0ZW0gb2YgJGl0ZW1zKSB7XG4gICAgICBjb25zdCBkYXR1bSA9IHRoaXMuXyRpdGVtRGF0YU1hcC5nZXQoJGl0ZW0pO1xuICAgICAgdGhpcy5fYmVoYXZpb3IudG9nZ2xlU2VsZWN0aW9uKCRpdGVtLCBkYXR1bSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEVkaXQgaXRlbShzKSBhY2NvcmRpbmcgdG8gdGhlIGBlZGl0YCBkZWZpbmVkIGluIHRoZSByZWdpc3RlcmVkIGBCZWhhdmlvcmAuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudHxFbGVtZW50W119ICRpdGVtcyAtIFRoZSBpdGVtKHMpIHRvIGVkaXQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkeCAtIFRoZSBtb2RpZmljYXRpb24gdG8gYXBwbHkgaW4gdGhlIHggYXhpcyAoaW4gcGl4ZWxzKS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGR5IC0gVGhlIG1vZGlmaWNhdGlvbiB0byBhcHBseSBpbiB0aGUgeSBheGlzIChpbiBwaXhlbHMpLlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICR0YXJnZXQgLSBUaGUgdGFyZ2V0IG9mIHRoZSBpbnRlcmFjdGlvbiAoZm9yIGV4YW1wbGUsIGxlZnRcbiAgICogICAgaGFuZGxlciBET00gZWxlbWVudCBpbiBhIHNlZ21lbnQpLlxuICAgKi9cbiAgZWRpdCgkaXRlbXMsIGR4LCBkeSwgJHRhcmdldCkge1xuICAgIGlmICghdGhpcy5fYmVoYXZpb3IpIHsgcmV0dXJuOyB9XG4gICAgJGl0ZW1zID0gIUFycmF5LmlzQXJyYXkoJGl0ZW1zKSA/IFskaXRlbXNdIDogJGl0ZW1zO1xuXG4gICAgZm9yIChsZXQgJGl0ZW0gb2YgJGl0ZW1zKSB7XG4gICAgICBjb25zdCBzaGFwZSA9IHRoaXMuXyRpdGVtU2hhcGVNYXAuZ2V0KCRpdGVtKTtcbiAgICAgIGNvbnN0IGRhdHVtID0gdGhpcy5fJGl0ZW1EYXRhTWFwLmdldCgkaXRlbSk7XG5cbiAgICAgIHRoaXMuX2JlaGF2aW9yLmVkaXQodGhpcy5fcmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksICR0YXJnZXQpO1xuICAgICAgdGhpcy5lbWl0KCdlZGl0Jywgc2hhcGUsIGRhdHVtKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lcyBpZiB0aGUgYExheWVyYCwgYW5kIHRodXMgdGhlIGBMYXllclRpbWVDb250ZXh0YCBpcyBlZGl0YWJsZSBvciBub3QuXG4gICAqXG4gICAqIEBwYXJhbXMge0Jvb2xlYW59IFtib29sPXRydWVdXG4gICAqL1xuICBzZXRDb250ZXh0RWRpdGFibGUoYm9vbCA9IHRydWUpIHtcbiAgICBjb25zdCBkaXNwbGF5ID0gYm9vbCA/ICdibG9jaycgOiAnbm9uZSc7XG4gICAgdGhpcy4kaW50ZXJhY3Rpb25zLnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5O1xuICAgIHRoaXMuX2lzQ29udGV4dEVkaXRhYmxlID0gYm9vbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBFZGl0IHRoZSBsYXllciBhbmQgdGh1cyBpdHMgcmVsYXRlZCBgTGF5ZXJUaW1lQ29udGV4dGAgYXR0cmlidXRlcy5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGR4IC0gVGhlIG1vZGlmaWNhdGlvbiB0byBhcHBseSBpbiB0aGUgeCBheGlzIChpbiBwaXhlbHMpLlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHkgLSBUaGUgbW9kaWZpY2F0aW9uIHRvIGFwcGx5IGluIHRoZSB5IGF4aXMgKGluIHBpeGVscykuXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJHRhcmdldCAtIFRoZSB0YXJnZXQgb2YgdGhlIGV2ZW50IG9mIHRoZSBpbnRlcmFjdGlvbi5cbiAgICovXG4gIGVkaXRDb250ZXh0KGR4LCBkeSwgJHRhcmdldCkge1xuICAgIHRpbWVDb250ZXh0QmVoYXZpb3IuZWRpdCh0aGlzLCBkeCwgZHksICR0YXJnZXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0cmV0Y2ggdGhlIGxheWVyIGFuZCB0aHVzIGl0cyByZWxhdGVkIGBMYXllclRpbWVDb250ZXh0YCBhdHRyaWJ1dGVzLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHggLSBUaGUgbW9kaWZpY2F0aW9uIHRvIGFwcGx5IGluIHRoZSB4IGF4aXMgKGluIHBpeGVscykuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkeSAtIFRoZSBtb2RpZmljYXRpb24gdG8gYXBwbHkgaW4gdGhlIHkgYXhpcyAoaW4gcGl4ZWxzKS5cbiAgICogQHBhcmFtIHtFbGVtZW50fSAkdGFyZ2V0IC0gVGhlIHRhcmdldCBvZiB0aGUgZXZlbnQgb2YgdGhlIGludGVyYWN0aW9uLlxuICAgKi9cbiAgc3RyZXRjaENvbnRleHQoZHgsIGR5LCAkdGFyZ2V0KSB7XG4gICAgdGltZUNvbnRleHRCZWhhdmlvci5zdHJldGNoKHRoaXMsIGR4LCBkeSwgJHRhcmdldCk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBIZWxwZXJzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gaXRlbSBmcm9tIGEgRE9NIGVsZW1lbnQgcmVsYXRlZCB0byB0aGUgc2hhcGUsIG51bGwgb3RoZXJ3aXNlLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRlbCAtIHRoZSBlbGVtZW50IHRvIGJlIHRlc3RlZFxuICAgKiBAcmV0dXJuIHtFbGVtZW50fG51bGx9XG4gICAqL1xuICBnZXRJdGVtRnJvbURPTUVsZW1lbnQoJGVsKSB7XG4gICAgbGV0ICRpdGVtO1xuXG4gICAgZG8ge1xuICAgICAgaWYgKCRlbC5jbGFzc0xpc3QgJiYgJGVsLmNsYXNzTGlzdC5jb250YWlucygnaXRlbScpKSB7XG4gICAgICAgICRpdGVtID0gJGVsO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgJGVsID0gJGVsLnBhcmVudE5vZGU7XG4gICAgfSB3aGlsZSAoJGVsICE9PSBudWxsKTtcblxuICAgIHJldHVybiB0aGlzLmhhc0l0ZW0oJGl0ZW0pID8gJGl0ZW0gOsKgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBkYXR1bSBhc3NvY2lhdGVkIHRvIGEgc3BlY2lmaWMgaXRlbS5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fSAkaXRlbVxuICAgKiBAcmV0dXJuIHtPYmplY3R8QXJyYXl8bnVsbH1cbiAgICovXG4gIGdldERhdHVtRnJvbUl0ZW0oJGl0ZW0pIHtcbiAgICBjb25zdCBkYXR1bSA9IHRoaXMuXyRpdGVtRGF0YU1hcC5nZXQoJGl0ZW0pO1xuICAgIHJldHVybiBkYXR1bSA/IGRhdHVtIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBkYXR1bSBhc3NvY2lhdGVkIHRvIGEgc3BlY2lmaWMgaXRlbSBmcm9tIGFueSBET00gZWxlbWVudFxuICAgKiBjb21wb3NpbmcgdGhlIHNoYXBlLiBCYXNpY2FsbHkgYSBzaG9ydGN1dCBmb3IgYGdldEl0ZW1Gcm9tRE9NRWxlbWVudGAgYW5kXG4gICAqIGBnZXREYXR1bUZyb21JdGVtYCBtZXRob2RzLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRlbFxuICAgKiBAcmV0dXJuIHtPYmplY3R8QXJyYXl8bnVsbH1cbiAgICovXG4gIGdldERhdHVtRnJvbURPTUVsZW1lbnQoJGVsKSB7XG4gICAgdmFyICRpdGVtID0gdGhpcy5nZXRJdGVtRnJvbURPTUVsZW1lbnQoJGVsKTtcbiAgICBpZiAoJGl0ZW0gPT09IG51bGwpIHsgcmV0dXJuIG51bGw7IH1cbiAgICByZXR1cm4gdGhpcy5nZXREYXR1bUZyb21JdGVtKCRpdGVtKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUZXN0cyBpZiB0aGUgZ2l2ZW4gRE9NIGVsZW1lbnQgaXMgYW4gaXRlbSBvZiB0aGUgbGF5ZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGl0ZW0gLSBUaGUgaXRlbSB0byBiZSB0ZXN0ZWQuXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuICBoYXNJdGVtKCRpdGVtKSB7XG4gICAgcmV0dXJuIHRoaXMuXyRpdGVtRGF0YU1hcC5oYXMoJGl0ZW0pO1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmluZXMgaWYgYSBnaXZlbiBlbGVtZW50IGJlbG9uZ3MgdG8gdGhlIGxheWVyLiBJcyBtb3JlIGdlbmVyYWwgdGhhblxuICAgKiBgaGFzSXRlbWAsIGNhbiBtb3N0bHkgdXNlZCB0byBjaGVjayBpbnRlcmFjdGlvbnMgZWxlbWVudHMuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGVsIC0gVGhlIERPTSBlbGVtZW50IHRvIGJlIHRlc3RlZC5cbiAgICogQHJldHVybiB7Ym9vbH1cbiAgICovXG4gIGhhc0VsZW1lbnQoJGVsKSB7XG4gICAgZG8ge1xuICAgICAgaWYgKCRlbCA9PT0gdGhpcy4kZWwpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgICRlbCA9ICRlbC5wYXJlbnROb2RlO1xuICAgIH0gd2hpbGUgKCRlbCAhPT0gbnVsbCk7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgYWxsIHRoZSBpdGVtcyBpbiBhIGdpdmVuIGFyZWEgYXMgZGVmaW5lZCBpbiB0aGUgcmVnaXN0ZXJlZCBgU2hhcGV+aW5BcmVhYCBtZXRob2QuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhcmVhIC0gVGhlIGFyZWEgaW4gd2hpY2ggdG8gZmluZCB0aGUgZWxlbWVudHNcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGFyZWEudG9wXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBhcmVhLmxlZnRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGFyZWEud2lkdGhcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGFyZWEuaGVpZ2h0XG4gICAqIEByZXR1cm4ge0FycmF5fSAtIGxpc3Qgb2YgdGhlIGl0ZW1zIHByZXNlbnRzIGluIHRoZSBhcmVhXG4gICAqL1xuICBnZXRJdGVtc0luQXJlYShhcmVhKSB7XG4gICAgY29uc3Qgc3RhcnQgICAgPSB0aGlzLnRpbWVDb250ZXh0LnBhcmVudC50aW1lVG9QaXhlbCh0aGlzLnRpbWVDb250ZXh0LnN0YXJ0KTtcbiAgICBjb25zdCBkdXJhdGlvbiA9IHRoaXMudGltZUNvbnRleHQudGltZVRvUGl4ZWwodGhpcy50aW1lQ29udGV4dC5kdXJhdGlvbik7XG4gICAgY29uc3Qgb2Zmc2V0ICAgPSB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMudGltZUNvbnRleHQub2Zmc2V0KTtcbiAgICBjb25zdCB0b3AgICAgICA9IHRoaXMucGFyYW1zLnRvcDtcbiAgICAvLyBiZSBhd2FyZSBhZiBjb250ZXh0J3MgdHJhbnNsYXRpb25zIC0gY29uc3RyYWluIGluIHdvcmtpbmcgdmlld1xuICAgIGxldCB4MSA9IE1hdGgubWF4KGFyZWEubGVmdCwgc3RhcnQpO1xuICAgIGxldCB4MiA9IE1hdGgubWluKGFyZWEubGVmdCArIGFyZWEud2lkdGgsIHN0YXJ0ICsgZHVyYXRpb24pO1xuICAgIHgxIC09IChzdGFydCArIG9mZnNldCk7XG4gICAgeDIgLT0gKHN0YXJ0ICsgb2Zmc2V0KTtcbiAgICAvLyBrZWVwIGNvbnNpc3RlbnQgd2l0aCBjb250ZXh0IHkgY29vcmRpbmF0ZXMgc3lzdGVtXG4gICAgbGV0IHkxID0gdGhpcy5wYXJhbXMuaGVpZ2h0IC0gKGFyZWEudG9wICsgYXJlYS5oZWlnaHQpO1xuICAgIGxldCB5MiA9IHRoaXMucGFyYW1zLmhlaWdodCAtIGFyZWEudG9wO1xuXG4gICAgeTEgKz0gdGhpcy5wYXJhbXMudG9wO1xuICAgIHkyICs9IHRoaXMucGFyYW1zLnRvcDtcblxuICAgIGNvbnN0ICRmaWx0ZXJlZEl0ZW1zID0gW107XG5cbiAgICBmb3IgKGxldCBbJGl0ZW0sIGRhdHVtXSBvZiB0aGlzLl8kaXRlbURhdGFNYXAuZW50cmllcygpKSB7XG4gICAgICBjb25zdCBzaGFwZSA9IHRoaXMuXyRpdGVtU2hhcGVNYXAuZ2V0KCRpdGVtKTtcbiAgICAgIGNvbnN0IGluQXJlYSA9IHNoYXBlLmluQXJlYSh0aGlzLl9yZW5kZXJpbmdDb250ZXh0LCBkYXR1bSwgeDEsIHkxLCB4MiwgeTIpO1xuXG4gICAgICBpZiAoaW5BcmVhKSB7ICRmaWx0ZXJlZEl0ZW1zLnB1c2goJGl0ZW0pOyB9XG4gICAgfVxuXG4gICAgcmV0dXJuICRmaWx0ZXJlZEl0ZW1zO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUmVuZGVyaW5nIC8gRGlzcGxheSBtZXRob2RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIE1vdmVzIGFuIGl0ZW0gdG8gdGhlIGVuZCBvZiB0aGUgbGF5ZXIgdG8gZGlzcGxheSBpdCBmcm9udCBvZiBpdHNcbiAgICogc2libGluZ3MgKHN2ZyB6LWluZGV4Li4uKS5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fSAkaXRlbSAtIFRoZSBpdGVtIHRvIGJlIG1vdmVkLlxuICAgKi9cbiAgX3RvRnJvbnQoJGl0ZW0pIHtcbiAgICB0aGlzLiRvZmZzZXQuYXBwZW5kQ2hpbGQoJGl0ZW0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSB0aGUgRE9NIHN0cnVjdHVyZSBvZiB0aGUgc2hhcGVzIGFjY29yZGluZyB0byB0aGUgZ2l2ZW4gZGF0YS4gSW5zcGlyZWRcbiAgICogZnJvbSB0aGUgYGVudGVyYCBhbmQgYGV4aXRgIGQzLmpzIHBhcmFkaWdtLCB0aGlzIG1ldGhvZCBzaG91bGQgYmUgY2FsbGVkXG4gICAqIGVhY2ggdGltZSBhIGRhdHVtIGlzIGFkZGVkIG9yIHJlbW92ZWQgZnJvbSB0aGUgZGF0YS4gV2hpbGUgdGhlIERPTSBpc1xuICAgKiBjcmVhdGVkIHRoZSBgdXBkYXRlYCBtZXRob2QgbXVzdCBiZSBjYWxsZWQgaW4gb3JkZXIgdG8gdXBkYXRlIHRoZSBzaGFwZXNcbiAgICogYXR0cmlidXRlcyBhbmQgdGh1cyBwbGFjZSB0aGVtIHdoZXJlIHRoZXkgc2hvdWxkLlxuICAgKi9cbiAgcmVuZGVyKCkge1xuXG4gICAgY29uc3QgYmVmb3JlID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgXG4gICAgLy8gcmVuZGVyIGBjb21tb25TaGFwZWAgb25seSBvbmNlXG4gICAgaWYgKFxuICAgICAgdGhpcy5fY29tbW9uU2hhcGVDb25maWd1cmF0aW9uICE9PSBudWxsICYmXG4gICAgICB0aGlzLl8kaXRlbUNvbW1vblNoYXBlTWFwLnNpemUgPT09IDBcbiAgICApIHtcbiAgICAgIGNvbnN0IHsgY3RvciwgYWNjZXNzb3JzLCBvcHRpb25zIH0gPSB0aGlzLl9jb21tb25TaGFwZUNvbmZpZ3VyYXRpb247XG4gICAgICBjb25zdCAkZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgICBjb25zdCBzaGFwZSA9IG5ldyBjdG9yKG9wdGlvbnMpO1xuXG4gICAgICBzaGFwZS5pbnN0YWxsKGFjY2Vzc29ycyk7XG4gICAgICAkZ3JvdXAuYXBwZW5kQ2hpbGQoc2hhcGUucmVuZGVyKCkpO1xuICAgICAgJGdyb3VwLmNsYXNzTGlzdC5hZGQoJ2l0ZW0nLCAnY29tbW9uJywgc2hhcGUuZ2V0Q2xhc3NOYW1lKCkpO1xuXG4gICAgICB0aGlzLl8kaXRlbUNvbW1vblNoYXBlTWFwLnNldCgkZ3JvdXAsIHNoYXBlKTtcbiAgICAgIHRoaXMuJG9mZnNldC5hcHBlbmRDaGlsZCgkZ3JvdXApO1xuICAgIH1cblxuICAgIC8vIGFwcGVuZCBlbGVtZW50cyBhbGwgYXQgb25jZVxuICAgIGNvbnN0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMuXyRpdGVtRGF0YU1hcC52YWx1ZXMoKTsgLy8gaXRlcmF0b3JcblxuICAgIC8vIGVudGVyXG4gICAgaWYgKHRoaXMuX3NoYXBlQ29uZmlndXJhdGlvbiAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5kYXRhLmZvckVhY2goKGRhdHVtKSA9PiB7XG4gICAgICAgIGZvciAobGV0IHZhbHVlIG9mIHZhbHVlcykgeyBpZiAodmFsdWUgPT09IGRhdHVtKSB7IHJldHVybjsgfSB9XG5cbiAgICAgICAgY29uc3QgeyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfSA9IHRoaXMuX3NoYXBlQ29uZmlndXJhdGlvbjtcbiAgICAgICAgY29uc3Qgc2hhcGUgPSBuZXcgY3RvcihvcHRpb25zKTtcbiAgICAgICAgc2hhcGUuaW5zdGFsbChhY2Nlc3NvcnMpO1xuXG4gICAgICAgIGNvbnN0ICRlbCA9IHNoYXBlLnJlbmRlcih0aGlzLl9yZW5kZXJpbmdDb250ZXh0KTtcbiAgICAgICAgJGVsLmNsYXNzTGlzdC5hZGQoJ2l0ZW0nLCBzaGFwZS5nZXRDbGFzc05hbWUoKSk7XG5cbiAgICAgICAgdGhpcy5fJGl0ZW1TaGFwZU1hcC5zZXQoJGVsLCBzaGFwZSk7XG4gICAgICAgIHRoaXMuXyRpdGVtRGF0YU1hcC5zZXQoJGVsLCBkYXR1bSk7XG5cbiAgICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoJGVsKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLiRvZmZzZXQuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xuICAgIH1cblxuICAgIC8vIHJlbW92ZVxuICAgIGZvciAobGV0IFskaXRlbSwgZGF0dW1dIG9mIHRoaXMuXyRpdGVtRGF0YU1hcC5lbnRyaWVzKCkpIHtcbiAgICAgIGlmICh0aGlzLmRhdGEuaW5kZXhPZihkYXR1bSkgIT09IC0xKSB7IGNvbnRpbnVlOyB9XG5cbiAgICAgIGNvbnN0IHNoYXBlID0gdGhpcy5fJGl0ZW1TaGFwZU1hcC5nZXQoJGl0ZW0pO1xuXG4gICAgICB0aGlzLiRvZmZzZXQucmVtb3ZlQ2hpbGQoJGl0ZW0pO1xuICAgICAgc2hhcGUuZGVzdHJveSgpO1xuICAgICAgLy8gYSByZW1vdmVkIGl0ZW0gY2Fubm90IGJlIHNlbGVjdGVkXG4gICAgICBpZiAodGhpcy5fYmVoYXZpb3IpIHtcbiAgICAgICAgdGhpcy5fYmVoYXZpb3IudW5zZWxlY3QoJGl0ZW0sIGRhdHVtKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fJGl0ZW1EYXRhTWFwLmRlbGV0ZSgkaXRlbSk7XG4gICAgICB0aGlzLl8kaXRlbVNoYXBlTWFwLmRlbGV0ZSgkaXRlbSk7XG4gICAgfVxuXG4gICAgY29uc3QgYWZ0ZXIgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICBjb25zb2xlLmxvZyhcImxheWVyIHJlbmRlciB0aW1lID0gXCIgKyBNYXRoLnJvdW5kKGFmdGVyIC0gYmVmb3JlKSk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgY29udGFpbmVyIG9mIHRoZSBsYXllciBhbmQgdGhlIGF0dHJpYnV0ZXMgb2YgdGhlIGV4aXN0aW5nIHNoYXBlcy5cbiAgICovXG4gIHVwZGF0ZSgpIHtcbiAgICB0aGlzLnVwZGF0ZUNvbnRhaW5lcigpO1xuICAgIHRoaXMudXBkYXRlU2hhcGVzKCk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgY29udGFpbmVyIG9mIHRoZSBsYXllci5cbiAgICovXG4gIHVwZGF0ZUNvbnRhaW5lcigpIHtcbiAgICB0aGlzLl91cGRhdGVSZW5kZXJpbmdDb250ZXh0KCk7XG5cbiAgICBjb25zdCB0aW1lQ29udGV4dCA9IHRoaXMudGltZUNvbnRleHQ7XG4gICAgY29uc3Qgd2lkdGggID0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwodGltZUNvbnRleHQuZHVyYXRpb24pO1xuICAgIC8vIHggaXMgcmVsYXRpdmUgdG8gdGltZWxpbmUncyB0aW1lQ29udGV4dFxuICAgIGNvbnN0IHggICAgICA9IHRpbWVDb250ZXh0LnBhcmVudC50aW1lVG9QaXhlbCh0aW1lQ29udGV4dC5zdGFydCk7XG4gICAgY29uc3Qgb2Zmc2V0ID0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwodGltZUNvbnRleHQub2Zmc2V0KTtcbiAgICBjb25zdCB0b3AgICAgPSB0aGlzLnBhcmFtcy50b3A7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuICAgIC8vIG1hdHJpeCB0byBpbnZlcnQgdGhlIGNvb3JkaW5hdGUgc3lzdGVtXG4gICAgY29uc3QgdHJhbnNsYXRlTWF0cml4ID0gYG1hdHJpeCgxLCAwLCAwLCAtMSwgJHt4fSwgJHt0b3AgKyBoZWlnaHR9KWA7XG5cbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgdHJhbnNsYXRlTWF0cml4KTtcblxuICAgIHRoaXMuJGJvdW5kaW5nQm94LnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHdpZHRoKTtcbiAgICB0aGlzLiRib3VuZGluZ0JveC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgaGVpZ2h0KTtcbiAgICB0aGlzLiRib3VuZGluZ0JveC5zdHlsZS5vcGFjaXR5ID0gdGhpcy5wYXJhbXMub3BhY2l0eTtcblxuICAgIHRoaXMuJG9mZnNldC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke29mZnNldH0sIDApYCk7XG4gICAgLy8gbWFpbnRhaW4gY29udGV4dCBzaGFwZVxuICAgIHRoaXMuY29udGV4dFNoYXBlLnVwZGF0ZSh0aGlzLl9yZW5kZXJpbmdDb250ZXh0LCB0aGlzLnRpbWVDb250ZXh0LCAwKTtcbiAgfVxuICBcbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGF0dHJpYnV0ZXMgb2YgYWxsIHRoZSBgU2hhcGVgIGluc3RhbmNlcyByZW5kZXJlZCBpbnRvIHRoZSBsYXllci5cbiAgICovXG4gIHVwZGF0ZVNoYXBlcygpIHtcblxuICAgIGNvbnN0IGJlZm9yZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIFxuICAgIHRoaXMuX3VwZGF0ZVJlbmRlcmluZ0NvbnRleHQoKTtcblxuICAgIGlmICh0aGlzLmRhdGFUeXBlID09PSAnZW50aXR5Jykge1xuICAgICAgaWYgKCF0aGlzLl9jYWNoZWQpIHtcblx0aWYgKHRoaXMuX2RhdGEgIT09IFtdKSB7XG5cdCAgbGV0IG9yaWdEYXRhID0gdGhpcy5fZGF0YVswXTtcbiAgICAgICAgICBmb3IgKGxldCBbJGl0ZW0sIGRhdHVtXSBvZiB0aGlzLl8kaXRlbURhdGFNYXAuZW50cmllcygpKSB7XG5cdCAgICBpZiAoZGF0dW0gPT09IG9yaWdEYXRhKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHNoYXBlID0gdGhpcy5fJGl0ZW1TaGFwZU1hcC5nZXQoJGl0ZW0pO1xuICAgICAgICAgICAgICBjb25zdCBjYWNoZSA9IHNoYXBlLmVuY2FjaGUoZGF0dW0pO1xuXHQgICAgICBpZiAoY2FjaGUpIHtcblx0XHRjb25zb2xlLmxvZyhcInJlcGxhY2luZyBvdXIgZW50aXR5IGRhdGEgd2l0aCBjYWNoZWQgdmFsdWVcIik7XG5cdFx0dGhpcy5fJGl0ZW1EYXRhTWFwLnNldCgkaXRlbSwgY2FjaGUpO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Yob3JpZ0RhdGEuZGlzcG9zZSkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImFuZCBjYWxsaW5nIGRpc3Bvc2Ugb24gZW50aXR5IGRhdGFcIik7XG4gICAgICAgICAgICAgICAgICBvcmlnRGF0YS5kaXNwb3NlKCk7XG4gICAgICAgICAgICAgICAgfVxuXHRcdHRoaXMuZGF0YSA9IGNhY2hlO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfVxuICAgICAgICAgIHRoaXMuX2NhY2hlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gVXBkYXRlIGNvbW1vbiBzaGFwZSwgaWYgYW55XG4gICAgdGhpcy5fJGl0ZW1Db21tb25TaGFwZU1hcC5mb3JFYWNoKChzaGFwZSwgJGl0ZW0pID0+IHtcbiAgICAgIHNoYXBlLnVwZGF0ZSh0aGlzLl9yZW5kZXJpbmdDb250ZXh0LCB0aGlzLmRhdGEpO1xuICAgIH0pO1xuXG4gICAgY29uc29sZS5sb2coXCJpdGVtIGRhdGEgbWFwIGNvbnRhaW5zIFwiICsgdGhpcy5fJGl0ZW1EYXRhTWFwLnNpemUgKyBcIiBlbnRyaWVzXCIpO1xuICAgIFxuICAgIC8vIFVwZGF0ZSBzcGVjaWZpYyBzaGFwZXNcbiAgICBmb3IgKGxldCBbJGl0ZW0sIGRhdHVtXSBvZiB0aGlzLl8kaXRlbURhdGFNYXAuZW50cmllcygpKSB7XG4gICAgICBjb25zdCBzaGFwZSA9IHRoaXMuXyRpdGVtU2hhcGVNYXAuZ2V0KCRpdGVtKTtcbiAgICAgIHNoYXBlLnVwZGF0ZSh0aGlzLl9yZW5kZXJpbmdDb250ZXh0LCBkYXR1bSk7XG4gICAgfVxuXG4gICAgY29uc3QgYWZ0ZXIgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICBjb25zb2xlLmxvZyhcImxheWVyIHVwZGF0ZSB0aW1lID0gXCIgKyBNYXRoLnJvdW5kKGFmdGVyIC0gYmVmb3JlKSk7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc7XG4iLCJpbXBvcnQgc2NhbGVzIGZyb20gJy4uL3V0aWxzL3NjYWxlcyc7XG5cblxuLyoqXG4gKiBEZWZpbmVzIGFuZCBtYWludGFpbnMgZ2xvYmFsIGFzcGVjdHMgb2YgdGhlIHZpc3VhbGl6YXRpb24gY29uY2VybmluZyB0aGVcbiAqIHJlbGF0aW9ucyBiZXR3ZWVuIHRpbWUgYW5kIHBpeGVscy5cbiAqXG4gKiBUaGUgYFRpbWVsaW5lVGltZUNvbnRleHRgIGluc3RhbmNlICh1bmlxdWUgYWNyb3NzIGEgdmlzdWFsaXphdGlvbikga2VlcHMgdGhlXG4gKiBtYWluIHJlZmVyZW5jZSBvbiBob3cgbWFueSBwaXhlbHMgc2hvdWxkIGJlIHVzZWQgdG8gcmVwcmVzZW50IG9uZSBzZWNvbmRcbiAqIHRob3VnaCBpdHMgYHRpbWVUb1BpeGVsYCBtZXRob2QuIFRoZSBhdHRyaWJ1dGVzIGB6b29tYCwgYG9mZnNldGAgKGkuZS4gZnJvbVxuICogb3JpZ2luKSBhbmQgYHZpc2libGVXaWR0aGAgYWxsb3cgZm9yIG5hdmlnYXRpbmcgaW4gdGltZSBhbmQgZm9yIG1haW50YWluaW5nXG4gKiB2aWV3IGNvbnNpc3RlbmN5IHVwb24gdGhlIERPTSBzdHJ1Y3R1cmUgKGA8c3ZnPmAgYW5kIGA8Zz5gIHRhZ3MpIGNyZWF0ZWQgYnlcbiAqIHRoZSByZWdpc3RlcmVkIHRyYWNrcy5cbiAqXG4gKiBJdCBhbHNvIG1haW50YWluIGFuIGFycmF5IG9mIGFsbCByZWZlcmVuY2VzIHRvIGBMYXllclRpbWVDb250ZXh0YCBpbnN0YW5jZXNcbiAqIHRvIHByb3BhZ2F0ZSB0byBgbGF5ZXJzYCwgY2hhbmdlcyBtYWRlIG9uIHRoZSB0aW1lIHRvIHBpeGVsIHJlcHJlc2VudGF0aW9uLlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL3RpbWUtY29udGV4dHMuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZWxpbmVUaW1lQ29udGV4dCB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcGl4ZWxzUGVyU2Vjb25kIC0gVGhlIG51bWJlciBvZiBwaXhlbHMgdGhhdCBzaG91bGQgYmVcbiAgICogICAgdXNlZCB0byBkaXNwbGF5IG9uZSBzZWNvbmQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2aXNpYmxlV2lkdGggLSBUaGUgZGVmYXVsdCB3aXRoIG9mIHRoZSB2aXNpYmxlIGFyZWFcbiAgICogICAgZGlzcGxheWVkIGluIGB0cmFja3NgIChpbiBwaXhlbHMpLlxuICAgKi9cbiAgY29uc3RydWN0b3IocGl4ZWxzUGVyU2Vjb25kLCB2aXNpYmxlV2lkdGgpIHtcbiAgICB0aGlzLl9jaGlsZHJlbiA9IFtdO1xuXG4gICAgdGhpcy5fdGltZVRvUGl4ZWwgPSBudWxsO1xuICAgIHRoaXMuX29mZnNldCA9IDA7XG4gICAgdGhpcy5fem9vbSA9IDE7XG4gICAgdGhpcy5fY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmQgPSBwaXhlbHNQZXJTZWNvbmQ7XG4gICAgLy8gcGFyYW1zXG4gICAgdGhpcy5fdmlzaWJsZVdpZHRoID0gdmlzaWJsZVdpZHRoO1xuICAgIHRoaXMuX21haW50YWluVmlzaWJsZUR1cmF0aW9uID0gZmFsc2U7XG5cbiAgICAvLyBjcmVhdGUgdGhlIHRpbWVUb1BpeGVsIHNjYWxlXG4gICAgY29uc3Qgc2NhbGUgPSBzY2FsZXMubGluZWFyKClcbiAgICAgIC5kb21haW4oWzAsIDFdKVxuICAgICAgLnJhbmdlKFswLCBwaXhlbHNQZXJTZWNvbmRdKTtcblxuICAgIHRoaXMuX3RpbWVUb1BpeGVsID0gc2NhbGU7XG5cbiAgICB0aGlzLl9vcmlnaW5hbFBpeGVsc1BlclNlY29uZCA9IHRoaXMuX2NvbXB1dGVkUGl4ZWxzUGVyU2Vjb25kO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG51bWJlciBvZiBwaXhlbHMgcGVyIHNlY29uZHMgaWdub3JpbmcgdGhlIGN1cnJlbnQgem9vbSB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBwaXhlbHNQZXJTZWNvbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX29yaWdpbmFsUGl4ZWxzUGVyU2Vjb25kO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgYWxsIHRoZSBjYXJhY3RlcmlzdGljcyBvZiB0aGlzIG9iamVjdCBhY2NvcmRpbmcgdG8gdGhlIG5ld1xuICAgKiBnaXZlbiB2YWx1ZSBvZiBwaXhlbHMgcGVyIHNlY29uZHMuIFByb3BhZ2F0ZXMgdGhlIGNoYW5nZXMgdG8gdGhlXG4gICAqIGBMYXllclRpbWVDb250ZXh0YCBjaGlsZHJlbi5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHNldCBwaXhlbHNQZXJTZWNvbmQodmFsdWUpIHtcbiAgICB0aGlzLl9jb21wdXRlZFBpeGVsc1BlclNlY29uZCA9IHZhbHVlICogdGhpcy56b29tO1xuICAgIHRoaXMuX29yaWdpbmFsUGl4ZWxzUGVyU2Vjb25kID0gdmFsdWU7XG4gICAgdGhpcy5fdXBkYXRlVGltZVRvUGl4ZWxSYW5nZSgpO1xuXG4gICAgLy8gZm9yY2UgY2hpbGRyZW4gc2NhbGUgdXBkYXRlXG4gICAgdGhpcy5fY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihjaGlsZCkge1xuICAgICAgaWYgKGNoaWxkLnN0cmV0Y2hSYXRpbyA9PT0gMSkgeyByZXR1cm47IH1cbiAgICAgIGNoaWxkLnN0cmV0Y2hSYXRpbyA9IGNoaWxkLnN0cmV0Y2hSYXRpbztcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2YgcGl4ZWxzIHBlciBzZWNvbmRzIGluY2x1ZGluZyB0aGUgY3VycmVudCB6b29tIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IGNvbXB1dGVkUGl4ZWxzUGVyU2Vjb25kKCkge1xuICAgIHJldHVybiB0aGlzLl9jb21wdXRlZFBpeGVsc1BlclNlY29uZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBjdXJyZW50IG9mZnNldCBhcHBsaWVkIHRvIHRoZSByZWdpc3RlcmVkIGBUcmFja2AgaW5zdGFuY2VzXG4gICAqIGZyb20gb3JpZ2luIChpbiBzZWNvbmRzKS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBvZmZzZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX29mZnNldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBvZmZzZXQgdG8gYXBwbHkgdG8gdGhlIHJlZ2lzdGVyZWQgYFRyYWNrYCBpbnN0YW5jZXMgZnJvbSBvcmlnaW5cbiAgICogKGluIHNlY29uZHMpLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgc2V0IG9mZnNldCh2YWx1ZSkge1xuICAgIHRoaXMuX29mZnNldCA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGN1cnJlbnQgem9vbSBsZXZlbCBhcHBsaWVkIHRvIHRoZSB3aG9sZSB2aXN1YWxpemF0aW9uLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IHpvb20oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3pvb207XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgem9vbSByYXRpbyBmb3IgdGhlIHdob2xlIHZpc3VhbGl6YXRpb24uXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBzZXQgem9vbSh2YWx1ZSkge1xuICAgIC8vIENvbXB1dGUgY2hhbmdlIHRvIHByb3BhZ2F0ZSB0byBjaGlsZHJlbiB3aG8gaGF2ZSB0aGVpciBvd24gdGltZVRvUGl4ZWxcbiAgICBjb25zdCByYXRpb0NoYW5nZSA9IHZhbHVlIC8gdGhpcy5fem9vbTtcbiAgICB0aGlzLl96b29tID0gdmFsdWU7XG4gICAgdGhpcy5fY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmQgPSB0aGlzLl9vcmlnaW5hbFBpeGVsc1BlclNlY29uZCAqIHZhbHVlO1xuICAgIHRoaXMuX3VwZGF0ZVRpbWVUb1BpeGVsUmFuZ2UoKTtcblxuICAgIHRoaXMuX2NoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgIGlmIChjaGlsZC5zdHJldGNoUmF0aW8gPT09IDEpIHsgcmV0dXJuOyB9XG4gICAgICBjaGlsZC5zdHJldGNoUmF0aW8gPSBjaGlsZC5zdHJldGNoUmF0aW8gKiByYXRpb0NoYW5nZTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB2aXNpYmxlIHdpZHRoIG9mIHRoZSBgVHJhY2tgIGluc3RhbmNlcy5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCB2aXNpYmxlV2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Zpc2libGVXaWR0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB2aXNpYmxlIHdpZHRoIG9mIHRoZSBgVHJhY2tgIGluc3RhbmNlcy5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHNldCB2aXNpYmxlV2lkdGgodmFsdWUpIHtcbiAgICBjb25zdCB3aWR0aFJhdGlvID0gdmFsdWUgLyB0aGlzLnZpc2libGVXaWR0aDtcbiAgICB0aGlzLl92aXNpYmxlV2lkdGggPSB2YWx1ZTtcblxuICAgIGlmICh0aGlzLm1haW50YWluVmlzaWJsZUR1cmF0aW9uKSB7XG4gICAgICB0aGlzLnBpeGVsc1BlclNlY29uZCA9IHRoaXMuX2NvbXB1dGVkUGl4ZWxzUGVyU2Vjb25kICogd2lkdGhSYXRpbztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZHVyYXRpb24gZGlzcGxheWVkIGJ5IGBUcmFja2AgaW5zdGFuY2VzLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IHZpc2libGVEdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy52aXNpYmxlV2lkdGggLyB0aGlzLl9jb21wdXRlZFBpeGVsc1BlclNlY29uZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGlmIHRoZSBkdXJhdGlvbiBkaXNwbGF5ZWQgYnkgdHJhY2tzIHNob3VsZCBiZSBtYWludGFpbmVkIHdoZW5cbiAgICogdGhlaXIgd2lkdGggaXMgdXBkYXRlZC5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBtYWludGFpblZpc2libGVEdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fbWFpbnRhaW5WaXNpYmxlRHVyYXRpb247XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lcyBpZiB0aGUgZHVyYXRpb24gZGlzcGxheWVkIGJ5IHRyYWNrcyBzaG91bGQgYmUgbWFpbnRhaW5lZCB3aGVuXG4gICAqIHRoZWlyIHdpZHRoIGlzIHVwZGF0ZWQuXG4gICAqXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cbiAgc2V0IG1haW50YWluVmlzaWJsZUR1cmF0aW9uKGJvb2wpIHtcbiAgICB0aGlzLl9tYWludGFpblZpc2libGVEdXJhdGlvbiA9IGJvb2w7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdGltZSB0byBwaXhlbCB0cmFzZmVydCBmdW5jdGlvbi5cbiAgICpcbiAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgKi9cbiAgZ2V0IHRpbWVUb1BpeGVsKCkge1xuICAgIHJldHVybiB0aGlzLl90aW1lVG9QaXhlbDtcbiAgfVxuXG4gIF91cGRhdGVUaW1lVG9QaXhlbFJhbmdlKCkge1xuICAgIHRoaXMudGltZVRvUGl4ZWwucmFuZ2UoWzAsIHRoaXMuX2NvbXB1dGVkUGl4ZWxzUGVyU2Vjb25kXSk7XG4gIH1cbn1cbiIsImltcG9ydCBldmVudHMgZnJvbSAnZXZlbnRzJztcblxuaW1wb3J0IEtleWJvYXJkIGZyb20gJy4uL2ludGVyYWN0aW9ucy9rZXlib2FyZCc7XG5pbXBvcnQgTGF5ZXJUaW1lQ29udGV4dCBmcm9tICcuL2xheWVyLXRpbWUtY29udGV4dCc7XG5pbXBvcnQgU3VyZmFjZSBmcm9tICcuLi9pbnRlcmFjdGlvbnMvc3VyZmFjZSc7XG5pbXBvcnQgVGltZWxpbmVUaW1lQ29udGV4dCBmcm9tICcuL3RpbWVsaW5lLXRpbWUtY29udGV4dCc7XG5pbXBvcnQgVHJhY2sgZnJvbSAnLi90cmFjayc7XG5pbXBvcnQgVHJhY2tDb2xsZWN0aW9uIGZyb20gJy4vdHJhY2stY29sbGVjdGlvbic7XG5cblxuLyoqXG4gKiBJcyB0aGUgbWFpbiBlbnRyeSBwb2ludCB0byBjcmVhdGUgYSB0ZW1wb3JhbCB2aXN1YWxpemF0aW9uLlxuICpcbiAqIEEgYHRpbWVsaW5lYCBpbnN0YW5jZSBtYWlubHkgcHJvdmlkZXMgdGhlIGNvbnRleHQgZm9yIGFueSB2aXN1YWxpemF0aW9uIG9mXG4gKiB0ZW1wb3JhbCBkYXRhIGFuZCBtYWludGFpbnMgdGhlIGhpZXJhcmNoeSBvZiBgVHJhY2tgLCBgTGF5ZXJgIGFuZCBgU2hhcGVgXG4gKiBvdmVyIHRoZSBlbnRpZXJlIHZpc3VhbGlzYXRpb24uXG4gKlxuICogSXRzIG1haW4gcmVzcG9uc2FiaWxpdGVzIGFyZTpcbiAqIC0gbWFpbnRhaW5pbmcgdGhlIHRlbXBvcmFsIGNvbnNpc3RlbmN5IGFjY3Jvc3MgdGhlIHZpc3VhbGlzYXRpb24gdGhyb3VnaFxuICogICBpdHMgYHRpbWVDb250ZXh0YCBwcm9wZXJ0eSAoaW5zdGFuY2Ugb2YgYFRpbWVsaW5lVGltZUNvbnRleHRgKS5cbiAqIC0gaGFuZGxpbmcgaW50ZXJhY3Rpb25zIHRvIGl0cyBjdXJyZW50IHN0YXRlIChhY3RpbmcgaGVyZSBhcyBhIHNpbXBsZVxuICogICBzdGF0ZSBtYWNoaW5lKS5cbiAqXG4gKiBAVE9ETyBpbnNlcnQgZmlndXJlXG4gKlxuICogSXQgYWxzbyBjb250YWlucyBhIHJlZmVyZW5jZSB0byBhbGwgdGhlIHJlZ2lzdGVyIHRyYWNrIGFsbG93aW5nIHRvIGByZW5kZXJgXG4gKiBvciBgdXBkYXRlYCBhbGwgdGhlIGxheWVyIGZyb20gYSBzaW5nbGUgZW50cnkgcG9pbnQuXG4gKlxuICogIyMgRXhhbXBsZSBVc2FnZVxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCB2aXNpYmxlV2lkdGggPSA1MDA7IC8vIGRlZmF1bHQgd2lkdGggaW4gcGl4ZWxzIGZvciBhbGwgY3JlYXRlZCBgVHJhY2tgXG4gKiBjb25zdCBkdXJhdGlvbiA9IDEwOyAvLyB0aGUgdmlzaWJsZSBhcmVhIHJlcHJlc2VudHMgMTAgc2Vjb25kc1xuICogY29uc3QgcGl4ZWxzUGVyU2Vjb25kcyA9IHZpc2libGVXaWR0aCAvIGR1cmF0aW9uO1xuICogY29uc3QgdGltZWxpbmUgPSBuZXcgdWkuY29yZS5UaW1lbGluZShwaXhlbHNQZXJTZWNvbmQsIHdpZHRoKTtcbiAqIGBgYFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lbGluZSBleHRlbmRzIGV2ZW50cy5FdmVudEVtaXR0ZXIge1xuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtwaXhlbHNQZXJTZWNvbmQ9MTAwXSAtIHRoZSBkZWZhdWx0IHNjYWxpbmcgYmV0d2VlbiB0aW1lIGFuZCBwaXhlbHMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbdmlzaWJsZVdpZHRoPTEwMDBdIC0gdGhlIGRlZmF1bHQgdmlzaWJsZSBhcmVhIGZvciBhbGwgcmVnaXN0ZXJlZCB0cmFja3MuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwaXhlbHNQZXJTZWNvbmQgPSAxMDAsIHZpc2libGVXaWR0aCA9IDEwMDAsIHtcbiAgICByZWdpc3RlcktleWJvYXJkID0gdHJ1ZVxuICB9ID0ge30pIHtcblxuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLl90cmFja3MgPSBuZXcgVHJhY2tDb2xsZWN0aW9uKHRoaXMpO1xuICAgIHRoaXMuX3N0YXRlID0gbnVsbDtcblxuICAgIC8vIGRlZmF1bHQgaW50ZXJhY3Rpb25zXG4gICAgdGhpcy5fc3VyZmFjZUN0b3IgPSBTdXJmYWNlO1xuXG4gICAgaWYgKHJlZ2lzdGVyS2V5Ym9hcmQpIHtcbiAgICAgIHRoaXMuY3JlYXRlSW50ZXJhY3Rpb24oS2V5Ym9hcmQsIGRvY3VtZW50KTtcbiAgICB9XG5cbiAgICAvLyBzdG9yZXNcbiAgICB0aGlzLl90cmFja0J5SWQgPSB7fTtcbiAgICB0aGlzLl9ncm91cGVkTGF5ZXJzID0ge307XG5cbiAgICAvKiogQHR5cGUge1RpbWVsaW5lVGltZUNvbnRleHR9IC0gbWFzdGVyIHRpbWUgY29udGV4dCBmb3IgdGhlIHZpc3VhbGl6YXRpb24uICovXG4gICAgdGhpcy50aW1lQ29udGV4dCA9IG5ldyBUaW1lbGluZVRpbWVDb250ZXh0KHBpeGVsc1BlclNlY29uZCwgdmlzaWJsZVdpZHRoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGBUaW1lbGluZVRpbWVDb250ZXh0YCdzIGBvZmZzZXRgIHRpbWUgZG9tYWluIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfSBbb2Zmc2V0PTBdXG4gICAqL1xuICBnZXQgb2Zmc2V0KCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0Lm9mZnNldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIGBUaW1lbGluZVRpbWVDb250ZXh0YCdzIGBvZmZzZXRgIHRpbWUgZG9tYWluIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfSBbb2Zmc2V0PTBdXG4gICAqL1xuICBzZXQgb2Zmc2V0KHZhbHVlKSB7XG4gICAgdGhpcy50aW1lQ29udGV4dC5vZmZzZXQgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBgVGltZWxpbmVUaW1lQ29udGV4dGAncyBgem9vbWAgdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9IFtvZmZzZXQ9MF1cbiAgICovXG4gIGdldCB6b29tKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0Lnpvb207XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgYFRpbWVsaW5lVGltZUNvbnRleHRgJ3MgYHpvb21gIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfSBbb2Zmc2V0PTBdXG4gICAqL1xuICBzZXQgem9vbSh2YWx1ZSkge1xuICAgIHRoaXMudGltZUNvbnRleHQuem9vbSA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBUaW1lbGluZVRpbWVDb250ZXh0YCdzIGBwaXhlbHNQZXJTZWNvbmRgIHJhdGlvLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfSBbb2Zmc2V0PTBdXG4gICAqL1xuICBnZXQgcGl4ZWxzUGVyU2Vjb25kKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0LnBpeGVsc1BlclNlY29uZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBgVGltZWxpbmVUaW1lQ29udGV4dGAncyBgcGl4ZWxzUGVyU2Vjb25kYCByYXRpby5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn0gW29mZnNldD0wXVxuICAgKi9cbiAgc2V0IHBpeGVsc1BlclNlY29uZCh2YWx1ZSkge1xuICAgIHRoaXMudGltZUNvbnRleHQucGl4ZWxzUGVyU2Vjb25kID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYFRpbWVsaW5lVGltZUNvbnRleHRgJ3MgYHZpc2libGVXaWR0aGAgcGl4ZWwgZG9tYWluIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfSBbb2Zmc2V0PTBdXG4gICAqL1xuICBnZXQgdmlzaWJsZVdpZHRoKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0LnZpc2libGVXaWR0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBgVGltZWxpbmVUaW1lQ29udGV4dGAncyBgdmlzaWJsZVdpZHRoYCBwaXhlbCBkb21haW4gdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9IFtvZmZzZXQ9MF1cbiAgICovXG4gIHNldCB2aXNpYmxlV2lkdGgodmFsdWUpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0LnZpc2libGVXaWR0aCA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYFRpbWVsaW5lVGltZUNvbnRleHRgJ3MgYHRpbWVUb1BpeGVsYCB0cmFuc2ZlcnQgZnVuY3Rpb24uXG4gICAqXG4gICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICovXG4gIGdldCB0aW1lVG9QaXhlbCgpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC50aW1lVG9QaXhlbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGBUaW1lbGluZVRpbWVDb250ZXh0YCdzIGB2aXNpYmxlRHVyYXRpb25gIGhlbHBlciB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCB2aXNpYmxlRHVyYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQudmlzaWJsZUR1cmF0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGBUaW1lbGluZVRpbWVDb250ZXh0YCdzIGBtYWludGFpblZpc2libGVEdXJhdGlvbmAgdmFsdWUuXG4gICAqIERlZmluZXMgaWYgdGhlIGR1cmF0aW9uIG9mIHRoZSB2aXNpYmxlIGFyZWEgc2hvdWxkIGJlIG1haW50YWluIHdoZW5cbiAgICogdGhlIGB2aXNpYmxlV2lkdGhgIGF0dHJpYnV0ZSBpcyB1cGRhdGVkLlxuICAgKlxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG4gIHNldCBtYWludGFpblZpc2libGVEdXJhdGlvbihib29sKSB7XG4gICAgdGhpcy50aW1lQ29udGV4dC5tYWludGFpblZpc2libGVEdXJhdGlvbiA9IGJvb2w7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgVGltZWxpbmVUaW1lQ29udGV4dGAncyBgbWFpbnRhaW5WaXNpYmxlRHVyYXRpb25gIGN1cnJlbnQgdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cbiAgZ2V0IG1haW50YWluVmlzaWJsZUR1cmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0Lm1haW50YWluVmlzaWJsZUR1cmF0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIE9iamVjdCBtYWludGFpbmluZyBhcnJheXMgb2YgYExheWVyYCBpbnN0YW5jZXMgb3JkZXJlZCBieSB0aGVpciBgZ3JvdXBJZGAuXG4gICAqIElzIHVzZWQgaW50ZXJuYWxseSBieSB0aGUgYFRyYWNrQ29sbGVjdGlvbmAgaW5zdGFuY2UuXG4gICAqXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuICBnZXQgZ3JvdXBlZExheWVycygpIHtcbiAgICByZXR1cm4gdGhpcy5fZ3JvdXBlZExheWVycztcbiAgfVxuXG4gIC8qKlxuICAgKiBPdmVycmlkZXMgdGhlIGRlZmF1bHQgYFN1cmZhY2VgIHRoYXQgaXMgaW5zdGFuY2lhdGVkIG9uIGVhY2ggYFRyYWNrYFxuICAgKiBpbnN0YW5jZS4gVGhpcyBtZXRob3Mgc2hvdWxkIGJlIGNhbGxlZCBiZWZvcmUgYWRkaW5nIGFueSBgVHJhY2tgIGluc3RhbmNlXG4gICAqIHRvIHRoZSBjdXJyZW50IGB0aW1lbGluZWAuXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnRTb3VyY2V9IGN0b3IgLSBUaGUgY29uc3RydWN0b3IgdG8gdXNlIGluIG9yZGVyIHRvIGNhdGNoIG1vdXNlXG4gICAqICAgIGV2ZW50cyBvbiBlYWNoIGBUcmFja2AgaW5zdGFuY2VzLlxuICAgKi9cbiAgY29uZmlndXJlU3VyZmFjZShjdG9yKSB7XG4gICAgdGhpcy5fc3VyZmFjZUN0b3IgPSBjdG9yO1xuICB9XG5cbiAgLyoqXG4gICAqIEZhY3RvcnkgbWV0aG9kIHRvIGFkZCBpbnRlcmFjdGlvbiBtb2R1bGVzIHRoZSB0aW1lbGluZSBzaG91bGQgbGlzdGVuIHRvLlxuICAgKiBCeSBkZWZhdWx0LCB0aGUgdGltZWxpbmUgaW5zdGFuY2lhdGUgYSBnbG9iYWwgYEtleWJvYXJkYCBpbnN0YW5jZSBhbmQgYVxuICAgKiBgU3VyZmFjZWAgaW5zdGFuY2Ugb24gZWFjaCBjb250YWluZXIuXG4gICAqIFNob3VsZCBiZSB1c2VkIHRvIGluc3RhbGwgbmV3IGludGVyYWN0aW9ucyBpbXBsZW1lbnRpbmcgdGhlIGBFdmVudFNvdXJjZWAgaW50ZXJmYWNlLlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50U291cmNlfSBjdG9yIC0gVGhlIGNvbnRydWN0b3Igb2YgdGhlIGludGVyYWN0aW9uIG1vZHVsZSB0byBpbnN0YW5jaWF0ZS5cbiAgICogQHBhcmFtIHtFbGVtZW50fSAkZWwgLSBUaGUgRE9NIGVsZW1lbnQgd2hpY2ggd2lsbCBiZSBiaW5kZWQgdG8gdGhlIGBFdmVudFNvdXJjZWAgbW9kdWxlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIC0gT3B0aW9ucyB0byBiZSBhcHBsaWVkIHRvIHRoZSBgY3RvcmAuXG4gICAqL1xuICBjcmVhdGVJbnRlcmFjdGlvbihjdG9yLCAkZWwsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGludGVyYWN0aW9uID0gbmV3IGN0b3IoJGVsLCBvcHRpb25zKTtcbiAgICBpbnRlcmFjdGlvbi5vbignZXZlbnQnLCAoZSkgPT4gdGhpcy5faGFuZGxlRXZlbnQoZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBsaXN0IG9mIHRoZSBsYXllcnMgc2l0dWF0ZWQgdW5kZXIgdGhlIHBvc2l0aW9uIG9mIGEgYFdhdmVFdmVudGAuXG4gICAqXG4gICAqIEBwYXJhbSB7V2F2ZXNFdmVudH0gZSAtIEFuIGV2ZW50IHRyaWdnZXJlZCBieSBhIGBXYXZlRXZlbnRgXG4gICAqIEByZXR1cm4ge0FycmF5fSAtIE1hdGNoZWQgbGF5ZXJzXG4gICAqL1xuICBnZXRIaXRMYXllcnMoZSkge1xuICAgIGNvbnN0IGNsaWVudFggPSBlLm9yaWdpbmFsRXZlbnQuY2xpZW50WDtcbiAgICBjb25zdCBjbGllbnRZID0gZS5vcmlnaW5hbEV2ZW50LmNsaWVudFk7XG4gICAgbGV0IGxheWVycyA9IFtdO1xuXG4gICAgdGhpcy5sYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHtcbiAgICAgIGlmICghbGF5ZXIucGFyYW1zLmhpdHRhYmxlKSB7IHJldHVybjsgfVxuICAgICAgY29uc3QgYnIgPSBsYXllci4kZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgY2xpZW50WCA+IGJyLmxlZnQgJiYgY2xpZW50WCA8IGJyLnJpZ2h0ICYmXG4gICAgICAgIGNsaWVudFkgPiBici50b3AgJiYgY2xpZW50WSA8IGJyLmJvdHRvbVxuICAgICAgKSB7XG4gICAgICAgIGxheWVycy5wdXNoKGxheWVyKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBsYXllcnM7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGNhbGxiYWNrIHRoYXQgaXMgdXNlZCB0byBsaXN0ZW4gdG8gaW50ZXJhY3Rpb25zIG1vZHVsZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7V2F2ZUV2ZW50fSBlIC0gQW4gZXZlbnQgZ2VuZXJhdGVkIGJ5IGFuIGludGVyYWN0aW9uIG1vZHVsZXMgKGBFdmVudFNvdXJjZWApLlxuICAgKi9cbiAgX2hhbmRsZUV2ZW50KGUpIHtcbiAgICBjb25zdCBoaXRMYXllcnMgPSAoZS5zb3VyY2UgPT09ICdzdXJmYWNlJykgP1xuICAgICAgdGhpcy5nZXRIaXRMYXllcnMoZSkgOiBudWxsO1xuICAgIC8vIGVtaXQgZXZlbnQgYXMgYSBtaWRkbGV3YXJlXG4gICAgdGhpcy5lbWl0KCdldmVudCcsIGUsIGhpdExheWVycyk7XG4gICAgLy8gcHJvcGFnYXRlIHRvIHRoZSBzdGF0ZVxuICAgIGlmICghdGhpcy5fc3RhdGUpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5fc3RhdGUuaGFuZGxlRXZlbnQoZSwgaGl0TGF5ZXJzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBzdGF0ZSBvZiB0aGUgdGltZWxpbmUuXG4gICAqXG4gICAqIEB0eXBlIHtCYXNlU3RhdGV9XG4gICAqL1xuICBzZXQgc3RhdGUoc3RhdGUpIHtcbiAgICBpZiAodGhpcy5fc3RhdGUpIHsgdGhpcy5fc3RhdGUuZXhpdCgpOyB9XG4gICAgdGhpcy5fc3RhdGUgPSBzdGF0ZTtcbiAgICBpZiAodGhpcy5fc3RhdGUpIHsgdGhpcy5fc3RhdGUuZW50ZXIoKTsgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIHRpbWVsaW5lLlxuICAgKlxuICAgKiBAdHlwZSB7QmFzZVN0YXRlfVxuICAgKi9cbiAgZ2V0IHN0YXRlKCkge1xuICAgIHJldHVybiB0aGlzLl9zdGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBgVHJhY2tDb2xsZWN0aW9uYCBpbnN0YW5jZS5cbiAgICpcbiAgICogQHR5cGUge1RyYWNrQ29sbGVjdGlvbn1cbiAgICovXG4gIGdldCB0cmFja3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RyYWNrcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBsaXN0IG9mIGFsbCByZWdpc3RlcmVkIGxheWVycy5cbiAgICpcbiAgICogQHR5cGUge0FycmF5fVxuICAgKi9cbiAgZ2V0IGxheWVycygpIHtcbiAgICByZXR1cm4gdGhpcy5fdHJhY2tzLmxheWVycztcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgbmV3IHRyYWNrIHRvIHRoZSB0aW1lbGluZS5cbiAgICpcbiAgICogQHBhcmFtIHtUcmFja30gdHJhY2sgLSBUaGUgbmV3IHRyYWNrIHRvIGJlIHJlZ2lzdGVyZWQgaW4gdGhlIHRpbWVsaW5lLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW3RyYWNrSWQ9bnVsbF0gLSBPcHRpb25uYWwgdW5pcXVlIGlkIHRvIGFzc29jaWF0ZSB3aXRoXG4gICAqICAgIHRoZSB0cmFjaywgdGhpcyBpZCBvbmx5IGV4aXN0cyBpbiB0aW1lbGluZSdzIGNvbnRleHQgYW5kIHNob3VsZCBiZSB1c2VkXG4gICAqICAgIGluIGNvbmpvbmN0aW9uIHdpdGggYGFkZExheWVyYCBtZXRob2QuXG4gICAqL1xuICBhZGQodHJhY2ssIHRyYWNrSWQgPSBudWxsKSB7XG4gICAgaWYgKHRoaXMudHJhY2tzLmluZGV4T2YodHJhY2spICE9PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCd0cmFjayBhbHJlYWR5IGFkZGVkIHRvIHRoZSB0aW1lbGluZScpO1xuICAgIH1cblxuICAgIHRoaXMuX3JlZ2lzdGVyVHJhY2tJZCh0cmFjaywgdHJhY2tJZCk7XG4gICAgdHJhY2suY29uZmlndXJlKHRoaXMudGltZUNvbnRleHQpO1xuXG4gICAgdGhpcy50cmFja3MucHVzaCh0cmFjayk7XG4gICAgdGhpcy5jcmVhdGVJbnRlcmFjdGlvbih0aGlzLl9zdXJmYWNlQ3RvciwgdHJhY2suJGVsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgdHJhY2sgZnJvbSB0aGUgdGltZWxpbmUuXG4gICAqXG4gICAqIEBwYXJhbSB7VHJhY2t9IHRyYWNrIC0gdGhlIHRyYWNrIHRvIHJlbW92ZSBmcm9tIHRoZSB0aW1lbGluZS5cbiAgICogQHRvZG8gbm90IGltcGxlbWVudGVkLlxuICAgKi9cbiAgcmVtb3ZlKHRyYWNrKSB7XG4gICAgLy8gc2hvdWxkIGRlc3Ryb3kgaW50ZXJhY3Rpb24gdG9vLCBhdm9pZCBnaG9zdCBldmVudExpc3RlbmVyc1xuICB9XG5cbiAgLyoqXG4gICAqIEhlbHBlciB0byBjcmVhdGUgYSBuZXcgYFRyYWNrYCBpbnN0YW5jZS4gVGhlIGB0cmFja2AgaXMgYWRkZWQsXG4gICAqIHJlbmRlcmVkIGFuZCB1cGRhdGVkIGJlZm9yZSBiZWluZyByZXR1cm5lZC5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fSAkZWwgLSBUaGUgRE9NIGVsZW1lbnQgd2hlcmUgdGhlIHRyYWNrIHNob3VsZCBiZSBpbnNlcnRlZC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHRyYWNrSGVpZ2h0IC0gVGhlIGhlaWdodCBvZiB0aGUgbmV3bHkgY3JlYXRlZCB0cmFjay5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFt0cmFja0lkPW51bGxdIC0gT3B0aW9ubmFsIHVuaXF1ZSBpZCB0byBhc3NvY2lhdGUgd2l0aFxuICAgKiAgICB0aGUgdHJhY2ssIHRoaXMgaWQgb25seSBleGlzdHMgaW4gdGltZWxpbmUncyBjb250ZXh0IGFuZCBzaG91bGQgYmUgdXNlZCBpblxuICAgKiAgICBjb25qb25jdGlvbiB3aXRoIGBhZGRMYXllcmAgbWV0aG9kLlxuICAgKiBAcmV0dXJuIHtUcmFja31cbiAgICovXG4gIGNyZWF0ZVRyYWNrKCRlbCwgdHJhY2tIZWlnaHQgPSAxMDAsIHRyYWNrSWQgPSBudWxsKSB7XG4gICAgY29uc3QgdHJhY2sgPSBuZXcgVHJhY2soJGVsLCB0cmFja0hlaWdodCk7XG4gICAgLy8gQWRkIHRyYWNrIHRvIHRoZSB0aW1lbGluZVxuICAgIHRoaXMuYWRkKHRyYWNrLCB0cmFja0lkKTtcbiAgICB0cmFjay5yZW5kZXIoKTtcbiAgICB0cmFjay51cGRhdGUoKTtcblxuICAgIHJldHVybiB0cmFjaztcbiAgfVxuXG4gIC8qKlxuICAgKiBJZiB0cmFjayBpZCBpcyBkZWZpbmVkLCBhc3NvY2lhdGUgYSB0cmFjayB3aXRoIGEgdW5pcXVlIGlkLlxuICAgKi9cbiAgX3JlZ2lzdGVyVHJhY2tJZCh0cmFjaywgdHJhY2tJZCkge1xuICAgIGlmICh0cmFja0lkICE9PSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5fdHJhY2tCeUlkW3RyYWNrSWRdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGB0cmFja0lkOiBcIiR7dHJhY2tJZH1cIiBpcyBhbHJlYWR5IHVzZWRgKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fdHJhY2tCeUlkW3RyYWNrSWRdID0gdHJhY2s7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEhlbHBlciB0byBhZGQgYSBgTGF5ZXJgIGluc3RhbmNlIGludG8gYSBnaXZlbiBgVHJhY2tgLiBJcyBkZXNpZ25lZCB0byBiZVxuICAgKiB1c2VkIGluIGNvbmpvbmN0aW9uIHdpdGggdGhlIGBUaW1lbGluZX5nZXRMYXllcnNCeUdyb3VwYCBtZXRob2QuIFRoZVxuICAgKiBsYXllciBpcyBpbnRlcm5hbGx5IHJlbmRlcmVkIGFuZCB1cGRhdGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge0xheWVyfSBsYXllciAtIFRoZSBgTGF5ZXJgIGluc3RhbmNlIHRvIGFkZCBpbnRvIHRoZSB2aXN1YWxpemF0aW9uLlxuICAgKiBAcGFyYW0geyhUcmFja3xTdHJpbmcpfSB0cmFja09yVHJhY2tJZCAtIFRoZSBgVHJhY2tgIGluc3RhbmNlIChvciBpdHMgYGlkYFxuICAgKiAgICBhcyBkZWZpbmVkIGluIHRoZSBgY3JlYXRlVHJhY2tgIG1ldGhvZCkgd2hlcmUgdGhlIGBMYXllcmAgaW5zdGFuY2Ugc2hvdWxkIGJlIGluc2VydGVkLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW2dyb3VwSWQ9J2RlZmF1bHQnXSAtIEFuIG9wdGlvbm5hbCBncm91cCBpZCBpbiB3aGljaCB0aGVcbiAgICogICAgYExheWVyYCBzaG91bGQgYmUgaW5zZXJ0ZWQuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2lzQXhpc10gLSBTZXQgdG8gYHRydWVgIGlmIHRoZSBhZGRlZCBgbGF5ZXJgIGlzIGFuXG4gICAqICAgIGluc3RhbmNlIG9mIGBBeGlzTGF5ZXJgICh0aGVzZSBsYXllcnMgc2hhcmVzIHRoZSBgVGltbGluZVRpbWVDb250ZXh0YCBpbnN0YW5jZVxuICAgKiAgICBvZiB0aGUgdGltZWxpbmUpLlxuICAgKi9cbiAgYWRkTGF5ZXIobGF5ZXIsIHRyYWNrT3JUcmFja0lkLCBncm91cElkID0gJ2RlZmF1bHQnLCBpc0F4aXMgPSBmYWxzZSkge1xuICAgIGxldCB0cmFjayA9IHRyYWNrT3JUcmFja0lkO1xuXG4gICAgaWYgKHR5cGVvZiB0cmFja09yVHJhY2tJZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRyYWNrID0gdGhpcy5nZXRUcmFja0J5SWQodHJhY2tPclRyYWNrSWQpO1xuICAgIH1cblxuICAgIC8vIGNyZWF0ZXMgdGhlIGBMYXllclRpbWVDb250ZXh0YCBpZiBub3QgcHJlc2VudFxuICAgIGlmICghbGF5ZXIudGltZUNvbnRleHQpIHtcbiAgICAgIGNvbnN0IHRpbWVDb250ZXh0ID0gaXNBeGlzID9cbiAgICAgICAgdGhpcy50aW1lQ29udGV4dCA6IG5ldyBMYXllclRpbWVDb250ZXh0KHRoaXMudGltZUNvbnRleHQpO1xuXG4gICAgICBsYXllci5zZXRUaW1lQ29udGV4dCh0aW1lQ29udGV4dCk7XG4gICAgfVxuXG4gICAgLy8gd2Ugc2hvdWxkIGhhdmUgYSBUcmFjayBpbnN0YW5jZSBhdCB0aGlzIHBvaW50XG4gICAgdHJhY2suYWRkKGxheWVyKTtcblxuICAgIGlmICghdGhpcy5fZ3JvdXBlZExheWVyc1tncm91cElkXSkge1xuICAgICAgdGhpcy5fZ3JvdXBlZExheWVyc1tncm91cElkXSA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMuX2dyb3VwZWRMYXllcnNbZ3JvdXBJZF0ucHVzaChsYXllcik7XG5cbiAgICBsYXllci5yZW5kZXIoKTtcbiAgICBsYXllci51cGRhdGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgbGF5ZXIgZnJvbSBpdHMgdHJhY2suIFRoZSBsYXllciBpcyBkZXRhdGNoZWQgZnJvbSB0aGUgRE9NIGJ1dFxuICAgKiBjYW4gc3RpbGwgYmUgcmV1c2VkIGxhdGVyLlxuICAgKlxuICAgKiBAcGFyYW0ge0xheWVyfSBsYXllciAtIFRoZSBsYXllciB0byByZW1vdmUuXG4gICAqL1xuICByZW1vdmVMYXllcihsYXllcikge1xuICAgIHRoaXMudHJhY2tzLmZvckVhY2goZnVuY3Rpb24odHJhY2spIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gdHJhY2subGF5ZXJzLmluZGV4T2YobGF5ZXIpO1xuICAgICAgaWYgKGluZGV4ICE9PSAtMSkgeyB0cmFjay5yZW1vdmUobGF5ZXIpOyB9XG4gICAgfSk7XG5cbiAgICAvLyBjbGVhbiByZWZlcmVuY2VzIGluIGhlbHBlcnNcbiAgICBmb3IgKGxldCBncm91cElkIGluIHRoaXMuX2dyb3VwZWRMYXllcnMpIHtcbiAgICAgIGNvbnN0IGdyb3VwID0gdGhpcy5fZ3JvdXBlZExheWVyc1tncm91cElkXTtcbiAgICAgIGNvbnN0IGluZGV4ID0gZ3JvdXAuaW5kZXhPZihsYXllcik7XG5cbiAgICAgIGlmIChpbmRleCAhPT0gLTEpIHsgZ3JvdXAuc3BsaWNlKGxheWVyLCAxKTsgfVxuXG4gICAgICBpZiAoIWdyb3VwLmxlbmd0aCkge1xuICAgICAgICBkZWxldGUgdGhpcy5fZ3JvdXBlZExheWVyc1tncm91cElkXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGBUcmFja2AgaW5zdGFuY2UgZnJvbSBpdCdzIGdpdmVuIGlkLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gdHJhY2tJZFxuICAgKiBAcmV0dXJuIHtUcmFja31cbiAgICovXG4gIGdldFRyYWNrQnlJZCh0cmFja0lkKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RyYWNrQnlJZFt0cmFja0lkXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0cmFjayBjb250YWluaW5nIGEgZ2l2ZW4gRE9NIEVsZW1lbnQsIHJldHVybnMgbnVsbCBpZiBubyBtYXRjaCBmb3VuZC5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fSAkZWwgLSBUaGUgRE9NIEVsZW1lbnQgdG8gYmUgdGVzdGVkLlxuICAgKiBAcmV0dXJuIHtUcmFja31cbiAgICovXG4gIGdldFRyYWNrRnJvbURPTUVsZW1lbnQoJGVsKSB7XG4gICAgbGV0ICRzdmcgPSBudWxsO1xuICAgIGxldCB0cmFjayA9IG51bGw7XG4gICAgLy8gZmluZCB0aGUgY2xvc2VzdCBgLnRyYWNrYCBlbGVtZW50XG4gICAgZG8ge1xuICAgICAgaWYgKCRlbC5jbGFzc0xpc3QuY29udGFpbnMoJ3RyYWNrJykpIHtcbiAgICAgICAgJHN2ZyA9ICRlbDtcbiAgICAgIH1cbiAgICAgICRlbCA9ICRlbC5wYXJlbnROb2RlO1xuICAgIH0gd2hpbGUgKCRzdmcgPT09IG51bGwpO1xuICAgIC8vIGZpbmQgdGhlIHJlbGF0ZWQgYFRyYWNrYFxuICAgIHRoaXMudHJhY2tzLmZvckVhY2goZnVuY3Rpb24oX3RyYWNrKSB7XG4gICAgICBpZiAoX3RyYWNrLiRzdmcgPT09ICRzdmcpIHsgdHJhY2sgPSBfdHJhY2s7IH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0cmFjaztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIGxheWVycyBmcm9tIHRoZWlyIGdpdmVuIGdyb3VwIGlkLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZ3JvdXBJZCAtIFRoZSBpZCBvZiB0aGUgZ3JvdXAgYXMgZGVmaW5lZCBpbiBgYWRkTGF5ZXJgLlxuICAgKiBAcmV0dXJuIHsoQXJyYXl8dW5kZWZpbmVkKX1cbiAgICovXG4gIGdldExheWVyc0J5R3JvdXAoZ3JvdXBJZCkge1xuICAgIHJldHVybiB0aGlzLl9ncm91cGVkTGF5ZXJzW2dyb3VwSWRdO1xuICB9XG5cbiAgLyoqXG4gICAqIEl0ZXJhdGVzIHRocm91Z2ggdGhlIGFkZGVkIHRyYWNrcy5cbiAgICovXG4gICpbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICB5aWVsZCogdGhpcy50cmFja3NbU3ltYm9sLml0ZXJhdG9yXSgpO1xuICB9XG59XG4iLCJpbXBvcnQgTGF5ZXIgZnJvbSAnLi9sYXllcic7XG5cblxuLyoqXG4gKiBDb2xsZWN0aW9uIGhvc3RpbmcgYWxsIHRoZSBgVHJhY2tgIGluc3RhbmNlcyByZWdpc3RlcmVkIGludG8gdGhlIHRpbWVsaW5lLlxuICogSXQgcHJvdmlkZXMgc2hvcmN1dHMgdG8gdHJpZ2dlciBgcmVuZGVyYCAvIGB1cGRhdGVgIG1ldGhvZHMgb24gdHJhY2tzIG9yXG4gKiBsYXllcnMuIEV4dGVuZCBidWlsdC1pbiBBcnJheVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmFja0NvbGxlY3Rpb24gZXh0ZW5kcyBBcnJheSB7XG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuX3RpbWVsaW5lID0gdGltZWxpbmU7XG4gIH1cblxuICAvLyBAbm90ZSAtIHNob3VsZCBiZSBpbiB0aGUgdGltZWxpbmUgP1xuICAvLyBAdG9kbyAtIGFsbG93IHRvIHBhc3MgYW4gYXJyYXkgb2YgbGF5ZXJzXG4gIF9nZXRMYXllcnNPckdyb3VwcyhsYXllck9yR3JvdXAgPSBudWxsKSB7XG4gICAgbGV0IGxheWVycyA9IG51bGw7XG5cbiAgICBpZiAodHlwZW9mIGxheWVyT3JHcm91cCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGxheWVycyA9IHRoaXMuX3RpbWVsaW5lLmdyb3VwZWRMYXllcnNbbGF5ZXJPckdyb3VwXTtcbiAgICB9IGVsc2UgaWYgKGxheWVyT3JHcm91cCBpbnN0YW5jZW9mIExheWVyKSB7XG4gICAgICBsYXllcnMgPSBbbGF5ZXJPckdyb3VwXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGF5ZXJzID0gdGhpcy5sYXllcnM7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxheWVycztcbiAgfVxuXG4gIC8vIEBOT1RFIGtlZXAgdGhpcyA/XG4gIC8vIGNvdWxkIHByZXBhcmUgc29tZSB2ZXJ0aWNhbCByZXNpemluZyBhYmlsaXR5XG4gIC8vIHRoaXMgc2hvdWxkIGJlIGFibGUgdG8gbW9kaWZ5IHRoZSBsYXllcnMgeVNjYWxlIHRvIGJlIHJlYWxseSB1c2VmdWxsXG5cbiAgLyoqXG4gICAqIEB0eXBlIHtOdW1iZXJ9IC0gVXBkYXRlcyB0aGUgaGVpZ2h0IG9mIGFsbCB0cmFja3MgYXQgb25jZS5cbiAgICogQHRvZG8gLSBQcm9wYWdhdGUgdG8gbGF5ZXJzLCBub3QgdXNlZnVsbCBmb3Igbm93LlxuICAgKi9cbiAgc2V0IGhlaWdodCh2YWx1ZSkge1xuICAgIHRoaXMuZm9yRWFjaCgodHJhY2spID0+IHRyYWNrLmhlaWdodCA9IHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBhcnJheSBvZiBhbGwgcmVnaXN0ZXJlZCBsYXllcnMuXG4gICAqXG4gICAqIEB0eXBlIHtBcnJheTxMYXllcj59XG4gICAqL1xuICBnZXQgbGF5ZXJzKCkge1xuICAgIGxldCBsYXllcnMgPSBbXTtcbiAgICB0aGlzLmZvckVhY2goKHRyYWNrKSA9PiBsYXllcnMgPSBsYXllcnMuY29uY2F0KHRyYWNrLmxheWVycykpO1xuXG4gICAgcmV0dXJuIGxheWVycztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgYWxsIHRyYWNrcyBhbmQgbGF5ZXJzLiBXaGVuIGRvbmUsIHRoZSB0aW1lbGluZSB0cmlnZ2VycyBhIGByZW5kZXJgIGV2ZW50LlxuICAgKi9cbiAgcmVuZGVyKCkge1xuICAgIHRoaXMuZm9yRWFjaCgodHJhY2spID0+IHRyYWNrLnJlbmRlcigpKTtcbiAgICB0aGlzLl90aW1lbGluZS5lbWl0KCdyZW5kZXInKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIGFsbCB0cmFja3MgYW5kIGxheWVycy4gV2hlbiBkb25lLCB0aGUgdGltZWxpbmUgdHJpZ2dlcnMgYVxuICAgKiBgdXBkYXRlYCBldmVudC5cbiAgICpcbiAgICogQHBhcmFtIHtMYXllcnxTdHJpbmd9IGxheWVyT3JHcm91cCAtIEZpbHRlciB0aGUgbGF5ZXJzIHRvIHVwZGF0ZSBieVxuICAgKiAgICBwYXNzaW5nIHRoZSBgTGF5ZXJgIGluc3RhbmNlIHRvIHVwZGF0ZSBvciBhIGBncm91cElkYFxuICAgKi9cbiAgdXBkYXRlKGxheWVyT3JHcm91cCkge1xuICAgIGNvbnN0IGxheWVycyA9IHRoaXMuX2dldExheWVyc09yR3JvdXBzKGxheWVyT3JHcm91cCk7XG4gICAgdGhpcy5mb3JFYWNoKCh0cmFjaykgPT4gdHJhY2sudXBkYXRlKGxheWVycykpO1xuICAgIHRoaXMuX3RpbWVsaW5lLmVtaXQoJ3VwZGF0ZScsIGxheWVycyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyBhbGwgYFRyYWNrYCBjb250YWluZXJzLCBsYXllcnMgYXJlIG5vdCB1cGRhdGVkIHdpdGggdGhpcyBtZXRob2QuXG4gICAqIFdoZW4gZG9uZSwgdGhlIHRpbWVsaW5lIHRyaWdnZXJzIGEgYHVwZGF0ZTpjb250YWluZXJzYCBldmVudC5cbiAgICovXG4gIHVwZGF0ZUNvbnRhaW5lcigvKiB0cmFja09yVHJhY2tJZHMgKi8pIHtcbiAgICB0aGlzLmZvckVhY2goKHRyYWNrKSA9PiB0cmFjay51cGRhdGVDb250YWluZXIoKSk7XG4gICAgdGhpcy5fdGltZWxpbmUuZW1pdCgndXBkYXRlOmNvbnRhaW5lcnMnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIGFsbCBsYXllcnMuIFdoZW4gZG9uZSwgdGhlIHRpbWVsaW5lIHRyaWdnZXJzIGEgYHVwZGF0ZTpsYXllcnNgIGV2ZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge0xheWVyfFN0cmluZ30gbGF5ZXJPckdyb3VwIC0gRmlsdGVyIHRoZSBsYXllcnMgdG8gdXBkYXRlIGJ5XG4gICAqICAgIHBhc3NpbmcgdGhlIGBMYXllcmAgaW5zdGFuY2UgdG8gdXBkYXRlIG9yIGEgYGdyb3VwSWRgXG4gICAqL1xuICB1cGRhdGVMYXllcnMobGF5ZXJPckdyb3VwKSB7XG4gICAgY29uc3QgbGF5ZXJzID0gdGhpcy5fZ2V0TGF5ZXJzT3JHcm91cHMobGF5ZXJPckdyb3VwKTtcbiAgICB0aGlzLmZvckVhY2goKHRyYWNrKSA9PiB0cmFjay51cGRhdGVMYXllcnMobGF5ZXJzKSk7XG4gICAgdGhpcy5fdGltZWxpbmUuZW1pdCgndXBkYXRlOmxheWVycycsIGxheWVycyk7XG4gIH1cbn1cbiIsImltcG9ydCBucyBmcm9tICcuL25hbWVzcGFjZSc7XG5cblxuLyoqXG4gKiBBY3RzIGFzIGEgcGxhY2Vob2xkZXIgdG8gb3JnYW5pemUgdGhlIHZlcnRpY2FsIGxheW91dCBvZiB0aGUgdmlzdWFsaXphdGlvblxuICogYW5kIHRoZSBob3Jpem9udGFsIGFsaWduZW1lbnQgdG8gYW4gYWJzY2lzc2EgdGhhdCBjb3JyZXNwb25kIHRvIGEgY29tbW9uXG4gKiB0aW1lIHJlZmVyZW5jZS4gSXQgYmFzaWNhbGx5IG9mZmVyIGEgdmlldyBvbiB0aGUgb3ZlcmFsbCB0aW1lbGluZS5cbiAqXG4gKiBUcmFja3MgYXJlIGluc2VydGVkIGludG8gYSBnaXZlbiBET00gZWxlbWVudCwgYWxsb3dpbmcgdG8gY3JlYXRlIERBVyBsaWtlXG4gKiByZXByZXNlbnRhdGlvbnMuIEVhY2ggYFRyYWNrYCBpbnN0YW5jZSBjYW4gaG9zdCBtdWx0aXBsZSBgTGF5ZXJgIGluc3RhbmNlcy5cbiAqIEEgdHJhY2sgbXVzdCBiZSBhZGRlZCB0byBhIHRpbWVsaW5lIGJlZm9yZSBiZWluZyB1cGRhdGVkLlxuICpcbiAqICMjIyBBIHRpbWVsaW5lIHdpdGggMyB0cmFja3M6XG4gKlxuICogYGBgXG4gKiAwICAgICAgICAgICAgICAgICA2ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDE2XG4gKiArLSAtIC0gLSAtIC0gLSAtIC0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSstIC0gLSAtIC0gLSAtXG4gKiB8ICAgICAgICAgICAgICAgICB8eCB0cmFjayAxIHh4eHh4eHh4eHh4eHh4eHh4eHh4eHxcbiAqICstIC0gLSAtIC0gLSAtIC0gLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKy0gLSAtIC0gLSAtIC1cbiAqIHwgICAgICAgICAgICAgICAgIHx4IHRyYWNrIDIgeHh4eHh4eHh4eHh4eHh4eHh4eHh4fFxuICogKy0gLSAtIC0gLSAtIC0gLSAtKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rLSAtIC0gLSAtIC0gLVxuICogfCAgICAgICAgICAgICAgICAgfHggdHJhY2sgMyB4eHh4eHh4eHh4eHh4eHh4eHh4eHh8XG4gKiArLSAtIC0gLSAtIC0gLSAtIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSstIC0gLSAtIC0gLSAtXG4gKiArLS0tLS0tLS0tLS0tLS0tLS0+XG4gKiB0aW1lbGluZS50aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aW1lbGluZS50aW1lQ29udGV4dC5vZmZzZXQpXG4gKlxuICogICAgICAgICAgICAgICAgICAgPC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0+XG4gKiAgICAgICAgICAgICAgICAgICB0aW1lbGluZSdzIHRyYWNrcyBkZWZhdWx0cyB0byAxMDAwcHhcbiAqICAgICAgICAgICAgICAgICAgIHdpdGggYSBkZWZhdWx0IHBpeGVsc1BlclNlY29uZCBvZiAxMDBweC9zLlxuICogICAgICAgICAgICAgICAgICAgYW5kIGEgZGVmYXVsdCBgc3RyZXRjaFJhdGlvID0gMWBcbiAqICAgICAgICAgICAgICAgICAgIHRyYWNrMSBzaG93cyAxMCBzZWNvbmRzIG9mIHRoZSB0aW1lbGluZVxuICogYGBgXG4gKlxuICogIyMjIFRyYWNrIERPTSBzdHJ1Y3R1cmVcbiAqXG4gKiBgYGBodG1sXG4gKiA8c3ZnIHdpZHRoPVwiJHt2aXNpYmxlV2lkdGh9XCI+XG4gKiAgIDwhLS0gYmFja2dyb3VuZCAtLT5cbiAqICAgPHJlY3Q+PHJlY3Q+XG4gKiAgIDwhLS0gbWFpbiB2aWV3IC0tPlxuICogICA8ZyBjbGFzcz1cIm9mZnNldFwiIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSgke29mZnNldH0sIDApXCI+XG4gKiAgICAgPGcgY2xhc3M9XCJsYXlvdXRcIj5cbiAqICAgICAgIDwhLS0gbGF5ZXJzIC0tPlxuICogICAgIDwvZz5cbiAqICAgPC9nPlxuICogICA8ZyBjbGFzcz1cImludGVyYWN0aW9uc1wiPjwhLS0gZm9yIGZlZWRiYWNrIC0tPjwvZz5cbiAqIDwvc3ZnPlxuICogYGBgXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyYWNrIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7RE9NRWxlbWVudH0gJGVsXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbaGVpZ2h0ID0gMTAwXVxuICAgKi9cbiAgY29uc3RydWN0b3IoJGVsLCBoZWlnaHQgPSAxMDApIHtcbiAgICB0aGlzLl9oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgRE9NIGVsZW1lbnQgaW4gd2hpY2ggdGhlIHRyYWNrIGlzIGNyZWF0ZWQuXG4gICAgICogQHR5cGUge0VsZW1lbnR9XG4gICAgICovXG4gICAgdGhpcy4kZWwgPSAkZWw7XG4gICAgLyoqXG4gICAgICogQSBwbGFjZWhvbGRlciB0byBhZGQgc2hhcGVzIGZvciBpbnRlcmFjdGlvbnMgZmVlZGJhY2suXG4gICAgICogQHR5cGUge0VsZW1lbnR9XG4gICAgICovXG4gICAgdGhpcy4kaW50ZXJhY3Rpb25zID0gbnVsbDtcbiAgICAvKiogQHR5cGUge0VsZW1lbnR9ICovXG4gICAgdGhpcy4kbGF5b3V0ID0gbnVsbDtcbiAgICAvKiogQHR5cGUge0VsZW1lbnR9ICovXG4gICAgdGhpcy4kb2Zmc2V0ID0gbnVsbDtcbiAgICAvKiogQHR5cGUge0VsZW1lbnR9ICovXG4gICAgdGhpcy4kc3ZnID0gbnVsbDtcbiAgICAvKiogQHR5cGUge0VsZW1lbnR9ICovXG4gICAgdGhpcy4kYmFja2dyb3VuZCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBBbiBhcnJheSBvZiBhbGwgdGhlIGxheWVycyBiZWxvbmdpbmcgdG8gdGhlIHRyYWNrLlxuICAgICAqIEB0eXBlIHtBcnJheTxMYXllcj59XG4gICAgICovXG4gICAgdGhpcy5sYXllcnMgPSBbXTtcbiAgICAvKipcbiAgICAgKiBUaGUgY29udGV4dCB1c2VkIHRvIG1haW50YWluIHRoZSBET00gc3RydWN0dXJlIG9mIHRoZSB0cmFjay5cbiAgICAgKiBAdHlwZSB7VGltZWxpbmVUaW1lQ29udGV4dH1cbiAgICAgKi9cbiAgICB0aGlzLnJlbmRlcmluZ0NvbnRleHQgPSBudWxsO1xuXG4gICAgdGhpcy5fY3JlYXRlQ29udGFpbmVyKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaGVpZ2h0IG9mIHRoZSB0cmFjay5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBoZWlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlaWdodDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBoZWlnaHQgb2YgdGhlIHRyYWNrLlxuICAgKlxuICAgKiBAdG9kbyBwcm9wYWdhdGUgdG8gbGF5ZXJzLCBrZWVwaW5nIHJhdGlvPyBjb3VsZCBiZSBoYW5keSBmb3IgdmVydGljYWxcbiAgICogICAgcmVzaXplLiBUaGlzIGlzIHdoeSBhIHNldC9nZXQgaXMgaW1wbGVtZW50ZWQgaGVyZS5cbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHNldCBoZWlnaHQodmFsdWUpIHtcbiAgICB0aGlzLl9oZWlnaHQgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgd2hlbiB0aGUgdHJhY2sgaXMgYWRkZWQgdG8gdGhlIHRpbWVsaW5lLiBUaGVcbiAgICogdHJhY2sgY2Fubm90IGJlIHVwZGF0ZWQgd2l0aG91dCBiZWluZyBhZGRlZCB0byBhIHRpbWVsaW5lLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge1RpbWVsaW5lVGltZUNvbnRleHR9IHJlbmRlcmluZ0NvbnRleHRcbiAgICovXG4gIGNvbmZpZ3VyZShyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgdGhpcy5yZW5kZXJpbmdDb250ZXh0ID0gcmVuZGVyaW5nQ29udGV4dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95IHRoZSB0cmFjay4gVGhlIGxheWVycyBmcm9tIHRoaXMgdHJhY2sgY2FuIHN0aWxsIGJlIHJldXNlZCBlbHNld2hlcmUuXG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIC8vIERldGFjaCBldmVyeXRoaW5nIGZyb20gdGhlIERPTVxuICAgIHRoaXMuJGVsLnJlbW92ZUNoaWxkKHRoaXMuJHN2Zyk7XG4gICAgdGhpcy5sYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHRoaXMuJGxheW91dC5yZW1vdmVDaGlsZChsYXllci4kZWwpKTtcbiAgICAvLyBjbGVhbiByZWZlcmVuY2VzXG4gICAgdGhpcy4kZWwgPSBudWxsO1xuICAgIHRoaXMucmVuZGVyaW5nQ29udGV4dCA9IG51bGw7XG4gICAgdGhpcy5sYXllcnMubGVuZ3RoID0gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIHRoZSBET00gc3RydWN0dXJlIG9mIHRoZSB0cmFjay5cbiAgICovXG4gIF9jcmVhdGVDb250YWluZXIoKSB7XG4gICAgY29uc3QgJHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3N2ZycpO1xuICAgICRzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdvcHRpbWl6ZVNwZWVkJyk7XG4gICAgJHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgdGhpcy5oZWlnaHQpO1xuICAgICRzdmcuc2V0QXR0cmlidXRlKCd4bWxuczp4aHRtbCcsICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJyk7XG4gICAgJHN2Zy5jbGFzc0xpc3QuYWRkKCd0cmFjaycpO1xuXG4gICAgY29uc3QgJGJhY2tncm91bmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdyZWN0Jyk7XG4gICAgJGJhY2tncm91bmQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsICcxMDAlJyk7XG4gICAgJGJhY2tncm91bmQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgJzEwMCUnKTtcbiAgICAkYmFja2dyb3VuZC5zdHlsZS5maWxsT3BhY2l0eSA9IDA7XG4gICAgLy8gJGJhY2tncm91bmQuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcblxuICAgIGNvbnN0ICRkZWZzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZGVmcycpO1xuXG4gICAgY29uc3QgJG9mZnNldEdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgICRvZmZzZXRHcm91cC5jbGFzc0xpc3QuYWRkKCdvZmZzZXQnKTtcblxuICAgIGNvbnN0ICRsYXlvdXRHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICAkbGF5b3V0R3JvdXAuY2xhc3NMaXN0LmFkZCgnbGF5b3V0Jyk7XG5cbiAgICBjb25zdCAkaW50ZXJhY3Rpb25zR3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgJGludGVyYWN0aW9uc0dyb3VwLmNsYXNzTGlzdC5hZGQoJ2ludGVyYWN0aW9ucycpO1xuXG4gICAgJG9mZnNldEdyb3VwLmFwcGVuZENoaWxkKCRsYXlvdXRHcm91cCk7XG4gICAgJHN2Zy5hcHBlbmRDaGlsZCgkZGVmcyk7XG4gICAgJHN2Zy5hcHBlbmRDaGlsZCgkYmFja2dyb3VuZCk7XG4gICAgJHN2Zy5hcHBlbmRDaGlsZCgkb2Zmc2V0R3JvdXApO1xuICAgICRzdmcuYXBwZW5kQ2hpbGQoJGludGVyYWN0aW9uc0dyb3VwKTtcbiAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCgkc3ZnKTtcbiAgICAvLyByZW1vdmVzIGFkZGl0aW9ubmFsIGhlaWdodCBhZGRlZCB3aG8ga25vd3Mgd2h5Li4uXG4gICAgdGhpcy4kZWwuc3R5bGUuZm9udFNpemUgPSAwO1xuICAgIC8vIGZpeGVzIG9uZSBvZiB0aGUgKG1hbnkgPykgd2VpcmQgY2FudmFzIHJlbmRlcmluZyBidWdzIGluIENocm9tZVxuICAgIHRoaXMuJGVsLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVaKDApJztcblxuICAgIHRoaXMuJGxheW91dCA9ICRsYXlvdXRHcm91cDtcbiAgICB0aGlzLiRvZmZzZXQgPSAkb2Zmc2V0R3JvdXA7XG4gICAgdGhpcy4kaW50ZXJhY3Rpb25zID0gJGludGVyYWN0aW9uc0dyb3VwO1xuICAgIHRoaXMuJHN2ZyA9ICRzdmc7XG4gICAgdGhpcy4kYmFja2dyb3VuZCA9ICRiYWNrZ3JvdW5kO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBsYXllciB0byB0aGUgdHJhY2suXG4gICAqXG4gICAqIEBwYXJhbSB7TGF5ZXJ9IGxheWVyIC0gdGhlIGxheWVyIHRvIGFkZCB0byB0aGUgdHJhY2suXG4gICAqL1xuICBhZGQobGF5ZXIpIHtcbiAgICBjb25zb2xlLmxvZyhsYXllcik7XG4gICAgdGhpcy5sYXllcnMucHVzaChsYXllcik7XG4gICAgLy8gQ3JlYXRlIGEgZGVmYXVsdCByZW5kZXJpbmdDb250ZXh0IGZvciB0aGUgbGF5ZXIgaWYgbWlzc2luZ1xuICAgIHRoaXMuJGxheW91dC5hcHBlbmRDaGlsZChsYXllci4kZWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBsYXllciBmcm9tIHRoZSB0cmFjay4gVGhlIGxheWVyIGNhbiBiZSByZXVzZWQgZWxzZXdoZXJlLlxuICAgKlxuICAgKiBAcGFyYW0ge0xheWVyfSBsYXllciAtIHRoZSBsYXllciB0byByZW1vdmUgZnJvbSB0aGUgdHJhY2suXG4gICAqL1xuICByZW1vdmUobGF5ZXIpIHtcbiAgICB0aGlzLmxheWVycy5zcGxpY2UodGhpcy5sYXllcnMuaW5kZXhPZihsYXllciksIDEpO1xuICAgIC8vIFJlbW92ZXMgbGF5ZXIgZnJvbSBpdHMgY29udGFpbmVyXG4gICAgdGhpcy4kbGF5b3V0LnJlbW92ZUNoaWxkKGxheWVyLiRlbCk7XG4gIH1cblxuICAvKipcbiAgICogVGVzdHMgaWYgYSBnaXZlbiBlbGVtZW50IGJlbG9uZ3MgdG8gdGhlIHRyYWNrLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRlbFxuICAgKiBAcmV0dXJuIHtib29sfVxuICAgKi9cbiAgaGFzRWxlbWVudCgkZWwpIHtcbiAgICBkbyB7XG4gICAgICBpZiAoJGVsID09PSB0aGlzLiRlbCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgJGVsID0gJGVsLnBhcmVudE5vZGU7XG4gICAgfSB3aGlsZSAoJGVsICE9PSBudWxsKTtcblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgYWxsIHRoZSBsYXllcnMgYWRkZWQgdG8gdGhlIHRyYWNrLlxuICAgKi9cbiAgcmVuZGVyKCkge1xuICAgIGZvciAobGV0IGxheWVyIG9mIHRoaXMpIHsgbGF5ZXIucmVuZGVyKCk7IH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSB0cmFjayBET00gc3RydWN0dXJlIGFuZCB1cGRhdGVzIHRoZSBsYXllcnMuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXk8TGF5ZXI+fSBbbGF5ZXJzPW51bGxdIC0gaWYgbm90IG51bGwsIGEgc3Vic2V0IG9mIHRoZSBsYXllcnMgdG8gdXBkYXRlLlxuICAgKi9cbiAgdXBkYXRlKGxheWVycyA9IG51bGwpIHtcbiAgICB0aGlzLnVwZGF0ZUNvbnRhaW5lcigpO1xuICAgIHRoaXMudXBkYXRlTGF5ZXJzKGxheWVycyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgdHJhY2sgRE9NIHN0cnVjdHVyZS5cbiAgICovXG4gIHVwZGF0ZUNvbnRhaW5lcigpIHtcbiAgICBjb25zdCAkc3ZnID0gdGhpcy4kc3ZnO1xuICAgIGNvbnN0ICRvZmZzZXQgPSB0aGlzLiRvZmZzZXQ7XG4gICAgLy8gU2hvdWxkIGJlIGluIHNvbWUgdXBkYXRlIGxheW91dFxuICAgIGNvbnN0IHJlbmRlcmluZ0NvbnRleHQgPSB0aGlzLnJlbmRlcmluZ0NvbnRleHQ7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gICAgY29uc3Qgd2lkdGggPSBNYXRoLnJvdW5kKHJlbmRlcmluZ0NvbnRleHQudmlzaWJsZVdpZHRoKTtcbiAgICBjb25zdCBvZmZzZXRYID0gTWF0aC5yb3VuZChyZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHJlbmRlcmluZ0NvbnRleHQub2Zmc2V0KSk7XG4gICAgY29uc3QgdHJhbnNsYXRlID0gYHRyYW5zbGF0ZSgke29mZnNldFh9LCAwKWA7XG5cbiAgICAkc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBoZWlnaHQpO1xuICAgICRzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgd2lkdGgpO1xuICAgICRzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3ZpZXdib3gnLCBgMCAwICR7d2lkdGh9ICR7aGVpZ2h0fWApO1xuXG4gICAgJG9mZnNldC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgdHJhbnNsYXRlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBsYXllcnMuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXk8TGF5ZXI+fSBbbGF5ZXJzPW51bGxdIC0gaWYgbm90IG51bGwsIGEgc3Vic2V0IG9mIHRoZSBsYXllcnMgdG8gdXBkYXRlLlxuICAgKi9cbiAgdXBkYXRlTGF5ZXJzKGxheWVycyA9IG51bGwpIHtcbiAgICBsYXllcnMgPSAobGF5ZXJzID09PSBudWxsKSA/IHRoaXMubGF5ZXJzIDogbGF5ZXJzO1xuXG4gICAgbGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB7XG4gICAgICBpZiAodGhpcy5sYXllcnMuaW5kZXhPZihsYXllcikgPT09IC0xKSB7IHJldHVybjsgfVxuICAgICAgbGF5ZXIudXBkYXRlKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSXRlcmF0ZXMgdGhyb3VnaCB0aGUgYWRkZWQgbGF5ZXJzLlxuICAgKi9cbiAgKltTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgIHlpZWxkKiB0aGlzLmxheWVyc1tTeW1ib2wuaXRlcmF0b3JdKCk7XG4gIH1cbn1cbiIsImltcG9ydCBBbm5vdGF0ZWRNYXJrZXIgZnJvbSAnLi4vc2hhcGVzL2Fubm90YXRlZC1tYXJrZXInO1xuaW1wb3J0IExheWVyIGZyb20gJy4uL2NvcmUvbGF5ZXInO1xuaW1wb3J0IE1hcmtlckJlaGF2aW9yIGZyb20gJy4uL2JlaGF2aW9ycy9tYXJrZXItYmVoYXZpb3InO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIGNyZWF0ZSBhIGFubm90YXRlZCBtYXJrZXIgbGF5ZXJcbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1tYXJrZXIuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQW5ub3RhdGVkTWFya2VyTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0FycmF5fSBkYXRhIC0gVGhlIGRhdGEgdG8gcmVuZGVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEFuIG9iamVjdCB0byBjb25maWd1cmUgdGhlIGxheWVyLlxuICAgKiBAdG9kbyAtIEFkZCBhY2Nlc3NvcnMgYW5kIG9wdGlvbnMgZm9yIHRoZSBzaGFwZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGRhdGEsIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKCdjb2xsZWN0aW9uJywgZGF0YSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmNvbmZpZ3VyZVNoYXBlKEFubm90YXRlZE1hcmtlcik7XG4gICAgdGhpcy5zZXRCZWhhdmlvcihuZXcgTWFya2VyQmVoYXZpb3IoKSk7XG4gIH1cbn1cbiIsImltcG9ydCBMYXllciBmcm9tICcuLi9jb3JlL2xheWVyJztcbmltcG9ydCBBbm5vdGF0ZWRTZWdtZW50IGZyb20gJy4uL3NoYXBlcy9hbm5vdGF0ZWQtc2VnbWVudCc7XG5pbXBvcnQgU2VnbWVudEJlaGF2aW9yIGZyb20gJy4uL2JlaGF2aW9ycy9zZWdtZW50LWJlaGF2aW9yJztcblxuXG4vKipcbiAqIEhlbHBlciB0byBjcmVhdGUgYSBhbm5vdGF0ZWQgc2VnbWVudCBsYXllci5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1zZWdtZW50Lmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFubm90YXRlZFNlZ21lbnRMYXllciBleHRlbmRzIExheWVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7QXJyYXl9IGRhdGEgLSBUaGUgZGF0YSB0byByZW5kZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gQW4gb2JqZWN0IHRvIGNvbmZpZ3VyZSB0aGUgbGF5ZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhY2Nlc3NvcnMgLSBUaGUgYWNjZXNzb3JzIHRvIGNvbmZpZ3VyZSB0aGUgbWFwcGluZ1xuICAgKiAgICBiZXR3ZWVuIHNoYXBlcyBhbmQgZGF0YS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGRhdGEsIG9wdGlvbnMgPSB7fSwgYWNjZXNzb3JzID0ge30pIHtcbiAgICBzdXBlcignY29sbGVjdGlvbicsIGRhdGEsIG9wdGlvbnMpO1xuXG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgZGlzcGxheUhhbmRsZXJzOiB0cnVlLFxuICAgICAgb3BhY2l0eTogMC42XG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmNvbmZpZ3VyZVNoYXBlKEFubm90YXRlZFNlZ21lbnQsIGFjY2Vzc29ycywge1xuICAgICAgZGlzcGxheUhhbmRsZXJzOiBvcHRpb25zLmRpc3BsYXlIYW5kbGVycyxcbiAgICAgIG9wYWNpdHk6IG9wdGlvbnMub3BhY2l0eSxcbiAgICB9KTtcblxuICAgIHRoaXMuc2V0QmVoYXZpb3IobmV3IFNlZ21lbnRCZWhhdmlvcigpKTtcbiAgfVxufVxuIiwiaW1wb3J0IEJyZWFrcG9pbnRCZWhhdmlvciBmcm9tICcuLi9iZWhhdmlvcnMvYnJlYWtwb2ludC1iZWhhdmlvcic7XG5pbXBvcnQgRG90IGZyb20gJy4uL3NoYXBlcy9kb3QnO1xuaW1wb3J0IExheWVyIGZyb20gJy4uL2NvcmUvbGF5ZXInO1xuaW1wb3J0IExpbmUgZnJvbSAnLi4vc2hhcGVzL2xpbmUnO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIGNyZWF0ZSBhIGJyZWFrcG9pbnQgZnVuY3Rpb24gbGF5ZXIuXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItYnJlYWtwb2ludC5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCcmVha3BvaW50TGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0FycmF5fSBkYXRhIC0gVGhlIGRhdGEgdG8gcmVuZGVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEFuIG9iamVjdCB0byBjb25maWd1cmUgdGhlIGxheWVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gYWNjZXNzb3JzIC0gVGhlIGFjY2Vzc29ycyB0byBjb25maWd1cmUgdGhlIG1hcHBpbmdcbiAgICogICAgYmV0d2VlbiBzaGFwZXMgYW5kIGRhdGEuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihkYXRhLCBvcHRpb25zID0ge30sIGFjY2Vzc29ycyA9IHt9KSB7XG4gICAgc3VwZXIoJ2NvbGxlY3Rpb24nLCBkYXRhLCBvcHRpb25zKTtcblxuICAgIGNvbnN0IGNvbG9yID0gb3B0aW9ucy5jb2xvcjtcbiAgICBsZXQgY29tbW9uU2hhcGVPcHRpb25zID0ge307XG5cbiAgICBpZiAoY29sb3IpIHtcbiAgICAgIGFjY2Vzc29ycy5jb2xvciA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gY29sb3I7IH07XG4gICAgICBjb21tb25TaGFwZU9wdGlvbnMuY29sb3IgPSBjb2xvcjtcbiAgICB9XG5cbiAgICB0aGlzLmNvbmZpZ3VyZUNvbW1vblNoYXBlKExpbmUsIGFjY2Vzc29ycywgY29tbW9uU2hhcGVPcHRpb25zKTtcbiAgICB0aGlzLmNvbmZpZ3VyZVNoYXBlKERvdCwgYWNjZXNzb3JzLCB7fSk7XG4gICAgdGhpcy5zZXRCZWhhdmlvcihuZXcgQnJlYWtwb2ludEJlaGF2aW9yKCkpO1xuICB9XG59XG4iLCJpbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5pbXBvcnQgQ3Vyc29yIGZyb20gJy4uL3NoYXBlcy9jdXJzb3InO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIGNyZWF0ZSBhIGN1cnNvciBsYXllci5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1jdXJzb3IuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3Vyc29yTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEFuIG9iamVjdCB0byBjb25maWd1cmUgdGhlIGxheWVyLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBjb2xvcjogJ3JlZCcsXG4gICAgICBoaXR0YWJsZTogZmFsc2UsIC8vIGtpbmQgb2YgcGFzcyB0aHJvdWdoIGxheWVyXG4gICAgfTtcblxuICAgIGNvbnN0IGRhdGEgPSB7IGN1cnJlbnRQb3NpdGlvbjogMCB9O1xuXG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgIHN1cGVyKCdlbnRpdHknLCBkYXRhLCBvcHRpb25zKTtcblxuICAgIHRoaXMuY29uZmlndXJlU2hhcGUoQ3Vyc29yLCB7IHg6IChkKSA9PiBkLmN1cnJlbnRQb3NpdGlvbiB9LCB7XG4gICAgICBjb2xvcjogb3B0aW9ucy5jb2xvclxuICAgIH0pO1xuICB9XG5cbiAgc2V0IGN1cnJlbnRQb3NpdGlvbih2YWx1ZSkge1xuICAgIHRoaXMuZGF0YVswXS5jdXJyZW50UG9zaXRpb24gPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBjdXJyZW50UG9zaXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVswXS5jdXJyZW50UG9zaXRpb247XG4gIH1cbn1cbiIsImltcG9ydCBBeGlzTGF5ZXIgZnJvbSAnLi4vYXhpcy9heGlzLWxheWVyJztcbmltcG9ydCBUaWNrcyBmcm9tICcuLi9zaGFwZXMvdGlja3MnO1xuaW1wb3J0IGdyaWRBeGlzR2VuZXJhdG9yIGZyb20gJy4uL2F4aXMvZ3JpZC1heGlzLWdlbmVyYXRvcic7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gY3JlYXRlIGEgZ3JpZCBsYXllclxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLWF4aXMuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JpZEF4aXNMYXllciBleHRlbmRzIEF4aXNMYXllciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEFuIG9iamVjdCB0byBjb25maWd1cmUgdGhlIGxheWVyLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGNvbG9yOiAnc3RlZWxibHVlJyxcbiAgICAgIGJwbTogNjAsXG4gICAgICBzaWduYXR1cmU6ICc0LzQnXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICBzdXBlcihncmlkQXhpc0dlbmVyYXRvcihvcHRpb25zLmJwbSwgb3B0aW9ucy5zaWduYXR1cmUpLCBvcHRpb25zKTtcblxuICAgIHRoaXMuY29uZmlndXJlU2hhcGUoVGlja3MsIHt9LCB7XG4gICAgICBjb2xvcjogb3B0aW9ucy5jb2xvclxuICAgIH0pO1xuICB9XG59IiwiaW1wb3J0IERvdCBmcm9tICcuLi9zaGFwZXMvZG90JztcbmltcG9ydCBMYXllciBmcm9tICcuLi9jb3JlL2xheWVyJztcbmltcG9ydCBMaW5lIGZyb20gJy4uL3NoYXBlcy9saW5lJztcblxuXG4vKipcbiAqIEhlbHBlciB0byBjcmVhdGUgYSBsaW5lIGxheWVyLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5lTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0FycmF5fSBkYXRhIC0gVGhlIGRhdGEgdG8gcmVuZGVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEFuIG9iamVjdCB0byBjb25maWd1cmUgdGhlIGxheWVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gYWNjZXNzb3JzIC0gVGhlIGFjY2Vzc29ycyB0byBjb25maWd1cmUgdGhlIG1hcHBpbmdcbiAgICogICAgYmV0d2VlbiBzaGFwZXMgYW5kIGRhdGEuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihkYXRhLCBvcHRpb25zID0ge30sIGFjY2Vzc29ycyA9IHt9KSB7XG4gICAgc3VwZXIoJ2VudGl0eScsIGRhdGEsIG9wdGlvbnMpO1xuXG4gICAgY29uc3QgY29sb3IgPSBvcHRpb25zLmNvbG9yO1xuICAgIGxldCBsaW5lT3B0aW9ucyA9IHt9O1xuXG4gICAgaWYgKGNvbG9yKSB7XG4gICAgICBhY2Nlc3NvcnMuY29sb3IgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGNvbG9yOyB9O1xuICAgICAgbGluZU9wdGlvbnMuY29sb3IgPSBjb2xvcjtcbiAgICB9XG5cbiAgICB0aGlzLmNvbmZpZ3VyZVNoYXBlKExpbmUsIGFjY2Vzc29ycywgbGluZU9wdGlvbnMpO1xuICB9XG59XG4iLCJpbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5pbXBvcnQgTWFya2VyIGZyb20gJy4uL3NoYXBlcy9tYXJrZXInO1xuaW1wb3J0IE1hcmtlckJlaGF2aW9yIGZyb20gJy4uL2JlaGF2aW9ycy9tYXJrZXItYmVoYXZpb3InO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIGNyZWF0ZSBhIG1hcmtlciBsYXllci5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1icmVha3BvaW50Lmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcmtlckxheWVyIGV4dGVuZHMgTGF5ZXIge1xuICAvKipcbiAgICogQHBhcmFtIHtBcnJheX0gZGF0YSAtIFRoZSBkYXRhIHRvIHJlbmRlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBBbiBvYmplY3QgdG8gY29uZmlndXJlIHRoZSBsYXllci5cbiAgICogQHBhcmFtIHtPYmplY3R9IGFjY2Vzc29ycyAtIFRoZSBhY2Nlc3NvcnMgdG8gY29uZmlndXJlIHRoZSBtYXBwaW5nXG4gICAqICAgIGJldHdlZW4gc2hhcGVzIGFuZCBkYXRhLlxuICAgKi9cbiAgY29uc3RydWN0b3IoZGF0YSwgb3B0aW9ucyA9IHt9LCBhY2Nlc3NvcnMgPSB7fSkge1xuICAgIHN1cGVyKCdjb2xsZWN0aW9uJywgZGF0YSwgb3B0aW9ucyk7XG5cbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7IGRpc3BsYXlIYW5kbGVyczogdHJ1ZSB9LCBvcHRpb25zKTtcbiAgICBjb25zdCBjb2xvciA9IG9wdGlvbnMuY29sb3I7XG4gICAgaWYgKGNvbG9yKSB7XG4gICAgICBhY2Nlc3NvcnMuY29sb3IgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGNvbG9yOyB9O1xuICAgIH1cblxuICAgIHRoaXMuY29uZmlndXJlU2hhcGUoTWFya2VyLCBhY2Nlc3NvcnMsIHtcbiAgICAgIGRpc3BsYXlIYW5kbGVyczogb3B0aW9ucy5kaXNwbGF5SGFuZGxlcnNcbiAgICB9KTtcblxuICAgIHRoaXMuc2V0QmVoYXZpb3IobmV3IE1hcmtlckJlaGF2aW9yKCkpO1xuICB9XG59XG4iLCJpbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5pbXBvcnQgTWF0cml4IGZyb20gJy4uL3NoYXBlcy9tYXRyaXgnO1xuXG5jb25zdCBkZWZhdWx0cyA9IHtcbiAgbm9ybWFsaXNlOiAnbm9uZScsXG4gIGdhaW46IDEuMCxcbiAgY2hhbm5lbDogMFxufTtcblxuLyoqXG4gKiBIZWxwZXIgdG8gY3JlYXRlIGEgbWF0cml4IGxheWVyLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXRyaXhMYXllciBleHRlbmRzIExheWVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7QXVkaW9CdWZmZXJ9IGJ1ZmZlciAtIFRoZSBhdWRpbyBidWZmZXIgdG8gZGlzcGxheS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBBbiBvYmplY3QgdG8gY29uZmlndXJlIHRoZSBsYXllci5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG1hdHJpeEVudGl0eSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcblxuICAgIHN1cGVyKCdlbnRpdHknLCBtYXRyaXhFbnRpdHksIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb25maWd1cmVTaGFwZShNYXRyaXgsIHt9LCBvcHRpb25zKTtcbiAgfVxufVxuIiwiaW1wb3J0IExheWVyIGZyb20gJy4uL2NvcmUvbGF5ZXInO1xuaW1wb3J0IFNlZ21lbnQgZnJvbSAnLi4vc2hhcGVzL3NlZ21lbnQnO1xuaW1wb3J0IFNlZ21lbnRCZWhhdmlvciBmcm9tICcuLi9iZWhhdmlvcnMvc2VnbWVudC1iZWhhdmlvcic7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gY3JlYXRlIGEgc2VnbWVudCBsYXllci5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1zZWdtZW50Lmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlZ21lbnRMYXllciBleHRlbmRzIExheWVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7QXJyYXl9IGRhdGEgLSBUaGUgZGF0YSB0byByZW5kZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gQW4gb2JqZWN0IHRvIGNvbmZpZ3VyZSB0aGUgbGF5ZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhY2Nlc3NvcnMgLSBUaGUgYWNjZXNzb3JzIHRvIGNvbmZpZ3VyZSB0aGUgbWFwcGluZ1xuICAgKiAgICBiZXR3ZWVuIHNoYXBlcyBhbmQgZGF0YS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGRhdGEsIG9wdGlvbnMgPSB7fSwgYWNjZXNzb3JzID0ge30pIHtcbiAgICBzdXBlcignY29sbGVjdGlvbicsIGRhdGEsIG9wdGlvbnMpO1xuXG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgZGlzcGxheUhhbmRsZXJzOiB0cnVlLFxuICAgICAgb3BhY2l0eTogMC42XG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmNvbmZpZ3VyZVNoYXBlKFNlZ21lbnQsIGFjY2Vzc29ycywge1xuICAgICAgZGlzcGxheUhhbmRsZXJzOiBvcHRpb25zLmRpc3BsYXlIYW5kbGVycyxcbiAgICAgIG9wYWNpdHk6IG9wdGlvbnMub3BhY2l0eSxcbiAgICB9KTtcblxuICAgIHRoaXMuc2V0QmVoYXZpb3IobmV3IFNlZ21lbnRCZWhhdmlvcigpKTtcbiAgfVxufVxuIiwiaW1wb3J0IExheWVyIGZyb20gJy4uL2NvcmUvbGF5ZXInO1xuaW1wb3J0IFRpY2tzIGZyb20gJy4uL3NoYXBlcy90aWNrcyc7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gY3JlYXRlIGEgdGljayBsYXllci4gQ2FuIGJlIHNlZW4gYXMgYSBncmlkIGF4aXMgd2l0aCB1c2VyIGRlZmluZWQgZGF0YVxuICogb3IgYXMgYSBtYXJrZXIgbGF5ZXIgd2l0aCBlbnRpdHkgYmFzZWQgZGF0YS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGlja0xheWVyIGV4dGVuZHMgTGF5ZXIge1xuICAvKipcbiAgICogQHBhcmFtIHtBcnJheX0gZGF0YSAtIFRoZSBkYXRhIHRvIHJlbmRlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBBbiBvYmplY3QgdG8gY29uZmlndXJlIHRoZSBsYXllci5cbiAgICogQHBhcmFtIHtPYmplY3R9IGFjY2Vzc29ycyAtIFRoZSBhY2Nlc3NvcnMgdG8gY29uZmlndXJlIHRoZSBtYXBwaW5nXG4gICAqICAgIGJldHdlZW4gc2hhcGVzIGFuZCBkYXRhLlxuICAgKi9cbiAgY29uc3RydWN0b3IoZGF0YSwgb3B0aW9ucywgYWNjZXNzb3JzKSB7XG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICBzdXBlcignZW50aXR5JywgZGF0YSwgb3B0aW9ucyk7XG5cbiAgICBjb25zdCBjb25maWcgPSBvcHRpb25zLmNvbG9yID8geyBjb2xvcjogb3B0aW9ucy5jb2xvciB9IDogdW5kZWZpbmVkO1xuICAgIHRoaXMuY29uZmlndXJlU2hhcGUoVGlja3MsIGFjY2Vzc29ycywgY29uZmlnKTtcbiAgfVxufSIsImltcG9ydCBBeGlzTGF5ZXIgZnJvbSAnLi4vYXhpcy9heGlzLWxheWVyJztcbmltcG9ydCBUaWNrcyBmcm9tICcuLi9zaGFwZXMvdGlja3MnO1xuaW1wb3J0IHRpbWVBeGlzR2VuZXJhdG9yIGZyb20gJy4uL2F4aXMvdGltZS1heGlzLWdlbmVyYXRvcic7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gY3JlYXRlIGEgdGltZSBheGlzIGxheWVyXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItYXhpcy5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lQXhpc0xheWVyIGV4dGVuZHMgQXhpc0xheWVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gQW4gb2JqZWN0IHRvIGNvbmZpZ3VyZSB0aGUgbGF5ZXIuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oeyBjb2xvcjogJ3N0ZWVsYmx1ZScgfSwgb3B0aW9ucyk7XG4gICAgc3VwZXIodGltZUF4aXNHZW5lcmF0b3IoKSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmNvbmZpZ3VyZVNoYXBlKFRpY2tzLCB7fSwge1xuICAgICAgY29sb3I6IG9wdGlvbnMuY29sb3JcbiAgICB9KTtcbiAgfVxufSIsImltcG9ydCBMYXllciBmcm9tICcuLi9jb3JlL2xheWVyJztcbmltcG9ydCBUcmFjZVBhdGggZnJvbSAnLi4vc2hhcGVzL3RyYWNlLXBhdGgnO1xuaW1wb3J0IFRyYWNlRG90cyBmcm9tICcuLi9zaGFwZXMvdHJhY2UtZG90cyc7XG5pbXBvcnQgVHJhY2VCZWhhdmlvciBmcm9tICcuLi9iZWhhdmlvcnMvdHJhY2UtYmVoYXZpb3InO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIGNyZWF0ZSBhIHRyYWNlIGxheWVyLlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLXRyYWNlLmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyYWNlTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0FycmF5fSBkYXRhIC0gVGhlIGRhdGEgdG8gcmVuZGVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEFuIG9iamVjdCB0byBjb25maWd1cmUgdGhlIGxheWVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gYWNjZXNzb3JzIC0gVGhlIGFjY2Vzc29ycyB0byBjb25maWd1cmUgdGhlIG1hcHBpbmdcbiAgICogICAgYmV0d2VlbiBzaGFwZXMgYW5kIGRhdGEuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihkYXRhLCBvcHRpb25zID0ge30sIGFjY2Vzc29ycyA9IHt9KSB7XG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oeyBkaXNwbGF5RG90czogdHJ1ZSB9LCBvcHRpb25zKTtcbiAgICBzdXBlcihvcHRpb25zLmRpc3BsYXlEb3RzID8gJ2NvbGxlY3Rpb24nIDogJ2VudGl0eScsIGRhdGEsIG9wdGlvbnMpO1xuXG4gICAgY29uc3Qgc2hhcGVPcHRpb25zID0ge307XG4gICAgaWYgKG9wdGlvbnMubWVhbkNvbG9yICE9PSB1bmRlZmluZWQpIHsgc2hhcGVPcHRpb25zLm1lYW5Db2xvciA9IG9wdGlvbnMubWVhbkNvbG9yOyB9XG4gICAgaWYgKG9wdGlvbnMucmFuZ2VDb2xvciAhPT0gdW5kZWZpbmVkKSB7IHNoYXBlT3B0aW9ucy5yYW5nZUNvbG9yID0gb3B0aW9ucy5yYW5nZUNvbG9yOyB9XG4gICAgaWYgKG9wdGlvbnMuZGlzcGxheU1lYW4gIT09IHVuZGVmaW5lZCkgeyBzaGFwZU9wdGlvbnMuZGlzcGxheU1lYW4gPSBvcHRpb25zLmRpc3BsYXlNZWFuOyB9XG5cbiAgICBpZiAob3B0aW9ucy5kaXNwbGF5RG90cykge1xuICAgICAgdGhpcy5jb25maWd1cmVDb21tb25TaGFwZShUcmFjZVBhdGgsIGFjY2Vzc29ycywgc2hhcGVPcHRpb25zKTtcbiAgICAgIHRoaXMuY29uZmlndXJlU2hhcGUoVHJhY2VEb3RzLCBhY2Nlc3NvcnMsIHNoYXBlT3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29uZmlndXJlU2hhcGUoVHJhY2VQYXRoLCBhY2Nlc3NvcnMsIHNoYXBlT3B0aW9ucyk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRCZWhhdmlvcihuZXcgVHJhY2VCZWhhdmlvcigpKTtcbiAgfVxufSIsImltcG9ydCBMYXllciBmcm9tICcuLi9jb3JlL2xheWVyJztcbmltcG9ydCBXYXZlZm9ybSBmcm9tICcuLi9zaGFwZXMvd2F2ZWZvcm0nO1xuXG5cbmNvbnN0IGRlZmF1bHRzID0ge1xuICB5RG9tYWluOiBbLTEsIDFdLFxuICBjaGFubmVsOiAwLFxuICBjb2xvcjogJ3N0ZWVsYmx1ZScsXG4gIHJlbmRlcmluZ1N0cmF0ZWd5OiAnc3ZnJ1xufTtcblxuLyoqXG4gKiBIZWxwZXIgdG8gY3JlYXRlIGEgd2F2ZWZvcm0gbGF5ZXIuXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItd2F2ZWZvcm0uaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2F2ZWZvcm1MYXllciBleHRlbmRzIExheWVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7QXVkaW9CdWZmZXJ9IGJ1ZmZlciAtIFRoZSBhdWRpbyBidWZmZXIgdG8gZGlzcGxheS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBBbiBvYmplY3QgdG8gY29uZmlndXJlIHRoZSBsYXllci5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGJ1ZmZlciwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgICBzdXBlcignZW50aXR5JywgYnVmZmVyLmdldENoYW5uZWxEYXRhKG9wdGlvbnMuY2hhbm5lbCksIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb25maWd1cmVTaGFwZShXYXZlZm9ybSwge30sIHtcbiAgICAgIHNhbXBsZVJhdGU6IGJ1ZmZlci5zYW1wbGVSYXRlLFxuICAgICAgY29sb3I6IG9wdGlvbnMuY29sb3IsXG4gICAgICByZW5kZXJpbmdTdHJhdGVneTogb3B0aW9ucy5yZW5kZXJpbmdTdHJhdGVneVxuICAgIH0pO1xuICB9XG59XG4iLCJpbXBvcnQgZXZlbnRzIGZyb20gJ2V2ZW50cyc7XG5cblxuLyoqXG4gKiBBYnN0cmFjdCBjbGFzcyB0byBleHRlbmQgdG8gY3JlYXRlIG5ldyBzb3VyY2VzIG9mIGludGVyYWN0aW9ucy5cbiAqIEEgYFN1cmZhY2VgIGFuZCBgS2V5Ym9hcmRgIGV2ZW50IHNvdXJjZXMgYXJlIHByb3ZpZGVkLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFdmVudFNvdXJjZSBleHRlbmRzIGV2ZW50cy5FdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3RvcigkZWwpIHtcbiAgICBzdXBlcigpO1xuICAgIC8qKlxuICAgICAqIFRoZSBlbGVtZW50IG9uIHdoaWNoIHRoZSBsaXN0ZW5lciBpcyBhZGRlZFxuICAgICAqIEB0eXBlIHtFbGVtZW50fVxuICAgICAqL1xuICAgIHRoaXMuJGVsID0gJGVsO1xuXG4gICAgdGhpcy5fYmluZEV2ZW50cygpO1xuICB9XG5cbiAgX2NyZWF0ZUV2ZW50KHR5cGUsIGUpIHt9XG5cbiAgX2JpbmRFdmVudHMoKSB7fVxufVxuIiwiaW1wb3J0IEV2ZW50U291cmNlIGZyb20gJy4vZXZlbnQtc291cmNlJztcbmltcG9ydCBXYXZlRXZlbnQgZnJvbSAnLi93YXZlLWV2ZW50JztcblxuXG4vKipcbiAqIEEgZ2xvYmFsIGV2ZW50IHNvdXJ2ZSBmb3IgdGhlIGtleWJvYXJkLiBPbmx5IG9uZSBpbnN0YW5jZSBvZiB0aGlzIHNvdXJjZVxuICogY2FuIGJlIGNyZWF0ZWQuIFRoZSBmaXJzdCBjcmVhdGVkIHRpbWVsaW5lIGluc3RhbmNpYXRlIHRoZSBzaW5nbGV0b24sIGVhY2hcbiAqIHN1YnNlcXVlbnQgaW5zdGFuY2lhdGlvbiByZXR1cm5zIHRoZSBmaXJzdCBjcmVhdGVkIGluc3RhbmNlLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBLZXlib2FyZCBleHRlbmRzIEV2ZW50U291cmNlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGVsIC0gVGhlIGVsZW1lbnQgb24gd2hpY2ggdG8gaW5zdGFsbCB0aGUgbGlzdGVuZXIuXG4gICAqL1xuICBjb25zdHJ1Y3RvcigkZWwpIHtcbiAgICAvLyBraW5kIG9mIHNpbmdsZXRvblxuICAgIGlmIChLZXlib2FyZC5faW5zdGFuY2UpIHsgcmV0dXJuIEtleWJvYXJkLl9pbnN0YW5jZTsgfVxuXG4gICAgc3VwZXIoJGVsKTtcbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgc291cmNlXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLnNvdXJjZU5hbWUgPSAna2V5Ym9hcmQnO1xuXG4gICAgS2V5Ym9hcmQuX2luc3RhbmNlID0gdGhpcztcbiAgfVxuXG4gIF9jcmVhdGVFdmVudCh0eXBlLCBlKSB7XG4gICAgY29uc3QgZXZlbnQgPSBuZXcgV2F2ZUV2ZW50KHRoaXMuc291cmNlTmFtZSwgdHlwZSwgZSk7XG5cbiAgICBldmVudC5zaGlmdEtleSA9IGUuc2hpZnRLZXk7XG4gICAgZXZlbnQuY3RybEtleSA9IGUuY3RybEtleTtcbiAgICBldmVudC5hbHRLZXkgPSBlLmFsdEtleTtcbiAgICBldmVudC5tZXRhS2V5ID0gZS5tZXRhS2V5O1xuICAgIGV2ZW50LmNoYXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUua2V5Q29kZSk7XG5cbiAgICByZXR1cm4gZXZlbnQ7XG4gIH1cblxuICBfYmluZEV2ZW50cygpIHtcbiAgICBjb25zdCBvbktleURvd24gPSAoZSkgPT4ge1xuICAgICAgbGV0IGV2ZW50ID0gdGhpcy5fY3JlYXRlRXZlbnQoJ2tleWRvd24nLCBlKTtcbiAgICAgIHRoaXMuZW1pdCgnZXZlbnQnLCBldmVudCk7XG4gICAgfTtcblxuICAgIGNvbnN0IG9uS2V5VXAgPSAoZSkgPT4ge1xuICAgICAgbGV0IGV2ZW50ID0gdGhpcy5fY3JlYXRlRXZlbnQoJ2tleXVwJywgZSk7XG4gICAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZXZlbnQpO1xuICAgIH07XG5cbiAgICB0aGlzLiRlbC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25LZXlEb3duLCBmYWxzZSk7XG4gICAgdGhpcy4kZWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBvbktleVVwLCBmYWxzZSk7XG4gIH1cbn1cbiIsImltcG9ydCBFdmVudFNvdXJjZSBmcm9tICcuL2V2ZW50LXNvdXJjZSc7XG5pbXBvcnQgV2F2ZUV2ZW50IGZyb20gJy4vd2F2ZS1ldmVudCc7XG5cblxuLyoqXG4gKiBOb3JtYWxpemVzIG1vdXNlIHVzZXIgaW50ZXJhY3Rpb25zIHdpdGggdGhlIHRpbWVsaW5lIHVwb24gdGhlIERPTVxuICogY29udGFpbmVyIGVsZW1lbnQgb2YgYFRyYWNrYCBpbnN0YW5jZXMuIEFzIHNvb24gYXMgYSBgdHJhY2tgIGlzIGFkZGVkIHRvIGFcbiAqIGB0aW1lbGluZWAsIGl0cyBhdHRhY2hlZCBgU3VyZmFjZWAgaW5zdGFuY2Ugd2lsbCBlbWl0IHRoZSBtb3VzZSBldmVudHMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN1cmZhY2UgZXh0ZW5kcyBFdmVudFNvdXJjZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0RPTUVsZW1lbnR9IGVsIC0gVGhlIERPTSBlbGVtZW50IHRvIGxpc3Rlbi5cbiAgICogQHRvZG8gLSBBZGQgc29tZSBwYWRkaW5nIHRvIHRoZSBzdXJmYWNlLlxuICAgKi9cbiAgY29uc3RydWN0b3IoJGVsKSB7XG4gICAgc3VwZXIoJGVsKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBldmVudCBzb3VyY2UuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLnNvdXJjZU5hbWUgPSAnc3VyZmFjZSc7XG4gICAgdGhpcy5fbW91c2VEb3duRXZlbnQgPSBudWxsO1xuICAgIHRoaXMuX2xhc3RFdmVudCA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogRmFjdG9yeSBtZXRob2QgZm9yIGBFdmVudGAgY2xhc3NcbiAgICovXG4gIF9jcmVhdGVFdmVudCh0eXBlLCBlKSB7XG4gICAgY29uc3QgZXZlbnQgPSBuZXcgV2F2ZUV2ZW50KHRoaXMuc291cmNlTmFtZSwgdHlwZSwgZSk7XG5cbiAgICBjb25zdCBwb3MgPSB0aGlzLl9nZXRSZWxhdGl2ZVBvc2l0aW9uKGUpO1xuICAgIGV2ZW50LnggPSBwb3MueDtcbiAgICBldmVudC55ID0gcG9zLnk7XG5cbiAgICByZXR1cm4gZXZlbnQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgeCwgeSBjb29yZGluYXRlcyBjb29yZGluYXRlcyByZWxhdGl2ZSB0byB0aGUgc3VyZmFjZSBlbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBlIC0gUmF3IGV2ZW50IGZyb20gbGlzdGVuZXIuXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICogQHRvZG8gLSBoYW5kbGUgcGFkZGluZy5cbiAgICovXG4gIF9nZXRSZWxhdGl2ZVBvc2l0aW9uKGUpIHtcbiAgICAvLyBAVE9ETzogc2hvdWxkIGJlIGFibGUgdG8gaWdub3JlIHBhZGRpbmdcbiAgICBsZXQgeCA9IDA7XG4gICAgbGV0IHkgPSAwO1xuICAgIGNvbnN0IGNsaWVudFJlY3QgPSB0aGlzLiRlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBzY3JvbGxMZWZ0ID0gZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0ICsgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQ7XG4gICAgY29uc3Qgc2Nyb2xsVG9wICA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wICsgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcblxuICAgIC8vIEFkYXB0ZWQgZnJvbSBodHRwOi8vd3d3LnF1aXJrc21vZGUub3JnL2pzL2V2ZW50c19wcm9wZXJ0aWVzLmh0bWwjcG9zaXRpb25cbiAgICBpZiAoZS5wYWdlWCB8fCBlLnBhZ2VZKSB7XG4gICAgICB4ID0gZS5wYWdlWDtcbiAgICAgIHkgPSBlLnBhZ2VZO1xuICAgIH0gZWxzZSBpZiAoZS5jbGllbnRYIHx8IGUuY2xpZW50WSkge1xuICAgICAgLy8gTm9ybWFsaXplIHRvIHBhZ2VYLCBwYWdlWVxuICAgICAgeCA9IGUuY2xpZW50WCArIHNjcm9sbExlZnQ7XG4gICAgICB5ID0gZS5jbGllbnRZICsgc2Nyb2xsVG9wO1xuICAgIH1cblxuICAgIC8vIGNsaWVudFJlY3QgcmVmZXJzIHRvIHRoZSBjbGllbnQsIG5vdCB0byB0aGUgcGFnZVxuICAgIHggPSB4IC0gKGNsaWVudFJlY3QubGVmdCArIHNjcm9sbExlZnQpO1xuICAgIHkgPSB5IC0gKGNsaWVudFJlY3QudG9wICArIHNjcm9sbFRvcCApO1xuXG4gICAgcmV0dXJuIHsgeCwgeSB9O1xuICB9XG5cbiAgX2RlZmluZUFyZWEoZSwgbW91c2VEb3duRXZlbnQsIGxhc3RFdmVudCkge1xuICAgIGlmICghbW91c2VEb3duRXZlbnQgfHzCoCFsYXN0RXZlbnQpIHsgcmV0dXJuOyB9XG4gICAgZS5keCA9IGUueCAtIGxhc3RFdmVudC54O1xuICAgIGUuZHkgPSBlLnkgLSBsYXN0RXZlbnQueTtcblxuICAgIGNvbnN0IGxlZnQgPSBtb3VzZURvd25FdmVudC54IDwgZS54ID8gbW91c2VEb3duRXZlbnQueCA6IGUueDtcbiAgICBjb25zdCB0b3AgID0gbW91c2VEb3duRXZlbnQueSA8IGUueSA/IG1vdXNlRG93bkV2ZW50LnkgOiBlLnk7XG4gICAgY29uc3Qgd2lkdGggID0gTWF0aC5hYnMoTWF0aC5yb3VuZChlLnggLSBtb3VzZURvd25FdmVudC54KSk7XG4gICAgY29uc3QgaGVpZ2h0ID0gTWF0aC5hYnMoTWF0aC5yb3VuZChlLnkgLSBtb3VzZURvd25FdmVudC55KSk7XG5cbiAgICBlLmFyZWEgPSB7IGxlZnQsIHRvcCwgd2lkdGgsIGhlaWdodCB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEtlZXAgdGhpcyBwcml2YXRlIHRvIGF2b2lkIGRvdWJsZSBldmVudCBiaW5kaW5nLiBNYWluIGxvZ2ljIG9mIHRoZSBzdXJmYWNlXG4gICAqIGlzIGhlcmUuIFNob3VsZCBiZSBleHRlbmRlZCB3aXRoIG5lZWRlZCBldmVudHMgKG1vdXNlZW50ZXIsIG1vdXNlbGVhdmUsXG4gICAqIHdoZWVsIC4uLikuXG4gICAqL1xuICBfYmluZEV2ZW50cygpIHtcbiAgICBjb25zdCBvbk1vdXNlRG93biA9IChlKSA9PiB7XG4gICAgICAvLyBCeSByZW1vdmluZyB0aGUgcHJldmlvdXMgc2VsZWN0aW9uIHdlIHByZXZlbnQgYnlwYXNzaW5nIHRoZSBtb3VzZW1vdmUgZXZlbnRzIGNvbWluZyBmcm9tIFNWRyBpbiBGaXJlZm94LlxuICAgICAgd2luZG93LmdldFNlbGVjdGlvbigpLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgICAgY29uc3QgZXZlbnQgPSB0aGlzLl9jcmVhdGVFdmVudCgnbW91c2Vkb3duJywgZSk7XG5cblxuICAgICAgdGhpcy5fbW91c2VEb3duRXZlbnQgPSBldmVudDtcbiAgICAgIHRoaXMuX2xhc3RFdmVudCA9IGV2ZW50O1xuICAgICAgLy8gUmVnaXN0ZXIgbW91c2Vtb3ZlIGFuZCBtb3VzZXVwIGxpc3RlbmVycyBvbiB3aW5kb3dcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbk1vdXNlTW92ZSwgZmFsc2UpO1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbk1vdXNlVXAsIGZhbHNlKTtcblxuICAgICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgICB9O1xuXG4gICAgY29uc3Qgb25Nb3VzZU1vdmUgPSAoZSkgPT4ge1xuICAgICAgbGV0IGV2ZW50ID0gdGhpcy5fY3JlYXRlRXZlbnQoJ21vdXNlbW92ZScsIGUpO1xuICAgICAgdGhpcy5fZGVmaW5lQXJlYShldmVudCwgdGhpcy5fbW91c2VEb3duRXZlbnQsIHRoaXMuX2xhc3RFdmVudCk7XG4gICAgICAvLyBVcGRhdGUgYGxhc3RFdmVudGAgZm9yIG5leHQgY2FsbFxuICAgICAgdGhpcy5fbGFzdEV2ZW50ID0gZXZlbnQ7XG5cbiAgICAgIHRoaXMuZW1pdCgnZXZlbnQnLCBldmVudCk7XG4gICAgfTtcblxuICAgIGNvbnN0IG9uTW91c2VVcCA9IChlKSA9PiB7XG4gICAgICBsZXQgZXZlbnQgPSB0aGlzLl9jcmVhdGVFdmVudCgnbW91c2V1cCcsIGUpO1xuICAgICAgdGhpcy5fZGVmaW5lQXJlYShldmVudCwgdGhpcy5fbW91c2VEb3duRXZlbnQsIHRoaXMuX2xhc3RFdmVudCk7XG5cblxuICAgICAgdGhpcy5fbW91c2VEb3duRXZlbnQgPSBudWxsO1xuICAgICAgdGhpcy5fbGFzdEV2ZW50ID0gbnVsbDtcbiAgICAgIC8vIFJlbW92ZSBtb3VzZW1vdmUgYW5kIG1vdXNldXAgbGlzdGVuZXJzIG9uIHdpbmRvd1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uTW91c2VNb3ZlKTtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25Nb3VzZVVwKTtcblxuICAgICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgICB9O1xuXG4gICAgY29uc3Qgb25DbGljayA9IChlKSA9PiB7XG4gICAgICBsZXQgZXZlbnQgPSB0aGlzLl9jcmVhdGVFdmVudCgnY2xpY2snLCBlKTtcbiAgICAgIHRoaXMuZW1pdCgnZXZlbnQnLCBldmVudCk7XG4gICAgfTtcblxuICAgIGNvbnN0IG9uRGJsQ2xpY2sgPSAoZSkgPT4ge1xuICAgICAgbGV0IGV2ZW50ID0gdGhpcy5fY3JlYXRlRXZlbnQoJ2RibGNsaWNrJywgZSk7XG4gICAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZXZlbnQpO1xuICAgIH07XG5cbiAgICBjb25zdCBvbk1vdXNlT3ZlciA9IChlKSA9PiB7XG4gICAgICBsZXQgZXZlbnQgPSB0aGlzLl9jcmVhdGVFdmVudCgnbW91c2VvdmVyJywgZSk7XG4gICAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZXZlbnQpO1xuICAgIH07XG5cbiAgICBjb25zdCBvbk1vdXNlT3V0ID0gKGUpID0+IHtcbiAgICAgIGxldCBldmVudCA9IHRoaXMuX2NyZWF0ZUV2ZW50KCdtb3VzZW91dCcsIGUpO1xuICAgICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgICB9O1xuXG4gICAgLy8gQmluZCBjYWxsYmFja3NcbiAgICB0aGlzLiRlbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbk1vdXNlRG93biwgZmFsc2UpO1xuICAgIHRoaXMuJGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbGljaywgZmFsc2UpO1xuICAgIHRoaXMuJGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgb25EYmxDbGljaywgZmFsc2UpO1xuICAgIHRoaXMuJGVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIG9uTW91c2VPdmVyLCBmYWxzZSk7XG4gICAgdGhpcy4kZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCBvbk1vdXNlT3V0LCBmYWxzZSk7XG4gIH1cbn1cbiIsIi8qKlxuICogT2JqZWN0IHRlbXBsYXRlIGZvciBhbGwgZXZlbnRzLiBFdmVudCBzb3VyY2VzIHNob3VsZCB1c2UgdGhpcyBldmVudCB0ZW1wbGF0ZVxuICogaW4gb3JkZXIgdG8ga2VlcCBjb25zaXN0ZW5jeSB3aXRoIGV4aXN0aW5nIHNvdXJjZXMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdhdmVFdmVudCB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc291cmNlIC0gVGhlIG5hbWUgb2YgdGhlIHNvdXJjZSAoYGtleWJvYXJkYCwgYHN1cmZhY2VgLCAuLi4pLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIFRoZSB0eXBlIG9mIHRoZSBzb3VyY2UgKGBtb3VzZWRvd25gLCBga2V5dXBgLCAuLi4pLlxuICAgKiBAcGFyYW0ge0V2ZW50fSBvcmlnaW5hbEV2ZW50IC0gVGhlIG9yaWdpbmFsIGV2ZW50IGFzIGVtaXR0ZWQgYnkgdGhlIGJyb3dzZXIuXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihzb3VyY2UsIHR5cGUsIG9yaWdpbmFsRXZlbnQpIHtcbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIHRoaXMub3JpZ2luYWxFdmVudCA9IG9yaWdpbmFsRXZlbnQ7XG5cbiAgICB0aGlzLnRhcmdldCA9IG9yaWdpbmFsRXZlbnQudGFyZ2V0O1xuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IG9yaWdpbmFsRXZlbnQuY3VycmVudFRhcmdldDtcbiAgfVxufVxuIiwiaW1wb3J0IE1hcmtlciBmcm9tICcuL21hcmtlcic7XG5cblxuLyoqXG4gKiBBIHNoYXBlIHRvIGRpc3BsYXkgYSBtYXJrZXIgd2l0aCBhbm5vdGF0aW9uLlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLW1hcmtlci5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbm5vdGF0ZWRNYXJrZXIgZXh0ZW5kcyBNYXJrZXIge1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAnYW5ub3RhdGVkLW1hcmtlcic7IH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIGxldCBsaXN0ID0gc3VwZXIuX2dldEFjY2Vzc29yTGlzdCgpO1xuICAgIGxpc3QudGV4dCA9ICdkZWZhdWx0JztcbiAgICByZXR1cm4gbGlzdDtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgdGhpcy4kZWwgPSBzdXBlci5yZW5kZXIocmVuZGVyaW5nQ29udGV4dCk7XG4gICAgY29uc3QgaGVpZ2h0ID0gcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQ7XG5cbiAgICB0aGlzLiRsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAndGV4dCcpO1xuICAgIHRoaXMuJGxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd4JywgOCk7XG4gICAgdGhpcy4kbGFiZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3knLCA4KTtcbiAgICB0aGlzLiRsYWJlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYG1hdHJpeCgxLCAwLCAwLCAtMSwgMCwgJHtoZWlnaHR9KWApO1xuICAgIHRoaXMuJGxhYmVsLnN0eWxlLmZvbnRTaXplID0gJzEwcHgnO1xuICAgIHRoaXMuJGxhYmVsLnN0eWxlLmZvbnRGYW1pbHkgPSAnbW9ub3NwYWNlJztcbiAgICB0aGlzLiRsYWJlbC5zdHlsZS5jb2xvciA9ICcjMjQyNDI0JztcbiAgICB0aGlzLiRsYWJlbC5zdHlsZS5tb3pVc2VyU2VsZWN0ID0gJ25vbmUnO1xuICAgIHRoaXMuJGxhYmVsLnN0eWxlLndlYmtpdFVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgdGhpcy4kbGFiZWwuc3R5bGUudXNlclNlbGVjdCA9ICdub25lJztcblxuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRoaXMuJGxhYmVsKTtcblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSkge1xuICAgIHN1cGVyLnVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSk7XG5cbiAgICBpZiAodGhpcy4kbGFiZWwuZmlyc3RDaGlsZCkge1xuICAgICAgdGhpcy4kbGFiZWwucmVtb3ZlQ2hpbGQodGhpcy4kbGFiZWwuZmlyc3RDaGlsZCk7XG4gICAgfVxuXG4gICAgY29uc3QgJHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0aGlzLnRleHQoZGF0dW0pKTtcbiAgICB0aGlzLiRsYWJlbC5hcHBlbmRDaGlsZCgkdGV4dCk7XG4gIH1cbn1cbiIsImltcG9ydCBTZWdtZW50IGZyb20gJy4vc2VnbWVudCc7XG5cblxuLyoqXG4gKiBBIHNoYXBlIHRvIGRpc3BsYXkgYSBzZWdtZW50IHdpdGggYW5ub3RhdGlvbi5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1zZWdtZW50Lmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFubm90YXRlZFNlZ21lbnQgZXh0ZW5kcyBTZWdtZW50IHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ2Fubm90YXRlZC1zZWdtZW50JzsgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgbGV0IGxpc3QgPSBzdXBlci5fZ2V0QWNjZXNzb3JMaXN0KCk7XG4gICAgbGlzdC50ZXh0ID0gJ2RlZmF1bHQnO1xuICAgIHJldHVybiBsaXN0O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICB0aGlzLiRlbCA9IHN1cGVyLnJlbmRlcihyZW5kZXJpbmdDb250ZXh0KTtcbiAgICBjb25zdCBoZWlnaHQgPSByZW5kZXJpbmdDb250ZXh0LmhlaWdodDtcblxuICAgIHRoaXMuJGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICd0ZXh0Jyk7XG4gICAgdGhpcy4kbGFiZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3gnLCAzKTtcbiAgICB0aGlzLiRsYWJlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneScsIDExKTtcbiAgICB0aGlzLiRsYWJlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYG1hdHJpeCgxLCAwLCAwLCAtMSwgMCwgJHtoZWlnaHR9KWApO1xuICAgIHRoaXMuJGxhYmVsLnN0eWxlLmZvbnRTaXplID0gJzEwcHgnO1xuICAgIHRoaXMuJGxhYmVsLnN0eWxlLmZvbnRGYW1pbHkgPSAnbW9ub3NwYWNlJztcbiAgICB0aGlzLiRsYWJlbC5zdHlsZS5jb2xvciA9ICcjMjQyNDI0JztcbiAgICB0aGlzLiRsYWJlbC5zdHlsZS5tb3pVc2VyU2VsZWN0ID0gJ25vbmUnO1xuICAgIHRoaXMuJGxhYmVsLnN0eWxlLndlYmtpdFVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgdGhpcy4kbGFiZWwuc3R5bGUudXNlclNlbGVjdCA9ICdub25lJztcblxuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRoaXMuJGxhYmVsKTtcblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSkge1xuICAgIHN1cGVyLnVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSk7XG5cbiAgICBpZiAodGhpcy4kbGFiZWwuZmlyc3RDaGlsZCkge1xuICAgICAgdGhpcy4kbGFiZWwucmVtb3ZlQ2hpbGQodGhpcy4kbGFiZWwuZmlyc3RDaGlsZCk7XG4gICAgfVxuXG4gICAgY29uc3QgJHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0aGlzLnRleHQoZGF0dW0pKTtcbiAgICB0aGlzLiRsYWJlbC5hcHBlbmRDaGlsZCgkdGV4dCk7XG4gIH1cbn1cbiIsImltcG9ydCBucyBmcm9tICcuLi9jb3JlL25hbWVzcGFjZSc7XG5cblxuLyoqXG4gKiBJcyBhbiBhYnN0cmFjdCBjbGFzcyBvciBpbnRlcmZhY2UgdG8gYmUgb3ZlcnJpZGVuIGluIG9yZGVyIHRvIGRlZmluZSBuZXdcbiAqIHNoYXBlcy4gU2hhcGVzIGRlZmluZSB0aGUgd2F5IGEgZ2l2ZW4gZGF0dW0gc2hvdWxkIGJlIHJlbmRlcmVkLCB0aGV5IGFyZVxuICogdGhlIHNtYWxsZXN0IHVuaXQgb2YgcmVuZGVyaW5nIGludG8gYSB0aW1lbGluZS5cbiAqXG4gKiBBbGwgdGhlIGxpZmUgY3ljbGUgb2YgYFNoYXBlYCBpbnN0YW5jZXMgaXMgaGFuZGxlZCBpbnRvIHRoZSBgTGF5ZXJgIGluc3RhbmNlXG4gKiB0aGV5IGFyZSBhdHRhY2ggdG8uIEFzIGEgY29uc2VxdWVuY2UsIHRoZXkgc2hvdWxkIGJlIG1haW5seSBjb25zaWRlcmVkIGFzXG4gKiBwcml2YXRlIG9iamVjdHMuIFRoZSBvbmx5IHBsYWNlIHRoZXkgc2hvdWxkIGJlIGludGVyYWN0ZWQgd2l0aCBpcyBpbiBgQmVoYXZpb3JgXG4gKiBkZWZpbml0aW9ucywgdG8gdGVzdCB3aGljaCBlbGVtZW50IG9mIHRoZSBzaGFwZSBpcyB0aGUgdGFyZ2V0IG9mIHRoZVxuICogaW50ZXJhY3Rpb24gYW5kIGRlZmluZSB0aGUgaW50ZXJhY3Rpb24gYWNjb3JkaW5nIHRvIHRoYXQgdGVzdC5cbiAqXG4gKiBEZXBlbmRpbmcgb2YgaXRzIGltcGxlbWVudGF0aW9uIGEgYFNoYXBlYCBjYW4gYmUgdXNlZCBhbG9uZyB3aXRoIGBlbnRpdHlgIG9yXG4gKiBgY29sbGVjdGlvbmAgZGF0YSB0eXBlLiBTb21lIHNoYXBlcyBhcmUgdGhlbiBjcmVhdGVkIHRvIHVzZSBkYXRhIGNvbnNpZGVyZWRcbiAqIGFzIGEgc2luZ2xlIGVudGl0eSAoV2F2ZWZvcm0sIFRyYWNlUGF0aCwgTGluZSksIHdoaWxlIG90aGVycyBhcmUgZGVmaW5lZCB0b1xuICogYmUgdXNlZCB3aXRoIGRhdGEgc2VlbiBhcyBhIGNvbGxlY3Rpb24sIGVhY2ggc2hhcGUgcmVuZGVyaW5nIGEgc2luZ2xlIGVudHJ5XG4gKiBvZiB0aGUgY29sbGVjdGlvbi4gVGhlIHNoYXBlcyB3b3JraW5nIHdpdGggZW50aXR5IHR5cGUgZGF0YSBzaG91bGQgdGhlcmVmb3JlXG4gKiBiZSB1c2VkIGluIGFuIGBlbnRpdHlgIGNvbmZpZ3VyZWQgYExheWVyYC4gTm90ZSB0aGF0IGlmIHRoZXkgYXJlIHJlZ2lzdGVyZWRcbiAqIGFzIFwiY29tbW9uU2hhcGVcIiBpbiBhIGBjb2xsZWN0aW9uYCB0eXBlIGBMYXllcmAsIHRoZXkgd2lsbCBiZWhhdmUgdGhlIGV4YWN0XG4gKiBzYW1lIHdheS4gVGhlc2Uga2luZCBvZiBzaGFwZXMgYXJlIG5vdGVkOiBcImVudGl0eSBzaGFwZVwiLlxuICpcbiAqICMjIyBBdmFpbGFibGUgYGNvbGxlY3Rpb25gIHNoYXBlczpcbiAqIC0gTWFya2VyIC8gQW5ub3RhdGVkIE1hcmtlclxuICogLSBTZWdtZW50IC8gQW5ub3RhdGVkIFNlZ21lbnRcbiAqIC0gRG90XG4gKiAtIFRyYWNlRG90c1xuICpcbiAqICMjIyBBdmFpbGFibGUgYGVudGl0eWAgc2hhcGVzOlxuICogLSBMaW5lXG4gKiAtIFRpY2sgKGZvciBheGlzKVxuICogLSBXYXZlZm9ybVxuICogLSBUcmFjZVBhdGhcbiAqIC0gTWF0cml4XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VTaGFwZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIG92ZXJyaWRlIGRlZmF1bHQgY29uZmlndXJhdGlvblxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgLyoqIEB0eXBlIHtFbGVtZW50fSAtIFN2ZyBlbGVtZW50IHRvIGJlIHJldHVybmVkIGJ5IHRoZSBgcmVuZGVyYCBtZXRob2QuICovXG4gICAgdGhpcy4kZWwgPSBudWxsO1xuICAgIC8qKiBAdHlwZSB7U3RyaW5nfSAtIFN2ZyBuYW1lc3BhY2UuICovXG4gICAgdGhpcy5ucyA9IG5zO1xuICAgIC8qKiBAdHlwZSB7T2JqZWN0fSAtIE9iamVjdCBjb250YWluaW5nIHRoZSBnbG9iYWwgcGFyYW1ldGVycyBvZiB0aGUgc2hhcGUgKi9cbiAgICB0aGlzLnBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuX2dldERlZmF1bHRzKCksIG9wdGlvbnMpO1xuICAgIC8vIGNyZWF0ZSBhY2Nlc3NvcnMgbWV0aG9kcyBhbmQgc2V0IGRlZmF1bHQgYWNjZXNzb3IgZnVuY3Rpb25zXG4gICAgY29uc3QgYWNjZXNzb3JzID0gdGhpcy5fZ2V0QWNjZXNzb3JMaXN0KCk7XG4gICAgdGhpcy5fY3JlYXRlQWNjZXNzb3JzKGFjY2Vzc29ycyk7XG4gICAgdGhpcy5fc2V0RGVmYXVsdEFjY2Vzc29ycyhhY2Nlc3NvcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlc3Ryb3kgdGhlIHNoYXBlIGFuZCBjbGVhbiByZWZlcmVuY2VzLiBJbnRlcmZhY2UgbWV0aG9kIGNhbGxlZCBmcm9tIHRoZSBgbGF5ZXJgLlxuICAgKi9cbiAgZGVzdHJveSgpIHtcbiAgICAvLyB0aGlzLmdyb3VwID0gbnVsbDtcbiAgICB0aGlzLiRlbCA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogSW50ZXJmYWNlIG1ldGhvZCB0byBvdmVycmlkZSB3aGVuIGV4dGVuZGluZyB0aGlzIGJhc2UgY2xhc3MuIFRoZSBtZXRob2RcbiAgICogaXMgY2FsbGVkIGJ5IHRoZSBgTGF5ZXJ+cmVuZGVyYCBtZXRob2QuIFJldHVybnMgdGhlIG5hbWUgb2YgdGhlIHNoYXBlLFxuICAgKiB1c2VkIGFzIGEgY2xhc3MgaW4gdGhlIGVsZW1lbnQgZ3JvdXAgKGRlZmF1bHRzIHRvIGAnc2hhcGUnYCkuXG4gICAqXG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICovXG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICdzaGFwZSc7IH1cblxuICAvKipcbiAgICogQHRvZG8gbm90IGltcGxlbWVudGVkXG4gICAqIGFsbG93IHRvIGluc3RhbGwgZGVmcyBpbiB0aGUgdHJhY2sgc3ZnIGVsZW1lbnQuIFNob3VsZCBiZSBjYWxsZWQgd2hlblxuICAgKiBhZGRpbmcgdGhlIGBMYXllcmAgdG8gdGhlIGBUcmFja2AuXG4gICAqL1xuICAvLyBzZXRTdmdEZWZpbml0aW9uKGRlZnMpIHt9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGRlZmF1bHRzIGZvciBnbG9iYWwgY29uZmlndXJhdGlvbiBvZiB0aGUgc2hhcGUuXG4gICAqIEBwcm90ZWN0ZWRcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIG9iamVjdCB3aGVyZSBrZXlzIGFyZSB0aGUgYWNjZXNzb3JzIG1ldGhvZHMgbmFtZXMgdG8gY3JlYXRlXG4gICAqIGFuZCB2YWx1ZXMgYXJlIHRoZSBkZWZhdWx0IHZhbHVlcyBmb3IgZWFjaCBnaXZlbiBhY2Nlc3Nvci5cbiAgICpcbiAgICogQHByb3RlY3RlZFxuICAgKiBAdG9kbyByZW5hbWUgP1xuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqL1xuICBfZ2V0QWNjZXNzb3JMaXN0KCkgeyByZXR1cm4ge307IH1cblxuXG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgbWV0aG9kIGNhbGxlZCBieSBMYXllciB3aGVuIGNyZWF0aW5nIGEgc2hhcGUuIEluc3RhbGwgdGhlXG4gICAqIGdpdmVuIGFjY2Vzc29ycyBvbiB0aGUgc2hhcGUsIG92ZXJyaWRpbmcgdGhlIGRlZmF1bHQgYWNjZXNzb3JzLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdDxTdHJpbmcsIGZ1bmN0aW9uPn0gYWNjZXNzb3JzXG4gICAqL1xuICBpbnN0YWxsKGFjY2Vzc29ycykge1xuICAgIGZvciAobGV0IGtleSBpbiBhY2Nlc3NvcnMpIHsgdGhpc1trZXldID0gYWNjZXNzb3JzW2tleV07IH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmljIG1ldGhvZCB0byBjcmVhdGUgYWNjZXNzb3JzLiBBZGRzIGdldHRlcnMgZW4gc2V0dGVycyB0byB0aGVcbiAgICogcHJvdG90eXBlIGlmIG5vdCBhbHJlYWR5IHByZXNlbnQuXG4gICAqL1xuICBfY3JlYXRlQWNjZXNzb3JzKGFjY2Vzc29ycykge1xuICAgIHRoaXMuX2FjY2Vzc29ycyA9IHt9O1xuICAgIC8vIGFkZCBpdCB0byB0aGUgcHJvdG90eXBlXG4gICAgY29uc3QgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpcyk7XG4gICAgLy8gY3JlYXRlIGEgZ2V0dGVyIC8gc2V0dGVyIGZvciBlYWNoIGFjY2Vzc29yc1xuICAgIC8vIHNldHRlciA6IGB0aGlzLnggPSBjYWxsYmFja2BcbiAgICAvLyBnZXR0ZXIgOiBgdGhpcy54KGRhdHVtKWBcbiAgICBPYmplY3Qua2V5cyhhY2Nlc3NvcnMpLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgIGlmIChwcm90by5oYXNPd25Qcm9wZXJ0eShuYW1lKSkgeyByZXR1cm47IH1cblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3RvLCBuYW1lLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl9hY2Nlc3NvcnNbbmFtZV07IH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24oZnVuYykge1xuICAgICAgICAgIHRoaXMuX2FjY2Vzc29yc1tuYW1lXSA9IGZ1bmM7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIGZ1bmN0aW9uIHRvIGJlIHVzZWQgYXMgYSBkZWZhdWx0IGFjY2Vzc29yIGZvciBlYWNoIGFjY2Vzb3JzXG4gICAqL1xuICBfc2V0RGVmYXVsdEFjY2Vzc29ycyhhY2Nlc3NvcnMpIHtcbiAgICBPYmplY3Qua2V5cyhhY2Nlc3NvcnMpLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgIGNvbnN0IGRlZmF1bHRWYWx1ZSA9IGFjY2Vzc29yc1tuYW1lXTtcbiAgICAgIGxldCBhY2Nlc3NvciA9IGZ1bmN0aW9uKGQsIHYgPSBudWxsKSB7XG4gICAgICAgIGlmICh2ID09PSBudWxsKSB7IHJldHVybiBkW25hbWVdIHx8IGRlZmF1bHRWYWx1ZTsgfVxuICAgICAgICBkW25hbWVdID0gdjtcbiAgICAgIH07XG4gICAgICAvLyBzZXQgYWNjZXNzb3IgYXMgdGhlIGRlZmF1bHQgb25lXG4gICAgICB0aGlzW25hbWVdID0gYWNjZXNzb3I7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSW50ZXJmYWNlIG1ldGhvZCBjYWxsZWQgYnkgYExheWVyfnJlbmRlcmAuIENyZWF0ZXMgdGhlIERPTSBzdHJ1Y3R1cmUgb2ZcbiAgICogdGhlIHNoYXBlLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcmVuZGVyaW5nQ29udGV4dCAtIHRoZSByZW5kZXJpbmdDb250ZXh0IG9mIHRoZSBsYXllclxuICAgKiAgICB3aGljaCBvd25zIHRoaXMgc2hhcGUuXG4gICAqIEByZXR1cm4ge0VsZW1lbnR9IC0gdGhlIERPTSBlbGVtZW50IHRvIGluc2VydCBpbiB0aGUgaXRlbSdzIGdyb3VwLlxuICAgKi9cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHt9XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgY2FsbGVkIGJ5IGBMYXllcn51cGRhdGVgLCBvbmx5IGZvciBzaGFwZXMgd2l0aFxuICAgKiBgZW50aXR5YCB0eXBlLlxuICAgKlxuICAgKiBDYWxsZWQgb25jZSBmb3IgYSBnaXZlbiBlbnRpdHksIHRvIHJldHVybiBhbnkgaW5mb3JtYXRpb24gZGVyaXZlZFxuICAgKiBmcm9tIGl0IHRoYXQgd2lsbCBiZSB1c2VkIHN1YnNlcXVlbnRseSB3aGVuIHJlbmRlcmluZy4gSWYgdGhpc1xuICAgKiBtZXRob2QgcmV0dXJucyBhIG5vbi1udWxsIG9iamVjdCwgdGhlbiB0aGF0IG9iamVjdCB3aWxsIGJlIHBhc3NlZFxuICAgKiB0byB0aGUgdXBkYXRlIG1ldGhvZCBzdWJzZXF1ZW50bHkgaW5zdGVhZCBvZiB0aGUgb3JpZ2luYWwgZW50aXR5XG4gICAqIGRhdHVtLiAoSWYgeW91IHdhbnQgdG8gcmV0YWluIGFjY2VzcyB0byB0aGUgb3JpZ2luYWwgZW50aXR5LFxuICAgKiBzdGFzaCBpdCBpbiB5b3VyIGNhY2hlIG9iamVjdCBhcyB3ZWxsLiBPdGhlcndpc2UgaXQgbWF5IGJlIEdDJ2RcbiAgICogaWYgbm9ib2R5IGVsc2UgbmVlZHMgaXQuKVxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdHxBcnJheX0gZGF0dW0gLSBFbnRpdHkgYXNzb2NpYXRlZCB3aXRoIHRoaXMgc2hhcGUuXG4gICAqIEByZXR1cm4ge09iamVjdH0gLSBDYWNoZSBkYXRhIChvcGFxdWUgdG8gY2FsbGVyKSB0byBwYXNzIHRvXG4gICAqICAgICBgdXBkYXRlYCBzdWJzZXF1ZW50bHkgaW4gcGxhY2Ugb2YgdGhlIG9yaWdpbmFsIGVudGl0eSBkYXR1bS5cbiAgICovXG4gIGVuY2FjaGUoZGF0dW0pIHsgcmV0dXJuIG51bGw7IH1cbiAgICBcbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgY2FsbGVkIGJ5IGBMYXllcn51cGRhdGVgLiBVcGRhdGVzIHRoZSBET00gc3RydWN0dXJlIG9mIHRoZSBzaGFwZS5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHJlbmRlcmluZ0NvbnRleHQgLSBUaGUgYHJlbmRlcmluZ0NvbnRleHRgIG9mIHRoZVxuICAgKiAgICBsYXllciB3aGljaCBvd25zIHRoaXMgc2hhcGUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBkYXR1bSAtIFRoZSBkYXR1bSBvciBjYWNoZSBhc3NvY2lhdGVkIHdpdGhcbiAgICogICAgdGhlIHNoYXBlLiBJZiB0aGUgc2hhcGUgaGFzIGNvbGxlY3Rpb24gdHlwZSwgdGhpcyB3aWxsIGJlIHRoZVxuICAgKiAgICBzaW5nbGUgaXRlbSBmcm9tIHRoZSBkYXRhc2V0IHRoYXQgdGhlIHNoYXBlIGlzIGRlZGljYXRlZCB0b1xuICAgKiAgICBkaXNwbGF5aW5nLiBJZiBpdCBoYXMgZW50aXR5IHR5cGUsIHRoZW4gdGhpcyB3aWxsIGJlIHRoZVxuICAgKiAgICBvYmplY3QgcHJldmlvdXNseSByZXR1cm5lZCBmcm9tIHRoZSBzaGFwZSdzIGBlbmNhY2hlYCBtZXRob2RcbiAgICogICAgKGlmIGFueSksIG9yIGVsc2UgdGhlIGVudGl0eSBvYmplY3QgaXRzZWxmLlxuICAgKi9cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtT3JDYWNoZSkge31cblxuICAvKipcbiAgICogSW50ZXJmYWNlIG1ldGhvZCB0byBvdmVycmlkZSBjYWxsZWQgYnkgYExheWVyfmdldEl0ZW1zSW5BcmVhYC4gRGVmaW5lcyBpZlxuICAgKiB0aGUgc2hhcGUgaXMgY29uc2lkZXJlZCB0byBiZSB0aGUgZ2l2ZW4gYXJlYS4gQXJndW1lbnRzIGFyZSBwYXNzZWQgaW4gcGl4ZWwgZG9tYWluLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcmVuZGVyaW5nQ29udGV4dCAtIHRoZSByZW5kZXJpbmdDb250ZXh0IG9mIHRoZSBsYXllciB3aGljaFxuICAgKiAgICBvd25zIHRoaXMgc2hhcGUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBkYXR1bSAtIFRoZSBkYXR1bSBhc3NvY2lhdGVkIHRvIHRoZSBzaGFwZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHgxIC0gVGhlIHggY29tcG9uZW50IG9mIHRoZSB0b3AtbGVmdCBjb3JuZXIgb2YgdGhlIGFyZWEgdG8gdGVzdC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHkxIC0gVGhlIHkgY29tcG9uZW50IG9mIHRoZSB0b3AtbGVmdCBjb3JuZXIgb2YgdGhlIGFyZWEgdG8gdGVzdC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHgyIC0gVGhlIHggY29tcG9uZW50IG9mIHRoZSBib3R0b20tcmlnaHQgY29ybmVyIG9mIHRoZSBhcmVhIHRvIHRlc3QuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB5MiAtIFRoZSB5IGNvbXBvbmVudCBvZiB0aGUgYm90dG9tLXJpZ2h0IGNvcm5lciBvZiB0aGUgYXJlYSB0byB0ZXN0LlxuICAgKiBAcmV0dXJuIHtCb29sZWFufSAtIFJldHVybnMgYHRydWVgIGlmIHRoZSBpcyBjb25zaWRlcmVkIHRvIGJlIGluIHRoZSBnaXZlbiBhcmVhLCBgZmFsc2VgIG90aGVyd2lzZS5cbiAgICovXG4gIGluQXJlYShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSwgeDEsIHkxLCB4MiwgeTIpIHt9XG59XG4iLCJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vYmFzZS1zaGFwZSc7XG5pbXBvcnQgbnMgZnJvbSAnLi4vY29yZS9uYW1lc3BhY2UnO1xuXG5cbi8qKlxuICogQSBzaGFwZSB0byBkaXNwbGF5IGEgY3Vyc29yLlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLWN1cnNvci5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDdXJzb3IgZXh0ZW5kcyBCYXNlU2hhcGUge1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAnY3Vyc29yJzsgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgcmV0dXJuIHsgeDogMCB9O1xuICB9XG5cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjb2xvcjogJyMwMDAwMDAnLFxuICAgICAgb3BhY2l0eTogMVxuICAgIH07XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIGlmICh0aGlzLiRlbCkgeyByZXR1cm4gdGhpcy4kZWw7IH1cblxuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnbGluZScpO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd4JywgMCk7XG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3kxJywgMCk7XG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3kyJywgcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQpO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuICAgIHRoaXMuJGVsLnN0eWxlLnN0cm9rZSA9IHRoaXMucGFyYW1zLmNvbG9yO1xuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtKSB7XG4gICAgY29uc3QgeCA9IE1hdGgucm91bmQocmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLngoZGF0dW0pKSkgKyAwLjU7XG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHt4fSwgMClgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgY3Vyc29yIGNhbm5vdCBiZSBzZWxlY3RlZC5cbiAgICogQHJldHVybiB7Qm9vbGVhbn0gZmFsc2VcbiAgICovXG4gIGluQXJlYSgpIHsgcmV0dXJuIGZhbHNlOyB9XG59XG4iLCJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vYmFzZS1zaGFwZSc7XG5cblxuLyoqXG4gKiBBIHNoYXBlIHRvIGRpc3BsYXkgYSBkb3QuXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItYnJlYWtwb2ludC5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb3QgZXh0ZW5kcyBCYXNlU2hhcGUge1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAnZG90JzsgfVxuXG4gIC8vIEBUT0RPIHJlbmFtZSA6IGNvbmZ1c2lvbiBiZXR3ZWVuIGFjY2Vzc29ycyBhbmQgbWV0YS1hY2Nlc3NvcnNcbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICByZXR1cm4geyBjeDogMCwgY3k6IDAsIHI6IDMsIGNvbG9yOiAnIzAwMDAwMCfCoH07XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuJGVsKSB7IHJldHVybiB0aGlzLiRlbDsgfVxuXG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2NpcmNsZScpO1xuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtKSB7XG4gICAgY29uc3QgY3ggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMuY3goZGF0dW0pKTtcbiAgICBjb25zdCBjeSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHRoaXMuY3koZGF0dW0pKTtcbiAgICBjb25zdCByICA9IHRoaXMucihkYXR1bSk7XG4gICAgY29uc3QgY29sb3IgPSB0aGlzLmNvbG9yKGRhdHVtKTtcblxuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7Y3h9LCAke2N5fSlgKTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAncicsIHIpO1xuICAgIHRoaXMuJGVsLnN0eWxlLmZpbGwgPSBjb2xvcjtcbiAgfVxuXG4gIC8vIHgxLCB4MiwgeTEsIHkyID0+IGluIHBpeGVsIGRvbWFpblxuICBpbkFyZWEocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0sIHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgY29uc3QgY3ggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMuY3goZGF0dW0pKTtcbiAgICBjb25zdCBjeSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHRoaXMuY3koZGF0dW0pKTtcblxuICAgIGlmICgoY3ggPiB4MSAmJiBjeCA8IHgyKSAmJiAoY3kgPiB5MSAmJiBjeSA8IHkyKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG4iLCJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vYmFzZS1zaGFwZSc7XG5cblxuLyoqXG4gKiBBIHNoYXBlIHRvIGRpc3BsYXkgYSBsaW5lLiBJdHMgbWFpbiB1c2UgaXMgYXMgY29tbW9uIHNoYXBlIHRvIGNyZWF0ZSBhXG4gKiBicmVha3BvaW50IHZpc3VhbGl6YXRpb24uIChlbnRpdHkgc2hhcGUpXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItYnJlYWtwb2ludC5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5lIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ2xpbmUnOyB9XG5cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICByZXR1cm4geyBjeDogMCwgY3k6IDAgfTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4geyBjb2xvcjogJyMwMDAwMDAnIH07XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIGlmICh0aGlzLiRlbCkgeyByZXR1cm4gdGhpcy4kZWw7IH1cblxuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdwYXRoJyk7XG4gICAgLy8gdGhpcy5lbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc2hhcGUtcmVuZGVyaW5nJywgJ2NyaXNwRWRnZXMnKTtcbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkge1xuICAgIFxuICAgIGNvbnN0IGJlZm9yZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gICAgZGF0YSA9IGRhdGEuc2xpY2UoMCk7XG4gICAgZGF0YS5zb3J0KChhLCBiKSA9PiB0aGlzLmN4KGEpIDwgdGhpcy5jeChiKSA/IC0xIDogMSk7XG5cbiAgICBjb25zdCBtaW5YID0gTWF0aC5mbG9vcihyZW5kZXJpbmdDb250ZXh0Lm1pblgpO1xuICAgIGNvbnN0IG1heFggPSBNYXRoLmZsb29yKHJlbmRlcmluZ0NvbnRleHQubWF4WCk7XG5cbiAgICBsZXQgaW5zdHJ1Y3Rpb25zID0gW107XG4gICAgY29uc3QgbiA9IGRhdGEubGVuZ3RoO1xuXG4gICAgaWYgKG4gPiAwKSB7XG5cbiAgICAgIC8vIFdlIHdhbnQgdG8gc3RhcnQgd2l0aCB0aGUgbGFzdCBlbGVtZW50IHRvIHRoZSBsZWZ0IG9mIHRoZVxuICAgICAgLy8gdmlzaWJsZSByZWdpb24sIGFuZCBlbmQgd2l0aCB0aGUgZmlyc3QgZWxlbWVudCBiZXlvbmQgdGhlXG4gICAgICAvLyByaWdodCBvZiBpdFxuICAgICAgXG4gICAgICBsZXQgbmV4dFggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMuY3goZGF0YVswXSkpO1xuICAgIFxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyArK2kpIHtcblxuICAgICAgICBjb25zdCB4ID0gbmV4dFg7XG5cbiAgICAgICAgaWYgKGkgKyAxIDwgbikge1xuICAgICAgICAgIG5leHRYID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLmN4KGRhdGFbaSsxXSkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChuZXh0WCA8IG1pblgpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHkgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCh0aGlzLmN5KGRhdGFbaV0pKSAtIDAuNTtcblxuICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChgJHt4fSwke3l9YCk7XG4gICAgICAgIFxuICAgICAgICBpZiAoeCA+IG1heFgpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gICAgICAgICAgXG5cbiAgICBjb25zb2xlLmxvZyhcImxpbmUgaW5zdHJ1Y3Rpb25zIGhhdmUgXCIgKyBpbnN0cnVjdGlvbnMubGVuZ3RoICsgXCIgZWxlbWVudHNcIik7XG4gICAgXG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLCAnTScgKyBpbnN0cnVjdGlvbnMuam9pbignTCcpKTtcblxuICAgIHRoaXMuJGVsLnN0eWxlLnN0cm9rZSA9IHRoaXMucGFyYW1zLmNvbG9yO1xuICAgIHRoaXMuJGVsLnN0eWxlLnN0cm9rZVdpZHRoID0gMjtcbiAgICB0aGlzLiRlbC5zdHlsZS5maWxsID0gJ25vbmUnO1xuXG4gICAgY29uc3QgYWZ0ZXIgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICBjb25zb2xlLmxvZyhcImxpbmUgdXBkYXRlIHRpbWUgPSBcIiArIE1hdGgucm91bmQoYWZ0ZXIgLSBiZWZvcmUpKTtcbiAgICBcbiAgICBkYXRhID0gbnVsbDtcbiAgfVxuXG4gIC8vIGJ1aWxkcyB0aGUgYHBhdGguZGAgYXR0cmlidXRlXG4gIC8vIEBUT0RPIGNyZWF0ZSBzb21lIFNoYXBlSGVscGVyID9cbiAgX2J1aWxkTGluZShyZW5kZXJpbmdDb250ZXh0LCBkYXRhKSB7XG4gICAgaWYgKCFkYXRhLmxlbmd0aCkgeyByZXR1cm4gJyc7IH1cbiAgICAvLyBzb3J0IGRhdGFcbiAgICBsZXQgaW5zdHJ1Y3Rpb25zID0gZGF0YS5tYXAoKGRhdHVtLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy5jeChkYXR1bSkpO1xuICAgICAgY29uc3QgeSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHRoaXMuY3koZGF0dW0pKSAtIDAuNTtcbiAgICAgIHJldHVybiBgJHt4fSwke3l9YDtcbiAgICB9KTtcblxuICAgIHJldHVybiAnTScgKyBpbnN0cnVjdGlvbnMuam9pbignTCcpO1xuICB9XG59XG4iLCJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vYmFzZS1zaGFwZSc7XG5cblxuLyoqXG4gKiBBIHNoYXBlIHRvIGRpc3BsYXkgYSBtYXJrZXIuXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItbWFya2VyLmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcmtlciBleHRlbmRzIEJhc2VTaGFwZSB7XG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICdtYXJrZXInOyB9XG5cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICByZXR1cm4geyB4OiAwLCBjb2xvcjogJyNmZjAwMDAnIH07XG4gIH1cblxuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhhbmRsZXJXaWR0aDogNyxcbiAgICAgIGhhbmRsZXJIZWlnaHQ6IDEwLFxuICAgICAgZGlzcGxheUhhbmRsZXJzOiB0cnVlLFxuICAgICAgb3BhY2l0eTogMSxcbiAgICAgIGNvbG9yOiAncmVkJyxcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICBpZiAodGhpcy4kZWwpIHsgcmV0dXJuIHRoaXMuJGVsOyB9XG5cbiAgICBjb25zb2xlLmxvZyhcIm1hcmtlciByZW5kZXJcIik7XG4gICAgXG4gICAgY29uc3QgaGVpZ2h0ID0gcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQ7XG5cbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnZycpO1xuICAgIHRoaXMuJGxpbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2xpbmUnKTtcblxuICAgIC8vIGRyYXcgbGluZVxuICAgIHRoaXMuJGxpbmUuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3gnLCAwKTtcbiAgICB0aGlzLiRsaW5lLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5MScsIDApO1xuICAgIHRoaXMuJGxpbmUuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3kyJywgaGVpZ2h0KTtcbiAgICB0aGlzLiRsaW5lLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuXG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kbGluZSk7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuZGlzcGxheUhhbmRsZXJzKSB7XG4gICAgICB0aGlzLiRoYW5kbGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdyZWN0Jyk7XG5cbiAgICAgIHRoaXMuJGhhbmRsZXIuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3gnLCAtKCh0aGlzLnBhcmFtcy5oYW5kbGVyV2lkdGgpIC8gMiApKTtcbiAgICAgIHRoaXMuJGhhbmRsZXIuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3knLCByZW5kZXJpbmdDb250ZXh0LmhlaWdodCAtIHRoaXMucGFyYW1zLmhhbmRsZXJIZWlnaHQpO1xuICAgICAgdGhpcy4kaGFuZGxlci5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB0aGlzLnBhcmFtcy5oYW5kbGVyV2lkdGgpO1xuICAgICAgdGhpcy4kaGFuZGxlci5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgdGhpcy5wYXJhbXMuaGFuZGxlckhlaWdodCk7XG4gICAgICB0aGlzLiRoYW5kbGVyLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuXG4gICAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRoYW5kbGVyKTtcbiAgICB9XG5cbiAgICB0aGlzLiRlbC5zdHlsZS5vcGFjaXR5ID0gdGhpcy5wYXJhbXMub3BhY2l0eTtcblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSkge1xuXG4gICAgY29uc29sZS5sb2coXCJtYXJrZXIgdXBkYXRlXCIpO1xuICAgIFxuICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMueChkYXR1bSkpIC0gMC41O1xuXG4gICAgY29uc3QgbWluWCA9IHJlbmRlcmluZ0NvbnRleHQubWluWDtcbiAgICBjb25zdCBtYXhYID0gcmVuZGVyaW5nQ29udGV4dC5tYXhYO1xuXG4gICAgaWYgKHggPCBtaW5YIHx8IHggPiBtYXhYKSB7XG5cbiAgICAgIHRoaXMuJGVsLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgIHRoaXMuJGVsLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG4gICAgXG4gICAgICBjb25zdCBjb2xvciA9IHRoaXMuY29sb3IoZGF0dW0pO1xuICAgICAgXG4gICAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke3h9LCAwKWApO1xuICAgICAgdGhpcy4kbGluZS5zdHlsZS5zdHJva2UgPSBjb2xvcjtcblxuICAgICAgaWYgKHRoaXMucGFyYW1zLmRpc3BsYXlIYW5kbGVycykge1xuICAgICAgICB0aGlzLiRoYW5kbGVyLnN0eWxlLmZpbGwgPSBjb2xvcjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpbkFyZWEocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0sIHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgLy8gaGFuZGxlcnMgb25seSBhcmUgc2VsZWN0YWJsZVxuICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMueChkYXR1bSkpO1xuICAgIGNvbnN0IHNoYXBlWDEgPSB4IC0gKHRoaXMucGFyYW1zLmhhbmRsZXJXaWR0aCAtIDEpIC8gMjtcbiAgICBjb25zdCBzaGFwZVgyID0gc2hhcGVYMSArIHRoaXMucGFyYW1zLmhhbmRsZXJXaWR0aDtcbiAgICBjb25zdCBzaGFwZVkxID0gcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQgLSB0aGlzLnBhcmFtcy5oYW5kbGVySGVpZ2h0O1xuICAgIGNvbnN0IHNoYXBlWTIgPSByZW5kZXJpbmdDb250ZXh0LmhlaWdodDtcblxuICAgIGNvbnN0IHhPdmVybGFwID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oeDIsIHNoYXBlWDIpIC0gTWF0aC5tYXgoeDEsIHNoYXBlWDEpKTtcbiAgICBjb25zdCB5T3ZlcmxhcCA9IE1hdGgubWF4KDAsIE1hdGgubWluKHkyLCBzaGFwZVkyKSAtIE1hdGgubWF4KHkxLCBzaGFwZVkxKSk7XG4gICAgY29uc3QgYXJlYSA9IHhPdmVybGFwICogeU92ZXJsYXA7XG5cbiAgICByZXR1cm4gYXJlYSA+IDA7XG4gIH1cbn1cbiIsIlxuaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuL2Jhc2Utc2hhcGUnO1xuaW1wb3J0IFRpbWVsaW5lVGltZUNvbnRleHQgZnJvbSAnLi4vY29yZS90aW1lbGluZS10aW1lLWNvbnRleHQnO1xuaW1wb3J0IExheWVyVGltZUNvbnRleHQgZnJvbSAnLi4vY29yZS9sYXllci10aW1lLWNvbnRleHQnO1xuaW1wb3J0IFBOR0VuY29kZXIgZnJvbSAnLi4vdXRpbHMvcG5nLmpzJztcblxuY29uc3QgeGh0bWxOUyA9ICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWF0cml4IGV4dGVuZHMgQmFzZVNoYXBlIHtcblxuICBnZXRDbGFzc05hbWUoKSB7XG4gICAgcmV0dXJuICdtYXRyaXgnO1xuICB9XG5cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICAvLyByZXR1cm4geyB5OiAwIH07XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgLy8gVE9ETyBkZXRlcm1pbmUgc3VpdGFibGUgaW1wbGVtZW50YXRpb25zIGZvciBfZ2V0QWNjZXNzb3JMaXN0IGFuZCBfZ2V0RGVmYXVsdHNcbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBub3JtYWxpc2U6ICdub25lJyxcbiAgICAgIG1hcHBlcjogKHZhbHVlID0+IHtcbiAgICAgICAgLy8gVGhlIG1hcHBlciBhY2NlcHRzIGEgdmFsdWUsIHdoaWNoIGlzIGd1YXJhbnRlZWQgdG8gYmUgaW5cbiAgICAgICAgLy8gdGhlIHJhbmdlIFswLDFdLCBhbmQgcmV0dXJucyByLCBnLCBiIGNvbXBvbmVudHMgd2hpY2ggYXJlXG4gICAgICAgIC8vIGFsc28gaW4gdGhlIHJhbmdlIFswLDFdLiBUaGlzIGV4YW1wbGUgbWFwcGVyIGp1c3QgcmV0dXJucyBhXG4gICAgICAgIC8vIGdyZXkgbGV2ZWwuXG4gICAgICAgIGxldCBsZXZlbCA9IDEuMCAtIHZhbHVlO1xuICAgICAgICByZXR1cm4gWyBsZXZlbCwgbGV2ZWwsIGxldmVsIF07XG4gICAgICB9KSxcbiAgICAgIGdhaW46IDEuMFxuICAgIH07XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ3R4KSB7XG4gICAgY29uc29sZS5sb2coXCJtYXRyaXggcmVuZGVyIGNhbGxlZFwiKTtcbiAgICBpZiAodGhpcy4kZWwpIHsgcmV0dXJuIHRoaXMuJGVsOyB9XG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2cnKTtcbiAgICB0aGlzLmxhc3RVcGRhdGVIb3AgPSAwO1xuICAgIGNvbnNvbGUubG9nKFwibWF0cml4IHJlbmRlciByZXR1cm5pbmdcIik7XG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgX2h5YnJpZE5vcm1hbGlzZShnYWluKSB7XG4gICAgcmV0dXJuIChjb2wgPT4ge1xuICAgICAgbGV0IG1heCA9IDAuMDtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29sLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IE1hdGguYWJzKGNvbFtpXSk7XG4gICAgICAgIGlmICh2YWx1ZSA+IG1heCkge1xuICAgICAgICAgIG1heCA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsZXQgc2NhbGUgPSBnYWluO1xuICAgICAgaWYgKG1heCA+IDAuMCkge1xuICAgICAgICBzY2FsZSA9IHNjYWxlICogKE1hdGgubG9nMTAobWF4ICsgMS4wKSAvIG1heCk7XG4gICAgICB9XG4gICAgICBsZXQgbiA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb2wubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gY29sW2ldO1xuICAgICAgICBuLnB1c2godmFsdWUgKiBzY2FsZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbjtcbiAgICB9KTtcbiAgfVxuXG4gIF9jb2x1bW5Ob3JtYWxpc2UoZ2Fpbikge1xuICAgIHJldHVybiAoY29sID0+IHtcbiAgICAgIGxldCBtYXggPSAwLjA7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbC5sZW5ndGg7ICsraSkge1xuICAgICAgICBsZXQgdmFsdWUgPSBNYXRoLmFicyhjb2xbaV0pO1xuICAgICAgICBpZiAodmFsdWUgPiBtYXgpIHtcbiAgICAgICAgICBtYXggPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGV0IHNjYWxlID0gZ2FpbjtcbiAgICAgIGlmIChtYXggPiAwLjApIHtcbiAgICAgICAgc2NhbGUgPSBzY2FsZSAqICgxLjAgLyBtYXgpO1xuICAgICAgfVxuICAgICAgbGV0IG4gPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29sLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IGNvbFtpXTtcbiAgICAgICAgbi5wdXNoKHZhbHVlICogc2NhbGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG47XG4gICAgfSk7XG4gIH0gICAgICBcbiAgXG4gIF9ub05vcm1hbGlzZShnYWluKSB7XG4gICAgcmV0dXJuIChjb2wgPT4ge1xuICAgICAgbGV0IG4gPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29sLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IGNvbFtpXTtcbiAgICAgICAgbi5wdXNoKHZhbHVlICogZ2Fpbik7XG4gICAgICB9XG4gICAgICByZXR1cm4gbjtcbiAgICB9KTtcbiAgfSAgICAgIFxuICBcbiAgZW5jYWNoZShtYXRyaXhFbnRpdHkpIHtcblxuICAgIGNvbnN0IGJlZm9yZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gICAgY29uc29sZS5sb2coXCJtYXRyaXggY2FjaGUgY2FsbGVkXCIpO1xuXG4gICAgY29uc3QgaGVpZ2h0ID0gbWF0cml4RW50aXR5LmdldENvbHVtbkhlaWdodCgpO1xuICAgIGNvbnN0IHRvdGFsV2lkdGggPSBtYXRyaXhFbnRpdHkuZ2V0Q29sdW1uQ291bnQoKTtcbiAgICBsZXQgdGlsZVdpZHRoID0gMTAwO1xuICAgIGlmICh0b3RhbFdpZHRoIDwgdGlsZVdpZHRoICogMikge1xuICAgICAgdGlsZVdpZHRoID0gdG90YWxXaWR0aDtcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyhcInRvdGFsV2lkdGggPSBcIiArIHRvdGFsV2lkdGggKyBcIiwgdGlsZVdpZHRoID0gXCIgKyB0aWxlV2lkdGgpO1xuXG4gICAgbGV0IHJlc291cmNlcyA9IFtdO1xuICAgIGxldCB3aWR0aHMgPSBbXTtcblxuICAgIGxldCBub3JtYWxpc2UgPSBudWxsO1xuXG4gICAgc3dpdGNoICh0aGlzLnBhcmFtcy5ub3JtYWxpc2UpIHtcbiAgICBjYXNlICdoeWJyaWQnOlxuICAgICAgbm9ybWFsaXNlID0gdGhpcy5faHlicmlkTm9ybWFsaXNlKHRoaXMucGFyYW1zLmdhaW4pO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnY29sdW1uJzpcbiAgICAgIG5vcm1hbGlzZSA9IHRoaXMuX2NvbHVtbk5vcm1hbGlzZSh0aGlzLnBhcmFtcy5nYWluKTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBub3JtYWxpc2UgPSB0aGlzLl9ub05vcm1hbGlzZSh0aGlzLnBhcmFtcy5nYWluKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbmRpdGlvbiA9IChjb2wgPT4ge1xuICAgICAgbGV0IG4gPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29sLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGlmIChjb2xbaV0gPT09IEluZmluaXR5IHx8IGlzTmFOKGNvbFtpXSkpIG4ucHVzaCgwLjApO1xuICAgICAgICBlbHNlIG4ucHVzaChjb2xbaV0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG47XG4gICAgfSk7XG5cbiAgICBmb3IgKGxldCB4MCA9IDA7IHgwIDwgdG90YWxXaWR0aDsgeDAgKz0gdGlsZVdpZHRoKSB7XG5cbiAgICAgIGxldCB3ID0gdGlsZVdpZHRoO1xuICAgICAgaWYgKHRvdGFsV2lkdGggLSB4MCA8IHRpbGVXaWR0aCkge1xuXHR3ID0gdG90YWxXaWR0aCAtIHgwO1xuICAgICAgfVxuICAgICAgXG4gICAgICBsZXQgcCA9IG5ldyBQTkdFbmNvZGVyKHcsIGhlaWdodCwgMjU2KTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3OyArK2kpIHtcblxuXHRjb25zdCB4ID0geDAgKyBpO1xuICAgICAgICBsZXQgY29sID0gbWF0cml4RW50aXR5LmdldENvbHVtbih4KTtcbiAgICAgICAgY29sID0gbm9ybWFsaXNlKGNvbmRpdGlvbihjb2wpKTtcbiAgICAgICAgXG5cdGZvciAobGV0IHkgPSAwOyB5IDwgaGVpZ2h0OyArK3kpIHtcbiAgICAgICAgICBsZXQgdmFsdWUgPSBjb2xbeV07XG4gICAgICAgICAgLy8gVGhlIHZhbHVlIG11c3QgYmUgaW4gdGhlIHJhbmdlIFswLDFdIHRvIHBhc3MgdG8gdGhlXG4gICAgICAgICAgLy8gbWFwcGVyLiBXZSBhbHNvIHF1YW50aXplIHRoZSByYW5nZSwgYXMgdGhlIFBORyBlbmNvZGVyXG4gICAgICAgICAgLy8gdXNlcyBhIDI1Ni1sZXZlbCBwYWxldHRlLlxuICAgICAgICAgIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMDtcbiAgICAgICAgICBpZiAodmFsdWUgPiAxKSB2YWx1ZSA9IDE7XG4gICAgICAgICAgdmFsdWUgPSBNYXRoLnJvdW5kKHZhbHVlICogMjU1KSAvIDI1NTtcbiAgICAgICAgICBsZXQgWyByLCBnLCBiIF0gPSB0aGlzLnBhcmFtcy5tYXBwZXIodmFsdWUpO1xuICAgICAgICAgIGlmIChyIDwgMCkgciA9IDA7XG4gICAgICAgICAgaWYgKHIgPiAxKSByID0gMTtcbiAgICAgICAgICBpZiAoZyA8IDApIGcgPSAwO1xuICAgICAgICAgIGlmIChnID4gMSkgZyA9IDE7XG4gICAgICAgICAgaWYgKGIgPCAwKSBiID0gMDtcbiAgICAgICAgICBpZiAoYiA+IDEpIGIgPSAxO1xuICAgICAgICAgIGNvbnN0IGNvbG91ciA9IHAuY29sb3IoTWF0aC5yb3VuZChyICogMjU1KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGgucm91bmQoZyAqIDI1NSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnJvdW5kKGIgKiAyNTUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMjU1KTtcbiAgICAgICAgICBjb25zdCBpbmRleCA9IHAuaW5kZXgoaSwgeSk7XG5cdCAgcC5idWZmZXJbaW5kZXhdID0gY29sb3VyO1xuXHR9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlc291cmNlID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCwnICsgcC5nZXRCYXNlNjQoKTtcbiAgICAgIHJlc291cmNlcy5wdXNoKHJlc291cmNlKTtcbiAgICAgIHdpZHRocy5wdXNoKHcpO1xuXG4gICAgICBjb25zb2xlLmxvZyhcImltYWdlIFwiICsgcmVzb3VyY2VzLmxlbmd0aCArIFwiOiBsZW5ndGggXCIgKyByZXNvdXJjZS5sZW5ndGggK1xuXHRcdCAgXCIgKGRpbWVuc2lvbnMgXCIgKyB3ICsgXCIgeCBcIiArIGhlaWdodCArIFwiKVwiKTtcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyhcImRyYXdpbmcgY29tcGxldGVcIik7XG5cbiAgICBjb25zdCBhZnRlciA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIGNvbnNvbGUubG9nKFwibWF0cml4IGNhY2hlIHRpbWUgPSBcIiArIE1hdGgucm91bmQoYWZ0ZXIgLSBiZWZvcmUpKTtcbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgcmVzb3VyY2VzOiByZXNvdXJjZXMsXG4gICAgICB0aWxlV2lkdGhzOiB3aWR0aHMsXG4gICAgICB0b3RhbFdpZHRoOiB0b3RhbFdpZHRoLFxuICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICBzdGFydFRpbWU6IG1hdHJpeEVudGl0eS5nZXRTdGFydFRpbWUoKSxcbiAgICAgIHN0ZXBEdXJhdGlvbjogbWF0cml4RW50aXR5LmdldFN0ZXBEdXJhdGlvbigpLFxuICAgICAgZWxlbWVudHM6IFtdIC8vIHdpbGwgYmUgaW5zdGFsbGVkIGluIGZpcnN0IGNhbGwgdG8gdXBkYXRlXG4gICAgfTtcbiAgfVxuICBcbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGNhY2hlKSB7XG5cbiAgICBjb25zdCBiZWZvcmUgPSBwZXJmb3JtYW5jZS5ub3coKTtcblxuICAgIGNvbnNvbGUubG9nKFwibWF0cml4IHVwZGF0ZSBjYWxsZWRcIik7XG5cbiAgICBpZiAoIWNhY2hlLnRvdGFsV2lkdGggfHwgIWNhY2hlLmhlaWdodCB8fFxuXHQhcmVuZGVyaW5nQ29udGV4dC53aWR0aCB8fCAhcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwibm90aGluZyB0byB1cGRhdGVcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaG9wID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCgxKSAtIHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoMCk7XG4gICAgaWYgKGhvcCA9PT0gdGhpcy5sYXN0VXBkYXRlSG9wKSB7XG4gICAgICBjb25zb2xlLmxvZyhcInpvb20gbGV2ZWwgdW5jaGFuZ2VkLCBzdGlsbCBhIGhvcCBvZiBcIiArIGhvcCArIFwiIHBwc1wiKTtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sYXN0VXBkYXRlSG9wID0gaG9wO1xuICAgIH1cbiAgICBcbiAgICBpZiAoY2FjaGUuZWxlbWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkFib3V0IHRvIGFkZCBcIiArIGNhY2hlLnJlc291cmNlcy5sZW5ndGggK1xuXHRcdCAgXCIgaW1hZ2UgcmVzb3VyY2VzIHRvIFNWRy4uLlwiKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2FjaGUucmVzb3VyY2VzLmxlbmd0aDsgKytpKSB7XG5cdGNvbnN0IHJlc291cmNlID0gY2FjaGUucmVzb3VyY2VzW2ldO1xuXHRjb25zdCBlbHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2ltYWdlJyk7XG5cdGVsdC5zZXRBdHRyaWJ1dGVOUygnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycsICdocmVmJywgcmVzb3VyY2UpO1xuICAgICAgICBlbHQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAnbm9uZScpO1xuXHRlbHQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ltYWdlLXJlbmRlcmluZycsICdvcHRpbWl6ZVNwZWVkJyk7XG5cdGVsdC5hZGRFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCBlID0+IHsgZS5wcmV2ZW50RGVmYXVsdCgpOyB9LCBmYWxzZSk7XG5cdHRoaXMuJGVsLmFwcGVuZENoaWxkKGVsdCk7XG5cdGNhY2hlLmVsZW1lbnRzLnB1c2goZWx0KTtcbiAgICAgIH1cbiAgICAgIGNvbnNvbGUubG9nKFwiRG9uZSB0aGF0XCIpO1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKFwiUmVuZGVyIHdpZHRoID0gXCIgKyByZW5kZXJpbmdDb250ZXh0LndpZHRoKTtcblxuICAgIGxldCBzdGFydFggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKGNhY2hlLnN0YXJ0VGltZSk7XG4gICAgY29uc3QgZHJhd25XaWR0aCA9IHJlbmRlcmluZ0NvbnRleHQud2lkdGggLSBzdGFydFg7XG4gICAgbGV0IHdpZHRoU2NhbGVGYWN0b3IgPSBkcmF3bldpZHRoIC8gY2FjaGUudG90YWxXaWR0aDtcblxuICAgIGlmIChjYWNoZS5zdGVwRHVyYXRpb24gPiAwKSB7XG4gICAgICBsZXQgdG90YWxEdXJhdGlvbiA9IGNhY2hlLnN0ZXBEdXJhdGlvbiAqIGNhY2hlLnRvdGFsV2lkdGg7XG4gICAgICBsZXQgZW5kWCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoY2FjaGUuc3RhcnRUaW1lICsgdG90YWxEdXJhdGlvbik7XG4gICAgICB3aWR0aFNjYWxlRmFjdG9yID0gKGVuZFggLSBzdGFydFgpIC8gY2FjaGUudG90YWxXaWR0aDtcbiAgICB9XG4gICAgXG4gICAgbGV0IHdpZHRoQWNjdW11bGF0ZWQgPSAwO1xuICAgIFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2FjaGUuZWxlbWVudHMubGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IGVsdCA9IGNhY2hlLmVsZW1lbnRzW2ldO1xuICAgICAgY29uc3QgdGlsZVdpZHRoID0gY2FjaGUudGlsZVdpZHRoc1tpXTtcbiAgICAgIGNvbnN0IHggPSBzdGFydFggKyB3aWR0aEFjY3VtdWxhdGVkICogd2lkdGhTY2FsZUZhY3RvcjtcbiAgICAgIGNvbnN0IHcgPSB0aWxlV2lkdGggKiB3aWR0aFNjYWxlRmFjdG9yO1xuICAgICAgZWx0LnNldEF0dHJpYnV0ZU5TKG51bGwsICd4JywgTWF0aC5mbG9vcih4KSk7XG4gICAgICBlbHQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgTWF0aC5jZWlsKHggKyB3KSAtIE1hdGguZmxvb3IoeCkpO1xuICAgICAgZWx0LnNldEF0dHJpYnV0ZU5TKG51bGwsICd5JywgMCk7XG4gICAgICBlbHQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0KTtcbiAgICAgIHdpZHRoQWNjdW11bGF0ZWQgKz0gdGlsZVdpZHRoO1xuICAgIH1cbiAgICBcbiAgICBjb25zdCBhZnRlciA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIGNvbnNvbGUubG9nKFwibWF0cml4IHVwZGF0ZSB0aW1lID0gXCIgKyBNYXRoLnJvdW5kKGFmdGVyIC0gYmVmb3JlKSk7XG4gIH1cbn1cbiIsImltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9iYXNlLXNoYXBlJztcblxuXG4vKipcbiAqIEEgc2hhcGUgdG8gZGlzcGxheSBhIHNlZ21lbnQuXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItc2VnbWVudC5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWdtZW50IGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ3NlZ21lbnQnOyB9XG5cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICByZXR1cm4geyB4OiAwLCB5OiAwLCB3aWR0aDogMCwgaGVpZ2h0OiAxLCBjb2xvcjogJyMwMDAwMDAnLCBvcGFjaXR5OiAxIH07XG4gIH1cblxuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRpc3BsYXlIYW5kbGVyczogdHJ1ZSxcbiAgICAgIGhhbmRsZXJXaWR0aDogMixcbiAgICAgIGhhbmRsZXJPcGFjaXR5OiAwLjgsXG4gICAgICBvcGFjaXR5OiAwLjZcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICBpZiAodGhpcy4kZWwpIHsgcmV0dXJuIHRoaXMuJGVsOyB9XG5cbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnZycpO1xuXG4gICAgdGhpcy4kc2VnbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncmVjdCcpO1xuICAgIHRoaXMuJHNlZ21lbnQuY2xhc3NMaXN0LmFkZCgnc2VnbWVudCcpO1xuICAgIHRoaXMuJHNlZ21lbnQuc3R5bGUub3BhY2l0eSA9IHRoaXMucGFyYW1zLm9wYWNpdHk7XG4gICAgdGhpcy4kc2VnbWVudC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc2hhcGUtcmVuZGVyaW5nJywgJ2NyaXNwRWRnZXMnKTtcblxuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRoaXMuJHNlZ21lbnQpO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLmRpc3BsYXlIYW5kbGVycykge1xuICAgICAgdGhpcy4kbGVmdEhhbmRsZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ3JlY3QnKTtcbiAgICAgIHRoaXMuJGxlZnRIYW5kbGVyLmNsYXNzTGlzdC5hZGQoJ2xlZnQnLCAnaGFuZGxlcicpO1xuICAgICAgdGhpcy4kbGVmdEhhbmRsZXIuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgdGhpcy5wYXJhbXMuaGFuZGxlcldpZHRoKTtcbiAgICAgIHRoaXMuJGxlZnRIYW5kbGVyLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuICAgICAgdGhpcy4kbGVmdEhhbmRsZXIuc3R5bGUub3BhY2l0eSA9IHRoaXMucGFyYW1zLmhhbmRsZXJPcGFjaXR5O1xuICAgICAgdGhpcy4kbGVmdEhhbmRsZXIuc3R5bGUuY3Vyc29yID0gJ2V3LXJlc2l6ZSc7XG5cbiAgICAgIHRoaXMuJHJpZ2h0SGFuZGxlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncmVjdCcpO1xuICAgICAgdGhpcy4kcmlnaHRIYW5kbGVyLmNsYXNzTGlzdC5hZGQoJ3JpZ2h0JywgJ2hhbmRsZXInKTtcbiAgICAgIHRoaXMuJHJpZ2h0SGFuZGxlci5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB0aGlzLnBhcmFtcy5oYW5kbGVyV2lkdGgpO1xuICAgICAgdGhpcy4kcmlnaHRIYW5kbGVyLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuICAgICAgdGhpcy4kcmlnaHRIYW5kbGVyLnN0eWxlLm9wYWNpdHkgPSB0aGlzLnBhcmFtcy5oYW5kbGVyT3BhY2l0eTtcbiAgICAgIHRoaXMuJHJpZ2h0SGFuZGxlci5zdHlsZS5jdXJzb3IgPSAnZXctcmVzaXplJztcblxuICAgICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kbGVmdEhhbmRsZXIpO1xuICAgICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kcmlnaHRIYW5kbGVyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0pIHtcbiAgICBjb25zdCB4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLngoZGF0dW0pKTtcbiAgICBjb25zdCB5ID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwodGhpcy55KGRhdHVtKSk7XG5cbiAgICBjb25zdCB3aWR0aCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy53aWR0aChkYXR1bSkpO1xuICAgIGNvbnN0IGhlaWdodCA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHRoaXMuaGVpZ2h0KGRhdHVtKSk7XG4gICAgY29uc3QgY29sb3IgPSB0aGlzLmNvbG9yKGRhdHVtKTtcbiAgICBjb25zdCBvcGFjaXR5ID0gdGhpcy5vcGFjaXR5KGRhdHVtKTtcblxuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7eH0sICR7eX0pYCk7XG4gICAgdGhpcy4kZWwuc3R5bGUub3BhY2l0eSA9IG9wYWNpdHk7XG5cbiAgICB0aGlzLiRzZWdtZW50LnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIE1hdGgubWF4KHdpZHRoLCAwKSk7XG4gICAgdGhpcy4kc2VnbWVudC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgaGVpZ2h0KTtcbiAgICB0aGlzLiRzZWdtZW50LnN0eWxlLmZpbGwgPSBjb2xvcjtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5kaXNwbGF5SGFuZGxlcnMpIHtcbiAgICAgIC8vIGRpc3BsYXkgaGFuZGxlcnNcbiAgICAgIHRoaXMuJGxlZnRIYW5kbGVyLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBoZWlnaHQpO1xuICAgICAgdGhpcy4kbGVmdEhhbmRsZXIuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwgMCknKTtcbiAgICAgIHRoaXMuJGxlZnRIYW5kbGVyLnN0eWxlLmZpbGwgPSBjb2xvcjtcblxuICAgICAgY29uc3QgcmlnaHRIYW5kbGVyVHJhbnNsYXRlID0gYHRyYW5zbGF0ZSgke3dpZHRoIC0gdGhpcy5wYXJhbXMuaGFuZGxlcldpZHRofSwgMClgO1xuICAgICAgdGhpcy4kcmlnaHRIYW5kbGVyLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBoZWlnaHQpO1xuICAgICAgdGhpcy4kcmlnaHRIYW5kbGVyLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCByaWdodEhhbmRsZXJUcmFuc2xhdGUpO1xuICAgICAgdGhpcy4kcmlnaHRIYW5kbGVyLnN0eWxlLmZpbGwgPSBjb2xvcjtcbiAgICB9XG4gIH1cblxuICBpbkFyZWEocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0sIHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgY29uc3Qgc2hhcGVYMSA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy54KGRhdHVtKSk7XG4gICAgY29uc3Qgc2hhcGVYMiA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy54KGRhdHVtKSArIHRoaXMud2lkdGgoZGF0dW0pKTtcbiAgICBjb25zdCBzaGFwZVkxID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwodGhpcy55KGRhdHVtKSk7XG4gICAgY29uc3Qgc2hhcGVZMiA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHRoaXMueShkYXR1bSkgKyB0aGlzLmhlaWdodChkYXR1bSkpO1xuXG4gICAgLy8gaHR0cDovL2pzZmlkZGxlLm5ldC91dGh5Wi8gLSBjaGVjayBvdmVybGFwaW5nIGFyZWFcbiAgICBjb25zdCB4T3ZlcmxhcCA9IE1hdGgubWF4KDAsIE1hdGgubWluKHgyLCBzaGFwZVgyKSAtIE1hdGgubWF4KHgxLCBzaGFwZVgxKSk7XG4gICAgY29uc3QgeU92ZXJsYXAgPSBNYXRoLm1heCgwLCBNYXRoLm1pbih5Miwgc2hhcGVZMikgLSBNYXRoLm1heCh5MSwgc2hhcGVZMSkpO1xuICAgIGNvbnN0IGFyZWEgPSB4T3ZlcmxhcCAqIHlPdmVybGFwO1xuXG4gICAgcmV0dXJuIGFyZWEgPiAwO1xuICB9XG59XG4iLCJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vYmFzZS1zaGFwZSc7XG5cbi8qKlxuICogS2luZCBvZiBNYXJrZXIgZm9yIGVudGl0eSBvcmllbnRlZCBkYXRhLiBVc2VmdWxsIHRvIGRpc3BsYXkgYSBncmlkLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaWNrcyBleHRlbmRzIEJhc2VTaGFwZSB7XG4gIF9nZXRDbGFzc05hbWUoKSB7XG4gICAgcmV0dXJuICd0aWNrJztcbiAgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgcmV0dXJuIHsgdGltZTogMCwgZm9jdXNlZDogdHJ1ZSwgbGFiZWw6ICcnIH07XG4gIH1cblxuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbG9yOiAnc3RlZWxibHVlJyxcbiAgICAgIGZvY3VzZWRPcGFjaXR5OiAwLjgsXG4gICAgICBkZWZhdWx0T3BhY2l0eTogMC4zXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2cnKTtcbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkge1xuICAgIFxuICAgIGNvbnN0IGJlZm9yZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gICAgd2hpbGUgKHRoaXMuJGVsLmZpcnN0Q2hpbGQpIHtcbiAgICAgIHRoaXMuJGVsLnJlbW92ZUNoaWxkKHRoaXMuJGVsLmZpcnN0Q2hpbGQpO1xuICAgIH1cblxuICAgIGNvbnN0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIGNvbnN0IGxheWVySGVpZ2h0ID0gcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQ7IC8vIHZhbHVlVG9QaXhlbCgxKTtcblxuICAgIGRhdGEuZm9yRWFjaCgoZGF0dW0pID0+IHtcbiAgICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMudGltZShkYXR1bSkpO1xuICAgICAgY29uc3Qgb3BhY2l0eSA9IHRoaXMuZm9jdXNlZChkYXR1bSkgP1xuICAgICAgICB0aGlzLnBhcmFtcy5mb2N1c2VkT3BhY2l0eSA6IHRoaXMucGFyYW1zLmRlZmF1bHRPcGFjaXR5O1xuXG4gICAgICBjb25zdCBoZWlnaHQgPSBsYXllckhlaWdodDtcblxuICAgICAgY29uc3QgdGljayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnbGluZScpO1xuICAgICAgdGljay5jbGFzc0xpc3QuYWRkKCd0aWNrJyk7XG5cbiAgICAgIHRpY2suc2V0QXR0cmlidXRlTlMobnVsbCwgJ3gxJywgMCk7XG4gICAgICB0aWNrLnNldEF0dHJpYnV0ZU5TKG51bGwsICd4MicsIDApO1xuICAgICAgdGljay5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneTEnLCAwKTtcbiAgICAgIHRpY2suc2V0QXR0cmlidXRlTlMobnVsbCwgJ3kyJywgaGVpZ2h0KTtcblxuICAgICAgdGljay5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsICdub25lJyk7XG4gICAgICB0aWNrLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2UnLCB0aGlzLnBhcmFtcy5jb2xvcik7XG4gICAgICB0aWNrLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2Utd2lkdGgnLCAyKTtcbiAgICAgIHRpY2suc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHt4fSwgMClgKTtcbiAgICAgIHRpY2suc2V0QXR0cmlidXRlTlMobnVsbCwgJ29wYWNpdHknLCBvcGFjaXR5KTtcblxuICAgICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGljayk7XG5cbiAgICAgIGNvbnN0IGxhYmVsID0gdGhpcy5sYWJlbChkYXR1bSk7XG4gICAgICBpZiAobGFiZWwpIHtcbiAgICAgICAgY29uc3QgJGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICd0ZXh0Jyk7XG4gICAgICAgICRsYWJlbC5jbGFzc0xpc3QuYWRkKCdsYWJlbCcpO1xuICAgICAgICBjb25zdCAkdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGxhYmVsKTtcbiAgICAgICAgJGxhYmVsLmFwcGVuZENoaWxkKCR0ZXh0KTtcbiAgICAgICAgJGxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgbWF0cml4KDEsIDAsIDAsIC0xLCAke3ggKyAyfSwgJHtoZWlnaHQgKyAyfSlgKTtcbiAgICAgICAgLy8gZmlyZWZveCBwcm9ibGVtIGhlcmVcbiAgICAgICAgLy8gJGxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdhbGlnbm1lbnQtYmFzZWxpbmUnLCAndGV4dC1iZWZvcmUtZWRnZScpO1xuICAgICAgICAkbGFiZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3knLCAnMTAnKTtcblxuICAgICAgICAkbGFiZWwuc3R5bGUuZm9udFNpemUgPSAnMTBweCc7XG4gICAgICAgICRsYWJlbC5zdHlsZS5saW5lSGVpZ2h0ID0gJzEwcHgnO1xuICAgICAgICAkbGFiZWwuc3R5bGUuZm9udEZhbWlseSA9ICdtb25vc3BhY2UnO1xuICAgICAgICAkbGFiZWwuc3R5bGUuY29sb3IgPSAnIzY3Njc2Nyc7XG4gICAgICAgICRsYWJlbC5zdHlsZS5vcGFjaXR5ID0gMC45O1xuICAgICAgICAkbGFiZWwuc3R5bGUubW96VXNlclNlbGVjdCA9ICdub25lJztcbiAgICAgICAgJGxhYmVsLnN0eWxlLndlYmtpdFVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgICAgICRsYWJlbC5zdHlsZS51c2VyU2VsZWN0ID0gJ25vbmUnO1xuXG4gICAgICAgIC8vIGNvbnN0IGJnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdyZWN0Jyk7XG4gICAgICAgIC8vIGJnLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsICcxMDAlJyk7XG4gICAgICAgIC8vIGJnLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCAnMTAwJScpO1xuICAgICAgICAvLyBiZy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsICcjZmZmZmZmJyk7XG4gICAgICAgIC8vIGxhYmVsLmFwcGVuZENoaWxkKGJnKTtcblxuICAgICAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCgkbGFiZWwpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xuXG4gICAgY29uc3QgYWZ0ZXIgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICBjb25zb2xlLmxvZyhcInRpY2tzIHVwZGF0ZSB0aW1lID0gXCIgKyBNYXRoLnJvdW5kKGFmdGVyIC0gYmVmb3JlKSk7XG4gIH1cbn1cbiIsImltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9iYXNlLXNoYXBlJztcblxuXG4vKipcbiAqIEEgc2hhcGUgdG8gZGlzcGxheSBkb3RzIGluIGEgdHJhY2UgdmlzdWFsaXphdGlvbiAobWVhbiAvIHJhbmdlKS5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci10cmFjZS5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmFjZURvdHMgZXh0ZW5kcyBCYXNlU2hhcGUge1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAndHJhY2UtZG90cyc7IH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIHJldHVybiB7IHg6IDAsIG1lYW46IDAsIHJhbmdlOiAwIH07XG4gIH1cblxuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1lYW5SYWRpdXM6IDMsXG4gICAgICByYW5nZVJhZGl1czogMyxcbiAgICAgIG1lYW5Db2xvcjogJyMyMzIzMjMnLFxuICAgICAgcmFuZ2VDb2xvcjogJ3N0ZWVsYmx1ZSdcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICBpZiAodGhpcy4kZWwpIHsgcmV0dXJuIHRoaXMuJGVsOyB9XG4gICAgLy8gY29udGFpbmVyXG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2cnKTtcbiAgICAvLyBkcmF3IG1lYW4gZG90XG4gICAgdGhpcy4kbWVhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnY2lyY2xlJyk7XG4gICAgdGhpcy4kbWVhbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAncicsIHRoaXMucGFyYW1zLm1lYW5SYWRpdXMpO1xuICAgIHRoaXMuJG1lYW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZScsIHRoaXMucGFyYW1zLm1lYW5Db2xvcik7XG4gICAgdGhpcy4kbWVhbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsICd0cmFuc3BhcmVudCcpO1xuICAgIHRoaXMuJG1lYW4uY2xhc3NMaXN0LmFkZCgnbWVhbicpO1xuICAgIC8vIHJhbmdlIGRvdHMgKDAgPT4gdG9wLCAxID0+IGJvdHRvbSlcbiAgICB0aGlzLiRtYXggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2NpcmNsZScpO1xuICAgIHRoaXMuJG1heC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAncicsIHRoaXMucGFyYW1zLm1lYW5SYWRpdXMpO1xuICAgIHRoaXMuJG1heC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlJywgdGhpcy5wYXJhbXMucmFuZ2VDb2xvcik7XG4gICAgdGhpcy4kbWF4LnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgJ3RyYW5zcGFyZW50Jyk7XG4gICAgdGhpcy4kbWF4LmNsYXNzTGlzdC5hZGQoJ21heCcpO1xuXG4gICAgdGhpcy4kbWluID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdjaXJjbGUnKTtcbiAgICB0aGlzLiRtaW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ3InLCB0aGlzLnBhcmFtcy5tZWFuUmFkaXVzKTtcbiAgICB0aGlzLiRtaW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZScsIHRoaXMucGFyYW1zLnJhbmdlQ29sb3IpO1xuICAgIHRoaXMuJG1pbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsICd0cmFuc3BhcmVudCcpO1xuICAgIHRoaXMuJG1pbi5jbGFzc0xpc3QuYWRkKCdtaW4nKTtcblxuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRoaXMuJG1lYW4pO1xuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRoaXMuJG1heCk7XG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kbWluKTtcblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIC8vIEBUT0RPIHVzZSBhY2Nlc3NvcnNcbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtKSB7XG4gICAgY29uc3QgbWVhbiA9IHRoaXMubWVhbihkYXR1bSk7XG4gICAgY29uc3QgcmFuZ2UgPSB0aGlzLnJhbmdlKGRhdHVtKTtcbiAgICBjb25zdCB4ID0gdGhpcy54KGRhdHVtKTtcbiAgICAvLyB5IHBvc2l0aW9uc1xuICAgIGNvbnN0IG1lYW5Qb3MgPSBgJHtyZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChtZWFuKX1gO1xuICAgIHRoaXMuJG1lYW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgJHttZWFuUG9zfSlgKTtcblxuICAgIGNvbnN0IGhhbGZSYW5nZSA9IHJhbmdlIC8gMjtcbiAgICBjb25zdCBtYXggPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChtZWFuICsgaGFsZlJhbmdlKTtcbiAgICBjb25zdCBtaW4gPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChtZWFuIC0gaGFsZlJhbmdlKTtcbiAgICBjb25zdCB4UG9zID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh4KTtcblxuICAgIHRoaXMuJG1heC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke21heH0pYCk7XG4gICAgdGhpcy4kbWluLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICR7bWlufSlgKTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke3hQb3N9LCAwKWApO1xuICB9XG5cbiAgaW5BcmVhKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtLCB4MSwgeTEsIHgyLCB5Mikge1xuICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMueChkYXR1bSkpO1xuICAgIGNvbnN0IG1lYW4gPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCh0aGlzLm1lYW4oZGF0dW0pKTtcbiAgICBjb25zdCByYW5nZSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHRoaXMucmFuZ2UoZGF0dW0pKTtcbiAgICBjb25zdCBtaW4gPSBtZWFuIC0gKHJhbmdlIC8gMik7XG4gICAgY29uc3QgbWF4ID0gbWVhbiArIChyYW5nZSAvIDIpO1xuXG4gICAgaWYgKHggPiB4MSAmJiB4IDwgeDIgJiYgKG1pbiA+IHkxIHx8IG1heCA8IHkyKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG4iLCJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vYmFzZS1zaGFwZSc7XG5cblxuLyoqXG4gKiBBIHNoYXBlIHRvIGRpc3BsYXkgcGF0aHMgaW4gYSB0cmFjZSB2aXN1YWxpemF0aW9uIChtZWFuIC8gcmFuZ2UpLiAoZW50aXR5IHNoYXBlKVxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLXRyYWNlLmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyYWNlUGF0aCBleHRlbmRzIEJhc2VTaGFwZSB7XG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICd0cmFjZS1jb21tb24nOyB9XG5cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICByZXR1cm4geyB4OiAwLCBtZWFuOiAwLCByYW5nZTogMCB9O1xuICB9XG5cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7XG4gICAgICByYW5nZUNvbG9yOiAnc3RlZWxibHVlJyxcbiAgICAgIG1lYW5Db2xvcjogJyMyMzIzMjMnLFxuICAgICAgZGlzcGxheU1lYW46IHRydWVcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICBpZiAodGhpcy4kZWwpIHsgcmV0dXJuIHRoaXMuJGVsOyB9XG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2cnKTtcbiAgICAvLyByYW5nZSBwYXRoXG4gICAgdGhpcy4kcmFuZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ3BhdGgnKTtcbiAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRyYW5nZSk7XG5cbiAgICAvLyBtZWFuIGxpbmVcbiAgICBpZiAodGhpcy5wYXJhbXMuZGlzcGxheU1lYW4pIHtcbiAgICAgIHRoaXMuJG1lYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ3BhdGgnKTtcbiAgICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRoaXMuJG1lYW4pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXRhKSB7XG4gICAgLy8gb3JkZXIgZGF0YSBieSB4IHBvc2l0aW9uXG4gICAgZGF0YSA9IGRhdGEuc2xpY2UoMCk7XG4gICAgZGF0YS5zb3J0KChhLCBiKSA9PiB0aGlzLngoYSkgPCB0aGlzLngoYikgPyAtMSA6IDEpO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLmRpc3BsYXlNZWFuKSB7XG4gICAgICB0aGlzLiRtZWFuLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgdGhpcy5fYnVpbGRNZWFuTGluZShyZW5kZXJpbmdDb250ZXh0LCBkYXRhKSk7XG4gICAgICB0aGlzLiRtZWFuLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2UnLCB0aGlzLnBhcmFtcy5tZWFuQ29sb3IpO1xuICAgICAgdGhpcy4kbWVhbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsICdub25lJyk7XG4gICAgfVxuXG4gICAgdGhpcy4kcmFuZ2Uuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLCB0aGlzLl9idWlsZFJhbmdlWm9uZShyZW5kZXJpbmdDb250ZXh0LCBkYXRhKSk7XG4gICAgdGhpcy4kcmFuZ2Uuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZScsICdub25lJyk7XG4gICAgdGhpcy4kcmFuZ2Uuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCB0aGlzLnBhcmFtcy5yYW5nZUNvbG9yKTtcbiAgICB0aGlzLiRyYW5nZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnb3BhY2l0eScsICcwLjQnKTtcblxuICAgIGRhdGEgPSBudWxsO1xuICB9XG5cbiAgX2J1aWxkTWVhbkxpbmUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkge1xuICAgIGxldCBpbnN0cnVjdGlvbnMgPSBkYXRhLm1hcCgoZGF0dW0sIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCB4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLngoZGF0dW0pKTtcbiAgICAgIGNvbnN0IHkgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCh0aGlzLm1lYW4oZGF0dW0pKTtcbiAgICAgIHJldHVybiBgJHt4fSwke3l9YDtcbiAgICB9KTtcblxuICAgIHJldHVybiAnTScgKyBpbnN0cnVjdGlvbnMuam9pbignTCcpO1xuICB9XG5cbiAgX2J1aWxkUmFuZ2Vab25lKHJlbmRlcmluZ0NvbnRleHQsIGRhdGEpIHtcbiAgICBjb25zdCBsZW5ndGggPSBkYXRhLmxlbmd0aDtcbiAgICAvLyBjb25zdCBsYXN0SW5kZXggPSBkYXRhXG4gICAgbGV0IGluc3RydWN0aW9uc1N0YXJ0ID0gJyc7XG4gICAgbGV0IGluc3RydWN0aW9uc0VuZCA9ICcnO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZGF0dW0gPSBkYXRhW2ldO1xuICAgICAgY29uc3QgbWVhbiA9IHRoaXMubWVhbihkYXR1bSk7XG4gICAgICBjb25zdCBoYWxmUmFuZ2UgPSB0aGlzLnJhbmdlKGRhdHVtKSAvIDI7XG5cbiAgICAgIGNvbnN0IHggID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLngoZGF0dW0pKTtcbiAgICAgIGNvbnN0IHkwID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwobWVhbiArIGhhbGZSYW5nZSk7XG4gICAgICBjb25zdCB5MSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKG1lYW4gLSBoYWxmUmFuZ2UpO1xuXG4gICAgICBjb25zdCBzdGFydCA9IGAke3h9LCR7eTB9YDtcbiAgICAgIGNvbnN0IGVuZCAgID0gYCR7eH0sJHt5MX1gO1xuXG4gICAgICBpbnN0cnVjdGlvbnNTdGFydCA9IGluc3RydWN0aW9uc1N0YXJ0ID09PSAnJyA/XG4gICAgICAgIHN0YXJ0IDogYCR7aW5zdHJ1Y3Rpb25zU3RhcnR9TCR7c3RhcnR9YDtcblxuICAgICAgaW5zdHJ1Y3Rpb25zRW5kID0gaW5zdHJ1Y3Rpb25zRW5kID09PSAnJyA/XG4gICAgICAgIGVuZCA6IGAke2VuZH1MJHtpbnN0cnVjdGlvbnNFbmR9YDtcbiAgICB9XG5cbiAgICBsZXQgaW5zdHJ1Y3Rpb25zID0gYE0ke2luc3RydWN0aW9uc1N0YXJ0fUwke2luc3RydWN0aW9uc0VuZH1aYDtcbiAgICByZXR1cm4gaW5zdHJ1Y3Rpb25zO1xuICB9XG59XG4iLCJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vYmFzZS1zaGFwZSc7XG5cblxuY29uc3QgeGh0bWxOUyA9ICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJztcblxuLyoqXG4gKiBBIHNoYXBlIHRvIGRpc3BsYXkgYSB3YXZlZm9ybS4gKGZvciBlbnRpdHkgZGF0YSlcbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci13YXZlZm9ybS5odG1sKVxuICpcbiAqIEB0b2RvIC0gZml4IHByb2JsZW1zIHdpdGggY2FudmFzIHN0cmF0ZWd5LlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXYXZlZm9ybSBleHRlbmRzIEJhc2VTaGFwZSB7XG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICd3YXZlZm9ybSc7IH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIC8vIHJldHVybiB7IHk6IDAgfTtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNhbXBsZVJhdGU6IDQ0MTAwLFxuICAgICAgY29sb3I6ICcjMDAwMDAwJyxcbiAgICAgIG9wYWNpdHk6IDEsXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgaWYgKHRoaXMuJGVsKSB7IHJldHVybiB0aGlzLiRlbDsgfVxuXG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ3BhdGgnKTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsICdub25lJyk7XG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdjcmlzcEVkZ2VzJyk7XG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZScsIHRoaXMucGFyYW1zLmNvbG9yKTtcbiAgICB0aGlzLiRlbC5zdHlsZS5vcGFjaXR5ID0gdGhpcy5wYXJhbXMub3BhY2l0eTtcblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIGVuY2FjaGUoc2FtcGxlcykge1xuXG4gICAgY29uc29sZS5sb2coXCJ3YXZlZm9ybSBlbmNhY2hlIGNhbGxlZFwiKTtcblxuICAgIC8vIFRoZSBjYWNoZSBpcyBhbiBhcnJheSBvZiBwZWFrIGNhY2hlcyAoaG9sZGluZyB0aGUgbWluIGFuZCBtYXhcbiAgICAvLyB2YWx1ZXMgd2l0aGluIGVhY2ggYmxvY2sgZm9yIGEgZ2l2ZW4gYmxvY2sgc2l6ZSkgd2l0aCBlYWNoIHBlYWtcbiAgICAvLyBjYWNoZSByZXByZXNlbnRlZCBhcyBhbiBvYmplY3Qgd2l0aCBibG9ja1NpemUsIG1pbiBhcnJheSwgYW5kXG4gICAgLy8gbWF4IGFycmF5IHByb3BlcnRpZXMuXG4gICAgLy9cbiAgICAvLyBGb3IgZXhhbXBsZTpcbiAgICAvLyAgICBcbiAgICAvLyBbIHtcbiAgICAvLyAgICAgYmxvY2tTaXplOiAxNixcbiAgICAvLyAgICAgbWF4OiBbIDAuNywgIDAuNSwgMC4yNSwgLTAuMSBdLFxuICAgIC8vICAgICBtaW46IFsgMC41LCAtMC4xLCAtMC44LCAtMC4yIF1cbiAgICAvLyAgIH0sIHtcbiAgICAvLyAgICAgYmxvY2tTaXplOiAzMiwgXG4gICAgLy8gICAgIG1heDogWyAgMC43LCAgMC4yNSBdLFxuICAgIC8vICAgICBtaW46IFsgLTAuMSwgLTAuOCAgXVxuICAgIC8vICAgfVxuICAgIC8vIF1cbiAgICAvL1xuICAgIC8vIEFzIGl0IGhhcHBlbnMgd2UgYXJlIG9ubHkgY3JlYXRpbmcgYSBjYWNoZSB3aXRoIGEgc2luZ2xlIGJsb2NrXG4gICAgLy8gc2l6ZSBhdCB0aGUgbW9tZW50LCBidXQgaXQncyB1c2VmdWwgdG8gcmVjb3JkIHRoYXQgYmxvY2sgc2l6ZVxuICAgIC8vIGluIHRoZSBjYWNoZSByYXRoZXIgdGhhbiBoYXZlIHRvIGZpeCBpdCBoZXJlIGluIHRoZSBzaGFwZS5cblxuICAgIGNvbnN0IGJlZm9yZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gICAgY29uc3QgcGVha0NhY2hlRm9yID0gKChhcnIsIGJsb2NrU2l6ZSkgPT4ge1xuICAgIFxuICAgICAgbGV0IHBlYWtzID0gW10sIHRyb3VnaHMgPSBbXTtcblxuICAgICAgY29uc3QgbGVuID0gYXJyLmxlbmd0aDtcbiAgICBcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpID0gaSArIGJsb2NrU2l6ZSkge1xuICAgICAgICBsZXQgbWluID0gYXJyW2ldO1xuICAgICAgICBsZXQgbWF4ID0gYXJyW2ldO1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGJsb2NrU2l6ZTsgaisrKSB7XG4gICAgICAgICAgbGV0IHNhbXBsZSA9IGFycltpICsgal07XG4gICAgICAgICAgaWYgKHNhbXBsZSA8IG1pbikgeyBtaW4gPSBzYW1wbGU7IH1cbiAgICAgICAgICBpZiAoc2FtcGxlID4gbWF4KSB7IG1heCA9IHNhbXBsZTsgfVxuICAgICAgICB9XG4gICAgICAgIHBlYWtzLnB1c2gobWF4KTtcbiAgICAgICAgdHJvdWdocy5wdXNoKG1pbik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBbIHBlYWtzLCB0cm91Z2hzIF07XG4gICAgfSk7XG5cbiAgICAvLyBGb3IgYSBzaW5nbGUgcGVhayBjYWNoZSwgZXhwZXJpbWVudCBzdWdnZXN0cyBzbWFsbGlzaCBibG9ja1xuICAgIC8vIHNpemVzIGFyZSBiZXR0ZXIuIFRoZXJlJ3Mgbm8gYmVuZWZpdCBpbiBoYXZpbmcgbXVsdGlwbGUgbGF5ZXJzXG4gICAgLy8gb2YgY2FjaGUgKGUuZy4gMzIgYW5kIDUxMikgdW5sZXNzIHVwZGF0ZSgpIGNhbiB0YWtlIGFkdmFudGFnZVxuICAgIC8vIG9mIGJvdGggaW4gYSBzaW5nbGUgc3VtbWFyaXNlIGFjdGlvbiAoZS5nLiB3aGVuIGFza2VkIGZvciBhXG4gICAgLy8gcmVhZCBmcm9tIDMxMCB0byAxMDUwLCBzdGFydCBieSByZWFkaW5nIHNpbmdsZSBzYW1wbGVzIGZyb20gMzEwXG4gICAgLy8gdG8gMzIwLCB0aGVuIGZyb20gdGhlIDMyLXNhbXBsZSBjYWNoZSBmcm9tIDMyMCB0byA1MTIsIHRoZW5cbiAgICAvLyBzd2l0Y2ggdG8gdGhlIDUxMiBzYW1wbGUgY2FjaGUsIHJhdGhlciB0aGFuIGhhdmluZyB0byByZWFkXG4gICAgLy8gc2luZ2xlIHNhbXBsZXMgYWxsIHRoZSB3YXkgZnJvbSAzMTAgdG8gNTEyKS4uLiBidXQgYXQgdGhlXG4gICAgLy8gbW9tZW50IGl0IGNhbid0LiBBbmQgdGhlIG1vcmUgY29tcGxleCBsb2dpYyB3b3VsZCBjYXJyeSBpdHMgb3duXG4gICAgLy8gb3ZlcmhlYWQuXG4gICAgXG4gICAgY29uc3QgYmxvY2tTaXplID0gMzI7XG4gICAgbGV0IFsgcGVha3MsIHRyb3VnaHMgXSA9IHBlYWtDYWNoZUZvcihzYW1wbGVzLCBibG9ja1NpemUpO1xuICAgIFxuICAgIHJldHVybiB7XG4gICAgICBzYW1wbGVzLFxuICAgICAgcGVha0NhY2hlczogW1xuICAgICAgICB7IGJsb2NrU2l6ZSxcbiAgICAgICAgICBtYXg6IHBlYWtzLFxuICAgICAgICAgIG1pbjogdHJvdWdoc1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfTtcbiAgfVxuICBcbiAgc3VtbWFyaXNlKGNhY2hlLCBtaW5YLCBtYXhYLCBwaXhlbFRvU2FtcGxlKSB7XG5cbiAgICBjb25zdCBiZWZvcmUgPSBwZXJmb3JtYW5jZS5ub3coKTtcblxuICAgIGNvbnN0IHNhbXBsZXMgPSBjYWNoZS5zYW1wbGVzO1xuICAgIFxuICAgIGNvbnN0IHB4MCA9IE1hdGguZmxvb3IobWluWCk7XG4gICAgY29uc3QgcHgxID0gTWF0aC5mbG9vcihtYXhYKTtcblxuICAgIGxldCBwZWFrQ2FjaGUgPSBudWxsO1xuICAgIGxldCBwZWFrQ2FjaGVCbG9ja1NpemUgPSAwO1xuXG4gICAgaWYgKGNhY2hlICYmIChjYWNoZS5wZWFrQ2FjaGVzLmxlbmd0aCA+IDApKSB7XG5cbiAgICAgIC8vIEZpbmQgYSBzdWl0YWJsZSBwZWFrIGNhY2hlIGlmIHdlIGhhdmUgb25lLlxuICAgICAgXG4gICAgICAvLyBcInN0ZXBcIiBpcyB0aGUgZGlzdGFuY2UgaW4gc2FtcGxlcyBmcm9tIG9uZSBwaXhlbCB0byB0aGUgbmV4dC5cbiAgICAgIC8vIFdlIHdhbnQgdGhlIGxhcmdlc3QgY2FjaGUgd2hvc2UgYmxvY2sgc2l6ZSBpcyBubyBsYXJnZXIgdGhhblxuICAgICAgLy8gaGFsZiB0aGlzLCBzbyBhcyB0byBhdm9pZCBzaXR1YXRpb25zIHdoZXJlIG91ciBzdGVwIGlzIGFsd2F5c1xuICAgICAgLy8gc3RyYWRkbGluZyBjYWNoZSBibG9jayBib3VuZGFyaWVzLlxuICAgICAgY29uc3Qgc3RlcCA9IHBpeGVsVG9TYW1wbGUocHgwICsgMSkgLSBwaXhlbFRvU2FtcGxlKHB4MCk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FjaGUucGVha0NhY2hlcy5sZW5ndGg7ICsraSkge1xuICAgICAgICBjb25zdCBibG9ja1NpemUgPSBjYWNoZS5wZWFrQ2FjaGVzW2ldLmJsb2NrU2l6ZTtcbiAgICAgICAgaWYgKGJsb2NrU2l6ZSA+IHBlYWtDYWNoZUJsb2NrU2l6ZSAmJiBibG9ja1NpemUgPD0gc3RlcC8yKSB7XG4gICAgICAgICAgcGVha0NhY2hlID0gY2FjaGUucGVha0NhY2hlc1tpXTtcbiAgICAgICAgICBwZWFrQ2FjaGVCbG9ja1NpemUgPSBwZWFrQ2FjaGUuYmxvY2tTaXplO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgc2FtcGxlUmF0ZSA9IHRoaXMucGFyYW1zLnNhbXBsZVJhdGU7XG4gICAgbGV0IG1pbk1heCA9IFtdO1xuXG4gICAgZm9yIChsZXQgcHggPSBweDA7IHB4IDwgcHgxOyBweCsrKSB7XG5cbiAgICAgIGNvbnN0IHN0YXJ0U2FtcGxlID0gcGl4ZWxUb1NhbXBsZShweCk7XG4gICAgICBpZiAoc3RhcnRTYW1wbGUgPj0gc2FtcGxlcy5sZW5ndGgpIGJyZWFrO1xuXG4gICAgICBsZXQgZW5kU2FtcGxlID0gcGl4ZWxUb1NhbXBsZShweCArIDEpO1xuICAgICAgaWYgKGVuZFNhbXBsZSA+PSBzYW1wbGVzLmxlbmd0aCkgZW5kU2FtcGxlID0gc2FtcGxlcy5sZW5ndGg7XG4gICAgICBcbiAgICAgIGxldCBtaW4gPSBzYW1wbGVzW3N0YXJ0U2FtcGxlXTtcbiAgICAgIGxldCBtYXggPSBtaW47XG4gICAgICBcbiAgICAgIGxldCBpeCA9IHN0YXJ0U2FtcGxlO1xuXG4gICAgICBpZiAocGVha0NhY2hlICYmIChwZWFrQ2FjaGVCbG9ja1NpemUgPiAwKSkge1xuICAgICAgXG4gICAgICAgIHdoaWxlIChpeCA8IGVuZFNhbXBsZSAmJiAoaXggJSBwZWFrQ2FjaGVCbG9ja1NpemUpICE9PSAwKSB7XG4gICAgICAgICAgbGV0IHNhbXBsZSA9IHNhbXBsZXNbaXhdO1xuICAgICAgICAgIGlmIChzYW1wbGUgPCBtaW4pIHsgbWluID0gc2FtcGxlOyB9XG4gICAgICAgICAgaWYgKHNhbXBsZSA+IG1heCkgeyBtYXggPSBzYW1wbGU7IH1cbiAgICAgICAgICArK2l4O1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNhY2hlSXggPSBpeCAvIHBlYWtDYWNoZUJsb2NrU2l6ZTtcbiAgICAgICAgY29uc3QgY2FjaGVNYXggPSBwZWFrQ2FjaGUubWF4O1xuICAgICAgICBjb25zdCBjYWNoZU1pbiA9IHBlYWtDYWNoZS5taW47XG4gICAgICBcbiAgICAgICAgd2hpbGUgKGl4ICsgcGVha0NhY2hlQmxvY2tTaXplIDw9IGVuZFNhbXBsZSkge1xuICAgICAgICAgIGlmIChjYWNoZU1heFtjYWNoZUl4XSA+IG1heCkgbWF4ID0gY2FjaGVNYXhbY2FjaGVJeF07XG4gICAgICAgICAgaWYgKGNhY2hlTWluW2NhY2hlSXhdIDwgbWluKSBtaW4gPSBjYWNoZU1pbltjYWNoZUl4XTtcbiAgICAgICAgICArK2NhY2hlSXg7XG4gICAgICAgICAgaXggPSBpeCArIHBlYWtDYWNoZUJsb2NrU2l6ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB3aGlsZSAoaXggPCBlbmRTYW1wbGUpIHtcbiAgICAgICAgbGV0IHNhbXBsZSA9IHNhbXBsZXNbaXhdO1xuICAgICAgICBpZiAoc2FtcGxlIDwgbWluKSB7IG1pbiA9IHNhbXBsZTsgfVxuICAgICAgICBpZiAoc2FtcGxlID4gbWF4KSB7IG1heCA9IHNhbXBsZTsgfVxuICAgICAgICArK2l4O1xuICAgICAgfVxuXG4gICAgICBtaW5NYXgucHVzaChbcHgsIG1pbiwgbWF4XSk7XG4gICAgfVxuXG4gICAgY29uc3QgYWZ0ZXIgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICBjb25zb2xlLmxvZyhcIndhdmVmb3JtIHN1bW1hcmlzYXRpb24gdGltZSA9IFwiICsgTWF0aC5yb3VuZChhZnRlciAtIGJlZm9yZSkpO1xuICAgIFxuICAgIHJldHVybiBtaW5NYXg7XG4gIH1cblxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgY2FjaGUpIHtcblxuICAgIGNvbnN0IGJlZm9yZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gICAgY29uc3QgbWluWCA9IHJlbmRlcmluZ0NvbnRleHQubWluWDtcbiAgICBjb25zdCBtYXhYID0gcmVuZGVyaW5nQ29udGV4dC5tYXhYO1xuXG4gICAgY29uc3Qgc2FtcGxlUmF0ZSA9IHRoaXMucGFyYW1zLnNhbXBsZVJhdGU7XG4gICAgY29uc3QgcGl4ZWxUb1NhbXBsZSA9IChwaXhlbCA9PiB7XG4gICAgICByZXR1cm4gTWF0aC5mbG9vciAoc2FtcGxlUmF0ZSAqIHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHBpeGVsKSk7XG4gICAgfSk7XG5cbiAgICAvLyBnZXQgbWluL21heCBwZXIgcGl4ZWxzLCBjbGFtcGVkIHRvIHRoZSB2aXNpYmxlIGFyZWFcbiAgICBjb25zdCBtaW5NYXggPSB0aGlzLnN1bW1hcmlzZShjYWNoZSwgbWluWCwgbWF4WCwgcGl4ZWxUb1NhbXBsZSk7XG4gICAgaWYgKCFtaW5NYXgubGVuZ3RoKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgUElYRUwgPSAwO1xuICAgIGNvbnN0IE1JTiAgID0gMTtcbiAgICBjb25zdCBNQVggICA9IDI7XG4gICAgY29uc3QgWkVSTyAgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCgwKTtcblxuICAgIGxldCBpbnN0cnVjdGlvbnMgPSBtaW5NYXgubWFwKChkYXR1bSwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IHggID0gZGF0dW1bUElYRUxdO1xuICAgICAgbGV0IHkxID0gTWF0aC5yb3VuZChyZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChkYXR1bVtNSU5dKSk7XG4gICAgICBsZXQgeTIgPSBNYXRoLnJvdW5kKHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKGRhdHVtW01BWF0pKTtcbiAgICAgIHJldHVybiBgJHt4fSwke3kxfUwke3h9LCR7eTJ9YDtcbiAgICB9KTtcblxuICAgIGNvbnN0IGQgPSAnTScgKyBpbnN0cnVjdGlvbnMuam9pbignTCcpO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgZCk7XG5cbiAgICBjb25zdCBhZnRlciA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIGNvbnNvbGUubG9nKFwid2F2ZWZvcm0gdXBkYXRlIHRpbWUgPSBcIiArIE1hdGgucm91bmQoYWZ0ZXIgLSBiZWZvcmUpKTtcbiAgfVxufVxuIiwiLyoqXG4gKiBgU3RhdGVgIGluc3RhbmNlcyBhcmUgdXNlZCB0byBkZWZpbmUgdGhlIGFwcGxpY2F0aW9uIGxvZ2ljIGJ5IHByZWNpc2luZ1xuICogc3BlY2lmaWMgdXNlciBpbnRlcmFjdGlvbiBjYXNlcywgYW5kIGhvdyB0aGV5IGltcGFjdCB0aGUgb3ZlcmFsIHRlbXBvcmFsXG4gKiByZXByZXNlbnRhdGlvbi4gVGhlIGFic3RyYWN0aW9ucyBleHRlbmRpbmcgdGhpcyBiYXNlIGNsYXNzIHNob3VsZCBiZVxuICogY29uc2lkZXJlZCBhcyB0aGUgbWFpbiBpbnRlcmZhY2UgYmV0d2VlbiB0aGUgdmlzdWFsaXphdGlvbiBhbmQgdGhlXG4gKiBhcHBsaWNhdGlvbiBsb2dpYy4gQWxsIHByb3ZpZGVkIHN0YXRlcyBzaG91bGQgYmUgc2VlbiBhcyBzaW1wbGUgZXhhbXBsZXMgZm9yXG4gKiByYXBpZCBwcm90b3R5cGluZyxcbiAqXG4gKiBTdGF0ZXMgbWFuYWdlIGludGVyYWN0aW9ucyBsaWtlIHpvb21pbmcsIGJyb3dzaW5nLCBvciBlZGl0aW5nIHRoZSB0aW1lbGluZS5cbiAqIEN1c3RvbWl6ZWQgc3RhdGVzIHNob3VsZCBleHRlbmQgdGhpcyBCYXNlU3RhdGUuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VTdGF0ZSB7XG4gIC8qKlxuICAgKiBSZXR1cm5zIHRpbWVsaW5lIHRyYWNrcyBjb2xsZWN0aW9uLlxuICAgKlxuICAgKiBAdHlwZSB7VHJhY2tDb2xsZWN0aW9ufVxuICAgKi9cbiAgY29uc3RydWN0b3IodGltZWxpbmUpIHtcbiAgICAvKipcbiAgICAgKiBBIHJlZmVyZW5jZSB0byB0aGUgdGltZWxpbmUgb24gd2hpY2ggdGhlIHN0YXRlIHNob3VsZCBiZSBpbnN0YWxsZWQuXG4gICAgICogQHR5cGUge1RpbWVsaW5lfVxuICAgICAqL1xuICAgIHRoaXMudGltZWxpbmUgPSB0aW1lbGluZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRpbWVsaW5lIHRyYWNrcyBjb2xsZWN0aW9uLlxuICAgKlxuICAgKiBAdHlwZSB7VHJhY2tDb2xsZWN0aW9uPFRyYWNrPn1cbiAgICovXG4gIGdldCB0cmFja3MoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZWxpbmUudHJhY2tzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYWxsIHJlZ2lzdGVyZWQgbGF5ZXJzLlxuICAgKlxuICAgKiBAdHlwZSB7QXJyYXk8TGF5ZXI+fVxuICAgKi9cbiAgZ2V0IGxheWVycygpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lbGluZS50cmFja3MubGF5ZXJzO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSB0aW1lbGluZSBpcyBlbnRlcmluZyB0aGUgc3RhdGUuXG4gICAqL1xuICBlbnRlcigpIHt9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSB0aW1lbGluZSBpcyBsZWF2aW5nIHRoZSBzdGF0ZS5cbiAgICovXG4gIGV4aXQoKSB7fVxuXG4gIC8qKlxuICAgKiBNYWluIGludGVyZmFjZSBtZXRob2QgdG8gb3ZlcnJpZGUgd2hlbiBjcmVhdGluZyBhIG5ldyBgU3RhdGVgLiBIYW5kbGUgZXZlbnRcbiAgICogZnJvbSBtb3VzZSBvciBrZXlib2FyZCwgc2hvdWxkIGRlZmluZSBiZWhhdmlvciBhY2NvcmRpbmcgdG8gdGhlIGV2ZW50XG4gICAqIChha2EuIG1vdXNlZG93biwgbW91c2V1cCwgLi4uKS5cbiAgICpcbiAgICogQHBhcmFtIHtXYXZlRXZlbnR9IGUgLSB0aGUgZXZlbnQgdG8gcHJvY2Vzcy5cbiAgICogQHBhcmFtIHtBcnJheX0gaGl0TGF5ZXJzIC0gdGhlIGxheWVycyBoaXQgYnkgdGhlIG1vdXNlIGV2ZW50IChpZiBzdXJmYWNlXG4gICAqIGV2ZW50KS5cbiAgICovXG4gIGhhbmRsZUV2ZW50KGUsIGhpdExheWVycykge31cbn1cbiIsImltcG9ydCBCYXNlU3RhdGUgZnJvbSAnLi9iYXNlLXN0YXRlJztcblxuXG4vKipcbiAqIEEgc3RhdGUgdG8gaW50ZXJhY3Qgd2l0aCBhIGJyZWFrcG9pbnQgZnVuY3Rpb24sIG1pbWljaW5nIE1heC9NU1Anc1xuICogYnJlYWtwb2ludCBmdW5jdGlvbiBpbnRlcmFjdGlvbnMuXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItYnJlYWtwaW50Lmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJyZWFrcG9pbnRTdGF0ZSBleHRlbmRzIEJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lLCBkYXR1bUdlbmVyYXRvcikge1xuICAgIHN1cGVyKHRpbWVsaW5lKTtcblxuICAgIHRoaXMuZGF0dW1HZW5lcmF0b3IgPSBkYXR1bUdlbmVyYXRvcjtcbiAgICB0aGlzLmN1cnJlbnRFZGl0ZWRMYXllciA9IG51bGw7XG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gbnVsbDtcbiAgfVxuXG4gIGVudGVyKCkge31cbiAgZXhpdCgpIHt9XG5cbiAgaGFuZGxlRXZlbnQoZSwgaGl0TGF5ZXJzKSB7XG4gICAgc3dpdGNoIChlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ21vdXNlZG93bic6XG4gICAgICAgIHRoaXMub25Nb3VzZURvd24oZSwgaGl0TGF5ZXJzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZW1vdmUnOlxuICAgICAgICB0aGlzLm9uTW91c2VNb3ZlKGUsIGhpdExheWVycyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIHRoaXMub25Nb3VzZVVwKGUsIGhpdExheWVycyk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VEb3duKGUsIGhpdExheWVycykge1xuICAgIHRoaXMubW91c2VEb3duID0gdHJ1ZTtcbiAgICAvLyBrZWVwIHRhcmdldCBjb25zaXN0ZW50IHdpdGggbW91c2UgZG93blxuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IGUudGFyZ2V0O1xuICAgIGxldCB1cGRhdGVkTGF5ZXIgPSBudWxsO1xuXG4gICAgY29uc3QgbGF5ZXJzID0gaGl0TGF5ZXJzO1xuXG4gICAgbGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB7XG4gICAgICBsYXllci51bnNlbGVjdCgpO1xuICAgICAgY29uc3QgaXRlbSA9IGxheWVyLmdldEl0ZW1Gcm9tRE9NRWxlbWVudChlLnRhcmdldCk7XG5cbiAgICAgIGlmIChpdGVtID09PSBudWxsKSB7XG4gICAgICAgIC8vIGNyZWF0ZSBhbiBpdGVtXG4gICAgICAgIGNvbnN0IHRpbWUgPSBsYXllci50aW1lVG9QaXhlbC5pbnZlcnQoZS54KSAtIHRoaXMudGltZWxpbmUub2Zmc2V0O1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGxheWVyLnZhbHVlVG9QaXhlbC5pbnZlcnQobGF5ZXIucGFyYW1zLmhlaWdodCAtIGUueSk7XG4gICAgICAgIGNvbnN0IGRhdHVtID0gdGhpcy5kYXR1bUdlbmVyYXRvcih0aW1lLCB2YWx1ZSk7XG5cbiAgICAgICAgbGF5ZXIuZGF0YS5wdXNoKGRhdHVtKTtcbiAgICAgICAgdXBkYXRlZExheWVyID0gbGF5ZXI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBpZiBzaGlmdCBpcyBwcmVzc2VkLCByZW1vdmUgdGhlIGl0ZW1cbiAgICAgICAgaWYgKGUub3JpZ2luYWxFdmVudC5zaGlmdEtleSkge1xuICAgICAgICAgIGNvbnN0IGRhdGEgPSBsYXllci5kYXRhO1xuICAgICAgICAgIGNvbnN0IGRhdHVtID0gbGF5ZXIuZ2V0RGF0dW1Gcm9tSXRlbShpdGVtKTtcbiAgICAgICAgICBkYXRhLnNwbGljZShkYXRhLmluZGV4T2YoZGF0dW0pLCAxKTtcblxuICAgICAgICAgIHVwZGF0ZWRMYXllciA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuY3VycmVudEVkaXRlZExheWVyID0gbGF5ZXI7XG4gICAgICAgICAgbGF5ZXIuc2VsZWN0KGl0ZW0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAodXBkYXRlZExheWVyKSB7XG4gICAgICB0aGlzLnRpbWVsaW5lLnRyYWNrcy5yZW5kZXIodXBkYXRlZExheWVyKTtcbiAgICAgIHRoaXMudGltZWxpbmUudHJhY2tzLnVwZGF0ZSh1cGRhdGVkTGF5ZXIpO1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VNb3ZlKGUpIHtcbiAgICBpZiAoIXRoaXMubW91c2VEb3duIHx8wqAhdGhpcy5jdXJyZW50RWRpdGVkTGF5ZXIpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBsYXllciA9IHRoaXMuY3VycmVudEVkaXRlZExheWVyO1xuICAgIGNvbnN0IGl0ZW1zID0gbGF5ZXIuc2VsZWN0ZWRJdGVtcztcbiAgICAvLyB0aGUgbG9vcCBzaG91bGQgYmUgaW4gbGF5ZXIgdG8gbWF0Y2ggc2VsZWN0IC8gdW5zZWxlY3QgQVBJXG4gICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgbGF5ZXIuZWRpdChpdGVtLCBlLmR4LCBlLmR5LCB0aGlzLmN1cnJlbnRUYXJnZXQpO1xuICAgIH0pO1xuXG4gICAgbGF5ZXIudXBkYXRlKGl0ZW1zKTtcbiAgfVxuXG4gIG9uTW91c2VVcChlKSB7XG4gICAgdGhpcy5jdXJyZW50RWRpdGVkTGF5ZXIgPSBudWxsO1xuICAgIHRoaXMubW91c2VEb3duID0gZmFsc2U7XG4gIH1cbn1cbiIsImltcG9ydCBucyBmcm9tICcuLi9jb3JlL25hbWVzcGFjZSc7XG5pbXBvcnQgQmFzZVN0YXRlIGZyb20gJy4vYmFzZS1zdGF0ZSc7XG5cblxuLyoqXG4gKiBQcm90b29scyBsaWtlIHpvb20gd2l0aCB6b25lIHNlbGVjdGlvbi4gUHJlc3Mgc3BhY2UgYmFyIHRvIHJlc2V0IHpvb20uXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvc3RhdGVzLXpvb20uaHRtbClcbiAqXG4gKiBAdG9kbyAtIGNvdWxkIGFsc28gaGFuZGxlIGBnYCBhbmQgYGhgIGtleXMgdG8gem9vbS1pbiwgem9vbS1vdXQuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJydXNoWm9vbVN0YXRlIGV4dGVuZHMgQmFzZVN0YXRlIHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUpIHtcbiAgICBzdXBlcih0aW1lbGluZSk7XG4gIH1cblxuICBoYW5kbGVFdmVudChlKSB7XG4gICAgc3dpdGNoKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlRG93bihlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZW1vdmUnOlxuICAgICAgICB0aGlzLm9uTW91c2VNb3ZlKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICB0aGlzLm9uTW91c2VVcChlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdrZXlkb3duJzpcbiAgICAgICAgdGhpcy5vbktleURvd24oZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VEb3duKGUpIHtcbiAgICB0aGlzLmJydXNoZXMgPSBbXTtcbiAgICB0aGlzLnN0YXJ0WCA9IGUueDtcbiAgICAvLyBjcmVhdGUgYnJ1c2ggaW4gZWFjaCBjb250YWluZXJzXG4gICAgdGhpcy50cmFja3MuZm9yRWFjaCgodHJhY2spID0+IHtcbiAgICAgIGNvbnN0IGludGVyYWN0aW9ucyA9IHRyYWNrLiRpbnRlcmFjdGlvbnM7XG5cbiAgICAgIGNvbnN0IGJydXNoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAncmVjdCcpO1xuICAgICAgYnJ1c2guc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIHRyYWNrLmhlaWdodCk7XG4gICAgICBicnVzaC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneScsIDApO1xuICAgICAgYnJ1c2guc3R5bGUuZmlsbCA9ICcjNzg3ODc4JztcbiAgICAgIGJydXNoLnN0eWxlLm9wYWNpdHkgPSAwLjI7XG5cbiAgICAgIGludGVyYWN0aW9ucy5hcHBlbmRDaGlsZChicnVzaCk7XG5cbiAgICAgIHRoaXMuYnJ1c2hlcy5wdXNoKGJydXNoKTtcbiAgICB9KTtcbiAgfVxuXG4gIG9uTW91c2VNb3ZlKGUpIHtcbiAgICAvLyB1cGRhdGUgYnJ1c2hcbiAgICBjb25zdCB3aWR0aCA9IE1hdGguYWJzKGUueCAtIHRoaXMuc3RhcnRYKTtcbiAgICBjb25zdCB4ID0gTWF0aC5taW4oZS54LCB0aGlzLnN0YXJ0WCk7XG5cbiAgICB0aGlzLmJydXNoZXMuZm9yRWFjaCgoYnJ1c2gpID0+IHtcbiAgICAgIGJydXNoLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHdpZHRoKTtcbiAgICAgIGJydXNoLnNldEF0dHJpYnV0ZU5TKG51bGwsICd4JywgeCk7XG4gICAgfSk7XG4gIH1cblxuICBvbk1vdXNlVXAoZSkge1xuICAgIC8vIHJlbW92ZSBicnVzaFxuICAgIHRoaXMuYnJ1c2hlcy5mb3JFYWNoKChicnVzaCkgPT4ge1xuICAgICAgYnJ1c2gucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChicnVzaCk7XG4gICAgfSk7XG5cbiAgICAvLyB1cGRhdGUgdGltZUNvbnRleHRcbiAgICBjb25zdCBzdGFydFggPSB0aGlzLnN0YXJ0WDtcbiAgICBjb25zdCBlbmRYID0gZS54O1xuICAgIC8vIHJldHVybiBpZiBubyBkcmFnXG4gICAgaWYgKE1hdGguYWJzKHN0YXJ0WCAtIGVuZFgpIDwgMSkgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IGxlZnRYID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oc3RhcnRYLCBlbmRYKSk7XG4gICAgY29uc3QgcmlnaHRYID0gTWF0aC5tYXgoc3RhcnRYLCBlbmRYKTtcblxuICAgIGxldCBtaW5UaW1lID0gdGhpcy50aW1lbGluZS50aW1lVG9QaXhlbC5pbnZlcnQobGVmdFgpO1xuICAgIGxldCBtYXhUaW1lID0gdGhpcy50aW1lbGluZS50aW1lVG9QaXhlbC5pbnZlcnQocmlnaHRYKTtcblxuICAgIGNvbnN0IGRlbHRhRHVyYXRpb24gPSBtYXhUaW1lIC0gbWluVGltZTtcbiAgICBjb25zdCB6b29tID0gdGhpcy50aW1lbGluZS52aXNpYmxlRHVyYXRpb24gLyBkZWx0YUR1cmF0aW9uO1xuXG4gICAgdGhpcy50aW1lbGluZS5vZmZzZXQgLT0gbWluVGltZTtcbiAgICB0aGlzLnRpbWVsaW5lLnpvb20gKj0gem9vbTtcblxuICAgIHRoaXMudHJhY2tzLnVwZGF0ZSgpO1xuICB9XG5cbiAgb25LZXlEb3duKGUpIHtcbiAgICAvLyByZXNldCBvbiBzcGFjZSBiYXJcbiAgICBpZiAoZS5vcmlnaW5hbEV2ZW50LmtleUNvZGUgPT09IDMyKSB7XG4gICAgICB0aGlzLnRpbWVsaW5lLm9mZnNldCA9IDA7XG4gICAgICB0aGlzLnRpbWVsaW5lLnpvb20gPSAxO1xuICAgICAgdGhpcy50cmFja3MudXBkYXRlKCk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgc2NhbGVzIGZyb20gJy4uL3V0aWxzL3NjYWxlcyc7XG5pbXBvcnQgQmFzZVN0YXRlIGZyb20gJy4vYmFzZS1zdGF0ZSc7XG5cblxuLyoqXG4gKiBgQ2VudGVyZWRab29tU3RhdGVgIGlzIGEgdGltZWxpbmUgc3RhdGUgbWltaWNpbmcgdGhlIGBMaXZlYCB6b29tIGludGVyYWN0aW9uLiBJdCBhbGxvd3MgdGhlIHVzZXIgdG8gYnJvd3NlIHRoZSB0aW1lbGluZSBieSBjbGlja2luZyBvbiBhIHRyYWNrLCBhbmQgdGhlblxuICogLSBtb3ZpbmcgZG93biB0byB6b29tIGluXG4gKiAtIG1vdmluZyB1cCB0byB6b29tIG91dFxuICogLSBtb3ZpbmcgbGVmdCB0byBtb3ZlIGluIHRpbWUsIGFmdGVyXG4gKiAtIG1vdmluZyByaWdodCB0byBtb3ZlIGluIHRpbWUsIGJlZm9yZVxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL3N0YXRlcy16b29tLmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENlbnRlcmVkWm9vbVN0YXRlIGV4dGVuZHMgQmFzZVN0YXRlIHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUpIHtcbiAgICBzdXBlcih0aW1lbGluZSk7XG4gICAgdGhpcy5jdXJyZW50TGF5ZXIgPSBudWxsO1xuICAgIC8vIFNldCBtYXgvbWluIHpvb21cbiAgICAvLyBtYXhab29tOiAxcHggcGVyIHNhbXBsZVxuICAgIC8vIG1pblpvb206IDEwIDAwMCBweCBwZXIgMSBob3VyXG4gICAgLy8gd2l0aCBhIGRlZmF1bHQgdG8gNDQuMWtIeiBzYW1wbGUgcmF0ZVxuICAgIHRoaXMubWF4Wm9vbSA9IDQ0MTAwICogMSAvIHRoaXMudGltZWxpbmUudGltZUNvbnRleHQucGl4ZWxzUGVyU2Vjb25kO1xuICAgIHRoaXMubWluWm9vbSA9IDEwMDAwIC8gMzYwMCAvIHRoaXMudGltZWxpbmUudGltZUNvbnRleHQucGl4ZWxzUGVyU2Vjb25kO1xuICB9XG5cbiAgaGFuZGxlRXZlbnQoZSkge1xuICAgIHN3aXRjaChlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ21vdXNlZG93bic6XG4gICAgICAgIHRoaXMub25Nb3VzZURvd24oZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlTW92ZShlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZXVwJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlVXAoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VEb3duKGUpIHtcblxuICAgIHRoaXMuaW5pdGlhbFggPSBlLng7XG4gICAgdGhpcy5pbml0aWFsT2Zmc2V0ID0gdGhpcy50aW1lbGluZS50aW1lQ29udGV4dC5vZmZzZXQ7XG4gICAgdGhpcy5pbml0aWFsQ2VudGVyVGltZSA9XG4gICAgICB0aGlzLnRpbWVsaW5lLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydChlLngpIC0gdGhpcy5pbml0aWFsT2Zmc2V0O1xuICAgIFxuICAgIHRoaXMuaW5pdGlhbFkgPSBlLnk7XG4gICAgdGhpcy5pbml0aWFsWm9vbSA9IHRoaXMudGltZWxpbmUudGltZUNvbnRleHQuem9vbTtcblxuICAgIHRoaXMuZHJhZ01vZGUgPSAndW5yZXNvbHZlZCc7XG5cbiAgICB0aGlzLl9waXhlbFRvRXhwb25lbnQgPSBzY2FsZXMubGluZWFyKClcbiAgICAgIC5kb21haW4oWzAsIDEwMF0pIC8vIDEwMHB4ID0+IGZhY3RvciAyXG4gICAgICAucmFuZ2UoWzAsIDFdKTtcbiAgfVxuXG4gIHVwZGF0ZURyYWdNb2RlKGUpIHtcbiAgICBcbiAgICBjb25zdCBkeCA9IE1hdGguYWJzKGUueCAtIHRoaXMuaW5pdGlhbFgpO1xuICAgIGNvbnN0IGR5ID0gTWF0aC5hYnMoZS55IC0gdGhpcy5pbml0aWFsWSk7XG5cbiAgICBjb25zdCBzbWFsbFRocmVzaG9sZCA9IDEwLCBiaWdUaHJlc2hvbGQgPSA1MDtcbiAgICBcbiAgICBpZiAodGhpcy5kcmFnTW9kZSA9PT0gJ3VucmVzb2x2ZWQnKSB7XG4gICAgICBpZiAoZHkgPiBzbWFsbFRocmVzaG9sZCAmJiBkeSA+IGR4ICogMikge1xuICAgICAgICB0aGlzLmRyYWdNb2RlID0gJ3ZlcnRpY2FsJztcbiAgICAgIH0gZWxzZSBpZiAoZHggPiBzbWFsbFRocmVzaG9sZCAmJiBkeCA+IGR5ICogMikge1xuICAgICAgICB0aGlzLmRyYWdNb2RlID0gJ2hvcml6b250YWwnO1xuICAgICAgfSBlbHNlIGlmIChkeCA+IHNtYWxsVGhyZXNob2xkICYmIGR5ID4gc21hbGxUaHJlc2hvbGQpIHtcbiAgICAgICAgdGhpcy5kcmFnTW9kZSA9ICdmcmVlJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5kcmFnTW9kZSA9PT0gJ3ZlcnRpY2FsJyAmJiBkeCA+IGJpZ1RocmVzaG9sZCkge1xuICAgICAgdGhpcy5kcmFnTW9kZSA9ICdmcmVlJztcbiAgICB9XG4gICAgaWYgKHRoaXMuZHJhZ01vZGUgPT09ICdob3Jpem9udGFsJyAmJiBkeSA+IGJpZ1RocmVzaG9sZCkge1xuICAgICAgdGhpcy5kcmFnTW9kZSA9ICdmcmVlJztcbiAgICB9XG4gIH1cblxuICBvbk1vdXNlTW92ZShlKSB7XG4gICAgLy8gcHJldmVudCBhbm5veWluZyB0ZXh0IHNlbGVjdGlvbiB3aGVuIGRyYWdnaW5nXG4gICAgZS5vcmlnaW5hbEV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB0aGlzLnVwZGF0ZURyYWdNb2RlKGUpO1xuICAgIFxuICAgIGNvbnN0IHRpbWVDb250ZXh0ID0gdGhpcy50aW1lbGluZS50aW1lQ29udGV4dDtcblxuICAgIGxldCBjaGFuZ2VkID0gZmFsc2U7XG4gICAgXG4gICAgaWYgKHRoaXMuZHJhZ01vZGUgPT09ICd2ZXJ0aWNhbCcgfHxcbiAgICAgICAgdGhpcy5kcmFnTW9kZSA9PT0gJ2ZyZWUnKSB7XG4gICAgICBcbiAgICAgIGNvbnN0IGV4cG9uZW50ID0gdGhpcy5fcGl4ZWxUb0V4cG9uZW50KGUueSAtIHRoaXMuaW5pdGlhbFkpO1xuXG4gICAgICAvLyAtMS4uLjEgLT4gMS8yLi4uMiA6XG4gICAgICBjb25zdCB0YXJnZXRab29tID0gdGhpcy5pbml0aWFsWm9vbSAqIE1hdGgucG93KDIsIGV4cG9uZW50KTtcblxuICAgICAgY29uc3QgY2xhbXBlZFpvb20gPSBNYXRoLm1pbihNYXRoLm1heCh0YXJnZXRab29tLCB0aGlzLm1pblpvb20pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1heFpvb20pO1xuXG4gICAgICBpZiAodGltZUNvbnRleHQuem9vbSAhPT0gY2xhbXBlZFpvb20pIHtcbiAgICAgICAgdGltZUNvbnRleHQuem9vbSA9IGNsYW1wZWRab29tO1xuICAgICAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBXZSB3YW50IHRvIGtlZXAgdGhlIHNhbWUgdGltZSB1bmRlciB0aGUgbW91c2UgYXMgd2Ugb3JpZ2luYWxseVxuICAgIC8vIGhhZCAodGhpcy5pbml0aWFsQ2VudGVyVGltZSkuIFdlIGFjdHVhbGx5IG5lZWQgdG8gZG8gdGhpc1xuICAgIC8vIHJlZ2FyZGxlc3Mgb2YgZHJhZyBtb2RlIC0tIGV2ZW4gaWYgd2UncmUgb25seSBpbnRlbmRpbmcgdG8gZHJhZ1xuICAgIC8vIHZlcnRpY2FsbHkgKGkuZS4gem9vbWluZyksIHdlIHN0aWxsIHdhbnQgdG8gZW5zdXJlIHRoZSBwb2ludFxuICAgIC8vIHVuZGVyIHRoZSBtb3VzZSBkb2Vzbid0IHdhbmRlciBvZmZcbiAgICBjb25zdCB0aW1lTW92ZWRUbyA9XG4gICAgICAgICAgdGltZUNvbnRleHQudGltZVRvUGl4ZWwodGhpcy5pbml0aWFsQ2VudGVyVGltZSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZUNvbnRleHQub2Zmc2V0KTtcbiAgICBcbiAgICBjb25zdCBkZWx0YSA9IGUueCAtIHRpbWVNb3ZlZFRvO1xuICAgIGNvbnN0IGRlbHRhVGltZSA9IHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydChkZWx0YSk7XG5cbiAgICBpZiAoZGVsdGFUaW1lICE9PSAwKSB7XG4gICAgICB0aW1lQ29udGV4dC5vZmZzZXQgKz0gZGVsdGFUaW1lO1xuICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgLy8gT3RoZXIgcG9zc2libGUgZXhwZXJpbWVudHMgd2l0aCBjZW50ZXJlZC16b29tLXN0YXRlXG4gICAgLy9cbiAgICAvLyBFeGFtcGxlIDE6IFByZXZlbnQgdGltZWxpbmUub2Zmc2V0IHRvIGJlIG5lZ2F0aXZlXG4gICAgLy8gdGltZUNvbnRleHQub2Zmc2V0ID0gTWF0aC5taW4odGltZUNvbnRleHQub2Zmc2V0LCAwKTtcbiAgICAvL1xuICAgIC8vIEV4YW1wbGUgMjogS2VlcCBpbiBjb250YWluZXIgd2hlbiB6b29tZWQgb3V0XG4gICAgLy8gaWYgKHRpbWVDb250ZXh0LnN0cmV0Y2hSYXRpbyA8IDEpwqB7XG4gICAgLy8gICBjb25zdCBtaW5PZmZzZXQgPSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQoMCk7XG4gICAgLy8gICBjb25zdCBtYXhPZmZzZXQgPSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQodmlldy53aWR0aCAtIHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRpbWVDb250ZXh0LmR1cmF0aW9uKSk7XG4gICAgLy8gICB0aW1lQ29udGV4dC5vZmZzZXQgPSBNYXRoLm1heCh0aW1lQ29udGV4dC5vZmZzZXQsIG1pbk9mZnNldCk7XG4gICAgLy8gICB0aW1lQ29udGV4dC5vZmZzZXQgPSBNYXRoLm1pbih0aW1lQ29udGV4dC5vZmZzZXQsIG1heE9mZnNldCk7XG4gICAgLy8gfVxuXG4gICAgaWYgKGNoYW5nZWQpIHtcbiAgICAgIHRoaXMudGltZWxpbmUudHJhY2tzLnVwZGF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VVcChlKSB7fVxufVxuIiwiaW1wb3J0IEJhc2VTdGF0ZSBmcm9tICcuL2Jhc2Utc3RhdGUnO1xuaW1wb3J0IFRpbWVDb250ZXh0QmVoYXZpb3IgZnJvbSAnLi4vYmVoYXZpb3JzL3RpbWUtY29udGV4dC1iZWhhdmlvcic7XG5cblxuLyoqXG4gKiBBIHN0YXRlIHRvIGludGVyYWN0IGRpcmVjdGx5IHdpdGggbGF5ZXJzIHRpbWUgY29udGV4dHMuXG4gKlxuICogW2V4YW1wbGUgdXNhZ2UsIHNlZS4gYWR2YW5jZWQgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItd2F2ZWZvcm0uaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udGV4dEVkaXRpb25TdGF0ZSBleHRlbmRzIEJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lKSB7XG4gICAgc3VwZXIodGltZWxpbmUpO1xuICB9XG5cbiAgaGFuZGxlRXZlbnQoZSkge1xuICAgIHN3aXRjaChlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ21vdXNlZG93bic6XG4gICAgICAgIHRoaXMub25Nb3VzZURvd24oZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlTW92ZShlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZXVwJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlVXAoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VEb3duKGUpIHtcbiAgICB0aGlzLm1vdXNlRG93biA9IHRydWU7XG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gZS50YXJnZXQ7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMubGF5ZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgY29uc3QgbGF5ZXIgPSB0aGlzLmxheWVyc1tpXTtcbiAgICAgIGlmIChsYXllci5oYXNFbGVtZW50KGUudGFyZ2V0KSkge1xuICAgICAgICB0aGlzLmN1cnJlbnRMYXllciA9IGxheWVyO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvbk1vdXNlTW92ZShlKSB7XG4gICAgaWYgKCF0aGlzLm1vdXNlRG93biB8fMKgIXRoaXMuY3VycmVudExheWVyKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgbGF5ZXIgPSB0aGlzLmN1cnJlbnRMYXllcjtcbiAgICBjb25zdCB0YXJnZXQgPSB0aGlzLmN1cnJlbnRUYXJnZXQ7XG5cbiAgICAvLyBpbiB0aGlzIGV4YW1wbGUgdGhlIGNvbnRleHQgaXMgc3RyZXRjaGVkIHdoZW4gc2hpZnQgaXMgcHJlc3NlZFxuICAgIGlmICghZS5vcmlnaW5hbEV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICBsYXllci5lZGl0Q29udGV4dChlLmR4LCBlLmR5LCB0YXJnZXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsYXllci5zdHJldGNoQ29udGV4dChlLmR4LCBlLmR5LCB0YXJnZXQpO1xuICAgIH1cblxuICAgIHRoaXMudGltZWxpbmUudHJhY2tzLnVwZGF0ZShsYXllcik7XG4gIH1cblxuICBvbk1vdXNlVXAoZSkge1xuICAgIHRoaXMubW91c2VEb3duID0gZmFsc2U7XG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gbnVsbDtcbiAgICB0aGlzLmN1cnJlbnRMYXllciA9IG51bGw7XG4gIH1cbn1cbiIsImltcG9ydCBCYXNlU3RhdGUgZnJvbSAnLi9iYXNlLXN0YXRlJztcblxuXG4vKipcbiAqIEEgc3RhdGUgdG8gZWRpdCBzaGFwZXMgaW4gdGhlIG1vcmUgZ2VuZXJhbCB3YXkuIEludGVyYWN0IG9ubHkgd2l0aCBzZWxlY3RlZCBzaGFwZXMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVkaXRpb25TdGF0ZSBleHRlbmRzIEJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lKSB7XG4gICAgc3VwZXIodGltZWxpbmUpO1xuXG4gICAgdGhpcy5jdXJyZW50RWRpdGVkTGF5ZXIgPSBudWxsO1xuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IG51bGw7XG4gIH1cblxuICBlbnRlcigpIHt9XG4gIGV4aXQoKSB7fVxuXG4gIGhhbmRsZUV2ZW50KGUpIHtcbiAgICBzd2l0Y2ggKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlRG93bihlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZW1vdmUnOlxuICAgICAgICB0aGlzLm9uTW91c2VNb3ZlKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICB0aGlzLm9uTW91c2VVcChlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZURvd24oZSkge1xuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IGUudGFyZ2V0O1xuICB9XG5cbiAgb25Nb3VzZU1vdmUoZSkge1xuICAgIHRoaXMubGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB7XG4gICAgICBjb25zdCBpdGVtcyA9IGxheWVyLnNlbGVjdGVkSXRlbXM7XG5cbiAgICAgIGxheWVyLmVkaXQoaXRlbXMsIGUuZHgsIGUuZHksIHRoaXMuY3VycmVudFRhcmdldCk7XG4gICAgICBsYXllci51cGRhdGUoaXRlbXMpO1xuICAgIH0pO1xuICB9XG5cbiAgb25Nb3VzZVVwKGUpIHtcbiAgICB0aGlzLmN1cnJlbnRFZGl0ZWRMYXllciA9IG51bGw7XG4gICAgdGhpcy5tb3VzZURvd24gPSBmYWxzZTtcbiAgfVxufVxuIiwiaW1wb3J0IEJhc2VTdGF0ZSBmcm9tICcuL2Jhc2Utc3RhdGUnO1xuaW1wb3J0IG5zIGZyb20gJy4uL2NvcmUvbmFtZXNwYWNlJztcblxuXG4vKipcbiAqIEEgc3RhdGUgdG8gc2VsZWN0IHNoYXBlcy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VsZWN0aW9uU3RhdGUgZXh0ZW5kcyBCYXNlU3RhdGUge1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSAvKiwgb3B0aW9ucyA9IHt9ICovKSB7XG4gICAgc3VwZXIodGltZWxpbmUgLyosIG9wdGlvbnMgKi8pO1xuXG4gICAgdGhpcy5jdXJyZW50TGF5ZXIgPSBudWxsO1xuICAgIC8vIG5lZWQgYSBjYWNoZWRcbiAgICB0aGlzLnNlbGVjdGVkSXRlbXMgPSBudWxsO1xuICAgIHRoaXMubW91c2VEb3duID0gZmFsc2U7XG4gICAgdGhpcy5zaGlmdEtleSA9IGZhbHNlO1xuXG4gICAgdGhpcy5fbGF5ZXJTZWxlY3RlZEl0ZW1zTWFwID0gbmV3IE1hcCgpO1xuICB9XG5cbiAgZW50ZXIoKSB7XG5cbiAgfVxuXG4gIGV4aXQoKSB7XG4gICAgY29uc3QgY29udGFpbmVycyA9IHRoaXMudGltZWxpbmUuY29udGFpbmVycztcblxuICAgIGZvciAobGV0IGlkIGluIGNvbnRhaW5lcnMpIHtcbiAgICAgIHRoaXMuX3JlbW92ZUJydXNoKGNvbnRhaW5lcnNbaWRdKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVFdmVudChlKSB7XG4gICAgc3dpdGNoIChlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ21vdXNlZG93bic6XG4gICAgICAgIHRoaXMub25Nb3VzZURvd24oZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlTW92ZShlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZXVwJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlVXAoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY2xpY2snOlxuICAgICAgICB0aGlzLm9uQ2xpY2soZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAna2V5ZG93bic6XG4gICAgICAgIHRoaXMub25LZXkoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAna2V5dXAnOlxuICAgICAgICB0aGlzLm9uS2V5KGUpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBfYWRkQnJ1c2godHJhY2spIHtcbiAgICBpZiAodHJhY2suJGJydXNoKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgYnJ1c2ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdyZWN0Jyk7XG4gICAgYnJ1c2guc3R5bGUuZmlsbCA9ICcjNjg2ODY4JztcbiAgICBicnVzaC5zdHlsZS5vcGFjaXR5ID0gMC4yO1xuXG4gICAgdHJhY2suJGludGVyYWN0aW9ucy5hcHBlbmRDaGlsZChicnVzaCk7XG4gICAgdHJhY2suJGJydXNoID0gYnJ1c2g7XG4gIH1cblxuICBfcmVtb3ZlQnJ1c2godHJhY2spIHtcbiAgICBpZiAodHJhY2suJGJydXNoID09PSBudWxsKSB7IHJldHVybjsgfVxuXG4gICAgdGhpcy5fcmVzZXRCcnVzaCh0cmFjayk7XG4gICAgdHJhY2suJGludGVyYWN0aW9ucy5yZW1vdmVDaGlsZCh0cmFjay4kYnJ1c2gpO1xuICAgIGRlbGV0ZSB0cmFjay4kYnJ1c2g7XG4gIH1cblxuICBfcmVzZXRCcnVzaCh0cmFjaykge1xuICAgIGNvbnN0ICRicnVzaCA9IHRyYWNrLiRicnVzaDtcbiAgICAvLyByZXNldCBicnVzaCBlbGVtZW50XG4gICAgJGJydXNoLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsIDApJyk7XG4gICAgJGJydXNoLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIDApO1xuICAgICRicnVzaC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgMCk7XG4gIH1cblxuICBfdXBkYXRlQnJ1c2goZSwgdHJhY2spIHtcbiAgICBjb25zdCAkYnJ1c2ggPSB0cmFjay4kYnJ1c2g7XG4gICAgY29uc3QgdHJhbnNsYXRlID0gYHRyYW5zbGF0ZSgke2UuYXJlYS5sZWZ0fSwgJHtlLmFyZWEudG9wfSlgO1xuXG4gICAgJGJydXNoLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCB0cmFuc2xhdGUpO1xuICAgICRicnVzaC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCBlLmFyZWEud2lkdGgpO1xuICAgICRicnVzaC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgZS5hcmVhLmhlaWdodCk7XG4gIH1cblxuICBvbktleShlKSB7XG4gICAgdGhpcy5zaGlmdEtleSA9IGUuc2hpZnRLZXk7XG4gIH1cblxuICBvbk1vdXNlRG93bihlKSB7XG4gICAgdGhpcy5fY3VycmVudFRyYWNrID0gdGhpcy50aW1lbGluZS5nZXRUcmFja0Zyb21ET01FbGVtZW50KGUudGFyZ2V0KTtcbiAgICBpZiAoIXRoaXMuX2N1cnJlbnRUcmFjaykgeyByZXR1cm47IH1cblxuICAgIHRoaXMuX2FkZEJydXNoKHRoaXMuX2N1cnJlbnRUcmFjayk7XG5cbiAgICAvLyByZWNyZWF0ZSB0aGUgbWFwXG4gICAgdGhpcy5fbGF5ZXJTZWxlY3RlZEl0ZW1zTWFwID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuX2N1cnJlbnRUcmFjay5sYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHtcbiAgICAgIHRoaXMuX2xheWVyU2VsZWN0ZWRJdGVtc01hcC5zZXQobGF5ZXIsIGxheWVyLnNlbGVjdGVkSXRlbXMuc2xpY2UoMCkpO1xuICAgIH0pO1xuICB9XG5cbiAgb25Nb3VzZU1vdmUoZSkge1xuICAgIHRoaXMuX3VwZGF0ZUJydXNoKGUsIHRoaXMuX2N1cnJlbnRUcmFjayk7XG5cbiAgICB0aGlzLl9jdXJyZW50VHJhY2subGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB7XG4gICAgICBjb25zdCBjdXJyZW50U2VsZWN0aW9uID0gbGF5ZXIuc2VsZWN0ZWRJdGVtcztcbiAgICAgIGNvbnN0IGN1cnJlbnRJdGVtcyA9IGxheWVyLmdldEl0ZW1zSW5BcmVhKGUuYXJlYSk7XG5cbiAgICAgIC8vIGlmIGlzIG5vdCBwcmVzc2VkXG4gICAgICBpZiAoIWUub3JpZ2luYWxFdmVudC5zaGlmdEtleSkge1xuICAgICAgICBsYXllci51bnNlbGVjdChjdXJyZW50U2VsZWN0aW9uKTtcbiAgICAgICAgbGF5ZXIuc2VsZWN0KGN1cnJlbnRJdGVtcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB0b1NlbGVjdCA9IFtdO1xuICAgICAgICBjb25zdCB0b1Vuc2VsZWN0ID0gW107XG4gICAgICAgIC8vIHVzZSB0aGUgc2VsZWN0aW9uIGZyb20gdGhlIHByZXZpb3VzIGRyYWdcbiAgICAgICAgY29uc3QgcHJldmlvdXNTZWxlY3Rpb24gPSB0aGlzLl9sYXllclNlbGVjdGVkSXRlbXNNYXAuZ2V0KGxheWVyKTtcbiAgICAgICAgLy8gdG9VbnNlbGVjdCA9IHRvVW5zZWxlY3QuY29uY2F0KHByZXZpb3VzU2VsZWN0ZWRJdGVtcyk7XG5cbiAgICAgICAgY3VycmVudEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICBpZiAocHJldmlvdXNTZWxlY3Rpb24uaW5kZXhPZihpdGVtKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHRvU2VsZWN0LnB1c2goaXRlbSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRvVW5zZWxlY3QucHVzaChpdGVtKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGN1cnJlbnRTZWxlY3Rpb24uZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGN1cnJlbnRJdGVtcy5pbmRleE9mKGl0ZW0pID09PSAtMSAmJlxuICAgICAgICAgICAgcHJldmlvdXNTZWxlY3Rpb24uaW5kZXhPZihpdGVtKSA9PT0gLTFcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHRvVW5zZWxlY3QucHVzaChpdGVtKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxheWVyLnVuc2VsZWN0KHRvVW5zZWxlY3QpO1xuICAgICAgICBsYXllci5zZWxlY3QodG9TZWxlY3QpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgb25Nb3VzZVVwKGUpIHtcbiAgICB0aGlzLl9yZW1vdmVCcnVzaCh0aGlzLl9jdXJyZW50VHJhY2spO1xuICB9XG5cbiAgb25DbGljayhlKSB7XG4gICAgaWYgKCF0aGlzLl9jdXJyZW50VHJhY2spIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLl9jdXJyZW50VHJhY2subGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB7XG4gICAgICBsZXQgaXRlbSA9IGxheWVyLmdldEl0ZW1Gcm9tRE9NRWxlbWVudChlLnRhcmdldCk7XG5cbiAgICAgIGlmICghZS5vcmlnaW5hbEV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgIGxheWVyLnVuc2VsZWN0KCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgIGxheWVyLnRvZ2dsZVNlbGVjdGlvbihpdGVtKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IEJhc2VTdGF0ZSBmcm9tICcuL2Jhc2Utc3RhdGUnO1xuXG5cbi8qKlxuICogQSBzdGF0ZSB0byBzZWxlY3QgYW5kIGVkaXQgc2hhcGVzIGluIGEgc2ltcGxlIHdheS4gKGtpbmQgb2YgcGx1ZyBuIHBsYXkgc3RhdGUpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpbXBsZUVkaXRpb25TdGF0ZSBleHRlbmRzIEJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lKSB7XG4gICAgc3VwZXIodGltZWxpbmUpO1xuXG4gICAgdGhpcy5jdXJyZW50RWRpdGVkTGF5ZXIgPSBudWxsO1xuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IG51bGw7XG4gIH1cblxuICBlbnRlcigpIHt9XG4gIGV4aXQoKSB7fVxuXG4gIGhhbmRsZUV2ZW50KGUpIHtcbiAgICBzd2l0Y2ggKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlRG93bihlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZW1vdmUnOlxuICAgICAgICB0aGlzLm9uTW91c2VNb3ZlKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICB0aGlzLm9uTW91c2VVcChlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZURvd24oZSkge1xuICAgIC8vIGtlZXAgdGFyZ2V0IGNvbnNpc3RlbnQgd2l0aCBtb3VzZSBkb3duXG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gZS50YXJnZXQ7XG5cbiAgICB0aGlzLmxheWVycy5mb3JFYWNoKChsYXllcikgPT4ge1xuICAgICAgaWYgKCFsYXllci5oYXNFbGVtZW50KHRoaXMuY3VycmVudFRhcmdldCkpIHsgcmV0dXJuOyB9XG5cbiAgICAgIGlmICghZS5vcmlnaW5hbEV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgIGxheWVyLnVuc2VsZWN0KCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGl0ZW0gPSBsYXllci5nZXRJdGVtRnJvbURPTUVsZW1lbnQodGhpcy5jdXJyZW50VGFyZ2V0KTtcblxuICAgICAgaWYgKGl0ZW0gPT09IG51bGwpIHsgcmV0dXJuOyB9XG5cbiAgICAgIHRoaXMuY3VycmVudEVkaXRlZExheWVyID0gbGF5ZXI7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7IGxheWVyLnNlbGVjdChpdGVtKTsgfSk7XG4gICAgfSk7XG4gIH1cblxuICBvbk1vdXNlTW92ZShlKSB7XG4gICAgaWYgKCF0aGlzLmN1cnJlbnRFZGl0ZWRMYXllcikgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IGxheWVyID0gdGhpcy5jdXJyZW50RWRpdGVkTGF5ZXI7XG4gICAgY29uc3QgaXRlbXMgPSBsYXllci5zZWxlY3RlZEl0ZW1zO1xuXG4gICAgbGF5ZXIuZWRpdChpdGVtcywgZS5keCwgZS5keSwgdGhpcy5jdXJyZW50VGFyZ2V0KTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7IGxheWVyLnVwZGF0ZShpdGVtcyk7IH0pO1xuICB9XG5cbiAgb25Nb3VzZVVwKGUpIHtcbiAgICB0aGlzLmN1cnJlbnRFZGl0ZWRMYXllciA9IG51bGw7XG4gIH1cbn1cbiIsIi8qKlxuICogRm9ybWF0dGluZyBoZWxwZXJzIGZ1bmN0aW9ucy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuICAvKipcbiAgICogQWRkIGEgYHNpZ25gIHRvIHRoZSBsZWZ0IG9mIGEgZ2l2ZW4gYGlucHV0YCB0byBtYXRjaCBgbGVuZ3RoYFxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaW5wdXQgLSBUaGUgc3RyaW5nIHRvIGZvcm1hdC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IHNpZ24gLSBUaGUgY2hhcmFjdGVyIHRvIGFkZCB0byB0aGUgbGVmdC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aCAtIFRoZSBsZW5ndGggb2YgdGhlIG91dHB1dCBzdHJpbmcuXG4gICAqL1xuICBwYWRMZWZ0KGlucHV0LCBzaWduLCBsZW5ndGgpIHtcbiAgICBpbnB1dCArPSAnJztcbiAgICB3aGlsZSAoaW5wdXQubGVuZ3RoIDwgbGVuZ3RoKSB7XG4gICAgICBpbnB1dCA9IHNpZ24gKyBpbnB1dDtcbiAgICB9XG4gICAgcmV0dXJuIGlucHV0O1xuICB9XG59O1xuIiwiXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXRyaXhFbnRpdHkge1xuXG4gIGdldENvbHVtbkNvdW50KCkge1xuICAgIC8vIFJldHVybiBoZXJlIHRoZSB0b3RhbCBudW1iZXIgb2YgY29sdW1ucyBpbiB0aGUgbWF0cml4LlxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZ2V0Q29sdW1uSGVpZ2h0KCkge1xuICAgIC8vIFJldHVybiBoZXJlIHRoZSBoZWlnaHQgb2YgYSBjb2x1bW4gaW4gdGhlIG1hdHJpeC4gQWxsIGNvbHVtbnNcbiAgICAvLyBhcmUgZXhwZWN0ZWQgdG8gYmUgb2YgZXF1YWwgaGVpZ2h0LlxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZ2V0Q29sdW1uKG4pIHtcbiAgICAvLyBSZXR1cm4gaGVyZSBhIHNpbmdsZSBjb2x1bW4gKG9mIGluZGV4IG4pIGFzIGFuIGFycmF5IG9yXG4gICAgLy8gRmxvYXQzMkFycmF5LlxuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGdldFN0ZXBEdXJhdGlvbigpIHtcbiAgICAvLyBSZXR1cm4gdGhlIHRpbWUgaW50ZXJ2YWwgaW4gc2Vjb25kcyBiZXR3ZWVuIGNvbnNlY3V0aXZlXG4gICAgLy8gY29sdW1ucy4gQ29sdW1ucyBhcmUgZXhwZWN0ZWQgdG8gYmUgZXF1YWxseSBzcGFjZWQgaW4gdGltZS4gIElmXG4gICAgLy8gdGhpcyByZXR1cm5zIDAsIHRoZSBtYXRyaXggaXMgY29uc2lkZXJlZCB0byBzcGFuIHRoZSBlbnRpcmVcbiAgICAvLyBkdXJhdGlvbiBvZiBhbnkgYXNzb2NpYXRlZCB0aW1lbGluZS5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGdldFN0YXJ0VGltZSgpIHtcbiAgICAvLyBSZXR1cm4gdGhlIGxvY2F0aW9uIGluIHRpbWUgb2YgdGhlIGZpcnN0IGNvbHVtbiBpbiBzZWNvbmRzLlxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICAvLyBDYWxsZWQgd2hlbiB0aGlzIG9iamVjdCBpcyBubyBsb25nZXIgZ29pbmcgdG8gYmUgdXNlZC5cbiAgfVxufVxuXG4iLCIvKipcbiAqIE9ydGhvZ29uYWxEYXRhIHRyYW5zZm9ybXMgYW4gb2JqZWN0IG9mIGFycmF5cyBge2ZvbzogWzEsIDJdLCBiYXI6IFszLCA0XX1gXG4gKiB0byBvciBmcm9tIGFuIGFycmF5IG9mIG9iamVjdHMgYFt7Zm9vOiAxLCBiYXI6IDN9LCB7Zm9vOiAyLCBiYXI6IDR9XWBcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgT3J0aG9nb25hbERhdGEge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9jb2xzID0gbnVsbDsgLy8gT2JqZWN0IG9mIGFycmF5c1xuICAgIHRoaXMuX3Jvd3MgPSBudWxsOyAvLyBBcnJheSBvZiBvYmplY3RzXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgdGhlIGNvbnNpc3RlbmN5IG9mIHRoZSBkYXRhLlxuICAgKi9cbiAgX2NoZWNrQ29uc2lzdGVuY3koKSB7XG4gICAgbGV0IHNpemUgPSBudWxsO1xuXG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuX2NvbHMpIHtcbiAgICAgIGNvbnN0IGNvbCA9IHRoaXMuX2NvbHNba2V5XTtcbiAgICAgIGNvbnN0IGNvbExlbmd0aCA9IGNvbC5sZW5ndGg7XG5cbiAgICAgIGlmIChzaXplICE9PSBudWxsICYmIHNpemUgIT09IGNvbExlbmd0aCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dGhpcy5wcm90b3R5cGUuY29uc3RydWN0b3IubmFtZX06IGluY29uc2lzdGVudCBkYXRhYCk7XG4gICAgICB9IGVsc2UgaWYgKHNpemUgPT09IG51bGwpIHtcbiAgICAgICAgc2l6ZSA9IGNvbExlbmd0aDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyBhcnJheSBvZiBvYmplY3RzIGZyb20gb2JqZWN0IG9mIGFycmF5cy5cbiAgICovXG4gIHVwZGF0ZUZyb21Db2xzKCkge1xuICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXModGhpcy5fY29scyk7XG5cbiAgICBrZXlzLmZvckVhY2goKGtleSwgaSkgPT4ge1xuICAgICAgY29uc3QgY29sID0gdGhpcy5fY29sc1trZXldO1xuXG4gICAgICBjb2wuZm9yRWFjaCgodmFsdWUsIGluZGV4KSA9PiB7XG4gICAgICAgIGlmICh0aGlzLl9yb3dzW2luZGV4XSA9PT0gdW5kZWZpbmVkKSB0aGlzLl9yb3dzW2luZGV4XSA9IHt9O1xuICAgICAgICB0aGlzLl9yb3dzW2luZGV4XVtrZXldID0gdmFsdWU7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMuX2NoZWNrQ29uc2lzdGVuY3koKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIG9iamVjdCBvZiBhcnJheXMgZnJvbSBhcnJheSBvZiBvYmplY3RzLlxuICAgKi9cbiAgdXBkYXRlRnJvbVJvd3MoKSB7XG4gICAgdGhpcy5fcm93cy5mb3JFYWNoKChvYmosIGluZGV4KSA9PiB7XG4gICAgICBmb3IgKGxldCBrZXkgaW4gb2JqKSB7XG4gICAgICAgIGlmIChpbmRleCA9PT0gMCkgdGhpcy5fY29sc1trZXldID0gW107XG4gICAgICAgIHRoaXMuX2NvbHNba2V5XS5wdXNoKG9ialtrZXldKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuX2NoZWNrQ29uc2lzdGVuY3koKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGFuIG9iamVjdCBvZiBhcnJheXMuXG4gICAqXG4gICAqIEB0eXBlIHtPYmplY3Q8U3RyaW5nLCBBcnJheT59XG4gICAqL1xuICBzZXQgY29scyhvYmopIHtcbiAgICB0aGlzLl9jb2xzID0gb2JqO1xuICAgIHRoaXMuX3Jvd3MgPSBbXTtcblxuICAgIHRoaXMudXBkYXRlRnJvbUNvbHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIG9iamVjdCBvZiBhcnJheXMuXG4gICAqXG4gICAqIEB0eXBlIHtPYmplY3Q8U3RyaW5nLCBBcnJheT59XG4gICAqL1xuICBnZXQgY29scygpIHtcbiAgICByZXR1cm4gdGhpcy5fY29scztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGFuIGFycmF5IG9mIG9iamVjdHMuXG4gICAqXG4gICAqIEB0eXBlIHtBcnJheTxPYmplY3Q+fVxuICAgKi9cbiAgc2V0IHJvd3MoYXJyKSB7XG4gICAgdGhpcy5fcm93cyA9IGFycjtcbiAgICB0aGlzLl9jb2xzID0ge307XG5cbiAgICB0aGlzLnVwZGF0ZUZyb21Sb3dzKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBhcnJheSBvZiBvYmplY3RzLlxuICAgKlxuICAgKiBAdHlwZSB7QXJyYXk8T2JqZWN0Pn1cbiAgICovXG4gIGdldCByb3dzKCkge1xuICAgIHJldHVybiB0aGlzLl9yb3dzO1xuICB9XG59XG4iLCIvKipcbiogQGF1dGhvciBSb2JlcnQgRWlzZWxlIDxyb2JlcnRAeGFyZy5vcmc+XG4qIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDEwLCBSb2JlcnQgRWlzZWxlXG4qIEBsaW5rIGh0dHA6Ly93d3cueGFyZy5vcmcvMjAxMC8wMy9nZW5lcmF0ZS1jbGllbnQtc2lkZS1wbmctZmlsZXMtdXNpbmctamF2YXNjcmlwdC9cbiogQGxpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9ic2QtbGljZW5zZS5waHAgQlNEIExpY2Vuc2VcbiovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQTkdFbmNvZGVyIHtcblxuICBjb25zdHJ1Y3Rvcih3aWR0aCwgaGVpZ2h0LCBkZXB0aCkge1xuXG4gICAgdGhpcy53aWR0aCAgID0gd2lkdGg7XG4gICAgdGhpcy5oZWlnaHQgID0gaGVpZ2h0O1xuICAgIHRoaXMuZGVwdGggICA9IGRlcHRoO1xuXG4gICAgLy8gcGl4ZWwgZGF0YSBhbmQgcm93IGZpbHRlciBpZGVudGlmaWVyIHNpemVcbiAgICB0aGlzLnBpeF9zaXplID0gaGVpZ2h0ICogKHdpZHRoICsgMSk7XG5cbiAgICAvLyBkZWZsYXRlIGhlYWRlciwgcGl4X3NpemUsIGJsb2NrIGhlYWRlcnMsIGFkbGVyMzIgY2hlY2tzdW1cbiAgICB0aGlzLmRhdGFfc2l6ZSA9IDIgKyB0aGlzLnBpeF9zaXplICsgNSAqIE1hdGguZmxvb3IoKDB4ZmZmZSArIHRoaXMucGl4X3NpemUpIC8gMHhmZmZmKSArIDQ7XG5cbiAgICAvLyBvZmZzZXRzIGFuZCBzaXplcyBvZiBQbmcgY2h1bmtzXG4gICAgdGhpcy5paGRyX29mZnMgPSAwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSUhEUiBvZmZzZXQgYW5kIHNpemVcbiAgICB0aGlzLmloZHJfc2l6ZSA9IDQgKyA0ICsgMTMgKyA0O1xuICAgIHRoaXMucGx0ZV9vZmZzID0gdGhpcy5paGRyX29mZnMgKyB0aGlzLmloZHJfc2l6ZTtcdC8vIFBMVEUgb2Zmc2V0IGFuZCBzaXplXG4gICAgdGhpcy5wbHRlX3NpemUgPSA0ICsgNCArIDMgKiBkZXB0aCArIDQ7XG4gICAgdGhpcy50cm5zX29mZnMgPSB0aGlzLnBsdGVfb2ZmcyArIHRoaXMucGx0ZV9zaXplO1x0Ly8gdFJOUyBvZmZzZXQgYW5kIHNpemVcbiAgICB0aGlzLnRybnNfc2l6ZSA9IDQgKyA0ICsgZGVwdGggKyA0O1xuICAgIHRoaXMuaWRhdF9vZmZzID0gdGhpcy50cm5zX29mZnMgKyB0aGlzLnRybnNfc2l6ZTtcdC8vIElEQVQgb2Zmc2V0IGFuZCBzaXplXG4gICAgdGhpcy5pZGF0X3NpemUgPSA0ICsgNCArIHRoaXMuZGF0YV9zaXplICsgNDtcbiAgICB0aGlzLmllbmRfb2ZmcyA9IHRoaXMuaWRhdF9vZmZzICsgdGhpcy5pZGF0X3NpemU7XHQvLyBJRU5EIG9mZnNldCBhbmQgc2l6ZVxuICAgIHRoaXMuaWVuZF9zaXplID0gNCArIDQgKyA0O1xuICAgIHRoaXMuYnVmZmVyX3NpemUgID0gdGhpcy5pZW5kX29mZnMgKyB0aGlzLmllbmRfc2l6ZTtcdC8vIHRvdGFsIFBORyBzaXplXG5cbiAgICB0aGlzLmJ1ZmZlciAgPSBbXTtcbiAgICB0aGlzLnBhbGV0dGUgPSB7fTtcbiAgICB0aGlzLnBpbmRleCAgPSAwO1xuXG4gICAgdmFyIF9jcmMzMiA9IFtdO1xuXG4gICAgdmFyIGk7XG4gICAgXG4gICAgLy8gaW5pdGlhbGl6ZSBidWZmZXIgd2l0aCB6ZXJvIGJ5dGVzXG4gICAgZm9yIChpID0gMDsgaSA8IHRoaXMuYnVmZmVyX3NpemU7IGkrKykge1xuICAgICAgdGhpcy5idWZmZXJbaV0gPSBcIlxceDAwXCI7XG4gICAgfVxuXG4gICAgLy8gaW5pdGlhbGl6ZSBub24temVybyBlbGVtZW50c1xuICAgIFBOR0VuY29kZXIuX3dyaXRlKHRoaXMuYnVmZmVyLCB0aGlzLmloZHJfb2ZmcywgUE5HRW5jb2Rlci5fYnl0ZTQodGhpcy5paGRyX3NpemUgLSAxMiksICdJSERSJywgUE5HRW5jb2Rlci5fYnl0ZTQod2lkdGgpLCBQTkdFbmNvZGVyLl9ieXRlNChoZWlnaHQpLCBcIlxceDA4XFx4MDNcIik7XG4gICAgUE5HRW5jb2Rlci5fd3JpdGUodGhpcy5idWZmZXIsIHRoaXMucGx0ZV9vZmZzLCBQTkdFbmNvZGVyLl9ieXRlNCh0aGlzLnBsdGVfc2l6ZSAtIDEyKSwgJ1BMVEUnKTtcbiAgICBQTkdFbmNvZGVyLl93cml0ZSh0aGlzLmJ1ZmZlciwgdGhpcy50cm5zX29mZnMsIFBOR0VuY29kZXIuX2J5dGU0KHRoaXMudHJuc19zaXplIC0gMTIpLCAndFJOUycpO1xuICAgIFBOR0VuY29kZXIuX3dyaXRlKHRoaXMuYnVmZmVyLCB0aGlzLmlkYXRfb2ZmcywgUE5HRW5jb2Rlci5fYnl0ZTQodGhpcy5pZGF0X3NpemUgLSAxMiksICdJREFUJyk7XG4gICAgUE5HRW5jb2Rlci5fd3JpdGUodGhpcy5idWZmZXIsIHRoaXMuaWVuZF9vZmZzLCBQTkdFbmNvZGVyLl9ieXRlNCh0aGlzLmllbmRfc2l6ZSAtIDEyKSwgJ0lFTkQnKTtcblxuICAgIC8vIGluaXRpYWxpemUgZGVmbGF0ZSBoZWFkZXJcbiAgICB2YXIgaGVhZGVyID0gKCg4ICsgKDcgPDwgNCkpIDw8IDgpIHwgKDMgPDwgNik7XG4gICAgaGVhZGVyKz0gMzEgLSAoaGVhZGVyICUgMzEpO1xuXG4gICAgUE5HRW5jb2Rlci5fd3JpdGUodGhpcy5idWZmZXIsIHRoaXMuaWRhdF9vZmZzICsgOCwgUE5HRW5jb2Rlci5fYnl0ZTIoaGVhZGVyKSk7XG5cbiAgICAvLyBpbml0aWFsaXplIGRlZmxhdGUgYmxvY2sgaGVhZGVyc1xuICAgIGZvciAoaSA9IDA7IChpIDw8IDE2KSAtIDEgPCB0aGlzLnBpeF9zaXplOyBpKyspIHtcbiAgICAgIHZhciBzaXplLCBiaXRzO1xuICAgICAgaWYgKGkgKyAweGZmZmYgPCB0aGlzLnBpeF9zaXplKSB7XG5cdHNpemUgPSAweGZmZmY7XG5cdGJpdHMgPSBcIlxceDAwXCI7XG4gICAgICB9IGVsc2Uge1xuXHRzaXplID0gdGhpcy5waXhfc2l6ZSAtIChpIDw8IDE2KSAtIGk7XG5cdGJpdHMgPSBcIlxceDAxXCI7XG4gICAgICB9XG4gICAgICBQTkdFbmNvZGVyLl93cml0ZSh0aGlzLmJ1ZmZlciwgdGhpcy5pZGF0X29mZnMgKyA4ICsgMiArIChpIDw8IDE2KSArIChpIDw8IDIpLCBiaXRzLCBQTkdFbmNvZGVyLl9ieXRlMmxzYihzaXplKSwgUE5HRW5jb2Rlci5fYnl0ZTJsc2IofnNpemUpKTtcbiAgICB9XG5cbiAgICAvKiBDcmVhdGUgY3JjMzIgbG9va3VwIHRhYmxlICovXG4gICAgZm9yIChpID0gMDsgaSA8IDI1NjsgaSsrKSB7XG4gICAgICB2YXIgYyA9IGk7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IDg7IGorKykge1xuXHRpZiAoYyAmIDEpIHtcblx0ICBjID0gLTMwNjY3NDkxMiBeICgoYyA+PiAxKSAmIDB4N2ZmZmZmZmYpO1xuXHR9IGVsc2Uge1xuXHQgIGMgPSAoYyA+PiAxKSAmIDB4N2ZmZmZmZmY7XG5cdH1cbiAgICAgIH1cbiAgICAgIF9jcmMzMltpXSA9IGM7XG4gICAgfVxuXG4gICAgdGhpcy5fY3JjMzIgPSBfY3JjMzI7XG4gIH1cbiAgXG4gIHN0YXRpYyBfd3JpdGUoYnVmZmVyLCBvZmZzKSB7XG4gICAgZm9yICh2YXIgaSA9IDI7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYXJndW1lbnRzW2ldLmxlbmd0aDsgaisrKSB7XG5cdGJ1ZmZlcltvZmZzKytdID0gYXJndW1lbnRzW2ldLmNoYXJBdChqKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzdGF0aWMgX2J5dGUyKHcpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSgodyA+PiA4KSAmIDI1NSwgdyAmIDI1NSk7XG4gIH1cblxuICBzdGF0aWMgX2J5dGU0KHcpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSgodyA+PiAyNCkgJiAyNTUsICh3ID4+IDE2KSAmIDI1NSwgKHcgPj4gOCkgJiAyNTUsIHcgJiAyNTUpO1xuICB9XG4gIFxuICBzdGF0aWMgX2J5dGUybHNiKHcpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSh3ICYgMjU1LCAodyA+PiA4KSAmIDI1NSk7XG4gIH1cblxuICAvLyBjb21wdXRlIHRoZSBpbmRleCBpbnRvIGEgcG5nIGZvciBhIGdpdmVuIHBpeGVsXG4gIGluZGV4KHgseSkge1xuICAgIHZhciBpID0geSAqICh0aGlzLndpZHRoICsgMSkgKyB4ICsgMTtcbiAgICB2YXIgaiA9IHRoaXMuaWRhdF9vZmZzICsgOCArIDIgKyA1ICogTWF0aC5mbG9vcigoaSAvIDB4ZmZmZikgKyAxKSArIGk7XG4gICAgcmV0dXJuIGo7XG4gIH1cblxuICAvLyBjb252ZXJ0IGEgY29sb3IgYW5kIGJ1aWxkIHVwIHRoZSBwYWxldHRlXG4gIGNvbG9yKHJlZCwgZ3JlZW4sIGJsdWUsIGFscGhhKSB7XG4gICAgICBcbiAgICBhbHBoYSA9IGFscGhhID49IDAgPyBhbHBoYSA6IDI1NTtcbiAgICB2YXIgY29sb3IgPSAoKCgoKGFscGhhIDw8IDgpIHwgcmVkKSA8PCA4KSB8IGdyZWVuKSA8PCA4KSB8IGJsdWU7XG4gICAgICBcbiAgICBpZiAodHlwZW9mIHRoaXMucGFsZXR0ZVtjb2xvcl0gPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgaWYgKHRoaXMucGluZGV4ID09IHRoaXMuZGVwdGgpIHJldHVybiBcIlxceDAwXCI7XG4gICAgICBcbiAgICAgIHZhciBuZHggPSB0aGlzLnBsdGVfb2ZmcyArIDggKyAzICogdGhpcy5waW5kZXg7XG4gICAgICBcbiAgICAgIHRoaXMuYnVmZmVyW25keCArIDBdID0gU3RyaW5nLmZyb21DaGFyQ29kZShyZWQpO1xuICAgICAgdGhpcy5idWZmZXJbbmR4ICsgMV0gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGdyZWVuKTtcbiAgICAgIHRoaXMuYnVmZmVyW25keCArIDJdID0gU3RyaW5nLmZyb21DaGFyQ29kZShibHVlKTtcbiAgICAgIHRoaXMuYnVmZmVyW3RoaXMudHJuc19vZmZzKzgrdGhpcy5waW5kZXhdID0gU3RyaW5nLmZyb21DaGFyQ29kZShhbHBoYSk7XG4gICAgICBcbiAgICAgIHRoaXMucGFsZXR0ZVtjb2xvcl0gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHRoaXMucGluZGV4KyspO1xuXG4vLyAgICAgIGNvbnNvbGUubG9nKFwiQWRkZWQgY29sb3VyIFtcIiArIHJlZCArIFwiLFwiICsgZ3JlZW4gKyBcIixcIiArIGJsdWUgK1xuLy8gICAgICAgICAgICAgICAgICBcIl0sIHBhbGV0dGUgbm93IGhhcyBcIiArIHRoaXMucGluZGV4ICsgXCIgY29sb3VyKHMpXCIpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5wYWxldHRlW2NvbG9yXTtcbiAgfVxuXG4gIC8vIG91dHB1dCBhIFBORyBzdHJpbmcsIEJhc2U2NCBlbmNvZGVkXG4gIGdldEJhc2U2NCgpIHtcbiAgICAgIFxuICAgIHZhciBzID0gdGhpcy5nZXREdW1wKCk7XG4gICAgICBcbiAgICAvLyBJZiB0aGUgY3VycmVudCBicm93c2VyIHN1cHBvcnRzIHRoZSBCYXNlNjQgZW5jb2RpbmdcbiAgICAvLyBmdW5jdGlvbiwgdGhlbiBvZmZsb2FkIHRoZSB0aGF0IHRvIHRoZSBicm93c2VyIGFzIGl0XG4gICAgLy8gd2lsbCBiZSBkb25lIGluIG5hdGl2ZSBjb2RlLlxuICAgIGlmICgodHlwZW9mIHdpbmRvdy5idG9hICE9PSAndW5kZWZpbmVkJykgJiYgKHdpbmRvdy5idG9hICE9PSBudWxsKSkge1xuICAgICAgcmV0dXJuIHdpbmRvdy5idG9hKHMpO1xuICAgIH1cbiAgICBcbiAgICB2YXIgY2ggPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky89XCI7XG4gICAgdmFyIGMxLCBjMiwgYzMsIGUxLCBlMiwgZTMsIGU0O1xuICAgIHZhciBsID0gcy5sZW5ndGg7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciByID0gXCJcIjtcbiAgICBcbiAgICBkbyB7XG4gICAgICBjMSA9IHMuY2hhckNvZGVBdChpKTtcbiAgICAgIGUxID0gYzEgPj4gMjtcbiAgICAgIGMyID0gcy5jaGFyQ29kZUF0KGkrMSk7XG4gICAgICBlMiA9ICgoYzEgJiAzKSA8PCA0KSB8IChjMiA+PiA0KTtcbiAgICAgIGMzID0gcy5jaGFyQ29kZUF0KGkrMik7XG4gICAgICBpZiAobCA8IGkrMikgeyBlMyA9IDY0OyB9IGVsc2UgeyBlMyA9ICgoYzIgJiAweGYpIDw8IDIpIHwgKGMzID4+IDYpOyB9XG4gICAgICBpZiAobCA8IGkrMykgeyBlNCA9IDY0OyB9IGVsc2UgeyBlNCA9IGMzICYgMHgzZjsgfVxuICAgICAgcis9IGNoLmNoYXJBdChlMSkgKyBjaC5jaGFyQXQoZTIpICsgY2guY2hhckF0KGUzKSArIGNoLmNoYXJBdChlNCk7XG4gICAgfSB3aGlsZSAoKGkrPSAzKSA8IGwpO1xuICAgIHJldHVybiByO1xuICB9XG5cbiAgLy8gb3V0cHV0IGEgUE5HIHN0cmluZ1xuICBnZXREdW1wKCkge1xuXG4gICAgLy8gY29tcHV0ZSBhZGxlcjMyIG9mIG91dHB1dCBwaXhlbHMgKyByb3cgZmlsdGVyIGJ5dGVzXG4gICAgdmFyIEJBU0UgPSA2NTUyMTsgLyogbGFyZ2VzdCBwcmltZSBzbWFsbGVyIHRoYW4gNjU1MzYgKi9cbiAgICB2YXIgTk1BWCA9IDU1NTI7ICAvKiBOTUFYIGlzIHRoZSBsYXJnZXN0IG4gc3VjaCB0aGF0IDI1NW4obisxKS8yICsgKG4rMSkoQkFTRS0xKSA8PSAyXjMyLTEgKi9cbiAgICB2YXIgczEgPSAxO1xuICAgIHZhciBzMiA9IDA7XG4gICAgdmFyIG4gPSBOTUFYO1xuXG4gICAgZm9yICh2YXIgeSA9IDA7IHkgPCB0aGlzLmhlaWdodDsgeSsrKSB7XG4gICAgICBmb3IgKHZhciB4ID0gLTE7IHggPCB0aGlzLndpZHRoOyB4KyspIHtcblx0czErPSB0aGlzLmJ1ZmZlclt0aGlzLmluZGV4KHgsIHkpXS5jaGFyQ29kZUF0KDApO1xuXHRzMis9IHMxO1xuXHRpZiAoKG4tPSAxKSA9PT0gMCkge1xuXHQgIHMxJT0gQkFTRTtcblx0ICBzMiU9IEJBU0U7XG5cdCAgbiA9IE5NQVg7XG5cdH1cbiAgICAgIH1cbiAgICB9XG4gICAgczElPSBCQVNFO1xuICAgIHMyJT0gQkFTRTtcbiAgICBQTkdFbmNvZGVyLl93cml0ZSh0aGlzLmJ1ZmZlciwgdGhpcy5pZGF0X29mZnMgKyB0aGlzLmlkYXRfc2l6ZSAtIDgsIFBOR0VuY29kZXIuX2J5dGU0KChzMiA8PCAxNikgfCBzMSkpO1xuICAgIFxuICAgIC8vIGNvbXB1dGUgY3JjMzIgb2YgdGhlIFBORyBjaHVua3NcbiAgICBmdW5jdGlvbiBjcmMzMihwbmcsIG9mZnMsIHNpemUsIGNyY3RhYmxlKSB7XG4gICAgICB2YXIgY3JjID0gLTE7XG4gICAgICBmb3IgKHZhciBpID0gNDsgaSA8IHNpemUtNDsgaSArPSAxKSB7XG5cdGNyYyA9IGNyY3RhYmxlWyhjcmMgXiBwbmdbb2ZmcytpXS5jaGFyQ29kZUF0KDApKSAmIDB4ZmZdIF4gKChjcmMgPj4gOCkgJiAweDAwZmZmZmZmKTtcbiAgICAgIH1cbiAgICAgIFBOR0VuY29kZXIuX3dyaXRlKHBuZywgb2ZmcytzaXplLTQsIFBOR0VuY29kZXIuX2J5dGU0KGNyYyBeIC0xKSk7XG4gICAgfVxuICAgIFxuICAgIGNyYzMyKHRoaXMuYnVmZmVyLCB0aGlzLmloZHJfb2ZmcywgdGhpcy5paGRyX3NpemUsIHRoaXMuX2NyYzMyKTtcbiAgICBjcmMzMih0aGlzLmJ1ZmZlciwgdGhpcy5wbHRlX29mZnMsIHRoaXMucGx0ZV9zaXplLCB0aGlzLl9jcmMzMik7XG4gICAgY3JjMzIodGhpcy5idWZmZXIsIHRoaXMudHJuc19vZmZzLCB0aGlzLnRybnNfc2l6ZSwgdGhpcy5fY3JjMzIpO1xuICAgIGNyYzMyKHRoaXMuYnVmZmVyLCB0aGlzLmlkYXRfb2ZmcywgdGhpcy5pZGF0X3NpemUsIHRoaXMuX2NyYzMyKTtcbiAgICBjcmMzMih0aGlzLmJ1ZmZlciwgdGhpcy5pZW5kX29mZnMsIHRoaXMuaWVuZF9zaXplLCB0aGlzLl9jcmMzMik7XG4gICAgXG4gICAgLy8gY29udmVydCBQTkcgdG8gc3RyaW5nXG4gICAgcmV0dXJuIFwiXFx4ODlQTkdcXHJcXG5cXHgxYVxcblwiK3RoaXMuYnVmZmVyLmpvaW4oJycpO1xuICB9XG4gIFxufVxuXG5cblxuIiwiaW1wb3J0IE1hdHJpeEVudGl0eSBmcm9tICcuL21hdHJpeC1lbnRpdHkuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcmVmaWxsZWRNYXRyaXhFbnRpdHkgZXh0ZW5kcyBNYXRyaXhFbnRpdHkge1xuXG4gIGNvbnN0cnVjdG9yKGRhdGEsIHN0YXJ0VGltZSwgc3RlcER1cmF0aW9uKSB7XG4gICAgc3VwZXIoKTtcbiAgICBcbiAgICAvLyBkYXRhIHNob3VsZCBiZSBGbG9hdDMyQXJyYXlbXSBvciBudW1iZXJbXVtdXG4gICAgdGhpcy5kYXRhID0gZGF0YTtcblxuICAgIHRoaXMuc3RlcER1cmF0aW9uID0gMDtcbiAgICB0aGlzLnN0YXJ0VGltZSA9IDA7XG5cbiAgICBpZiAodHlwZW9mKHN0YXJ0VGltZSkgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHRoaXMuc3RhcnRUaW1lID0gc3RhcnRUaW1lO1xuICAgIH1cbiAgICBpZiAodHlwZW9mKHN0ZXBEdXJhdGlvbikgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHRoaXMuc3RlcER1cmF0aW9uID0gc3RlcER1cmF0aW9uO1xuICAgIH1cbiAgfVxuICBcbiAgZ2V0Q29sdW1uQ291bnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YS5sZW5ndGg7XG4gIH1cblxuICBnZXRDb2x1bW5IZWlnaHQoKSB7XG4gICAgaWYgKHRoaXMuZGF0YS5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5kYXRhWzBdLmxlbmd0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICB9XG5cbiAgZ2V0Q29sdW1uKG4pIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhW25dO1xuICB9XG5cbiAgZ2V0U3RlcER1cmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnN0ZXBEdXJhdGlvbjtcbiAgfVxuXG4gIGdldFN0YXJ0VGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydFRpbWU7XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuZGF0YSA9IFtdO1xuICB9XG59XG5cbiIsIi8qKlxuICogTGlnaHR3ZWlnaHQgc2NhbGVzIG1pbWljaW5nIHRoZSBgZDMuanNgIGZ1bmN0aW9ubmFsIEFQSS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuICAvKipcbiAgICogQSBsaW5lYXIgc2NhbGUgaW50ZXJwb2xhdGluZyB2YWx1ZXMgYmV0d2VlbiBhIGBkb21haW5gIGFuZCBhIGByYW5nZWAuXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICAgKi9cbiAgbGluZWFyKCkge1xuICAgIGxldCBfZG9tYWluID0gWzAsIDFdO1xuICAgIGxldCBfcmFuZ2UgPSBbMCwgMV07XG5cbiAgICBsZXQgX3Nsb3BlID0gMTtcbiAgICBsZXQgX2ludGVyY2VwdCA9IDA7XG5cbiAgICBmdW5jdGlvbiBfdXBkYXRlQ29lZnMoKSB7XG4gICAgICBfc2xvcGUgPSAoX3JhbmdlWzFdIC0gX3JhbmdlWzBdKSAvIChfZG9tYWluWzFdIC0gX2RvbWFpblswXSk7XG4gICAgICBfaW50ZXJjZXB0ID0gX3JhbmdlWzBdIC0gKF9zbG9wZSAqIF9kb21haW5bMF0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNjYWxlICh2YWx1ZSkge1xuICAgICAgcmV0dXJuIChfc2xvcGUgKiB2YWx1ZSkgKyBfaW50ZXJjZXB0O1xuICAgIH1cblxuICAgIHNjYWxlLmludmVydCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gKHZhbHVlIC0gX2ludGVyY2VwdCkgLyBfc2xvcGU7XG4gICAgfTtcblxuICAgIHNjYWxlLmRvbWFpbiA9IGZ1bmN0aW9uKGFyciA9IG51bGwpIHtcbiAgICAgIGlmIChhcnIgPT09IG51bGwpIHsgcmV0dXJuIF9kb21haW47IH1cblxuICAgICAgX2RvbWFpbiA9IGFycjtcbiAgICAgIF91cGRhdGVDb2VmcygpO1xuXG4gICAgICByZXR1cm4gc2NhbGU7XG4gICAgfTtcblxuICAgIHNjYWxlLnJhbmdlID0gZnVuY3Rpb24oYXJyID0gbnVsbCkge1xuICAgICAgaWYgKGFyciA9PT0gbnVsbCkgeyByZXR1cm4gX3JhbmdlOyB9XG5cbiAgICAgIF9yYW5nZSA9IGFycjtcbiAgICAgIF91cGRhdGVDb2VmcygpO1xuXG4gICAgICByZXR1cm4gc2NhbGU7XG4gICAgfTtcblxuICAgIHJldHVybiBzY2FsZTtcbiAgfVxufTtcbiIsIi8vIGNvcmVcbmltcG9ydCBMYXllclRpbWVDb250ZXh0IGZyb20gJy4vY29yZS9sYXllci10aW1lLWNvbnRleHQnO1xuaW1wb3J0IExheWVyIGZyb20gJy4vY29yZS9sYXllcic7XG5pbXBvcnQgbmFtZXNwYWNlIGZyb20gJy4vY29yZS9uYW1lc3BhY2UnO1xuaW1wb3J0IFRpbWVsaW5lVGltZUNvbnRleHQgZnJvbSAnLi9jb3JlL3RpbWVsaW5lLXRpbWUtY29udGV4dCc7XG5pbXBvcnQgVGltZWxpbmUgZnJvbSAnLi9jb3JlL3RpbWVsaW5lJztcbmltcG9ydCBUcmFja0NvbGxlY3Rpb24gZnJvbSAnLi9jb3JlL3RyYWNrLWNvbGxlY3Rpb24nO1xuaW1wb3J0IFRyYWNrIGZyb20gJy4vY29yZS90cmFjayc7XG5cbi8vIHNoYXBlc1xuaW1wb3J0IEFubm90YXRlZE1hcmtlciBmcm9tICcuL3NoYXBlcy9hbm5vdGF0ZWQtbWFya2VyJztcbmltcG9ydCBBbm5vdGF0ZWRTZWdtZW50IGZyb20gJy4vc2hhcGVzL2Fubm90YXRlZC1zZWdtZW50JztcbmltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9zaGFwZXMvYmFzZS1zaGFwZSc7XG5pbXBvcnQgQ3Vyc29yIGZyb20gJy4vc2hhcGVzL2N1cnNvcic7XG5pbXBvcnQgRG90IGZyb20gJy4vc2hhcGVzL2RvdCc7XG5pbXBvcnQgTGluZSBmcm9tICcuL3NoYXBlcy9saW5lJztcbmltcG9ydCBNYXJrZXIgZnJvbSAnLi9zaGFwZXMvbWFya2VyJztcbmltcG9ydCBNYXRyaXggZnJvbSAnLi9zaGFwZXMvbWF0cml4JztcbmltcG9ydCBTZWdtZW50IGZyb20gJy4vc2hhcGVzL3NlZ21lbnQnO1xuaW1wb3J0IFRpY2tzIGZyb20gJy4vc2hhcGVzL3RpY2tzJztcbmltcG9ydCBUcmFjZVBhdGggZnJvbSAnLi9zaGFwZXMvdHJhY2UtcGF0aCc7XG5pbXBvcnQgVHJhY2VEb3RzIGZyb20gJy4vc2hhcGVzL3RyYWNlLWRvdHMnO1xuaW1wb3J0IFdhdmVmb3JtIGZyb20gJy4vc2hhcGVzL3dhdmVmb3JtJztcblxuLy8gYmVoYXZpb3JzXG5pbXBvcnQgQmFzZUJlaGF2aW9yIGZyb20gJy4vYmVoYXZpb3JzL2Jhc2UtYmVoYXZpb3InO1xuaW1wb3J0IEJyZWFrcG9pbnRCZWhhdmlvciBmcm9tICcuL2JlaGF2aW9ycy9icmVha3BvaW50LWJlaGF2aW9yJztcbmltcG9ydCBNYXJrZXJCZWhhdmlvciBmcm9tICcuL2JlaGF2aW9ycy9tYXJrZXItYmVoYXZpb3InO1xuaW1wb3J0IFNlZ21lbnRCZWhhdmlvciBmcm9tICcuL2JlaGF2aW9ycy9zZWdtZW50LWJlaGF2aW9yJztcbmltcG9ydCBUaW1lQ29udGV4dEJlaGF2aW9yIGZyb20gJy4vYmVoYXZpb3JzL3RpbWUtY29udGV4dC1iZWhhdmlvcic7XG5pbXBvcnQgVHJhY2VCZWhhdmlvciBmcm9tICcuL2JlaGF2aW9ycy90cmFjZS1iZWhhdmlvcic7XG5cbi8vIGludGVyYWN0aW9uc1xuaW1wb3J0IEV2ZW50U291cmNlIGZyb20gJy4vaW50ZXJhY3Rpb25zL2V2ZW50LXNvdXJjZSc7XG5pbXBvcnQgS2V5Ym9hcmQgZnJvbSAnLi9pbnRlcmFjdGlvbnMva2V5Ym9hcmQnO1xuaW1wb3J0IFN1cmZhY2UgZnJvbSAnLi9pbnRlcmFjdGlvbnMvc3VyZmFjZSc7XG5pbXBvcnQgV2F2ZUV2ZW50IGZyb20gJy4vaW50ZXJhY3Rpb25zL3dhdmUtZXZlbnQnO1xuXG4vLyBzdGF0ZXNcbmltcG9ydCBCYXNlU3RhdGUgZnJvbSAnLi9zdGF0ZXMvYmFzZS1zdGF0ZSc7XG5pbXBvcnQgQnJlYWtwb2ludFN0YXRlIGZyb20gJy4vc3RhdGVzL2JyZWFrcG9pbnQtc3RhdGUnO1xuaW1wb3J0IEJydXNoWm9vbVN0YXRlIGZyb20gJy4vc3RhdGVzL2JydXNoLXpvb20tc3RhdGUnO1xuaW1wb3J0IENlbnRlcmVkWm9vbVN0YXRlIGZyb20gJy4vc3RhdGVzL2NlbnRlcmVkLXpvb20tc3RhdGUnO1xuaW1wb3J0IENvbnRleHRFZGl0aW9uU3RhdGUgZnJvbSAnLi9zdGF0ZXMvY29udGV4dC1lZGl0aW9uLXN0YXRlJztcbmltcG9ydCBFZGl0aW9uU3RhdGUgZnJvbSAnLi9zdGF0ZXMvZWRpdGlvbi1zdGF0ZSc7XG5pbXBvcnQgU2VsZWN0aW9uU3RhdGUgZnJvbSAnLi9zdGF0ZXMvc2VsZWN0aW9uLXN0YXRlJztcbmltcG9ydCBTaW1wbGVFZGl0aW9uU3RhdGUgZnJvbSAnLi9zdGF0ZXMvc2ltcGxlLWVkaXRpb24tc3RhdGUnO1xuXG4vLyBoZWxwZXJzXG5pbXBvcnQgQW5ub3RhdGVkTWFya2VyTGF5ZXIgZnJvbSAnLi9oZWxwZXJzL2Fubm90YXRlZC1tYXJrZXItbGF5ZXInO1xuaW1wb3J0IEFubm90YXRlZFNlZ21lbnRMYXllciBmcm9tICcuL2hlbHBlcnMvYW5ub3RhdGVkLXNlZ21lbnQtbGF5ZXInO1xuaW1wb3J0IEJyZWFrcG9pbnRMYXllciBmcm9tICcuL2hlbHBlcnMvYnJlYWtwb2ludC1sYXllcic7XG5pbXBvcnQgQ3Vyc29yTGF5ZXIgZnJvbSAnLi9oZWxwZXJzL2N1cnNvci1sYXllcic7XG5pbXBvcnQgR3JpZEF4aXNMYXllciBmcm9tICcuL2hlbHBlcnMvZ3JpZC1heGlzLWxheWVyJztcbmltcG9ydCBMaW5lTGF5ZXIgZnJvbSAnLi9oZWxwZXJzL2xpbmUtbGF5ZXInO1xuaW1wb3J0IE1hcmtlckxheWVyIGZyb20gJy4vaGVscGVycy9tYXJrZXItbGF5ZXInO1xuaW1wb3J0IE1hdHJpeExheWVyIGZyb20gJy4vaGVscGVycy9tYXRyaXgtbGF5ZXInO1xuaW1wb3J0IFNlZ21lbnRMYXllciBmcm9tICcuL2hlbHBlcnMvc2VnbWVudC1sYXllcic7XG5pbXBvcnQgVGlja0xheWVyIGZyb20gJy4vaGVscGVycy90aWNrLWxheWVyJztcbmltcG9ydCBUaW1lQXhpc0xheWVyIGZyb20gJy4vaGVscGVycy90aW1lLWF4aXMtbGF5ZXInO1xuaW1wb3J0IFRyYWNlTGF5ZXIgZnJvbSAnLi9oZWxwZXJzL3RyYWNlLWxheWVyJztcbmltcG9ydCBXYXZlZm9ybUxheWVyIGZyb20gJy4vaGVscGVycy93YXZlZm9ybS1sYXllcic7XG5cbi8vIGF4aXNcbmltcG9ydCBBeGlzTGF5ZXIgZnJvbSAnLi9heGlzL2F4aXMtbGF5ZXInO1xuaW1wb3J0IHRpbWVBeGlzR2VuZXJhdG9yIGZyb20gJy4vYXhpcy90aW1lLWF4aXMtZ2VuZXJhdG9yJztcbmltcG9ydCBncmlkQXhpc0dlbmVyYXRvciBmcm9tICcuL2F4aXMvZ3JpZC1heGlzLWdlbmVyYXRvcic7XG5cbi8vIHV0aWxzXG5pbXBvcnQgZm9ybWF0IGZyb20gJy4vdXRpbHMvZm9ybWF0JztcbmltcG9ydCBNYXRyaXhFbnRpdHkgZnJvbSAnLi91dGlscy9tYXRyaXgtZW50aXR5JztcbmltcG9ydCBPcnRob2dvbmFsRGF0YSBmcm9tICcuL3V0aWxzL29ydGhvZ29uYWwtZGF0YSc7XG5pbXBvcnQgUHJlZmlsbGVkTWF0cml4RW50aXR5IGZyb20gJy4vdXRpbHMvcHJlZmlsbGVkLW1hdHJpeC1lbnRpdHknO1xuaW1wb3J0IHNjYWxlcyBmcm9tICcuL3V0aWxzL3NjYWxlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgY29yZToge1xuICAgIExheWVyVGltZUNvbnRleHQsIExheWVyLCBuYW1lc3BhY2UsXG4gICAgVGltZWxpbmVUaW1lQ29udGV4dCwgVGltZWxpbmUsIFRyYWNrQ29sbGVjdGlvbiwgVHJhY2tcbiAgfSxcbiAgc2hhcGVzOiB7XG4gICAgQW5ub3RhdGVkTWFya2VyLCBBbm5vdGF0ZWRTZWdtZW50LCBCYXNlU2hhcGUsIEN1cnNvcixcbiAgICBEb3QsIExpbmUsIE1hcmtlciwgTWF0cml4LCBTZWdtZW50LCBUaWNrcywgVHJhY2VQYXRoLCBUcmFjZURvdHMsIFdhdmVmb3JtXG4gIH0sXG4gIGJlaGF2aW9yczoge1xuICAgIEJhc2VCZWhhdmlvciwgQnJlYWtwb2ludEJlaGF2aW9yLCBNYXJrZXJCZWhhdmlvciwgU2VnbWVudEJlaGF2aW9yLFxuICAgIFRpbWVDb250ZXh0QmVoYXZpb3IsIFRyYWNlQmVoYXZpb3JcbiAgfSxcbiAgaW50ZXJhY3Rpb25zOiB7IEV2ZW50U291cmNlLCBLZXlib2FyZCwgU3VyZmFjZSwgV2F2ZUV2ZW50IH0sXG4gIHN0YXRlczoge1xuICAgIEJhc2VTdGF0ZSwgQnJlYWtwb2ludFN0YXRlLCBCcnVzaFpvb21TdGF0ZSwgQ2VudGVyZWRab29tU3RhdGUsXG4gICAgQ29udGV4dEVkaXRpb25TdGF0ZSwgRWRpdGlvblN0YXRlLCBTZWxlY3Rpb25TdGF0ZSwgU2ltcGxlRWRpdGlvblN0YXRlXG4gIH0sXG4gIGhlbHBlcnM6IHtcbiAgICBBbm5vdGF0ZWRNYXJrZXJMYXllciwgQW5ub3RhdGVkU2VnbWVudExheWVyLCBCcmVha3BvaW50TGF5ZXIsXG4gICAgQ3Vyc29yTGF5ZXIsIEdyaWRBeGlzTGF5ZXIsIExpbmVMYXllciwgTWFya2VyTGF5ZXIsIE1hdHJpeExheWVyLCBTZWdtZW50TGF5ZXIsXG4gICAgVGlja0xheWVyLCBUaW1lQXhpc0xheWVyLCBUcmFjZUxheWVyLCBXYXZlZm9ybUxheWVyXG4gIH0sXG4gIGF4aXM6IHtcbiAgICBBeGlzTGF5ZXIsIHRpbWVBeGlzR2VuZXJhdG9yLCBncmlkQXhpc0dlbmVyYXRvclxuICB9LFxuICB1dGlsczoge1xuICAgIGZvcm1hdCwgTWF0cml4RW50aXR5LCBPcnRob2dvbmFsRGF0YSwgUHJlZmlsbGVkTWF0cml4RW50aXR5LCBzY2FsZXNcbiAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9hcnJheS9mcm9tXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL2dldC1pdGVyYXRvclwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9pcy1pdGVyYWJsZVwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9tYXBcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vbWF0aC9sb2cxMFwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvYXNzaWduXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9jcmVhdGVcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2RlZmluZS1wcm9wZXJ0eVwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9rZXlzXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9zZXQtcHJvdG90eXBlLW9mXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL3Byb21pc2VcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vc2V0XCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL3N5bWJvbFwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9zeW1ib2wvaXRlcmF0b3JcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufTtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9PYmplY3QkZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9kZWZpbmUtcHJvcGVydHlcIilbXCJkZWZhdWx0XCJdO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IChmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuXG4gICAgICBfT2JqZWN0JGRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gICAgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgICBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gIH07XG59KSgpO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgX09iamVjdCRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3JcIilbXCJkZWZhdWx0XCJdO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IGZ1bmN0aW9uIGdldChfeCwgX3gyLCBfeDMpIHtcbiAgdmFyIF9hZ2FpbiA9IHRydWU7XG5cbiAgX2Z1bmN0aW9uOiB3aGlsZSAoX2FnYWluKSB7XG4gICAgdmFyIG9iamVjdCA9IF94LFxuICAgICAgICBwcm9wZXJ0eSA9IF94MixcbiAgICAgICAgcmVjZWl2ZXIgPSBfeDM7XG4gICAgX2FnYWluID0gZmFsc2U7XG4gICAgaWYgKG9iamVjdCA9PT0gbnVsbCkgb2JqZWN0ID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXG4gICAgdmFyIGRlc2MgPSBfT2JqZWN0JGdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHByb3BlcnR5KTtcblxuICAgIGlmIChkZXNjID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciBwYXJlbnQgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTtcblxuICAgICAgaWYgKHBhcmVudCA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX3ggPSBwYXJlbnQ7XG4gICAgICAgIF94MiA9IHByb3BlcnR5O1xuICAgICAgICBfeDMgPSByZWNlaXZlcjtcbiAgICAgICAgX2FnYWluID0gdHJ1ZTtcbiAgICAgICAgZGVzYyA9IHBhcmVudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgY29udGludWUgX2Z1bmN0aW9uO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXCJ2YWx1ZVwiIGluIGRlc2MpIHtcbiAgICAgIHJldHVybiBkZXNjLnZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgZ2V0dGVyID0gZGVzYy5nZXQ7XG5cbiAgICAgIGlmIChnZXR0ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZ2V0dGVyLmNhbGwocmVjZWl2ZXIpO1xuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9PYmplY3QkY3JlYXRlID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvY3JlYXRlXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIF9PYmplY3Qkc2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9zZXQtcHJvdG90eXBlLW9mXCIpW1wiZGVmYXVsdFwiXTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBmdW5jdGlvbiAoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHtcbiAgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpO1xuICB9XG5cbiAgc3ViQ2xhc3MucHJvdG90eXBlID0gX09iamVjdCRjcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwge1xuICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICB2YWx1ZTogc3ViQ2xhc3MsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfVxuICB9KTtcbiAgaWYgKHN1cGVyQ2xhc3MpIF9PYmplY3Qkc2V0UHJvdG90eXBlT2YgPyBfT2JqZWN0JHNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7XG59O1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlOyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHtcbiAgICBcImRlZmF1bHRcIjogb2JqXG4gIH07XG59O1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgX2dldEl0ZXJhdG9yID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvY29yZS1qcy9nZXQtaXRlcmF0b3JcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX2lzSXRlcmFibGUgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL2lzLWl0ZXJhYmxlXCIpW1wiZGVmYXVsdFwiXTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSAoZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBzbGljZUl0ZXJhdG9yKGFyciwgaSkge1xuICAgIHZhciBfYXJyID0gW107XG4gICAgdmFyIF9uID0gdHJ1ZTtcbiAgICB2YXIgX2QgPSBmYWxzZTtcbiAgICB2YXIgX2UgPSB1bmRlZmluZWQ7XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX2kgPSBfZ2V0SXRlcmF0b3IoYXJyKSwgX3M7ICEoX24gPSAoX3MgPSBfaS5uZXh0KCkpLmRvbmUpOyBfbiA9IHRydWUpIHtcbiAgICAgICAgX2Fyci5wdXNoKF9zLnZhbHVlKTtcblxuICAgICAgICBpZiAoaSAmJiBfYXJyLmxlbmd0aCA9PT0gaSkgYnJlYWs7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBfZCA9IHRydWU7XG4gICAgICBfZSA9IGVycjtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKCFfbiAmJiBfaVtcInJldHVyblwiXSkgX2lbXCJyZXR1cm5cIl0oKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChfZCkgdGhyb3cgX2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIF9hcnI7XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKGFyciwgaSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICAgIHJldHVybiBhcnI7XG4gICAgfSBlbHNlIGlmIChfaXNJdGVyYWJsZShPYmplY3QoYXJyKSkpIHtcbiAgICAgIHJldHVybiBzbGljZUl0ZXJhdG9yKGFyciwgaSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlXCIpO1xuICAgIH1cbiAgfTtcbn0pKCk7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfQXJyYXkkZnJvbSA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2NvcmUtanMvYXJyYXkvZnJvbVwiKVtcImRlZmF1bHRcIl07XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gZnVuY3Rpb24gKGFycikge1xuICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgYXJyMltpXSA9IGFycltpXTtcblxuICAgIHJldHVybiBhcnIyO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBfQXJyYXkkZnJvbShhcnIpO1xuICB9XG59O1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlOyIsIi8vIFRoaXMgbWV0aG9kIG9mIG9idGFpbmluZyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdCBuZWVkcyB0byBiZVxuLy8ga2VwdCBpZGVudGljYWwgdG8gdGhlIHdheSBpdCBpcyBvYnRhaW5lZCBpbiBydW50aW1lLmpzXG52YXIgZyA9XG4gIHR5cGVvZiBnbG9iYWwgPT09IFwib2JqZWN0XCIgPyBnbG9iYWwgOlxuICB0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiID8gd2luZG93IDpcbiAgdHlwZW9mIHNlbGYgPT09IFwib2JqZWN0XCIgPyBzZWxmIDogdGhpcztcblxuLy8gVXNlIGBnZXRPd25Qcm9wZXJ0eU5hbWVzYCBiZWNhdXNlIG5vdCBhbGwgYnJvd3NlcnMgc3VwcG9ydCBjYWxsaW5nXG4vLyBgaGFzT3duUHJvcGVydHlgIG9uIHRoZSBnbG9iYWwgYHNlbGZgIG9iamVjdCBpbiBhIHdvcmtlci4gU2VlICMxODMuXG52YXIgaGFkUnVudGltZSA9IGcucmVnZW5lcmF0b3JSdW50aW1lICYmXG4gIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGcpLmluZGV4T2YoXCJyZWdlbmVyYXRvclJ1bnRpbWVcIikgPj0gMDtcblxuLy8gU2F2ZSB0aGUgb2xkIHJlZ2VuZXJhdG9yUnVudGltZSBpbiBjYXNlIGl0IG5lZWRzIHRvIGJlIHJlc3RvcmVkIGxhdGVyLlxudmFyIG9sZFJ1bnRpbWUgPSBoYWRSdW50aW1lICYmIGcucmVnZW5lcmF0b3JSdW50aW1lO1xuXG4vLyBGb3JjZSByZWV2YWx1dGF0aW9uIG9mIHJ1bnRpbWUuanMuXG5nLnJlZ2VuZXJhdG9yUnVudGltZSA9IHVuZGVmaW5lZDtcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi9ydW50aW1lXCIpO1xuXG5pZiAoaGFkUnVudGltZSkge1xuICAvLyBSZXN0b3JlIHRoZSBvcmlnaW5hbCBydW50aW1lLlxuICBnLnJlZ2VuZXJhdG9yUnVudGltZSA9IG9sZFJ1bnRpbWU7XG59IGVsc2Uge1xuICAvLyBSZW1vdmUgdGhlIGdsb2JhbCBwcm9wZXJ0eSBhZGRlZCBieSBydW50aW1lLmpzLlxuICB0cnkge1xuICAgIGRlbGV0ZSBnLnJlZ2VuZXJhdG9yUnVudGltZTtcbiAgfSBjYXRjaChlKSB7XG4gICAgZy5yZWdlbmVyYXRvclJ1bnRpbWUgPSB1bmRlZmluZWQ7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiBtb2R1bGUuZXhwb3J0cywgX19lc01vZHVsZTogdHJ1ZSB9O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogaHR0cHM6Ly9yYXcuZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9tYXN0ZXIvTElDRU5TRSBmaWxlLiBBblxuICogYWRkaXRpb25hbCBncmFudCBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluXG4gKiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfU3ltYm9sID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvY29yZS1qcy9zeW1ib2xcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX09iamVjdCRjcmVhdGUgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9jcmVhdGVcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX09iamVjdCRzZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L3NldC1wcm90b3R5cGUtb2ZcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX1Byb21pc2UgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL3Byb21pc2VcIilbXCJkZWZhdWx0XCJdO1xuXG4hKGZ1bmN0aW9uIChnbG9iYWwpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgdmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG4gIHZhciB1bmRlZmluZWQ7IC8vIE1vcmUgY29tcHJlc3NpYmxlIHRoYW4gdm9pZCAwLlxuICB2YXIgJFN5bWJvbCA9IHR5cGVvZiBfU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBfU3ltYm9sIDoge307XG4gIHZhciBpdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuaXRlcmF0b3IgfHwgXCJAQGl0ZXJhdG9yXCI7XG4gIHZhciB0b1N0cmluZ1RhZ1N5bWJvbCA9ICRTeW1ib2wudG9TdHJpbmdUYWcgfHwgXCJAQHRvU3RyaW5nVGFnXCI7XG5cbiAgdmFyIGluTW9kdWxlID0gdHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIjtcbiAgdmFyIHJ1bnRpbWUgPSBnbG9iYWwucmVnZW5lcmF0b3JSdW50aW1lO1xuICBpZiAocnVudGltZSkge1xuICAgIGlmIChpbk1vZHVsZSkge1xuICAgICAgLy8gSWYgcmVnZW5lcmF0b3JSdW50aW1lIGlzIGRlZmluZWQgZ2xvYmFsbHkgYW5kIHdlJ3JlIGluIGEgbW9kdWxlLFxuICAgICAgLy8gbWFrZSB0aGUgZXhwb3J0cyBvYmplY3QgaWRlbnRpY2FsIHRvIHJlZ2VuZXJhdG9yUnVudGltZS5cbiAgICAgIG1vZHVsZS5leHBvcnRzID0gcnVudGltZTtcbiAgICB9XG4gICAgLy8gRG9uJ3QgYm90aGVyIGV2YWx1YXRpbmcgdGhlIHJlc3Qgb2YgdGhpcyBmaWxlIGlmIHRoZSBydW50aW1lIHdhc1xuICAgIC8vIGFscmVhZHkgZGVmaW5lZCBnbG9iYWxseS5cbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBEZWZpbmUgdGhlIHJ1bnRpbWUgZ2xvYmFsbHkgKGFzIGV4cGVjdGVkIGJ5IGdlbmVyYXRlZCBjb2RlKSBhcyBlaXRoZXJcbiAgLy8gbW9kdWxlLmV4cG9ydHMgKGlmIHdlJ3JlIGluIGEgbW9kdWxlKSBvciBhIG5ldywgZW1wdHkgb2JqZWN0LlxuICBydW50aW1lID0gZ2xvYmFsLnJlZ2VuZXJhdG9yUnVudGltZSA9IGluTW9kdWxlID8gbW9kdWxlLmV4cG9ydHMgOiB7fTtcblxuICBmdW5jdGlvbiB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gSWYgb3V0ZXJGbiBwcm92aWRlZCwgdGhlbiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvci5cbiAgICB2YXIgZ2VuZXJhdG9yID0gX09iamVjdCRjcmVhdGUoKG91dGVyRm4gfHwgR2VuZXJhdG9yKS5wcm90b3R5cGUpO1xuICAgIHZhciBjb250ZXh0ID0gbmV3IENvbnRleHQodHJ5TG9jc0xpc3QgfHwgW10pO1xuXG4gICAgLy8gVGhlIC5faW52b2tlIG1ldGhvZCB1bmlmaWVzIHRoZSBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlIC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcy5cbiAgICBnZW5lcmF0b3IuX2ludm9rZSA9IG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG5cbiAgICByZXR1cm4gZ2VuZXJhdG9yO1xuICB9XG4gIHJ1bnRpbWUud3JhcCA9IHdyYXA7XG5cbiAgLy8gVHJ5L2NhdGNoIGhlbHBlciB0byBtaW5pbWl6ZSBkZW9wdGltaXphdGlvbnMuIFJldHVybnMgYSBjb21wbGV0aW9uXG4gIC8vIHJlY29yZCBsaWtlIGNvbnRleHQudHJ5RW50cmllc1tpXS5jb21wbGV0aW9uLiBUaGlzIGludGVyZmFjZSBjb3VsZFxuICAvLyBoYXZlIGJlZW4gKGFuZCB3YXMgcHJldmlvdXNseSkgZGVzaWduZWQgdG8gdGFrZSBhIGNsb3N1cmUgdG8gYmVcbiAgLy8gaW52b2tlZCB3aXRob3V0IGFyZ3VtZW50cywgYnV0IGluIGFsbCB0aGUgY2FzZXMgd2UgY2FyZSBhYm91dCB3ZVxuICAvLyBhbHJlYWR5IGhhdmUgYW4gZXhpc3RpbmcgbWV0aG9kIHdlIHdhbnQgdG8gY2FsbCwgc28gdGhlcmUncyBubyBuZWVkXG4gIC8vIHRvIGNyZWF0ZSBhIG5ldyBmdW5jdGlvbiBvYmplY3QuIFdlIGNhbiBldmVuIGdldCBhd2F5IHdpdGggYXNzdW1pbmdcbiAgLy8gdGhlIG1ldGhvZCB0YWtlcyBleGFjdGx5IG9uZSBhcmd1bWVudCwgc2luY2UgdGhhdCBoYXBwZW5zIHRvIGJlIHRydWVcbiAgLy8gaW4gZXZlcnkgY2FzZSwgc28gd2UgZG9uJ3QgaGF2ZSB0byB0b3VjaCB0aGUgYXJndW1lbnRzIG9iamVjdC4gVGhlXG4gIC8vIG9ubHkgYWRkaXRpb25hbCBhbGxvY2F0aW9uIHJlcXVpcmVkIGlzIHRoZSBjb21wbGV0aW9uIHJlY29yZCwgd2hpY2hcbiAgLy8gaGFzIGEgc3RhYmxlIHNoYXBlIGFuZCBzbyBob3BlZnVsbHkgc2hvdWxkIGJlIGNoZWFwIHRvIGFsbG9jYXRlLlxuICBmdW5jdGlvbiB0cnlDYXRjaChmbiwgb2JqLCBhcmcpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJub3JtYWxcIiwgYXJnOiBmbi5jYWxsKG9iaiwgYXJnKSB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJ0aHJvd1wiLCBhcmc6IGVyciB9O1xuICAgIH1cbiAgfVxuXG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0ID0gXCJzdXNwZW5kZWRTdGFydFwiO1xuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCA9IFwic3VzcGVuZGVkWWllbGRcIjtcbiAgdmFyIEdlblN0YXRlRXhlY3V0aW5nID0gXCJleGVjdXRpbmdcIjtcbiAgdmFyIEdlblN0YXRlQ29tcGxldGVkID0gXCJjb21wbGV0ZWRcIjtcblxuICAvLyBSZXR1cm5pbmcgdGhpcyBvYmplY3QgZnJvbSB0aGUgaW5uZXJGbiBoYXMgdGhlIHNhbWUgZWZmZWN0IGFzXG4gIC8vIGJyZWFraW5nIG91dCBvZiB0aGUgZGlzcGF0Y2ggc3dpdGNoIHN0YXRlbWVudC5cbiAgdmFyIENvbnRpbnVlU2VudGluZWwgPSB7fTtcblxuICAvLyBEdW1teSBjb25zdHJ1Y3RvciBmdW5jdGlvbnMgdGhhdCB3ZSB1c2UgYXMgdGhlIC5jb25zdHJ1Y3RvciBhbmRcbiAgLy8gLmNvbnN0cnVjdG9yLnByb3RvdHlwZSBwcm9wZXJ0aWVzIGZvciBmdW5jdGlvbnMgdGhhdCByZXR1cm4gR2VuZXJhdG9yXG4gIC8vIG9iamVjdHMuIEZvciBmdWxsIHNwZWMgY29tcGxpYW5jZSwgeW91IG1heSB3aXNoIHRvIGNvbmZpZ3VyZSB5b3VyXG4gIC8vIG1pbmlmaWVyIG5vdCB0byBtYW5nbGUgdGhlIG5hbWVzIG9mIHRoZXNlIHR3byBmdW5jdGlvbnMuXG4gIGZ1bmN0aW9uIEdlbmVyYXRvcigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUoKSB7fVxuXG4gIHZhciBHcCA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLnByb3RvdHlwZSA9IEdlbmVyYXRvci5wcm90b3R5cGU7XG4gIEdlbmVyYXRvckZ1bmN0aW9uLnByb3RvdHlwZSA9IEdwLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb247XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlW3RvU3RyaW5nVGFnU3ltYm9sXSA9IEdlbmVyYXRvckZ1bmN0aW9uLmRpc3BsYXlOYW1lID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuXG4gIC8vIEhlbHBlciBmb3IgZGVmaW5pbmcgdGhlIC5uZXh0LCAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMgb2YgdGhlXG4gIC8vIEl0ZXJhdG9yIGludGVyZmFjZSBpbiB0ZXJtcyBvZiBhIHNpbmdsZSAuX2ludm9rZSBtZXRob2QuXG4gIGZ1bmN0aW9uIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhwcm90b3R5cGUpIHtcbiAgICBbXCJuZXh0XCIsIFwidGhyb3dcIiwgXCJyZXR1cm5cIl0uZm9yRWFjaChmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgICBwcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uIChhcmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludm9rZShtZXRob2QsIGFyZyk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgcnVudGltZS5pc0dlbmVyYXRvckZ1bmN0aW9uID0gZnVuY3Rpb24gKGdlbkZ1bikge1xuICAgIHZhciBjdG9yID0gdHlwZW9mIGdlbkZ1biA9PT0gXCJmdW5jdGlvblwiICYmIGdlbkZ1bi5jb25zdHJ1Y3RvcjtcbiAgICByZXR1cm4gY3RvciA/IGN0b3IgPT09IEdlbmVyYXRvckZ1bmN0aW9uIHx8XG4gICAgLy8gRm9yIHRoZSBuYXRpdmUgR2VuZXJhdG9yRnVuY3Rpb24gY29uc3RydWN0b3IsIHRoZSBiZXN0IHdlIGNhblxuICAgIC8vIGRvIGlzIHRvIGNoZWNrIGl0cyAubmFtZSBwcm9wZXJ0eS5cbiAgICAoY3Rvci5kaXNwbGF5TmFtZSB8fCBjdG9yLm5hbWUpID09PSBcIkdlbmVyYXRvckZ1bmN0aW9uXCIgOiBmYWxzZTtcbiAgfTtcblxuICBydW50aW1lLm1hcmsgPSBmdW5jdGlvbiAoZ2VuRnVuKSB7XG4gICAgaWYgKF9PYmplY3Qkc2V0UHJvdG90eXBlT2YpIHtcbiAgICAgIF9PYmplY3Qkc2V0UHJvdG90eXBlT2YoZ2VuRnVuLCBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdlbkZ1bi5fX3Byb3RvX18gPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgICAgIGlmICghKHRvU3RyaW5nVGFnU3ltYm9sIGluIGdlbkZ1bikpIHtcbiAgICAgICAgZ2VuRnVuW3RvU3RyaW5nVGFnU3ltYm9sXSA9IFwiR2VuZXJhdG9yRnVuY3Rpb25cIjtcbiAgICAgIH1cbiAgICB9XG4gICAgZ2VuRnVuLnByb3RvdHlwZSA9IF9PYmplY3QkY3JlYXRlKEdwKTtcbiAgICByZXR1cm4gZ2VuRnVuO1xuICB9O1xuXG4gIC8vIFdpdGhpbiB0aGUgYm9keSBvZiBhbnkgYXN5bmMgZnVuY3Rpb24sIGBhd2FpdCB4YCBpcyB0cmFuc2Zvcm1lZCB0b1xuICAvLyBgeWllbGQgcmVnZW5lcmF0b3JSdW50aW1lLmF3cmFwKHgpYCwgc28gdGhhdCB0aGUgcnVudGltZSBjYW4gdGVzdFxuICAvLyBgdmFsdWUgaW5zdGFuY2VvZiBBd2FpdEFyZ3VtZW50YCB0byBkZXRlcm1pbmUgaWYgdGhlIHlpZWxkZWQgdmFsdWUgaXNcbiAgLy8gbWVhbnQgdG8gYmUgYXdhaXRlZC4gU29tZSBtYXkgY29uc2lkZXIgdGhlIG5hbWUgb2YgdGhpcyBtZXRob2QgdG9vXG4gIC8vIGN1dGVzeSwgYnV0IHRoZXkgYXJlIGN1cm11ZGdlb25zLlxuICBydW50aW1lLmF3cmFwID0gZnVuY3Rpb24gKGFyZykge1xuICAgIHJldHVybiBuZXcgQXdhaXRBcmd1bWVudChhcmcpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIEF3YWl0QXJndW1lbnQoYXJnKSB7XG4gICAgdGhpcy5hcmcgPSBhcmc7XG4gIH1cblxuICBmdW5jdGlvbiBBc3luY0l0ZXJhdG9yKGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goZ2VuZXJhdG9yW21ldGhvZF0sIGdlbmVyYXRvciwgYXJnKTtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHJlamVjdChyZWNvcmQuYXJnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciByZXN1bHQgPSByZWNvcmQuYXJnO1xuICAgICAgICB2YXIgdmFsdWUgPSByZXN1bHQudmFsdWU7XG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEF3YWl0QXJndW1lbnQpIHtcbiAgICAgICAgICByZXR1cm4gX1Byb21pc2UucmVzb2x2ZSh2YWx1ZS5hcmcpLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJuZXh0XCIsIHZhbHVlLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIGludm9rZShcInRocm93XCIsIGVyciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBfUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKGZ1bmN0aW9uICh1bndyYXBwZWQpIHtcbiAgICAgICAgICAvLyBXaGVuIGEgeWllbGRlZCBQcm9taXNlIGlzIHJlc29sdmVkLCBpdHMgZmluYWwgdmFsdWUgYmVjb21lc1xuICAgICAgICAgIC8vIHRoZSAudmFsdWUgb2YgdGhlIFByb21pc2U8e3ZhbHVlLGRvbmV9PiByZXN1bHQgZm9yIHRoZVxuICAgICAgICAgIC8vIGN1cnJlbnQgaXRlcmF0aW9uLiBJZiB0aGUgUHJvbWlzZSBpcyByZWplY3RlZCwgaG93ZXZlciwgdGhlXG4gICAgICAgICAgLy8gcmVzdWx0IGZvciB0aGlzIGl0ZXJhdGlvbiB3aWxsIGJlIHJlamVjdGVkIHdpdGggdGhlIHNhbWVcbiAgICAgICAgICAvLyByZWFzb24uIE5vdGUgdGhhdCByZWplY3Rpb25zIG9mIHlpZWxkZWQgUHJvbWlzZXMgYXJlIG5vdFxuICAgICAgICAgIC8vIHRocm93biBiYWNrIGludG8gdGhlIGdlbmVyYXRvciBmdW5jdGlvbiwgYXMgaXMgdGhlIGNhc2VcbiAgICAgICAgICAvLyB3aGVuIGFuIGF3YWl0ZWQgUHJvbWlzZSBpcyByZWplY3RlZC4gVGhpcyBkaWZmZXJlbmNlIGluXG4gICAgICAgICAgLy8gYmVoYXZpb3IgYmV0d2VlbiB5aWVsZCBhbmQgYXdhaXQgaXMgaW1wb3J0YW50LCBiZWNhdXNlIGl0XG4gICAgICAgICAgLy8gYWxsb3dzIHRoZSBjb25zdW1lciB0byBkZWNpZGUgd2hhdCB0byBkbyB3aXRoIHRoZSB5aWVsZGVkXG4gICAgICAgICAgLy8gcmVqZWN0aW9uIChzd2FsbG93IGl0IGFuZCBjb250aW51ZSwgbWFudWFsbHkgLnRocm93IGl0IGJhY2tcbiAgICAgICAgICAvLyBpbnRvIHRoZSBnZW5lcmF0b3IsIGFiYW5kb24gaXRlcmF0aW9uLCB3aGF0ZXZlcikuIFdpdGhcbiAgICAgICAgICAvLyBhd2FpdCwgYnkgY29udHJhc3QsIHRoZXJlIGlzIG5vIG9wcG9ydHVuaXR5IHRvIGV4YW1pbmUgdGhlXG4gICAgICAgICAgLy8gcmVqZWN0aW9uIHJlYXNvbiBvdXRzaWRlIHRoZSBnZW5lcmF0b3IgZnVuY3Rpb24sIHNvIHRoZVxuICAgICAgICAgIC8vIG9ubHkgb3B0aW9uIGlzIHRvIHRocm93IGl0IGZyb20gdGhlIGF3YWl0IGV4cHJlc3Npb24sIGFuZFxuICAgICAgICAgIC8vIGxldCB0aGUgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhbmRsZSB0aGUgZXhjZXB0aW9uLlxuICAgICAgICAgIHJlc3VsdC52YWx1ZSA9IHVud3JhcHBlZDtcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0sIHJlamVjdCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBwcm9jZXNzID09PSBcIm9iamVjdFwiICYmIHByb2Nlc3MuZG9tYWluKSB7XG4gICAgICBpbnZva2UgPSBwcm9jZXNzLmRvbWFpbi5iaW5kKGludm9rZSk7XG4gICAgfVxuXG4gICAgdmFyIHByZXZpb3VzUHJvbWlzZTtcblxuICAgIGZ1bmN0aW9uIGVucXVldWUobWV0aG9kLCBhcmcpIHtcbiAgICAgIGZ1bmN0aW9uIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCkge1xuICAgICAgICByZXR1cm4gbmV3IF9Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJldmlvdXNQcm9taXNlID1cbiAgICAgIC8vIElmIGVucXVldWUgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiB3ZSB3YW50IHRvIHdhaXQgdW50aWxcbiAgICAgIC8vIGFsbCBwcmV2aW91cyBQcm9taXNlcyBoYXZlIGJlZW4gcmVzb2x2ZWQgYmVmb3JlIGNhbGxpbmcgaW52b2tlLFxuICAgICAgLy8gc28gdGhhdCByZXN1bHRzIGFyZSBhbHdheXMgZGVsaXZlcmVkIGluIHRoZSBjb3JyZWN0IG9yZGVyLiBJZlxuICAgICAgLy8gZW5xdWV1ZSBoYXMgbm90IGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiBpdCBpcyBpbXBvcnRhbnQgdG9cbiAgICAgIC8vIGNhbGwgaW52b2tlIGltbWVkaWF0ZWx5LCB3aXRob3V0IHdhaXRpbmcgb24gYSBjYWxsYmFjayB0byBmaXJlLFxuICAgICAgLy8gc28gdGhhdCB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhcyB0aGUgb3Bwb3J0dW5pdHkgdG8gZG9cbiAgICAgIC8vIGFueSBuZWNlc3Nhcnkgc2V0dXAgaW4gYSBwcmVkaWN0YWJsZSB3YXkuIFRoaXMgcHJlZGljdGFiaWxpdHlcbiAgICAgIC8vIGlzIHdoeSB0aGUgUHJvbWlzZSBjb25zdHJ1Y3RvciBzeW5jaHJvbm91c2x5IGludm9rZXMgaXRzXG4gICAgICAvLyBleGVjdXRvciBjYWxsYmFjaywgYW5kIHdoeSBhc3luYyBmdW5jdGlvbnMgc3luY2hyb25vdXNseVxuICAgICAgLy8gZXhlY3V0ZSBjb2RlIGJlZm9yZSB0aGUgZmlyc3QgYXdhaXQuIFNpbmNlIHdlIGltcGxlbWVudCBzaW1wbGVcbiAgICAgIC8vIGFzeW5jIGZ1bmN0aW9ucyBpbiB0ZXJtcyBvZiBhc3luYyBnZW5lcmF0b3JzLCBpdCBpcyBlc3BlY2lhbGx5XG4gICAgICAvLyBpbXBvcnRhbnQgdG8gZ2V0IHRoaXMgcmlnaHQsIGV2ZW4gdGhvdWdoIGl0IHJlcXVpcmVzIGNhcmUuXG4gICAgICBwcmV2aW91c1Byb21pc2UgPyBwcmV2aW91c1Byb21pc2UudGhlbihjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyxcbiAgICAgIC8vIEF2b2lkIHByb3BhZ2F0aW5nIGZhaWx1cmVzIHRvIFByb21pc2VzIHJldHVybmVkIGJ5IGxhdGVyXG4gICAgICAvLyBpbnZvY2F0aW9ucyBvZiB0aGUgaXRlcmF0b3IuXG4gICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZykgOiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpO1xuICAgIH1cblxuICAgIC8vIERlZmluZSB0aGUgdW5pZmllZCBoZWxwZXIgbWV0aG9kIHRoYXQgaXMgdXNlZCB0byBpbXBsZW1lbnQgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiAoc2VlIGRlZmluZUl0ZXJhdG9yTWV0aG9kcykuXG4gICAgdGhpcy5faW52b2tlID0gZW5xdWV1ZTtcbiAgfVxuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhBc3luY0l0ZXJhdG9yLnByb3RvdHlwZSk7XG5cbiAgLy8gTm90ZSB0aGF0IHNpbXBsZSBhc3luYyBmdW5jdGlvbnMgYXJlIGltcGxlbWVudGVkIG9uIHRvcCBvZlxuICAvLyBBc3luY0l0ZXJhdG9yIG9iamVjdHM7IHRoZXkganVzdCByZXR1cm4gYSBQcm9taXNlIGZvciB0aGUgdmFsdWUgb2ZcbiAgLy8gdGhlIGZpbmFsIHJlc3VsdCBwcm9kdWNlZCBieSB0aGUgaXRlcmF0b3IuXG4gIHJ1bnRpbWUuYXN5bmMgPSBmdW5jdGlvbiAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICB2YXIgaXRlciA9IG5ldyBBc3luY0l0ZXJhdG9yKHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpKTtcblxuICAgIHJldHVybiBydW50aW1lLmlzR2VuZXJhdG9yRnVuY3Rpb24ob3V0ZXJGbikgPyBpdGVyIC8vIElmIG91dGVyRm4gaXMgYSBnZW5lcmF0b3IsIHJldHVybiB0aGUgZnVsbCBpdGVyYXRvci5cbiAgICA6IGl0ZXIubmV4dCgpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgcmV0dXJuIHJlc3VsdC5kb25lID8gcmVzdWx0LnZhbHVlIDogaXRlci5uZXh0KCk7XG4gICAgfSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KSB7XG4gICAgdmFyIHN0YXRlID0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydDtcblxuICAgIHJldHVybiBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcpIHtcbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVFeGVjdXRpbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgcnVubmluZ1wiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUNvbXBsZXRlZCkge1xuICAgICAgICBpZiAobWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICB0aHJvdyBhcmc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBCZSBmb3JnaXZpbmcsIHBlciAyNS4zLjMuMy4zIG9mIHRoZSBzcGVjOlxuICAgICAgICAvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtZ2VuZXJhdG9ycmVzdW1lXG4gICAgICAgIHJldHVybiBkb25lUmVzdWx0KCk7XG4gICAgICB9XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciBkZWxlZ2F0ZSA9IGNvbnRleHQuZGVsZWdhdGU7XG4gICAgICAgIGlmIChkZWxlZ2F0ZSkge1xuICAgICAgICAgIGlmIChtZXRob2QgPT09IFwicmV0dXJuXCIgfHwgbWV0aG9kID09PSBcInRocm93XCIgJiYgZGVsZWdhdGUuaXRlcmF0b3JbbWV0aG9kXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBBIHJldHVybiBvciB0aHJvdyAod2hlbiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIG5vIHRocm93XG4gICAgICAgICAgICAvLyBtZXRob2QpIGFsd2F5cyB0ZXJtaW5hdGVzIHRoZSB5aWVsZCogbG9vcC5cbiAgICAgICAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICAgICAgICAvLyBJZiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIGEgcmV0dXJuIG1ldGhvZCwgZ2l2ZSBpdCBhXG4gICAgICAgICAgICAvLyBjaGFuY2UgdG8gY2xlYW4gdXAuXG4gICAgICAgICAgICB2YXIgcmV0dXJuTWV0aG9kID0gZGVsZWdhdGUuaXRlcmF0b3JbXCJyZXR1cm5cIl07XG4gICAgICAgICAgICBpZiAocmV0dXJuTWV0aG9kKSB7XG4gICAgICAgICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChyZXR1cm5NZXRob2QsIGRlbGVnYXRlLml0ZXJhdG9yLCBhcmcpO1xuICAgICAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgICAgIC8vIElmIHRoZSByZXR1cm4gbWV0aG9kIHRocmV3IGFuIGV4Y2VwdGlvbiwgbGV0IHRoYXRcbiAgICAgICAgICAgICAgICAvLyBleGNlcHRpb24gcHJldmFpbCBvdmVyIHRoZSBvcmlnaW5hbCByZXR1cm4gb3IgdGhyb3cuXG4gICAgICAgICAgICAgICAgbWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICAgICAgICAgIGFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICAgICAgICAvLyBDb250aW51ZSB3aXRoIHRoZSBvdXRlciByZXR1cm4sIG5vdyB0aGF0IHRoZSBkZWxlZ2F0ZVxuICAgICAgICAgICAgICAvLyBpdGVyYXRvciBoYXMgYmVlbiB0ZXJtaW5hdGVkLlxuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goZGVsZWdhdGUuaXRlcmF0b3JbbWV0aG9kXSwgZGVsZWdhdGUuaXRlcmF0b3IsIGFyZyk7XG5cbiAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgICAgICAgIC8vIExpa2UgcmV0dXJuaW5nIGdlbmVyYXRvci50aHJvdyh1bmNhdWdodCksIGJ1dCB3aXRob3V0IHRoZVxuICAgICAgICAgICAgLy8gb3ZlcmhlYWQgb2YgYW4gZXh0cmEgZnVuY3Rpb24gY2FsbC5cbiAgICAgICAgICAgIG1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgICAgIGFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBEZWxlZ2F0ZSBnZW5lcmF0b3IgcmFuIGFuZCBoYW5kbGVkIGl0cyBvd24gZXhjZXB0aW9ucyBzb1xuICAgICAgICAgIC8vIHJlZ2FyZGxlc3Mgb2Ygd2hhdCB0aGUgbWV0aG9kIHdhcywgd2UgY29udGludWUgYXMgaWYgaXQgaXNcbiAgICAgICAgICAvLyBcIm5leHRcIiB3aXRoIGFuIHVuZGVmaW5lZCBhcmcuXG4gICAgICAgICAgbWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgICAgYXJnID0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgdmFyIGluZm8gPSByZWNvcmQuYXJnO1xuICAgICAgICAgIGlmIChpbmZvLmRvbmUpIHtcbiAgICAgICAgICAgIGNvbnRleHRbZGVsZWdhdGUucmVzdWx0TmFtZV0gPSBpbmZvLnZhbHVlO1xuICAgICAgICAgICAgY29udGV4dC5uZXh0ID0gZGVsZWdhdGUubmV4dExvYztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuICAgICAgICAgICAgcmV0dXJuIGluZm87XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCkge1xuICAgICAgICAgICAgY29udGV4dC5zZW50ID0gYXJnO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb250ZXh0LnNlbnQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0KSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgICAgdGhyb3cgYXJnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGFyZykpIHtcbiAgICAgICAgICAgIC8vIElmIHRoZSBkaXNwYXRjaGVkIGV4Y2VwdGlvbiB3YXMgY2F1Z2h0IGJ5IGEgY2F0Y2ggYmxvY2ssXG4gICAgICAgICAgICAvLyB0aGVuIGxldCB0aGF0IGNhdGNoIGJsb2NrIGhhbmRsZSB0aGUgZXhjZXB0aW9uIG5vcm1hbGx5LlxuICAgICAgICAgICAgbWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgICAgICBhcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG1ldGhvZCA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICAgIGNvbnRleHQuYWJydXB0KFwicmV0dXJuXCIsIGFyZyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZSA9IEdlblN0YXRlRXhlY3V0aW5nO1xuXG4gICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiKSB7XG4gICAgICAgICAgLy8gSWYgYW4gZXhjZXB0aW9uIGlzIHRocm93biBmcm9tIGlubmVyRm4sIHdlIGxlYXZlIHN0YXRlID09PVxuICAgICAgICAgIC8vIEdlblN0YXRlRXhlY3V0aW5nIGFuZCBsb29wIGJhY2sgZm9yIGFub3RoZXIgaW52b2NhdGlvbi5cbiAgICAgICAgICBzdGF0ZSA9IGNvbnRleHQuZG9uZSA/IEdlblN0YXRlQ29tcGxldGVkIDogR2VuU3RhdGVTdXNwZW5kZWRZaWVsZDtcblxuICAgICAgICAgIHZhciBpbmZvID0ge1xuICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5hcmcsXG4gICAgICAgICAgICBkb25lOiBjb250ZXh0LmRvbmVcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgaWYgKHJlY29yZC5hcmcgPT09IENvbnRpbnVlU2VudGluZWwpIHtcbiAgICAgICAgICAgIGlmIChjb250ZXh0LmRlbGVnYXRlICYmIG1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgICAgICAgLy8gRGVsaWJlcmF0ZWx5IGZvcmdldCB0aGUgbGFzdCBzZW50IHZhbHVlIHNvIHRoYXQgd2UgZG9uJ3RcbiAgICAgICAgICAgICAgLy8gYWNjaWRlbnRhbGx5IHBhc3MgaXQgb24gdG8gdGhlIGRlbGVnYXRlLlxuICAgICAgICAgICAgICBhcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpbmZvO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAvLyBEaXNwYXRjaCB0aGUgZXhjZXB0aW9uIGJ5IGxvb3BpbmcgYmFjayBhcm91bmQgdG8gdGhlXG4gICAgICAgICAgLy8gY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihhcmcpIGNhbGwgYWJvdmUuXG4gICAgICAgICAgbWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICAgIGFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy8gRGVmaW5lIEdlbmVyYXRvci5wcm90b3R5cGUue25leHQsdGhyb3cscmV0dXJufSBpbiB0ZXJtcyBvZiB0aGVcbiAgLy8gdW5pZmllZCAuX2ludm9rZSBoZWxwZXIgbWV0aG9kLlxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoR3ApO1xuXG4gIEdwW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBHcFt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvclwiO1xuXG4gIEdwLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBcIltvYmplY3QgR2VuZXJhdG9yXVwiO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHB1c2hUcnlFbnRyeShsb2NzKSB7XG4gICAgdmFyIGVudHJ5ID0geyB0cnlMb2M6IGxvY3NbMF0gfTtcblxuICAgIGlmICgxIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmNhdGNoTG9jID0gbG9jc1sxXTtcbiAgICB9XG5cbiAgICBpZiAoMiBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5maW5hbGx5TG9jID0gbG9jc1syXTtcbiAgICAgIGVudHJ5LmFmdGVyTG9jID0gbG9jc1szXTtcbiAgICB9XG5cbiAgICB0aGlzLnRyeUVudHJpZXMucHVzaChlbnRyeSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldFRyeUVudHJ5KGVudHJ5KSB7XG4gICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb24gfHwge307XG4gICAgcmVjb3JkLnR5cGUgPSBcIm5vcm1hbFwiO1xuICAgIGRlbGV0ZSByZWNvcmQuYXJnO1xuICAgIGVudHJ5LmNvbXBsZXRpb24gPSByZWNvcmQ7XG4gIH1cblxuICBmdW5jdGlvbiBDb250ZXh0KHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gVGhlIHJvb3QgZW50cnkgb2JqZWN0IChlZmZlY3RpdmVseSBhIHRyeSBzdGF0ZW1lbnQgd2l0aG91dCBhIGNhdGNoXG4gICAgLy8gb3IgYSBmaW5hbGx5IGJsb2NrKSBnaXZlcyB1cyBhIHBsYWNlIHRvIHN0b3JlIHZhbHVlcyB0aHJvd24gZnJvbVxuICAgIC8vIGxvY2F0aW9ucyB3aGVyZSB0aGVyZSBpcyBubyBlbmNsb3NpbmcgdHJ5IHN0YXRlbWVudC5cbiAgICB0aGlzLnRyeUVudHJpZXMgPSBbeyB0cnlMb2M6IFwicm9vdFwiIH1dO1xuICAgIHRyeUxvY3NMaXN0LmZvckVhY2gocHVzaFRyeUVudHJ5LCB0aGlzKTtcbiAgICB0aGlzLnJlc2V0KHRydWUpO1xuICB9XG5cbiAgcnVudGltZS5rZXlzID0gZnVuY3Rpb24gKG9iamVjdCkge1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgfVxuICAgIGtleXMucmV2ZXJzZSgpO1xuXG4gICAgLy8gUmF0aGVyIHRoYW4gcmV0dXJuaW5nIGFuIG9iamVjdCB3aXRoIGEgbmV4dCBtZXRob2QsIHdlIGtlZXBcbiAgICAvLyB0aGluZ3Mgc2ltcGxlIGFuZCByZXR1cm4gdGhlIG5leHQgZnVuY3Rpb24gaXRzZWxmLlxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgd2hpbGUgKGtleXMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzLnBvcCgpO1xuICAgICAgICBpZiAoa2V5IGluIG9iamVjdCkge1xuICAgICAgICAgIG5leHQudmFsdWUgPSBrZXk7XG4gICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVG8gYXZvaWQgY3JlYXRpbmcgYW4gYWRkaXRpb25hbCBvYmplY3QsIHdlIGp1c3QgaGFuZyB0aGUgLnZhbHVlXG4gICAgICAvLyBhbmQgLmRvbmUgcHJvcGVydGllcyBvZmYgdGhlIG5leHQgZnVuY3Rpb24gb2JqZWN0IGl0c2VsZi4gVGhpc1xuICAgICAgLy8gYWxzbyBlbnN1cmVzIHRoYXQgdGhlIG1pbmlmaWVyIHdpbGwgbm90IGFub255bWl6ZSB0aGUgZnVuY3Rpb24uXG4gICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfTtcbiAgfTtcblxuICBmdW5jdGlvbiB2YWx1ZXMoaXRlcmFibGUpIHtcbiAgICBpZiAoaXRlcmFibGUpIHtcbiAgICAgIHZhciBpdGVyYXRvck1ldGhvZCA9IGl0ZXJhYmxlW2l0ZXJhdG9yU3ltYm9sXTtcbiAgICAgIGlmIChpdGVyYXRvck1ldGhvZCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JNZXRob2QuY2FsbChpdGVyYWJsZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgaXRlcmFibGUubmV4dCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBpdGVyYWJsZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc05hTihpdGVyYWJsZS5sZW5ndGgpKSB7XG4gICAgICAgIHZhciBpID0gLTEsXG4gICAgICAgICAgICBuZXh0ID0gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgaXRlcmFibGUubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duLmNhbGwoaXRlcmFibGUsIGkpKSB7XG4gICAgICAgICAgICAgIG5leHQudmFsdWUgPSBpdGVyYWJsZVtpXTtcbiAgICAgICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIG5leHQudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXh0Lm5leHQgPSBuZXh0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiBhbiBpdGVyYXRvciB3aXRoIG5vIHZhbHVlcy5cbiAgICByZXR1cm4geyBuZXh0OiBkb25lUmVzdWx0IH07XG4gIH1cbiAgcnVudGltZS52YWx1ZXMgPSB2YWx1ZXM7XG5cbiAgZnVuY3Rpb24gZG9uZVJlc3VsdCgpIHtcbiAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIH1cblxuICBDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgICBjb25zdHJ1Y3RvcjogQ29udGV4dCxcblxuICAgIHJlc2V0OiBmdW5jdGlvbiByZXNldChza2lwVGVtcFJlc2V0KSB7XG4gICAgICB0aGlzLnByZXYgPSAwO1xuICAgICAgdGhpcy5uZXh0ID0gMDtcbiAgICAgIHRoaXMuc2VudCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIHRoaXMudHJ5RW50cmllcy5mb3JFYWNoKHJlc2V0VHJ5RW50cnkpO1xuXG4gICAgICBpZiAoIXNraXBUZW1wUmVzZXQpIHtcbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzKSB7XG4gICAgICAgICAgLy8gTm90IHN1cmUgYWJvdXQgdGhlIG9wdGltYWwgb3JkZXIgb2YgdGhlc2UgY29uZGl0aW9uczpcbiAgICAgICAgICBpZiAobmFtZS5jaGFyQXQoMCkgPT09IFwidFwiICYmIGhhc093bi5jYWxsKHRoaXMsIG5hbWUpICYmICFpc05hTigrbmFtZS5zbGljZSgxKSkpIHtcbiAgICAgICAgICAgIHRoaXNbbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHN0b3A6IGZ1bmN0aW9uIHN0b3AoKSB7XG4gICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuXG4gICAgICB2YXIgcm9vdEVudHJ5ID0gdGhpcy50cnlFbnRyaWVzWzBdO1xuICAgICAgdmFyIHJvb3RSZWNvcmQgPSByb290RW50cnkuY29tcGxldGlvbjtcbiAgICAgIGlmIChyb290UmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByb290UmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucnZhbDtcbiAgICB9LFxuXG4gICAgZGlzcGF0Y2hFeGNlcHRpb246IGZ1bmN0aW9uIGRpc3BhdGNoRXhjZXB0aW9uKGV4Y2VwdGlvbikge1xuICAgICAgaWYgKHRoaXMuZG9uZSkge1xuICAgICAgICB0aHJvdyBleGNlcHRpb247XG4gICAgICB9XG5cbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZShsb2MsIGNhdWdodCkge1xuICAgICAgICByZWNvcmQudHlwZSA9IFwidGhyb3dcIjtcbiAgICAgICAgcmVjb3JkLmFyZyA9IGV4Y2VwdGlvbjtcbiAgICAgICAgY29udGV4dC5uZXh0ID0gbG9jO1xuICAgICAgICByZXR1cm4gISFjYXVnaHQ7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSBcInJvb3RcIikge1xuICAgICAgICAgIC8vIEV4Y2VwdGlvbiB0aHJvd24gb3V0c2lkZSBvZiBhbnkgdHJ5IGJsb2NrIHRoYXQgY291bGQgaGFuZGxlXG4gICAgICAgICAgLy8gaXQsIHNvIHNldCB0aGUgY29tcGxldGlvbiB2YWx1ZSBvZiB0aGUgZW50aXJlIGZ1bmN0aW9uIHRvXG4gICAgICAgICAgLy8gdGhyb3cgdGhlIGV4Y2VwdGlvbi5cbiAgICAgICAgICByZXR1cm4gaGFuZGxlKFwiZW5kXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYpIHtcbiAgICAgICAgICB2YXIgaGFzQ2F0Y2ggPSBoYXNPd24uY2FsbChlbnRyeSwgXCJjYXRjaExvY1wiKTtcbiAgICAgICAgICB2YXIgaGFzRmluYWxseSA9IGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIik7XG5cbiAgICAgICAgICBpZiAoaGFzQ2F0Y2ggJiYgaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNDYXRjaCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJ5IHN0YXRlbWVudCB3aXRob3V0IGNhdGNoIG9yIGZpbmFsbHlcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFicnVwdDogZnVuY3Rpb24gYWJydXB0KHR5cGUsIGFyZykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2ICYmIGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIikgJiYgdGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgIHZhciBmaW5hbGx5RW50cnkgPSBlbnRyeTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZmluYWxseUVudHJ5ICYmICh0eXBlID09PSBcImJyZWFrXCIgfHwgdHlwZSA9PT0gXCJjb250aW51ZVwiKSAmJiBmaW5hbGx5RW50cnkudHJ5TG9jIDw9IGFyZyAmJiBhcmcgPD0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgLy8gSWdub3JlIHRoZSBmaW5hbGx5IGVudHJ5IGlmIGNvbnRyb2wgaXMgbm90IGp1bXBpbmcgdG8gYVxuICAgICAgICAvLyBsb2NhdGlvbiBvdXRzaWRlIHRoZSB0cnkvY2F0Y2ggYmxvY2suXG4gICAgICAgIGZpbmFsbHlFbnRyeSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHZhciByZWNvcmQgPSBmaW5hbGx5RW50cnkgPyBmaW5hbGx5RW50cnkuY29tcGxldGlvbiA6IHt9O1xuICAgICAgcmVjb3JkLnR5cGUgPSB0eXBlO1xuICAgICAgcmVjb3JkLmFyZyA9IGFyZztcblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSkge1xuICAgICAgICB0aGlzLm5leHQgPSBmaW5hbGx5RW50cnkuZmluYWxseUxvYztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY29tcGxldGUocmVjb3JkKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfSxcblxuICAgIGNvbXBsZXRlOiBmdW5jdGlvbiBjb21wbGV0ZShyZWNvcmQsIGFmdGVyTG9jKSB7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwiYnJlYWtcIiB8fCByZWNvcmQudHlwZSA9PT0gXCJjb250aW51ZVwiKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IHJlY29yZC5hcmc7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInJldHVyblwiKSB7XG4gICAgICAgIHRoaXMucnZhbCA9IHJlY29yZC5hcmc7XG4gICAgICAgIHRoaXMubmV4dCA9IFwiZW5kXCI7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiICYmIGFmdGVyTG9jKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IGFmdGVyTG9jO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBmaW5pc2g6IGZ1bmN0aW9uIGZpbmlzaChmaW5hbGx5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LmZpbmFsbHlMb2MgPT09IGZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB0aGlzLmNvbXBsZXRlKGVudHJ5LmNvbXBsZXRpb24sIGVudHJ5LmFmdGVyTG9jKTtcbiAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBcImNhdGNoXCI6IGZ1bmN0aW9uIF9jYXRjaCh0cnlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSB0cnlMb2MpIHtcbiAgICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcbiAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgdmFyIHRocm93biA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRocm93bjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgY29udGV4dC5jYXRjaCBtZXRob2QgbXVzdCBvbmx5IGJlIGNhbGxlZCB3aXRoIGEgbG9jYXRpb25cbiAgICAgIC8vIGFyZ3VtZW50IHRoYXQgY29ycmVzcG9uZHMgdG8gYSBrbm93biBjYXRjaCBibG9jay5cbiAgICAgIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgY2F0Y2ggYXR0ZW1wdFwiKTtcbiAgICB9LFxuXG4gICAgZGVsZWdhdGVZaWVsZDogZnVuY3Rpb24gZGVsZWdhdGVZaWVsZChpdGVyYWJsZSwgcmVzdWx0TmFtZSwgbmV4dExvYykge1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IHtcbiAgICAgICAgaXRlcmF0b3I6IHZhbHVlcyhpdGVyYWJsZSksXG4gICAgICAgIHJlc3VsdE5hbWU6IHJlc3VsdE5hbWUsXG4gICAgICAgIG5leHRMb2M6IG5leHRMb2NcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cbiAgfTtcbn0pKFxuLy8gQW1vbmcgdGhlIHZhcmlvdXMgdHJpY2tzIGZvciBvYnRhaW5pbmcgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbFxuLy8gb2JqZWN0LCB0aGlzIHNlZW1zIHRvIGJlIHRoZSBtb3N0IHJlbGlhYmxlIHRlY2huaXF1ZSB0aGF0IGRvZXMgbm90XG4vLyB1c2UgaW5kaXJlY3QgZXZhbCAod2hpY2ggdmlvbGF0ZXMgQ29udGVudCBTZWN1cml0eSBQb2xpY3kpLlxudHlwZW9mIGdsb2JhbCA9PT0gXCJvYmplY3RcIiA/IGdsb2JhbCA6IHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIgPyB3aW5kb3cgOiB0eXBlb2Ygc2VsZiA9PT0gXCJvYmplY3RcIiA/IHNlbGYgOiB1bmRlZmluZWQpOyIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuYXJyYXkuZnJvbScpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzLyQuY29yZScpLkFycmF5LmZyb207IiwicmVxdWlyZSgnLi4vbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvcicpOyIsInJlcXVpcmUoJy4uL21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZScpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uL21vZHVsZXMvY29yZS5pcy1pdGVyYWJsZScpOyIsInJlcXVpcmUoJy4uL21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5tYXAnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM3Lm1hcC50by1qc29uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uL21vZHVsZXMvJC5jb3JlJykuTWFwOyIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm1hdGgubG9nMTAnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy8kLmNvcmUnKS5NYXRoLmxvZzEwOyIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5hc3NpZ24nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy8kLmNvcmUnKS5PYmplY3QuYXNzaWduOyIsInZhciAkID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy8kJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZShQLCBEKXtcbiAgcmV0dXJuICQuY3JlYXRlKFAsIEQpO1xufTsiLCJ2YXIgJCA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvJCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShpdCwga2V5LCBkZXNjKXtcbiAgcmV0dXJuICQuc2V0RGVzYyhpdCwga2V5LCBkZXNjKTtcbn07IiwidmFyICQgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzLyQnKTtcbnJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3InKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGl0LCBrZXkpe1xuICByZXR1cm4gJC5nZXREZXNjKGl0LCBrZXkpO1xufTsiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3Qua2V5cycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzLyQuY29yZScpLk9iamVjdC5rZXlzOyIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5zZXQtcHJvdG90eXBlLW9mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvJC5jb3JlJykuT2JqZWN0LnNldFByb3RvdHlwZU9mOyIsInJlcXVpcmUoJy4uL21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5wcm9taXNlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uL21vZHVsZXMvJC5jb3JlJykuUHJvbWlzZTsiLCJyZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZScpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc2V0Jyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNy5zZXQudG8tanNvbicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi9tb2R1bGVzLyQuY29yZScpLlNldDsiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5zeW1ib2wnKTtcbnJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy8kLmNvcmUnKS5TeW1ib2w7IiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi8uLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy8kLndrcycpKCdpdGVyYXRvcicpOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZih0eXBlb2YgaXQgIT0gJ2Z1bmN0aW9uJyl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICByZXR1cm4gaXQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXsgLyogZW1wdHkgKi8gfTsiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLyQuaXMtb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoIWlzT2JqZWN0KGl0KSl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhbiBvYmplY3QhJyk7XG4gIHJldHVybiBpdDtcbn07IiwiLy8gZ2V0dGluZyB0YWcgZnJvbSAxOS4xLjMuNiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKClcbnZhciBjb2YgPSByZXF1aXJlKCcuLyQuY29mJylcbiAgLCBUQUcgPSByZXF1aXJlKCcuLyQud2tzJykoJ3RvU3RyaW5nVGFnJylcbiAgLy8gRVMzIHdyb25nIGhlcmVcbiAgLCBBUkcgPSBjb2YoZnVuY3Rpb24oKXsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA9PSAnQXJndW1lbnRzJztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHZhciBPLCBULCBCO1xuICByZXR1cm4gaXQgPT09IHVuZGVmaW5lZCA/ICdVbmRlZmluZWQnIDogaXQgPT09IG51bGwgPyAnTnVsbCdcbiAgICAvLyBAQHRvU3RyaW5nVGFnIGNhc2VcbiAgICA6IHR5cGVvZiAoVCA9IChPID0gT2JqZWN0KGl0KSlbVEFHXSkgPT0gJ3N0cmluZycgPyBUXG4gICAgLy8gYnVpbHRpblRhZyBjYXNlXG4gICAgOiBBUkcgPyBjb2YoTylcbiAgICAvLyBFUzMgYXJndW1lbnRzIGZhbGxiYWNrXG4gICAgOiAoQiA9IGNvZihPKSkgPT0gJ09iamVjdCcgJiYgdHlwZW9mIE8uY2FsbGVlID09ICdmdW5jdGlvbicgPyAnQXJndW1lbnRzJyA6IEI7XG59OyIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgaGlkZSAgICAgICAgID0gcmVxdWlyZSgnLi8kLmhpZGUnKVxuICAsIHJlZGVmaW5lQWxsICA9IHJlcXVpcmUoJy4vJC5yZWRlZmluZS1hbGwnKVxuICAsIGN0eCAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5jdHgnKVxuICAsIHN0cmljdE5ldyAgICA9IHJlcXVpcmUoJy4vJC5zdHJpY3QtbmV3JylcbiAgLCBkZWZpbmVkICAgICAgPSByZXF1aXJlKCcuLyQuZGVmaW5lZCcpXG4gICwgZm9yT2YgICAgICAgID0gcmVxdWlyZSgnLi8kLmZvci1vZicpXG4gICwgJGl0ZXJEZWZpbmUgID0gcmVxdWlyZSgnLi8kLml0ZXItZGVmaW5lJylcbiAgLCBzdGVwICAgICAgICAgPSByZXF1aXJlKCcuLyQuaXRlci1zdGVwJylcbiAgLCBJRCAgICAgICAgICAgPSByZXF1aXJlKCcuLyQudWlkJykoJ2lkJylcbiAgLCAkaGFzICAgICAgICAgPSByZXF1aXJlKCcuLyQuaGFzJylcbiAgLCBpc09iamVjdCAgICAgPSByZXF1aXJlKCcuLyQuaXMtb2JqZWN0JylcbiAgLCBzZXRTcGVjaWVzICAgPSByZXF1aXJlKCcuLyQuc2V0LXNwZWNpZXMnKVxuICAsIERFU0NSSVBUT1JTICA9IHJlcXVpcmUoJy4vJC5kZXNjcmlwdG9ycycpXG4gICwgaXNFeHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZSB8fCBpc09iamVjdFxuICAsIFNJWkUgICAgICAgICA9IERFU0NSSVBUT1JTID8gJ19zJyA6ICdzaXplJ1xuICAsIGlkICAgICAgICAgICA9IDA7XG5cbnZhciBmYXN0S2V5ID0gZnVuY3Rpb24oaXQsIGNyZWF0ZSl7XG4gIC8vIHJldHVybiBwcmltaXRpdmUgd2l0aCBwcmVmaXhcbiAgaWYoIWlzT2JqZWN0KGl0KSlyZXR1cm4gdHlwZW9mIGl0ID09ICdzeW1ib2wnID8gaXQgOiAodHlwZW9mIGl0ID09ICdzdHJpbmcnID8gJ1MnIDogJ1AnKSArIGl0O1xuICBpZighJGhhcyhpdCwgSUQpKXtcbiAgICAvLyBjYW4ndCBzZXQgaWQgdG8gZnJvemVuIG9iamVjdFxuICAgIGlmKCFpc0V4dGVuc2libGUoaXQpKXJldHVybiAnRic7XG4gICAgLy8gbm90IG5lY2Vzc2FyeSB0byBhZGQgaWRcbiAgICBpZighY3JlYXRlKXJldHVybiAnRSc7XG4gICAgLy8gYWRkIG1pc3Npbmcgb2JqZWN0IGlkXG4gICAgaGlkZShpdCwgSUQsICsraWQpO1xuICAvLyByZXR1cm4gb2JqZWN0IGlkIHdpdGggcHJlZml4XG4gIH0gcmV0dXJuICdPJyArIGl0W0lEXTtcbn07XG5cbnZhciBnZXRFbnRyeSA9IGZ1bmN0aW9uKHRoYXQsIGtleSl7XG4gIC8vIGZhc3QgY2FzZVxuICB2YXIgaW5kZXggPSBmYXN0S2V5KGtleSksIGVudHJ5O1xuICBpZihpbmRleCAhPT0gJ0YnKXJldHVybiB0aGF0Ll9pW2luZGV4XTtcbiAgLy8gZnJvemVuIG9iamVjdCBjYXNlXG4gIGZvcihlbnRyeSA9IHRoYXQuX2Y7IGVudHJ5OyBlbnRyeSA9IGVudHJ5Lm4pe1xuICAgIGlmKGVudHJ5LmsgPT0ga2V5KXJldHVybiBlbnRyeTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldENvbnN0cnVjdG9yOiBmdW5jdGlvbih3cmFwcGVyLCBOQU1FLCBJU19NQVAsIEFEREVSKXtcbiAgICB2YXIgQyA9IHdyYXBwZXIoZnVuY3Rpb24odGhhdCwgaXRlcmFibGUpe1xuICAgICAgc3RyaWN0TmV3KHRoYXQsIEMsIE5BTUUpO1xuICAgICAgdGhhdC5faSA9ICQuY3JlYXRlKG51bGwpOyAvLyBpbmRleFxuICAgICAgdGhhdC5fZiA9IHVuZGVmaW5lZDsgICAgICAvLyBmaXJzdCBlbnRyeVxuICAgICAgdGhhdC5fbCA9IHVuZGVmaW5lZDsgICAgICAvLyBsYXN0IGVudHJ5XG4gICAgICB0aGF0W1NJWkVdID0gMDsgICAgICAgICAgIC8vIHNpemVcbiAgICAgIGlmKGl0ZXJhYmxlICE9IHVuZGVmaW5lZClmb3JPZihpdGVyYWJsZSwgSVNfTUFQLCB0aGF0W0FEREVSXSwgdGhhdCk7XG4gICAgfSk7XG4gICAgcmVkZWZpbmVBbGwoQy5wcm90b3R5cGUsIHtcbiAgICAgIC8vIDIzLjEuMy4xIE1hcC5wcm90b3R5cGUuY2xlYXIoKVxuICAgICAgLy8gMjMuMi4zLjIgU2V0LnByb3RvdHlwZS5jbGVhcigpXG4gICAgICBjbGVhcjogZnVuY3Rpb24gY2xlYXIoKXtcbiAgICAgICAgZm9yKHZhciB0aGF0ID0gdGhpcywgZGF0YSA9IHRoYXQuX2ksIGVudHJ5ID0gdGhhdC5fZjsgZW50cnk7IGVudHJ5ID0gZW50cnkubil7XG4gICAgICAgICAgZW50cnkuciA9IHRydWU7XG4gICAgICAgICAgaWYoZW50cnkucCllbnRyeS5wID0gZW50cnkucC5uID0gdW5kZWZpbmVkO1xuICAgICAgICAgIGRlbGV0ZSBkYXRhW2VudHJ5LmldO1xuICAgICAgICB9XG4gICAgICAgIHRoYXQuX2YgPSB0aGF0Ll9sID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGF0W1NJWkVdID0gMDtcbiAgICAgIH0sXG4gICAgICAvLyAyMy4xLjMuMyBNYXAucHJvdG90eXBlLmRlbGV0ZShrZXkpXG4gICAgICAvLyAyMy4yLjMuNCBTZXQucHJvdG90eXBlLmRlbGV0ZSh2YWx1ZSlcbiAgICAgICdkZWxldGUnOiBmdW5jdGlvbihrZXkpe1xuICAgICAgICB2YXIgdGhhdCAgPSB0aGlzXG4gICAgICAgICAgLCBlbnRyeSA9IGdldEVudHJ5KHRoYXQsIGtleSk7XG4gICAgICAgIGlmKGVudHJ5KXtcbiAgICAgICAgICB2YXIgbmV4dCA9IGVudHJ5Lm5cbiAgICAgICAgICAgICwgcHJldiA9IGVudHJ5LnA7XG4gICAgICAgICAgZGVsZXRlIHRoYXQuX2lbZW50cnkuaV07XG4gICAgICAgICAgZW50cnkuciA9IHRydWU7XG4gICAgICAgICAgaWYocHJldilwcmV2Lm4gPSBuZXh0O1xuICAgICAgICAgIGlmKG5leHQpbmV4dC5wID0gcHJldjtcbiAgICAgICAgICBpZih0aGF0Ll9mID09IGVudHJ5KXRoYXQuX2YgPSBuZXh0O1xuICAgICAgICAgIGlmKHRoYXQuX2wgPT0gZW50cnkpdGhhdC5fbCA9IHByZXY7XG4gICAgICAgICAgdGhhdFtTSVpFXS0tO1xuICAgICAgICB9IHJldHVybiAhIWVudHJ5O1xuICAgICAgfSxcbiAgICAgIC8vIDIzLjIuMy42IFNldC5wcm90b3R5cGUuZm9yRWFjaChjYWxsYmFja2ZuLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICAgICAgLy8gMjMuMS4zLjUgTWFwLnByb3RvdHlwZS5mb3JFYWNoKGNhbGxiYWNrZm4sIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gICAgICBmb3JFYWNoOiBmdW5jdGlvbiBmb3JFYWNoKGNhbGxiYWNrZm4gLyosIHRoYXQgPSB1bmRlZmluZWQgKi8pe1xuICAgICAgICB2YXIgZiA9IGN0eChjYWxsYmFja2ZuLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCwgMylcbiAgICAgICAgICAsIGVudHJ5O1xuICAgICAgICB3aGlsZShlbnRyeSA9IGVudHJ5ID8gZW50cnkubiA6IHRoaXMuX2Ype1xuICAgICAgICAgIGYoZW50cnkudiwgZW50cnkuaywgdGhpcyk7XG4gICAgICAgICAgLy8gcmV2ZXJ0IHRvIHRoZSBsYXN0IGV4aXN0aW5nIGVudHJ5XG4gICAgICAgICAgd2hpbGUoZW50cnkgJiYgZW50cnkucillbnRyeSA9IGVudHJ5LnA7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAvLyAyMy4xLjMuNyBNYXAucHJvdG90eXBlLmhhcyhrZXkpXG4gICAgICAvLyAyMy4yLjMuNyBTZXQucHJvdG90eXBlLmhhcyh2YWx1ZSlcbiAgICAgIGhhczogZnVuY3Rpb24gaGFzKGtleSl7XG4gICAgICAgIHJldHVybiAhIWdldEVudHJ5KHRoaXMsIGtleSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYoREVTQ1JJUFRPUlMpJC5zZXREZXNjKEMucHJvdG90eXBlLCAnc2l6ZScsIHtcbiAgICAgIGdldDogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIGRlZmluZWQodGhpc1tTSVpFXSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIEM7XG4gIH0sXG4gIGRlZjogZnVuY3Rpb24odGhhdCwga2V5LCB2YWx1ZSl7XG4gICAgdmFyIGVudHJ5ID0gZ2V0RW50cnkodGhhdCwga2V5KVxuICAgICAgLCBwcmV2LCBpbmRleDtcbiAgICAvLyBjaGFuZ2UgZXhpc3RpbmcgZW50cnlcbiAgICBpZihlbnRyeSl7XG4gICAgICBlbnRyeS52ID0gdmFsdWU7XG4gICAgLy8gY3JlYXRlIG5ldyBlbnRyeVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGF0Ll9sID0gZW50cnkgPSB7XG4gICAgICAgIGk6IGluZGV4ID0gZmFzdEtleShrZXksIHRydWUpLCAvLyA8LSBpbmRleFxuICAgICAgICBrOiBrZXksICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0ga2V5XG4gICAgICAgIHY6IHZhbHVlLCAgICAgICAgICAgICAgICAgICAgICAvLyA8LSB2YWx1ZVxuICAgICAgICBwOiBwcmV2ID0gdGhhdC5fbCwgICAgICAgICAgICAgLy8gPC0gcHJldmlvdXMgZW50cnlcbiAgICAgICAgbjogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgIC8vIDwtIG5leHQgZW50cnlcbiAgICAgICAgcjogZmFsc2UgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHJlbW92ZWRcbiAgICAgIH07XG4gICAgICBpZighdGhhdC5fZil0aGF0Ll9mID0gZW50cnk7XG4gICAgICBpZihwcmV2KXByZXYubiA9IGVudHJ5O1xuICAgICAgdGhhdFtTSVpFXSsrO1xuICAgICAgLy8gYWRkIHRvIGluZGV4XG4gICAgICBpZihpbmRleCAhPT0gJ0YnKXRoYXQuX2lbaW5kZXhdID0gZW50cnk7XG4gICAgfSByZXR1cm4gdGhhdDtcbiAgfSxcbiAgZ2V0RW50cnk6IGdldEVudHJ5LFxuICBzZXRTdHJvbmc6IGZ1bmN0aW9uKEMsIE5BTUUsIElTX01BUCl7XG4gICAgLy8gYWRkIC5rZXlzLCAudmFsdWVzLCAuZW50cmllcywgW0BAaXRlcmF0b3JdXG4gICAgLy8gMjMuMS4zLjQsIDIzLjEuMy44LCAyMy4xLjMuMTEsIDIzLjEuMy4xMiwgMjMuMi4zLjUsIDIzLjIuMy44LCAyMy4yLjMuMTAsIDIzLjIuMy4xMVxuICAgICRpdGVyRGVmaW5lKEMsIE5BTUUsIGZ1bmN0aW9uKGl0ZXJhdGVkLCBraW5kKXtcbiAgICAgIHRoaXMuX3QgPSBpdGVyYXRlZDsgIC8vIHRhcmdldFxuICAgICAgdGhpcy5fayA9IGtpbmQ7ICAgICAgLy8ga2luZFxuICAgICAgdGhpcy5fbCA9IHVuZGVmaW5lZDsgLy8gcHJldmlvdXNcbiAgICB9LCBmdW5jdGlvbigpe1xuICAgICAgdmFyIHRoYXQgID0gdGhpc1xuICAgICAgICAsIGtpbmQgID0gdGhhdC5fa1xuICAgICAgICAsIGVudHJ5ID0gdGhhdC5fbDtcbiAgICAgIC8vIHJldmVydCB0byB0aGUgbGFzdCBleGlzdGluZyBlbnRyeVxuICAgICAgd2hpbGUoZW50cnkgJiYgZW50cnkucillbnRyeSA9IGVudHJ5LnA7XG4gICAgICAvLyBnZXQgbmV4dCBlbnRyeVxuICAgICAgaWYoIXRoYXQuX3QgfHwgISh0aGF0Ll9sID0gZW50cnkgPSBlbnRyeSA/IGVudHJ5Lm4gOiB0aGF0Ll90Ll9mKSl7XG4gICAgICAgIC8vIG9yIGZpbmlzaCB0aGUgaXRlcmF0aW9uXG4gICAgICAgIHRoYXQuX3QgPSB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybiBzdGVwKDEpO1xuICAgICAgfVxuICAgICAgLy8gcmV0dXJuIHN0ZXAgYnkga2luZFxuICAgICAgaWYoa2luZCA9PSAna2V5cycgIClyZXR1cm4gc3RlcCgwLCBlbnRyeS5rKTtcbiAgICAgIGlmKGtpbmQgPT0gJ3ZhbHVlcycpcmV0dXJuIHN0ZXAoMCwgZW50cnkudik7XG4gICAgICByZXR1cm4gc3RlcCgwLCBbZW50cnkuaywgZW50cnkudl0pO1xuICAgIH0sIElTX01BUCA/ICdlbnRyaWVzJyA6ICd2YWx1ZXMnICwgIUlTX01BUCwgdHJ1ZSk7XG5cbiAgICAvLyBhZGQgW0BAc3BlY2llc10sIDIzLjEuMi4yLCAyMy4yLjIuMlxuICAgIHNldFNwZWNpZXMoTkFNRSk7XG4gIH1cbn07IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL0RhdmlkQnJ1YW50L01hcC1TZXQucHJvdG90eXBlLnRvSlNPTlxudmFyIGZvck9mICAgPSByZXF1aXJlKCcuLyQuZm9yLW9mJylcbiAgLCBjbGFzc29mID0gcmVxdWlyZSgnLi8kLmNsYXNzb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oTkFNRSl7XG4gIHJldHVybiBmdW5jdGlvbiB0b0pTT04oKXtcbiAgICBpZihjbGFzc29mKHRoaXMpICE9IE5BTUUpdGhyb3cgVHlwZUVycm9yKE5BTUUgKyBcIiN0b0pTT04gaXNuJ3QgZ2VuZXJpY1wiKTtcbiAgICB2YXIgYXJyID0gW107XG4gICAgZm9yT2YodGhpcywgZmFsc2UsIGFyci5wdXNoLCBhcnIpO1xuICAgIHJldHVybiBhcnI7XG4gIH07XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciAkICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgZ2xvYmFsICAgICAgICAgPSByZXF1aXJlKCcuLyQuZ2xvYmFsJylcbiAgLCAkZXhwb3J0ICAgICAgICA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKVxuICAsIGZhaWxzICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmZhaWxzJylcbiAgLCBoaWRlICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5oaWRlJylcbiAgLCByZWRlZmluZUFsbCAgICA9IHJlcXVpcmUoJy4vJC5yZWRlZmluZS1hbGwnKVxuICAsIGZvck9mICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmZvci1vZicpXG4gICwgc3RyaWN0TmV3ICAgICAgPSByZXF1aXJlKCcuLyQuc3RyaWN0LW5ldycpXG4gICwgaXNPYmplY3QgICAgICAgPSByZXF1aXJlKCcuLyQuaXMtb2JqZWN0JylcbiAgLCBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vJC5zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgREVTQ1JJUFRPUlMgICAgPSByZXF1aXJlKCcuLyQuZGVzY3JpcHRvcnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihOQU1FLCB3cmFwcGVyLCBtZXRob2RzLCBjb21tb24sIElTX01BUCwgSVNfV0VBSyl7XG4gIHZhciBCYXNlICA9IGdsb2JhbFtOQU1FXVxuICAgICwgQyAgICAgPSBCYXNlXG4gICAgLCBBRERFUiA9IElTX01BUCA/ICdzZXQnIDogJ2FkZCdcbiAgICAsIHByb3RvID0gQyAmJiBDLnByb3RvdHlwZVxuICAgICwgTyAgICAgPSB7fTtcbiAgaWYoIURFU0NSSVBUT1JTIHx8IHR5cGVvZiBDICE9ICdmdW5jdGlvbicgfHwgIShJU19XRUFLIHx8IHByb3RvLmZvckVhY2ggJiYgIWZhaWxzKGZ1bmN0aW9uKCl7XG4gICAgbmV3IEMoKS5lbnRyaWVzKCkubmV4dCgpO1xuICB9KSkpe1xuICAgIC8vIGNyZWF0ZSBjb2xsZWN0aW9uIGNvbnN0cnVjdG9yXG4gICAgQyA9IGNvbW1vbi5nZXRDb25zdHJ1Y3Rvcih3cmFwcGVyLCBOQU1FLCBJU19NQVAsIEFEREVSKTtcbiAgICByZWRlZmluZUFsbChDLnByb3RvdHlwZSwgbWV0aG9kcyk7XG4gIH0gZWxzZSB7XG4gICAgQyA9IHdyYXBwZXIoZnVuY3Rpb24odGFyZ2V0LCBpdGVyYWJsZSl7XG4gICAgICBzdHJpY3ROZXcodGFyZ2V0LCBDLCBOQU1FKTtcbiAgICAgIHRhcmdldC5fYyA9IG5ldyBCYXNlO1xuICAgICAgaWYoaXRlcmFibGUgIT0gdW5kZWZpbmVkKWZvck9mKGl0ZXJhYmxlLCBJU19NQVAsIHRhcmdldFtBRERFUl0sIHRhcmdldCk7XG4gICAgfSk7XG4gICAgJC5lYWNoLmNhbGwoJ2FkZCxjbGVhcixkZWxldGUsZm9yRWFjaCxnZXQsaGFzLHNldCxrZXlzLHZhbHVlcyxlbnRyaWVzJy5zcGxpdCgnLCcpLGZ1bmN0aW9uKEtFWSl7XG4gICAgICB2YXIgSVNfQURERVIgPSBLRVkgPT0gJ2FkZCcgfHwgS0VZID09ICdzZXQnO1xuICAgICAgaWYoS0VZIGluIHByb3RvICYmICEoSVNfV0VBSyAmJiBLRVkgPT0gJ2NsZWFyJykpaGlkZShDLnByb3RvdHlwZSwgS0VZLCBmdW5jdGlvbihhLCBiKXtcbiAgICAgICAgaWYoIUlTX0FEREVSICYmIElTX1dFQUsgJiYgIWlzT2JqZWN0KGEpKXJldHVybiBLRVkgPT0gJ2dldCcgPyB1bmRlZmluZWQgOiBmYWxzZTtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXMuX2NbS0VZXShhID09PSAwID8gMCA6IGEsIGIpO1xuICAgICAgICByZXR1cm4gSVNfQURERVIgPyB0aGlzIDogcmVzdWx0O1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaWYoJ3NpemUnIGluIHByb3RvKSQuc2V0RGVzYyhDLnByb3RvdHlwZSwgJ3NpemUnLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9jLnNpemU7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzZXRUb1N0cmluZ1RhZyhDLCBOQU1FKTtcblxuICBPW05BTUVdID0gQztcbiAgJGV4cG9ydCgkZXhwb3J0LkcgKyAkZXhwb3J0LlcgKyAkZXhwb3J0LkYsIE8pO1xuXG4gIGlmKCFJU19XRUFLKWNvbW1vbi5zZXRTdHJvbmcoQywgTkFNRSwgSVNfTUFQKTtcblxuICByZXR1cm4gQztcbn07IiwidmFyIGNvcmUgPSBtb2R1bGUuZXhwb3J0cyA9IHt2ZXJzaW9uOiAnMS4yLjYnfTtcbmlmKHR5cGVvZiBfX2UgPT0gJ251bWJlcicpX19lID0gY29yZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZiIsIi8vIG9wdGlvbmFsIC8gc2ltcGxlIGNvbnRleHQgYmluZGluZ1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vJC5hLWZ1bmN0aW9uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCB0aGF0LCBsZW5ndGgpe1xuICBhRnVuY3Rpb24oZm4pO1xuICBpZih0aGF0ID09PSB1bmRlZmluZWQpcmV0dXJuIGZuO1xuICBzd2l0Y2gobGVuZ3RoKXtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbihhKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24oYSwgYil7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiKTtcbiAgICB9O1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKGEsIGIsIGMpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24oLyogLi4uYXJncyAqLyl7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59OyIsIi8vIDcuMi4xIFJlcXVpcmVPYmplY3RDb2VyY2libGUoYXJndW1lbnQpXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoaXQgPT0gdW5kZWZpbmVkKXRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTsiLCIvLyBUaGFuaydzIElFOCBmb3IgaGlzIGZ1bm55IGRlZmluZVByb3BlcnR5XG5tb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuLyQuZmFpbHMnKShmdW5jdGlvbigpe1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnYScsIHtnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiA3OyB9fSkuYSAhPSA3O1xufSk7IiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi8kLmlzLW9iamVjdCcpXG4gICwgZG9jdW1lbnQgPSByZXF1aXJlKCcuLyQuZ2xvYmFsJykuZG9jdW1lbnRcbiAgLy8gaW4gb2xkIElFIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnXG4gICwgaXMgPSBpc09iamVjdChkb2N1bWVudCkgJiYgaXNPYmplY3QoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGlzID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07IiwiLy8gYWxsIGVudW1lcmFibGUgb2JqZWN0IGtleXMsIGluY2x1ZGVzIHN5bWJvbHNcbnZhciAkID0gcmVxdWlyZSgnLi8kJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgdmFyIGtleXMgICAgICAgPSAkLmdldEtleXMoaXQpXG4gICAgLCBnZXRTeW1ib2xzID0gJC5nZXRTeW1ib2xzO1xuICBpZihnZXRTeW1ib2xzKXtcbiAgICB2YXIgc3ltYm9scyA9IGdldFN5bWJvbHMoaXQpXG4gICAgICAsIGlzRW51bSAgPSAkLmlzRW51bVxuICAgICAgLCBpICAgICAgID0gMFxuICAgICAgLCBrZXk7XG4gICAgd2hpbGUoc3ltYm9scy5sZW5ndGggPiBpKWlmKGlzRW51bS5jYWxsKGl0LCBrZXkgPSBzeW1ib2xzW2krK10pKWtleXMucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiBrZXlzO1xufTsiLCJ2YXIgZ2xvYmFsICAgID0gcmVxdWlyZSgnLi8kLmdsb2JhbCcpXG4gICwgY29yZSAgICAgID0gcmVxdWlyZSgnLi8kLmNvcmUnKVxuICAsIGN0eCAgICAgICA9IHJlcXVpcmUoJy4vJC5jdHgnKVxuICAsIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG52YXIgJGV4cG9ydCA9IGZ1bmN0aW9uKHR5cGUsIG5hbWUsIHNvdXJjZSl7XG4gIHZhciBJU19GT1JDRUQgPSB0eXBlICYgJGV4cG9ydC5GXG4gICAgLCBJU19HTE9CQUwgPSB0eXBlICYgJGV4cG9ydC5HXG4gICAgLCBJU19TVEFUSUMgPSB0eXBlICYgJGV4cG9ydC5TXG4gICAgLCBJU19QUk9UTyAgPSB0eXBlICYgJGV4cG9ydC5QXG4gICAgLCBJU19CSU5EICAgPSB0eXBlICYgJGV4cG9ydC5CXG4gICAgLCBJU19XUkFQICAgPSB0eXBlICYgJGV4cG9ydC5XXG4gICAgLCBleHBvcnRzICAgPSBJU19HTE9CQUwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KVxuICAgICwgdGFyZ2V0ICAgID0gSVNfR0xPQkFMID8gZ2xvYmFsIDogSVNfU1RBVElDID8gZ2xvYmFsW25hbWVdIDogKGdsb2JhbFtuYW1lXSB8fCB7fSlbUFJPVE9UWVBFXVxuICAgICwga2V5LCBvd24sIG91dDtcbiAgaWYoSVNfR0xPQkFMKXNvdXJjZSA9IG5hbWU7XG4gIGZvcihrZXkgaW4gc291cmNlKXtcbiAgICAvLyBjb250YWlucyBpbiBuYXRpdmVcbiAgICBvd24gPSAhSVNfRk9SQ0VEICYmIHRhcmdldCAmJiBrZXkgaW4gdGFyZ2V0O1xuICAgIGlmKG93biAmJiBrZXkgaW4gZXhwb3J0cyljb250aW51ZTtcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxuICAgIG91dCA9IG93biA/IHRhcmdldFtrZXldIDogc291cmNlW2tleV07XG4gICAgLy8gcHJldmVudCBnbG9iYWwgcG9sbHV0aW9uIGZvciBuYW1lc3BhY2VzXG4gICAgZXhwb3J0c1trZXldID0gSVNfR0xPQkFMICYmIHR5cGVvZiB0YXJnZXRba2V5XSAhPSAnZnVuY3Rpb24nID8gc291cmNlW2tleV1cbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxuICAgIDogSVNfQklORCAmJiBvd24gPyBjdHgob3V0LCBnbG9iYWwpXG4gICAgLy8gd3JhcCBnbG9iYWwgY29uc3RydWN0b3JzIGZvciBwcmV2ZW50IGNoYW5nZSB0aGVtIGluIGxpYnJhcnlcbiAgICA6IElTX1dSQVAgJiYgdGFyZ2V0W2tleV0gPT0gb3V0ID8gKGZ1bmN0aW9uKEMpe1xuICAgICAgdmFyIEYgPSBmdW5jdGlvbihwYXJhbSl7XG4gICAgICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgQyA/IG5ldyBDKHBhcmFtKSA6IEMocGFyYW0pO1xuICAgICAgfTtcbiAgICAgIEZbUFJPVE9UWVBFXSA9IENbUFJPVE9UWVBFXTtcbiAgICAgIHJldHVybiBGO1xuICAgIC8vIG1ha2Ugc3RhdGljIHZlcnNpb25zIGZvciBwcm90b3R5cGUgbWV0aG9kc1xuICAgIH0pKG91dCkgOiBJU19QUk9UTyAmJiB0eXBlb2Ygb3V0ID09ICdmdW5jdGlvbicgPyBjdHgoRnVuY3Rpb24uY2FsbCwgb3V0KSA6IG91dDtcbiAgICBpZihJU19QUk9UTykoZXhwb3J0c1tQUk9UT1RZUEVdIHx8IChleHBvcnRzW1BST1RPVFlQRV0gPSB7fSkpW2tleV0gPSBvdXQ7XG4gIH1cbn07XG4vLyB0eXBlIGJpdG1hcFxuJGV4cG9ydC5GID0gMTsgIC8vIGZvcmNlZFxuJGV4cG9ydC5HID0gMjsgIC8vIGdsb2JhbFxuJGV4cG9ydC5TID0gNDsgIC8vIHN0YXRpY1xuJGV4cG9ydC5QID0gODsgIC8vIHByb3RvXG4kZXhwb3J0LkIgPSAxNjsgLy8gYmluZFxuJGV4cG9ydC5XID0gMzI7IC8vIHdyYXBcbm1vZHVsZS5leHBvcnRzID0gJGV4cG9ydDsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV4ZWMpe1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaChlKXtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTsiLCJ2YXIgY3R4ICAgICAgICAgPSByZXF1aXJlKCcuLyQuY3R4JylcbiAgLCBjYWxsICAgICAgICA9IHJlcXVpcmUoJy4vJC5pdGVyLWNhbGwnKVxuICAsIGlzQXJyYXlJdGVyID0gcmVxdWlyZSgnLi8kLmlzLWFycmF5LWl0ZXInKVxuICAsIGFuT2JqZWN0ICAgID0gcmVxdWlyZSgnLi8kLmFuLW9iamVjdCcpXG4gICwgdG9MZW5ndGggICAgPSByZXF1aXJlKCcuLyQudG8tbGVuZ3RoJylcbiAgLCBnZXRJdGVyRm4gICA9IHJlcXVpcmUoJy4vY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0ZXJhYmxlLCBlbnRyaWVzLCBmbiwgdGhhdCl7XG4gIHZhciBpdGVyRm4gPSBnZXRJdGVyRm4oaXRlcmFibGUpXG4gICAgLCBmICAgICAgPSBjdHgoZm4sIHRoYXQsIGVudHJpZXMgPyAyIDogMSlcbiAgICAsIGluZGV4ICA9IDBcbiAgICAsIGxlbmd0aCwgc3RlcCwgaXRlcmF0b3I7XG4gIGlmKHR5cGVvZiBpdGVyRm4gIT0gJ2Z1bmN0aW9uJyl0aHJvdyBUeXBlRXJyb3IoaXRlcmFibGUgKyAnIGlzIG5vdCBpdGVyYWJsZSEnKTtcbiAgLy8gZmFzdCBjYXNlIGZvciBhcnJheXMgd2l0aCBkZWZhdWx0IGl0ZXJhdG9yXG4gIGlmKGlzQXJyYXlJdGVyKGl0ZXJGbikpZm9yKGxlbmd0aCA9IHRvTGVuZ3RoKGl0ZXJhYmxlLmxlbmd0aCk7IGxlbmd0aCA+IGluZGV4OyBpbmRleCsrKXtcbiAgICBlbnRyaWVzID8gZihhbk9iamVjdChzdGVwID0gaXRlcmFibGVbaW5kZXhdKVswXSwgc3RlcFsxXSkgOiBmKGl0ZXJhYmxlW2luZGV4XSk7XG4gIH0gZWxzZSBmb3IoaXRlcmF0b3IgPSBpdGVyRm4uY2FsbChpdGVyYWJsZSk7ICEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZTsgKXtcbiAgICBjYWxsKGl0ZXJhdG9yLCBmLCBzdGVwLnZhbHVlLCBlbnRyaWVzKTtcbiAgfVxufTsiLCIvLyBmYWxsYmFjayBmb3IgSUUxMSBidWdneSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyB3aXRoIGlmcmFtZSBhbmQgd2luZG93XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi8kLnRvLWlvYmplY3QnKVxuICAsIGdldE5hbWVzICA9IHJlcXVpcmUoJy4vJCcpLmdldE5hbWVzXG4gICwgdG9TdHJpbmcgID0ge30udG9TdHJpbmc7XG5cbnZhciB3aW5kb3dOYW1lcyA9IHR5cGVvZiB3aW5kb3cgPT0gJ29iamVjdCcgJiYgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXNcbiAgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh3aW5kb3cpIDogW107XG5cbnZhciBnZXRXaW5kb3dOYW1lcyA9IGZ1bmN0aW9uKGl0KXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZ2V0TmFtZXMoaXQpO1xuICB9IGNhdGNoKGUpe1xuICAgIHJldHVybiB3aW5kb3dOYW1lcy5zbGljZSgpO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5nZXQgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKGl0KXtcbiAgaWYod2luZG93TmFtZXMgJiYgdG9TdHJpbmcuY2FsbChpdCkgPT0gJ1tvYmplY3QgV2luZG93XScpcmV0dXJuIGdldFdpbmRvd05hbWVzKGl0KTtcbiAgcmV0dXJuIGdldE5hbWVzKHRvSU9iamVjdChpdCkpO1xufTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxudmFyIGdsb2JhbCA9IG1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuTWF0aCA9PSBNYXRoXG4gID8gd2luZG93IDogdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5NYXRoID09IE1hdGggPyBzZWxmIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbmlmKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpX19nID0gZ2xvYmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmIiwidmFyIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBrZXkpe1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChpdCwga2V5KTtcbn07IiwidmFyICQgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuLyQucHJvcGVydHktZGVzYycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLyQuZGVzY3JpcHRvcnMnKSA/IGZ1bmN0aW9uKG9iamVjdCwga2V5LCB2YWx1ZSl7XG4gIHJldHVybiAkLnNldERlc2Mob2JqZWN0LCBrZXksIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbn0gOiBmdW5jdGlvbihvYmplY3QsIGtleSwgdmFsdWUpe1xuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqZWN0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKS5kb2N1bWVudCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7IiwiLy8gZmFzdCBhcHBseSwgaHR0cDovL2pzcGVyZi5sbmtpdC5jb20vZmFzdC1hcHBseS81XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCBhcmdzLCB0aGF0KXtcbiAgdmFyIHVuID0gdGhhdCA9PT0gdW5kZWZpbmVkO1xuICBzd2l0Y2goYXJncy5sZW5ndGgpe1xuICAgIGNhc2UgMDogcmV0dXJuIHVuID8gZm4oKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0KTtcbiAgICBjYXNlIDE6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0pO1xuICAgIGNhc2UgMjogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgY2FzZSAzOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgICBjYXNlIDQ6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pO1xuICB9IHJldHVybiAgICAgICAgICAgICAgZm4uYXBwbHkodGhhdCwgYXJncyk7XG59OyIsIi8vIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgYW5kIG5vbi1lbnVtZXJhYmxlIG9sZCBWOCBzdHJpbmdzXG52YXIgY29mID0gcmVxdWlyZSgnLi8kLmNvZicpO1xubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QoJ3onKS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgwKSA/IE9iamVjdCA6IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGNvZihpdCkgPT0gJ1N0cmluZycgPyBpdC5zcGxpdCgnJykgOiBPYmplY3QoaXQpO1xufTsiLCIvLyBjaGVjayBvbiBkZWZhdWx0IEFycmF5IGl0ZXJhdG9yXG52YXIgSXRlcmF0b3JzICA9IHJlcXVpcmUoJy4vJC5pdGVyYXRvcnMnKVxuICAsIElURVJBVE9SICAgPSByZXF1aXJlKCcuLyQud2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGl0ICE9PSB1bmRlZmluZWQgJiYgKEl0ZXJhdG9ycy5BcnJheSA9PT0gaXQgfHwgQXJyYXlQcm90b1tJVEVSQVRPUl0gPT09IGl0KTtcbn07IiwiLy8gNy4yLjIgSXNBcnJheShhcmd1bWVudClcbnZhciBjb2YgPSByZXF1aXJlKCcuLyQuY29mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24oYXJnKXtcbiAgcmV0dXJuIGNvZihhcmcpID09ICdBcnJheSc7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdHlwZW9mIGl0ID09PSAnb2JqZWN0JyA/IGl0ICE9PSBudWxsIDogdHlwZW9mIGl0ID09PSAnZnVuY3Rpb24nO1xufTsiLCIvLyBjYWxsIHNvbWV0aGluZyBvbiBpdGVyYXRvciBzdGVwIHdpdGggc2FmZSBjbG9zaW5nIG9uIGVycm9yXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLyQuYW4tb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0ZXJhdG9yLCBmbiwgdmFsdWUsIGVudHJpZXMpe1xuICB0cnkge1xuICAgIHJldHVybiBlbnRyaWVzID8gZm4oYW5PYmplY3QodmFsdWUpWzBdLCB2YWx1ZVsxXSkgOiBmbih2YWx1ZSk7XG4gIC8vIDcuNC42IEl0ZXJhdG9yQ2xvc2UoaXRlcmF0b3IsIGNvbXBsZXRpb24pXG4gIH0gY2F0Y2goZSl7XG4gICAgdmFyIHJldCA9IGl0ZXJhdG9yWydyZXR1cm4nXTtcbiAgICBpZihyZXQgIT09IHVuZGVmaW5lZClhbk9iamVjdChyZXQuY2FsbChpdGVyYXRvcikpO1xuICAgIHRocm93IGU7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBkZXNjcmlwdG9yICAgICA9IHJlcXVpcmUoJy4vJC5wcm9wZXJ0eS1kZXNjJylcbiAgLCBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vJC5zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcblxuLy8gMjUuMS4yLjEuMSAlSXRlcmF0b3JQcm90b3R5cGUlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vJC5oaWRlJykoSXRlcmF0b3JQcm90b3R5cGUsIHJlcXVpcmUoJy4vJC53a3MnKSgnaXRlcmF0b3InKSwgZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXM7IH0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KXtcbiAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gJC5jcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUsIHtuZXh0OiBkZXNjcmlwdG9yKDEsIG5leHQpfSk7XG4gIHNldFRvU3RyaW5nVGFnKENvbnN0cnVjdG9yLCBOQU1FICsgJyBJdGVyYXRvcicpO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgTElCUkFSWSAgICAgICAgPSByZXF1aXJlKCcuLyQubGlicmFyeScpXG4gICwgJGV4cG9ydCAgICAgICAgPSByZXF1aXJlKCcuLyQuZXhwb3J0JylcbiAgLCByZWRlZmluZSAgICAgICA9IHJlcXVpcmUoJy4vJC5yZWRlZmluZScpXG4gICwgaGlkZSAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuaGlkZScpXG4gICwgaGFzICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuaGFzJylcbiAgLCBJdGVyYXRvcnMgICAgICA9IHJlcXVpcmUoJy4vJC5pdGVyYXRvcnMnKVxuICAsICRpdGVyQ3JlYXRlICAgID0gcmVxdWlyZSgnLi8kLml0ZXItY3JlYXRlJylcbiAgLCBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vJC5zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgZ2V0UHJvdG8gICAgICAgPSByZXF1aXJlKCcuLyQnKS5nZXRQcm90b1xuICAsIElURVJBVE9SICAgICAgID0gcmVxdWlyZSgnLi8kLndrcycpKCdpdGVyYXRvcicpXG4gICwgQlVHR1kgICAgICAgICAgPSAhKFtdLmtleXMgJiYgJ25leHQnIGluIFtdLmtleXMoKSkgLy8gU2FmYXJpIGhhcyBidWdneSBpdGVyYXRvcnMgdy9vIGBuZXh0YFxuICAsIEZGX0lURVJBVE9SICAgID0gJ0BAaXRlcmF0b3InXG4gICwgS0VZUyAgICAgICAgICAgPSAna2V5cydcbiAgLCBWQUxVRVMgICAgICAgICA9ICd2YWx1ZXMnO1xuXG52YXIgcmV0dXJuVGhpcyA9IGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzOyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKEJhc2UsIE5BTUUsIENvbnN0cnVjdG9yLCBuZXh0LCBERUZBVUxULCBJU19TRVQsIEZPUkNFRCl7XG4gICRpdGVyQ3JlYXRlKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KTtcbiAgdmFyIGdldE1ldGhvZCA9IGZ1bmN0aW9uKGtpbmQpe1xuICAgIGlmKCFCVUdHWSAmJiBraW5kIGluIHByb3RvKXJldHVybiBwcm90b1traW5kXTtcbiAgICBzd2l0Y2goa2luZCl7XG4gICAgICBjYXNlIEtFWVM6IHJldHVybiBmdW5jdGlvbiBrZXlzKCl7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgICBjYXNlIFZBTFVFUzogcmV0dXJuIGZ1bmN0aW9uIHZhbHVlcygpeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgIH0gcmV0dXJuIGZ1bmN0aW9uIGVudHJpZXMoKXsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgfTtcbiAgdmFyIFRBRyAgICAgICAgPSBOQU1FICsgJyBJdGVyYXRvcidcbiAgICAsIERFRl9WQUxVRVMgPSBERUZBVUxUID09IFZBTFVFU1xuICAgICwgVkFMVUVTX0JVRyA9IGZhbHNlXG4gICAgLCBwcm90byAgICAgID0gQmFzZS5wcm90b3R5cGVcbiAgICAsICRuYXRpdmUgICAgPSBwcm90b1tJVEVSQVRPUl0gfHwgcHJvdG9bRkZfSVRFUkFUT1JdIHx8IERFRkFVTFQgJiYgcHJvdG9bREVGQVVMVF1cbiAgICAsICRkZWZhdWx0ICAgPSAkbmF0aXZlIHx8IGdldE1ldGhvZChERUZBVUxUKVxuICAgICwgbWV0aG9kcywga2V5O1xuICAvLyBGaXggbmF0aXZlXG4gIGlmKCRuYXRpdmUpe1xuICAgIHZhciBJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvKCRkZWZhdWx0LmNhbGwobmV3IEJhc2UpKTtcbiAgICAvLyBTZXQgQEB0b1N0cmluZ1RhZyB0byBuYXRpdmUgaXRlcmF0b3JzXG4gICAgc2V0VG9TdHJpbmdUYWcoSXRlcmF0b3JQcm90b3R5cGUsIFRBRywgdHJ1ZSk7XG4gICAgLy8gRkYgZml4XG4gICAgaWYoIUxJQlJBUlkgJiYgaGFzKHByb3RvLCBGRl9JVEVSQVRPUikpaGlkZShJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IsIHJldHVyblRoaXMpO1xuICAgIC8vIGZpeCBBcnJheSN7dmFsdWVzLCBAQGl0ZXJhdG9yfS5uYW1lIGluIFY4IC8gRkZcbiAgICBpZihERUZfVkFMVUVTICYmICRuYXRpdmUubmFtZSAhPT0gVkFMVUVTKXtcbiAgICAgIFZBTFVFU19CVUcgPSB0cnVlO1xuICAgICAgJGRlZmF1bHQgPSBmdW5jdGlvbiB2YWx1ZXMoKXsgcmV0dXJuICRuYXRpdmUuY2FsbCh0aGlzKTsgfTtcbiAgICB9XG4gIH1cbiAgLy8gRGVmaW5lIGl0ZXJhdG9yXG4gIGlmKCghTElCUkFSWSB8fCBGT1JDRUQpICYmIChCVUdHWSB8fCBWQUxVRVNfQlVHIHx8ICFwcm90b1tJVEVSQVRPUl0pKXtcbiAgICBoaWRlKHByb3RvLCBJVEVSQVRPUiwgJGRlZmF1bHQpO1xuICB9XG4gIC8vIFBsdWcgZm9yIGxpYnJhcnlcbiAgSXRlcmF0b3JzW05BTUVdID0gJGRlZmF1bHQ7XG4gIEl0ZXJhdG9yc1tUQUddICA9IHJldHVyblRoaXM7XG4gIGlmKERFRkFVTFQpe1xuICAgIG1ldGhvZHMgPSB7XG4gICAgICB2YWx1ZXM6ICBERUZfVkFMVUVTICA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKFZBTFVFUyksXG4gICAgICBrZXlzOiAgICBJU19TRVQgICAgICA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKEtFWVMpLFxuICAgICAgZW50cmllczogIURFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZCgnZW50cmllcycpXG4gICAgfTtcbiAgICBpZihGT1JDRUQpZm9yKGtleSBpbiBtZXRob2RzKXtcbiAgICAgIGlmKCEoa2V5IGluIHByb3RvKSlyZWRlZmluZShwcm90bywga2V5LCBtZXRob2RzW2tleV0pO1xuICAgIH0gZWxzZSAkZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIChCVUdHWSB8fCBWQUxVRVNfQlVHKSwgTkFNRSwgbWV0aG9kcyk7XG4gIH1cbiAgcmV0dXJuIG1ldGhvZHM7XG59OyIsInZhciBJVEVSQVRPUiAgICAgPSByZXF1aXJlKCcuLyQud2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBTQUZFX0NMT1NJTkcgPSBmYWxzZTtcblxudHJ5IHtcbiAgdmFyIHJpdGVyID0gWzddW0lURVJBVE9SXSgpO1xuICByaXRlclsncmV0dXJuJ10gPSBmdW5jdGlvbigpeyBTQUZFX0NMT1NJTkcgPSB0cnVlOyB9O1xuICBBcnJheS5mcm9tKHJpdGVyLCBmdW5jdGlvbigpeyB0aHJvdyAyOyB9KTtcbn0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihleGVjLCBza2lwQ2xvc2luZyl7XG4gIGlmKCFza2lwQ2xvc2luZyAmJiAhU0FGRV9DTE9TSU5HKXJldHVybiBmYWxzZTtcbiAgdmFyIHNhZmUgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICB2YXIgYXJyICA9IFs3XVxuICAgICAgLCBpdGVyID0gYXJyW0lURVJBVE9SXSgpO1xuICAgIGl0ZXIubmV4dCA9IGZ1bmN0aW9uKCl7IHJldHVybiB7ZG9uZTogc2FmZSA9IHRydWV9OyB9O1xuICAgIGFycltJVEVSQVRPUl0gPSBmdW5jdGlvbigpeyByZXR1cm4gaXRlcjsgfTtcbiAgICBleGVjKGFycik7XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbiAgcmV0dXJuIHNhZmU7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZG9uZSwgdmFsdWUpe1xuICByZXR1cm4ge3ZhbHVlOiB2YWx1ZSwgZG9uZTogISFkb25lfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSB7fTsiLCJ2YXIgJE9iamVjdCA9IE9iamVjdDtcbm1vZHVsZS5leHBvcnRzID0ge1xuICBjcmVhdGU6ICAgICAkT2JqZWN0LmNyZWF0ZSxcbiAgZ2V0UHJvdG86ICAgJE9iamVjdC5nZXRQcm90b3R5cGVPZixcbiAgaXNFbnVtOiAgICAge30ucHJvcGVydHlJc0VudW1lcmFibGUsXG4gIGdldERlc2M6ICAgICRPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLFxuICBzZXREZXNjOiAgICAkT2JqZWN0LmRlZmluZVByb3BlcnR5LFxuICBzZXREZXNjczogICAkT2JqZWN0LmRlZmluZVByb3BlcnRpZXMsXG4gIGdldEtleXM6ICAgICRPYmplY3Qua2V5cyxcbiAgZ2V0TmFtZXM6ICAgJE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzLFxuICBnZXRTeW1ib2xzOiAkT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyxcbiAgZWFjaDogICAgICAgW10uZm9yRWFjaFxufTsiLCJ2YXIgJCAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCB0b0lPYmplY3QgPSByZXF1aXJlKCcuLyQudG8taW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmplY3QsIGVsKXtcbiAgdmFyIE8gICAgICA9IHRvSU9iamVjdChvYmplY3QpXG4gICAgLCBrZXlzICAgPSAkLmdldEtleXMoTylcbiAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXG4gICAgLCBpbmRleCAgPSAwXG4gICAgLCBrZXk7XG4gIHdoaWxlKGxlbmd0aCA+IGluZGV4KWlmKE9ba2V5ID0ga2V5c1tpbmRleCsrXV0gPT09IGVsKXJldHVybiBrZXk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gdHJ1ZTsiLCJ2YXIgZ2xvYmFsICAgID0gcmVxdWlyZSgnLi8kLmdsb2JhbCcpXG4gICwgbWFjcm90YXNrID0gcmVxdWlyZSgnLi8kLnRhc2snKS5zZXRcbiAgLCBPYnNlcnZlciAgPSBnbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBnbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlclxuICAsIHByb2Nlc3MgICA9IGdsb2JhbC5wcm9jZXNzXG4gICwgUHJvbWlzZSAgID0gZ2xvYmFsLlByb21pc2VcbiAgLCBpc05vZGUgICAgPSByZXF1aXJlKCcuLyQuY29mJykocHJvY2VzcykgPT0gJ3Byb2Nlc3MnXG4gICwgaGVhZCwgbGFzdCwgbm90aWZ5O1xuXG52YXIgZmx1c2ggPSBmdW5jdGlvbigpe1xuICB2YXIgcGFyZW50LCBkb21haW4sIGZuO1xuICBpZihpc05vZGUgJiYgKHBhcmVudCA9IHByb2Nlc3MuZG9tYWluKSl7XG4gICAgcHJvY2Vzcy5kb21haW4gPSBudWxsO1xuICAgIHBhcmVudC5leGl0KCk7XG4gIH1cbiAgd2hpbGUoaGVhZCl7XG4gICAgZG9tYWluID0gaGVhZC5kb21haW47XG4gICAgZm4gICAgID0gaGVhZC5mbjtcbiAgICBpZihkb21haW4pZG9tYWluLmVudGVyKCk7XG4gICAgZm4oKTsgLy8gPC0gY3VycmVudGx5IHdlIHVzZSBpdCBvbmx5IGZvciBQcm9taXNlIC0gdHJ5IC8gY2F0Y2ggbm90IHJlcXVpcmVkXG4gICAgaWYoZG9tYWluKWRvbWFpbi5leGl0KCk7XG4gICAgaGVhZCA9IGhlYWQubmV4dDtcbiAgfSBsYXN0ID0gdW5kZWZpbmVkO1xuICBpZihwYXJlbnQpcGFyZW50LmVudGVyKCk7XG59O1xuXG4vLyBOb2RlLmpzXG5pZihpc05vZGUpe1xuICBub3RpZnkgPSBmdW5jdGlvbigpe1xuICAgIHByb2Nlc3MubmV4dFRpY2soZmx1c2gpO1xuICB9O1xuLy8gYnJvd3NlcnMgd2l0aCBNdXRhdGlvbk9ic2VydmVyXG59IGVsc2UgaWYoT2JzZXJ2ZXIpe1xuICB2YXIgdG9nZ2xlID0gMVxuICAgICwgbm9kZSAgID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuICBuZXcgT2JzZXJ2ZXIoZmx1c2gpLm9ic2VydmUobm9kZSwge2NoYXJhY3RlckRhdGE6IHRydWV9KTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgbm90aWZ5ID0gZnVuY3Rpb24oKXtcbiAgICBub2RlLmRhdGEgPSB0b2dnbGUgPSAtdG9nZ2xlO1xuICB9O1xuLy8gZW52aXJvbm1lbnRzIHdpdGggbWF5YmUgbm9uLWNvbXBsZXRlbHkgY29ycmVjdCwgYnV0IGV4aXN0ZW50IFByb21pc2Vcbn0gZWxzZSBpZihQcm9taXNlICYmIFByb21pc2UucmVzb2x2ZSl7XG4gIG5vdGlmeSA9IGZ1bmN0aW9uKCl7XG4gICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbihmbHVzaCk7XG4gIH07XG4vLyBmb3Igb3RoZXIgZW52aXJvbm1lbnRzIC0gbWFjcm90YXNrIGJhc2VkIG9uOlxuLy8gLSBzZXRJbW1lZGlhdGVcbi8vIC0gTWVzc2FnZUNoYW5uZWxcbi8vIC0gd2luZG93LnBvc3RNZXNzYWdcbi8vIC0gb25yZWFkeXN0YXRlY2hhbmdlXG4vLyAtIHNldFRpbWVvdXRcbn0gZWxzZSB7XG4gIG5vdGlmeSA9IGZ1bmN0aW9uKCl7XG4gICAgLy8gc3RyYW5nZSBJRSArIHdlYnBhY2sgZGV2IHNlcnZlciBidWcgLSB1c2UgLmNhbGwoZ2xvYmFsKVxuICAgIG1hY3JvdGFzay5jYWxsKGdsb2JhbCwgZmx1c2gpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGFzYXAoZm4pe1xuICB2YXIgdGFzayA9IHtmbjogZm4sIG5leHQ6IHVuZGVmaW5lZCwgZG9tYWluOiBpc05vZGUgJiYgcHJvY2Vzcy5kb21haW59O1xuICBpZihsYXN0KWxhc3QubmV4dCA9IHRhc2s7XG4gIGlmKCFoZWFkKXtcbiAgICBoZWFkID0gdGFzaztcbiAgICBub3RpZnkoKTtcbiAgfSBsYXN0ID0gdGFzaztcbn07IiwiLy8gMTkuMS4yLjEgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHNvdXJjZSwgLi4uKVxudmFyICQgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCB0b09iamVjdCA9IHJlcXVpcmUoJy4vJC50by1vYmplY3QnKVxuICAsIElPYmplY3QgID0gcmVxdWlyZSgnLi8kLmlvYmplY3QnKTtcblxuLy8gc2hvdWxkIHdvcmsgd2l0aCBzeW1ib2xzIGFuZCBzaG91bGQgaGF2ZSBkZXRlcm1pbmlzdGljIHByb3BlcnR5IG9yZGVyIChWOCBidWcpXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vJC5mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHZhciBhID0gT2JqZWN0LmFzc2lnblxuICAgICwgQSA9IHt9XG4gICAgLCBCID0ge31cbiAgICAsIFMgPSBTeW1ib2woKVxuICAgICwgSyA9ICdhYmNkZWZnaGlqa2xtbm9wcXJzdCc7XG4gIEFbU10gPSA3O1xuICBLLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uKGspeyBCW2tdID0gazsgfSk7XG4gIHJldHVybiBhKHt9LCBBKVtTXSAhPSA3IHx8IE9iamVjdC5rZXlzKGEoe30sIEIpKS5qb2luKCcnKSAhPSBLO1xufSkgPyBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0LCBzb3VyY2UpeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gIHZhciBUICAgICA9IHRvT2JqZWN0KHRhcmdldClcbiAgICAsICQkICAgID0gYXJndW1lbnRzXG4gICAgLCAkJGxlbiA9ICQkLmxlbmd0aFxuICAgICwgaW5kZXggPSAxXG4gICAgLCBnZXRLZXlzICAgID0gJC5nZXRLZXlzXG4gICAgLCBnZXRTeW1ib2xzID0gJC5nZXRTeW1ib2xzXG4gICAgLCBpc0VudW0gICAgID0gJC5pc0VudW07XG4gIHdoaWxlKCQkbGVuID4gaW5kZXgpe1xuICAgIHZhciBTICAgICAgPSBJT2JqZWN0KCQkW2luZGV4KytdKVxuICAgICAgLCBrZXlzICAgPSBnZXRTeW1ib2xzID8gZ2V0S2V5cyhTKS5jb25jYXQoZ2V0U3ltYm9scyhTKSkgOiBnZXRLZXlzKFMpXG4gICAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXG4gICAgICAsIGogICAgICA9IDBcbiAgICAgICwga2V5O1xuICAgIHdoaWxlKGxlbmd0aCA+IGopaWYoaXNFbnVtLmNhbGwoUywga2V5ID0ga2V5c1tqKytdKSlUW2tleV0gPSBTW2tleV07XG4gIH1cbiAgcmV0dXJuIFQ7XG59IDogT2JqZWN0LmFzc2lnbjsiLCIvLyBtb3N0IE9iamVjdCBtZXRob2RzIGJ5IEVTNiBzaG91bGQgYWNjZXB0IHByaW1pdGl2ZXNcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi8kLmV4cG9ydCcpXG4gICwgY29yZSAgICA9IHJlcXVpcmUoJy4vJC5jb3JlJylcbiAgLCBmYWlscyAgID0gcmVxdWlyZSgnLi8kLmZhaWxzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKEtFWSwgZXhlYyl7XG4gIHZhciBmbiAgPSAoY29yZS5PYmplY3QgfHwge30pW0tFWV0gfHwgT2JqZWN0W0tFWV1cbiAgICAsIGV4cCA9IHt9O1xuICBleHBbS0VZXSA9IGV4ZWMoZm4pO1xuICAkZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqIGZhaWxzKGZ1bmN0aW9uKCl7IGZuKDEpOyB9KSwgJ09iamVjdCcsIGV4cCk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYml0bWFwLCB2YWx1ZSl7XG4gIHJldHVybiB7XG4gICAgZW51bWVyYWJsZSAgOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZSAgICA6ICEoYml0bWFwICYgNCksXG4gICAgdmFsdWUgICAgICAgOiB2YWx1ZVxuICB9O1xufTsiLCJ2YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuLyQucmVkZWZpbmUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGFyZ2V0LCBzcmMpe1xuICBmb3IodmFyIGtleSBpbiBzcmMpcmVkZWZpbmUodGFyZ2V0LCBrZXksIHNyY1trZXldKTtcbiAgcmV0dXJuIHRhcmdldDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLyQuaGlkZScpOyIsIi8vIDcuMi45IFNhbWVWYWx1ZSh4LCB5KVxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuaXMgfHwgZnVuY3Rpb24gaXMoeCwgeSl7XG4gIHJldHVybiB4ID09PSB5ID8geCAhPT0gMCB8fCAxIC8geCA9PT0gMSAvIHkgOiB4ICE9IHggJiYgeSAhPSB5O1xufTsiLCIvLyBXb3JrcyB3aXRoIF9fcHJvdG9fXyBvbmx5LiBPbGQgdjggY2FuJ3Qgd29yayB3aXRoIG51bGwgcHJvdG8gb2JqZWN0cy5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG52YXIgZ2V0RGVzYyAgPSByZXF1aXJlKCcuLyQnKS5nZXREZXNjXG4gICwgaXNPYmplY3QgPSByZXF1aXJlKCcuLyQuaXMtb2JqZWN0JylcbiAgLCBhbk9iamVjdCA9IHJlcXVpcmUoJy4vJC5hbi1vYmplY3QnKTtcbnZhciBjaGVjayA9IGZ1bmN0aW9uKE8sIHByb3RvKXtcbiAgYW5PYmplY3QoTyk7XG4gIGlmKCFpc09iamVjdChwcm90bykgJiYgcHJvdG8gIT09IG51bGwpdGhyb3cgVHlwZUVycm9yKHByb3RvICsgXCI6IGNhbid0IHNldCBhcyBwcm90b3R5cGUhXCIpO1xufTtcbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZXQ6IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCAoJ19fcHJvdG9fXycgaW4ge30gPyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgZnVuY3Rpb24odGVzdCwgYnVnZ3ksIHNldCl7XG4gICAgICB0cnkge1xuICAgICAgICBzZXQgPSByZXF1aXJlKCcuLyQuY3R4JykoRnVuY3Rpb24uY2FsbCwgZ2V0RGVzYyhPYmplY3QucHJvdG90eXBlLCAnX19wcm90b19fJykuc2V0LCAyKTtcbiAgICAgICAgc2V0KHRlc3QsIFtdKTtcbiAgICAgICAgYnVnZ3kgPSAhKHRlc3QgaW5zdGFuY2VvZiBBcnJheSk7XG4gICAgICB9IGNhdGNoKGUpeyBidWdneSA9IHRydWU7IH1cbiAgICAgIHJldHVybiBmdW5jdGlvbiBzZXRQcm90b3R5cGVPZihPLCBwcm90byl7XG4gICAgICAgIGNoZWNrKE8sIHByb3RvKTtcbiAgICAgICAgaWYoYnVnZ3kpTy5fX3Byb3RvX18gPSBwcm90bztcbiAgICAgICAgZWxzZSBzZXQoTywgcHJvdG8pO1xuICAgICAgICByZXR1cm4gTztcbiAgICAgIH07XG4gICAgfSh7fSwgZmFsc2UpIDogdW5kZWZpbmVkKSxcbiAgY2hlY2s6IGNoZWNrXG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBjb3JlICAgICAgICA9IHJlcXVpcmUoJy4vJC5jb3JlJylcbiAgLCAkICAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuLyQuZGVzY3JpcHRvcnMnKVxuICAsIFNQRUNJRVMgICAgID0gcmVxdWlyZSgnLi8kLndrcycpKCdzcGVjaWVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oS0VZKXtcbiAgdmFyIEMgPSBjb3JlW0tFWV07XG4gIGlmKERFU0NSSVBUT1JTICYmIEMgJiYgIUNbU1BFQ0lFU10pJC5zZXREZXNjKEMsIFNQRUNJRVMsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfVxuICB9KTtcbn07IiwidmFyIGRlZiA9IHJlcXVpcmUoJy4vJCcpLnNldERlc2NcbiAgLCBoYXMgPSByZXF1aXJlKCcuLyQuaGFzJylcbiAgLCBUQUcgPSByZXF1aXJlKCcuLyQud2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIHRhZywgc3RhdCl7XG4gIGlmKGl0ICYmICFoYXMoaXQgPSBzdGF0ID8gaXQgOiBpdC5wcm90b3R5cGUsIFRBRykpZGVmKGl0LCBUQUcsIHtjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiB0YWd9KTtcbn07IiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKVxuICAsIFNIQVJFRCA9ICdfX2NvcmUtanNfc2hhcmVkX18nXG4gICwgc3RvcmUgID0gZ2xvYmFsW1NIQVJFRF0gfHwgKGdsb2JhbFtTSEFSRURdID0ge30pO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHt9KTtcbn07IiwiLy8gNy4zLjIwIFNwZWNpZXNDb25zdHJ1Y3RvcihPLCBkZWZhdWx0Q29uc3RydWN0b3IpXG52YXIgYW5PYmplY3QgID0gcmVxdWlyZSgnLi8kLmFuLW9iamVjdCcpXG4gICwgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi8kLmEtZnVuY3Rpb24nKVxuICAsIFNQRUNJRVMgICA9IHJlcXVpcmUoJy4vJC53a3MnKSgnc3BlY2llcycpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihPLCBEKXtcbiAgdmFyIEMgPSBhbk9iamVjdChPKS5jb25zdHJ1Y3RvciwgUztcbiAgcmV0dXJuIEMgPT09IHVuZGVmaW5lZCB8fCAoUyA9IGFuT2JqZWN0KEMpW1NQRUNJRVNdKSA9PSB1bmRlZmluZWQgPyBEIDogYUZ1bmN0aW9uKFMpO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBDb25zdHJ1Y3RvciwgbmFtZSl7XG4gIGlmKCEoaXQgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpdGhyb3cgVHlwZUVycm9yKG5hbWUgKyBcIjogdXNlIHRoZSAnbmV3JyBvcGVyYXRvciFcIik7XG4gIHJldHVybiBpdDtcbn07IiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vJC50by1pbnRlZ2VyJylcbiAgLCBkZWZpbmVkICAgPSByZXF1aXJlKCcuLyQuZGVmaW5lZCcpO1xuLy8gdHJ1ZSAgLT4gU3RyaW5nI2F0XG4vLyBmYWxzZSAtPiBTdHJpbmcjY29kZVBvaW50QXRcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oVE9fU1RSSU5HKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKHRoYXQsIHBvcyl7XG4gICAgdmFyIHMgPSBTdHJpbmcoZGVmaW5lZCh0aGF0KSlcbiAgICAgICwgaSA9IHRvSW50ZWdlcihwb3MpXG4gICAgICAsIGwgPSBzLmxlbmd0aFxuICAgICAgLCBhLCBiO1xuICAgIGlmKGkgPCAwIHx8IGkgPj0gbClyZXR1cm4gVE9fU1RSSU5HID8gJycgOiB1bmRlZmluZWQ7XG4gICAgYSA9IHMuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4gYSA8IDB4ZDgwMCB8fCBhID4gMHhkYmZmIHx8IGkgKyAxID09PSBsIHx8IChiID0gcy5jaGFyQ29kZUF0KGkgKyAxKSkgPCAweGRjMDAgfHwgYiA+IDB4ZGZmZlxuICAgICAgPyBUT19TVFJJTkcgPyBzLmNoYXJBdChpKSA6IGFcbiAgICAgIDogVE9fU1RSSU5HID8gcy5zbGljZShpLCBpICsgMikgOiAoYSAtIDB4ZDgwMCA8PCAxMCkgKyAoYiAtIDB4ZGMwMCkgKyAweDEwMDAwO1xuICB9O1xufTsiLCJ2YXIgY3R4ICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmN0eCcpXG4gICwgaW52b2tlICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmludm9rZScpXG4gICwgaHRtbCAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmh0bWwnKVxuICAsIGNlbCAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5kb20tY3JlYXRlJylcbiAgLCBnbG9iYWwgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuZ2xvYmFsJylcbiAgLCBwcm9jZXNzICAgICAgICAgICAgPSBnbG9iYWwucHJvY2Vzc1xuICAsIHNldFRhc2sgICAgICAgICAgICA9IGdsb2JhbC5zZXRJbW1lZGlhdGVcbiAgLCBjbGVhclRhc2sgICAgICAgICAgPSBnbG9iYWwuY2xlYXJJbW1lZGlhdGVcbiAgLCBNZXNzYWdlQ2hhbm5lbCAgICAgPSBnbG9iYWwuTWVzc2FnZUNoYW5uZWxcbiAgLCBjb3VudGVyICAgICAgICAgICAgPSAwXG4gICwgcXVldWUgICAgICAgICAgICAgID0ge31cbiAgLCBPTlJFQURZU1RBVEVDSEFOR0UgPSAnb25yZWFkeXN0YXRlY2hhbmdlJ1xuICAsIGRlZmVyLCBjaGFubmVsLCBwb3J0O1xudmFyIHJ1biA9IGZ1bmN0aW9uKCl7XG4gIHZhciBpZCA9ICt0aGlzO1xuICBpZihxdWV1ZS5oYXNPd25Qcm9wZXJ0eShpZCkpe1xuICAgIHZhciBmbiA9IHF1ZXVlW2lkXTtcbiAgICBkZWxldGUgcXVldWVbaWRdO1xuICAgIGZuKCk7XG4gIH1cbn07XG52YXIgbGlzdG5lciA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgcnVuLmNhbGwoZXZlbnQuZGF0YSk7XG59O1xuLy8gTm9kZS5qcyAwLjkrICYgSUUxMCsgaGFzIHNldEltbWVkaWF0ZSwgb3RoZXJ3aXNlOlxuaWYoIXNldFRhc2sgfHwgIWNsZWFyVGFzayl7XG4gIHNldFRhc2sgPSBmdW5jdGlvbiBzZXRJbW1lZGlhdGUoZm4pe1xuICAgIHZhciBhcmdzID0gW10sIGkgPSAxO1xuICAgIHdoaWxlKGFyZ3VtZW50cy5sZW5ndGggPiBpKWFyZ3MucHVzaChhcmd1bWVudHNbaSsrXSk7XG4gICAgcXVldWVbKytjb3VudGVyXSA9IGZ1bmN0aW9uKCl7XG4gICAgICBpbnZva2UodHlwZW9mIGZuID09ICdmdW5jdGlvbicgPyBmbiA6IEZ1bmN0aW9uKGZuKSwgYXJncyk7XG4gICAgfTtcbiAgICBkZWZlcihjb3VudGVyKTtcbiAgICByZXR1cm4gY291bnRlcjtcbiAgfTtcbiAgY2xlYXJUYXNrID0gZnVuY3Rpb24gY2xlYXJJbW1lZGlhdGUoaWQpe1xuICAgIGRlbGV0ZSBxdWV1ZVtpZF07XG4gIH07XG4gIC8vIE5vZGUuanMgMC44LVxuICBpZihyZXF1aXJlKCcuLyQuY29mJykocHJvY2VzcykgPT0gJ3Byb2Nlc3MnKXtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soY3R4KHJ1biwgaWQsIDEpKTtcbiAgICB9O1xuICAvLyBCcm93c2VycyB3aXRoIE1lc3NhZ2VDaGFubmVsLCBpbmNsdWRlcyBXZWJXb3JrZXJzXG4gIH0gZWxzZSBpZihNZXNzYWdlQ2hhbm5lbCl7XG4gICAgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbDtcbiAgICBwb3J0ICAgID0gY2hhbm5lbC5wb3J0MjtcbiAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGxpc3RuZXI7XG4gICAgZGVmZXIgPSBjdHgocG9ydC5wb3N0TWVzc2FnZSwgcG9ydCwgMSk7XG4gIC8vIEJyb3dzZXJzIHdpdGggcG9zdE1lc3NhZ2UsIHNraXAgV2ViV29ya2Vyc1xuICAvLyBJRTggaGFzIHBvc3RNZXNzYWdlLCBidXQgaXQncyBzeW5jICYgdHlwZW9mIGl0cyBwb3N0TWVzc2FnZSBpcyAnb2JqZWN0J1xuICB9IGVsc2UgaWYoZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIgJiYgdHlwZW9mIHBvc3RNZXNzYWdlID09ICdmdW5jdGlvbicgJiYgIWdsb2JhbC5pbXBvcnRTY3JpcHRzKXtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShpZCArICcnLCAnKicpO1xuICAgIH07XG4gICAgZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBsaXN0bmVyLCBmYWxzZSk7XG4gIC8vIElFOC1cbiAgfSBlbHNlIGlmKE9OUkVBRFlTVEFURUNIQU5HRSBpbiBjZWwoJ3NjcmlwdCcpKXtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIGh0bWwuYXBwZW5kQ2hpbGQoY2VsKCdzY3JpcHQnKSlbT05SRUFEWVNUQVRFQ0hBTkdFXSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGh0bWwucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgICAgIHJ1bi5jYWxsKGlkKTtcbiAgICAgIH07XG4gICAgfTtcbiAgLy8gUmVzdCBvbGQgYnJvd3NlcnNcbiAgfSBlbHNlIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIHNldFRpbWVvdXQoY3R4KHJ1biwgaWQsIDEpLCAwKTtcbiAgICB9O1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0OiAgIHNldFRhc2ssXG4gIGNsZWFyOiBjbGVhclRhc2tcbn07IiwiLy8gNy4xLjQgVG9JbnRlZ2VyXG52YXIgY2VpbCAgPSBNYXRoLmNlaWxcbiAgLCBmbG9vciA9IE1hdGguZmxvb3I7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGlzTmFOKGl0ID0gK2l0KSA/IDAgOiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XG59OyIsIi8vIHRvIGluZGV4ZWQgb2JqZWN0LCB0b09iamVjdCB3aXRoIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgc3RyaW5nc1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuLyQuaW9iamVjdCcpXG4gICwgZGVmaW5lZCA9IHJlcXVpcmUoJy4vJC5kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIElPYmplY3QoZGVmaW5lZChpdCkpO1xufTsiLCIvLyA3LjEuMTUgVG9MZW5ndGhcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuLyQudG8taW50ZWdlcicpXG4gICwgbWluICAgICAgID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGl0ID4gMCA/IG1pbih0b0ludGVnZXIoaXQpLCAweDFmZmZmZmZmZmZmZmZmKSA6IDA7IC8vIHBvdygyLCA1MykgLSAxID09IDkwMDcxOTkyNTQ3NDA5OTFcbn07IiwiLy8gNy4xLjEzIFRvT2JqZWN0KGFyZ3VtZW50KVxudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuLyQuZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBPYmplY3QoZGVmaW5lZChpdCkpO1xufTsiLCJ2YXIgaWQgPSAwXG4gICwgcHggPSBNYXRoLnJhbmRvbSgpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gJ1N5bWJvbCgnLmNvbmNhdChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5LCAnKV8nLCAoKytpZCArIHB4KS50b1N0cmluZygzNikpO1xufTsiLCJ2YXIgc3RvcmUgID0gcmVxdWlyZSgnLi8kLnNoYXJlZCcpKCd3a3MnKVxuICAsIHVpZCAgICA9IHJlcXVpcmUoJy4vJC51aWQnKVxuICAsIFN5bWJvbCA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKS5TeW1ib2w7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5hbWUpe1xuICByZXR1cm4gc3RvcmVbbmFtZV0gfHwgKHN0b3JlW25hbWVdID1cbiAgICBTeW1ib2wgJiYgU3ltYm9sW25hbWVdIHx8IChTeW1ib2wgfHwgdWlkKSgnU3ltYm9sLicgKyBuYW1lKSk7XG59OyIsInZhciBjbGFzc29mICAgPSByZXF1aXJlKCcuLyQuY2xhc3NvZicpXG4gICwgSVRFUkFUT1IgID0gcmVxdWlyZSgnLi8kLndrcycpKCdpdGVyYXRvcicpXG4gICwgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi8kLml0ZXJhdG9ycycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLyQuY29yZScpLmdldEl0ZXJhdG9yTWV0aG9kID0gZnVuY3Rpb24oaXQpe1xuICBpZihpdCAhPSB1bmRlZmluZWQpcmV0dXJuIGl0W0lURVJBVE9SXVxuICAgIHx8IGl0WydAQGl0ZXJhdG9yJ11cbiAgICB8fCBJdGVyYXRvcnNbY2xhc3NvZihpdCldO1xufTsiLCJ2YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLyQuYW4tb2JqZWN0JylcbiAgLCBnZXQgICAgICA9IHJlcXVpcmUoJy4vY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vJC5jb3JlJykuZ2V0SXRlcmF0b3IgPSBmdW5jdGlvbihpdCl7XG4gIHZhciBpdGVyRm4gPSBnZXQoaXQpO1xuICBpZih0eXBlb2YgaXRlckZuICE9ICdmdW5jdGlvbicpdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgaXRlcmFibGUhJyk7XG4gIHJldHVybiBhbk9iamVjdChpdGVyRm4uY2FsbChpdCkpO1xufTsiLCJ2YXIgY2xhc3NvZiAgID0gcmVxdWlyZSgnLi8kLmNsYXNzb2YnKVxuICAsIElURVJBVE9SICA9IHJlcXVpcmUoJy4vJC53a3MnKSgnaXRlcmF0b3InKVxuICAsIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vJC5pdGVyYXRvcnMnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi8kLmNvcmUnKS5pc0l0ZXJhYmxlID0gZnVuY3Rpb24oaXQpe1xuICB2YXIgTyA9IE9iamVjdChpdCk7XG4gIHJldHVybiBPW0lURVJBVE9SXSAhPT0gdW5kZWZpbmVkXG4gICAgfHwgJ0BAaXRlcmF0b3InIGluIE9cbiAgICB8fCBJdGVyYXRvcnMuaGFzT3duUHJvcGVydHkoY2xhc3NvZihPKSk7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBjdHggICAgICAgICA9IHJlcXVpcmUoJy4vJC5jdHgnKVxuICAsICRleHBvcnQgICAgID0gcmVxdWlyZSgnLi8kLmV4cG9ydCcpXG4gICwgdG9PYmplY3QgICAgPSByZXF1aXJlKCcuLyQudG8tb2JqZWN0JylcbiAgLCBjYWxsICAgICAgICA9IHJlcXVpcmUoJy4vJC5pdGVyLWNhbGwnKVxuICAsIGlzQXJyYXlJdGVyID0gcmVxdWlyZSgnLi8kLmlzLWFycmF5LWl0ZXInKVxuICAsIHRvTGVuZ3RoICAgID0gcmVxdWlyZSgnLi8kLnRvLWxlbmd0aCcpXG4gICwgZ2V0SXRlckZuICAgPSByZXF1aXJlKCcuL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZCcpO1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhcmVxdWlyZSgnLi8kLml0ZXItZGV0ZWN0JykoZnVuY3Rpb24oaXRlcil7IEFycmF5LmZyb20oaXRlcik7IH0pLCAnQXJyYXknLCB7XG4gIC8vIDIyLjEuMi4xIEFycmF5LmZyb20oYXJyYXlMaWtlLCBtYXBmbiA9IHVuZGVmaW5lZCwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgZnJvbTogZnVuY3Rpb24gZnJvbShhcnJheUxpa2UvKiwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQqLyl7XG4gICAgdmFyIE8gICAgICAgPSB0b09iamVjdChhcnJheUxpa2UpXG4gICAgICAsIEMgICAgICAgPSB0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nID8gdGhpcyA6IEFycmF5XG4gICAgICAsICQkICAgICAgPSBhcmd1bWVudHNcbiAgICAgICwgJCRsZW4gICA9ICQkLmxlbmd0aFxuICAgICAgLCBtYXBmbiAgID0gJCRsZW4gPiAxID8gJCRbMV0gOiB1bmRlZmluZWRcbiAgICAgICwgbWFwcGluZyA9IG1hcGZuICE9PSB1bmRlZmluZWRcbiAgICAgICwgaW5kZXggICA9IDBcbiAgICAgICwgaXRlckZuICA9IGdldEl0ZXJGbihPKVxuICAgICAgLCBsZW5ndGgsIHJlc3VsdCwgc3RlcCwgaXRlcmF0b3I7XG4gICAgaWYobWFwcGluZyltYXBmbiA9IGN0eChtYXBmbiwgJCRsZW4gPiAyID8gJCRbMl0gOiB1bmRlZmluZWQsIDIpO1xuICAgIC8vIGlmIG9iamVjdCBpc24ndCBpdGVyYWJsZSBvciBpdCdzIGFycmF5IHdpdGggZGVmYXVsdCBpdGVyYXRvciAtIHVzZSBzaW1wbGUgY2FzZVxuICAgIGlmKGl0ZXJGbiAhPSB1bmRlZmluZWQgJiYgIShDID09IEFycmF5ICYmIGlzQXJyYXlJdGVyKGl0ZXJGbikpKXtcbiAgICAgIGZvcihpdGVyYXRvciA9IGl0ZXJGbi5jYWxsKE8pLCByZXN1bHQgPSBuZXcgQzsgIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lOyBpbmRleCsrKXtcbiAgICAgICAgcmVzdWx0W2luZGV4XSA9IG1hcHBpbmcgPyBjYWxsKGl0ZXJhdG9yLCBtYXBmbiwgW3N0ZXAudmFsdWUsIGluZGV4XSwgdHJ1ZSkgOiBzdGVwLnZhbHVlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgICBmb3IocmVzdWx0ID0gbmV3IEMobGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4Kyspe1xuICAgICAgICByZXN1bHRbaW5kZXhdID0gbWFwcGluZyA/IG1hcGZuKE9baW5kZXhdLCBpbmRleCkgOiBPW2luZGV4XTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVzdWx0Lmxlbmd0aCA9IGluZGV4O1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFkZFRvVW5zY29wYWJsZXMgPSByZXF1aXJlKCcuLyQuYWRkLXRvLXVuc2NvcGFibGVzJylcbiAgLCBzdGVwICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLml0ZXItc3RlcCcpXG4gICwgSXRlcmF0b3JzICAgICAgICA9IHJlcXVpcmUoJy4vJC5pdGVyYXRvcnMnKVxuICAsIHRvSU9iamVjdCAgICAgICAgPSByZXF1aXJlKCcuLyQudG8taW9iamVjdCcpO1xuXG4vLyAyMi4xLjMuNCBBcnJheS5wcm90b3R5cGUuZW50cmllcygpXG4vLyAyMi4xLjMuMTMgQXJyYXkucHJvdG90eXBlLmtleXMoKVxuLy8gMjIuMS4zLjI5IEFycmF5LnByb3RvdHlwZS52YWx1ZXMoKVxuLy8gMjIuMS4zLjMwIEFycmF5LnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vJC5pdGVyLWRlZmluZScpKEFycmF5LCAnQXJyYXknLCBmdW5jdGlvbihpdGVyYXRlZCwga2luZCl7XG4gIHRoaXMuX3QgPSB0b0lPYmplY3QoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgICAgIC8vIG5leHQgaW5kZXhcbiAgdGhpcy5fayA9IGtpbmQ7ICAgICAgICAgICAgICAgIC8vIGtpbmRcbi8vIDIyLjEuNS4yLjEgJUFycmF5SXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxufSwgZnVuY3Rpb24oKXtcbiAgdmFyIE8gICAgID0gdGhpcy5fdFxuICAgICwga2luZCAgPSB0aGlzLl9rXG4gICAgLCBpbmRleCA9IHRoaXMuX2krKztcbiAgaWYoIU8gfHwgaW5kZXggPj0gTy5sZW5ndGgpe1xuICAgIHRoaXMuX3QgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHN0ZXAoMSk7XG4gIH1cbiAgaWYoa2luZCA9PSAna2V5cycgIClyZXR1cm4gc3RlcCgwLCBpbmRleCk7XG4gIGlmKGtpbmQgPT0gJ3ZhbHVlcycpcmV0dXJuIHN0ZXAoMCwgT1tpbmRleF0pO1xuICByZXR1cm4gc3RlcCgwLCBbaW5kZXgsIE9baW5kZXhdXSk7XG59LCAndmFsdWVzJyk7XG5cbi8vIGFyZ3VtZW50c0xpc3RbQEBpdGVyYXRvcl0gaXMgJUFycmF5UHJvdG9fdmFsdWVzJSAoOS40LjQuNiwgOS40LjQuNylcbkl0ZXJhdG9ycy5Bcmd1bWVudHMgPSBJdGVyYXRvcnMuQXJyYXk7XG5cbmFkZFRvVW5zY29wYWJsZXMoJ2tleXMnKTtcbmFkZFRvVW5zY29wYWJsZXMoJ3ZhbHVlcycpO1xuYWRkVG9VbnNjb3BhYmxlcygnZW50cmllcycpOyIsIid1c2Ugc3RyaWN0JztcbnZhciBzdHJvbmcgPSByZXF1aXJlKCcuLyQuY29sbGVjdGlvbi1zdHJvbmcnKTtcblxuLy8gMjMuMSBNYXAgT2JqZWN0c1xucmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24nKSgnTWFwJywgZnVuY3Rpb24oZ2V0KXtcbiAgcmV0dXJuIGZ1bmN0aW9uIE1hcCgpeyByZXR1cm4gZ2V0KHRoaXMsIGFyZ3VtZW50cy5sZW5ndGggPiAwID8gYXJndW1lbnRzWzBdIDogdW5kZWZpbmVkKTsgfTtcbn0sIHtcbiAgLy8gMjMuMS4zLjYgTWFwLnByb3RvdHlwZS5nZXQoa2V5KVxuICBnZXQ6IGZ1bmN0aW9uIGdldChrZXkpe1xuICAgIHZhciBlbnRyeSA9IHN0cm9uZy5nZXRFbnRyeSh0aGlzLCBrZXkpO1xuICAgIHJldHVybiBlbnRyeSAmJiBlbnRyeS52O1xuICB9LFxuICAvLyAyMy4xLjMuOSBNYXAucHJvdG90eXBlLnNldChrZXksIHZhbHVlKVxuICBzZXQ6IGZ1bmN0aW9uIHNldChrZXksIHZhbHVlKXtcbiAgICByZXR1cm4gc3Ryb25nLmRlZih0aGlzLCBrZXkgPT09IDAgPyAwIDoga2V5LCB2YWx1ZSk7XG4gIH1cbn0sIHN0cm9uZywgdHJ1ZSk7IiwiLy8gMjAuMi4yLjIxIE1hdGgubG9nMTAoeClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi8kLmV4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ01hdGgnLCB7XG4gIGxvZzEwOiBmdW5jdGlvbiBsb2cxMCh4KXtcbiAgICByZXR1cm4gTWF0aC5sb2coeCkgLyBNYXRoLkxOMTA7XG4gIH1cbn0pOyIsIi8vIDE5LjEuMy4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYsICdPYmplY3QnLCB7YXNzaWduOiByZXF1aXJlKCcuLyQub2JqZWN0LWFzc2lnbicpfSk7IiwiLy8gMTkuMS4yLjYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKVxudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vJC50by1pb2JqZWN0Jyk7XG5cbnJlcXVpcmUoJy4vJC5vYmplY3Qtc2FwJykoJ2dldE93blByb3BlcnR5RGVzY3JpcHRvcicsIGZ1bmN0aW9uKCRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ipe1xuICByZXR1cm4gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGl0LCBrZXkpe1xuICAgIHJldHVybiAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRvSU9iamVjdChpdCksIGtleSk7XG4gIH07XG59KTsiLCIvLyAxOS4xLjIuMTQgT2JqZWN0LmtleXMoTylcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vJC50by1vYmplY3QnKTtcblxucmVxdWlyZSgnLi8kLm9iamVjdC1zYXAnKSgna2V5cycsIGZ1bmN0aW9uKCRrZXlzKXtcbiAgcmV0dXJuIGZ1bmN0aW9uIGtleXMoaXQpe1xuICAgIHJldHVybiAka2V5cyh0b09iamVjdChpdCkpO1xuICB9O1xufSk7IiwiLy8gMTkuMS4zLjE5IE9iamVjdC5zZXRQcm90b3R5cGVPZihPLCBwcm90bylcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi8kLmV4cG9ydCcpO1xuJGV4cG9ydCgkZXhwb3J0LlMsICdPYmplY3QnLCB7c2V0UHJvdG90eXBlT2Y6IHJlcXVpcmUoJy4vJC5zZXQtcHJvdG8nKS5zZXR9KTsiLG51bGwsIid1c2Ugc3RyaWN0JztcbnZhciAkICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBMSUJSQVJZICAgID0gcmVxdWlyZSgnLi8kLmxpYnJhcnknKVxuICAsIGdsb2JhbCAgICAgPSByZXF1aXJlKCcuLyQuZ2xvYmFsJylcbiAgLCBjdHggICAgICAgID0gcmVxdWlyZSgnLi8kLmN0eCcpXG4gICwgY2xhc3NvZiAgICA9IHJlcXVpcmUoJy4vJC5jbGFzc29mJylcbiAgLCAkZXhwb3J0ICAgID0gcmVxdWlyZSgnLi8kLmV4cG9ydCcpXG4gICwgaXNPYmplY3QgICA9IHJlcXVpcmUoJy4vJC5pcy1vYmplY3QnKVxuICAsIGFuT2JqZWN0ICAgPSByZXF1aXJlKCcuLyQuYW4tb2JqZWN0JylcbiAgLCBhRnVuY3Rpb24gID0gcmVxdWlyZSgnLi8kLmEtZnVuY3Rpb24nKVxuICAsIHN0cmljdE5ldyAgPSByZXF1aXJlKCcuLyQuc3RyaWN0LW5ldycpXG4gICwgZm9yT2YgICAgICA9IHJlcXVpcmUoJy4vJC5mb3Itb2YnKVxuICAsIHNldFByb3RvICAgPSByZXF1aXJlKCcuLyQuc2V0LXByb3RvJykuc2V0XG4gICwgc2FtZSAgICAgICA9IHJlcXVpcmUoJy4vJC5zYW1lLXZhbHVlJylcbiAgLCBTUEVDSUVTICAgID0gcmVxdWlyZSgnLi8kLndrcycpKCdzcGVjaWVzJylcbiAgLCBzcGVjaWVzQ29uc3RydWN0b3IgPSByZXF1aXJlKCcuLyQuc3BlY2llcy1jb25zdHJ1Y3RvcicpXG4gICwgYXNhcCAgICAgICA9IHJlcXVpcmUoJy4vJC5taWNyb3Rhc2snKVxuICAsIFBST01JU0UgICAgPSAnUHJvbWlzZSdcbiAgLCBwcm9jZXNzICAgID0gZ2xvYmFsLnByb2Nlc3NcbiAgLCBpc05vZGUgICAgID0gY2xhc3NvZihwcm9jZXNzKSA9PSAncHJvY2VzcydcbiAgLCBQICAgICAgICAgID0gZ2xvYmFsW1BST01JU0VdXG4gICwgZW1wdHkgICAgICA9IGZ1bmN0aW9uKCl7IC8qIGVtcHR5ICovIH1cbiAgLCBXcmFwcGVyO1xuXG52YXIgdGVzdFJlc29sdmUgPSBmdW5jdGlvbihzdWIpe1xuICB2YXIgdGVzdCA9IG5ldyBQKGVtcHR5KSwgcHJvbWlzZTtcbiAgaWYoc3ViKXRlc3QuY29uc3RydWN0b3IgPSBmdW5jdGlvbihleGVjKXtcbiAgICBleGVjKGVtcHR5LCBlbXB0eSk7XG4gIH07XG4gIChwcm9taXNlID0gUC5yZXNvbHZlKHRlc3QpKVsnY2F0Y2gnXShlbXB0eSk7XG4gIHJldHVybiBwcm9taXNlID09PSB0ZXN0O1xufTtcblxudmFyIFVTRV9OQVRJVkUgPSBmdW5jdGlvbigpe1xuICB2YXIgd29ya3MgPSBmYWxzZTtcbiAgZnVuY3Rpb24gUDIoeCl7XG4gICAgdmFyIHNlbGYgPSBuZXcgUCh4KTtcbiAgICBzZXRQcm90byhzZWxmLCBQMi5wcm90b3R5cGUpO1xuICAgIHJldHVybiBzZWxmO1xuICB9XG4gIHRyeSB7XG4gICAgd29ya3MgPSBQICYmIFAucmVzb2x2ZSAmJiB0ZXN0UmVzb2x2ZSgpO1xuICAgIHNldFByb3RvKFAyLCBQKTtcbiAgICBQMi5wcm90b3R5cGUgPSAkLmNyZWF0ZShQLnByb3RvdHlwZSwge2NvbnN0cnVjdG9yOiB7dmFsdWU6IFAyfX0pO1xuICAgIC8vIGFjdHVhbCBGaXJlZm94IGhhcyBicm9rZW4gc3ViY2xhc3Mgc3VwcG9ydCwgdGVzdCB0aGF0XG4gICAgaWYoIShQMi5yZXNvbHZlKDUpLnRoZW4oZnVuY3Rpb24oKXt9KSBpbnN0YW5jZW9mIFAyKSl7XG4gICAgICB3b3JrcyA9IGZhbHNlO1xuICAgIH1cbiAgICAvLyBhY3R1YWwgVjggYnVnLCBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDE2MlxuICAgIGlmKHdvcmtzICYmIHJlcXVpcmUoJy4vJC5kZXNjcmlwdG9ycycpKXtcbiAgICAgIHZhciB0aGVuYWJsZVRoZW5Hb3R0ZW4gPSBmYWxzZTtcbiAgICAgIFAucmVzb2x2ZSgkLnNldERlc2Moe30sICd0aGVuJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCl7IHRoZW5hYmxlVGhlbkdvdHRlbiA9IHRydWU7IH1cbiAgICAgIH0pKTtcbiAgICAgIHdvcmtzID0gdGhlbmFibGVUaGVuR290dGVuO1xuICAgIH1cbiAgfSBjYXRjaChlKXsgd29ya3MgPSBmYWxzZTsgfVxuICByZXR1cm4gd29ya3M7XG59KCk7XG5cbi8vIGhlbHBlcnNcbnZhciBzYW1lQ29uc3RydWN0b3IgPSBmdW5jdGlvbihhLCBiKXtcbiAgLy8gbGlicmFyeSB3cmFwcGVyIHNwZWNpYWwgY2FzZVxuICBpZihMSUJSQVJZICYmIGEgPT09IFAgJiYgYiA9PT0gV3JhcHBlcilyZXR1cm4gdHJ1ZTtcbiAgcmV0dXJuIHNhbWUoYSwgYik7XG59O1xudmFyIGdldENvbnN0cnVjdG9yID0gZnVuY3Rpb24oQyl7XG4gIHZhciBTID0gYW5PYmplY3QoQylbU1BFQ0lFU107XG4gIHJldHVybiBTICE9IHVuZGVmaW5lZCA/IFMgOiBDO1xufTtcbnZhciBpc1RoZW5hYmxlID0gZnVuY3Rpb24oaXQpe1xuICB2YXIgdGhlbjtcbiAgcmV0dXJuIGlzT2JqZWN0KGl0KSAmJiB0eXBlb2YgKHRoZW4gPSBpdC50aGVuKSA9PSAnZnVuY3Rpb24nID8gdGhlbiA6IGZhbHNlO1xufTtcbnZhciBQcm9taXNlQ2FwYWJpbGl0eSA9IGZ1bmN0aW9uKEMpe1xuICB2YXIgcmVzb2x2ZSwgcmVqZWN0O1xuICB0aGlzLnByb21pc2UgPSBuZXcgQyhmdW5jdGlvbigkJHJlc29sdmUsICQkcmVqZWN0KXtcbiAgICBpZihyZXNvbHZlICE9PSB1bmRlZmluZWQgfHwgcmVqZWN0ICE9PSB1bmRlZmluZWQpdGhyb3cgVHlwZUVycm9yKCdCYWQgUHJvbWlzZSBjb25zdHJ1Y3RvcicpO1xuICAgIHJlc29sdmUgPSAkJHJlc29sdmU7XG4gICAgcmVqZWN0ICA9ICQkcmVqZWN0O1xuICB9KTtcbiAgdGhpcy5yZXNvbHZlID0gYUZ1bmN0aW9uKHJlc29sdmUpLFxuICB0aGlzLnJlamVjdCAgPSBhRnVuY3Rpb24ocmVqZWN0KVxufTtcbnZhciBwZXJmb3JtID0gZnVuY3Rpb24oZXhlYyl7XG4gIHRyeSB7XG4gICAgZXhlYygpO1xuICB9IGNhdGNoKGUpe1xuICAgIHJldHVybiB7ZXJyb3I6IGV9O1xuICB9XG59O1xudmFyIG5vdGlmeSA9IGZ1bmN0aW9uKHJlY29yZCwgaXNSZWplY3Qpe1xuICBpZihyZWNvcmQubilyZXR1cm47XG4gIHJlY29yZC5uID0gdHJ1ZTtcbiAgdmFyIGNoYWluID0gcmVjb3JkLmM7XG4gIGFzYXAoZnVuY3Rpb24oKXtcbiAgICB2YXIgdmFsdWUgPSByZWNvcmQudlxuICAgICAgLCBvayAgICA9IHJlY29yZC5zID09IDFcbiAgICAgICwgaSAgICAgPSAwO1xuICAgIHZhciBydW4gPSBmdW5jdGlvbihyZWFjdGlvbil7XG4gICAgICB2YXIgaGFuZGxlciA9IG9rID8gcmVhY3Rpb24ub2sgOiByZWFjdGlvbi5mYWlsXG4gICAgICAgICwgcmVzb2x2ZSA9IHJlYWN0aW9uLnJlc29sdmVcbiAgICAgICAgLCByZWplY3QgID0gcmVhY3Rpb24ucmVqZWN0XG4gICAgICAgICwgcmVzdWx0LCB0aGVuO1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYoaGFuZGxlcil7XG4gICAgICAgICAgaWYoIW9rKXJlY29yZC5oID0gdHJ1ZTtcbiAgICAgICAgICByZXN1bHQgPSBoYW5kbGVyID09PSB0cnVlID8gdmFsdWUgOiBoYW5kbGVyKHZhbHVlKTtcbiAgICAgICAgICBpZihyZXN1bHQgPT09IHJlYWN0aW9uLnByb21pc2Upe1xuICAgICAgICAgICAgcmVqZWN0KFR5cGVFcnJvcignUHJvbWlzZS1jaGFpbiBjeWNsZScpKTtcbiAgICAgICAgICB9IGVsc2UgaWYodGhlbiA9IGlzVGhlbmFibGUocmVzdWx0KSl7XG4gICAgICAgICAgICB0aGVuLmNhbGwocmVzdWx0LCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0gZWxzZSByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0gZWxzZSByZWplY3QodmFsdWUpO1xuICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgfVxuICAgIH07XG4gICAgd2hpbGUoY2hhaW4ubGVuZ3RoID4gaSlydW4oY2hhaW5baSsrXSk7IC8vIHZhcmlhYmxlIGxlbmd0aCAtIGNhbid0IHVzZSBmb3JFYWNoXG4gICAgY2hhaW4ubGVuZ3RoID0gMDtcbiAgICByZWNvcmQubiA9IGZhbHNlO1xuICAgIGlmKGlzUmVqZWN0KXNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHZhciBwcm9taXNlID0gcmVjb3JkLnBcbiAgICAgICAgLCBoYW5kbGVyLCBjb25zb2xlO1xuICAgICAgaWYoaXNVbmhhbmRsZWQocHJvbWlzZSkpe1xuICAgICAgICBpZihpc05vZGUpe1xuICAgICAgICAgIHByb2Nlc3MuZW1pdCgndW5oYW5kbGVkUmVqZWN0aW9uJywgdmFsdWUsIHByb21pc2UpO1xuICAgICAgICB9IGVsc2UgaWYoaGFuZGxlciA9IGdsb2JhbC5vbnVuaGFuZGxlZHJlamVjdGlvbil7XG4gICAgICAgICAgaGFuZGxlcih7cHJvbWlzZTogcHJvbWlzZSwgcmVhc29uOiB2YWx1ZX0pO1xuICAgICAgICB9IGVsc2UgaWYoKGNvbnNvbGUgPSBnbG9iYWwuY29uc29sZSkgJiYgY29uc29sZS5lcnJvcil7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignVW5oYW5kbGVkIHByb21pc2UgcmVqZWN0aW9uJywgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9IHJlY29yZC5hID0gdW5kZWZpbmVkO1xuICAgIH0sIDEpO1xuICB9KTtcbn07XG52YXIgaXNVbmhhbmRsZWQgPSBmdW5jdGlvbihwcm9taXNlKXtcbiAgdmFyIHJlY29yZCA9IHByb21pc2UuX2RcbiAgICAsIGNoYWluICA9IHJlY29yZC5hIHx8IHJlY29yZC5jXG4gICAgLCBpICAgICAgPSAwXG4gICAgLCByZWFjdGlvbjtcbiAgaWYocmVjb3JkLmgpcmV0dXJuIGZhbHNlO1xuICB3aGlsZShjaGFpbi5sZW5ndGggPiBpKXtcbiAgICByZWFjdGlvbiA9IGNoYWluW2krK107XG4gICAgaWYocmVhY3Rpb24uZmFpbCB8fCAhaXNVbmhhbmRsZWQocmVhY3Rpb24ucHJvbWlzZSkpcmV0dXJuIGZhbHNlO1xuICB9IHJldHVybiB0cnVlO1xufTtcbnZhciAkcmVqZWN0ID0gZnVuY3Rpb24odmFsdWUpe1xuICB2YXIgcmVjb3JkID0gdGhpcztcbiAgaWYocmVjb3JkLmQpcmV0dXJuO1xuICByZWNvcmQuZCA9IHRydWU7XG4gIHJlY29yZCA9IHJlY29yZC5yIHx8IHJlY29yZDsgLy8gdW53cmFwXG4gIHJlY29yZC52ID0gdmFsdWU7XG4gIHJlY29yZC5zID0gMjtcbiAgcmVjb3JkLmEgPSByZWNvcmQuYy5zbGljZSgpO1xuICBub3RpZnkocmVjb3JkLCB0cnVlKTtcbn07XG52YXIgJHJlc29sdmUgPSBmdW5jdGlvbih2YWx1ZSl7XG4gIHZhciByZWNvcmQgPSB0aGlzXG4gICAgLCB0aGVuO1xuICBpZihyZWNvcmQuZClyZXR1cm47XG4gIHJlY29yZC5kID0gdHJ1ZTtcbiAgcmVjb3JkID0gcmVjb3JkLnIgfHwgcmVjb3JkOyAvLyB1bndyYXBcbiAgdHJ5IHtcbiAgICBpZihyZWNvcmQucCA9PT0gdmFsdWUpdGhyb3cgVHlwZUVycm9yKFwiUHJvbWlzZSBjYW4ndCBiZSByZXNvbHZlZCBpdHNlbGZcIik7XG4gICAgaWYodGhlbiA9IGlzVGhlbmFibGUodmFsdWUpKXtcbiAgICAgIGFzYXAoZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHdyYXBwZXIgPSB7cjogcmVjb3JkLCBkOiBmYWxzZX07IC8vIHdyYXBcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB0aGVuLmNhbGwodmFsdWUsIGN0eCgkcmVzb2x2ZSwgd3JhcHBlciwgMSksIGN0eCgkcmVqZWN0LCB3cmFwcGVyLCAxKSk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgJHJlamVjdC5jYWxsKHdyYXBwZXIsIGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVjb3JkLnYgPSB2YWx1ZTtcbiAgICAgIHJlY29yZC5zID0gMTtcbiAgICAgIG5vdGlmeShyZWNvcmQsIGZhbHNlKTtcbiAgICB9XG4gIH0gY2F0Y2goZSl7XG4gICAgJHJlamVjdC5jYWxsKHtyOiByZWNvcmQsIGQ6IGZhbHNlfSwgZSk7IC8vIHdyYXBcbiAgfVxufTtcblxuLy8gY29uc3RydWN0b3IgcG9seWZpbGxcbmlmKCFVU0VfTkFUSVZFKXtcbiAgLy8gMjUuNC4zLjEgUHJvbWlzZShleGVjdXRvcilcbiAgUCA9IGZ1bmN0aW9uIFByb21pc2UoZXhlY3V0b3Ipe1xuICAgIGFGdW5jdGlvbihleGVjdXRvcik7XG4gICAgdmFyIHJlY29yZCA9IHRoaXMuX2QgPSB7XG4gICAgICBwOiBzdHJpY3ROZXcodGhpcywgUCwgUFJPTUlTRSksICAgICAgICAgLy8gPC0gcHJvbWlzZVxuICAgICAgYzogW10sICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGF3YWl0aW5nIHJlYWN0aW9uc1xuICAgICAgYTogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGNoZWNrZWQgaW4gaXNVbmhhbmRsZWQgcmVhY3Rpb25zXG4gICAgICBzOiAwLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gc3RhdGVcbiAgICAgIGQ6IGZhbHNlLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBkb25lXG4gICAgICB2OiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gdmFsdWVcbiAgICAgIGg6IGZhbHNlLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBoYW5kbGVkIHJlamVjdGlvblxuICAgICAgbjogZmFsc2UgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIG5vdGlmeVxuICAgIH07XG4gICAgdHJ5IHtcbiAgICAgIGV4ZWN1dG9yKGN0eCgkcmVzb2x2ZSwgcmVjb3JkLCAxKSwgY3R4KCRyZWplY3QsIHJlY29yZCwgMSkpO1xuICAgIH0gY2F0Y2goZXJyKXtcbiAgICAgICRyZWplY3QuY2FsbChyZWNvcmQsIGVycik7XG4gICAgfVxuICB9O1xuICByZXF1aXJlKCcuLyQucmVkZWZpbmUtYWxsJykoUC5wcm90b3R5cGUsIHtcbiAgICAvLyAyNS40LjUuMyBQcm9taXNlLnByb3RvdHlwZS50aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKVxuICAgIHRoZW46IGZ1bmN0aW9uIHRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpe1xuICAgICAgdmFyIHJlYWN0aW9uID0gbmV3IFByb21pc2VDYXBhYmlsaXR5KHNwZWNpZXNDb25zdHJ1Y3Rvcih0aGlzLCBQKSlcbiAgICAgICAgLCBwcm9taXNlICA9IHJlYWN0aW9uLnByb21pc2VcbiAgICAgICAgLCByZWNvcmQgICA9IHRoaXMuX2Q7XG4gICAgICByZWFjdGlvbi5vayAgID0gdHlwZW9mIG9uRnVsZmlsbGVkID09ICdmdW5jdGlvbicgPyBvbkZ1bGZpbGxlZCA6IHRydWU7XG4gICAgICByZWFjdGlvbi5mYWlsID0gdHlwZW9mIG9uUmVqZWN0ZWQgPT0gJ2Z1bmN0aW9uJyAmJiBvblJlamVjdGVkO1xuICAgICAgcmVjb3JkLmMucHVzaChyZWFjdGlvbik7XG4gICAgICBpZihyZWNvcmQuYSlyZWNvcmQuYS5wdXNoKHJlYWN0aW9uKTtcbiAgICAgIGlmKHJlY29yZC5zKW5vdGlmeShyZWNvcmQsIGZhbHNlKTtcbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH0sXG4gICAgLy8gMjUuNC41LjEgUHJvbWlzZS5wcm90b3R5cGUuY2F0Y2gob25SZWplY3RlZClcbiAgICAnY2F0Y2gnOiBmdW5jdGlvbihvblJlamVjdGVkKXtcbiAgICAgIHJldHVybiB0aGlzLnRoZW4odW5kZWZpbmVkLCBvblJlamVjdGVkKTtcbiAgICB9XG4gIH0pO1xufVxuXG4kZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCB7UHJvbWlzZTogUH0pO1xucmVxdWlyZSgnLi8kLnNldC10by1zdHJpbmctdGFnJykoUCwgUFJPTUlTRSk7XG5yZXF1aXJlKCcuLyQuc2V0LXNwZWNpZXMnKShQUk9NSVNFKTtcbldyYXBwZXIgPSByZXF1aXJlKCcuLyQuY29yZScpW1BST01JU0VdO1xuXG4vLyBzdGF0aWNzXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC41IFByb21pc2UucmVqZWN0KHIpXG4gIHJlamVjdDogZnVuY3Rpb24gcmVqZWN0KHIpe1xuICAgIHZhciBjYXBhYmlsaXR5ID0gbmV3IFByb21pc2VDYXBhYmlsaXR5KHRoaXMpXG4gICAgICAsICQkcmVqZWN0ICAgPSBjYXBhYmlsaXR5LnJlamVjdDtcbiAgICAkJHJlamVjdChyKTtcbiAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICB9XG59KTtcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogKCFVU0VfTkFUSVZFIHx8IHRlc3RSZXNvbHZlKHRydWUpKSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuNiBQcm9taXNlLnJlc29sdmUoeClcbiAgcmVzb2x2ZTogZnVuY3Rpb24gcmVzb2x2ZSh4KXtcbiAgICAvLyBpbnN0YW5jZW9mIGluc3RlYWQgb2YgaW50ZXJuYWwgc2xvdCBjaGVjayBiZWNhdXNlIHdlIHNob3VsZCBmaXggaXQgd2l0aG91dCByZXBsYWNlbWVudCBuYXRpdmUgUHJvbWlzZSBjb3JlXG4gICAgaWYoeCBpbnN0YW5jZW9mIFAgJiYgc2FtZUNvbnN0cnVjdG9yKHguY29uc3RydWN0b3IsIHRoaXMpKXJldHVybiB4O1xuICAgIHZhciBjYXBhYmlsaXR5ID0gbmV3IFByb21pc2VDYXBhYmlsaXR5KHRoaXMpXG4gICAgICAsICQkcmVzb2x2ZSAgPSBjYXBhYmlsaXR5LnJlc29sdmU7XG4gICAgJCRyZXNvbHZlKHgpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH1cbn0pO1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhKFVTRV9OQVRJVkUgJiYgcmVxdWlyZSgnLi8kLml0ZXItZGV0ZWN0JykoZnVuY3Rpb24oaXRlcil7XG4gIFAuYWxsKGl0ZXIpWydjYXRjaCddKGZ1bmN0aW9uKCl7fSk7XG59KSksIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjEgUHJvbWlzZS5hbGwoaXRlcmFibGUpXG4gIGFsbDogZnVuY3Rpb24gYWxsKGl0ZXJhYmxlKXtcbiAgICB2YXIgQyAgICAgICAgICA9IGdldENvbnN0cnVjdG9yKHRoaXMpXG4gICAgICAsIGNhcGFiaWxpdHkgPSBuZXcgUHJvbWlzZUNhcGFiaWxpdHkoQylcbiAgICAgICwgcmVzb2x2ZSAgICA9IGNhcGFiaWxpdHkucmVzb2x2ZVxuICAgICAgLCByZWplY3QgICAgID0gY2FwYWJpbGl0eS5yZWplY3RcbiAgICAgICwgdmFsdWVzICAgICA9IFtdO1xuICAgIHZhciBhYnJ1cHQgPSBwZXJmb3JtKGZ1bmN0aW9uKCl7XG4gICAgICBmb3JPZihpdGVyYWJsZSwgZmFsc2UsIHZhbHVlcy5wdXNoLCB2YWx1ZXMpO1xuICAgICAgdmFyIHJlbWFpbmluZyA9IHZhbHVlcy5sZW5ndGhcbiAgICAgICAgLCByZXN1bHRzICAgPSBBcnJheShyZW1haW5pbmcpO1xuICAgICAgaWYocmVtYWluaW5nKSQuZWFjaC5jYWxsKHZhbHVlcywgZnVuY3Rpb24ocHJvbWlzZSwgaW5kZXgpe1xuICAgICAgICB2YXIgYWxyZWFkeUNhbGxlZCA9IGZhbHNlO1xuICAgICAgICBDLnJlc29sdmUocHJvbWlzZSkudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgICAgaWYoYWxyZWFkeUNhbGxlZClyZXR1cm47XG4gICAgICAgICAgYWxyZWFkeUNhbGxlZCA9IHRydWU7XG4gICAgICAgICAgcmVzdWx0c1tpbmRleF0gPSB2YWx1ZTtcbiAgICAgICAgICAtLXJlbWFpbmluZyB8fCByZXNvbHZlKHJlc3VsdHMpO1xuICAgICAgICB9LCByZWplY3QpO1xuICAgICAgfSk7XG4gICAgICBlbHNlIHJlc29sdmUocmVzdWx0cyk7XG4gICAgfSk7XG4gICAgaWYoYWJydXB0KXJlamVjdChhYnJ1cHQuZXJyb3IpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH0sXG4gIC8vIDI1LjQuNC40IFByb21pc2UucmFjZShpdGVyYWJsZSlcbiAgcmFjZTogZnVuY3Rpb24gcmFjZShpdGVyYWJsZSl7XG4gICAgdmFyIEMgICAgICAgICAgPSBnZXRDb25zdHJ1Y3Rvcih0aGlzKVxuICAgICAgLCBjYXBhYmlsaXR5ID0gbmV3IFByb21pc2VDYXBhYmlsaXR5KEMpXG4gICAgICAsIHJlamVjdCAgICAgPSBjYXBhYmlsaXR5LnJlamVjdDtcbiAgICB2YXIgYWJydXB0ID0gcGVyZm9ybShmdW5jdGlvbigpe1xuICAgICAgZm9yT2YoaXRlcmFibGUsIGZhbHNlLCBmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgQy5yZXNvbHZlKHByb21pc2UpLnRoZW4oY2FwYWJpbGl0eS5yZXNvbHZlLCByZWplY3QpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaWYoYWJydXB0KXJlamVjdChhYnJ1cHQuZXJyb3IpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcbnZhciBzdHJvbmcgPSByZXF1aXJlKCcuLyQuY29sbGVjdGlvbi1zdHJvbmcnKTtcblxuLy8gMjMuMiBTZXQgT2JqZWN0c1xucmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24nKSgnU2V0JywgZnVuY3Rpb24oZ2V0KXtcbiAgcmV0dXJuIGZ1bmN0aW9uIFNldCgpeyByZXR1cm4gZ2V0KHRoaXMsIGFyZ3VtZW50cy5sZW5ndGggPiAwID8gYXJndW1lbnRzWzBdIDogdW5kZWZpbmVkKTsgfTtcbn0sIHtcbiAgLy8gMjMuMi4zLjEgU2V0LnByb3RvdHlwZS5hZGQodmFsdWUpXG4gIGFkZDogZnVuY3Rpb24gYWRkKHZhbHVlKXtcbiAgICByZXR1cm4gc3Ryb25nLmRlZih0aGlzLCB2YWx1ZSA9IHZhbHVlID09PSAwID8gMCA6IHZhbHVlLCB2YWx1ZSk7XG4gIH1cbn0sIHN0cm9uZyk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyICRhdCAgPSByZXF1aXJlKCcuLyQuc3RyaW5nLWF0JykodHJ1ZSk7XG5cbi8vIDIxLjEuMy4yNyBTdHJpbmcucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vJC5pdGVyLWRlZmluZScpKFN0cmluZywgJ1N0cmluZycsIGZ1bmN0aW9uKGl0ZXJhdGVkKXtcbiAgdGhpcy5fdCA9IFN0cmluZyhpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuLy8gMjEuMS41LjIuMSAlU3RyaW5nSXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxufSwgZnVuY3Rpb24oKXtcbiAgdmFyIE8gICAgID0gdGhpcy5fdFxuICAgICwgaW5kZXggPSB0aGlzLl9pXG4gICAgLCBwb2ludDtcbiAgaWYoaW5kZXggPj0gTy5sZW5ndGgpcmV0dXJuIHt2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlfTtcbiAgcG9pbnQgPSAkYXQoTywgaW5kZXgpO1xuICB0aGlzLl9pICs9IHBvaW50Lmxlbmd0aDtcbiAgcmV0dXJuIHt2YWx1ZTogcG9pbnQsIGRvbmU6IGZhbHNlfTtcbn0pOyIsIid1c2Ugc3RyaWN0Jztcbi8vIEVDTUFTY3JpcHQgNiBzeW1ib2xzIHNoaW1cbnZhciAkICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgZ2xvYmFsICAgICAgICAgPSByZXF1aXJlKCcuLyQuZ2xvYmFsJylcbiAgLCBoYXMgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5oYXMnKVxuICAsIERFU0NSSVBUT1JTICAgID0gcmVxdWlyZSgnLi8kLmRlc2NyaXB0b3JzJylcbiAgLCAkZXhwb3J0ICAgICAgICA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKVxuICAsIHJlZGVmaW5lICAgICAgID0gcmVxdWlyZSgnLi8kLnJlZGVmaW5lJylcbiAgLCAkZmFpbHMgICAgICAgICA9IHJlcXVpcmUoJy4vJC5mYWlscycpXG4gICwgc2hhcmVkICAgICAgICAgPSByZXF1aXJlKCcuLyQuc2hhcmVkJylcbiAgLCBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vJC5zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgdWlkICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQudWlkJylcbiAgLCB3a3MgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC53a3MnKVxuICAsIGtleU9mICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmtleW9mJylcbiAgLCAkbmFtZXMgICAgICAgICA9IHJlcXVpcmUoJy4vJC5nZXQtbmFtZXMnKVxuICAsIGVudW1LZXlzICAgICAgID0gcmVxdWlyZSgnLi8kLmVudW0ta2V5cycpXG4gICwgaXNBcnJheSAgICAgICAgPSByZXF1aXJlKCcuLyQuaXMtYXJyYXknKVxuICAsIGFuT2JqZWN0ICAgICAgID0gcmVxdWlyZSgnLi8kLmFuLW9iamVjdCcpXG4gICwgdG9JT2JqZWN0ICAgICAgPSByZXF1aXJlKCcuLyQudG8taW9iamVjdCcpXG4gICwgY3JlYXRlRGVzYyAgICAgPSByZXF1aXJlKCcuLyQucHJvcGVydHktZGVzYycpXG4gICwgZ2V0RGVzYyAgICAgICAgPSAkLmdldERlc2NcbiAgLCBzZXREZXNjICAgICAgICA9ICQuc2V0RGVzY1xuICAsIF9jcmVhdGUgICAgICAgID0gJC5jcmVhdGVcbiAgLCBnZXROYW1lcyAgICAgICA9ICRuYW1lcy5nZXRcbiAgLCAkU3ltYm9sICAgICAgICA9IGdsb2JhbC5TeW1ib2xcbiAgLCAkSlNPTiAgICAgICAgICA9IGdsb2JhbC5KU09OXG4gICwgX3N0cmluZ2lmeSAgICAgPSAkSlNPTiAmJiAkSlNPTi5zdHJpbmdpZnlcbiAgLCBzZXR0ZXIgICAgICAgICA9IGZhbHNlXG4gICwgSElEREVOICAgICAgICAgPSB3a3MoJ19oaWRkZW4nKVxuICAsIGlzRW51bSAgICAgICAgID0gJC5pc0VudW1cbiAgLCBTeW1ib2xSZWdpc3RyeSA9IHNoYXJlZCgnc3ltYm9sLXJlZ2lzdHJ5JylcbiAgLCBBbGxTeW1ib2xzICAgICA9IHNoYXJlZCgnc3ltYm9scycpXG4gICwgdXNlTmF0aXZlICAgICAgPSB0eXBlb2YgJFN5bWJvbCA9PSAnZnVuY3Rpb24nXG4gICwgT2JqZWN0UHJvdG8gICAgPSBPYmplY3QucHJvdG90eXBlO1xuXG4vLyBmYWxsYmFjayBmb3Igb2xkIEFuZHJvaWQsIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD02ODdcbnZhciBzZXRTeW1ib2xEZXNjID0gREVTQ1JJUFRPUlMgJiYgJGZhaWxzKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBfY3JlYXRlKHNldERlc2Moe30sICdhJywge1xuICAgIGdldDogZnVuY3Rpb24oKXsgcmV0dXJuIHNldERlc2ModGhpcywgJ2EnLCB7dmFsdWU6IDd9KS5hOyB9XG4gIH0pKS5hICE9IDc7XG59KSA/IGZ1bmN0aW9uKGl0LCBrZXksIEQpe1xuICB2YXIgcHJvdG9EZXNjID0gZ2V0RGVzYyhPYmplY3RQcm90bywga2V5KTtcbiAgaWYocHJvdG9EZXNjKWRlbGV0ZSBPYmplY3RQcm90b1trZXldO1xuICBzZXREZXNjKGl0LCBrZXksIEQpO1xuICBpZihwcm90b0Rlc2MgJiYgaXQgIT09IE9iamVjdFByb3RvKXNldERlc2MoT2JqZWN0UHJvdG8sIGtleSwgcHJvdG9EZXNjKTtcbn0gOiBzZXREZXNjO1xuXG52YXIgd3JhcCA9IGZ1bmN0aW9uKHRhZyl7XG4gIHZhciBzeW0gPSBBbGxTeW1ib2xzW3RhZ10gPSBfY3JlYXRlKCRTeW1ib2wucHJvdG90eXBlKTtcbiAgc3ltLl9rID0gdGFnO1xuICBERVNDUklQVE9SUyAmJiBzZXR0ZXIgJiYgc2V0U3ltYm9sRGVzYyhPYmplY3RQcm90bywgdGFnLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIHNldDogZnVuY3Rpb24odmFsdWUpe1xuICAgICAgaWYoaGFzKHRoaXMsIEhJRERFTikgJiYgaGFzKHRoaXNbSElEREVOXSwgdGFnKSl0aGlzW0hJRERFTl1bdGFnXSA9IGZhbHNlO1xuICAgICAgc2V0U3ltYm9sRGVzYyh0aGlzLCB0YWcsIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gc3ltO1xufTtcblxudmFyIGlzU3ltYm9sID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdHlwZW9mIGl0ID09ICdzeW1ib2wnO1xufTtcblxudmFyICRkZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KGl0LCBrZXksIEQpe1xuICBpZihEICYmIGhhcyhBbGxTeW1ib2xzLCBrZXkpKXtcbiAgICBpZighRC5lbnVtZXJhYmxlKXtcbiAgICAgIGlmKCFoYXMoaXQsIEhJRERFTikpc2V0RGVzYyhpdCwgSElEREVOLCBjcmVhdGVEZXNjKDEsIHt9KSk7XG4gICAgICBpdFtISURERU5dW2tleV0gPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZihoYXMoaXQsIEhJRERFTikgJiYgaXRbSElEREVOXVtrZXldKWl0W0hJRERFTl1ba2V5XSA9IGZhbHNlO1xuICAgICAgRCA9IF9jcmVhdGUoRCwge2VudW1lcmFibGU6IGNyZWF0ZURlc2MoMCwgZmFsc2UpfSk7XG4gICAgfSByZXR1cm4gc2V0U3ltYm9sRGVzYyhpdCwga2V5LCBEKTtcbiAgfSByZXR1cm4gc2V0RGVzYyhpdCwga2V5LCBEKTtcbn07XG52YXIgJGRlZmluZVByb3BlcnRpZXMgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKGl0LCBQKXtcbiAgYW5PYmplY3QoaXQpO1xuICB2YXIga2V5cyA9IGVudW1LZXlzKFAgPSB0b0lPYmplY3QoUCkpXG4gICAgLCBpICAgID0gMFxuICAgICwgbCA9IGtleXMubGVuZ3RoXG4gICAgLCBrZXk7XG4gIHdoaWxlKGwgPiBpKSRkZWZpbmVQcm9wZXJ0eShpdCwga2V5ID0ga2V5c1tpKytdLCBQW2tleV0pO1xuICByZXR1cm4gaXQ7XG59O1xudmFyICRjcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUoaXQsIFApe1xuICByZXR1cm4gUCA9PT0gdW5kZWZpbmVkID8gX2NyZWF0ZShpdCkgOiAkZGVmaW5lUHJvcGVydGllcyhfY3JlYXRlKGl0KSwgUCk7XG59O1xudmFyICRwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IGZ1bmN0aW9uIHByb3BlcnR5SXNFbnVtZXJhYmxlKGtleSl7XG4gIHZhciBFID0gaXNFbnVtLmNhbGwodGhpcywga2V5KTtcbiAgcmV0dXJuIEUgfHwgIWhhcyh0aGlzLCBrZXkpIHx8ICFoYXMoQWxsU3ltYm9scywga2V5KSB8fCBoYXModGhpcywgSElEREVOKSAmJiB0aGlzW0hJRERFTl1ba2V5XVxuICAgID8gRSA6IHRydWU7XG59O1xudmFyICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaXQsIGtleSl7XG4gIHZhciBEID0gZ2V0RGVzYyhpdCA9IHRvSU9iamVjdChpdCksIGtleSk7XG4gIGlmKEQgJiYgaGFzKEFsbFN5bWJvbHMsIGtleSkgJiYgIShoYXMoaXQsIEhJRERFTikgJiYgaXRbSElEREVOXVtrZXldKSlELmVudW1lcmFibGUgPSB0cnVlO1xuICByZXR1cm4gRDtcbn07XG52YXIgJGdldE93blByb3BlcnR5TmFtZXMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKGl0KXtcbiAgdmFyIG5hbWVzICA9IGdldE5hbWVzKHRvSU9iamVjdChpdCkpXG4gICAgLCByZXN1bHQgPSBbXVxuICAgICwgaSAgICAgID0gMFxuICAgICwga2V5O1xuICB3aGlsZShuYW1lcy5sZW5ndGggPiBpKWlmKCFoYXMoQWxsU3ltYm9scywga2V5ID0gbmFtZXNbaSsrXSkgJiYga2V5ICE9IEhJRERFTilyZXN1bHQucHVzaChrZXkpO1xuICByZXR1cm4gcmVzdWx0O1xufTtcbnZhciAkZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGl0KXtcbiAgdmFyIG5hbWVzICA9IGdldE5hbWVzKHRvSU9iamVjdChpdCkpXG4gICAgLCByZXN1bHQgPSBbXVxuICAgICwgaSAgICAgID0gMFxuICAgICwga2V5O1xuICB3aGlsZShuYW1lcy5sZW5ndGggPiBpKWlmKGhhcyhBbGxTeW1ib2xzLCBrZXkgPSBuYW1lc1tpKytdKSlyZXN1bHQucHVzaChBbGxTeW1ib2xzW2tleV0pO1xuICByZXR1cm4gcmVzdWx0O1xufTtcbnZhciAkc3RyaW5naWZ5ID0gZnVuY3Rpb24gc3RyaW5naWZ5KGl0KXtcbiAgaWYoaXQgPT09IHVuZGVmaW5lZCB8fCBpc1N5bWJvbChpdCkpcmV0dXJuOyAvLyBJRTggcmV0dXJucyBzdHJpbmcgb24gdW5kZWZpbmVkXG4gIHZhciBhcmdzID0gW2l0XVxuICAgICwgaSAgICA9IDFcbiAgICAsICQkICAgPSBhcmd1bWVudHNcbiAgICAsIHJlcGxhY2VyLCAkcmVwbGFjZXI7XG4gIHdoaWxlKCQkLmxlbmd0aCA+IGkpYXJncy5wdXNoKCQkW2krK10pO1xuICByZXBsYWNlciA9IGFyZ3NbMV07XG4gIGlmKHR5cGVvZiByZXBsYWNlciA9PSAnZnVuY3Rpb24nKSRyZXBsYWNlciA9IHJlcGxhY2VyO1xuICBpZigkcmVwbGFjZXIgfHwgIWlzQXJyYXkocmVwbGFjZXIpKXJlcGxhY2VyID0gZnVuY3Rpb24oa2V5LCB2YWx1ZSl7XG4gICAgaWYoJHJlcGxhY2VyKXZhbHVlID0gJHJlcGxhY2VyLmNhbGwodGhpcywga2V5LCB2YWx1ZSk7XG4gICAgaWYoIWlzU3ltYm9sKHZhbHVlKSlyZXR1cm4gdmFsdWU7XG4gIH07XG4gIGFyZ3NbMV0gPSByZXBsYWNlcjtcbiAgcmV0dXJuIF9zdHJpbmdpZnkuYXBwbHkoJEpTT04sIGFyZ3MpO1xufTtcbnZhciBidWdneUpTT04gPSAkZmFpbHMoZnVuY3Rpb24oKXtcbiAgdmFyIFMgPSAkU3ltYm9sKCk7XG4gIC8vIE1TIEVkZ2UgY29udmVydHMgc3ltYm9sIHZhbHVlcyB0byBKU09OIGFzIHt9XG4gIC8vIFdlYktpdCBjb252ZXJ0cyBzeW1ib2wgdmFsdWVzIHRvIEpTT04gYXMgbnVsbFxuICAvLyBWOCB0aHJvd3Mgb24gYm94ZWQgc3ltYm9sc1xuICByZXR1cm4gX3N0cmluZ2lmeShbU10pICE9ICdbbnVsbF0nIHx8IF9zdHJpbmdpZnkoe2E6IFN9KSAhPSAne30nIHx8IF9zdHJpbmdpZnkoT2JqZWN0KFMpKSAhPSAne30nO1xufSk7XG5cbi8vIDE5LjQuMS4xIFN5bWJvbChbZGVzY3JpcHRpb25dKVxuaWYoIXVzZU5hdGl2ZSl7XG4gICRTeW1ib2wgPSBmdW5jdGlvbiBTeW1ib2woKXtcbiAgICBpZihpc1N5bWJvbCh0aGlzKSl0aHJvdyBUeXBlRXJyb3IoJ1N5bWJvbCBpcyBub3QgYSBjb25zdHJ1Y3RvcicpO1xuICAgIHJldHVybiB3cmFwKHVpZChhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50c1swXSA6IHVuZGVmaW5lZCkpO1xuICB9O1xuICByZWRlZmluZSgkU3ltYm9sLnByb3RvdHlwZSwgJ3RvU3RyaW5nJywgZnVuY3Rpb24gdG9TdHJpbmcoKXtcbiAgICByZXR1cm4gdGhpcy5faztcbiAgfSk7XG5cbiAgaXNTeW1ib2wgPSBmdW5jdGlvbihpdCl7XG4gICAgcmV0dXJuIGl0IGluc3RhbmNlb2YgJFN5bWJvbDtcbiAgfTtcblxuICAkLmNyZWF0ZSAgICAgPSAkY3JlYXRlO1xuICAkLmlzRW51bSAgICAgPSAkcHJvcGVydHlJc0VudW1lcmFibGU7XG4gICQuZ2V0RGVzYyAgICA9ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG4gICQuc2V0RGVzYyAgICA9ICRkZWZpbmVQcm9wZXJ0eTtcbiAgJC5zZXREZXNjcyAgID0gJGRlZmluZVByb3BlcnRpZXM7XG4gICQuZ2V0TmFtZXMgICA9ICRuYW1lcy5nZXQgPSAkZ2V0T3duUHJvcGVydHlOYW1lcztcbiAgJC5nZXRTeW1ib2xzID0gJGdldE93blByb3BlcnR5U3ltYm9scztcblxuICBpZihERVNDUklQVE9SUyAmJiAhcmVxdWlyZSgnLi8kLmxpYnJhcnknKSl7XG4gICAgcmVkZWZpbmUoT2JqZWN0UHJvdG8sICdwcm9wZXJ0eUlzRW51bWVyYWJsZScsICRwcm9wZXJ0eUlzRW51bWVyYWJsZSwgdHJ1ZSk7XG4gIH1cbn1cblxudmFyIHN5bWJvbFN0YXRpY3MgPSB7XG4gIC8vIDE5LjQuMi4xIFN5bWJvbC5mb3Ioa2V5KVxuICAnZm9yJzogZnVuY3Rpb24oa2V5KXtcbiAgICByZXR1cm4gaGFzKFN5bWJvbFJlZ2lzdHJ5LCBrZXkgKz0gJycpXG4gICAgICA/IFN5bWJvbFJlZ2lzdHJ5W2tleV1cbiAgICAgIDogU3ltYm9sUmVnaXN0cnlba2V5XSA9ICRTeW1ib2woa2V5KTtcbiAgfSxcbiAgLy8gMTkuNC4yLjUgU3ltYm9sLmtleUZvcihzeW0pXG4gIGtleUZvcjogZnVuY3Rpb24ga2V5Rm9yKGtleSl7XG4gICAgcmV0dXJuIGtleU9mKFN5bWJvbFJlZ2lzdHJ5LCBrZXkpO1xuICB9LFxuICB1c2VTZXR0ZXI6IGZ1bmN0aW9uKCl7IHNldHRlciA9IHRydWU7IH0sXG4gIHVzZVNpbXBsZTogZnVuY3Rpb24oKXsgc2V0dGVyID0gZmFsc2U7IH1cbn07XG4vLyAxOS40LjIuMiBTeW1ib2wuaGFzSW5zdGFuY2Vcbi8vIDE5LjQuMi4zIFN5bWJvbC5pc0NvbmNhdFNwcmVhZGFibGVcbi8vIDE5LjQuMi40IFN5bWJvbC5pdGVyYXRvclxuLy8gMTkuNC4yLjYgU3ltYm9sLm1hdGNoXG4vLyAxOS40LjIuOCBTeW1ib2wucmVwbGFjZVxuLy8gMTkuNC4yLjkgU3ltYm9sLnNlYXJjaFxuLy8gMTkuNC4yLjEwIFN5bWJvbC5zcGVjaWVzXG4vLyAxOS40LjIuMTEgU3ltYm9sLnNwbGl0XG4vLyAxOS40LjIuMTIgU3ltYm9sLnRvUHJpbWl0aXZlXG4vLyAxOS40LjIuMTMgU3ltYm9sLnRvU3RyaW5nVGFnXG4vLyAxOS40LjIuMTQgU3ltYm9sLnVuc2NvcGFibGVzXG4kLmVhY2guY2FsbCgoXG4gICdoYXNJbnN0YW5jZSxpc0NvbmNhdFNwcmVhZGFibGUsaXRlcmF0b3IsbWF0Y2gscmVwbGFjZSxzZWFyY2gsJyArXG4gICdzcGVjaWVzLHNwbGl0LHRvUHJpbWl0aXZlLHRvU3RyaW5nVGFnLHVuc2NvcGFibGVzJ1xuKS5zcGxpdCgnLCcpLCBmdW5jdGlvbihpdCl7XG4gIHZhciBzeW0gPSB3a3MoaXQpO1xuICBzeW1ib2xTdGF0aWNzW2l0XSA9IHVzZU5hdGl2ZSA/IHN5bSA6IHdyYXAoc3ltKTtcbn0pO1xuXG5zZXR0ZXIgPSB0cnVlO1xuXG4kZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVywge1N5bWJvbDogJFN5bWJvbH0pO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ1N5bWJvbCcsIHN5bWJvbFN0YXRpY3MpO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICF1c2VOYXRpdmUsICdPYmplY3QnLCB7XG4gIC8vIDE5LjEuMi4yIE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbiAgY3JlYXRlOiAkY3JlYXRlLFxuICAvLyAxOS4xLjIuNCBPYmplY3QuZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcylcbiAgZGVmaW5lUHJvcGVydHk6ICRkZWZpbmVQcm9wZXJ0eSxcbiAgLy8gMTkuMS4yLjMgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcylcbiAgZGVmaW5lUHJvcGVydGllczogJGRlZmluZVByb3BlcnRpZXMsXG4gIC8vIDE5LjEuMi42IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUClcbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLFxuICAvLyAxOS4xLjIuNyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPKVxuICBnZXRPd25Qcm9wZXJ0eU5hbWVzOiAkZ2V0T3duUHJvcGVydHlOYW1lcyxcbiAgLy8gMTkuMS4yLjggT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhPKVxuICBnZXRPd25Qcm9wZXJ0eVN5bWJvbHM6ICRnZXRPd25Qcm9wZXJ0eVN5bWJvbHNcbn0pO1xuXG4vLyAyNC4zLjIgSlNPTi5zdHJpbmdpZnkodmFsdWUgWywgcmVwbGFjZXIgWywgc3BhY2VdXSlcbiRKU09OICYmICRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogKCF1c2VOYXRpdmUgfHwgYnVnZ3lKU09OKSwgJ0pTT04nLCB7c3RyaW5naWZ5OiAkc3RyaW5naWZ5fSk7XG5cbi8vIDE5LjQuMy41IFN5bWJvbC5wcm90b3R5cGVbQEB0b1N0cmluZ1RhZ11cbnNldFRvU3RyaW5nVGFnKCRTeW1ib2wsICdTeW1ib2wnKTtcbi8vIDIwLjIuMS45IE1hdGhbQEB0b1N0cmluZ1RhZ11cbnNldFRvU3RyaW5nVGFnKE1hdGgsICdNYXRoJywgdHJ1ZSk7XG4vLyAyNC4zLjMgSlNPTltAQHRvU3RyaW5nVGFnXVxuc2V0VG9TdHJpbmdUYWcoZ2xvYmFsLkpTT04sICdKU09OJywgdHJ1ZSk7IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL0RhdmlkQnJ1YW50L01hcC1TZXQucHJvdG90eXBlLnRvSlNPTlxudmFyICRleHBvcnQgID0gcmVxdWlyZSgnLi8kLmV4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCwgJ01hcCcsIHt0b0pTT046IHJlcXVpcmUoJy4vJC5jb2xsZWN0aW9uLXRvLWpzb24nKSgnTWFwJyl9KTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vRGF2aWRCcnVhbnQvTWFwLVNldC5wcm90b3R5cGUudG9KU09OXG52YXIgJGV4cG9ydCAgPSByZXF1aXJlKCcuLyQuZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5QLCAnU2V0Jywge3RvSlNPTjogcmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24tdG8tanNvbicpKCdTZXQnKX0pOyIsInJlcXVpcmUoJy4vZXM2LmFycmF5Lml0ZXJhdG9yJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi8kLml0ZXJhdG9ycycpO1xuSXRlcmF0b3JzLk5vZGVMaXN0ID0gSXRlcmF0b3JzLkhUTUxDb2xsZWN0aW9uID0gSXRlcmF0b3JzLkFycmF5OyIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuJyk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG5cbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICB2YXIgbTtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2Uge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIWVtaXR0ZXIuX2V2ZW50cyB8fCAhZW1pdHRlci5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IDA7XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24oZW1pdHRlci5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSAxO1xuICBlbHNlXG4gICAgcmV0ID0gZW1pdHRlci5fZXZlbnRzW3R5cGVdLmxlbmd0aDtcbiAgcmV0dXJuIHJldDtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iXX0=
