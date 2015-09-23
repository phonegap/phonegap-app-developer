#!/usr/bin/env node

var fs = require('fs');

var destPath = 'platforms/wp8/SplashScreenImage.jpg';
var splashPath = 'resources/splash/wp8/SplashScreenImage.jpg';

// copy in our custom splash screen image
fs.createReadStream(splashPath).pipe(fs.createWriteStream(destPath));

// find and replace line in WP splash screen plugin implementation
var splashscreenSrc = 'platforms/wp8/Plugins/cordova-plugin-splashscreen/SplashScreen.cs';
fs.readFile(splashscreenSrc, 'utf8', function(err, data) {
    if (err)
        return 0;

    if ((/return imageResource/).test(data)) {
        var result = data.replace(/return imageResource/, 'return null');
    } else {
        console.log('"copy-wp8-splash.js" needs to updated because of changes to cordova-plugin-splashscreen');
        return 1;
    }

    fs.writeFile(splashscreenSrc, result, 'utf8', function(err) {
        if (err) {
            console.log('Error while writting to SplashScreen.cs to disable splash screen on WP8');
            console.log('More info: <', err.message, '>');
            return 1;
        }
    });
});
