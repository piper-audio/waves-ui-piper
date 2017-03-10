import MatrixEntity from './matrix-entity.js';

export default class PrefilledMatrixEntity extends MatrixEntity {

  constructor(data) {
    super();
    
    // data should be Float32Array[] or number[][]
    this.data = data;
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
}

