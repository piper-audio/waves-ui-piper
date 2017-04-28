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

    this.$el = document.createElementNS(this.ns, 'g');

    this.$path = document.createElementNS(ns, 'path');
    this.$path.setAttributeNS(null, 'shape-rendering', 'geometricPrecision');
    this.$path.setAttributeNS(null, 'stroke-width', '1.5');
    this.$path.style.opacity = this.params.opacity;
    this.$path.style.stroke = this.params.color;
    this.$el.appendChild(this.$path);

    this.$labels = [
      document.createElementNS(this.ns, 'text'),
      document.createElementNS(this.ns, 'text')
    ];

    for (let i = 0; i < this.$labels.length; ++i) {
      const $label = this.$labels[i];
      $label.classList.add('label');
      $label.style.fontSize = '10px';
      $label.style.lineHeight = '10px';
      $label.style.fontFamily = 'monospace';
      $label.style.color = '#676767';
      $label.style.opacity = 0.9;
      $label.style.mozUserSelect = 'none';
      $label.style.webkitUserSelect = 'none';
      $label.style.userSelect = 'none';
      this.$el.appendChild($label);
    }

    return this.$el;
  }

  update(renderingContext, datum) {

    console.log("crosshairs update: datum = " + datum);
    
    const cx = this.cx(datum);
    const cy = this.cy(datum);
    const x = Math.round(renderingContext.timeToPixel(cx)) + 0.5;
    const y = Math.round(renderingContext.valueToPixel(cy)) + 0.5;

    const minX = Math.floor(renderingContext.minX);
    const maxX = Math.ceil(renderingContext.maxX);
    const h = renderingContext.height;
    
    this.$path.setAttributeNS(null, 'd',
                              `M${x},${0}L${x},${h}M${minX},${y}L${maxX},${y}`);

    const label = cy.toPrecision(4);
    const lw = label.length * 10;

    for (let i = 0; i < this.$labels.length; ++i) {

      const $label = this.$labels[i];

      while ($label.firstChild) {
        $label.removeChild($label.firstChild);
      }
      
      const $textLeft = document.createTextNode(label);
      $label.appendChild($textLeft);
      
      let lx = minX + 2;
      if (i == 1) {
        lx = maxX - lw - 2;
      }
      
      $label.setAttributeNS(
        null, 'transform', `matrix(1, 0, 0, -1, ${lx}, ${h})`
      );

      let ly = h - y - 5;
      if (ly < 10) {
        ly = h - y + 15;
      }
      
      $label.setAttributeNS(null, 'y', ly);
    }
  }

  /**
   * The crosshairs cannot be selected.
   * @return {Boolean} false
   */
  inArea() { return false; }
}
