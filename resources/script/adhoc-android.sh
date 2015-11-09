#!/usr/bin/env bash

npm run build:setup:adhoc
phonegap plugin add cordova-plugin-hockeyapp
phonegap build android --verbose --release --buildConfig=./resources/signing/android/ad-hoc/build-config.json
npm run build:config:restore
