'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreNamespace = require('../core/namespace');

var _coreNamespace2 = _interopRequireDefault(_coreNamespace);

/**
 * Is an abstract class or interface to be overriden in order to define new
 * shapes. Shapes define the way a given datum should be rendered, they are
 * the smallest unit of rendering into a timeline.
 *
 * All the life cycle of `Shape` instances is handled into the `Layer` instance
 * they are attach to. As a consequence, they should be mainly considered as
 * private objects. The only place they should be interacted with is in `Behavior`
 * definitions, to test which element of the shape is the target of the
 * interaction and define the interaction according to that test.
 *
 * Depending of its implementation a `Shape` can be used along with `entity` or
 * `collection` data type. Some shapes are then created to use data considered
 * as a single entity (Waveform, TracePath, Line), while others are defined to
 * be used with data seen as a collection, each shape rendering a single entry
 * of the collection. The shapes working with entity type data should therefore
 * be used in an `entity` configured `Layer`. Note that if they are registered
 * as "commonShape" in a `collection` type `Layer`, they will behave the exact
 * same way. These kind of shapes are noted: "entity shape".
 *
 * ### Available `collection` shapes:
 * - Marker / Annotated Marker
 * - Segment / Annotated Segment
 * - Dot
 * - TraceDots
 *
 * ### Available `entity` shapes:
 * - Line
 * - Tick (for axis)
 * - Waveform
 * - TracePath
 * - Matrix
 */

var BaseShape = (function () {
  /**
   * @param {Object} options - override default configuration
   */

  function BaseShape() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, BaseShape);

    /** @type {Element} - Svg element to be returned by the `render` method. */
    this.$el = null;
    /** @type {String} - Svg namespace. */
    this.ns = _coreNamespace2['default'];
    /** @type {Object} - Object containing the global parameters of the shape */
    this.params = _Object$assign({}, this._getDefaults(), options);
    // create accessors methods and set default accessor functions
    var accessors = this._getAccessorList();
    this._createAccessors(accessors);
    this._setDefaultAccessors(accessors);
  }

  /**
   * Destroy the shape and clean references. Interface method called from the `layer`.
   */

  _createClass(BaseShape, [{
    key: 'destroy',
    value: function destroy() {
      // this.group = null;
      this.$el = null;
    }

    /**
     * Interface method to override when extending this base class. The method
     * is called by the `Layer~render` method. Returns the name of the shape,
     * used as a class in the element group (defaults to `'shape'`).
     *
     * @return {String}
     */
  }, {
    key: 'getClassName',
    value: function getClassName() {
      return 'shape';
    }

    /**
     * @todo not implemented
     * allow to install defs in the track svg element. Should be called when
     * adding the `Layer` to the `Track`.
     */
    // setSvgDefinition(defs) {}

    /**
     * Returns the defaults for global configuration of the shape.
     * @protected
     * @return {Object}
     */
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {};
    }

    /**
     * Returns an object where keys are the accessors methods names to create
     * and values are the default values for each given accessor.
     *
     * @protected
     * @todo rename ?
     * @return {Object}
     */
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return {};
    }

    /**
     * Interface method called by Layer when creating a shape. Install the
     * given accessors on the shape, overriding the default accessors.
     *
     * @param {Object<String, function>} accessors
     */
  }, {
    key: 'install',
    value: function install(accessors) {
      for (var key in accessors) {
        this[key] = accessors[key];
      }
    }

    /**
     * Generic method to create accessors. Adds getters en setters to the
     * prototype if not already present.
     */
  }, {
    key: '_createAccessors',
    value: function _createAccessors(accessors) {
      this._accessors = {};
      // add it to the prototype
      var proto = Object.getPrototypeOf(this);
      // create a getter / setter for each accessors
      // setter : `this.x = callback`
      // getter : `this.x(datum)`
      _Object$keys(accessors).forEach(function (name) {
        if (proto.hasOwnProperty(name)) {
          return;
        }

        _Object$defineProperty(proto, name, {
          get: function get() {
            return this._accessors[name];
          },
          set: function set(func) {
            this._accessors[name] = func;
          }
        });
      });
    }

    /**
     * Create a function to be used as a default accessor for each accesors
     */
  }, {
    key: '_setDefaultAccessors',
    value: function _setDefaultAccessors(accessors) {
      var _this = this;

      _Object$keys(accessors).forEach(function (name) {
        var defaultValue = accessors[name];
        var accessor = function accessor(d) {
          var v = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

          if (v === null) {
            return d[name] || defaultValue;
          }
          d[name] = v;
        };
        // set accessor as the default one
        _this[name] = accessor;
      });
    }

    /**
     * Interface method called by `Layer~render`. Creates the DOM structure of
     * the shape.
     *
     * @param {Object} renderingContext - the renderingContext of the layer
     *    which owns this shape.
     * @return {Element} - the DOM element to insert in the item's group.
     */
  }, {
    key: 'render',
    value: function render(renderingContext) {}

    /**
     * Interface method called by `Layer~update`, only for shapes with
     * `entity` type.
     *
     * Called once for a given entity, to return any information derived
     * from it that will be used subsequently when rendering. If this
     * method returns a non-null object, then that object will be passed
     * to the update method subsequently instead of the original entity
     * datum. (If you want to retain access to the original entity,
     * stash it in your cache object as well. Otherwise it may be GC'd
     * if nobody else needs it.)
     *
     * @param {Object|Array} datum - Entity associated with this shape.
     * @return {Object} - Cache data (opaque to caller) to pass to
     *     `update` subsequently in place of the original entity datum.
     */
  }, {
    key: 'encache',
    value: function encache(datum) {
      return null;
    }

    /**
     * Interface method called by `Layer~update`. Updates the DOM structure of the shape.
     *
     * @param {Object} renderingContext - The `renderingContext` of the
     *    layer which owns this shape.
     * @param {Object|Array} datum - The datum or cache associated with
     *    the shape. If the shape has collection type, this will be the
     *    single item from the dataset that the shape is dedicated to
     *    displaying. If it has entity type, then this will be the
     *    object previously returned from the shape's `encache` method
     *    (if any), or else the entity object itself.
     */
  }, {
    key: 'update',
    value: function update(renderingContext, datumOrCache) {}

    /**
     * Interface method to override called by `Layer~getItemsInArea`. Defines if
     * the shape is considered to be the given area. Arguments are passed in pixel domain.
     *
     * @param {Object} renderingContext - the renderingContext of the layer which
     *    owns this shape.
     * @param {Object|Array} datum - The datum associated to the shape.
     * @param {Number} x1 - The x component of the top-left corner of the area to test.
     * @param {Number} y1 - The y component of the top-left corner of the area to test.
     * @param {Number} x2 - The x component of the bottom-right corner of the area to test.
     * @param {Number} y2 - The y component of the bottom-right corner of the area to test.
     * @return {Boolean} - Returns `true` if the is considered to be in the given area, `false` otherwise.
     */
  }, {
    key: 'inArea',
    value: function inArea(renderingContext, datum, x1, y1, x2, y2) {}

    /**
     * Interface method that returns a value or description for salient
     * features of the shape at the given x-coordinate (in time).
     *
     * The return value should be an array of objects each having
     * properties "value" (underlying value of datum at or nearest to
     * the given time), "unit" (unit of value as a string), and "cy"
     * (y-coord).
     */
  }, {
    key: 'describe',
    value: function describe(datum, x) {
      return [];
    }
  }]);

  return BaseShape;
})();

exports['default'] = BaseShape;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zaGFwZXMvYmFzZS1zaGFwZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7NkJBQWUsbUJBQW1COzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQW9DYixTQUFTOzs7OztBQUlqQixXQUpRLFNBQVMsR0FJRjtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBSkwsU0FBUzs7O0FBTTFCLFFBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDOztBQUVoQixRQUFJLENBQUMsRUFBRSw2QkFBSyxDQUFDOztBQUViLFFBQUksQ0FBQyxNQUFNLEdBQUcsZUFBYyxFQUFFLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDOztBQUU5RCxRQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztBQUMxQyxRQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDakMsUUFBSSxDQUFDLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0dBQ3RDOzs7Ozs7ZUFma0IsU0FBUzs7V0FvQnJCLG1CQUFHOztBQUVSLFVBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO0tBQ2pCOzs7Ozs7Ozs7OztXQVNXLHdCQUFHO0FBQUUsYUFBTyxPQUFPLENBQUM7S0FBRTs7Ozs7Ozs7Ozs7Ozs7OztXQWN0Qix3QkFBRztBQUNiLGFBQU8sRUFBRSxDQUFDO0tBQ1g7Ozs7Ozs7Ozs7OztXQVVlLDRCQUFHO0FBQUUsYUFBTyxFQUFFLENBQUM7S0FBRTs7Ozs7Ozs7OztXQVMxQixpQkFBQyxTQUFTLEVBQUU7QUFDakIsV0FBSyxJQUFJLEdBQUcsSUFBSSxTQUFTLEVBQUU7QUFBRSxZQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQUU7S0FDM0Q7Ozs7Ozs7O1dBTWUsMEJBQUMsU0FBUyxFQUFFO0FBQzFCLFVBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDOztBQUVyQixVQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDOzs7O0FBSTFDLG1CQUFZLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBSztBQUN2QyxZQUFJLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFBRSxpQkFBTztTQUFFOztBQUUzQywrQkFBc0IsS0FBSyxFQUFFLElBQUksRUFBRTtBQUNqQyxhQUFHLEVBQUUsZUFBVztBQUFFLG1CQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7V0FBRTtBQUNqRCxhQUFHLEVBQUUsYUFBUyxJQUFJLEVBQUU7QUFDbEIsZ0JBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO1dBQzlCO1NBQ0YsQ0FBQyxDQUFDO09BQ0osQ0FBQyxDQUFDO0tBQ0o7Ozs7Ozs7V0FLbUIsOEJBQUMsU0FBUyxFQUFFOzs7QUFDOUIsbUJBQVksU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ3ZDLFlBQU0sWUFBWSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNyQyxZQUFJLFFBQVEsR0FBRyxTQUFYLFFBQVEsQ0FBWSxDQUFDLEVBQVk7Y0FBVixDQUFDLHlEQUFHLElBQUk7O0FBQ2pDLGNBQUksQ0FBQyxLQUFLLElBQUksRUFBRTtBQUFFLG1CQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxZQUFZLENBQUM7V0FBRTtBQUNuRCxXQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2IsQ0FBQzs7QUFFRixjQUFLLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQztPQUN2QixDQUFDLENBQUM7S0FDSjs7Ozs7Ozs7Ozs7O1dBVUssZ0JBQUMsZ0JBQWdCLEVBQUUsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7V0FrQnBCLGlCQUFDLEtBQUssRUFBRTtBQUFFLGFBQU8sSUFBSSxDQUFDO0tBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7V0FjekIsZ0JBQUMsZ0JBQWdCLEVBQUUsWUFBWSxFQUFFLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7O1dBZW5DLGdCQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTs7Ozs7Ozs7Ozs7OztXQVcxQyxrQkFBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFO0FBQUUsYUFBTyxFQUFFLENBQUM7S0FBRTs7O1NBL0tkLFNBQVM7OztxQkFBVCxTQUFTIiwiZmlsZSI6InNyYy9zaGFwZXMvYmFzZS1zaGFwZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBucyBmcm9tICcuLi9jb3JlL25hbWVzcGFjZSc7XG5cblxuLyoqXG4gKiBJcyBhbiBhYnN0cmFjdCBjbGFzcyBvciBpbnRlcmZhY2UgdG8gYmUgb3ZlcnJpZGVuIGluIG9yZGVyIHRvIGRlZmluZSBuZXdcbiAqIHNoYXBlcy4gU2hhcGVzIGRlZmluZSB0aGUgd2F5IGEgZ2l2ZW4gZGF0dW0gc2hvdWxkIGJlIHJlbmRlcmVkLCB0aGV5IGFyZVxuICogdGhlIHNtYWxsZXN0IHVuaXQgb2YgcmVuZGVyaW5nIGludG8gYSB0aW1lbGluZS5cbiAqXG4gKiBBbGwgdGhlIGxpZmUgY3ljbGUgb2YgYFNoYXBlYCBpbnN0YW5jZXMgaXMgaGFuZGxlZCBpbnRvIHRoZSBgTGF5ZXJgIGluc3RhbmNlXG4gKiB0aGV5IGFyZSBhdHRhY2ggdG8uIEFzIGEgY29uc2VxdWVuY2UsIHRoZXkgc2hvdWxkIGJlIG1haW5seSBjb25zaWRlcmVkIGFzXG4gKiBwcml2YXRlIG9iamVjdHMuIFRoZSBvbmx5IHBsYWNlIHRoZXkgc2hvdWxkIGJlIGludGVyYWN0ZWQgd2l0aCBpcyBpbiBgQmVoYXZpb3JgXG4gKiBkZWZpbml0aW9ucywgdG8gdGVzdCB3aGljaCBlbGVtZW50IG9mIHRoZSBzaGFwZSBpcyB0aGUgdGFyZ2V0IG9mIHRoZVxuICogaW50ZXJhY3Rpb24gYW5kIGRlZmluZSB0aGUgaW50ZXJhY3Rpb24gYWNjb3JkaW5nIHRvIHRoYXQgdGVzdC5cbiAqXG4gKiBEZXBlbmRpbmcgb2YgaXRzIGltcGxlbWVudGF0aW9uIGEgYFNoYXBlYCBjYW4gYmUgdXNlZCBhbG9uZyB3aXRoIGBlbnRpdHlgIG9yXG4gKiBgY29sbGVjdGlvbmAgZGF0YSB0eXBlLiBTb21lIHNoYXBlcyBhcmUgdGhlbiBjcmVhdGVkIHRvIHVzZSBkYXRhIGNvbnNpZGVyZWRcbiAqIGFzIGEgc2luZ2xlIGVudGl0eSAoV2F2ZWZvcm0sIFRyYWNlUGF0aCwgTGluZSksIHdoaWxlIG90aGVycyBhcmUgZGVmaW5lZCB0b1xuICogYmUgdXNlZCB3aXRoIGRhdGEgc2VlbiBhcyBhIGNvbGxlY3Rpb24sIGVhY2ggc2hhcGUgcmVuZGVyaW5nIGEgc2luZ2xlIGVudHJ5XG4gKiBvZiB0aGUgY29sbGVjdGlvbi4gVGhlIHNoYXBlcyB3b3JraW5nIHdpdGggZW50aXR5IHR5cGUgZGF0YSBzaG91bGQgdGhlcmVmb3JlXG4gKiBiZSB1c2VkIGluIGFuIGBlbnRpdHlgIGNvbmZpZ3VyZWQgYExheWVyYC4gTm90ZSB0aGF0IGlmIHRoZXkgYXJlIHJlZ2lzdGVyZWRcbiAqIGFzIFwiY29tbW9uU2hhcGVcIiBpbiBhIGBjb2xsZWN0aW9uYCB0eXBlIGBMYXllcmAsIHRoZXkgd2lsbCBiZWhhdmUgdGhlIGV4YWN0XG4gKiBzYW1lIHdheS4gVGhlc2Uga2luZCBvZiBzaGFwZXMgYXJlIG5vdGVkOiBcImVudGl0eSBzaGFwZVwiLlxuICpcbiAqICMjIyBBdmFpbGFibGUgYGNvbGxlY3Rpb25gIHNoYXBlczpcbiAqIC0gTWFya2VyIC8gQW5ub3RhdGVkIE1hcmtlclxuICogLSBTZWdtZW50IC8gQW5ub3RhdGVkIFNlZ21lbnRcbiAqIC0gRG90XG4gKiAtIFRyYWNlRG90c1xuICpcbiAqICMjIyBBdmFpbGFibGUgYGVudGl0eWAgc2hhcGVzOlxuICogLSBMaW5lXG4gKiAtIFRpY2sgKGZvciBheGlzKVxuICogLSBXYXZlZm9ybVxuICogLSBUcmFjZVBhdGhcbiAqIC0gTWF0cml4XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VTaGFwZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIG92ZXJyaWRlIGRlZmF1bHQgY29uZmlndXJhdGlvblxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgLyoqIEB0eXBlIHtFbGVtZW50fSAtIFN2ZyBlbGVtZW50IHRvIGJlIHJldHVybmVkIGJ5IHRoZSBgcmVuZGVyYCBtZXRob2QuICovXG4gICAgdGhpcy4kZWwgPSBudWxsO1xuICAgIC8qKiBAdHlwZSB7U3RyaW5nfSAtIFN2ZyBuYW1lc3BhY2UuICovXG4gICAgdGhpcy5ucyA9IG5zO1xuICAgIC8qKiBAdHlwZSB7T2JqZWN0fSAtIE9iamVjdCBjb250YWluaW5nIHRoZSBnbG9iYWwgcGFyYW1ldGVycyBvZiB0aGUgc2hhcGUgKi9cbiAgICB0aGlzLnBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuX2dldERlZmF1bHRzKCksIG9wdGlvbnMpO1xuICAgIC8vIGNyZWF0ZSBhY2Nlc3NvcnMgbWV0aG9kcyBhbmQgc2V0IGRlZmF1bHQgYWNjZXNzb3IgZnVuY3Rpb25zXG4gICAgY29uc3QgYWNjZXNzb3JzID0gdGhpcy5fZ2V0QWNjZXNzb3JMaXN0KCk7XG4gICAgdGhpcy5fY3JlYXRlQWNjZXNzb3JzKGFjY2Vzc29ycyk7XG4gICAgdGhpcy5fc2V0RGVmYXVsdEFjY2Vzc29ycyhhY2Nlc3NvcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlc3Ryb3kgdGhlIHNoYXBlIGFuZCBjbGVhbiByZWZlcmVuY2VzLiBJbnRlcmZhY2UgbWV0aG9kIGNhbGxlZCBmcm9tIHRoZSBgbGF5ZXJgLlxuICAgKi9cbiAgZGVzdHJveSgpIHtcbiAgICAvLyB0aGlzLmdyb3VwID0gbnVsbDtcbiAgICB0aGlzLiRlbCA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogSW50ZXJmYWNlIG1ldGhvZCB0byBvdmVycmlkZSB3aGVuIGV4dGVuZGluZyB0aGlzIGJhc2UgY2xhc3MuIFRoZSBtZXRob2RcbiAgICogaXMgY2FsbGVkIGJ5IHRoZSBgTGF5ZXJ+cmVuZGVyYCBtZXRob2QuIFJldHVybnMgdGhlIG5hbWUgb2YgdGhlIHNoYXBlLFxuICAgKiB1c2VkIGFzIGEgY2xhc3MgaW4gdGhlIGVsZW1lbnQgZ3JvdXAgKGRlZmF1bHRzIHRvIGAnc2hhcGUnYCkuXG4gICAqXG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICovXG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICdzaGFwZSc7IH1cblxuICAvKipcbiAgICogQHRvZG8gbm90IGltcGxlbWVudGVkXG4gICAqIGFsbG93IHRvIGluc3RhbGwgZGVmcyBpbiB0aGUgdHJhY2sgc3ZnIGVsZW1lbnQuIFNob3VsZCBiZSBjYWxsZWQgd2hlblxuICAgKiBhZGRpbmcgdGhlIGBMYXllcmAgdG8gdGhlIGBUcmFja2AuXG4gICAqL1xuICAvLyBzZXRTdmdEZWZpbml0aW9uKGRlZnMpIHt9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGRlZmF1bHRzIGZvciBnbG9iYWwgY29uZmlndXJhdGlvbiBvZiB0aGUgc2hhcGUuXG4gICAqIEBwcm90ZWN0ZWRcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIG9iamVjdCB3aGVyZSBrZXlzIGFyZSB0aGUgYWNjZXNzb3JzIG1ldGhvZHMgbmFtZXMgdG8gY3JlYXRlXG4gICAqIGFuZCB2YWx1ZXMgYXJlIHRoZSBkZWZhdWx0IHZhbHVlcyBmb3IgZWFjaCBnaXZlbiBhY2Nlc3Nvci5cbiAgICpcbiAgICogQHByb3RlY3RlZFxuICAgKiBAdG9kbyByZW5hbWUgP1xuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqL1xuICBfZ2V0QWNjZXNzb3JMaXN0KCkgeyByZXR1cm4ge307IH1cblxuXG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgbWV0aG9kIGNhbGxlZCBieSBMYXllciB3aGVuIGNyZWF0aW5nIGEgc2hhcGUuIEluc3RhbGwgdGhlXG4gICAqIGdpdmVuIGFjY2Vzc29ycyBvbiB0aGUgc2hhcGUsIG92ZXJyaWRpbmcgdGhlIGRlZmF1bHQgYWNjZXNzb3JzLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdDxTdHJpbmcsIGZ1bmN0aW9uPn0gYWNjZXNzb3JzXG4gICAqL1xuICBpbnN0YWxsKGFjY2Vzc29ycykge1xuICAgIGZvciAobGV0IGtleSBpbiBhY2Nlc3NvcnMpIHsgdGhpc1trZXldID0gYWNjZXNzb3JzW2tleV07IH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmljIG1ldGhvZCB0byBjcmVhdGUgYWNjZXNzb3JzLiBBZGRzIGdldHRlcnMgZW4gc2V0dGVycyB0byB0aGVcbiAgICogcHJvdG90eXBlIGlmIG5vdCBhbHJlYWR5IHByZXNlbnQuXG4gICAqL1xuICBfY3JlYXRlQWNjZXNzb3JzKGFjY2Vzc29ycykge1xuICAgIHRoaXMuX2FjY2Vzc29ycyA9IHt9O1xuICAgIC8vIGFkZCBpdCB0byB0aGUgcHJvdG90eXBlXG4gICAgY29uc3QgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpcyk7XG4gICAgLy8gY3JlYXRlIGEgZ2V0dGVyIC8gc2V0dGVyIGZvciBlYWNoIGFjY2Vzc29yc1xuICAgIC8vIHNldHRlciA6IGB0aGlzLnggPSBjYWxsYmFja2BcbiAgICAvLyBnZXR0ZXIgOiBgdGhpcy54KGRhdHVtKWBcbiAgICBPYmplY3Qua2V5cyhhY2Nlc3NvcnMpLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgIGlmIChwcm90by5oYXNPd25Qcm9wZXJ0eShuYW1lKSkgeyByZXR1cm47IH1cblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3RvLCBuYW1lLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl9hY2Nlc3NvcnNbbmFtZV07IH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24oZnVuYykge1xuICAgICAgICAgIHRoaXMuX2FjY2Vzc29yc1tuYW1lXSA9IGZ1bmM7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIGZ1bmN0aW9uIHRvIGJlIHVzZWQgYXMgYSBkZWZhdWx0IGFjY2Vzc29yIGZvciBlYWNoIGFjY2Vzb3JzXG4gICAqL1xuICBfc2V0RGVmYXVsdEFjY2Vzc29ycyhhY2Nlc3NvcnMpIHtcbiAgICBPYmplY3Qua2V5cyhhY2Nlc3NvcnMpLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgIGNvbnN0IGRlZmF1bHRWYWx1ZSA9IGFjY2Vzc29yc1tuYW1lXTtcbiAgICAgIGxldCBhY2Nlc3NvciA9IGZ1bmN0aW9uKGQsIHYgPSBudWxsKSB7XG4gICAgICAgIGlmICh2ID09PSBudWxsKSB7IHJldHVybiBkW25hbWVdIHx8IGRlZmF1bHRWYWx1ZTsgfVxuICAgICAgICBkW25hbWVdID0gdjtcbiAgICAgIH07XG4gICAgICAvLyBzZXQgYWNjZXNzb3IgYXMgdGhlIGRlZmF1bHQgb25lXG4gICAgICB0aGlzW25hbWVdID0gYWNjZXNzb3I7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSW50ZXJmYWNlIG1ldGhvZCBjYWxsZWQgYnkgYExheWVyfnJlbmRlcmAuIENyZWF0ZXMgdGhlIERPTSBzdHJ1Y3R1cmUgb2ZcbiAgICogdGhlIHNoYXBlLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcmVuZGVyaW5nQ29udGV4dCAtIHRoZSByZW5kZXJpbmdDb250ZXh0IG9mIHRoZSBsYXllclxuICAgKiAgICB3aGljaCBvd25zIHRoaXMgc2hhcGUuXG4gICAqIEByZXR1cm4ge0VsZW1lbnR9IC0gdGhlIERPTSBlbGVtZW50IHRvIGluc2VydCBpbiB0aGUgaXRlbSdzIGdyb3VwLlxuICAgKi9cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHt9XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgY2FsbGVkIGJ5IGBMYXllcn51cGRhdGVgLCBvbmx5IGZvciBzaGFwZXMgd2l0aFxuICAgKiBgZW50aXR5YCB0eXBlLlxuICAgKlxuICAgKiBDYWxsZWQgb25jZSBmb3IgYSBnaXZlbiBlbnRpdHksIHRvIHJldHVybiBhbnkgaW5mb3JtYXRpb24gZGVyaXZlZFxuICAgKiBmcm9tIGl0IHRoYXQgd2lsbCBiZSB1c2VkIHN1YnNlcXVlbnRseSB3aGVuIHJlbmRlcmluZy4gSWYgdGhpc1xuICAgKiBtZXRob2QgcmV0dXJucyBhIG5vbi1udWxsIG9iamVjdCwgdGhlbiB0aGF0IG9iamVjdCB3aWxsIGJlIHBhc3NlZFxuICAgKiB0byB0aGUgdXBkYXRlIG1ldGhvZCBzdWJzZXF1ZW50bHkgaW5zdGVhZCBvZiB0aGUgb3JpZ2luYWwgZW50aXR5XG4gICAqIGRhdHVtLiAoSWYgeW91IHdhbnQgdG8gcmV0YWluIGFjY2VzcyB0byB0aGUgb3JpZ2luYWwgZW50aXR5LFxuICAgKiBzdGFzaCBpdCBpbiB5b3VyIGNhY2hlIG9iamVjdCBhcyB3ZWxsLiBPdGhlcndpc2UgaXQgbWF5IGJlIEdDJ2RcbiAgICogaWYgbm9ib2R5IGVsc2UgbmVlZHMgaXQuKVxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdHxBcnJheX0gZGF0dW0gLSBFbnRpdHkgYXNzb2NpYXRlZCB3aXRoIHRoaXMgc2hhcGUuXG4gICAqIEByZXR1cm4ge09iamVjdH0gLSBDYWNoZSBkYXRhIChvcGFxdWUgdG8gY2FsbGVyKSB0byBwYXNzIHRvXG4gICAqICAgICBgdXBkYXRlYCBzdWJzZXF1ZW50bHkgaW4gcGxhY2Ugb2YgdGhlIG9yaWdpbmFsIGVudGl0eSBkYXR1bS5cbiAgICovXG4gIGVuY2FjaGUoZGF0dW0pIHsgcmV0dXJuIG51bGw7IH1cbiAgICBcbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgY2FsbGVkIGJ5IGBMYXllcn51cGRhdGVgLiBVcGRhdGVzIHRoZSBET00gc3RydWN0dXJlIG9mIHRoZSBzaGFwZS5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHJlbmRlcmluZ0NvbnRleHQgLSBUaGUgYHJlbmRlcmluZ0NvbnRleHRgIG9mIHRoZVxuICAgKiAgICBsYXllciB3aGljaCBvd25zIHRoaXMgc2hhcGUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBkYXR1bSAtIFRoZSBkYXR1bSBvciBjYWNoZSBhc3NvY2lhdGVkIHdpdGhcbiAgICogICAgdGhlIHNoYXBlLiBJZiB0aGUgc2hhcGUgaGFzIGNvbGxlY3Rpb24gdHlwZSwgdGhpcyB3aWxsIGJlIHRoZVxuICAgKiAgICBzaW5nbGUgaXRlbSBmcm9tIHRoZSBkYXRhc2V0IHRoYXQgdGhlIHNoYXBlIGlzIGRlZGljYXRlZCB0b1xuICAgKiAgICBkaXNwbGF5aW5nLiBJZiBpdCBoYXMgZW50aXR5IHR5cGUsIHRoZW4gdGhpcyB3aWxsIGJlIHRoZVxuICAgKiAgICBvYmplY3QgcHJldmlvdXNseSByZXR1cm5lZCBmcm9tIHRoZSBzaGFwZSdzIGBlbmNhY2hlYCBtZXRob2RcbiAgICogICAgKGlmIGFueSksIG9yIGVsc2UgdGhlIGVudGl0eSBvYmplY3QgaXRzZWxmLlxuICAgKi9cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtT3JDYWNoZSkge31cblxuICAvKipcbiAgICogSW50ZXJmYWNlIG1ldGhvZCB0byBvdmVycmlkZSBjYWxsZWQgYnkgYExheWVyfmdldEl0ZW1zSW5BcmVhYC4gRGVmaW5lcyBpZlxuICAgKiB0aGUgc2hhcGUgaXMgY29uc2lkZXJlZCB0byBiZSB0aGUgZ2l2ZW4gYXJlYS4gQXJndW1lbnRzIGFyZSBwYXNzZWQgaW4gcGl4ZWwgZG9tYWluLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcmVuZGVyaW5nQ29udGV4dCAtIHRoZSByZW5kZXJpbmdDb250ZXh0IG9mIHRoZSBsYXllciB3aGljaFxuICAgKiAgICBvd25zIHRoaXMgc2hhcGUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBkYXR1bSAtIFRoZSBkYXR1bSBhc3NvY2lhdGVkIHRvIHRoZSBzaGFwZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHgxIC0gVGhlIHggY29tcG9uZW50IG9mIHRoZSB0b3AtbGVmdCBjb3JuZXIgb2YgdGhlIGFyZWEgdG8gdGVzdC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHkxIC0gVGhlIHkgY29tcG9uZW50IG9mIHRoZSB0b3AtbGVmdCBjb3JuZXIgb2YgdGhlIGFyZWEgdG8gdGVzdC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHgyIC0gVGhlIHggY29tcG9uZW50IG9mIHRoZSBib3R0b20tcmlnaHQgY29ybmVyIG9mIHRoZSBhcmVhIHRvIHRlc3QuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB5MiAtIFRoZSB5IGNvbXBvbmVudCBvZiB0aGUgYm90dG9tLXJpZ2h0IGNvcm5lciBvZiB0aGUgYXJlYSB0byB0ZXN0LlxuICAgKiBAcmV0dXJuIHtCb29sZWFufSAtIFJldHVybnMgYHRydWVgIGlmIHRoZSBpcyBjb25zaWRlcmVkIHRvIGJlIGluIHRoZSBnaXZlbiBhcmVhLCBgZmFsc2VgIG90aGVyd2lzZS5cbiAgICovXG4gIGluQXJlYShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSwgeDEsIHkxLCB4MiwgeTIpIHt9XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgdGhhdCByZXR1cm5zIGEgdmFsdWUgb3IgZGVzY3JpcHRpb24gZm9yIHNhbGllbnRcbiAgICogZmVhdHVyZXMgb2YgdGhlIHNoYXBlIGF0IHRoZSBnaXZlbiB4LWNvb3JkaW5hdGUgKGluIHRpbWUpLlxuICAgKlxuICAgKiBUaGUgcmV0dXJuIHZhbHVlIHNob3VsZCBiZSBhbiBhcnJheSBvZiBvYmplY3RzIGVhY2ggaGF2aW5nXG4gICAqIHByb3BlcnRpZXMgXCJ2YWx1ZVwiICh1bmRlcmx5aW5nIHZhbHVlIG9mIGRhdHVtIGF0IG9yIG5lYXJlc3QgdG9cbiAgICogdGhlIGdpdmVuIHRpbWUpLCBcInVuaXRcIiAodW5pdCBvZiB2YWx1ZSBhcyBhIHN0cmluZyksIGFuZCBcImN5XCJcbiAgICogKHktY29vcmQpLlxuICAgKi9cbiAgZGVzY3JpYmUoZGF0dW0sIHgpIHsgcmV0dXJuIFtdOyB9XG59XG4iXX0=