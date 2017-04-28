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
      this.$el.setAttributeNS(null, 'shape-rendering', 'geometricPrecision');
      return this.$el;
    }
  }, {
    key: 'encache',
    value: function encache(data) {
      var _this = this;

      data = data.slice(0);
      data.sort(function (a, b) {
        return _this.cx(a) < _this.cx(b) ? -1 : 1;
      });

      return data;
    }
  }, {
    key: '_findInData',
    value: function _findInData(data, x) {

      // Binary search, demands that data has been encached
      // (i.e. sorted). Returns index of value that matches x. If there
      // is no exact match, returns the index just before where x would
      // appear, unless x would appear as the first element in which
      // case 0 is returned. (So the returned index is always in range
      // for the input array, unless the input array is empty.)

      // Note that x must be in model coordinates (e.g. time), not pixel
      // coords.

      var low = 0;
      var high = data.length - 1;

      while (low <= high) {
        var mid = low + (high - low >> 1);
        var value = this.cx(data[mid]);
        if (value < x) {
          low = mid + 1;
        } else if (value > x) {
          high = mid - 1;
        } else {
          return mid;
        }
      }

      if (high < 0) {
        return 0;
      } else {
        return high;
      }
    }
  }, {
    key: 'update',
    value: function update(renderingContext, data) {
      // data array is sorted already

      var before = performance.now();

      var minX = Math.floor(renderingContext.minX);
      var maxX = Math.ceil(renderingContext.maxX);

      console.log("minX = " + minX + ", maxX = " + maxX);

      var instructions = [];
      var n = data.length;

      if (n > 0) {

        // We want to start with the last element to the left of the
        // visible region, and end with the first element beyond the
        // right of it

        var cx0 = renderingContext.timeToPixel.invert(minX);
        var i0 = this._findInData(data, cx0);

        var nextX = renderingContext.timeToPixel(this.cx(data[i0]));

        for (var i = i0; i < n; ++i) {

          var x = nextX;

          if (i + 1 < n) {
            nextX = renderingContext.timeToPixel(this.cx(data[i + 1]));
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
  }, {
    key: 'describe',
    value: function describe(data, t) {
      if (!data.length) return 0;
      var i = this._findInData(data, t);
      var cx = this.cx(data[i]);
      var cy = this.cy(data[i]);
      var unit = "";
      if (typeof data[i].unit !== 'undefined') {
        unit = data[i].unit;
      }
      return [{
        cx: cx,
        cy: cy,
        unit: unit
      }];
    }
  }]);

  return Line;
})(_baseShape2['default']);

exports['default'] = Line;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ04sWUFBSSxFQUFFLElBQUk7T0FDWCxDQUFDLENBQUM7S0FDSjs7O1NBbElrQixJQUFJOzs7cUJBQUosSUFBSSIsImZpbGUiOiJzcmMvc2hhcGVzL2xpbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vYmFzZS1zaGFwZSc7XG5cbi8qKlxuICogQSBzaGFwZSB0byBkaXNwbGF5IGEgbGluZS4gSXRzIG1haW4gdXNlIGlzIGFzIGNvbW1vbiBzaGFwZSB0byBjcmVhdGUgYVxuICogYnJlYWtwb2ludCB2aXN1YWxpemF0aW9uLiAoZW50aXR5IHNoYXBlKVxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLWJyZWFrcG9pbnQuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGluZSBleHRlbmRzIEJhc2VTaGFwZSB7XG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICdsaW5lJzsgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgcmV0dXJuIHsgY3g6IDAsIGN5OiAwIH07XG4gIH1cblxuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHsgY29sb3I6ICcjMDAwMDAwJyB9O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICBpZiAodGhpcy4kZWwpIHsgcmV0dXJuIHRoaXMuJGVsOyB9XG5cbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncGF0aCcpO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnZ2VvbWV0cmljUHJlY2lzaW9uJyk7XG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgZW5jYWNoZShkYXRhKSB7XG5cbiAgICBkYXRhID0gZGF0YS5zbGljZSgwKTtcbiAgICBkYXRhLnNvcnQoKGEsIGIpID0+IHRoaXMuY3goYSkgPCB0aGlzLmN4KGIpID8gLTEgOiAxKTtcblxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgX2ZpbmRJbkRhdGEoZGF0YSwgeCkge1xuXG4gICAgLy8gQmluYXJ5IHNlYXJjaCwgZGVtYW5kcyB0aGF0IGRhdGEgaGFzIGJlZW4gZW5jYWNoZWRcbiAgICAvLyAoaS5lLiBzb3J0ZWQpLiBSZXR1cm5zIGluZGV4IG9mIHZhbHVlIHRoYXQgbWF0Y2hlcyB4LiBJZiB0aGVyZVxuICAgIC8vIGlzIG5vIGV4YWN0IG1hdGNoLCByZXR1cm5zIHRoZSBpbmRleCBqdXN0IGJlZm9yZSB3aGVyZSB4IHdvdWxkXG4gICAgLy8gYXBwZWFyLCB1bmxlc3MgeCB3b3VsZCBhcHBlYXIgYXMgdGhlIGZpcnN0IGVsZW1lbnQgaW4gd2hpY2hcbiAgICAvLyBjYXNlIDAgaXMgcmV0dXJuZWQuIChTbyB0aGUgcmV0dXJuZWQgaW5kZXggaXMgYWx3YXlzIGluIHJhbmdlXG4gICAgLy8gZm9yIHRoZSBpbnB1dCBhcnJheSwgdW5sZXNzIHRoZSBpbnB1dCBhcnJheSBpcyBlbXB0eS4pXG5cbiAgICAvLyBOb3RlIHRoYXQgeCBtdXN0IGJlIGluIG1vZGVsIGNvb3JkaW5hdGVzIChlLmcuIHRpbWUpLCBub3QgcGl4ZWxcbiAgICAvLyBjb29yZHMuXG5cbiAgICBsZXQgbG93ID0gMDtcbiAgICBsZXQgaGlnaCA9IGRhdGEubGVuZ3RoIC0gMTtcblxuICAgIHdoaWxlIChsb3cgPD0gaGlnaCkge1xuICAgICAgbGV0IG1pZCA9IGxvdyArICgoaGlnaCAtIGxvdykgPj4gMSk7XG4gICAgICBsZXQgdmFsdWUgPSB0aGlzLmN4KGRhdGFbbWlkXSk7XG4gICAgICBpZiAodmFsdWUgPCB4KSB7XG4gICAgICAgIGxvdyA9IG1pZCArIDE7XG4gICAgICB9IGVsc2UgaWYgKHZhbHVlID4geCkge1xuICAgICAgICBoaWdoID0gbWlkIC0gMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBtaWQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGhpZ2ggPCAwKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGhpZ2g7XG4gICAgfVxuICB9XG4gIFxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkgeyAvLyBkYXRhIGFycmF5IGlzIHNvcnRlZCBhbHJlYWR5XG4gICAgXG4gICAgY29uc3QgYmVmb3JlID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cbiAgICBjb25zdCBtaW5YID0gTWF0aC5mbG9vcihyZW5kZXJpbmdDb250ZXh0Lm1pblgpO1xuICAgIGNvbnN0IG1heFggPSBNYXRoLmNlaWwocmVuZGVyaW5nQ29udGV4dC5tYXhYKTtcblxuICAgIGNvbnNvbGUubG9nKFwibWluWCA9IFwiICsgbWluWCArIFwiLCBtYXhYID0gXCIgKyBtYXhYKTtcbiAgICBcbiAgICBsZXQgaW5zdHJ1Y3Rpb25zID0gW107XG4gICAgY29uc3QgbiA9IGRhdGEubGVuZ3RoO1xuICAgIFxuICAgIGlmIChuID4gMCkge1xuXG4gICAgICAvLyBXZSB3YW50IHRvIHN0YXJ0IHdpdGggdGhlIGxhc3QgZWxlbWVudCB0byB0aGUgbGVmdCBvZiB0aGVcbiAgICAgIC8vIHZpc2libGUgcmVnaW9uLCBhbmQgZW5kIHdpdGggdGhlIGZpcnN0IGVsZW1lbnQgYmV5b25kIHRoZVxuICAgICAgLy8gcmlnaHQgb2YgaXRcblxuICAgICAgbGV0IGN4MCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KG1pblgpO1xuICAgICAgbGV0IGkwID0gdGhpcy5fZmluZEluRGF0YShkYXRhLCBjeDApO1xuXG4gICAgICBsZXQgbmV4dFggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMuY3goZGF0YVtpMF0pKTtcbiAgICBcbiAgICAgIGZvciAobGV0IGkgPSBpMDsgaSA8IG47ICsraSkge1xuXG4gICAgICAgIGNvbnN0IHggPSBuZXh0WDtcblxuICAgICAgICBpZiAoaSArIDEgPCBuKSB7XG4gICAgICAgICAgbmV4dFggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMuY3goZGF0YVtpKzFdKSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB5ID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwodGhpcy5jeShkYXRhW2ldKSkgLSAwLjU7XG5cbiAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goYCR7eH0sJHt5fWApO1xuICAgICAgICBcbiAgICAgICAgaWYgKHggPiBtYXhYKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9ICAgICAgICAgIFxuXG4gICAgY29uc29sZS5sb2coXCJsaW5lIGluc3RydWN0aW9ucyBoYXZlIFwiICsgaW5zdHJ1Y3Rpb25zLmxlbmd0aCArIFwiIGVsZW1lbnRzXCIpO1xuICAgIFxuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgJ00nICsgaW5zdHJ1Y3Rpb25zLmpvaW4oJ0wnKSk7XG5cbiAgICB0aGlzLiRlbC5zdHlsZS5zdHJva2UgPSB0aGlzLnBhcmFtcy5jb2xvcjtcbiAgICB0aGlzLiRlbC5zdHlsZS5zdHJva2VXaWR0aCA9IDI7XG4gICAgdGhpcy4kZWwuc3R5bGUuZmlsbCA9ICdub25lJztcblxuICAgIGNvbnN0IGFmdGVyID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgY29uc29sZS5sb2coXCJsaW5lIHVwZGF0ZSB0aW1lID0gXCIgKyBNYXRoLnJvdW5kKGFmdGVyIC0gYmVmb3JlKSk7XG4gICAgXG4gICAgZGF0YSA9IG51bGw7XG4gIH1cblxuICBkZXNjcmliZShkYXRhLCB0KSB7XG4gICAgaWYgKCFkYXRhLmxlbmd0aCkgcmV0dXJuIDA7XG4gICAgbGV0IGkgPSB0aGlzLl9maW5kSW5EYXRhKGRhdGEsIHQpO1xuICAgIGNvbnN0IGN4ID0gdGhpcy5jeChkYXRhW2ldKTtcbiAgICBjb25zdCBjeSA9IHRoaXMuY3koZGF0YVtpXSk7XG4gICAgbGV0IHVuaXQgPSBcIlwiO1xuICAgIGlmICh0eXBlb2YoZGF0YVtpXS51bml0KSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHVuaXQgPSBkYXRhW2ldLnVuaXQ7XG4gICAgfVxuICAgIHJldHVybiBbe1xuICAgICAgY3g6IGN4LFxuICAgICAgY3k6IGN5LFxuICAgICAgdW5pdDogdW5pdFxuICAgIH1dO1xuICB9XG59XG4iXX0=