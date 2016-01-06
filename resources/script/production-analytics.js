#!/usr/bin/env node

var fs = require('fs');

console.log('Running: adding production analytics ID');

if (!(/release/).test(process.env.npm_lifecycle_event)) {
    console.log('Skipping: this is not a release build');
    return;
}

var analytics = 'www/js/analytic.js';
var devID = /UA-94271-34/;
var productionID = 'UA-94271-35';

// modify analytic.js to use production ID
fs.readFile(analytics, 'utf8', function(err, data) {
    if (err) {
        console.log('Error reading analytic.js');
        console.log('More info: <', err.message, '>');
        process.exit(1);
    }

    // insert production ID
    var result = '';
    if ((devID).test(data)) {
        result = data.replace(devID, productionID);
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
