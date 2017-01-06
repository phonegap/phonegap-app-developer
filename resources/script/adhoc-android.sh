#!/usr/bin/env bash
set -eo pipefail

echo "Running: npm run build"
npm run build

echo "Running: setup-ad-hoc.js"
node ./resources/script/setup-ad-hoc.js

echo "Adding hockey app"
phonegap plugin add cordova-plugin-hockeyapp

echo "Running: phonegap build android"
phonegap build android --verbose --release --buildConfig=./resources/signing/android/ad-hoc/build-config.json

echo "Running: restore-config.js"
node ./resources/script/restore-config.js
