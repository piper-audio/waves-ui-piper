/**
 * Created by lucast on 04/01/2017.
 */
import BaseShape from './base-shape';
import TimelineTimeContext from '../core/timeline-time-context';
import LayerTimeContext from '../core/layer-time-context';

const xhtmlNS = 'http://www.w3.org/1999/xhtml';

export default class Spectrogram extends BaseShape {
  getClassName() {
    return 'spectrogram';
  }

  // TODO determine suitable implementations for _getAccessorList and _getDefaults
  _getDefaults() {
    return {
      opacity: 1.0
    };
  }

  render(renderingCtx) {
    // TODO this is pasted straight from the commented out Canvas code in waveform.js, refactor
    // TODO canvas also doesn't work properly when embedded in an SVG element - so this all needs to go anyway
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

  }

  update(renderingCtx, datum) {
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
  }

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
}