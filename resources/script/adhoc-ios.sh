#!/usr/bin/env bash
echo "Running: npm run build"
npm run build
echo "Adding hockey app"
phonegap plugin add cordova-plugin-hockeyapp
echo "Running: phonegap build ios"
phonegap build ios --verbose --device --debug --buildConfig=./resources/signing/ios/build-config.json
