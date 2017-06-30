import Layer from '../core/layer';
import DiscreteScale from '../shapes/discrete-scale';


/**
 * Helper to create a discrete scale layer.
 *
 * [example usage](./examples/layer-matrix.html)
 */
export default class DiscreteScaleLayer extends Layer {
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

    this.configureShape(DiscreteScale, { }, {
      background: options.background,
      tickColor: options.tickColor,
      textColor: options.textColor,
      binNames: options.binNames
    });
  }
}
