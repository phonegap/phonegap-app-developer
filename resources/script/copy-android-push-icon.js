#!/usr/bin/env node

var fs = require('fs');

console.log('Running: Android push icon fix...');

// only run script when building for WP8
if (process.env['CORDOVA_PLATFORMS'] !== 'android') {
    console.log('Skipping: the platform is not Android');
    process.exit(0);
}

// copy in our custom splash screen image
var destPath = 'platforms/android/res/drawable-hdpi/pushicon.png';
var splashPath = 'resources/icon/android/pushicon.png';
fs.createReadStream(splashPath).pipe(fs.createWriteStream(destPath));
