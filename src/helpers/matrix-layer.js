import Layer from '../core/layer';
import Matrix from '../shapes/matrix';

const defaults = {
  normalise: 'none',
  gain: 1.0,
  channel: 0
};

/**
 * Helper to create a matrix layer.
 */
export default class MatrixLayer extends Layer {
  /**
   * @param {AudioBuffer} buffer - The audio buffer to display.
   * @param {Object} options - An object to configure the layer.
   */
  constructor(matrixEntity, options) {

    options = Object.assign({}, defaults, options);

    super('entity', matrixEntity, options);

    this.configureShape(Matrix, {}, options);
  }
}
