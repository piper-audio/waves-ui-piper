
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy91dGlscy9zY2FsZS10aWNrLWludGVydmFscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQVFxQixrQkFBa0I7QUFFMUIsV0FGUSxrQkFBa0IsR0FFdkI7MEJBRkssa0JBQWtCO0dBRXBCOzs7Ozs7Ozs7OztlQUZFLGtCQUFrQjs7V0FZL0IsZ0JBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUU7QUFDbEIsVUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdkQsYUFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0tBQ25DOzs7V0FFaUIsNEJBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUU7QUFDOUIsVUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLFVBQUksR0FBRyxHQUFHLEdBQUcsRUFBRTtBQUNiLGVBQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7T0FDN0M7QUFDRCxVQUFJLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxLQUFLLEdBQUcsRUFBRTtBQUN4QixlQUFPO0FBQ1osaUJBQU8sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsR0FBRztBQUN0QyxpQkFBTyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUs7U0FDOUMsQ0FBQztPQUNIOztBQUVELFVBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQSxHQUFJLENBQUMsQ0FBQzs7QUFFMUIsVUFBTSxNQUFNLEdBQUcsWUFBVyxHQUFHLENBQUMsQ0FBQztBQUMvQixVQUFNLE1BQU0sR0FBRyxZQUFXLElBQUksQ0FBQyxHQUFHLENB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LENBQUM7S0FDZDs7O1NBL0hrQixrQkFBa0I7OztxQkFBbEIsa0JBQWtCIiwiZmlsZSI6InNyYy91dGlscy9zY2FsZS10aWNrLWludGVydmFscy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLyoqXG4gKiBDb2RlIHRvIGNhbGN1bGF0ZSB3aGljaCB2YWx1ZXMgdG8gbGFiZWwgaW4gYSBzY2FsZSBiZXR3ZWVuIHR3b1xuICogZW5kcG9pbnRzLCBhbmQgaG93IHRoZXkgc2hvdWxkIGJlIGxhYmVsbGVkLiBCYXNlZCBvblxuICogU2NhbGVUaWNrSW50ZXJ2YWxzIGZyb20gU29uaWMgVmlzdWFsaXNlciwgcmVsaWNlbnNlZCBmb3IgdGhpc1xuICogbGlicmFyeS4gQ29weXJpZ2h0IDIwMTcgUU1VTC5cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY2FsZVRpY2tJbnRlcnZhbHMge1xuXG4gIGNvbnN0cnVjdG9yKCkgeyB9XG4gIFxuICAvKipcbiAgICogUmV0dXJuIGFuIGFycmF5IG9mIG9iamVjdHMgZGVzY3JpYmluZyB0aWNrIGxvY2F0aW9ucyBhbmQgbGFiZWxzLFxuICAgKiBlYWNoIG9iamVjdCBoYXZpbmcgXCJ2YWx1ZVwiIChudW1iZXIpIGFuZCBcImxhYmVsXCIgKHN0cmluZylcbiAgICogcHJvcGVydGllcy4gQWxsIHRpY2tzIHdpbGwgYmUgd2l0aGluIHRoZSByYW5nZSBbbWluLCBtYXhdIGFuZFxuICAgKiB0aGVyZSB3aWxsIGJlIGFwcHJveGltYXRlbHkgbisxIG9mIHRoZW0sIGRpdmlkaW5nIHRoZSByYW5nZSB1cFxuICAgKiBpbnRvIG4gZGl2aXNpb25zLCBhbHRob3VnaCB0aGlzIG51bWJlciBtYXkgdmFyeSBiYXNlZCBvbiB3aGljaFxuICAgKiB0aWNrIHZhbHVlcyBzZWVtIGJlc3Qgc3VpdGVkIHRvIGxhYmVsbGluZy5cbiAgICovXG4gIGxpbmVhcihtaW4sIG1heCwgbikge1xuICAgIGxldCBpbnN0cnVjdGlvbiA9IHRoaXMuX2xpbmVhckluc3RydWN0aW9uKG1pbiwgbWF4LCBuKTtcbiAgICByZXR1cm4gdGhpcy5fZXhwbG9kZShpbnN0cnVjdGlvbik7XG4gIH1cblxuICBfbGluZWFySW5zdHJ1Y3Rpb24obWluLCBtYXgsIG4pIHtcbiAgICBsZXQgZGlzcGxheSA9IFwiYXV0b1wiO1xuICAgIGlmIChtYXggPCBtaW4pIHtcbiAgICAgIHJldHVybiB0aGlzLl9saW5lYXJJbnN0cnVjdGlvbihtYXgsIG1pbiwgbik7XG4gICAgfVxuICAgIGlmIChuIDwgMSB8fCBtYXggPT09IG1pbikge1xuICAgICAgcmV0dXJuIHtcblx0aW5pdGlhbDogbWluLCBsaW1pdDogbWluLCBzcGFjaW5nOiAxLjAsXG5cdHJvdW5kVG86IG1pbiwgZGlzcGxheSwgcHJlY2lzaW9uOiAxLCBsb2dVbm1hcDogZmFsc2VcbiAgICAgIH07XG4gICAgfVxuXG4gICAgbGV0IGluYyA9IChtYXggLSBtaW4pIC8gbjtcblxuICAgIGNvbnN0IGRpZ0luYyA9IE1hdGgubG9nMTAoaW5jKTtcbiAgICBjb25zdCBkaWdNYXggPSBNYXRoLmxvZzEwKE1hdGguYWJzKG1heCkpO1xuICAgIGNvbnN0IGRpZ01pbiA9IE1hdGgubG9nMTAoTWF0aC5hYnMobWluKSk7XG4gICAgXG4gICAgY29uc3QgcHJlY0luYyA9IE1hdGguZmxvb3IoZGlnSW5jKTtcbiAgICBjb25zdCByb3VuZFRvID0gTWF0aC5wb3coMTAuMCwgcHJlY0luYyk7XG5cbiAgICBpZiAocHJlY0luYyA+IC00ICYmIHByZWNJbmMgPCA0KSB7XG4gICAgICBkaXNwbGF5ID0gXCJmaXhlZFwiO1xuICAgIH0gZWxzZSBpZiAoKGRpZ01heCA+PSAtMi4wICYmIGRpZ01heCA8PSAzLjApICYmXG4gICAgICAgICAgICAgICAoZGlnTWluID49IC0zLjAgJiYgZGlnTWluIDw9IDMuMCkpIHtcbiAgICAgIGRpc3BsYXkgPSBcImZpeGVkXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpc3BsYXkgPSBcInNjaWVudGlmaWNcIjtcbiAgICB9XG4gICAgICAgIFxuICAgIGNvbnN0IHByZWNSYW5nZSA9IE1hdGguY2VpbChkaWdNYXggLSBkaWdJbmMpO1xuXG4gICAgbGV0IHByZWMgPSAxO1xuICAgICAgICBcbiAgICBpZiAoZGlzcGxheSA9PT0gXCJmaXhlZFwiKSB7XG4gICAgICBpZiAoZGlnSW5jIDwgMCkge1xuICAgICAgICBwcmVjID0gLXByZWNJbmM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwcmVjID0gMDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcHJlYyA9IHByZWNSYW5nZTtcbiAgICB9XG5cbiAgICBsZXQgbWluVGljayA9IG1pbjtcbiAgICAgICAgXG4gICAgaWYgKHJvdW5kVG8gIT09IDAuMCkge1xuICAgICAgaW5jID0gTWF0aC5yb3VuZChpbmMgLyByb3VuZFRvKSAqIHJvdW5kVG87XG4gICAgICBpZiAoaW5jIDwgcm91bmRUbykgaW5jID0gcm91bmRUbztcbiAgICAgIG1pblRpY2sgPSBNYXRoLmNlaWwobWluVGljayAvIHJvdW5kVG8pICogcm91bmRUbztcbiAgICAgIGlmIChtaW5UaWNrID4gbWF4KSBtaW5UaWNrID0gbWF4O1xuICAgIH1cblxuICAgIGlmIChkaXNwbGF5ID09PSBcInNjaWVudGlmaWNcIiAmJiBtaW5UaWNrICE9PSAwLjApIHtcbiAgICAgIGNvbnN0IGRpZ05ld01pbiA9IE1hdGgubG9nMTAoTWF0aC5hYnMobWluVGljaykpO1xuICAgICAgaWYgKGRpZ05ld01pbiA8IGRpZ0luYykge1xuICAgICAgICBwcmVjID0gTWF0aC5jZWlsKGRpZ01heCAtIGRpZ05ld01pbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGluaXRpYWw6IG1pblRpY2ssIGxpbWl0OiBtYXgsIHNwYWNpbmc6IGluYyxcbiAgICAgIHJvdW5kVG8sIGRpc3BsYXksIHByZWNpc2lvbjogcHJlYywgbG9nVW5tYXA6IGZhbHNlXG4gICAgfTtcbiAgfVxuXG4gIF9tYWtlVGljayhkaXNwbGF5LCBwcmVjaXNpb24sIHZhbHVlKSB7XG4gICAgaWYgKGRpc3BsYXkgPT09IFwic2NpZW50aWZpY1wiKSB7XG4gICAgICByZXR1cm4geyB2YWx1ZSwgbGFiZWw6IHZhbHVlLnRvRXhwb25lbnRpYWwocHJlY2lzaW9uKSB9O1xuICAgIH0gZWxzZSBpZiAoZGlzcGxheSA9PT0gXCJmaXhlZFwiKSB7XG4gICAgICByZXR1cm4geyB2YWx1ZSwgbGFiZWw6IHZhbHVlLnRvRml4ZWQocHJlY2lzaW9uKSB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4geyB2YWx1ZSwgbGFiZWw6IHZhbHVlLnRvUHJlY2lzaW9uKHByZWNpc2lvbikgfTtcbiAgICB9XG4gIH1cblxuICBfZXhwbG9kZShpbnN0cnVjdGlvbikge1xuXG4gICAgaWYgKGluc3RydWN0aW9uLnNwYWNpbmcgPT09IDAuMCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGxldCBlcHMgPSAxZS03O1xuICAgIGlmIChpbnN0cnVjdGlvbi5zcGFjaW5nIDwgZXBzICogMTAuMCkge1xuICAgICAgZXBzID0gaW5zdHJ1Y3Rpb24uc3BhY2luZyAvIDEwLjA7XG4gICAgfVxuXG4gICAgY29uc3QgbWF4ID0gaW5zdHJ1Y3Rpb24ubGltaXQ7XG4gICAgbGV0IG4gPSAwO1xuXG4gICAgbGV0IHRpY2tzID0gW107XG4gICAgICAgIFxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBsZXQgdmFsdWUgPSBpbnN0cnVjdGlvbi5pbml0aWFsICsgbiAqIGluc3RydWN0aW9uLnNwYWNpbmc7XG4gICAgICBpZiAodmFsdWUgPj0gbWF4ICsgZXBzKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaWYgKGluc3RydWN0aW9uLmxvZ1VubWFwKSB7XG4gICAgICAgIHZhbHVlID0gTWF0aC5wb3coMTAuMCwgdmFsdWUpO1xuICAgICAgfVxuICAgICAgaWYgKGluc3RydWN0aW9uLnJvdW5kVG8gIT09IDAuMCkge1xuICAgICAgICB2YWx1ZSA9IGluc3RydWN0aW9uLnJvdW5kVG8gKiBNYXRoLnJvdW5kKHZhbHVlIC8gaW5zdHJ1Y3Rpb24ucm91bmRUbyk7XG4gICAgICB9XG4gICAgICB0aWNrcy5wdXNoKHRoaXMuX21ha2VUaWNrKGluc3RydWN0aW9uLmRpc3BsYXksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc3RydWN0aW9uLnByZWNpc2lvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUpKTtcbiAgICAgICsrbjtcbiAgICB9XG5cbiAgICByZXR1cm4gdGlja3M7XG4gIH1cbn1cbiJdfQ==