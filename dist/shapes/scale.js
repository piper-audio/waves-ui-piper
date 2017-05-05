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

var _utilsScaleTickIntervals = require('../utils/scale-tick-intervals');

var _utilsScaleTickIntervals2 = _interopRequireDefault(_utilsScaleTickIntervals);

/**
 * A shape to display a vertical scale at the left edge of the visible
 * area of the layer. Scale values are taken from the yDomain of the
 * layer.
 *
 * [example usage](./examples/layer-scale.html)
 */

var Scale = (function (_BaseShape) {
  _inherits(Scale, _BaseShape);

  function Scale() {
    _classCallCheck(this, Scale);

    _get(Object.getPrototypeOf(Scale.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Scale, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'scale';
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {
        background: '#ffffff',
        tickColor: '#000000',
        textColor: '#000000',
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

      this.$bg = document.createElementNS(_coreNamespace2['default'], 'rect');
      this.$bg.setAttributeNS(null, 'fill', this.params.background);
      this.$bg.setAttributeNS(null, 'x', 0);
      this.$bg.setAttributeNS(null, 'y', 0);
      this.$el.appendChild(this.$bg);

      this.$path = document.createElementNS(_coreNamespace2['default'], 'path');
      this.$path.setAttributeNS(null, 'shape-rendering', 'geometricPrecision');
      this.$path.setAttributeNS(null, 'stroke-width', '0.7');
      this.$path.style.opacity = this.params.opacity;
      this.$path.style.stroke = this.params.tickColor;
      this.$el.appendChild(this.$path);

      this.$labels = [];

      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, datum) {
      var _this = this;

      console.log("scale update");

      var h = renderingContext.height;
      var cy0 = renderingContext.valueToPixel.domain()[0];
      var cy1 = renderingContext.valueToPixel.domain()[1];

      if (typeof this.lastCy0 !== 'undefined') {
        if (this.lastCy0 === cy0 && this.lastCy1 === cy1 && this.lastH === h) {
          console.log("scale unchanged");
          return;
        }
      }
      this.lastCy0 = cy0;
      this.lastCy1 = cy1;
      this.lastH = h;

      console.log("cy0 = " + cy0);
      console.log("cy1 = " + cy1);

      for (var i = 0; i < this.$labels.length; ++i) {
        this.$el.removeChild(this.$labels[i]);
      }
      this.$labels = [];

      var scaleWidth = 35;

      this.$bg.setAttributeNS(null, 'width', scaleWidth);
      this.$bg.setAttributeNS(null, 'height', h);

      var path = 'M' + scaleWidth + ',0L' + scaleWidth + ',' + h;

      var addLabel = function addLabel(text, x, y) {

        var $label = document.createElementNS(_this.ns, 'text');
        $label.classList.add('label');
        $label.style.fontSize = '10px';
        $label.style.lineHeight = '10px';
        $label.style.fontFamily = 'monospace';
        $label.style.fill = _this.params.textColor;
        $label.style.opacity = _this.params.opacity;
        $label.style.mozUserSelect = 'none';
        $label.style.webkitUserSelect = 'none';
        $label.style.userSelect = 'none';

        $label.setAttributeNS(null, 'transform', 'matrix(1, 0, 0, -1, ' + x + ', ' + h + ')');

        $label.setAttributeNS(null, 'y', y);
        var $text = document.createTextNode(text);
        $label.appendChild($text);

        _this.$labels.push($label);
        _this.$el.appendChild($label);
      };

      var lx = 2;

      var prevy = h + 2;

      var ticks = new _utilsScaleTickIntervals2['default']().linear(cy0, cy1, 10);

      for (var i = 0; i < ticks.length; ++i) {

        var y = renderingContext.valueToPixel(ticks[i].value);

        var ly = h - y + 3;

        var showText = true;
        if (ly > h - 8 || ly < 8 || ly > prevy - 20) {
          // not enough space
          showText = false;
        }

        if (!showText) {

          path = path + ('M' + (scaleWidth - 5) + ',' + y + 'L' + scaleWidth + ',' + y);
        } else {

          path = path + ('M' + (scaleWidth - 8) + ',' + y + 'L' + scaleWidth + ',' + y);
          prevy = ly;
          addLabel(ticks[i].label, lx, ly);
        }
      }

      this.$path.setAttributeNS(null, 'd', path);
    }

    /**
     * The scale cannot be selected.
     * @return {Boolean} false
     */
  }, {
    key: 'inArea',
    value: function inArea() {
      return false;
    }
  }]);

  return Scale;
})(_baseShape2['default']);

exports['default'] = Scale;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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c291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuL2Jhc2Utc2hhcGUnO1xuaW1wb3J0IG5zIGZyb20gJy4uL2NvcmUvbmFtZXNwYWNlJztcbmltcG9ydCBTY2FsZVRpY2tJbnRlcnZhbHMgZnJvbSAnLi4vdXRpbHMvc2NhbGUtdGljay1pbnRlcnZhbHMnO1xuXG5cbi8qKlxuICogQSBzaGFwZSB0byBkaXNwbGF5IGEgdmVydGljYWwgc2NhbGUgYXQgdGhlIGxlZnQgZWRnZSBvZiB0aGUgdmlzaWJsZVxuICogYXJlYSBvZiB0aGUgbGF5ZXIuIFNjYWxlIHZhbHVlcyBhcmUgdGFrZW4gZnJvbSB0aGUgeURvbWFpbiBvZiB0aGVcbiAqIGxheWVyLlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLXNjYWxlLmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjYWxlIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ3NjYWxlJzsgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYmFja2dyb3VuZDogJyNmZmZmZmYnLFxuICAgICAgdGlja0NvbG9yOiAnIzAwMDAwMCcsXG4gICAgICB0ZXh0Q29sb3I6ICcjMDAwMDAwJyxcbiAgICAgIG9wYWNpdHk6IDFcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICBpZiAodGhpcy4kZWwpIHsgcmV0dXJuIHRoaXMuJGVsOyB9XG5cbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnZycpO1xuXG4gICAgdGhpcy4kYmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdyZWN0Jyk7XG4gICAgdGhpcy4kYmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCB0aGlzLnBhcmFtcy5iYWNrZ3JvdW5kKTtcbiAgICB0aGlzLiRiZy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneCcsIDApO1xuICAgIHRoaXMuJGJnLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5JywgMCk7XG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kYmcpO1xuXG4gICAgdGhpcy4kcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3BhdGgnKTtcbiAgICB0aGlzLiRwYXRoLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnZ2VvbWV0cmljUHJlY2lzaW9uJyk7XG4gICAgdGhpcy4kcGF0aC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlLXdpZHRoJywgJzAuNycpO1xuICAgIHRoaXMuJHBhdGguc3R5bGUub3BhY2l0eSA9IHRoaXMucGFyYW1zLm9wYWNpdHk7XG4gICAgdGhpcy4kcGF0aC5zdHlsZS5zdHJva2UgPSB0aGlzLnBhcmFtcy50aWNrQ29sb3I7XG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kcGF0aCk7XG5cbiAgICB0aGlzLiRsYWJlbHMgPSBbXTtcblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSkge1xuXG4gICAgY29uc29sZS5sb2coXCJzY2FsZSB1cGRhdGVcIik7XG5cbiAgICBjb25zdCBoID0gcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQ7XG4gICAgY29uc3QgY3kwID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwuZG9tYWluKClbMF07XG4gICAgY29uc3QgY3kxID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwuZG9tYWluKClbMV07XG5cbiAgICBpZiAodHlwZW9mKHRoaXMubGFzdEN5MCkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBpZiAodGhpcy5sYXN0Q3kwID09PSBjeTAgJiZcblx0ICB0aGlzLmxhc3RDeTEgPT09IGN5MSAmJlxuXHQgIHRoaXMubGFzdEggPT09IGgpIHtcblx0Y29uc29sZS5sb2coXCJzY2FsZSB1bmNoYW5nZWRcIik7XG5cdHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5sYXN0Q3kwID0gY3kwO1xuICAgIHRoaXMubGFzdEN5MSA9IGN5MTtcbiAgICB0aGlzLmxhc3RIID0gaDtcbiAgICBcbiAgICBjb25zb2xlLmxvZyhcImN5MCA9IFwiICsgY3kwKTtcbiAgICBjb25zb2xlLmxvZyhcImN5MSA9IFwiICsgY3kxKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy4kbGFiZWxzLmxlbmd0aDsgKytpKSB7XG4gICAgICB0aGlzLiRlbC5yZW1vdmVDaGlsZCh0aGlzLiRsYWJlbHNbaV0pO1xuICAgIH1cbiAgICB0aGlzLiRsYWJlbHMgPSBbXTtcblxuICAgIGxldCBzY2FsZVdpZHRoID0gMzU7XG5cbiAgICB0aGlzLiRiZy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCBzY2FsZVdpZHRoKTtcbiAgICB0aGlzLiRiZy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgaCk7XG4gICAgXG4gICAgbGV0IHBhdGggPSBgTSR7c2NhbGVXaWR0aH0sMEwke3NjYWxlV2lkdGh9LCR7aH1gO1xuXG4gICAgY29uc3QgYWRkTGFiZWwgPSAoKHRleHQsIHgsIHkpID0+IHtcbiAgICBcbiAgICAgIGNvbnN0ICRsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAndGV4dCcpO1xuICAgICAgJGxhYmVsLmNsYXNzTGlzdC5hZGQoJ2xhYmVsJyk7XG4gICAgICAkbGFiZWwuc3R5bGUuZm9udFNpemUgPSAnMTBweCc7XG4gICAgICAkbGFiZWwuc3R5bGUubGluZUhlaWdodCA9ICcxMHB4JztcbiAgICAgICRsYWJlbC5zdHlsZS5mb250RmFtaWx5ID0gJ21vbm9zcGFjZSc7XG4gICAgICAkbGFiZWwuc3R5bGUuZmlsbCA9IHRoaXMucGFyYW1zLnRleHRDb2xvcjtcbiAgICAgICRsYWJlbC5zdHlsZS5vcGFjaXR5ID0gdGhpcy5wYXJhbXMub3BhY2l0eTtcbiAgICAgICRsYWJlbC5zdHlsZS5tb3pVc2VyU2VsZWN0ID0gJ25vbmUnO1xuICAgICAgJGxhYmVsLnN0eWxlLndlYmtpdFVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgICAkbGFiZWwuc3R5bGUudXNlclNlbGVjdCA9ICdub25lJztcbiAgICAgIFxuICAgICAgJGxhYmVsLnNldEF0dHJpYnV0ZU5TKFxuXHRudWxsLCAndHJhbnNmb3JtJywgYG1hdHJpeCgxLCAwLCAwLCAtMSwgJHt4fSwgJHtofSlgXG4gICAgICApO1xuICAgICAgXG4gICAgICAkbGFiZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3knLCB5KTtcbiAgICAgIGNvbnN0ICR0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dCk7XG4gICAgICAkbGFiZWwuYXBwZW5kQ2hpbGQoJHRleHQpO1xuXG4gICAgICB0aGlzLiRsYWJlbHMucHVzaCgkbGFiZWwpO1xuICAgICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQoJGxhYmVsKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGx4ID0gMjtcbiAgICBcbiAgICBsZXQgcHJldnkgPSBoICsgMjtcblxuICAgIGNvbnN0IHRpY2tzID0gKG5ldyBTY2FsZVRpY2tJbnRlcnZhbHMoKSkubGluZWFyKGN5MCwgY3kxLCAxMCk7XG4gICAgXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aWNrcy5sZW5ndGg7ICsraSkge1xuXG4gICAgICBsZXQgeSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHRpY2tzW2ldLnZhbHVlKTtcblxuICAgICAgbGV0IGx5ID0gaCAtIHkgKyAzO1xuXG4gICAgICBsZXQgc2hvd1RleHQgPSB0cnVlO1xuICAgICAgaWYgKGx5ID4gaCAtIDggfHwgbHkgPCA4IHx8IGx5ID4gcHJldnkgLSAyMCkge1xuXHQvLyBub3QgZW5vdWdoIHNwYWNlXG5cdHNob3dUZXh0ID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICghc2hvd1RleHQpIHtcblx0XG5cdHBhdGggPSBwYXRoICsgYE0ke3NjYWxlV2lkdGgtNX0sJHt5fUwke3NjYWxlV2lkdGh9LCR7eX1gO1xuXG4gICAgICB9IGVsc2Uge1xuXG5cdHBhdGggPSBwYXRoICsgYE0ke3NjYWxlV2lkdGgtOH0sJHt5fUwke3NjYWxlV2lkdGh9LCR7eX1gO1xuXHRwcmV2eSA9IGx5O1xuXHRhZGRMYWJlbCh0aWNrc1tpXS5sYWJlbCwgbHgsIGx5KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLiRwYXRoLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgcGF0aCk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHNjYWxlIGNhbm5vdCBiZSBzZWxlY3RlZC5cbiAgICogQHJldHVybiB7Qm9vbGVhbn0gZmFsc2VcbiAgICovXG4gIGluQXJlYSgpIHsgcmV0dXJuIGZhbHNlOyB9XG59XG4iXX0=