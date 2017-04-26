import Layer from '../core/layer';
import Cursor from '../shapes/cursor';

/**
 * Helper to create a crosshair layer that highlights the value
 * reported by an object's describe() method at a time set through the
 * currentPosition property. The describingObject must have a
 * describe(time) method that takes only a time and returns only a
 * value. An example of such an object might be another layer.
 *
 * [example usage](./examples/layer-highlight.html)
 */
export default class HighlightLayer extends Layer {
  /**
   * @param {Object} options - An object to configure the layer.
   */
  constructor(describingObject, options = {}) {
    const defaults = {
      color: 'red',
      hittable: false, // kind of pass through layer
    };

    const data = { currentPosition: 0, describing: describingObject };

    options = Object.assign(defaults, options);
    super('entity', data, options);

    this.configureShape(Crosshairs, {
      cx: (d) => d.currentPosition,
      cy: (d) => d.describing.describe(d.currentPosition)
    }, {
      color: options.color
    });
  }

  set currentPosition(pos) {
    this.data[0].currentPosition = pos;
  }

  get currentPosition() {
    return this.data[0].currentPosition;
  }
}
