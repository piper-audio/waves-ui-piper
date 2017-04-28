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
 * describe(time) method that takes only a time and returns only a
 * value. An example of such an object might be another layer.
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
      cx: function cx(d) {
        return d.currentPosition;
      },
      cy: function cy(d) {
        return d.describe()[0].cy;
      },
      value: function value(d) {
        return d.describe()[0].value;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9oZWxwZXJzL2hpZ2hsaWdodC1sYXllci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7eUJBQWtCLGVBQWU7Ozs7Z0NBQ1Ysc0JBQXNCOzs7Ozs7Ozs7Ozs7OztJQVd4QixjQUFjO1lBQWQsY0FBYzs7Ozs7O0FBSXRCLFdBSlEsY0FBYyxDQUlyQixnQkFBZ0IsRUFBZ0I7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQUp2QixjQUFjOztBQUsvQixRQUFNLFFBQVEsR0FBRztBQUNmLFdBQUssRUFBRSxLQUFLO0FBQ1osY0FBUSxFQUFFLEtBQUssRUFDaEIsQ0FBQzs7O0FBRUYsUUFBTSxJQUFJLEdBQUc7QUFDWCxxQkFBZSxFQUFFLENBQUM7QUFDbEIsZ0JBQVUsRUFBRSxnQkFBZ0I7QUFDNUIsMkJBQXFCLEVBQUUsQ0FBQztBQUN4QixxQkFBZSxFQUFFLElBQUk7QUFDckIsY0FBUSxFQUFFLG9CQUFXO0FBQ25CLFlBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7QUFDL0IsWUFBSSxHQUFHLEtBQUssSUFBSSxDQUFDLHFCQUFxQixJQUFJLElBQUksQ0FBQyxlQUFlLEtBQUssSUFBSSxFQUFFO0FBQ3ZFLGNBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDckQsY0FBSSxDQUFDLHFCQUFxQixHQUFHLEdBQUcsQ0FBQztBQUNqQyxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxzQ0FBc0MsR0FBRyxHQUFHLENBQUMsQ0FBQztTQUMzRCxNQUFNO0FBQ0wsaUJBQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsQ0FBQztTQUN6QztBQUNELGVBQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQztPQUM3QjtLQUNGLENBQUM7O0FBRUYsV0FBTyxHQUFHLGVBQWMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzNDLCtCQTdCaUIsY0FBYyw2Q0E2QnpCLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFOztBQUUvQixRQUFJLENBQUMsY0FBYyxnQ0FBYTtBQUM5QixRQUFFLEVBQUUsWUFBQyxDQUFDO2VBQUssQ0FBQyxDQUFDLGVBQWU7T0FBQTtBQUM1QixRQUFFLEVBQUUsWUFBQyxDQUFDO2VBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7T0FBQTtBQUM3QixXQUFLLEVBQUUsZUFBQyxDQUFDO2VBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUs7T0FBQTtBQUNuQyxVQUFJLEVBQUUsY0FBQyxDQUFDO2VBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7T0FBQTtLQUNsQyxFQUFFO0FBQ0QsV0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLO0FBQ3BCLGFBQU8sRUFBRSxPQUFPLENBQUMsT0FBTztLQUN6QixDQUFDLENBQUM7R0FDSjs7ZUF4Q2tCLGNBQWM7O1NBMENkLGFBQUMsR0FBRyxFQUFFO0FBQ3ZCLFVBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxHQUFHLEdBQUcsQ0FBQztLQUNwQztTQUVrQixlQUFHO0FBQ3BCLGFBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUM7S0FDckM7OztTQWhEa0IsY0FBYzs7O3FCQUFkLGNBQWMiLCJmaWxlIjoic3JjL2hlbHBlcnMvaGlnaGxpZ2h0LWxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExheWVyIGZyb20gJy4uL2NvcmUvbGF5ZXInO1xuaW1wb3J0IENyb3NzaGFpcnMgZnJvbSAnLi4vc2hhcGVzL2Nyb3NzaGFpcnMnO1xuXG4vKipcbiAqIEhlbHBlciB0byBjcmVhdGUgYSBjcm9zc2hhaXIgbGF5ZXIgdGhhdCBoaWdobGlnaHRzIHRoZSB2YWx1ZVxuICogcmVwb3J0ZWQgYnkgYW4gb2JqZWN0J3MgZGVzY3JpYmUoKSBtZXRob2QgYXQgYSB0aW1lIHNldCB0aHJvdWdoIHRoZVxuICogY3VycmVudFBvc2l0aW9uIHByb3BlcnR5LiBUaGUgZGVzY3JpYmluZ09iamVjdCBtdXN0IGhhdmUgYVxuICogZGVzY3JpYmUodGltZSkgbWV0aG9kIHRoYXQgdGFrZXMgb25seSBhIHRpbWUgYW5kIHJldHVybnMgb25seSBhXG4gKiB2YWx1ZS4gQW4gZXhhbXBsZSBvZiBzdWNoIGFuIG9iamVjdCBtaWdodCBiZSBhbm90aGVyIGxheWVyLlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLWhpZ2hsaWdodC5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIaWdobGlnaHRMYXllciBleHRlbmRzIExheWVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gQW4gb2JqZWN0IHRvIGNvbmZpZ3VyZSB0aGUgbGF5ZXIuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihkZXNjcmliaW5nT2JqZWN0LCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGNvbG9yOiAncmVkJyxcbiAgICAgIGhpdHRhYmxlOiBmYWxzZSwgLy8ga2luZCBvZiBwYXNzIHRocm91Z2ggbGF5ZXJcbiAgICB9O1xuXG4gICAgY29uc3QgZGF0YSA9IHtcbiAgICAgIGN1cnJlbnRQb3NpdGlvbjogMCxcbiAgICAgIGRlc2NyaWJpbmc6IGRlc2NyaWJpbmdPYmplY3QsXG4gICAgICBsYXN0RGVzY3JpYmVkUG9zaXRpb246IDAsXG4gICAgICBsYXN0RGVzY3JpcHRpb246IG51bGwsXG4gICAgICBkZXNjcmliZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBwb3MgPSB0aGlzLmN1cnJlbnRQb3NpdGlvbjtcbiAgICAgICAgaWYgKHBvcyAhPT0gdGhpcy5sYXN0RGVzY3JpYmVkUG9zaXRpb24gfHwgdGhpcy5sYXN0RGVzY3JpcHRpb24gPT09IG51bGwpIHtcbiAgICAgICAgICB0aGlzLmxhc3REZXNjcmlwdGlvbiA9IHRoaXMuZGVzY3JpYmluZy5kZXNjcmliZShwb3MpO1xuICAgICAgICAgIHRoaXMubGFzdERlc2NyaWJlZFBvc2l0aW9uID0gcG9zO1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVxdWVzdGluZyBuZXcgZGVzY3JpcHRpb24gZm9yIGN4ID0gXCIgKyBwb3MpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwicmV1c2luZyBsYXN0IGRlc2NyaXB0aW9uXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmxhc3REZXNjcmlwdGlvbjtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgIHN1cGVyKCdlbnRpdHknLCBkYXRhLCBvcHRpb25zKTtcblxuICAgIHRoaXMuY29uZmlndXJlU2hhcGUoQ3Jvc3NoYWlycywge1xuICAgICAgY3g6IChkKSA9PiBkLmN1cnJlbnRQb3NpdGlvbixcbiAgICAgIGN5OiAoZCkgPT4gZC5kZXNjcmliZSgpWzBdLmN5LFxuICAgICAgdmFsdWU6IChkKSA9PiBkLmRlc2NyaWJlKClbMF0udmFsdWUsXG4gICAgICB1bml0OiAoZCkgPT4gZC5kZXNjcmliZSgpWzBdLnVuaXRcbiAgICB9LCB7XG4gICAgICBjb2xvcjogb3B0aW9ucy5jb2xvcixcbiAgICAgIG9wYWNpdHk6IG9wdGlvbnMub3BhY2l0eVxuICAgIH0pO1xuICB9XG5cbiAgc2V0IGN1cnJlbnRQb3NpdGlvbihwb3MpIHtcbiAgICB0aGlzLmRhdGFbMF0uY3VycmVudFBvc2l0aW9uID0gcG9zO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRQb3NpdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhWzBdLmN1cnJlbnRQb3NpdGlvbjtcbiAgfVxufVxuIl19