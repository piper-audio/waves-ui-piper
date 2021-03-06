
import BaseShape from './base-shape';
import TimelineTimeContext from '../core/timeline-time-context';
import LayerTimeContext from '../core/layer-time-context';
import PNGEncoder from '../utils/png.js';

const xhtmlNS = 'http://www.w3.org/1999/xhtml';

export default class Matrix extends BaseShape {

  getClassName() {
    return 'matrix';
  }

  _getAccessorList() {
    // return { y: 0 };
    return {};
  }

  // TODO determine suitable implementations for _getAccessorList and _getDefaults
  _getDefaults() {
    return {
      normalise: 'none',
      mapper: (value => {
        // The mapper accepts a value, which is guaranteed to be in
        // the range [0,1], and returns r, g, b components which are
        // also in the range [0,1]. This example mapper just returns a
        // grey level.
        let level = 1.0 - value;
        return [ level, level, level ];
      }),
      gain: 1.0,
      smoothing: false, // NB with smoothing we get visible joins at tile boundaries
      maxDataUriLength: 32767 // old IE browser limitation, others are more helpful
    };
  }

  render(renderingCtx) {
    console.log("matrix render called");
    if (this.$el) { return this.$el; }
    this.$el = document.createElementNS(this.ns, 'g');
    if (!this.params.smoothing) {
      // for Chrome
      this.$el.setAttributeNS(null, 'image-rendering', 'pixelated');
    }
    console.log("matrix render returning");
    return this.$el;
  }

  _hybridNormalise(gain) {
    return (col => {
      let max = 0.0;
      for (let i = 0; i < col.length; ++i) {
        let value = Math.abs(col[i]);
        if (value > max) {
          max = value;
        }
      }
      let scale = gain;
      if (max > 0.0) {
        scale = scale * (Math.log10(max + 1.0) / max);
      }
      let n = [];
      for (let i = 0; i < col.length; ++i) {
        let value = col[i];
        n.push(value * scale);
      }
      return n;
    });
  }

  _columnNormalise(gain) {
    return (col => {
      let max = 0.0;
      for (let i = 0; i < col.length; ++i) {
        let value = Math.abs(col[i]);
        if (value > max) {
          max = value;
        }
      }
      let scale = gain;
      if (max > 0.0) {
        scale = scale * (1.0 / max);
      }
      let n = [];
      for (let i = 0; i < col.length; ++i) {
        let value = col[i];
        n.push(value * scale);
      }
      return n;
    });
  }      
  
  _noNormalise(gain) {
    return (col => {
      let n = [];
      for (let i = 0; i < col.length; ++i) {
        let value = col[i];
        n.push(value * gain);
      }
      return n;
    });
  }      
  
  encache(matrixEntity) {

    const before = performance.now();

    console.log("matrix cache called");

    const height = matrixEntity.getColumnHeight();
    const totalWidth = matrixEntity.getColumnCount();

    // We use one byte per pixel, as our PNG is indexed but
    // uncompressed, and base64 encoding increases that to 4/3
    // characters per pixel. The header and data URI scheme stuff add
    // a further 1526 chars after encoding, which we round up to 1530
    // for paranoia.
    const maxPixels = Math.floor((this.params.maxDataUriLength * 3) / 4 - 1530);
    let tileWidth = Math.floor(maxPixels / height);
    if (tileWidth < 1) {
      console.log("WARNING: Matrix shape tile width of " + tileWidth +
                  " calculated for height " + height +
                  ", using 1 instead: this may exceed maxDataUriLength of " +
                  this.params.maxDataUriLength);
      tileWidth = 1;
    }
    console.log("totalWidth = " + totalWidth + ", tileWidth = " + tileWidth);

    let resources = [];
    let widths = [];

    let normalise = null;

    switch (this.params.normalise) {
    case 'hybrid':
      normalise = this._hybridNormalise(this.params.gain);
      break;
    case 'column':
      normalise = this._columnNormalise(this.params.gain);
      break;
    default:
      normalise = this._noNormalise(this.params.gain);
      break;
    }

    const condition = (col => {
      let n = [];
      for (let i = 0; i < col.length; ++i) {
        if (col[i] === Infinity || isNaN(col[i])) n.push(0.0);
        else n.push(col[i]);
      }
      return n;
    });

    const usualWidth = tileWidth;
    const usualEncoder = new PNGEncoder(usualWidth, height, 256);
    
    for (let x0 = 0; x0 < totalWidth; x0 += tileWidth) {

      let w = tileWidth;
      if (totalWidth - x0 < tileWidth) {
	w = totalWidth - x0;
      }
      
      let p = (w === tileWidth ?
               usualEncoder :
               new PNGEncoder(w, height, 256));

      for (let i = 0; i < w; ++i) {

	const x = x0 + i;
        let col = matrixEntity.getColumn(x);
        col = normalise(condition(col));
        
	for (let y = 0; y < height; ++y) {
          let value = col[y];
          // The value must be in the range [0,1] to pass to the
          // mapper. We also quantize the range, as the PNG encoder
          // uses a 256-level palette.
          if (value < 0) value = 0;
          if (value > 1) value = 1;
          value = Math.round(value * 255) / 255;
          let [ r, g, b ] = this.params.mapper(value);
          if (r < 0) r = 0;
          if (r > 1) r = 1;
          if (g < 0) g = 0;
          if (g > 1) g = 1;
          if (b < 0) b = 0;
          if (b > 1) b = 1;
          const colour = p.color(Math.round(r * 255),
                                 Math.round(g * 255),
                                 Math.round(b * 255),
                                 255);
          const index = p.index(i, y);
	  p.buffer[index] = colour;
	}
      }

      const resource = 'data:image/png;base64,' + p.getBase64();
      resources.push(resource);
      widths.push(w);

      console.log("image " + resources.length + ": length " + resource.length +
		  " (dimensions " + w + " x " + height + ")");
    }

    console.log("drawing complete");

    const after = performance.now();
    console.log("matrix cache time = " + Math.round(after - before));
    
    return {
      resources: resources,
      tileWidths: widths,
      totalWidth: totalWidth,
      height: height,
      startTime: matrixEntity.getStartTime(),
      stepDuration: matrixEntity.getStepDuration(),
      elements: [] // will be installed in first call to update
    };
  }
  
  update(renderingContext, cache) {

    const before = performance.now();

    console.log("matrix update called");

    if (!cache.totalWidth || !cache.height ||
	!renderingContext.width || !renderingContext.height) {
      console.log("nothing to update");
      return;
    }

    if (cache.elements.length === 0) {
      console.log("About to add " + cache.resources.length +
		  " image resources to SVG...");
      for (let i = 0; i < cache.resources.length; ++i) {
	const resource = cache.resources[i];
	const elt = document.createElementNS(this.ns, 'image');
	elt.setAttributeNS('http://www.w3.org/1999/xlink', 'href', resource);
        elt.setAttributeNS(null, 'preserveAspectRatio', 'none');
        if (!this.params.smoothing) {
          // for Firefox
	  elt.setAttributeNS(null, 'image-rendering', 'optimizeSpeed');
        }
	elt.addEventListener('dragstart', e => { e.preventDefault(); }, false);
	this.$el.appendChild(elt);
	cache.elements.push(elt);
      }
      console.log("Done that");
    }

    console.log("Render width = " + renderingContext.width);

    let startX = renderingContext.timeToPixel(cache.startTime);
    const drawnWidth = renderingContext.width - startX;
    let widthScaleFactor = drawnWidth / cache.totalWidth;

    if (cache.stepDuration > 0) {
      let totalDuration = cache.stepDuration * cache.totalWidth;
      let endX = renderingContext.timeToPixel(cache.startTime + totalDuration);
      widthScaleFactor = (endX - startX) / cache.totalWidth;
    }
    
    let widthAccumulated = 0;
    
    for (let i = 0; i < cache.elements.length; ++i) {
      const elt = cache.elements[i];
      const tileWidth = cache.tileWidths[i];
      const x = startX + widthAccumulated * widthScaleFactor;
      const w = tileWidth * widthScaleFactor;
      const visible = (x + w > 0 && x < renderingContext.maxX);
      if (visible) {
        elt.setAttributeNS(null, 'x', Math.floor(x));
        elt.setAttributeNS(null, 'width', Math.ceil(x + w) - Math.floor(x));
        elt.setAttributeNS(null, 'y', 0);
        elt.setAttributeNS(null, 'height', renderingContext.height);
        elt.setAttributeNS(null, 'visibility', 'visible');
      } else {
        elt.setAttributeNS(null, 'visibility', 'hidden');
      }
      widthAccumulated += tileWidth;
    }
    
    const after = performance.now();
    console.log("matrix update time = " + Math.round(after - before));
  }
}
