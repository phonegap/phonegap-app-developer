#!/usr/bin/env bash

if [ "$CIRCLECI" != true ]; then
    echo 'Skipping: build system is not CircleCI'
    exit
fi

if [ "$(git rev-parse HEAD)" != "$(git rev-parse $(git describe --abbrev=0 --tags))" ]; then
    APKLOCATION=platforms/android/build/outputs/apk/android-debug.apk
else
    APKLOCATION=platforms/android/build/outputs/apk/android-release.apk
fi

aws configure set aws_access_key_id $AWSACCESSKEY
aws configure set aws_secret_access_key $AWSSECRETKEY
aws configure set default.region us-east-1
aws configure set default.output json

aws s3 cp $APKLOCATION s3://ci.phonegap.com/phonegap-app-developer/android/Phonegap-$CIRCLE_SHA1.apk
