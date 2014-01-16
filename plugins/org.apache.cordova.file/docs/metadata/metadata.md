---
license: Licensed to the Apache Software Foundation (ASF) under one
         or more contributor license agreements.  See the NOTICE file
         distributed with this work for additional information
         regarding copyright ownership.  The ASF licenses this file
         to you under the Apache License, Version 2.0 (the
         "License"); you may not use this file except in compliance
         with the License.  You may obtain a copy of the License at

           http://www.apache.org/licenses/LICENSE-2.0

         Unless required by applicable law or agreed to in writing,
         software distributed under the License is distributed on an
         "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
         KIND, either express or implied.  See the License for the
         specific language governing permissions and limitations
         under the License.
---

Metadata
==========

An interface that supplies information about the state of a file or directory.

Properties
----------

- __modificationTime__: The time when the file or directory was last modified. _(Date)_

Details
-------

The `Metadata` object represents information about the state of a file
or directory.  Calling a `DirectoryEntry` or `FileEntry` object's
`getMetadata()` method results in a `Metadata` instance.

Supported Platforms
-------------------

- Android
- BlackBerry WebWorks (OS 5.0 and higher)
- iOS
- Windows Phone 7 and 8
- Windows 8

Quick Example
-------------

    function win(metadata) {
        console.log("Last Modified: " + metadata.modificationTime);
    }

    // Request the metadata object for this entry
    entry.getMetadata(win, null);
