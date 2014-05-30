#!/usr/bin/env node

//
// Parse the flag --test or --tests
//
if (/--test[s]?/.test(process.env.CORDOVA_CMDLINE)) {
    var fs = require('fs'),
        path = require('path');

    var dir = {
        www: path.join(process.cwd(), 'www'),
        test: path.join(process.cwd(), 'tests/www'),
        backup: path.join(process.cwd(), 'www-backup')
    };

    // update tests to load with out app-level config.xml
    updateTestSuite(dir);

    // swap the test and www directories
    fs.renameSync(dir.www, dir.backup);
    fs.renameSync(dir.test, dir.www);
}

//
// Update the Test Suite
//
function updateTestSuite(dir) {
    // 1. Update config.xml with app config.xml
    //
    // we do this because we want to ensure our config is setup correctly.
    var config = {
        www: path.join(dir.www, 'config.xml'),
        test: path.join(dir.test, 'config.xml')
    };

    // [#119] cannot use streams because of async issues on Windows
    fs.writeFileSync(config.test, fs.readFileSync(config.www));

    // 2. Hide Splash Screen after test suite loads
    //
    // we do this because the app-level config.xml disables auto-hiding of the
    // splash screen
    var filePath = path.join(dir.test, 'main.js'),
        data = fs.readFileSync(filePath, 'utf8');

    // Update tests/main.js to hide splash screen due to our config.xml setting
    var injectString = [
        '',
        '//',
        '// phonegap-app-developer support',
        '//',
        '',
        'document.addEventListener(\'deviceready\', function() {',
        '    navigator.splashscreen.hide();',
        '}, false);'
    ].join('\n');

    if (data.indexOf('// phonegap-app-developer support') < 0) {
        data += injectString;
        fs.writeFileSync(filePath, data, 'utf8');
    }

    // 3. Remove ?paramShouldBeIgnored from tests/cordova-incl.js
    //
    // The parameter causes WP8 to not load cordova.js
    filePath = path.join(dir.test, 'cordova-incl.js');
    data = fs.readFileSync(filePath, 'utf8');
    data = data.replace('?paramShouldBeIgnored', '');
    fs.writeFileSync(filePath, data, 'utf8');
}
