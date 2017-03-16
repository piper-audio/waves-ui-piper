
export default class MatrixEntity {

  getColumnCount() {
    // Return here the total number of columns in the matrix.
    return 0;
  }

  getColumnHeight() {
    // Return here the height of a column in the matrix. All columns
    // are expected to be of equal height.
    return 0;
  }

  getColumn(n) {
    // Return here a single column (of index n) as an array or
    // Float32Array.
    return [];
  }

  getStepDuration() {
    // Return the time interval in seconds between consecutive
    // columns. Columns are expected to be equally spaced in time.  If
    // this returns 0, the matrix is considered to span the entire
    // duration of any associated timeline.
    return 0;
  }

  getStartTime() {
    // Return the location in time of the first column in seconds.
    return 0;
  }

  dispose() {
    // Called when this object is no longer going to be used.
  }
}

