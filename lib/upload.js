/**
 * @description ftp上传
 * @time 2016.8.15 13:50
 */
'use strict';

var fs = require('fs');
var path = require('path');
var EventEmitter = require('events');

var minimatch = require('minimatch');
var Client = require('ftp');
var ftp = new Client();
var emitter = new EventEmitter();

var totalFileCount = 0;
var transferredFileCount = 0;

emitter.on('upload', function(opts) {
  if (totalFileCount == transferredFileCount) {
    opts.callback && opts.callback();
    ftp.end();
  }
});

var put = function(src, dest, callback) {
  ftp.put(src, dest, function(err, rs) {
    if (err) {
      console.error('tfx put %s to %s %s', src, dest, err);
      return ftp.end();
    }

    callback(rs);
  });
};

var canIncludeFile = function(filePath, exclude) {
  if (exclude.length > 0) {
    for(var i = 0; i < exclude.length; i++) {
      if (minimatch(filePath, exclude[i], {matchBase: true})) {
        return false;
      }
    }
  }
  return true;
};

//上传文件
var upload = function(src, dest, opts) {
  fs.stat(src, function(err, stats) {
    if (err) {
      console.error('fs.stat %s', err);
      ftp.end();
    }

    if (stats.isDirectory()) {
      ftp.mkdir(dest, true, function(err) {
        if (err) {
          console.error('tfx mkdir dest %s', err);
          ftp.end();
        }
      });

      fs.readdirSync(src).forEach(function(filename) {
        upload(src + '/' + filename, dest + '/' + filename, opts);
      })
    } else {
      //过滤指定文件
      if (canIncludeFile(src, opts.exclude)) {
        totalFileCount++;
        put(src, dest, function(rs) {
          transferredFileCount++;
          console.log('uploadding from ' + src + ' to ' + dest);
          emitter.emit('upload', opts);
        });
      } else {
        emitter.emit('upload', opts);
      }
    }
  });
};

module.exports = function(src, dest, opts) {
  return new Promise(function(resolve, reject) {
    ftp.connect({
      host: opts.host,
      user: opts.user,
      password: opts.password
    });

    ftp.on('ready', function(err) {
      if (err) {
        console.error('ftp ready %s', err);
        ftp.end();
        reject(err);
      }

      resolve();
    });
  }).then(function() {
    upload(src, dest, opts);
  });
};