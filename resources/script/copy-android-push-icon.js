#!/usr/bin/env node

module.exports = function(ctx) {

    console.log('Running: Android push icon fix...');

    if (ctx.opts.platforms.indexOf('android') < 0) {
        console.log('Skipping: the platform is not Android');
        return;
    }

    var fs = require('fs'),
        path = require('path'),
        deferral = require('q').defer();

    var destPath = path.join(ctx.opts.projectRoot, 'platforms/android/res/drawable-hdpi/pushicon.png');
    var splashPath = path.join(ctx.opts.projectRoot, 'resources/icon/android/pushicon.png');

    var readStream = fs.createReadStream(splashPath).pipe(fs.createWriteStream(destPath));

    readStream.on('error', function(err) {
        deferral.reject(err);
    });

    readStream.on('close', function() {
        deferral.resolve();
    });
    
    return deferral.promise;
};