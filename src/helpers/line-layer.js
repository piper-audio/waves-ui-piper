import Dot from '../shapes/dot';
import Layer from '../core/layer';
import Line from '../shapes/line';


/**
 * Helper to create a line layer.
 */
export default class LineLayer extends Layer {
  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */
  constructor(data, options = {}, accessors = {}) {
    super('entity', data, options);

    const color = options.color;
    let lineOptions = {};

    if (color) {
      accessors.color = function() { return color; };
      lineOptions.color = color;
    }

    this.configureShape(Line, accessors, lineOptions);
  }
}
