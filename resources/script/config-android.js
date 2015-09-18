/**
 * Fix project.properties for Android
 *
 * A cross-platform node script to fix some particular values
 * generated in Android after a build. 
 */

/*!
 * Module dependencies.
 */

 var fs = require('fs-extra'),
     path = require('path');

/*!
 * Find Android's project.properties file and add in the key information
 */

var projectRoot = require('app-root-path').path;
var androidProjectPropPath = path.join(projectRoot, 'platforms/android/project.properties');

var text = 'target=android-21\nandroid.library.reference.1=CordovaLib\nkey.store=../../resources/signing/android/phonegap-app-key.keystore\nkey.alias=phonegap';

// delete then write
fs.unlink(androidProjectPropPath, function(){
    fs.writeFile(androidProjectPropPath, text);
});