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
      labelOffset: 0,
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
      opacity: options.opacity,
      labelOffset: options.labelOffset
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9oZWxwZXJzL2hpZ2hsaWdodC1sYXllci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7eUJBQWtCLGVBQWU7Ozs7Z0NBQ1Ysc0JBQXNCOzs7Ozs7Ozs7Ozs7Ozs7SUFZeEIsY0FBYztZQUFkLGNBQWM7Ozs7OztBQUl0QixXQUpRLGNBQWMsQ0FJckIsZ0JBQWdCLEVBQWdCO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFKdkIsY0FBYzs7QUFLL0IsUUFBTSxRQUFRLEdBQUc7QUFDZixXQUFLLEVBQUUsS0FBSztBQUNaLGlCQUFXLEVBQUUsQ0FBQztBQUNkLGNBQVEsRUFBRSxLQUFLLEVBQ2hCLENBQUM7OztBQUVGLFFBQU0sSUFBSSxHQUFHO0FBQ1gscUJBQWUsRUFBRSxDQUFDO0FBQ2xCLGdCQUFVLEVBQUUsZ0JBQWdCO0FBQzVCLDJCQUFxQixFQUFFLENBQUM7QUFDeEIscUJBQWUsRUFBRSxJQUFJO0FBQ3JCLGNBQVEsRUFBRSxvQkFBVztBQUNuQixZQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO0FBQy9CLFlBQUksR0FBRyxLQUFLLElBQUksQ0FBQyxxQkFBcUIsSUFBSSxJQUFJLENBQUMsZUFBZSxLQUFLLElBQUksRUFBRTtBQUN2RSxjQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3JELGNBQUksQ0FBQyxxQkFBcUIsR0FBRyxHQUFHLENBQUM7QUFDakMsaUJBQU8sQ0FBQyxHQUFHLENBQUMsc0NBQXNDLEdBQUcsR0FBRyxDQUFDLENBQUM7U0FDM0QsTUFBTTtBQUNMLGlCQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUM7U0FDekM7QUFDRCxlQUFPLElBQUksQ0FBQyxlQUFlLENBQUM7T0FDN0I7S0FDRixDQUFDOztBQUVGLFdBQU8sR0FBRyxlQUFjLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUMzQywrQkE5QmlCLGNBQWMsNkNBOEJ6QixRQUFRLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTs7QUFFL0IsUUFBSSxDQUFDLGNBQWMsZ0NBQWE7Ozs7OztBQU05QixRQUFFLEVBQUUsWUFBQyxDQUFDO2VBQUssQ0FBQyxDQUFDLGVBQWU7T0FBQTtBQUM1QixRQUFFLEVBQUUsWUFBQyxDQUFDO2VBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7T0FBQTtBQUM3QixVQUFJLEVBQUUsY0FBQyxDQUFDO2VBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7T0FBQTtLQUNsQyxFQUFFO0FBQ0QsV0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLO0FBQ3BCLGFBQU8sRUFBRSxPQUFPLENBQUMsT0FBTztBQUN4QixpQkFBVyxFQUFFLE9BQU8sQ0FBQyxXQUFXO0tBQ2pDLENBQUMsQ0FBQztHQUNKOztlQTlDa0IsY0FBYzs7U0FnRGQsYUFBQyxHQUFHLEVBQUU7QUFDdkIsVUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEdBQUcsR0FBRyxDQUFDO0tBQ3BDO1NBRWtCLGVBQUc7QUFDcEIsYUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQztLQUNyQzs7O1NBdERrQixjQUFjOzs7cUJBQWQsY0FBYyIsImZpbGUiOiJzcmMvaGVscGVycy9oaWdobGlnaHQtbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5pbXBvcnQgQ3Jvc3NoYWlycyBmcm9tICcuLi9zaGFwZXMvY3Jvc3NoYWlycyc7XG5cbi8qKlxuICogSGVscGVyIHRvIGNyZWF0ZSBhIGNyb3NzaGFpciBsYXllciB0aGF0IGhpZ2hsaWdodHMgdGhlIHZhbHVlXG4gKiByZXBvcnRlZCBieSBhbiBvYmplY3QncyBkZXNjcmliZSgpIG1ldGhvZCBhdCBhIHRpbWUgc2V0IHRocm91Z2ggdGhlXG4gKiBjdXJyZW50UG9zaXRpb24gcHJvcGVydHkuIFRoZSBkZXNjcmliaW5nT2JqZWN0IG11c3QgaGF2ZSBhXG4gKiBkZXNjcmliZSh0aW1lKSBtZXRob2QgdGhhdCB0YWtlcyBvbmx5IGEgdGltZSBhbmQgcmV0dXJucyBhbiBhcnJheVxuICogb2YgeyBjeCwgY3ksIHVuaXQgfS4gQW4gZXhhbXBsZSBvZiBzdWNoIGEgZGVzY3JpYmluZ09iamVjdCBtaWdodCBiZVxuICogYW5vdGhlciBsYXllci5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1oaWdobGlnaHQuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGlnaGxpZ2h0TGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEFuIG9iamVjdCB0byBjb25maWd1cmUgdGhlIGxheWVyLlxuICAgKi9cbiAgY29uc3RydWN0b3IoZGVzY3JpYmluZ09iamVjdCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBjb2xvcjogJ3JlZCcsXG4gICAgICBsYWJlbE9mZnNldDogMCxcbiAgICAgIGhpdHRhYmxlOiBmYWxzZSwgLy8ga2luZCBvZiBwYXNzIHRocm91Z2ggbGF5ZXJcbiAgICB9O1xuXG4gICAgY29uc3QgZGF0YSA9IHtcbiAgICAgIGN1cnJlbnRQb3NpdGlvbjogMCxcbiAgICAgIGRlc2NyaWJpbmc6IGRlc2NyaWJpbmdPYmplY3QsXG4gICAgICBsYXN0RGVzY3JpYmVkUG9zaXRpb246IDAsXG4gICAgICBsYXN0RGVzY3JpcHRpb246IG51bGwsXG4gICAgICBkZXNjcmliZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBwb3MgPSB0aGlzLmN1cnJlbnRQb3NpdGlvbjtcbiAgICAgICAgaWYgKHBvcyAhPT0gdGhpcy5sYXN0RGVzY3JpYmVkUG9zaXRpb24gfHwgdGhpcy5sYXN0RGVzY3JpcHRpb24gPT09IG51bGwpIHtcbiAgICAgICAgICB0aGlzLmxhc3REZXNjcmlwdGlvbiA9IHRoaXMuZGVzY3JpYmluZy5kZXNjcmliZShwb3MpO1xuICAgICAgICAgIHRoaXMubGFzdERlc2NyaWJlZFBvc2l0aW9uID0gcG9zO1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVxdWVzdGluZyBuZXcgZGVzY3JpcHRpb24gZm9yIGN4ID0gXCIgKyBwb3MpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwicmV1c2luZyBsYXN0IGRlc2NyaXB0aW9uXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmxhc3REZXNjcmlwdGlvbjtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgIHN1cGVyKCdlbnRpdHknLCBkYXRhLCBvcHRpb25zKTtcblxuICAgIHRoaXMuY29uZmlndXJlU2hhcGUoQ3Jvc3NoYWlycywge1xuICAgICAgLy8gV2UgaGF2ZSBhIGNob2ljZSBoZXJlIC0tIHVzZSB0aGUgeCBjb29yZCBvZiB0aGUgbmVhcmVzdCBwb2ludFxuICAgICAgLy8gKHRoZSBvbmUgdGhhdCBpcyBhbHNvIGNvbnRyaWJ1dGluZyBpdHMgeSBjb29yZCkgb3IgdXNlIHRoZSB4XG4gICAgICAvLyBjb29yZCBvZiB0aGUgcHJvYmUgcG9pbnQuIFRoZSBsYXR0ZXIgbG9va3MgYmV0dGVyIHdoZW4gdGhlXG4gICAgICAvLyBwcm9iZSBwb2ludCBpcyBiYXNlZCBvbiBhIGN1cnNvciB0aGF0IGlzIGFsc28gZGlzcGxheWVkIG9uXG4gICAgICAvLyB0aGlzIHRyYWNrLiBCdXQgaXQncyBhIGJpdCBvZiBhIGxpZS4gTGV0J3MgZG8gaXQgYW55d2F5XG4gICAgICBjeDogKGQpID0+IGQuY3VycmVudFBvc2l0aW9uLFxuICAgICAgY3k6IChkKSA9PiBkLmRlc2NyaWJlKClbMF0uY3ksXG4gICAgICB1bml0OiAoZCkgPT4gZC5kZXNjcmliZSgpWzBdLnVuaXRcbiAgICB9LCB7XG4gICAgICBjb2xvcjogb3B0aW9ucy5jb2xvcixcbiAgICAgIG9wYWNpdHk6IG9wdGlvbnMub3BhY2l0eSxcbiAgICAgIGxhYmVsT2Zmc2V0OiBvcHRpb25zLmxhYmVsT2Zmc2V0XG4gICAgfSk7XG4gIH1cblxuICBzZXQgY3VycmVudFBvc2l0aW9uKHBvcykge1xuICAgIHRoaXMuZGF0YVswXS5jdXJyZW50UG9zaXRpb24gPSBwb3M7XG4gIH1cblxuICBnZXQgY3VycmVudFBvc2l0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFbMF0uY3VycmVudFBvc2l0aW9uO1xuICB9XG59XG4iXX0=