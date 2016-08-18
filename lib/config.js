/**
 * @description 读取配置
 * @time 2016.8.17 17.22
 */
'use strict';

var fs = require('fs');
var path = require('path');

//配置文件名称
var configFileName = 'config.json';

var getConfig = function() {
  return new Promise(function(resolve, reject) {
    var cwd = process.cwd();
    var configPath = path.join(cwd, configFileName);
    var config = null;

    try {
      fs.accessSync(configPath);
      fs.createReadStream(path.join(cwd, configFileName))
        .on('data', function(chunk) {
          var content = new Buffer(chunk);
          config = content.toString();
        })
        .on('end', function() {
          resolve(config);
        })
    } catch(e) {
      console.log('No ' + configFileName + ' found, please create ' + configFileName);
    }
  });
};

//tfx配置信息
//todo:只需提取部分配置，用于自定义
var configContent = {
  //上传目录
  dest: 'static.itiancai.com',
  //服务器ip
  host: 'host',
  //ftp账户名
  user: 'ftp_user',
  //ftp密码
  password: 'ftp_password',
  //需过滤的文件
  exclude: []
};

//创建tfx配置文件
var createConfigFile = function() {
  var cwd = process.cwd();
  fs.stat(path.join(cwd, configFileName), function(err, stats) {
    //不存在配置文件
    if (!stats) {
      fs.writeFile(path.join(cwd, configFileName), JSON.stringify(configContent, null ,'\t'), function(error) {
        if (error) console.log('tfx create ' + configFileName + 'failed')
      })
    }
  });
};

var init = function() {
  createConfigFile();
};

exports.init = init;

exports.getConfig = getConfig;