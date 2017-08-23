#!/usr/bin/env node

var fs = require('fs');

console.log('Running: Applying HockeyApp App ID for current platform');

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
        if ((/android/).test(process.env.npm_lifecycle_event)) {
            hockeyApp = hockeyApp.replace(/HOCKEY_APP_ID/, '\'6591d00aa8fb4dfdb2cdca79f1d79650\'');
        } else if ((/ios/).test(process.env.npm_lifecycle_event)) {
            hockeyApp = hockeyApp.replace(/HOCKEY_APP_ID/, '\'ab4f4cd2ab5045708c0b4ee0b9e2fe39\'');
        } else {
            hockeyApp = '%HOCKEYAPP';
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
