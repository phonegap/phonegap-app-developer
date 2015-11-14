#!/usr/bin/env bash

if [ "$(git rev-parse HEAD)" != "$(git rev-parse $(git describe --abbrev=0 --tags))" ]; then
    echo "Building adhoc release"
    npm run adhoc-android
else
    echo "Building Appstore release"
    npm run release-android
fi