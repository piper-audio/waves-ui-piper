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
        smoothing: false, // NB with smoothing we get visible joins at tile boundaries
        maxDataUriLength: 32767 // old IE browser limitation, others are more helpful
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

      // We use one byte per pixel, as our PNG is indexed but
      // uncompressed, and base64 encoding increases that to 4/3
      // characters per pixel. The header and data URI scheme stuff add
      // a further 1526 chars after encoding, which we round up to 1530
      // for paranoia.
      var maxPixels = Math.floor(this.params.maxDataUriLength * 3 / 4 - 1530);
      var tileWidth = Math.floor(maxPixels / height);
      if (tileWidth < 1) {
        console.log("WARNING: Matrix shape tile width of " + tileWidth + " calculated for height " + height + ", using 1 instead: this may exceed maxDataUriLength of " + this.params.maxDataUriLength);
        tileWidth = 1;
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
        var visible = x + w > 0 && x < renderingContext.maxX;
        if (visible) {
          elt.setAttributeNS(null, 'x', Math.floor(x));
          elt.setAttributeNS(null, 'width', Math.ceil(x + w) - Math.floor(x));
          elt.setAttributeNS(null, 'y', 0);
          elt.setAttributeNS(null, 'height', renderingContext.height);
          elt.setAttributeNS(null, 'visibility', 'visible');
        } else {
          elt.setAttributeNS(null, 'visibility', 'hidden');
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zaGFwZXMvbWF0cml4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3lCQUNzQixjQUFjOzs7O3VDQUNKLCtCQUErQjs7OztvQ0FDbEMsNEJBQTRCOzs7OzBCQUNsQyxpQkFBaUI7Ozs7QUFFeEMsSUFBTSxPQUFPLEdBQUcsOEJBQThCLENBQUM7O0lBRTFCLE1BQU07WUFBTixNQUFNOztXQUFOLE1BQU07MEJBQU4sTUFBTTs7K0JBQU4sTUFBTTs7O2VBQU4sTUFBTTs7V0FFYix3QkFBRztBQUNiLGFBQU8sUUFBUSxDQUFDO0tBQ2pCOzs7V0FFZSw0QkFBRzs7QUFFakIsYUFBTyxFQUFFLENBQUM7S0FDWDs7Ozs7V0FHVyx3QkFBRztBQUNiLGFBQU87QUFDTCxpQkFBUyxFQUFFLE1BQU07QUFDakIsY0FBTSxFQUFHLGdCQUFBLEtBQUssRUFBSTs7Ozs7QUFLaEIsY0FBSSxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQztBQUN4QixpQkFBTyxDQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFFLENBQUM7U0FDaEMsQUFBQztBQUNGLFlBQUksRUFBRSxHQUFHO0FBQ1QsaUJBQVMsRUFBRSxLQUFLO0FBQ2hCLHdCQUFnQixFQUFFLEtBQUs7T0FDeEIsQ0FBQztLQUNIOzs7V0FFSyxnQkFBQyxZQUFZLEVBQUU7QUFDbkIsYUFBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQ3BDLFVBQUksSUFBSSxDQUFDLEdBQUcsRUFBRTtBQUFFLGVBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztPQUFFO0FBQ2xDLFVBQUksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2xELFVBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTs7QUFFMUIsWUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFB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RSxRQUFRLENBQUMsQ0FBQztTQUNsRDtBQUNELHdCQUFnQixJQUFJLFNBQVMsQ0FBQztPQUMvQjs7QUFFRCxVQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDaEMsYUFBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO0tBQ25FOzs7U0F4UmtCLE1BQU07OztxQkFBTixNQUFNIiwiZmlsZSI6InNyYy9zaGFwZXMvbWF0cml4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vYmFzZS1zaGFwZSc7XG5pbXBvcnQgVGltZWxpbmVUaW1lQ29udGV4dCBmcm9tICcuLi9jb3JlL3RpbWVsaW5lLXRpbWUtY29udGV4dCc7XG5pbXBvcnQgTGF5ZXJUaW1lQ29udGV4dCBmcm9tICcuLi9jb3JlL2xheWVyLXRpbWUtY29udGV4dCc7XG5pbXBvcnQgUE5HRW5jb2RlciBmcm9tICcuLi91dGlscy9wbmcuanMnO1xuXG5jb25zdCB4aHRtbE5TID0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXRyaXggZXh0ZW5kcyBCYXNlU2hhcGUge1xuXG4gIGdldENsYXNzTmFtZSgpIHtcbiAgICByZXR1cm4gJ21hdHJpeCc7XG4gIH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIC8vIHJldHVybiB7IHk6IDAgfTtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICAvLyBUT0RPIGRldGVybWluZSBzdWl0YWJsZSBpbXBsZW1lbnRhdGlvbnMgZm9yIF9nZXRBY2Nlc3Nvckxpc3QgYW5kIF9nZXREZWZhdWx0c1xuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5vcm1hbGlzZTogJ25vbmUnLFxuICAgICAgbWFwcGVyOiAodmFsdWUgPT4ge1xuICAgICAgICAvLyBUaGUgbWFwcGVyIGFjY2VwdHMgYSB2YWx1ZSwgd2hpY2ggaXMgZ3VhcmFudGVlZCB0byBiZSBpblxuICAgICAgICAvLyB0aGUgcmFuZ2UgWzAsMV0sIGFuZCByZXR1cm5zIHIsIGcsIGIgY29tcG9uZW50cyB3aGljaCBhcmVcbiAgICAgICAgLy8gYWxzbyBpbiB0aGUgcmFuZ2UgWzAsMV0uIFRoaXMgZXhhbXBsZSBtYXBwZXIganVzdCByZXR1cm5zIGFcbiAgICAgICAgLy8gZ3JleSBsZXZlbC5cbiAgICAgICAgbGV0IGxldmVsID0gMS4wIC0gdmFsdWU7XG4gICAgICAgIHJldHVybiBbIGxldmVsLCBsZXZlbCwgbGV2ZWwgXTtcbiAgICAgIH0pLFxuICAgICAgZ2FpbjogMS4wLFxuICAgICAgc21vb3RoaW5nOiBmYWxzZSwgLy8gTkIgd2l0aCBzbW9vdGhpbmcgd2UgZ2V0IHZpc2libGUgam9pbnMgYXQgdGlsZSBib3VuZGFyaWVzXG4gICAgICBtYXhEYXRhVXJpTGVuZ3RoOiAzMjc2NyAvLyBvbGQgSUUgYnJvd3NlciBsaW1pdGF0aW9uLCBvdGhlcnMgYXJlIG1vcmUgaGVscGZ1bFxuICAgIH07XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ3R4KSB7XG4gICAgY29uc29sZS5sb2coXCJtYXRyaXggcmVuZGVyIGNhbGxlZFwiKTtcbiAgICBpZiAodGhpcy4kZWwpIHsgcmV0dXJuIHRoaXMuJGVsOyB9XG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2cnKTtcbiAgICBpZiAoIXRoaXMucGFyYW1zLnNtb290aGluZykge1xuICAgICAgLy8gZm9yIENocm9tZVxuICAgICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ltYWdlLXJlbmRlcmluZycsICdwaXhlbGF0ZWQnKTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coXCJtYXRyaXggcmVuZGVyIHJldHVybmluZ1wiKTtcbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICBfaHlicmlkTm9ybWFsaXNlKGdhaW4pIHtcbiAgICByZXR1cm4gKGNvbCA9PiB7XG4gICAgICBsZXQgbWF4ID0gMC4wO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb2wubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gTWF0aC5hYnMoY29sW2ldKTtcbiAgICAgICAgaWYgKHZhbHVlID4gbWF4KSB7XG4gICAgICAgICAgbWF4ID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxldCBzY2FsZSA9IGdhaW47XG4gICAgICBpZiAobWF4ID4gMC4wKSB7XG4gICAgICAgIHNjYWxlID0gc2NhbGUgKiAoTWF0aC5sb2cxMChtYXggKyAxLjApIC8gbWF4KTtcbiAgICAgIH1cbiAgICAgIGxldCBuID0gW107XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbC5sZW5ndGg7ICsraSkge1xuICAgICAgICBsZXQgdmFsdWUgPSBjb2xbaV07XG4gICAgICAgIG4ucHVzaCh2YWx1ZSAqIHNjYWxlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuO1xuICAgIH0pO1xuICB9XG5cbiAgX2NvbHVtbk5vcm1hbGlzZShnYWluKSB7XG4gICAgcmV0dXJuIChjb2wgPT4ge1xuICAgICAgbGV0IG1heCA9IDAuMDtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29sLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IE1hdGguYWJzKGNvbFtpXSk7XG4gICAgICAgIGlmICh2YWx1ZSA+IG1heCkge1xuICAgICAgICAgIG1heCA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsZXQgc2NhbGUgPSBnYWluO1xuICAgICAgaWYgKG1heCA+IDAuMCkge1xuICAgICAgICBzY2FsZSA9IHNjYWxlICogKDEuMCAvIG1heCk7XG4gICAgICB9XG4gICAgICBsZXQgbiA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb2wubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gY29sW2ldO1xuICAgICAgICBuLnB1c2godmFsdWUgKiBzY2FsZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbjtcbiAgICB9KTtcbiAgfSAgICAgIFxuICBcbiAgX25vTm9ybWFsaXNlKGdhaW4pIHtcbiAgICByZXR1cm4gKGNvbCA9PiB7XG4gICAgICBsZXQgbiA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb2wubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gY29sW2ldO1xuICAgICAgICBuLnB1c2godmFsdWUgKiBnYWluKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuO1xuICAgIH0pO1xuICB9ICAgICAgXG4gIFxuICBlbmNhY2hlKG1hdHJpeEVudGl0eSkge1xuXG4gICAgY29uc3QgYmVmb3JlID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cbiAgICBjb25zb2xlLmxvZyhcIm1hdHJpeCBjYWNoZSBjYWxsZWRcIik7XG5cbiAgICBjb25zdCBoZWlnaHQgPSBtYXRyaXhFbnRpdHkuZ2V0Q29sdW1uSGVpZ2h0KCk7XG4gICAgY29uc3QgdG90YWxXaWR0aCA9IG1hdHJpeEVudGl0eS5nZXRDb2x1bW5Db3VudCgpO1xuXG4gICAgLy8gV2UgdXNlIG9uZSBieXRlIHBlciBwaXhlbCwgYXMgb3VyIFBORyBpcyBpbmRleGVkIGJ1dFxuICAgIC8vIHVuY29tcHJlc3NlZCwgYW5kIGJhc2U2NCBlbmNvZGluZyBpbmNyZWFzZXMgdGhhdCB0byA0LzNcbiAgICAvLyBjaGFyYWN0ZXJzIHBlciBwaXhlbC4gVGhlIGhlYWRlciBhbmQgZGF0YSBVUkkgc2NoZW1lIHN0dWZmIGFkZFxuICAgIC8vIGEgZnVydGhlciAxNTI2IGNoYXJzIGFmdGVyIGVuY29kaW5nLCB3aGljaCB3ZSByb3VuZCB1cCB0byAxNTMwXG4gICAgLy8gZm9yIHBhcmFub2lhLlxuICAgIGNvbnN0IG1heFBpeGVscyA9IE1hdGguZmxvb3IoKHRoaXMucGFyYW1zLm1heERhdGFVcmlMZW5ndGggKiAzKSAvIDQgLSAxNTMwKTtcbiAgICBsZXQgdGlsZVdpZHRoID0gTWF0aC5mbG9vcihtYXhQaXhlbHMgLyBoZWlnaHQpO1xuICAgIGlmICh0aWxlV2lkdGggPCAxKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIldBUk5JTkc6IE1hdHJpeCBzaGFwZSB0aWxlIHdpZHRoIG9mIFwiICsgdGlsZVdpZHRoICtcbiAgICAgICAgICAgICAgICAgIFwiIGNhbGN1bGF0ZWQgZm9yIGhlaWdodCBcIiArIGhlaWdodCArXG4gICAgICAgICAgICAgICAgICBcIiwgdXNpbmcgMSBpbnN0ZWFkOiB0aGlzIG1heSBleGNlZWQgbWF4RGF0YVVyaUxlbmd0aCBvZiBcIiArXG4gICAgICAgICAgICAgICAgICB0aGlzLnBhcmFtcy5tYXhEYXRhVXJpTGVuZ3RoKTtcbiAgICAgIHRpbGVXaWR0aCA9IDE7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKFwidG90YWxXaWR0aCA9IFwiICsgdG90YWxXaWR0aCArIFwiLCB0aWxlV2lkdGggPSBcIiArIHRpbGVXaWR0aCk7XG5cbiAgICBsZXQgcmVzb3VyY2VzID0gW107XG4gICAgbGV0IHdpZHRocyA9IFtdO1xuXG4gICAgbGV0IG5vcm1hbGlzZSA9IG51bGw7XG5cbiAgICBzd2l0Y2ggKHRoaXMucGFyYW1zLm5vcm1hbGlzZSkge1xuICAgIGNhc2UgJ2h5YnJpZCc6XG4gICAgICBub3JtYWxpc2UgPSB0aGlzLl9oeWJyaWROb3JtYWxpc2UodGhpcy5wYXJhbXMuZ2Fpbik7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdjb2x1bW4nOlxuICAgICAgbm9ybWFsaXNlID0gdGhpcy5fY29sdW1uTm9ybWFsaXNlKHRoaXMucGFyYW1zLmdhaW4pO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIG5vcm1hbGlzZSA9IHRoaXMuX25vTm9ybWFsaXNlKHRoaXMucGFyYW1zLmdhaW4pO1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY29uc3QgY29uZGl0aW9uID0gKGNvbCA9PiB7XG4gICAgICBsZXQgbiA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb2wubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgaWYgKGNvbFtpXSA9PT0gSW5maW5pdHkgfHwgaXNOYU4oY29sW2ldKSkgbi5wdXNoKDAuMCk7XG4gICAgICAgIGVsc2Ugbi5wdXNoKGNvbFtpXSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbjtcbiAgICB9KTtcblxuICAgIGNvbnN0IHVzdWFsV2lkdGggPSB0aWxlV2lkdGg7XG4gICAgY29uc3QgdXN1YWxFbmNvZGVyID0gbmV3IFBOR0VuY29kZXIodXN1YWxXaWR0aCwgaGVpZ2h0LCAyNTYpO1xuICAgIFxuICAgIGZvciAobGV0IHgwID0gMDsgeDAgPCB0b3RhbFdpZHRoOyB4MCArPSB0aWxlV2lkdGgpIHtcblxuICAgICAgbGV0IHcgPSB0aWxlV2lkdGg7XG4gICAgICBpZiAodG90YWxXaWR0aCAtIHgwIDwgdGlsZVdpZHRoKSB7XG5cdHcgPSB0b3RhbFdpZHRoIC0geDA7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGxldCBwID0gKHcgPT09IHRpbGVXaWR0aCA/XG4gICAgICAgICAgICAgICB1c3VhbEVuY29kZXIgOlxuICAgICAgICAgICAgICAgbmV3IFBOR0VuY29kZXIodywgaGVpZ2h0LCAyNTYpKTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3OyArK2kpIHtcblxuXHRjb25zdCB4ID0geDAgKyBpO1xuICAgICAgICBsZXQgY29sID0gbWF0cml4RW50aXR5LmdldENvbHVtbih4KTtcbiAgICAgICAgY29sID0gbm9ybWFsaXNlKGNvbmRpdGlvbihjb2wpKTtcbiAgICAgICAgXG5cdGZvciAobGV0IHkgPSAwOyB5IDwgaGVpZ2h0OyArK3kpIHtcbiAgICAgICAgICBsZXQgdmFsdWUgPSBjb2xbeV07XG4gICAgICAgICAgLy8gVGhlIHZhbHVlIG11c3QgYmUgaW4gdGhlIHJhbmdlIFswLDFdIHRvIHBhc3MgdG8gdGhlXG4gICAgICAgICAgLy8gbWFwcGVyLiBXZSBhbHNvIHF1YW50aXplIHRoZSByYW5nZSwgYXMgdGhlIFBORyBlbmNvZGVyXG4gICAgICAgICAgLy8gdXNlcyBhIDI1Ni1sZXZlbCBwYWxldHRlLlxuICAgICAgICAgIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMDtcbiAgICAgICAgICBpZiAodmFsdWUgPiAxKSB2YWx1ZSA9IDE7XG4gICAgICAgICAgdmFsdWUgPSBNYXRoLnJvdW5kKHZhbHVlICogMjU1KSAvIDI1NTtcbiAgICAgICAgICBsZXQgWyByLCBnLCBiIF0gPSB0aGlzLnBhcmFtcy5tYXBwZXIodmFsdWUpO1xuICAgICAgICAgIGlmIChyIDwgMCkgciA9IDA7XG4gICAgICAgICAgaWYgKHIgPiAxKSByID0gMTtcbiAgICAgICAgICBpZiAoZyA8IDApIGcgPSAwO1xuICAgICAgICAgIGlmIChnID4gMSkgZyA9IDE7XG4gICAgICAgICAgaWYgKGIgPCAwKSBiID0gMDtcbiAgICAgICAgICBpZiAoYiA+IDEpIGIgPSAxO1xuICAgICAgICAgIGNvbnN0IGNvbG91ciA9IHAuY29sb3IoTWF0aC5yb3VuZChyICogMjU1KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGgucm91bmQoZyAqIDI1NSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnJvdW5kKGIgKiAyNTUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMjU1KTtcbiAgICAgICAgICBjb25zdCBpbmRleCA9IHAuaW5kZXgoaSwgeSk7XG5cdCAgcC5idWZmZXJbaW5kZXhdID0gY29sb3VyO1xuXHR9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlc291cmNlID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCwnICsgcC5nZXRCYXNlNjQoKTtcbiAgICAgIHJlc291cmNlcy5wdXNoKHJlc291cmNlKTtcbiAgICAgIHdpZHRocy5wdXNoKHcpO1xuXG4gICAgICBjb25zb2xlLmxvZyhcImltYWdlIFwiICsgcmVzb3VyY2VzLmxlbmd0aCArIFwiOiBsZW5ndGggXCIgKyByZXNvdXJjZS5sZW5ndGggK1xuXHRcdCAgXCIgKGRpbWVuc2lvbnMgXCIgKyB3ICsgXCIgeCBcIiArIGhlaWdodCArIFwiKVwiKTtcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyhcImRyYXdpbmcgY29tcGxldGVcIik7XG5cbiAgICBjb25zdCBhZnRlciA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIGNvbnNvbGUubG9nKFwibWF0cml4IGNhY2hlIHRpbWUgPSBcIiArIE1hdGgucm91bmQoYWZ0ZXIgLSBiZWZvcmUpKTtcbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgcmVzb3VyY2VzOiByZXNvdXJjZXMsXG4gICAgICB0aWxlV2lkdGhzOiB3aWR0aHMsXG4gICAgICB0b3RhbFdpZHRoOiB0b3RhbFdpZHRoLFxuICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICBzdGFydFRpbWU6IG1hdHJpeEVudGl0eS5nZXRTdGFydFRpbWUoKSxcbiAgICAgIHN0ZXBEdXJhdGlvbjogbWF0cml4RW50aXR5LmdldFN0ZXBEdXJhdGlvbigpLFxuICAgICAgZWxlbWVudHM6IFtdIC8vIHdpbGwgYmUgaW5zdGFsbGVkIGluIGZpcnN0IGNhbGwgdG8gdXBkYXRlXG4gICAgfTtcbiAgfVxuICBcbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGNhY2hlKSB7XG5cbiAgICBjb25zdCBiZWZvcmUgPSBwZXJmb3JtYW5jZS5ub3coKTtcblxuICAgIGNvbnNvbGUubG9nKFwibWF0cml4IHVwZGF0ZSBjYWxsZWRcIik7XG5cbiAgICBpZiAoIWNhY2hlLnRvdGFsV2lkdGggfHwgIWNhY2hlLmhlaWdodCB8fFxuXHQhcmVuZGVyaW5nQ29udGV4dC53aWR0aCB8fCAhcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwibm90aGluZyB0byB1cGRhdGVcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGNhY2hlLmVsZW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY29uc29sZS5sb2coXCJBYm91dCB0byBhZGQgXCIgKyBjYWNoZS5yZXNvdXJjZXMubGVuZ3RoICtcblx0XHQgIFwiIGltYWdlIHJlc291cmNlcyB0byBTVkcuLi5cIik7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNhY2hlLnJlc291cmNlcy5sZW5ndGg7ICsraSkge1xuXHRjb25zdCByZXNvdXJjZSA9IGNhY2hlLnJlc291cmNlc1tpXTtcblx0Y29uc3QgZWx0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdpbWFnZScpO1xuXHRlbHQuc2V0QXR0cmlidXRlTlMoJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnLCAnaHJlZicsIHJlc291cmNlKTtcbiAgICAgICAgZWx0LnNldEF0dHJpYnV0ZU5TKG51bGwsICdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ25vbmUnKTtcbiAgICAgICAgaWYgKCF0aGlzLnBhcmFtcy5zbW9vdGhpbmcpIHtcbiAgICAgICAgICAvLyBmb3IgRmlyZWZveFxuXHQgIGVsdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaW1hZ2UtcmVuZGVyaW5nJywgJ29wdGltaXplU3BlZWQnKTtcbiAgICAgICAgfVxuXHRlbHQuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgZSA9PiB7IGUucHJldmVudERlZmF1bHQoKTsgfSwgZmFsc2UpO1xuXHR0aGlzLiRlbC5hcHBlbmRDaGlsZChlbHQpO1xuXHRjYWNoZS5lbGVtZW50cy5wdXNoKGVsdCk7XG4gICAgICB9XG4gICAgICBjb25zb2xlLmxvZyhcIkRvbmUgdGhhdFwiKTtcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyhcIlJlbmRlciB3aWR0aCA9IFwiICsgcmVuZGVyaW5nQ29udGV4dC53aWR0aCk7XG5cbiAgICBsZXQgc3RhcnRYID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChjYWNoZS5zdGFydFRpbWUpO1xuICAgIGNvbnN0IGRyYXduV2lkdGggPSByZW5kZXJpbmdDb250ZXh0LndpZHRoIC0gc3RhcnRYO1xuICAgIGxldCB3aWR0aFNjYWxlRmFjdG9yID0gZHJhd25XaWR0aCAvIGNhY2hlLnRvdGFsV2lkdGg7XG5cbiAgICBpZiAoY2FjaGUuc3RlcER1cmF0aW9uID4gMCkge1xuICAgICAgbGV0IHRvdGFsRHVyYXRpb24gPSBjYWNoZS5zdGVwRHVyYXRpb24gKiBjYWNoZS50b3RhbFdpZHRoO1xuICAgICAgbGV0IGVuZFggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKGNhY2hlLnN0YXJ0VGltZSArIHRvdGFsRHVyYXRpb24pO1xuICAgICAgd2lkdGhTY2FsZUZhY3RvciA9IChlbmRYIC0gc3RhcnRYKSAvIGNhY2hlLnRvdGFsV2lkdGg7XG4gICAgfVxuICAgIFxuICAgIGxldCB3aWR0aEFjY3VtdWxhdGVkID0gMDtcbiAgICBcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNhY2hlLmVsZW1lbnRzLmxlbmd0aDsgKytpKSB7XG4gICAgICBjb25zdCBlbHQgPSBjYWNoZS5lbGVtZW50c1tpXTtcbiAgICAgIGNvbnN0IHRpbGVXaWR0aCA9IGNhY2hlLnRpbGVXaWR0aHNbaV07XG4gICAgICBjb25zdCB4ID0gc3RhcnRYICsgd2lkdGhBY2N1bXVsYXRlZCAqIHdpZHRoU2NhbGVGYWN0b3I7XG4gICAgICBjb25zdCB3ID0gdGlsZVdpZHRoICogd2lkdGhTY2FsZUZhY3RvcjtcbiAgICAgIGNvbnN0IHZpc2libGUgPSAoeCArIHcgPiAwICYmIHggPCByZW5kZXJpbmdDb250ZXh0Lm1heFgpO1xuICAgICAgaWYgKHZpc2libGUpIHtcbiAgICAgICAgZWx0LnNldEF0dHJpYnV0ZU5TKG51bGwsICd4JywgTWF0aC5mbG9vcih4KSk7XG4gICAgICAgIGVsdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCBNYXRoLmNlaWwoeCArIHcpIC0gTWF0aC5mbG9vcih4KSk7XG4gICAgICAgIGVsdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneScsIDApO1xuICAgICAgICBlbHQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0KTtcbiAgICAgICAgZWx0LnNldEF0dHJpYnV0ZU5TKG51bGwsICd2aXNpYmlsaXR5JywgJ3Zpc2libGUnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndmlzaWJpbGl0eScsICdoaWRkZW4nKTtcbiAgICAgIH1cbiAgICAgIHdpZHRoQWNjdW11bGF0ZWQgKz0gdGlsZVdpZHRoO1xuICAgIH1cbiAgICBcbiAgICBjb25zdCBhZnRlciA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIGNvbnNvbGUubG9nKFwibWF0cml4IHVwZGF0ZSB0aW1lID0gXCIgKyBNYXRoLnJvdW5kKGFmdGVyIC0gYmVmb3JlKSk7XG4gIH1cbn1cbiJdfQ==