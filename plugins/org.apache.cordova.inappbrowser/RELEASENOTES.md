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
* CB-4788: Modified the onJsPrompt to warn against Cordova calls
* [windows8] commandProxy was moved
* CB-4788: Modified the onJsPrompt to warn against Cordova calls
* [windows8] commandProxy was moved
* CB-4889 renaming core references
* CB-4889 renaming org.apache.cordova.core.inappbrowser to org.apache.cordova.inappbrowser
* CB-4864, CB-4865: Minor improvements to InAppBrowser
* Rename CHANGELOG.md -> RELEASENOTES.md
* [CB-4792] Added keepCallback to the show function.
* [CB-4752] Incremented plugin version on dev branch.

### 0.2.3 (Oct 9, 2013)
* [CB-4915] Incremented plugin version on dev branch.
* [CB-4926] Fixes inappbrowser plugin loading for windows8

### 0.2.4 (Oct 28, 2013)
* CB-5128: added repo + issue tag to plugin.xml for inappbrowser plugin
* CB-4995 Fix crash when WebView is quickly opened then closed.
* CB-4930 - iOS - InAppBrowser should take into account the status bar
* [CB-5010] Incremented plugin version on dev branch.
* [CB-5010] Updated version and RELEASENOTES.md for release 0.2.3
* CB-4858 - Run IAB methods on the UI thread.
* CB-4858 Convert relative URLs to absolute URLs in JS
* CB-3747 Fix back button having different dismiss logic from the close button.
* CB-5021 Expose closeDialog() as a public function and make it safe to call multiple times.
* CB-5021 Make it safe to call close() multiple times

### 0.2.5 (Dec 4, 2013)
* Remove merge conflict tag
* [CB-4724] fixed UriFormatException
* add ubuntu platform
* CB-3420 WP feature hidden=yes implemented
* Added amazon-fireos platform. Change to use amazon-fireos as the platform if user agent string contains 'cordova-amazon-fireos'

### 0.3.0 (Jan 02, 2014)
* CB-5592 Android: Add MIME type to Intent when opening file:/// URLs
* CB-5594 iOS: Add disallowoverscroll option.
* CB-5658 Add doc/index.md for InAppBrowser plugin
* CB-5595 Add toolbarposition=top option.
* Apply CB-5193 to InAppBrowser (Fix DB quota exception)
* CB-5593 iOS: Make InAppBrowser localizable
* CB-5591 Change window.escape to encodeURIComponent
