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
## Mobile Spec Suite ##

This project is a set of automated & manual tests that test Cordova core functionality.

To set up the project, use `cordova-mobile-spec/createmobilespec/createmobilespec.js`.

### Requirements ###

Repositories required:
- **cordova-cli** (Install pre-requisites by running `npm install` inside of cordova-cli).
- **cordova-js** (required [grunt-cli](https://github.com/gruntjs/grunt-cli) installed).
- All **plugins**.
- **Platforms** to test (cordova-android, cordova-ios, cordova-blackberry, cordova-wp8, cordova-windows).
- **cordova-mobile-spec** (Install pre-requisites by running `npm install` inside of cordova-mobile-spec/createmobilespec).
- All repositories must be checked out as peers of each other.

### Performance ###

For reference purposes, the document AndroidBridgePerformance_300.pdf in this directory outlines the Android bridge performance using mobile-spec and the manual bridge test. The tests were performed with Cordova 3.0.0.
