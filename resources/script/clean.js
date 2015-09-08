/**
 * Clean a Project's Directories.
 *
 * A cross-platform node script to clean a project to prepare for a
 * fresh Cordova build.
 */

/*!
 * Module dependencies.
 */

 var fs = require('fs-extra'),
     path = require('path');

/*!
 * Remove the Cordova directories that are are considered build artifacts.
 */

var projectRoot = require('app-root-path').path;

fs.removeSync(path.join(projectRoot, 'platforms/'));
fs.removeSync(path.join(projectRoot, 'plugins/'));