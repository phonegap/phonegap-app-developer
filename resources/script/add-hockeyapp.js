#!/usr/bin/env node

var fs = require('fs');

console.log('Running: Applying HockeyApp App ID for current platform');

if (!(/ad-hoc/).test(process.env.npm_lifecycle_event)) {
    console.log('Skipping: this is a release build');
    return;
}

/*jshint multistr: true */
var hockeyApp = "%HOCKEYAPP \n \
       hockeyapp.start(function() { \n \
           hockeyapp.checkForUpdate(function() { \n \
           }, function() { \n \
               alert('failed to get update'); \n \
           }); \n \
       }, function() { \n \
       }, HOCKEY_APP_ID); \n \
       // %ENDHOCKEYAPP";

// modify app.js according to current platform
var appDest = 'www/js/app.js';
fs.readFile(appDest, 'utf8', function(err, data) {
    if (err) {
        console.log('Error reading app.js');
        console.log('More info: <', err.message, '>');
        process.exit(1);
    }

    // insert HockeyApp App ID based on platform
    var result = '';
    if ((/%HOCKEYAPP/).test(data)) {
        if (process.env.CORDOVA_PLATFORMS == 'android') {
            hockeyApp = hockeyApp.replace(/HOCKEY_APP_ID/, '\'1a16c6d33328462da1b4bdf0d1854da0\'');
        } else if (process.env.CORDOVA_PLATFORMS == 'ios') {
            hockeyApp = hockeyApp.replace(/HOCKEY_APP_ID/, '\'1ddb1dd3bae74b83b1e04752b04b5c55\'');
        }

        result = data.replace(/%HOCKEYAPP/, hockeyApp);
    } else {
        console.log('Exiting: no HockeyApp App ID to replace');
        process.exit(1);
    }

    // write back to app.js
    fs.writeFile(appDest, result, 'utf8', function(err) {
        if (err) {
            console.log('Error while writing to app.js');
            console.log('More info: <', err.message, '>');
            process.exit(1);
        }
    });
});
