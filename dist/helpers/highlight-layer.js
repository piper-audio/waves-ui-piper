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
      hittable: false, // kind of pass through layer
      unit: ''
    };

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
        return options.unit;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9oZWxwZXJzL2hpZ2hsaWdodC1sYXllci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7eUJBQWtCLGVBQWU7Ozs7Z0NBQ1Ysc0JBQXNCOzs7Ozs7Ozs7Ozs7Ozs7SUFZeEIsY0FBYztZQUFkLGNBQWM7Ozs7Ozs7Ozs7O0FBU3RCLFdBVFEsY0FBYyxDQVNyQixVQUFVLEVBQWdCO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFUakIsY0FBYzs7QUFXL0IsUUFBTSxpQkFBaUIsR0FBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUN6QixVQUFVLEdBQUcsQ0FBQyxVQUFVLENBQUMsQUFBQyxDQUFDOztBQUV0RCxRQUFNLFFBQVEsR0FBRztBQUNmLFdBQUssRUFBRSxLQUFLO0FBQ1osaUJBQVcsRUFBRSxDQUFDO0FBQ2QsY0FBUSxFQUFFLEtBQUs7QUFDZixVQUFJLEVBQUUsRUFBRTtLQUNULENBQUM7O0FBRUYsUUFBTSxtQkFBbUIsR0FBRzs7QUFFMUIscUJBQWUsRUFBRSxDQUFDO0FBQ2xCLGdCQUFVLEVBQUUsaUJBQWlCO0FBQzdCLHlCQUFtQixFQUFFLElBQUk7QUFDekIsMkJBQXFCLEVBQUUsQ0FBQztBQUN4QixxQkFBZSxFQUFFLElBQUk7O0FBRXJCLG1CQUFhLEVBQUUsdUJBQVMsQ0FBQyxFQUFFLEdBQUcsRUFBRTtBQUM5QixZQUFNLFFBQVEsR0FBSSxPQUFPLEdBQUcsQ0FBQyxLQUFLLEtBQUssV0FBVyxBQUFDLENBQUM7QUFDcEQsWUFBTSxXQUFXLEdBQUksT0FBTyxHQUFHLENBQUMsUUFBUSxLQUFLLFdBQVcsQUFBQyxDQUFDO0FBQzFELGVBQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxDQUFDO0FBQ2xDLFlBQUksUUFBUSxFQUFFO0FBQ1osaUJBQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxHQUFHLGFBQWEsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFD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QUFDLE1BQU0sR0FBRyxDQUFDO09BQUE7QUFDckMsUUFBRSxFQUFFLFlBQUEsQ0FBQztlQUFJLENBQUMsQ0FBQyxlQUFlO09BQUE7QUFDMUIsUUFBRSxFQUFFLFlBQUEsQ0FBQyxFQUFJO0FBQ1AsWUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ3hCLGVBQVEsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUU7T0FDdkM7QUFDRCxVQUFJLEVBQUUsY0FBQSxDQUFDO2VBQUksT0FBTyxDQUFDLElBQUk7T0FBQTtLQUN4QixFQUFFO0FBQ0QsV0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLO0FBQ3BCLGFBQU8sRUFBRSxPQUFPLENBQUMsT0FBTztBQUN4QixpQkFBVyxFQUFFLE9BQU8sQ0FBQyxXQUFXO0tBQ2pDLENBQUMsQ0FBQztHQUNKOztlQWpIa0IsY0FBYzs7U0FtSGQsYUFBQyxHQUFHLEVBQUU7QUFDdkIsVUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEdBQUcsR0FBRyxDQUFDO0tBQ3BDO1NBRWtCLGVBQUc7QUFDcEIsYUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQztLQUNyQzs7O1NBekhrQixjQUFjOzs7cUJBQWQsY0FBYyIsImZpbGUiOiJzcmMvaGVscGVycy9oaWdobGlnaHQtbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5pbXBvcnQgQ3Jvc3NoYWlycyBmcm9tICcuLi9zaGFwZXMvY3Jvc3NoYWlycyc7XG5cbi8qKlxuICogSGVscGVyIHRvIGNyZWF0ZSBhIGNyb3NzaGFpciBsYXllciB0aGF0IGhpZ2hsaWdodHMgdGhlIHZhbHVlXG4gKiByZXBvcnRlZCBieSBhbiBvYmplY3QncyBkZXNjcmliZSgpIG1ldGhvZCBhdCBhIHRpbWUgc2V0IHRocm91Z2ggdGhlXG4gKiBjdXJyZW50UG9zaXRpb24gcHJvcGVydHkuIFRoZSBkZXNjcmliaW5nT2JqZWN0IG11c3QgaGF2ZSBhXG4gKiBkZXNjcmliZSh0aW1lKSBtZXRob2QgdGhhdCB0YWtlcyBvbmx5IGEgdGltZSBhbmQgcmV0dXJucyBhbiBhcnJheVxuICogb2YgeyBjeCwgY3ksIHVuaXQgfS4gQW4gZXhhbXBsZSBvZiBzdWNoIGEgZGVzY3JpYmluZ09iamVjdCBtaWdodCBiZVxuICogYW5vdGhlciBsYXllci5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1oaWdobGlnaHQuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGlnaGxpZ2h0TGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIC8qKlxuICAgKiBAcGFyYW0geyhBcnJheXxPYmplY3QpfSBkZXNjcmliaW5nIC0gVGhlIHNvdXJjZSBvZiB2YWx1ZXMgd2UgYXJlXG4gICAqIHRvIGhpZ2hsaWdodC4gRWl0aGVyIGEgc2luZ2xlIG9iamVjdCwgb3IgYW4gYXJyYXkgb2Ygb2JqZWN0cyxcbiAgICogdGhhdCBwcm92aWRlIGEgZGVzY3JpYmUodGltZSkgbWV0aG9kIHJldHVybmluZyBhbiBhcnJheSBvZiB7IGN4LFxuICAgKiBjeSwgdW5pdCB9LlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEFuIG9iamVjdCB0byBjb25maWd1cmUgdGhlIGxheWVyLlxuICAgKi9cbiAgY29uc3RydWN0b3IoZGVzY3JpYmluZywgb3B0aW9ucyA9IHt9KSB7XG5cbiAgICBjb25zdCBkZXNjcmliaW5nT2JqZWN0cyA9IChBcnJheS5pc0FycmF5KGRlc2NyaWJpbmcpID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmliaW5nIDogW2Rlc2NyaWJpbmddKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgY29sb3I6ICdyZWQnLFxuICAgICAgbGFiZWxPZmZzZXQ6IDAsXG4gICAgICBoaXR0YWJsZTogZmFsc2UsIC8vIGtpbmQgb2YgcGFzcyB0aHJvdWdoIGxheWVyXG4gICAgICB1bml0OiAnJ1xuICAgIH07XG5cbiAgICBjb25zdCBjcm9zc2hhaXJEYXRhU291cmNlID0ge1xuXG4gICAgICBjdXJyZW50UG9zaXRpb246IDAsXG4gICAgICBkZXNjcmliaW5nOiBkZXNjcmliaW5nT2JqZWN0cyxcbiAgICAgIGxhc3REZXNjcmliZWRPYmplY3Q6IG51bGwsXG4gICAgICBsYXN0RGVzY3JpYmVkUG9zaXRpb246IDAsXG4gICAgICBsYXN0RGVzY3JpcHRpb246IG51bGwsXG5cbiAgICAgIF9pc0luUmFuZ2VGb3I6IGZ1bmN0aW9uKHQsIG9iaikge1xuICAgICAgICBjb25zdCBoYXNTdGFydCA9ICh0eXBlb2Ygb2JqLnN0YXJ0ICE9PSAndW5kZWZpbmVkJyk7XG4gICAgICAgIGNvbnN0IGhhc0R1cmF0aW9uID0gKHR5cGVvZiBvYmouZHVyYXRpb24gIT09ICd1bmRlZmluZWQnKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJzdGFydD8gXCIgKyBoYXNTdGFydCk7XG4gICAgICAgIGlmIChoYXNTdGFydCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiX2lzSW5SYW5nZUZvcihcIiArIHQgKyBcIik6IHN0YXJ0ID0gXCIgKyBvYmouc3RhcnQpO1xuICAgICAgICAgIGlmIChvYmouc3RhcnQgPiB0KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChoYXNEdXJhdGlvbikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJfaXNJblJhbmdlRm9yKFwiICsgdCArIFwiKTogZHVyYXRpb24gPSBcIiArIG9iai5kdXJhdGlvbik7XG4gICAgICAgICAgICBpZiAob2JqLnN0YXJ0ICsgb2JqLmR1cmF0aW9uIDwgdCkge1xuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwiX2lzSW5SYW5nZUZvcihcIiArIHQgKyBcIik6IHllcywgb3IgbWF5YmVcIik7XG4gICAgICAgIHJldHVybiB0cnVlOyAvLyBvciBhdCBsZWFzdCwgbWF5YmVcbiAgICAgIH0sXG5cbiAgICAgIF9sb2NhdGU6IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJfbG9jYXRlOiBoYXZlIFwiICsgdGhpcy5kZXNjcmliaW5nLmxlbmd0aCArIFwiIGRlc2NyaWJpbmcgb2JqZWN0c1wiKTtcbiAgICAgICAgaWYgKHRoaXMubGFzdERlc2NyaWJlZE9iamVjdCAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgdGhpcy5faXNJblJhbmdlRm9yKHQsIHRoaXMubGFzdERlc2NyaWJlZE9iamVjdCkpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcImluIHJhbmdlIGZvciBsYXN0RGVzY3JpYmVkT2JqZWN0LCByZXVzaW5nIGl0XCIpO1xuICAgICAgICAgIHJldHVybiB0aGlzLmxhc3REZXNjcmliZWRPYmplY3Q7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmRlc2NyaWJpbmcubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICBpZiAodGhpcy5faXNJblJhbmdlRm9yKHQsIHRoaXMuZGVzY3JpYmluZ1tpXSkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW4gcmFuZ2UgZm9yIG9iamVjdCBcIiArIGkgKyBcIiwgdXNpbmcgdGhhdFwiKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRlc2NyaWJpbmdbaV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwiYWxsIG9iamVjdHMgb3V0IG9mIHJhbmdlXCIpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH0sXG4gICAgICBcbiAgICAgIGRlc2NyaWJlOiBmdW5jdGlvbigpIHtcblxuICAgICAgICBpZiAodGhpcy5kZXNjcmliaW5nLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgbGV0IHBvcyA9IHRoaXMuY3VycmVudFBvc2l0aW9uO1xuICAgICAgICBpZiAocG9zID09PSB0aGlzLmxhc3REZXNjcmliZWRQb3NpdGlvbiAmJlxuICAgICAgICAgICAgdGhpcy5sYXN0RGVzY3JpcHRpb24gIT09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5sYXN0RGVzY3JpcHRpb247XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkZXNjcmliZWRPYmplY3QgPSB0aGlzLl9sb2NhdGUocG9zKTtcbiAgICAgICAgdGhpcy5sYXN0RGVzY3JpYmVkT2JqZWN0ID0gZGVzY3JpYmVkT2JqZWN0O1xuICAgICAgICB0aGlzLmxhc3REZXNjcmliZWRQb3NpdGlvbiA9IHBvcztcblxuICAgICAgICBpZiAoZGVzY3JpYmVkT2JqZWN0ICE9PSBudWxsKSB7XG4gICAgICAgICAgdGhpcy5sYXN0RGVzY3JpcHRpb24gPSBkZXNjcmliZWRPYmplY3QuZGVzY3JpYmUocG9zKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmxhc3REZXNjcmlwdGlvbiA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMubGFzdERlc2NyaXB0aW9uO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgc3VwZXIoJ2VudGl0eScsIGNyb3NzaGFpckRhdGFTb3VyY2UsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb25maWd1cmVTaGFwZShDcm9zc2hhaXJzLCB7XG4gICAgICAvLyBXZSBoYXZlIGEgY2hvaWNlIGhlcmUgLS0gdXNlIHRoZSB4IGNvb3JkIG9mIHRoZSBuZWFyZXN0IHBvaW50XG4gICAgICAvLyAodGhlIG9uZSB0aGF0IGlzIGFsc28gY29udHJpYnV0aW5nIGl0cyB5IGNvb3JkKSBvciB1c2UgdGhlIHhcbiAgICAgIC8vIGNvb3JkIG9mIHRoZSBwcm9iZSBwb2ludC4gVGhlIGxhdHRlciBsb29rcyBiZXR0ZXIgd2hlbiB0aGVcbiAgICAgIC8vIHByb2JlIHBvaW50IGlzIGJhc2VkIG9uIGEgY3Vyc29yIHRoYXQgaXMgYWxzbyBkaXNwbGF5ZWQgb25cbiAgICAgIC8vIHRoaXMgdHJhY2suIEJ1dCBpdCdzIGEgYml0IG9mIGEgbGllLiBMZXQncyBkbyBpdCBhbnl3YXlcbiAgICAgIHZpc2libGU6IGQgPT4gZC5kZXNjcmliZSgpLmxlbmd0aCA+IDAsXG4gICAgICBjeDogZCA9PiBkLmN1cnJlbnRQb3NpdGlvbixcbiAgICAgIGN5OiBkID0+IHtcbiAgICAgICAgY29uc3QgZGQgPSBkLmRlc2NyaWJlKCk7XG4gICAgICAgIHJldHVybiAoZGQubGVuZ3RoID4gMCA/IGRkWzBdLmN5IDogMCk7XG4gICAgICB9LFxuICAgICAgdW5pdDogZCA9PiBvcHRpb25zLnVuaXRcbiAgICB9LCB7XG4gICAgICBjb2xvcjogb3B0aW9ucy5jb2xvcixcbiAgICAgIG9wYWNpdHk6IG9wdGlvbnMub3BhY2l0eSxcbiAgICAgIGxhYmVsT2Zmc2V0OiBvcHRpb25zLmxhYmVsT2Zmc2V0XG4gICAgfSk7XG4gIH1cblxuICBzZXQgY3VycmVudFBvc2l0aW9uKHBvcykge1xuICAgIHRoaXMuZGF0YVswXS5jdXJyZW50UG9zaXRpb24gPSBwb3M7XG4gIH1cblxuICBnZXQgY3VycmVudFBvc2l0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFbMF0uY3VycmVudFBvc2l0aW9uO1xuICB9XG59XG4iXX0=