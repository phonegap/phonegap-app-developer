#!/usr/bin/env bash

if [ "$CIRCLECI" != true ]; then
    echo 'Skipping: build system is not CircleCI'
    exit
fi

debug="platforms/android/build/outputs/apk/android-debug.apk"
release="platforms/android/build/outputs/apk/android-release.apk"

if [ -e "$debug" ]; then
	APKLOCATION="$debug"
elif [ -e "$release" ]; then
	APKLOCATION="$release"
else
	echo 'Error: Unable to find android apk file'
	exit 1
fi

aws configure set aws_access_key_id $AWSACCESSKEY
aws configure set aws_secret_access_key $AWSSECRETKEY
aws configure set default.region us-east-1
aws configure set default.output json

aws s3 cp $APKLOCATION s3://ci.phonegap.com/phonegap-app-developer/android/Phonegap-$CIRCLE_SHA1.apk
