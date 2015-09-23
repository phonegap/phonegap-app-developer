#!/usr/bin/env node

var fs = require('fs');

var destPath = 'platforms/wp8/SplashScreenImage.jpg';
var splashPath = 'resources/splash/wp8/SplashScreenImage.jpg';

// copy in our custom splash screen image
fs.createReadStream(splashPath).pipe(fs.createWriteStream(destPath));

// disable the splash screen from loading its own splash image.
// this prevents a quick flicker between the native splash screen and the fake splash screen
// displayed by the Cordova splash screen plugin.
// see: https://github.com/phonegap/phonegap-app-developer/issues/349#issuecomment-141577196
var splashscreenSrc = 'platforms/wp8/Plugins/cordova-plugin-splashscreen/SplashScreen.cs';
fs.readFile(splashscreenSrc, 'utf8', function(err, data) {
    if (err) {
        if (process.env['CORDOVA_PLATFORMS'] == 'wp8') {
            console.log('Error reading the SplashScreen.cs file for WP8');
            console.log('More info: <', err.message, '>');
            process.exit(1);
        }

        process.exit(0);
    }

    if ((/return imageResource/).test(data)) {
        var result = data.replace(/return imageResource/, 'return null');
    } else {
        console.log('"copy-wp8-splash.js" needs to updated because of changes to cordova-plugin-splashscreen');
        process.exit(1);
    }

    fs.writeFile(splashscreenSrc, result, 'utf8', function(err) {
        if (err) {
            console.log('Error while writting to SplashScreen.cs to disable splash screen on WP8');
            console.log('More info: <', err.message, '>');
            process.exit(1);
        }
    });
});
