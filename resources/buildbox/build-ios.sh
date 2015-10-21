#!/usr/bin/env bash
git clone https://github.com/phonegap/phonegap-app-developer-keys.git
ls resources/signing/ios
ln -s phonegap-app-developer-keys/keys/ios resources/signing/ios
npm run -- release-ios
