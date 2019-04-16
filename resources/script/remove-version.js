#!/usr/bin/env node

module.exports = function(ctx) {
  console.log('Running: Removing version and build info from index.html');

  var fs = require('fs'),
      path = require('path'),
      deferral = require('q').defer();

  var indexPath = path.join(ctx.opts.projectRoot, 'www/index.html');
  var versionText = '<!-- %PHONEGAP_APP_VERSION_START% -->' + '<!-- %PHONEGAP_APP_VERSION_END% -->';

  fs.readFile(indexPath, 'utf-8', function(err, indexData) {
    if(err) {
      deferral.reject(err);
    }

    var updatedIndex = indexData.replace(/<!-- %PHONEGAP_APP_VERSION_START% -->([\s\S]*?)<!-- %PHONEGAP_APP_VERSION_END% -->/, '%PHONEGAP_APP_VERSION%');
    
    fs.writeFile(indexPath, updatedIndex,'utf-8', function(err) {
      if(err) {
        deferral.reject(err);
      }
      deferral.resolve();
    });
  });

  return deferral.promise;
};
