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

Flags
=====

Supplies arguments to the `DirectoryEntry` object's `getFile()` and
`getDirectory()` methods, which look up or create files and
directories, respectively.

Properties
----------

- __create__: Indicates that the file or directory should be created if it does not already exist. _(boolean)_
- __exclusive__: Has has no effect by itself, but when used with `create` causes the file or directory creation to fail if the target path already exists. _(boolean)_

Supported Platforms
-------------------

- Android
- BlackBerry WebWorks (OS 5.0 and higher)
- iOS
- Windows Phone 7 and 8
- Windows 8

Quick Example
-------------

    // Get the data directory, creating it if it doesn't exist.
    dataDir = fileSystem.root.getDirectory("data", {create: true});

    // Create the lock file, if and only if it doesn't exist.
    lockFile = dataDir.getFile("lockfile.txt", {create: true, exclusive: true});
