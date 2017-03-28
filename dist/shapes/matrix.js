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
      //    this.lastUpdateHop = 0;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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U2hhcGUgZnJvbSAnLi9iYXNlLXNoYXBlJztcbmltcG9ydCBUaW1lbGluZVRpbWVDb250ZXh0IGZyb20gJy4uL2NvcmUvdGltZWxpbmUtdGltZS1jb250ZXh0JztcbmltcG9ydCBMYXllclRpbWVDb250ZXh0IGZyb20gJy4uL2NvcmUvbGF5ZXItdGltZS1jb250ZXh0JztcbmltcG9ydCBQTkdFbmNvZGVyIGZyb20gJy4uL3V0aWxzL3BuZy5qcyc7XG5cbmNvbnN0IHhodG1sTlMgPSAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hdHJpeCBleHRlbmRzIEJhc2VTaGFwZSB7XG5cbiAgZ2V0Q2xhc3NOYW1lKCkge1xuICAgIHJldHVybiAnbWF0cml4JztcbiAgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgLy8gcmV0dXJuIHsgeTogMCB9O1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIC8vIFRPRE8gZGV0ZXJtaW5lIHN1aXRhYmxlIGltcGxlbWVudGF0aW9ucyBmb3IgX2dldEFjY2Vzc29yTGlzdCBhbmQgX2dldERlZmF1bHRzXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbm9ybWFsaXNlOiAnbm9uZScsXG4gICAgICBtYXBwZXI6ICh2YWx1ZSA9PiB7XG4gICAgICAgIC8vIFRoZSBtYXBwZXIgYWNjZXB0cyBhIHZhbHVlLCB3aGljaCBpcyBndWFyYW50ZWVkIHRvIGJlIGluXG4gICAgICAgIC8vIHRoZSByYW5nZSBbMCwxXSwgYW5kIHJldHVybnMgciwgZywgYiBjb21wb25lbnRzIHdoaWNoIGFyZVxuICAgICAgICAvLyBhbHNvIGluIHRoZSByYW5nZSBbMCwxXS4gVGhpcyBleGFtcGxlIG1hcHBlciBqdXN0IHJldHVybnMgYVxuICAgICAgICAvLyBncmV5IGxldmVsLlxuICAgICAgICBsZXQgbGV2ZWwgPSAxLjAgLSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIFsgbGV2ZWwsIGxldmVsLCBsZXZlbCBdO1xuICAgICAgfSksXG4gICAgICBnYWluOiAxLjAsXG4gICAgICBzbW9vdGhpbmc6IGZhbHNlIC8vIE5CIHdpdGggc21vb3RoaW5nIHdlIGdldCB2aXNpYmxlIGpvaW5zIGF0IHRpbGUgYm91bmRhcmllc1xuICAgIH07XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ3R4KSB7XG4gICAgY29uc29sZS5sb2coXCJtYXRyaXggcmVuZGVyIGNhbGxlZFwiKTtcbiAgICBpZiAodGhpcy4kZWwpIHsgcmV0dXJuIHRoaXMuJGVsOyB9XG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2cnKTtcbiAgICBpZiAoIXRoaXMucGFyYW1zLnNtb290aGluZykge1xuICAgICAgLy8gZm9yIENocm9tZVxuICAgICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ltYWdlLXJlbmRlcmluZycsICdwaXhlbGF0ZWQnKTtcbiAgICB9XG4vLyAgICB0aGlzLmxhc3RVcGRhdGVIb3AgPSAwO1xuICAgIGNvbnNvbGUubG9nKFwibWF0cml4IHJlbmRlciByZXR1cm5pbmdcIik7XG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgX2h5YnJpZE5vcm1hbGlzZShnYWluKSB7XG4gICAgcmV0dXJuIChjb2wgPT4ge1xuICAgICAgbGV0IG1heCA9IDAuMDtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29sLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IE1hdGguYWJzKGNvbFtpXSk7XG4gICAgICAgIGlmICh2YWx1ZSA+IG1heCkge1xuICAgICAgICAgIG1heCA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsZXQgc2NhbGUgPSBnYWluO1xuICAgICAgaWYgKG1heCA+IDAuMCkge1xuICAgICAgICBzY2FsZSA9IHNjYWxlICogKE1hdGgubG9nMTAobWF4ICsgMS4wKSAvIG1heCk7XG4gICAgICB9XG4gICAgICBsZXQgbiA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb2wubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gY29sW2ldO1xuICAgICAgICBuLnB1c2godmFsdWUgKiBzY2FsZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbjtcbiAgICB9KTtcbiAgfVxuXG4gIF9jb2x1bW5Ob3JtYWxpc2UoZ2Fpbikge1xuICAgIHJldHVybiAoY29sID0+IHtcbiAgICAgIGxldCBtYXggPSAwLjA7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbC5sZW5ndGg7ICsraSkge1xuICAgICAgICBsZXQgdmFsdWUgPSBNYXRoLmFicyhjb2xbaV0pO1xuICAgICAgICBpZiAodmFsdWUgPiBtYXgpIHtcbiAgICAgICAgICBtYXggPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGV0IHNjYWxlID0gZ2FpbjtcbiAgICAgIGlmIChtYXggPiAwLjApIHtcbiAgICAgICAgc2NhbGUgPSBzY2FsZSAqICgxLjAgLyBtYXgpO1xuICAgICAgfVxuICAgICAgbGV0IG4gPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29sLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IGNvbFtpXTtcbiAgICAgICAgbi5wdXNoKHZhbHVlICogc2NhbGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG47XG4gICAgfSk7XG4gIH0gICAgICBcbiAgXG4gIF9ub05vcm1hbGlzZShnYWluKSB7XG4gICAgcmV0dXJuIChjb2wgPT4ge1xuICAgICAgbGV0IG4gPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29sLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IGNvbFtpXTtcbiAgICAgICAgbi5wdXNoKHZhbHVlICogZ2Fpbik7XG4gICAgICB9XG4gICAgICByZXR1cm4gbjtcbiAgICB9KTtcbiAgfSAgICAgIFxuICBcbiAgZW5jYWNoZShtYXRyaXhFbnRpdHkpIHtcblxuICAgIGNvbnN0IGJlZm9yZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gICAgY29uc29sZS5sb2coXCJtYXRyaXggY2FjaGUgY2FsbGVkXCIpO1xuXG4gICAgY29uc3QgaGVpZ2h0ID0gbWF0cml4RW50aXR5LmdldENvbHVtbkhlaWdodCgpO1xuICAgIGNvbnN0IHRvdGFsV2lkdGggPSBtYXRyaXhFbnRpdHkuZ2V0Q29sdW1uQ291bnQoKTtcbiAgICBsZXQgdGlsZVdpZHRoID0gMTAwO1xuICAgIGlmICh0b3RhbFdpZHRoIDwgdGlsZVdpZHRoICogMikge1xuICAgICAgdGlsZVdpZHRoID0gdG90YWxXaWR0aDtcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyhcInRvdGFsV2lkdGggPSBcIiArIHRvdGFsV2lkdGggKyBcIiwgdGlsZVdpZHRoID0gXCIgKyB0aWxlV2lkdGgpO1xuXG4gICAgbGV0IHJlc291cmNlcyA9IFtdO1xuICAgIGxldCB3aWR0aHMgPSBbXTtcblxuICAgIGxldCBub3JtYWxpc2UgPSBudWxsO1xuXG4gICAgc3dpdGNoICh0aGlzLnBhcmFtcy5ub3JtYWxpc2UpIHtcbiAgICBjYXNlICdoeWJyaWQnOlxuICAgICAgbm9ybWFsaXNlID0gdGhpcy5faHlicmlkTm9ybWFsaXNlKHRoaXMucGFyYW1zLmdhaW4pO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnY29sdW1uJzpcbiAgICAgIG5vcm1hbGlzZSA9IHRoaXMuX2NvbHVtbk5vcm1hbGlzZSh0aGlzLnBhcmFtcy5nYWluKTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBub3JtYWxpc2UgPSB0aGlzLl9ub05vcm1hbGlzZSh0aGlzLnBhcmFtcy5nYWluKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbmRpdGlvbiA9IChjb2wgPT4ge1xuICAgICAgbGV0IG4gPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29sLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGlmIChjb2xbaV0gPT09IEluZmluaXR5IHx8IGlzTmFOKGNvbFtpXSkpIG4ucHVzaCgwLjApO1xuICAgICAgICBlbHNlIG4ucHVzaChjb2xbaV0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG47XG4gICAgfSk7XG5cbiAgICBjb25zdCB1c3VhbFdpZHRoID0gdGlsZVdpZHRoO1xuICAgIGNvbnN0IHVzdWFsRW5jb2RlciA9IG5ldyBQTkdFbmNvZGVyKHVzdWFsV2lkdGgsIGhlaWdodCwgMjU2KTtcbiAgICBcbiAgICBmb3IgKGxldCB4MCA9IDA7IHgwIDwgdG90YWxXaWR0aDsgeDAgKz0gdGlsZVdpZHRoKSB7XG5cbiAgICAgIGxldCB3ID0gdGlsZVdpZHRoO1xuICAgICAgaWYgKHRvdGFsV2lkdGggLSB4MCA8IHRpbGVXaWR0aCkge1xuXHR3ID0gdG90YWxXaWR0aCAtIHgwO1xuICAgICAgfVxuICAgICAgXG4gICAgICBsZXQgcCA9ICh3ID09PSB0aWxlV2lkdGggP1xuICAgICAgICAgICAgICAgdXN1YWxFbmNvZGVyIDpcbiAgICAgICAgICAgICAgIG5ldyBQTkdFbmNvZGVyKHcsIGhlaWdodCwgMjU2KSk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdzsgKytpKSB7XG5cblx0Y29uc3QgeCA9IHgwICsgaTtcbiAgICAgICAgbGV0IGNvbCA9IG1hdHJpeEVudGl0eS5nZXRDb2x1bW4oeCk7XG4gICAgICAgIGNvbCA9IG5vcm1hbGlzZShjb25kaXRpb24oY29sKSk7XG4gICAgICAgIFxuXHRmb3IgKGxldCB5ID0gMDsgeSA8IGhlaWdodDsgKyt5KSB7XG4gICAgICAgICAgbGV0IHZhbHVlID0gY29sW3ldO1xuICAgICAgICAgIC8vIFRoZSB2YWx1ZSBtdXN0IGJlIGluIHRoZSByYW5nZSBbMCwxXSB0byBwYXNzIHRvIHRoZVxuICAgICAgICAgIC8vIG1hcHBlci4gV2UgYWxzbyBxdWFudGl6ZSB0aGUgcmFuZ2UsIGFzIHRoZSBQTkcgZW5jb2RlclxuICAgICAgICAgIC8vIHVzZXMgYSAyNTYtbGV2ZWwgcGFsZXR0ZS5cbiAgICAgICAgICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDA7XG4gICAgICAgICAgaWYgKHZhbHVlID4gMSkgdmFsdWUgPSAxO1xuICAgICAgICAgIHZhbHVlID0gTWF0aC5yb3VuZCh2YWx1ZSAqIDI1NSkgLyAyNTU7XG4gICAgICAgICAgbGV0IFsgciwgZywgYiBdID0gdGhpcy5wYXJhbXMubWFwcGVyKHZhbHVlKTtcbiAgICAgICAgICBpZiAociA8IDApIHIgPSAwO1xuICAgICAgICAgIGlmIChyID4gMSkgciA9IDE7XG4gICAgICAgICAgaWYgKGcgPCAwKSBnID0gMDtcbiAgICAgICAgICBpZiAoZyA+IDEpIGcgPSAxO1xuICAgICAgICAgIGlmIChiIDwgMCkgYiA9IDA7XG4gICAgICAgICAgaWYgKGIgPiAxKSBiID0gMTtcbiAgICAgICAgICBjb25zdCBjb2xvdXIgPSBwLmNvbG9yKE1hdGgucm91bmQociAqIDI1NSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnJvdW5kKGcgKiAyNTUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5yb3VuZChiICogMjU1KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDI1NSk7XG4gICAgICAgICAgY29uc3QgaW5kZXggPSBwLmluZGV4KGksIHkpO1xuXHQgIHAuYnVmZmVyW2luZGV4XSA9IGNvbG91cjtcblx0fVxuICAgICAgfVxuXG4gICAgICBjb25zdCByZXNvdXJjZSA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsJyArIHAuZ2V0QmFzZTY0KCk7XG4gICAgICByZXNvdXJjZXMucHVzaChyZXNvdXJjZSk7XG4gICAgICB3aWR0aHMucHVzaCh3KTtcblxuICAgICAgY29uc29sZS5sb2coXCJpbWFnZSBcIiArIHJlc291cmNlcy5sZW5ndGggKyBcIjogbGVuZ3RoIFwiICsgcmVzb3VyY2UubGVuZ3RoICtcblx0XHQgIFwiIChkaW1lbnNpb25zIFwiICsgdyArIFwiIHggXCIgKyBoZWlnaHQgKyBcIilcIik7XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coXCJkcmF3aW5nIGNvbXBsZXRlXCIpO1xuXG4gICAgY29uc3QgYWZ0ZXIgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICBjb25zb2xlLmxvZyhcIm1hdHJpeCBjYWNoZSB0aW1lID0gXCIgKyBNYXRoLnJvdW5kKGFmdGVyIC0gYmVmb3JlKSk7XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc291cmNlczogcmVzb3VyY2VzLFxuICAgICAgdGlsZVdpZHRoczogd2lkdGhzLFxuICAgICAgdG90YWxXaWR0aDogdG90YWxXaWR0aCxcbiAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgc3RhcnRUaW1lOiBtYXRyaXhFbnRpdHkuZ2V0U3RhcnRUaW1lKCksXG4gICAgICBzdGVwRHVyYXRpb246IG1hdHJpeEVudGl0eS5nZXRTdGVwRHVyYXRpb24oKSxcbiAgICAgIGVsZW1lbnRzOiBbXSAvLyB3aWxsIGJlIGluc3RhbGxlZCBpbiBmaXJzdCBjYWxsIHRvIHVwZGF0ZVxuICAgIH07XG4gIH1cbiAgXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBjYWNoZSkge1xuXG4gICAgY29uc3QgYmVmb3JlID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cbiAgICBjb25zb2xlLmxvZyhcIm1hdHJpeCB1cGRhdGUgY2FsbGVkXCIpO1xuXG4gICAgaWYgKCFjYWNoZS50b3RhbFdpZHRoIHx8ICFjYWNoZS5oZWlnaHQgfHxcblx0IXJlbmRlcmluZ0NvbnRleHQud2lkdGggfHwgIXJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0KSB7XG4gICAgICBjb25zb2xlLmxvZyhcIm5vdGhpbmcgdG8gdXBkYXRlXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChjYWNoZS5lbGVtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiQWJvdXQgdG8gYWRkIFwiICsgY2FjaGUucmVzb3VyY2VzLmxlbmd0aCArXG5cdFx0ICBcIiBpbWFnZSByZXNvdXJjZXMgdG8gU1ZHLi4uXCIpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjYWNoZS5yZXNvdXJjZXMubGVuZ3RoOyArK2kpIHtcblx0Y29uc3QgcmVzb3VyY2UgPSBjYWNoZS5yZXNvdXJjZXNbaV07XG5cdGNvbnN0IGVsdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnaW1hZ2UnKTtcblx0ZWx0LnNldEF0dHJpYnV0ZU5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJywgJ2hyZWYnLCByZXNvdXJjZSk7XG4gICAgICAgIGVsdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAncHJlc2VydmVBc3BlY3RSYXRpbycsICdub25lJyk7XG4gICAgICAgIGlmICghdGhpcy5wYXJhbXMuc21vb3RoaW5nKSB7XG4gICAgICAgICAgLy8gZm9yIEZpcmVmb3hcblx0ICBlbHQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ltYWdlLXJlbmRlcmluZycsICdvcHRpbWl6ZVNwZWVkJyk7XG4gICAgICAgIH1cblx0ZWx0LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIGUgPT4geyBlLnByZXZlbnREZWZhdWx0KCk7IH0sIGZhbHNlKTtcblx0dGhpcy4kZWwuYXBwZW5kQ2hpbGQoZWx0KTtcblx0Y2FjaGUuZWxlbWVudHMucHVzaChlbHQpO1xuICAgICAgfVxuICAgICAgY29uc29sZS5sb2coXCJEb25lIHRoYXRcIik7XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coXCJSZW5kZXIgd2lkdGggPSBcIiArIHJlbmRlcmluZ0NvbnRleHQud2lkdGgpO1xuXG4gICAgbGV0IHN0YXJ0WCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoY2FjaGUuc3RhcnRUaW1lKTtcbiAgICBjb25zdCBkcmF3bldpZHRoID0gcmVuZGVyaW5nQ29udGV4dC53aWR0aCAtIHN0YXJ0WDtcbiAgICBsZXQgd2lkdGhTY2FsZUZhY3RvciA9IGRyYXduV2lkdGggLyBjYWNoZS50b3RhbFdpZHRoO1xuXG4gICAgaWYgKGNhY2hlLnN0ZXBEdXJhdGlvbiA+IDApIHtcbiAgICAgIGxldCB0b3RhbER1cmF0aW9uID0gY2FjaGUuc3RlcER1cmF0aW9uICogY2FjaGUudG90YWxXaWR0aDtcbiAgICAgIGxldCBlbmRYID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChjYWNoZS5zdGFydFRpbWUgKyB0b3RhbER1cmF0aW9uKTtcbiAgICAgIHdpZHRoU2NhbGVGYWN0b3IgPSAoZW5kWCAtIHN0YXJ0WCkgLyBjYWNoZS50b3RhbFdpZHRoO1xuICAgIH1cbiAgICBcbiAgICBsZXQgd2lkdGhBY2N1bXVsYXRlZCA9IDA7XG4gICAgXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjYWNoZS5lbGVtZW50cy5sZW5ndGg7ICsraSkge1xuICAgICAgY29uc3QgZWx0ID0gY2FjaGUuZWxlbWVudHNbaV07XG4gICAgICBjb25zdCB0aWxlV2lkdGggPSBjYWNoZS50aWxlV2lkdGhzW2ldO1xuICAgICAgY29uc3QgeCA9IHN0YXJ0WCArIHdpZHRoQWNjdW11bGF0ZWQgKiB3aWR0aFNjYWxlRmFjdG9yO1xuICAgICAgY29uc3QgdyA9IHRpbGVXaWR0aCAqIHdpZHRoU2NhbGVGYWN0b3I7XG4gICAgICBjb25zdCB2aXNpYmxlID0gKHggKyB3ID4gMCAmJiB4IDwgcmVuZGVyaW5nQ29udGV4dC5tYXhYKTtcbiAgICAgIGlmICh2aXNpYmxlKSB7XG4gICAgICAgIGVsdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneCcsIE1hdGguZmxvb3IoeCkpO1xuICAgICAgICBlbHQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgTWF0aC5jZWlsKHggKyB3KSAtIE1hdGguZmxvb3IoeCkpO1xuICAgICAgICBlbHQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3knLCAwKTtcbiAgICAgICAgZWx0LnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCByZW5kZXJpbmdDb250ZXh0LmhlaWdodCk7XG4gICAgICAgIGVsdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndmlzaWJpbGl0eScsICd2aXNpYmxlJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbHQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3Zpc2liaWxpdHknLCAnaGlkZGVuJyk7XG4gICAgICB9XG4gICAgICB3aWR0aEFjY3VtdWxhdGVkICs9IHRpbGVXaWR0aDtcbiAgICB9XG4gICAgXG4gICAgY29uc3QgYWZ0ZXIgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICBjb25zb2xlLmxvZyhcIm1hdHJpeCB1cGRhdGUgdGltZSA9IFwiICsgTWF0aC5yb3VuZChhZnRlciAtIGJlZm9yZSkpO1xuICB9XG59XG4iXX0=