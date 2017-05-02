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

      var instructionStr = 'M' + instructions.join('L');
      this.$el.setAttributeNS(null, 'd', instructionStr);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RSxFQUFFLEVBQUU7QUFDTixVQUFFLEVBQUUsRUFBRTtBQUNOLFlBQUksRUFBRSxJQUFJO09BQ1gsQ0FBQyxDQUFDO0tBQ0o7OztTQW5Ja0IsSUFBSTs7O3FCQUFKLElBQUkiLCJmaWxlIjoic3JjL3NoYXBlcy9saW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuL2Jhc2Utc2hhcGUnO1xuXG4vKipcbiAqIEEgc2hhcGUgdG8gZGlzcGxheSBhIGxpbmUuIEl0cyBtYWluIHVzZSBpcyBhcyBjb21tb24gc2hhcGUgdG8gY3JlYXRlIGFcbiAqIGJyZWFrcG9pbnQgdmlzdWFsaXphdGlvbi4gKGVudGl0eSBzaGFwZSlcbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1icmVha3BvaW50Lmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmUgZXh0ZW5kcyBCYXNlU2hhcGUge1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAnbGluZSc7IH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIHJldHVybiB7IGN4OiAwLCBjeTogMCB9O1xuICB9XG5cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7IGNvbG9yOiAnIzAwMDAwMCcgfTtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgaWYgKHRoaXMuJGVsKSB7IHJldHVybiB0aGlzLiRlbDsgfVxuXG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ3BhdGgnKTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc2hhcGUtcmVuZGVyaW5nJywgJ2dlb21ldHJpY1ByZWNpc2lvbicpO1xuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIGVuY2FjaGUoZGF0YSkge1xuXG4gICAgZGF0YSA9IGRhdGEuc2xpY2UoMCk7XG4gICAgZGF0YS5zb3J0KChhLCBiKSA9PiB0aGlzLmN4KGEpIDwgdGhpcy5jeChiKSA/IC0xIDogMSk7XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIF9maW5kSW5EYXRhKGRhdGEsIHgpIHtcblxuICAgIC8vIEJpbmFyeSBzZWFyY2gsIGRlbWFuZHMgdGhhdCBkYXRhIGhhcyBiZWVuIGVuY2FjaGVkXG4gICAgLy8gKGkuZS4gc29ydGVkKS4gUmV0dXJucyBpbmRleCBvZiB2YWx1ZSB0aGF0IG1hdGNoZXMgeC4gSWYgdGhlcmVcbiAgICAvLyBpcyBubyBleGFjdCBtYXRjaCwgcmV0dXJucyB0aGUgaW5kZXgganVzdCBiZWZvcmUgd2hlcmUgeCB3b3VsZFxuICAgIC8vIGFwcGVhciwgdW5sZXNzIHggd291bGQgYXBwZWFyIGFzIHRoZSBmaXJzdCBlbGVtZW50IGluIHdoaWNoXG4gICAgLy8gY2FzZSAwIGlzIHJldHVybmVkLiAoU28gdGhlIHJldHVybmVkIGluZGV4IGlzIGFsd2F5cyBpbiByYW5nZVxuICAgIC8vIGZvciB0aGUgaW5wdXQgYXJyYXksIHVubGVzcyB0aGUgaW5wdXQgYXJyYXkgaXMgZW1wdHkuKVxuXG4gICAgLy8gTm90ZSB0aGF0IHggbXVzdCBiZSBpbiBtb2RlbCBjb29yZGluYXRlcyAoZS5nLiB0aW1lKSwgbm90IHBpeGVsXG4gICAgLy8gY29vcmRzLlxuXG4gICAgbGV0IGxvdyA9IDA7XG4gICAgbGV0IGhpZ2ggPSBkYXRhLmxlbmd0aCAtIDE7XG5cbiAgICB3aGlsZSAobG93IDw9IGhpZ2gpIHtcbiAgICAgIGxldCBtaWQgPSBsb3cgKyAoKGhpZ2ggLSBsb3cpID4+IDEpO1xuICAgICAgbGV0IHZhbHVlID0gdGhpcy5jeChkYXRhW21pZF0pO1xuICAgICAgaWYgKHZhbHVlIDwgeCkge1xuICAgICAgICBsb3cgPSBtaWQgKyAxO1xuICAgICAgfSBlbHNlIGlmICh2YWx1ZSA+IHgpIHtcbiAgICAgICAgaGlnaCA9IG1pZCAtIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbWlkO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChoaWdoIDwgMCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBoaWdoO1xuICAgIH1cbiAgfVxuICBcbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdGEpIHsgLy8gZGF0YSBhcnJheSBpcyBzb3J0ZWQgYWxyZWFkeVxuICAgIFxuICAgIGNvbnN0IGJlZm9yZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gICAgY29uc3QgbWluWCA9IE1hdGguZmxvb3IocmVuZGVyaW5nQ29udGV4dC5taW5YKTtcbiAgICBjb25zdCBtYXhYID0gTWF0aC5jZWlsKHJlbmRlcmluZ0NvbnRleHQubWF4WCk7XG5cbiAgICBjb25zb2xlLmxvZyhcIm1pblggPSBcIiArIG1pblggKyBcIiwgbWF4WCA9IFwiICsgbWF4WCk7XG4gICAgXG4gICAgbGV0IGluc3RydWN0aW9ucyA9IFtdO1xuICAgIGNvbnN0IG4gPSBkYXRhLmxlbmd0aDtcbiAgICBcbiAgICBpZiAobiA+IDApIHtcblxuICAgICAgLy8gV2Ugd2FudCB0byBzdGFydCB3aXRoIHRoZSBsYXN0IGVsZW1lbnQgdG8gdGhlIGxlZnQgb2YgdGhlXG4gICAgICAvLyB2aXNpYmxlIHJlZ2lvbiwgYW5kIGVuZCB3aXRoIHRoZSBmaXJzdCBlbGVtZW50IGJleW9uZCB0aGVcbiAgICAgIC8vIHJpZ2h0IG9mIGl0XG5cbiAgICAgIGxldCBjeDAgPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydChtaW5YKTtcbiAgICAgIGxldCBpMCA9IHRoaXMuX2ZpbmRJbkRhdGEoZGF0YSwgY3gwKTtcblxuICAgICAgbGV0IG5leHRYID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLmN4KGRhdGFbaTBdKSk7XG4gICAgXG4gICAgICBmb3IgKGxldCBpID0gaTA7IGkgPCBuOyArK2kpIHtcblxuICAgICAgICBjb25zdCB4ID0gbmV4dFg7XG5cbiAgICAgICAgaWYgKGkgKyAxIDwgbikge1xuICAgICAgICAgIG5leHRYID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLmN4KGRhdGFbaSsxXSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgeSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHRoaXMuY3koZGF0YVtpXSkpIC0gMC41O1xuXG4gICAgICAgIGluc3RydWN0aW9ucy5wdXNoKGAke3h9LCR7eX1gKTtcbiAgICAgICAgXG4gICAgICAgIGlmICh4ID4gbWF4WCkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSAgICAgICAgICBcblxuICAgIGNvbnNvbGUubG9nKFwibGluZSBpbnN0cnVjdGlvbnMgaGF2ZSBcIiArIGluc3RydWN0aW9ucy5sZW5ndGggKyBcIiBlbGVtZW50c1wiKTtcblxuICAgIGNvbnN0IGluc3RydWN0aW9uU3RyID0gJ00nICsgaW5zdHJ1Y3Rpb25zLmpvaW4oJ0wnKTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZCcsIGluc3RydWN0aW9uU3RyKTtcblxuICAgIHRoaXMuJGVsLnN0eWxlLnN0cm9rZSA9IHRoaXMucGFyYW1zLmNvbG9yO1xuICAgIHRoaXMuJGVsLnN0eWxlLnN0cm9rZVdpZHRoID0gMjtcbiAgICB0aGlzLiRlbC5zdHlsZS5maWxsID0gJ25vbmUnO1xuXG4gICAgY29uc3QgYWZ0ZXIgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICBjb25zb2xlLmxvZyhcImxpbmUgdXBkYXRlIHRpbWUgPSBcIiArIE1hdGgucm91bmQoYWZ0ZXIgLSBiZWZvcmUpKTtcbiAgICBcbiAgICBkYXRhID0gbnVsbDtcbiAgfVxuXG4gIGRlc2NyaWJlKGRhdGEsIHQpIHtcbiAgICBpZiAoIWRhdGEubGVuZ3RoKSByZXR1cm4gMDtcbiAgICBsZXQgaSA9IHRoaXMuX2ZpbmRJbkRhdGEoZGF0YSwgdCk7XG4gICAgY29uc3QgY3ggPSB0aGlzLmN4KGRhdGFbaV0pO1xuICAgIGNvbnN0IGN5ID0gdGhpcy5jeShkYXRhW2ldKTtcbiAgICBsZXQgdW5pdCA9IFwiXCI7XG4gICAgaWYgKHR5cGVvZihkYXRhW2ldLnVuaXQpICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdW5pdCA9IGRhdGFbaV0udW5pdDtcbiAgICB9XG4gICAgcmV0dXJuIFt7XG4gICAgICBjeDogY3gsXG4gICAgICBjeTogY3ksXG4gICAgICB1bml0OiB1bml0XG4gICAgfV07XG4gIH1cbn1cbiJdfQ==