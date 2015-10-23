#!/usr/bin/env bash
npm run release-ios

# upload binary to S3

IPALOCATION=platforms/ios/build/device/PhoneGap.ipa

export BUILDKITE_S3_ACCESS_KEY_ID=$AWSACCESSKEY
export BUILDKITE_S3_SECRET_ACCESS_KEY=$AWSSECRETKEY
export BUILDKITE_S3_DEFAULT_REGION=us-east-1
export BUILDKITE_S3_ACL=private
buildkite-agent artifact upload $IPALOCATION s3://ci.phonegap.com/phonegap-app-developer/ios/Phonegap-$BUILDKITE_COMMIT.ipa
