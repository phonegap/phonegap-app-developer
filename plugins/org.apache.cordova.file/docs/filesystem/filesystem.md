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

FileSystem
==========

This object represents a file system.

Properties
----------

- __name__: The name of the file system. _(DOMString)_
- __root__: The root directory of the file system. _(DirectoryEntry)_

Details
-------

The `FileSystem` object represents information about the file system.
The name of the file system is unique across the list of exposed
file systems.  The root property contains a `DirectoryEntry` object
that represents the file system's root directory.

Supported Platforms
-------------------

- Android
- BlackBerry WebWorks (OS 5.0 and higher)
- iOS
- Windows Phone 7 and 8
- Windows 8

File System Quick Example
-------------------------

    function onSuccess(fileSystem) {
        console.log(fileSystem.name);
        console.log(fileSystem.root.name);
    }

    // request the persistent file system
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onSuccess, null);

Full Example
------------

    <!DOCTYPE html>
    <html>
      <head>
        <title>File System Example</title>

        <script type="text/javascript" charset="utf-8" src="cordova-x.x.x.js"></script>
        <script type="text/javascript" charset="utf-8">

        // Wait for device API libraries to load
        //
        document.addEventListener("deviceready", onDeviceReady, false);

        // device APIs are available
        //
        function onDeviceReady() {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, fail);
        }

        function onFileSystemSuccess(fileSystem) {
            console.log(fileSystem.name);
            console.log(fileSystem.root.name);
        }

        function fail(evt) {
            console.log(evt.target.error.code);
        }

        </script>
      </head>
      <body>
        <h1>Example</h1>
        <p>File System</p>
      </body>
    </html>
