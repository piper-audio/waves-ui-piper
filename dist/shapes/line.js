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
    key: 'update',
    value: function update(renderingContext, data) {
      var _this = this;

      var before = performance.now();

      data = data.slice(0);
      data.sort(function (a, b) {
        return _this.cx(a) < _this.cx(b) ? -1 : 1;
      });

      var minX = Math.floor(renderingContext.minX);
      var maxX = Math.floor(renderingContext.maxX);

      var instructions = [];
      var n = data.length;

      if (n > 0) {

        // We want to start with the last element to the left of the
        // visible region, and end with the first element beyond the
        // right of it

        var nextX = renderingContext.timeToPixel(this.cx(data[0]));

        for (var i = 0; i < n; ++i) {

          var x = nextX;

          if (i + 1 < n) {
            nextX = renderingContext.timeToPixel(this.cx(data[i + 1]));
          }
          if (nextX < minX) {
            continue;
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

    // builds the `path.d` attribute
    // @TODO create some ShapeHelper ?
  }, {
    key: '_buildLine',
    value: function _buildLine(renderingContext, data) {
      var _this2 = this;

      if (!data.length) {
        return '';
      }
      // sort data
      var instructions = data.map(function (datum, index) {
        var x = renderingContext.timeToPixel(_this2.cx(datum));
        var y = renderingContext.valueToPixel(_this2.cy(datum)) - 0.5;
        return x + ',' + y;
      });

      return 'M' + instructions.join('L');
    }
  }]);

  return Line;
})(_baseShape2['default']);

exports['default'] = Line;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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OztxQkFBSixJQUFJIiwiZmlsZSI6InNyYy9zaGFwZXMvbGluZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9iYXNlLXNoYXBlJztcblxuXG4vKipcbiAqIEEgc2hhcGUgdG8gZGlzcGxheSBhIGxpbmUuIEl0cyBtYWluIHVzZSBpcyBhcyBjb21tb24gc2hhcGUgdG8gY3JlYXRlIGFcbiAqIGJyZWFrcG9pbnQgdmlzdWFsaXphdGlvbi4gKGVudGl0eSBzaGFwZSlcbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1icmVha3BvaW50Lmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmUgZXh0ZW5kcyBCYXNlU2hhcGUge1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAnbGluZSc7IH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIHJldHVybiB7IGN4OiAwLCBjeTogMCB9O1xuICB9XG5cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7IGNvbG9yOiAnIzAwMDAwMCcgfTtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgaWYgKHRoaXMuJGVsKSB7IHJldHVybiB0aGlzLiRlbDsgfVxuXG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ3BhdGgnKTtcbiAgICAvLyB0aGlzLmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXRhKSB7XG4gICAgXG4gICAgY29uc3QgYmVmb3JlID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cbiAgICBkYXRhID0gZGF0YS5zbGljZSgwKTtcbiAgICBkYXRhLnNvcnQoKGEsIGIpID0+IHRoaXMuY3goYSkgPCB0aGlzLmN4KGIpID8gLTEgOiAxKTtcblxuICAgIGNvbnN0IG1pblggPSBNYXRoLmZsb29yKHJlbmRlcmluZ0NvbnRleHQubWluWCk7XG4gICAgY29uc3QgbWF4WCA9IE1hdGguZmxvb3IocmVuZGVyaW5nQ29udGV4dC5tYXhYKTtcblxuICAgIGxldCBpbnN0cnVjdGlvbnMgPSBbXTtcbiAgICBjb25zdCBuID0gZGF0YS5sZW5ndGg7XG5cbiAgICBpZiAobiA+IDApIHtcblxuICAgICAgLy8gV2Ugd2FudCB0byBzdGFydCB3aXRoIHRoZSBsYXN0IGVsZW1lbnQgdG8gdGhlIGxlZnQgb2YgdGhlXG4gICAgICAvLyB2aXNpYmxlIHJlZ2lvbiwgYW5kIGVuZCB3aXRoIHRoZSBmaXJzdCBlbGVtZW50IGJleW9uZCB0aGVcbiAgICAgIC8vIHJpZ2h0IG9mIGl0XG4gICAgICBcbiAgICAgIGxldCBuZXh0WCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy5jeChkYXRhWzBdKSk7XG4gICAgXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG47ICsraSkge1xuXG4gICAgICAgIGNvbnN0IHggPSBuZXh0WDtcblxuICAgICAgICBpZiAoaSArIDEgPCBuKSB7XG4gICAgICAgICAgbmV4dFggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMuY3goZGF0YVtpKzFdKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5leHRYIDwgbWluWCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgeSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHRoaXMuY3koZGF0YVtpXSkpIC0gMC41O1xuXG4gICAgICAgIGluc3RydWN0aW9ucy5wdXNoKGAke3h9LCR7eX1gKTtcbiAgICAgICAgXG4gICAgICAgIGlmICh4ID4gbWF4WCkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSAgICAgICAgICBcblxuICAgIGNvbnNvbGUubG9nKFwibGluZSBpbnN0cnVjdGlvbnMgaGF2ZSBcIiArIGluc3RydWN0aW9ucy5sZW5ndGggKyBcIiBlbGVtZW50c1wiKTtcbiAgICBcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZCcsICdNJyArIGluc3RydWN0aW9ucy5qb2luKCdMJykpO1xuXG4gICAgdGhpcy4kZWwuc3R5bGUuc3Ryb2tlID0gdGhpcy5wYXJhbXMuY29sb3I7XG4gICAgdGhpcy4kZWwuc3R5bGUuc3Ryb2tlV2lkdGggPSAyO1xuICAgIHRoaXMuJGVsLnN0eWxlLmZpbGwgPSAnbm9uZSc7XG5cbiAgICBjb25zdCBhZnRlciA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIGNvbnNvbGUubG9nKFwibGluZSB1cGRhdGUgdGltZSA9IFwiICsgTWF0aC5yb3VuZChhZnRlciAtIGJlZm9yZSkpO1xuICAgIFxuICAgIGRhdGEgPSBudWxsO1xuICB9XG5cbiAgLy8gYnVpbGRzIHRoZSBgcGF0aC5kYCBhdHRyaWJ1dGVcbiAgLy8gQFRPRE8gY3JlYXRlIHNvbWUgU2hhcGVIZWxwZXIgP1xuICBfYnVpbGRMaW5lKHJlbmRlcmluZ0NvbnRleHQsIGRhdGEpIHtcbiAgICBpZiAoIWRhdGEubGVuZ3RoKSB7IHJldHVybiAnJzsgfVxuICAgIC8vIHNvcnQgZGF0YVxuICAgIGxldCBpbnN0cnVjdGlvbnMgPSBkYXRhLm1hcCgoZGF0dW0sIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCB4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLmN4KGRhdHVtKSk7XG4gICAgICBjb25zdCB5ID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwodGhpcy5jeShkYXR1bSkpIC0gMC41O1xuICAgICAgcmV0dXJuIGAke3h9LCR7eX1gO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuICdNJyArIGluc3RydWN0aW9ucy5qb2luKCdMJyk7XG4gIH1cbn1cbiJdfQ==