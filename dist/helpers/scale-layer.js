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

var _shapesScale = require('../shapes/scale');

var _shapesScale2 = _interopRequireDefault(_shapesScale);

/**
 * Helper to create a scale layer.
 *
 * [example usage](./examples/layer-scale.html)
 */

var ScaleLayer = (function (_Layer) {
  _inherits(ScaleLayer, _Layer);

  /**
   * @param {Object} options - An object to configure the layer.
   */

  function ScaleLayer() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ScaleLayer);

    var defaults = {
      background: '#ffffff',
      tickColor: 'red',
      textColor: 'red',
      hittable: false };

    // kind of pass through layer
    var data = {};

    options = _Object$assign(defaults, options);
    _get(Object.getPrototypeOf(ScaleLayer.prototype), 'constructor', this).call(this, 'entity', data, options);

    this.configureShape(_shapesScale2['default'], {}, {
      background: options.background,
      tickColor: options.tickColor,
      textColor: options.textColor
    });
  }

  return ScaleLayer;
})(_coreLayer2['default']);

exports['default'] = ScaleLayer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9oZWxwZXJzL3NjYWxlLWxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7eUJBQWtCLGVBQWU7Ozs7MkJBQ2YsaUJBQWlCOzs7Ozs7Ozs7O0lBUWQsVUFBVTtZQUFWLFVBQVU7Ozs7OztBQUlsQixXQUpRLFVBQVUsR0FJSDtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBSkwsVUFBVTs7QUFLM0IsUUFBTSxRQUFRLEdBQUc7QUFDZixnQkFBVSxFQUFFLFNBQVM7QUFDckIsZUFBUyxFQUFFLEtBQUs7QUFDaEIsZUFBUyxFQUFFLEtBQUs7QUFDaEIsY0FBUSxFQUFFLEtBQUssRUFDaEIsQ0FBQzs7O0FBRUYsUUFBTSxJQUFJLEdBQUcsRUFBRyxDQUFDOztBQUVqQixXQUFPLEdBQUcsZUFBYyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDM0MsK0JBZmlCLFVBQVUsNkNBZXJCLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFOztBQUUvQixRQUFJLENBQUMsY0FBYywyQkFBUSxFQUFHLEVBQUU7QUFDOUIsZ0JBQVUsRUFBRSxPQUFPLENBQUMsVUFBVTtBQUM5QixlQUFTLEVBQUUsT0FBTyxDQUFDLFNBQVM7QUFDNUIsZUFBUyxFQUFFLE9BQU8sQ0FBQyxTQUFTO0tBQzdCLENBQUMsQ0FBQztHQUNKOztTQXRCa0IsVUFBVTs7O3FCQUFWLFVBQVUiLCJmaWxlIjoic3JjL2hlbHBlcnMvc2NhbGUtbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5pbXBvcnQgU2NhbGUgZnJvbSAnLi4vc2hhcGVzL3NjYWxlJztcblxuXG4vKipcbiAqIEhlbHBlciB0byBjcmVhdGUgYSBzY2FsZSBsYXllci5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1zY2FsZS5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY2FsZUxheWVyIGV4dGVuZHMgTGF5ZXIge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBBbiBvYmplY3QgdG8gY29uZmlndXJlIHRoZSBsYXllci5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgYmFja2dyb3VuZDogJyNmZmZmZmYnLFxuICAgICAgdGlja0NvbG9yOiAncmVkJyxcbiAgICAgIHRleHRDb2xvcjogJ3JlZCcsXG4gICAgICBoaXR0YWJsZTogZmFsc2UsIC8vIGtpbmQgb2YgcGFzcyB0aHJvdWdoIGxheWVyXG4gICAgfTtcblxuICAgIGNvbnN0IGRhdGEgPSB7IH07XG5cbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgc3VwZXIoJ2VudGl0eScsIGRhdGEsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb25maWd1cmVTaGFwZShTY2FsZSwgeyB9LCB7XG4gICAgICBiYWNrZ3JvdW5kOiBvcHRpb25zLmJhY2tncm91bmQsXG4gICAgICB0aWNrQ29sb3I6IG9wdGlvbnMudGlja0NvbG9yLFxuICAgICAgdGV4dENvbG9yOiBvcHRpb25zLnRleHRDb2xvclxuICAgIH0pO1xuICB9XG59XG4iXX0=