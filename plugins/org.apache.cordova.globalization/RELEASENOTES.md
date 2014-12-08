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
* CB-4889 renaming org.apache.cordova.core.globalization to org.apache.cordova.globalization
* Rename CHANGELOG.md -> RELEASENOTES.md
* [CB-4752] Incremented plugin version on dev branch.

 ### 0.2.3 (Oct 28, 2013)
* CB-5128: added repo + issue tag to plugin.xml for globalization plugin
* [CB-4915] Incremented plugin version on dev branch.

### 0.2.4 (Dec 4, 2013)
* [ubuntu] add missing file
* add ubuntu platform
* Added amazon-fireos platform. Change to use amazon-fireos as a platform if the user agent string contains 'cordova-amazon-fireos'

### 0.2.5 (Jan 02, 2014)
* CB-5658 Add doc/index.md for Globalization plugin

### 0.2.6 (Feb 05, 2014)
* Add Tizen plugin support

### 0.2.7 (Apr 17, 2014)
* CB-4908: [android] Long.valueOf(0) instead of new Long(0)
* CB-6212: [iOS] fix warnings compiled under arm64 64-bit
* CB-6460: Update license headers
* CB-6465: Add license headers to Tizen code
* Add NOTICE file

### 0.2.8 (Jun 05, 2014)
* CB-6127 Spanish and French Translations added. Github close #7
* CB-6805 Add license
* clean up pull request. this closes #11
* CB-4602 Added clarification to docs
* CB-4602 CB-6490 CB-4822 WP Globalization
* getLocale,getLanguage, and docs
* Android should return BCP47 tag, not localized string
* CB-6491 add CONTRIBUTING.md
* CB-5980 Updated version and RELEASENOTES.md for release 0.2.6

### 0.3.0 (Aug 06, 2014)
* The right Apache License 2.0 added
* Update headers and NOTICE file
* [BlackBerry10] Implement Globalization for BB10
* Initial implementation for **FirefoxOS**
* CB-4602 ios: Use normalized values for getPreferredLanguage.
* CB-6127 Updated translations for docs
* CB-4602 geolocation.getPreferredLanguage and geolocation.getLocaleName now return strings with hypen (-) to stay compliant with current standards

### 0.3.1 (Sep 17, 2014)
* CB-6490 [BlackBerry10] Use hyphen instead of underscore in getLocaleName().
* CB-7548 [BlackBerry10] Allow any numeric type as date in dateToString method.
* Hold the information if L10n was ready before.
* CB-7233 [BlackBerry10] Globalization is now supported
* Renamed test dir, added nested plugin.xml
* Clean-up: removed duplicate code
* Added test to complete CB-7064, added tests that check for W3C compliance in language tags generated from PreferredLanguage and GetLocale methods
* CB-6962 Ported globalization tests to framework

### 0.3.2 (Oct 03, 2014)
* CB-7548 [BlackBerry10] Re-implement getPreferredLanguage() and getLocaleName().
