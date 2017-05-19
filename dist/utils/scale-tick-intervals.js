/**
 * Code to calculate which values to label in a scale between two
 * endpoints, and how they should be labelled. Based on
 * ScaleTickIntervals from Sonic Visualiser, relicensed for this
 * library. Copyright 2017 QMUL.
 */

/**
 * Return an array of objects describing tick locations and labels,
 * each object having "value" (number) and "label" (string)
 * properties. All ticks will be within the range [min, max] and
 * there will be approximately n+1 of them, dividing the range up
 * into n divisions, although this number may vary based on which
 * tick values seem best suited to labelling.
 */
"use strict";

var _Math$log10 = require("babel-runtime/core-js/math/log10")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.linear = linear;

function linear(min, max, n) {
  return explode(linearInstruction(min, max, n));
}

function linearInstruction(_x, _x2, _x3) {
  var _again = true;

  _function: while (_again) {
    var min = _x,
        max = _x2,
        n = _x3;
    _again = false;

    var display = "auto";
    if (max < min) {
      _x = max;
      _x2 = min;
      _x3 = n;
      _again = true;
      display = undefined;
      continue _function;
    }
    if (n < 1 || max === min) {
      return {
        initial: min, limit: min, spacing: 1.0,
        roundTo: min, display: display, precision: 1, logUnmap: false
      };
    }
    if (min !== min || max !== max) {
      // NaNs must be involved
      console.log("ScaleTickIntervals: WARNING: min = " + min + ", max = " + max);
      return [];
    }

    var inc = (max - min) / n;

    var digInc = _Math$log10(inc);
    var digMax = _Math$log10(Math.abs(max));
    var digMin = _Math$log10(Math.abs(min));

    var precInc = Math.floor(digInc);
    var roundTo = Math.pow(10.0, precInc);

    if (precInc > -4 && precInc < 4) {
      display = "fixed";
    } else if (digMax >= -2.0 && digMax <= 3.0 && digMin >= -3.0 && digMin <= 3.0) {
      display = "fixed";
    } else {
      display = "scientific";
    }

    var precRange = Math.ceil(digMax - digInc);

    var prec = 1;

    if (display === "fixed") {
      if (digInc < 0) {
        prec = -precInc;
      } else {
        prec = 0;
      }
    } else {
      prec = precRange;
    }

    var minTick = min;

    if (roundTo !== 0.0) {
      inc = Math.round(inc / roundTo) * roundTo;
      if (inc < roundTo) inc = roundTo;
      minTick = Math.ceil(minTick / roundTo) * roundTo;
      if (minTick > max) minTick = max;
    }

    if (display === "scientific" && minTick !== 0.0) {
      var digNewMin = _Math$log10(Math.abs(minTick));
      if (digNewMin < digInc) {
        prec = Math.ceil(digMax - digNewMin);
      }
    }

    return {
      initial: minTick, limit: max, spacing: inc,
      roundTo: roundTo, display: display, precision: prec, logUnmap: false
    };
  }
}

function makeTick(display, precision, value) {
  if (display === "scientific") {
    return { value: value, label: value.toExponential(precision) };
  } else if (display === "fixed") {
    return { value: value, label: value.toFixed(precision) };
  } else {
    return { value: value, label: value.toPrecision(precision) };
  }
}

function explode(instruction) {

  if (instruction.spacing === 0.0) {
    return [];
  }

  var eps = 1e-7;
  if (instruction.spacing < eps * 10.0) {
    eps = instruction.spacing / 10.0;
  }

  var max = instruction.limit;
  var n = 0;

  var ticks = [];

  while (true) {
    var value = instruction.initial + n * instruction.spacing;
    if (value >= max + eps) {
      break;
    }
    if (instruction.logUnmap) {
      value = Math.pow(10.0, value);
    }
    if (instruction.roundTo !== 0.0) {
      value = instruction.roundTo * Math.round(value / instruction.roundTo);
    }
    ticks.push(makeTick(instruction.display, instruction.precision, value));
    ++n;
  }

  return ticks;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy91dGlscy9zY2FsZS10aWNrLWludGVydmFscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFlTyxTQUFTLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRTtBQUNsQyxTQUFPLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDaEQ7O0FBRUQsU0FBUyxpQkFBaUI7Ozs0QkFBYztRQUFiLEdBQUc7UUFBRSxHQUFHO1FBQUUsQ0FBQzs7O0FBQ3BDLFFBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQztBQUNyQixRQUFJLEdBQUcsR0FBRyxHQUFHLEVBQUU7V0FDWSxHQUFHO1lBQUUsR0FBRztZQUFFLENBQUM7O0FBRmxDLGFBQU87O0tBR1Y7QUFDRCxRQUFJLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxLQUFLLEdBQUcsRUFBRTtBQUN4QixhQUFPO0FBQ0wsZUFBTyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxHQUFHO0FBQ3RDLGVBQU8sRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFQLE9BQU8sRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxLQUFLO09BQ3JELENBQUM7S0FDSDtBQUNELFFBQUksR0FBRyxLQUFLLEdBQUcsSUFBSSxHQUFHLEtBQUssR0FBRyxFQUFFOztBQUU5QixhQUFPLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxHQUFHLEdBQUcsR0FBRyxVQUFVLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDNUUsYUFBTyxFQUFFLENBQUM7S0FDWDs7QUFFRCxRQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUEsR0FBSSxDQUFDLENBQUM7O0FBRTFCLFFBQU0sTUFBTSxHQUFHLFlBQVcsR0FBRyxDQUFDLENBQUM7QUFDL0IsUUFBTSxNQUFNLEdBQUcsWUFB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QUMsQ0FBQztHQUNMOztBQUVELFNBQU8sS0FBSyxDQUFDO0NBQ2QiLCJmaWxlIjoic3JjL3V0aWxzL3NjYWxlLXRpY2staW50ZXJ2YWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb2RlIHRvIGNhbGN1bGF0ZSB3aGljaCB2YWx1ZXMgdG8gbGFiZWwgaW4gYSBzY2FsZSBiZXR3ZWVuIHR3b1xuICogZW5kcG9pbnRzLCBhbmQgaG93IHRoZXkgc2hvdWxkIGJlIGxhYmVsbGVkLiBCYXNlZCBvblxuICogU2NhbGVUaWNrSW50ZXJ2YWxzIGZyb20gU29uaWMgVmlzdWFsaXNlciwgcmVsaWNlbnNlZCBmb3IgdGhpc1xuICogbGlicmFyeS4gQ29weXJpZ2h0IDIwMTcgUU1VTC5cbiAqL1xuXG4vKipcbiAqIFJldHVybiBhbiBhcnJheSBvZiBvYmplY3RzIGRlc2NyaWJpbmcgdGljayBsb2NhdGlvbnMgYW5kIGxhYmVscyxcbiAqIGVhY2ggb2JqZWN0IGhhdmluZyBcInZhbHVlXCIgKG51bWJlcikgYW5kIFwibGFiZWxcIiAoc3RyaW5nKVxuICogcHJvcGVydGllcy4gQWxsIHRpY2tzIHdpbGwgYmUgd2l0aGluIHRoZSByYW5nZSBbbWluLCBtYXhdIGFuZFxuICogdGhlcmUgd2lsbCBiZSBhcHByb3hpbWF0ZWx5IG4rMSBvZiB0aGVtLCBkaXZpZGluZyB0aGUgcmFuZ2UgdXBcbiAqIGludG8gbiBkaXZpc2lvbnMsIGFsdGhvdWdoIHRoaXMgbnVtYmVyIG1heSB2YXJ5IGJhc2VkIG9uIHdoaWNoXG4gKiB0aWNrIHZhbHVlcyBzZWVtIGJlc3Qgc3VpdGVkIHRvIGxhYmVsbGluZy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxpbmVhcihtaW4sIG1heCwgbikge1xuICByZXR1cm4gZXhwbG9kZShsaW5lYXJJbnN0cnVjdGlvbihtaW4sIG1heCwgbikpO1xufVxuXG5mdW5jdGlvbiBsaW5lYXJJbnN0cnVjdGlvbihtaW4sIG1heCwgbikge1xuICBsZXQgZGlzcGxheSA9IFwiYXV0b1wiO1xuICBpZiAobWF4IDwgbWluKSB7XG4gICAgcmV0dXJuIGxpbmVhckluc3RydWN0aW9uKG1heCwgbWluLCBuKTtcbiAgfVxuICBpZiAobiA8IDEgfHwgbWF4ID09PSBtaW4pIHtcbiAgICByZXR1cm4ge1xuICAgICAgaW5pdGlhbDogbWluLCBsaW1pdDogbWluLCBzcGFjaW5nOiAxLjAsXG4gICAgICByb3VuZFRvOiBtaW4sIGRpc3BsYXksIHByZWNpc2lvbjogMSwgbG9nVW5tYXA6IGZhbHNlXG4gICAgfTtcbiAgfVxuICBpZiAobWluICE9PSBtaW4gfHwgbWF4ICE9PSBtYXgpIHtcbiAgICAvLyBOYU5zIG11c3QgYmUgaW52b2x2ZWRcbiAgICBjb25zb2xlLmxvZyhcIlNjYWxlVGlja0ludGVydmFsczogV0FSTklORzogbWluID0gXCIgKyBtaW4gKyBcIiwgbWF4ID0gXCIgKyBtYXgpO1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGxldCBpbmMgPSAobWF4IC0gbWluKSAvIG47XG5cbiAgY29uc3QgZGlnSW5jID0gTWF0aC5sb2cxMChpbmMpO1xuICBjb25zdCBkaWdNYXggPSBNYXRoLmxvZzEwKE1hdGguYWJzKG1heCkpO1xuICBjb25zdCBkaWdNaW4gPSBNYXRoLmxvZzEwKE1hdGguYWJzKG1pbikpO1xuXG4gIGNvbnN0IHByZWNJbmMgPSBNYXRoLmZsb29yKGRpZ0luYyk7XG4gIGNvbnN0IHJvdW5kVG8gPSBNYXRoLnBvdygxMC4wLCBwcmVjSW5jKTtcblxuICBpZiAocHJlY0luYyA+IC00ICYmIHByZWNJbmMgPCA0KSB7XG4gICAgZGlzcGxheSA9IFwiZml4ZWRcIjtcbiAgfSBlbHNlIGlmICgoZGlnTWF4ID49IC0yLjAgJiYgZGlnTWF4IDw9IDMuMCkgJiZcbiAgICAoZGlnTWluID49IC0zLjAgJiYgZGlnTWluIDw9IDMuMCkpIHtcbiAgICBkaXNwbGF5ID0gXCJmaXhlZFwiO1xuICB9IGVsc2Uge1xuICAgIGRpc3BsYXkgPSBcInNjaWVudGlmaWNcIjtcbiAgfVxuXG4gIGNvbnN0IHByZWNSYW5nZSA9IE1hdGguY2VpbChkaWdNYXggLSBkaWdJbmMpO1xuXG4gIGxldCBwcmVjID0gMTtcblxuICBpZiAoZGlzcGxheSA9PT0gXCJmaXhlZFwiKSB7XG4gICAgaWYgKGRpZ0luYyA8IDApIHtcbiAgICAgIHByZWMgPSAtcHJlY0luYztcbiAgICB9IGVsc2Uge1xuICAgICAgcHJlYyA9IDA7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHByZWMgPSBwcmVjUmFuZ2U7XG4gIH1cblxuICBsZXQgbWluVGljayA9IG1pbjtcblxuICBpZiAocm91bmRUbyAhPT0gMC4wKSB7XG4gICAgaW5jID0gTWF0aC5yb3VuZChpbmMgLyByb3VuZFRvKSAqIHJvdW5kVG87XG4gICAgaWYgKGluYyA8IHJvdW5kVG8pIGluYyA9IHJvdW5kVG87XG4gICAgbWluVGljayA9IE1hdGguY2VpbChtaW5UaWNrIC8gcm91bmRUbykgKiByb3VuZFRvO1xuICAgIGlmIChtaW5UaWNrID4gbWF4KSBtaW5UaWNrID0gbWF4O1xuICB9XG5cbiAgaWYgKGRpc3BsYXkgPT09IFwic2NpZW50aWZpY1wiICYmIG1pblRpY2sgIT09IDAuMCkge1xuICAgIGNvbnN0IGRpZ05ld01pbiA9IE1hdGgubG9nMTAoTWF0aC5hYnMobWluVGljaykpO1xuICAgIGlmIChkaWdOZXdNaW4gPCBkaWdJbmMpIHtcbiAgICAgIHByZWMgPSBNYXRoLmNlaWwoZGlnTWF4IC0gZGlnTmV3TWluKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGluaXRpYWw6IG1pblRpY2ssIGxpbWl0OiBtYXgsIHNwYWNpbmc6IGluYyxcbiAgICByb3VuZFRvLCBkaXNwbGF5LCBwcmVjaXNpb246IHByZWMsIGxvZ1VubWFwOiBmYWxzZVxuICB9O1xufVxuXG5mdW5jdGlvbiBtYWtlVGljayhkaXNwbGF5LCBwcmVjaXNpb24sIHZhbHVlKSB7XG4gIGlmIChkaXNwbGF5ID09PSBcInNjaWVudGlmaWNcIikge1xuICAgIHJldHVybiB7dmFsdWUsIGxhYmVsOiB2YWx1ZS50b0V4cG9uZW50aWFsKHByZWNpc2lvbil9O1xuICB9IGVsc2UgaWYgKGRpc3BsYXkgPT09IFwiZml4ZWRcIikge1xuICAgIHJldHVybiB7dmFsdWUsIGxhYmVsOiB2YWx1ZS50b0ZpeGVkKHByZWNpc2lvbil9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7dmFsdWUsIGxhYmVsOiB2YWx1ZS50b1ByZWNpc2lvbihwcmVjaXNpb24pfTtcbiAgfVxufVxuXG5mdW5jdGlvbiBleHBsb2RlKGluc3RydWN0aW9uKSB7XG5cbiAgaWYgKGluc3RydWN0aW9uLnNwYWNpbmcgPT09IDAuMCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGxldCBlcHMgPSAxZS03O1xuICBpZiAoaW5zdHJ1Y3Rpb24uc3BhY2luZyA8IGVwcyAqIDEwLjApIHtcbiAgICBlcHMgPSBpbnN0cnVjdGlvbi5zcGFjaW5nIC8gMTAuMDtcbiAgfVxuXG4gIGNvbnN0IG1heCA9IGluc3RydWN0aW9uLmxpbWl0O1xuICBsZXQgbiA9IDA7XG5cbiAgbGV0IHRpY2tzID0gW107XG5cbiAgd2hpbGUgKHRydWUpIHtcbiAgICBsZXQgdmFsdWUgPSBpbnN0cnVjdGlvbi5pbml0aWFsICsgbiAqIGluc3RydWN0aW9uLnNwYWNpbmc7XG4gICAgaWYgKHZhbHVlID49IG1heCArIGVwcykge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGlmIChpbnN0cnVjdGlvbi5sb2dVbm1hcCkge1xuICAgICAgdmFsdWUgPSBNYXRoLnBvdygxMC4wLCB2YWx1ZSk7XG4gICAgfVxuICAgIGlmIChpbnN0cnVjdGlvbi5yb3VuZFRvICE9PSAwLjApIHtcbiAgICAgIHZhbHVlID0gaW5zdHJ1Y3Rpb24ucm91bmRUbyAqIE1hdGgucm91bmQodmFsdWUgLyBpbnN0cnVjdGlvbi5yb3VuZFRvKTtcbiAgICB9XG4gICAgdGlja3MucHVzaChtYWtlVGljayhpbnN0cnVjdGlvbi5kaXNwbGF5LFxuICAgICAgaW5zdHJ1Y3Rpb24ucHJlY2lzaW9uLFxuICAgICAgdmFsdWUpKTtcbiAgICArK247XG4gIH1cblxuICByZXR1cm4gdGlja3M7XG59XG4iXX0=