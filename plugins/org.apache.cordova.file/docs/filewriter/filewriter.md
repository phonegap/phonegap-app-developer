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

FileWriter
==========

As object that allows you to create and write data to a file.

Properties
----------

- __readyState__: One of the three possible states, either `INIT`, `WRITING`, or `DONE`.
- __fileName__: The name of the file to be written. _(DOMString)_
- __length__: The length of the file to be written. _(long)_
- __position__: The current position of the file pointer. _(long)_
- __error__: An object containing errors. _(FileError)_
- __onwritestart__: Called when the write starts. _(Function)_
- __onwrite__: Called when the request has completed successfully.  _(Function)_
- __onabort__: Called when the write has been aborted. For instance, by invoking the abort() method. _(Function)_
- __onerror__: Called when the write has failed. _(Function)_
- __onwriteend__: Called when the request has completed (either in success or failure).  _(Function)_

The following property is _not_ supported:

- __onprogress__: Called while writing the file, reporting progress in terms of `progress.loaded`/`progress.total`. _(Function)_
Methods
-------

- __abort__: Aborts writing the file.
- __seek__: Moves the file pointer to the specified byte.
- __truncate__: Shortens the file to the specified length.
- __write__: Writes data to the file.

Details
-------

The `FileWriter` object offers a way to write UTF-8 encoded files to
the device file system.  Applications respond to `writestart`,
`progress`, `write`, `writeend`, `error`, and `abort` events.

Each `FileWriter` corresponds to a single file, to which data can be
written many times.  The `FileWriter` maintains the file's `position`
and `length` attributes, which allow the app to `seek` and `write`
anywhere in the file. By default, the `FileWriter` writes to the
beginning of the file, overwriting existing data. Set the optional
`append` boolean to `true` in the `FileWriter`'s constructor to
write to the end of the file.

Text data is supported by all platforms listed below. Text is encoded as UTF-8 before being written to the filesystem. Some platforms also support binary data, which can be passed in as either an ArrayBuffer or a Blob.

Supported Platforms
-------------------

### Text and Binary suport

- Android
- iOS

### Text only support

- BlackBerry WebWorks (OS 5.0 and higher)
- Windows Phone 7 and 8
- Windows 8

Seek Quick Example
------------------------------

    function win(writer) {
        // fast forwards file pointer to end of file
        writer.seek(writer.length);
    };

    var fail = function(evt) {
        console.log(error.code);
    };

    entry.createWriter(win, fail);

Truncate Quick Example
--------------------------

    function win(writer) {
        writer.truncate(10);
    };

    var fail = function(evt) {
        console.log(error.code);
    };

    entry.createWriter(win, fail);

Write Quick Example
-------------------

    function win(writer) {
        writer.onwrite = function(evt) {
            console.log("write success");
        };
        writer.write("some sample text");
    };

    var fail = function(evt) {
        console.log(error.code);
    };

    entry.createWriter(win, fail);

Binary Write Quick Example
--------------------------

    function win(writer) {
        var data = new ArrayBuffer(5),
            dataView = new Int8Array(data);
        for (i=0; i < 5; i++) {
            dataView[i] = i;
        }
        writer.onwrite = function(evt) {
            console.log("write success");
        };
        writer.write(data);
    };

    var fail = function(evt) {
        console.log(error.code);
    };

    entry.createWriter(win, fail);

Append Quick Example
--------------------

    function win(writer) {
        writer.onwrite = function(evt) {
        console.log("write success");
    };
    writer.seek(writer.length);
        writer.write("appended text");
    };

    var fail = function(evt) {
        console.log(error.code);
    };

    entry.createWriter(win, fail);

Abort Quick Example
-------------------

    function win(writer) {
        writer.onwrite = function(evt) {
            console.log("write success");
        };
        writer.write("some sample text");
        writer.abort();
    };

    var fail = function(evt) {
        console.log(error.code);
    };

    entry.createWriter(win, fail);

Full Example
------------
    <!DOCTYPE html>
    <html>
      <head>
        <title>FileWriter Example</title>

        <script type="text/javascript" charset="utf-8" src="cordova-x.x.x.js"></script>
        <script type="text/javascript" charset="utf-8">

        // Wait for device API libraries to load
        //
        document.addEventListener("deviceready", onDeviceReady, false);

        // device APIs are available
        //
        function onDeviceReady() {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
        }

        function gotFS(fileSystem) {
            fileSystem.root.getFile("readme.txt", {create: true, exclusive: false}, gotFileEntry, fail);
        }

        function gotFileEntry(fileEntry) {
            fileEntry.createWriter(gotFileWriter, fail);
        }

        function gotFileWriter(writer) {
            writer.onwriteend = function(evt) {
                console.log("contents of file now 'some sample text'");
                writer.truncate(11);
                writer.onwriteend = function(evt) {
                    console.log("contents of file now 'some sample'");
                    writer.seek(4);
                    writer.write(" different text");
                    writer.onwriteend = function(evt){
                        console.log("contents of file now 'some different text'");
                    }
                };
            };
            writer.write("some sample text");
        }

        function fail(error) {
            console.log(error.code);
        }

        </script>
      </head>
      <body>
        <h1>Example</h1>
        <p>Write File</p>
      </body>
    </html>
