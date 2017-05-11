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
      return { cx: 0, cy: 0 };
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

      if (typeof this.lastCx !== 'undefined') {
        if (this.lastCx === cx && this.lastCy === cy) {
          return;
        }
      }
      this.lastCx = cx;
      this.lastCy = cy;

      var x = Math.round(renderingContext.timeToPixel(cx)) + 0.5;
      var y = Math.round(renderingContext.valueToPixel(cy)) + 0.5;

      var minX = Math.floor(renderingContext.minX);
      var maxX = Math.ceil(renderingContext.maxX);
      var h = renderingContext.height;

      console.log("x = " + x + ", y = " + y + ", minX = " + minX + ", maxX = " + maxX + ", h = " + h);

      this.$path.setAttributeNS(null, 'd', 'M' + x + ',' + 0 + 'L' + x + ',' + h + 'M' + minX + ',' + y + 'L' + maxX + ',' + y);

      var label = cy.toPrecision(4);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zaGFwZXMvY3Jvc3NoYWlycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3lCQUFzQixjQUFjOzs7OzZCQUNyQixtQkFBbUI7Ozs7Ozs7Ozs7O0lBU2IsVUFBVTtZQUFWLFVBQVU7O1dBQVYsVUFBVTswQkFBVixVQUFVOzsrQkFBVixVQUFVOzs7ZUFBVixVQUFVOztXQUNqQix3QkFBRztBQUFFLGFBQU8sWUFBWSxDQUFDO0tBQUU7OztXQUV2Qiw0QkFBRztBQUNqQixhQUFPLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7S0FDekI7OztXQUVXLHdCQUFHO0FBQ2IsYUFBTztBQUNMLGFBQUssRUFBRSxTQUFTO0FBQ2hCLG1CQUFXLEVBQUUsQ0FBQztBQUNkLGVBQU8sRUFBRSxDQUFDO09BQ1gsQ0FBQztLQUNIOzs7V0FFSyxnQkFBQyxnQkFBZ0IsRUFBRTtBQUN2QixVQUFJLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFBRSxlQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7T0FBRTs7QUFFbEMsVUFBSSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7O0FBRWxELFVBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLGVBQWUsNkJBQUssTUFBTSxDQUFDLENBQUM7QUFDbEQsVUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFLG9CQUFvQixDQUFDLENBQUM7QUFDekUsVUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUN2RCxVQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7QUFDL0MsVUFBSSxDQUFDLEtBQUssQ0FBQyxL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LENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkIsWUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFO0FBQ1gsWUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1NBQ2pCOztBQUVELGNBQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztPQUN0QztLQUNGOzs7Ozs7OztXQU1LLGtCQUFHO0FBQUUsYUFBTyxLQUFLLENBQUM7S0FBRTs7O1NBbEhQLFVBQVU7OztxQkFBVixVQUFVIiwiZmlsZSI6InNyYy9zaGFwZXMvY3Jvc3NoYWlycy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9iYXNlLXNoYXBlJztcbmltcG9ydCBucyBmcm9tICcuLi9jb3JlL25hbWVzcGFjZSc7XG5cblxuLyoqXG4gKiBBIHNoYXBlIHRvIGRpc3BsYXkgbGFiZWxsZWQgY3Jvc3NoYWlycyBvciBzaW1pbGFyIHBvc2l0aW9uYWxcbiAqIGNyb3NzaGFpcnMvZm9jdXMgb3ZlcmxheS5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1oaWdobGlnaHQuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3Jvc3NoYWlycyBleHRlbmRzIEJhc2VTaGFwZSB7XG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICdjcm9zc2hhaXJzJzsgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgcmV0dXJuIHsgY3g6IDAsIGN5OiAwIH07XG4gIH1cblxuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbG9yOiAnIzAwMDAwMCcsXG4gICAgICBsYWJlbE9mZnNldDogMCxcbiAgICAgIG9wYWNpdHk6IDFcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICBpZiAodGhpcy4kZWwpIHsgcmV0dXJuIHRoaXMuJGVsOyB9XG5cbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnZycpO1xuXG4gICAgdGhpcy4kcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3BhdGgnKTtcbiAgICB0aGlzLiRwYXRoLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnZ2VvbWV0cmljUHJlY2lzaW9uJyk7XG4gICAgdGhpcy4kcGF0aC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlLXdpZHRoJywgJzEuNScpO1xuICAgIHRoaXMuJHBhdGguc3R5bGUub3BhY2l0eSA9IHRoaXMucGFyYW1zLm9wYWNpdHk7XG4gICAgdGhpcy4kcGF0aC5zdHlsZS5zdHJva2UgPSB0aGlzLnBhcmFtcy5jb2xvcjtcbiAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRwYXRoKTtcblxuICAgIHRoaXMuJGxhYmVscyA9IFtcbiAgICAgIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAndGV4dCcpLFxuICAgICAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICd0ZXh0JylcbiAgICBdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLiRsYWJlbHMubGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0ICRsYWJlbCA9IHRoaXMuJGxhYmVsc1tpXTtcbiAgICAgICRsYWJlbC5jbGFzc0xpc3QuYWRkKCdsYWJlbCcpO1xuICAgICAgJGxhYmVsLnN0eWxlLmZvbnRTaXplID0gJzEwcHgnO1xuICAgICAgJGxhYmVsLnN0eWxlLmxpbmVIZWlnaHQgPSAnMTBweCc7XG4gICAgICAkbGFiZWwuc3R5bGUuZm9udEZhbWlseSA9ICdtb25vc3BhY2UnO1xuICAgICAgJGxhYmVsLnN0eWxlLmNvbG9yID0gJyM2NzY3NjcnO1xuICAgICAgJGxhYmVsLnN0eWxlLm9wYWNpdHkgPSAwLjk7XG4gICAgICAkbGFiZWwuc3R5bGUubW96VXNlclNlbGVjdCA9ICdub25lJztcbiAgICAgICRsYWJlbC5zdHlsZS53ZWJraXRVc2VyU2VsZWN0ID0gJ25vbmUnO1xuICAgICAgJGxhYmVsLnN0eWxlLnVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCgkbGFiZWwpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSkge1xuXG4gICAgY29uc29sZS5sb2coXCJjcm9zc2hhaXJzIHVwZGF0ZTogZGF0dW0gPSBcIiArIGRhdHVtKTtcbiAgICBcbiAgICBjb25zdCBjeCA9IHRoaXMuY3goZGF0dW0pO1xuICAgIGNvbnN0IGN5ID0gdGhpcy5jeShkYXR1bSk7XG5cbiAgICBpZiAodHlwZW9mKHRoaXMubGFzdEN4KSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGlmICh0aGlzLmxhc3RDeCA9PT0gY3ggJiYgdGhpcy5sYXN0Q3kgPT09IGN5KSB7XG5cdHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5sYXN0Q3ggPSBjeDtcbiAgICB0aGlzLmxhc3RDeSA9IGN5O1xuICAgIFxuICAgIGNvbnN0IHggPSBNYXRoLnJvdW5kKHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoY3gpKSArIDAuNTtcbiAgICBjb25zdCB5ID0gTWF0aC5yb3VuZChyZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChjeSkpICsgMC41O1xuXG4gICAgY29uc3QgbWluWCA9IE1hdGguZmxvb3IocmVuZGVyaW5nQ29udGV4dC5taW5YKTtcbiAgICBjb25zdCBtYXhYID0gTWF0aC5jZWlsKHJlbmRlcmluZ0NvbnRleHQubWF4WCk7XG4gICAgY29uc3QgaCA9IHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0O1xuXG4gICAgICBjb25zb2xlLmxvZyhcInggPSBcIiArIHggKyBcIiwgeSA9IFwiICsgeSArIFwiLCBtaW5YID0gXCIgKyBtaW5YICsgXCIsIG1heFggPSBcIiArXG4gICAgICAgICAgICAgICAgICBtYXhYICsgXCIsIGggPSBcIiArIGgpO1xuICAgICAgXG4gICAgdGhpcy4kcGF0aC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgTSR7eH0sJHswfUwke3h9LCR7aH1NJHttaW5YfSwke3l9TCR7bWF4WH0sJHt5fWApO1xuXG4gICAgY29uc3QgbGFiZWwgPSBjeS50b1ByZWNpc2lvbig0KTtcbiAgICBjb25zdCBsdyA9IGxhYmVsLmxlbmd0aCAqIDEwO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLiRsYWJlbHMubGVuZ3RoOyArK2kpIHtcblxuICAgICAgY29uc3QgJGxhYmVsID0gdGhpcy4kbGFiZWxzW2ldO1xuXG4gICAgICB3aGlsZSAoJGxhYmVsLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgJGxhYmVsLnJlbW92ZUNoaWxkKCRsYWJlbC5maXJzdENoaWxkKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgY29uc3QgJHRleHRMZWZ0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobGFiZWwpO1xuICAgICAgJGxhYmVsLmFwcGVuZENoaWxkKCR0ZXh0TGVmdCk7XG4gICAgICBcbiAgICAgIGxldCBseCA9IG1pblggKyAyO1xuICAgICAgaWYgKGkgPT0gMSkge1xuICAgICAgICBseCA9IG1heFggLSBsdyAtIDI7XG4gICAgICB9XG4gICAgICBseCArPSB0aGlzLnBhcmFtcy5sYWJlbE9mZnNldDtcbiAgICAgIFxuICAgICAgJGxhYmVsLnNldEF0dHJpYnV0ZU5TKFxuICAgICAgICBudWxsLCAndHJhbnNmb3JtJywgYG1hdHJpeCgxLCAwLCAwLCAtMSwgJHtseH0sICR7aH0pYFxuICAgICAgKTtcblxuICAgICAgbGV0IGx5ID0gaCAtIHkgLSA1O1xuICAgICAgaWYgKGx5IDwgMTApIHtcbiAgICAgICAgbHkgPSBoIC0geSArIDE1O1xuICAgICAgfVxuICAgICAgXG4gICAgICAkbGFiZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3knLCBseSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBjcm9zc2hhaXJzIGNhbm5vdCBiZSBzZWxlY3RlZC5cbiAgICogQHJldHVybiB7Qm9vbGVhbn0gZmFsc2VcbiAgICovXG4gIGluQXJlYSgpIHsgcmV0dXJuIGZhbHNlOyB9XG59XG4iXX0=