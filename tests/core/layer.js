const test = require('tape');

import Layer from '../../src/core/layer';
import LayerTimeContext from '../../src/core/layer-time-context';
import Timeline from '../../src/core/timeline';


test('Narrower layer with default params', (assert) => {

  // This layer is "shorter" than its containing element, and so
  // should have width corrresponding to its duration.
  
  const trackDiv = document.createElement("div");
  document.body.appendChild(trackDiv);
  const timeline = new Timeline();
  const track = timeline.createTrack(trackDiv);
  let timeContext = new LayerTimeContext(timeline.timeContext)
  let layer = new Layer('collection', []);
  layer.setTimeContext(timeContext);
  layer.timeContext.duration = 4;
  timeline.addLayer(layer, track);
  timeline.tracks.render();
  timeline.tracks.update();
  const boundingClientRect = layer.$el.getBoundingClientRect();

  // 100 pps, and 4 second default layer => 400 px
  assert.equal(boundingClientRect.width, 400);
  assert.equal(boundingClientRect.height, 100);  // default value
  assert.end();
});

test('Wider layer with default params', (assert) => {

  // This layer is "longer" than its containing element, and so should
  // have the same width as the element (scrolling is now handled by
  // moving the things within the layer rather than offsetting the
  // layer itself, so that very long layers can be supported).

  const trackDiv = document.createElement("div");
  document.body.appendChild(trackDiv);
  const timeline = new Timeline();
  const track = timeline.createTrack(trackDiv);
  let timeContext = new LayerTimeContext(timeline.timeContext)
  let layer = new Layer('collection', []);
  layer.setTimeContext(timeContext);
  layer.timeContext.duration = 12;
  timeline.addLayer(layer, track);
  timeline.tracks.render();
  timeline.tracks.update();
  const boundingClientRect = layer.$el.getBoundingClientRect();

  // 100 pps, and 12 second default layer => 1200 px, but containing
  // element is only 1000 px wide, so
  assert.equal(boundingClientRect.width, 1000);
  assert.equal(boundingClientRect.height, 100);  // default value
  assert.end();
});

