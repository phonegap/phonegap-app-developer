#!/bin/bash

echo 'Running: Updating PhoneGap-Info.plist for iOS platform'

if [ ! -d 'platforms/ios/' ]; then
    echo 'Skipping: the platform is not iOS'
    exit
fi

PLIST=platforms/ios/PhoneGap/PhoneGap-Info.plist

# need to update PhoneGap-Info.plist with updated options for iOS 9 support
    # NSAppTransportSecurity: disable
    # UIRequiresFullScreen: prevent iPad multitasking

cat << EOF |
Add :NSAppTransportSecurity dict
Add :NSAppTransportSecurity:NSAllowsArbitraryLoads bool YES
Add :UIRequiresFullScreen bool YES
EOF
while read line
do
    /usr/libexec/PlistBuddy -c "$line" $PLIST
done

# PlistBuddy returns an error if key already exists, causing Cordova build to fail
# this prevents the problem and allows the build to continue
true
