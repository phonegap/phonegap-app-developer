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
