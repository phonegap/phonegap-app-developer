#!/usr/bin/env node

var fs = require('fs');

console.log('Running: restoring analytics ID');

if (!(/release/).test(process.env.npm_lifecycle_event)) {
    console.log('Skipping: this is not a release build');
    return;
}

var analytics = 'www/js/analytic.js';
var devID = 'UA-94271-34';
var productionID = /UA-94271-35/;

// modifying analytic.js to use dev ID
fs.readFile(analytics, 'utf8', function(err, data) {
    if (err) {
        console.log('Error reading analytic.js');
        console.log('More info: <', err.message, '>');
        process.exit(1);
    }

    // insert dev ID
    var result = '';
    if ((productionID).test(data)) {
        result = data.replace(productionID, devID);
    }

    // write back to analytic.js
    fs.writeFile(analytics, result, 'utf8', function(err) {
        if (err) {
            console.log('Error writing to analytic.js');
            console.log('More info: <', err.message, '>');
            process.exit(1);
        }
    });
});
