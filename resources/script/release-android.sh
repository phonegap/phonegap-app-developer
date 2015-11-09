#!/usr/bin/env bash

npm run setup
phonegap build android --verbose --release --buildConfig=./resources/signing/android/build-config.json
