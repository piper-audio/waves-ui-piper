# Waves UI / Piper

A library to display and edit audio data and timeseries data in the browser.

This derivation of [waves - ui](https://github.com/wavesjs/waves-ui)
contains a number of modifications making it more appropriate for uses
involving longer audio files and larger datasets. However, it consists
of more complex code than the original library, it may be less well
suited than the original to smaller illustrative projects, and it
might not be a direct replacement in projects that are already using
the original. The editing functionality in particular has not been
well-tested for regressions or incompatibilities with the original.

See:

- [Basic examples](http://piper-audio.github.io/waves-ui-piper/manual/example/examples.html)
- [Full documentation](http://piper-audio.github.io/waves-ui-piper/)

## Changes from the Upstream Library

This library differs from Waves-UI v0.3.0 in the following ways:

* The basic SVG rendering mechanism has changed. In the original
  Waves-UI library, the rendered SVG is always large enough to contain
  the whole of its shape data; if the shape is too wide to fit in the
  browser window, the browser is responsible for clipping it. This
  makes scrolling very simple, but unfortunately means there is an
  implementation-dependent limit on how wide the underlying shape data
  can be. This version of the library changes that so that only the
  visible area is drawn into the SVG at all. This makes it scale to
  longer source material, but means there is more updating to do
  during scrolling.
* The way shapes are rendered and updated has changed, to add a
  caching step for shapes (like the waveform) that benefit from
  precalculating a peak cache or similar.
* The waveform now has a peak cache and performs inter-sample
  interpolation to show a correct wave shape when zoomed right in.
* The following new shapes and layer helpers have been added:
    - Scale - a vertical scale to go at the left edge of a plot (in
      contrast to the Grid Axis layer which is a possibly unbounded
      horizontal scale)
    - Crosshairs - a simple highlighting crosshair overlay
    - Matrix - display coloured grid data for spectrograms or whatever
    - Piano roll - a sequencer note-type display (not currently editable)

## License

This module is released under the BSD-3-Clause license.

## Acknowledgments

The Waves code originated in the [WAVE](http://wave.ircam.fr) project,
funded by ANR (The French National Research Agency), Copyright
2014-2016 IRCAM.

The Piper additions were carried out at the Centre for Digital Music,
Queen Mary University of London and are Copyright 2016-2017 Queen Mary
University of London.

