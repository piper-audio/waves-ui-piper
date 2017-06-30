// core
import LayerTimeContext from './core/layer-time-context';
import Layer from './core/layer';
import namespace from './core/namespace';
import TimelineTimeContext from './core/timeline-time-context';
import Timeline from './core/timeline';
import TrackCollection from './core/track-collection';
import Track from './core/track';

// shapes
import AnnotatedMarker from './shapes/annotated-marker';
import AnnotatedSegment from './shapes/annotated-segment';
import BaseShape from './shapes/base-shape';
import Crosshairs from './shapes/crosshairs';
import Cursor from './shapes/cursor';
import DiscreteScale from './shapes/discrete-scale';
import Dot from './shapes/dot';
import Line from './shapes/line';
import Marker from './shapes/marker';
import Matrix from './shapes/matrix';
import Scale from './shapes/scale';
import Segment from './shapes/segment';
import Ticks from './shapes/ticks';
import TracePath from './shapes/trace-path';
import TraceDots from './shapes/trace-dots';
import Waveform from './shapes/waveform';

// behaviors
import BaseBehavior from './behaviors/base-behavior';
import BreakpointBehavior from './behaviors/breakpoint-behavior';
import MarkerBehavior from './behaviors/marker-behavior';
import SegmentBehavior from './behaviors/segment-behavior';
import TimeContextBehavior from './behaviors/time-context-behavior';
import TraceBehavior from './behaviors/trace-behavior';

// interactions
import EventSource from './interactions/event-source';
import Keyboard from './interactions/keyboard';
import Surface from './interactions/surface';
import WaveEvent from './interactions/wave-event';

// states
import BaseState from './states/base-state';
import BreakpointState from './states/breakpoint-state';
import BrushZoomState from './states/brush-zoom-state';
import CenteredZoomState from './states/centered-zoom-state';
import ContextEditionState from './states/context-edition-state';
import EditionState from './states/edition-state';
import SelectionState from './states/selection-state';
import SimpleEditionState from './states/simple-edition-state';

// helpers
import AnnotatedMarkerLayer from './helpers/annotated-marker-layer';
import AnnotatedSegmentLayer from './helpers/annotated-segment-layer';
import BreakpointLayer from './helpers/breakpoint-layer';
import CursorLayer from './helpers/cursor-layer';
import DiscreteScaleLayer from './helpers/discrete-scale-layer';
import GridAxisLayer from './helpers/grid-axis-layer';
import HighlightLayer from './helpers/highlight-layer';
import LineLayer from './helpers/line-layer';
import MarkerLayer from './helpers/marker-layer';
import MatrixLayer from './helpers/matrix-layer';
import PianoRollLayer from './helpers/pianoroll-layer';
import ScaleLayer from './helpers/scale-layer';
import SegmentLayer from './helpers/segment-layer';
import TickLayer from './helpers/tick-layer';
import TimeAxisLayer from './helpers/time-axis-layer';
import TraceLayer from './helpers/trace-layer';
import WaveformLayer from './helpers/waveform-layer';

// axis
import AxisLayer from './axis/axis-layer';
import timeAxisGenerator from './axis/time-axis-generator';
import gridAxisGenerator from './axis/grid-axis-generator';

// utils
import format from './utils/format';
import MatrixEntity from './utils/matrix-entity';
import OrthogonalData from './utils/orthogonal-data';
import PrefilledMatrixEntity from './utils/prefilled-matrix-entity';
import scales from './utils/scales';

export default {
  core: {
    LayerTimeContext, Layer, namespace,
    TimelineTimeContext, Timeline, TrackCollection, Track
  },
  shapes: {
    AnnotatedMarker, AnnotatedSegment, BaseShape, Crosshairs, Cursor, DiscreteScale,
    Dot, Line, Marker, Matrix, Scale, Segment, Ticks, TracePath, TraceDots, Waveform
  },
  behaviors: {
    BaseBehavior, BreakpointBehavior, MarkerBehavior, SegmentBehavior,
    TimeContextBehavior, TraceBehavior
  },
  interactions: { EventSource, Keyboard, Surface, WaveEvent },
  states: {
    BaseState, BreakpointState, BrushZoomState, CenteredZoomState,
    ContextEditionState, EditionState, SelectionState, SimpleEditionState
  },
  helpers: {
    AnnotatedMarkerLayer, AnnotatedSegmentLayer, BreakpointLayer, CursorLayer,
    DiscreteScaleLayer, GridAxisLayer, HighlightLayer, LineLayer, MarkerLayer, MatrixLayer, PianoRollLayer,
    ScaleLayer, SegmentLayer, TickLayer, TimeAxisLayer, TraceLayer, WaveformLayer
  },
  axis: {
    AxisLayer, timeAxisGenerator, gridAxisGenerator
  },
  utils: {
    format, MatrixEntity, OrthogonalData, PrefilledMatrixEntity, scales
  }
};
