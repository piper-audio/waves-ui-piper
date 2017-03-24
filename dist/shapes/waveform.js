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
      //    this.$el.setAttributeNS(null, 'shape-rendering', 'crispEdges');
      this.$el.setAttributeNS(null, 'shape-rendering', 'geometricPrecision');
      this.$el.setAttributeNS(null, 'stroke', this.params.color);
      this.$el.style.opacity = this.params.opacity;

      this.factor = 8;
      this.oversampler = new _utilsOversample2['default'](this.factor);

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
    key: '_updateSummarising',
    value: function _updateSummarising(renderingContext, cache, pixelToSample) {

      console.log("waveform updateSummarising");

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
      this.$el.setAttributeNS(null, 'stroke-width', 1.0);
      this.$el.setAttributeNS(null, 'd', d);
    }
  }, {
    key: '_updateInterpolating',
    value: function _updateInterpolating(renderingContext, cache, pixelToSample, sampleToPixel) {

      console.log("waveform updateInterpolating");

      var minX = renderingContext.minX;
      var maxX = renderingContext.maxX;

      var s0 = pixelToSample(minX);
      var s1 = pixelToSample(maxX) + 1;

      var samples = cache.samples;
      var n = samples.length;

      console.log("minX = " + minX + ", maxX = " + maxX + ", s0 = " + s0 + ", s1 = " + s1);

      var instructions = [];

      // Pixel coordinates in this function are *not* rounded, we want
      // to preserve the proper shape as far as possible

      // Add a little square for each sample location

      for (var i = s0; i < s1 && i < n; ++i) {
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
      this.$el.setAttributeNS(null, 'stroke-width', 0.6);
      this.$el.setAttributeNS(null, 'd', d);
    }
  }, {
    key: 'update',
    value: function update(renderingContext, cache) {

      console.log("waveform update called");

      var before = performance.now();

      var sampleRate = this.params.sampleRate;
      var pixelToSample = function pixelToSample(pixel) {
        return Math.floor(sampleRate * renderingContext.timeToPixel.invert(pixel));
      };
      var sampleToPixel = function sampleToPixel(sample) {
        return renderingContext.timeToPixel(sample / sampleRate); // not rounded
      };

      var minX = renderingContext.minX;
      var step = sampleRate * (renderingContext.timeToPixel.invert(minX + 1) - renderingContext.timeToPixel.invert(minX));

      console.log("waveform update: pixel step = " + step + " samples");

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zaGFwZXMvd2F2ZWZvcm0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O3lCQUFzQixjQUFjOzs7OytCQUNaLHFCQUFxQjs7OztBQUU3QyxJQUFNLE9BQU8sR0FBRyw4QkFBOEIsQ0FBQzs7Ozs7Ozs7OztJQVMxQixRQUFRO1lBQVIsUUFBUTs7V0FBUixRQUFROzBCQUFSLFFBQVE7OytCQUFSLFFBQVE7OztlQUFSLFFBQVE7O1dBQ2Ysd0JBQUc7QUFBRSxhQUFPLFVBQVUsQ0FBQztLQUFFOzs7V0FFckIsNEJBQUc7O0FBRWpCLGFBQU8sRUFBRSxDQUFDO0tBQ1g7OztXQUVXLHdCQUFHO0FBQ2IsYUFBTztBQUNMLGtCQUFVLEVBQUUsS0FBSztBQUNqQixhQUFLLEVBQUUsU0FBUztBQUNoQixlQUFPLEVBQUUsQ0FBQztPQUNYLENBQUM7S0FDSDs7O1dBRUssZ0JBQUMsZ0JBQWdCLEVBQUU7QUFDdkIsVUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFO0FBQUUsZUFBTyxJQUFJLENBQUMsR0FBRyxDQUFDO09BQUU7O0FBRWxDLFVBQUksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3JELFVBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7O0FBRTlDLFVBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3ZFLFVBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMzRCxVQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7O0FB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L3dhdmVmb3JtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuL2Jhc2Utc2hhcGUnO1xuaW1wb3J0IE92ZXJzYW1wbGVyIGZyb20gJy4uL3V0aWxzL292ZXJzYW1wbGUnO1xuXG5jb25zdCB4aHRtbE5TID0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnO1xuXG4vKipcbiAqIEEgc2hhcGUgdG8gZGlzcGxheSBhIHdhdmVmb3JtLiAoZm9yIGVudGl0eSBkYXRhKVxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLXdhdmVmb3JtLmh0bWwpXG4gKlxuICogQHRvZG8gLSBmaXggcHJvYmxlbXMgd2l0aCBjYW52YXMgc3RyYXRlZ3kuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdhdmVmb3JtIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ3dhdmVmb3JtJzsgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgLy8gcmV0dXJuIHsgeTogMCB9O1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2FtcGxlUmF0ZTogNDQxMDAsXG4gICAgICBjb2xvcjogJyMwMDAwMDAnLFxuICAgICAgb3BhY2l0eTogMSxcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICBpZiAodGhpcy4kZWwpIHsgcmV0dXJuIHRoaXMuJGVsOyB9XG5cbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncGF0aCcpO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgJ25vbmUnKTtcbi8vICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnZ2VvbWV0cmljUHJlY2lzaW9uJyk7XG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZScsIHRoaXMucGFyYW1zLmNvbG9yKTtcbiAgICB0aGlzLiRlbC5zdHlsZS5vcGFjaXR5ID0gdGhpcy5wYXJhbXMub3BhY2l0eTtcblxuICAgIHRoaXMuZmFjdG9yID0gODtcbiAgICB0aGlzLm92ZXJzYW1wbGVyID0gbmV3IE92ZXJzYW1wbGVyKHRoaXMuZmFjdG9yKTtcblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIGVuY2FjaGUoc2FtcGxlcykge1xuXG4gICAgY29uc29sZS5sb2coXCJ3YXZlZm9ybSBlbmNhY2hlIGNhbGxlZFwiKTtcblxuICAgIC8vIFRoZSBjYWNoZSBpcyBhbiBhcnJheSBvZiBwZWFrIGNhY2hlcyAoaG9sZGluZyB0aGUgbWluIGFuZCBtYXhcbiAgICAvLyB2YWx1ZXMgd2l0aGluIGVhY2ggYmxvY2sgZm9yIGEgZ2l2ZW4gYmxvY2sgc2l6ZSkgd2l0aCBlYWNoIHBlYWtcbiAgICAvLyBjYWNoZSByZXByZXNlbnRlZCBhcyBhbiBvYmplY3Qgd2l0aCBibG9ja1NpemUsIG1pbiBhcnJheSwgYW5kXG4gICAgLy8gbWF4IGFycmF5IHByb3BlcnRpZXMuXG4gICAgLy9cbiAgICAvLyBGb3IgZXhhbXBsZTpcbiAgICAvLyAgICBcbiAgICAvLyBbIHtcbiAgICAvLyAgICAgYmxvY2tTaXplOiAxNixcbiAgICAvLyAgICAgbWF4OiBbIDAuNywgIDAuNSwgMC4yNSwgLTAuMSBdLFxuICAgIC8vICAgICBtaW46IFsgMC41LCAtMC4xLCAtMC44LCAtMC4yIF1cbiAgICAvLyAgIH0sIHtcbiAgICAvLyAgICAgYmxvY2tTaXplOiAzMiwgXG4gICAgLy8gICAgIG1heDogWyAgMC43LCAgMC4yNSBdLFxuICAgIC8vICAgICBtaW46IFsgLTAuMSwgLTAuOCAgXVxuICAgIC8vICAgfVxuICAgIC8vIF1cbiAgICAvL1xuICAgIC8vIEFzIGl0IGhhcHBlbnMgd2UgYXJlIG9ubHkgY3JlYXRpbmcgYSBjYWNoZSB3aXRoIGEgc2luZ2xlIGJsb2NrXG4gICAgLy8gc2l6ZSBhdCB0aGUgbW9tZW50LCBidXQgaXQncyB1c2VmdWwgdG8gcmVjb3JkIHRoYXQgYmxvY2sgc2l6ZVxuICAgIC8vIGluIHRoZSBjYWNoZSByYXRoZXIgdGhhbiBoYXZlIHRvIGZpeCBpdCBoZXJlIGluIHRoZSBzaGFwZS5cblxuICAgIGNvbnN0IGJlZm9yZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gICAgY29uc3QgcGVha0NhY2hlRm9yID0gKChhcnIsIGJsb2NrU2l6ZSkgPT4ge1xuICAgIFxuICAgICAgbGV0IHBlYWtzID0gW10sIHRyb3VnaHMgPSBbXTtcblxuICAgICAgY29uc3QgbGVuID0gYXJyLmxlbmd0aDtcbiAgICBcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpID0gaSArIGJsb2NrU2l6ZSkge1xuICAgICAgICBsZXQgbWluID0gYXJyW2ldO1xuICAgICAgICBsZXQgbWF4ID0gYXJyW2ldO1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGJsb2NrU2l6ZTsgaisrKSB7XG4gICAgICAgICAgbGV0IHNhbXBsZSA9IGFycltpICsgal07XG4gICAgICAgICAgaWYgKHNhbXBsZSA8IG1pbikgeyBtaW4gPSBzYW1wbGU7IH1cbiAgICAgICAgICBpZiAoc2FtcGxlID4gbWF4KSB7IG1heCA9IHNhbXBsZTsgfVxuICAgICAgICB9XG4gICAgICAgIHBlYWtzLnB1c2gobWF4KTtcbiAgICAgICAgdHJvdWdocy5wdXNoKG1pbik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBbIHBlYWtzLCB0cm91Z2hzIF07XG4gICAgfSk7XG5cbiAgICAvLyBGb3IgYSBzaW5nbGUgcGVhayBjYWNoZSwgZXhwZXJpbWVudCBzdWdnZXN0cyBzbWFsbGlzaCBibG9ja1xuICAgIC8vIHNpemVzIGFyZSBiZXR0ZXIuIFRoZXJlJ3Mgbm8gYmVuZWZpdCBpbiBoYXZpbmcgbXVsdGlwbGUgbGF5ZXJzXG4gICAgLy8gb2YgY2FjaGUgKGUuZy4gMzIgYW5kIDUxMikgdW5sZXNzIHVwZGF0ZSgpIGNhbiB0YWtlIGFkdmFudGFnZVxuICAgIC8vIG9mIGJvdGggaW4gYSBzaW5nbGUgc3VtbWFyaXNlIGFjdGlvbiAoZS5nLiB3aGVuIGFza2VkIGZvciBhXG4gICAgLy8gcmVhZCBmcm9tIDMxMCB0byAxMDUwLCBzdGFydCBieSByZWFkaW5nIHNpbmdsZSBzYW1wbGVzIGZyb20gMzEwXG4gICAgLy8gdG8gMzIwLCB0aGVuIGZyb20gdGhlIDMyLXNhbXBsZSBjYWNoZSBmcm9tIDMyMCB0byA1MTIsIHRoZW5cbiAgICAvLyBzd2l0Y2ggdG8gdGhlIDUxMiBzYW1wbGUgY2FjaGUsIHJhdGhlciB0aGFuIGhhdmluZyB0byByZWFkXG4gICAgLy8gc2luZ2xlIHNhbXBsZXMgYWxsIHRoZSB3YXkgZnJvbSAzMTAgdG8gNTEyKS4uLiBidXQgYXQgdGhlXG4gICAgLy8gbW9tZW50IGl0IGNhbid0LiBBbmQgdGhlIG1vcmUgY29tcGxleCBsb2dpYyB3b3VsZCBjYXJyeSBpdHMgb3duXG4gICAgLy8gb3ZlcmhlYWQuXG4gICAgXG4gICAgY29uc3QgYmxvY2tTaXplID0gMzI7XG4gICAgbGV0IFsgcGVha3MsIHRyb3VnaHMgXSA9IHBlYWtDYWNoZUZvcihzYW1wbGVzLCBibG9ja1NpemUpO1xuICAgIFxuICAgIHJldHVybiB7XG4gICAgICBzYW1wbGVzLFxuICAgICAgcGVha0NhY2hlczogW1xuICAgICAgICB7IGJsb2NrU2l6ZSxcbiAgICAgICAgICBtYXg6IHBlYWtzLFxuICAgICAgICAgIG1pbjogdHJvdWdoc1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfTtcbiAgfVxuICBcbiAgc3VtbWFyaXNlKGNhY2hlLCBtaW5YLCBtYXhYLCBwaXhlbFRvU2FtcGxlKSB7XG5cbiAgICBjb25zdCBiZWZvcmUgPSBwZXJmb3JtYW5jZS5ub3coKTtcblxuICAgIGNvbnN0IHNhbXBsZXMgPSBjYWNoZS5zYW1wbGVzO1xuICAgIFxuICAgIGNvbnN0IHB4MCA9IE1hdGguZmxvb3IobWluWCk7XG4gICAgY29uc3QgcHgxID0gTWF0aC5mbG9vcihtYXhYKTtcblxuICAgIGxldCBwZWFrQ2FjaGUgPSBudWxsO1xuICAgIGxldCBwZWFrQ2FjaGVCbG9ja1NpemUgPSAwO1xuXG4gICAgaWYgKGNhY2hlICYmIChjYWNoZS5wZWFrQ2FjaGVzLmxlbmd0aCA+IDApKSB7XG5cbiAgICAgIC8vIEZpbmQgYSBzdWl0YWJsZSBwZWFrIGNhY2hlIGlmIHdlIGhhdmUgb25lLlxuICAgICAgXG4gICAgICAvLyBcInN0ZXBcIiBpcyB0aGUgZGlzdGFuY2UgaW4gc2FtcGxlcyBmcm9tIG9uZSBwaXhlbCB0byB0aGUgbmV4dC5cbiAgICAgIC8vIFdlIHdhbnQgdGhlIGxhcmdlc3QgY2FjaGUgd2hvc2UgYmxvY2sgc2l6ZSBpcyBubyBsYXJnZXIgdGhhblxuICAgICAgLy8gaGFsZiB0aGlzLCBzbyBhcyB0byBhdm9pZCBzaXR1YXRpb25zIHdoZXJlIG91ciBzdGVwIGlzIGFsd2F5c1xuICAgICAgLy8gc3RyYWRkbGluZyBjYWNoZSBibG9jayBib3VuZGFyaWVzLlxuICAgICAgY29uc3Qgc3RlcCA9IHBpeGVsVG9TYW1wbGUocHgwICsgMSkgLSBwaXhlbFRvU2FtcGxlKHB4MCk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FjaGUucGVha0NhY2hlcy5sZW5ndGg7ICsraSkge1xuICAgICAgICBjb25zdCBibG9ja1NpemUgPSBjYWNoZS5wZWFrQ2FjaGVzW2ldLmJsb2NrU2l6ZTtcbiAgICAgICAgaWYgKGJsb2NrU2l6ZSA+IHBlYWtDYWNoZUJsb2NrU2l6ZSAmJiBibG9ja1NpemUgPD0gc3RlcC8yKSB7XG4gICAgICAgICAgcGVha0NhY2hlID0gY2FjaGUucGVha0NhY2hlc1tpXTtcbiAgICAgICAgICBwZWFrQ2FjaGVCbG9ja1NpemUgPSBwZWFrQ2FjaGUuYmxvY2tTaXplO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgc2FtcGxlUmF0ZSA9IHRoaXMucGFyYW1zLnNhbXBsZVJhdGU7XG4gICAgbGV0IG1pbk1heCA9IFtdO1xuXG4gICAgZm9yIChsZXQgcHggPSBweDA7IHB4IDwgcHgxOyBweCsrKSB7XG5cbiAgICAgIGNvbnN0IHN0YXJ0U2FtcGxlID0gcGl4ZWxUb1NhbXBsZShweCk7XG4gICAgICBpZiAoc3RhcnRTYW1wbGUgPj0gc2FtcGxlcy5sZW5ndGgpIGJyZWFrO1xuXG4gICAgICBsZXQgZW5kU2FtcGxlID0gcGl4ZWxUb1NhbXBsZShweCArIDEpO1xuICAgICAgaWYgKGVuZFNhbXBsZSA+PSBzYW1wbGVzLmxlbmd0aCkgZW5kU2FtcGxlID0gc2FtcGxlcy5sZW5ndGg7XG4gICAgICBcbiAgICAgIGxldCBtaW4gPSBzYW1wbGVzW3N0YXJ0U2FtcGxlXTtcbiAgICAgIGxldCBtYXggPSBtaW47XG4gICAgICBcbiAgICAgIGxldCBpeCA9IHN0YXJ0U2FtcGxlO1xuXG4gICAgICBpZiAocGVha0NhY2hlICYmIChwZWFrQ2FjaGVCbG9ja1NpemUgPiAwKSkge1xuICAgICAgXG4gICAgICAgIHdoaWxlIChpeCA8IGVuZFNhbXBsZSAmJiAoaXggJSBwZWFrQ2FjaGVCbG9ja1NpemUpICE9PSAwKSB7XG4gICAgICAgICAgbGV0IHNhbXBsZSA9IHNhbXBsZXNbaXhdO1xuICAgICAgICAgIGlmIChzYW1wbGUgPCBtaW4pIHsgbWluID0gc2FtcGxlOyB9XG4gICAgICAgICAgaWYgKHNhbXBsZSA+IG1heCkgeyBtYXggPSBzYW1wbGU7IH1cbiAgICAgICAgICArK2l4O1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNhY2hlSXggPSBpeCAvIHBlYWtDYWNoZUJsb2NrU2l6ZTtcbiAgICAgICAgY29uc3QgY2FjaGVNYXggPSBwZWFrQ2FjaGUubWF4O1xuICAgICAgICBjb25zdCBjYWNoZU1pbiA9IHBlYWtDYWNoZS5taW47XG4gICAgICBcbiAgICAgICAgd2hpbGUgKGl4ICsgcGVha0NhY2hlQmxvY2tTaXplIDw9IGVuZFNhbXBsZSkge1xuICAgICAgICAgIGlmIChjYWNoZU1heFtjYWNoZUl4XSA+IG1heCkgbWF4ID0gY2FjaGVNYXhbY2FjaGVJeF07XG4gICAgICAgICAgaWYgKGNhY2hlTWluW2NhY2hlSXhdIDwgbWluKSBtaW4gPSBjYWNoZU1pbltjYWNoZUl4XTtcbiAgICAgICAgICArK2NhY2hlSXg7XG4gICAgICAgICAgaXggPSBpeCArIHBlYWtDYWNoZUJsb2NrU2l6ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB3aGlsZSAoaXggPCBlbmRTYW1wbGUpIHtcbiAgICAgICAgbGV0IHNhbXBsZSA9IHNhbXBsZXNbaXhdO1xuICAgICAgICBpZiAoc2FtcGxlIDwgbWluKSB7IG1pbiA9IHNhbXBsZTsgfVxuICAgICAgICBpZiAoc2FtcGxlID4gbWF4KSB7IG1heCA9IHNhbXBsZTsgfVxuICAgICAgICArK2l4O1xuICAgICAgfVxuXG4gICAgICBtaW5NYXgucHVzaChbcHgsIG1pbiwgbWF4XSk7XG4gICAgfVxuXG4gICAgY29uc3QgYWZ0ZXIgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICBjb25zb2xlLmxvZyhcIndhdmVmb3JtIHN1bW1hcmlzYXRpb24gdGltZSA9IFwiICsgTWF0aC5yb3VuZChhZnRlciAtIGJlZm9yZSkpO1xuICAgIFxuICAgIHJldHVybiBtaW5NYXg7XG4gIH1cblxuICBfdXBkYXRlU3VtbWFyaXNpbmcocmVuZGVyaW5nQ29udGV4dCwgY2FjaGUsIHBpeGVsVG9TYW1wbGUpIHtcblxuICAgIGNvbnNvbGUubG9nKFwid2F2ZWZvcm0gdXBkYXRlU3VtbWFyaXNpbmdcIik7XG4gICAgXG4gICAgY29uc3QgbWluWCA9IHJlbmRlcmluZ0NvbnRleHQubWluWDtcbiAgICBjb25zdCBtYXhYID0gcmVuZGVyaW5nQ29udGV4dC5tYXhYO1xuICAgIFxuICAgIC8vIGdldCBtaW4vbWF4IHZhbHVlcyBwZXIgcGl4ZWxcbiAgICBjb25zdCBtaW5NYXggPSB0aGlzLnN1bW1hcmlzZShjYWNoZSwgbWluWCwgbWF4WCwgcGl4ZWxUb1NhbXBsZSk7XG4gICAgaWYgKCFtaW5NYXgubGVuZ3RoKSB7IHJldHVybjsgfVxuXG4gICAgbGV0IGluc3RydWN0aW9ucyA9IG1pbk1heC5tYXAoZGF0dW0gPT4ge1xuICAgICAgY29uc3QgWyB4LCBtaW4sIG1heCBdID0gZGF0dW07XG4gICAgICBjb25zdCB5MSA9IE1hdGgucm91bmQocmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwobWluKSk7XG4gICAgICBjb25zdCB5MiA9IE1hdGgucm91bmQocmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwobWF4KSk7XG4gICAgICByZXR1cm4gYCR7eH0sJHt5MX1MJHt4fSwke3kyfWA7XG4gICAgfSk7XG5cbiAgICBjb25zdCBkID0gJ00nICsgaW5zdHJ1Y3Rpb25zLmpvaW4oJ0wnKTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlLXdpZHRoJywgMS4wKTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZCcsIGQpO1xuICB9XG5cbiAgX3VwZGF0ZUludGVycG9sYXRpbmcocmVuZGVyaW5nQ29udGV4dCwgY2FjaGUsIHBpeGVsVG9TYW1wbGUsIHNhbXBsZVRvUGl4ZWwpIHtcblxuICAgIGNvbnNvbGUubG9nKFwid2F2ZWZvcm0gdXBkYXRlSW50ZXJwb2xhdGluZ1wiKTtcbiAgICBcbiAgICBjb25zdCBtaW5YID0gcmVuZGVyaW5nQ29udGV4dC5taW5YO1xuICAgIGNvbnN0IG1heFggPSByZW5kZXJpbmdDb250ZXh0Lm1heFg7XG5cbiAgICBjb25zdCBzMCA9IHBpeGVsVG9TYW1wbGUobWluWCk7XG4gICAgY29uc3QgczEgPSBwaXhlbFRvU2FtcGxlKG1heFgpICsgMTtcblxuICAgIGNvbnN0IHNhbXBsZXMgPSBjYWNoZS5zYW1wbGVzO1xuICAgIGNvbnN0IG4gPSBzYW1wbGVzLmxlbmd0aDtcblxuICAgIGNvbnNvbGUubG9nKFwibWluWCA9IFwiICsgbWluWCArIFwiLCBtYXhYID0gXCIgKyBtYXhYICsgXCIsIHMwID0gXCIgKyBzMCArIFwiLCBzMSA9IFwiICsgczEpO1xuXG4gICAgbGV0IGluc3RydWN0aW9ucyA9IFtdO1xuXG4gICAgLy8gUGl4ZWwgY29vcmRpbmF0ZXMgaW4gdGhpcyBmdW5jdGlvbiBhcmUgKm5vdCogcm91bmRlZCwgd2Ugd2FudFxuICAgIC8vIHRvIHByZXNlcnZlIHRoZSBwcm9wZXIgc2hhcGUgYXMgZmFyIGFzIHBvc3NpYmxlXG5cbiAgICAvLyBBZGQgYSBsaXR0bGUgc3F1YXJlIGZvciBlYWNoIHNhbXBsZSBsb2NhdGlvblxuICAgIFxuICAgIGZvciAobGV0IGkgPSBzMDsgaSA8IHMxICYmIGkgPCBuOyArK2kpIHtcbiAgICAgIGNvbnN0IHggPSBzYW1wbGVUb1BpeGVsKGkpO1xuICAgICAgY29uc3QgeSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHNhbXBsZXNbaV0pO1xuICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goYE0ke3gtMX0sJHt5LTF9aDJ2MmgtMnYtMmApO1xuICAgIH1cblxuICAgIC8vIE5vdyBmaWxsIGluIHRoZSBnYXBzIGJldHdlZW4gdGhlIHNxdWFyZXNcblxuICAgIGNvbnN0IGZhY3RvciA9IHRoaXMuZmFjdG9yO1xuICAgIGNvbnN0IG92ZXJzYW1wbGVkID0gdGhpcy5vdmVyc2FtcGxlci5vdmVyc2FtcGxlKHNhbXBsZXMsIHMwLCBzMSAtIHMwKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3ZlcnNhbXBsZWQubGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHggPSBzYW1wbGVUb1BpeGVsKHMwICsgaS9mYWN0b3IpOyAvLyBzYW1wbGVUb1BpeGVsIGFjY2VwdHMgbm9uLWludGVnZXJzXG4gICAgICBjb25zdCB5ID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwob3ZlcnNhbXBsZWRbaV0pO1xuICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goYE0ke3h9LCR7eX1gKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluc3RydWN0aW9ucy5wdXNoKGBMJHt4fSwke3l9YCk7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IGQgPSBpbnN0cnVjdGlvbnMuam9pbignJyk7XG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZS13aWR0aCcsIDAuNik7XG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLCBkKTtcbiAgfVxuICBcbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGNhY2hlKSB7XG5cbiAgICBjb25zb2xlLmxvZyhcIndhdmVmb3JtIHVwZGF0ZSBjYWxsZWRcIik7XG4gICAgXG4gICAgY29uc3QgYmVmb3JlID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cbiAgICBjb25zdCBzYW1wbGVSYXRlID0gdGhpcy5wYXJhbXMuc2FtcGxlUmF0ZTtcbiAgICBjb25zdCBwaXhlbFRvU2FtcGxlID0gKHBpeGVsID0+IHtcbiAgICAgIHJldHVybiBNYXRoLmZsb29yIChzYW1wbGVSYXRlICogcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQocGl4ZWwpKTtcbiAgICB9KTtcbiAgICBjb25zdCBzYW1wbGVUb1BpeGVsID0gKHNhbXBsZSA9PiB7XG4gICAgICByZXR1cm4gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChzYW1wbGUgLyBzYW1wbGVSYXRlKTsgLy8gbm90IHJvdW5kZWRcbiAgICB9KTtcblxuICAgIGNvbnN0IG1pblggPSByZW5kZXJpbmdDb250ZXh0Lm1pblg7XG4gICAgY29uc3Qgc3RlcCA9IHNhbXBsZVJhdGUgKiAocmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQobWluWCArIDEpIC1cblx0XHRcdCAgICAgICByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydChtaW5YKSk7XG5cbiAgICBjb25zb2xlLmxvZyhcIndhdmVmb3JtIHVwZGF0ZTogcGl4ZWwgc3RlcCA9IFwiICsgc3RlcCArIFwiIHNhbXBsZXNcIik7XG4gICAgXG4gICAgaWYgKHN0ZXAgPiAxLjApIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVN1bW1hcmlzaW5nKHJlbmRlcmluZ0NvbnRleHQsIGNhY2hlLFxuXHRcdFx0ICAgICAgcGl4ZWxUb1NhbXBsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3VwZGF0ZUludGVycG9sYXRpbmcocmVuZGVyaW5nQ29udGV4dCwgY2FjaGUsXG5cdFx0XHRcdHBpeGVsVG9TYW1wbGUsIHNhbXBsZVRvUGl4ZWwpO1xuICAgIH1cblxuICAgIGNvbnN0IGFmdGVyID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgY29uc29sZS5sb2coXCJ3YXZlZm9ybSB1cGRhdGUgdGltZSA9IFwiICsgTWF0aC5yb3VuZChhZnRlciAtIGJlZm9yZSkpO1xuICB9XG59XG4iXX0=