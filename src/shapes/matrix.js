
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
        let v = 255 * Math.abs(value);
        if (v < 0) v = 0;
        if (v > 255) v = 255;
        v = 255 - Math.floor(v);
        return [v, v, v, 255];
      }),
      gain: 1.0
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
  
  encache(matrixEntity) {

    const before = performance.now();

    console.log("matrix cache called");

    const ncols = matrixEntity.getColumnCount();
    const height = matrixEntity.getColumnHeight();

    console.log("ncols = " + ncols);

    let normalise = (col => { return col; });

    switch (this.params.normalise) {
    case 'hybrid':
      normalise = this._hybridNormalise(this.params.gain);
      break;
    case 'column':
      normalise = this._columnNormalise(this.params.gain);
      break;
    }
    
    let p = new PNGEncoder(ncols, height, 256);

    for (let x = 0; x < ncols; ++x) {

      const col = normalise(matrixEntity.getColumn(x));
      
      for (let y = 0; y < height; ++y) {
        const value = col[y];
        const [ r, g, b, a ] = this.params.mapper(value);
        const colour = p.color(r, g, b, a);
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
