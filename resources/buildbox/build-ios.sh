#!/usr/bin/env bash
git clone https://github.com/phonegap/phonegap-app-developer-keys.git
ln -s phonegap-app-developer-keys/keys/ios ./resources/signing/ios
ls
ls ./resources
ls resources
npm run -- release-ios
