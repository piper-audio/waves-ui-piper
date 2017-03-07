
import BaseShape from './base-shape';
import TimelineTimeContext from '../core/timeline-time-context';
import LayerTimeContext from '../core/layer-time-context';

const xhtmlNS = 'http://www.w3.org/1999/xhtml';

export default class Grid extends BaseShape {

  getClassName() {
    return 'grid';
  }

  _getAccessorList() {
    // return { y: 0 };
    return {};
  }

  // TODO determine suitable implementations for _getAccessorList and _getDefaults
  _getDefaults() {
    return {
      sampleRate: 44100,
      color: '#000000',
      opacity: 1,
      // renderingStrategy: 'svg' // canvas is bugged (translation, etc...)
    };
  }

  render(renderingCtx) {
    console.log("grid render called");
    if (this.$el) { return this.$el; }
    this.$el = document.createElementNS(this.ns, 'g');
    console.log("grid render returning");
    return this.$el;
    
    // TODO this is pasted straight from the commented out Canvas code in waveform.js, refactor
    // TODO canvas also doesn't work properly when embedded in an SVG element - so this all needs to go anyway
    /*
    this.$el = document.createElementNS(this.ns, 'foreignObject');
    this.$el.setAttributeNS('', 'width', renderingCtx.width);
    this.$el.setAttributeNS('', 'height', renderingCtx.height);

    const canvas = document.createElementNS(xhtmlNS, 'xhtml:canvas');

    this._ctx = canvas.getContext('2d');
    this._ctx.canvas.width = renderingCtx.width;
    this._ctx.canvas.height = renderingCtx.height;
    this._ctx.globalAlpha = this.params.opacity;

    this.$el.appendChild(canvas);
    // this.$el = document.createElementNS(this.ns, 'image');
    // this.$el.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');
    // this.$el.style.opacity = this.params.opacity;
    // this.$el.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '');
    // this.$el.setAttributeNS(null, 'x', '0');
    // this.$el.setAttributeNS(null, 'y', '0');
    // this.$el.setAttributeNS(null, 'height', `${renderingCtx.height}`);
    // this.$el.setAttributeNS(null, 'width', `${renderingCtx.width}`);
    // const canvasElement = document.createElement('canvas');
    // this._ctx = canvasElement.getContext('2d');
    return this.$el;
    */
  }

  update(renderingContext, datum) {

    const before = performance.now();

    console.log("grid update called");

    while (this.$el.firstChild) {
      this.$el.removeChild(this.$el.firstChild);
    }

    const blockSize = 2048;
    const stepSize = 1024;

    const n = datum.length;

    //!!! this bit from waveform.js
    // @TODO refactor this ununderstandable mess
    let minX = Math.max(-renderingContext.offsetX, 0);
    let trackDecay = renderingContext.trackOffsetX + renderingContext.startX;
    if (trackDecay < 0) { minX = -trackDecay; }

    let maxX = minX;
    maxX += (renderingContext.width - minX < renderingContext.visibleWidth) ?
      renderingContext.width : renderingContext.visibleWidth;

    const sampleRate = this.params.sampleRate;
    const pixelToSample = (pixel => {
      return Math.floor (sampleRate * renderingContext.timeToPixel.invert(pixel));
    });

    const startCol = Math.floor(pixelToSample(minX) / stepSize);
    const endCol = Math.floor(pixelToSample(maxX) / stepSize);

    let instructions = [];
    
    const fragment = document.createDocumentFragment();
    
    for (let col = startCol; col <= endCol; ++col) {

      const sample = col * stepSize;
      const x = renderingContext.timeToPixel(sample / sampleRate);

      if (col * stepSize + blockSize > n) {
        break;
      }

      const x1 = x + 1;
      
      for (let y = 0; y < blockSize; ++y) {
        const ix = col * stepSize + y;
        const value = Math.abs(datum[ix]);

        const cell = document.createElementNS(this.ns, 'line');
        cell.setAttributeNS(null, 'fill', 'none');
        cell.setAttributeNS(null, 'shape-rendering', 'crispEdges');
        cell.setAttributeNS(null, 'd', `M${x},${y}L${x1},${y}`);
        fragment.appendChild(cell);
      }
    }

    this.$el.appendChild(fragment);
    
//    const d = 'M' + instructions.join('M');

    /*
    this.$el.setAttributeNS(null, 'd', d);
    this.$el.setAttributeNS(null, 'fill', 'none');
    this.$el.setAttributeNS(null, 'shape-rendering', 'crispEdges');
    this.$el.setAttributeNS(null, 'stroke', this.params.color);
    this.$el.style.opacity = this.params.opacity;
    */
    
    const after = performance.now();
    console.log("grid update time = " + Math.round(after - before));
    
        
    
    /*
    this._ctx.canvas.width = renderingCtx.width;
    this.$el.setAttribute('width', renderingCtx.width);
    // fix chrome bug with translate
    this.$el.setAttribute('x', renderingCtx.offsetX);
    this._ctx.globalAlpha = this.params.opacity;
    this._ctx.moveTo(renderingCtx.timeToPixel(0), renderingCtx.valueToPixel(0));

    // calculate the visible area, and get a sub-array of the feature data in that duration
    const timeExtents = this.getCurrentTimeExtents(renderingCtx);
    const visibleColumns = this.getColumnsInArea(timeExtents, datum);
    console.log(visibleColumns.length);

    // calculate the number of columns representable in the space available
    const binWidthPx = renderingCtx.timeToPixel(this.params.stepDuration);
    const binHeightPx = renderingCtx.height / datum.length;

    // how much time fits in 1 pixel?
    const pixelToTime = renderingCtx.timeToPixel.invert;
    const secondsPerPixel = pixelToTime(1);

    // how many columns is that?


    // summarise the columns

    for (let bins of visibleColumns) {
      Spectrogram.drawSpectrogramColumn(bins, this._ctx, binWidthPx, binHeightPx, renderingCtx.height);
    }
    // this.$el.setAttribute('href', this._ctx.canvas.toDataURL());
    */
  }
/*
  static drawSpectrogramColumn(bins, ctx, binWidth, binHeight, height) {
    const minDecibels = -100;
    const maxDecibels = -30;
    const rangeScaleFactor = 1.0 / (maxDecibels - minDecibels);
    const nBins = bins.length;
    const normalisationFactor = 1 / nBins;

    for (let i = 0, len = bins.length; i < len; ++i) {
      const binValue = bins[i];
      // scale
      const value = binValue * normalisationFactor;
      // re-map range
      const dbMag = (isFinite(value) && value > 0.0) ? 20.0 * Math.log10(value) : minDecibels;
      let scaledValue = 255 * (dbMag - minDecibels) * rangeScaleFactor;
      // clip to uint8 range
      if (scaledValue < 0)
        scaledValue = 0;
      if (scaledValue > 255)
        scaledValue = 255;
      scaledValue = Math.floor(scaledValue);
      // draw line
      ctx.fillStyle = 'rgb(c, c, c)'.replace(/c/g, `${255 - scaledValue}`);
      ctx.fillRect(0, height - (i * binHeight), binWidth, binHeight);
    }
    ctx.translate(binWidth, 0);
  }

  getColumnsInArea(timeExtents, datum) {
    const slice = datum instanceof Float32Array
      ? (start, end) => datum.subarray(start, end + 1)
      : (start, end) => datum.slice(start, end + 1);
    const stepDuration = this.params.stepDuration;
    if (stepDuration === 0) return []; // TODO think about this more
    // TODO bounds check
    const secondsToColumnIndex = (seconds) => (seconds / stepDuration) | 0;
    console.log(`${secondsToColumnIndex(timeExtents.start)}, ${secondsToColumnIndex(timeExtents.end)}`);
    return slice(
      secondsToColumnIndex(timeExtents.start),
      secondsToColumnIndex(timeExtents.end)
    );
  }

  getCurrentTimeExtents(renderingCtx) {
    // There is a note in layer.js that suggests returning the visible extents is something they've thought of but not done
    // but that it should be done at that level, which makes sense because this involves round-trip conversions, losing precision
    const pixelToTime = renderingCtx.timeToPixel.invert;
    const leftBoundPixels = -renderingCtx.trackOffsetX;
    const rightBoundPixels = leftBoundPixels + renderingCtx.visibleWidth;

    return {
      start: leftBoundPixels > 0 ? pixelToTime(leftBoundPixels) : 0,
      end: rightBoundPixels > 0 ? pixelToTime(rightBoundPixels) : 0
    };
  }
*/
}
