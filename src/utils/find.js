
/**
 * Binary search. Given an array `data`, a value `x`, and an accessor
 * function `f`, perform a binary search of `data` and return the
 * index for which the accessor function, when called on the data
 * element at that index, returns `x`.
 *
 * The array must be sorted on f(data) already.
 *
 * If there is no exact match, returns the index just before where `x`
 * would appear, unless `x` would appear as the first element in which
 * case 0 is returned. (So the returned index is always in range for
 * the input array, unless the input array is empty.)
 */
export function findWithin(data, x, f) {
  
  let low = 0;
  let high = data.length - 1;

  while (low <= high) {
    let mid = low + ((high - low) >> 1);
    let value = f(data[mid]);
    if (value < x) {
      low = mid + 1;
    } else if (value > x) {
      high = mid - 1;
    } else {
      return mid;
    }
  }
  
  if (high < 0) {
    return 0;
  } else {
    return high;
  }
}
