import BaseShape from './base-shape';


const xhtmlNS = 'http://www.w3.org/1999/xhtml';

/**
 * A shape to display a waveform. (for entity data)
 *
 * [example usage](./examples/layer-waveform.html)
 *
 * @todo - fix problems with canvas strategy.
 */
export default class Waveform extends BaseShape {
  getClassName() { return 'waveform'; }

  _getAccessorList() {
    // return { y: 0 };
    return {};
  }

  _getDefaults() {
    return {
      sampleRate: 44100,
      color: '#000000',
      opacity: 1,
      // renderingStrategy: 'svg' // canvas is bugged (translation, etc...)
    };
  }

  render(renderingContext) {
    if (this.$el) { return this.$el; }

    // if (this.params.renderingStrategy === 'svg') {

      this.$el = document.createElementNS(this.ns, 'path');
      this.$el.setAttributeNS(null, 'fill', 'none');
      this.$el.setAttributeNS(null, 'shape-rendering', 'crispEdges');
      this.$el.setAttributeNS(null, 'stroke', this.params.color);
      this.$el.style.opacity = this.params.opacity;

    // } else if (this.params.renderingStrategy === 'canvas') {

    //   this.$el = document.createElementNS(this.ns, 'foreignObject');
    //   this.$el.setAttributeNS(null, 'width', renderingContext.width);
    //   this.$el.setAttributeNS(null, 'height', renderingContext.height);

    //   const canvas = document.createElementNS(xhtmlNS, 'xhtml:canvas');

    //   this._ctx = canvas.getContext('2d');
    //   this._ctx.canvas.width = renderingContext.width;
    //   this._ctx.canvas.height = renderingContext.height;

    //   this.$el.appendChild(canvas);
    // }

    return this.$el;
  }

  makePeakCache(datum, binSize) {
        
    const before = performance.now();

    const sliceMethod = datum instanceof Float32Array ? 'subarray' : 'slice';

    let peaks = [], troughs = [];

    const len = datum.length;
    
    for (let i = 0; i < len; i = i + binSize) {
      let min = datum[i];
      let max = datum[i];
      for (let j = 0; j < binSize; j++) {
        let sample = datum[i + j];
        if (sample < min) { min = sample; }
        if (sample > max) { max = sample; }
      }
      peaks.push(max);
      troughs.push(min);
    }

    console.log("makePeakCache time = " + Math.round(performance.now() - before) +
                ", size = " + peaks.length);

    return [peaks, troughs];
  }
  
  summarise(datum, minX, maxX, invert) {
        
    const sliceMethod = datum instanceof Float32Array ? 'subarray' : 'slice';

    const before = performance.now();

    let minMax = [];

    const cacheBinSize = 32;
    if (!this.caches) {
      this.caches = new Map();
    }
    if (!this.caches.has(datum)) {
      this.caches.set(datum, this.makePeakCache(datum, cacheBinSize));
    }

    let [ peaks, troughs ] = this.caches.get(datum);
    
    const sampleRate = this.params.sampleRate;

    for (let px = Math.floor(minX); px < Math.floor(maxX); px++) {

      const startTime = invert(px);
      const endTime = invert(px+1);
      const startSample = Math.floor(startTime * sampleRate);
      let endSample = Math.floor(endTime * sampleRate);

      if (startSample >= datum.length) {
        break;
      }
      if (endSample >= datum.length) {
        endSample = datum.length;
      }
      
      let min = datum[startSample];
      let max = min;
      
      let ix = startSample;

      while (ix < endSample && (ix % cacheBinSize) !== 0) {
        let sample = datum[ix];
        if (sample < min) { min = sample; }
        if (sample > max) { max = sample; }
        ++ix;
      }

      let cacheIx = ix / cacheBinSize;
      
      while (ix + cacheBinSize <= endSample) {
        if (peaks[cacheIx] > max) max = peaks[cacheIx];
        if (troughs[cacheIx] < min) min = troughs[cacheIx];
        ++cacheIx;
        ix = ix + cacheBinSize;
      }

      while (ix < endSample) {
        let sample = datum[ix];
        if (sample < min) { min = sample; }
        if (sample > max) { max = sample; }
        ++ix;
      }

      minMax.push([px, min, max]);
    }

    const after = performance.now();
    console.log("summarisation time = " + Math.round(after - before));
    
    return minMax;
  }

  update(renderingContext, datum) {
    // define nbr of samples per pixels
    const nbrSamples = datum.length;
    const duration = nbrSamples / this.params.sampleRate;
    const width = renderingContext.timeToPixel(duration);
    const samplesPerPixel = nbrSamples / width;

    if (!samplesPerPixel || datum.length < samplesPerPixel) { return; }

    // compute/draw visible area only
    // @TODO refactor this ununderstandable mess
    let minX = Math.max(-renderingContext.offsetX, 0);
    let trackDecay = renderingContext.trackOffsetX + renderingContext.startX;
    if (trackDecay < 0) { minX = -trackDecay; }

    let maxX = minX;
    maxX += (renderingContext.width - minX < renderingContext.visibleWidth) ?
      renderingContext.width : renderingContext.visibleWidth;

    // get min/max per pixels, clamped to the visible area
    const invert = renderingContext.timeToPixel.invert;
    const sampleRate = this.params.sampleRate;

    const minMax = this.summarise(datum, minX, maxX, invert);
    if (!minMax.length) { return; }

    const PIXEL = 0;
    const MIN   = 1;
    const MAX   = 2;
    const ZERO  = renderingContext.valueToPixel(0);
    // rendering strategies
    // if (this.params.renderingStrategy === 'svg') {

      let instructions = minMax.map((datum, index) => {
        const x  = datum[PIXEL];
        let y1 = Math.round(renderingContext.valueToPixel(datum[MIN]));
        let y2 = Math.round(renderingContext.valueToPixel(datum[MAX]));
        // return `${x},${ZERO}L${x},${y1}L${x},${y2}L${x},${ZERO}`;
        return `${x},${y1}L${x},${y2}`;
      });

      const d = 'M' + instructions.join('L');
      this.$el.setAttributeNS(null, 'd', d);

    // } else if (this.params.renderingStrategy === 'canvas') {

    //   this._ctx.canvas.width = width;
    //   this.$el.setAttribute('width', width);
    //   // fix chrome bug with translate
    //   if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
    //     this.$el.setAttribute('x', renderingContext.offsetX);
    //   }

    //   this._ctx.strokeStyle = this.params.color;
    //   this._ctx.globalAlpha = this.params.opacity;
    //   this._ctx.moveTo(renderingContext.timeToPixel(0), renderingContext.valueToPixel(0));

    //   minMax.forEach((datum) => {
    //     const x  = datum[PIXEL];
    //     let y1 = Math.round(renderingContext.valueToPixel(datum[MIN]));
    //     let y2 = Math.round(renderingContext.valueToPixel(datum[MAX]));

    //     this._ctx.moveTo(x, y1);
    //     this._ctx.lineTo(x, y2);
    //   });

    //   this._ctx.stroke();
    // }
  }
}
