import MatrixEntity from './matrix-entity.js';

export default class PrefilledMatrixEntity extends MatrixEntity {

  constructor(data, startTime, stepDuration) {
    super();
    
    // data should be Float32Array[] or number[][]
    this.data = data;

    this.stepDuration = 0;
    this.startTime = 0;

    if (typeof(startTime) !== "undefined") {
      this.startTime = startTime;
    }
    if (typeof(stepDuration) !== "undefined") {
      this.stepDuration = stepDuration;
    }
  }
  
  getColumnCount() {
    return this.data.length;
  }

  getColumnHeight() {
    if (this.data.length > 0) {
      return this.data[0].length;
    } else {
      return 0;
    }
  }

  getColumn(n) {
    return this.data[n];
  }

  getStepDuration() {
    return this.stepDuration;
  }

  getStartTime() {
    return this.startTime;
  }

  dispose() {
    this.data = [];
  }
}

