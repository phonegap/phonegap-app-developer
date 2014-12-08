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

exports.defineAutoTests = function () {

    describe('FileTransfer', function () {
        // https://github.com/apache/cordova-labs/tree/cordova-filetransfer
        var server = "http://cordova-filetransfer.jitsu.com";
        var server_with_credentials = "http://cordova_user:cordova_password@cordova-filetransfer.jitsu.com";

        beforeEach(function () {
            jasmine.Expectation.addMatchers({
                toFailWithMessage: function () {
                    return {
                        compare: function (actual, customMessage) {
                            var pass = false;
                            if (customMessage === undefined) {
                                customMessage = "Forced failure: wrong callback called";
                            }
                            return {
                                pass: pass,
                                message: customMessage
                            };
                        }
                    };
                }
            });


        });
        var createFail = function (done, message) {
            return function () {
                expect(true).toFailWithMessage(message);
                done();
            }
        }

        var root, temp_root, persistent_root;
        it("Filesystem set-up should execute without failure", function (done) {
            var onError = function (e) {
                expect(true).toFailWithMessage('[ERROR] Problem setting up root filesystem for test running! ' + JSON.stringify(e));
                done();
            };

            var getTemp = function () {
                window.requestFileSystem(LocalFileSystem.TEMPORARY, 0,
                function (fileSystem) {
                    console.log('File API test Init: Setting TEMPORARY FS.');
                    temp_root = fileSystem.root; // set in file.tests.js
                    done();
                }, onError);
                expect(true).toBe(true);
            };

            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
            function (fileSystem) {
                console.log('File API test Init: Setting PERSISTENT FS.');
                root = fileSystem.root; // set in file.tests.js
                persistent_root = root;
                getTemp();
            }, onError);
        });


        // deletes and re-creates the specified content
        var writeFile = function (fileName, fileContent, success, error) {

            var callback = function () {
                root.getFile(fileName, { create: true }, function (fileEntry) {
                    fileEntry.createWriter(function (writer) {

                        writer.onwrite = function (evt) {
                            success(fileEntry);
                        };

                        writer.onabort = function (evt) {
                            error(evt);
                        };

                        writer.error = function (evt) {
                            error(evt);
                        };

                        writer.write(fileContent + "\n");
                    }, error);
                }, error);
            };

            root.getFile(fileName, null, function (entry) {
                entry.remove(callback, callback);
            }, callback)
        };

        var readFileEntry = function (entry, success, error) {
            entry.file(function (file) {
                var reader = new FileReader();
                reader.onerror = error;
                reader.onload = function (e) {
                    success(reader.result);
                };
                reader.readAsText(file);
            }, error);
        };

        var getMalformedUrl = function () {
            if (cordova.platformId === 'android' || cordova.platformId === 'amazon-fireos') {
                // bad protocol causes a MalformedUrlException on Android
                return "httpssss://example.com";
            } else {
                // iOS doesn't care about protocol, space in hostname causes error
                return "httpssss://exa mple.com";
            }
        };

        // deletes file, if it exists
        var deleteFile = function (fileName, done) {
            var callback = function () { done(); };
            root.getFile(fileName, null,
                // remove file system entry
                function (entry) {
                    entry.remove(callback, callback);
                },
                // doesn't exist
                callback);
        };

        it("filetransfer.spec.1 should exist and be constructable", function () {
            var ft = new FileTransfer();
            expect(ft).toBeDefined();
        });
        it("filetransfer.spec.2 should contain proper functions", function () {
            var ft = new FileTransfer();
            expect(typeof ft.upload).toBe('function');
            expect(typeof ft.download).toBe('function');
        });

        describe('FileTransferError', function () {
            it("filetransfer.spec.3 FileTransferError constants should be defined", function () {
                expect(FileTransferError.FILE_NOT_FOUND_ERR).toBe(1);
                expect(FileTransferError.INVALID_URL_ERR).toBe(2);
                expect(FileTransferError.CONNECTION_ERR).toBe(3);
            });
        });

        describe('download method', function () {

            // NOTE: if download tests are failing, check the white list
            //
            //   <access origin="httpssss://example.com"/>
            //   <access origin="apache.org" subdomains="true" />
            //   <access origin="cordova-filetransfer.jitsu.com"/>

            var localFileName = "";
            afterEach(function (done) {
                deleteFile(localFileName, done);
            });

            it("filetransfer.spec.4 should be able to download a file using http", function (done) {
                var fileFail = createFail(done, "File error callback should not have been called");
                var downloadFail = createFail(done, "Download error callback should not have been called");
                var remoteFile = server + "/robots.txt"
                localFileName = remoteFile.substring(remoteFile.lastIndexOf('/') + 1);
                var lastProgressEvent = null;

                var fileWin = function (blob) {
                    expect(lastProgressEvent.loaded).not.toBeGreaterThan(blob.size);
                    done();
                };

                var downloadWin = function (entry) {
                    expect(entry.name).toBe(localFileName);
                    expect(lastProgressEvent.loaded).toBeGreaterThan(1);
                    if (lastProgressEvent.lengthComputable) {
                        expect(lastProgressEvent.total).not.toBeLessThan(lastProgressEvent.loaded);
                    } else {
                        expect(lastProgressEvent.total).toBe(0);
                    }
                    entry.file(fileWin, fileFail);
                };

                var ft = new FileTransfer();
                ft.onprogress = function (e) {
                    lastProgressEvent = e;
                }
                ft.download(remoteFile, root.toURL() + "/" + localFileName, downloadWin, downloadFail);
            });
            it("filetransfer.spec.5 should be able to download a file using http basic auth", function (done) {
                var downloadFail = createFail(done, "Download error callback should not have been called");
                var remoteFile = server_with_credentials + "/download_basic_auth"
                localFileName = remoteFile.substring(remoteFile.lastIndexOf('/') + 1);
                var lastProgressEvent = null;

                var downloadWin = function (entry) {
                    expect(entry.name).toBe(localFileName);
                    expect(lastProgressEvent.loaded).toBeGreaterThan(1);
                    if (lastProgressEvent.lengthComputable) {
                        expect(lastProgressEvent.total).not.toBeLessThan(lastProgressEvent.loaded);
                    } else {
                        expect(lastProgressEvent.total).toBe(0);
                    }
                    done();
                };

                var ft = new FileTransfer();
                ft.onprogress = function (e) {
                    lastProgressEvent = e;
                };
                ft.download(remoteFile, root.toURL() + "/" + localFileName, downloadWin, downloadFail);
            });
            it("filetransfer.spec.6 should get http status on basic auth failure", function (done) {
                var downloadWin = createFail(done, "Download success callback should not have been called");
                var remoteFile = server + "/download_basic_auth";
                localFileName = remoteFile.substring(remoteFile.lastIndexOf('/') + 1);
                var downloadFail = function (error) {
                    expect(error.http_status).toBe(401);
                    expect(error.http_status).not.toBe(404, "Ensure " + remoteFile + " is in the white list");
                    done();
                };

                var ft = new FileTransfer();
                ft.download(remoteFile, root.toURL() + "/" + localFileName, downloadWin, downloadFail);
            });
            it("filetransfer.spec.7 should be able to download a file using file:// (when hosted from file://)", function (done) {
                var downloadFail = createFail(done, "Download error callback should not have been called");
                var remoteFile = window.location.protocol + '//' + window.location.pathname.replace(/ /g, '%20');
                localFileName = remoteFile.substring(remoteFile.lastIndexOf('/') + 1);
                var lastProgressEvent = null;

                if (!/^file/.exec(remoteFile) && cordova.platformId !== 'blackberry10') {
                    expect(remoteFile).toMatch(/^file:/);
                    done();
                    return;
                }

                var downloadWin = function (entry) {
                    expect(entry.name).toBe(localFileName);
                    expect(lastProgressEvent.loaded).toBeGreaterThan(1);
                    if (lastProgressEvent.lengthComputable) {
                        expect(lastProgressEvent.total).not.toBeLessThan(lastProgressEvent.loaded);
                    } else {
                        expect(lastProgressEvent.total).toBe(0);
                    }
                    done();
                };

                var ft = new FileTransfer();
                ft.onprogress = function (e) {
                    lastProgressEvent = e;
                };
                ft.download(remoteFile, root.toURL() + "/" + localFileName, downloadWin, downloadFail);
            });
            it("filetransfer.spec.8 should be able to download a file using https", function (done) {
                var downloadFail = createFail(done, "Download error callback should not have been called. Ensure " + remoteFile + " is in the white-list");
                var fileFail = createFail(done, "File error callback should not have been called");
                var remoteFile = "https://www.apache.org/licenses/";
                localFileName = 'httpstest.html';
                var lastProgressEvent = null;

                var downloadWin = function (entry) {
                    readFileEntry(entry, fileWin, fileFail);
                };
                var fileWin = function (content) {
                    expect(content).toMatch(/The Apache Software Foundation/);
                    expect(lastProgressEvent.loaded).not.toBeGreaterThan(content.length);
                    done();
                };

                var ft = new FileTransfer();
                ft.onprogress = function (e) {
                    lastProgressEvent = e;
                };
                ft.download(remoteFile, root.toURL() + "/" + localFileName, downloadWin, downloadFail);
            });
            it("filetransfer.spec.9 should not leave partial file due to abort", function (done) {
                var downloadWin = createFail(done, "Download success callback should not have been called");
                var fileWin = createFail(done, "File existed after abort");
                var remoteFile = 'http://cordova.apache.org/downloads/logos_2.zip';
                localFileName = remoteFile.substring(remoteFile.lastIndexOf('/') + 1);
                var startTime = +new Date();

                var downloadFail = function (e) {
                    expect(e.code).toBe(FileTransferError.ABORT_ERR);
                    root.getFile(localFileName, null, fileWin, function () {
                        done();
                    });
                };

                var ft = new FileTransfer();
                ft.onprogress = function (e) {
                    if (e.loaded > 0) {
                        ft.abort();
                    }
                };
                ft.download(remoteFile, root.toURL() + "/" + localFileName, downloadWin, downloadFail);
            });
            it("filetransfer.spec.10 should be stopped by abort() right away", function (done) {
                var downloadWin = createFail(done, "Download success callback should not have been called");
                var remoteFile = 'http://cordova.apache.org/downloads/BlueZedEx.mp3';
                localFileName = remoteFile.substring(remoteFile.lastIndexOf('/') + 1);
                var startTime = +new Date();

                var downloadFail = function (e) {
                    expect(e.code).toBe(FileTransferError.ABORT_ERR);
                    expect(new Date() - startTime).toBeLessThan(300);
                    done();
                };
                var ft = new FileTransfer();
                ft.abort(); // should be a no-op.
                ft.download(remoteFile, root.toURL() + "/" + localFileName, downloadWin, downloadFail);
                ft.abort();
                ft.abort(); // should be a no-op.
            });
            it("filetransfer.spec.11 should call the error callback on abort()", function (done) {
                var downloadWin = createFail(done, "Download success callback should not have been called");
                var remoteFile = 'http://cordova.apache.org/downloads/BlueZedEx.mp3';
                localFileName = remoteFile.substring(remoteFile.lastIndexOf('/') + 1);
                var startTime = +new Date();

                var downloadFail = function (e) {
                    console.log("Abort called");
                    done();
                };
                var ft = new FileTransfer();
                ft.abort(); // should be a no-op.
                ft.download(remoteFile, root.toURL() + "/" + localFileName, downloadWin, downloadFail);
                ft.abort();
                ft.abort(); // should be a no-op.
            });
            it("filetransfer.spec.12 should get http status on failure", function (done) {
                var downloadWin = createFail(done, "Download success callback should not have been called");
                var remoteFile = server + "/404";
                localFileName = remoteFile.substring(remoteFile.lastIndexOf('/') + 1);
                var downloadFail = function (error) {
                    expect(error.http_status).toBe(404);
                    expect(error.http_status).not.toBe(401, "Ensure " + remoteFile + " is in the white list");
                    done();
                };

                var ft = new FileTransfer();
                ft.download(remoteFile, root.toURL() + "/" + localFileName, downloadWin, downloadFail);
            });
            it("filetransfer.spec.13 should get response body on failure", function (done) {
                var downloadWin = createFail(done, "Download success callback should not have been called");
                var remoteFile = server + "/404";
                localFileName = remoteFile.substring(remoteFile.lastIndexOf('/') + 1);
                var downloadFail = function (error) {
                    expect(error.body).toBeDefined();
                    expect(error.body).toMatch('You requested a 404');
                    done();
                };

                var ft = new FileTransfer();
                ft.download(remoteFile, root.toURL() + "/" + localFileName, downloadWin, downloadFail);
            });
            it("filetransfer.spec.14 should handle malformed urls", function (done) {
                var downloadWin = createFail(done, "Download success callback should not have been called");
                var remoteFile = getMalformedUrl();
                localFileName = "download_malformed_url.txt";
                var downloadFail = function (error) {
                    // Note: Android needs the bad protocol to be added to the access list
                    // <access origin=".*"/> won't match because ^https?:// is prepended to the regex
                    // The bad protocol must begin with http to avoid automatic prefix
                    expect(error.http_status).not.toBe(401, "Ensure " + remoteFile + " is in the white list");
                    expect(error.code).toBe(FileTransferError.INVALID_URL_ERR);
                    done();
                };

                var ft = new FileTransfer();
                ft.download(remoteFile, root.toURL() + "/" + localFileName, downloadWin, downloadFail);
            });
            it("filetransfer.spec.15 should handle unknown host", function (done) {
                var downloadWin = createFail(done, "Download success callback should not have been called");
                var remoteFile = "http://foobar.apache.org/index.html";
                localFileName = remoteFile.substring(remoteFile.lastIndexOf('/') + 1);
                var downloadFail = function (error) {
                    expect(error.code).toBe(FileTransferError.CONNECTION_ERR);
                    done();
                };

                var ft = new FileTransfer();
                ft.download(remoteFile, root.toURL() + "/" + localFileName, downloadWin, downloadFail);
            });
            it("filetransfer.spec.16 should handle bad file path", function (done) {
                var downloadWin = createFail(done, "Download success callback should not have been called");
                var remoteFile = server;
                var badFilePath = "c:\\54321";

                var ft = new FileTransfer();
                ft.download(remoteFile, badFilePath, downloadWin, function () {
                    done();
                });
            });
            it("filetransfer.spec.17 progress should work with gzip encoding", function (done) {
                //lengthComputable false on bb10 when downloading gzip 
                if (cordova.platformId === 'blackberry10') {
                    done();
                    return;
                }

                var downloadFail = createFail(done, "Download error callback should not have been called");
                var remoteFile = "http://www.apache.org/";
                localFileName = "index.html";
                var lastProgressEvent = null;

                var downloadWin = function (entry) {
                    expect(entry.name).toBe(localFileName);
                    expect(lastProgressEvent.loaded).toBeGreaterThan(1, 'loaded');
                    expect(lastProgressEvent.total).not.toBeLessThan(lastProgressEvent.loaded);
                    expect(lastProgressEvent.lengthComputable).toBe(true, 'lengthComputable');
                    done();
                };

                var ft = new FileTransfer();
                ft.onprogress = function (e) {
                    lastProgressEvent = e;
                };
                ft.download(remoteFile, root.toURL() + "/" + localFileName, downloadWin, downloadFail);
            });
        });

        describe('upload method', function () {

            var localFileName = "";
            afterEach(function (done) {
                deleteFile(localFileName, done);
            });

            it("filetransfer.spec.18 should be able to upload a file", function (done) {
                var uploadFail = createFail(done, "Upload error callback should not have been called");
                var fileFail = createFail(done, "Error writing file to be uploaded");
                var remoteFile = server + "/upload";
                localFileName = "upload.txt";
                var fileContents = 'This file should upload';
                var lastProgressEvent = null;

                var uploadWin = function (uploadResult) {
                    expect(uploadResult.bytesSent).toBeGreaterThan(0);
                    expect(uploadResult.responseCode).toBe(200);
                    var obj = null;
                    try {
                        obj = JSON.parse(uploadResult.response);
                        expect(obj.fields).toBeDefined();
                        expect(obj.fields.value1).toBe("test");
                        expect(obj.fields.value2).toBe("param");
                    } catch (e) {
                        expect(obj).not.toBeNull('returned data from server should be valid json');
                    }
                    expect(lastProgressEvent).not.toBeNull('expected progress events');
                    if (cordova.platformId == 'ios') {
                        expect(uploadResult.headers && uploadResult.headers['Content-Type']).toBeDefined('Expected content-type header to be defined.');
                    }
                    done();
                };

                var fileWin = function (fileEntry) {
                    ft = new FileTransfer();

                    var options = new FileUploadOptions();
                    options.fileKey = "file";
                    options.fileName = localFileName;
                    options.mimeType = "text/plain";

                    var params = new Object();
                    params.value1 = "test";
                    params.value2 = "param";
                    options.params = params;

                    ft.onprogress = function (e) {
                        lastProgressEvent = e;
                        expect(e.lengthComputable).toBe(true);
                        expect(e.total).toBeGreaterThan(0);
                        expect(e.loaded).toBeGreaterThan(0);
                        expect(lastProgressEvent.total).not.toBeLessThan(lastProgressEvent.loaded);
                    };

                    // removing options cause Android to timeout
                    ft.upload(fileEntry.toURL(), remoteFile, uploadWin, uploadFail, options);
                };
                writeFile(localFileName, fileContents, fileWin, fileFail);
            });
            it("filetransfer.spec.19 should be able to upload a file with http basic auth", function (done) {
                var uploadFail = createFail(done, "Upload error callback should not have been called");
                var fileFail = createFail(done, "Error writing file to be uploaded");
                var remoteFile = server_with_credentials + "/upload_basic_auth";
                localFileName = "upload.txt";
                var fileContents = 'This file should upload';
                var lastProgressEvent = null;

                var ft = new FileTransfer();
                ft.onprogress = function (e) {
                    expect(e.lengthComputable).toBe(true);
                    expect(e.total).toBeGreaterThan(0);
                    expect(e.loaded).toBeGreaterThan(0);
                    lastProgressEvent = e;
                };

                var uploadWin = function (uploadResult) {
                    expect(uploadResult.bytesSent).toBeGreaterThan(0);
                    expect(uploadResult.responseCode).toBe(200);
                    var obj = null;
                    try {
                        obj = JSON.parse(uploadResult.response);
                        expect(obj.fields).toBeDefined();
                        expect(obj.fields.value1).toBe("test");
                        expect(obj.fields.value2).toBe("param");
                    } catch (e) {
                        expect(obj).not.toBeNull('returned data from server should be valid json');
                    }
                    expect(lastProgressEvent).not.toBeNull('expected progress events');
                    expect(lastProgressEvent.loaded).toBeGreaterThan(1, 'loaded');
                    expect(lastProgressEvent.total).not.toBeLessThan(lastProgressEvent.loaded);
                    done();
                };

                var fileWin = function (fileEntry) {
                    var options = new FileUploadOptions();
                    options.fileKey = "file";
                    options.fileName = localFileName;
                    options.mimeType = "text/plain";

                    var params = new Object();
                    params.value1 = "test";
                    params.value2 = "param";
                    options.params = params;


                    // removing options cause Android to timeout
                    ft.upload(fileEntry.toURL(), remoteFile, uploadWin, uploadFail, options);
                };

                writeFile(localFileName, fileContents, fileWin, fileFail);
            });
            it("filetransfer.spec.21 should be stopped by abort() right away.", function (done) {
                var uploadWin = createFail(done, "Upload success callback should not have been called");
                var fileFail = createFail(done, "Error writing file to be uploaded");
                var remoteFile = server + "/upload";
                localFileName = "upload.txt";
                var startTime;

                var uploadFail = function (e) {
                    expect(e.code).toBe(FileTransferError.ABORT_ERR);
                    expect(new Date() - startTime).toBeLessThan(300);
                    done();
                };

                var fileWin = function (fileEntry) {
                    ft = new FileTransfer();

                    var options = new FileUploadOptions();
                    options.fileKey = "file";
                    options.fileName = localFileName;
                    options.mimeType = "text/plain";

                    startTime = +new Date();
                    // removing options cause Android to timeout
                    ft.abort(); // should be a no-op.
                    ft.upload(fileEntry.toURL(), remoteFile, uploadWin, uploadFail, options);
                    ft.abort();
                    ft.abort(); // should be a no-op.
                };

                writeFile(localFileName, new Array(10000).join('aborttest!'), fileWin, fileFail);
            });
            it("filetransfer.spec.12 should get http status on failure", function (done) {
                var uploadWin = createFail(done, "Upload success callback should not have been called");
                var fileFail = createFail(done, "Error writing file to be uploaded");
                var remoteFile = server + "/403";
                localFileName = "upload_expect_fail.txt";
                var uploadFail = function (error) {
                    expect(error.http_status).toBe(403);
                    expect(error.http_status).not.toBe(401, "Ensure " + remoteFile + " is in the white list");
                    done();
                };

                var fileWin = function (fileEntry) {
                    var ft = new FileTransfer();

                    var options = new FileUploadOptions();
                    options.fileKey = "file";
                    options.fileName = fileEntry.name;
                    options.mimeType = "text/plain";

                    ft.upload(fileEntry.toURL(), remoteFile, uploadWin, uploadFail, options);
                };

                writeFile(localFileName, "this file should fail to upload", fileWin, fileFail);
            });
            it("filetransfer.spec.14 should handle malformed urls", function (done) {
                var uploadWin = createFail(done, "Upload success callback should not have been called");
                var fileFail = createFail(done, "Error writing file to be uploaded");
                var remoteFile = getMalformedUrl();
                localFileName = "malformed_url.txt";

                var uploadFail = function (error) {
                    expect(error.code).toBe(FileTransferError.INVALID_URL_ERR);
                    expect(error.http_status).not.toBe(401, "Ensure " + remoteFile + " is in the white list");
                    done();
                };
                var fileWin = function (fileEntry) {
                    var ft = new FileTransfer();
                    ft.upload(fileEntry.toURL(), remoteFile, uploadWin, uploadFail, {});
                };

                writeFile(localFileName, "Some content", fileWin, fileFail);
            });
            it("filetransfer.spec.15 should handle unknown host", function (done) {
                var uploadWin = createFail(done, "Upload success callback should not have been called");
                var fileFail = createFail(done, "Error writing file to be uploaded");
                var remoteFile = "http://foobar.apache.org/robots.txt";
                localFileName = remoteFile.substring(remoteFile.lastIndexOf('/') + 1);

                var uploadFail = function (error) {
                    expect(error.code).toBe(FileTransferError.CONNECTION_ERR);
                    expect(error.http_status).not.toBe(401, "Ensure " + remoteFile + " is in the white list");
                    done();
                };
                var fileWin = function (fileEntry) {
                    var ft = new FileTransfer();
                    ft.upload(fileEntry.toURL(), remoteFile, uploadWin, uploadFail, {});
                };

                writeFile(localFileName, "# allow all", fileWin, fileFail);
            });
            it("filetransfer.spec.25 should handle missing file", function (done) {
                var uploadWin = createFail(done, "Upload success callback should not have been called");
                var remoteFile = server + "/upload";
                localFileName = "does_not_exist.txt";

                var uploadFail = function (error) {
                    expect(error.code).toBe(FileTransferError.FILE_NOT_FOUND_ERR);
                    expect(error.http_status).not.toBe(401, "Ensure " + remoteFile + " is in the white list");
                    done();
                };

                var ft = new FileTransfer();
                ft.upload(root.toURL() + "/" + localFileName, remoteFile, uploadWin, uploadFail);
            });
            it("filetransfer.spec.16 should handle bad file path", function (done) {
                var uploadWin = createFail(done, "Upload success callback should not have been called");
                var remoteFile = server + "/upload";

                var uploadFail = function (error) {
                    expect(error.http_status).not.toBe(401, "Ensure " + remoteFile + " is in the white list");
                    done();
                };

                var ft = new FileTransfer();
                ft.upload("/usr/local/bad/file/path.txt", remoteFile, uploadWin, uploadFail);
            });
            it("filetransfer.spec.27 should be able to set custom headers", function (done) {
                var uploadFail = createFail(done, "Upload error callback should not have been called");
                var fileFail = createFail(done, "Error writing file to be uploaded");
                var remoteFile = "http://whatheaders.com";
                localFileName = "upload.txt";

                var uploadWin = function (uploadResult) {
                    expect(uploadResult.bytesSent).toBeGreaterThan(0);
                    expect(uploadResult.responseCode).toBe(200);
                    expect(uploadResult.response).toBeDefined();
                    var responseHtml = decodeURIComponent(uploadResult.response);
                    expect(responseHtml).toMatch(/CustomHeader1[\s\S]*CustomValue1/i);
                    expect(responseHtml).toMatch(/CustomHeader2[\s\S]*CustomValue2[\s\S]*CustomValue3/i, "Should allow array values");
                    done();
                };

                var fileWin = function (fileEntry) {
                    ft = new FileTransfer();

                    var options = new FileUploadOptions();
                    options.fileKey = "file";
                    options.fileName = localFileName;
                    options.mimeType = "text/plain";

                    var params = new Object();
                    params.value1 = "test";
                    params.value2 = "param";
                    options.params = params;
                    options.headers = {
                        "CustomHeader1": "CustomValue1",
                        "CustomHeader2": ["CustomValue2", "CustomValue3"],
                    };

                    // removing options cause Android to timeout
                    ft.upload(fileEntry.toURL(), remoteFile, uploadWin, uploadFail, options);
                };

                writeFile(localFileName, "this file should upload", fileWin, fileFail);
            });
        });

        describe('Backwards compatibility', function () {
            /* These specs exist to test that the previously supported API still works with
             * the new version of file-transfer.
             * They rely on an undocumented interface to File which provides absolute file
             * paths, which are not used internally anymore.
             * If that interface is not present, then these tests will silently succeed.
             */
            var localFileName = "";
            var unsupportedWasCalled = false;
            var lastProgressEvent = null;
            afterEach(function (done) {
                if (!unsupportedWasCalled) {
                    console.log("Unsupported was not called");
                    expect(lastProgressEvent).not.toBeNull('expected progress events');
                    expect(lastProgressEvent.loaded).toBeGreaterThan(1);
                    expect(lastProgressEvent.total).not.toBeLessThan(lastProgressEvent.loaded);
                }
                unsupportedWasCalled = false;
                deleteFile(localFileName, done);
            });

            it("filetransfer.spec.28 should be able to download a file using local paths", function (done) {
                var downloadFail = createFail(done, "Download error callback should not have been called");
                var remoteFile = server + "/robots.txt"
                localFileName = remoteFile.substring(remoteFile.lastIndexOf('/') + 1);
                var localURL = root.toURL() + "/" + localFileName;
                lastProgressEvent = null;

                var downloadWin = function (entry) {
                    expect(entry.name).toBe(localFileName);
                    expect(lastProgressEvent.loaded).toBeGreaterThan(1);
                    done();
                };
                var unsupportedOperation = function () {
                    console.log("Operation not supported");
                    unsupportedWasCalled = true;
                    done();
                };

                /* This is an undocumented interface to File which exists only for testing
                     * backwards compatibilty. By obtaining the raw filesystem path of the download
                     * location, we can pass that to ft.download() to make sure that previously-stored
                     * paths are still valid.
                     */
                cordova.exec(function (localPath) {
                    var ft = new FileTransfer();
                    ft.onprogress = function (e) {
                        lastProgressEvent = e;
                        if (lastProgressEvent.lengthComputable) {
                            expect(lastProgressEvent.total).not.toBeLessThan(lastProgressEvent.loaded);
                        } else {
                            expect(lastProgressEvent.total).toBe(0);
                        }
                    };
                    ft.download(remoteFile, localPath, downloadWin, downloadFail);
                }, unsupportedOperation, 'File', '_getLocalFilesystemPath', [localURL]);
            });
            it("filetransfer.spec.29 should be able to upload a file using local paths", function (done) {
                var uploadFail = createFail(done, "Upload error callback should not have been called");
                var fileFail = createFail(done, "Error writing file to be uploaded");
                var remoteFile = server + "/upload";
                localFileName = "upload.txt";
                var fileContents = 'This file should upload';
                var unsupportedOperation = function () {
                    console.log("Operation not supported");
                    unsupportedWasCalled = true;
                    done();
                };
                lastProgressEvent = null;

                var uploadWin = function (uploadResult) {
                    expect(uploadResult.bytesSent).toBeGreaterThan(0);
                    expect(uploadResult.responseCode).toBe(200);
                    var obj = null;
                    try {
                        obj = JSON.parse(uploadResult.response);
                        expect(obj.fields).toBeDefined();
                        expect(obj.fields.value1).toBe("test");
                        expect(obj.fields.value2).toBe("param");
                    } catch (e) {
                        expect(obj).not.toBeNull('returned data from server should be valid json');
                    }
                    done();
                };

                var fileWin = function (fileEntry) {
                    ft = new FileTransfer();

                    var options = new FileUploadOptions();
                    options.fileKey = "file";
                    options.fileName = localFileName;
                    options.mimeType = "text/plain";

                    var params = new Object();
                    params.value1 = "test";
                    params.value2 = "param";
                    options.params = params;

                    ft.onprogress = function (e) {
                        expect(e.lengthComputable).toBe(true);
                        expect(e.total).toBeGreaterThan(0);
                        expect(e.loaded).toBeGreaterThan(0);
                        lastProgressEvent = e;
                        console.log("Setting");
                    };

                    // removing options cause Android to timeout

                    /* This is an undocumented interface to File which exists only for testing
                     * backwards compatibilty. By obtaining the raw filesystem path of the download
                     * location, we can pass that to ft.download() to make sure that previously-stored
                     * paths are still valid.
                     */
                    cordova.exec(function (localPath) {
                        ft.upload(localPath, remoteFile, uploadWin, uploadFail, options);
                    }, unsupportedOperation, 'File', '_getLocalFilesystemPath', [fileEntry.toURL()]);

                };

                writeFile(localFileName, fileContents, fileWin, fileFail);
            });
        });

        describe('native URL interface', function (done) {
            var localFileName = "";
            afterEach(function (done) {
                deleteFile(localFileName, done);
            });

            it("filetransfer.spec.30 downloaded file entries should have a toNativeURL method", function (done) {
                var downloadFail = createFail(done, "Download error callback should not have been called");
                var remoteFile = server + "/robots.txt";
                localFileName = remoteFile.substring(remoteFile.lastIndexOf('/') + 1) + ".spec30";

                var downloadWin = function (entry) {
                    expect(entry.toNativeURL).toBeDefined();
                    expect(typeof entry.toNativeURL).toBe("function");
                    var nativeURL = entry.toNativeURL();
                    expect(typeof nativeURL).toBe("string");
                    expect(nativeURL.substring(0, 7)).toBe('file://');
                    done();
                };

                var ft = new FileTransfer();
                ft.download(remoteFile, root.toURL() + "/" + localFileName, downloadWin, downloadFail);
            });
        });
    });
};

/******************************************************************************/
/******************************************************************************/
/******************************************************************************/

exports.defineManualTests = function (contentEl, createActionButton) {
    var imageURL = "http://apache.org/images/feather-small.gif";
    var videoURL = "http://techslides.com/demos/sample-videos/small.mp4";

    function clearResults() {
        results = document.getElementById("info");
        results.innerHTML = '';
    }

    function downloadImg(source, urlFn, element, directory) {
        var filename = source.substring(source.lastIndexOf("/") + 1);
        filename = directory + filename || filename;
        function download(fileSystem) {
            var ft = new FileTransfer();
            console.log("Starting download");
            ft.download(source, fileSystem.root.toURL() + filename, function (entry) {
                console.log("Download complete")
                element.src = urlFn(entry)
                console.log("Src URL is " + element.src);
                console.log("Inserting element");
                document.getElementById("info").appendChild(element);
            }, function (e) { console.log("ERROR: ft.download " + e.code); });
        }
        console.log("Requesting filesystem");
        clearResults();
        requestFileSystem(TEMPORARY, 0, function (fileSystem) {
            console.log("Checking for existing file");
            if (directory != undefined) {
                console.log("Checking for existing directory.");
                fileSystem.root.getDirectory(directory, {}, function (dirEntry) {
                    dirEntry.removeRecursively(function () {
                        download(fileSystem);
                    }, function (e) { console.log("ERROR: dirEntry.removeRecursively") });
                }, function () {
                    download(fileSystem);
                });
            } else {
                fileSystem.root.getFile(filename, { create: false }, function (entry) {
                    console.log("Removing existing file");
                    entry.remove(function () {
                        download(fileSystem);
                    }, function (e) { console.log("ERROR: entry.remove"); });
                }, function () {
                    download(fileSystem);
                });
            }
        }, function (e) { console.log("ERROR: requestFileSystem"); });
    }

    /******************************************************************************/

    var file_transfer_tests = '<h2>Image File Transfer Tests</h2>' +
        '<h3>The following tests should display an image of the Apache feather in the status box</h3>' +
        '<div id="cdv_image"></div>' +
        '<div id="native_image"></div>' +
        '<div id="non-existent_dir"></div>' +
        '<h2>Video File Transfer Tests</h2>' +
        '<h3>The following tests should display a video in the status box. The video should play when play is pressed</h3>' +
        '<div id="cdv_video"></div>' +
        '<div id="native_video"></div>';

    contentEl.innerHTML = '<div id="info"></div>' +
        file_transfer_tests;

    createActionButton('Download and display img (cdvfile)', function () {
        downloadImg(imageURL, function (entry) { return entry.toURL(); }, new Image());
    }, 'cdv_image');

    createActionButton('Download and display img (native)', function () {
        downloadImg(imageURL, function (entry) { return entry.toNativeURL(); }, new Image);
    }, 'native_image');

    createActionButton('Download to a non-existent dir (should work)', function () {
        downloadImg(imageURL, function (entry) { return entry.toURL(); }, new Image, '/nonExistentDirTest/');
    }, 'non-existent_dir');

    createActionButton('Download and play video (cdvfile)', function () {
        var videoElement = document.createElement('video');
        videoElement.controls = "controls";
        downloadImg(videoURL, function (entry) { return entry.toURL(); }, videoElement);
    }, 'cdv_video');

    createActionButton('Download and play video (native)', function () {
        var videoElement = document.createElement('video');
        videoElement.controls = "controls";
        downloadImg(videoURL, function (entry) { return entry.toNativeURL(); }, videoElement)
    }, 'native_video');
};
