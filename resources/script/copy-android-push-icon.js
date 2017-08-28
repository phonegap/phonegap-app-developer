#!/usr/bin/env node

console.log('Running: Android push icon fix...');

module.exports = function(context) {
    if (context.opts.platforms.indexOf('android') < 0) {
        console.log('Skipping: the platform is not Android');
        return;
    }

    var fs = context.requireCordovaModule('fs'),
        path = context.requireCordovaModule('path'),
        deferral = context.requireCordovaModule('q').defer();

    var destPath = path.join(context.opts.projectRoot, 'platforms/android/res/drawable-hdpi/pushicon.png');
    var splashPath = path.join(context.opts.projectRoot, 'resources/icon/android/pushicon.png');

    var readStream = fs.createReadStream(splashPath).pipe(fs.createWriteStream(destPath));

    readStream.on('error', function(err) {
        deferral.reject(err);
    });

    readStream.on('close', function() {
        deferral.resolve();
    });
    
    return deferral.promise;
};