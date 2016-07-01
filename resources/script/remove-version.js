#!/usr/bin/env node

var fs = require('fs'),
  path = require('path');

console.log('Running: Removing version and build info from index.html');

/*jshint multistr: true */
var indexFilePath = path.join(__dirname, '../../www/index.html');

var fsError = function(err) {
  console.log('Error reading file');
  console.log('More info: <', err.message, '>');
  process.exit(1);
}

var versionText = '<!-- %PHONEGAP_APP_VERSION_START% -->' + '<!-- %PHONEGAP_APP_VERSION_END% -->';

fs.readFile(indexFilePath, 'utf-8', function(err, indexData) {
  if(err) {
    fsError(err)
  }
  
  var updatedIndex = indexData.replace(/<!-- %PHONEGAP_APP_VERSION_START% -->([\s\S]*?)<!-- %PHONEGAP_APP_VERSION_END% -->/, '%PHONEGAP_APP_VERSION%');
  
  fs.writeFile(indexFilePath, updatedIndex,'utf-8', function(err) {
    if(err) {
      fsError(err)
    }
  });
});
