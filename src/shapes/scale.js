import BaseShape from './base-shape';
import ns from '../core/namespace';


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

    let n = 10;
    let inc = (cy1 - cy0) / n;

    // todo: factor out, test
    let dp = 0;
    let sf = 0;
    let round = 1.0;
    let fixed = false;
    if (inc > 0) {
      let ilg = Math.log10(inc);
      let prec;
      if (ilg > 0) {
	prec = Math.round(ilg) - 1;
      } else {
	prec = Math.trunc(ilg) - 1;
      }
      if (prec < 0) {
        dp = -prec;
	sf = 2;
      } else {
	sf = prec;
      }
      if (sf === 0) {
	sf = 1;
      }
      if (prec < 4 && prec > -3) {
	fixed = true;
      }
      round = Math.pow(10.0, prec);

      console.log("inc = " + inc + ", prec = " + prec + ", dp = " + dp + ", sf = " +
		  sf + ", round = " + round);
      inc = Math.round(inc / round) * round;
      console.log("rounding inc to " + inc);
    } else {
      inc = 1.0;
    }

    for (let i = 0; i < this.$labels.length; ++i) {
      this.$el.removeChild(this.$labels[i]);
    }
    this.$labels = [];

    let scaleWidth = 35;

    this.$bg.setAttributeNS(null, 'width', scaleWidth);
    this.$bg.setAttributeNS(null, 'height', h);
    
    let path = `M${scaleWidth},0L${scaleWidth},${h}`;

    const addLabel = ((value, x, y) => {
    
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
      
      let label = "";
      if (fixed) {
	label = value.toFixed(dp);
      } else {
	label = value.toPrecision(sf);
      }

      $label.setAttributeNS(null, 'y', y);
      const $text = document.createTextNode(label);
      $label.appendChild($text);

      this.$labels.push($label);
      this.$el.appendChild($label);
    });

    const lx = 2;
    
    let prevy = h + 2;
				    
    for (let i = 0; ; ++i) {

      let val = cy0 + i * inc;
      if (val >= cy1) {
	break;
      }
      
      let dispval = Math.round(val / round) * round;
      let y = renderingContext.valueToPixel(dispval);

      let ly = h - y + 3;

      let showText = true;
      if (ly > h - 8 || ly < 8 || ly > prevy - 20) {
	// not enough space
	showText = false;
      }

      console.log("i = " + i + " -> val = " + val + ", dispval = " + dispval + ", y = " + y);

      if (!showText) {
	
	path = path + `M${scaleWidth-5},${y}L${scaleWidth},${y}`;

      } else {

	path = path + `M${scaleWidth-8},${y}L${scaleWidth},${y}`;
	prevy = ly;
	addLabel(dispval, lx, ly);
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
