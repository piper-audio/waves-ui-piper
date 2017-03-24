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
      defaultOpacity: 0.3,
      labelPosition: 'top',
      shadeSegments: false,
      unconstrained: false // indicates we should always update all
                           // ticks that exist, as the layer is
                           // handling tick generation dynamically
                           // (e.g. in axis layer)
    };
  }

  render(renderingContext) {
    if (this.$el) { return this.$el; }
    
    this.$el = document.createElementNS(this.ns, 'g');
    
    return this.$el;
  }

  update(renderingContext, data) {

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

    const height = renderingContext.height;

    let instructions = [];

    const n = data.length;
    
    if (n > 0) {
      
      let nextX = renderingContext.timeToPixel(this.time(data[0]));
      let oddTick = false;
      let firstTick = true;

      const segmentOpacity = (odd => { return odd ? 0.1 : 0.05; });
      
      for (let i = 0; i < n; ++i) {

        const datum = data[i];
        const x = nextX;
        const lastTick = (i + 1 >= n);
        oddTick = !oddTick;

        if (!lastTick) {
          nextX = renderingContext.timeToPixel(this.time(data[i+1]));
        }
        if (!this.params.unconstrained) {
          if (x < renderingContext.minX) {
            continue;
          }
          if (!lastTick && (Math.floor(nextX) === Math.floor(x))) {
            continue;
          }
        }
        
        const opacity = this.focused(datum) ?
              this.params.focusedOpacity : this.params.defaultOpacity;

        instructions.push(`M${x},0L${x},${height}`);

        if (this.params.shadeSegments) {
          if (firstTick) {
            if (x > renderingContext.minX) {
              const segment = document.createElementNS(this.ns, 'rect');
              segment.setAttributeNS(null, 'width', x - renderingContext.minX);
              segment.setAttributeNS(null, 'height', height);
              segment.setAttributeNS(null, 'fill', this.params.color);
              segment.setAttributeNS(null, 'opacity', segmentOpacity(!oddTick));
              segment.setAttributeNS(null, 'transform', `translate(${renderingContext.minX}, 0)`);
              this.$el.appendChild(segment);
            }
          }
          if (lastTick || nextX > x + 1) {
            const segment = document.createElementNS(this.ns, 'rect');
            segment.setAttributeNS(null, 'width', lastTick ? '100%' : (nextX - x));
            segment.setAttributeNS(null, 'height', height);
            segment.setAttributeNS(null, 'fill', this.params.color);
            segment.setAttributeNS(null, 'opacity', segmentOpacity(oddTick));
            segment.setAttributeNS(null, 'transform', `translate(${x}, 0)`);
            this.$el.appendChild(segment);
          }
        }
        
        const label = this.label(datum);

        if (label && label !== "") {

          // find the next label -- we only need enough space between
          // this tick and that one, not necessarily between this and
          // its (possibly unlabelled) neighbour

          let nextLabelX = x - 1;
          for (let j = i + 1; j < n; ++j) {
            const nextLabel = this.label(data[j]);
            if (nextLabel && nextLabel !== "") {
              nextLabelX = renderingContext.timeToPixel(this.time(data[j]));
              break;
            }
          }
          
          const estWidth = label.length * 6;
          const enoughSpaceForLabel = (nextLabelX < x || x + estWidth < nextLabelX);

          if (enoughSpaceForLabel) {
          
            const $label = document.createElementNS(this.ns, 'text');
            $label.classList.add('label');
            const $text = document.createTextNode(label);

            $label.appendChild($text);
            $label.setAttributeNS(null, 'transform', `matrix(1, 0, 0, -1, ${x + 2}, ${height + 2})`);
            // firefox problem here
            // $label.setAttributeNS(null, 'alignment-baseline', 'text-before-edge');

            if (this.params.labelPosition === 'bottom') {
              $label.setAttributeNS(null, 'y', height);
            } else {
              $label.setAttributeNS(null, 'y', '10');
            }

            $label.style.fontSize = '10px';
            $label.style.lineHeight = '10px';
            $label.style.fontFamily = 'monospace';
            $label.style.color = '#676767';
            $label.style.opacity = 0.9;
            $label.style.mozUserSelect = 'none';
            $label.style.webkitUserSelect = 'none';
            $label.style.userSelect = 'none';
/*
            const bg = document.createElementNS(this.ns, 'rect');
            bg.setAttributeNS(null, 'width', '100%');
            bg.setAttributeNS(null, 'height', '100%');
            bg.setAttributeNS(null, 'fill', '#ffffff');
            $label.appendChild(bg);
*/
            this.$el.appendChild($label);
          }
        }

        if (!this.params.unconstrained) {
          if (nextX > renderingContext.maxX) {
            break;
          }
        }
        
        firstTick = false;
      }
    }

    const d = instructions.join('');
    ticks.setAttributeNS(null, 'd', d);

    const after = performance.now();
    console.log("ticks update time = " + Math.round(after - before) + "ms");
  }
}
