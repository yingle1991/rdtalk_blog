/*
 * @Description: 
 * @Author: Harry
 * @Date: 2021-09-05 13:44:18
 * @Url: https://u.mr90.top
 * @github: https://github.com/rr210
 * @LastEditTime: 2021-09-11 19:13:07
 * @LastEditors: Harry
 */

// 时间戳转化日期格式 yy-mm-dd hh:mm:ss
var change = function (value) {
  value = value.replace(".000+0000", "Z");
  var time = new Date(value);
  var year = time.getFullYear();
  var month = time.getMonth() + 1;
  var date = time.getDate();
  var hour = time.getHours();
  var minute = time.getMinutes();
  var second = time.getSeconds();
  month = month < 10 ? "0" + month : month;
  date = date < 10 ? "0" + date : date;
  hour = hour < 10 ? "0" + hour : hour;
  minute = minute < 10 ? "0" + minute : minute;
  second = second < 10 ? "0" + second : second;
  return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
}

var slice = function(value){
  return value.split('T')[0]
}
module.exports = {
  timeChange: change,
  slice:slice
}
