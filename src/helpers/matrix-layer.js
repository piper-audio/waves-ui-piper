import Layer from '../core/layer';
import Matrix from '../shapes/matrix';


const defaults = {
  yDomain: [-1, 1],
  channel: 0,
  color: 'steelblue',
  renderingStrategy: 'svg'
};

/**
 * Helper to create a waveform layer.
 *
 * [example usage](./examples/layer-waveform.html)
 */
export default class MatrixLayer extends Layer {
  /**
   * @param {AudioBuffer} buffer - The audio buffer to display.
   * @param {Object} options - An object to configure the layer.
   */
  constructor(buffer, options) {
    options = Object.assign({}, defaults, options);

    super('entity', buffer.getChannelData(options.channel), options);

    this.configureShape(Matrix, {}, {
      sampleRate: buffer.sampleRate,
      color: options.color,
      renderingStrategy: options.renderingStrategy
    });
  }
}
