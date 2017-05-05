
/**
 * Code to calculate which values to label in a scale between two
 * endpoints, and how they should be labelled. Based on
 * ScaleTickIntervals from Sonic Visualiser, relicensed for this
 * library. Copyright 2017 QMUL.
 */

"use strict";

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _Math$log10 = require("babel-runtime/core-js/math/log10")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ScaleTickIntervals = (function () {
  function ScaleTickIntervals() {
    _classCallCheck(this, ScaleTickIntervals);
  }

  /**
   * Return an array of objects describing tick locations and labels,
   * each object having "value" (number) and "label" (string)
   * properties. All ticks will be within the range [min, max] and
   * there will be approximately n+1 of them, dividing the range up
   * into n divisions, although this number may vary based on which
   * tick values seem best suited to labelling.
   */

  _createClass(ScaleTickIntervals, [{
    key: "linear",
    value: function linear(min, max, n) {
      var instruction = this._linearInstruction(min, max, n);
      return this._explode(instruction);
    }
  }, {
    key: "_linearInstruction",
    value: function _linearInstruction(min, max, n) {
      var display = "auto";
      if (max < min) {
        return this._linearInstruction(max, min, n);
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
  }, {
    key: "_makeTick",
    value: function _makeTick(display, precision, value) {
      if (display === "scientific") {
        return { value: value, label: value.toExponential(precision) };
      } else if (display === "fixed") {
        return { value: value, label: value.toFixed(precision) };
      } else {
        return { value: value, label: value.toPrecision(precision) };
      }
    }
  }, {
    key: "_explode",
    value: function _explode(instruction) {

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
        ticks.push(this._makeTick(instruction.display, instruction.precision, value));
        ++n;
      }

      return ticks;
    }
  }]);

  return ScaleTickIntervals;
})();

exports["default"] = ScaleTickIntervals;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy91dGlscy9zY2FsZS10aWNrLWludGVydmFscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQVFxQixrQkFBa0I7QUFFMUIsV0FGUSxrQkFBa0IsR0FFdkI7MEJBRkssa0JBQWtCO0dBRXBCOzs7Ozs7Ozs7OztlQUZFLGtCQUFrQjs7V0FZL0IsZ0JBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUU7QUFDbEIsVUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdkQsYUFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0tBQ25DOzs7V0FFaUIsNEJBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUU7QUFDOUIsVUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLFVBQUksR0FBRyxHQUFHLEdBQUcsRUFBRTtBQUNiLGVBQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7T0FDN0M7QUFDRCxVQUFJLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxLQUFLLEdBQUcsRUFBRTtBQUN4QixlQUFPO0FBQ1osaUJBQU8sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsR0FBRztBQUN0QyxpQkFBTyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUs7U0FDOUMsQ0FBQztPQUNIO0FBQ0QsVUFBSSxHQUFHLEtBQUssR0FBRyxJQUFJLEdBQUcsS0FBSyxHQUFHLEVBQUU7O0FBRTlCLGVBQU8sQ0FBQyxHQUFHLENBQUMscUNBQXFDLEdBQUcsR0FBRyxHQUFHLFVBQVUsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUM1RSxlQUFPLEVBQUUsQ0FBQztP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RTtBQUNELGFBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUNuQixXQUFXLENBQUMsU0FBUyxFQUNyQixLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ2xDLFVBQUUsQ0FBQyxDQUFDO09BQ0w7O0FBRUQsYUFBTyxLQUFLLENBQUM7S0FDZDs7O1NBcElrQixrQkFBa0I7OztxQkFBbEIsa0JBQWtCIiwiZmlsZSI6InNyYy91dGlscy9zY2FsZS10aWNrLWludGVydmFscy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLyoqXG4gKiBDb2RlIHRvIGNhbGN1bGF0ZSB3aGljaCB2YWx1ZXMgdG8gbGFiZWwgaW4gYSBzY2FsZSBiZXR3ZWVuIHR3b1xuICogZW5kcG9pbnRzLCBhbmQgaG93IHRoZXkgc2hvdWxkIGJlIGxhYmVsbGVkLiBCYXNlZCBvblxuICogU2NhbGVUaWNrSW50ZXJ2YWxzIGZyb20gU29uaWMgVmlzdWFsaXNlciwgcmVsaWNlbnNlZCBmb3IgdGhpc1xuICogbGlicmFyeS4gQ29weXJpZ2h0IDIwMTcgUU1VTC5cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY2FsZVRpY2tJbnRlcnZhbHMge1xuXG4gIGNvbnN0cnVjdG9yKCkgeyB9XG4gIFxuICAvKipcbiAgICogUmV0dXJuIGFuIGFycmF5IG9mIG9iamVjdHMgZGVzY3JpYmluZyB0aWNrIGxvY2F0aW9ucyBhbmQgbGFiZWxzLFxuICAgKiBlYWNoIG9iamVjdCBoYXZpbmcgXCJ2YWx1ZVwiIChudW1iZXIpIGFuZCBcImxhYmVsXCIgKHN0cmluZylcbiAgICogcHJvcGVydGllcy4gQWxsIHRpY2tzIHdpbGwgYmUgd2l0aGluIHRoZSByYW5nZSBbbWluLCBtYXhdIGFuZFxuICAgKiB0aGVyZSB3aWxsIGJlIGFwcHJveGltYXRlbHkgbisxIG9mIHRoZW0sIGRpdmlkaW5nIHRoZSByYW5nZSB1cFxuICAgKiBpbnRvIG4gZGl2aXNpb25zLCBhbHRob3VnaCB0aGlzIG51bWJlciBtYXkgdmFyeSBiYXNlZCBvbiB3aGljaFxuICAgKiB0aWNrIHZhbHVlcyBzZWVtIGJlc3Qgc3VpdGVkIHRvIGxhYmVsbGluZy5cbiAgICovXG4gIGxpbmVhcihtaW4sIG1heCwgbikge1xuICAgIGxldCBpbnN0cnVjdGlvbiA9IHRoaXMuX2xpbmVhckluc3RydWN0aW9uKG1pbiwgbWF4LCBuKTtcbiAgICByZXR1cm4gdGhpcy5fZXhwbG9kZShpbnN0cnVjdGlvbik7XG4gIH1cblxuICBfbGluZWFySW5zdHJ1Y3Rpb24obWluLCBtYXgsIG4pIHtcbiAgICBsZXQgZGlzcGxheSA9IFwiYXV0b1wiO1xuICAgIGlmIChtYXggPCBtaW4pIHtcbiAgICAgIHJldHVybiB0aGlzLl9saW5lYXJJbnN0cnVjdGlvbihtYXgsIG1pbiwgbik7XG4gICAgfVxuICAgIGlmIChuIDwgMSB8fCBtYXggPT09IG1pbikge1xuICAgICAgcmV0dXJuIHtcblx0aW5pdGlhbDogbWluLCBsaW1pdDogbWluLCBzcGFjaW5nOiAxLjAsXG5cdHJvdW5kVG86IG1pbiwgZGlzcGxheSwgcHJlY2lzaW9uOiAxLCBsb2dVbm1hcDogZmFsc2VcbiAgICAgIH07XG4gICAgfVxuICAgIGlmIChtaW4gIT09IG1pbiB8fCBtYXggIT09IG1heCkge1xuICAgICAgLy8gTmFOcyBtdXN0IGJlIGludm9sdmVkXG4gICAgICBjb25zb2xlLmxvZyhcIlNjYWxlVGlja0ludGVydmFsczogV0FSTklORzogbWluID0gXCIgKyBtaW4gKyBcIiwgbWF4ID0gXCIgKyBtYXgpO1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGxldCBpbmMgPSAobWF4IC0gbWluKSAvIG47XG5cbiAgICBjb25zdCBkaWdJbmMgPSBNYXRoLmxvZzEwKGluYyk7XG4gICAgY29uc3QgZGlnTWF4ID0gTWF0aC5sb2cxMChNYXRoLmFicyhtYXgpKTtcbiAgICBjb25zdCBkaWdNaW4gPSBNYXRoLmxvZzEwKE1hdGguYWJzKG1pbikpO1xuICAgIFxuICAgIGNvbnN0IHByZWNJbmMgPSBNYXRoLmZsb29yKGRpZ0luYyk7XG4gICAgY29uc3Qgcm91bmRUbyA9IE1hdGgucG93KDEwLjAsIHByZWNJbmMpO1xuXG4gICAgaWYgKHByZWNJbmMgPiAtNCAmJiBwcmVjSW5jIDwgNCkge1xuICAgICAgZGlzcGxheSA9IFwiZml4ZWRcIjtcbiAgICB9IGVsc2UgaWYgKChkaWdNYXggPj0gLTIuMCAmJiBkaWdNYXggPD0gMy4wKSAmJlxuICAgICAgICAgICAgICAgKGRpZ01pbiA+PSAtMy4wICYmIGRpZ01pbiA8PSAzLjApKSB7XG4gICAgICBkaXNwbGF5ID0gXCJmaXhlZFwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBkaXNwbGF5ID0gXCJzY2llbnRpZmljXCI7XG4gICAgfVxuICAgICAgICBcbiAgICBjb25zdCBwcmVjUmFuZ2UgPSBNYXRoLmNlaWwoZGlnTWF4IC0gZGlnSW5jKTtcblxuICAgIGxldCBwcmVjID0gMTtcbiAgICAgICAgXG4gICAgaWYgKGRpc3BsYXkgPT09IFwiZml4ZWRcIikge1xuICAgICAgaWYgKGRpZ0luYyA8IDApIHtcbiAgICAgICAgcHJlYyA9IC1wcmVjSW5jO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHJlYyA9IDA7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHByZWMgPSBwcmVjUmFuZ2U7XG4gICAgfVxuXG4gICAgbGV0IG1pblRpY2sgPSBtaW47XG4gICAgICAgIFxuICAgIGlmIChyb3VuZFRvICE9PSAwLjApIHtcbiAgICAgIGluYyA9IE1hdGgucm91bmQoaW5jIC8gcm91bmRUbykgKiByb3VuZFRvO1xuICAgICAgaWYgKGluYyA8IHJvdW5kVG8pIGluYyA9IHJvdW5kVG87XG4gICAgICBtaW5UaWNrID0gTWF0aC5jZWlsKG1pblRpY2sgLyByb3VuZFRvKSAqIHJvdW5kVG87XG4gICAgICBpZiAobWluVGljayA+IG1heCkgbWluVGljayA9IG1heDtcbiAgICB9XG5cbiAgICBpZiAoZGlzcGxheSA9PT0gXCJzY2llbnRpZmljXCIgJiYgbWluVGljayAhPT0gMC4wKSB7XG4gICAgICBjb25zdCBkaWdOZXdNaW4gPSBNYXRoLmxvZzEwKE1hdGguYWJzKG1pblRpY2spKTtcbiAgICAgIGlmIChkaWdOZXdNaW4gPCBkaWdJbmMpIHtcbiAgICAgICAgcHJlYyA9IE1hdGguY2VpbChkaWdNYXggLSBkaWdOZXdNaW4pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBpbml0aWFsOiBtaW5UaWNrLCBsaW1pdDogbWF4LCBzcGFjaW5nOiBpbmMsXG4gICAgICByb3VuZFRvLCBkaXNwbGF5LCBwcmVjaXNpb246IHByZWMsIGxvZ1VubWFwOiBmYWxzZVxuICAgIH07XG4gIH1cblxuICBfbWFrZVRpY2soZGlzcGxheSwgcHJlY2lzaW9uLCB2YWx1ZSkge1xuICAgIGlmIChkaXNwbGF5ID09PSBcInNjaWVudGlmaWNcIikge1xuICAgICAgcmV0dXJuIHsgdmFsdWUsIGxhYmVsOiB2YWx1ZS50b0V4cG9uZW50aWFsKHByZWNpc2lvbikgfTtcbiAgICB9IGVsc2UgaWYgKGRpc3BsYXkgPT09IFwiZml4ZWRcIikge1xuICAgICAgcmV0dXJuIHsgdmFsdWUsIGxhYmVsOiB2YWx1ZS50b0ZpeGVkKHByZWNpc2lvbikgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHsgdmFsdWUsIGxhYmVsOiB2YWx1ZS50b1ByZWNpc2lvbihwcmVjaXNpb24pIH07XG4gICAgfVxuICB9XG5cbiAgX2V4cGxvZGUoaW5zdHJ1Y3Rpb24pIHtcblxuICAgIGlmIChpbnN0cnVjdGlvbi5zcGFjaW5nID09PSAwLjApIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBsZXQgZXBzID0gMWUtNztcbiAgICBpZiAoaW5zdHJ1Y3Rpb24uc3BhY2luZyA8IGVwcyAqIDEwLjApIHtcbiAgICAgIGVwcyA9IGluc3RydWN0aW9uLnNwYWNpbmcgLyAxMC4wO1xuICAgIH1cblxuICAgIGNvbnN0IG1heCA9IGluc3RydWN0aW9uLmxpbWl0O1xuICAgIGxldCBuID0gMDtcblxuICAgIGxldCB0aWNrcyA9IFtdO1xuICAgICAgICBcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgbGV0IHZhbHVlID0gaW5zdHJ1Y3Rpb24uaW5pdGlhbCArIG4gKiBpbnN0cnVjdGlvbi5zcGFjaW5nO1xuICAgICAgaWYgKHZhbHVlID49IG1heCArIGVwcykge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmIChpbnN0cnVjdGlvbi5sb2dVbm1hcCkge1xuICAgICAgICB2YWx1ZSA9IE1hdGgucG93KDEwLjAsIHZhbHVlKTtcbiAgICAgIH1cbiAgICAgIGlmIChpbnN0cnVjdGlvbi5yb3VuZFRvICE9PSAwLjApIHtcbiAgICAgICAgdmFsdWUgPSBpbnN0cnVjdGlvbi5yb3VuZFRvICogTWF0aC5yb3VuZCh2YWx1ZSAvIGluc3RydWN0aW9uLnJvdW5kVG8pO1xuICAgICAgfVxuICAgICAgdGlja3MucHVzaCh0aGlzLl9tYWtlVGljayhpbnN0cnVjdGlvbi5kaXNwbGF5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnN0cnVjdGlvbi5wcmVjaXNpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlKSk7XG4gICAgICArK247XG4gICAgfVxuXG4gICAgcmV0dXJuIHRpY2tzO1xuICB9XG59XG4iXX0=