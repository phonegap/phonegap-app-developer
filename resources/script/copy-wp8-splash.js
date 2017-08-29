#!/usr/bin/env node

module.exports = function(ctx) {

    console.log('Running: Windows Phone splash screen flicker fix...');

    if (ctx.opts.platforms.indexOf('wp8') < 0) {
        console.log('Skipping: the platform is not WP8');
        return;
    }

    var fs = ctx.requireCordovaModule('fs'),
        path = ctx.requireCordovaModule('path'),
        deferral = ctx.requireCordovaModule('q').defer();

    var destPath = path.join(ctx.opts.projectRoot, 'platforms/wp8/SplashScreenImage.jpg');
    var splashPath = path.join(ctx.opts.projectRoot, 'resources/splash/wp8/SplashScreenImage.jpg');

    var readStream = fs.createReadStream(splashPath).pipe(fs.createWriteStream(destPath));

    readStream.on('error', function(err) {
        deferral.reject(err);
    });

    // disable the splash screen from loading its own splash image.
    // this prevents a quick flicker between the native splash screen and the fake splash screen
    // displayed by the Cordova splash screen plugin.
    // see: https://github.com/phonegap/phonegap-app-developer/issues/349#issuecomment-141577196
    var splashscreenSrc = path.join(ctx.opts.projectRoot, 'platforms/wp8/Plugins/cordova-plugin-splashscreen/SplashScreen.cs');
    fs.readFile(splashscreenSrc, 'utf8', function(err, data) {
        if (err) {
            console.log('Error reading the SplashScreen.cs file for WP8');
            console.log('More info: <', err.message, '>');
            deferral.reject(err);
        }

        var result = '';
        if ((/return imageResource/).test(data)) {
            result = data.replace(/return imageResource/, 'return null');
        } else {
            console.log('"copy-wp8-splash.js" needs to updated because of changes to cordova-plugin-splashscreen');
            deferral.reject(err);
        }

        fs.writeFile(splashscreenSrc, result, 'utf8', function(err) {
            if (err) {
                console.log('Error while writting to SplashScreen.cs to disable splash screen on WP8');
                console.log('More info: <', err.message, '>');
                deferral.reject(err);
            }
        });
        deferral.resolve();
    });

    return deferral.promise;
};