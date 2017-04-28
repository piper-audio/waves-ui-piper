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
      color: '#000000',
      opacity: 1
    };
  }

  render(renderingContext) {
    if (this.$el) { return this.$el; }

    this.$el = document.createElementNS(this.ns, 'g');

    this.$path = document.createElementNS(ns, 'path');
    this.$path.setAttributeNS(null, 'shape-rendering', 'geometricPrecision');
    this.$path.setAttributeNS(null, 'stroke-width', '1');
    this.$path.style.opacity = this.params.opacity;
    this.$path.style.stroke = this.params.color;
    this.$el.appendChild(this.$path);

    this.$labels = [];

    /*document.createElementNS(this.ns, 'text'),
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
*/
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
	return;
      }
    }
    this.lastCy0 = cy0;
    this.lastCy1 = cy1;
    this.lastH = h;
    
    console.log("cy0 = " + cy0);
    console.log("cy1 = " + cy1);

    let n = 10;
    let val = cy0;
    let inc = (cy1 - cy0) / n;
    
    let dp = 0;
    let sf = 0;
    let round = 1.0;
    let fixed = false;
    if (inc > 0) {
      let prec = Math.trunc(Math.log10(inc)) - 1;
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
    }

    let prevy = -1;

    let path = "";
    for (let i = 0; i < this.$labels.length; ++i) {
      this.$el.removeChild(this.$labels[i]);
    }
    this.$labels = [];
    
    for (let i = 0; i < n; ++i) {

      let dispval = Math.round(val / round) * round;
      let y = renderingContext.valueToPixel(dispval);

      console.log("i = " + i + " -> val = " + val + ", dispval = " + dispval + ", y = " + y);
	
      let ly = h - y - 5;
      if (ly < 10) {
        ly = h - y + 15;
      }

      path = path + `M0,${y}L15,${y}`;

      const $label = document.createElementNS(this.ns, 'text');
      $label.classList.add('label');
      $label.style.fontSize = '10px';
      $label.style.lineHeight = '10px';
      $label.style.fontFamily = 'monospace';
      $label.style.color = '#676767';
      $label.style.opacity = 0.9;
      $label.style.mozUserSelect = 'none';
      $label.style.webkitUserSelect = 'none';
      $label.style.userSelect = 'none';
      this.$labels.push($label);
      this.$el.appendChild($label);

      $label.setAttributeNS(
        null, 'transform', `matrix(1, 0, 0, -1, 15, ${h})`
      );
      
      $label.setAttributeNS(null, 'y', ly);

      let label = "";
      if (fixed) {
	label = dispval.toFixed(dp);
      } else {
	label = dispval.toPrecision(sf);
      }
      const $text = document.createTextNode(label);
      $label.appendChild($text);

      prevy = y;
      val += inc;
    }

    this.$path.setAttributeNS(null, 'd', path);
  }

  /**
   * The scale cannot be selected.
   * @return {Boolean} false
   */
  inArea() { return false; }
}
