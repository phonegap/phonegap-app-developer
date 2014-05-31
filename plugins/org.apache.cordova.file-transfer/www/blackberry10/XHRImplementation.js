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

/*global Blob:false */
var cordova = require('cordova'),
    nativeResolveLocalFileSystemURI = function(uri, success, fail) {
        if (uri.substring(0,11) !== "filesystem:") {
            uri = "filesystem:" + uri;
        }
        resolveLocalFileSystemURI(uri, success, fail);
    },
    xhr;

function getParentPath(filePath) {
    var pos = filePath.lastIndexOf('/');
    return filePath.substring(0, pos + 1);
}

function getFileName(filePath) {
    var pos = filePath.lastIndexOf('/');
    return filePath.substring(pos + 1);
}

function checkURL(url) {
    return url.indexOf(' ') === -1 ?  true : false;
}

module.exports = {
    abort: function () {
        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "async"};
    },

    upload: function(win, fail, args) {
        var filePath = args[0],
            server = args[1],
            fileKey = args[2],
            fileName = args[3],
            mimeType = args[4],
            params = args[5],
            /*trustAllHosts = args[6],*/
            chunkedMode = args[7],
            headers = args[8];

        if (!checkURL(server)) {
            fail(new FileTransferError(FileTransferError.INVALID_URL_ERR, server, filePath));
        }

        nativeResolveLocalFileSystemURI(filePath, function(entry) {
            entry.file(function(file) {
                function uploadFile(blobFile) {
                    var fd = new FormData();

                    fd.append(fileKey, blobFile, fileName);
                    for (var prop in params) {
                        if(params.hasOwnProperty(prop)) {
                            fd.append(prop, params[prop]);
                        }
                    }

                    xhr = new XMLHttpRequest();
                    xhr.open("POST", server);
                    xhr.onload = function(evt) {
                        if (xhr.status === 200) {
                            var result = new FileUploadResult();
                            result.bytesSent = file.size;
                            result.responseCode = xhr.status;
                            result.response = xhr.response;
                            win(result);
                        } else if (xhr.status === 404) {
                            fail(new FileTransferError(FileTransferError.INVALID_URL_ERR, server, filePath, xhr.status, xhr.response));
                        } else {
                            fail(new FileTransferError(FileTransferError.CONNECTION_ERR, server, filePath, xhr.status, xhr.response));
                        }
                    };
                    xhr.ontimeout = function(evt) {
                        fail(new FileTransferError(FileTransferError.CONNECTION_ERR, server, filePath, xhr.status, xhr.response));
                    };
                    xhr.onerror = function () {
                        fail(new FileTransferError(FileTransferError.CONNECTION_ERR, server, filePath, this.status, xhr.response));
                    };
                    xhr.onprogress = function (evt) {
                        win(evt);
                    };

                    for (var header in headers) {
                        if (headers.hasOwnProperty(header)) {
                            xhr.setRequestHeader(header, headers[header]);
                        }
                    }

                    xhr.send(fd);
                }

                var bytesPerChunk;
                if (chunkedMode === true) {
                    bytesPerChunk = 1024 * 1024; // 1MB chunk sizes.
                } else {
                    bytesPerChunk = file.size;
                }
                var start = 0;
                var end = bytesPerChunk;
                while (start < file.size) {
                    var chunk = file.nativeFile.slice(start, end, mimeType);
                    uploadFile(chunk);
                    start = end;
                    end = start + bytesPerChunk;
                }
            }, function(error) {
                fail(new FileTransferError(FileTransferError.FILE_NOT_FOUND_ERR, server, filePath));
            });
        }, function(error) {
            fail(new FileTransferError(FileTransferError.FILE_NOT_FOUND_ERR, server, filePath));
        });

        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "async"};
    },

    download: function (win, fail, args) {
        var source = args[0],
            target = args[1],
            headers = args[4],
            fileWriter;

        if (!checkURL(source)) {
            fail(new FileTransferError(FileTransferError.INVALID_URL_ERR, source, target));
        }

        xhr = new XMLHttpRequest();

        function writeFile(entry) {
            entry.nativeEntry.createWriter(function (writer) {
                fileWriter = writer;
                fileWriter.onwriteend = function (evt) {
                    if (!evt.target.error) {
                        win(entry);
                    } else {
                        fail(evt.target.error);
                    }
                };
                fileWriter.onerror = function (evt) {
                    fail(evt.target.error);
                };
                fileWriter.write(new Blob([xhr.response]));
            }, function (error) {
                fail(error);
            });
        }

        xhr.onerror = function (e) {
            fail(new FileTransferError(FileTransferError.CONNECTION_ERR, source, target, xhr.status, xhr.response));
        };

        xhr.onload = function () {
            if (xhr.readyState === xhr.DONE) {
                if (xhr.status === 200 && xhr.response) {
                    nativeResolveLocalFileSystemURI(getParentPath(target), function (dir) {
                        dir.getFile(getFileName(target), {create: true}, writeFile, function (error) {
                            fail(new FileTransferError(FileTransferError.FILE_NOT_FOUND_ERR, source, target, xhr.status, xhr.response));
                        });
                    }, function (error) {
                        fail(new FileTransferError(FileTransferError.FILE_NOT_FOUND_ERR, source, target, xhr.status, xhr.response));
                    });
                } else if (xhr.status === 404) {
                    fail(new FileTransferError(FileTransferError.INVALID_URL_ERR, source, target, xhr.status, xhr.response));
                } else {
                    fail(new FileTransferError(FileTransferError.CONNECTION_ERR, source, target, xhr.status, xhr.response));
                }
            }
        };
        xhr.onprogress = function (evt) {
            win(evt);
        };
        xhr.open("GET", source, true);
        for (var header in headers) {
            if (headers.hasOwnProperty(header)) {
                xhr.setRequestHeader(header, headers[header]);
            }
        }
        xhr.responseType = "blob";
        xhr.send();
        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "async"};
    }
};
