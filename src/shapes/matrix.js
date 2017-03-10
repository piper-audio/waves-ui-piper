
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
      sampleRate: 44100,
      color: '#000000',
      opacity: 1,
    };
  }

  render(renderingCtx) {
    console.log("matrix render called");
    if (this.$el) { return this.$el; }
    this.$el = document.createElementNS(this.ns, 'g');
    console.log("matrix render returning");
    return this.$el;
  }

  encache(matrixEntity) {

    const before = performance.now();

    console.log("matrix cache called");

    const height = matrixEntity.getColumnHeight();
    const totalWidth = matrixEntity.getColumnCount();
    let tileWidth = 1000;
    if (totalWidth < tileWidth * 3) {
      tileWidth = totalWidth;
    }

    console.log("totalWidth = " + totalWidth + ", tileWidth = " + tileWidth);

    let resources = [];
    let widths = [];
    
    for (let x0 = 0; x0 < totalWidth; x0 += tileWidth) {

      let w = tileWidth;
      if (totalWidth - x0 < tileWidth) {
	w = totalWidth - x0;
      }
      
      let p = new PNGEncoder(w, height, 256);

      for (let i = 0; i < w; ++i) {

	const x = x0 + i;
	const col = matrixEntity.getColumn(x);
      
	for (let y = 0; y < height; ++y) {

          const value = Math.abs(col[y]);

          let scaledValue = 255 * value;
          if (scaledValue < 0) scaledValue = 0;
          if (scaledValue > 255) scaledValue = 255;
          scaledValue = Math.floor(scaledValue);
	  scaledValue = 255 - scaledValue;

          const colour = p.color(scaledValue, scaledValue, scaledValue, 255);
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
	elt.addEventListener('dragstart', e => { e.preventDefault(); }, false);
	this.$el.appendChild(elt);
	cache.elements.push(elt);
      }
      console.log("Done that");
    }

    console.log("Render width = " + renderingContext.width);
    
    const widthScaleFactor = renderingContext.width / cache.totalWidth;
    let widthAccumulated = 0;
    
    for (let i = 0; i < cache.elements.length; ++i) {
      const elt = cache.elements[i];
      const tileWidth = cache.tileWidths[i];
      const x = widthAccumulated * widthScaleFactor;
      const w = tileWidth * widthScaleFactor;
      elt.setAttributeNS(null, 'x', x);
      elt.setAttributeNS(null, 'y', 0);
      elt.setAttributeNS(null, 'width', w);
      elt.setAttributeNS(null, 'height', renderingContext.height);
      console.log("setting x coord of image " + i + " to " + x);
      widthAccumulated += tileWidth;
    }
      
    const after = performance.now();
    console.log("matrix update time = " + Math.round(after - before));
  }
}
