import BaseShape from './base-shape';


/**
 * A shape to display a segment.
 *
 * [example usage](./examples/layer-segment.html)
 */
export default class Segment extends BaseShape {
  getClassName() { return 'segment'; }

  _getAccessorList() {
    return { x: 0, y: 0, width: 0, height: 1, color: '#000000', opacity: 1 };
  }

  _getDefaults() {
    return {
      displayHandlers: true,
      handlerWidth: 2,
      handlerOpacity: 0.8,
      opacity: 0.6
    };
  }

  render(renderingContext) {
    if (this.$el) { return this.$el; }

    this.$segment = document.createElementNS(this.ns, 'rect');
    this.$segment.classList.add('segment');
    this.$segment.style.opacity = this.params.opacity;
    this.$segment.setAttributeNS(null, 'shape-rendering', 'geometricPrecision');

    const useShortcut = (this.getClassName() == 'segment' && // not a subclass
                         !this.params.displayHandlers);

    if (useShortcut) {

      this.$el = this.$segment;

    } else {

      this.$el = document.createElementNS(this.ns, 'g');
      this.$el.appendChild(this.$segment);

      if (this.params.displayHandlers) {
        
        this.$leftHandler = document.createElementNS(this.ns, 'rect');
        this.$leftHandler.classList.add('left', 'handler');
        this.$leftHandler.setAttributeNS(null, 'width', this.params.handlerWidth);
        this.$leftHandler.setAttributeNS(null, 'shape-rendering', 'crispEdges');
        this.$leftHandler.style.opacity = this.params.handlerOpacity;
        this.$leftHandler.style.cursor = 'ew-resize';

        this.$rightHandler = document.createElementNS(this.ns, 'rect');
        this.$rightHandler.classList.add('right', 'handler');
        this.$rightHandler.setAttributeNS(null, 'width', this.params.handlerWidth);
        this.$rightHandler.setAttributeNS(null, 'shape-rendering', 'crispEdges');
        this.$rightHandler.style.opacity = this.params.handlerOpacity;
        this.$rightHandler.style.cursor = 'ew-resize';

        this.$el.appendChild(this.$leftHandler);
        this.$el.appendChild(this.$rightHandler);
      }
    }

    return this.$el;
  }

  update(renderingContext, datum) {
    
    const x = renderingContext.timeToPixel(this.x(datum));
    const y = renderingContext.valueToPixel(this.y(datum));

    const width = renderingContext.timeToPixel(this.x(datum) +
                                               this.width(datum)) - x;

    const height = renderingContext.valueToPixel(this.height(datum));

    this.$segment.setAttributeNS(null, 'x', x);
    this.$segment.setAttributeNS(null, 'y', y);
    this.$segment.setAttributeNS(null, 'width', Math.max(width, 0));
    this.$segment.setAttributeNS(null, 'height', height);

    const visible = (x + width >= renderingContext.minX &&
                     x <= renderingContext.maxX);

    if (!visible) {
      this.$el.setAttributeNS(null, 'visibility', 'hidden');
      return;
    } else {
      this.$el.setAttributeNS(null, 'visibility', 'visible');
    }
    
    const color = this.color(datum);
    const opacity = this.opacity(datum);

    this.$el.style.opacity = opacity;
    this.$segment.style.fill = color;

    if (this.params.displayHandlers) {
      this.$leftHandler.setAttributeNS(null, 'x', x);
      this.$leftHandler.setAttributeNS(null, 'y', 0);
      this.$leftHandler.setAttributeNS(null, 'height', height);
      this.$leftHandler.style.fill = color;

      this.$rightHandler.setAttributeNS(null, 'x',
                                        x + width - this.params.handlerWidth);
      this.$rightHandler.setAttributeNS(null, 'y', 0);
      this.$rightHandler.setAttributeNS(null, 'height', height);
      this.$rightHandler.style.fill = color;
    }
  }

  inArea(renderingContext, datum, x1, y1, x2, y2) {
    const shapeX1 = renderingContext.timeToPixel(this.x(datum));
    const shapeX2 = renderingContext.timeToPixel(this.x(datum) + this.width(datum));
    const shapeY1 = renderingContext.valueToPixel(this.y(datum));
    const shapeY2 = renderingContext.valueToPixel(this.y(datum) + this.height(datum));

    // http://jsfiddle.net/uthyZ/ - check overlaping area
    const xOverlap = Math.max(0, Math.min(x2, shapeX2) - Math.max(x1, shapeX1));
    const yOverlap = Math.max(0, Math.min(y2, shapeY2) - Math.max(y1, shapeY1));
    const area = xOverlap * yOverlap;

    return area > 0;
  }
}
