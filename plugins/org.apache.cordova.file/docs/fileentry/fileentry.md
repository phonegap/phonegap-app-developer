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

FileEntry
==========

Represents a file on a file system, as defined in the
[W3C Directories and Systems](http://www.w3.org/TR/file-system-api/)
specification.

Properties
----------

- __isFile__: Always true. _(boolean)_
- __isDirectory__: Always false. _(boolean)_
- __name__: The name of the `FileEntry`, excluding the path leading to it. _(DOMString)_
- __fullPath__: The full absolute path from the root to the `FileEntry`. _(DOMString)_

__NOTE:__ The following attribute is defined by the W3C specification,
but is _not_ supported:

- __filesystem__: The file system on which the `FileEntry` resides. _(FileSystem)_

Methods
-------

- __getMetadata__: Look up metadata about a file.
- __setMetadata__: Set metadata on a file.
- __moveTo__: Move a file to a different location on the file system.
- __copyTo__: Copy a file to a different location on the file system.
- __toURL__: Return a URL that can be used to locate a file.
- __remove__: Delete a file.
- __getParent__: Look up the parent directory.
- __createWriter__: Creates a `FileWriter` object that can be used to write to a file.
- __file__: Creates a `File` object containing file properties.

Supported Platforms
-------------------

- Android
- BlackBerry WebWorks (OS 5.0 and higher)
- iOS
- Windows Phone 7 and 8
- Windows 8

getMetadata
----------------

Look up metadata about a file.

__Parameters:__

- __successCallback__: A callback that is passed a `Metadata` object. _(Function)_
- __errorCallback__: A callback that executes if an error occurs when retrieving the `Metadata`. Invoked with a `FileError` object. _(Function)_

__Quick Example__

    function success(metadata) {
        console.log("Last Modified: " + metadata.modificationTime);
    }

    function fail(error) {
        alert(error.code);
    }

    // Request the metadata object for this entry
    entry.getMetadata(success, fail);

setMetadata
----------------

Set metadata on a file.

__Currently works only on iOS.__
- this will set the extended attributes of a file.

__Parameters:__

- __successCallback__: A callback that executes when the metadata is set. _(Function)_
- __errorCallback__: A callback that executes when the metadata is not successfully set. _(Function)_
- __metadataObject__: An object that contains the metadata's keys and values. _(Object)_

__Quick Example__

    function success() {
        console.log("The metadata was successfully set.");
    }

    function fail() {
        alert("There was an error in setting the metadata");
    }

    // Set the metadata
    entry.setMetadata(success, fail, { "com.apple.MobileBackup": 1});

__iOS Quirk__

- Only the `com.apple.MobileBackup` extended attribute is supported. Set the value to `1` to prevent the file from being backed up to iCloud. Set the value to `0` to re-enable the file to be backed up to iCloud.

__Quick Example__

    function setFileMetadata(localFileSystem, filePath, metadataKey, metadataValue)
    {
            var onSetMetadataWin = function() {
              console.log("success setting metadata")
            }
        var onSetMetadataFail = function() {
              console.log("error setting metadata")
        }

            var onGetFileWin = function(parent) {
              var data = {};
              data[metadataKey] = metadataValue;
              parent.setMetadata(onSetMetadataWin, onSetMetadataFail, data);
            }
            var onGetFileFail = function() {
              console.log("error getting file")
            }

            var onFSWin = function(fileSystem) {
              fileSystem.root.getFile(filePath, {create: true, exclusive: false}, onGetFileWin, onGetFileFail);
            }

            var onFSFail = function(evt) {
                  console.log(evt.target.error.code);
            }

            window.requestFileSystem(localFileSystem, 0, onFSWin, onFSFail);
    }

        setFileMetadata(LocalFileSystem.PERSISTENT, "Backups/sqlite.db", "com.apple.MobileBackup", 1);

moveTo
------

Move a file to a different location on the file system. An error
results if the app attempts to:

- move a file into its parent if a name different from its current one isn't provided;
- move a file to a path occupied by a directory;

In addition, moving a file on top of an existing file attempts to
delete and replace that file.

__Parameters:__

- __parent__: The parent directory to which to move the file. _(DirectoryEntry)_
- __newName__: The new name of the file. Defaults to the current name if unspecified. _(DOMString)_
- __successCallback__: A callback that is passed the new files `FileEntry` object. _(Function)_
- __errorCallback__: A callback that executes if an error occurs when attempting to move the file.  Invoked with a `FileError` object. _(Function)_

__Quick Example__

    function success(entry) {
        console.log("New Path: " + entry.fullPath);
    }

    function fail(error) {
        alert(error.code);
    }

    function moveFile(entry) {
        var parent = document.getElementById('parent').value,
            parentName = parent.substring(parent.lastIndexOf('/')+1),
            parentEntry = new DirectoryEntry(parentName, parent);

        // move the file to a new directory and rename it
        entry.moveTo(parentEntry, "newFile.txt", success, fail);
    }

copyTo
------

Copy a file to a new location on the file system.  An error results if
the app attempts to:

- copy a file into its parent if a name different from its current one is not provided.

__Parameters:__

- __parent__: The parent directory to which to copy the file. _(DirectoryEntry)_
- __newName__: The new name of the file. Defaults to the current name if unspecified. _(DOMString)_
- __successCallback__: A callback that is passed the new file's `FileEntry` object. _(Function)_
- __errorCallback__: A callback that executes if an error occurs when attempting to copy the file.  Invoked with a `FileError` object. _(Function)_

__Quick Example__

    function win(entry) {
        console.log("New Path: " + entry.fullPath);
    }

    function fail(error) {
        alert(error.code);
    }

    function copyFile(entry) {
        var parent = document.getElementById('parent').value,
            parentName = parent.substring(parent.lastIndexOf('/')+1),
            parentEntry = new DirectoryEntry(parentName, parent);

        // copy the file to a new directory and rename it
        entry.copyTo(parentEntry, "file.copy", success, fail);
    }

toURL
-----

Returns a URL that can be used to locate the file.

__Quick Example__

    // Request the URL for this entry
    var fileURL = entry.toURL();
    console.log(fileURL);

remove
------

Deletes a file.

__Parameters:__

- __successCallback__: A callback that executes after the file has been deleted.  Invoked with no parameters. _(Function)_
- __errorCallback__: A callback that executes if an error occurs when attempting to delete the file.  Invoked with a `FileError` object. _(Function)_

__Quick Example__

    function success(entry) {
        console.log("Removal succeeded");
    }

    function fail(error) {
        alert('Error removing file: ' + error.code);
    }

    // remove the file
    entry.remove(success, fail);

getParent
---------

Look up the parent `DirectoryEntry` containing the file.

__Parameters:__

- __successCallback__: A callback that is passed the file's parent `DirectoryEntry`. _(Function)_
- __errorCallback__: A callback that executes if an error occurs when attempting to retrieve the parent `DirectoryEntry`.  Invoked with a `FileError` object. _(Function)_

__Quick Example__

    function success(parent) {
        console.log("Parent Name: " + parent.name);
    }

    function fail(error) {
        alert(error.code);
    }

    // Get the parent DirectoryEntry
    entry.getParent(success, fail);

createWriter
------------

Create a `FileWriter` object associated with the file represented by the `FileEntry`.

__Parameters:__

- __successCallback__: A callback that is passed a `FileWriter` object. _(Function)_
- __errorCallback__: A callback that executes if an error occurs while attempting to create the FileWriter.  Invoked with a `FileError` object. _(Function)_

__Quick Example__

    function success(writer) {
        writer.write("Some text to the file");
    }

    function fail(error) {
        alert(error.code);
    }

    // create a FileWriter to write to the file
    entry.createWriter(success, fail);

file
----

Return a `File` object that represents the current state of the file
that this `FileEntry` represents.

__Parameters:__

- __successCallback__: A callback that is passed a `File` object. _(Function)_
- __errorCallback__: A callback that executes if an error occurs when creating the `File` object, such as when the file no longer exists.  Invoked with a `FileError` object. _(Function)_

__Quick Example__

    function success(file) {
        console.log("File size: " + file.size);
    }

    function fail(error) {
        alert("Unable to retrieve file properties: " + error.code);
    }

    // obtain properties of a file
    entry.file(success, fail);
