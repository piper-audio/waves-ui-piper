import Layer from '../core/layer';
import AnnotatedSegment from '../shapes/annotated-segment';
import SegmentBehavior from '../behaviors/segment-behavior';
import { findWithin } from '../utils/find';

/**
 * Helper to create a MIDI-style piano roll layer. Data must have
 * "time", "duration" and "pitch" values, and may also have
 * "velocity". Pitch and velocity are in the same 0-127 range as MIDI,
 * although values can be non-integral.
 *
 * [example usage](./examples/layer-region.html)
 */
export default class RegionLayer extends Layer {

  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */
  constructor(data, options = {}, accessors = {}) {

    options = Object.assign({
      displayHandlers: false,
      opacity: 1.0,
      yDomain: [0, 1],
      color: '#000000'
    }, options);
    
    const regionHeight = (options.yDomain[1] - options.yDomain[0]) / 60;
    
    const rects = data.map(datum => {
      console.log("found datum: time = " + datum.time + ", value = " + datum.value + ", duration = " + datum.duration + " and assigning height = " + regionHeight);
      return {
        x: datum.time,
        y: datum.value,
        width: datum.duration,
        height: regionHeight,
        color: options.color,
        text: datum.label ? datum.label : ("" + datum.value)
      };
    });

    const describer = (x => {
      if (!data.length) return [];
      const i = findWithin(data, x, d => { return d.time; });
      if (data[i].time < x &&
          data[i].time + data[i].duration > x) {
        return [{
          cx: data[i].time,
          cy: data[i].value
        }];
      } else {
        return [];
      }
    });

    super('collection', rects, options);

    this.describer = describer;
    
    this.configureShape(AnnotatedSegment, accessors, {
      displayHandlers: options.displayHandlers,
      attachAnnotations: true,
      opacity: options.opacity,
    });
    
    this.setBehavior(new SegmentBehavior());
  }
}
