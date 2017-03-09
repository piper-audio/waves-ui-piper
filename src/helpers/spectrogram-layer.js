import Layer from '../core/layer';
import Matrix from '../shapes/matrix';
import Spectrogram from '../utils/spectrogram';

const defaults = {
  yDomain: [-1, 1],
  channel: 0,
  color: 'steelblue',
  renderingStrategy: 'svg'
};

/**
 * Helper to create a spectrogram layer.
 *
 * [example usage](./examples/layer-spectrogram.html)
 */
export default class SpectrogramLayer extends Layer {
  /**
   * @param {AudioBuffer} buffer - The audio buffer to display.
   * @param {Object} options - An object to configure the layer.
   */
  constructor(buffer, options) {

    options = Object.assign({}, defaults, options);

    super('entity',
	  new Spectrogram(buffer.getChannelData(options.channel), options),
	  options);

    this.configureShape(Matrix, {}, {
      sampleRate: buffer.sampleRate,
      color: options.color,
      renderingStrategy: options.renderingStrategy
    });
  }
}
