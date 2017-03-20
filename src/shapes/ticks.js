import BaseShape from './base-shape';

/**
 * Kind of Marker for entity oriented data. Useful to display a grid.
 */
export default class Ticks extends BaseShape {
  _getClassName() {
    return 'tick';
  }

  _getAccessorList() {
    return { time: 0, focused: true, label: '' };
  }

  _getDefaults() {
    return {
      color: 'steelblue',
      focusedOpacity: 0.8,
      defaultOpacity: 0.3
    };
  }

  render(renderingContext) {
    if (this.$el) { return this.$el; }
    
    this.$el = document.createElementNS(this.ns, 'g');
    
    return this.$el;
  }

  update(renderingContext, data) {

    const hop = renderingContext.timeToPixel(1) - renderingContext.timeToPixel(0);
    if (hop === this.lastUpdateHop) {
      console.log("zoom level unchanged, still a hop of " + hop + " pps");
      return;
    } else {
      this.lastUpdateHop = hop;
    }
    
    const before = performance.now();

    while (this.$el.firstChild) {
      this.$el.removeChild(this.$el.firstChild);
    }

    const ticks = document.createElementNS(this.ns, 'path');
    ticks.setAttributeNS(null, 'fill', 'none');
    ticks.setAttributeNS(null, 'shape-rendering', 'crispEdges');
    ticks.setAttributeNS(null, 'stroke', this.params.color);
    ticks.setAttributeNS(null, 'stroke-width', 2);
    ticks.style.opacity = this.params.opacity;

    this.$el.appendChild(ticks);

    const layerHeight = renderingContext.height; // valueToPixel(1);

    let instructions = [];
    
    data.forEach((datum) => {
      const x = renderingContext.timeToPixel(this.time(datum));
      const opacity = this.focused(datum) ?
        this.params.focusedOpacity : this.params.defaultOpacity;

      const height = layerHeight;

      instructions.push(`M${x},0L${x},${height}`);

      const label = this.label(datum);
      if (label) {
        const $label = document.createElementNS(this.ns, 'text');
        $label.classList.add('label');
        const $text = document.createTextNode(label);
        $label.appendChild($text);
        $label.setAttributeNS(null, 'transform', `matrix(1, 0, 0, -1, ${x + 2}, ${height + 2})`);
        // firefox problem here
        // $label.setAttributeNS(null, 'alignment-baseline', 'text-before-edge');
        $label.setAttributeNS(null, 'y', '10');

        $label.style.fontSize = '10px';
        $label.style.lineHeight = '10px';
        $label.style.fontFamily = 'monospace';
        $label.style.color = '#676767';
        $label.style.opacity = 0.9;
        $label.style.mozUserSelect = 'none';
        $label.style.webkitUserSelect = 'none';
        $label.style.userSelect = 'none';

        // const bg = document.createElementNS(this.ns, 'rect');
        // bg.setAttributeNS(null, 'width', '100%');
        // bg.setAttributeNS(null, 'height', '100%');
        // bg.setAttributeNS(null, 'fill', '#ffffff');
        // label.appendChild(bg);

        this.$el.appendChild($label);
      }
    });

    const d = instructions.join('');
    ticks.setAttributeNS(null, 'd', d);

    const after = performance.now();
    console.log("ticks update time = " + Math.round(after - before) + "ms");
  }
}
