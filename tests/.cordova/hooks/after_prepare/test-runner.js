#!/usr/bin/env node

if (/--test[s]?/.test(process.env.CORDOVA_CMDLINE)) {
    var fs = require('fs'),
        path = require('path');

    var dir = {
        www: path.join(process.cwd(), 'www'),
        test: path.join(process.cwd(), 'tests/www'),
        backup: path.join(process.cwd(), 'www-backup')
    };

    // swap back the test and www directories
    fs.renameSync(dir.www, dir.test);
    fs.renameSync(dir.backup, dir.www);
}
