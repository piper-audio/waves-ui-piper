'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreNamespace = require('../core/namespace');

var _coreNamespace2 = _interopRequireDefault(_coreNamespace);

var _coreLayer = require('../core/layer');

var _coreLayer2 = _interopRequireDefault(_coreLayer);

var _utilsScales = require('../utils/scales');

var _utilsScales2 = _interopRequireDefault(_utilsScales);

/**
 * Simplified Layer for Axis. The main difference with a regular layer is that
 * an axis layer use the `Timeline~timeContext` attributes to render it's layout
 * and stay synchronized with the tracks visible area. All getters and setters
 * to the `TimelineTimeContext` attributes are bypassed.
 *
 * It also handle it's own data and its updates. The `_generateData` method is
 * responsible to create some usefull data to visualize
 *
 * [example usage of the layer-axis](./examples/layer-axis.html)
 */

var AxisLayer = (function (_Layer) {
  _inherits(AxisLayer, _Layer);

  /**
   * @param {Function} generator - A function to create data according to
   *    the `Timeline~timeContext`.
   * @param {Object} options - Layer options, cf. Layer for available options.
   */

  function AxisLayer(generator, options) {
    _classCallCheck(this, AxisLayer);

    _get(Object.getPrototypeOf(AxisLayer.prototype), 'constructor', this).call(this, 'entity', [], options);
    this._generator = generator;
  }

  /** @private */

  _createClass(AxisLayer, [{
    key: '_generateData',

    /**
     * This method is the main difference with a classical layer. An `AxisLayer`
     * instance generates and maintains it's own data.
     */
    value: function _generateData() {
      var data = this._generator(this.timeContext);
      // prepend first arguments of splice for an apply
      data.unshift(0, this.data[0].length);
      // make sure to keep the same reference
      Array.prototype.splice.apply(this.data[0], data);
    }

    /**
     * Updates the rendering context for the shapes.
     */
  }, {
    key: '_updateRenderingContext',
    value: function _updateRenderingContext() {

      var viewStartTime = -this.timeContext.offset;

      this._renderingContext.timeToPixel = _utilsScales2['default'].linear().domain([viewStartTime, viewStartTime + 1]).range([0, this.timeContext.timeToPixel(1)]);

      this._renderingContext.minX = 0;

      this._renderingContext.visibleWidth = this.timeContext.visibleWidth;
      this._renderingContext.width = this._renderingContext.visibleWidth;
      this._renderingContext.maxX = this._renderingContext.visibleWidth;

      this._renderingContext.height = this.params.height;
      this._renderingContext.valueToPixel = this._valueToPixel;
    }

    /**
     * Generates the data and update the layer.
     */
  }, {
    key: 'update',
    value: function update() {
      this._generateData();
      _get(Object.getPrototypeOf(AxisLayer.prototype), 'update', this).call(this);
    }

    /**
     * Render the DOM in memory on layer creation to be able to use it before
     * the layer is actually inserted in the DOM
     */
  }, {
    key: '_renderContainer',
    value: function _renderContainer() {
      // wrapper group for `start, top and context flip matrix
      this.$el = document.createElementNS(_coreNamespace2['default'], 'g');
      if (this.params.className !== null) {
        this.$el.classList.add('layer', this.params.className);
      }

      // group to contain layer items
      this.$maingroup = document.createElementNS(_coreNamespace2['default'], 'g');
      this.$maingroup.classList.add('maingroup', 'items');
      // layer background
      this.$background = document.createElementNS(_coreNamespace2['default'], 'rect');
      this.$background.setAttributeNS(null, 'height', '100%');
      this.$background.classList.add('background');
      this.$background.style.fillOpacity = 0;
      this.$background.style.pointerEvents = 'none';
      // create the DOM tree
      this.$el.appendChild(this.$maingroup);
      this.$maingroup.appendChild(this.$background);
    }

    /**
     * Updates the layout of the layer.
     */
  }, {
    key: '_updateContainer',
    value: function _updateContainer() {
      this._updateRenderingContext();

      var top = this.params.top;
      var height = this.params.height;
      // matrix to invert the coordinate system
      var translateMatrix = 'matrix(1, 0, 0, -1, 0, ' + (top + height) + ')';
      this.$el.setAttributeNS(null, 'transform', translateMatrix);

      this.$background.setAttributeNS(null, 'width', height);
    }
  }, {
    key: 'stretchRatio',
    set: function set(value) {
      return;
    },

    /** @private */

    /** @private */
    get: function get() {
      return;
    }

    /** @private */
  }, {
    key: 'offset',
    set: function set(value) {
      return;
    },

    /** @private */
    get: function get() {
      return;
    }

    /** @private */
  }, {
    key: 'start',
    set: function set(value) {
      return;
    },

    /** @private */
    get: function get() {
      return;
    }

    /** @private */
  }, {
    key: 'duration',
    set: function set(value) {
      return;
    },
    get: function get() {
      return;
    }

    /**
     * The generator that creates the data to be rendered to display the axis.
     *
     * @type {Function}
     */
  }, {
    key: 'generator',
    set: function set(func) {
      this._generator = func;
    },

    /**
     * The generator that creates the data to be rendered to display the axis.
     *
     * @type {Function}
     */
    get: function get() {
      return this._generator;
    }
  }]);

  return AxisLayer;
})(_coreLayer2['default']);

exports['default'] = AxisLayer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9heGlzL2F4aXMtbGF5ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs2QkFBZSxtQkFBbUI7Ozs7eUJBQ2hCLGVBQWU7Ozs7MkJBQ2QsaUJBQWlCOzs7Ozs7Ozs7Ozs7Ozs7O0lBY2YsU0FBUztZQUFULFNBQVM7Ozs7Ozs7O0FBTWpCLFdBTlEsU0FBUyxDQU1oQixTQUFTLEVBQUUsT0FBTyxFQUFFOzBCQU5iLFNBQVM7O0FBTzFCLCtCQVBpQixTQUFTLDZDQU9wQixRQUFRLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRTtBQUM3QixRQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztHQUM3Qjs7OztlQVRrQixTQUFTOzs7Ozs7O1dBbURmLHlCQUFHO0FBQ2QsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRS9DLFVBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRXJDLFdBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ2xEOzs7Ozs7O1dBS3NCLG1DQUFHOztBQUV4QixVQUFNLGFBQWEsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDOztBQUUvQyxVQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxHQUFHLHlCQUFPLE1BQU0sRUFBRSxDQUNqRCxNQUFNLENBQUMsQ0FBQyxhQUFhLEVBQUUsYUFBYSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQzFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRS9DLFVBQUksQ0FB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QUUsYUFBTztLQUFFOzs7OztTQU5YLGFBQUMsS0FBSyxFQUFFO0FBQUUsYUFBTztLQUFFO1NBUW5CLGVBQUc7QUFBRSxhQUFPO0tBQUU7Ozs7Ozs7OztTQVFiLGFBQUMsSUFBSSxFQUFFO0FBQ2xCLFVBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0tBQ3hCOzs7Ozs7O1NBT1ksZUFBRztBQUNkLGFBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztLQUN4Qjs7O1NBN0NrQixTQUFTOzs7cUJBQVQsU0FBUyIsImZpbGUiOiJzcmMvYXhpcy9heGlzLWxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG5zIGZyb20gJy4uL2NvcmUvbmFtZXNwYWNlJztcbmltcG9ydCBMYXllciBmcm9tICcuLi9jb3JlL2xheWVyJztcbmltcG9ydCBzY2FsZXMgZnJvbSAnLi4vdXRpbHMvc2NhbGVzJztcblxuXG4vKipcbiAqIFNpbXBsaWZpZWQgTGF5ZXIgZm9yIEF4aXMuIFRoZSBtYWluIGRpZmZlcmVuY2Ugd2l0aCBhIHJlZ3VsYXIgbGF5ZXIgaXMgdGhhdFxuICogYW4gYXhpcyBsYXllciB1c2UgdGhlIGBUaW1lbGluZX50aW1lQ29udGV4dGAgYXR0cmlidXRlcyB0byByZW5kZXIgaXQncyBsYXlvdXRcbiAqIGFuZCBzdGF5IHN5bmNocm9uaXplZCB3aXRoIHRoZSB0cmFja3MgdmlzaWJsZSBhcmVhLiBBbGwgZ2V0dGVycyBhbmQgc2V0dGVyc1xuICogdG8gdGhlIGBUaW1lbGluZVRpbWVDb250ZXh0YCBhdHRyaWJ1dGVzIGFyZSBieXBhc3NlZC5cbiAqXG4gKiBJdCBhbHNvIGhhbmRsZSBpdCdzIG93biBkYXRhIGFuZCBpdHMgdXBkYXRlcy4gVGhlIGBfZ2VuZXJhdGVEYXRhYCBtZXRob2QgaXNcbiAqIHJlc3BvbnNpYmxlIHRvIGNyZWF0ZSBzb21lIHVzZWZ1bGwgZGF0YSB0byB2aXN1YWxpemVcbiAqXG4gKiBbZXhhbXBsZSB1c2FnZSBvZiB0aGUgbGF5ZXItYXhpc10oLi9leGFtcGxlcy9sYXllci1heGlzLmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF4aXNMYXllciBleHRlbmRzIExheWVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGdlbmVyYXRvciAtIEEgZnVuY3Rpb24gdG8gY3JlYXRlIGRhdGEgYWNjb3JkaW5nIHRvXG4gICAqICAgIHRoZSBgVGltZWxpbmV+dGltZUNvbnRleHRgLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIExheWVyIG9wdGlvbnMsIGNmLiBMYXllciBmb3IgYXZhaWxhYmxlIG9wdGlvbnMuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihnZW5lcmF0b3IsIG9wdGlvbnMpIHtcbiAgICBzdXBlcignZW50aXR5JywgW10sIG9wdGlvbnMpO1xuICAgIHRoaXMuX2dlbmVyYXRvciA9IGdlbmVyYXRvcjtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzZXQgc3RyZXRjaFJhdGlvKHZhbHVlKSB7IHJldHVybjsgfVxuICAvKiogQHByaXZhdGUgKi9cbiAgc2V0IG9mZnNldCh2YWx1ZSkgeyByZXR1cm47IH1cbiAgLyoqIEBwcml2YXRlICovXG4gIHNldCBzdGFydCh2YWx1ZSkgeyByZXR1cm47IH1cbiAgLyoqIEBwcml2YXRlICovXG4gIHNldCBkdXJhdGlvbih2YWx1ZSkgeyByZXR1cm47IH1cbiAgLyoqIEBwcml2YXRlICovXG4gIGdldCBzdHJldGNoUmF0aW8oKSB7IHJldHVybjsgfVxuICAvKiogQHByaXZhdGUgKi9cbiAgZ2V0IG9mZnNldCgpIHsgcmV0dXJuOyB9XG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBnZXQgc3RhcnQoKSB7IHJldHVybjsgfVxuICAvKiogQHByaXZhdGUgKi9cbiAgZ2V0IGR1cmF0aW9uKCkgeyByZXR1cm47IH1cblxuXG4gIC8qKlxuICAgKiBUaGUgZ2VuZXJhdG9yIHRoYXQgY3JlYXRlcyB0aGUgZGF0YSB0byBiZSByZW5kZXJlZCB0byBkaXNwbGF5IHRoZSBheGlzLlxuICAgKlxuICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAqL1xuICBzZXQgZ2VuZXJhdG9yKGZ1bmMpIHtcbiAgICB0aGlzLl9nZW5lcmF0b3IgPSBmdW5jO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBnZW5lcmF0b3IgdGhhdCBjcmVhdGVzIHRoZSBkYXRhIHRvIGJlIHJlbmRlcmVkIHRvIGRpc3BsYXkgdGhlIGF4aXMuXG4gICAqXG4gICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICovXG4gIGdldCBnZW5lcmF0b3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dlbmVyYXRvcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBpcyB0aGUgbWFpbiBkaWZmZXJlbmNlIHdpdGggYSBjbGFzc2ljYWwgbGF5ZXIuIEFuIGBBeGlzTGF5ZXJgXG4gICAqIGluc3RhbmNlIGdlbmVyYXRlcyBhbmQgbWFpbnRhaW5zIGl0J3Mgb3duIGRhdGEuXG4gICAqL1xuICBfZ2VuZXJhdGVEYXRhKCkge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLl9nZW5lcmF0b3IodGhpcy50aW1lQ29udGV4dCk7XG4gICAgLy8gcHJlcGVuZCBmaXJzdCBhcmd1bWVudHMgb2Ygc3BsaWNlIGZvciBhbiBhcHBseVxuICAgIGRhdGEudW5zaGlmdCgwLCB0aGlzLmRhdGFbMF0ubGVuZ3RoKTtcbiAgICAvLyBtYWtlIHN1cmUgdG8ga2VlcCB0aGUgc2FtZSByZWZlcmVuY2VcbiAgICBBcnJheS5wcm90b3R5cGUuc3BsaWNlLmFwcGx5KHRoaXMuZGF0YVswXSwgZGF0YSk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgcmVuZGVyaW5nIGNvbnRleHQgZm9yIHRoZSBzaGFwZXMuXG4gICAqL1xuICBfdXBkYXRlUmVuZGVyaW5nQ29udGV4dCgpIHtcbiAgICBcbiAgICBjb25zdCB2aWV3U3RhcnRUaW1lID0gLXRoaXMudGltZUNvbnRleHQub2Zmc2V0O1xuICAgIFxuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwgPSBzY2FsZXMubGluZWFyKClcbiAgICAgIC5kb21haW4oW3ZpZXdTdGFydFRpbWUsIHZpZXdTdGFydFRpbWUgKyAxXSlcbiAgICAgIC5yYW5nZShbMCwgdGhpcy50aW1lQ29udGV4dC50aW1lVG9QaXhlbCgxKV0pO1xuICAgIFxuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQubWluWCA9IDA7XG5cbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnZpc2libGVXaWR0aCA9IHRoaXMudGltZUNvbnRleHQudmlzaWJsZVdpZHRoO1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQud2lkdGggPSB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnZpc2libGVXaWR0aDtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0Lm1heFggPSB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnZpc2libGVXaWR0aDtcbiAgICBcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LmhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCA9IHRoaXMuX3ZhbHVlVG9QaXhlbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgdGhlIGRhdGEgYW5kIHVwZGF0ZSB0aGUgbGF5ZXIuXG4gICAqL1xuICB1cGRhdGUoKSB7XG4gICAgdGhpcy5fZ2VuZXJhdGVEYXRhKCk7XG4gICAgc3VwZXIudXBkYXRlKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHRoZSBET00gaW4gbWVtb3J5IG9uIGxheWVyIGNyZWF0aW9uIHRvIGJlIGFibGUgdG8gdXNlIGl0IGJlZm9yZVxuICAgKiB0aGUgbGF5ZXIgaXMgYWN0dWFsbHkgaW5zZXJ0ZWQgaW4gdGhlIERPTVxuICAgKi9cbiAgX3JlbmRlckNvbnRhaW5lcigpIHtcbiAgICAvLyB3cmFwcGVyIGdyb3VwIGZvciBgc3RhcnQsIHRvcCBhbmQgY29udGV4dCBmbGlwIG1hdHJpeFxuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIGlmICh0aGlzLnBhcmFtcy5jbGFzc05hbWUgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuJGVsLmNsYXNzTGlzdC5hZGQoJ2xheWVyJywgdGhpcy5wYXJhbXMuY2xhc3NOYW1lKTtcbiAgICB9XG5cbiAgICAvLyBncm91cCB0byBjb250YWluIGxheWVyIGl0ZW1zXG4gICAgdGhpcy4kbWFpbmdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIHRoaXMuJG1haW5ncm91cC5jbGFzc0xpc3QuYWRkKCdtYWluZ3JvdXAnLCAnaXRlbXMnKTtcbiAgICAvLyBsYXllciBiYWNrZ3JvdW5kXG4gICAgdGhpcy4kYmFja2dyb3VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3JlY3QnKTtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCAnMTAwJScpO1xuICAgIHRoaXMuJGJhY2tncm91bmQuY2xhc3NMaXN0LmFkZCgnYmFja2dyb3VuZCcpO1xuICAgIHRoaXMuJGJhY2tncm91bmQuc3R5bGUuZmlsbE9wYWNpdHkgPSAwO1xuICAgIHRoaXMuJGJhY2tncm91bmQuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcbiAgICAvLyBjcmVhdGUgdGhlIERPTSB0cmVlXG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kbWFpbmdyb3VwKTtcbiAgICB0aGlzLiRtYWluZ3JvdXAuYXBwZW5kQ2hpbGQodGhpcy4kYmFja2dyb3VuZCk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgbGF5b3V0IG9mIHRoZSBsYXllci5cbiAgICovXG4gIF91cGRhdGVDb250YWluZXIoKSB7XG4gICAgdGhpcy5fdXBkYXRlUmVuZGVyaW5nQ29udGV4dCgpO1xuXG4gICAgY29uc3QgdG9wICAgID0gdGhpcy5wYXJhbXMudG9wO1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcbiAgICAvLyBtYXRyaXggdG8gaW52ZXJ0IHRoZSBjb29yZGluYXRlIHN5c3RlbVxuICAgIGNvbnN0IHRyYW5zbGF0ZU1hdHJpeCA9IGBtYXRyaXgoMSwgMCwgMCwgLTEsIDAsICR7dG9wICsgaGVpZ2h0fSlgO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCB0cmFuc2xhdGVNYXRyaXgpO1xuXG4gICAgdGhpcy4kYmFja2dyb3VuZC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCBoZWlnaHQpO1xuICB9XG59XG4iXX0=