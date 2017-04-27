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
      this.$el.setAttributeNS(null, 'shape-rendering', 'crispEdges');
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

      console.log("waveform update called");

      var before = performance.now();

      var sampleRate = this.params.sampleRate;
      var minX = renderingContext.minX;

      var step = sampleRate * (renderingContext.timeToPixel.invert(minX + 1) - renderingContext.timeToPixel.invert(minX));

      var snapToCacheBoundaries = step >= this.params.peakCacheBlockSize * 2;

      console.log("waveform update: pixel step = " + step + " samples, snapToCacheBoundaries = " + snapToCacheBoundaries);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zaGFwZXMvd2F2ZWZvcm0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O3lCQUFzQixjQUFjOzs7OytCQUNaLHFCQUFxQjs7OztBQUU3QyxJQUFNLE9BQU8sR0FBRyw4QkFBOEIsQ0FBQzs7Ozs7Ozs7OztJQVMxQixRQUFRO1lBQVIsUUFBUTs7V0FBUixRQUFROzBCQUFSLFFBQVE7OytCQUFSLFFBQVE7OztlQUFSLFFBQVE7O1dBQ2Ysd0JBQUc7QUFBRSxhQUFPLFVBQVUsQ0FBQztLQUFFOzs7V0FFckIsNEJBQUc7QUFDakIsYUFBTyxFQUFFLENBQUM7S0FDWDs7O1dBRVcsd0JBQUc7QUFDYixhQUFPO0FBQ0wsa0JBQVUsRUFBRSxLQUFLO0FBQ2pCLGFBQUssRUFBRSxTQUFTO0FBQ2hCLGVBQU8sRUFBRSxDQUFDO0FBQ1YsMEJBQWtCLEVBQUUsRUFBRTtPQUN2QixDQUFDO0tBQ0g7OztXQUVLLGdCQUFDLGdCQUFnQixFQUFFO0FBQ3ZCLFVBQUksSUFBSSxDQUFDLEdBQUcsRUFBRTtBQUFFLGVBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztPQUFFOztBQUVsQyxVQUFJLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNyRCxVQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzlDLFVBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMzRCxVQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7O0FBRTdDLFVBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLFVBQUksQ0FBQyxXQUFXLEdBQUcsaUNBQWdCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFaEQsYUFBTyxJQUFJLENBQUMsR0FBRyxDQUFDO0tBQ2pCOzs7V0FFTSxpQkFBQyxPQUFPLEVBQUU7O0FBRWYsYUFBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF3QnZDLFVBQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQzs7QUFFakMsVUFBTSxZQUFZLEdBQUksU0FBaEIsWUFBWSxDQUFLLEdBQUcsRUFBRSxTQUFTLEVBQUs7O0FBRXhDLFlBQUksS0FBSyxHQUFHLEVBQUU7WUFBRSxPQUFPLEdBQUcsRUFBRSxDQUFDOztBQUU3QixZQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDOztBQUV2QixhQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsU0FBUyxFQUFFO0FBQzFDLGNBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqQixjQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakIsZUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNsQyxnQkFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN4QixnQkFBSSxNQUFNLEdBQUcsR0FBRyxFQUFFO0FBQUUsaUJBQUcsR0FBRyxNQUFNLENBQUM7YUFBRTtBQUNuQyxnQkFBSSxNQUFNLEdBQUcsR0FBRyxFQUFFO0FBQUUsaUJBQUcsR0FBRyxNQUFNLENBQUM7YUFBRTtXQUNwQztBQUNELGVBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDaEIsaUJBQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbkI7O0FBRUQsZUFBTyxDQUFFLEtBQUssRUFBRSxPQUFPLENBQUUsQ0FBQztPQUMzQixBQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7QUFhSCxVQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDOzswQkFDeEIsWUFBWSxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUM7Ozs7VUFBbkQsS0FBSztVQUFFLE9BQU87O0FBRXBCLGFBQU87QUFDTCxlQUFPLEVBQVAsT0FBTztBQUNQLGtCQUFVLEVBQUUsQ0FDVixFQUFFLFNBQVMsRUFBVCxTQUFTO0FBQ1QsYUFBRyxFQUFFLEtBQUs7QUFDVixhQUFHLEVBQUUsT0FBTztTQUNiLENBQ0Y7T0FDRixDQUFDO0tBQ0g7OztXQUVRLG1CQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRTs7QUFFMUMsVUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDOztBQUVqQyxVQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDOztBQUU5QixVQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdCLFVBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRTdCLFVBQUksU0FBUyxHQUFHLElBQUksQ0FBQztBQUNyQixVQUFJLGtCQUFrQixHQUFHLENBQUMsQ0FBQzs7QUFFM0IsVUFBSSxLQUFLLElBQUssS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxBQUFDLEVBQUU7Ozs7Ozs7O0FBUTFDLFlBQU0sSUFBSSxHQUFHLGFBQWEsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUV6RCxhQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFDaEQsY0FBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7QUFDaEQsY0FBSSxTQUFTLEdBQUcsa0JBQWtCLElBQUksU0FBUyxJQUFJLElBQUksR0FBQyxDQUFDLEVBQUU7QUFDekQscUJBQVMsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hDLDhCQUFrQixHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUM7V0FDMUM7U0FDRjtPQUNGOztBQUVELFVBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO0FBQzFDLFVBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQzs7QUFFaEIsV0FBSyxJQUFJLEVBQUUsR0FBRyxHQUFHLEVBQUUsRUFBRSxHQUFHLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRTs7QUFFakMsWUFBTSxXQUFXLEdBQUcsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3RDLFlBQUksV0FBVyxHQUFHLENBQUMsRUFBRSxTQUFTO0FBQzlCLFlBQUksV0FBVyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUUsTUFBTTs7QUFFekMsWUFBSSxTQUFTLEdBQUcsYUFBYSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN0QyxZQUFJLFNBQVMsSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFLFNBQVMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO0FBQzVELFlBQUksU0FBUyxHQUFHLENBQUMsRUFBRSxTQUFTOztBQUU1QixZQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDL0IsWUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDOztBQUVkLFlBQUksRUFBRSxHQUFHLFdBQVcsQ0FBQzs7QUFFckIsWUFBSSxTQUFTLElBQUssa0JBQWtCLEdBQUcsQ0FBQyxBQUFDLEVBQUU7O0FBRXpDLGlCQUFPLEVBQUUsR0FBRyxTQUFTLElBQUksQUFBQyxFQUFFLEdBQUcsa0JBQWtCLEtBQU0sQ0FBQyxFQUFFO0FBQ3hELGdCQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDekIsZ0JBQUksTUFBTSxHQUFHLEdBQUcsRUFBRTtBQUFFLGlCQUFHLEdBQUcsTUFBTSxDQUFDO2FBQUU7QUFDbkMsZ0JBQUksTUFBTSxHQUFHLEdBQUcsRUFBRTtBQUFFLGlCQUFHLEdBQUcsTUFBTSxDQUFDO2FBQUU7QUFDbkMsY0FBRSxFQUFFLENBQUM7V0FDTjs7QUFFRCxjQUFJLE9BQU8sR0FBRyxFQUFFLEdBQUcsa0JBQWtCLENBQUM7QUFDdEMsY0FBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQztBQUMvQixjQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDOztBQUUvQixpQkFBTyxFQUFFLEdBQUcsa0JBQWtCLElBQUksU0FBUyxFQUFFO0FBQzNDLGdCQUFJLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxHQUFHLEVBQUUsR0FBRyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNyRCxnQkFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxFQUFFLEdBQUcsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDckQsY0FBRSxPQUFPLENBQUM7QUFDVixjQUFFLEdBQUcsRUFBRSxHQUFHLGtCQUFrQixDQUFDO1dBQzlCO1NBQ0Y7O0FBRUQsZUFBTyxFQUFFLEdBQUcsU0FBUyxFQUFFO0FBQ3JCLGNBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN6QixjQUFJLE1BQU0sR0FBRyxHQUFHLEVBQUU7QUFBRSxlQUFHLEdBQUcsTUFBTSxDQUFDO1dBQUU7QUFDbkMsY0FBSSxNQUFNLEdBQUcsR0FBRyxFQUFFO0FBQUUsZUFBRyxHQUFHLE1BQU0sQ0FBQztXQUFFO0FBQ25DLFlBQUUsRUFBRSxDQUFDO1NBQ047O0FBRUQsY0FBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztPQUM3Qjs7QUFFRCxVQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDaEMsYUFBTyxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDOztBQUUzRSxhQUFPLE1BQU0sQ0FBQztLQUNmOzs7V0FFaUIsNEJBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRTs7QUFFekQsYUFBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDOztBQUUxQyxVQUFNLElBQUksR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUM7QUFDbkMsVUFBTSxJQUFJLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDOzs7QUFHbkMsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztBQUNoRSxVQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRTtBQUFFLGVBQU87T0FBRTs7QUFFL0IsVUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFBLEtBQUssRUFBSTtvQ0FDYixLQUFLOztZQUFyQixDQUFDO1lBQUUsR0FBRztZQUFFLEdBQUc7O0FBQ25CLFlBQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDMUQsWUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUMxRCxlQUFVLENBQUMsU0FBSSxFQUFFLFNBQUksQ0FBQyxTQUFJLEVBQUUsQ0FBRztPQUNoQyxDQUFDLENBQUM7O0FBRUgsVUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdkMsVUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQy9ELFVBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDbkQsVUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUN2Qzs7O1dBRW1CLDhCQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFOztBQUUxRSxhQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDLENBQUM7O0FBRTVDLFVBQU0sSUFBSSxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQztBQUNuQyxVQUFNLElBQUksR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUM7O0FBRW5DLFVBQU0sRUFBRSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMvQixVQUFNLEVBQUUsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVuQyxVQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO0FBQzlCLFVBQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7O0FBRXpCLGFBQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLElBQUksR0FBRyxXQUFXLEdBQUcsSUFBSSxHQUFHLFNBQVMsR0FBRyxFQUFFLEdBQUcsU0FBUyxHQUFHLEVBQUUsQ0FBQyxDQUFDOztBQUVyRixVQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7Ozs7Ozs7QUFPdEIsV0FBSyxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO0FBQ3JDLFlBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxTQUFTO0FBQ3BCLFlBQU0sQ0FBQyxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzQixZQUFNLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEQsb0JBQVksQ0FBQyxJQUFJLFFBQUssQ0FBQyxHQUFDLENBQUMsQ0FBQSxVQUFJLENBQUMsR0FBQyxDQUFDLENBQUEsZ0JBQWEsQ0FBQztPQUMvQzs7OztBQUlELFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDM0IsVUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7O0FBRXRFLFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0FBQzNDLFlBQU0sQ0FBQyxHQUFHLGFBQWEsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3ZDLFlBQU0sQ0FBQyxHQUFHLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4RCxZQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDWCxzQkFBWSxDQUFDLElBQUksT0FBSyxDQUFDLFNBQUksQ0FBQyxDQUFHLENBQUM7U0FDakMsTUFBTTtBQUNMLHNCQUFZLENBQUMsSUFBSSxPQUFLLENBQUMsU0FBSSxDQUFDLENBQUcsQ0FBQztTQUNqQztPQUNGOztBQUVELFVBQU0sQ0FBQyxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDaEMsVUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFLG9CQUFvQixDQUFDLENBQUM7QUFDdkUsVUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNuRCxVQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3ZDOzs7V0FFSyxnQkFBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUU7OztBQUU5QixhQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7O0FBRXRDLFVBQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQzs7QUFFakMsVUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7QUFDMUMsVUFBTSxJQUFJLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDOztBQUVuQyxVQUFNLElBQUksR0FBRyxVQUFVLElBQUksZ0JBQWdCLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQ2xFLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUEsQUFBQyxDQUFDOztBQUVqRCxVQUFNLHFCQUFxQixHQUFJLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGtCQUFrQixHQUFHLENBQUMsQUFBQyxDQUFDOztBQUUzRSxhQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxHQUFHLElBQUksR0FBRyxvQ0FBb0MsR0FBRyxxQkFBcUIsQ0FBQyxDQUFDOztBQUVwSCxVQUFNLG9CQUFvQixHQUFJLFNBQXhCLG9CQUFvQixDQUFJLEtBQUssRUFBSTtBQUNyQyxlQUFPLE1BQUssTUFBTSxDQUFDLGtCQUFrQixHQUMxQyxJQUFJLENBQUMsS0FBSyxDQUFFLEFBQUMsVUFBVSxHQUFHLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQy9ELE1BQUssTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUM7T0FDakMsQUFBQyxDQUFDO0FBQ0gsVUFBTSxzQkFBc0IsR0FBSSxTQUExQixzQkFBc0IsQ0FBSSxLQUFLLEVBQUk7QUFDdkMsZUFBTyxJQUFJLENBQUMsS0FBSyxDQUFFLFVBQVUsR0FBRyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7T0FDN0UsQUFBQyxDQUFDO0FBQ0gsVUFBTSxhQUFhLEdBQUkscUJBQXFCLEdBQzFDLG9CQUFvQixHQUNwQixzQkFBc0IsQUFBQyxDQUFDOztBQUUxQixVQUFNLGFBQWEsR0FBSSxTQUFqQixhQUFhLENBQUksTUFBTSxFQUFJOztBQUUvQixlQUFPLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLENBQUM7T0FDMUQsQUFBQyxDQUFDOztBQUVILFVBQUksSUFBSSxHQUFHLEdBQUcsRUFBRTtBQUNkLFlBQUksQ0FBQyxrQkFBa0IsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQzVDLGFBQWEsQ0FBQyxDQUFDO09BQ25CLE1BQU07QUFDTCxZQUFJLENBQUMsb0JBQW9CLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUNuRCxhQUFhLEVBQUUsYUFBYSxDQUFDLENBQUM7T0FDN0I7O0FBRUQsVUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ2hDLGFBQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztLQUNyRTs7O1NBblRrQixRQUFROzs7cUJBQVIsUUFBUSIsImZpbGUiOiJzcmMvc2hhcGVzL3dhdmVmb3JtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuL2Jhc2Utc2hhcGUnO1xuaW1wb3J0IE92ZXJzYW1wbGVyIGZyb20gJy4uL3V0aWxzL292ZXJzYW1wbGUnO1xuXG5jb25zdCB4aHRtbE5TID0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnO1xuXG4vKipcbiAqIEEgc2hhcGUgdG8gZGlzcGxheSBhIHdhdmVmb3JtLiAoZm9yIGVudGl0eSBkYXRhKVxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLXdhdmVmb3JtLmh0bWwpXG4gKlxuICogQHRvZG8gLSBmaXggcHJvYmxlbXMgd2l0aCBjYW52YXMgc3RyYXRlZ3kuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdhdmVmb3JtIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ3dhdmVmb3JtJzsgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBzYW1wbGVSYXRlOiA0NDEwMCxcbiAgICAgIGNvbG9yOiAnIzAwMDAwMCcsXG4gICAgICBvcGFjaXR5OiAxLFxuICAgICAgcGVha0NhY2hlQmxvY2tTaXplOiAzMixcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICBpZiAodGhpcy4kZWwpIHsgcmV0dXJuIHRoaXMuJGVsOyB9XG5cbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncGF0aCcpO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgJ25vbmUnKTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlJywgdGhpcy5wYXJhbXMuY29sb3IpO1xuICAgIHRoaXMuJGVsLnN0eWxlLm9wYWNpdHkgPSB0aGlzLnBhcmFtcy5vcGFjaXR5O1xuXG4gICAgdGhpcy5mYWN0b3IgPSA4O1xuICAgIHRoaXMub3ZlcnNhbXBsZXIgPSBuZXcgT3ZlcnNhbXBsZXIodGhpcy5mYWN0b3IpO1xuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgZW5jYWNoZShzYW1wbGVzKSB7XG5cbiAgICBjb25zb2xlLmxvZyhcIndhdmVmb3JtIGVuY2FjaGUgY2FsbGVkXCIpO1xuXG4gICAgLy8gVGhlIGNhY2hlIGlzIGFuIGFycmF5IG9mIHBlYWsgY2FjaGVzIChob2xkaW5nIHRoZSBtaW4gYW5kIG1heFxuICAgIC8vIHZhbHVlcyB3aXRoaW4gZWFjaCBibG9jayBmb3IgYSBnaXZlbiBibG9jayBzaXplKSB3aXRoIGVhY2ggcGVha1xuICAgIC8vIGNhY2hlIHJlcHJlc2VudGVkIGFzIGFuIG9iamVjdCB3aXRoIGJsb2NrU2l6ZSwgbWluIGFycmF5LCBhbmRcbiAgICAvLyBtYXggYXJyYXkgcHJvcGVydGllcy5cbiAgICAvL1xuICAgIC8vIEZvciBleGFtcGxlOlxuICAgIC8vICAgIFxuICAgIC8vIFsge1xuICAgIC8vICAgICBibG9ja1NpemU6IDE2LFxuICAgIC8vICAgICBtYXg6IFsgMC43LCAgMC41LCAwLjI1LCAtMC4xIF0sXG4gICAgLy8gICAgIG1pbjogWyAwLjUsIC0wLjEsIC0wLjgsIC0wLjIgXVxuICAgIC8vICAgfSwge1xuICAgIC8vICAgICBibG9ja1NpemU6IDMyLCBcbiAgICAvLyAgICAgbWF4OiBbICAwLjcsICAwLjI1IF0sXG4gICAgLy8gICAgIG1pbjogWyAtMC4xLCAtMC44ICBdXG4gICAgLy8gICB9XG4gICAgLy8gXVxuICAgIC8vXG4gICAgLy8gQXMgaXQgaGFwcGVucyB3ZSBhcmUgb25seSBjcmVhdGluZyBhIGNhY2hlIHdpdGggYSBzaW5nbGUgYmxvY2tcbiAgICAvLyBzaXplIGF0IHRoZSBtb21lbnQsIGJ1dCBpdCdzIHVzZWZ1bCB0byByZWNvcmQgdGhhdCBibG9jayBzaXplXG4gICAgLy8gaW4gdGhlIGNhY2hlIHJhdGhlciB0aGFuIGhhdmUgdG8gZml4IGl0IGhlcmUgaW4gdGhlIHNoYXBlLlxuXG4gICAgY29uc3QgYmVmb3JlID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cbiAgICBjb25zdCBwZWFrQ2FjaGVGb3IgPSAoKGFyciwgYmxvY2tTaXplKSA9PiB7XG4gICAgXG4gICAgICBsZXQgcGVha3MgPSBbXSwgdHJvdWdocyA9IFtdO1xuXG4gICAgICBjb25zdCBsZW4gPSBhcnIubGVuZ3RoO1xuICAgIFxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkgPSBpICsgYmxvY2tTaXplKSB7XG4gICAgICAgIGxldCBtaW4gPSBhcnJbaV07XG4gICAgICAgIGxldCBtYXggPSBhcnJbaV07XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgYmxvY2tTaXplOyBqKyspIHtcbiAgICAgICAgICBsZXQgc2FtcGxlID0gYXJyW2kgKyBqXTtcbiAgICAgICAgICBpZiAoc2FtcGxlIDwgbWluKSB7IG1pbiA9IHNhbXBsZTsgfVxuICAgICAgICAgIGlmIChzYW1wbGUgPiBtYXgpIHsgbWF4ID0gc2FtcGxlOyB9XG4gICAgICAgIH1cbiAgICAgICAgcGVha3MucHVzaChtYXgpO1xuICAgICAgICB0cm91Z2hzLnB1c2gobWluKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIFsgcGVha3MsIHRyb3VnaHMgXTtcbiAgICB9KTtcblxuICAgIC8vIEZvciBhIHNpbmdsZSBwZWFrIGNhY2hlLCBleHBlcmltZW50IHN1Z2dlc3RzIHNtYWxsaXNoIGJsb2NrXG4gICAgLy8gc2l6ZXMgYXJlIGJldHRlci4gVGhlcmUncyBubyBiZW5lZml0IGluIGhhdmluZyBtdWx0aXBsZSBsYXllcnNcbiAgICAvLyBvZiBjYWNoZSAoZS5nLiAzMiBhbmQgNTEyKSB1bmxlc3MgdXBkYXRlKCkgY2FuIHRha2UgYWR2YW50YWdlXG4gICAgLy8gb2YgYm90aCBpbiBhIHNpbmdsZSBzdW1tYXJpc2UgYWN0aW9uIChlLmcuIHdoZW4gYXNrZWQgZm9yIGFcbiAgICAvLyByZWFkIGZyb20gMzEwIHRvIDEwNTAsIHN0YXJ0IGJ5IHJlYWRpbmcgc2luZ2xlIHNhbXBsZXMgZnJvbSAzMTBcbiAgICAvLyB0byAzMjAsIHRoZW4gZnJvbSB0aGUgMzItc2FtcGxlIGNhY2hlIGZyb20gMzIwIHRvIDUxMiwgdGhlblxuICAgIC8vIHN3aXRjaCB0byB0aGUgNTEyIHNhbXBsZSBjYWNoZSwgcmF0aGVyIHRoYW4gaGF2aW5nIHRvIHJlYWRcbiAgICAvLyBzaW5nbGUgc2FtcGxlcyBhbGwgdGhlIHdheSBmcm9tIDMxMCB0byA1MTIpLi4uIGJ1dCBhdCB0aGVcbiAgICAvLyBtb21lbnQgaXQgY2FuJ3QuIEFuZCB0aGUgbW9yZSBjb21wbGV4IGxvZ2ljIHdvdWxkIGNhcnJ5IGl0cyBvd25cbiAgICAvLyBvdmVyaGVhZC5cbiAgICBcbiAgICBjb25zdCBibG9ja1NpemUgPSB0aGlzLnBhcmFtcy5wZWFrQ2FjaGVCbG9ja1NpemU7XG4gICAgbGV0IFsgcGVha3MsIHRyb3VnaHMgXSA9IHBlYWtDYWNoZUZvcihzYW1wbGVzLCBibG9ja1NpemUpO1xuICAgIFxuICAgIHJldHVybiB7XG4gICAgICBzYW1wbGVzLFxuICAgICAgcGVha0NhY2hlczogW1xuICAgICAgICB7IGJsb2NrU2l6ZSxcbiAgICAgICAgICBtYXg6IHBlYWtzLFxuICAgICAgICAgIG1pbjogdHJvdWdoc1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfTtcbiAgfVxuICBcbiAgc3VtbWFyaXNlKGNhY2hlLCBtaW5YLCBtYXhYLCBwaXhlbFRvU2FtcGxlKSB7XG5cbiAgICBjb25zdCBiZWZvcmUgPSBwZXJmb3JtYW5jZS5ub3coKTtcblxuICAgIGNvbnN0IHNhbXBsZXMgPSBjYWNoZS5zYW1wbGVzO1xuICAgIFxuICAgIGNvbnN0IHB4MCA9IE1hdGguZmxvb3IobWluWCk7XG4gICAgY29uc3QgcHgxID0gTWF0aC5mbG9vcihtYXhYKTtcblxuICAgIGxldCBwZWFrQ2FjaGUgPSBudWxsO1xuICAgIGxldCBwZWFrQ2FjaGVCbG9ja1NpemUgPSAwO1xuXG4gICAgaWYgKGNhY2hlICYmIChjYWNoZS5wZWFrQ2FjaGVzLmxlbmd0aCA+IDApKSB7XG5cbiAgICAgIC8vIEZpbmQgYSBzdWl0YWJsZSBwZWFrIGNhY2hlIGlmIHdlIGhhdmUgb25lLlxuICAgICAgXG4gICAgICAvLyBcInN0ZXBcIiBpcyB0aGUgZGlzdGFuY2UgaW4gc2FtcGxlcyBmcm9tIG9uZSBwaXhlbCB0byB0aGUgbmV4dC5cbiAgICAgIC8vIFdlIHdhbnQgdGhlIGxhcmdlc3QgY2FjaGUgd2hvc2UgYmxvY2sgc2l6ZSBpcyBubyBsYXJnZXIgdGhhblxuICAgICAgLy8gaGFsZiB0aGlzLCBzbyBhcyB0byBhdm9pZCBzaXR1YXRpb25zIHdoZXJlIG91ciBzdGVwIGlzIGFsd2F5c1xuICAgICAgLy8gc3RyYWRkbGluZyBjYWNoZSBibG9jayBib3VuZGFyaWVzLlxuICAgICAgY29uc3Qgc3RlcCA9IHBpeGVsVG9TYW1wbGUocHgwICsgMSkgLSBwaXhlbFRvU2FtcGxlKHB4MCk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FjaGUucGVha0NhY2hlcy5sZW5ndGg7ICsraSkge1xuICAgICAgICBjb25zdCBibG9ja1NpemUgPSBjYWNoZS5wZWFrQ2FjaGVzW2ldLmJsb2NrU2l6ZTtcbiAgICAgICAgaWYgKGJsb2NrU2l6ZSA+IHBlYWtDYWNoZUJsb2NrU2l6ZSAmJiBibG9ja1NpemUgPD0gc3RlcC8yKSB7XG4gICAgICAgICAgcGVha0NhY2hlID0gY2FjaGUucGVha0NhY2hlc1tpXTtcbiAgICAgICAgICBwZWFrQ2FjaGVCbG9ja1NpemUgPSBwZWFrQ2FjaGUuYmxvY2tTaXplO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgc2FtcGxlUmF0ZSA9IHRoaXMucGFyYW1zLnNhbXBsZVJhdGU7XG4gICAgbGV0IG1pbk1heCA9IFtdO1xuXG4gICAgZm9yIChsZXQgcHggPSBweDA7IHB4IDwgcHgxOyBweCsrKSB7XG5cbiAgICAgIGNvbnN0IHN0YXJ0U2FtcGxlID0gcGl4ZWxUb1NhbXBsZShweCk7XG4gICAgICBpZiAoc3RhcnRTYW1wbGUgPCAwKSBjb250aW51ZTtcbiAgICAgIGlmIChzdGFydFNhbXBsZSA+PSBzYW1wbGVzLmxlbmd0aCkgYnJlYWs7XG5cbiAgICAgIGxldCBlbmRTYW1wbGUgPSBwaXhlbFRvU2FtcGxlKHB4ICsgMSk7XG4gICAgICBpZiAoZW5kU2FtcGxlID49IHNhbXBsZXMubGVuZ3RoKSBlbmRTYW1wbGUgPSBzYW1wbGVzLmxlbmd0aDtcbiAgICAgIGlmIChlbmRTYW1wbGUgPCAwKSBjb250aW51ZTtcblxuICAgICAgbGV0IG1pbiA9IHNhbXBsZXNbc3RhcnRTYW1wbGVdO1xuICAgICAgbGV0IG1heCA9IG1pbjtcbiAgICAgIFxuICAgICAgbGV0IGl4ID0gc3RhcnRTYW1wbGU7XG5cbiAgICAgIGlmIChwZWFrQ2FjaGUgJiYgKHBlYWtDYWNoZUJsb2NrU2l6ZSA+IDApKSB7XG4gICAgICBcbiAgICAgICAgd2hpbGUgKGl4IDwgZW5kU2FtcGxlICYmIChpeCAlIHBlYWtDYWNoZUJsb2NrU2l6ZSkgIT09IDApIHtcbiAgICAgICAgICBsZXQgc2FtcGxlID0gc2FtcGxlc1tpeF07XG4gICAgICAgICAgaWYgKHNhbXBsZSA8IG1pbikgeyBtaW4gPSBzYW1wbGU7IH1cbiAgICAgICAgICBpZiAoc2FtcGxlID4gbWF4KSB7IG1heCA9IHNhbXBsZTsgfVxuICAgICAgICAgICsraXg7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY2FjaGVJeCA9IGl4IC8gcGVha0NhY2hlQmxvY2tTaXplO1xuICAgICAgICBjb25zdCBjYWNoZU1heCA9IHBlYWtDYWNoZS5tYXg7XG4gICAgICAgIGNvbnN0IGNhY2hlTWluID0gcGVha0NhY2hlLm1pbjtcbiAgICAgIFxuICAgICAgICB3aGlsZSAoaXggKyBwZWFrQ2FjaGVCbG9ja1NpemUgPD0gZW5kU2FtcGxlKSB7XG4gICAgICAgICAgaWYgKGNhY2hlTWF4W2NhY2hlSXhdID4gbWF4KSBtYXggPSBjYWNoZU1heFtjYWNoZUl4XTtcbiAgICAgICAgICBpZiAoY2FjaGVNaW5bY2FjaGVJeF0gPCBtaW4pIG1pbiA9IGNhY2hlTWluW2NhY2hlSXhdO1xuICAgICAgICAgICsrY2FjaGVJeDtcbiAgICAgICAgICBpeCA9IGl4ICsgcGVha0NhY2hlQmxvY2tTaXplO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHdoaWxlIChpeCA8IGVuZFNhbXBsZSkge1xuICAgICAgICBsZXQgc2FtcGxlID0gc2FtcGxlc1tpeF07XG4gICAgICAgIGlmIChzYW1wbGUgPCBtaW4pIHsgbWluID0gc2FtcGxlOyB9XG4gICAgICAgIGlmIChzYW1wbGUgPiBtYXgpIHsgbWF4ID0gc2FtcGxlOyB9XG4gICAgICAgICsraXg7XG4gICAgICB9XG5cbiAgICAgIG1pbk1heC5wdXNoKFtweCwgbWluLCBtYXhdKTtcbiAgICB9XG5cbiAgICBjb25zdCBhZnRlciA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIGNvbnNvbGUubG9nKFwid2F2ZWZvcm0gc3VtbWFyaXNhdGlvbiB0aW1lID0gXCIgKyBNYXRoLnJvdW5kKGFmdGVyIC0gYmVmb3JlKSk7XG4gICAgXG4gICAgcmV0dXJuIG1pbk1heDtcbiAgfVxuXG4gIF91cGRhdGVTdW1tYXJpc2luZyhyZW5kZXJpbmdDb250ZXh0LCBjYWNoZSwgcGl4ZWxUb1NhbXBsZSkge1xuXG4gICAgY29uc29sZS5sb2coXCJ3YXZlZm9ybSB1cGRhdGVTdW1tYXJpc2luZ1wiKTtcbiAgICBcbiAgICBjb25zdCBtaW5YID0gcmVuZGVyaW5nQ29udGV4dC5taW5YO1xuICAgIGNvbnN0IG1heFggPSByZW5kZXJpbmdDb250ZXh0Lm1heFg7XG4gICAgXG4gICAgLy8gZ2V0IG1pbi9tYXggdmFsdWVzIHBlciBwaXhlbFxuICAgIGNvbnN0IG1pbk1heCA9IHRoaXMuc3VtbWFyaXNlKGNhY2hlLCBtaW5YLCBtYXhYLCBwaXhlbFRvU2FtcGxlKTtcbiAgICBpZiAoIW1pbk1heC5sZW5ndGgpIHsgcmV0dXJuOyB9XG5cbiAgICBsZXQgaW5zdHJ1Y3Rpb25zID0gbWluTWF4Lm1hcChkYXR1bSA9PiB7XG4gICAgICBjb25zdCBbIHgsIG1pbiwgbWF4IF0gPSBkYXR1bTtcbiAgICAgIGNvbnN0IHkxID0gTWF0aC5yb3VuZChyZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChtaW4pKTtcbiAgICAgIGNvbnN0IHkyID0gTWF0aC5yb3VuZChyZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChtYXgpKTtcbiAgICAgIHJldHVybiBgJHt4fSwke3kxfUwke3h9LCR7eTJ9YDtcbiAgICB9KTtcblxuICAgIGNvbnN0IGQgPSAnTScgKyBpbnN0cnVjdGlvbnMuam9pbignTCcpO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2Utd2lkdGgnLCAxLjApO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgZCk7XG4gIH1cblxuICBfdXBkYXRlSW50ZXJwb2xhdGluZyhyZW5kZXJpbmdDb250ZXh0LCBjYWNoZSwgcGl4ZWxUb1NhbXBsZSwgc2FtcGxlVG9QaXhlbCkge1xuXG4gICAgY29uc29sZS5sb2coXCJ3YXZlZm9ybSB1cGRhdGVJbnRlcnBvbGF0aW5nXCIpO1xuICAgIFxuICAgIGNvbnN0IG1pblggPSByZW5kZXJpbmdDb250ZXh0Lm1pblg7XG4gICAgY29uc3QgbWF4WCA9IHJlbmRlcmluZ0NvbnRleHQubWF4WDtcblxuICAgIGNvbnN0IHMwID0gcGl4ZWxUb1NhbXBsZShtaW5YKTtcbiAgICBjb25zdCBzMSA9IHBpeGVsVG9TYW1wbGUobWF4WCkgKyAxO1xuXG4gICAgY29uc3Qgc2FtcGxlcyA9IGNhY2hlLnNhbXBsZXM7XG4gICAgY29uc3QgbiA9IHNhbXBsZXMubGVuZ3RoO1xuXG4gICAgY29uc29sZS5sb2coXCJtaW5YID0gXCIgKyBtaW5YICsgXCIsIG1heFggPSBcIiArIG1heFggKyBcIiwgczAgPSBcIiArIHMwICsgXCIsIHMxID0gXCIgKyBzMSk7XG5cbiAgICBsZXQgaW5zdHJ1Y3Rpb25zID0gW107XG5cbiAgICAvLyBQaXhlbCBjb29yZGluYXRlcyBpbiB0aGlzIGZ1bmN0aW9uIGFyZSAqbm90KiByb3VuZGVkLCB3ZSB3YW50XG4gICAgLy8gdG8gcHJlc2VydmUgdGhlIHByb3BlciBzaGFwZSBhcyBmYXIgYXMgcG9zc2libGVcblxuICAgIC8vIEFkZCBhIGxpdHRsZSBzcXVhcmUgZm9yIGVhY2ggc2FtcGxlIGxvY2F0aW9uXG4gICAgXG4gICAgZm9yIChsZXQgaSA9IHMwOyBpIDwgczEgJiYgaSA8IG47ICsraSkge1xuICAgICAgaWYgKGkgPCAwKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IHggPSBzYW1wbGVUb1BpeGVsKGkpO1xuICAgICAgY29uc3QgeSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHNhbXBsZXNbaV0pO1xuICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goYE0ke3gtMX0sJHt5LTF9aDJ2MmgtMnYtMmApO1xuICAgIH1cblxuICAgIC8vIE5vdyBmaWxsIGluIHRoZSBnYXBzIGJldHdlZW4gdGhlIHNxdWFyZXNcblxuICAgIGNvbnN0IGZhY3RvciA9IHRoaXMuZmFjdG9yO1xuICAgIGNvbnN0IG92ZXJzYW1wbGVkID0gdGhpcy5vdmVyc2FtcGxlci5vdmVyc2FtcGxlKHNhbXBsZXMsIHMwLCBzMSAtIHMwKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3ZlcnNhbXBsZWQubGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHggPSBzYW1wbGVUb1BpeGVsKHMwICsgaS9mYWN0b3IpOyAvLyBzYW1wbGVUb1BpeGVsIGFjY2VwdHMgbm9uLWludGVnZXJzXG4gICAgICBjb25zdCB5ID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwob3ZlcnNhbXBsZWRbaV0pO1xuICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goYE0ke3h9LCR7eX1gKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluc3RydWN0aW9ucy5wdXNoKGBMJHt4fSwke3l9YCk7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IGQgPSBpbnN0cnVjdGlvbnMuam9pbignJyk7XG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdnZW9tZXRyaWNQcmVjaXNpb24nKTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlLXdpZHRoJywgMC42KTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZCcsIGQpO1xuICB9XG4gIFxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgY2FjaGUpIHtcblxuICAgIGNvbnNvbGUubG9nKFwid2F2ZWZvcm0gdXBkYXRlIGNhbGxlZFwiKTtcbiAgICBcbiAgICBjb25zdCBiZWZvcmUgPSBwZXJmb3JtYW5jZS5ub3coKTtcblxuICAgIGNvbnN0IHNhbXBsZVJhdGUgPSB0aGlzLnBhcmFtcy5zYW1wbGVSYXRlO1xuICAgIGNvbnN0IG1pblggPSByZW5kZXJpbmdDb250ZXh0Lm1pblg7XG4gICAgXG4gICAgY29uc3Qgc3RlcCA9IHNhbXBsZVJhdGUgKiAocmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQobWluWCArIDEpIC1cblx0XHRcdCAgICAgICByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydChtaW5YKSk7XG5cbiAgICBjb25zdCBzbmFwVG9DYWNoZUJvdW5kYXJpZXMgPSAoc3RlcCA+PSB0aGlzLnBhcmFtcy5wZWFrQ2FjaGVCbG9ja1NpemUgKiAyKTtcbiAgICBcbiAgICBjb25zb2xlLmxvZyhcIndhdmVmb3JtIHVwZGF0ZTogcGl4ZWwgc3RlcCA9IFwiICsgc3RlcCArIFwiIHNhbXBsZXMsIHNuYXBUb0NhY2hlQm91bmRhcmllcyA9IFwiICsgc25hcFRvQ2FjaGVCb3VuZGFyaWVzKTtcblxuICAgIGNvbnN0IHBpeGVsVG9TYW1wbGVTbmFwcGVkID0gKHBpeGVsID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnBhcmFtcy5wZWFrQ2FjaGVCbG9ja1NpemUgKlxuXHRNYXRoLmZsb29yICgoc2FtcGxlUmF0ZSAqIHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHBpeGVsKSkgL1xuXHRcdCAgICB0aGlzLnBhcmFtcy5wZWFrQ2FjaGVCbG9ja1NpemUpO1xuICAgIH0pO1xuICAgIGNvbnN0IHBpeGVsVG9TYW1wbGVVbnNuYXBwZWQgPSAocGl4ZWwgPT4ge1xuICAgICAgcmV0dXJuIE1hdGguZmxvb3IgKHNhbXBsZVJhdGUgKiByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydChwaXhlbCkpO1xuICAgIH0pO1xuICAgIGNvbnN0IHBpeGVsVG9TYW1wbGUgPSAoc25hcFRvQ2FjaGVCb3VuZGFyaWVzID9cblx0XHRcdCAgIHBpeGVsVG9TYW1wbGVTbmFwcGVkIDpcblx0XHRcdCAgIHBpeGVsVG9TYW1wbGVVbnNuYXBwZWQpO1xuICAgIFxuICAgIGNvbnN0IHNhbXBsZVRvUGl4ZWwgPSAoc2FtcGxlID0+IHtcbiAgICAgIC8vIG5laXRoZXIgc25hcHBlZCBub3IgZXZlbiByb3VuZGVkIHRvIGludGVnZXIgcGl4ZWxcbiAgICAgIHJldHVybiByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHNhbXBsZSAvIHNhbXBsZVJhdGUpO1xuICAgIH0pO1xuXG4gICAgaWYgKHN0ZXAgPiAxLjApIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVN1bW1hcmlzaW5nKHJlbmRlcmluZ0NvbnRleHQsIGNhY2hlLFxuXHRcdFx0ICAgICAgcGl4ZWxUb1NhbXBsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3VwZGF0ZUludGVycG9sYXRpbmcocmVuZGVyaW5nQ29udGV4dCwgY2FjaGUsXG5cdFx0XHRcdHBpeGVsVG9TYW1wbGUsIHNhbXBsZVRvUGl4ZWwpO1xuICAgIH1cblxuICAgIGNvbnN0IGFmdGVyID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgY29uc29sZS5sb2coXCJ3YXZlZm9ybSB1cGRhdGUgdGltZSA9IFwiICsgTWF0aC5yb3VuZChhZnRlciAtIGJlZm9yZSkpO1xuICB9XG59XG4iXX0=