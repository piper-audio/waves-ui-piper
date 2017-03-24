"use strict";

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var MatrixEntity = (function () {
  function MatrixEntity() {
    _classCallCheck(this, MatrixEntity);
  }

  _createClass(MatrixEntity, [{
    key: "getColumnCount",
    value: function getColumnCount() {
      // Return here the total number of columns in the matrix.
      return 0;
    }
  }, {
    key: "getColumnHeight",
    value: function getColumnHeight() {
      // Return here the height of a column in the matrix. All columns
      // are expected to be of equal height.
      return 0;
    }
  }, {
    key: "getColumn",
    value: function getColumn(n) {
      // Return here a single column (of index n) as an array or
      // Float32Array.
      return [];
    }
  }, {
    key: "getStepDuration",
    value: function getStepDuration() {
      // Return the time interval in seconds between consecutive
      // columns. Columns are expected to be equally spaced in time.  If
      // this returns 0, the matrix is considered to span the entire
      // duration of any associated timeline.
      return 0;
    }
  }, {
    key: "getStartTime",
    value: function getStartTime() {
      // Return the location in time of the first column in seconds.
      return 0;
    }
  }, {
    key: "dispose",
    value: function dispose() {
      // Called when this object is no longer going to be used.
    }
  }]);

  return MatrixEntity;
})();

exports["default"] = MatrixEntity;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy91dGlscy9tYXRyaXgtZW50aXR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFDcUIsWUFBWTtXQUFaLFlBQVk7MEJBQVosWUFBWTs7O2VBQVosWUFBWTs7V0FFakIsMEJBQUc7O0FBRWYsYUFBTyxDQUFDLENBQUM7S0FDVjs7O1dBRWMsMkJBQUc7OztBQUdoQixhQUFPLENBQUMsQ0FBQztLQUNWOzs7V0FFUSxtQkFBQyxDQUFDLEVBQUU7OztBQUdYLGFBQU8sRUFBRSxDQUFDO0tBQ1g7OztXQUVjLDJCQUFHOzs7OztBQUtoQixhQUFPLENBQUMsQ0FBQztLQUNWOzs7V0FFVyx3QkFBRzs7QUFFYixhQUFPLENBQUMsQ0FBQztLQUNWOzs7V0FFTSxtQkFBRzs7S0FFVDs7O1NBbENrQixZQUFZOzs7cUJBQVosWUFBWSIsImZpbGUiOiJzcmMvdXRpbHMvbWF0cml4LWVudGl0eS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWF0cml4RW50aXR5IHtcblxuICBnZXRDb2x1bW5Db3VudCgpIHtcbiAgICAvLyBSZXR1cm4gaGVyZSB0aGUgdG90YWwgbnVtYmVyIG9mIGNvbHVtbnMgaW4gdGhlIG1hdHJpeC5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGdldENvbHVtbkhlaWdodCgpIHtcbiAgICAvLyBSZXR1cm4gaGVyZSB0aGUgaGVpZ2h0IG9mIGEgY29sdW1uIGluIHRoZSBtYXRyaXguIEFsbCBjb2x1bW5zXG4gICAgLy8gYXJlIGV4cGVjdGVkIHRvIGJlIG9mIGVxdWFsIGhlaWdodC5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGdldENvbHVtbihuKSB7XG4gICAgLy8gUmV0dXJuIGhlcmUgYSBzaW5nbGUgY29sdW1uIChvZiBpbmRleCBuKSBhcyBhbiBhcnJheSBvclxuICAgIC8vIEZsb2F0MzJBcnJheS5cbiAgICByZXR1cm4gW107XG4gIH1cblxuICBnZXRTdGVwRHVyYXRpb24oKSB7XG4gICAgLy8gUmV0dXJuIHRoZSB0aW1lIGludGVydmFsIGluIHNlY29uZHMgYmV0d2VlbiBjb25zZWN1dGl2ZVxuICAgIC8vIGNvbHVtbnMuIENvbHVtbnMgYXJlIGV4cGVjdGVkIHRvIGJlIGVxdWFsbHkgc3BhY2VkIGluIHRpbWUuICBJZlxuICAgIC8vIHRoaXMgcmV0dXJucyAwLCB0aGUgbWF0cml4IGlzIGNvbnNpZGVyZWQgdG8gc3BhbiB0aGUgZW50aXJlXG4gICAgLy8gZHVyYXRpb24gb2YgYW55IGFzc29jaWF0ZWQgdGltZWxpbmUuXG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBnZXRTdGFydFRpbWUoKSB7XG4gICAgLy8gUmV0dXJuIHRoZSBsb2NhdGlvbiBpbiB0aW1lIG9mIHRoZSBmaXJzdCBjb2x1bW4gaW4gc2Vjb25kcy5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgLy8gQ2FsbGVkIHdoZW4gdGhpcyBvYmplY3QgaXMgbm8gbG9uZ2VyIGdvaW5nIHRvIGJlIHVzZWQuXG4gIH1cbn1cblxuIl19