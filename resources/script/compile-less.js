#!/usr/bin/env node

var npmRun = require('npm-run');

console.log('compiling LESS files');

npmRun('npm run build:less', function(e, stdout, stderr) {
    if (e) {
        console.error('stderr:', stderr);
        throw e;
    }
});
