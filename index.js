#!/usr/bin/env node

'use strict';

var program = require('commander');
var path = require('path');

var upload = require('./lib/upload');
var init = require('./lib/init');
var config = require('./lib/config');

var package_json = require('./package.json');

program
  .version(package_json.version)
  .option('-v --version', 'output the version number');

//上传操作
program
  .command('upload <src>')
  .description('upload static sources include js、css、img')
  .alias('u')
  .action(function(src, opts) {
    config.getConfig().then(function(config) {
      config = JSON.parse(config);
      upload(src, config.dest, config);
    });
});

program
  .command('init')
  .description('ftx init project, include config file and project boilerplate')
  .alias('i')
  .action(function(src, opts) {
    init(path.join(__dirname, 'template'), path.join(process.cwd(), 'app'));
});

//无效命令  
program
  .command('*')
  .action(function(cmd) {
    console.log('  tfx: "%s" is invalid, please see other available commands ', cmd);
    program.outputHelp();
});

program.parse(process.argv);