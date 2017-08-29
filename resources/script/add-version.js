#!/usr/bin/env node

module.exports = function(ctx) {
  console.log('Running: Adding version and build info to index.html');

  var fs = ctx.requireCordovaModule('fs'),
      path = ctx.requireCordovaModule('path'),
      deferral = ctx.requireCordovaModule('q').defer(),
      ConfigParser = ctx.requireCordovaModule('cordova-common').ConfigParser;

  var configPath = path.join(ctx.opts.projectRoot, 'config.xml');
  var indexPath = path.join(ctx.opts.projectRoot, 'www/index.html');
  
  var config = new ConfigParser(configPath);
  var version = config.version();
  var id = config.packageName();

  var versionText = '<!-- %PHONEGAP_APP_VERSION_START% -->' + id + ' : ' + version + '<!-- %PHONEGAP_APP_VERSION_END% -->';

  fs.readFile(indexPath, 'utf-8', function(err, indexData) {
    if(err) {
      deferral.reject(err);
    }
    
    var updatedIndex = indexData.replace(/%PHONEGAP_APP_VERSION%/, versionText);
    
    fs.writeFile(indexPath, updatedIndex,'utf-8', function(err) {
      if(err) {
        deferral.reject(err);
      }
      deferral.resolve();
    });
  });

  return deferral.promise;
};