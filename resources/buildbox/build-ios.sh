#!/usr/bin/env bash
npm run adhoc-ios

# upload binary to S3

IPALOCATION="platforms/ios/build/device/PG Nightly.ipa"

export BUILDKITE_S3_ACCESS_KEY_ID=$AWSACCESSKEY
export BUILDKITE_S3_SECRET_ACCESS_KEY=$AWSSECRETKEY
export BUILDKITE_S3_DEFAULT_REGION=us-east-1
export BUILDKITE_S3_ACL=private
buildkite-agent artifact upload "$IPALOCATION" s3://ci.phonegap.com/phonegap-app-developer/ios/Phonegap-$BUILDKITE_COMMIT.ipa

# upload binary to HockeyApp
node ./resources/script/hockey-app.js $HOCKEY_APP_TOKEN $HOCKEY_APP_IOS_ID $BUILDKITE_COMMIT
