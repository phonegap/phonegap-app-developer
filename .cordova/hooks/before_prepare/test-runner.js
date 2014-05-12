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
    fs.writeFileSync(config.test, fs.readFileSync(config.www));

    // update tests to support our app config.xml
    updateTestSuite(dir.test);

    // swap the test and www directories
    fs.renameSync(dir.www, dir.backup);
    fs.renameSync(dir.test, dir.www);
}

//
// Update the Test Suite
//
function updateTestSuite(testpath) {
    var filepath = path.join(testpath, 'main.js'),
        data = fs.readFileSync(filepath, 'utf8');

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


    if (data.indexOf(injectString) < 0) {
        data += injectString;
        fs.writeFileSync(filepath, data, 'utf8');
    }
}
