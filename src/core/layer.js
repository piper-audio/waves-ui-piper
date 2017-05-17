import events from 'events';
import ns from './namespace';
import scales from '../utils/scales';
import Segment from '../shapes/segment';
import TimeContextBehavior from '../behaviors/time-context-behavior';

// time context bahevior
let timeContextBehavior = null;
let timeContextBehaviorCtor = TimeContextBehavior;

/**
 * The layer class is the main visualization class. It is mainly defines by its
 * related `LayerTimeContext` which determines its position in the overall
 * timeline (through the `start`, `duration`, `offset` and `stretchRatio`
 * attributes) and by it's registered Shape which defines how to display the
 * data associated to the layer. Each created layer must be inserted into a
 * `Track` instance in order to be displayed.
 *
 * _Note: in the context of the layer, an __item__ is the SVG element
 * returned by a `Shape` instance and associated with a particular __datum__._
 *
 * ### Layer DOM structure
 * ```
 * <g class="layer" transform="translate(${start}, 0)">
 *   <svg class="bounding-box" width="${duration}">
 *     <g class="maingroup">
 *       <!-- background -->
 *       <rect class="background"></rect>
 *       <!-- shapes and common shapes are inserted here -->
 *     </g>
 *     <g class="interactions"><!-- for feedback --></g>
 *   </svg>
 * </g>
 * ```
 */
export default class Layer extends events.EventEmitter {
  /**
   * @param {String} dataType - Defines how the layer should look at the data.
   *    Can be 'entity' or 'collection'.
   * @param {(Array|Object)} data - The data associated to the layer.
   * @param {Object} options - Configures the layer.
   * @param {Number} [options.height=100] - Defines the height of the layer.
   * @param {Number} [options.top=0] - Defines the top position of the layer.
   * @param {Number} [options.opacity=1] - Defines the opacity of the layer.
   * @param {Number} [options.yDomain=[0,1]] - Defines boundaries of the data
   *    values in y axis (for exemple to display an audio buffer, this attribute
   *    should be set to [-1, 1].
   * @param {String} [options.className=null] - An optionnal class to add to each
   *    created shape.
   * @param {String} [options.className='selected'] - The class to add to a shape
   *    when selected.
   * @param {Number} [options.contextHandlerWidth=2] - The width of the handlers
   *    displayed to edit the layer.
   * @param {Number} [options.hittable=false] - Defines if the layer can be interacted
   *    with. Basically, the layer is not returned by `BaseState.getHitLayers` when
   *    set to false (a common use case is a layer that contains a cursor)
   */
  constructor(dataType, data, options = {}) {
    super();

    const defaults = {
      height: 100,
      top: 0,
      opacity: 1,
      yDomain: [0, 1],
      className: null,
      selectedClassName: 'selected',
      contextHandlerWidth: 2,
      hittable: true, // when false the layer is not returned by `BaseState.getHitLayers`
      id: '', // used ?
      overflow: 'hidden', // usefull ?
    };

    /**
     * Parameters of the layers, `defaults` overrided with options.
     * @type {Object}
     */
    this.params = Object.assign({}, defaults, options);
    /**
     * Defines how the layer should look at the data (`'entity'` or `'collection'`).
     * @type {String}
     */
    this.dataType = dataType; // 'entity' || 'collection';
    /** @type {LayerTimeContext} */
    this.timeContext = null;
    /** @type {Element} */
    this.$el = null;
    /** @type {Element} */
    this.$background = null;
    /** @type {Element} */
    this.$boundingBox = null;
    /** @type {Element} */
    this.$maingroup = null;
    /** @type {Element} */
    this.$interactions = null;
    /**
     * A Segment instanciated to interact with the Layer itself.
     * @type {Segment}
     */
    this.contextShape = null;

    this._shapeConfiguration = null;       // { ctor, accessors, options }
    this._commonShapeConfiguration = null; // { ctor, accessors, options }
    this._$itemShapeMap = new Map();
    this._$itemDataMap = new Map();
    this._$itemCommonShapeMap = new Map();

    this._isContextEditable = false;
    this._behavior = null;

    this.data = data;

    this._valueToPixel = scales.linear()
      .domain(this.params.yDomain)
      .range([0, this.params.height]);

    // initialize timeContext layout
    this._renderContainer();
    // creates the timeContextBehavior for all layers
    if (timeContextBehavior === null) {
      timeContextBehavior = new timeContextBehaviorCtor();
    }
  }

  /**
   * Destroy the layer, clear all references.
   */
  destroy() {

    if (this.dataType == 'entity') {
      if (typeof(this.data.dispose) !== 'undefined') {
        this.data.dispose();
      }
    }
    
    this.timeContext = null;
    this.data = null;
    this.params = null;
    this._behavior = null;

    this._$itemShapeMap.clear();
    this._$itemDataMap.clear();
    this._$itemCommonShapeMap.clear();

    this.removeAllListeners();
  }

  /**
   * Allows to override default the `TimeContextBehavior` used to edit the layer.
   *
   * @param {Object} ctor
   */
  static configureTimeContextBehavior(ctor) {
    timeContextBehaviorCtor = ctor;
  }

  /**
   * Returns `LayerTimeContext`'s `start` time domain value.
   *
   * @type {Number}
   */
  get start() {
    return this.timeContext.start;
  }

  /**
   * Sets `LayerTimeContext`'s `start` time domain value.
   *
   * @type {Number}
   */
  set start(value) {
    this.timeContext.start = value;
  }

  /**
   * Returns `LayerTimeContext`'s `offset` time domain value.
   *
   * @type {Number}
   */
  get offset() {
    return this.timeContext.offset;
  }

  /**
   * Sets `LayerTimeContext`'s `offset` time domain value.
   *
   * @type {Number}
   */
  set offset(value) {
    this.timeContext.offset = value;
  }

  /**
   * Returns `LayerTimeContext`'s `duration` time domain value.
   *
   * @type {Number}
   */
  get duration() {
    return this.timeContext.duration;
  }

  /**
   * Sets `LayerTimeContext`'s `duration` time domain value.
   *
   * @type {Number}
   */
  set duration(value) {
    this.timeContext.duration = value;
  }

  /**
   * Returns `LayerTimeContext`'s `stretchRatio` time domain value.
   *
   * @type {Number}
   */
  get stretchRatio() {
    return this.timeContext.stretchRatio;
  }

  /**
   * Sets `LayerTimeContext`'s `stretchRatio` time domain value.
   *
   * @type {Number}
   */
  set stretchRatio(value) {
    this.timeContext.stretchRatio = value;
  }

  /**
   * Set the domain boundaries of the data for the y axis.
   *
   * @type {Array}
   */
  set yDomain(domain) {
    this.params.yDomain = domain;
    this._valueToPixel.domain(domain);
  }

  /**
   * Returns the domain boundaries of the data for the y axis.
   *
   * @type {Array}
   */
  get yDomain() {
    return this.params.yDomain;
  }

  /**
   * Sets the opacity of the whole layer.
   *
   * @type {Number}
   */
  set opacity(value) {
    this.params.opacity = value;
  }

  /**
   * Returns the opacity of the whole layer.
   *
   * @type {Number}
   */
  get opacity() {
    return this.params.opacity;
  }

  /**
   * Returns the transfert function used to display the data in the x axis.
   *
   * @type {Number}
   */
  get timeToPixel() {
    return this.timeContext.timeToPixel;
  }

  /**
   * Returns the transfert function used to display the data in the y axis.
   *
   * @type {Number}
   */
  get valueToPixel() {
    return this._valueToPixel;
  }

  /**
   * Returns an array containing all the displayed items.
   *
   * @type {Array<Element>}
   */
  get items() {
    return Array.from(this._$itemDataMap.keys());
  }

  /**
   * Returns the data associated to the layer.
   *
   * @type {Object[]}
   */
  get data() { return this._data; }

  /**
   * Sets the data associated with the layer.
   *
   * @type {Object|Object[]}
   */
  set data(data) {
    switch (this.dataType) {
    case 'entity':
      if (this._data) {  // if data already exists, reuse the reference
        this._data[0] = data;
      } else {
        this._data = [data];
      }
      break;
    case 'collection':
      this._data = data;
      break;
    }
    this._cached = false;
  }

  // --------------------------------------
  // Initialization
  // --------------------------------------

  /**
   * Renders the DOM in memory on layer creation to be able to use it before
   * the layer is actually inserted in the DOM.
   */
  _renderContainer() {
    // wrapper group for `start, top and context flip matrix
    this.$el = document.createElementNS(ns, 'g');
    this.$el.classList.add('layer');
    if (this.params.className !== null) {
      this.$el.classList.add(this.params.className);
    }
    // clip the context with a `svg` element
    this.$boundingBox = document.createElementNS(ns, 'svg');
    this.$boundingBox.classList.add('bounding-box');
    this.$boundingBox.style.overflow = this.params.overflow;
    // group to contain layer items
    this.$maingroup = document.createElementNS(ns, 'g');
    this.$maingroup.classList.add('maingroup', 'items');
    // layer background
    this.$background = document.createElementNS(ns, 'rect');
    this.$background.setAttributeNS(null, 'height', '100%');
    this.$background.setAttributeNS(null, 'width', '100%');
    this.$background.classList.add('background');
    this.$background.style.fillOpacity = 0;
    this.$background.style.pointerEvents = 'none';

    // create the DOM tree
    this.$el.appendChild(this.$boundingBox);
    this.$boundingBox.appendChild(this.$maingroup);
    this.$maingroup.appendChild(this.$background);

    if (this._isContextEditable) {
      this._addInteractionsElements();
    }
  }

  _addInteractionsElements() {

    if (this.$interactions !== null) {
      return;
    }

    // context interactions
    this.$interactions = document.createElementNS(ns, 'g');
    this.$interactions.classList.add('interactions');

    const display = this._isContextEditable ? 'block' : 'none';
    this.$interactions.style.display = display;

    // @NOTE: works but king of ugly... should be cleaned
    this.contextShape = new Segment();
    this.contextShape.install({
      opacity: () => 0.1,
      color  : () => '#787878',
      width  : () => this.timeContext.duration,
      height : () => this._renderingContext.valueToPixel.domain()[1],
      y      : () => this._renderingContext.valueToPixel.domain()[0]
    });
    
    this.$interactions.appendChild(this.contextShape.render());
    this.$boundingBox.appendChild(this.$interactions);
  }

  // --------------------------------------
  // Component Configuration
  // --------------------------------------

  /**
   * Sets the context of the layer, thus defining its `start`, `duration`,
   * `offset` and `stretchRatio`.
   *
   * @param {TimeContext} timeContext - The timeContext in which the layer is displayed.
   */
  setTimeContext(timeContext) {
    this.timeContext = timeContext;
    // create a mixin to pass to the shapes
    this._renderingContext = {};
    this._updateRenderingContext();
  }

  /**
   * Register a shape and its configuration to use in order to render the data.
   *
   * @param {BaseShape} ctor - The constructor of the shape to be used.
   * @param {Object} [accessors={}] - Defines how the shape should adapt to a particular data struture.
   * @param {Object} [options={}] - Global configuration for the shapes, is specific to each `Shape`.
   */
  configureShape(ctor, accessors = {}, options = {}) {
    this._shapeConfiguration = { ctor, accessors, options };
  }

  /**
   * Optionally register a shape to be used across the entire collection.
   *
   * @param {BaseShape} ctor - The constructor of the shape to be used.
   * @param {Object} [accessors={}] - Defines how the shape should adapt to a particular data struture.
   * @param {Object} [options={}] - Global configuration for the shapes, is specific to each `Shape`.
   */
  configureCommonShape(ctor, accessors = {}, options = {}) {
    this._commonShapeConfiguration = { ctor, accessors, options };
  }

  /**
   * Register the behavior to use when interacting with a shape.
   *
   * @param {BaseBehavior} behavior
   */
  setBehavior(behavior) {
    behavior.initialize(this);
    this._behavior = behavior;
  }

  /**
   * Updates the values stored in the `_renderingContext` passed  to shapes
   * for rendering and updating.
   */
  _updateRenderingContext() {

    // PLAN
    //
    // The time context structures stay the same. They continue to map
    // time in seconds onto an absolute pixel axis that starts at
    // pixel 0 == time 0 and pixel N == time (N / pixels-per-second).
    //
    // The rendering context, on the other hand, has pixel 0 at the
    // left edge of the visible area, so that the rendered SVG has
    // width (in its coordinate scheme) equal to the visible area. We
    // always resituate ourselves there so as to avoid extremely large
    // SVG coordinates when both zoomed in a long way and scrolled a
    // long way to the right, as browser renderers generally seem to
    // blow up when presented with coords above 2^24 or so.
    // 
    // To arrange pixel 0 at the left edge, we need to ensure that the
    // time-to-pixel mapping places time 0 at pixel -minX where minX
    // is the time context's timeToPixel mapping of the sum of all
    // applicable time offsets.
    
    const layerStartTime = this.timeContext.start;
    const layerOffsetTime = this.timeContext.offset;
    const trackOffsetTime = this.timeContext.parent.offset;

    const layerOriginTime = trackOffsetTime + layerStartTime;

    const viewStartTime = -layerOriginTime - layerOffsetTime;
    
    this._renderingContext.timeToPixel = scales.linear()
      .domain([viewStartTime, viewStartTime + 1])
      .range([0, this.timeContext.timeToPixel(1)]);
    
    this._renderingContext.minX = 0;

    this._renderingContext.visibleWidth = this.timeContext.parent.visibleWidth;
    this._renderingContext.width = this._renderingContext.visibleWidth;
    this._renderingContext.maxX = this._renderingContext.visibleWidth;
    
    this._renderingContext.height = this.params.height;
    this._renderingContext.valueToPixel = this._valueToPixel;

//    console.log("Rendering context: width = " + this._renderingContext.width + ", visibleWidth = " + this._renderingContext.visibleWidth + ", minX = " + this._renderingContext.minX + " (time = " + this._renderingContext.timeToPixel.invert(this._renderingContext.minX) + "), maxX = " + this._renderingContext.maxX + " (time = " + this._renderingContext.timeToPixel.invert(this._renderingContext.maxX) + ")");
  }

  // --------------------------------------
  // Behavior Accessors
  // --------------------------------------

  /**
   * Returns the items marked as selected.
   *
   * @type {Array<Element>}
   */
  get selectedItems() {
    return this._behavior ? this._behavior.selectedItems : [];
  }

  /**
   * Mark item(s) as selected.
   *
   * @param {Element|Element[]} $items
   */
  select(...$items) {
    if (!this._behavior) { return; }
    if (!$items.length) { $items = this._$itemDataMap.keys(); }
    if (Array.isArray($items[0])) { $items = $items[0]; }

    for (let $item of $items) {
      const datum = this._$itemDataMap.get($item);
      this._behavior.select($item, datum);
      this._toFront($item);
    }
  }

  /**
   * Removes item(s) from selected items.
   *
   * @param {Element|Element[]} $items
   */
  unselect(...$items) {
    if (!this._behavior) { return; }
    if (!$items.length) { $items = this._$itemDataMap.keys(); }
    if (Array.isArray($items[0])) { $items = $items[0]; }

    for (let $item of $items) {
      const datum = this._$itemDataMap.get($item);
      this._behavior.unselect($item, datum);
    }
  }

  /**
   * Toggle item(s) selection state according to their current state.
   *
   * @param {Element|Element[]} $items
   */
  toggleSelection(...$items) {
    if (!this._behavior) { return; }
    if (!$items.length) { $items = this._$itemDataMap.keys(); }
    if (Array.isArray($items[0])) { $items = $items[0]; }

    for (let $item of $items) {
      const datum = this._$itemDataMap.get($item);
      this._behavior.toggleSelection($item, datum);
    }
  }

  /**
   * Edit item(s) according to the `edit` defined in the registered `Behavior`.
   *
   * @param {Element|Element[]} $items - The item(s) to edit.
   * @param {Number} dx - The modification to apply in the x axis (in pixels).
   * @param {Number} dy - The modification to apply in the y axis (in pixels).
   * @param {Element} $target - The target of the interaction (for example, left
   *    handler DOM element in a segment).
   */
  edit($items, dx, dy, $target) {
    if (!this._behavior) { return; }
    $items = !Array.isArray($items) ? [$items] : $items;

    for (let $item of $items) {
      const shape = this._$itemShapeMap.get($item);
      const datum = this._$itemDataMap.get($item);

      this._behavior.edit(this._renderingContext, shape, datum, dx, dy, $target);
      this.emit('edit', shape, datum);
    }
  }

  /**
   * Defines if the `Layer`, and thus the `LayerTimeContext` is editable or not.
   *
   * @params {Boolean} [bool=true]
   */
  setContextEditable(bool = true) {
    
    this._isContextEditable = bool;
    
    if (this.$interactions === null) {
      this._addInteractionsElements();
    } else {
      const display = bool ? 'block' : 'none';
      this.$interactions.style.display = display;
    }
  }

  /**
   * Edit the layer and thus its related `LayerTimeContext` attributes.
   *
   * @param {Number} dx - The modification to apply in the x axis (in pixels).
   * @param {Number} dy - The modification to apply in the y axis (in pixels).
   * @param {Element} $target - The target of the event of the interaction.
   */
  editContext(dx, dy, $target) {
    timeContextBehavior.edit(this, dx, dy, $target);
  }

  /**
   * Stretch the layer and thus its related `LayerTimeContext` attributes.
   *
   * @param {Number} dx - The modification to apply in the x axis (in pixels).
   * @param {Number} dy - The modification to apply in the y axis (in pixels).
   * @param {Element} $target - The target of the event of the interaction.
   */
  stretchContext(dx, dy, $target) {
    timeContextBehavior.stretch(this, dx, dy, $target);
  }

  // --------------------------------------
  // Helpers
  // --------------------------------------

  /**
   * Returns an item from a DOM element related to the shape, null otherwise.
   *
   * @param {Element} $el - the element to be tested
   * @return {Element|null}
   */
  getItemFromDOMElement($el) {
    let $item;

    do {
      if ($el.classList && $el.classList.contains('item')) {
        $item = $el;
        break;
      }

      $el = $el.parentNode;
    } while ($el !== null);

    return this.hasItem($item) ? $item : null;
  }

  /**
   * Returns the datum associated to a specific item.
   *
   * @param {Element} $item
   * @return {Object|Array|null}
   */
  getDatumFromItem($item) {
    const datum = this._$itemDataMap.get($item);
    return datum ? datum : null;
  }

  /**
   * Returns the datum associated to a specific item from any DOM element
   * composing the shape. Basically a shortcut for `getItemFromDOMElement` and
   * `getDatumFromItem` methods.
   *
   * @param {Element} $el
   * @return {Object|Array|null}
   */
  getDatumFromDOMElement($el) {
    var $item = this.getItemFromDOMElement($el);
    if ($item === null) { return null; }
    return this.getDatumFromItem($item);
  }

  /**
   * Tests if the given DOM element is an item of the layer.
   *
   * @param {Element} $item - The item to be tested.
   * @return {Boolean}
   */
  hasItem($item) {
    return this._$itemDataMap.has($item);
  }

  /**
   * Defines if a given element belongs to the layer. Is more general than
   * `hasItem`, can mostly used to check interactions elements.
   *
   * @param {Element} $el - The DOM element to be tested.
   * @return {bool}
   */
  hasElement($el) {
    do {
      if ($el === this.$el) {
        return true;
      }

      $el = $el.parentNode;
    } while ($el !== null);

    return false;
  }

  /**
   * Retrieve all the items in a given area as defined in the registered `Shape~inArea` method.
   *
   * @param {Object} area - The area (in viewport coordinate space) in which to find the elements
   * @param {Number} area.top
   * @param {Number} area.left
   * @param {Number} area.width
   * @param {Number} area.height
   * @return {Array} - list of the items presents in the area
   */
  getItemsInArea(area) {

    let x1 = area.left;
    let x2 = area.left + area.width;

    // keep consistent with context y coordinates system
    let y1 = this.params.height - (area.top + area.height);
    let y2 = this.params.height - area.top;

    y1 += this.params.top;
    y2 += this.params.top;

    const $filteredItems = [];

    for (let [$item, datum] of this._$itemDataMap.entries()) {
      const shape = this._$itemShapeMap.get($item);
      const inArea = shape.inArea(this._renderingContext, datum, x1, y1, x2, y2);

      if (inArea) { $filteredItems.push($item); }
    }

    return $filteredItems;
  }

  // --------------------------------------
  // Rendering / Display methods
  // --------------------------------------

  /**
   * Moves an item to the end of the layer to display it front of its
   * siblings (svg z-index...).
   *
   * @param {Element} $item - The item to be moved.
   */
  _toFront($item) {
    this.$maingroup.appendChild($item);
  }

  /**
   * Create the DOM structure of the shapes according to the given data. Inspired
   * from the `enter` and `exit` d3.js paradigm, this method should be called
   * each time a datum is added or removed from the data. While the DOM is
   * created the `update` method must be called in order to update the shapes
   * attributes and thus place them where they should.
   */
  render() {

    const before = performance.now();
    
    // render `commonShape` only once
    if (
      this._commonShapeConfiguration !== null &&
      this._$itemCommonShapeMap.size === 0
    ) {
      const { ctor, accessors, options } = this._commonShapeConfiguration;
      const $group = document.createElementNS(ns, 'g');
      const shape = new ctor(options);

      shape.install(accessors);
      $group.appendChild(shape.render());
      $group.classList.add('item', 'common', shape.getClassName());

      this._$itemCommonShapeMap.set($group, shape);
      this.$maingroup.appendChild($group);
    }

    // append elements all at once
    const fragment = document.createDocumentFragment();
    const values = this._$itemDataMap.values(); // iterator

    // enter
    if (this._shapeConfiguration !== null) {
      this.data.forEach((datum) => {
        for (let value of values) { if (value === datum) { return; } }

        const { ctor, accessors, options } = this._shapeConfiguration;
        const shape = new ctor(options);
        shape.install(accessors);

        const $el = shape.render(this._renderingContext);
        $el.classList.add('item', shape.getClassName());

        this._$itemShapeMap.set($el, shape);
        this._$itemDataMap.set($el, datum);

        fragment.appendChild($el);
      });

      this.$maingroup.appendChild(fragment);
    }

    // remove
    for (let [$item, datum] of this._$itemDataMap.entries()) {
      if (this.data.indexOf(datum) !== -1) { continue; }

      const shape = this._$itemShapeMap.get($item);

      this.$maingroup.removeChild($item);
      shape.destroy();
      // a removed item cannot be selected
      if (this._behavior) {
        this._behavior.unselect($item, datum);
      }

      this._$itemDataMap.delete($item);
      this._$itemShapeMap.delete($item);
    }

    const after = performance.now();
    console.log("layer render time = " + Math.round(after - before));
  }

  /**
   * Updates the container of the layer and the attributes of the existing shapes.
   */
  update() {
    this._updateContainer();
    this._updateShapes();
  }

  /**
   * Updates the container of the layer.
   */
  _updateContainer() {
    this._updateRenderingContext();

    const timeContext = this.timeContext;

    let width = this._renderingContext.timeToPixel(this.timeContext.duration);
    if (width > this._renderingContext.visibleWidth) {
      width = this._renderingContext.visibleWidth;
    }
    
    const top = this.params.top;
    const height = this.params.height;
    
    // matrix to invert the coordinate system
    const translateMatrix = `matrix(1, 0, 0, -1, 0, ${top + height})`;

    this.$el.setAttributeNS(null, 'transform', translateMatrix);

    this.$boundingBox.setAttributeNS(null, 'width', width);
    this.$boundingBox.setAttributeNS(null, 'height', height);
    this.$boundingBox.style.opacity = this.params.opacity;

    if (this.contextShape !== null) {
      // maintain context shape
      this.contextShape.update(this._renderingContext, this.timeContext, 0);
    }
  }

  _encacheEntity() {

    if (this.dataType !== 'entity') return;
    if (this._cached) return;
    if (this._data === []) return;
    
    let origData = this._data[0];

    for (let [$item, datum] of this._$itemDataMap.entries()) {
      if (datum === origData) {
        const shape = this._$itemShapeMap.get($item);
        const cache = shape.encache(datum);
	if (cache) {
	  this._$itemDataMap.set($item, cache);
          if (typeof(origData.dispose) !== 'undefined') {
            origData.dispose();
          }
	  this.data = cache;
	}
      }
    }

    this._cached = true;
  }
  
  /**
   * Updates the attributes of all the `Shape` instances rendered into the layer.
   */
  _updateShapes() {

    const before = performance.now();
    
    this._updateRenderingContext();

    this._encacheEntity();
    
    // Update common shape, if any
    this._$itemCommonShapeMap.forEach((shape, $item) => {
      shape.update(this._renderingContext, this.data);
    });

    // Update specific shapes
    for (let [$item, datum] of this._$itemDataMap.entries()) {
      const shape = this._$itemShapeMap.get($item);
      shape.update(this._renderingContext, datum);
    }

    const after = performance.now();
    console.log("layer update time = " + Math.round(after - before));
  }

  describe(x) {
    for (let [$item, datum] of this._$itemDataMap.entries()) {
      const shape = this._$itemShapeMap.get($item);
      const description = shape.describe(datum, x - this.start);
      if (description !== null) {
        return description;
      }
    }
  }
}
