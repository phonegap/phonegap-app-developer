# Phonegap Build Oauth Plugin

Use this plugin in a PhoneGap / Cordova application to authenticate users via Oauth on Phonegap Build, and obtain an access token which can be used with the [PhoneGap Build Developer API](http://docs.build.phonegap.com/en_US/developer_api_api.md.html). 

### Supported Platforms

iOS only so far.

### Installation

	plugman install --platform ios --project /path/to/myproject --plugin https://github.com/wildabeast/phonegap-build-oauth-plugin.git --var CLIENT_ID=5tg33it CLIENT_SECRET=93htf93hr

A ```CLIENT_ID``` and ```CLIENT_SECRET``` can be obtained by [registering your application on Phonegap Build](http://docs.build.phonegap.com/en_US/developer_api_oauth.md.html).

### Usage

	PhonegapBuildOauth.login(username, password, successCallback, failureCallback);

Example:

	PhonegapBuildOauth.login("wildabeast@github.com", "password", function(r) {
		console.log('Authenticated successfully, access token is ' + r.access_token);
	}, function(r) {
		console.log('Failed to authenticate, response code was ', r.code);
	});