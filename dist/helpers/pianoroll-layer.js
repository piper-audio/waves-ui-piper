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

    _get(Object.getPrototypeOf(PianoRollLayer.prototype), 'constructor', this).call(this, 'collection', rects, options);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9oZWxwZXJzL3BpYW5vcm9sbC1sYXllci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3lCQUFrQixlQUFlOzs7OzZCQUNiLG1CQUFtQjs7Ozt3Q0FDWCwrQkFBK0I7Ozs7Ozs7Ozs7Ozs7SUFVdEMsY0FBYztZQUFkLGNBQWM7Ozs7Ozs7OztBQU90QixXQVBRLGNBQWMsQ0FPckIsSUFBSSxFQUFnQztRQUE5QixPQUFPLHlEQUFHLEVBQUU7UUFBRSxTQUFTLHlEQUFHLEVBQUU7OzBCQVAzQixjQUFjOztBQVMvQixRQUFNLFVBQVUsR0FBRyxDQUFDLENBQUM7O0FBRXJCLFdBQU8sR0FBRyxlQUFjO0FBQ3RCLHFCQUFlLEVBQUUsS0FBSztBQUN0QixhQUFPLEVBQUUsR0FBRztBQUNaLGFBQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUM7QUFDakIsV0FBSyxFQUFFLFNBQVM7S0FDakIsRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFFWixRQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUEsS0FBSyxFQUFJO0FBQzlCLFVBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztBQUNkLFVBQUksT0FBTyxLQUFLLENBQUMsUUFBUSxBQUFDLEtBQUssV0FBVyxFQUFFO0FBQzFDLGFBQUssR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFDLEtBQUssQ0FBQyxRQUFRLENBQUM7T0FDaEM7QUFDRCxhQUFPO0FBQ0wsU0FBQyxFQUFFLEtBQUssQ0FBQyxJQUFJO0FBQ2IsU0FBQyxFQUFFLEtBQUssQ0FBQyxLQUFLO0FBQ2QsYUFBSyxFQUFFLEtBQUssQ0FBQyxRQUFRO0FBQ3JCLGNBQU0sRUFBRSxVQUFVO0FBQ2xCLGFBQUssV0FBUyxLQUFLLFNBQUksS0FBSyxTQUFJLEtBQUssTUFBRztPQUN6QyxDQUFDO0tBQ0gsQ0FBQyxDQUFDOztBQUVILCtCQWhDaUIsY0FBYyw2Q0FnQ3pCLFlBQVksRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFOztBQUVwQyxRQUFJLENBQUMsY0FBYyw2QkFBVSxTQUFTLEVBQUU7QUFDdEMscUJBQWUsRUFBRSxPQUFPLENBQUMsZUFBZTtBQUN4QyxhQUFPLEVBQUUsT0FBTyxDQUFDLE9BQU87S0FDekIsQ0FBQyxDQUFDOztBQUVILFFBQUksQ0FBQyxXQUFXLENBQUMsMkNBQXFCLENBQUMsQ0FBQztHQUN6Qzs7U0F4Q2tCLGNBQWM7OztxQkFBZCxjQUFjIiwiZmlsZSI6InNyYy9oZWxwZXJzL3BpYW5vcm9sbC1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMYXllciBmcm9tICcuLi9jb3JlL2xheWVyJztcbmltcG9ydCBTZWdtZW50IGZyb20gJy4uL3NoYXBlcy9zZWdtZW50JztcbmltcG9ydCBTZWdtZW50QmVoYXZpb3IgZnJvbSAnLi4vYmVoYXZpb3JzL3NlZ21lbnQtYmVoYXZpb3InO1xuXG4vKipcbiAqIEhlbHBlciB0byBjcmVhdGUgYSBNSURJLXN0eWxlIHBpYW5vIHJvbGwgbGF5ZXIuIERhdGEgbXVzdCBoYXZlXG4gKiBcInRpbWVcIiwgXCJkdXJhdGlvblwiIGFuZCBcInBpdGNoXCIgdmFsdWVzLCBhbmQgbWF5IGFsc28gaGF2ZVxuICogXCJ2ZWxvY2l0eVwiLiBQaXRjaCBhbmQgdmVsb2NpdHkgYXJlIGluIHRoZSBzYW1lIDAtMTI3IHJhbmdlIGFzIE1JREksXG4gKiBhbHRob3VnaCB2YWx1ZXMgY2FuIGJlIG5vbi1pbnRlZ3JhbC5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1waWFub3JvbGwuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGlhbm9Sb2xsTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0FycmF5fSBkYXRhIC0gVGhlIGRhdGEgdG8gcmVuZGVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEFuIG9iamVjdCB0byBjb25maWd1cmUgdGhlIGxheWVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gYWNjZXNzb3JzIC0gVGhlIGFjY2Vzc29ycyB0byBjb25maWd1cmUgdGhlIG1hcHBpbmdcbiAgICogICAgYmV0d2VlbiBzaGFwZXMgYW5kIGRhdGEuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihkYXRhLCBvcHRpb25zID0ge30sIGFjY2Vzc29ycyA9IHt9KSB7XG5cbiAgICBjb25zdCBub3RlSGVpZ2h0ID0gMTtcbiAgICBcbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBkaXNwbGF5SGFuZGxlcnM6IGZhbHNlLFxuICAgICAgb3BhY2l0eTogMS4wLFxuICAgICAgeURvbWFpbjogWzAsIDEyN10sXG4gICAgICBjb2xvcjogJyMwMDAwMDAnXG4gICAgfSwgb3B0aW9ucyk7XG4gICAgXG4gICAgY29uc3QgcmVjdHMgPSBkYXRhLm1hcChkYXR1bSA9PiB7XG4gICAgICBsZXQgbGV2ZWwgPSAwO1xuICAgICAgaWYgKHR5cGVvZihkYXR1bS52ZWxvY2l0eSkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGxldmVsID0gMjU2IC0gMipkYXR1bS52ZWxvY2l0eTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHg6IGRhdHVtLnRpbWUsXG4gICAgICAgIHk6IGRhdHVtLnBpdGNoLFxuICAgICAgICB3aWR0aDogZGF0dW0uZHVyYXRpb24sXG4gICAgICAgIGhlaWdodDogbm90ZUhlaWdodCxcbiAgICAgICAgY29sb3I6IGByZ2IoJHtsZXZlbH0sJHtsZXZlbH0sJHtsZXZlbH0pYCxcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICBzdXBlcignY29sbGVjdGlvbicsIHJlY3RzLCBvcHRpb25zKTtcblxuICAgIHRoaXMuY29uZmlndXJlU2hhcGUoU2VnbWVudCwgYWNjZXNzb3JzLCB7XG4gICAgICBkaXNwbGF5SGFuZGxlcnM6IG9wdGlvbnMuZGlzcGxheUhhbmRsZXJzLFxuICAgICAgb3BhY2l0eTogb3B0aW9ucy5vcGFjaXR5LFxuICAgIH0pO1xuICAgIFxuICAgIHRoaXMuc2V0QmVoYXZpb3IobmV3IFNlZ21lbnRCZWhhdmlvcigpKTtcbiAgfVxufVxuIl19