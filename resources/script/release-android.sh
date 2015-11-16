#!/usr/bin/env bash

npm run build:setup
phonegap build android --verbose --release --buildConfig=./resources/signing/android/build-config.json
