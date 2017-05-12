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
 * [example usage](./examples/layer-highlight.html)
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
      return { visible: true, cx: 0, cy: 0, unit: "" };
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {
        color: '#000000',
        labelOffset: 0,
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
      var visible = this.visible(datum);
      var unit = this.unit(datum);
      if (unit !== '') unit = " " + unit;

      if (!visible) {
        this.$el.setAttributeNS(null, 'visibility', 'hidden');
        return;
      } else {
        this.$el.setAttributeNS(null, 'visibility', 'visible');
      }

      var minX = Math.floor(renderingContext.minX);
      var maxX = Math.ceil(renderingContext.maxX);

      var h = renderingContext.height;

      var x = Math.round(renderingContext.timeToPixel(cx)) + 0.5;
      var y = Math.round(renderingContext.valueToPixel(cy)) + 0.5;

      console.log("x = " + x + ", y = " + y + ", minX = " + minX + ", maxX = " + maxX + ", h = " + h);

      this.$path.setAttributeNS(null, 'd', 'M' + x + ',' + 0 + 'L' + x + ',' + h + 'M' + minX + ',' + y + 'L' + maxX + ',' + y);

      var label = cy.toPrecision(4);
      var lw = (label.length + unit.length) * 9;

      for (var i = 0; i < this.$labels.length; ++i) {

        var $label = this.$labels[i];

        while ($label.firstChild) {
          $label.removeChild($label.firstChild);
        }

        var $textLeft = document.createTextNode(label + unit);
        $label.appendChild($textLeft);

        var lx = minX + 2;
        if (i == 1) {
          lx = maxX - lw - 2;
        }
        lx += this.params.labelOffset;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zaGFwZXMvY3Jvc3NoYWlycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3lCQUFzQixjQUFjOzs7OzZCQUNyQixtQkFBbUI7Ozs7Ozs7Ozs7O0lBU2IsVUFBVTtZQUFWLFVBQVU7O1dBQVYsVUFBVTswQkFBVixVQUFVOzsrQkFBVixVQUFVOzs7ZUFBVixVQUFVOztXQUNqQix3QkFBRztBQUFFLGFBQU8sWUFBWSxDQUFDO0tBQUU7OztXQUV2Qiw0QkFBRztBQUNqQixhQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDO0tBQ2xEOzs7V0FFVyx3QkFBRztBQUNiLGFBQU87QUFDTCxhQUFLLEVBQUUsU0FBUztBQUNoQixtQkFBVyxFQUFFLENBQUM7QUFDZCxlQUFPLEVBQUUsQ0FBQztPQUNYLENBQUM7S0FDSDs7O1dBRUssZ0JBQUMsZ0JBQWdCLEVBQUU7QUFDdkIsVUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFO0FBQUUsZUFBTyxJQUFJLENBQUMsR0FBRyxDQUFDO09BQUU7O0FBRWxDLFVBQUksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDOztBQUVsRCxVQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxlQUFlLDZCQUFLLE1BQU0sQ0FBQyxDQUFDO0FBQ2xELFVBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3pFLFVBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDdkQsVUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENB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Q2xCLFlBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUNWLFlBQUUsR0FBRyxJQUFJLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztTQUNwQjtBQUNELFVBQUUsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQzs7QUFFOUIsY0FBTSxDQUFDLGNBQWMsQ0FDbkIsSUFBSSxFQUFFLFdBQVcsMkJBQXlCLEVBQUUsVUFBSyxDQUFDLE9BQ25ELENBQUM7O0FBRUYsWUFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkIsWUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFO0FBQ1gsWUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1NBQ2pCOztBQUVELGNBQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztPQUN0QztLQUNGOzs7Ozs7OztXQU1LLGtCQUFHO0FBQUUsYUFBTyxLQUFLLENBQUM7S0FBRTs7O1NBckhQLFVBQVU7OztxQkFBVixVQUFVIiwiZmlsZSI6InNyYy9zaGFwZXMvY3Jvc3NoYWlycy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9iYXNlLXNoYXBlJztcbmltcG9ydCBucyBmcm9tICcuLi9jb3JlL25hbWVzcGFjZSc7XG5cblxuLyoqXG4gKiBBIHNoYXBlIHRvIGRpc3BsYXkgbGFiZWxsZWQgY3Jvc3NoYWlycyBvciBzaW1pbGFyIHBvc2l0aW9uYWxcbiAqIGNyb3NzaGFpcnMvZm9jdXMgb3ZlcmxheS5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1oaWdobGlnaHQuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3Jvc3NoYWlycyBleHRlbmRzIEJhc2VTaGFwZSB7XG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICdjcm9zc2hhaXJzJzsgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgcmV0dXJuIHsgdmlzaWJsZTogdHJ1ZSwgY3g6IDAsIGN5OiAwLCB1bml0OiBcIlwiIH07XG4gIH1cblxuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbG9yOiAnIzAwMDAwMCcsXG4gICAgICBsYWJlbE9mZnNldDogMCxcbiAgICAgIG9wYWNpdHk6IDFcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICBpZiAodGhpcy4kZWwpIHsgcmV0dXJuIHRoaXMuJGVsOyB9XG5cbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnZycpO1xuXG4gICAgdGhpcy4kcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3BhdGgnKTtcbiAgICB0aGlzLiRwYXRoLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnZ2VvbWV0cmljUHJlY2lzaW9uJyk7XG4gICAgdGhpcy4kcGF0aC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlLXdpZHRoJywgJzEuNScpO1xuICAgIHRoaXMuJHBhdGguc3R5bGUub3BhY2l0eSA9IHRoaXMucGFyYW1zLm9wYWNpdHk7XG4gICAgdGhpcy4kcGF0aC5zdHlsZS5zdHJva2UgPSB0aGlzLnBhcmFtcy5jb2xvcjtcbiAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRwYXRoKTtcblxuICAgIHRoaXMuJGxhYmVscyA9IFtcbiAgICAgIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAndGV4dCcpLFxuICAgICAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICd0ZXh0JylcbiAgICBdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLiRsYWJlbHMubGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0ICRsYWJlbCA9IHRoaXMuJGxhYmVsc1tpXTtcbiAgICAgICRsYWJlbC5jbGFzc0xpc3QuYWRkKCdsYWJlbCcpO1xuICAgICAgJGxhYmVsLnN0eWxlLmZvbnRTaXplID0gJzEwcHgnO1xuICAgICAgJGxhYmVsLnN0eWxlLmxpbmVIZWlnaHQgPSAnMTBweCc7XG4gICAgICAkbGFiZWwuc3R5bGUuZm9udEZhbWlseSA9ICdtb25vc3BhY2UnO1xuICAgICAgJGxhYmVsLnN0eWxlLmNvbG9yID0gJyM2NzY3NjcnO1xuICAgICAgJGxhYmVsLnN0eWxlLm9wYWNpdHkgPSAwLjk7XG4gICAgICAkbGFiZWwuc3R5bGUubW96VXNlclNlbGVjdCA9ICdub25lJztcbiAgICAgICRsYWJlbC5zdHlsZS53ZWJraXRVc2VyU2VsZWN0ID0gJ25vbmUnO1xuICAgICAgJGxhYmVsLnN0eWxlLnVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCgkbGFiZWwpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSkge1xuXG4gICAgY29uc29sZS5sb2coXCJjcm9zc2hhaXJzIHVwZGF0ZTogZGF0dW0gPSBcIiArIGRhdHVtKTtcblxuICAgIGNvbnN0IGN4ID0gdGhpcy5jeChkYXR1bSk7XG4gICAgY29uc3QgY3kgPSB0aGlzLmN5KGRhdHVtKTtcbiAgICBjb25zdCB2aXNpYmxlID0gdGhpcy52aXNpYmxlKGRhdHVtKTtcbiAgICBsZXQgdW5pdCA9IHRoaXMudW5pdChkYXR1bSk7XG4gICAgaWYgKHVuaXQgIT09ICcnKSB1bml0ID0gXCIgXCIgKyB1bml0O1xuXG4gICAgaWYgKCF2aXNpYmxlKSB7XG4gICAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndmlzaWJpbGl0eScsICdoaWRkZW4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3Zpc2liaWxpdHknLCAndmlzaWJsZScpO1xuICAgIH1cbiAgICBcbiAgICBjb25zdCBtaW5YID0gTWF0aC5mbG9vcihyZW5kZXJpbmdDb250ZXh0Lm1pblgpO1xuICAgIGNvbnN0IG1heFggPSBNYXRoLmNlaWwocmVuZGVyaW5nQ29udGV4dC5tYXhYKTtcblxuICAgIGNvbnN0IGggPSByZW5kZXJpbmdDb250ZXh0LmhlaWdodDtcblxuICAgIGNvbnN0IHggPSBNYXRoLnJvdW5kKHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoY3gpKSArIDAuNTtcbiAgICBjb25zdCB5ID0gTWF0aC5yb3VuZChyZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChjeSkpICsgMC41O1xuXG4gICAgICBjb25zb2xlLmxvZyhcInggPSBcIiArIHggKyBcIiwgeSA9IFwiICsgeSArIFwiLCBtaW5YID0gXCIgKyBtaW5YICsgXCIsIG1heFggPSBcIiArXG4gICAgICAgICAgICAgICAgICBtYXhYICsgXCIsIGggPSBcIiArIGgpO1xuICAgICAgXG4gICAgdGhpcy4kcGF0aC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgTSR7eH0sJHswfUwke3h9LCR7aH1NJHttaW5YfSwke3l9TCR7bWF4WH0sJHt5fWApO1xuXG4gICAgY29uc3QgbGFiZWwgPSBjeS50b1ByZWNpc2lvbig0KTtcbiAgICBjb25zdCBsdyA9IChsYWJlbC5sZW5ndGggKyB1bml0Lmxlbmd0aCkgKiA5O1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLiRsYWJlbHMubGVuZ3RoOyArK2kpIHtcblxuICAgICAgY29uc3QgJGxhYmVsID0gdGhpcy4kbGFiZWxzW2ldO1xuXG4gICAgICB3aGlsZSAoJGxhYmVsLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgJGxhYmVsLnJlbW92ZUNoaWxkKCRsYWJlbC5maXJzdENoaWxkKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgY29uc3QgJHRleHRMZWZ0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobGFiZWwgKyB1bml0KTtcbiAgICAgICRsYWJlbC5hcHBlbmRDaGlsZCgkdGV4dExlZnQpO1xuICAgICAgXG4gICAgICBsZXQgbHggPSBtaW5YICsgMjtcbiAgICAgIGlmIChpID09IDEpIHtcbiAgICAgICAgbHggPSBtYXhYIC0gbHcgLSAyO1xuICAgICAgfVxuICAgICAgbHggKz0gdGhpcy5wYXJhbXMubGFiZWxPZmZzZXQ7XG4gICAgICBcbiAgICAgICRsYWJlbC5zZXRBdHRyaWJ1dGVOUyhcbiAgICAgICAgbnVsbCwgJ3RyYW5zZm9ybScsIGBtYXRyaXgoMSwgMCwgMCwgLTEsICR7bHh9LCAke2h9KWBcbiAgICAgICk7XG5cbiAgICAgIGxldCBseSA9IGggLSB5IC0gNTtcbiAgICAgIGlmIChseSA8IDEwKSB7XG4gICAgICAgIGx5ID0gaCAtIHkgKyAxNTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgJGxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5JywgbHkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgY3Jvc3NoYWlycyBjYW5ub3QgYmUgc2VsZWN0ZWQuXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IGZhbHNlXG4gICAqL1xuICBpbkFyZWEoKSB7IHJldHVybiBmYWxzZTsgfVxufVxuIl19