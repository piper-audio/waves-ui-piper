import BaseShape from './base-shape';
import ns from '../core/namespace';

/**
 * A shape to display a vertical scale at the left edge of the visible
 * area of the layer. Scale values are taken from the yDomain of the
 * layer.
 *
 * [example usage](./examples/layer-scale.html)
 */
export default class DiscreteScale extends BaseShape {
  getClassName() { return 'scale'; }

  _getDefaults() {
    return {
      background: '#ffffff',
      tickColor: '#000000',
      textColor: '#000000',
      opacity: 1,
      binNames: []
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

    console.log("discrete scale update");

    const h = renderingContext.height;

    if (typeof(this.lastH) !== 'undefined') {
      if (this.lastH === h) {
	return;
      }
    }
    this.lastH = h;

    const binNames = this.params.binNames;
    if (!binNames || binNames.length === 0) {
      console.log("no bin names provided!");
      return;
    }
    
    for (let i = 0; i < this.$labels.length; ++i) {
      this.$el.removeChild(this.$labels[i]);
    }
    this.$labels = [];

    const n = binNames.length;
    const maxLength = binNames.reduce((acc, t) => Math.max(acc, t.length), 0);
    
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

    const lx = 3;

    let prevy = 0;
    let prevly = h + 12;
    
    for (let i = 0; i < n; ++i) {

      let y = (i * h) / n;
      let ly = h - y - 3;

      let showText = (binNames[i] !== "");
      if (showText && (ly < 6 || ly > prevly - 12)) {
	// not enough space
	showText = false;
      }

//      console.log("ly = " + ly + ", prevly = " + prevly + ", h = " + h + ", label = " + binNames[i] + ", showText = " + showText);      

      if (y > prevy + 1) {
      	path = path + `M${scaleWidth-5},${y}L${scaleWidth},${y}`;
        prevy = y;
      }

      if (showText) {
	addLabel(binNames[i], lx, ly);
	prevly = ly;
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
