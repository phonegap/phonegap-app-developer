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
