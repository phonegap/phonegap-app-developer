#!/usr/bin/env node

var npm = require('npm');

console.log('compiling LESS files');

npm.load(function(e) {
    if (e) throw e;
    npm.commands.run(['less'], function(e, data) {
        if (e) throw e;
    });
});
