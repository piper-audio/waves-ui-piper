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

      if (data === [] || renderingContext.timeToPixel(this.cx(data[0])) > maxX || renderingContext.timeToPixel(this.cx(data[data.length - 1])) < minX) {
        this.$el.setAttributeNS(null, 'visibility', 'hidden');
        return;
      } else {
        this.$el.setAttributeNS(null, 'visibility', 'visible');
      }

      var instructions = [];
      var n = data.length;

      // We want to start with the last element to the left of the
      // visible region, and end with the first element beyond the right
      // of it

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1QixVQUFJLElBQUksR0FBRyxFQUFFLENBQUM7QUFDZCxVQUFJLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQUFBQyxLQUFLLFdBQVcsRUFBRTtBQUN4QyxZQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztPQUNyQjtBQUNELGFBQU8sQ0FBQztBQUNOLFVBQUUsRUFBRSxFQUFFO0FBQ04sVUFBRSxFQUFFLEVBQUU7QUFDTixZQUFJLEVBQUUsSUFBSTtPQUNYLENBQUMsQ0FBQztLQUNKOzs7U0FySWtCLElBQUk7OztxQkFBSixJQUFJIiwiZmlsZSI6InNyYy9zaGFwZXMvbGluZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9iYXNlLXNoYXBlJztcblxuLyoqXG4gKiBBIHNoYXBlIHRvIGRpc3BsYXkgYSBsaW5lLiBJdHMgbWFpbiB1c2UgaXMgYXMgY29tbW9uIHNoYXBlIHRvIGNyZWF0ZSBhXG4gKiBicmVha3BvaW50IHZpc3VhbGl6YXRpb24uIChlbnRpdHkgc2hhcGUpXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItYnJlYWtwb2ludC5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5lIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ2xpbmUnOyB9XG5cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICByZXR1cm4geyBjeDogMCwgY3k6IDAgfTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4geyBjb2xvcjogJyMwMDAwMDAnIH07XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIGlmICh0aGlzLiRlbCkgeyByZXR1cm4gdGhpcy4kZWw7IH1cblxuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdwYXRoJyk7XG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdnZW9tZXRyaWNQcmVjaXNpb24nKTtcbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICBlbmNhY2hlKGRhdGEpIHtcblxuICAgIGRhdGEgPSBkYXRhLnNsaWNlKDApO1xuICAgIGRhdGEuc29ydCgoYSwgYikgPT4gdGhpcy5jeChhKSA8IHRoaXMuY3goYikgPyAtMSA6IDEpO1xuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBfZmluZEluRGF0YShkYXRhLCB4KSB7XG5cbiAgICAvLyBCaW5hcnkgc2VhcmNoLCBkZW1hbmRzIHRoYXQgZGF0YSBoYXMgYmVlbiBlbmNhY2hlZFxuICAgIC8vIChpLmUuIHNvcnRlZCkuIFJldHVybnMgaW5kZXggb2YgdmFsdWUgdGhhdCBtYXRjaGVzIHguIElmIHRoZXJlXG4gICAgLy8gaXMgbm8gZXhhY3QgbWF0Y2gsIHJldHVybnMgdGhlIGluZGV4IGp1c3QgYmVmb3JlIHdoZXJlIHggd291bGRcbiAgICAvLyBhcHBlYXIsIHVubGVzcyB4IHdvdWxkIGFwcGVhciBhcyB0aGUgZmlyc3QgZWxlbWVudCBpbiB3aGljaFxuICAgIC8vIGNhc2UgMCBpcyByZXR1cm5lZC4gKFNvIHRoZSByZXR1cm5lZCBpbmRleCBpcyBhbHdheXMgaW4gcmFuZ2VcbiAgICAvLyBmb3IgdGhlIGlucHV0IGFycmF5LCB1bmxlc3MgdGhlIGlucHV0IGFycmF5IGlzIGVtcHR5LilcblxuICAgIC8vIE5vdGUgdGhhdCB4IG11c3QgYmUgaW4gbW9kZWwgY29vcmRpbmF0ZXMgKGUuZy4gdGltZSksIG5vdCBwaXhlbFxuICAgIC8vIGNvb3Jkcy5cblxuICAgIGxldCBsb3cgPSAwO1xuICAgIGxldCBoaWdoID0gZGF0YS5sZW5ndGggLSAxO1xuXG4gICAgd2hpbGUgKGxvdyA8PSBoaWdoKSB7XG4gICAgICBsZXQgbWlkID0gbG93ICsgKChoaWdoIC0gbG93KSA+PiAxKTtcbiAgICAgIGxldCB2YWx1ZSA9IHRoaXMuY3goZGF0YVttaWRdKTtcbiAgICAgIGlmICh2YWx1ZSA8IHgpIHtcbiAgICAgICAgbG93ID0gbWlkICsgMTtcbiAgICAgIH0gZWxzZSBpZiAodmFsdWUgPiB4KSB7XG4gICAgICAgIGhpZ2ggPSBtaWQgLSAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG1pZDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaGlnaCA8IDApIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gaGlnaDtcbiAgICB9XG4gIH1cbiAgXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXRhKSB7IC8vIGRhdGEgYXJyYXkgaXMgc29ydGVkIGFscmVhZHlcbiAgICBcbiAgICBjb25zdCBiZWZvcmUgPSBwZXJmb3JtYW5jZS5ub3coKTtcblxuICAgIGNvbnN0IG1pblggPSBNYXRoLmZsb29yKHJlbmRlcmluZ0NvbnRleHQubWluWCk7XG4gICAgY29uc3QgbWF4WCA9IE1hdGguY2VpbChyZW5kZXJpbmdDb250ZXh0Lm1heFgpO1xuXG4gICAgaWYgKGRhdGEgPT09IFtdIHx8XG4gICAgICAgIHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy5jeChkYXRhWzBdKSkgPiBtYXhYIHx8XG4gICAgICAgIHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy5jeChkYXRhW2RhdGEubGVuZ3RoLTFdKSkgPCBtaW5YKSB7XG4gICAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndmlzaWJpbGl0eScsICdoaWRkZW4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3Zpc2liaWxpdHknLCAndmlzaWJsZScpO1xuICAgIH1cbiAgICBcbiAgICBsZXQgaW5zdHJ1Y3Rpb25zID0gW107XG4gICAgY29uc3QgbiA9IGRhdGEubGVuZ3RoO1xuICAgIFxuICAgIC8vIFdlIHdhbnQgdG8gc3RhcnQgd2l0aCB0aGUgbGFzdCBlbGVtZW50IHRvIHRoZSBsZWZ0IG9mIHRoZVxuICAgIC8vIHZpc2libGUgcmVnaW9uLCBhbmQgZW5kIHdpdGggdGhlIGZpcnN0IGVsZW1lbnQgYmV5b25kIHRoZSByaWdodFxuICAgIC8vIG9mIGl0XG4gICAgXG4gICAgbGV0IGN4MCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KG1pblgpO1xuICAgIGxldCBpMCA9IHRoaXMuX2ZpbmRJbkRhdGEoZGF0YSwgY3gwKTtcbiAgICBcbiAgICBsZXQgbmV4dFggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMuY3goZGF0YVtpMF0pKTtcbiAgICBcbiAgICBmb3IgKGxldCBpID0gaTA7IGkgPCBuOyArK2kpIHtcbiAgICAgIFxuICAgICAgY29uc3QgeCA9IG5leHRYO1xuICAgICAgXG4gICAgICBpZiAoaSArIDEgPCBuKSB7XG4gICAgICAgIG5leHRYID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLmN4KGRhdGFbaSsxXSkpO1xuICAgICAgfVxuICAgICAgXG4gICAgICBjb25zdCB5ID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwodGhpcy5jeShkYXRhW2ldKSkgLSAwLjU7XG4gICAgICBcbiAgICAgIGluc3RydWN0aW9ucy5wdXNoKGAke3h9LCR7eX1gKTtcbiAgICAgIFxuICAgICAgaWYgKHggPiBtYXhYKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0gICAgICAgICAgXG5cbiAgICBjb25zdCBpbnN0cnVjdGlvblN0ciA9ICdNJyArIGluc3RydWN0aW9ucy5qb2luKCdMJyk7XG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLCBpbnN0cnVjdGlvblN0cik7XG5cbiAgICB0aGlzLiRlbC5zdHlsZS5zdHJva2UgPSB0aGlzLnBhcmFtcy5jb2xvcjtcbiAgICB0aGlzLiRlbC5zdHlsZS5zdHJva2VXaWR0aCA9IDI7XG4gICAgdGhpcy4kZWwuc3R5bGUuZmlsbCA9ICdub25lJztcblxuICAgIGNvbnN0IGFmdGVyID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgY29uc29sZS5sb2coXCJsaW5lIHVwZGF0ZSB0aW1lID0gXCIgKyBNYXRoLnJvdW5kKGFmdGVyIC0gYmVmb3JlKSk7XG4gICAgXG4gICAgZGF0YSA9IG51bGw7XG4gIH1cblxuICBkZXNjcmliZShkYXRhLCB0KSB7XG4gICAgaWYgKCFkYXRhLmxlbmd0aCkgcmV0dXJuIDA7XG4gICAgbGV0IGkgPSB0aGlzLl9maW5kSW5EYXRhKGRhdGEsIHQpO1xuICAgIGNvbnN0IGN4ID0gdGhpcy5jeChkYXRhW2ldKTtcbiAgICBjb25zdCBjeSA9IHRoaXMuY3koZGF0YVtpXSk7XG4gICAgbGV0IHVuaXQgPSBcIlwiO1xuICAgIGlmICh0eXBlb2YoZGF0YVtpXS51bml0KSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHVuaXQgPSBkYXRhW2ldLnVuaXQ7XG4gICAgfVxuICAgIHJldHVybiBbe1xuICAgICAgY3g6IGN4LFxuICAgICAgY3k6IGN5LFxuICAgICAgdW5pdDogdW5pdFxuICAgIH1dO1xuICB9XG59XG4iXX0=