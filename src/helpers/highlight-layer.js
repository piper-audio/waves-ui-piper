import Layer from '../core/layer';
import Crosshairs from '../shapes/crosshairs';

/**
 * Helper to create a crosshair layer that highlights the value
 * reported by an object's describe() method at a time set through the
 * currentPosition property. The describingObject must have a
 * describe(time) method that takes only a time and returns an array
 * of { cx, cy, unit }. An example of such a describingObject might be
 * another layer.
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

    const data = {
      currentPosition: 0,
      describing: describingObject,
      lastDescribedPosition: 0,
      lastDescription: null,
      describe: function() {
        let pos = this.currentPosition;
        if (pos !== this.lastDescribedPosition || this.lastDescription === null) {
          this.lastDescription = this.describing.describe(pos);
          this.lastDescribedPosition = pos;
          console.log("requesting new description for cx = " + pos);
        } else {
          console.log("reusing last description");
        }
        return this.lastDescription;
      }
    };

    options = Object.assign(defaults, options);
    super('entity', data, options);

    this.configureShape(Crosshairs, {
      // We have a choice here -- use the x coord of the nearest point
      // (the one that is also contributing its y coord) or use the x
      // coord of the probe point. The latter looks better when the
      // probe point is based on a cursor that is also displayed on
      // this track. But it's a bit of a lie. Let's do it anyway
      cx: (d) => d.currentPosition,
      cy: (d) => d.describe()[0].cy,
      unit: (d) => d.describe()[0].unit
    }, {
      color: options.color,
      opacity: options.opacity
    });
  }

  set currentPosition(pos) {
    this.data[0].currentPosition = pos;
  }

  get currentPosition() {
    return this.data[0].currentPosition;
  }
}
