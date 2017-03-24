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

/**
 * Kind of Marker for entity oriented data. Useful to display a grid.
 */

var Ticks = (function (_BaseShape) {
  _inherits(Ticks, _BaseShape);

  function Ticks() {
    _classCallCheck(this, Ticks);

    _get(Object.getPrototypeOf(Ticks.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Ticks, [{
    key: '_getClassName',
    value: function _getClassName() {
      return 'tick';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return { time: 0, focused: true, label: '' };
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {
        color: 'steelblue',
        focusedOpacity: 0.8,
        defaultOpacity: 0.3,
        labelPosition: 'top',
        shadeSegments: false,
        unconstrained: false // indicates we should always update all
        // ticks that exist, as the layer is
        // handling tick generation dynamically
        // (e.g. in axis layer)
      };
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      if (this.$el) {
        return this.$el;
      }

      this.$el = document.createElementNS(this.ns, 'g');

      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, data) {

      var before = performance.now();

      while (this.$el.firstChild) {
        this.$el.removeChild(this.$el.firstChild);
      }

      var ticks = document.createElementNS(this.ns, 'path');
      ticks.setAttributeNS(null, 'fill', 'none');
      ticks.setAttributeNS(null, 'shape-rendering', 'crispEdges');
      ticks.setAttributeNS(null, 'stroke', this.params.color);
      ticks.setAttributeNS(null, 'stroke-width', 2);
      ticks.style.opacity = this.params.opacity;

      this.$el.appendChild(ticks);

      var height = renderingContext.height;

      var instructions = [];

      var n = data.length;

      if (n > 0) {

        var nextX = renderingContext.timeToPixel(this.time(data[0]));
        var oddTick = false;
        var firstTick = true;

        var segmentOpacity = function segmentOpacity(odd) {
          return odd ? 0.1 : 0.05;
        };

        for (var i = 0; i < n; ++i) {

          var datum = data[i];
          var x = nextX;
          var lastTick = i + 1 >= n;
          oddTick = !oddTick;

          if (!lastTick) {
            nextX = renderingContext.timeToPixel(this.time(data[i + 1]));
          }
          if (!this.params.unconstrained) {
            if (x < renderingContext.minX) {
              continue;
            }
            if (!lastTick && Math.floor(nextX) === Math.floor(x)) {
              continue;
            }
          }

          var opacity = this.focused(datum) ? this.params.focusedOpacity : this.params.defaultOpacity;

          instructions.push('M' + x + ',0L' + x + ',' + height);

          if (this.params.shadeSegments) {
            if (firstTick) {
              if (x > renderingContext.minX) {
                var segment = document.createElementNS(this.ns, 'rect');
                segment.setAttributeNS(null, 'width', x - renderingContext.minX);
                segment.setAttributeNS(null, 'height', height);
                segment.setAttributeNS(null, 'fill', this.params.color);
                segment.setAttributeNS(null, 'opacity', segmentOpacity(!oddTick));
                segment.setAttributeNS(null, 'transform', 'translate(' + renderingContext.minX + ', 0)');
                this.$el.appendChild(segment);
              }
            }
            if (lastTick || nextX > x + 1) {
              var segment = document.createElementNS(this.ns, 'rect');
              segment.setAttributeNS(null, 'width', lastTick ? '100%' : nextX - x);
              segment.setAttributeNS(null, 'height', height);
              segment.setAttributeNS(null, 'fill', this.params.color);
              segment.setAttributeNS(null, 'opacity', segmentOpacity(oddTick));
              segment.setAttributeNS(null, 'transform', 'translate(' + x + ', 0)');
              this.$el.appendChild(segment);
            }
          }

          var label = this.label(datum);

          if (label && label !== "") {

            // find the next label -- we only need enough space between
            // this tick and that one, not necessarily between this and
            // its (possibly unlabelled) neighbour

            var nextLabelX = x - 1;
            for (var j = i + 1; j < n; ++j) {
              var nextLabel = this.label(data[j]);
              if (nextLabel && nextLabel !== "") {
                nextLabelX = renderingContext.timeToPixel(this.time(data[j]));
                break;
              }
            }

            var estWidth = label.length * 6;
            var enoughSpaceForLabel = nextLabelX < x || x + estWidth < nextLabelX;

            if (enoughSpaceForLabel) {

              var $label = document.createElementNS(this.ns, 'text');
              $label.classList.add('label');
              var $text = document.createTextNode(label);

              $label.appendChild($text);
              $label.setAttributeNS(null, 'transform', 'matrix(1, 0, 0, -1, ' + (x + 2) + ', ' + (height + 2) + ')');
              // firefox problem here
              // $label.setAttributeNS(null, 'alignment-baseline', 'text-before-edge');

              if (this.params.labelPosition === 'bottom') {
                $label.setAttributeNS(null, 'y', height);
              } else {
                $label.setAttributeNS(null, 'y', '10');
              }

              $label.style.fontSize = '10px';
              $label.style.lineHeight = '10px';
              $label.style.fontFamily = 'monospace';
              $label.style.color = '#676767';
              $label.style.opacity = 0.9;
              $label.style.mozUserSelect = 'none';
              $label.style.webkitUserSelect = 'none';
              $label.style.userSelect = 'none';
              /*
                          const bg = document.createElementNS(this.ns, 'rect');
                          bg.setAttributeNS(null, 'width', '100%');
                          bg.setAttributeNS(null, 'height', '100%');
                          bg.setAttributeNS(null, 'fill', '#ffffff');
                          $label.appendChild(bg);
              */
              this.$el.appendChild($label);
            }
          }

          if (!this.params.unconstrained) {
            if (nextX > renderingContext.maxX) {
              break;
            }
          }

          firstTick = false;
        }
      }

      var d = instructions.join('');
      ticks.setAttributeNS(null, 'd', d);

      var after = performance.now();
      console.log("ticks update time = " + Math.round(after - before) + "ms");
    }
  }]);

  return Ticks;
})(_baseShape2['default']);

exports['default'] = Ticks;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LEtBQUssR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUU7QUFDakMsb0JBQU07YUFDUDtXQUNGOztBQUVELG1CQUFTLEdBQUcsS0FBSyxDQUFDO1NBQ25CO09BQ0Y7O0FBRUQsVUFBTSxDQUFDLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNoQyxXQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRW5DLFVBQU0sS0FBSyxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNoQyxhQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO0tBQ3pFOzs7U0FwTGtCLEtBQUs7OztxQkFBTCxLQUFLIiwiZmlsZSI6InNyYy9zaGFwZXMvdGlja3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vYmFzZS1zaGFwZSc7XG5cbi8qKlxuICogS2luZCBvZiBNYXJrZXIgZm9yIGVudGl0eSBvcmllbnRlZCBkYXRhLiBVc2VmdWwgdG8gZGlzcGxheSBhIGdyaWQuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpY2tzIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgX2dldENsYXNzTmFtZSgpIHtcbiAgICByZXR1cm4gJ3RpY2snO1xuICB9XG5cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICByZXR1cm4geyB0aW1lOiAwLCBmb2N1c2VkOiB0cnVlLCBsYWJlbDogJycgfTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29sb3I6ICdzdGVlbGJsdWUnLFxuICAgICAgZm9jdXNlZE9wYWNpdHk6IDAuOCxcbiAgICAgIGRlZmF1bHRPcGFjaXR5OiAwLjMsXG4gICAgICBsYWJlbFBvc2l0aW9uOiAndG9wJyxcbiAgICAgIHNoYWRlU2VnbWVudHM6IGZhbHNlLFxuICAgICAgdW5jb25zdHJhaW5lZDogZmFsc2UgLy8gaW5kaWNhdGVzIHdlIHNob3VsZCBhbHdheXMgdXBkYXRlIGFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGlja3MgdGhhdCBleGlzdCwgYXMgdGhlIGxheWVyIGlzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBoYW5kbGluZyB0aWNrIGdlbmVyYXRpb24gZHluYW1pY2FsbHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIChlLmcuIGluIGF4aXMgbGF5ZXIpXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgaWYgKHRoaXMuJGVsKSB7IHJldHVybiB0aGlzLiRlbDsgfVxuICAgIFxuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdnJyk7XG4gICAgXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdGEpIHtcblxuICAgIGNvbnN0IGJlZm9yZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gICAgd2hpbGUgKHRoaXMuJGVsLmZpcnN0Q2hpbGQpIHtcbiAgICAgIHRoaXMuJGVsLnJlbW92ZUNoaWxkKHRoaXMuJGVsLmZpcnN0Q2hpbGQpO1xuICAgIH1cblxuICAgIGNvbnN0IHRpY2tzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdwYXRoJyk7XG4gICAgdGlja3Muc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCAnbm9uZScpO1xuICAgIHRpY2tzLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuICAgIHRpY2tzLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2UnLCB0aGlzLnBhcmFtcy5jb2xvcik7XG4gICAgdGlja3Muc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZS13aWR0aCcsIDIpO1xuICAgIHRpY2tzLnN0eWxlLm9wYWNpdHkgPSB0aGlzLnBhcmFtcy5vcGFjaXR5O1xuXG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGlja3MpO1xuXG4gICAgY29uc3QgaGVpZ2h0ID0gcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQ7XG5cbiAgICBsZXQgaW5zdHJ1Y3Rpb25zID0gW107XG5cbiAgICBjb25zdCBuID0gZGF0YS5sZW5ndGg7XG4gICAgXG4gICAgaWYgKG4gPiAwKSB7XG4gICAgICBcbiAgICAgIGxldCBuZXh0WCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy50aW1lKGRhdGFbMF0pKTtcbiAgICAgIGxldCBvZGRUaWNrID0gZmFsc2U7XG4gICAgICBsZXQgZmlyc3RUaWNrID0gdHJ1ZTtcblxuICAgICAgY29uc3Qgc2VnbWVudE9wYWNpdHkgPSAob2RkID0+IHsgcmV0dXJuIG9kZCA/IDAuMSA6IDAuMDU7IH0pO1xuICAgICAgXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG47ICsraSkge1xuXG4gICAgICAgIGNvbnN0IGRhdHVtID0gZGF0YVtpXTtcbiAgICAgICAgY29uc3QgeCA9IG5leHRYO1xuICAgICAgICBjb25zdCBsYXN0VGljayA9IChpICsgMSA+PSBuKTtcbiAgICAgICAgb2RkVGljayA9ICFvZGRUaWNrO1xuXG4gICAgICAgIGlmICghbGFzdFRpY2spIHtcbiAgICAgICAgICBuZXh0WCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy50aW1lKGRhdGFbaSsxXSkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5wYXJhbXMudW5jb25zdHJhaW5lZCkge1xuICAgICAgICAgIGlmICh4IDwgcmVuZGVyaW5nQ29udGV4dC5taW5YKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFsYXN0VGljayAmJiAoTWF0aC5mbG9vcihuZXh0WCkgPT09IE1hdGguZmxvb3IoeCkpKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGNvbnN0IG9wYWNpdHkgPSB0aGlzLmZvY3VzZWQoZGF0dW0pID9cbiAgICAgICAgICAgICAgdGhpcy5wYXJhbXMuZm9jdXNlZE9wYWNpdHkgOiB0aGlzLnBhcmFtcy5kZWZhdWx0T3BhY2l0eTtcblxuICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChgTSR7eH0sMEwke3h9LCR7aGVpZ2h0fWApO1xuXG4gICAgICAgIGlmICh0aGlzLnBhcmFtcy5zaGFkZVNlZ21lbnRzKSB7XG4gICAgICAgICAgaWYgKGZpcnN0VGljaykge1xuICAgICAgICAgICAgaWYgKHggPiByZW5kZXJpbmdDb250ZXh0Lm1pblgpIHtcbiAgICAgICAgICAgICAgY29uc3Qgc2VnbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncmVjdCcpO1xuICAgICAgICAgICAgICBzZWdtZW50LnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHggLSByZW5kZXJpbmdDb250ZXh0Lm1pblgpO1xuICAgICAgICAgICAgICBzZWdtZW50LnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBoZWlnaHQpO1xuICAgICAgICAgICAgICBzZWdtZW50LnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgdGhpcy5wYXJhbXMuY29sb3IpO1xuICAgICAgICAgICAgICBzZWdtZW50LnNldEF0dHJpYnV0ZU5TKG51bGwsICdvcGFjaXR5Jywgc2VnbWVudE9wYWNpdHkoIW9kZFRpY2spKTtcbiAgICAgICAgICAgICAgc2VnbWVudC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke3JlbmRlcmluZ0NvbnRleHQubWluWH0sIDApYCk7XG4gICAgICAgICAgICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHNlZ21lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAobGFzdFRpY2sgfHwgbmV4dFggPiB4ICsgMSkge1xuICAgICAgICAgICAgY29uc3Qgc2VnbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncmVjdCcpO1xuICAgICAgICAgICAgc2VnbWVudC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCBsYXN0VGljayA/ICcxMDAlJyA6IChuZXh0WCAtIHgpKTtcbiAgICAgICAgICAgIHNlZ21lbnQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIGhlaWdodCk7XG4gICAgICAgICAgICBzZWdtZW50LnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgdGhpcy5wYXJhbXMuY29sb3IpO1xuICAgICAgICAgICAgc2VnbWVudC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnb3BhY2l0eScsIHNlZ21lbnRPcGFjaXR5KG9kZFRpY2spKTtcbiAgICAgICAgICAgIHNlZ21lbnQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHt4fSwgMClgKTtcbiAgICAgICAgICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHNlZ21lbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgY29uc3QgbGFiZWwgPSB0aGlzLmxhYmVsKGRhdHVtKTtcblxuICAgICAgICBpZiAobGFiZWwgJiYgbGFiZWwgIT09IFwiXCIpIHtcblxuICAgICAgICAgIC8vIGZpbmQgdGhlIG5leHQgbGFiZWwgLS0gd2Ugb25seSBuZWVkIGVub3VnaCBzcGFjZSBiZXR3ZWVuXG4gICAgICAgICAgLy8gdGhpcyB0aWNrIGFuZCB0aGF0IG9uZSwgbm90IG5lY2Vzc2FyaWx5IGJldHdlZW4gdGhpcyBhbmRcbiAgICAgICAgICAvLyBpdHMgKHBvc3NpYmx5IHVubGFiZWxsZWQpIG5laWdoYm91clxuXG4gICAgICAgICAgbGV0IG5leHRMYWJlbFggPSB4IC0gMTtcbiAgICAgICAgICBmb3IgKGxldCBqID0gaSArIDE7IGogPCBuOyArK2opIHtcbiAgICAgICAgICAgIGNvbnN0IG5leHRMYWJlbCA9IHRoaXMubGFiZWwoZGF0YVtqXSk7XG4gICAgICAgICAgICBpZiAobmV4dExhYmVsICYmIG5leHRMYWJlbCAhPT0gXCJcIikge1xuICAgICAgICAgICAgICBuZXh0TGFiZWxYID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLnRpbWUoZGF0YVtqXSkpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgY29uc3QgZXN0V2lkdGggPSBsYWJlbC5sZW5ndGggKiA2O1xuICAgICAgICAgIGNvbnN0IGVub3VnaFNwYWNlRm9yTGFiZWwgPSAobmV4dExhYmVsWCA8IHggfHwgeCArIGVzdFdpZHRoIDwgbmV4dExhYmVsWCk7XG5cbiAgICAgICAgICBpZiAoZW5vdWdoU3BhY2VGb3JMYWJlbCkge1xuICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgJGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICd0ZXh0Jyk7XG4gICAgICAgICAgICAkbGFiZWwuY2xhc3NMaXN0LmFkZCgnbGFiZWwnKTtcbiAgICAgICAgICAgIGNvbnN0ICR0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobGFiZWwpO1xuXG4gICAgICAgICAgICAkbGFiZWwuYXBwZW5kQ2hpbGQoJHRleHQpO1xuICAgICAgICAgICAgJGxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgbWF0cml4KDEsIDAsIDAsIC0xLCAke3ggKyAyfSwgJHtoZWlnaHQgKyAyfSlgKTtcbiAgICAgICAgICAgIC8vIGZpcmVmb3ggcHJvYmxlbSBoZXJlXG4gICAgICAgICAgICAvLyAkbGFiZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2FsaWdubWVudC1iYXNlbGluZScsICd0ZXh0LWJlZm9yZS1lZGdlJyk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnBhcmFtcy5sYWJlbFBvc2l0aW9uID09PSAnYm90dG9tJykge1xuICAgICAgICAgICAgICAkbGFiZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3knLCBoZWlnaHQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgJGxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5JywgJzEwJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRsYWJlbC5zdHlsZS5mb250U2l6ZSA9ICcxMHB4JztcbiAgICAgICAgICAgICRsYWJlbC5zdHlsZS5saW5lSGVpZ2h0ID0gJzEwcHgnO1xuICAgICAgICAgICAgJGxhYmVsLnN0eWxlLmZvbnRGYW1pbHkgPSAnbW9ub3NwYWNlJztcbiAgICAgICAgICAgICRsYWJlbC5zdHlsZS5jb2xvciA9ICcjNjc2NzY3JztcbiAgICAgICAgICAgICRsYWJlbC5zdHlsZS5vcGFjaXR5ID0gMC45O1xuICAgICAgICAgICAgJGxhYmVsLnN0eWxlLm1velVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgICAgICAgICAkbGFiZWwuc3R5bGUud2Via2l0VXNlclNlbGVjdCA9ICdub25lJztcbiAgICAgICAgICAgICRsYWJlbC5zdHlsZS51c2VyU2VsZWN0ID0gJ25vbmUnO1xuLypcbiAgICAgICAgICAgIGNvbnN0IGJnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdyZWN0Jyk7XG4gICAgICAgICAgICBiZy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCAnMTAwJScpO1xuICAgICAgICAgICAgYmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsICcxMDAlJyk7XG4gICAgICAgICAgICBiZy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsICcjZmZmZmZmJyk7XG4gICAgICAgICAgICAkbGFiZWwuYXBwZW5kQ2hpbGQoYmcpO1xuKi9cbiAgICAgICAgICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKCRsYWJlbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLnBhcmFtcy51bmNvbnN0cmFpbmVkKSB7XG4gICAgICAgICAgaWYgKG5leHRYID4gcmVuZGVyaW5nQ29udGV4dC5tYXhYKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGZpcnN0VGljayA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGQgPSBpbnN0cnVjdGlvbnMuam9pbignJyk7XG4gICAgdGlja3Muc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLCBkKTtcblxuICAgIGNvbnN0IGFmdGVyID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgY29uc29sZS5sb2coXCJ0aWNrcyB1cGRhdGUgdGltZSA9IFwiICsgTWF0aC5yb3VuZChhZnRlciAtIGJlZm9yZSkgKyBcIm1zXCIpO1xuICB9XG59XG4iXX0=