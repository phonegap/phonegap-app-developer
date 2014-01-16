/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var argscheck = require('cordova/argscheck'),
    utils = require('cordova/utils'),
    Entry = require('./BB10Entry'),
    FileError = require('./FileError'),
    DirectoryReader = require('./BB10DirectoryReader'),
    fileUtils = require('./BB10Utils'),
    DirectoryEntry = function (name, fullPath, fileSystem) {
        DirectoryEntry.__super__.constructor.call(this, false, true, name, fullPath, fileSystem);
    };

utils.extend(DirectoryEntry, Entry);

function err(sandboxState, errorCallback) {
    return function (e) {
        cordova.exec(null, null, "org.apache.cordova.file", "setSandbox", [sandboxState]);
        errorCallback(e);
    }
};

DirectoryEntry.prototype.createReader = function () {
    return new DirectoryReader(this.fullPath);
};

DirectoryEntry.prototype.getDirectory = function (path, options, successCallback, errorCallback) {
    var sandboxState,
        currentPath = this.nativeEntry.fullPath;

    cordova.exec(function (sandboxed) {
        sandboxState = sandboxed;
    }, function (e) {
        console.log("[ERROR]: Could not retrieve sandbox state ", e);
    }, "org.apache.cordova.file", "isSandboxed");

    argscheck.checkArgs('sOFF', 'DirectoryEntry.getDirectory', arguments);

    if (fileUtils.isOutsideSandbox(path)) {
        cordova.exec(null, null, "org.apache.cordova.file", "setSandbox", [false]);
        window.webkitRequestFileSystem(window.PERSISTENT, this.filesystem._size, function (fs) {
            cordova.exec(null, null, "org.apache.cordova.file", "setSandbox", [sandboxState]);
            fs.root.getDirectory(currentPath + '/' + path, options, function (entry) {
                successCallback(fileUtils.createEntry(entry));
            }, err(sandboxState, errorCallback));
        }, err(sandboxState, errorCallback));
    } else {
        cordova.exec(null, null, "org.apache.cordova.file", "setSandbox", [true]);
        window.webkitRequestFileSystem(fileUtils.getFileSystemName(this.filesystem) === "persistent" ? window.PERSISTENT : window.TEMPORARY, this.filesystem._size, function (fs) {
            cordova.exec(null, null, "org.apache.cordova.file", "setSandbox", [sandboxState]);
            fs.root.getDirectory(currentPath + '/' + path, options, function (entry) {
                successCallback(fileUtils.createEntry(entry));
            }, err(sandboxState, errorCallback));
        }, err(sandboxState, errorCallback));
    }
};

DirectoryEntry.prototype.removeRecursively = function (successCallback, errorCallback) {
    argscheck.checkArgs('FF', 'DirectoryEntry.removeRecursively', arguments);
    this.nativeEntry.removeRecursively(successCallback, errorCallback);
};

DirectoryEntry.prototype.getFile = function (path, options, successCallback, errorCallback) {
    var sandboxState,
        currentPath = this.nativeEntry.fullPath;

    cordova.exec(function (sandboxed) {
        sandboxState = sandboxed;
    }, function (e) {
        console.log("[ERROR]: Could not retrieve sandbox state ", e);
    }, "org.apache.cordova.file", "isSandboxed");

    argscheck.checkArgs('sOFF', 'DirectoryEntry.getFile', arguments);

    if (fileUtils.isOutsideSandbox(path)) {
        cordova.exec(null, null, "org.apache.cordova.file", "setSandbox", [false]);
        window.webkitRequestFileSystem(window.PERSISTENT, this.filesystem._size, function (fs) {
            cordova.exec(null, null, "org.apache.cordova.file", "setSandbox", [sandboxState]);
            fs.root.getFile(currentPath + '/' + path, options, function (entry) {
                successCallback(fileUtils.createEntry(entry));
            }, err(sandboxState, errorCallback));
        }, err(sandboxState, errorCallback));
    } else {
        cordova.exec(null, null, "org.apache.cordova.file", "setSandbox", [true]);
        window.webkitRequestFileSystem(fileUtils.getFileSystemName(this.filesystem) === "persistent" ? window.PERSISTENT: window.TEMPORARY, this.filesystem._size, function (fs) {
            cordova.exec(null, null, "org.apache.cordova.file", "setSandbox", [sandboxState]);
            fs.root.getFile(currentPath + '/' + path, options, function (entry) {
                successCallback(fileUtils.createEntry(entry));
            }, err(sandboxState, errorCallback));
        }, err(sandboxState, errorCallback));
    }
};

module.exports = DirectoryEntry;
