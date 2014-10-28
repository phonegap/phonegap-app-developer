<!--
#
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
# 
# http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
#  KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
#
-->
# Release Notes

### 0.2.2 (Sept 25, 2013)
* CB-4889 bumping&resetting version
* [windows8] commandProxy was moved
* [windows8] commandProxy was moved
* CB-4889
* CB-4889 renaming org.apache.cordova.core.media-capture to org.apache.cordova.media-capture and updating dependency
* Rename CHANGELOG.md -> RELEASENOTES.md
* [CB-4847] iOS 7 microphone access requires user permission - if denied, CDVCapture, CDVSound does not handle it properly
* [CB-4826] Fix warning using UITextAlignmentCenter
* [CB-4826] Fix XCode 5 capture plugin warnings
* [CB-4488] - added manual capture test
* [CB-4764] Remove reference to DirectoryManager from Capture.java
* [CB-4763] Use own version of FileHelper.
* [CB-4752] Incremented plugin version on dev branch.

### 0.2.3 (Oct 9, 2013)
* CB-4720: fixed incorrect feature tag in plugin.xml for wp
* [CB-4915] Incremented plugin version on dev branch.

 ### 0.2.4 (Oct 28, 2013)
* CB-5199 - ios - Media Capture - UI issues under iOS 7
* CB-5128: added repo + issue tag to plugin.xml for media capture plugin
* [CB-5010] Incremented plugin version on dev branch. 

### 0.2.5 (Dec 4, 2013)
* add ubuntu platform
* Added amazon-fireos platform. Change to use amazon-fireos as a platform if user agent string contains 'cordova-amazon-fireos'
* CB-5291 - ios - Media Capture Audio - status bar issues under iOS 7
* CB-5275: CaptureImage and CaptureVideo have runnables and CaptureVideo works on 4.2.  Still doesn't work for 4.3

### 0.2.6 (Jan 02, 2014)
* CB-5658 Add doc/index.md for Media Capture plugin
* CB-5569 Windows8. MediaFile constructor does not exist
* CB-5517 Fix the audio capture IO exception by putting it in a runnable

### 0.2.7 (Feb 05, 2014)
* [ubuntu] request audio/camera/microphone permission
* fixed  cordova cli add capture plugin not work wp
* CB-5685 [BlackBerry10] Add access_shared permission

### 0.2.8 (Feb 26, 2014)
* CB-5202 Fix video capture crash on Android 4.3+

### 0.3.0 (Apr 17, 2014)
* CB-6152: [ios, android] Make mediafile compatible with file plugin
* CB-6385: Specify file plugin dependency version
* CB-6212: [iOS] fix warnings compiled under arm64 64-bit
* CB-6016 [BlackBerry10] Add audio capture capability
* [Blackberry10] Add rim xml namespaces declaration
* CB-6422 [windows8] use cordova/exec/proxy
* CB-6460: Update license headers
* Add NOTICE file

### 0.3.1 (Jun 05, 2014)
* Added translations to documentation. Github close #14
* Remove deprecated symbols for iOS < 6
* Fixes captureTasks UI URIs
* CB-6808 Add license
* CB-6706: Relax dependency on file plugin
* CB-6491 add CONTRIBUTING.md

### 0.3.2 (Aug 06, 2014)
* ubuntu: fix compler warnings
* ubuntu: support qt 5.2
* CB-6127 Updated translations for docs
* CB-6978 captureImage() function fails in Android
* CB-6890: Fix pluginManager access for 4.0.x branch

### 0.3.3 (Sep 17, 2014)
* Renamed test dir, added nested plugin.xml
* added documentation for manual tests
* CB-6959 Added manual tests
* CB-6959 Port capture tests to plugin-test-framework

### 0.3.4 (Oct 03, 2014)
* CB-7453 Adds fallback to m4a audio format when mp3 recording fails.
* CB-7429 Fixes image capture manual tests on windows
* CB-7429 Move windows8 and windows Proxies into one file
* CB-7429 Adds media capture support for windows
