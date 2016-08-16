#!/usr/bin/env node

'use strict';

var program = require('commander');

var upload = require('./lib/upload');
var config = Object.create(require('./config'));
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
    upload(src, config.dest, config);
});

//无效命令  
program
  .command('*')
  .action(function(cmd) {
    console.log('  tfx: "%s" is invalid, please see other available commands ', cmd);
    program.outputHelp();
});

program.parse(process.argv);