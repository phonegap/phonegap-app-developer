/**
 * Create Cordova Directories.
 *
 * A cross-platform node script to create the Cordova directories
 * that are ignored by version control.
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

fs.mkdirsSync(path.join(projectRoot, 'hooks/'));
fs.mkdirsSync(path.join(projectRoot, 'platforms/'));
fs.mkdirsSync(path.join(projectRoot, 'plugins/'));