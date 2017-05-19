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

var _utilsFind = require('../utils/find');

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
      var i0 = (0, _utilsFind.findWithin)(data, cx0, this.cx);

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
      if (!data.length) return [];
      var i = (0, _utilsFind.findWithin)(data, t, this.cx);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQzs7QUFFaEUsVUFBSSxHQUFHLElBQUksQ0FBQztLQUNiOzs7V0FFTyxrQkFBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFO0FBQ2hCLFVBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFDO0FBQzVCLFVBQU0sQ0FBQyxHQUFHLDJCQUFXLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZDLFVBQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUIsVUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1QixVQUFJLElBQUksR0FBRyxFQUFFLENBQUM7QUFDZCxVQUFJLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQUFBQyxLQUFLLFdBQVcsRUFBRTtBQUN4QyxZQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztPQUNyQjtBQUNELGFBQU8sQ0FBQztBQUNOLFVBQUUsRUFBRSxFQUFFO0FBQ04sVUFBRSxFQUFFLEVBQUU7QUFDTixZQUFJLEVBQUUsSUFBSTtPQUNYLENBQUMsQ0FBQztLQUNKOzs7U0FuR2tCLElBQUk7OztxQkFBSixJQUFJIiwiZmlsZSI6InNyYy9zaGFwZXMvbGluZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9iYXNlLXNoYXBlJztcbmltcG9ydCB7IGZpbmRXaXRoaW4gfSBmcm9tICcuLi91dGlscy9maW5kJztcblxuLyoqXG4gKiBBIHNoYXBlIHRvIGRpc3BsYXkgYSBsaW5lLiBJdHMgbWFpbiB1c2UgaXMgYXMgY29tbW9uIHNoYXBlIHRvIGNyZWF0ZSBhXG4gKiBicmVha3BvaW50IHZpc3VhbGl6YXRpb24uIChlbnRpdHkgc2hhcGUpXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItYnJlYWtwb2ludC5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5lIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ2xpbmUnOyB9XG5cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICByZXR1cm4geyBjeDogMCwgY3k6IDAgfTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4geyBjb2xvcjogJyMwMDAwMDAnIH07XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIGlmICh0aGlzLiRlbCkgeyByZXR1cm4gdGhpcy4kZWw7IH1cblxuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdwYXRoJyk7XG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdnZW9tZXRyaWNQcmVjaXNpb24nKTtcbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICBlbmNhY2hlKGRhdGEpIHtcblxuICAgIGRhdGEgPSBkYXRhLnNsaWNlKDApO1xuICAgIGRhdGEuc29ydCgoYSwgYikgPT4gdGhpcy5jeChhKSA8IHRoaXMuY3goYikgPyAtMSA6IDEpO1xuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cbiAgXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXRhKSB7IC8vIGRhdGEgYXJyYXkgaXMgc29ydGVkIGFscmVhZHlcbiAgICBcbiAgICBjb25zdCBiZWZvcmUgPSBwZXJmb3JtYW5jZS5ub3coKTtcblxuICAgIGNvbnN0IG1pblggPSBNYXRoLmZsb29yKHJlbmRlcmluZ0NvbnRleHQubWluWCk7XG4gICAgY29uc3QgbWF4WCA9IE1hdGguY2VpbChyZW5kZXJpbmdDb250ZXh0Lm1heFgpO1xuXG4gICAgaWYgKGRhdGEgPT09IFtdIHx8XG4gICAgICAgIHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy5jeChkYXRhWzBdKSkgPiBtYXhYIHx8XG4gICAgICAgIHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy5jeChkYXRhW2RhdGEubGVuZ3RoLTFdKSkgPCBtaW5YKSB7XG4gICAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndmlzaWJpbGl0eScsICdoaWRkZW4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3Zpc2liaWxpdHknLCAndmlzaWJsZScpO1xuICAgIH1cbiAgICBcbiAgICBsZXQgaW5zdHJ1Y3Rpb25zID0gW107XG4gICAgY29uc3QgbiA9IGRhdGEubGVuZ3RoO1xuICAgIFxuICAgIC8vIFdlIHdhbnQgdG8gc3RhcnQgd2l0aCB0aGUgbGFzdCBlbGVtZW50IHRvIHRoZSBsZWZ0IG9mIHRoZVxuICAgIC8vIHZpc2libGUgcmVnaW9uLCBhbmQgZW5kIHdpdGggdGhlIGZpcnN0IGVsZW1lbnQgYmV5b25kIHRoZSByaWdodFxuICAgIC8vIG9mIGl0XG4gICAgXG4gICAgY29uc3QgY3gwID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQobWluWCk7XG4gICAgY29uc3QgaTAgPSBmaW5kV2l0aGluKGRhdGEsIGN4MCwgdGhpcy5jeCk7XG4gICAgXG4gICAgbGV0IG5leHRYID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLmN4KGRhdGFbaTBdKSk7XG4gICAgXG4gICAgZm9yIChsZXQgaSA9IGkwOyBpIDwgbjsgKytpKSB7XG4gICAgICBcbiAgICAgIGNvbnN0IHggPSBuZXh0WDtcbiAgICAgIFxuICAgICAgaWYgKGkgKyAxIDwgbikge1xuICAgICAgICBuZXh0WCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy5jeChkYXRhW2krMV0pKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgY29uc3QgeSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHRoaXMuY3koZGF0YVtpXSkpIC0gMC41O1xuICAgICAgXG4gICAgICBpbnN0cnVjdGlvbnMucHVzaChgJHt4fSwke3l9YCk7XG4gICAgICBcbiAgICAgIGlmICh4ID4gbWF4WCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9ICAgICAgICAgIFxuXG4gICAgY29uc3QgaW5zdHJ1Y3Rpb25TdHIgPSAnTScgKyBpbnN0cnVjdGlvbnMuam9pbignTCcpO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgaW5zdHJ1Y3Rpb25TdHIpO1xuXG4gICAgdGhpcy4kZWwuc3R5bGUuc3Ryb2tlID0gdGhpcy5wYXJhbXMuY29sb3I7XG4gICAgdGhpcy4kZWwuc3R5bGUuc3Ryb2tlV2lkdGggPSAyO1xuICAgIHRoaXMuJGVsLnN0eWxlLmZpbGwgPSAnbm9uZSc7XG5cbiAgICBjb25zdCBhZnRlciA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIGNvbnNvbGUubG9nKFwibGluZSB1cGRhdGUgdGltZSA9IFwiICsgTWF0aC5yb3VuZChhZnRlciAtIGJlZm9yZSkpO1xuICAgIFxuICAgIGRhdGEgPSBudWxsO1xuICB9XG5cbiAgZGVzY3JpYmUoZGF0YSwgdCkge1xuICAgIGlmICghZGF0YS5sZW5ndGgpIHJldHVybiBbXTtcbiAgICBjb25zdCBpID0gZmluZFdpdGhpbihkYXRhLCB0LCB0aGlzLmN4KTtcbiAgICBjb25zdCBjeCA9IHRoaXMuY3goZGF0YVtpXSk7XG4gICAgY29uc3QgY3kgPSB0aGlzLmN5KGRhdGFbaV0pO1xuICAgIGxldCB1bml0ID0gXCJcIjtcbiAgICBpZiAodHlwZW9mKGRhdGFbaV0udW5pdCkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB1bml0ID0gZGF0YVtpXS51bml0O1xuICAgIH1cbiAgICByZXR1cm4gW3tcbiAgICAgIGN4OiBjeCxcbiAgICAgIGN5OiBjeSxcbiAgICAgIHVuaXQ6IHVuaXRcbiAgICB9XTtcbiAgfVxufVxuIl19