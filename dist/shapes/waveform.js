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

var _utilsOversample = require('../utils/oversample');

var _utilsOversample2 = _interopRequireDefault(_utilsOversample);

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
      return {};
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {
        sampleRate: 44100,
        color: '#000000',
        opacity: 1,
        peakCacheBlockSize: 32
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
      this.$el.setAttributeNS(null, 'stroke', this.params.color);
      this.$el.style.opacity = this.params.opacity;

      this.factor = 8;
      this.oversampler = new _utilsOversample2['default'](this.factor);

      return this.$el;
    }
  }, {
    key: 'encache',
    value: function encache(samples) {

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

      var blockSize = this.params.peakCacheBlockSize;

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
        if (startSample < 0) continue;
        if (startSample >= samples.length) break;

        var endSample = pixelToSample(px + 1);
        if (endSample >= samples.length) endSample = samples.length;
        if (endSample < 0) continue;

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
    key: '_updateSummarising',
    value: function _updateSummarising(renderingContext, cache, pixelToSample) {

      var minX = renderingContext.minX;
      var maxX = renderingContext.maxX;

      // get min/max values per pixel
      var minMax = this.summarise(cache, minX, maxX, pixelToSample);
      if (!minMax.length) {
        return;
      }

      var instructions = minMax.map(function (datum) {
        var _datum = _slicedToArray(datum, 3);

        var x = _datum[0];
        var min = _datum[1];
        var max = _datum[2];

        var y1 = Math.round(renderingContext.valueToPixel(min));
        var y2 = Math.round(renderingContext.valueToPixel(max));
        return x + ',' + y1 + 'L' + x + ',' + y2;
      });

      var d = 'M' + instructions.join('L');
      this.$el.setAttributeNS(null, 'shape-rendering', 'crispEdges');
      this.$el.setAttributeNS(null, 'stroke-width', 1.0);
      this.$el.setAttributeNS(null, 'd', d);
    }
  }, {
    key: '_updateInterpolating',
    value: function _updateInterpolating(renderingContext, cache, pixelToSample, sampleToPixel) {

      var minX = renderingContext.minX;
      var maxX = renderingContext.maxX;

      var s0 = pixelToSample(minX);
      var s1 = pixelToSample(maxX) + 1;

      var samples = cache.samples;
      var n = samples.length;

      var instructions = [];

      // Pixel coordinates in this function are *not* rounded, we want
      // to preserve the proper shape as far as possible

      // Add a little square for each sample location

      for (var i = s0; i < s1 && i < n; ++i) {
        if (i < 0) continue;
        var x = sampleToPixel(i);
        var y = renderingContext.valueToPixel(samples[i]);
        instructions.push('M' + (x - 1) + ',' + (y - 1) + 'h2v2h-2v-2');
      }

      // Now fill in the gaps between the squares

      var factor = this.factor;
      var oversampled = this.oversampler.oversample(samples, s0, s1 - s0);

      for (var i = 0; i < oversampled.length; ++i) {
        var x = sampleToPixel(s0 + i / factor); // sampleToPixel accepts non-integers
        var y = renderingContext.valueToPixel(oversampled[i]);
        if (i === 0) {
          instructions.push('M' + x + ',' + y);
        } else {
          instructions.push('L' + x + ',' + y);
        }
      }

      var d = instructions.join('');
      this.$el.setAttributeNS(null, 'shape-rendering', 'geometricPrecision');
      this.$el.setAttributeNS(null, 'stroke-width', 0.6);
      this.$el.setAttributeNS(null, 'd', d);
    }
  }, {
    key: 'update',
    value: function update(renderingContext, cache) {
      var _this = this;

      var before = performance.now();

      var sampleRate = this.params.sampleRate;
      var minX = renderingContext.minX;

      var step = sampleRate * (renderingContext.timeToPixel.invert(minX + 1) - renderingContext.timeToPixel.invert(minX));

      var snapToCacheBoundaries = step >= this.params.peakCacheBlockSize * 2;

      var pixelToSampleSnapped = function pixelToSampleSnapped(pixel) {
        return _this.params.peakCacheBlockSize * Math.floor(sampleRate * renderingContext.timeToPixel.invert(pixel) / _this.params.peakCacheBlockSize);
      };
      var pixelToSampleUnsnapped = function pixelToSampleUnsnapped(pixel) {
        return Math.floor(sampleRate * renderingContext.timeToPixel.invert(pixel));
      };
      var pixelToSample = snapToCacheBoundaries ? pixelToSampleSnapped : pixelToSampleUnsnapped;

      var sampleToPixel = function sampleToPixel(sample) {
        // neither snapped nor even rounded to integer pixel
        return renderingContext.timeToPixel(sample / sampleRate);
      };

      if (step > 1.0) {
        this._updateSummarising(renderingContext, cache, pixelToSample);
      } else {
        this._updateInterpolating(renderingContext, cache, pixelToSample, sampleToPixel);
      }

      var after = performance.now();
      console.log("waveform update time = " + Math.round(after - before));
    }
  }]);

  return Waveform;
})(_baseShape2['default']);

exports['default'] = Waveform;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUNuRCxhQUFhLEVBQUUsYUFBYSxDQUFDLENBQUM7T0FDN0I7O0FBRUQsVUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ2hDLGFBQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztLQUNyRTs7O1NBdlNrQixRQUFROzs7cUJBQVIsUUFBUSIsImZpbGUiOiJzcmMvc2hhcGVzL3dhdmVmb3JtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuL2Jhc2Utc2hhcGUnO1xuaW1wb3J0IE92ZXJzYW1wbGVyIGZyb20gJy4uL3V0aWxzL292ZXJzYW1wbGUnO1xuXG5jb25zdCB4aHRtbE5TID0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnO1xuXG4vKipcbiAqIEEgc2hhcGUgdG8gZGlzcGxheSBhIHdhdmVmb3JtLiAoZm9yIGVudGl0eSBkYXRhKVxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLXdhdmVmb3JtLmh0bWwpXG4gKlxuICogQHRvZG8gLSBmaXggcHJvYmxlbXMgd2l0aCBjYW52YXMgc3RyYXRlZ3kuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdhdmVmb3JtIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ3dhdmVmb3JtJzsgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBzYW1wbGVSYXRlOiA0NDEwMCxcbiAgICAgIGNvbG9yOiAnIzAwMDAwMCcsXG4gICAgICBvcGFjaXR5OiAxLFxuICAgICAgcGVha0NhY2hlQmxvY2tTaXplOiAzMixcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICBpZiAodGhpcy4kZWwpIHsgcmV0dXJuIHRoaXMuJGVsOyB9XG5cbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncGF0aCcpO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgJ25vbmUnKTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlJywgdGhpcy5wYXJhbXMuY29sb3IpO1xuICAgIHRoaXMuJGVsLnN0eWxlLm9wYWNpdHkgPSB0aGlzLnBhcmFtcy5vcGFjaXR5O1xuXG4gICAgdGhpcy5mYWN0b3IgPSA4O1xuICAgIHRoaXMub3ZlcnNhbXBsZXIgPSBuZXcgT3ZlcnNhbXBsZXIodGhpcy5mYWN0b3IpO1xuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgZW5jYWNoZShzYW1wbGVzKSB7XG5cbiAgICAvLyBUaGUgY2FjaGUgaXMgYW4gYXJyYXkgb2YgcGVhayBjYWNoZXMgKGhvbGRpbmcgdGhlIG1pbiBhbmQgbWF4XG4gICAgLy8gdmFsdWVzIHdpdGhpbiBlYWNoIGJsb2NrIGZvciBhIGdpdmVuIGJsb2NrIHNpemUpIHdpdGggZWFjaCBwZWFrXG4gICAgLy8gY2FjaGUgcmVwcmVzZW50ZWQgYXMgYW4gb2JqZWN0IHdpdGggYmxvY2tTaXplLCBtaW4gYXJyYXksIGFuZFxuICAgIC8vIG1heCBhcnJheSBwcm9wZXJ0aWVzLlxuICAgIC8vXG4gICAgLy8gRm9yIGV4YW1wbGU6XG4gICAgLy8gICAgXG4gICAgLy8gWyB7XG4gICAgLy8gICAgIGJsb2NrU2l6ZTogMTYsXG4gICAgLy8gICAgIG1heDogWyAwLjcsICAwLjUsIDAuMjUsIC0wLjEgXSxcbiAgICAvLyAgICAgbWluOiBbIDAuNSwgLTAuMSwgLTAuOCwgLTAuMiBdXG4gICAgLy8gICB9LCB7XG4gICAgLy8gICAgIGJsb2NrU2l6ZTogMzIsIFxuICAgIC8vICAgICBtYXg6IFsgIDAuNywgIDAuMjUgXSxcbiAgICAvLyAgICAgbWluOiBbIC0wLjEsIC0wLjggIF1cbiAgICAvLyAgIH1cbiAgICAvLyBdXG4gICAgLy9cbiAgICAvLyBBcyBpdCBoYXBwZW5zIHdlIGFyZSBvbmx5IGNyZWF0aW5nIGEgY2FjaGUgd2l0aCBhIHNpbmdsZSBibG9ja1xuICAgIC8vIHNpemUgYXQgdGhlIG1vbWVudCwgYnV0IGl0J3MgdXNlZnVsIHRvIHJlY29yZCB0aGF0IGJsb2NrIHNpemVcbiAgICAvLyBpbiB0aGUgY2FjaGUgcmF0aGVyIHRoYW4gaGF2ZSB0byBmaXggaXQgaGVyZSBpbiB0aGUgc2hhcGUuXG5cbiAgICBjb25zdCBiZWZvcmUgPSBwZXJmb3JtYW5jZS5ub3coKTtcblxuICAgIGNvbnN0IHBlYWtDYWNoZUZvciA9ICgoYXJyLCBibG9ja1NpemUpID0+IHtcbiAgICBcbiAgICAgIGxldCBwZWFrcyA9IFtdLCB0cm91Z2hzID0gW107XG5cbiAgICAgIGNvbnN0IGxlbiA9IGFyci5sZW5ndGg7XG4gICAgXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSA9IGkgKyBibG9ja1NpemUpIHtcbiAgICAgICAgbGV0IG1pbiA9IGFycltpXTtcbiAgICAgICAgbGV0IG1heCA9IGFycltpXTtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBibG9ja1NpemU7IGorKykge1xuICAgICAgICAgIGxldCBzYW1wbGUgPSBhcnJbaSArIGpdO1xuICAgICAgICAgIGlmIChzYW1wbGUgPCBtaW4pIHsgbWluID0gc2FtcGxlOyB9XG4gICAgICAgICAgaWYgKHNhbXBsZSA+IG1heCkgeyBtYXggPSBzYW1wbGU7IH1cbiAgICAgICAgfVxuICAgICAgICBwZWFrcy5wdXNoKG1heCk7XG4gICAgICAgIHRyb3VnaHMucHVzaChtaW4pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gWyBwZWFrcywgdHJvdWdocyBdO1xuICAgIH0pO1xuXG4gICAgLy8gRm9yIGEgc2luZ2xlIHBlYWsgY2FjaGUsIGV4cGVyaW1lbnQgc3VnZ2VzdHMgc21hbGxpc2ggYmxvY2tcbiAgICAvLyBzaXplcyBhcmUgYmV0dGVyLiBUaGVyZSdzIG5vIGJlbmVmaXQgaW4gaGF2aW5nIG11bHRpcGxlIGxheWVyc1xuICAgIC8vIG9mIGNhY2hlIChlLmcuIDMyIGFuZCA1MTIpIHVubGVzcyB1cGRhdGUoKSBjYW4gdGFrZSBhZHZhbnRhZ2VcbiAgICAvLyBvZiBib3RoIGluIGEgc2luZ2xlIHN1bW1hcmlzZSBhY3Rpb24gKGUuZy4gd2hlbiBhc2tlZCBmb3IgYVxuICAgIC8vIHJlYWQgZnJvbSAzMTAgdG8gMTA1MCwgc3RhcnQgYnkgcmVhZGluZyBzaW5nbGUgc2FtcGxlcyBmcm9tIDMxMFxuICAgIC8vIHRvIDMyMCwgdGhlbiBmcm9tIHRoZSAzMi1zYW1wbGUgY2FjaGUgZnJvbSAzMjAgdG8gNTEyLCB0aGVuXG4gICAgLy8gc3dpdGNoIHRvIHRoZSA1MTIgc2FtcGxlIGNhY2hlLCByYXRoZXIgdGhhbiBoYXZpbmcgdG8gcmVhZFxuICAgIC8vIHNpbmdsZSBzYW1wbGVzIGFsbCB0aGUgd2F5IGZyb20gMzEwIHRvIDUxMikuLi4gYnV0IGF0IHRoZVxuICAgIC8vIG1vbWVudCBpdCBjYW4ndC4gQW5kIHRoZSBtb3JlIGNvbXBsZXggbG9naWMgd291bGQgY2FycnkgaXRzIG93blxuICAgIC8vIG92ZXJoZWFkLlxuICAgIFxuICAgIGNvbnN0IGJsb2NrU2l6ZSA9IHRoaXMucGFyYW1zLnBlYWtDYWNoZUJsb2NrU2l6ZTtcbiAgICBsZXQgWyBwZWFrcywgdHJvdWdocyBdID0gcGVha0NhY2hlRm9yKHNhbXBsZXMsIGJsb2NrU2l6ZSk7XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgIHNhbXBsZXMsXG4gICAgICBwZWFrQ2FjaGVzOiBbXG4gICAgICAgIHsgYmxvY2tTaXplLFxuICAgICAgICAgIG1heDogcGVha3MsXG4gICAgICAgICAgbWluOiB0cm91Z2hzXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9O1xuICB9XG4gIFxuICBzdW1tYXJpc2UoY2FjaGUsIG1pblgsIG1heFgsIHBpeGVsVG9TYW1wbGUpIHtcblxuICAgIGNvbnN0IGJlZm9yZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gICAgY29uc3Qgc2FtcGxlcyA9IGNhY2hlLnNhbXBsZXM7XG4gICAgXG4gICAgY29uc3QgcHgwID0gTWF0aC5mbG9vcihtaW5YKTtcbiAgICBjb25zdCBweDEgPSBNYXRoLmZsb29yKG1heFgpO1xuXG4gICAgbGV0IHBlYWtDYWNoZSA9IG51bGw7XG4gICAgbGV0IHBlYWtDYWNoZUJsb2NrU2l6ZSA9IDA7XG5cbiAgICBpZiAoY2FjaGUgJiYgKGNhY2hlLnBlYWtDYWNoZXMubGVuZ3RoID4gMCkpIHtcblxuICAgICAgLy8gRmluZCBhIHN1aXRhYmxlIHBlYWsgY2FjaGUgaWYgd2UgaGF2ZSBvbmUuXG4gICAgICBcbiAgICAgIC8vIFwic3RlcFwiIGlzIHRoZSBkaXN0YW5jZSBpbiBzYW1wbGVzIGZyb20gb25lIHBpeGVsIHRvIHRoZSBuZXh0LlxuICAgICAgLy8gV2Ugd2FudCB0aGUgbGFyZ2VzdCBjYWNoZSB3aG9zZSBibG9jayBzaXplIGlzIG5vIGxhcmdlciB0aGFuXG4gICAgICAvLyBoYWxmIHRoaXMsIHNvIGFzIHRvIGF2b2lkIHNpdHVhdGlvbnMgd2hlcmUgb3VyIHN0ZXAgaXMgYWx3YXlzXG4gICAgICAvLyBzdHJhZGRsaW5nIGNhY2hlIGJsb2NrIGJvdW5kYXJpZXMuXG4gICAgICBjb25zdCBzdGVwID0gcGl4ZWxUb1NhbXBsZShweDAgKyAxKSAtIHBpeGVsVG9TYW1wbGUocHgwKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWNoZS5wZWFrQ2FjaGVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGNvbnN0IGJsb2NrU2l6ZSA9IGNhY2hlLnBlYWtDYWNoZXNbaV0uYmxvY2tTaXplO1xuICAgICAgICBpZiAoYmxvY2tTaXplID4gcGVha0NhY2hlQmxvY2tTaXplICYmIGJsb2NrU2l6ZSA8PSBzdGVwLzIpIHtcbiAgICAgICAgICBwZWFrQ2FjaGUgPSBjYWNoZS5wZWFrQ2FjaGVzW2ldO1xuICAgICAgICAgIHBlYWtDYWNoZUJsb2NrU2l6ZSA9IHBlYWtDYWNoZS5ibG9ja1NpemU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBzYW1wbGVSYXRlID0gdGhpcy5wYXJhbXMuc2FtcGxlUmF0ZTtcbiAgICBsZXQgbWluTWF4ID0gW107XG5cbiAgICBmb3IgKGxldCBweCA9IHB4MDsgcHggPCBweDE7IHB4KyspIHtcblxuICAgICAgY29uc3Qgc3RhcnRTYW1wbGUgPSBwaXhlbFRvU2FtcGxlKHB4KTtcbiAgICAgIGlmIChzdGFydFNhbXBsZSA8IDApIGNvbnRpbnVlO1xuICAgICAgaWYgKHN0YXJ0U2FtcGxlID49IHNhbXBsZXMubGVuZ3RoKSBicmVhaztcblxuICAgICAgbGV0IGVuZFNhbXBsZSA9IHBpeGVsVG9TYW1wbGUocHggKyAxKTtcbiAgICAgIGlmIChlbmRTYW1wbGUgPj0gc2FtcGxlcy5sZW5ndGgpIGVuZFNhbXBsZSA9IHNhbXBsZXMubGVuZ3RoO1xuICAgICAgaWYgKGVuZFNhbXBsZSA8IDApIGNvbnRpbnVlO1xuXG4gICAgICBsZXQgbWluID0gc2FtcGxlc1tzdGFydFNhbXBsZV07XG4gICAgICBsZXQgbWF4ID0gbWluO1xuICAgICAgXG4gICAgICBsZXQgaXggPSBzdGFydFNhbXBsZTtcblxuICAgICAgaWYgKHBlYWtDYWNoZSAmJiAocGVha0NhY2hlQmxvY2tTaXplID4gMCkpIHtcbiAgICAgIFxuICAgICAgICB3aGlsZSAoaXggPCBlbmRTYW1wbGUgJiYgKGl4ICUgcGVha0NhY2hlQmxvY2tTaXplKSAhPT0gMCkge1xuICAgICAgICAgIGxldCBzYW1wbGUgPSBzYW1wbGVzW2l4XTtcbiAgICAgICAgICBpZiAoc2FtcGxlIDwgbWluKSB7IG1pbiA9IHNhbXBsZTsgfVxuICAgICAgICAgIGlmIChzYW1wbGUgPiBtYXgpIHsgbWF4ID0gc2FtcGxlOyB9XG4gICAgICAgICAgKytpeDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjYWNoZUl4ID0gaXggLyBwZWFrQ2FjaGVCbG9ja1NpemU7XG4gICAgICAgIGNvbnN0IGNhY2hlTWF4ID0gcGVha0NhY2hlLm1heDtcbiAgICAgICAgY29uc3QgY2FjaGVNaW4gPSBwZWFrQ2FjaGUubWluO1xuICAgICAgXG4gICAgICAgIHdoaWxlIChpeCArIHBlYWtDYWNoZUJsb2NrU2l6ZSA8PSBlbmRTYW1wbGUpIHtcbiAgICAgICAgICBpZiAoY2FjaGVNYXhbY2FjaGVJeF0gPiBtYXgpIG1heCA9IGNhY2hlTWF4W2NhY2hlSXhdO1xuICAgICAgICAgIGlmIChjYWNoZU1pbltjYWNoZUl4XSA8IG1pbikgbWluID0gY2FjaGVNaW5bY2FjaGVJeF07XG4gICAgICAgICAgKytjYWNoZUl4O1xuICAgICAgICAgIGl4ID0gaXggKyBwZWFrQ2FjaGVCbG9ja1NpemU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgd2hpbGUgKGl4IDwgZW5kU2FtcGxlKSB7XG4gICAgICAgIGxldCBzYW1wbGUgPSBzYW1wbGVzW2l4XTtcbiAgICAgICAgaWYgKHNhbXBsZSA8IG1pbikgeyBtaW4gPSBzYW1wbGU7IH1cbiAgICAgICAgaWYgKHNhbXBsZSA+IG1heCkgeyBtYXggPSBzYW1wbGU7IH1cbiAgICAgICAgKytpeDtcbiAgICAgIH1cblxuICAgICAgbWluTWF4LnB1c2goW3B4LCBtaW4sIG1heF0pO1xuICAgIH1cblxuICAgIGNvbnN0IGFmdGVyID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgY29uc29sZS5sb2coXCJ3YXZlZm9ybSBzdW1tYXJpc2F0aW9uIHRpbWUgPSBcIiArIE1hdGgucm91bmQoYWZ0ZXIgLSBiZWZvcmUpKTtcbiAgICBcbiAgICByZXR1cm4gbWluTWF4O1xuICB9XG5cbiAgX3VwZGF0ZVN1bW1hcmlzaW5nKHJlbmRlcmluZ0NvbnRleHQsIGNhY2hlLCBwaXhlbFRvU2FtcGxlKSB7XG5cbiAgICBjb25zdCBtaW5YID0gcmVuZGVyaW5nQ29udGV4dC5taW5YO1xuICAgIGNvbnN0IG1heFggPSByZW5kZXJpbmdDb250ZXh0Lm1heFg7XG4gICAgXG4gICAgLy8gZ2V0IG1pbi9tYXggdmFsdWVzIHBlciBwaXhlbFxuICAgIGNvbnN0IG1pbk1heCA9IHRoaXMuc3VtbWFyaXNlKGNhY2hlLCBtaW5YLCBtYXhYLCBwaXhlbFRvU2FtcGxlKTtcbiAgICBpZiAoIW1pbk1heC5sZW5ndGgpIHsgcmV0dXJuOyB9XG5cbiAgICBsZXQgaW5zdHJ1Y3Rpb25zID0gbWluTWF4Lm1hcChkYXR1bSA9PiB7XG4gICAgICBjb25zdCBbIHgsIG1pbiwgbWF4IF0gPSBkYXR1bTtcbiAgICAgIGNvbnN0IHkxID0gTWF0aC5yb3VuZChyZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChtaW4pKTtcbiAgICAgIGNvbnN0IHkyID0gTWF0aC5yb3VuZChyZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChtYXgpKTtcbiAgICAgIHJldHVybiBgJHt4fSwke3kxfUwke3h9LCR7eTJ9YDtcbiAgICB9KTtcblxuICAgIGNvbnN0IGQgPSAnTScgKyBpbnN0cnVjdGlvbnMuam9pbignTCcpO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2Utd2lkdGgnLCAxLjApO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgZCk7XG4gIH1cblxuICBfdXBkYXRlSW50ZXJwb2xhdGluZyhyZW5kZXJpbmdDb250ZXh0LCBjYWNoZSwgcGl4ZWxUb1NhbXBsZSwgc2FtcGxlVG9QaXhlbCkge1xuXG4gICAgY29uc3QgbWluWCA9IHJlbmRlcmluZ0NvbnRleHQubWluWDtcbiAgICBjb25zdCBtYXhYID0gcmVuZGVyaW5nQ29udGV4dC5tYXhYO1xuXG4gICAgY29uc3QgczAgPSBwaXhlbFRvU2FtcGxlKG1pblgpO1xuICAgIGNvbnN0IHMxID0gcGl4ZWxUb1NhbXBsZShtYXhYKSArIDE7XG5cbiAgICBjb25zdCBzYW1wbGVzID0gY2FjaGUuc2FtcGxlcztcbiAgICBjb25zdCBuID0gc2FtcGxlcy5sZW5ndGg7XG5cbiAgICBsZXQgaW5zdHJ1Y3Rpb25zID0gW107XG5cbiAgICAvLyBQaXhlbCBjb29yZGluYXRlcyBpbiB0aGlzIGZ1bmN0aW9uIGFyZSAqbm90KiByb3VuZGVkLCB3ZSB3YW50XG4gICAgLy8gdG8gcHJlc2VydmUgdGhlIHByb3BlciBzaGFwZSBhcyBmYXIgYXMgcG9zc2libGVcblxuICAgIC8vIEFkZCBhIGxpdHRsZSBzcXVhcmUgZm9yIGVhY2ggc2FtcGxlIGxvY2F0aW9uXG4gICAgXG4gICAgZm9yIChsZXQgaSA9IHMwOyBpIDwgczEgJiYgaSA8IG47ICsraSkge1xuICAgICAgaWYgKGkgPCAwKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IHggPSBzYW1wbGVUb1BpeGVsKGkpO1xuICAgICAgY29uc3QgeSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHNhbXBsZXNbaV0pO1xuICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goYE0ke3gtMX0sJHt5LTF9aDJ2MmgtMnYtMmApO1xuICAgIH1cblxuICAgIC8vIE5vdyBmaWxsIGluIHRoZSBnYXBzIGJldHdlZW4gdGhlIHNxdWFyZXNcblxuICAgIGNvbnN0IGZhY3RvciA9IHRoaXMuZmFjdG9yO1xuICAgIGNvbnN0IG92ZXJzYW1wbGVkID0gdGhpcy5vdmVyc2FtcGxlci5vdmVyc2FtcGxlKHNhbXBsZXMsIHMwLCBzMSAtIHMwKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3ZlcnNhbXBsZWQubGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHggPSBzYW1wbGVUb1BpeGVsKHMwICsgaS9mYWN0b3IpOyAvLyBzYW1wbGVUb1BpeGVsIGFjY2VwdHMgbm9uLWludGVnZXJzXG4gICAgICBjb25zdCB5ID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwob3ZlcnNhbXBsZWRbaV0pO1xuICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goYE0ke3h9LCR7eX1gKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluc3RydWN0aW9ucy5wdXNoKGBMJHt4fSwke3l9YCk7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IGQgPSBpbnN0cnVjdGlvbnMuam9pbignJyk7XG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdnZW9tZXRyaWNQcmVjaXNpb24nKTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlLXdpZHRoJywgMC42KTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZCcsIGQpO1xuICB9XG4gIFxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgY2FjaGUpIHtcblxuICAgIGNvbnN0IGJlZm9yZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gICAgY29uc3Qgc2FtcGxlUmF0ZSA9IHRoaXMucGFyYW1zLnNhbXBsZVJhdGU7XG4gICAgY29uc3QgbWluWCA9IHJlbmRlcmluZ0NvbnRleHQubWluWDtcbiAgICBcbiAgICBjb25zdCBzdGVwID0gc2FtcGxlUmF0ZSAqIChyZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydChtaW5YICsgMSkgLVxuXHRcdFx0ICAgICAgIHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KG1pblgpKTtcblxuICAgIGNvbnN0IHNuYXBUb0NhY2hlQm91bmRhcmllcyA9IChzdGVwID49IHRoaXMucGFyYW1zLnBlYWtDYWNoZUJsb2NrU2l6ZSAqIDIpO1xuICAgIFxuICAgIGNvbnN0IHBpeGVsVG9TYW1wbGVTbmFwcGVkID0gKHBpeGVsID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnBhcmFtcy5wZWFrQ2FjaGVCbG9ja1NpemUgKlxuXHRNYXRoLmZsb29yICgoc2FtcGxlUmF0ZSAqIHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHBpeGVsKSkgL1xuXHRcdCAgICB0aGlzLnBhcmFtcy5wZWFrQ2FjaGVCbG9ja1NpemUpO1xuICAgIH0pO1xuICAgIGNvbnN0IHBpeGVsVG9TYW1wbGVVbnNuYXBwZWQgPSAocGl4ZWwgPT4ge1xuICAgICAgcmV0dXJuIE1hdGguZmxvb3IgKHNhbXBsZVJhdGUgKiByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydChwaXhlbCkpO1xuICAgIH0pO1xuICAgIGNvbnN0IHBpeGVsVG9TYW1wbGUgPSAoc25hcFRvQ2FjaGVCb3VuZGFyaWVzID9cblx0XHRcdCAgIHBpeGVsVG9TYW1wbGVTbmFwcGVkIDpcblx0XHRcdCAgIHBpeGVsVG9TYW1wbGVVbnNuYXBwZWQpO1xuICAgIFxuICAgIGNvbnN0IHNhbXBsZVRvUGl4ZWwgPSAoc2FtcGxlID0+IHtcbiAgICAgIC8vIG5laXRoZXIgc25hcHBlZCBub3IgZXZlbiByb3VuZGVkIHRvIGludGVnZXIgcGl4ZWxcbiAgICAgIHJldHVybiByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHNhbXBsZSAvIHNhbXBsZVJhdGUpO1xuICAgIH0pO1xuXG4gICAgaWYgKHN0ZXAgPiAxLjApIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVN1bW1hcmlzaW5nKHJlbmRlcmluZ0NvbnRleHQsIGNhY2hlLFxuXHRcdFx0ICAgICAgcGl4ZWxUb1NhbXBsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3VwZGF0ZUludGVycG9sYXRpbmcocmVuZGVyaW5nQ29udGV4dCwgY2FjaGUsXG5cdFx0XHRcdHBpeGVsVG9TYW1wbGUsIHNhbXBsZVRvUGl4ZWwpO1xuICAgIH1cblxuICAgIGNvbnN0IGFmdGVyID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgY29uc29sZS5sb2coXCJ3YXZlZm9ybSB1cGRhdGUgdGltZSA9IFwiICsgTWF0aC5yb3VuZChhZnRlciAtIGJlZm9yZSkpO1xuICB9XG59XG4iXX0=