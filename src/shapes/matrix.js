
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
    this.$el = document.createElementNS(this.ns, 'image');
    this.$el.addEventListener('dragstart', e => { e.preventDefault(); }, false);
    console.log("matrix render returning");
    return this.$el;
  }

  encache(matrixEntity) {

    const before = performance.now();

    console.log("matrix cache called");

    const ncols = matrixEntity.getColumnCount();
    const height = matrixEntity.getColumnHeight();

    console.log("ncols = " + ncols);
    
    let p = new PNGEncoder(ncols, height, 256);

    for (let x = 0; x < ncols; ++x) {

      const col = matrixEntity.getColumn(x);
      
      for (let y = 0; y < height; ++y) {

        const value = Math.abs(col[y]);

        let scaledValue = 255 * value;
        if (scaledValue < 0) scaledValue = 0;
        if (scaledValue > 255) scaledValue = 255;
        scaledValue = Math.floor(scaledValue);
	scaledValue = 255 - scaledValue;

        const colour = p.color(scaledValue, scaledValue, scaledValue, 255);
        const index = p.index(x, y);
	p.buffer[index] = colour;
      }
    }

    console.log("drawing complete");
    
    let imgResource = 'data:image/png;base64,'+p.getBase64();

    console.log("got my image resource, it has length " + imgResource.length +
	       " (dimensions " + ncols + " x " + height + ")");

    const after = performance.now();
    console.log("matrix cache time = " + Math.round(after - before));
    
    return { resource: imgResource };
  }
  
  update(renderingContext, cache) {

    const before = performance.now();

    console.log("matrix update called");

    //!!! not necessarily right:
    
    this.$el.setAttributeNS(null, 'width', renderingContext.width);
    this.$el.setAttributeNS(null, 'height', renderingContext.height);
    this.$el.setAttributeNS(null, 'preserveAspectRatio', 'none');

    if (!cache.addedToElement) {
      console.log("About to add image resource to SVG...");
      this.$el.setAttributeNS('http://www.w3.org/1999/xlink', 'href',
                              cache.resource);
      cache.addedToElement = true;
      console.log("Done that");
    }
    
    const after = performance.now();
    console.log("matrix update time = " + Math.round(after - before));
  }
}
