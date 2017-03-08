
import BaseShape from './base-shape';
import TimelineTimeContext from '../core/timeline-time-context';
import LayerTimeContext from '../core/layer-time-context';
import PNGEncoder from '../utils/png.js';

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
    };
  }

  render(renderingCtx) {
    console.log("grid render called");
    if (this.$el) { return this.$el; }
    this.$el = document.createElementNS(this.ns, 'image');
    console.log("grid render returning");
    return this.$el;
  }

  cache(datum) {

    const before = performance.now();

    console.log("grid cache called");

    const blockSize = 2048;
    const stepSize = 1024;

    const n = datum.length;

    const ncols = Math.floor(n / stepSize); //!!! not always right
    
    var p = new PNGEncoder(ncols, blockSize, 256);

    for (let col = 0; col < ncols; ++col) {

      const sample = col * stepSize;

      if (col * stepSize + blockSize > n) {
        break;
      }

      for (let y = 0; y < blockSize; ++y) {
        const ix = col * stepSize + y;
        const value = Math.abs(datum[ix]);

        let scaledValue = 255 * value;
        if (scaledValue < 0) scaledValue = 0;
        if (scaledValue > 255) scaledValue = 255;
        scaledValue = Math.floor(scaledValue);
	scaledValue = 255 - scaledValue;

	p.buffer[p.index(col, y)] =
	  p.color(scaledValue, scaledValue, scaledValue, 255);
      }
    }

    console.log("drawing complete");
    
    let imgResource = 'data:image/png;base64,'+p.getBase64();

    console.log("got my image resource, it has length " + imgResource.length +
	       " (dimensions " + ncols + " x " + blockSize + ")");

    const after = performance.now();
    console.log("grid cache time = " + Math.round(after - before));
    
    return { resource: imgResource };
  }
  
  update(renderingContext, datum, cache) {

    const before = performance.now();

    console.log("grid update called");

    this.$el.setAttributeNS(null, 'width', renderingContext.width);
    this.$el.setAttributeNS(null, 'height', renderingContext.height);
    this.$el.setAttributeNS(null, 'preserveAspectRatio', 'none');
    this.$el.setAttributeNS('http://www.w3.org/1999/xlink', 'href', cache.resource);
    
    const after = performance.now();
    console.log("grid update time = " + Math.round(after - before));
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
