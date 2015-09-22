# PhoneGap Developer App [![Build Status][travis-ci-img]][travis-ci-url] [![bitHound Score][bithound-img]][bithound-url]

> Available in an app store near you!

## Overview

The PhoneGap Developer app is a testing utility for web developers and designers
using the PhoneGap framework. After installing the PhoneGap Developer app you
can connect to your PhoneGap desktop app to instantly view and test your project
on the device.

For more information, see [Developer App Reference Guide][3] on the PhoneGap Docs.

## Download

- [Android Google Play][1]
- [Apple AppStore][2]
- [Windows Phone store][7]

## Documentation

- [Developer App Reference Guide](http://docs.phonegap.com/references/developer-app/)
- [FAQ](https://github.com/phonegap/phonegap-app-developer/blob/master/FAQ.md)

## Development

### Compile and Run the Application

PhoneGap has been added as a dependency so you can update to a specific version
by changing the version in `package.json`. We also use `npm run` scripts to compile
and run the application. This allows the app's `platforms/` and `plugins/` directories
to be removed and rebuilt each time, ensuring a consistent build using the correct
Cordova, platform, and plugin versions.

    $ npm install
    $ npm install -g phonegap@3.4.0-0.20.0
    $ npm run -- phonegap run ios
    $ npm run -- phonegap run android

For developers wishing to use the platform SDKs (Xcode, Eclipse, Visual Studio),
please build once with the CLI to correctly populate the platform assets:

    $ npm run -- phonegap build <platform>

Due to a Windows Phone npm scripts bug, the `--` does not work. Therefore we have created
run script that will build Windows Phone 8 so it can run in Visual Studio.

    $ npm run phonegap-wp8

### Running the Tests

There are two types of test targets: the local app and served app.

#### Test the Local Application

The local application is the PhoneGap Developer App. To test the local
functionality, we build the application with mobile-spec. This allows us to
ensure that each plugin was correctly installed. Eventually, we would like
to add functional tests for the app logic.

You can run the local tests with:

    $ npm run -- phonegap run android --test
    $ npm run -- phonegap run ios --test

Again for Windows Phone, we have a run script that will build the app so it can run in
Visual Studio.

    $ npm run phonegap-wp8-test

#### Test the Served Application

The served application is the app served by the CLI. To test the server
functionality, we serve an instance of mobile-spec. We can then use the manual
and automatic tests to ensure that the server provided the correct version of
Cordova, the plugins, and the navigation logic.

You can run the served tests with:

    $ cd tests/
    $ phonegap serve
    # now connect with the latest build of the PG App

### Updating the Tests

It's as easy as a copy and paste.

1. Copy all content of `cordova-mobile-spec`
2. Paste the content into `tests/www`

On your first run of the tests, you may see some modified files. This is expected
because the test runner invoked by `--test` modifies certain files to support
our app's configuration.

### Commits, Tags, and Releases

See the [CONTRIBUTING.md][6] file for details.

[1]: https://play.google.com/store/apps/details?id=com.adobe.phonegap.app
[2]: https://itunes.apple.com/app/id843536693
[3]: http://docs.phonegap.com/references/developer-app/
[4]: http://github.com/phonegap/connect-phonegap
[5]: http://github.com/phonegap/phonegap-cli
[6]: https://github.com/phonegap/phonegap-app-developer/blob/master/CONTRIBUTING.md
[7]: http://www.windowsphone.com/en-us/store/app/phonegap-developer/5c6a2d1e-4fad-4bf8-aaf7-71380cc84fe3
[travis-ci-img]: https://travis-ci.org/phonegap/phonegap-app-developer.svg?branch=master
[travis-ci-url]: http://travis-ci.org/phonegap/phonegap-app-developer
[bithound-img]: https://www.bithound.io/github/phonegap/phonegap-app-developer/badges/score.svg
[bithound-url]: https://www.bithound.io/github/phonegap/phonegap-app-developer

