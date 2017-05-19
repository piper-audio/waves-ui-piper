'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreLayer = require('../core/layer');

var _coreLayer2 = _interopRequireDefault(_coreLayer);

var _shapesSegment = require('../shapes/segment');

var _shapesSegment2 = _interopRequireDefault(_shapesSegment);

var _behaviorsSegmentBehavior = require('../behaviors/segment-behavior');

var _behaviorsSegmentBehavior2 = _interopRequireDefault(_behaviorsSegmentBehavior);

var _utilsFind = require('../utils/find');

/**
 * Helper to create a MIDI-style piano roll layer. Data must have
 * "time", "duration" and "pitch" values, and may also have
 * "velocity". Pitch and velocity are in the same 0-127 range as MIDI,
 * although values can be non-integral.
 *
 * [example usage](./examples/layer-pianoroll.html)
 */

var PianoRollLayer = (function (_Layer) {
  _inherits(PianoRollLayer, _Layer);

  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */

  function PianoRollLayer(data) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var accessors = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, PianoRollLayer);

    var noteHeight = 1;

    options = _Object$assign({
      displayHandlers: false,
      opacity: 1.0,
      yDomain: [0, 127],
      color: '#000000'
    }, options);

    var rects = data.map(function (datum) {
      var level = 0;
      if (typeof datum.velocity !== 'undefined') {
        level = 256 - 2 * datum.velocity;
      }
      return {
        x: datum.time,
        y: datum.pitch,
        width: datum.duration,
        height: noteHeight,
        color: 'rgb(' + level + ',' + level + ',' + level + ')'
      };
    });

    var describer = function describer(x) {
      if (!data.length) return [];
      var i = (0, _utilsFind.findWithin)(data, x, function (d) {
        return d.time;
      });
      if (data[i].time < x && data[i].time + data[i].duration > x) {
        return [{
          cx: data[i].time,
          cy: data[i].pitch
        }];
      } else {
        return [];
      }
    };

    _get(Object.getPrototypeOf(PianoRollLayer.prototype), 'constructor', this).call(this, 'collection', rects, options);

    this.describer = describer;

    this.configureShape(_shapesSegment2['default'], accessors, {
      displayHandlers: options.displayHandlers,
      opacity: options.opacity
    });

    this.setBehavior(new _behaviorsSegmentBehavior2['default']());
  }

  return PianoRollLayer;
})(_coreLayer2['default']);

exports['default'] = PianoRollLayer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9oZWxwZXJzL3BpYW5vcm9sbC1sYXllci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3lCQUFrQixlQUFlOzs7OzZCQUNiLG1CQUFtQjs7Ozt3Q0FDWCwrQkFBK0I7Ozs7eUJBQ2hDLGVBQWU7Ozs7Ozs7Ozs7O0lBVXJCLGNBQWM7WUFBZCxjQUFjOzs7Ozs7Ozs7QUFRdEIsV0FSUSxjQUFjLENBUXJCLElBQUksRUFBZ0M7UUFBOUIsT0FBTyx5REFBRyxFQUFFO1FBQUUsU0FBUyx5REFBRyxFQUFFOzswQkFSM0IsY0FBYzs7QUFVL0IsUUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFDOztBQUVyQixXQUFPLEdBQUcsZUFBYztBQUN0QixxQkFBZSxFQUFFLEtBQUs7QUFDdEIsYUFBTyxFQUFFLEdBQUc7QUFDWixhQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDO0FBQ2pCLFdBQUssRUFBRSxTQUFTO0tBQ2pCLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRVosUUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFBLEtBQUssRUFBSTtBQUM5QixVQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDZCxVQUFJLE9BQU8sS0FBSyxDQUFDLFFBQVEsQUFBQyxLQUFLLFdBQVcsRUFBRTtBQUMxQyxhQUFLLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO09BQ2hDO0FBQ0QsYUFBTztBQUNMLFNBQUMsRUFBRSxLQUFLLENBQUMsSUFBSTtBQUNiLFNBQUMsRUFBRSxLQUFLLENBQUMsS0FBSztBQUNkLGFBQUssRUFBRSxLQUFLLENBQUMsUUFBUTtBQUNyQixjQUFNLEVBQUUsVUFBVTtBQUNsQixhQUFLLFdBQVMsS0FBSyxTQUFJLEtBQUssU0FBSSxLQUFLLE1BQUc7T0FDekMsQ0FBQztLQUNILENBQUMsQ0FBQzs7QUFFSCxRQUFNLFNBQVMsR0FBSSxTQUFiLFNBQVMsQ0FBSSxDQUFDLEVBQUk7QUFDdEIsVUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLENBQUM7QUFDNUIsVUFBTSxDQUFDLEdBQUcsMkJBQVcsSUFBSSxFQUFFLENBQUMsRUFBRSxVQUFBLENBQUMsRUFBSTtBQUFFLGVBQU8sQ0FBQyxDQUFDLElBQUksQ0FBQztPQUFFLENBQUMsQ0FBQztBQUN2RCxVQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUNoQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxFQUFFO0FBQ3ZDLGVBQU8sQ0FBQztBQUNOLFlBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSTtBQUNoQixZQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUs7U0FDbEIsQ0FBQyxDQUFDO09BQ0osTUFBTTtBQUNMLGVBQU8sRUFBRSxDQUFDO09BQ1g7S0FDRixBQUFDLENBQUM7O0FBRUgsK0JBL0NpQixjQUFjLDZDQStDekIsWUFBWSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUU7O0FBRXBDLFFBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDOztBQUUzQixRQUFJLENBQUMsY0FBYyw2QkFBVSxTQUFTLEVBQUU7QUFDdEMscUJBQWUsRUFBRSxPQUFPLENBQUMsZUFBZTtBQUN4QyxhQUFPLEVBQUUsT0FBTyxDQUFDLE9BQU87S0FDekIsQ0FBQyxDQUFDOztBQUVILFFBQUksQ0FBQyxXQUFXLENBQUMsMkNBQXFCLENBQUMsQ0FBQztHQUN6Qzs7U0F6RGtCLGNBQWM7OztxQkFBZCxjQUFjIiwiZmlsZSI6InNyYy9oZWxwZXJzL3BpYW5vcm9sbC1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMYXllciBmcm9tICcuLi9jb3JlL2xheWVyJztcbmltcG9ydCBTZWdtZW50IGZyb20gJy4uL3NoYXBlcy9zZWdtZW50JztcbmltcG9ydCBTZWdtZW50QmVoYXZpb3IgZnJvbSAnLi4vYmVoYXZpb3JzL3NlZ21lbnQtYmVoYXZpb3InO1xuaW1wb3J0IHsgZmluZFdpdGhpbiB9IGZyb20gJy4uL3V0aWxzL2ZpbmQnO1xuXG4vKipcbiAqIEhlbHBlciB0byBjcmVhdGUgYSBNSURJLXN0eWxlIHBpYW5vIHJvbGwgbGF5ZXIuIERhdGEgbXVzdCBoYXZlXG4gKiBcInRpbWVcIiwgXCJkdXJhdGlvblwiIGFuZCBcInBpdGNoXCIgdmFsdWVzLCBhbmQgbWF5IGFsc28gaGF2ZVxuICogXCJ2ZWxvY2l0eVwiLiBQaXRjaCBhbmQgdmVsb2NpdHkgYXJlIGluIHRoZSBzYW1lIDAtMTI3IHJhbmdlIGFzIE1JREksXG4gKiBhbHRob3VnaCB2YWx1ZXMgY2FuIGJlIG5vbi1pbnRlZ3JhbC5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1waWFub3JvbGwuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGlhbm9Sb2xsTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7QXJyYXl9IGRhdGEgLSBUaGUgZGF0YSB0byByZW5kZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gQW4gb2JqZWN0IHRvIGNvbmZpZ3VyZSB0aGUgbGF5ZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhY2Nlc3NvcnMgLSBUaGUgYWNjZXNzb3JzIHRvIGNvbmZpZ3VyZSB0aGUgbWFwcGluZ1xuICAgKiAgICBiZXR3ZWVuIHNoYXBlcyBhbmQgZGF0YS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGRhdGEsIG9wdGlvbnMgPSB7fSwgYWNjZXNzb3JzID0ge30pIHtcblxuICAgIGNvbnN0IG5vdGVIZWlnaHQgPSAxO1xuICAgIFxuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGRpc3BsYXlIYW5kbGVyczogZmFsc2UsXG4gICAgICBvcGFjaXR5OiAxLjAsXG4gICAgICB5RG9tYWluOiBbMCwgMTI3XSxcbiAgICAgIGNvbG9yOiAnIzAwMDAwMCdcbiAgICB9LCBvcHRpb25zKTtcbiAgICBcbiAgICBjb25zdCByZWN0cyA9IGRhdGEubWFwKGRhdHVtID0+IHtcbiAgICAgIGxldCBsZXZlbCA9IDA7XG4gICAgICBpZiAodHlwZW9mKGRhdHVtLnZlbG9jaXR5KSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbGV2ZWwgPSAyNTYgLSAyKmRhdHVtLnZlbG9jaXR5O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgeDogZGF0dW0udGltZSxcbiAgICAgICAgeTogZGF0dW0ucGl0Y2gsXG4gICAgICAgIHdpZHRoOiBkYXR1bS5kdXJhdGlvbixcbiAgICAgICAgaGVpZ2h0OiBub3RlSGVpZ2h0LFxuICAgICAgICBjb2xvcjogYHJnYigke2xldmVsfSwke2xldmVsfSwke2xldmVsfSlgXG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgY29uc3QgZGVzY3JpYmVyID0gKHggPT4ge1xuICAgICAgaWYgKCFkYXRhLmxlbmd0aCkgcmV0dXJuIFtdO1xuICAgICAgY29uc3QgaSA9IGZpbmRXaXRoaW4oZGF0YSwgeCwgZCA9PiB7IHJldHVybiBkLnRpbWU7IH0pO1xuICAgICAgaWYgKGRhdGFbaV0udGltZSA8IHggJiZcbiAgICAgICAgICBkYXRhW2ldLnRpbWUgKyBkYXRhW2ldLmR1cmF0aW9uID4geCkge1xuICAgICAgICByZXR1cm4gW3tcbiAgICAgICAgICBjeDogZGF0YVtpXS50aW1lLFxuICAgICAgICAgIGN5OiBkYXRhW2ldLnBpdGNoXG4gICAgICAgIH1dO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgc3VwZXIoJ2NvbGxlY3Rpb24nLCByZWN0cywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmRlc2NyaWJlciA9IGRlc2NyaWJlcjtcbiAgICBcbiAgICB0aGlzLmNvbmZpZ3VyZVNoYXBlKFNlZ21lbnQsIGFjY2Vzc29ycywge1xuICAgICAgZGlzcGxheUhhbmRsZXJzOiBvcHRpb25zLmRpc3BsYXlIYW5kbGVycyxcbiAgICAgIG9wYWNpdHk6IG9wdGlvbnMub3BhY2l0eSxcbiAgICB9KTtcbiAgICBcbiAgICB0aGlzLnNldEJlaGF2aW9yKG5ldyBTZWdtZW50QmVoYXZpb3IoKSk7XG4gIH1cbn1cbiJdfQ==