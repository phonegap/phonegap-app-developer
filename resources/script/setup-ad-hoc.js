/**
 * Setup an Ad-Hoc release.
 *
 * Ad-Hoc releases are used for nightly builds and use
 * a different ID.
 */

/*!
 * Module dependencies.
 */

var ConfigParser = require('cordova-common').ConfigParser,
    fs = require('fs-extra'),
    path = require('path');

/*!
 * Update config.xml for PhoneGap Nightly builds
 */

var projectRoot = require('app-root-path').path;
var configPath = path.join(projectRoot, 'config.xml');

fs.copy(configPath, path.join(projectRoot, 'config-backup.xml'), function(err) {
    if (err) throw err;

    var config = new ConfigParser(configPath);
    config.setPackageName('com.phonegap.app.adhoc');
    config.setName('PG Nightly');
    config.addElement('hook', {src : 'resources/script/add-hockeyapp.js', type: 'before_build'});
    config.addElement('hook', {src : 'resources/script/remove-hockeyapp.js', type: 'after_build'});
    config.write();
}) ;