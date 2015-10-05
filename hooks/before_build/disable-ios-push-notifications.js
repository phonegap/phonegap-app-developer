#!/usr/bin/env node

var fs = require('fs');

console.log('Running: Disabling iOS push notifications...');

// only run script when building for iOS
if (process.env['CORDOVA_PLATFORMS'] !== 'ios') {
    console.log('Skipping: the platform is not iOS');
    process.exit(0);
}

var config = 'platforms/ios/cordova/build.xcconfig';
var newSetting = 'GCC_PREPROCESSOR_DEFINITIONS = $(inherited) DISABLE_PUSH_NOTIFICATIONS=1';

// disable push notifications by adding setting to Xcode build config
fs.appendFile(config, newSetting, function(err) {
    if (err) {
        console.log('Error appending to Xcode build config');
        console.log('More info: <', err.message, '>');
        process.exit(1);
    }
});
