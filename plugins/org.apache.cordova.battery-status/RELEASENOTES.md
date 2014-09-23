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

### 0.2.3 (Sept 25, 2013)
* CB-4889 bumping&resetting version
* [CB-4752] Incremented plugin version on dev branch.
* CB-4889 renaming org.apache.cordova.core.battery-status to org.apache.cordova.battery-status

### 0.2.4 (Oct 25, 2013)
* CB-5128: added repo + issue tag to plugin.xml for battery status plugin
* [CB-4915] Incremented plugin version on dev branch.

### 0.2.5 (Dec 4, 2013)
* Merged WP8 support for level, but #def'd it out so the same code runs on wp7.  Updated docs to reflect WP8 support for battery level, and low+critical events
* wp8 add support in level
* add ubuntu platform
* 1. Updated platform name amazon->amazon-fireos. Deleted src files. 2. Change to use amazon-fireos as the platform if user agent string contains 'cordova-amazon-fireos'

### 0.2.6 (Jan 02, 2014)
* CB-5658 Add doc/index.md for Battery Status.

### 0.2.7 (Feb 05, 2014)
* Add Tizen plugin.

### 0.2.8 (Apr 17, 2014)
* CB-6465: Add license headers to Tizen code
* CB-6460: Update license headers
* Add NOTICE file

### 0.2.9 (Jun 05, 2014)
* CB-6721 Test for batterycritical change before batterylow change
* CB-5611 firefoxos: battery-status plugin support added
* CB-4519, CB-4520 low+critical weren't firing when level went from 21->19, and were when level went 19->20
* CB-6491 add CONTRIBUTING.md

### 0.2.10 (Aug 06, 2014)
* CB-6957 Ported Battery-status manual & automated
* CB-6127 Updated translations for docs
