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
   * @param {(Array|Object)} describing - The source of values we are
   * to highlight. Either a single object, or an array of objects,
   * that provide a describe(time) method returning an array of { cx,
   * cy, unit }.
   *
   * @param {Object} options - An object to configure the layer.
   */
  constructor(describing, options = {}) {

    const describingObjects = (Array.isArray(describing) ?
                               describing : [describing]);

    const defaults = {
      color: 'red',
      labelOffset: 0,
      hittable: false, // kind of pass through layer
      unit: ''
    };

    const crosshairDataSource = {

      currentPosition: 0,
      describing: describingObjects,
      lastDescribedObject: null,
      lastDescribedPosition: 0,
      lastDescription: null,

      _isInRangeFor: function(t, obj) {
        const hasStart = (typeof obj.start !== 'undefined');
        const hasDuration = (typeof obj.duration !== 'undefined');
        console.log("start? " + hasStart);
        if (hasStart) {
          console.log("_isInRangeFor(" + t + "): start = " + obj.start);
          if (obj.start > t) {
            return false;
          }
          if (hasDuration) {
            console.log("_isInRangeFor(" + t + "): duration = " + obj.duration);
            if (obj.start + obj.duration < t) {
              return false;
            }
          }
        }
        console.log("_isInRangeFor(" + t + "): yes, or maybe");
        return true; // or at least, maybe
      },

      _locate: function(t) {
        console.log("_locate: have " + this.describing.length + " describing objects");
        if (this.lastDescribedObject !== null &&
            this._isInRangeFor(t, this.lastDescribedObject)) {
          console.log("in range for lastDescribedObject, reusing it");
          return this.lastDescribedObject;
        }
        for (let i = 0; i < this.describing.length; ++i) {
          if (this._isInRangeFor(t, this.describing[i])) {
            console.log("in range for object " + i + ", using that");
            return this.describing[i];
          }
        }
        console.log("all objects out of range");
        return null;
      },
      
      describe: function() {

        if (this.describing.length === 0) {
          return [];
        }
        
        let pos = this.currentPosition;
        if (pos === this.lastDescribedPosition &&
            this.lastDescription !== null) {
          return this.lastDescription;
        }

        const describedObject = this._locate(pos);
        this.lastDescribedObject = describedObject;
        this.lastDescribedPosition = pos;

        if (describedObject !== null) {
          this.lastDescription = describedObject.describe(pos);
        } else {
          this.lastDescription = [];
        }

        return this.lastDescription;
      }
    };

    options = Object.assign(defaults, options);
    super('entity', crosshairDataSource, options);

    this.configureShape(Crosshairs, {
      // We have a choice here -- use the x coord of the nearest point
      // (the one that is also contributing its y coord) or use the x
      // coord of the probe point. The latter looks better when the
      // probe point is based on a cursor that is also displayed on
      // this track. But it's a bit of a lie. Let's do it anyway
      visible: d => d.describe().length > 0,
      cx: d => d.currentPosition,
      cy: d => {
        const dd = d.describe();
        return (dd.length > 0 ? dd[0].cy : 0);
      },
      unit: d => options.unit
    }, {
      color: options.color,
      opacity: options.opacity,
      labelOffset: options.labelOffset
    });
  }

  set currentPosition(pos) {
    this.data[0].currentPosition = pos;
  }

  get currentPosition() {
    return this.data[0].currentPosition;
  }
}
