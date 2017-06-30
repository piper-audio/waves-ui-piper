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

      var prevy = h + 14;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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S0FDNUM7Ozs7Ozs7O1dBTUssa0JBQUc7QUFBRSxhQUFPLEtBQUssQ0FBQztLQUFFOzs7U0FySVAsS0FBSzs7O3FCQUFMLEtBQUsiLCJmaWxlIjoic3JjL3NoYXBlcy9zY2FsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9iYXNlLXNoYXBlJztcbmltcG9ydCBucyBmcm9tICcuLi9jb3JlL25hbWVzcGFjZSc7XG5pbXBvcnQge2xpbmVhciBhcyBjYWxjdWxhdGVMaW5lYXJUaWNrc30gZnJvbSAnLi4vdXRpbHMvc2NhbGUtdGljay1pbnRlcnZhbHMnO1xuXG5cbi8qKlxuICogQSBzaGFwZSB0byBkaXNwbGF5IGEgdmVydGljYWwgc2NhbGUgYXQgdGhlIGxlZnQgZWRnZSBvZiB0aGUgdmlzaWJsZVxuICogYXJlYSBvZiB0aGUgbGF5ZXIuIFNjYWxlIHZhbHVlcyBhcmUgdGFrZW4gZnJvbSB0aGUgeURvbWFpbiBvZiB0aGVcbiAqIGxheWVyLlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLXNjYWxlLmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjYWxlIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ3NjYWxlJzsgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYmFja2dyb3VuZDogJyNmZmZmZmYnLFxuICAgICAgdGlja0NvbG9yOiAnIzAwMDAwMCcsXG4gICAgICB0ZXh0Q29sb3I6ICcjMDAwMDAwJyxcbiAgICAgIG9wYWNpdHk6IDFcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICBpZiAodGhpcy4kZWwpIHsgcmV0dXJuIHRoaXMuJGVsOyB9XG5cbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnZycpO1xuXG4gICAgdGhpcy4kYmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdyZWN0Jyk7XG4gICAgdGhpcy4kYmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCB0aGlzLnBhcmFtcy5iYWNrZ3JvdW5kKTtcbiAgICB0aGlzLiRiZy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneCcsIDApO1xuICAgIHRoaXMuJGJnLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5JywgMCk7XG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kYmcpO1xuXG4gICAgdGhpcy4kcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3BhdGgnKTtcbiAgICB0aGlzLiRwYXRoLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnZ2VvbWV0cmljUHJlY2lzaW9uJyk7XG4gICAgdGhpcy4kcGF0aC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlLXdpZHRoJywgJzAuNycpO1xuICAgIHRoaXMuJHBhdGguc3R5bGUub3BhY2l0eSA9IHRoaXMucGFyYW1zLm9wYWNpdHk7XG4gICAgdGhpcy4kcGF0aC5zdHlsZS5zdHJva2UgPSB0aGlzLnBhcmFtcy50aWNrQ29sb3I7XG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kcGF0aCk7XG5cbiAgICB0aGlzLiRsYWJlbHMgPSBbXTtcblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSkge1xuXG4gICAgY29uc29sZS5sb2coXCJzY2FsZSB1cGRhdGVcIik7XG5cbiAgICBjb25zdCBoID0gcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQ7XG4gICAgY29uc3QgY3kwID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwuZG9tYWluKClbMF07XG4gICAgY29uc3QgY3kxID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwuZG9tYWluKClbMV07XG5cbiAgICBpZiAodHlwZW9mKHRoaXMubGFzdEN5MCkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBpZiAodGhpcy5sYXN0Q3kwID09PSBjeTAgJiZcblx0ICB0aGlzLmxhc3RDeTEgPT09IGN5MSAmJlxuXHQgIHRoaXMubGFzdEggPT09IGgpIHtcblx0cmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmxhc3RDeTAgPSBjeTA7XG4gICAgdGhpcy5sYXN0Q3kxID0gY3kxO1xuICAgIHRoaXMubGFzdEggPSBoO1xuICAgIFxuICAgIGNvbnNvbGUubG9nKFwiY3kwID0gXCIgKyBjeTApO1xuICAgIGNvbnNvbGUubG9nKFwiY3kxID0gXCIgKyBjeTEpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLiRsYWJlbHMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHRoaXMuJGVsLnJlbW92ZUNoaWxkKHRoaXMuJGxhYmVsc1tpXSk7XG4gICAgfVxuICAgIHRoaXMuJGxhYmVscyA9IFtdO1xuXG4gICAgY29uc3QgdGlja3MgPSBjYWxjdWxhdGVMaW5lYXJUaWNrcyhjeTAsIGN5MSwgMTApO1xuXG4gICAgbGV0IG1heExlbmd0aCA9IHRpY2tzLnJlZHVjZSgoYWNjLCB0KSA9PiBNYXRoLm1heChhY2MsIHQubGFiZWwubGVuZ3RoKSwgMCk7XG4gICAgXG4gICAgbGV0IHNjYWxlV2lkdGggPSBtYXhMZW5ndGggKiA2LjUgKyAxMjtcblxuICAgIHRoaXMuJGJnLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHNjYWxlV2lkdGgpO1xuICAgIHRoaXMuJGJnLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBoKTtcbiAgICBcbiAgICBsZXQgcGF0aCA9IGBNJHtzY2FsZVdpZHRofSwwTCR7c2NhbGVXaWR0aH0sJHtofWA7XG5cbiAgICBjb25zdCBhZGRMYWJlbCA9ICgodGV4dCwgeCwgeSkgPT4ge1xuICAgIFxuICAgICAgY29uc3QgJGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICd0ZXh0Jyk7XG4gICAgICAkbGFiZWwuY2xhc3NMaXN0LmFkZCgnbGFiZWwnKTtcbiAgICAgICRsYWJlbC5zdHlsZS5mb250U2l6ZSA9ICcxMHB4JztcbiAgICAgICRsYWJlbC5zdHlsZS5saW5lSGVpZ2h0ID0gJzEwcHgnO1xuICAgICAgJGxhYmVsLnN0eWxlLmZvbnRGYW1pbHkgPSAnbW9ub3NwYWNlJztcbiAgICAgICRsYWJlbC5zdHlsZS5maWxsID0gdGhpcy5wYXJhbXMudGV4dENvbG9yO1xuICAgICAgJGxhYmVsLnN0eWxlLm9wYWNpdHkgPSB0aGlzLnBhcmFtcy5vcGFjaXR5O1xuICAgICAgJGxhYmVsLnN0eWxlLm1velVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgICAkbGFiZWwuc3R5bGUud2Via2l0VXNlclNlbGVjdCA9ICdub25lJztcbiAgICAgICRsYWJlbC5zdHlsZS51c2VyU2VsZWN0ID0gJ25vbmUnO1xuICAgICAgXG4gICAgICAkbGFiZWwuc2V0QXR0cmlidXRlTlMoXG5cdG51bGwsICd0cmFuc2Zvcm0nLCBgbWF0cml4KDEsIDAsIDAsIC0xLCAke3h9LCAke2h9KWBcbiAgICAgICk7XG4gICAgICBcbiAgICAgICRsYWJlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneScsIHkpO1xuICAgICAgY29uc3QgJHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0KTtcbiAgICAgICRsYWJlbC5hcHBlbmRDaGlsZCgkdGV4dCk7XG5cbiAgICAgIHRoaXMuJGxhYmVscy5wdXNoKCRsYWJlbCk7XG4gICAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCgkbGFiZWwpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgbHggPSAyO1xuICAgIFxuICAgIGxldCBwcmV2eSA9IGggKyAxNDtcbiAgICBcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRpY2tzLmxlbmd0aDsgKytpKSB7XG5cbiAgICAgIGxldCB5ID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwodGlja3NbaV0udmFsdWUpO1xuXG4gICAgICBsZXQgbHkgPSBoIC0geSArIDM7XG5cbiAgICAgIGxldCBzaG93VGV4dCA9IHRydWU7XG4gICAgICBpZiAobHkgPiBoIC0gOCB8fCBseSA8IDggfHwgbHkgPiBwcmV2eSAtIDIwKSB7XG5cdC8vIG5vdCBlbm91Z2ggc3BhY2Vcblx0c2hvd1RleHQgPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFzaG93VGV4dCkge1xuXHRcblx0cGF0aCA9IHBhdGggKyBgTSR7c2NhbGVXaWR0aC01fSwke3l9TCR7c2NhbGVXaWR0aH0sJHt5fWA7XG5cbiAgICAgIH0gZWxzZSB7XG5cblx0cGF0aCA9IHBhdGggKyBgTSR7c2NhbGVXaWR0aC04fSwke3l9TCR7c2NhbGVXaWR0aH0sJHt5fWA7XG5cdHByZXZ5ID0gbHk7XG5cdGFkZExhYmVsKHRpY2tzW2ldLmxhYmVsLCBseCwgbHkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuJHBhdGguc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLCBwYXRoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgc2NhbGUgY2Fubm90IGJlIHNlbGVjdGVkLlxuICAgKiBAcmV0dXJuIHtCb29sZWFufSBmYWxzZVxuICAgKi9cbiAgaW5BcmVhKCkgeyByZXR1cm4gZmFsc2U7IH1cbn1cbiJdfQ==