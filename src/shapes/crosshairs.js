import BaseShape from './base-shape';
import ns from '../core/namespace';


/**
 * A shape to display labelled crosshairs or similar positional
 * crosshairs/focus overlay.
 *
 * [example usage](./examples/layer-crosshairs.html)
 */
export default class Crosshairs extends BaseShape {
  getClassName() { return 'crosshairs'; }

  _getAccessorList() {
    return { cx: 0, cy: 0 };
  }

  _getDefaults() {
    return {
      color: '#000000',
      opacity: 1
    };
  }

  render(renderingContext) {
    if (this.$el) { return this.$el; }
    this.$el = document.createElementNS(ns, 'path');
    this.$el.setAttributeNS(null, 'shape-rendering', 'crispEdges');
    this.$el.style.stroke = this.params.color;
    return this.$el;
  }

  update(renderingContext, datum) {
    
    const cx = this.cx(datum);
    const cy = this.cy(datum);
    const x = Math.round(renderingContext.timeToPixel(cx)) + 0.5;
    const y = Math.round(renderingContext.valueToPixel(cy)) + 0.5;

    const minX = Math.floor(renderingContext.minX);
    const maxX = Math.ceil(renderingContext.maxX);
    const h = renderingContext.height;
    
    this.$el.setAttributeNS(null, 'd',
                            `M${x},${0}L${x},${h}M${minX},${y}L${maxX},${y}`);
  }

  /**
   * The crosshairs cannot be selected.
   * @return {Boolean} false
   */
  inArea() { return false; }
}
