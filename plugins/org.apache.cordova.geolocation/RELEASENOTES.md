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

### 0.3.0 (Sept 5, 2013)
* Added support for windows 8 (Adds required permission)

### 0.3.2 (Sept 25, 2013)
* CB-4889 bumping&resetting version
* [BlackBerry10] removed uneeded permission tags in plugin.xml
* CB-4889 renaming org.apache.cordova.core.geolocation to org.apache.cordova.geolocation

### 0.3.3 (Oct 28, 2013)
* CB-5128: add repo + issue tag to plugin.xml for geolocation plugin
* [CB-4915] Incremented plugin version on dev branch.

### 0.3.4 (Dec 4, 2013)
* Append proxy to platform definition in plugin.xml
* Append windows 8 Geolocation proxy
* Code clean-up for android src.
* Updated amazon-fireos platform + reverting some of the fixes in android code.
* Added amazon-fireos platform + some of the fixes in android code.
* CB-5334 [BlackBerry10] Use command proxy
* call FxOS's getCurrentProxy added
* pass by only coords
* proper implementation for firefoxos

### 0.3.5 (Jan 02, 2014)
* CB-5658 Add doc/index.md for Geolocation plugin
* windows8: adds missing reference to PositionError (w/o it the app crashes)
* Removing incorrectly added closing comments for wp7 platform in plugin.xml

### 0.3.6 (Feb 05, 2014)
* add ubuntu platform support
* CB-5326 adding FFOS permission and updating supported platforms
* CB-5729 [BlackBerry10] Update GeolocationProxy to return collapsed object

### 0.3.7 (Apr 17, 2014)
* CB-6422: [windows8] use cordova/exec/proxy
* CB-6212: [iOS] fix warnings compiled under arm64 64-bit
* CB-5977: [android] Removing the Android Geolocation Code.  Mission Accomplished.
* CB-6460: Update license headers
* Add NOTICE file

### 0.3.8 (Jun 05, 2014)
* CB-6127 Spanish and French Translations added. Github close #14
* CB-6804 Add license
* CB-5416 - Adding support for auto-managing permissions
* CB-6491 add CONTRIBUTING.md
* pass by only coords
* proper implementation for firefoxos
* call FxOS's getCurrentProxy added

### 0.3.9 (Aug 06, 2014)
* **FFOS** update GeolocationProxy.js
* CB-7187 ios: Add explicit dependency on CoreLocation.framework
* CB-7187 Delete unused #import of CDVShared.h
* CB-6127 Updated translations for docs
* ios: Changed distanceFilter from none to 5 meters, prevents it from spamming the callback even though nothing changed.


### 0.3.10 (Sep 17, 2014)
* CB-7556 iOS: Clearing all Watches does not stop Location Services
* CB-7158 Fix geolocation for ios 8
* Revert CB-6911 partially (keeping Info.plist key installation for iOS 8)
* CB-6911 Geolocation fails in iOS 8
* CB-5114 Windows 8.1 - Use a new proxy as old geolocation methods is deprecated
* CB-5114 Append Windows 8.1 into plugin.xml + Optimize Windows 8 Geolocation proxy
* Renamed test dir, added nested plugin.xml
* added documentation for manual tests
* CB-7146 Added manual tests
* Removed js-module for tests from plugin.xml
* Changing cdvtest format to use module exports
* register tests using new style
* Convert tests to new style
* Removed amazon-fireos code for geolocation.
* CB-7571 Bump version of nested plugin to match parent plugin
