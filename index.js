#!/usr/bin/env node

'use strict';

var program = require('commander');

var upload = require('./lib/upload');
var config = Object.create(require('./config'));

program.version(config.version);

//上传操作
program
  .command('upload <src>')
  .alias('u')
  .description('upload static sources include js、css、img')
  .action(function(src, opts) {
    upload(src, config.dest, config);
});

//未知命令提示
program
  .command('*')
  .description('tfx invalid command')
  .action(function (cmd) {
    console.log('%s is invalid, please enter tfx -h list command', cmd);
    program.outputHelp();
});

program.parse(process.argv);