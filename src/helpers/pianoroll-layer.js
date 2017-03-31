import Layer from '../core/layer';
import Segment from '../shapes/segment';
import SegmentBehavior from '../behaviors/segment-behavior';

/**
 * Helper to create a MIDI-style piano roll layer. Data must have
 * "time", "duration" and "pitch" values, and may also have
 * "velocity". Pitch and velocity are in the same 0-127 range as MIDI,
 * although values can be non-integral.
 *
 * [example usage](./examples/layer-pianoroll.html)
 */
export default class PianoRollLayer extends Layer {
  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */
  constructor(data, options = {}, accessors = {}) {

    const noteHeight = 1;
    
    options = Object.assign({
      displayHandlers: false,
      opacity: 1.0,
      yDomain: [0, 127],
      color: '#000000'
    }, options);
    
    const rects = data.map(datum => {
      let level = 0;
      if (typeof(datum.velocity) !== 'undefined') {
        level = 256 - 2*datum.velocity;
      }
      return {
        x: datum.time,
        y: datum.pitch,
        width: datum.duration,
        height: noteHeight,
        color: `rgb(${level},${level},${level})`,
      };
    });

    super('collection', rects, options);

    this.configureShape(Segment, accessors, {
      displayHandlers: options.displayHandlers,
      opacity: options.opacity,
    });
    
    this.setBehavior(new SegmentBehavior());
  }
}
