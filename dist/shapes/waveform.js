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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zaGFwZXMvd2F2ZWZvcm0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O3lCQUFzQixjQUFjOzs7OytCQUNaLHFCQUFxQjs7OztBQUU3QyxJQUFNLE9BQU8sR0FBRyw4QkFBOEIsQ0FBQzs7Ozs7Ozs7OztJQVMxQixRQUFRO1lBQVIsUUFBUTs7V0FBUixRQUFROzBCQUFSLFFBQVE7OytCQUFSLFFBQVE7OztlQUFSLFFBQVE7O1dBQ2Ysd0JBQUc7QUFBRSxhQUFPLFVBQVUsQ0FBQztLQUFFOzs7V0FFckIsNEJBQUc7O0FBRWpCLGFBQU8sRUFBRSxDQUFDO0tBQ1g7OztXQUVXLHdCQUFHO0FBQ2IsYUFBTztBQUNMLGtCQUFVLEVBQUUsS0FBSztBQUNqQixhQUFLLEVBQUUsU0FBUztBQUNoQixlQUFPLEVBQUUsQ0FBQztBQUNWLDBCQUFrQixFQUFFLEVBQUU7T0FDdkIsQ0FBQztLQUNIOzs7V0FFSyxnQkFBQyxnQkFBZ0IsRUFBRTtBQUN2QixVQUFJLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFBRSxlQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7T0FBRTs7QUFFbEMsVUFBSSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDckQsVUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztBQUM5QyxVQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDM0QsVUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDOztBQUU3QyxVQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNoQixVQUFJLENBQUMsV0FB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VyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO09BQzdFLEFBQUMsQ0FBQztBQUNILFVBQU0sYUFBYSxHQUFJLHFCQUFxQixHQUMxQyxvQkFBb0IsR0FDcEIsc0JBQXNCLEFBQUMsQ0FBQzs7QUFFMUIsVUFBTSxhQUFhLEdBQUksU0FBakIsYUFBYSxDQUFJLE1BQU0sRUFBSTs7QUFFL0IsZUFBTyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxDQUFDO09BQzFELEFBQUMsQ0FBQzs7QUFFSCxVQUFJLElBQUksR0FBRyxHQUFHLEVBQUU7QUFDZCxZQUFJLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUM1QyxhQUFhLENBQUMsQ0FBQztPQUNuQixNQUFNO0FBQ0wsWUFBSSxDQUFDLG9CQUFvQixDQUFDLGdCQUFnQixFQUFFLEtBQUssRUFDbkQsYUFBYSxFQUFFLGFBQWEsQ0FBQyxDQUFDO09BQzdCOztBQUVELFVBQU0sS0FBSyxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNoQyxhQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7S0FDckU7OztTQXBUa0IsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoic3JjL3NoYXBlcy93YXZlZm9ybS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9iYXNlLXNoYXBlJztcbmltcG9ydCBPdmVyc2FtcGxlciBmcm9tICcuLi91dGlscy9vdmVyc2FtcGxlJztcblxuY29uc3QgeGh0bWxOUyA9ICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJztcblxuLyoqXG4gKiBBIHNoYXBlIHRvIGRpc3BsYXkgYSB3YXZlZm9ybS4gKGZvciBlbnRpdHkgZGF0YSlcbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci13YXZlZm9ybS5odG1sKVxuICpcbiAqIEB0b2RvIC0gZml4IHByb2JsZW1zIHdpdGggY2FudmFzIHN0cmF0ZWd5LlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXYXZlZm9ybSBleHRlbmRzIEJhc2VTaGFwZSB7XG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICd3YXZlZm9ybSc7IH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIC8vIHJldHVybiB7IHk6IDAgfTtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNhbXBsZVJhdGU6IDQ0MTAwLFxuICAgICAgY29sb3I6ICcjMDAwMDAwJyxcbiAgICAgIG9wYWNpdHk6IDEsXG4gICAgICBwZWFrQ2FjaGVCbG9ja1NpemU6IDMyLFxuICAgIH07XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIGlmICh0aGlzLiRlbCkgeyByZXR1cm4gdGhpcy4kZWw7IH1cblxuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdwYXRoJyk7XG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCAnbm9uZScpO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2UnLCB0aGlzLnBhcmFtcy5jb2xvcik7XG4gICAgdGhpcy4kZWwuc3R5bGUub3BhY2l0eSA9IHRoaXMucGFyYW1zLm9wYWNpdHk7XG5cbiAgICB0aGlzLmZhY3RvciA9IDg7XG4gICAgdGhpcy5vdmVyc2FtcGxlciA9IG5ldyBPdmVyc2FtcGxlcih0aGlzLmZhY3Rvcik7XG5cbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICBlbmNhY2hlKHNhbXBsZXMpIHtcblxuICAgIGNvbnNvbGUubG9nKFwid2F2ZWZvcm0gZW5jYWNoZSBjYWxsZWRcIik7XG5cbiAgICAvLyBUaGUgY2FjaGUgaXMgYW4gYXJyYXkgb2YgcGVhayBjYWNoZXMgKGhvbGRpbmcgdGhlIG1pbiBhbmQgbWF4XG4gICAgLy8gdmFsdWVzIHdpdGhpbiBlYWNoIGJsb2NrIGZvciBhIGdpdmVuIGJsb2NrIHNpemUpIHdpdGggZWFjaCBwZWFrXG4gICAgLy8gY2FjaGUgcmVwcmVzZW50ZWQgYXMgYW4gb2JqZWN0IHdpdGggYmxvY2tTaXplLCBtaW4gYXJyYXksIGFuZFxuICAgIC8vIG1heCBhcnJheSBwcm9wZXJ0aWVzLlxuICAgIC8vXG4gICAgLy8gRm9yIGV4YW1wbGU6XG4gICAgLy8gICAgXG4gICAgLy8gWyB7XG4gICAgLy8gICAgIGJsb2NrU2l6ZTogMTYsXG4gICAgLy8gICAgIG1heDogWyAwLjcsICAwLjUsIDAuMjUsIC0wLjEgXSxcbiAgICAvLyAgICAgbWluOiBbIDAuNSwgLTAuMSwgLTAuOCwgLTAuMiBdXG4gICAgLy8gICB9LCB7XG4gICAgLy8gICAgIGJsb2NrU2l6ZTogMzIsIFxuICAgIC8vICAgICBtYXg6IFsgIDAuNywgIDAuMjUgXSxcbiAgICAvLyAgICAgbWluOiBbIC0wLjEsIC0wLjggIF1cbiAgICAvLyAgIH1cbiAgICAvLyBdXG4gICAgLy9cbiAgICAvLyBBcyBpdCBoYXBwZW5zIHdlIGFyZSBvbmx5IGNyZWF0aW5nIGEgY2FjaGUgd2l0aCBhIHNpbmdsZSBibG9ja1xuICAgIC8vIHNpemUgYXQgdGhlIG1vbWVudCwgYnV0IGl0J3MgdXNlZnVsIHRvIHJlY29yZCB0aGF0IGJsb2NrIHNpemVcbiAgICAvLyBpbiB0aGUgY2FjaGUgcmF0aGVyIHRoYW4gaGF2ZSB0byBmaXggaXQgaGVyZSBpbiB0aGUgc2hhcGUuXG5cbiAgICBjb25zdCBiZWZvcmUgPSBwZXJmb3JtYW5jZS5ub3coKTtcblxuICAgIGNvbnN0IHBlYWtDYWNoZUZvciA9ICgoYXJyLCBibG9ja1NpemUpID0+IHtcbiAgICBcbiAgICAgIGxldCBwZWFrcyA9IFtdLCB0cm91Z2hzID0gW107XG5cbiAgICAgIGNvbnN0IGxlbiA9IGFyci5sZW5ndGg7XG4gICAgXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSA9IGkgKyBibG9ja1NpemUpIHtcbiAgICAgICAgbGV0IG1pbiA9IGFycltpXTtcbiAgICAgICAgbGV0IG1heCA9IGFycltpXTtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBibG9ja1NpemU7IGorKykge1xuICAgICAgICAgIGxldCBzYW1wbGUgPSBhcnJbaSArIGpdO1xuICAgICAgICAgIGlmIChzYW1wbGUgPCBtaW4pIHsgbWluID0gc2FtcGxlOyB9XG4gICAgICAgICAgaWYgKHNhbXBsZSA+IG1heCkgeyBtYXggPSBzYW1wbGU7IH1cbiAgICAgICAgfVxuICAgICAgICBwZWFrcy5wdXNoKG1heCk7XG4gICAgICAgIHRyb3VnaHMucHVzaChtaW4pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gWyBwZWFrcywgdHJvdWdocyBdO1xuICAgIH0pO1xuXG4gICAgLy8gRm9yIGEgc2luZ2xlIHBlYWsgY2FjaGUsIGV4cGVyaW1lbnQgc3VnZ2VzdHMgc21hbGxpc2ggYmxvY2tcbiAgICAvLyBzaXplcyBhcmUgYmV0dGVyLiBUaGVyZSdzIG5vIGJlbmVmaXQgaW4gaGF2aW5nIG11bHRpcGxlIGxheWVyc1xuICAgIC8vIG9mIGNhY2hlIChlLmcuIDMyIGFuZCA1MTIpIHVubGVzcyB1cGRhdGUoKSBjYW4gdGFrZSBhZHZhbnRhZ2VcbiAgICAvLyBvZiBib3RoIGluIGEgc2luZ2xlIHN1bW1hcmlzZSBhY3Rpb24gKGUuZy4gd2hlbiBhc2tlZCBmb3IgYVxuICAgIC8vIHJlYWQgZnJvbSAzMTAgdG8gMTA1MCwgc3RhcnQgYnkgcmVhZGluZyBzaW5nbGUgc2FtcGxlcyBmcm9tIDMxMFxuICAgIC8vIHRvIDMyMCwgdGhlbiBmcm9tIHRoZSAzMi1zYW1wbGUgY2FjaGUgZnJvbSAzMjAgdG8gNTEyLCB0aGVuXG4gICAgLy8gc3dpdGNoIHRvIHRoZSA1MTIgc2FtcGxlIGNhY2hlLCByYXRoZXIgdGhhbiBoYXZpbmcgdG8gcmVhZFxuICAgIC8vIHNpbmdsZSBzYW1wbGVzIGFsbCB0aGUgd2F5IGZyb20gMzEwIHRvIDUxMikuLi4gYnV0IGF0IHRoZVxuICAgIC8vIG1vbWVudCBpdCBjYW4ndC4gQW5kIHRoZSBtb3JlIGNvbXBsZXggbG9naWMgd291bGQgY2FycnkgaXRzIG93blxuICAgIC8vIG92ZXJoZWFkLlxuICAgIFxuICAgIGNvbnN0IGJsb2NrU2l6ZSA9IHRoaXMucGFyYW1zLnBlYWtDYWNoZUJsb2NrU2l6ZTtcbiAgICBsZXQgWyBwZWFrcywgdHJvdWdocyBdID0gcGVha0NhY2hlRm9yKHNhbXBsZXMsIGJsb2NrU2l6ZSk7XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgIHNhbXBsZXMsXG4gICAgICBwZWFrQ2FjaGVzOiBbXG4gICAgICAgIHsgYmxvY2tTaXplLFxuICAgICAgICAgIG1heDogcGVha3MsXG4gICAgICAgICAgbWluOiB0cm91Z2hzXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9O1xuICB9XG4gIFxuICBzdW1tYXJpc2UoY2FjaGUsIG1pblgsIG1heFgsIHBpeGVsVG9TYW1wbGUpIHtcblxuICAgIGNvbnN0IGJlZm9yZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gICAgY29uc3Qgc2FtcGxlcyA9IGNhY2hlLnNhbXBsZXM7XG4gICAgXG4gICAgY29uc3QgcHgwID0gTWF0aC5mbG9vcihtaW5YKTtcbiAgICBjb25zdCBweDEgPSBNYXRoLmZsb29yKG1heFgpO1xuXG4gICAgbGV0IHBlYWtDYWNoZSA9IG51bGw7XG4gICAgbGV0IHBlYWtDYWNoZUJsb2NrU2l6ZSA9IDA7XG5cbiAgICBpZiAoY2FjaGUgJiYgKGNhY2hlLnBlYWtDYWNoZXMubGVuZ3RoID4gMCkpIHtcblxuICAgICAgLy8gRmluZCBhIHN1aXRhYmxlIHBlYWsgY2FjaGUgaWYgd2UgaGF2ZSBvbmUuXG4gICAgICBcbiAgICAgIC8vIFwic3RlcFwiIGlzIHRoZSBkaXN0YW5jZSBpbiBzYW1wbGVzIGZyb20gb25lIHBpeGVsIHRvIHRoZSBuZXh0LlxuICAgICAgLy8gV2Ugd2FudCB0aGUgbGFyZ2VzdCBjYWNoZSB3aG9zZSBibG9jayBzaXplIGlzIG5vIGxhcmdlciB0aGFuXG4gICAgICAvLyBoYWxmIHRoaXMsIHNvIGFzIHRvIGF2b2lkIHNpdHVhdGlvbnMgd2hlcmUgb3VyIHN0ZXAgaXMgYWx3YXlzXG4gICAgICAvLyBzdHJhZGRsaW5nIGNhY2hlIGJsb2NrIGJvdW5kYXJpZXMuXG4gICAgICBjb25zdCBzdGVwID0gcGl4ZWxUb1NhbXBsZShweDAgKyAxKSAtIHBpeGVsVG9TYW1wbGUocHgwKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWNoZS5wZWFrQ2FjaGVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGNvbnN0IGJsb2NrU2l6ZSA9IGNhY2hlLnBlYWtDYWNoZXNbaV0uYmxvY2tTaXplO1xuICAgICAgICBpZiAoYmxvY2tTaXplID4gcGVha0NhY2hlQmxvY2tTaXplICYmIGJsb2NrU2l6ZSA8PSBzdGVwLzIpIHtcbiAgICAgICAgICBwZWFrQ2FjaGUgPSBjYWNoZS5wZWFrQ2FjaGVzW2ldO1xuICAgICAgICAgIHBlYWtDYWNoZUJsb2NrU2l6ZSA9IHBlYWtDYWNoZS5ibG9ja1NpemU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBzYW1wbGVSYXRlID0gdGhpcy5wYXJhbXMuc2FtcGxlUmF0ZTtcbiAgICBsZXQgbWluTWF4ID0gW107XG5cbiAgICBmb3IgKGxldCBweCA9IHB4MDsgcHggPCBweDE7IHB4KyspIHtcblxuICAgICAgY29uc3Qgc3RhcnRTYW1wbGUgPSBwaXhlbFRvU2FtcGxlKHB4KTtcbiAgICAgIGlmIChzdGFydFNhbXBsZSA8IDApIGNvbnRpbnVlO1xuICAgICAgaWYgKHN0YXJ0U2FtcGxlID49IHNhbXBsZXMubGVuZ3RoKSBicmVhaztcblxuICAgICAgbGV0IGVuZFNhbXBsZSA9IHBpeGVsVG9TYW1wbGUocHggKyAxKTtcbiAgICAgIGlmIChlbmRTYW1wbGUgPj0gc2FtcGxlcy5sZW5ndGgpIGVuZFNhbXBsZSA9IHNhbXBsZXMubGVuZ3RoO1xuICAgICAgaWYgKGVuZFNhbXBsZSA8IDApIGNvbnRpbnVlO1xuXG4gICAgICBsZXQgbWluID0gc2FtcGxlc1tzdGFydFNhbXBsZV07XG4gICAgICBsZXQgbWF4ID0gbWluO1xuICAgICAgXG4gICAgICBsZXQgaXggPSBzdGFydFNhbXBsZTtcblxuICAgICAgaWYgKHBlYWtDYWNoZSAmJiAocGVha0NhY2hlQmxvY2tTaXplID4gMCkpIHtcbiAgICAgIFxuICAgICAgICB3aGlsZSAoaXggPCBlbmRTYW1wbGUgJiYgKGl4ICUgcGVha0NhY2hlQmxvY2tTaXplKSAhPT0gMCkge1xuICAgICAgICAgIGxldCBzYW1wbGUgPSBzYW1wbGVzW2l4XTtcbiAgICAgICAgICBpZiAoc2FtcGxlIDwgbWluKSB7IG1pbiA9IHNhbXBsZTsgfVxuICAgICAgICAgIGlmIChzYW1wbGUgPiBtYXgpIHsgbWF4ID0gc2FtcGxlOyB9XG4gICAgICAgICAgKytpeDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjYWNoZUl4ID0gaXggLyBwZWFrQ2FjaGVCbG9ja1NpemU7XG4gICAgICAgIGNvbnN0IGNhY2hlTWF4ID0gcGVha0NhY2hlLm1heDtcbiAgICAgICAgY29uc3QgY2FjaGVNaW4gPSBwZWFrQ2FjaGUubWluO1xuICAgICAgXG4gICAgICAgIHdoaWxlIChpeCArIHBlYWtDYWNoZUJsb2NrU2l6ZSA8PSBlbmRTYW1wbGUpIHtcbiAgICAgICAgICBpZiAoY2FjaGVNYXhbY2FjaGVJeF0gPiBtYXgpIG1heCA9IGNhY2hlTWF4W2NhY2hlSXhdO1xuICAgICAgICAgIGlmIChjYWNoZU1pbltjYWNoZUl4XSA8IG1pbikgbWluID0gY2FjaGVNaW5bY2FjaGVJeF07XG4gICAgICAgICAgKytjYWNoZUl4O1xuICAgICAgICAgIGl4ID0gaXggKyBwZWFrQ2FjaGVCbG9ja1NpemU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgd2hpbGUgKGl4IDwgZW5kU2FtcGxlKSB7XG4gICAgICAgIGxldCBzYW1wbGUgPSBzYW1wbGVzW2l4XTtcbiAgICAgICAgaWYgKHNhbXBsZSA8IG1pbikgeyBtaW4gPSBzYW1wbGU7IH1cbiAgICAgICAgaWYgKHNhbXBsZSA+IG1heCkgeyBtYXggPSBzYW1wbGU7IH1cbiAgICAgICAgKytpeDtcbiAgICAgIH1cblxuICAgICAgbWluTWF4LnB1c2goW3B4LCBtaW4sIG1heF0pO1xuICAgIH1cblxuICAgIGNvbnN0IGFmdGVyID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgY29uc29sZS5sb2coXCJ3YXZlZm9ybSBzdW1tYXJpc2F0aW9uIHRpbWUgPSBcIiArIE1hdGgucm91bmQoYWZ0ZXIgLSBiZWZvcmUpKTtcbiAgICBcbiAgICByZXR1cm4gbWluTWF4O1xuICB9XG5cbiAgX3VwZGF0ZVN1bW1hcmlzaW5nKHJlbmRlcmluZ0NvbnRleHQsIGNhY2hlLCBwaXhlbFRvU2FtcGxlKSB7XG5cbiAgICBjb25zb2xlLmxvZyhcIndhdmVmb3JtIHVwZGF0ZVN1bW1hcmlzaW5nXCIpO1xuICAgIFxuICAgIGNvbnN0IG1pblggPSByZW5kZXJpbmdDb250ZXh0Lm1pblg7XG4gICAgY29uc3QgbWF4WCA9IHJlbmRlcmluZ0NvbnRleHQubWF4WDtcbiAgICBcbiAgICAvLyBnZXQgbWluL21heCB2YWx1ZXMgcGVyIHBpeGVsXG4gICAgY29uc3QgbWluTWF4ID0gdGhpcy5zdW1tYXJpc2UoY2FjaGUsIG1pblgsIG1heFgsIHBpeGVsVG9TYW1wbGUpO1xuICAgIGlmICghbWluTWF4Lmxlbmd0aCkgeyByZXR1cm47IH1cblxuICAgIGxldCBpbnN0cnVjdGlvbnMgPSBtaW5NYXgubWFwKGRhdHVtID0+IHtcbiAgICAgIGNvbnN0IFsgeCwgbWluLCBtYXggXSA9IGRhdHVtO1xuICAgICAgY29uc3QgeTEgPSBNYXRoLnJvdW5kKHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKG1pbikpO1xuICAgICAgY29uc3QgeTIgPSBNYXRoLnJvdW5kKHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKG1heCkpO1xuICAgICAgcmV0dXJuIGAke3h9LCR7eTF9TCR7eH0sJHt5Mn1gO1xuICAgIH0pO1xuXG4gICAgY29uc3QgZCA9ICdNJyArIGluc3RydWN0aW9ucy5qb2luKCdMJyk7XG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdjcmlzcEVkZ2VzJyk7XG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZS13aWR0aCcsIDEuMCk7XG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLCBkKTtcbiAgfVxuXG4gIF91cGRhdGVJbnRlcnBvbGF0aW5nKHJlbmRlcmluZ0NvbnRleHQsIGNhY2hlLCBwaXhlbFRvU2FtcGxlLCBzYW1wbGVUb1BpeGVsKSB7XG5cbiAgICBjb25zb2xlLmxvZyhcIndhdmVmb3JtIHVwZGF0ZUludGVycG9sYXRpbmdcIik7XG4gICAgXG4gICAgY29uc3QgbWluWCA9IHJlbmRlcmluZ0NvbnRleHQubWluWDtcbiAgICBjb25zdCBtYXhYID0gcmVuZGVyaW5nQ29udGV4dC5tYXhYO1xuXG4gICAgY29uc3QgczAgPSBwaXhlbFRvU2FtcGxlKG1pblgpO1xuICAgIGNvbnN0IHMxID0gcGl4ZWxUb1NhbXBsZShtYXhYKSArIDE7XG5cbiAgICBjb25zdCBzYW1wbGVzID0gY2FjaGUuc2FtcGxlcztcbiAgICBjb25zdCBuID0gc2FtcGxlcy5sZW5ndGg7XG5cbiAgICBjb25zb2xlLmxvZyhcIm1pblggPSBcIiArIG1pblggKyBcIiwgbWF4WCA9IFwiICsgbWF4WCArIFwiLCBzMCA9IFwiICsgczAgKyBcIiwgczEgPSBcIiArIHMxKTtcblxuICAgIGxldCBpbnN0cnVjdGlvbnMgPSBbXTtcblxuICAgIC8vIFBpeGVsIGNvb3JkaW5hdGVzIGluIHRoaXMgZnVuY3Rpb24gYXJlICpub3QqIHJvdW5kZWQsIHdlIHdhbnRcbiAgICAvLyB0byBwcmVzZXJ2ZSB0aGUgcHJvcGVyIHNoYXBlIGFzIGZhciBhcyBwb3NzaWJsZVxuXG4gICAgLy8gQWRkIGEgbGl0dGxlIHNxdWFyZSBmb3IgZWFjaCBzYW1wbGUgbG9jYXRpb25cbiAgICBcbiAgICBmb3IgKGxldCBpID0gczA7IGkgPCBzMSAmJiBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAoaSA8IDApIGNvbnRpbnVlO1xuICAgICAgY29uc3QgeCA9IHNhbXBsZVRvUGl4ZWwoaSk7XG4gICAgICBjb25zdCB5ID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwoc2FtcGxlc1tpXSk7XG4gICAgICBpbnN0cnVjdGlvbnMucHVzaChgTSR7eC0xfSwke3ktMX1oMnYyaC0ydi0yYCk7XG4gICAgfVxuXG4gICAgLy8gTm93IGZpbGwgaW4gdGhlIGdhcHMgYmV0d2VlbiB0aGUgc3F1YXJlc1xuXG4gICAgY29uc3QgZmFjdG9yID0gdGhpcy5mYWN0b3I7XG4gICAgY29uc3Qgb3ZlcnNhbXBsZWQgPSB0aGlzLm92ZXJzYW1wbGVyLm92ZXJzYW1wbGUoc2FtcGxlcywgczAsIHMxIC0gczApO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvdmVyc2FtcGxlZC5sZW5ndGg7ICsraSkge1xuICAgICAgY29uc3QgeCA9IHNhbXBsZVRvUGl4ZWwoczAgKyBpL2ZhY3Rvcik7IC8vIHNhbXBsZVRvUGl4ZWwgYWNjZXB0cyBub24taW50ZWdlcnNcbiAgICAgIGNvbnN0IHkgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChvdmVyc2FtcGxlZFtpXSk7XG4gICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChgTSR7eH0sJHt5fWApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goYEwke3h9LCR7eX1gKTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgY29uc3QgZCA9IGluc3RydWN0aW9ucy5qb2luKCcnKTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc2hhcGUtcmVuZGVyaW5nJywgJ2dlb21ldHJpY1ByZWNpc2lvbicpO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2Utd2lkdGgnLCAwLjYpO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgZCk7XG4gIH1cbiAgXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBjYWNoZSkge1xuXG4gICAgY29uc29sZS5sb2coXCJ3YXZlZm9ybSB1cGRhdGUgY2FsbGVkXCIpO1xuICAgIFxuICAgIGNvbnN0IGJlZm9yZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gICAgY29uc3Qgc2FtcGxlUmF0ZSA9IHRoaXMucGFyYW1zLnNhbXBsZVJhdGU7XG4gICAgY29uc3QgbWluWCA9IHJlbmRlcmluZ0NvbnRleHQubWluWDtcbiAgICBcbiAgICBjb25zdCBzdGVwID0gc2FtcGxlUmF0ZSAqIChyZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydChtaW5YICsgMSkgLVxuXHRcdFx0ICAgICAgIHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KG1pblgpKTtcblxuICAgIGNvbnN0IHNuYXBUb0NhY2hlQm91bmRhcmllcyA9IChzdGVwID49IHRoaXMucGFyYW1zLnBlYWtDYWNoZUJsb2NrU2l6ZSAqIDIpO1xuICAgIFxuICAgIGNvbnNvbGUubG9nKFwid2F2ZWZvcm0gdXBkYXRlOiBwaXhlbCBzdGVwID0gXCIgKyBzdGVwICsgXCIgc2FtcGxlcywgc25hcFRvQ2FjaGVCb3VuZGFyaWVzID0gXCIgKyBzbmFwVG9DYWNoZUJvdW5kYXJpZXMpO1xuXG4gICAgY29uc3QgcGl4ZWxUb1NhbXBsZVNuYXBwZWQgPSAocGl4ZWwgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMucGFyYW1zLnBlYWtDYWNoZUJsb2NrU2l6ZSAqXG5cdE1hdGguZmxvb3IgKChzYW1wbGVSYXRlICogcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQocGl4ZWwpKSAvXG5cdFx0ICAgIHRoaXMucGFyYW1zLnBlYWtDYWNoZUJsb2NrU2l6ZSk7XG4gICAgfSk7XG4gICAgY29uc3QgcGl4ZWxUb1NhbXBsZVVuc25hcHBlZCA9IChwaXhlbCA9PiB7XG4gICAgICByZXR1cm4gTWF0aC5mbG9vciAoc2FtcGxlUmF0ZSAqIHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHBpeGVsKSk7XG4gICAgfSk7XG4gICAgY29uc3QgcGl4ZWxUb1NhbXBsZSA9IChzbmFwVG9DYWNoZUJvdW5kYXJpZXMgP1xuXHRcdFx0ICAgcGl4ZWxUb1NhbXBsZVNuYXBwZWQgOlxuXHRcdFx0ICAgcGl4ZWxUb1NhbXBsZVVuc25hcHBlZCk7XG4gICAgXG4gICAgY29uc3Qgc2FtcGxlVG9QaXhlbCA9IChzYW1wbGUgPT4ge1xuICAgICAgLy8gbmVpdGhlciBzbmFwcGVkIG5vciBldmVuIHJvdW5kZWQgdG8gaW50ZWdlciBwaXhlbFxuICAgICAgcmV0dXJuIHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoc2FtcGxlIC8gc2FtcGxlUmF0ZSk7XG4gICAgfSk7XG5cbiAgICBpZiAoc3RlcCA+IDEuMCkge1xuICAgICAgdGhpcy5fdXBkYXRlU3VtbWFyaXNpbmcocmVuZGVyaW5nQ29udGV4dCwgY2FjaGUsXG5cdFx0XHQgICAgICBwaXhlbFRvU2FtcGxlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdXBkYXRlSW50ZXJwb2xhdGluZyhyZW5kZXJpbmdDb250ZXh0LCBjYWNoZSxcblx0XHRcdFx0cGl4ZWxUb1NhbXBsZSwgc2FtcGxlVG9QaXhlbCk7XG4gICAgfVxuXG4gICAgY29uc3QgYWZ0ZXIgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICBjb25zb2xlLmxvZyhcIndhdmVmb3JtIHVwZGF0ZSB0aW1lID0gXCIgKyBNYXRoLnJvdW5kKGFmdGVyIC0gYmVmb3JlKSk7XG4gIH1cbn1cbiJdfQ==