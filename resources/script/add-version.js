#!/usr/bin/env node

module.exports = function(ctx) {
    console.log('Running: Adding version and build info to index.html');

    var fs = ctx.requireCordovaModule('fs'),
        path = ctx.requireCordovaModule('path'),
        deferral = ctx.requireCordovaModule('q').defer();

    var destPath = path.join(ctx.opts.projectRoot, 'platforms/android/res/drawable-hdpi/pushicon.png');
    var splashPath = path.join(ctx.opts.projectRoot, 'resources/icon/android/pushicon.png');

    var readStream = fs.createReadStream(splashPath).pipe(fs.createWriteStream(destPath));

    readStream.on('error', function(err) {
        deferral.reject(err);
    });

    readStream.on('close', function() {
        deferral.resolve();
    });
    
    return deferral.promise;
} ;

var fs = require('fs'),
  path = require('path'),
  xml2js = require('xml2js');



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
    var id = result.widget.$.id;
    var versionText = '<!-- %PHONEGAP_APP_VERSION_START% -->' + id + ' : ' + version + '<!-- %PHONEGAP_APP_VERSION_END% -->';
    
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