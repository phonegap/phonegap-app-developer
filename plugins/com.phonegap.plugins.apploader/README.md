## AppLoader Phonegap Plugin

Downloads zip files, unzips them, and runs the contents in the Phonegap webview.

Mostly written by [Shazron Abdullah](https://github.com/shazron).

### Installation

	plugman install --platform ios --plugin https://github.com/wildabeast/phonegap-plugin-apploader.git --project ./IOSProject

### Usage

Fetch a zip file:

	navigator.apploader.fetch('https://mysite.com/phonegap/www.zip', successCallback, failureCallback);

Then launch it in the Phonegap webview:

	navigator.apploader.launch(failureCallback);

Full example:

	navigator.apploader.fetch('https://mysite.com/phonegap/www.zip', function() {

		navigator.apploader.launch(function() {
			console.log('failed to launch');
		}); 

	}, function() {
		console.log('failed to download');
	});