var express = require('express');
var app = express();
var fs = require('fs');
var RNCryptor = require('jscryptor');
//var password="generatetestkey";
var password="ExcEviFkey$32!$2$#";

module.exports.authentication=function (token)
{
  var decrypted = RNCryptor.Decrypt(token, password);
  var time = js_yyyy_mm_dd_hh_mm_ss (new Date(decrypted.toString()));
  var currentTime = js_yyyy_mm_dd_hh_mm_ss (new Date());
  if (time >= currentTime)
  {
      return 1;
  }
  else
  {
      return 2;
  }
}
module.exports.encrypt=function (plaintext)
{
  var encrypted = RNCryptor.Encrypt(plaintext, password);
  return encrypted;
}
module.exports.decrypt=function (encryptText)
{
  var decrypted = RNCryptor.Decrypt(encryptText.toString(), password);
  return decrypted.toString();
}
function js_yyyy_mm_dd_hh_mm_ss (Datee) {
  now = Datee;
  year = "" + now.getFullYear();
  month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
  day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
  hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
  minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
  second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
  return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}
