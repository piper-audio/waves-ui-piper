'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _utilsScales = require('../utils/scales');

var _utilsScales2 = _interopRequireDefault(_utilsScales);

var _baseState = require('./base-state');

var _baseState2 = _interopRequireDefault(_baseState);

/**
 * `CenteredZoomState` is a timeline state mimicing the `Live` zoom interaction. It allows the user to browse the timeline by clicking on a track, and then
 * - moving down to zoom in
 * - moving up to zoom out
 * - moving left to move in time, after
 * - moving right to move in time, before
 *
 * [example usage](./examples/states-zoom.html)
 */

var CenteredZoomState = (function (_BaseState) {
  _inherits(CenteredZoomState, _BaseState);

  function CenteredZoomState(timeline) {
    _classCallCheck(this, CenteredZoomState);

    _get(Object.getPrototypeOf(CenteredZoomState.prototype), 'constructor', this).call(this, timeline);
    this.currentLayer = null;
    // Set max/min zoom
    // maxZoom: 1px per sample
    // minZoom: 10 000 px per 1 hour
    // with a default to 44.1kHz sample rate
    this.maxZoom = 44100 * 16 / this.timeline.timeContext.pixelsPerSecond;
    this.minZoom = 10000 / 3600 / this.timeline.timeContext.pixelsPerSecond;
  }

  _createClass(CenteredZoomState, [{
    key: 'handleEvent',
    value: function handleEvent(e) {
      switch (e.type) {
        case 'mousedown':
          this.onMouseDown(e);
          break;
        case 'mousemove':
          this.onMouseMove(e);
          break;
        case 'mouseup':
          this.onMouseUp(e);
          break;
      }
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(e) {

      this.initialX = e.x;
      this.initialOffset = this.timeline.timeContext.offset;
      this.initialCenterTime = this.timeline.timeContext.timeToPixel.invert(e.x) - this.initialOffset;

      this.initialY = e.y;
      this.initialZoom = this.timeline.timeContext.zoom;

      this.dragMode = 'unresolved';

      this._pixelToExponent = _utilsScales2['default'].linear().domain([0, 100]) // 100px => factor 2
      .range([0, 1]);
    }
  }, {
    key: 'updateDragMode',
    value: function updateDragMode(e) {

      if (this.dragMode === 'free') {
        return;
      }

      var dx = Math.abs(e.x - this.initialX);
      var dy = Math.abs(e.y - this.initialY);

      var smallThreshold = 10,
          bigThreshold = 50;

      if (this.dragMode === 'unresolved') {
        if (dy > smallThreshold && dy > dx * 2) {
          this.dragMode = 'vertical';
        } else if (dx > smallThreshold && dx > dy * 2) {
          this.dragMode = 'horizontal';
        } else if (dx > smallThreshold && dy > smallThreshold) {
          this.dragMode = 'free';
        }
      }

      if (this.dragMode === 'vertical' && dx > bigThreshold) {
        this.dragMode = 'free';
      }
      if (this.dragMode === 'horizontal' && dy > bigThreshold) {
        this.dragMode = 'free';
      }
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      // prevent annoying text selection when dragging
      e.originalEvent.preventDefault();

      this.updateDragMode(e);

      var timeContext = this.timeline.timeContext;

      var changed = false;

      if (this.dragMode === 'vertical' || this.dragMode === 'free') {

        var exponent = this._pixelToExponent(e.y - this.initialY);

        // -1...1 -> 1/2...2 :
        var targetZoom = this.initialZoom * Math.pow(2, exponent);

        var clampedZoom = Math.min(Math.max(targetZoom, this.minZoom), this.maxZoom);

        if (timeContext.zoom !== clampedZoom) {
          timeContext.zoom = clampedZoom;
          changed = true;
        }
      }

      // We want to keep the same time under the mouse as we originally
      // had (this.initialCenterTime). We actually need to do this
      // regardless of drag mode -- even if we're only intending to drag
      // vertically (i.e. zooming), we still want to ensure the point
      // under the mouse doesn't wander off
      var timeMovedTo = timeContext.timeToPixel(this.initialCenterTime + timeContext.offset);

      var delta = e.x - timeMovedTo;
      var deltaTime = timeContext.timeToPixel.invert(delta);

      if (deltaTime !== 0) {
        timeContext.offset += deltaTime;
        changed = true;
      }

      // Other possible experiments with centered-zoom-state
      //
      // Example 1: Prevent timeline.offset to be negative
      // timeContext.offset = Math.min(timeContext.offset, 0);
      //
      // Example 2: Keep in container when zoomed out
      // if (timeContext.stretchRatio < 1) {
      //   const minOffset = timeContext.timeToPixel.invert(0);
      //   const maxOffset = timeContext.timeToPixel.invert(view.width - timeContext.timeToPixel(timeContext.duration));
      //   timeContext.offset = Math.max(timeContext.offset, minOffset);
      //   timeContext.offset = Math.min(timeContext.offset, maxOffset);
      // }

      if (changed) {
        this.timeline.tracks.update();
      }
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(e) {}
  }]);

  return CenteredZoomState;
})(_baseState2['default']);

exports['default'] = CenteredZoomState;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zdGF0ZXMvY2VudGVyZWQtem9vbS1zdGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzJCQUFtQixpQkFBaUI7Ozs7eUJBQ2QsY0FBYzs7Ozs7Ozs7Ozs7Ozs7SUFZZixpQkFBaUI7WUFBakIsaUJBQWlCOztBQUN6QixXQURRLGlCQUFpQixDQUN4QixRQUFRLEVBQUU7MEJBREgsaUJBQWlCOztBQUVsQywrQkFGaUIsaUJBQWlCLDZDQUU1QixRQUFRLEVBQUU7QUFDaEIsUUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7Ozs7O0FBS3pCLFFBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUM7QUFDdEUsUUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQztHQUN6RTs7ZUFWa0IsaUJBQWlCOztXQVl6QixxQkFBQyxDQUFDLEVBQUU7QUFDYixjQUFPLENBQUMsQ0FBQyxJQUFJO0FBQ1gsYUFBSyxXQUFXO0FBQ2QsY0FBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixnQkFBTTtBQUFBLEFBQ1IsYUFBSyxXQUFXO0FBQ2QsY0FBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixnQkFBTTtBQUFBLEFBQ1IsYUFBSyxTQUFTO0FBQ1osY0FBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixnQkFBTTtBQUFBLE9BQ1Q7S0FDRjs7O1dBRVUscUJBQUMsQ0FBQyxFQUFFOztBQUViLFVBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixVQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztBQUN0RCxV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LENBQUMsRUFDbEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUUzQyxZQUFJLFdBQVcsQ0FBQyxJQUFJLEtBQUssV0FBVyxFQUFFO0FBQ3BDLHFCQUFXLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQztBQUMvQixpQkFBTyxHQUFHLElBQUksQ0FBQztTQUNoQjtPQUNGOzs7Ozs7O0FBT0QsVUFBTSxXQUFXLEdBQ1gsV0FBVyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEdBQ3RCLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFbEQsVUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUM7QUFDaEMsVUFBTSxTQUFTLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRXhELFVBQUksU0FBUyxLQUFLLENBQUMsRUFBRTtBQUNuQixtQkFBVyxDQUFDLE1BQU0sSUFBSSxTQUFTLENBQUM7QUFDaEMsZUFBTyxHQUFHLElBQUksQ0FBQztPQUNoQjs7Ozs7Ozs7Ozs7Ozs7O0FBZUQsVUFBSSxPQUFPLEVBQUU7QUFDWCxZQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztPQUMvQjtLQUNGOzs7V0FFUSxtQkFBQyxDQUFDLEVBQUUsRUFBRTs7O1NBdElJLGlCQUFpQjs7O3FCQUFqQixpQkFBaUIiLCJmaWxlIjoic3JjL3N0YXRlcy9jZW50ZXJlZC16b29tLXN0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNjYWxlcyBmcm9tICcuLi91dGlscy9zY2FsZXMnO1xuaW1wb3J0IEJhc2VTdGF0ZSBmcm9tICcuL2Jhc2Utc3RhdGUnO1xuXG5cbi8qKlxuICogYENlbnRlcmVkWm9vbVN0YXRlYCBpcyBhIHRpbWVsaW5lIHN0YXRlIG1pbWljaW5nIHRoZSBgTGl2ZWAgem9vbSBpbnRlcmFjdGlvbi4gSXQgYWxsb3dzIHRoZSB1c2VyIHRvIGJyb3dzZSB0aGUgdGltZWxpbmUgYnkgY2xpY2tpbmcgb24gYSB0cmFjaywgYW5kIHRoZW5cbiAqIC0gbW92aW5nIGRvd24gdG8gem9vbSBpblxuICogLSBtb3ZpbmcgdXAgdG8gem9vbSBvdXRcbiAqIC0gbW92aW5nIGxlZnQgdG8gbW92ZSBpbiB0aW1lLCBhZnRlclxuICogLSBtb3ZpbmcgcmlnaHQgdG8gbW92ZSBpbiB0aW1lLCBiZWZvcmVcbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9zdGF0ZXMtem9vbS5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDZW50ZXJlZFpvb21TdGF0ZSBleHRlbmRzIEJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lKSB7XG4gICAgc3VwZXIodGltZWxpbmUpO1xuICAgIHRoaXMuY3VycmVudExheWVyID0gbnVsbDtcbiAgICAvLyBTZXQgbWF4L21pbiB6b29tXG4gICAgLy8gbWF4Wm9vbTogMXB4IHBlciBzYW1wbGVcbiAgICAvLyBtaW5ab29tOiAxMCAwMDAgcHggcGVyIDEgaG91clxuICAgIC8vIHdpdGggYSBkZWZhdWx0IHRvIDQ0LjFrSHogc2FtcGxlIHJhdGVcbiAgICB0aGlzLm1heFpvb20gPSA0NDEwMCAqIDE2IC8gdGhpcy50aW1lbGluZS50aW1lQ29udGV4dC5waXhlbHNQZXJTZWNvbmQ7XG4gICAgdGhpcy5taW5ab29tID0gMTAwMDAgLyAzNjAwIC8gdGhpcy50aW1lbGluZS50aW1lQ29udGV4dC5waXhlbHNQZXJTZWNvbmQ7XG4gIH1cblxuICBoYW5kbGVFdmVudChlKSB7XG4gICAgc3dpdGNoKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlRG93bihlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZW1vdmUnOlxuICAgICAgICB0aGlzLm9uTW91c2VNb3ZlKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICB0aGlzLm9uTW91c2VVcChlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZURvd24oZSkge1xuXG4gICAgdGhpcy5pbml0aWFsWCA9IGUueDtcbiAgICB0aGlzLmluaXRpYWxPZmZzZXQgPSB0aGlzLnRpbWVsaW5lLnRpbWVDb250ZXh0Lm9mZnNldDtcbiAgICB0aGlzLmluaXRpYWxDZW50ZXJUaW1lID1cbiAgICAgIHRoaXMudGltZWxpbmUudGltZUNvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KGUueCkgLSB0aGlzLmluaXRpYWxPZmZzZXQ7XG4gICAgXG4gICAgdGhpcy5pbml0aWFsWSA9IGUueTtcbiAgICB0aGlzLmluaXRpYWxab29tID0gdGhpcy50aW1lbGluZS50aW1lQ29udGV4dC56b29tO1xuXG4gICAgdGhpcy5kcmFnTW9kZSA9ICd1bnJlc29sdmVkJztcblxuICAgIHRoaXMuX3BpeGVsVG9FeHBvbmVudCA9IHNjYWxlcy5saW5lYXIoKVxuICAgICAgLmRvbWFpbihbMCwgMTAwXSkgLy8gMTAwcHggPT4gZmFjdG9yIDJcbiAgICAgIC5yYW5nZShbMCwgMV0pO1xuICB9XG5cbiAgdXBkYXRlRHJhZ01vZGUoZSkge1xuXG4gICAgaWYgKHRoaXMuZHJhZ01vZGUgPT09ICdmcmVlJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICBjb25zdCBkeCA9IE1hdGguYWJzKGUueCAtIHRoaXMuaW5pdGlhbFgpO1xuICAgIGNvbnN0IGR5ID0gTWF0aC5hYnMoZS55IC0gdGhpcy5pbml0aWFsWSk7XG5cbiAgICBjb25zdCBzbWFsbFRocmVzaG9sZCA9IDEwLCBiaWdUaHJlc2hvbGQgPSA1MDtcblxuICAgIGlmICh0aGlzLmRyYWdNb2RlID09PSAndW5yZXNvbHZlZCcpIHtcbiAgICAgIGlmIChkeSA+IHNtYWxsVGhyZXNob2xkICYmIGR5ID4gZHggKiAyKSB7XG4gICAgICAgIHRoaXMuZHJhZ01vZGUgPSAndmVydGljYWwnO1xuICAgICAgfSBlbHNlIGlmIChkeCA+IHNtYWxsVGhyZXNob2xkICYmIGR4ID4gZHkgKiAyKSB7XG4gICAgICAgIHRoaXMuZHJhZ01vZGUgPSAnaG9yaXpvbnRhbCc7XG4gICAgICB9IGVsc2UgaWYgKGR4ID4gc21hbGxUaHJlc2hvbGQgJiYgZHkgPiBzbWFsbFRocmVzaG9sZCkge1xuICAgICAgICB0aGlzLmRyYWdNb2RlID0gJ2ZyZWUnO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmRyYWdNb2RlID09PSAndmVydGljYWwnICYmIGR4ID4gYmlnVGhyZXNob2xkKSB7XG4gICAgICB0aGlzLmRyYWdNb2RlID0gJ2ZyZWUnO1xuICAgIH1cbiAgICBpZiAodGhpcy5kcmFnTW9kZSA9PT0gJ2hvcml6b250YWwnICYmIGR5ID4gYmlnVGhyZXNob2xkKSB7XG4gICAgICB0aGlzLmRyYWdNb2RlID0gJ2ZyZWUnO1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VNb3ZlKGUpIHtcbiAgICAvLyBwcmV2ZW50IGFubm95aW5nIHRleHQgc2VsZWN0aW9uIHdoZW4gZHJhZ2dpbmdcbiAgICBlLm9yaWdpbmFsRXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIHRoaXMudXBkYXRlRHJhZ01vZGUoZSk7XG4gICAgXG4gICAgY29uc3QgdGltZUNvbnRleHQgPSB0aGlzLnRpbWVsaW5lLnRpbWVDb250ZXh0O1xuXG4gICAgbGV0IGNoYW5nZWQgPSBmYWxzZTtcbiAgICBcbiAgICBpZiAodGhpcy5kcmFnTW9kZSA9PT0gJ3ZlcnRpY2FsJyB8fFxuICAgICAgICB0aGlzLmRyYWdNb2RlID09PSAnZnJlZScpIHtcbiAgICAgIFxuICAgICAgY29uc3QgZXhwb25lbnQgPSB0aGlzLl9waXhlbFRvRXhwb25lbnQoZS55IC0gdGhpcy5pbml0aWFsWSk7XG5cbiAgICAgIC8vIC0xLi4uMSAtPiAxLzIuLi4yIDpcbiAgICAgIGNvbnN0IHRhcmdldFpvb20gPSB0aGlzLmluaXRpYWxab29tICogTWF0aC5wb3coMiwgZXhwb25lbnQpO1xuXG4gICAgICBjb25zdCBjbGFtcGVkWm9vbSA9IE1hdGgubWluKE1hdGgubWF4KHRhcmdldFpvb20sIHRoaXMubWluWm9vbSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWF4Wm9vbSk7XG5cbiAgICAgIGlmICh0aW1lQ29udGV4dC56b29tICE9PSBjbGFtcGVkWm9vbSkge1xuICAgICAgICB0aW1lQ29udGV4dC56b29tID0gY2xhbXBlZFpvb207XG4gICAgICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFdlIHdhbnQgdG8ga2VlcCB0aGUgc2FtZSB0aW1lIHVuZGVyIHRoZSBtb3VzZSBhcyB3ZSBvcmlnaW5hbGx5XG4gICAgLy8gaGFkICh0aGlzLmluaXRpYWxDZW50ZXJUaW1lKS4gV2UgYWN0dWFsbHkgbmVlZCB0byBkbyB0aGlzXG4gICAgLy8gcmVnYXJkbGVzcyBvZiBkcmFnIG1vZGUgLS0gZXZlbiBpZiB3ZSdyZSBvbmx5IGludGVuZGluZyB0byBkcmFnXG4gICAgLy8gdmVydGljYWxseSAoaS5lLiB6b29taW5nKSwgd2Ugc3RpbGwgd2FudCB0byBlbnN1cmUgdGhlIHBvaW50XG4gICAgLy8gdW5kZXIgdGhlIG1vdXNlIGRvZXNuJ3Qgd2FuZGVyIG9mZlxuICAgIGNvbnN0IHRpbWVNb3ZlZFRvID1cbiAgICAgICAgICB0aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLmluaXRpYWxDZW50ZXJUaW1lICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lQ29udGV4dC5vZmZzZXQpO1xuICAgIFxuICAgIGNvbnN0IGRlbHRhID0gZS54IC0gdGltZU1vdmVkVG87XG4gICAgY29uc3QgZGVsdGFUaW1lID0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KGRlbHRhKTtcblxuICAgIGlmIChkZWx0YVRpbWUgIT09IDApIHtcbiAgICAgIHRpbWVDb250ZXh0Lm9mZnNldCArPSBkZWx0YVRpbWU7XG4gICAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBPdGhlciBwb3NzaWJsZSBleHBlcmltZW50cyB3aXRoIGNlbnRlcmVkLXpvb20tc3RhdGVcbiAgICAvL1xuICAgIC8vIEV4YW1wbGUgMTogUHJldmVudCB0aW1lbGluZS5vZmZzZXQgdG8gYmUgbmVnYXRpdmVcbiAgICAvLyB0aW1lQ29udGV4dC5vZmZzZXQgPSBNYXRoLm1pbih0aW1lQ29udGV4dC5vZmZzZXQsIDApO1xuICAgIC8vXG4gICAgLy8gRXhhbXBsZSAyOiBLZWVwIGluIGNvbnRhaW5lciB3aGVuIHpvb21lZCBvdXRcbiAgICAvLyBpZiAodGltZUNvbnRleHQuc3RyZXRjaFJhdGlvIDwgMSnCoHtcbiAgICAvLyAgIGNvbnN0IG1pbk9mZnNldCA9IHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydCgwKTtcbiAgICAvLyAgIGNvbnN0IG1heE9mZnNldCA9IHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydCh2aWV3LndpZHRoIC0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwodGltZUNvbnRleHQuZHVyYXRpb24pKTtcbiAgICAvLyAgIHRpbWVDb250ZXh0Lm9mZnNldCA9IE1hdGgubWF4KHRpbWVDb250ZXh0Lm9mZnNldCwgbWluT2Zmc2V0KTtcbiAgICAvLyAgIHRpbWVDb250ZXh0Lm9mZnNldCA9IE1hdGgubWluKHRpbWVDb250ZXh0Lm9mZnNldCwgbWF4T2Zmc2V0KTtcbiAgICAvLyB9XG5cbiAgICBpZiAoY2hhbmdlZCkge1xuICAgICAgdGhpcy50aW1lbGluZS50cmFja3MudXBkYXRlKCk7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZVVwKGUpIHt9XG59XG4iXX0=