'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreLayer = require('../core/layer');

var _coreLayer2 = _interopRequireDefault(_coreLayer);

var _shapesCrosshairs = require('../shapes/crosshairs');

var _shapesCrosshairs2 = _interopRequireDefault(_shapesCrosshairs);

/**
 * Helper to create a crosshair layer that highlights the value
 * reported by an object's describe() method at a time set through the
 * currentPosition property. The describingObject must have a
 * describe(time) method that takes only a time and returns an array
 * of { cx, cy, unit }. An example of such a describingObject might be
 * another layer.
 *
 * [example usage](./examples/layer-highlight.html)
 */

var HighlightLayer = (function (_Layer) {
  _inherits(HighlightLayer, _Layer);

  /**
   * @param {Object} options - An object to configure the layer.
   */

  function HighlightLayer(describingObject) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, HighlightLayer);

    var defaults = {
      color: 'red',
      hittable: false };

    // kind of pass through layer
    var data = {
      currentPosition: 0,
      describing: describingObject,
      lastDescribedPosition: 0,
      lastDescription: null,
      describe: function describe() {
        var pos = this.currentPosition;
        if (pos !== this.lastDescribedPosition || this.lastDescription === null) {
          this.lastDescription = this.describing.describe(pos);
          this.lastDescribedPosition = pos;
          console.log("requesting new description for cx = " + pos);
        } else {
          console.log("reusing last description");
        }
        return this.lastDescription;
      }
    };

    options = _Object$assign(defaults, options);
    _get(Object.getPrototypeOf(HighlightLayer.prototype), 'constructor', this).call(this, 'entity', data, options);

    this.configureShape(_shapesCrosshairs2['default'], {
      // We have a choice here -- use the x coord of the nearest point
      // (the one that is also contributing its y coord) or use the x
      // coord of the probe point. The latter looks better when the
      // probe point is based on a cursor that is also displayed on
      // this track. But it's a bit of a lie. Let's do it anyway
      cx: function cx(d) {
        return d.currentPosition;
      },
      cy: function cy(d) {
        return d.describe()[0].cy;
      },
      unit: function unit(d) {
        return d.describe()[0].unit;
      }
    }, {
      color: options.color,
      opacity: options.opacity
    });
  }

  _createClass(HighlightLayer, [{
    key: 'currentPosition',
    set: function set(pos) {
      this.data[0].currentPosition = pos;
    },
    get: function get() {
      return this.data[0].currentPosition;
    }
  }]);

  return HighlightLayer;
})(_coreLayer2['default']);

exports['default'] = HighlightLayer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9oZWxwZXJzL2hpZ2hsaWdodC1sYXllci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7eUJBQWtCLGVBQWU7Ozs7Z0NBQ1Ysc0JBQXNCOzs7Ozs7Ozs7Ozs7Ozs7SUFZeEIsY0FBYztZQUFkLGNBQWM7Ozs7OztBQUl0QixXQUpRLGNBQWMsQ0FJckIsZ0JBQWdCLEVBQWdCO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFKdkIsY0FBYzs7QUFLL0IsUUFBTSxRQUFRLEdBQUc7QUFDZixXQUFLLEVBQUUsS0FBSztBQUNaLGNBQVEsRUFBRSxLQUFLLEVBQ2hCLENBQUM7OztBQUVGLFFBQU0sSUFBSSxHQUFHO0FBQ1gscUJBQWUsRUFBRSxDQUFDO0FBQ2xCLGdCQUFVLEVBQUUsZ0JBQWdCO0FBQzVCLDJCQUFxQixFQUFFLENBQUM7QUFDeEIscUJBQWUsRUFBRSxJQUFJO0FBQ3JCLGNBQVEsRUFBRSxvQkFBVztBQUNuQixZQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO0FBQy9CLFlBQUksR0FBRyxLQUFLLElBQUksQ0FBQyxxQkFBcUIsSUFBSSxJQUFJLENBQUMsZUFBZSxLQUFLLElBQUksRUFBRTtBQUN2RSxjQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3JELGNBQUksQ0FBQyxxQkFBcUIsR0FBRyxHQUFHLENBQUM7QUFDakMsaUJBQU8sQ0FBQyxHQUFHLENBQUMsc0NBQXNDLEdBQUcsR0FBRyxDQUFDLENBQUM7U0FDM0QsTUFBTTtBQUNMLGlCQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUM7U0FDekM7QUFDRCxlQUFPLElBQUksQ0FBQyxlQUFlLENBQUM7T0FDN0I7S0FDRixDQUFDOztBQUVGLFdBQU8sR0FBRyxlQUFjLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUMzQywrQkE3QmlCLGNBQWMsNkNBNkJ6QixRQUFRLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTs7QUFFL0IsUUFBSSxDQUFDLGNBQWMsZ0NBQWE7Ozs7OztBQU05QixRQUFFLEVBQUUsWUFBQyxDQUFDO2VBQUssQ0FBQyxDQUFDLGVBQWU7T0FBQTtBQUM1QixRQUFFLEVBQUUsWUFBQyxDQUFDO2VBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7T0FBQTtBQUM3QixVQUFJLEVBQUUsY0FBQyxDQUFDO2VBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7T0FBQTtLQUNsQyxFQUFFO0FBQ0QsV0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLO0FBQ3BCLGFBQU8sRUFBRSxPQUFPLENBQUMsT0FBTztLQUN6QixDQUFDLENBQUM7R0FDSjs7ZUE1Q2tCLGNBQWM7O1NBOENkLGFBQUMsR0FBRyxFQUFFO0FBQ3ZCLFVBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxHQUFHLEdBQUcsQ0FBQztLQUNwQztTQUVrQixlQUFHO0FBQ3BCLGFBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUM7S0FDckM7OztTQXBEa0IsY0FBYzs7O3FCQUFkLGNBQWMiLCJmaWxlIjoic3JjL2hlbHBlcnMvaGlnaGxpZ2h0LWxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExheWVyIGZyb20gJy4uL2NvcmUvbGF5ZXInO1xuaW1wb3J0IENyb3NzaGFpcnMgZnJvbSAnLi4vc2hhcGVzL2Nyb3NzaGFpcnMnO1xuXG4vKipcbiAqIEhlbHBlciB0byBjcmVhdGUgYSBjcm9zc2hhaXIgbGF5ZXIgdGhhdCBoaWdobGlnaHRzIHRoZSB2YWx1ZVxuICogcmVwb3J0ZWQgYnkgYW4gb2JqZWN0J3MgZGVzY3JpYmUoKSBtZXRob2QgYXQgYSB0aW1lIHNldCB0aHJvdWdoIHRoZVxuICogY3VycmVudFBvc2l0aW9uIHByb3BlcnR5LiBUaGUgZGVzY3JpYmluZ09iamVjdCBtdXN0IGhhdmUgYVxuICogZGVzY3JpYmUodGltZSkgbWV0aG9kIHRoYXQgdGFrZXMgb25seSBhIHRpbWUgYW5kIHJldHVybnMgYW4gYXJyYXlcbiAqIG9mIHsgY3gsIGN5LCB1bml0IH0uIEFuIGV4YW1wbGUgb2Ygc3VjaCBhIGRlc2NyaWJpbmdPYmplY3QgbWlnaHQgYmVcbiAqIGFub3RoZXIgbGF5ZXIuXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItaGlnaGxpZ2h0Lmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhpZ2hsaWdodExheWVyIGV4dGVuZHMgTGF5ZXIge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBBbiBvYmplY3QgdG8gY29uZmlndXJlIHRoZSBsYXllci5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGRlc2NyaWJpbmdPYmplY3QsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgY29sb3I6ICdyZWQnLFxuICAgICAgaGl0dGFibGU6IGZhbHNlLCAvLyBraW5kIG9mIHBhc3MgdGhyb3VnaCBsYXllclxuICAgIH07XG5cbiAgICBjb25zdCBkYXRhID0ge1xuICAgICAgY3VycmVudFBvc2l0aW9uOiAwLFxuICAgICAgZGVzY3JpYmluZzogZGVzY3JpYmluZ09iamVjdCxcbiAgICAgIGxhc3REZXNjcmliZWRQb3NpdGlvbjogMCxcbiAgICAgIGxhc3REZXNjcmlwdGlvbjogbnVsbCxcbiAgICAgIGRlc2NyaWJlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IHBvcyA9IHRoaXMuY3VycmVudFBvc2l0aW9uO1xuICAgICAgICBpZiAocG9zICE9PSB0aGlzLmxhc3REZXNjcmliZWRQb3NpdGlvbiB8fCB0aGlzLmxhc3REZXNjcmlwdGlvbiA9PT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMubGFzdERlc2NyaXB0aW9uID0gdGhpcy5kZXNjcmliaW5nLmRlc2NyaWJlKHBvcyk7XG4gICAgICAgICAgdGhpcy5sYXN0RGVzY3JpYmVkUG9zaXRpb24gPSBwb3M7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJyZXF1ZXN0aW5nIG5ldyBkZXNjcmlwdGlvbiBmb3IgY3ggPSBcIiArIHBvcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJyZXVzaW5nIGxhc3QgZGVzY3JpcHRpb25cIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMubGFzdERlc2NyaXB0aW9uO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgc3VwZXIoJ2VudGl0eScsIGRhdGEsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb25maWd1cmVTaGFwZShDcm9zc2hhaXJzLCB7XG4gICAgICAvLyBXZSBoYXZlIGEgY2hvaWNlIGhlcmUgLS0gdXNlIHRoZSB4IGNvb3JkIG9mIHRoZSBuZWFyZXN0IHBvaW50XG4gICAgICAvLyAodGhlIG9uZSB0aGF0IGlzIGFsc28gY29udHJpYnV0aW5nIGl0cyB5IGNvb3JkKSBvciB1c2UgdGhlIHhcbiAgICAgIC8vIGNvb3JkIG9mIHRoZSBwcm9iZSBwb2ludC4gVGhlIGxhdHRlciBsb29rcyBiZXR0ZXIgd2hlbiB0aGVcbiAgICAgIC8vIHByb2JlIHBvaW50IGlzIGJhc2VkIG9uIGEgY3Vyc29yIHRoYXQgaXMgYWxzbyBkaXNwbGF5ZWQgb25cbiAgICAgIC8vIHRoaXMgdHJhY2suIEJ1dCBpdCdzIGEgYml0IG9mIGEgbGllLiBMZXQncyBkbyBpdCBhbnl3YXlcbiAgICAgIGN4OiAoZCkgPT4gZC5jdXJyZW50UG9zaXRpb24sXG4gICAgICBjeTogKGQpID0+IGQuZGVzY3JpYmUoKVswXS5jeSxcbiAgICAgIHVuaXQ6IChkKSA9PiBkLmRlc2NyaWJlKClbMF0udW5pdFxuICAgIH0sIHtcbiAgICAgIGNvbG9yOiBvcHRpb25zLmNvbG9yLFxuICAgICAgb3BhY2l0eTogb3B0aW9ucy5vcGFjaXR5XG4gICAgfSk7XG4gIH1cblxuICBzZXQgY3VycmVudFBvc2l0aW9uKHBvcykge1xuICAgIHRoaXMuZGF0YVswXS5jdXJyZW50UG9zaXRpb24gPSBwb3M7XG4gIH1cblxuICBnZXQgY3VycmVudFBvc2l0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFbMF0uY3VycmVudFBvc2l0aW9uO1xuICB9XG59XG4iXX0=