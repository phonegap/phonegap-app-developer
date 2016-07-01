#!/usr/bin/env node

var fs = require('fs'),
  path = require('path'),
  xml2js = require('xml2js');

console.log('Running: Adding version and build info to index.html');

/*jshint multistr: true */
var configFilePath = path.join(__dirname, '../../config.xml');
var indexFilePath = path.join(__dirname, '../../www/index.html');
var parseString = xml2js.parseString;

var fsError = function(err) {
  console.log('Error reading file');
  console.log('More info: <', err.message, '>');
  process.exit(1);
}

fs.readFile(configFilePath, 'utf-8', function(err, data) {
  if (err) {
    fsError(err)
  }

  parseString(data, function(err, result) {
    if(err) {
      fsError(err)
    }

    var version = result.widget.$.version;
    var name = result.widget.name[0];
    var versionText = '<!-- %PHONEGAP_APP_VERSION_START% -->' + version + ' ' + name + '<!-- %PHONEGAP_APP_VERSION_END% -->';
    
    fs.readFile(indexFilePath, 'utf-8', function(err, indexData) {
      if(err) {
        fsError(err)
      }
      
      var updatedIndex = indexData.replace(/%PHONEGAP_APP_VERSION%/, versionText);
      
      fs.writeFile(indexFilePath, updatedIndex,'utf-8', function(err) {
        if(err) {
          fsError(err)
        }
      });
    });
  });
});