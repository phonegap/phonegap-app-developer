/**
 * Restore config.xml after an Ad-Hoc release.
 *
 * Restores config.xml to original settings.
 */

/*!
 * Module dependencies.
 */

 var fs = require('fs-extra'),
     path = require('path');

/*!
 * Create the Cordova directories that are ignored by version control.
 */

var projectRoot = require('app-root-path').path;
var configPath = path.join(projectRoot, 'config.xml');
var configBackupPath = path.join(projectRoot, 'config-backup.xml');

fs.copy(configBackupPath, configPath, {clobber: true}, function(err) {
    if (err) return;

    fs.remove(configBackupPath, function(err) {
        if (err) return;
    });
}) ;
