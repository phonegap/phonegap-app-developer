#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo "DIR is '$DIR'"
git clone https://github.com/phonegap/phonegap-app-developer-keys ../../phonegap-app-developer-keys
ls ../../resources/signing
cp -r ../../phonegap-app-developer-keys/keys/ios/ ../../resources/signing/ios
cat ../../resources/signing/ios/build-config.json
pwd
npm run -- release-ios