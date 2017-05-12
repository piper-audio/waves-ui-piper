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
   * @param {(Array|Object)} describing - The source of values we are
   * to highlight. Either a single object, or an array of objects,
   * that provide a describe(time) method returning an array of { cx,
   * cy, unit }.
   *
   * @param {Object} options - An object to configure the layer.
   */

  function HighlightLayer(describing) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, HighlightLayer);

    var describingObjects = Array.isArray(describing) ? describing : [describing];

    var defaults = {
      color: 'red',
      labelOffset: 0,
      hittable: false };

    // kind of pass through layer
    var crosshairDataSource = {

      currentPosition: 0,
      describing: describingObjects,
      lastDescribedObject: null,
      lastDescribedPosition: 0,
      lastDescription: null,

      _isInRangeFor: function _isInRangeFor(t, obj) {
        var hasStart = typeof obj.start !== 'undefined';
        var hasDuration = typeof obj.duration !== 'undefined';
        console.log("start? " + hasStart);
        if (hasStart) {
          console.log("_isInRangeFor(" + t + "): start = " + obj.start);
          if (obj.start > t) {
            return false;
          }
          if (hasDuration) {
            console.log("_isInRangeFor(" + t + "): duration = " + obj.duration);
            if (obj.start + obj.duration < t) {
              return false;
            }
          }
        }
        console.log("_isInRangeFor(" + t + "): yes, or maybe");
        return true; // or at least, maybe
      },

      _locate: function _locate(t) {
        console.log("_locate: have " + this.describing.length + " describing objects");
        if (this.lastDescribedObject !== null && this._isInRangeFor(t, this.lastDescribedObject)) {
          console.log("in range for lastDescribedObject, reusing it");
          return this.lastDescribedObject;
        }
        for (var i = 0; i < this.describing.length; ++i) {
          if (this._isInRangeFor(t, this.describing[i])) {
            console.log("in range for object " + i + ", using that");
            return this.describing[i];
          }
        }
        console.log("all objects out of range");
        return null;
      },

      describe: function describe() {

        if (this.describing.length === 0) {
          return [];
        }

        var pos = this.currentPosition;
        if (pos === this.lastDescribedPosition && this.lastDescription !== null) {
          return this.lastDescription;
        }

        var describedObject = this._locate(pos);
        this.lastDescribedObject = describedObject;
        this.lastDescribedPosition = pos;

        if (describedObject !== null) {
          this.lastDescription = describedObject.describe(pos);
        } else {
          this.lastDescription = [];
        }

        return this.lastDescription;
      }
    };

    options = _Object$assign(defaults, options);
    _get(Object.getPrototypeOf(HighlightLayer.prototype), 'constructor', this).call(this, 'entity', crosshairDataSource, options);

    this.configureShape(_shapesCrosshairs2['default'], {
      // We have a choice here -- use the x coord of the nearest point
      // (the one that is also contributing its y coord) or use the x
      // coord of the probe point. The latter looks better when the
      // probe point is based on a cursor that is also displayed on
      // this track. But it's a bit of a lie. Let's do it anyway
      visible: function visible(d) {
        return d.describe().length > 0;
      },
      cx: function cx(d) {
        return d.currentPosition;
      },
      cy: function cy(d) {
        var dd = d.describe();
        return dd.length > 0 ? dd[0].cy : 0;
      },
      unit: function unit(d) {
        var dd = d.describe();
        return dd.length > 0 ? dd[0].unit : "";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9oZWxwZXJzL2hpZ2hsaWdodC1sYXllci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7eUJBQWtCLGVBQWU7Ozs7Z0NBQ1Ysc0JBQXNCOzs7Ozs7Ozs7Ozs7Ozs7SUFZeEIsY0FBYztZQUFkLGNBQWM7Ozs7Ozs7Ozs7O0FBU3RCLFdBVFEsY0FBYyxDQVNyQixVQUFVLEVBQWdCO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFUakIsY0FBYzs7QUFXL0IsUUFBTSxpQkFBaUIsR0FBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUN6QixVQUFVLEdBQUcsQ0FBQyxVQUFVLENBQUMsQUFBQyxDQUFDOztBQUV0RCxRQUFNLFFBQVEsR0FBRztBQUNmLFdBQUssRUFBRSxLQUFLO0FBQ1osaUJBQVcsRUFBRSxDQUFDO0FBQ2QsY0FBUSxFQUFFLEtBQUssRUFDaEIsQ0FBQzs7O0FBRUYsUUFBTSxtQkFBbUIsR0FBRzs7QUFFMUIscUJBQWUsRUFBRSxDQUFDO0FBQ2xCLGdCQUFVLEVBQUUsaUJBQWlCO0FBQzdCLHlCQUFtQixFQUFFLElBQUk7QUFDekIsMkJBQXFCLEVBQUUsQ0FBQztBQUN4QixxQkFBZSxFQUFFLElBQUk7O0FBRXJCLG1CQUFhLEVBQUUsdUJBQVMsQ0FBQyxFQUFFLEdBQUcsRUFBRTtBQUM5QixZQUFNLFFBQVEsR0FBSSxPQUFPLEdBQUcsQ0FBQyxLQUFLLEtBQUssV0FBVyxBQUFDLENBQUM7QUFDcEQsWUFBTSxXQUFXLEdBQUksT0FBTyxHQUFHLENBQUMsUUFBUSxLQUFLLFdBQVcsQUFBQyxDQUFDO0FBQzFELGVBQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxDQUFDO0FBQ2xDLFlBQUksUUFBUSxFQUFFO0FBQ1osaUJBQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxHQUFHLGFBQWEsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDOUQsY0FBSSxH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O09BQUE7QUFDckMsUUFBRSxFQUFFLFlBQUEsQ0FBQztlQUFJLENBQUMsQ0FBQyxlQUFlO09BQUE7QUFDMUIsUUFBRSxFQUFFLFlBQUEsQ0FBQyxFQUFJO0FBQ1AsWUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ3hCLGVBQVEsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUU7T0FDdkM7QUFDRCxVQUFJLEVBQUUsY0FBQSxDQUFDLEVBQUk7QUFDVCxZQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDeEIsZUFBUSxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBRTtPQUMxQztLQUNGLEVBQUU7QUFDRCxXQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUs7QUFDcEIsYUFBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPO0FBQ3hCLGlCQUFXLEVBQUUsT0FBTyxDQUFDLFdBQVc7S0FDakMsQ0FBQyxDQUFDO0dBQ0o7O2VBbkhrQixjQUFjOztTQXFIZCxhQUFDLEdBQUcsRUFBRTtBQUN2QixVQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsR0FBRyxHQUFHLENBQUM7S0FDcEM7U0FFa0IsZUFBRztBQUNwQixhQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDO0tBQ3JDOzs7U0EzSGtCLGNBQWM7OztxQkFBZCxjQUFjIiwiZmlsZSI6InNyYy9oZWxwZXJzL2hpZ2hsaWdodC1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMYXllciBmcm9tICcuLi9jb3JlL2xheWVyJztcbmltcG9ydCBDcm9zc2hhaXJzIGZyb20gJy4uL3NoYXBlcy9jcm9zc2hhaXJzJztcblxuLyoqXG4gKiBIZWxwZXIgdG8gY3JlYXRlIGEgY3Jvc3NoYWlyIGxheWVyIHRoYXQgaGlnaGxpZ2h0cyB0aGUgdmFsdWVcbiAqIHJlcG9ydGVkIGJ5IGFuIG9iamVjdCdzIGRlc2NyaWJlKCkgbWV0aG9kIGF0IGEgdGltZSBzZXQgdGhyb3VnaCB0aGVcbiAqIGN1cnJlbnRQb3NpdGlvbiBwcm9wZXJ0eS4gVGhlIGRlc2NyaWJpbmdPYmplY3QgbXVzdCBoYXZlIGFcbiAqIGRlc2NyaWJlKHRpbWUpIG1ldGhvZCB0aGF0IHRha2VzIG9ubHkgYSB0aW1lIGFuZCByZXR1cm5zIGFuIGFycmF5XG4gKiBvZiB7IGN4LCBjeSwgdW5pdCB9LiBBbiBleGFtcGxlIG9mIHN1Y2ggYSBkZXNjcmliaW5nT2JqZWN0IG1pZ2h0IGJlXG4gKiBhbm90aGVyIGxheWVyLlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLWhpZ2hsaWdodC5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIaWdobGlnaHRMYXllciBleHRlbmRzIExheWVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7KEFycmF5fE9iamVjdCl9IGRlc2NyaWJpbmcgLSBUaGUgc291cmNlIG9mIHZhbHVlcyB3ZSBhcmVcbiAgICogdG8gaGlnaGxpZ2h0LiBFaXRoZXIgYSBzaW5nbGUgb2JqZWN0LCBvciBhbiBhcnJheSBvZiBvYmplY3RzLFxuICAgKiB0aGF0IHByb3ZpZGUgYSBkZXNjcmliZSh0aW1lKSBtZXRob2QgcmV0dXJuaW5nIGFuIGFycmF5IG9mIHsgY3gsXG4gICAqIGN5LCB1bml0IH0uXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gQW4gb2JqZWN0IHRvIGNvbmZpZ3VyZSB0aGUgbGF5ZXIuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihkZXNjcmliaW5nLCBvcHRpb25zID0ge30pIHtcblxuICAgIGNvbnN0IGRlc2NyaWJpbmdPYmplY3RzID0gKEFycmF5LmlzQXJyYXkoZGVzY3JpYmluZykgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaWJpbmcgOiBbZGVzY3JpYmluZ10pO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBjb2xvcjogJ3JlZCcsXG4gICAgICBsYWJlbE9mZnNldDogMCxcbiAgICAgIGhpdHRhYmxlOiBmYWxzZSwgLy8ga2luZCBvZiBwYXNzIHRocm91Z2ggbGF5ZXJcbiAgICB9O1xuXG4gICAgY29uc3QgY3Jvc3NoYWlyRGF0YVNvdXJjZSA9IHtcblxuICAgICAgY3VycmVudFBvc2l0aW9uOiAwLFxuICAgICAgZGVzY3JpYmluZzogZGVzY3JpYmluZ09iamVjdHMsXG4gICAgICBsYXN0RGVzY3JpYmVkT2JqZWN0OiBudWxsLFxuICAgICAgbGFzdERlc2NyaWJlZFBvc2l0aW9uOiAwLFxuICAgICAgbGFzdERlc2NyaXB0aW9uOiBudWxsLFxuXG4gICAgICBfaXNJblJhbmdlRm9yOiBmdW5jdGlvbih0LCBvYmopIHtcbiAgICAgICAgY29uc3QgaGFzU3RhcnQgPSAodHlwZW9mIG9iai5zdGFydCAhPT0gJ3VuZGVmaW5lZCcpO1xuICAgICAgICBjb25zdCBoYXNEdXJhdGlvbiA9ICh0eXBlb2Ygb2JqLmR1cmF0aW9uICE9PSAndW5kZWZpbmVkJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwic3RhcnQ/IFwiICsgaGFzU3RhcnQpO1xuICAgICAgICBpZiAoaGFzU3RhcnQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIl9pc0luUmFuZ2VGb3IoXCIgKyB0ICsgXCIpOiBzdGFydCA9IFwiICsgb2JqLnN0YXJ0KTtcbiAgICAgICAgICBpZiAob2JqLnN0YXJ0ID4gdCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaGFzRHVyYXRpb24pIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiX2lzSW5SYW5nZUZvcihcIiArIHQgKyBcIik6IGR1cmF0aW9uID0gXCIgKyBvYmouZHVyYXRpb24pO1xuICAgICAgICAgICAgaWYgKG9iai5zdGFydCArIG9iai5kdXJhdGlvbiA8IHQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcIl9pc0luUmFuZ2VGb3IoXCIgKyB0ICsgXCIpOiB5ZXMsIG9yIG1heWJlXCIpO1xuICAgICAgICByZXR1cm4gdHJ1ZTsgLy8gb3IgYXQgbGVhc3QsIG1heWJlXG4gICAgICB9LFxuXG4gICAgICBfbG9jYXRlOiBmdW5jdGlvbih0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiX2xvY2F0ZTogaGF2ZSBcIiArIHRoaXMuZGVzY3JpYmluZy5sZW5ndGggKyBcIiBkZXNjcmliaW5nIG9iamVjdHNcIik7XG4gICAgICAgIGlmICh0aGlzLmxhc3REZXNjcmliZWRPYmplY3QgIT09IG51bGwgJiZcbiAgICAgICAgICAgIHRoaXMuX2lzSW5SYW5nZUZvcih0LCB0aGlzLmxhc3REZXNjcmliZWRPYmplY3QpKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJpbiByYW5nZSBmb3IgbGFzdERlc2NyaWJlZE9iamVjdCwgcmV1c2luZyBpdFwiKTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5sYXN0RGVzY3JpYmVkT2JqZWN0O1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5kZXNjcmliaW5nLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgaWYgKHRoaXMuX2lzSW5SYW5nZUZvcih0LCB0aGlzLmRlc2NyaWJpbmdbaV0pKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImluIHJhbmdlIGZvciBvYmplY3QgXCIgKyBpICsgXCIsIHVzaW5nIHRoYXRcIik7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kZXNjcmliaW5nW2ldO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcImFsbCBvYmplY3RzIG91dCBvZiByYW5nZVwiKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9LFxuICAgICAgXG4gICAgICBkZXNjcmliZTogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgaWYgKHRoaXMuZGVzY3JpYmluZy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGxldCBwb3MgPSB0aGlzLmN1cnJlbnRQb3NpdGlvbjtcbiAgICAgICAgaWYgKHBvcyA9PT0gdGhpcy5sYXN0RGVzY3JpYmVkUG9zaXRpb24gJiZcbiAgICAgICAgICAgIHRoaXMubGFzdERlc2NyaXB0aW9uICE9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMubGFzdERlc2NyaXB0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGVzY3JpYmVkT2JqZWN0ID0gdGhpcy5fbG9jYXRlKHBvcyk7XG4gICAgICAgIHRoaXMubGFzdERlc2NyaWJlZE9iamVjdCA9IGRlc2NyaWJlZE9iamVjdDtcbiAgICAgICAgdGhpcy5sYXN0RGVzY3JpYmVkUG9zaXRpb24gPSBwb3M7XG5cbiAgICAgICAgaWYgKGRlc2NyaWJlZE9iamVjdCAhPT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMubGFzdERlc2NyaXB0aW9uID0gZGVzY3JpYmVkT2JqZWN0LmRlc2NyaWJlKHBvcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5sYXN0RGVzY3JpcHRpb24gPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmxhc3REZXNjcmlwdGlvbjtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgIHN1cGVyKCdlbnRpdHknLCBjcm9zc2hhaXJEYXRhU291cmNlLCBvcHRpb25zKTtcblxuICAgIHRoaXMuY29uZmlndXJlU2hhcGUoQ3Jvc3NoYWlycywge1xuICAgICAgLy8gV2UgaGF2ZSBhIGNob2ljZSBoZXJlIC0tIHVzZSB0aGUgeCBjb29yZCBvZiB0aGUgbmVhcmVzdCBwb2ludFxuICAgICAgLy8gKHRoZSBvbmUgdGhhdCBpcyBhbHNvIGNvbnRyaWJ1dGluZyBpdHMgeSBjb29yZCkgb3IgdXNlIHRoZSB4XG4gICAgICAvLyBjb29yZCBvZiB0aGUgcHJvYmUgcG9pbnQuIFRoZSBsYXR0ZXIgbG9va3MgYmV0dGVyIHdoZW4gdGhlXG4gICAgICAvLyBwcm9iZSBwb2ludCBpcyBiYXNlZCBvbiBhIGN1cnNvciB0aGF0IGlzIGFsc28gZGlzcGxheWVkIG9uXG4gICAgICAvLyB0aGlzIHRyYWNrLiBCdXQgaXQncyBhIGJpdCBvZiBhIGxpZS4gTGV0J3MgZG8gaXQgYW55d2F5XG4gICAgICB2aXNpYmxlOiBkID0+IGQuZGVzY3JpYmUoKS5sZW5ndGggPiAwLFxuICAgICAgY3g6IGQgPT4gZC5jdXJyZW50UG9zaXRpb24sXG4gICAgICBjeTogZCA9PiB7XG4gICAgICAgIGNvbnN0IGRkID0gZC5kZXNjcmliZSgpO1xuICAgICAgICByZXR1cm4gKGRkLmxlbmd0aCA+IDAgPyBkZFswXS5jeSA6IDApO1xuICAgICAgfSxcbiAgICAgIHVuaXQ6IGQgPT4ge1xuICAgICAgICBjb25zdCBkZCA9IGQuZGVzY3JpYmUoKTtcbiAgICAgICAgcmV0dXJuIChkZC5sZW5ndGggPiAwID8gZGRbMF0udW5pdCA6IFwiXCIpO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGNvbG9yOiBvcHRpb25zLmNvbG9yLFxuICAgICAgb3BhY2l0eTogb3B0aW9ucy5vcGFjaXR5LFxuICAgICAgbGFiZWxPZmZzZXQ6IG9wdGlvbnMubGFiZWxPZmZzZXRcbiAgICB9KTtcbiAgfVxuXG4gIHNldCBjdXJyZW50UG9zaXRpb24ocG9zKSB7XG4gICAgdGhpcy5kYXRhWzBdLmN1cnJlbnRQb3NpdGlvbiA9IHBvcztcbiAgfVxuXG4gIGdldCBjdXJyZW50UG9zaXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVswXS5jdXJyZW50UG9zaXRpb247XG4gIH1cbn1cbiJdfQ==