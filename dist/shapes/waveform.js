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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0QsZUFBVSxDQUFDLFNBQUksRUFBRSxTQUFJLENBQUMsU0FBSSxFQUFFLENBQUc7T0FDaEMsQ0FBQyxDQUFDOztBQUVILFVBQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZDLFVBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRXRDLFVBQU0sS0FBSyxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNoQyxhQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7S0FDckU7OztTQTNOa0IsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoic3JjL3NoYXBlcy93YXZlZm9ybS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9iYXNlLXNoYXBlJztcblxuXG5jb25zdCB4aHRtbE5TID0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnO1xuXG4vKipcbiAqIEEgc2hhcGUgdG8gZGlzcGxheSBhIHdhdmVmb3JtLiAoZm9yIGVudGl0eSBkYXRhKVxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLXdhdmVmb3JtLmh0bWwpXG4gKlxuICogQHRvZG8gLSBmaXggcHJvYmxlbXMgd2l0aCBjYW52YXMgc3RyYXRlZ3kuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdhdmVmb3JtIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ3dhdmVmb3JtJzsgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgLy8gcmV0dXJuIHsgeTogMCB9O1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2FtcGxlUmF0ZTogNDQxMDAsXG4gICAgICBjb2xvcjogJyMwMDAwMDAnLFxuICAgICAgb3BhY2l0eTogMSxcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICBpZiAodGhpcy4kZWwpIHsgcmV0dXJuIHRoaXMuJGVsOyB9XG5cbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncGF0aCcpO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgJ25vbmUnKTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc2hhcGUtcmVuZGVyaW5nJywgJ2NyaXNwRWRnZXMnKTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlJywgdGhpcy5wYXJhbXMuY29sb3IpO1xuICAgIHRoaXMuJGVsLnN0eWxlLm9wYWNpdHkgPSB0aGlzLnBhcmFtcy5vcGFjaXR5O1xuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgZW5jYWNoZShzYW1wbGVzKSB7XG5cbiAgICBjb25zb2xlLmxvZyhcIndhdmVmb3JtIGVuY2FjaGUgY2FsbGVkXCIpO1xuXG4gICAgLy8gVGhlIGNhY2hlIGlzIGFuIGFycmF5IG9mIHBlYWsgY2FjaGVzIChob2xkaW5nIHRoZSBtaW4gYW5kIG1heFxuICAgIC8vIHZhbHVlcyB3aXRoaW4gZWFjaCBibG9jayBmb3IgYSBnaXZlbiBibG9jayBzaXplKSB3aXRoIGVhY2ggcGVha1xuICAgIC8vIGNhY2hlIHJlcHJlc2VudGVkIGFzIGFuIG9iamVjdCB3aXRoIGJsb2NrU2l6ZSwgbWluIGFycmF5LCBhbmRcbiAgICAvLyBtYXggYXJyYXkgcHJvcGVydGllcy5cbiAgICAvL1xuICAgIC8vIEZvciBleGFtcGxlOlxuICAgIC8vICAgIFxuICAgIC8vIFsge1xuICAgIC8vICAgICBibG9ja1NpemU6IDE2LFxuICAgIC8vICAgICBtYXg6IFsgMC43LCAgMC41LCAwLjI1LCAtMC4xIF0sXG4gICAgLy8gICAgIG1pbjogWyAwLjUsIC0wLjEsIC0wLjgsIC0wLjIgXVxuICAgIC8vICAgfSwge1xuICAgIC8vICAgICBibG9ja1NpemU6IDMyLCBcbiAgICAvLyAgICAgbWF4OiBbICAwLjcsICAwLjI1IF0sXG4gICAgLy8gICAgIG1pbjogWyAtMC4xLCAtMC44ICBdXG4gICAgLy8gICB9XG4gICAgLy8gXVxuICAgIC8vXG4gICAgLy8gQXMgaXQgaGFwcGVucyB3ZSBhcmUgb25seSBjcmVhdGluZyBhIGNhY2hlIHdpdGggYSBzaW5nbGUgYmxvY2tcbiAgICAvLyBzaXplIGF0IHRoZSBtb21lbnQsIGJ1dCBpdCdzIHVzZWZ1bCB0byByZWNvcmQgdGhhdCBibG9jayBzaXplXG4gICAgLy8gaW4gdGhlIGNhY2hlIHJhdGhlciB0aGFuIGhhdmUgdG8gZml4IGl0IGhlcmUgaW4gdGhlIHNoYXBlLlxuXG4gICAgY29uc3QgYmVmb3JlID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cbiAgICBjb25zdCBwZWFrQ2FjaGVGb3IgPSAoKGFyciwgYmxvY2tTaXplKSA9PiB7XG4gICAgXG4gICAgICBsZXQgcGVha3MgPSBbXSwgdHJvdWdocyA9IFtdO1xuXG4gICAgICBjb25zdCBsZW4gPSBhcnIubGVuZ3RoO1xuICAgIFxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkgPSBpICsgYmxvY2tTaXplKSB7XG4gICAgICAgIGxldCBtaW4gPSBhcnJbaV07XG4gICAgICAgIGxldCBtYXggPSBhcnJbaV07XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgYmxvY2tTaXplOyBqKyspIHtcbiAgICAgICAgICBsZXQgc2FtcGxlID0gYXJyW2kgKyBqXTtcbiAgICAgICAgICBpZiAoc2FtcGxlIDwgbWluKSB7IG1pbiA9IHNhbXBsZTsgfVxuICAgICAgICAgIGlmIChzYW1wbGUgPiBtYXgpIHsgbWF4ID0gc2FtcGxlOyB9XG4gICAgICAgIH1cbiAgICAgICAgcGVha3MucHVzaChtYXgpO1xuICAgICAgICB0cm91Z2hzLnB1c2gobWluKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIFsgcGVha3MsIHRyb3VnaHMgXTtcbiAgICB9KTtcblxuICAgIC8vIEZvciBhIHNpbmdsZSBwZWFrIGNhY2hlLCBleHBlcmltZW50IHN1Z2dlc3RzIHNtYWxsaXNoIGJsb2NrXG4gICAgLy8gc2l6ZXMgYXJlIGJldHRlci4gVGhlcmUncyBubyBiZW5lZml0IGluIGhhdmluZyBtdWx0aXBsZSBsYXllcnNcbiAgICAvLyBvZiBjYWNoZSAoZS5nLiAzMiBhbmQgNTEyKSB1bmxlc3MgdXBkYXRlKCkgY2FuIHRha2UgYWR2YW50YWdlXG4gICAgLy8gb2YgYm90aCBpbiBhIHNpbmdsZSBzdW1tYXJpc2UgYWN0aW9uIChlLmcuIHdoZW4gYXNrZWQgZm9yIGFcbiAgICAvLyByZWFkIGZyb20gMzEwIHRvIDEwNTAsIHN0YXJ0IGJ5IHJlYWRpbmcgc2luZ2xlIHNhbXBsZXMgZnJvbSAzMTBcbiAgICAvLyB0byAzMjAsIHRoZW4gZnJvbSB0aGUgMzItc2FtcGxlIGNhY2hlIGZyb20gMzIwIHRvIDUxMiwgdGhlblxuICAgIC8vIHN3aXRjaCB0byB0aGUgNTEyIHNhbXBsZSBjYWNoZSwgcmF0aGVyIHRoYW4gaGF2aW5nIHRvIHJlYWRcbiAgICAvLyBzaW5nbGUgc2FtcGxlcyBhbGwgdGhlIHdheSBmcm9tIDMxMCB0byA1MTIpLi4uIGJ1dCBhdCB0aGVcbiAgICAvLyBtb21lbnQgaXQgY2FuJ3QuIEFuZCB0aGUgbW9yZSBjb21wbGV4IGxvZ2ljIHdvdWxkIGNhcnJ5IGl0cyBvd25cbiAgICAvLyBvdmVyaGVhZC5cbiAgICBcbiAgICBjb25zdCBibG9ja1NpemUgPSAzMjtcbiAgICBsZXQgWyBwZWFrcywgdHJvdWdocyBdID0gcGVha0NhY2hlRm9yKHNhbXBsZXMsIGJsb2NrU2l6ZSk7XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgIHNhbXBsZXMsXG4gICAgICBwZWFrQ2FjaGVzOiBbXG4gICAgICAgIHsgYmxvY2tTaXplLFxuICAgICAgICAgIG1heDogcGVha3MsXG4gICAgICAgICAgbWluOiB0cm91Z2hzXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9O1xuICB9XG4gIFxuICBzdW1tYXJpc2UoY2FjaGUsIG1pblgsIG1heFgsIHBpeGVsVG9TYW1wbGUpIHtcblxuICAgIGNvbnN0IGJlZm9yZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gICAgY29uc3Qgc2FtcGxlcyA9IGNhY2hlLnNhbXBsZXM7XG4gICAgXG4gICAgY29uc3QgcHgwID0gTWF0aC5mbG9vcihtaW5YKTtcbiAgICBjb25zdCBweDEgPSBNYXRoLmZsb29yKG1heFgpO1xuXG4gICAgbGV0IHBlYWtDYWNoZSA9IG51bGw7XG4gICAgbGV0IHBlYWtDYWNoZUJsb2NrU2l6ZSA9IDA7XG5cbiAgICBpZiAoY2FjaGUgJiYgKGNhY2hlLnBlYWtDYWNoZXMubGVuZ3RoID4gMCkpIHtcblxuICAgICAgLy8gRmluZCBhIHN1aXRhYmxlIHBlYWsgY2FjaGUgaWYgd2UgaGF2ZSBvbmUuXG4gICAgICBcbiAgICAgIC8vIFwic3RlcFwiIGlzIHRoZSBkaXN0YW5jZSBpbiBzYW1wbGVzIGZyb20gb25lIHBpeGVsIHRvIHRoZSBuZXh0LlxuICAgICAgLy8gV2Ugd2FudCB0aGUgbGFyZ2VzdCBjYWNoZSB3aG9zZSBibG9jayBzaXplIGlzIG5vIGxhcmdlciB0aGFuXG4gICAgICAvLyBoYWxmIHRoaXMsIHNvIGFzIHRvIGF2b2lkIHNpdHVhdGlvbnMgd2hlcmUgb3VyIHN0ZXAgaXMgYWx3YXlzXG4gICAgICAvLyBzdHJhZGRsaW5nIGNhY2hlIGJsb2NrIGJvdW5kYXJpZXMuXG4gICAgICBjb25zdCBzdGVwID0gcGl4ZWxUb1NhbXBsZShweDAgKyAxKSAtIHBpeGVsVG9TYW1wbGUocHgwKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWNoZS5wZWFrQ2FjaGVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGNvbnN0IGJsb2NrU2l6ZSA9IGNhY2hlLnBlYWtDYWNoZXNbaV0uYmxvY2tTaXplO1xuICAgICAgICBpZiAoYmxvY2tTaXplID4gcGVha0NhY2hlQmxvY2tTaXplICYmIGJsb2NrU2l6ZSA8PSBzdGVwLzIpIHtcbiAgICAgICAgICBwZWFrQ2FjaGUgPSBjYWNoZS5wZWFrQ2FjaGVzW2ldO1xuICAgICAgICAgIHBlYWtDYWNoZUJsb2NrU2l6ZSA9IHBlYWtDYWNoZS5ibG9ja1NpemU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBzYW1wbGVSYXRlID0gdGhpcy5wYXJhbXMuc2FtcGxlUmF0ZTtcbiAgICBsZXQgbWluTWF4ID0gW107XG5cbiAgICBmb3IgKGxldCBweCA9IHB4MDsgcHggPCBweDE7IHB4KyspIHtcblxuICAgICAgY29uc3Qgc3RhcnRTYW1wbGUgPSBwaXhlbFRvU2FtcGxlKHB4KTtcbiAgICAgIGlmIChzdGFydFNhbXBsZSA+PSBzYW1wbGVzLmxlbmd0aCkgYnJlYWs7XG5cbiAgICAgIGxldCBlbmRTYW1wbGUgPSBwaXhlbFRvU2FtcGxlKHB4ICsgMSk7XG4gICAgICBpZiAoZW5kU2FtcGxlID49IHNhbXBsZXMubGVuZ3RoKSBlbmRTYW1wbGUgPSBzYW1wbGVzLmxlbmd0aDtcbiAgICAgIFxuICAgICAgbGV0IG1pbiA9IHNhbXBsZXNbc3RhcnRTYW1wbGVdO1xuICAgICAgbGV0IG1heCA9IG1pbjtcbiAgICAgIFxuICAgICAgbGV0IGl4ID0gc3RhcnRTYW1wbGU7XG5cbiAgICAgIGlmIChwZWFrQ2FjaGUgJiYgKHBlYWtDYWNoZUJsb2NrU2l6ZSA+IDApKSB7XG4gICAgICBcbiAgICAgICAgd2hpbGUgKGl4IDwgZW5kU2FtcGxlICYmIChpeCAlIHBlYWtDYWNoZUJsb2NrU2l6ZSkgIT09IDApIHtcbiAgICAgICAgICBsZXQgc2FtcGxlID0gc2FtcGxlc1tpeF07XG4gICAgICAgICAgaWYgKHNhbXBsZSA8IG1pbikgeyBtaW4gPSBzYW1wbGU7IH1cbiAgICAgICAgICBpZiAoc2FtcGxlID4gbWF4KSB7IG1heCA9IHNhbXBsZTsgfVxuICAgICAgICAgICsraXg7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY2FjaGVJeCA9IGl4IC8gcGVha0NhY2hlQmxvY2tTaXplO1xuICAgICAgICBjb25zdCBjYWNoZU1heCA9IHBlYWtDYWNoZS5tYXg7XG4gICAgICAgIGNvbnN0IGNhY2hlTWluID0gcGVha0NhY2hlLm1pbjtcbiAgICAgIFxuICAgICAgICB3aGlsZSAoaXggKyBwZWFrQ2FjaGVCbG9ja1NpemUgPD0gZW5kU2FtcGxlKSB7XG4gICAgICAgICAgaWYgKGNhY2hlTWF4W2NhY2hlSXhdID4gbWF4KSBtYXggPSBjYWNoZU1heFtjYWNoZUl4XTtcbiAgICAgICAgICBpZiAoY2FjaGVNaW5bY2FjaGVJeF0gPCBtaW4pIG1pbiA9IGNhY2hlTWluW2NhY2hlSXhdO1xuICAgICAgICAgICsrY2FjaGVJeDtcbiAgICAgICAgICBpeCA9IGl4ICsgcGVha0NhY2hlQmxvY2tTaXplO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHdoaWxlIChpeCA8IGVuZFNhbXBsZSkge1xuICAgICAgICBsZXQgc2FtcGxlID0gc2FtcGxlc1tpeF07XG4gICAgICAgIGlmIChzYW1wbGUgPCBtaW4pIHsgbWluID0gc2FtcGxlOyB9XG4gICAgICAgIGlmIChzYW1wbGUgPiBtYXgpIHsgbWF4ID0gc2FtcGxlOyB9XG4gICAgICAgICsraXg7XG4gICAgICB9XG5cbiAgICAgIG1pbk1heC5wdXNoKFtweCwgbWluLCBtYXhdKTtcbiAgICB9XG5cbiAgICBjb25zdCBhZnRlciA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIGNvbnNvbGUubG9nKFwid2F2ZWZvcm0gc3VtbWFyaXNhdGlvbiB0aW1lID0gXCIgKyBNYXRoLnJvdW5kKGFmdGVyIC0gYmVmb3JlKSk7XG4gICAgXG4gICAgcmV0dXJuIG1pbk1heDtcbiAgfVxuXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBjYWNoZSkge1xuXG4gICAgY29uc3QgYmVmb3JlID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cbiAgICBjb25zdCBtaW5YID0gcmVuZGVyaW5nQ29udGV4dC5taW5YO1xuICAgIGNvbnN0IG1heFggPSByZW5kZXJpbmdDb250ZXh0Lm1heFg7XG5cbiAgICBjb25zdCBzYW1wbGVSYXRlID0gdGhpcy5wYXJhbXMuc2FtcGxlUmF0ZTtcbiAgICBjb25zdCBwaXhlbFRvU2FtcGxlID0gKHBpeGVsID0+IHtcbiAgICAgIHJldHVybiBNYXRoLmZsb29yIChzYW1wbGVSYXRlICogcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQocGl4ZWwpKTtcbiAgICB9KTtcblxuICAgIC8vIGdldCBtaW4vbWF4IHBlciBwaXhlbHMsIGNsYW1wZWQgdG8gdGhlIHZpc2libGUgYXJlYVxuICAgIGNvbnN0IG1pbk1heCA9IHRoaXMuc3VtbWFyaXNlKGNhY2hlLCBtaW5YLCBtYXhYLCBwaXhlbFRvU2FtcGxlKTtcbiAgICBpZiAoIW1pbk1heC5sZW5ndGgpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBQSVhFTCA9IDA7XG4gICAgY29uc3QgTUlOICAgPSAxO1xuICAgIGNvbnN0IE1BWCAgID0gMjtcbiAgICBjb25zdCBaRVJPICA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKDApO1xuXG4gICAgbGV0IGluc3RydWN0aW9ucyA9IG1pbk1heC5tYXAoKGRhdHVtLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgeCAgPSBkYXR1bVtQSVhFTF07XG4gICAgICBsZXQgeTEgPSBNYXRoLnJvdW5kKHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKGRhdHVtW01JTl0pKTtcbiAgICAgIGxldCB5MiA9IE1hdGgucm91bmQocmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwoZGF0dW1bTUFYXSkpO1xuICAgICAgcmV0dXJuIGAke3h9LCR7eTF9TCR7eH0sJHt5Mn1gO1xuICAgIH0pO1xuXG4gICAgY29uc3QgZCA9ICdNJyArIGluc3RydWN0aW9ucy5qb2luKCdMJyk7XG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLCBkKTtcblxuICAgIGNvbnN0IGFmdGVyID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgY29uc29sZS5sb2coXCJ3YXZlZm9ybSB1cGRhdGUgdGltZSA9IFwiICsgTWF0aC5yb3VuZChhZnRlciAtIGJlZm9yZSkpO1xuICB9XG59XG4iXX0=