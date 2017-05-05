
/**
 * Code to calculate which values to label in a scale between two
 * endpoints, and how they should be labelled. Based on
 * ScaleTickIntervals from Sonic Visualiser, relicensed for this
 * library. Copyright 2017 QMUL.
 */

export default class ScaleTickIntervals {

  constructor() { }
  
  /**
   * Return an array of objects describing tick locations and labels,
   * each object having "value" (number) and "label" (string)
   * properties. All ticks will be within the range [min, max] and
   * there will be approximately n+1 of them, dividing the range up
   * into n divisions, although this number may vary based on which
   * tick values seem best suited to labelling.
   */
  linear(min, max, n) {
    let instruction = this._linearInstruction(min, max, n);
    return this._explode(instruction);
  }

  _linearInstruction(min, max, n) {
    let display = "auto";
    if (max < min) {
      return this._linearInstruction(max, min, n);
    }
    if (n < 1 || max === min) {
      return {
	initial: min, limit: min, spacing: 1.0,
	roundTo: min, display, precision: 1, logUnmap: false
      };
    }
    if (min !== min || max !== max) {
      // NaNs must be involved
      console.log("ScaleTickIntervals: WARNING: min = " + min + ", max = " + max);
      return [];
    }

    let inc = (max - min) / n;

    const digInc = Math.log10(inc);
    const digMax = Math.log10(Math.abs(max));
    const digMin = Math.log10(Math.abs(min));
    
    const precInc = Math.floor(digInc);
    const roundTo = Math.pow(10.0, precInc);

    if (precInc > -4 && precInc < 4) {
      display = "fixed";
    } else if ((digMax >= -2.0 && digMax <= 3.0) &&
               (digMin >= -3.0 && digMin <= 3.0)) {
      display = "fixed";
    } else {
      display = "scientific";
    }
        
    const precRange = Math.ceil(digMax - digInc);

    let prec = 1;
        
    if (display === "fixed") {
      if (digInc < 0) {
        prec = -precInc;
      } else {
        prec = 0;
      }
    } else {
      prec = precRange;
    }

    let minTick = min;
        
    if (roundTo !== 0.0) {
      inc = Math.round(inc / roundTo) * roundTo;
      if (inc < roundTo) inc = roundTo;
      minTick = Math.ceil(minTick / roundTo) * roundTo;
      if (minTick > max) minTick = max;
    }

    if (display === "scientific" && minTick !== 0.0) {
      const digNewMin = Math.log10(Math.abs(minTick));
      if (digNewMin < digInc) {
        prec = Math.ceil(digMax - digNewMin);
      }
    }

    return {
      initial: minTick, limit: max, spacing: inc,
      roundTo, display, precision: prec, logUnmap: false
    };
  }

  _makeTick(display, precision, value) {
    if (display === "scientific") {
      return { value, label: value.toExponential(precision) };
    } else if (display === "fixed") {
      return { value, label: value.toFixed(precision) };
    } else {
      return { value, label: value.toPrecision(precision) };
    }
  }

  _explode(instruction) {

    if (instruction.spacing === 0.0) {
      return [];
    }

    let eps = 1e-7;
    if (instruction.spacing < eps * 10.0) {
      eps = instruction.spacing / 10.0;
    }

    const max = instruction.limit;
    let n = 0;

    let ticks = [];
        
    while (true) {
      let value = instruction.initial + n * instruction.spacing;
      if (value >= max + eps) {
        break;
      }
      if (instruction.logUnmap) {
        value = Math.pow(10.0, value);
      }
      if (instruction.roundTo !== 0.0) {
        value = instruction.roundTo * Math.round(value / instruction.roundTo);
      }
      ticks.push(this._makeTick(instruction.display,
                                instruction.precision,
                                value));
      ++n;
    }

    return ticks;
  }
}
