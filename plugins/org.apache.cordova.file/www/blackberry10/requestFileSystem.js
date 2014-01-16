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
    FileError = require('./FileError'),
    FileSystem = require('./BB10FileSystem');

module.exports = function (type, size, success, fail) {
    var cordovaFs,
        cordovaFsRoot;
    if (size >= 1000000000000000) {
        fail(new FileError(FileError.QUOTA_EXCEEDED_ERR));
    } else if (type !== 1 && type !== 0) {
        fail(new FileError(FileError.SYNTAX_ERR));
    } else {
        window.webkitRequestFileSystem(type, size, function (fs) {
            cordovaFsRoot = fileUtils.createEntry(fs.root);
            cordovaFs = new FileSystem(fileUtils.getFileSystemName(fs), cordovaFsRoot);
            cordovaFsRoot.filesystem = cordovaFs;
            cordovaFs._size = size;
            success(cordovaFs);
        }, function (error) {
            fail(new FileError(error));
        });
    }
};
