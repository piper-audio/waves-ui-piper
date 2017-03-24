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
        gain: 1.0,
        smoothing: false // NB with smoothing we get visible joins at tile boundaries
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
      if (!this.params.smoothing) {
        // for Chrome
        this.$el.setAttributeNS(null, 'image-rendering', 'pixelated');
      }
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

      var usualWidth = tileWidth;
      var usualEncoder = new _utilsPngJs2['default'](usualWidth, height, 256);

      for (var x0 = 0; x0 < totalWidth; x0 += tileWidth) {

        var w = tileWidth;
        if (totalWidth - x0 < tileWidth) {
          w = totalWidth - x0;
        }

        var p = w === tileWidth ? usualEncoder : new _utilsPngJs2['default'](w, height, 256);

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
          if (!this.params.smoothing) {
            // for Firefox
            elt.setAttributeNS(null, 'image-rendering', 'optimizeSpeed');
          }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zaGFwZXMvbWF0cml4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3lCQUNzQixjQUFjOzs7O3VDQUNKLCtCQUErQjs7OztvQ0FDbEMsNEJBQTRCOzs7OzBCQUNsQyxpQkFBaUI7Ozs7QUFFeEMsSUFBTSxPQUFPLEdBQUcsOEJBQThCLENBQUM7O0lBRTFCLE1BQU07WUFBTixNQUFNOztXQUFOLE1BQU07MEJBQU4sTUFBTTs7K0JBQU4sTUFBTTs7O2VBQU4sTUFBTTs7V0FFYix3QkFBRztBQUNiLGFBQU8sUUFBUSxDQUFDO0tBQ2pCOzs7V0FFZSw0QkFBRzs7QUFFakIsYUFBTyxFQUFFLENBQUM7S0FDWDs7Ozs7V0FHVyx3QkFBRztBQUNiLGFBQU87QUFDTCxpQkFBUyxFQUFFLE1BQU07QUFDakIsY0FBTSxFQUFHLGdCQUFBLEtBQUssRUFBSTs7Ozs7QUFLaEIsY0FBSSxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQztBQUN4QixpQkFBTyxDQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFFLENBQUM7U0FDaEMsQUFBQztBQUNGLFlBQUksRUFBRSxHQUFHO0FBQ1QsaUJBQVMsRUFBRSxLQUFLO09BQ2pCLENBQUM7S0FDSDs7O1dBRUssZ0JBQUMsWUFBWSxFQUFFO0FBQ25CLGFBQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUNwQyxVQUFJLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFBRSxlQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7T0FBRTtBQUNsQyxVQUFJLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNsRCxVQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUU7O0FBRTFCLFlBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxXQUFXLENBQUMsQ0FBQztPQUMvRDtBQUNELFVBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZCLGFBQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUN2QyxhQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7S0FDakI7OztXQUVlLDBCQUFDLElBQUksRUFBRTtBQUNyQixhQUFRLFVBQUEsR0FBRyxFQUFJO0FBQ2IsWUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ2QsYUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFDbkMsY0FBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3QixjQUFJLEtBQUssR0FBRyxHQUFHLEVBQUU7QUFDZixlQUFHLEdBQUcsS0FBSyxDQUFDO1dBQ2I7U0FDRjtBQUNELFlBQUksS0FBSyxHQUFHLElBQUksQ0FBQztBQUNqQixZQUFJLEdBQUcsR0FBRyxHQUFHLEVBQUU7QUFDYixlQUFLLEdBQUcsS0FBSyxJQUFJLFlBQVcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQSxBQUFDLENBQUM7U0FDL0M7QUFDRCxZQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDWCxhQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtBQUNuQyxjQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkIsV0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUM7U0FDdkI7QUFDRCxlQUFPLENBQUMsQ0FBQztPQUNWLENBQUU7S0FDSjs7O1dBRWUsMEJBQUMsSUFBSSxFQUFFO0FBQ3JCLGFBQVEsVUFBQSxHQUFHLEVBQUk7QUFDYixZQUFJLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDZCxhQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtBQUNuQyxjQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdCLGNBQUksS0FBSyxHQUFHLEdBQUcsRUFBRTtBQUNmLGVBQUcsR0FBRyxLQUFLLENBQUM7V0FDYjtTQUNGO0FBQ0QsWUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFlBQUksR0FBRyxHQUFHLEdBQUcsRUFBRTtBQUNiLGVBQUssR0FBRyxLQUFLLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQSxBQUFDLENBQUM7U0FDN0I7QUFDRCxZQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDWCxhQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtBQUNuQyxjQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkIsV0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUM7U0FDdkI7QUFDRCxlQUFPLENBQUMsQ0FBQztPQUNWLENBQUU7S0FDSjs7O1dBRVcsc0JBQUMsSUFBSSxFQUFFO0FBQ2pCLGFBQVEsVUFBQSxHQUFHLEVBQUk7QUFDYixZQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDWCxhQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtBQUNuQyxjQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkIsV0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUM7U0FDdEI7QUFDRCxlQUFPLENBQUMsQ0FBQztPQUNWLENBQUU7S0FDSjs7O1dBRU0saUJBQUMsWUFBWSxFQUFFOztBQUVwQixVQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUM7O0FBRWpDLGFBQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQzs7QUFFbkMsVUFBTSxNQUFNLEdBQUcsWUFBWSxDQUFDLGVBQWUsRUFBRSxDQUFDO0FBQzlDLFVBQU0sVUFBVSxHQUFHLFlBQVksQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNqRCxVQUFJLFNBQVMsR0FBRyxHQUFHLENBQUM7QUFDcEIsVUFBSSxVQUFVLEdBQUcsU0FBUyxHQUFHLENBQUMsRUFBRTtBQUM5QixpQkFBUyxHQUFHLFVBQVUsQ0FBQztPQUN4Qjs7QUFFRCxhQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsR0FBRyxVQUFVLEdBQUcsZ0JBQWdCLEdBQUcsU0FBUyxDQUFDLENBQUM7O0FBRXpFLFVBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQztBQUNuQixVQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7O0FBRWhCLFVBQUksU0FBUyxHQUFHLElBQUksQ0FBQzs7QUFFckIsY0FBUSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVM7QUFDN0IsYUFBSyxRQUFRO0FBQ1gsbUJBQVMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwRCxnQkFBTTtBQUFBLEFBQ1IsYUFBSyxRQUFRO0FBQ1gsbUJBQVMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwRCxnQkFBTTtBQUFBLEFBQ1I7QUFDRSxtQkFBUyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNoRCxnQkFBTTtBQUFBLE9BQ1A7O0FBRUQsVUFBTSxTQUFTLEdBQUksU0FBYixTQUFTLENBQUksR0FBRyxFQUFJO0FBQ3hCLFlBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNYLGFBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0FBQ25DLGNBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUNqRCxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3JCO0FBQ0QsZUFBTyxDQUFDLENBQUM7T0FDVixBQUFDLENBQUM7O0FBRUgsVUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFDO0FBQzdCLFVBQU0sWUFBWSxHQUFHLDRCQUFlLFVBQVUsRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7O0FBRTdELFdBQUssSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxVQUFVLEVBQUUsRUFBRSxJQUFJLFNBQVMsRUFBRTs7QUFFakQsWUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDO0FBQ2xCLFlBQUksVUFBVSxHQUFHLEVBQUUsR0FBRyxTQUFTLEVBQUU7QUFDdEMsV0FBQyxHQUFHLFVBQVUsR0FBRyxFQUFFLENBQUM7U0FDZDs7QUFFRCxZQUFJLENBQUMsR0FBSSxDQUFDLEtBQUssU0FBUyxHQUNmLFlBQVksR0FDWiw0QkFBZSxDQUFDLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxBQUFDLENBQUM7O0FBRXpDLGFBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7O0FBRWpDLGNBQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDVixjQUFJLEdBQUcsR0FBRyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BDLGFBQUcsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0FBRXZDLGVBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFDeEIsZ0JBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7OztBQUluQixnQkFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDekIsZ0JBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ3pCLGlCQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDOztpQ0FDcEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDOzs7O2dCQUFyQyxDQUFDO2dCQUFFLENBQUM7Z0JBQUUsQ0FBQzs7QUFDYixnQkFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDakIsZ0JBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLGdCQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNqQixnQkFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDakIsZ0JBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLGdCQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNqQixnQkFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsRUFDbkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQ25CLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUNuQixHQUFHLENBQUMsQ0FBQztBQUM1QixnQkFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbkMsYUFBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxNQUFNLENBQUM7V0FDMUI7U0FDSzs7QUFFRCxZQUFNLFFBQVEsR0FBRyx3QkFBd0IsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDMUQsaUJBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDekIsY0FBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFZixlQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUMsTUFBTSxHQUFHLFdBQVcsR0FBRyxRQUFRLENBQUMsTUFBTSxHQUN6RSxlQUFlLEdBQUcsQ0FBQyxHQUFHLEtBQUssR0FBRyxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUM7T0FDM0M7O0FBRUQsYUFBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOztBQUVoQyxVQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDaEMsYUFBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDOztBQUVqRSxhQUFPO0FBQ0wsaUJBQVMsRUFBRSxTQUFTO0FBQ3BCLGtCQUFVLEVBQUUsTUFBTTtBQUNsQixrQkFBVSxFQUFFLFVBQVU7QUFDdEIsY0FBTSxFQUFFLE1BQU07QUFDZCxpQkFBUyxFQUFFLFlBQVksQ0FBQyxZQUFZLEVBQUU7QUFDdEMsb0JBQVksRUFBRSxZQUFZLENBQUMsZUFBZSxFQUFFO0FBQzVDLGdCQUFRLEVBQUUsRUFBRTtPQUNiLENBQUM7S0FDSDs7O1dBRUssZ0JBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFOztBQUU5QixVQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUM7O0FBRWpDLGFBQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQzs7QUFFcEMsVUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUN6QyxDQUFDLGdCQUFnQixDQUFDLEtBQUssSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRTtBQUNoRCxlQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDakMsZUFBTztPQUNSOztBQUVELFVBQU0sR0FBRyxHQUFHLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUUsVUFBSSxHQUFHLEtBQUssSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUM5QixlQUFPLENBQUMsR0FBRyxDQUFDLHVDQUF1QyxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUMsQ0FBQztBQUNwRSxlQUFPO09BQ1IsTUFBTTtBQUNMLFlBQUksQ0FBQyxhQUFhLEdBQUcsR0FBRyxDQUFDO09BQzFCOztBQUVELFVBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQy9CLGVBQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUN0RCw0QkFBNEIsQ0FBQyxDQUFDO0FBQzVCLGFBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtBQUN0RCxjQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BDLGNBQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN2RCxhQUFHLENBQUMsY0FBYyxDQUFDLDhCQUE4QixFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztBQUM5RCxhQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxxQkFBcUIsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN4RCxjQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUU7O0FBRWpDLGVBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFLGVBQWUsQ0FBQyxDQUFDO1dBQ3ZEO0FBQ1IsYUFBRyxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxVQUFBLENBQUMsRUFBSTtBQUFFLGFBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztXQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDdkUsY0FBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDMUIsZUFBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbkI7QUFDRCxlQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO09BQzFCOztBQUVELGFBQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEdBQUcsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRXhELFVBQUksTUFBTSxHQUFHLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDM0QsVUFBTSxVQUFVLEdBQUcsZ0JBQWdCLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztBQUNuRCxVQUFJLGdCQUFnQixHQUFHLFVBQVUsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDOztBQUVyRCxVQUFJLEtBQUssQ0FBQyxZQUFZLEdBQUcsQ0FBQyxFQUFFO0FBQzFCLFlBQUksYUFBYSxHQUFHLEtBQUssQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztBQUMxRCxZQUFJLElBQUksR0FBRyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxhQUFhLENBQUMsQ0FBQztBQUN6RSx3QkFBZ0IsR0FBRyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUEsR0FBSSxLQUFLLENBQUMsVUFBVSxDQUFDO09BQ3ZEOztBQUVELFVBQUksZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDOztBQUV6QixXQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFDOUMsWUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5QixZQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RDLFlBQU0sQ0FBQyxHQUFHLE1BQU0sR0FBRyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQztBQUN2RCxZQUFNLENBQUMsR0FBRyxTQUFTLEdBQUcsZ0JBQWdCLENBQUM7QUFDdkMsV0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3QyxXQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BFLFdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNqQyxXQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDNUQsd0JBQWdCLElBQUksU0FBUyxDQUFDO09BQy9COztBQUVELFVBQU0sS0FBSyxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNoQyxhQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7S0FDbkU7OztTQWhSa0IsTUFBTTs7O3FCQUFOLE1BQU0iLCJmaWxlIjoic3JjL3NoYXBlcy9tYXRyaXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9iYXNlLXNoYXBlJztcbmltcG9ydCBUaW1lbGluZVRpbWVDb250ZXh0IGZyb20gJy4uL2NvcmUvdGltZWxpbmUtdGltZS1jb250ZXh0JztcbmltcG9ydCBMYXllclRpbWVDb250ZXh0IGZyb20gJy4uL2NvcmUvbGF5ZXItdGltZS1jb250ZXh0JztcbmltcG9ydCBQTkdFbmNvZGVyIGZyb20gJy4uL3V0aWxzL3BuZy5qcyc7XG5cbmNvbnN0IHhodG1sTlMgPSAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hdHJpeCBleHRlbmRzIEJhc2VTaGFwZSB7XG5cbiAgZ2V0Q2xhc3NOYW1lKCkge1xuICAgIHJldHVybiAnbWF0cml4JztcbiAgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgLy8gcmV0dXJuIHsgeTogMCB9O1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIC8vIFRPRE8gZGV0ZXJtaW5lIHN1aXRhYmxlIGltcGxlbWVudGF0aW9ucyBmb3IgX2dldEFjY2Vzc29yTGlzdCBhbmQgX2dldERlZmF1bHRzXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbm9ybWFsaXNlOiAnbm9uZScsXG4gICAgICBtYXBwZXI6ICh2YWx1ZSA9PiB7XG4gICAgICAgIC8vIFRoZSBtYXBwZXIgYWNjZXB0cyBhIHZhbHVlLCB3aGljaCBpcyBndWFyYW50ZWVkIHRvIGJlIGluXG4gICAgICAgIC8vIHRoZSByYW5nZSBbMCwxXSwgYW5kIHJldHVybnMgciwgZywgYiBjb21wb25lbnRzIHdoaWNoIGFyZVxuICAgICAgICAvLyBhbHNvIGluIHRoZSByYW5nZSBbMCwxXS4gVGhpcyBleGFtcGxlIG1hcHBlciBqdXN0IHJldHVybnMgYVxuICAgICAgICAvLyBncmV5IGxldmVsLlxuICAgICAgICBsZXQgbGV2ZWwgPSAxLjAgLSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIFsgbGV2ZWwsIGxldmVsLCBsZXZlbCBdO1xuICAgICAgfSksXG4gICAgICBnYWluOiAxLjAsXG4gICAgICBzbW9vdGhpbmc6IGZhbHNlIC8vIE5CIHdpdGggc21vb3RoaW5nIHdlIGdldCB2aXNpYmxlIGpvaW5zIGF0IHRpbGUgYm91bmRhcmllc1xuICAgIH07XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ3R4KSB7XG4gICAgY29uc29sZS5sb2coXCJtYXRyaXggcmVuZGVyIGNhbGxlZFwiKTtcbiAgICBpZiAodGhpcy4kZWwpIHsgcmV0dXJuIHRoaXMuJGVsOyB9XG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2cnKTtcbiAgICBpZiAoIXRoaXMucGFyYW1zLnNtb290aGluZykge1xuICAgICAgLy8gZm9yIENocm9tZVxuICAgICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ltYWdlLXJlbmRlcmluZycsICdwaXhlbGF0ZWQnKTtcbiAgICB9XG4gICAgdGhpcy5sYXN0VXBkYXRlSG9wID0gMDtcbiAgICBjb25zb2xlLmxvZyhcIm1hdHJpeCByZW5kZXIgcmV0dXJuaW5nXCIpO1xuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIF9oeWJyaWROb3JtYWxpc2UoZ2Fpbikge1xuICAgIHJldHVybiAoY29sID0+IHtcbiAgICAgIGxldCBtYXggPSAwLjA7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbC5sZW5ndGg7ICsraSkge1xuICAgICAgICBsZXQgdmFsdWUgPSBNYXRoLmFicyhjb2xbaV0pO1xuICAgICAgICBpZiAodmFsdWUgPiBtYXgpIHtcbiAgICAgICAgICBtYXggPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGV0IHNjYWxlID0gZ2FpbjtcbiAgICAgIGlmIChtYXggPiAwLjApIHtcbiAgICAgICAgc2NhbGUgPSBzY2FsZSAqIChNYXRoLmxvZzEwKG1heCArIDEuMCkgLyBtYXgpO1xuICAgICAgfVxuICAgICAgbGV0IG4gPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29sLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IGNvbFtpXTtcbiAgICAgICAgbi5wdXNoKHZhbHVlICogc2NhbGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG47XG4gICAgfSk7XG4gIH1cblxuICBfY29sdW1uTm9ybWFsaXNlKGdhaW4pIHtcbiAgICByZXR1cm4gKGNvbCA9PiB7XG4gICAgICBsZXQgbWF4ID0gMC4wO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb2wubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gTWF0aC5hYnMoY29sW2ldKTtcbiAgICAgICAgaWYgKHZhbHVlID4gbWF4KSB7XG4gICAgICAgICAgbWF4ID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxldCBzY2FsZSA9IGdhaW47XG4gICAgICBpZiAobWF4ID4gMC4wKSB7XG4gICAgICAgIHNjYWxlID0gc2NhbGUgKiAoMS4wIC8gbWF4KTtcbiAgICAgIH1cbiAgICAgIGxldCBuID0gW107XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbC5sZW5ndGg7ICsraSkge1xuICAgICAgICBsZXQgdmFsdWUgPSBjb2xbaV07XG4gICAgICAgIG4ucHVzaCh2YWx1ZSAqIHNjYWxlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuO1xuICAgIH0pO1xuICB9ICAgICAgXG4gIFxuICBfbm9Ob3JtYWxpc2UoZ2Fpbikge1xuICAgIHJldHVybiAoY29sID0+IHtcbiAgICAgIGxldCBuID0gW107XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbC5sZW5ndGg7ICsraSkge1xuICAgICAgICBsZXQgdmFsdWUgPSBjb2xbaV07XG4gICAgICAgIG4ucHVzaCh2YWx1ZSAqIGdhaW4pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG47XG4gICAgfSk7XG4gIH0gICAgICBcbiAgXG4gIGVuY2FjaGUobWF0cml4RW50aXR5KSB7XG5cbiAgICBjb25zdCBiZWZvcmUgPSBwZXJmb3JtYW5jZS5ub3coKTtcblxuICAgIGNvbnNvbGUubG9nKFwibWF0cml4IGNhY2hlIGNhbGxlZFwiKTtcblxuICAgIGNvbnN0IGhlaWdodCA9IG1hdHJpeEVudGl0eS5nZXRDb2x1bW5IZWlnaHQoKTtcbiAgICBjb25zdCB0b3RhbFdpZHRoID0gbWF0cml4RW50aXR5LmdldENvbHVtbkNvdW50KCk7XG4gICAgbGV0IHRpbGVXaWR0aCA9IDEwMDtcbiAgICBpZiAodG90YWxXaWR0aCA8IHRpbGVXaWR0aCAqIDIpIHtcbiAgICAgIHRpbGVXaWR0aCA9IHRvdGFsV2lkdGg7XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coXCJ0b3RhbFdpZHRoID0gXCIgKyB0b3RhbFdpZHRoICsgXCIsIHRpbGVXaWR0aCA9IFwiICsgdGlsZVdpZHRoKTtcblxuICAgIGxldCByZXNvdXJjZXMgPSBbXTtcbiAgICBsZXQgd2lkdGhzID0gW107XG5cbiAgICBsZXQgbm9ybWFsaXNlID0gbnVsbDtcblxuICAgIHN3aXRjaCAodGhpcy5wYXJhbXMubm9ybWFsaXNlKSB7XG4gICAgY2FzZSAnaHlicmlkJzpcbiAgICAgIG5vcm1hbGlzZSA9IHRoaXMuX2h5YnJpZE5vcm1hbGlzZSh0aGlzLnBhcmFtcy5nYWluKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2NvbHVtbic6XG4gICAgICBub3JtYWxpc2UgPSB0aGlzLl9jb2x1bW5Ob3JtYWxpc2UodGhpcy5wYXJhbXMuZ2Fpbik7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgbm9ybWFsaXNlID0gdGhpcy5fbm9Ob3JtYWxpc2UodGhpcy5wYXJhbXMuZ2Fpbik7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBjb25zdCBjb25kaXRpb24gPSAoY29sID0+IHtcbiAgICAgIGxldCBuID0gW107XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbC5sZW5ndGg7ICsraSkge1xuICAgICAgICBpZiAoY29sW2ldID09PSBJbmZpbml0eSB8fCBpc05hTihjb2xbaV0pKSBuLnB1c2goMC4wKTtcbiAgICAgICAgZWxzZSBuLnB1c2goY29sW2ldKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuO1xuICAgIH0pO1xuXG4gICAgY29uc3QgdXN1YWxXaWR0aCA9IHRpbGVXaWR0aDtcbiAgICBjb25zdCB1c3VhbEVuY29kZXIgPSBuZXcgUE5HRW5jb2Rlcih1c3VhbFdpZHRoLCBoZWlnaHQsIDI1Nik7XG4gICAgXG4gICAgZm9yIChsZXQgeDAgPSAwOyB4MCA8IHRvdGFsV2lkdGg7IHgwICs9IHRpbGVXaWR0aCkge1xuXG4gICAgICBsZXQgdyA9IHRpbGVXaWR0aDtcbiAgICAgIGlmICh0b3RhbFdpZHRoIC0geDAgPCB0aWxlV2lkdGgpIHtcblx0dyA9IHRvdGFsV2lkdGggLSB4MDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgbGV0IHAgPSAodyA9PT0gdGlsZVdpZHRoID9cbiAgICAgICAgICAgICAgIHVzdWFsRW5jb2RlciA6XG4gICAgICAgICAgICAgICBuZXcgUE5HRW5jb2Rlcih3LCBoZWlnaHQsIDI1NikpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHc7ICsraSkge1xuXG5cdGNvbnN0IHggPSB4MCArIGk7XG4gICAgICAgIGxldCBjb2wgPSBtYXRyaXhFbnRpdHkuZ2V0Q29sdW1uKHgpO1xuICAgICAgICBjb2wgPSBub3JtYWxpc2UoY29uZGl0aW9uKGNvbCkpO1xuICAgICAgICBcblx0Zm9yIChsZXQgeSA9IDA7IHkgPCBoZWlnaHQ7ICsreSkge1xuICAgICAgICAgIGxldCB2YWx1ZSA9IGNvbFt5XTtcbiAgICAgICAgICAvLyBUaGUgdmFsdWUgbXVzdCBiZSBpbiB0aGUgcmFuZ2UgWzAsMV0gdG8gcGFzcyB0byB0aGVcbiAgICAgICAgICAvLyBtYXBwZXIuIFdlIGFsc28gcXVhbnRpemUgdGhlIHJhbmdlLCBhcyB0aGUgUE5HIGVuY29kZXJcbiAgICAgICAgICAvLyB1c2VzIGEgMjU2LWxldmVsIHBhbGV0dGUuXG4gICAgICAgICAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAwO1xuICAgICAgICAgIGlmICh2YWx1ZSA+IDEpIHZhbHVlID0gMTtcbiAgICAgICAgICB2YWx1ZSA9IE1hdGgucm91bmQodmFsdWUgKiAyNTUpIC8gMjU1O1xuICAgICAgICAgIGxldCBbIHIsIGcsIGIgXSA9IHRoaXMucGFyYW1zLm1hcHBlcih2YWx1ZSk7XG4gICAgICAgICAgaWYgKHIgPCAwKSByID0gMDtcbiAgICAgICAgICBpZiAociA+IDEpIHIgPSAxO1xuICAgICAgICAgIGlmIChnIDwgMCkgZyA9IDA7XG4gICAgICAgICAgaWYgKGcgPiAxKSBnID0gMTtcbiAgICAgICAgICBpZiAoYiA8IDApIGIgPSAwO1xuICAgICAgICAgIGlmIChiID4gMSkgYiA9IDE7XG4gICAgICAgICAgY29uc3QgY29sb3VyID0gcC5jb2xvcihNYXRoLnJvdW5kKHIgKiAyNTUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5yb3VuZChnICogMjU1KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGgucm91bmQoYiAqIDI1NSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAyNTUpO1xuICAgICAgICAgIGNvbnN0IGluZGV4ID0gcC5pbmRleChpLCB5KTtcblx0ICBwLmJ1ZmZlcltpbmRleF0gPSBjb2xvdXI7XG5cdH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVzb3VyY2UgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LCcgKyBwLmdldEJhc2U2NCgpO1xuICAgICAgcmVzb3VyY2VzLnB1c2gocmVzb3VyY2UpO1xuICAgICAgd2lkdGhzLnB1c2godyk7XG5cbiAgICAgIGNvbnNvbGUubG9nKFwiaW1hZ2UgXCIgKyByZXNvdXJjZXMubGVuZ3RoICsgXCI6IGxlbmd0aCBcIiArIHJlc291cmNlLmxlbmd0aCArXG5cdFx0ICBcIiAoZGltZW5zaW9ucyBcIiArIHcgKyBcIiB4IFwiICsgaGVpZ2h0ICsgXCIpXCIpO1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKFwiZHJhd2luZyBjb21wbGV0ZVwiKTtcblxuICAgIGNvbnN0IGFmdGVyID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgY29uc29sZS5sb2coXCJtYXRyaXggY2FjaGUgdGltZSA9IFwiICsgTWF0aC5yb3VuZChhZnRlciAtIGJlZm9yZSkpO1xuICAgIFxuICAgIHJldHVybiB7XG4gICAgICByZXNvdXJjZXM6IHJlc291cmNlcyxcbiAgICAgIHRpbGVXaWR0aHM6IHdpZHRocyxcbiAgICAgIHRvdGFsV2lkdGg6IHRvdGFsV2lkdGgsXG4gICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgIHN0YXJ0VGltZTogbWF0cml4RW50aXR5LmdldFN0YXJ0VGltZSgpLFxuICAgICAgc3RlcER1cmF0aW9uOiBtYXRyaXhFbnRpdHkuZ2V0U3RlcER1cmF0aW9uKCksXG4gICAgICBlbGVtZW50czogW10gLy8gd2lsbCBiZSBpbnN0YWxsZWQgaW4gZmlyc3QgY2FsbCB0byB1cGRhdGVcbiAgICB9O1xuICB9XG4gIFxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgY2FjaGUpIHtcblxuICAgIGNvbnN0IGJlZm9yZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gICAgY29uc29sZS5sb2coXCJtYXRyaXggdXBkYXRlIGNhbGxlZFwiKTtcblxuICAgIGlmICghY2FjaGUudG90YWxXaWR0aCB8fCAhY2FjaGUuaGVpZ2h0IHx8XG5cdCFyZW5kZXJpbmdDb250ZXh0LndpZHRoIHx8ICFyZW5kZXJpbmdDb250ZXh0LmhlaWdodCkge1xuICAgICAgY29uc29sZS5sb2coXCJub3RoaW5nIHRvIHVwZGF0ZVwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBob3AgPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKDEpIC0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCgwKTtcbiAgICBpZiAoaG9wID09PSB0aGlzLmxhc3RVcGRhdGVIb3ApIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiem9vbSBsZXZlbCB1bmNoYW5nZWQsIHN0aWxsIGEgaG9wIG9mIFwiICsgaG9wICsgXCIgcHBzXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxhc3RVcGRhdGVIb3AgPSBob3A7XG4gICAgfVxuICAgIFxuICAgIGlmIChjYWNoZS5lbGVtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiQWJvdXQgdG8gYWRkIFwiICsgY2FjaGUucmVzb3VyY2VzLmxlbmd0aCArXG5cdFx0ICBcIiBpbWFnZSByZXNvdXJjZXMgdG8gU1ZHLi4uXCIpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjYWNoZS5yZXNvdXJjZXMubGVuZ3RoOyArK2kpIHtcblx0Y29uc3QgcmVzb3VyY2UgPSBjYWNoZS5yZXNvdXJjZXNbaV07XG5cdGNvbnN0IGVsdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnaW1hZ2UnKTtcblx0ZWx0LnNldEF0dHJpYnV0ZU5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJywgJ2hyZWYnLCByZXNvdXJjZSk7XG4gICAgICAgIGVsdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAncHJlc2VydmVBc3BlY3RSYXRpbycsICdub25lJyk7XG4gICAgICAgIGlmICghdGhpcy5wYXJhbXMuc21vb3RoaW5nKSB7XG4gICAgICAgICAgLy8gZm9yIEZpcmVmb3hcblx0ICBlbHQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ltYWdlLXJlbmRlcmluZycsICdvcHRpbWl6ZVNwZWVkJyk7XG4gICAgICAgIH1cblx0ZWx0LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIGUgPT4geyBlLnByZXZlbnREZWZhdWx0KCk7IH0sIGZhbHNlKTtcblx0dGhpcy4kZWwuYXBwZW5kQ2hpbGQoZWx0KTtcblx0Y2FjaGUuZWxlbWVudHMucHVzaChlbHQpO1xuICAgICAgfVxuICAgICAgY29uc29sZS5sb2coXCJEb25lIHRoYXRcIik7XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coXCJSZW5kZXIgd2lkdGggPSBcIiArIHJlbmRlcmluZ0NvbnRleHQud2lkdGgpO1xuXG4gICAgbGV0IHN0YXJ0WCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoY2FjaGUuc3RhcnRUaW1lKTtcbiAgICBjb25zdCBkcmF3bldpZHRoID0gcmVuZGVyaW5nQ29udGV4dC53aWR0aCAtIHN0YXJ0WDtcbiAgICBsZXQgd2lkdGhTY2FsZUZhY3RvciA9IGRyYXduV2lkdGggLyBjYWNoZS50b3RhbFdpZHRoO1xuXG4gICAgaWYgKGNhY2hlLnN0ZXBEdXJhdGlvbiA+IDApIHtcbiAgICAgIGxldCB0b3RhbER1cmF0aW9uID0gY2FjaGUuc3RlcER1cmF0aW9uICogY2FjaGUudG90YWxXaWR0aDtcbiAgICAgIGxldCBlbmRYID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChjYWNoZS5zdGFydFRpbWUgKyB0b3RhbER1cmF0aW9uKTtcbiAgICAgIHdpZHRoU2NhbGVGYWN0b3IgPSAoZW5kWCAtIHN0YXJ0WCkgLyBjYWNoZS50b3RhbFdpZHRoO1xuICAgIH1cbiAgICBcbiAgICBsZXQgd2lkdGhBY2N1bXVsYXRlZCA9IDA7XG4gICAgXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjYWNoZS5lbGVtZW50cy5sZW5ndGg7ICsraSkge1xuICAgICAgY29uc3QgZWx0ID0gY2FjaGUuZWxlbWVudHNbaV07XG4gICAgICBjb25zdCB0aWxlV2lkdGggPSBjYWNoZS50aWxlV2lkdGhzW2ldO1xuICAgICAgY29uc3QgeCA9IHN0YXJ0WCArIHdpZHRoQWNjdW11bGF0ZWQgKiB3aWR0aFNjYWxlRmFjdG9yO1xuICAgICAgY29uc3QgdyA9IHRpbGVXaWR0aCAqIHdpZHRoU2NhbGVGYWN0b3I7XG4gICAgICBlbHQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3gnLCBNYXRoLmZsb29yKHgpKTtcbiAgICAgIGVsdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCBNYXRoLmNlaWwoeCArIHcpIC0gTWF0aC5mbG9vcih4KSk7XG4gICAgICBlbHQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3knLCAwKTtcbiAgICAgIGVsdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQpO1xuICAgICAgd2lkdGhBY2N1bXVsYXRlZCArPSB0aWxlV2lkdGg7XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IGFmdGVyID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgY29uc29sZS5sb2coXCJtYXRyaXggdXBkYXRlIHRpbWUgPSBcIiArIE1hdGgucm91bmQoYWZ0ZXIgLSBiZWZvcmUpKTtcbiAgfVxufVxuIl19