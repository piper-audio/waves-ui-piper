import BaseShape from './base-shape';
import ns from '../core/namespace';
import {linear as calculateLinearTicks} from '../utils/scale-tick-intervals';


/**
 * A shape to display a vertical scale at the left edge of the visible
 * area of the layer. Scale values are taken from the yDomain of the
 * layer.
 *
 * [example usage](./examples/layer-scale.html)
 */
export default class Scale extends BaseShape {
  getClassName() { return 'scale'; }

  _getDefaults() {
    return {
      background: '#ffffff',
      tickColor: '#000000',
      textColor: '#000000',
      opacity: 1
    };
  }

  render(renderingContext) {
    if (this.$el) { return this.$el; }

    this.$el = document.createElementNS(this.ns, 'g');

    this.$bg = document.createElementNS(ns, 'rect');
    this.$bg.setAttributeNS(null, 'fill', this.params.background);
    this.$bg.setAttributeNS(null, 'x', 0);
    this.$bg.setAttributeNS(null, 'y', 0);
    this.$el.appendChild(this.$bg);

    this.$path = document.createElementNS(ns, 'path');
    this.$path.setAttributeNS(null, 'shape-rendering', 'geometricPrecision');
    this.$path.setAttributeNS(null, 'stroke-width', '0.7');
    this.$path.style.opacity = this.params.opacity;
    this.$path.style.stroke = this.params.tickColor;
    this.$el.appendChild(this.$path);

    this.$labels = [];

    return this.$el;
  }

  update(renderingContext, datum) {

    console.log("scale update");

    const h = renderingContext.height;
    const cy0 = renderingContext.valueToPixel.domain()[0];
    const cy1 = renderingContext.valueToPixel.domain()[1];

    if (typeof(this.lastCy0) !== 'undefined') {
      if (this.lastCy0 === cy0 &&
	  this.lastCy1 === cy1 &&
	  this.lastH === h) {
	console.log("scale unchanged");
	return;
      }
    }
    this.lastCy0 = cy0;
    this.lastCy1 = cy1;
    this.lastH = h;
    
    console.log("cy0 = " + cy0);
    console.log("cy1 = " + cy1);

    for (let i = 0; i < this.$labels.length; ++i) {
      this.$el.removeChild(this.$labels[i]);
    }
    this.$labels = [];

    const ticks = calculateLinearTicks(cy0, cy1, 10);

    let maxLength = ticks.reduce((acc, t) => Math.max(acc, t.label.length), 0);
    
    let scaleWidth = maxLength * 6.5 + 12;

    this.$bg.setAttributeNS(null, 'width', scaleWidth);
    this.$bg.setAttributeNS(null, 'height', h);
    
    let path = `M${scaleWidth},0L${scaleWidth},${h}`;

    const addLabel = ((text, x, y) => {
    
      const $label = document.createElementNS(this.ns, 'text');
      $label.classList.add('label');
      $label.style.fontSize = '10px';
      $label.style.lineHeight = '10px';
      $label.style.fontFamily = 'monospace';
      $label.style.fill = this.params.textColor;
      $label.style.opacity = this.params.opacity;
      $label.style.mozUserSelect = 'none';
      $label.style.webkitUserSelect = 'none';
      $label.style.userSelect = 'none';
      
      $label.setAttributeNS(
	null, 'transform', `matrix(1, 0, 0, -1, ${x}, ${h})`
      );
      
      $label.setAttributeNS(null, 'y', y);
      const $text = document.createTextNode(text);
      $label.appendChild($text);

      this.$labels.push($label);
      this.$el.appendChild($label);
    });

    const lx = 2;
    
    let prevy = h + 2;
    
    for (let i = 0; i < ticks.length; ++i) {

      let y = renderingContext.valueToPixel(ticks[i].value);

      let ly = h - y + 3;

      let showText = true;
      if (ly > h - 8 || ly < 8 || ly > prevy - 20) {
	// not enough space
	showText = false;
      }

      if (!showText) {
	
	path = path + `M${scaleWidth-5},${y}L${scaleWidth},${y}`;

      } else {

	path = path + `M${scaleWidth-8},${y}L${scaleWidth},${y}`;
	prevy = ly;
	addLabel(ticks[i].label, lx, ly);
      }
    }

    this.$path.setAttributeNS(null, 'd', path);
  }

  /**
   * The scale cannot be selected.
   * @return {Boolean} false
   */
  inArea() { return false; }
}
