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

var _shapesTicks = require('../shapes/ticks');

var _shapesTicks2 = _interopRequireDefault(_shapesTicks);

/**
 * Helper to create a tick layer. Can be seen as a grid axis with user defined data
 * or as a marker layer with entity based data.
 */

var TickLayer = (function (_Layer) {
  _inherits(TickLayer, _Layer);

  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */

  function TickLayer(data, options, accessors) {
    _classCallCheck(this, TickLayer);

    options = _Object$assign({}, options);

    _get(Object.getPrototypeOf(TickLayer.prototype), 'constructor', this).call(this, 'entity', data, options);

    this.configureShape(_shapesTicks2['default'], accessors, options);
  }

  return TickLayer;
})(_coreLayer2['default']);

exports['default'] = TickLayer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9oZWxwZXJzL3RpY2stbGF5ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFBa0IsZUFBZTs7OzsyQkFDZixpQkFBaUI7Ozs7Ozs7OztJQU9kLFNBQVM7WUFBVCxTQUFTOzs7Ozs7Ozs7QUFPakIsV0FQUSxTQUFTLENBT2hCLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFOzBCQVBuQixTQUFTOztBQVExQixXQUFPLEdBQUcsZUFBYyxFQUV2QixFQUFFLE9BQU8sQ0FBQyxDQUFDOztBQUVaLCtCQVppQixTQUFTLDZDQVlwQixRQUFRLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTs7QUFFL0IsUUFBSSxDQUFDLGNBQWMsMkJBQVEsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0dBQ2hEOztTQWZrQixTQUFTOzs7cUJBQVQsU0FBUyIsImZpbGUiOiJzcmMvaGVscGVycy90aWNrLWxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExheWVyIGZyb20gJy4uL2NvcmUvbGF5ZXInO1xuaW1wb3J0IFRpY2tzIGZyb20gJy4uL3NoYXBlcy90aWNrcyc7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gY3JlYXRlIGEgdGljayBsYXllci4gQ2FuIGJlIHNlZW4gYXMgYSBncmlkIGF4aXMgd2l0aCB1c2VyIGRlZmluZWQgZGF0YVxuICogb3IgYXMgYSBtYXJrZXIgbGF5ZXIgd2l0aCBlbnRpdHkgYmFzZWQgZGF0YS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGlja0xheWVyIGV4dGVuZHMgTGF5ZXIge1xuICAvKipcbiAgICogQHBhcmFtIHtBcnJheX0gZGF0YSAtIFRoZSBkYXRhIHRvIHJlbmRlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBBbiBvYmplY3QgdG8gY29uZmlndXJlIHRoZSBsYXllci5cbiAgICogQHBhcmFtIHtPYmplY3R9IGFjY2Vzc29ycyAtIFRoZSBhY2Nlc3NvcnMgdG8gY29uZmlndXJlIHRoZSBtYXBwaW5nXG4gICAqICAgIGJldHdlZW4gc2hhcGVzIGFuZCBkYXRhLlxuICAgKi9cbiAgY29uc3RydWN0b3IoZGF0YSwgb3B0aW9ucywgYWNjZXNzb3JzKSB7XG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICBzdXBlcignZW50aXR5JywgZGF0YSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmNvbmZpZ3VyZVNoYXBlKFRpY2tzLCBhY2Nlc3NvcnMsIG9wdGlvbnMpO1xuICB9XG59XG4iXX0=