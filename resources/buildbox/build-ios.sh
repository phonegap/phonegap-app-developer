#!/usr/bin/env bash
pwd
rm -rf phonegap-app-developer-keys
ls ./resources/signing/ios
git clone https://github.com/phonegap/phonegap-app-developer-keys
cp -r ./phonegap-app-developer-keys/keys/ios/ ./resources/signing/ios
cat ./resources/signing/ios/build-config.json
npm run -- release-ios