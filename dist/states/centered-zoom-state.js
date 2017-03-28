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

      console.log("mouse move: time context offset is now " + timeContext.offset);

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
    value: function onMouseUp(e) {
      this.dragMode = 'unresolved';
    }
  }]);

  return CenteredZoomState;
})(_baseState2['default']);

exports['default'] = CenteredZoomState;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zdGF0ZXMvY2VudGVyZWQtem9vbS1zdGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzJCQUFtQixpQkFBaUI7Ozs7eUJBQ2QsY0FBYzs7Ozs7Ozs7Ozs7Ozs7SUFZZixpQkFBaUI7WUFBakIsaUJBQWlCOztBQUN6QixXQURRLGlCQUFpQixDQUN4QixRQUFRLEVBQUU7MEJBREgsaUJBQWlCOztBQUVsQywrQkFGaUIsaUJBQWlCLDZDQUU1QixRQUFRLEVBQUU7QUFDaEIsUUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7Ozs7O0FBS3pCLFFBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUM7QUFDdEUsUUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQztHQUN6RTs7ZUFWa0IsaUJBQWlCOztXQVl6QixxQkFBQyxDQUFDLEVBQUU7QUFDYixjQUFPLENBQUMsQ0FBQyxJQUFJO0FBQ1gsYUFBSyxXQUFXO0FBQ2QsY0FBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixnQkFBTTtBQUFBLEFBQ1IsYUFBSyxXQUFXO0FBQ2QsY0FBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixnQkFBTTtBQUFBLEFBQ1IsYUFBSyxTQUFTO0FBQ1osY0FBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixnQkFBTTtBQUFBLE9BQ1Q7S0FDRjs7O1dBRVUscUJBQUMsQ0FBQyxFQUFFOztBQUViLFVBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixVQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztBQUN0RCxV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LENBQUMsRUFDbEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUUzQyxZQUFJLFdBQVcsQ0FBQyxJQUFJLEtBQUssV0FBVyxFQUFFO0FBQ3BDLHFCQUFXLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQztBQUMvQixpQkFBTyxHQUFHLElBQUksQ0FBQztTQUNoQjtPQUNGOzs7Ozs7O0FBT0QsVUFBTSxXQUFXLEdBQ1gsV0FBVyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEdBQ3RCLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFbEQsVUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUM7QUFDaEMsVUFBTSxTQUFTLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRXhELFVBQUksU0FBUyxLQUFLLENBQUMsRUFBRTtBQUNuQixtQkFBVyxDQUFDLE1BQU0sSUFBSSxTQUFTLENBQUM7QUFDaEMsZUFBTyxHQUFHLElBQUksQ0FBQztPQUNoQjs7QUFFRCxhQUFPLENBQUMsR0FBRyxDQUFDLHlDQUF5QyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FBZTVFLFVBQUksT0FBTyxFQUFFO0FBQ1gsWUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7T0FDL0I7S0FDRjs7O1dBRVEsbUJBQUMsQ0FBQyxFQUFFO0FBQ1gsVUFBSSxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUM7S0FDOUI7OztTQTFJa0IsaUJBQWlCOzs7cUJBQWpCLGlCQUFpQiIsImZpbGUiOiJzcmMvc3RhdGVzL2NlbnRlcmVkLXpvb20tc3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc2NhbGVzIGZyb20gJy4uL3V0aWxzL3NjYWxlcyc7XG5pbXBvcnQgQmFzZVN0YXRlIGZyb20gJy4vYmFzZS1zdGF0ZSc7XG5cblxuLyoqXG4gKiBgQ2VudGVyZWRab29tU3RhdGVgIGlzIGEgdGltZWxpbmUgc3RhdGUgbWltaWNpbmcgdGhlIGBMaXZlYCB6b29tIGludGVyYWN0aW9uLiBJdCBhbGxvd3MgdGhlIHVzZXIgdG8gYnJvd3NlIHRoZSB0aW1lbGluZSBieSBjbGlja2luZyBvbiBhIHRyYWNrLCBhbmQgdGhlblxuICogLSBtb3ZpbmcgZG93biB0byB6b29tIGluXG4gKiAtIG1vdmluZyB1cCB0byB6b29tIG91dFxuICogLSBtb3ZpbmcgbGVmdCB0byBtb3ZlIGluIHRpbWUsIGFmdGVyXG4gKiAtIG1vdmluZyByaWdodCB0byBtb3ZlIGluIHRpbWUsIGJlZm9yZVxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL3N0YXRlcy16b29tLmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENlbnRlcmVkWm9vbVN0YXRlIGV4dGVuZHMgQmFzZVN0YXRlIHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUpIHtcbiAgICBzdXBlcih0aW1lbGluZSk7XG4gICAgdGhpcy5jdXJyZW50TGF5ZXIgPSBudWxsO1xuICAgIC8vIFNldCBtYXgvbWluIHpvb21cbiAgICAvLyBtYXhab29tOiAxcHggcGVyIHNhbXBsZVxuICAgIC8vIG1pblpvb206IDEwIDAwMCBweCBwZXIgMSBob3VyXG4gICAgLy8gd2l0aCBhIGRlZmF1bHQgdG8gNDQuMWtIeiBzYW1wbGUgcmF0ZVxuICAgIHRoaXMubWF4Wm9vbSA9IDQ0MTAwICogMTYgLyB0aGlzLnRpbWVsaW5lLnRpbWVDb250ZXh0LnBpeGVsc1BlclNlY29uZDtcbiAgICB0aGlzLm1pblpvb20gPSAxMDAwMCAvIDM2MDAgLyB0aGlzLnRpbWVsaW5lLnRpbWVDb250ZXh0LnBpeGVsc1BlclNlY29uZDtcbiAgfVxuXG4gIGhhbmRsZUV2ZW50KGUpIHtcbiAgICBzd2l0Y2goZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICB0aGlzLm9uTW91c2VEb3duKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XG4gICAgICAgIHRoaXMub25Nb3VzZU1vdmUoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIHRoaXMub25Nb3VzZVVwKGUpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBvbk1vdXNlRG93bihlKSB7XG5cbiAgICB0aGlzLmluaXRpYWxYID0gZS54O1xuICAgIHRoaXMuaW5pdGlhbE9mZnNldCA9IHRoaXMudGltZWxpbmUudGltZUNvbnRleHQub2Zmc2V0O1xuICAgIHRoaXMuaW5pdGlhbENlbnRlclRpbWUgPVxuICAgICAgdGhpcy50aW1lbGluZS50aW1lQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQoZS54KSAtIHRoaXMuaW5pdGlhbE9mZnNldDtcbiAgICBcbiAgICB0aGlzLmluaXRpYWxZID0gZS55O1xuICAgIHRoaXMuaW5pdGlhbFpvb20gPSB0aGlzLnRpbWVsaW5lLnRpbWVDb250ZXh0Lnpvb207XG5cbiAgICB0aGlzLmRyYWdNb2RlID0gJ3VucmVzb2x2ZWQnO1xuXG4gICAgdGhpcy5fcGl4ZWxUb0V4cG9uZW50ID0gc2NhbGVzLmxpbmVhcigpXG4gICAgICAuZG9tYWluKFswLCAxMDBdKSAvLyAxMDBweCA9PiBmYWN0b3IgMlxuICAgICAgLnJhbmdlKFswLCAxXSk7XG4gIH1cblxuICB1cGRhdGVEcmFnTW9kZShlKSB7XG5cbiAgICBpZiAodGhpcy5kcmFnTW9kZSA9PT0gJ2ZyZWUnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IGR4ID0gTWF0aC5hYnMoZS54IC0gdGhpcy5pbml0aWFsWCk7XG4gICAgY29uc3QgZHkgPSBNYXRoLmFicyhlLnkgLSB0aGlzLmluaXRpYWxZKTtcblxuICAgIGNvbnN0IHNtYWxsVGhyZXNob2xkID0gMTAsIGJpZ1RocmVzaG9sZCA9IDUwO1xuXG4gICAgaWYgKHRoaXMuZHJhZ01vZGUgPT09ICd1bnJlc29sdmVkJykge1xuICAgICAgaWYgKGR5ID4gc21hbGxUaHJlc2hvbGQgJiYgZHkgPiBkeCAqIDIpIHtcbiAgICAgICAgdGhpcy5kcmFnTW9kZSA9ICd2ZXJ0aWNhbCc7XG4gICAgICB9IGVsc2UgaWYgKGR4ID4gc21hbGxUaHJlc2hvbGQgJiYgZHggPiBkeSAqIDIpIHtcbiAgICAgICAgdGhpcy5kcmFnTW9kZSA9ICdob3Jpem9udGFsJztcbiAgICAgIH0gZWxzZSBpZiAoZHggPiBzbWFsbFRocmVzaG9sZCAmJiBkeSA+IHNtYWxsVGhyZXNob2xkKSB7XG4gICAgICAgIHRoaXMuZHJhZ01vZGUgPSAnZnJlZSc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZHJhZ01vZGUgPT09ICd2ZXJ0aWNhbCcgJiYgZHggPiBiaWdUaHJlc2hvbGQpIHtcbiAgICAgIHRoaXMuZHJhZ01vZGUgPSAnZnJlZSc7XG4gICAgfVxuICAgIGlmICh0aGlzLmRyYWdNb2RlID09PSAnaG9yaXpvbnRhbCcgJiYgZHkgPiBiaWdUaHJlc2hvbGQpIHtcbiAgICAgIHRoaXMuZHJhZ01vZGUgPSAnZnJlZSc7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZU1vdmUoZSkge1xuICAgIC8vIHByZXZlbnQgYW5ub3lpbmcgdGV4dCBzZWxlY3Rpb24gd2hlbiBkcmFnZ2luZ1xuICAgIGUub3JpZ2luYWxFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgdGhpcy51cGRhdGVEcmFnTW9kZShlKTtcbiAgICBcbiAgICBjb25zdCB0aW1lQ29udGV4dCA9IHRoaXMudGltZWxpbmUudGltZUNvbnRleHQ7XG5cbiAgICBsZXQgY2hhbmdlZCA9IGZhbHNlO1xuICAgIFxuICAgIGlmICh0aGlzLmRyYWdNb2RlID09PSAndmVydGljYWwnIHx8XG4gICAgICAgIHRoaXMuZHJhZ01vZGUgPT09ICdmcmVlJykge1xuICAgICAgXG4gICAgICBjb25zdCBleHBvbmVudCA9IHRoaXMuX3BpeGVsVG9FeHBvbmVudChlLnkgLSB0aGlzLmluaXRpYWxZKTtcblxuICAgICAgLy8gLTEuLi4xIC0+IDEvMi4uLjIgOlxuICAgICAgY29uc3QgdGFyZ2V0Wm9vbSA9IHRoaXMuaW5pdGlhbFpvb20gKiBNYXRoLnBvdygyLCBleHBvbmVudCk7XG5cbiAgICAgIGNvbnN0IGNsYW1wZWRab29tID0gTWF0aC5taW4oTWF0aC5tYXgodGFyZ2V0Wm9vbSwgdGhpcy5taW5ab29tKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXhab29tKTtcblxuICAgICAgaWYgKHRpbWVDb250ZXh0Lnpvb20gIT09IGNsYW1wZWRab29tKSB7XG4gICAgICAgIHRpbWVDb250ZXh0Lnpvb20gPSBjbGFtcGVkWm9vbTtcbiAgICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gV2Ugd2FudCB0byBrZWVwIHRoZSBzYW1lIHRpbWUgdW5kZXIgdGhlIG1vdXNlIGFzIHdlIG9yaWdpbmFsbHlcbiAgICAvLyBoYWQgKHRoaXMuaW5pdGlhbENlbnRlclRpbWUpLiBXZSBhY3R1YWxseSBuZWVkIHRvIGRvIHRoaXNcbiAgICAvLyByZWdhcmRsZXNzIG9mIGRyYWcgbW9kZSAtLSBldmVuIGlmIHdlJ3JlIG9ubHkgaW50ZW5kaW5nIHRvIGRyYWdcbiAgICAvLyB2ZXJ0aWNhbGx5IChpLmUuIHpvb21pbmcpLCB3ZSBzdGlsbCB3YW50IHRvIGVuc3VyZSB0aGUgcG9pbnRcbiAgICAvLyB1bmRlciB0aGUgbW91c2UgZG9lc24ndCB3YW5kZXIgb2ZmXG4gICAgY29uc3QgdGltZU1vdmVkVG8gPVxuICAgICAgICAgIHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMuaW5pdGlhbENlbnRlclRpbWUgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVDb250ZXh0Lm9mZnNldCk7XG4gICAgXG4gICAgY29uc3QgZGVsdGEgPSBlLnggLSB0aW1lTW92ZWRUbztcbiAgICBjb25zdCBkZWx0YVRpbWUgPSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQoZGVsdGEpO1xuXG4gICAgaWYgKGRlbHRhVGltZSAhPT0gMCkge1xuICAgICAgdGltZUNvbnRleHQub2Zmc2V0ICs9IGRlbHRhVGltZTtcbiAgICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKFwibW91c2UgbW92ZTogdGltZSBjb250ZXh0IG9mZnNldCBpcyBub3cgXCIgKyB0aW1lQ29udGV4dC5vZmZzZXQpO1xuICAgIFxuICAgIC8vIE90aGVyIHBvc3NpYmxlIGV4cGVyaW1lbnRzIHdpdGggY2VudGVyZWQtem9vbS1zdGF0ZVxuICAgIC8vXG4gICAgLy8gRXhhbXBsZSAxOiBQcmV2ZW50IHRpbWVsaW5lLm9mZnNldCB0byBiZSBuZWdhdGl2ZVxuICAgIC8vIHRpbWVDb250ZXh0Lm9mZnNldCA9IE1hdGgubWluKHRpbWVDb250ZXh0Lm9mZnNldCwgMCk7XG4gICAgLy9cbiAgICAvLyBFeGFtcGxlIDI6IEtlZXAgaW4gY29udGFpbmVyIHdoZW4gem9vbWVkIG91dFxuICAgIC8vIGlmICh0aW1lQ29udGV4dC5zdHJldGNoUmF0aW8gPCAxKcKge1xuICAgIC8vICAgY29uc3QgbWluT2Zmc2V0ID0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KDApO1xuICAgIC8vICAgY29uc3QgbWF4T2Zmc2V0ID0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHZpZXcud2lkdGggLSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aW1lQ29udGV4dC5kdXJhdGlvbikpO1xuICAgIC8vICAgdGltZUNvbnRleHQub2Zmc2V0ID0gTWF0aC5tYXgodGltZUNvbnRleHQub2Zmc2V0LCBtaW5PZmZzZXQpO1xuICAgIC8vICAgdGltZUNvbnRleHQub2Zmc2V0ID0gTWF0aC5taW4odGltZUNvbnRleHQub2Zmc2V0LCBtYXhPZmZzZXQpO1xuICAgIC8vIH1cblxuICAgIGlmIChjaGFuZ2VkKSB7XG4gICAgICB0aGlzLnRpbWVsaW5lLnRyYWNrcy51cGRhdGUoKTtcbiAgICB9XG4gIH1cblxuICBvbk1vdXNlVXAoZSkge1xuICAgIHRoaXMuZHJhZ01vZGUgPSAndW5yZXNvbHZlZCc7XG4gIH1cbn1cbiJdfQ==