'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _axisAxisLayer = require('../axis/axis-layer');

var _axisAxisLayer2 = _interopRequireDefault(_axisAxisLayer);

var _shapesTicks = require('../shapes/ticks');

var _shapesTicks2 = _interopRequireDefault(_shapesTicks);

var _axisTimeAxisGenerator = require('../axis/time-axis-generator');

var _axisTimeAxisGenerator2 = _interopRequireDefault(_axisTimeAxisGenerator);

/**
 * Helper to create a time axis layer
 *
 * [example usage](./examples/layer-axis.html)
 */

var TimeAxisLayer = (function (_AxisLayer) {
  _inherits(TimeAxisLayer, _AxisLayer);

  /**
   * @param {Object} options - An object to configure the layer.
   */

  function TimeAxisLayer(options) {
    _classCallCheck(this, TimeAxisLayer);

    options = _Object$assign({ color: 'steelblue' }, options);
    _get(Object.getPrototypeOf(TimeAxisLayer.prototype), 'constructor', this).call(this, (0, _axisTimeAxisGenerator2['default'])(), options);

    this.configureShape(_shapesTicks2['default'], {}, {
      color: options.color,
      unconstrained: true
    });
  }

  return TimeAxisLayer;
})(_axisAxisLayer2['default']);

exports['default'] = TimeAxisLayer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9oZWxwZXJzL3RpbWUtYXhpcy1sYXllci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzZCQUFzQixvQkFBb0I7Ozs7MkJBQ3hCLGlCQUFpQjs7OztxQ0FDTCw2QkFBNkI7Ozs7Ozs7Ozs7SUFRdEMsYUFBYTtZQUFiLGFBQWE7Ozs7OztBQUlyQixXQUpRLGFBQWEsQ0FJcEIsT0FBTyxFQUFFOzBCQUpGLGFBQWE7O0FBSzlCLFdBQU8sR0FBRyxlQUFjLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3pELCtCQU5pQixhQUFhLDZDQU14Qix5Q0FBbUIsRUFBRSxPQUFPLEVBQUU7O0FBRXBDLFFBQUksQ0FBQyxjQUFjLDJCQUFRLEVBQUUsRUFBRTtBQUM3QixXQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUs7QUFDcEIsbUJBQWEsRUFBRSxJQUFJO0tBQ3BCLENBQUMsQ0FBQztHQUNKOztTQVprQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiJzcmMvaGVscGVycy90aW1lLWF4aXMtbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQXhpc0xheWVyIGZyb20gJy4uL2F4aXMvYXhpcy1sYXllcic7XG5pbXBvcnQgVGlja3MgZnJvbSAnLi4vc2hhcGVzL3RpY2tzJztcbmltcG9ydCB0aW1lQXhpc0dlbmVyYXRvciBmcm9tICcuLi9heGlzL3RpbWUtYXhpcy1nZW5lcmF0b3InO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIGNyZWF0ZSBhIHRpbWUgYXhpcyBsYXllclxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLWF4aXMuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZUF4aXNMYXllciBleHRlbmRzIEF4aXNMYXllciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEFuIG9iamVjdCB0byBjb25maWd1cmUgdGhlIGxheWVyLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHsgY29sb3I6ICdzdGVlbGJsdWUnIH0sIG9wdGlvbnMpO1xuICAgIHN1cGVyKHRpbWVBeGlzR2VuZXJhdG9yKCksIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb25maWd1cmVTaGFwZShUaWNrcywge30sIHtcbiAgICAgIGNvbG9yOiBvcHRpb25zLmNvbG9yLFxuICAgICAgdW5jb25zdHJhaW5lZDogdHJ1ZVxuICAgIH0pO1xuICB9XG59XG4iXX0=