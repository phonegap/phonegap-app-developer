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

DirectoryReader
===============

An object that lists files and directories within a directory, as
defined in the
[W3C Directories and Systems](http://www.w3.org/TR/file-system-api/)
specification.

Methods
-------

- __readEntries__: Read the entries in a directory.

Supported Platforms
-------------------

- Android
- BlackBerry WebWorks (OS 5.0 and higher)
- iOS
- Windows Phone 7 and 8
- Windows 8

readEntries
-----------

Read the entries in this directory.

__Parameters:__

- __successCallback__: A callback that is passed an array of `FileEntry` and `DirectoryEntry` objects. _(Function)_
- __errorCallback__: A callback that executes if an error occurs when retrieving the directory listing. Invoked with a `FileError` object. _(Function)_

__Quick Example__

    function success(entries) {
        var i;
        for (i=0; i<entries.length; i++) {
            console.log(entries[i].name);
        }
    }

    function fail(error) {
        alert("Failed to list directory contents: " + error.code);
    }

    // Get a directory reader
    var directoryReader = dirEntry.createReader();

    // Get a list of all the entries in the directory
    directoryReader.readEntries(success,fail);
