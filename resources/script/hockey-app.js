/**
 * Upload new build to HockeyApp
 *
 * Take last build and upload it to HockeyApp's android
 * project.
 *
 * Variables passed in: HockeyApp Token, HockeyApp App ID, Commit SHA1
 */

/*!
 * Module dependencies.
 */

 var fs = require('fs-extra'),
     path = require('path'),
     request = require('request');

/*!
 * Upload to HockeyApp
 */

var projectRoot = require('app-root-path').path;

var buildPath;
if (process.env.BUILDKITE) {
    buildPath = path.join(projectRoot, 'platforms', 'ios', 'build', 'device', 'PG Nightly.ipa');
} else if (process.env.CIRCLECI) {
    buildPath = path.join(projectRoot, 'platforms', 'android', 'build', 'outputs', 'apk', 'android-release.apk');
}

// parameters passed to HockeyApp
var formData = {
    ipa: fs.createReadStream(buildPath),
    mandatory: 1,
    notes: 'GitHub Commit: ' + process.argv[4],
    notes_types: 0,
    notify: 1,
    status: 2
};

// form the HTTP request
var options = {
    formData: formData,
    headers: {
        'X-HockeyAppToken': process.argv[2]
    },
    url: 'https://rink.hockeyapp.net/api/2/apps/' + process.argv[3] + '/app_versions/upload'
};

request.post(options, function(err, response, body) {
    if (err) {
        console.log('Error uploading to HockeyApp');
        console.log('More info: <', err.message, '>');
        return;
    }
});
