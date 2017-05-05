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

      var ticks = new _utilsScaleTickIntervals2['default']().linear(cy0, cy1, 10);

      var maxLength = ticks.reduce(function (acc, t) {
        return Math.max(acc, t.label.length);
      }, 0);

      var scaleWidth = maxLength * 6.5 + 12;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LFVBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDNUM7Ozs7Ozs7O1dBTUssa0JBQUc7QUFBRSxhQUFPLEtBQUssQ0FBQztLQUFFOzs7U0F0SVAsS0FBSzs7O3FCQUFMLEtBQUsiLCJmaWxlIjoic3JjL3NoYXBlcy9zY2FsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9iYXNlLXNoYXBlJztcbmltcG9ydCBucyBmcm9tICcuLi9jb3JlL25hbWVzcGFjZSc7XG5pbXBvcnQgU2NhbGVUaWNrSW50ZXJ2YWxzIGZyb20gJy4uL3V0aWxzL3NjYWxlLXRpY2staW50ZXJ2YWxzJztcblxuXG4vKipcbiAqIEEgc2hhcGUgdG8gZGlzcGxheSBhIHZlcnRpY2FsIHNjYWxlIGF0IHRoZSBsZWZ0IGVkZ2Ugb2YgdGhlIHZpc2libGVcbiAqIGFyZWEgb2YgdGhlIGxheWVyLiBTY2FsZSB2YWx1ZXMgYXJlIHRha2VuIGZyb20gdGhlIHlEb21haW4gb2YgdGhlXG4gKiBsYXllci5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1zY2FsZS5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY2FsZSBleHRlbmRzIEJhc2VTaGFwZSB7XG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICdzY2FsZSc7IH1cblxuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGJhY2tncm91bmQ6ICcjZmZmZmZmJyxcbiAgICAgIHRpY2tDb2xvcjogJyMwMDAwMDAnLFxuICAgICAgdGV4dENvbG9yOiAnIzAwMDAwMCcsXG4gICAgICBvcGFjaXR5OiAxXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgaWYgKHRoaXMuJGVsKSB7IHJldHVybiB0aGlzLiRlbDsgfVxuXG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2cnKTtcblxuICAgIHRoaXMuJGJnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAncmVjdCcpO1xuICAgIHRoaXMuJGJnLnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgdGhpcy5wYXJhbXMuYmFja2dyb3VuZCk7XG4gICAgdGhpcy4kYmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3gnLCAwKTtcbiAgICB0aGlzLiRiZy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneScsIDApO1xuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRoaXMuJGJnKTtcblxuICAgIHRoaXMuJHBhdGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdwYXRoJyk7XG4gICAgdGhpcy4kcGF0aC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc2hhcGUtcmVuZGVyaW5nJywgJ2dlb21ldHJpY1ByZWNpc2lvbicpO1xuICAgIHRoaXMuJHBhdGguc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZS13aWR0aCcsICcwLjcnKTtcbiAgICB0aGlzLiRwYXRoLnN0eWxlLm9wYWNpdHkgPSB0aGlzLnBhcmFtcy5vcGFjaXR5O1xuICAgIHRoaXMuJHBhdGguc3R5bGUuc3Ryb2tlID0gdGhpcy5wYXJhbXMudGlja0NvbG9yO1xuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRoaXMuJHBhdGgpO1xuXG4gICAgdGhpcy4kbGFiZWxzID0gW107XG5cbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0pIHtcblxuICAgIGNvbnNvbGUubG9nKFwic2NhbGUgdXBkYXRlXCIpO1xuXG4gICAgY29uc3QgaCA9IHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0O1xuICAgIGNvbnN0IGN5MCA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsLmRvbWFpbigpWzBdO1xuICAgIGNvbnN0IGN5MSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsLmRvbWFpbigpWzFdO1xuXG4gICAgaWYgKHR5cGVvZih0aGlzLmxhc3RDeTApICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgaWYgKHRoaXMubGFzdEN5MCA9PT0gY3kwICYmXG5cdCAgdGhpcy5sYXN0Q3kxID09PSBjeTEgJiZcblx0ICB0aGlzLmxhc3RIID09PSBoKSB7XG5cdGNvbnNvbGUubG9nKFwic2NhbGUgdW5jaGFuZ2VkXCIpO1xuXHRyZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMubGFzdEN5MCA9IGN5MDtcbiAgICB0aGlzLmxhc3RDeTEgPSBjeTE7XG4gICAgdGhpcy5sYXN0SCA9IGg7XG4gICAgXG4gICAgY29uc29sZS5sb2coXCJjeTAgPSBcIiArIGN5MCk7XG4gICAgY29uc29sZS5sb2coXCJjeTEgPSBcIiArIGN5MSk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuJGxhYmVscy5sZW5ndGg7ICsraSkge1xuICAgICAgdGhpcy4kZWwucmVtb3ZlQ2hpbGQodGhpcy4kbGFiZWxzW2ldKTtcbiAgICB9XG4gICAgdGhpcy4kbGFiZWxzID0gW107XG5cbiAgICBjb25zdCB0aWNrcyA9IChuZXcgU2NhbGVUaWNrSW50ZXJ2YWxzKCkpLmxpbmVhcihjeTAsIGN5MSwgMTApO1xuXG4gICAgbGV0IG1heExlbmd0aCA9IHRpY2tzLnJlZHVjZSgoYWNjLCB0KSA9PiBNYXRoLm1heChhY2MsIHQubGFiZWwubGVuZ3RoKSwgMCk7XG4gICAgXG4gICAgbGV0IHNjYWxlV2lkdGggPSBtYXhMZW5ndGggKiA2LjUgKyAxMjtcblxuICAgIHRoaXMuJGJnLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHNjYWxlV2lkdGgpO1xuICAgIHRoaXMuJGJnLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBoKTtcbiAgICBcbiAgICBsZXQgcGF0aCA9IGBNJHtzY2FsZVdpZHRofSwwTCR7c2NhbGVXaWR0aH0sJHtofWA7XG5cbiAgICBjb25zdCBhZGRMYWJlbCA9ICgodGV4dCwgeCwgeSkgPT4ge1xuICAgIFxuICAgICAgY29uc3QgJGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICd0ZXh0Jyk7XG4gICAgICAkbGFiZWwuY2xhc3NMaXN0LmFkZCgnbGFiZWwnKTtcbiAgICAgICRsYWJlbC5zdHlsZS5mb250U2l6ZSA9ICcxMHB4JztcbiAgICAgICRsYWJlbC5zdHlsZS5saW5lSGVpZ2h0ID0gJzEwcHgnO1xuICAgICAgJGxhYmVsLnN0eWxlLmZvbnRGYW1pbHkgPSAnbW9ub3NwYWNlJztcbiAgICAgICRsYWJlbC5zdHlsZS5maWxsID0gdGhpcy5wYXJhbXMudGV4dENvbG9yO1xuICAgICAgJGxhYmVsLnN0eWxlLm9wYWNpdHkgPSB0aGlzLnBhcmFtcy5vcGFjaXR5O1xuICAgICAgJGxhYmVsLnN0eWxlLm1velVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgICAkbGFiZWwuc3R5bGUud2Via2l0VXNlclNlbGVjdCA9ICdub25lJztcbiAgICAgICRsYWJlbC5zdHlsZS51c2VyU2VsZWN0ID0gJ25vbmUnO1xuICAgICAgXG4gICAgICAkbGFiZWwuc2V0QXR0cmlidXRlTlMoXG5cdG51bGwsICd0cmFuc2Zvcm0nLCBgbWF0cml4KDEsIDAsIDAsIC0xLCAke3h9LCAke2h9KWBcbiAgICAgICk7XG4gICAgICBcbiAgICAgICRsYWJlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneScsIHkpO1xuICAgICAgY29uc3QgJHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0KTtcbiAgICAgICRsYWJlbC5hcHBlbmRDaGlsZCgkdGV4dCk7XG5cbiAgICAgIHRoaXMuJGxhYmVscy5wdXNoKCRsYWJlbCk7XG4gICAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCgkbGFiZWwpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgbHggPSAyO1xuICAgIFxuICAgIGxldCBwcmV2eSA9IGggKyAyO1xuICAgIFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGlja3MubGVuZ3RoOyArK2kpIHtcblxuICAgICAgbGV0IHkgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCh0aWNrc1tpXS52YWx1ZSk7XG5cbiAgICAgIGxldCBseSA9IGggLSB5ICsgMztcblxuICAgICAgbGV0IHNob3dUZXh0ID0gdHJ1ZTtcbiAgICAgIGlmIChseSA+IGggLSA4IHx8IGx5IDwgOCB8fCBseSA+IHByZXZ5IC0gMjApIHtcblx0Ly8gbm90IGVub3VnaCBzcGFjZVxuXHRzaG93VGV4dCA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXNob3dUZXh0KSB7XG5cdFxuXHRwYXRoID0gcGF0aCArIGBNJHtzY2FsZVdpZHRoLTV9LCR7eX1MJHtzY2FsZVdpZHRofSwke3l9YDtcblxuICAgICAgfSBlbHNlIHtcblxuXHRwYXRoID0gcGF0aCArIGBNJHtzY2FsZVdpZHRoLTh9LCR7eX1MJHtzY2FsZVdpZHRofSwke3l9YDtcblx0cHJldnkgPSBseTtcblx0YWRkTGFiZWwodGlja3NbaV0ubGFiZWwsIGx4LCBseSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy4kcGF0aC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZCcsIHBhdGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBzY2FsZSBjYW5ub3QgYmUgc2VsZWN0ZWQuXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IGZhbHNlXG4gICAqL1xuICBpbkFyZWEoKSB7IHJldHVybiBmYWxzZTsgfVxufVxuIl19