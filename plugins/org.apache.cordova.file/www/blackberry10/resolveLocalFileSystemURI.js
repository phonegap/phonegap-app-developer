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

var fileUtils = require('./BB10Utils'),
    FileError = require('./FileError');

function stripURI(uri) {
    var rmFsLocal = uri.substring("filesystem:local:///".length);
    return rmFsLocal.substring(rmFsLocal.indexOf('/') + 1);
}

module.exports = function (uri, success, fail) {
    var sandboxState,
        decodedURI = decodeURI(uri);

    cordova.exec(function (sandboxed) {
        sandboxState = sandboxed;
    }, function (e) {
        console.log("[ERROR]: Could not retrieve sandbox state ", e);
    }, "org.apache.cordova.file", "isSandboxed");

    if (fileUtils.isOutsideSandbox(stripURI(decodedURI))) {
        cordova.exec(null, null, "org.apache.cordova.file", "setSandbox", [false]);
    } else {
        cordova.exec(null, null, "org.apache.cordova.file", "setSandbox", [true]);
    }
    window.webkitResolveLocalFileSystemURL(decodedURI, function (entry) {
        success(fileUtils.createEntry(entry));
    }, function (e) {
        window.webkitResolveLocalFileSystemURL(decodedURI + '/', function (entry) {
            success(fileUtils.createEntry(entry));
        }, function (e) {
            fail(e);
        });
    });
    cordova.exec(null, null, "org.apache.cordova.file", "setSandbox", [sandboxState]);
};
