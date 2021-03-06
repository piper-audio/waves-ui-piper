import ns from '../core/namespace';
import Layer from '../core/layer';
import scales from '../utils/scales';


/**
 * Simplified Layer for Axis. The main difference with a regular layer is that
 * an axis layer use the `Timeline~timeContext` attributes to render it's layout
 * and stay synchronized with the tracks visible area. All getters and setters
 * to the `TimelineTimeContext` attributes are bypassed.
 *
 * It also handle it's own data and its updates. The `_generateData` method is
 * responsible to create some usefull data to visualize
 *
 * [example usage of the layer-axis](./examples/layer-axis.html)
 */
export default class AxisLayer extends Layer {
  /**
   * @param {Function} generator - A function to create data according to
   *    the `Timeline~timeContext`.
   * @param {Object} options - Layer options, cf. Layer for available options.
   */
  constructor(generator, options) {
    super('entity', [], options);
    this._generator = generator;
  }

  /** @private */
  set stretchRatio(value) { return; }
  /** @private */
  set offset(value) { return; }
  /** @private */
  set start(value) { return; }
  /** @private */
  set duration(value) { return; }
  /** @private */
  get stretchRatio() { return; }
  /** @private */
  get offset() { return; }
  /** @private */
  get start() { return; }
  /** @private */
  get duration() { return; }


  /**
   * The generator that creates the data to be rendered to display the axis.
   *
   * @type {Function}
   */
  set generator(func) {
    this._generator = func;
  }

  /**
   * The generator that creates the data to be rendered to display the axis.
   *
   * @type {Function}
   */
  get generator() {
    return this._generator;
  }

  /**
   * This method is the main difference with a classical layer. An `AxisLayer`
   * instance generates and maintains it's own data.
   */
  _generateData() {
    const data = this._generator(this.timeContext);
    // prepend first arguments of splice for an apply
    data.unshift(0, this.data[0].length);
    // make sure to keep the same reference
    Array.prototype.splice.apply(this.data[0], data);
  }

  /**
   * Updates the rendering context for the shapes.
   */
  _updateRenderingContext() {
    
    const viewStartTime = -this.timeContext.offset;
    
    this._renderingContext.timeToPixel = scales.linear()
      .domain([viewStartTime, viewStartTime + 1])
      .range([0, this.timeContext.timeToPixel(1)]);
    
    this._renderingContext.minX = 0;

    this._renderingContext.visibleWidth = this.timeContext.visibleWidth;
    this._renderingContext.width = this._renderingContext.visibleWidth;
    this._renderingContext.maxX = this._renderingContext.visibleWidth;
    
    this._renderingContext.height = this.params.height;
    this._renderingContext.valueToPixel = this._valueToPixel;
  }

  /**
   * Generates the data and update the layer.
   */
  update() {
    this._generateData();
    super.update();
  }

  /**
   * Render the DOM in memory on layer creation to be able to use it before
   * the layer is actually inserted in the DOM
   */
  _renderContainer() {
    // wrapper group for `start, top and context flip matrix
    this.$el = document.createElementNS(ns, 'g');
    if (this.params.className !== null) {
      this.$el.classList.add('layer', this.params.className);
    }

    // group to contain layer items
    this.$maingroup = document.createElementNS(ns, 'g');
    this.$maingroup.classList.add('maingroup', 'items');
    // layer background
    this.$background = document.createElementNS(ns, 'rect');
    this.$background.setAttributeNS(null, 'height', '100%');
    this.$background.classList.add('background');
    this.$background.style.fillOpacity = 0;
    this.$background.style.pointerEvents = 'none';
    // create the DOM tree
    this.$el.appendChild(this.$maingroup);
    this.$maingroup.appendChild(this.$background);
  }

  /**
   * Updates the layout of the layer.
   */
  _updateContainer() {
    this._updateRenderingContext();

    const top    = this.params.top;
    const height = this.params.height;
    // matrix to invert the coordinate system
    const translateMatrix = `matrix(1, 0, 0, -1, 0, ${top + height})`;
    this.$el.setAttributeNS(null, 'transform', translateMatrix);

    this.$background.setAttributeNS(null, 'width', height);
  }
}
