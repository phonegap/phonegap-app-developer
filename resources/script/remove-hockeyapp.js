#!/usr/bin/env node

module.exports = function(ctx) {

    console.log('Running: Removing HockeyApp from app.js');

    var fs = require('fs'),
        path = require('path'),
        deferral = require('q').defer();

    // modify app.js according to current platform
    var appDest = path.join(ctx.opts.projectRoot, 'www/js/app.js');
        fs.readFile(appDest, 'utf8', function(err, data) {
            if (err) {
                console.log('Error reading app.js');
                console.log('More info: <', err.message, '>');
                deferral.reject(err);
            }

        // delete hockeyapp code from app.js
        var result = '';
        if ((/%HOCKEYAPP([\s\S]*?)(%ENDHOCKEYAPP)/).test(data)) {
            result = data.replace(/%HOCKEYAPP([\s\S]*?)(%ENDHOCKEYAPP)/, '%HOCKEYAPP');
        } else {
            console.log('Exiting: no HockeyApp code to remove');
            deferral.resolve();
        }

        // write back to app.js
        fs.writeFile(appDest, result, 'utf8', function(err) {
            if (err) {
                console.log('Error while writting to app.js');
                console.log('More info: <', err.message, '>');
                deferral.reject(err);
            }

            deferral.resolve();
        });
    });

    return deferral.promise;
};