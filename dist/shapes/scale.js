'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Math$log10 = require('babel-runtime/core-js/math/log10')['default'];

var _Math$trunc = require('babel-runtime/core-js/math/trunc')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
     value: true
});

var _baseShape = require('./base-shape');

var _baseShape2 = _interopRequireDefault(_baseShape);

var _coreNamespace = require('../core/namespace');

var _coreNamespace2 = _interopRequireDefault(_coreNamespace);

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

               var n = 10;
               var inc = (cy1 - cy0) / n;

               // todo: factor out, test
               var dp = 0;
               var sf = 0;
               var round = 1.0;
               var fixed = false;
               if (inc > 0) {
                    var ilg = _Math$log10(inc);
                    var prec = undefined;
                    if (ilg > 0) {
                         prec = Math.round(ilg) - 1;
                    } else {
                         prec = _Math$trunc(ilg) - 1;
                    }
                    if (prec < 0) {
                         dp = -prec;
                         sf = 2;
                    } else {
                         sf = prec;
                    }
                    if (sf === 0) {
                         sf = 1;
                    }
                    if (prec < 4 && prec > -3) {
                         fixed = true;
                    }
                    round = Math.pow(10.0, prec);

                    console.log("inc = " + inc + ", prec = " + prec + ", dp = " + dp + ", sf = " + sf + ", round = " + round);
                    inc = Math.round(inc / round) * round;
                    console.log("rounding inc to " + inc);
               } else {
                    inc = 1.0;
               }

               for (var i = 0; i < this.$labels.length; ++i) {
                    this.$el.removeChild(this.$labels[i]);
               }
               this.$labels = [];

               var scaleWidth = 35;

               this.$bg.setAttributeNS(null, 'width', scaleWidth);
               this.$bg.setAttributeNS(null, 'height', h);

               var path = 'M' + scaleWidth + ',0L' + scaleWidth + ',' + h;

               var addLabel = function addLabel(value, x, y) {

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

                    var label = "";
                    if (fixed) {
                         label = value.toFixed(dp);
                    } else {
                         label = value.toPrecision(sf);
                    }

                    $label.setAttributeNS(null, 'y', y);
                    var $text = document.createTextNode(label);
                    $label.appendChild($text);

                    _this.$labels.push($label);
                    _this.$el.appendChild($label);
               };

               var lx = 2;

               var prevy = h + 2;

               for (var i = 0;; ++i) {

                    var val = cy0 + i * inc;
                    if (val >= cy1) {
                         break;
                    }

                    var dispval = Math.round(val / round) * round;
                    var y = renderingContext.valueToPixel(dispval);

                    var ly = h - y + 3;

                    var showText = true;
                    if (ly > h - 8 || ly < 8 || ly > prevy - 20) {
                         // not enough space
                         showText = false;
                    }

                    console.log("i = " + i + " -> val = " + val + ", dispval = " + dispval + ", y = " + y);

                    if (!showText) {

                         path = path + ('M' + (scaleWidth - 5) + ',' + y + 'L' + scaleWidth + ',' + y);
                    } else {

                         path = path + ('M' + (scaleWidth - 8) + ',' + y + 'L' + scaleWidth + ',' + y);
                         prevy = ly;
                         addLabel(dispval, lx, ly);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNYOztBQUVELDJCQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsWUFBWSxHQUFHLEdBQUcsR0FBRyxjQUFjLEdBQUcsT0FBTyxHQUFHLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQzs7QUFFdkYsd0JBQUksQ0FBQyxRQUFRLEVBQUU7O0FBRXBCLDZCQUFJLEdBQUcsSUFBSSxXQUFPLFVBQVUsR0FBQyxDQUFDLENBQUEsU0FBSSxDQUFDLFNBQUksVUFBVSxTQUFJLENBQUMsQ0FBRSxDQUFDO3FCQUVuRCxNQUFNOztBQUVaLDZCQUFJLEdBQUcsSUFBSSxXQUFPLFVBQVUsR0FBQyxDQUFDLENBQUEsU0FBSSxDQUFDLFNBQUksVUFBVSxTQUFJLENBQUMsQ0FBRSxDQUFDO0FBQ3pELDhCQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ1gsaUNBQVEsQ0FBQyxPQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO3FCQUNwQjtnQkFDRjs7QUFFRCxtQkFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztXQUM1Qzs7Ozs7Ozs7aUJBTUssa0JBQUc7QUFBRSxzQkFBTyxLQUFLLENBQUM7V0FBRTs7O1lBdkxQLEtBQUs7OztxQkFBTCxLQUFLIiwiZmlsZSI6InNyYy9zaGFwZXMvc2NhbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vYmFzZS1zaGFwZSc7XG5pbXBvcnQgbnMgZnJvbSAnLi4vY29yZS9uYW1lc3BhY2UnO1xuXG5cbi8qKlxuICogQSBzaGFwZSB0byBkaXNwbGF5IGEgdmVydGljYWwgc2NhbGUgYXQgdGhlIGxlZnQgZWRnZSBvZiB0aGUgdmlzaWJsZVxuICogYXJlYSBvZiB0aGUgbGF5ZXIuIFNjYWxlIHZhbHVlcyBhcmUgdGFrZW4gZnJvbSB0aGUgeURvbWFpbiBvZiB0aGVcbiAqIGxheWVyLlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLXNjYWxlLmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjYWxlIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ3NjYWxlJzsgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYmFja2dyb3VuZDogJyNmZmZmZmYnLFxuICAgICAgdGlja0NvbG9yOiAnIzAwMDAwMCcsXG4gICAgICB0ZXh0Q29sb3I6ICcjMDAwMDAwJyxcbiAgICAgIG9wYWNpdHk6IDFcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICBpZiAodGhpcy4kZWwpIHsgcmV0dXJuIHRoaXMuJGVsOyB9XG5cbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnZycpO1xuXG4gICAgdGhpcy4kYmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdyZWN0Jyk7XG4gICAgdGhpcy4kYmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCB0aGlzLnBhcmFtcy5iYWNrZ3JvdW5kKTtcbiAgICB0aGlzLiRiZy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneCcsIDApO1xuICAgIHRoaXMuJGJnLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5JywgMCk7XG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kYmcpO1xuXG4gICAgdGhpcy4kcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3BhdGgnKTtcbiAgICB0aGlzLiRwYXRoLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnZ2VvbWV0cmljUHJlY2lzaW9uJyk7XG4gICAgdGhpcy4kcGF0aC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlLXdpZHRoJywgJzAuNycpO1xuICAgIHRoaXMuJHBhdGguc3R5bGUub3BhY2l0eSA9IHRoaXMucGFyYW1zLm9wYWNpdHk7XG4gICAgdGhpcy4kcGF0aC5zdHlsZS5zdHJva2UgPSB0aGlzLnBhcmFtcy50aWNrQ29sb3I7XG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kcGF0aCk7XG5cbiAgICB0aGlzLiRsYWJlbHMgPSBbXTtcblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSkge1xuXG4gICAgY29uc29sZS5sb2coXCJzY2FsZSB1cGRhdGVcIik7XG5cbiAgICBjb25zdCBoID0gcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQ7XG4gICAgY29uc3QgY3kwID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwuZG9tYWluKClbMF07XG4gICAgY29uc3QgY3kxID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwuZG9tYWluKClbMV07XG5cbiAgICBpZiAodHlwZW9mKHRoaXMubGFzdEN5MCkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBpZiAodGhpcy5sYXN0Q3kwID09PSBjeTAgJiZcblx0ICB0aGlzLmxhc3RDeTEgPT09IGN5MSAmJlxuXHQgIHRoaXMubGFzdEggPT09IGgpIHtcblx0Y29uc29sZS5sb2coXCJzY2FsZSB1bmNoYW5nZWRcIik7XG5cdHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5sYXN0Q3kwID0gY3kwO1xuICAgIHRoaXMubGFzdEN5MSA9IGN5MTtcbiAgICB0aGlzLmxhc3RIID0gaDtcbiAgICBcbiAgICBjb25zb2xlLmxvZyhcImN5MCA9IFwiICsgY3kwKTtcbiAgICBjb25zb2xlLmxvZyhcImN5MSA9IFwiICsgY3kxKTtcblxuICAgIGxldCBuID0gMTA7XG4gICAgbGV0IGluYyA9IChjeTEgLSBjeTApIC8gbjtcblxuICAgIC8vIHRvZG86IGZhY3RvciBvdXQsIHRlc3RcbiAgICBsZXQgZHAgPSAwO1xuICAgIGxldCBzZiA9IDA7XG4gICAgbGV0IHJvdW5kID0gMS4wO1xuICAgIGxldCBmaXhlZCA9IGZhbHNlO1xuICAgIGlmIChpbmMgPiAwKSB7XG4gICAgICBsZXQgaWxnID0gTWF0aC5sb2cxMChpbmMpO1xuICAgICAgbGV0IHByZWM7XG4gICAgICBpZiAoaWxnID4gMCkge1xuXHRwcmVjID0gTWF0aC5yb3VuZChpbGcpIC0gMTtcbiAgICAgIH0gZWxzZSB7XG5cdHByZWMgPSBNYXRoLnRydW5jKGlsZykgLSAxO1xuICAgICAgfVxuICAgICAgaWYgKHByZWMgPCAwKSB7XG4gICAgICAgIGRwID0gLXByZWM7XG5cdHNmID0gMjtcbiAgICAgIH0gZWxzZSB7XG5cdHNmID0gcHJlYztcbiAgICAgIH1cbiAgICAgIGlmIChzZiA9PT0gMCkge1xuXHRzZiA9IDE7XG4gICAgICB9XG4gICAgICBpZiAocHJlYyA8IDQgJiYgcHJlYyA+IC0zKSB7XG5cdGZpeGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJvdW5kID0gTWF0aC5wb3coMTAuMCwgcHJlYyk7XG5cbiAgICAgIGNvbnNvbGUubG9nKFwiaW5jID0gXCIgKyBpbmMgKyBcIiwgcHJlYyA9IFwiICsgcHJlYyArIFwiLCBkcCA9IFwiICsgZHAgKyBcIiwgc2YgPSBcIiArXG5cdFx0ICBzZiArIFwiLCByb3VuZCA9IFwiICsgcm91bmQpO1xuICAgICAgaW5jID0gTWF0aC5yb3VuZChpbmMgLyByb3VuZCkgKiByb3VuZDtcbiAgICAgIGNvbnNvbGUubG9nKFwicm91bmRpbmcgaW5jIHRvIFwiICsgaW5jKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5jID0gMS4wO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy4kbGFiZWxzLmxlbmd0aDsgKytpKSB7XG4gICAgICB0aGlzLiRlbC5yZW1vdmVDaGlsZCh0aGlzLiRsYWJlbHNbaV0pO1xuICAgIH1cbiAgICB0aGlzLiRsYWJlbHMgPSBbXTtcblxuICAgIGxldCBzY2FsZVdpZHRoID0gMzU7XG5cbiAgICB0aGlzLiRiZy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCBzY2FsZVdpZHRoKTtcbiAgICB0aGlzLiRiZy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgaCk7XG4gICAgXG4gICAgbGV0IHBhdGggPSBgTSR7c2NhbGVXaWR0aH0sMEwke3NjYWxlV2lkdGh9LCR7aH1gO1xuXG4gICAgY29uc3QgYWRkTGFiZWwgPSAoKHZhbHVlLCB4LCB5KSA9PiB7XG4gICAgXG4gICAgICBjb25zdCAkbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ3RleHQnKTtcbiAgICAgICRsYWJlbC5jbGFzc0xpc3QuYWRkKCdsYWJlbCcpO1xuICAgICAgJGxhYmVsLnN0eWxlLmZvbnRTaXplID0gJzEwcHgnO1xuICAgICAgJGxhYmVsLnN0eWxlLmxpbmVIZWlnaHQgPSAnMTBweCc7XG4gICAgICAkbGFiZWwuc3R5bGUuZm9udEZhbWlseSA9ICdtb25vc3BhY2UnO1xuICAgICAgJGxhYmVsLnN0eWxlLmZpbGwgPSB0aGlzLnBhcmFtcy50ZXh0Q29sb3I7XG4gICAgICAkbGFiZWwuc3R5bGUub3BhY2l0eSA9IHRoaXMucGFyYW1zLm9wYWNpdHk7XG4gICAgICAkbGFiZWwuc3R5bGUubW96VXNlclNlbGVjdCA9ICdub25lJztcbiAgICAgICRsYWJlbC5zdHlsZS53ZWJraXRVc2VyU2VsZWN0ID0gJ25vbmUnO1xuICAgICAgJGxhYmVsLnN0eWxlLnVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgICBcbiAgICAgICRsYWJlbC5zZXRBdHRyaWJ1dGVOUyhcblx0bnVsbCwgJ3RyYW5zZm9ybScsIGBtYXRyaXgoMSwgMCwgMCwgLTEsICR7eH0sICR7aH0pYFxuICAgICAgKTtcbiAgICAgIFxuICAgICAgbGV0IGxhYmVsID0gXCJcIjtcbiAgICAgIGlmIChmaXhlZCkge1xuXHRsYWJlbCA9IHZhbHVlLnRvRml4ZWQoZHApO1xuICAgICAgfSBlbHNlIHtcblx0bGFiZWwgPSB2YWx1ZS50b1ByZWNpc2lvbihzZik7XG4gICAgICB9XG5cbiAgICAgICRsYWJlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneScsIHkpO1xuICAgICAgY29uc3QgJHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShsYWJlbCk7XG4gICAgICAkbGFiZWwuYXBwZW5kQ2hpbGQoJHRleHQpO1xuXG4gICAgICB0aGlzLiRsYWJlbHMucHVzaCgkbGFiZWwpO1xuICAgICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQoJGxhYmVsKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGx4ID0gMjtcbiAgICBcbiAgICBsZXQgcHJldnkgPSBoICsgMjtcblx0XHRcdFx0ICAgIFxuICAgIGZvciAobGV0IGkgPSAwOyA7ICsraSkge1xuXG4gICAgICBsZXQgdmFsID0gY3kwICsgaSAqIGluYztcbiAgICAgIGlmICh2YWwgPj0gY3kxKSB7XG5cdGJyZWFrO1xuICAgICAgfVxuICAgICAgXG4gICAgICBsZXQgZGlzcHZhbCA9IE1hdGgucm91bmQodmFsIC8gcm91bmQpICogcm91bmQ7XG4gICAgICBsZXQgeSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKGRpc3B2YWwpO1xuXG4gICAgICBsZXQgbHkgPSBoIC0geSArIDM7XG5cbiAgICAgIGxldCBzaG93VGV4dCA9IHRydWU7XG4gICAgICBpZiAobHkgPiBoIC0gOCB8fCBseSA8IDggfHwgbHkgPiBwcmV2eSAtIDIwKSB7XG5cdC8vIG5vdCBlbm91Z2ggc3BhY2Vcblx0c2hvd1RleHQgPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgY29uc29sZS5sb2coXCJpID0gXCIgKyBpICsgXCIgLT4gdmFsID0gXCIgKyB2YWwgKyBcIiwgZGlzcHZhbCA9IFwiICsgZGlzcHZhbCArIFwiLCB5ID0gXCIgKyB5KTtcblxuICAgICAgaWYgKCFzaG93VGV4dCkge1xuXHRcblx0cGF0aCA9IHBhdGggKyBgTSR7c2NhbGVXaWR0aC01fSwke3l9TCR7c2NhbGVXaWR0aH0sJHt5fWA7XG5cbiAgICAgIH0gZWxzZSB7XG5cblx0cGF0aCA9IHBhdGggKyBgTSR7c2NhbGVXaWR0aC04fSwke3l9TCR7c2NhbGVXaWR0aH0sJHt5fWA7XG5cdHByZXZ5ID0gbHk7XG5cdGFkZExhYmVsKGRpc3B2YWwsIGx4LCBseSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy4kcGF0aC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZCcsIHBhdGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBzY2FsZSBjYW5ub3QgYmUgc2VsZWN0ZWQuXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IGZhbHNlXG4gICAqL1xuICBpbkFyZWEoKSB7IHJldHVybiBmYWxzZTsgfVxufVxuIl19