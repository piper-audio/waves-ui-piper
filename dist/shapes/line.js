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
      // this.el.setAttributeNS(null, 'shape-rendering', 'crispEdges');
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
      return this.cy(data[i]);
    }
  }]);

  return Line;
})(_baseShape2['default']);

exports['default'] = Line;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDMUMsVUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztBQUMvQixVQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDOztBQUU3QixVQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDaEMsYUFBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDOztBQUVoRSxVQUFJLEdBQUcsSUFBSSxDQUFDO0tBQ2I7OztXQUVPLGtCQUFDLElBQUksRUFBRSxDQUFDLEVBQUU7QUFDaEIsVUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDM0IsVUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEMsYUFBTyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3pCOzs7U0F4SGtCLElBQUk7OztxQkFBSixJQUFJIiwiZmlsZSI6InNyYy9zaGFwZXMvbGluZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9iYXNlLXNoYXBlJztcblxuLyoqXG4gKiBBIHNoYXBlIHRvIGRpc3BsYXkgYSBsaW5lLiBJdHMgbWFpbiB1c2UgaXMgYXMgY29tbW9uIHNoYXBlIHRvIGNyZWF0ZSBhXG4gKiBicmVha3BvaW50IHZpc3VhbGl6YXRpb24uIChlbnRpdHkgc2hhcGUpXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItYnJlYWtwb2ludC5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5lIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ2xpbmUnOyB9XG5cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICByZXR1cm4geyBjeDogMCwgY3k6IDAgfTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4geyBjb2xvcjogJyMwMDAwMDAnIH07XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIGlmICh0aGlzLiRlbCkgeyByZXR1cm4gdGhpcy4kZWw7IH1cblxuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdwYXRoJyk7XG4gICAgLy8gdGhpcy5lbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc2hhcGUtcmVuZGVyaW5nJywgJ2NyaXNwRWRnZXMnKTtcbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICBlbmNhY2hlKGRhdGEpIHtcblxuICAgIGRhdGEgPSBkYXRhLnNsaWNlKDApO1xuICAgIGRhdGEuc29ydCgoYSwgYikgPT4gdGhpcy5jeChhKSA8IHRoaXMuY3goYikgPyAtMSA6IDEpO1xuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBfZmluZEluRGF0YShkYXRhLCB4KSB7XG5cbiAgICAvLyBCaW5hcnkgc2VhcmNoLCBkZW1hbmRzIHRoYXQgZGF0YSBoYXMgYmVlbiBlbmNhY2hlZFxuICAgIC8vIChpLmUuIHNvcnRlZCkuIFJldHVybnMgaW5kZXggb2YgdmFsdWUgdGhhdCBtYXRjaGVzIHguIElmIHRoZXJlXG4gICAgLy8gaXMgbm8gZXhhY3QgbWF0Y2gsIHJldHVybnMgdGhlIGluZGV4IGp1c3QgYmVmb3JlIHdoZXJlIHggd291bGRcbiAgICAvLyBhcHBlYXIsIHVubGVzcyB4IHdvdWxkIGFwcGVhciBhcyB0aGUgZmlyc3QgZWxlbWVudCBpbiB3aGljaFxuICAgIC8vIGNhc2UgMCBpcyByZXR1cm5lZC4gKFNvIHRoZSByZXR1cm5lZCBpbmRleCBpcyBhbHdheXMgaW4gcmFuZ2VcbiAgICAvLyBmb3IgdGhlIGlucHV0IGFycmF5LCB1bmxlc3MgdGhlIGlucHV0IGFycmF5IGlzIGVtcHR5LilcblxuICAgIC8vIE5vdGUgdGhhdCB4IG11c3QgYmUgaW4gbW9kZWwgY29vcmRpbmF0ZXMgKGUuZy4gdGltZSksIG5vdCBwaXhlbFxuICAgIC8vIGNvb3Jkcy5cblxuICAgIGxldCBsb3cgPSAwO1xuICAgIGxldCBoaWdoID0gZGF0YS5sZW5ndGggLSAxO1xuXG4gICAgd2hpbGUgKGxvdyA8PSBoaWdoKSB7XG4gICAgICBsZXQgbWlkID0gbG93ICsgKChoaWdoIC0gbG93KSA+PiAxKTtcbiAgICAgIGxldCB2YWx1ZSA9IHRoaXMuY3goZGF0YVttaWRdKTtcbiAgICAgIGlmICh2YWx1ZSA8IHgpIHtcbiAgICAgICAgbG93ID0gbWlkICsgMTtcbiAgICAgIH0gZWxzZSBpZiAodmFsdWUgPiB4KSB7XG4gICAgICAgIGhpZ2ggPSBtaWQgLSAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG1pZDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaGlnaCA8IDApIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gaGlnaDtcbiAgICB9XG4gIH1cbiAgXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXRhKSB7IC8vIGRhdGEgYXJyYXkgaXMgc29ydGVkIGFscmVhZHlcbiAgICBcbiAgICBjb25zdCBiZWZvcmUgPSBwZXJmb3JtYW5jZS5ub3coKTtcblxuICAgIGNvbnN0IG1pblggPSBNYXRoLmZsb29yKHJlbmRlcmluZ0NvbnRleHQubWluWCk7XG4gICAgY29uc3QgbWF4WCA9IE1hdGguY2VpbChyZW5kZXJpbmdDb250ZXh0Lm1heFgpO1xuXG4gICAgY29uc29sZS5sb2coXCJtaW5YID0gXCIgKyBtaW5YICsgXCIsIG1heFggPSBcIiArIG1heFgpO1xuICAgIFxuICAgIGxldCBpbnN0cnVjdGlvbnMgPSBbXTtcbiAgICBjb25zdCBuID0gZGF0YS5sZW5ndGg7XG4gICAgXG4gICAgaWYgKG4gPiAwKSB7XG5cbiAgICAgIC8vIFdlIHdhbnQgdG8gc3RhcnQgd2l0aCB0aGUgbGFzdCBlbGVtZW50IHRvIHRoZSBsZWZ0IG9mIHRoZVxuICAgICAgLy8gdmlzaWJsZSByZWdpb24sIGFuZCBlbmQgd2l0aCB0aGUgZmlyc3QgZWxlbWVudCBiZXlvbmQgdGhlXG4gICAgICAvLyByaWdodCBvZiBpdFxuXG4gICAgICBsZXQgY3gwID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQobWluWCk7XG4gICAgICBsZXQgaTAgPSB0aGlzLl9maW5kSW5EYXRhKGRhdGEsIGN4MCk7XG5cbiAgICAgIGxldCBuZXh0WCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy5jeChkYXRhW2kwXSkpO1xuICAgIFxuICAgICAgZm9yIChsZXQgaSA9IGkwOyBpIDwgbjsgKytpKSB7XG5cbiAgICAgICAgY29uc3QgeCA9IG5leHRYO1xuXG4gICAgICAgIGlmIChpICsgMSA8IG4pIHtcbiAgICAgICAgICBuZXh0WCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy5jeChkYXRhW2krMV0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHkgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCh0aGlzLmN5KGRhdGFbaV0pKSAtIDAuNTtcblxuICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChgJHt4fSwke3l9YCk7XG4gICAgICAgIFxuICAgICAgICBpZiAoeCA+IG1heFgpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gICAgICAgICAgXG5cbiAgICBjb25zb2xlLmxvZyhcImxpbmUgaW5zdHJ1Y3Rpb25zIGhhdmUgXCIgKyBpbnN0cnVjdGlvbnMubGVuZ3RoICsgXCIgZWxlbWVudHNcIik7XG4gICAgXG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLCAnTScgKyBpbnN0cnVjdGlvbnMuam9pbignTCcpKTtcblxuICAgIHRoaXMuJGVsLnN0eWxlLnN0cm9rZSA9IHRoaXMucGFyYW1zLmNvbG9yO1xuICAgIHRoaXMuJGVsLnN0eWxlLnN0cm9rZVdpZHRoID0gMjtcbiAgICB0aGlzLiRlbC5zdHlsZS5maWxsID0gJ25vbmUnO1xuXG4gICAgY29uc3QgYWZ0ZXIgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICBjb25zb2xlLmxvZyhcImxpbmUgdXBkYXRlIHRpbWUgPSBcIiArIE1hdGgucm91bmQoYWZ0ZXIgLSBiZWZvcmUpKTtcbiAgICBcbiAgICBkYXRhID0gbnVsbDtcbiAgfVxuXG4gIGRlc2NyaWJlKGRhdGEsIHQpIHtcbiAgICBpZiAoIWRhdGEubGVuZ3RoKSByZXR1cm4gMDtcbiAgICBsZXQgaSA9IHRoaXMuX2ZpbmRJbkRhdGEoZGF0YSwgdCk7XG4gICAgcmV0dXJuIHRoaXMuY3koZGF0YVtpXSk7XG4gIH1cbn1cbiJdfQ==