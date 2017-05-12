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
      var lw = label.length * 10;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zaGFwZXMvY3Jvc3NoYWlycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3lCQUFzQixjQUFjOzs7OzZCQUNyQixtQkFBbUI7Ozs7Ozs7Ozs7O0lBU2IsVUFBVTtZQUFWLFVBQVU7O1dBQVYsVUFBVTswQkFBVixVQUFVOzsrQkFBVixVQUFVOzs7ZUFBVixVQUFVOztXQUNqQix3QkFBRztBQUFFLGFBQU8sWUFBWSxDQUFDO0tBQUU7OztXQUV2Qiw0QkFBRztBQUNqQixhQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDO0tBQ2xEOzs7V0FFVyx3QkFBRztBQUNiLGFBQU87QUFDTCxhQUFLLEVBQUUsU0FBUztBQUNoQixtQkFBVyxFQUFFLENBQUM7QUFDZCxlQUFPLEVBQUUsQ0FBQztPQUNYLENBQUM7S0FDSDs7O1dBRUssZ0JBQUMsZ0JBQWdCLEVBQUU7QUFDdkIsVUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFO0FBQUUsZUFBTyxJQUFJLENBQUMsR0FBRyxDQUFDO09BQUU7O0FBRWxDLFVBQUksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDOztBQUVsRCxVQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxlQUFlLDZCQUFLLE1BQU0sQ0FBQyxDQUFDO0FBQ2xELFVBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3pFLFVBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDdkQsVUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENB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QUFJLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDOztBQUU5QixjQUFNLENBQUMsY0FBYyxDQUNuQixJQUFJLEVBQUUsV0FBVywyQkFBeUIsRUFBRSxVQUFLLENBQUMsT0FDbkQsQ0FBQzs7QUFFRixZQUFJLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNuQixZQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUU7QUFDWCxZQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7U0FDakI7O0FBRUQsY0FBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO09BQ3RDO0tBQ0Y7Ozs7Ozs7O1dBTUssa0JBQUc7QUFBRSxhQUFPLEtBQUssQ0FBQztLQUFFOzs7U0FwSFAsVUFBVTs7O3FCQUFWLFVBQVUiLCJmaWxlIjoic3JjL3NoYXBlcy9jcm9zc2hhaXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuL2Jhc2Utc2hhcGUnO1xuaW1wb3J0IG5zIGZyb20gJy4uL2NvcmUvbmFtZXNwYWNlJztcblxuXG4vKipcbiAqIEEgc2hhcGUgdG8gZGlzcGxheSBsYWJlbGxlZCBjcm9zc2hhaXJzIG9yIHNpbWlsYXIgcG9zaXRpb25hbFxuICogY3Jvc3NoYWlycy9mb2N1cyBvdmVybGF5LlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLWhpZ2hsaWdodC5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDcm9zc2hhaXJzIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ2Nyb3NzaGFpcnMnOyB9XG5cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICByZXR1cm4geyB2aXNpYmxlOiB0cnVlLCBjeDogMCwgY3k6IDAsIHVuaXQ6IFwiXCIgfTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29sb3I6ICcjMDAwMDAwJyxcbiAgICAgIGxhYmVsT2Zmc2V0OiAwLFxuICAgICAgb3BhY2l0eTogMVxuICAgIH07XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIGlmICh0aGlzLiRlbCkgeyByZXR1cm4gdGhpcy4kZWw7IH1cblxuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdnJyk7XG5cbiAgICB0aGlzLiRwYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAncGF0aCcpO1xuICAgIHRoaXMuJHBhdGguc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdnZW9tZXRyaWNQcmVjaXNpb24nKTtcbiAgICB0aGlzLiRwYXRoLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2Utd2lkdGgnLCAnMS41Jyk7XG4gICAgdGhpcy4kcGF0aC5zdHlsZS5vcGFjaXR5ID0gdGhpcy5wYXJhbXMub3BhY2l0eTtcbiAgICB0aGlzLiRwYXRoLnN0eWxlLnN0cm9rZSA9IHRoaXMucGFyYW1zLmNvbG9yO1xuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRoaXMuJHBhdGgpO1xuXG4gICAgdGhpcy4kbGFiZWxzID0gW1xuICAgICAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICd0ZXh0JyksXG4gICAgICBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ3RleHQnKVxuICAgIF07XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuJGxhYmVscy5sZW5ndGg7ICsraSkge1xuICAgICAgY29uc3QgJGxhYmVsID0gdGhpcy4kbGFiZWxzW2ldO1xuICAgICAgJGxhYmVsLmNsYXNzTGlzdC5hZGQoJ2xhYmVsJyk7XG4gICAgICAkbGFiZWwuc3R5bGUuZm9udFNpemUgPSAnMTBweCc7XG4gICAgICAkbGFiZWwuc3R5bGUubGluZUhlaWdodCA9ICcxMHB4JztcbiAgICAgICRsYWJlbC5zdHlsZS5mb250RmFtaWx5ID0gJ21vbm9zcGFjZSc7XG4gICAgICAkbGFiZWwuc3R5bGUuY29sb3IgPSAnIzY3Njc2Nyc7XG4gICAgICAkbGFiZWwuc3R5bGUub3BhY2l0eSA9IDAuOTtcbiAgICAgICRsYWJlbC5zdHlsZS5tb3pVc2VyU2VsZWN0ID0gJ25vbmUnO1xuICAgICAgJGxhYmVsLnN0eWxlLndlYmtpdFVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgICAkbGFiZWwuc3R5bGUudXNlclNlbGVjdCA9ICdub25lJztcbiAgICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKCRsYWJlbCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtKSB7XG5cbiAgICBjb25zb2xlLmxvZyhcImNyb3NzaGFpcnMgdXBkYXRlOiBkYXR1bSA9IFwiICsgZGF0dW0pO1xuXG4gICAgY29uc3QgY3ggPSB0aGlzLmN4KGRhdHVtKTtcbiAgICBjb25zdCBjeSA9IHRoaXMuY3koZGF0dW0pO1xuICAgIGNvbnN0IHZpc2libGUgPSB0aGlzLnZpc2libGUoZGF0dW0pO1xuICAgIGNvbnN0IHVuaXQgPSB0aGlzLnVuaXQoZGF0dW0pO1xuXG4gICAgaWYgKCF2aXNpYmxlKSB7XG4gICAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndmlzaWJpbGl0eScsICdoaWRkZW4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3Zpc2liaWxpdHknLCAndmlzaWJsZScpO1xuICAgIH1cbiAgICBcbiAgICBjb25zdCBtaW5YID0gTWF0aC5mbG9vcihyZW5kZXJpbmdDb250ZXh0Lm1pblgpO1xuICAgIGNvbnN0IG1heFggPSBNYXRoLmNlaWwocmVuZGVyaW5nQ29udGV4dC5tYXhYKTtcblxuICAgIGNvbnN0IGggPSByZW5kZXJpbmdDb250ZXh0LmhlaWdodDtcblxuICAgIGNvbnN0IHggPSBNYXRoLnJvdW5kKHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoY3gpKSArIDAuNTtcbiAgICBjb25zdCB5ID0gTWF0aC5yb3VuZChyZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChjeSkpICsgMC41O1xuXG4gICAgICBjb25zb2xlLmxvZyhcInggPSBcIiArIHggKyBcIiwgeSA9IFwiICsgeSArIFwiLCBtaW5YID0gXCIgKyBtaW5YICsgXCIsIG1heFggPSBcIiArXG4gICAgICAgICAgICAgICAgICBtYXhYICsgXCIsIGggPSBcIiArIGgpO1xuICAgICAgXG4gICAgdGhpcy4kcGF0aC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgTSR7eH0sJHswfUwke3h9LCR7aH1NJHttaW5YfSwke3l9TCR7bWF4WH0sJHt5fWApO1xuXG4gICAgY29uc3QgbGFiZWwgPSBjeS50b1ByZWNpc2lvbig0KTtcbiAgICBjb25zdCBsdyA9IGxhYmVsLmxlbmd0aCAqIDEwO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLiRsYWJlbHMubGVuZ3RoOyArK2kpIHtcblxuICAgICAgY29uc3QgJGxhYmVsID0gdGhpcy4kbGFiZWxzW2ldO1xuXG4gICAgICB3aGlsZSAoJGxhYmVsLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgJGxhYmVsLnJlbW92ZUNoaWxkKCRsYWJlbC5maXJzdENoaWxkKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgY29uc3QgJHRleHRMZWZ0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobGFiZWwgKyB1bml0KTtcbiAgICAgICRsYWJlbC5hcHBlbmRDaGlsZCgkdGV4dExlZnQpO1xuICAgICAgXG4gICAgICBsZXQgbHggPSBtaW5YICsgMjtcbiAgICAgIGlmIChpID09IDEpIHtcbiAgICAgICAgbHggPSBtYXhYIC0gbHcgLSAyO1xuICAgICAgfVxuICAgICAgbHggKz0gdGhpcy5wYXJhbXMubGFiZWxPZmZzZXQ7XG4gICAgICBcbiAgICAgICRsYWJlbC5zZXRBdHRyaWJ1dGVOUyhcbiAgICAgICAgbnVsbCwgJ3RyYW5zZm9ybScsIGBtYXRyaXgoMSwgMCwgMCwgLTEsICR7bHh9LCAke2h9KWBcbiAgICAgICk7XG5cbiAgICAgIGxldCBseSA9IGggLSB5IC0gNTtcbiAgICAgIGlmIChseSA8IDEwKSB7XG4gICAgICAgIGx5ID0gaCAtIHkgKyAxNTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgJGxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5JywgbHkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgY3Jvc3NoYWlycyBjYW5ub3QgYmUgc2VsZWN0ZWQuXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IGZhbHNlXG4gICAqL1xuICBpbkFyZWEoKSB7IHJldHVybiBmYWxzZTsgfVxufVxuIl19