import Layer from '../core/layer';
import Segment from '../shapes/segment';
import SegmentBehavior from '../behaviors/segment-behavior';


export default class SegmentLayer extends Layer {
  constructor(data, options = {}) {
    super('collection', data, options)
    this.configureShape(Segment);
    this.setBehavior(new SegmentBehavior());
  }
}
