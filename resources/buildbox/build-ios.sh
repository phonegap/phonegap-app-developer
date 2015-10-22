#!/usr/bin/env bash
git clone https://github.com/phonegap/phonegap-app-developer-keys
cp -r ./phonegap-app-developer-keys/keys/ios/ ./resources/signing/ios
cat ./resources/signing/ios/build-config.json
npm run -- release-ios