'use strict';

var fs = require('fs');

var tfx = module.exports = {
  read: function(file) {
    if (fs.existsSync(file)) {
      var content = fs.readFileSync(file, 'utf-8');
      console.log(content);
    } else {
      console.log('file not found');
    }
  }
};