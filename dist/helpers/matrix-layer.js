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

var _shapesMatrix = require('../shapes/matrix');

var _shapesMatrix2 = _interopRequireDefault(_shapesMatrix);

var defaults = {
  normalise: 'none',
  gain: 1.0,
  channel: 0
};

/**
 * Helper to create a matrix layer.
 */

var MatrixLayer = (function (_Layer) {
  _inherits(MatrixLayer, _Layer);

  /**
   * @param {AudioBuffer} buffer - The audio buffer to display.
   * @param {Object} options - An object to configure the layer.
   */

  function MatrixLayer(matrixEntity, options) {
    _classCallCheck(this, MatrixLayer);

    options = _Object$assign({}, defaults, options);

    _get(Object.getPrototypeOf(MatrixLayer.prototype), 'constructor', this).call(this, 'entity', matrixEntity, options);

    this.configureShape(_shapesMatrix2['default'], {}, options);
  }

  return MatrixLayer;
})(_coreLayer2['default']);

exports['default'] = MatrixLayer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9oZWxwZXJzL21hdHJpeC1sYXllci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3lCQUFrQixlQUFlOzs7OzRCQUNkLGtCQUFrQjs7OztBQUVyQyxJQUFNLFFBQVEsR0FBRztBQUNmLFdBQVMsRUFBRSxNQUFNO0FBQ2pCLE1BQUksRUFBRSxHQUFHO0FBQ1QsU0FBTyxFQUFFLENBQUM7Q0FDWCxDQUFDOzs7Ozs7SUFLbUIsV0FBVztZQUFYLFdBQVc7Ozs7Ozs7QUFLbkIsV0FMUSxXQUFXLENBS2xCLFlBQVksRUFBRSxPQUFPLEVBQUU7MEJBTGhCLFdBQVc7O0FBTzVCLFdBQU8sR0FBRyxlQUFjLEVBQUUsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRS9DLCtCQVRpQixXQUFXLDZDQVN0QixRQUFRLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRTs7QUFFdkMsUUFBSSxDQUFDLGNBQWMsNEJBQVMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0dBQzFDOztTQVprQixXQUFXOzs7cUJBQVgsV0FBVyIsImZpbGUiOiJzcmMvaGVscGVycy9tYXRyaXgtbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5pbXBvcnQgTWF0cml4IGZyb20gJy4uL3NoYXBlcy9tYXRyaXgnO1xuXG5jb25zdCBkZWZhdWx0cyA9IHtcbiAgbm9ybWFsaXNlOiAnbm9uZScsXG4gIGdhaW46IDEuMCxcbiAgY2hhbm5lbDogMFxufTtcblxuLyoqXG4gKiBIZWxwZXIgdG8gY3JlYXRlIGEgbWF0cml4IGxheWVyLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXRyaXhMYXllciBleHRlbmRzIExheWVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7QXVkaW9CdWZmZXJ9IGJ1ZmZlciAtIFRoZSBhdWRpbyBidWZmZXIgdG8gZGlzcGxheS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBBbiBvYmplY3QgdG8gY29uZmlndXJlIHRoZSBsYXllci5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG1hdHJpeEVudGl0eSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcblxuICAgIHN1cGVyKCdlbnRpdHknLCBtYXRyaXhFbnRpdHksIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb25maWd1cmVTaGFwZShNYXRyaXgsIHt9LCBvcHRpb25zKTtcbiAgfVxufVxuIl19