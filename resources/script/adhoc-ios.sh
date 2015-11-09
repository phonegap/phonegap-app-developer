#!/usr/bin/env bash

npm run build:setup:adhoc
phonegap plugin add cordova-plugin-hockeyapp
phonegap build ios --verbose --device --debug --buildConfig=./resources/signing/ios/build-config.json
npm run build:config:restore
