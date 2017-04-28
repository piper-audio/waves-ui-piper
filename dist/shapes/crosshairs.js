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

var _coreNamespace = require('../core/namespace');

var _coreNamespace2 = _interopRequireDefault(_coreNamespace);

/**
 * A shape to display labelled crosshairs or similar positional
 * crosshairs/focus overlay.
 *
 * [example usage](./examples/layer-crosshairs.html)
 */

var Crosshairs = (function (_BaseShape) {
  _inherits(Crosshairs, _BaseShape);

  function Crosshairs() {
    _classCallCheck(this, Crosshairs);

    _get(Object.getPrototypeOf(Crosshairs.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Crosshairs, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'crosshairs';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return { cx: 0, cy: 0, value: 0 };
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {
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

      this.$el = document.createElementNS(this.ns, 'g');

      this.$path = document.createElementNS(_coreNamespace2['default'], 'path');
      this.$path.setAttributeNS(null, 'shape-rendering', 'geometricPrecision');
      this.$path.setAttributeNS(null, 'stroke-width', '1.5');
      this.$path.style.opacity = this.params.opacity;
      this.$path.style.stroke = this.params.color;
      this.$el.appendChild(this.$path);

      this.$labels = [document.createElementNS(this.ns, 'text'), document.createElementNS(this.ns, 'text')];

      for (var i = 0; i < this.$labels.length; ++i) {
        var $label = this.$labels[i];
        $label.classList.add('label');
        $label.style.fontSize = '10px';
        $label.style.lineHeight = '10px';
        $label.style.fontFamily = 'monospace';
        $label.style.color = '#676767';
        $label.style.opacity = 0.9;
        $label.style.mozUserSelect = 'none';
        $label.style.webkitUserSelect = 'none';
        $label.style.userSelect = 'none';
        this.$el.appendChild($label);
      }

      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, datum) {

      console.log("crosshairs update: datum = " + datum);

      var cx = this.cx(datum);
      var cy = this.cy(datum);
      var x = Math.round(renderingContext.timeToPixel(cx)) + 0.5;
      var y = Math.round(renderingContext.valueToPixel(cy)) + 0.5;

      var minX = Math.floor(renderingContext.minX);
      var maxX = Math.ceil(renderingContext.maxX);
      var h = renderingContext.height;

      this.$path.setAttributeNS(null, 'd', 'M' + x + ',' + 0 + 'L' + x + ',' + h + 'M' + minX + ',' + y + 'L' + maxX + ',' + y);

      var value = this.value(datum);
      var label = value.toPrecision(4);
      var lw = label.length * 10;

      for (var i = 0; i < this.$labels.length; ++i) {

        var $label = this.$labels[i];

        while ($label.firstChild) {
          $label.removeChild($label.firstChild);
        }

        var $textLeft = document.createTextNode(label);
        $label.appendChild($textLeft);

        var lx = minX + 2;
        if (i == 1) {
          lx = maxX - lw - 2;
        }

        $label.setAttributeNS(null, 'transform', 'matrix(1, 0, 0, -1, ' + lx + ', ' + h + ')');

        var ly = h - y - 5;
        if (ly < 10) {
          ly = h - y + 15;
        }

        $label.setAttributeNS(null, 'y', ly);
      }
    }

    /**
     * The crosshairs cannot be selected.
     * @return {Boolean} false
     */
  }, {
    key: 'inArea',
    value: function inArea() {
      return false;
    }
  }]);

  return Crosshairs;
})(_baseShape2['default']);

exports['default'] = Crosshairs;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zaGFwZXMvY3Jvc3NoYWlycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3lCQUFzQixjQUFjOzs7OzZCQUNyQixtQkFBbUI7Ozs7Ozs7Ozs7O0lBU2IsVUFBVTtZQUFWLFVBQVU7O1dBQVYsVUFBVTswQkFBVixVQUFVOzsrQkFBVixVQUFVOzs7ZUFBVixVQUFVOztXQUNqQix3QkFBRztBQUFFLGFBQU8sWUFBWSxDQUFDO0tBQUU7OztXQUV2Qiw0QkFBRztBQUNqQixhQUFPLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQztLQUNuQzs7O1dBRVcsd0JBQUc7QUFDYixhQUFPO0FBQ0wsYUFBSyxFQUFFLFNBQVM7QUFDaEIsZUFBTyxFQUFFLENBQUM7T0FDWCxDQUFDO0tBQ0g7OztXQUVLLGdCQUFDLGdCQUFnQixFQUFFO0FBQ3ZCLFVBQUksSUFBSSxDQUFDLEdBQUcsRUFBRTtBQUFFLGVBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztPQUFFOztBQUVsQyxVQUFJLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQzs7QUFFbEQsVUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsZUFBZSw2QkFBSyxNQUFNLENBQUMsQ0FBQztBQUNsRCxVQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztBQUN6RSxVQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3ZELFVBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztBQUMvQyxVQUFJLENBQUMsS0FBSyxDQUFDLEtB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LFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTs7QUFFNUMsWUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFL0IsZUFBTyxNQUFNLENBQUMsVUFBVSxFQUFFO0FBQ3hCLGdCQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUN2Qzs7QUFFRCxZQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2pELGNBQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7O0FBRTlCLFlBQUksRUFBRSxHQUFHLElBQUksR0FBRyxDQUFDLENBQUM7QUFDbEIsWUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ1YsWUFBRSxHQUFHLElBQUksR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQ3BCOztBQUVELGNBQU0sQ0FBQyxjQUFjLENBQ25CLElBQUksRUFBRSxXQUFXLDJCQUF5QixFQUFFLFVBQUssQ0FBQyxPQUNuRCxDQUFDOztBQUVGLFlBQUksRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25CLFlBQUksRUFBRSxHQUFHLEVBQUUsRUFBRTtBQUNYLFlBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztTQUNqQjs7QUFFRCxjQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7T0FDdEM7S0FDRjs7Ozs7Ozs7V0FNSyxrQkFBRztBQUFFLGFBQU8sS0FBSyxDQUFDO0tBQUU7OztTQXJHUCxVQUFVOzs7cUJBQVYsVUFBVSIsImZpbGUiOiJzcmMvc2hhcGVzL2Nyb3NzaGFpcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vYmFzZS1zaGFwZSc7XG5pbXBvcnQgbnMgZnJvbSAnLi4vY29yZS9uYW1lc3BhY2UnO1xuXG5cbi8qKlxuICogQSBzaGFwZSB0byBkaXNwbGF5IGxhYmVsbGVkIGNyb3NzaGFpcnMgb3Igc2ltaWxhciBwb3NpdGlvbmFsXG4gKiBjcm9zc2hhaXJzL2ZvY3VzIG92ZXJsYXkuXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItY3Jvc3NoYWlycy5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDcm9zc2hhaXJzIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ2Nyb3NzaGFpcnMnOyB9XG5cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICByZXR1cm4geyBjeDogMCwgY3k6IDAsIHZhbHVlOiAwIH07XG4gIH1cblxuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbG9yOiAnIzAwMDAwMCcsXG4gICAgICBvcGFjaXR5OiAxXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgaWYgKHRoaXMuJGVsKSB7IHJldHVybiB0aGlzLiRlbDsgfVxuXG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2cnKTtcblxuICAgIHRoaXMuJHBhdGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdwYXRoJyk7XG4gICAgdGhpcy4kcGF0aC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc2hhcGUtcmVuZGVyaW5nJywgJ2dlb21ldHJpY1ByZWNpc2lvbicpO1xuICAgIHRoaXMuJHBhdGguc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZS13aWR0aCcsICcxLjUnKTtcbiAgICB0aGlzLiRwYXRoLnN0eWxlLm9wYWNpdHkgPSB0aGlzLnBhcmFtcy5vcGFjaXR5O1xuICAgIHRoaXMuJHBhdGguc3R5bGUuc3Ryb2tlID0gdGhpcy5wYXJhbXMuY29sb3I7XG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kcGF0aCk7XG5cbiAgICB0aGlzLiRsYWJlbHMgPSBbXG4gICAgICBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ3RleHQnKSxcbiAgICAgIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAndGV4dCcpXG4gICAgXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy4kbGFiZWxzLmxlbmd0aDsgKytpKSB7XG4gICAgICBjb25zdCAkbGFiZWwgPSB0aGlzLiRsYWJlbHNbaV07XG4gICAgICAkbGFiZWwuY2xhc3NMaXN0LmFkZCgnbGFiZWwnKTtcbiAgICAgICRsYWJlbC5zdHlsZS5mb250U2l6ZSA9ICcxMHB4JztcbiAgICAgICRsYWJlbC5zdHlsZS5saW5lSGVpZ2h0ID0gJzEwcHgnO1xuICAgICAgJGxhYmVsLnN0eWxlLmZvbnRGYW1pbHkgPSAnbW9ub3NwYWNlJztcbiAgICAgICRsYWJlbC5zdHlsZS5jb2xvciA9ICcjNjc2NzY3JztcbiAgICAgICRsYWJlbC5zdHlsZS5vcGFjaXR5ID0gMC45O1xuICAgICAgJGxhYmVsLnN0eWxlLm1velVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgICAkbGFiZWwuc3R5bGUud2Via2l0VXNlclNlbGVjdCA9ICdub25lJztcbiAgICAgICRsYWJlbC5zdHlsZS51c2VyU2VsZWN0ID0gJ25vbmUnO1xuICAgICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQoJGxhYmVsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0pIHtcblxuICAgIGNvbnNvbGUubG9nKFwiY3Jvc3NoYWlycyB1cGRhdGU6IGRhdHVtID0gXCIgKyBkYXR1bSk7XG4gICAgXG4gICAgY29uc3QgY3ggPSB0aGlzLmN4KGRhdHVtKTtcbiAgICBjb25zdCBjeSA9IHRoaXMuY3koZGF0dW0pO1xuICAgIGNvbnN0IHggPSBNYXRoLnJvdW5kKHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoY3gpKSArIDAuNTtcbiAgICBjb25zdCB5ID0gTWF0aC5yb3VuZChyZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChjeSkpICsgMC41O1xuXG4gICAgY29uc3QgbWluWCA9IE1hdGguZmxvb3IocmVuZGVyaW5nQ29udGV4dC5taW5YKTtcbiAgICBjb25zdCBtYXhYID0gTWF0aC5jZWlsKHJlbmRlcmluZ0NvbnRleHQubWF4WCk7XG4gICAgY29uc3QgaCA9IHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0O1xuICAgIFxuICAgIHRoaXMuJHBhdGguc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYE0ke3h9LCR7MH1MJHt4fSwke2h9TSR7bWluWH0sJHt5fUwke21heFh9LCR7eX1gKTtcblxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy52YWx1ZShkYXR1bSk7XG4gICAgY29uc3QgbGFiZWwgPSB2YWx1ZS50b1ByZWNpc2lvbig0KTtcbiAgICBjb25zdCBsdyA9IGxhYmVsLmxlbmd0aCAqIDEwO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLiRsYWJlbHMubGVuZ3RoOyArK2kpIHtcblxuICAgICAgY29uc3QgJGxhYmVsID0gdGhpcy4kbGFiZWxzW2ldO1xuXG4gICAgICB3aGlsZSAoJGxhYmVsLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgJGxhYmVsLnJlbW92ZUNoaWxkKCRsYWJlbC5maXJzdENoaWxkKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgY29uc3QgJHRleHRMZWZ0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobGFiZWwpO1xuICAgICAgJGxhYmVsLmFwcGVuZENoaWxkKCR0ZXh0TGVmdCk7XG4gICAgICBcbiAgICAgIGxldCBseCA9IG1pblggKyAyO1xuICAgICAgaWYgKGkgPT0gMSkge1xuICAgICAgICBseCA9IG1heFggLSBsdyAtIDI7XG4gICAgICB9XG4gICAgICBcbiAgICAgICRsYWJlbC5zZXRBdHRyaWJ1dGVOUyhcbiAgICAgICAgbnVsbCwgJ3RyYW5zZm9ybScsIGBtYXRyaXgoMSwgMCwgMCwgLTEsICR7bHh9LCAke2h9KWBcbiAgICAgICk7XG5cbiAgICAgIGxldCBseSA9IGggLSB5IC0gNTtcbiAgICAgIGlmIChseSA8IDEwKSB7XG4gICAgICAgIGx5ID0gaCAtIHkgKyAxNTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgJGxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5JywgbHkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgY3Jvc3NoYWlycyBjYW5ub3QgYmUgc2VsZWN0ZWQuXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IGZhbHNlXG4gICAqL1xuICBpbkFyZWEoKSB7IHJldHVybiBmYWxzZTsgfVxufVxuIl19