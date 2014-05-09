#!/usr/bin/env node

//
// Parse the flag --test or --tests
//
if (/--test[s]?/.test(process.env.CORDOVA_CMDLINE)) {
    var fs = require('fs'),
        path = require('path');

    var dir = {
        www: path.join(process.cwd(), 'www'),
        test: path.join(process.cwd(), 'tests'),
        backup: path.join(process.cwd(), 'www-backup')
    };

    // replace the test config.xml with the app config.xml
    // we do this because we want to ensure our config is setup correctly.
    var config = {
        www: path.join(dir.www, 'config.xml'),
        test: path.join(dir.test, 'config.xml')
    };
    fs.createReadStream(config.www).pipe(fs.createWriteStream(config.test));

    // swap the test and www directories
    fs.renameSync(dir.www, dir.backup);
    fs.renameSync(dir.test, dir.www);
}
