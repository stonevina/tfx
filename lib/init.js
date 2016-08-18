/**
 * @description tfx初始化
 * @time 2016.8.17 11.16
 */
'use strict';

var fs = require('fs');
var path = require('path');

var config = require('./config.js');

//删除文件/文件夹
var rm = function(dir) {
  try {
    fs.accessSync(dir); //判断指定目录是否存在
    if (fs.statSync(dir).isDirectory()) {
      fs.readdirSync(dir).forEach(function(filePath, i) {
        rm(dir + '/' + filePath);
      });
    } else {
      fs.unlinkSync(dir);
    }
    fs.rmdirSync(dir);
  } catch(e) {}
};

//拷贝文件
var copy = function(readPath, writePath) {
  var readStream = fs.createReadStream(readPath);
  var writeStream = fs.createWriteStream(writePath);

  readStream
    .on('data', function(chunk) {
      if (writeStream.write(chunk) == false) {
        readStream.pause();
      }
    })
    .on('end', function() {
      writeStream.end();
    })

  writeStream
    .on('drain', function() {
      readStream.resume();
    });
};

//创建工程模板目录
var createBoilerplate = function(srcPath, targetPath) {

  fs.stat(srcPath, function(error, stats) {
    if (error) return console.log('tfx createBoilerplate action run %s', error);

    if (stats.isDirectory()) {
      fs.mkdirSync(targetPath);

      fs.readdir(srcPath, function(err, files) {
        if (err) return console.log('tfx createBoilerplate action -> readdir action run %s', err);
        files.forEach(function(filePath, i) {
          createBoilerplate(srcPath + '/' + filePath, targetPath + '/' + filePath);
        });
      });
    } else {
      copy(srcPath, targetPath);
    }
  });
};

module.exports = function(srcPath, targetPath) {
  rm(targetPath);
  createBoilerplate(srcPath, targetPath);
  config.init();
};