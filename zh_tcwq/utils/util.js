function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function validTime(startTime, endTime) {
  var arr1 = startTime.split("-");
  var arr2 = endTime.split("-");
  var date1 = new Date(parseInt(arr1[0]), parseInt(arr1[1]) - 1, parseInt(arr1[2]), 0, 0, 0);
  var date2 = new Date(parseInt(arr2[0]), parseInt(arr2[1]) - 1, parseInt(arr2[2]), 0, 0, 0);
  if (date1.getTime() >= date2.getTime()) {
    console.log('结束日期不能小于开始日期', this);
    return false;
  } else {
    return true;
  }
  return false;
}
function validTime1(startTime, endTime) {
  var arr1 = startTime.split("-");
  var arr2 = endTime.split("-");
  var date1 = new Date(parseInt(arr1[0]), parseInt(arr1[1]) - 1, parseInt(arr1[2]), 0, 0, 0);
  var date2 = new Date(parseInt(arr2[0]), parseInt(arr2[1]) - 1, parseInt(arr2[2]), 0, 0, 0);
  if (date1.getTime() > date2.getTime()) {
    console.log('结束日期不能小于开始日期', this);
    return false;
  } else {
    return true;
  }
  return false;
}
function ormatDate(dateNum) {
  var date = new Date(dateNum * 1000);
  return date.getFullYear() + "-" + fixZero(date.getMonth() + 1, 2) + "-" + fixZero(date.getDate(), 2) + " " + fixZero(date.getHours(), 2) + ":" + fixZero(date.getMinutes(), 2) + ":" + fixZero(date.getSeconds(), 2);
  function fixZero(num, length) {
    var str = "" + num;
    var len = str.length;
    var s = "";
    for (var i = length; i-- > len;) {
      s += "0";
    }
    return s + str;
  }
}
module.exports = {
  formatTime: formatTime,
  validTime: validTime,
  validTime1: validTime1,
  ormatDate: ormatDate,
}  