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

FileReader
==========

The `FileReader` allows basic access to a file.

Properties
----------

- __readyState__: One of the reader's three possible states, either `EMPTY`, `LOADING` or `DONE`.
- __result__: The contents of the file that have been read. _(DOMString)_
- __error__: An object containing errors. _(FileError)_
- __onloadstart__: Called when the read starts. _(Function)_
- __onload__: Called when the read has successfully completed. _(Function)_
- __onabort__: Called when the read has been aborted. For instance, by invoking the `abort()` method. _(Function)_
- __onerror__: Called when the read has failed. _(Function)_
- __onloadend__: Called when the request has completed (either in success or failure).  _(Function)_

__NOTE:__ The following porperty is not supported:

- __onprogress__: Called while reading the file, reporting progress in terms of `progress.loaded`/`progress.total`. _(Function)_

Methods
-------

- __abort__: Aborts reading file.
- __readAsDataURL__: Read file and return data as a base64-encoded data URL.
- __readAsText__: Reads text file.
- __readAsBinaryString__: Reads file as binary and returns a binary string.
- __readAsArrayBuffer__: Reads file as an `ArrayBuffer`.

Details
-------

The `FileReader` object offers a way to read files from the device's
file system.  Files can be read as text or as a base64 data-encoded
string.  Event listeners receive the `loadstart`, `progress`, `load`,
`loadend`, `error`, and `abort` events.

Supported Platforms
-------------------

- Android
- BlackBerry WebWorks (OS 5.0 and higher)
- iOS
- Windows Phone 7 and 8
- Windows 8

Read As Data URL
----------------

__Parameters:__

- __file__: the file object to read.

Quick Example
-------------

    function win(file) {
        var reader = new FileReader();
        reader.onloadend = function (evt) {
            console.log("read success");
            console.log(evt.target.result);
        };
        reader.readAsDataURL(file);
    };

    var fail = function (evt) {
        console.log(error.code);
    };

    entry.file(win, fail);

Read As Text
------------

__Parameters:__

- __file__: the file object to read.
- __encoding__: the encoding to use to encode the file's content. Default is UTF8.

Quick Example
-------------

    function win(file) {
        var reader = new FileReader();
        reader.onloadend = function (evt) {
            console.log("read success");
            console.log(evt.target.result);
        };
        reader.readAsText(file);
    };

    var fail = function (evt) {
        console.log(error.code);
    };

    entry.file(win, fail);

Abort Quick Example
-------------------

    function win(file) {
        var reader = new FileReader();
        reader.onloadend = function(evt) {
            console.log("read success");
            console.log(evt.target.result);
        };
        reader.readAsText(file);
        reader.abort();
    };

    function fail(error) {
        console.log(error.code);
    }

    entry.file(win, fail);

Full Example
------------

    <!DOCTYPE html>
    <html>
      <head>
        <title>FileReader Example</title>

        <script type="text/javascript" charset="utf-8" src="cordova-x.x.x.js"></script>
        <script type="text/javascript" charset="utf-8">

        // Wait for device API libraries to load
        //
        function onLoad() {
            document.addEventListener("deviceready", onDeviceReady, false);
        }

        // device APIs are available
        //
        function onDeviceReady() {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
        }

        function gotFS(fileSystem) {
            fileSystem.root.getFile("readme.txt", null, gotFileEntry, fail);
        }

        function gotFileEntry(fileEntry) {
            fileEntry.file(gotFile, fail);
        }

        function gotFile(file){
            readDataUrl(file);
            readAsText(file);
        }

        function readDataUrl(file) {
            var reader = new FileReader();
            reader.onloadend = function(evt) {
                console.log("Read as data URL");
                console.log(evt.target.result);
            };
            reader.readAsDataURL(file);
        }

        function readAsText(file) {
            var reader = new FileReader();
            reader.onloadend = function(evt) {
                console.log("Read as text");
                console.log(evt.target.result);
            };
            reader.readAsText(file);
        }

        function fail(evt) {
            console.log(evt.target.error.code);
        }

        </script>
      </head>
      <body>
        <h1>Example</h1>
        <p>Read File</p>
      </body>
    </html>

iOS Quirks
----------
- The __encoding__ parameter is not supported, and UTF8 encoding is always in effect.

Read As Binary String
---------------------

Currently supported on iOS and Android only.

__Parameters:__

- __file__: the file object to read.

Quick Example
-------------

    function win(file) {
        var reader = new FileReader();
        reader.onloadend = function (evt) {
            console.log("read success");
            console.log(evt.target.result);
        };
        reader.readAsBinaryString(file);
    };

    var fail = function (evt) {
        console.log(error.code);
    };

    entry.file(win, fail);

Read As Array Buffer
--------------------

Currently supported on iOS and Android only.

__Parameters:__

- __file__:  the file object to read.

Quick Example
-------------

    function win(file) {
        var reader = new FileReader();
        reader.onloadend = function (evt) {
            console.log("read success");
            console.log(new Uint8Array(evt.target.result));
        };
        reader.readAsArrayBuffer(file);
    };

    var fail = function (evt) {
        console.log(error.code);
    };

    entry.file(win, fail);
