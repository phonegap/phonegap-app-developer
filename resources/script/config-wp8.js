/**
 * Fix WMAppManifest.xml for WP8.
 *
 * A cross-platform node script to fix some particular values
 * generated in WP8 after a build. 
 */

/*!
 * Module dependencies.
 */

 var fs = require('fs-extra'),
     path = require('path'),
     xml2js = require('xml2js');

/*!
 * Create the Cordova directories that are ignored by version control.
 */

var projectRoot = require('app-root-path').path;
var wmappPath = path.join(projectRoot, 'platforms/wp8/Properties/WMAppManifest.xml');
var parseString = xml2js.parseString;

var overwriteWMAppManifest = function(xml) {
	// delete then write
	fs.unlink(wmappPath, function(){
		fs.writeFile(wmappPath, xml.toString());
	})
}

var wmapp_file = fs.readFile(wmappPath, function(err, data) {
			parseString(data, function(err, result) {
					// fix App Title
					result.Deployment.App[0]['$'].Title = 'PhoneGap Developer'

					// fix productID
					result.Deployment.App[0]['$'].ProductID = '{9E0C4412-1A96-4B19-A3F6-9D0CD6906F71}';

					// fix TokenID
					result.Deployment.App[0].Tokens[0].PrimaryToken[0]['$'].TokenID = 'PhoneGap';

					var builder = new xml2js.Builder();
					var xmlOut = builder.buildObject(result);
					overwriteWMAppManifest(xmlOut);
				});
			});

