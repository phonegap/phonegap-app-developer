#!/usr/bin/env bash

npm run setup
phonegap build ios --verbose --device --release --buildConfig=./resources/signing/ios/build-config.json
