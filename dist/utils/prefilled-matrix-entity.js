"use strict";

var _get = require("babel-runtime/helpers/get")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _matrixEntityJs = require('./matrix-entity.js');

var _matrixEntityJs2 = _interopRequireDefault(_matrixEntityJs);

var PrefilledMatrixEntity = (function (_MatrixEntity) {
  _inherits(PrefilledMatrixEntity, _MatrixEntity);

  function PrefilledMatrixEntity(data, startTime, stepDuration) {
    _classCallCheck(this, PrefilledMatrixEntity);

    _get(Object.getPrototypeOf(PrefilledMatrixEntity.prototype), "constructor", this).call(this);

    // data should be Float32Array[] or number[][]
    this.data = data;

    this.stepDuration = 0;
    this.startTime = 0;

    if (typeof startTime !== "undefined") {
      this.startTime = startTime;
    }
    if (typeof stepDuration !== "undefined") {
      this.stepDuration = stepDuration;
    }
  }

  _createClass(PrefilledMatrixEntity, [{
    key: "getColumnCount",
    value: function getColumnCount() {
      return this.data.length;
    }
  }, {
    key: "getColumnHeight",
    value: function getColumnHeight() {
      if (this.data.length > 0) {
        return this.data[0].length;
      } else {
        return 0;
      }
    }
  }, {
    key: "getColumn",
    value: function getColumn(n) {
      return this.data[n];
    }
  }, {
    key: "getStepDuration",
    value: function getStepDuration() {
      return this.stepDuration;
    }
  }, {
    key: "getStartTime",
    value: function getStartTime() {
      return this.startTime;
    }
  }, {
    key: "dispose",
    value: function dispose() {
      this.data = [];
    }
  }]);

  return PrefilledMatrixEntity;
})(_matrixEntityJs2["default"]);

exports["default"] = PrefilledMatrixEntity;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy91dGlscy9wcmVmaWxsZWQtbWF0cml4LWVudGl0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzhCQUF5QixvQkFBb0I7Ozs7SUFFeEIscUJBQXFCO1lBQXJCLHFCQUFxQjs7QUFFN0IsV0FGUSxxQkFBcUIsQ0FFNUIsSUFBSSxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUU7MEJBRnhCLHFCQUFxQjs7QUFHdEMsK0JBSGlCLHFCQUFxQiw2Q0FHOUI7OztBQUdSLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVqQixRQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQztBQUN0QixRQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQzs7QUFFbkIsUUFBSSxPQUFPLFNBQVMsQUFBQyxLQUFLLFdBQVcsRUFBRTtBQUNyQyxVQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztLQUM1QjtBQUNELFFBQUksT0FBTyxZQUFZLEFBQUMsS0FBSyxXQUFXLEVBQUU7QUFDeEMsVUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7S0FDbEM7R0FDRjs7ZUFqQmtCLHFCQUFxQjs7V0FtQjFCLDBCQUFHO0FBQ2YsYUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztLQUN6Qjs7O1dBRWMsMkJBQUc7QUFDaEIsVUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDeEIsZUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztPQUM1QixNQUFNO0FBQ0wsZUFBTyxDQUFDLENBQUM7T0FDVjtLQUNGOzs7V0FFUSxtQkFBQyxDQUFDLEVBQUU7QUFDWCxhQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDckI7OztXQUVjLDJCQUFHO0FBQ2hCLGFBQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztLQUMxQjs7O1dBRVcsd0JBQUc7QUFDYixhQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7S0FDdkI7OztXQUVNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7S0FDaEI7OztTQTdDa0IscUJBQXFCOzs7cUJBQXJCLHFCQUFxQiIsImZpbGUiOiJzcmMvdXRpbHMvcHJlZmlsbGVkLW1hdHJpeC1lbnRpdHkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTWF0cml4RW50aXR5IGZyb20gJy4vbWF0cml4LWVudGl0eS5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByZWZpbGxlZE1hdHJpeEVudGl0eSBleHRlbmRzIE1hdHJpeEVudGl0eSB7XG5cbiAgY29uc3RydWN0b3IoZGF0YSwgc3RhcnRUaW1lLCBzdGVwRHVyYXRpb24pIHtcbiAgICBzdXBlcigpO1xuICAgIFxuICAgIC8vIGRhdGEgc2hvdWxkIGJlIEZsb2F0MzJBcnJheVtdIG9yIG51bWJlcltdW11cbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuXG4gICAgdGhpcy5zdGVwRHVyYXRpb24gPSAwO1xuICAgIHRoaXMuc3RhcnRUaW1lID0gMDtcblxuICAgIGlmICh0eXBlb2Yoc3RhcnRUaW1lKSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgdGhpcy5zdGFydFRpbWUgPSBzdGFydFRpbWU7XG4gICAgfVxuICAgIGlmICh0eXBlb2Yoc3RlcER1cmF0aW9uKSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgdGhpcy5zdGVwRHVyYXRpb24gPSBzdGVwRHVyYXRpb247XG4gICAgfVxuICB9XG4gIFxuICBnZXRDb2x1bW5Db3VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhLmxlbmd0aDtcbiAgfVxuXG4gIGdldENvbHVtbkhlaWdodCgpIHtcbiAgICBpZiAodGhpcy5kYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiB0aGlzLmRhdGFbMF0ubGVuZ3RoO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gIH1cblxuICBnZXRDb2x1bW4obikge1xuICAgIHJldHVybiB0aGlzLmRhdGFbbl07XG4gIH1cblxuICBnZXRTdGVwRHVyYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RlcER1cmF0aW9uO1xuICB9XG5cbiAgZ2V0U3RhcnRUaW1lKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0VGltZTtcbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5kYXRhID0gW107XG4gIH1cbn1cblxuIl19