import BaseShape from './base-shape';

/**
 * A shape to display a line. Its main use is as common shape to create a
 * breakpoint visualization. (entity shape)
 *
 * [example usage](./examples/layer-breakpoint.html)
 */
export default class Line extends BaseShape {
  getClassName() { return 'line'; }

  _getAccessorList() {
    return { cx: 0, cy: 0 };
  }

  _getDefaults() {
    return { color: '#000000' };
  }

  render(renderingContext) {
    if (this.$el) { return this.$el; }

    this.$el = document.createElementNS(this.ns, 'path');
    this.$el.setAttributeNS(null, 'shape-rendering', 'geometricPrecision');
    return this.$el;
  }

  encache(data) {

    data = data.slice(0);
    data.sort((a, b) => this.cx(a) < this.cx(b) ? -1 : 1);

    return data;
  }

  _findInData(data, x) {

    // Binary search, demands that data has been encached
    // (i.e. sorted). Returns index of value that matches x. If there
    // is no exact match, returns the index just before where x would
    // appear, unless x would appear as the first element in which
    // case 0 is returned. (So the returned index is always in range
    // for the input array, unless the input array is empty.)

    // Note that x must be in model coordinates (e.g. time), not pixel
    // coords.

    let low = 0;
    let high = data.length - 1;

    while (low <= high) {
      let mid = low + ((high - low) >> 1);
      let value = this.cx(data[mid]);
      if (value < x) {
        low = mid + 1;
      } else if (value > x) {
        high = mid - 1;
      } else {
        return mid;
      }
    }

    if (high < 0) {
      return 0;
    } else {
      return high;
    }
  }
  
  update(renderingContext, data) { // data array is sorted already
    
    const before = performance.now();

    const minX = Math.floor(renderingContext.minX);
    const maxX = Math.ceil(renderingContext.maxX);

    if (data === [] ||
        renderingContext.timeToPixel(this.cx(data[0])) > maxX ||
        renderingContext.timeToPixel(this.cx(data[data.length-1])) < minX) {
      this.$el.setAttributeNS(null, 'visibility', 'hidden');
      return;
    } else {
      this.$el.setAttributeNS(null, 'visibility', 'visible');
    }
    
    let instructions = [];
    const n = data.length;
    
    // We want to start with the last element to the left of the
    // visible region, and end with the first element beyond the right
    // of it
    
    let cx0 = renderingContext.timeToPixel.invert(minX);
    let i0 = this._findInData(data, cx0);
    
    let nextX = renderingContext.timeToPixel(this.cx(data[i0]));
    
    for (let i = i0; i < n; ++i) {
      
      const x = nextX;
      
      if (i + 1 < n) {
        nextX = renderingContext.timeToPixel(this.cx(data[i+1]));
      }
      
      const y = renderingContext.valueToPixel(this.cy(data[i])) - 0.5;
      
      instructions.push(`${x},${y}`);
      
      if (x > maxX) {
        break;
      }
    }          

    const instructionStr = 'M' + instructions.join('L');
    this.$el.setAttributeNS(null, 'd', instructionStr);

    this.$el.style.stroke = this.params.color;
    this.$el.style.strokeWidth = 2;
    this.$el.style.fill = 'none';

    const after = performance.now();
    console.log("line update time = " + Math.round(after - before));
    
    data = null;
  }

  describe(data, t) {
    if (!data.length) return 0;
    let i = this._findInData(data, t);
    const cx = this.cx(data[i]);
    const cy = this.cy(data[i]);
    let unit = "";
    if (typeof(data[i].unit) !== 'undefined') {
      unit = data[i].unit;
    }
    return [{
      cx: cx,
      cy: cy,
      unit: unit
    }];
  }
}
