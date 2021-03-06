import Layer from '../core/layer';
import Scale from '../shapes/scale';


/**
 * Helper to create a scale layer.
 *
 * [example usage](./examples/layer-scale.html)
 */
export default class ScaleLayer extends Layer {
  /**
   * @param {Object} options - An object to configure the layer.
   */
  constructor(options = {}) {
    const defaults = {
      background: '#ffffff',
      tickColor: 'red',
      textColor: 'red',
      hittable: false, // kind of pass through layer
    };

    const data = { };

    options = Object.assign(defaults, options);
    super('entity', data, options);

    this.configureShape(Scale, { }, {
      background: options.background,
      tickColor: options.tickColor,
      textColor: options.textColor
    });
  }
}
