import scales from '../utils/scales';
import BaseState from './base-state';


/**
 * `CenteredZoomState` is a timeline state mimicing the `Live` zoom interaction. It allows the user to browse the timeline by clicking on a track, and then
 * - moving down to zoom in
 * - moving up to zoom out
 * - moving left to move in time, after
 * - moving right to move in time, before
 *
 * [example usage](./examples/states-zoom.html)
 */
export default class CenteredZoomState extends BaseState {
  constructor(timeline) {
    super(timeline);
    this.currentLayer = null;
    // Set max/min zoom
    // maxZoom: 1px per sample
    // minZoom: 10 000 px per 1 hour
    // with a default to 44.1kHz sample rate
    this.maxZoom = 44100 * 16 / this.timeline.timeContext.pixelsPerSecond;
    this.minZoom = 10000 / 3600 / this.timeline.timeContext.pixelsPerSecond;
  }

  handleEvent(e) {
    switch(e.type) {
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

  onMouseDown(e) {

    this.initialX = e.x;
    this.initialOffset = this.timeline.timeContext.offset;
    this.initialCenterTime =
      this.timeline.timeContext.timeToPixel.invert(e.x) - this.initialOffset;
    
    this.initialY = e.y;
    this.initialZoom = this.timeline.timeContext.zoom;

    this.dragMode = 'unresolved';

    this._pixelToExponent = scales.linear()
      .domain([0, 100]) // 100px => factor 2
      .range([0, 1]);
  }

  updateDragMode(e) {

    if (this.dragMode === 'free') {
      return;
    }
    
    const dx = Math.abs(e.x - this.initialX);
    const dy = Math.abs(e.y - this.initialY);

    const smallThreshold = 10, bigThreshold = 50;

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

  onMouseMove(e) {
    // prevent annoying text selection when dragging
    e.originalEvent.preventDefault();

    this.updateDragMode(e);
    
    const timeContext = this.timeline.timeContext;

    let changed = false;
    
    if (this.dragMode === 'vertical' ||
        this.dragMode === 'free') {
      
      const exponent = this._pixelToExponent(e.y - this.initialY);

      // -1...1 -> 1/2...2 :
      const targetZoom = this.initialZoom * Math.pow(2, exponent);

      const clampedZoom = Math.min(Math.max(targetZoom, this.minZoom),
                                   this.maxZoom);

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
    const timeMovedTo =
          timeContext.timeToPixel(this.initialCenterTime +
                                  timeContext.offset);
    
    const delta = e.x - timeMovedTo;
    const deltaTime = timeContext.timeToPixel.invert(delta);

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

  onMouseUp(e) {
    this.dragMode = 'unresolved';
  }
}
