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

      var ticks = (0, _utilsScaleTickIntervals.linear)(cy0, cy1, 10);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUM1Qzs7Ozs7Ozs7V0FNSyxrQkFBRztBQUFFLGFBQU8sS0FBSyxDQUFDO0tBQUU7OztTQXRJUCxLQUFLOzs7cUJBQUwsS0FBSyIsImZpbGUiOiJzcmMvc2hhcGVzL3NjYWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuL2Jhc2Utc2hhcGUnO1xuaW1wb3J0IG5zIGZyb20gJy4uL2NvcmUvbmFtZXNwYWNlJztcbmltcG9ydCB7bGluZWFyIGFzIGNhbGN1bGF0ZUxpbmVhclRpY2tzfSBmcm9tICcuLi91dGlscy9zY2FsZS10aWNrLWludGVydmFscyc7XG5cblxuLyoqXG4gKiBBIHNoYXBlIHRvIGRpc3BsYXkgYSB2ZXJ0aWNhbCBzY2FsZSBhdCB0aGUgbGVmdCBlZGdlIG9mIHRoZSB2aXNpYmxlXG4gKiBhcmVhIG9mIHRoZSBsYXllci4gU2NhbGUgdmFsdWVzIGFyZSB0YWtlbiBmcm9tIHRoZSB5RG9tYWluIG9mIHRoZVxuICogbGF5ZXIuXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItc2NhbGUuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NhbGUgZXh0ZW5kcyBCYXNlU2hhcGUge1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAnc2NhbGUnOyB9XG5cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBiYWNrZ3JvdW5kOiAnI2ZmZmZmZicsXG4gICAgICB0aWNrQ29sb3I6ICcjMDAwMDAwJyxcbiAgICAgIHRleHRDb2xvcjogJyMwMDAwMDAnLFxuICAgICAgb3BhY2l0eTogMVxuICAgIH07XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIGlmICh0aGlzLiRlbCkgeyByZXR1cm4gdGhpcy4kZWw7IH1cblxuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdnJyk7XG5cbiAgICB0aGlzLiRiZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3JlY3QnKTtcbiAgICB0aGlzLiRiZy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsIHRoaXMucGFyYW1zLmJhY2tncm91bmQpO1xuICAgIHRoaXMuJGJnLnNldEF0dHJpYnV0ZU5TKG51bGwsICd4JywgMCk7XG4gICAgdGhpcy4kYmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3knLCAwKTtcbiAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRiZyk7XG5cbiAgICB0aGlzLiRwYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAncGF0aCcpO1xuICAgIHRoaXMuJHBhdGguc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdnZW9tZXRyaWNQcmVjaXNpb24nKTtcbiAgICB0aGlzLiRwYXRoLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2Utd2lkdGgnLCAnMC43Jyk7XG4gICAgdGhpcy4kcGF0aC5zdHlsZS5vcGFjaXR5ID0gdGhpcy5wYXJhbXMub3BhY2l0eTtcbiAgICB0aGlzLiRwYXRoLnN0eWxlLnN0cm9rZSA9IHRoaXMucGFyYW1zLnRpY2tDb2xvcjtcbiAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRwYXRoKTtcblxuICAgIHRoaXMuJGxhYmVscyA9IFtdO1xuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtKSB7XG5cbiAgICBjb25zb2xlLmxvZyhcInNjYWxlIHVwZGF0ZVwiKTtcblxuICAgIGNvbnN0IGggPSByZW5kZXJpbmdDb250ZXh0LmhlaWdodDtcbiAgICBjb25zdCBjeTAgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbC5kb21haW4oKVswXTtcbiAgICBjb25zdCBjeTEgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbC5kb21haW4oKVsxXTtcblxuICAgIGlmICh0eXBlb2YodGhpcy5sYXN0Q3kwKSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGlmICh0aGlzLmxhc3RDeTAgPT09IGN5MCAmJlxuXHQgIHRoaXMubGFzdEN5MSA9PT0gY3kxICYmXG5cdCAgdGhpcy5sYXN0SCA9PT0gaCkge1xuXHRjb25zb2xlLmxvZyhcInNjYWxlIHVuY2hhbmdlZFwiKTtcblx0cmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmxhc3RDeTAgPSBjeTA7XG4gICAgdGhpcy5sYXN0Q3kxID0gY3kxO1xuICAgIHRoaXMubGFzdEggPSBoO1xuICAgIFxuICAgIGNvbnNvbGUubG9nKFwiY3kwID0gXCIgKyBjeTApO1xuICAgIGNvbnNvbGUubG9nKFwiY3kxID0gXCIgKyBjeTEpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLiRsYWJlbHMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHRoaXMuJGVsLnJlbW92ZUNoaWxkKHRoaXMuJGxhYmVsc1tpXSk7XG4gICAgfVxuICAgIHRoaXMuJGxhYmVscyA9IFtdO1xuXG4gICAgY29uc3QgdGlja3MgPSBjYWxjdWxhdGVMaW5lYXJUaWNrcyhjeTAsIGN5MSwgMTApO1xuXG4gICAgbGV0IG1heExlbmd0aCA9IHRpY2tzLnJlZHVjZSgoYWNjLCB0KSA9PiBNYXRoLm1heChhY2MsIHQubGFiZWwubGVuZ3RoKSwgMCk7XG4gICAgXG4gICAgbGV0IHNjYWxlV2lkdGggPSBtYXhMZW5ndGggKiA2LjUgKyAxMjtcblxuICAgIHRoaXMuJGJnLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHNjYWxlV2lkdGgpO1xuICAgIHRoaXMuJGJnLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBoKTtcbiAgICBcbiAgICBsZXQgcGF0aCA9IGBNJHtzY2FsZVdpZHRofSwwTCR7c2NhbGVXaWR0aH0sJHtofWA7XG5cbiAgICBjb25zdCBhZGRMYWJlbCA9ICgodGV4dCwgeCwgeSkgPT4ge1xuICAgIFxuICAgICAgY29uc3QgJGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICd0ZXh0Jyk7XG4gICAgICAkbGFiZWwuY2xhc3NMaXN0LmFkZCgnbGFiZWwnKTtcbiAgICAgICRsYWJlbC5zdHlsZS5mb250U2l6ZSA9ICcxMHB4JztcbiAgICAgICRsYWJlbC5zdHlsZS5saW5lSGVpZ2h0ID0gJzEwcHgnO1xuICAgICAgJGxhYmVsLnN0eWxlLmZvbnRGYW1pbHkgPSAnbW9ub3NwYWNlJztcbiAgICAgICRsYWJlbC5zdHlsZS5maWxsID0gdGhpcy5wYXJhbXMudGV4dENvbG9yO1xuICAgICAgJGxhYmVsLnN0eWxlLm9wYWNpdHkgPSB0aGlzLnBhcmFtcy5vcGFjaXR5O1xuICAgICAgJGxhYmVsLnN0eWxlLm1velVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgICAkbGFiZWwuc3R5bGUud2Via2l0VXNlclNlbGVjdCA9ICdub25lJztcbiAgICAgICRsYWJlbC5zdHlsZS51c2VyU2VsZWN0ID0gJ25vbmUnO1xuICAgICAgXG4gICAgICAkbGFiZWwuc2V0QXR0cmlidXRlTlMoXG5cdG51bGwsICd0cmFuc2Zvcm0nLCBgbWF0cml4KDEsIDAsIDAsIC0xLCAke3h9LCAke2h9KWBcbiAgICAgICk7XG4gICAgICBcbiAgICAgICRsYWJlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneScsIHkpO1xuICAgICAgY29uc3QgJHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0KTtcbiAgICAgICRsYWJlbC5hcHBlbmRDaGlsZCgkdGV4dCk7XG5cbiAgICAgIHRoaXMuJGxhYmVscy5wdXNoKCRsYWJlbCk7XG4gICAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCgkbGFiZWwpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgbHggPSAyO1xuICAgIFxuICAgIGxldCBwcmV2eSA9IGggKyAyO1xuICAgIFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGlja3MubGVuZ3RoOyArK2kpIHtcblxuICAgICAgbGV0IHkgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCh0aWNrc1tpXS52YWx1ZSk7XG5cbiAgICAgIGxldCBseSA9IGggLSB5ICsgMztcblxuICAgICAgbGV0IHNob3dUZXh0ID0gdHJ1ZTtcbiAgICAgIGlmIChseSA+IGggLSA4IHx8IGx5IDwgOCB8fCBseSA+IHByZXZ5IC0gMjApIHtcblx0Ly8gbm90IGVub3VnaCBzcGFjZVxuXHRzaG93VGV4dCA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXNob3dUZXh0KSB7XG5cdFxuXHRwYXRoID0gcGF0aCArIGBNJHtzY2FsZVdpZHRoLTV9LCR7eX1MJHtzY2FsZVdpZHRofSwke3l9YDtcblxuICAgICAgfSBlbHNlIHtcblxuXHRwYXRoID0gcGF0aCArIGBNJHtzY2FsZVdpZHRoLTh9LCR7eX1MJHtzY2FsZVdpZHRofSwke3l9YDtcblx0cHJldnkgPSBseTtcblx0YWRkTGFiZWwodGlja3NbaV0ubGFiZWwsIGx4LCBseSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy4kcGF0aC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZCcsIHBhdGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBzY2FsZSBjYW5ub3QgYmUgc2VsZWN0ZWQuXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IGZhbHNlXG4gICAqL1xuICBpbkFyZWEoKSB7IHJldHVybiBmYWxzZTsgfVxufVxuIl19