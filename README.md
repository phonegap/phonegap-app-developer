# The PhoneGap Application

> Coming soon to an app store near you!

## Build

### LESS / CSS

    $ npm install
    $ npm run less

### App

    $ npm install -g phonegap@3.2.0-0.17.1
    $ phonegap run <platform>

## Release: iOS

1. Increment the version in `www/config.xml`
1. Build the project with `phonegap build ios`
1. Open the Xcode project
1. Set the target as your device (top-left corner)
1. Select Project -> Archive
1. In the Organizer window
    1. Select the latest app archive
    1. Click Distribute
    1. Select the Ad Hoc provisioning profile
    1. Save the IPA to `res/release/ios/PhoneGap-x.x.x.ipa`
1. Upload the IPA in TestFlight
