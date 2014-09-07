PhoneGap 1.7, XCode 4

1. Create a new XCode project as described at http://docs.phonegap.com/en/1.7.0/guide_getting-started_ios_index.md.html.

2. Drag the www directory onto the root of your Hydra xcode project.

3. Add the IOS target files to your project:

 - In your Hydra xcode project, right click on the Plugins directory, and select 'Add files to hydra'.
 - Browse to the hydra repo and select the 4 directories in target/ios.
 - Deselect 'Copy items into destination group folder', select 'Create groups for any added folders'. Click Add.

5. In PhoneGap.plist, under "Plugins", add a new entry with key "AppLoader" and value "AppLoader"

4. Include libz.dylib in your project
 - XCode 4
   - Select your target
   - Select Build Phases tab
   - Expand Link Binary with Libraries
   - Press + at the bottom
   - Search and add libz.dylib (expand collapsed directories)
   - (Optional) Move into the "Frameworks" group

6. In Cordova.plist, under "ExternalHosts", add these new entries:
 - build.phonegap.com
 - s3.amazonaws.com
 - (any other hosts that your downloaded app needs to connect to - of course you need to know this in advance - or you can use "*" to allow everything)


