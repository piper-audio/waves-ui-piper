import Segment from './segment';


/**
 * A shape to display a segment with annotation.
 *
 * [example usage](./examples/layer-segment.html)
 */
export default class AnnotatedSegment extends Segment {
  getClassName() { return 'annotated-segment'; }

  _getAccessorList() {
    let list = super._getAccessorList();
    list.text = 'default';
    return list;
  }

  _getDefaults() {
    let list = super._getDefaults();
    list.attachAnnotations = false;
    return list;
  }

  render(renderingContext) {
    this.$el = super.render(renderingContext);
    const height = renderingContext.height;

    this.$label = document.createElementNS(this.ns, 'text');
    this.$label.setAttributeNS(null, 'y', 11);
    this.$label.setAttributeNS(null, 'transform', `matrix(1, 0, 0, -1, 0, ${height})`);
    this.$label.style.fontSize = '10px';
    this.$label.style.fontFamily = 'monospace';
    this.$label.style.color = '#242424';
    this.$label.style.mozUserSelect = 'none';
    this.$label.style.webkitUserSelect = 'none';
    this.$label.style.userSelect = 'none';

    this.$el.appendChild(this.$label);

    return this.$el;
  }

  update(renderingContext, datum) {
    super.update(renderingContext, datum);
        
    const x = renderingContext.timeToPixel(this.x(datum));
    this.$label.setAttributeNS(null, 'x', x + 3);

    if (this.params.attachAnnotations) {
      let y = renderingContext.valueToPixel(this.y(datum)) + 4;
      if (y > renderingContext.height - 15) y = y - 14;
      y = renderingContext.height - y;
      this.$label.setAttributeNS(null, 'y', y);
    }

    const visible = (x >= renderingContext.minX && x <= renderingContext.maxX);

    if (!visible) {
      this.$label.setAttributeNS(null, 'visibility', 'hidden');
      return;
    } else {
      this.$label.setAttributeNS(null, 'visibility', 'visible');
    }

    if (this.$label.firstChild) {
      this.$label.removeChild(this.$label.firstChild);
    }

    const $text = document.createTextNode(this.text(datum));
    this.$label.appendChild($text);
  }
}
