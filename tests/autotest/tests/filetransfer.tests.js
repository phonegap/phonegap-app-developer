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

describe('FileTransfer', function() {
    // https://github.com/apache/cordova-labs/tree/cordova-filetransfer
    var server = "http://cordova-filetransfer.jitsu.com";
    var server_with_credentials = "http://cordova_user:cordova_password@cordova-filetransfer.jitsu.com";

    // deletes and re-creates the specified content
    var writeFile = function(fileName, fileContent, success, error) {
        deleteFile(fileName, function() {
            root.getFile(fileName, {create: true}, function(fileEntry) {
                fileEntry.createWriter(function (writer) {

                    writer.onwrite = function(evt) {
                        success(fileEntry);
                    };

                    writer.onabort = function(evt) {
                        error(evt);
                    };

                    writer.error = function(evt) {
                        error(evt);
                    };

                    writer.write(fileContent + "\n");
                }, error);
            }, error);
        });
    };

    var readFileEntry = function(entry, success, error) {
        entry.file(function(file) {
            var reader = new FileReader();
            reader.onerror = error;
            reader.onload = function(e) {
                success(reader.result);
            };
            reader.readAsText(file);
        }, error);
    };

    var getMalformedUrl = function() {
        if (device.platform.match(/Android/i)) {
            // bad protocol causes a MalformedUrlException on Android
            return "httpssss://example.com";
        } else {
            // iOS doesn't care about protocol, space in hostname causes error
            return "httpssss://exa mple.com";
        }
    };

    // deletes file, if it exists, then invokes callback
    var deleteFile = function(fileName, callback) {
        callback = callback || function() {};
        var spy = jasmine.createSpy().andCallFake(callback);
        root.getFile(fileName, null,
            // remove file system entry
            function(entry) {
                entry.remove(spy, spy);
            },
            // doesn't exist
            spy);
        waitsFor(function() { return spy.wasCalled; }, Tests.TEST_TIMEOUT);
    };

    it("filetransfer.spec.1 should exist and be constructable", function() {
        var ft = new FileTransfer();
        expect(ft).toBeDefined();
    });
    it("filetransfer.spec.2 should contain proper functions", function() {
        var ft = new FileTransfer();
        expect(typeof ft.upload).toBe('function');
        expect(typeof ft.download).toBe('function');
    });
    describe('FileTransferError', function() {
        it("filetransfer.spec.3 FileTransferError constants should be defined", function() {
            expect(FileTransferError.FILE_NOT_FOUND_ERR).toBe(1);
            expect(FileTransferError.INVALID_URL_ERR).toBe(2);
            expect(FileTransferError.CONNECTION_ERR).toBe(3);
        });
    });

    describe('download method', function() {

        // NOTE: if download tests are failing, check the white list
        //
        //   <access origin="httpssss://example.com"/>
        //   <access origin="apache.org" subdomains="true" />
        //   <access origin="cordova-filetransfer.jitsu.com"/>

        it("filetransfer.spec.4 should be able to download a file using http", function() {
            var fail = createDoNotCallSpy('downloadFail');
            var fileFail = createDoNotCallSpy('downloadFail');
            var remoteFile = server + "/robots.txt"
            var localFileName = remoteFile.substring(remoteFile.lastIndexOf('/')+1);
            var lastProgressEvent = null;

            var fileWin = jasmine.createSpy().andCallFake(function(blob) {
                expect(lastProgressEvent.loaded).not.toBeGreaterThan(blob.size);
            });

            var downloadWin = function(entry) {
                expect(entry.name).toBe(localFileName);
                expect(lastProgressEvent.loaded).toBeGreaterThan(1);
                if (lastProgressEvent.lengthComputable) {
                    expect(lastProgressEvent.total).not.toBeLessThan(lastProgressEvent.loaded);
                } else {
                    expect(lastProgressEvent.total).toBe(0);
                }
                entry.file(fileWin, fileFail);
            };

            this.after(function() {
                deleteFile(localFileName);
            });
            runs(function() {
                var ft = new FileTransfer();
                ft.onprogress = function(e) {
                    lastProgressEvent = e;
                };
                ft.download(remoteFile, root.toURL() + "/" + localFileName, downloadWin, fail);
            });

            waitsForAny(fileWin, fail, fileFail);
        });
        it("filetransfer.spec.5 should be able to download a file using http basic auth", function() {
            var fail = createDoNotCallSpy('downloadFail');
            var remoteFile = server_with_credentials + "/download_basic_auth"
            var localFileName = remoteFile.substring(remoteFile.lastIndexOf('/')+1);
            var lastProgressEvent = null;

            var downloadWin = jasmine.createSpy().andCallFake(function(entry) {
                expect(entry.name).toBe(localFileName);
                expect(lastProgressEvent.loaded).toBeGreaterThan(1);
                if (lastProgressEvent.lengthComputable) {
                    expect(lastProgressEvent.total).not.toBeLessThan(lastProgressEvent.loaded);
                } else {
                    expect(lastProgressEvent.total).toBe(0);
                }
            });

            this.after(function() {
                deleteFile(localFileName);
            });
            runs(function() {
                var ft = new FileTransfer();
                ft.onprogress = function(e) {
                    lastProgressEvent = e;
                };
                ft.download(remoteFile, root.toURL() + "/" + localFileName, downloadWin, fail);
            });

            waitsForAny(downloadWin, fail);
        });
        it("filetransfer.spec.6 should get http status on basic auth failure", function() {
            var downloadWin = createDoNotCallSpy('downloadWin');

            var remoteFile = server + "/download_basic_auth";
            var localFileName = remoteFile.substring(remoteFile.lastIndexOf('/')+1);
            var downloadFail = jasmine.createSpy().andCallFake(function(error) {
                expect(error.http_status).toBe(401);
                expect(error.http_status).not.toBe(404, "Ensure " + remoteFile + " is in the white list");
            });

            this.after(function() {
                deleteFile(localFileName);
            });
            runs(function() {
                var ft = new FileTransfer();
                ft.download(remoteFile, root.toURL() + "/" + localFileName, downloadWin, downloadFail);
            });

            waitsForAny(downloadWin, downloadFail);
        });        
        it("filetransfer.spec.7 should be able to download a file using file:// (when hosted from file://)", function() {
            var fail = createDoNotCallSpy('downloadFail');
            var remoteFile = window.location.href.replace(/\?.*/, '').replace(/ /g, '%20');
            var localFileName = remoteFile.substring(remoteFile.lastIndexOf('/')+1);
            var lastProgressEvent = null;

            if (!/^file/.exec(remoteFile) && cordova.platformId !== 'blackberry10') {
                expect(remoteFile).toMatch(/^file:/);
                return;
            }

            var downloadWin = jasmine.createSpy().andCallFake(function(entry) {
                expect(entry.name).toBe(localFileName);
                expect(lastProgressEvent.loaded).toBeGreaterThan(1);
                if (lastProgressEvent.lengthComputable) {
                    expect(lastProgressEvent.total).not.toBeLessThan(lastProgressEvent.loaded);
                } else {
                    expect(lastProgressEvent.total).toBe(0);
                }
            });

            this.after(function() {
                deleteFile(localFileName);
            });

            var ft = new FileTransfer();
            ft.onprogress = function(e) {
                lastProgressEvent = e;
            };
            ft.download(remoteFile, root.toURL() + "/" + localFileName, downloadWin, fail);

            waitsForAny(downloadWin, fail);
        });
        it("filetransfer.spec.8 should be able to download a file using https", function() {
            var remoteFile = "https://www.apache.org/licenses/";
            var localFileName = 'httpstest.html';
            var downloadFail = createDoNotCallSpy('downloadFail', 'Ensure ' + remoteFile + ' is in the white-list');
            var fileFail = createDoNotCallSpy('fileFail');
            var lastProgressEvent = null;
            var downloadWin = function(entry) {
                readFileEntry(entry, fileWin, fileFail);
            };
            var fileWin = jasmine.createSpy().andCallFake(function(content) {
                expect(content).toMatch(/The Apache Software Foundation/);
                expect(lastProgressEvent.loaded).not.toBeGreaterThan(content.length);
            });

            this.after(function() {
                deleteFile(localFileName);
            });

            var ft = new FileTransfer();
            ft.onprogress = function(e) {
                lastProgressEvent = e;
            };
            ft.download(remoteFile, root.toURL() + "/" + localFileName, downloadWin, downloadFail);

            waitsForAny(fileWin, downloadFail, fileFail);
        });
        it("filetransfer.spec.9 should not leave partial file due to abort", function() {
            var downloadWin = createDoNotCallSpy('downloadWin');
            var remoteFile = 'http://cordova.apache.org/downloads/logos_2.zip';
            var localFileName = remoteFile.substring(remoteFile.lastIndexOf('/')+1);
            var startTime = +new Date();

            var downloadFail = jasmine.createSpy().andCallFake(function(e) {
                expect(e.code).toBe(FileTransferError.ABORT_ERR);
                var didNotExistSpy = jasmine.createSpy();
                var existedSpy = createDoNotCallSpy('file existed after abort');
                root.getFile(localFileName, null, existedSpy, didNotExistSpy);
                waitsForAny(didNotExistSpy, existedSpy);
            });

            runs(function() {
                var ft = new FileTransfer();
                ft.onprogress = function(e) {
                    if (e.loaded > 0) {
                        ft.abort();
                    }
                };
                ft.download(remoteFile, root.toURL() + "/" + localFileName, downloadWin, downloadFail);
            });

            waitsForAny(downloadWin, downloadFail);
        });
        it("filetransfer.spec.10 should be stopped by abort() right away", function() {
            var downloadWin = createDoNotCallSpy('downloadWin');
            var remoteFile = 'http://cordova.apache.org/downloads/BlueZedEx.mp3';
            var localFileName = remoteFile.substring(remoteFile.lastIndexOf('/')+1);
            var startTime = +new Date();

            var downloadFail = jasmine.createSpy().andCallFake(function(e) {
                expect(e.code).toBe(FileTransferError.ABORT_ERR);
                expect(new Date() - startTime).toBeLessThan(300);
            });

            this.after(function() {
                deleteFile(localFileName);
            });
            runs(function() {
                var ft = new FileTransfer();
                ft.abort(); // should be a no-op.
                ft.download(remoteFile, root.toURL() + "/" + localFileName, downloadWin, downloadFail);
                ft.abort();
                ft.abort(); // should be a no-op.
            });

            waitsForAny(downloadWin, downloadFail);
        });
        it("filetransfer.spec.11 should call the error callback on abort()", function() {
            var downloadWin = createDoNotCallSpy('downloadWin');
           var downloadFail = jasmine.createSpy().andCallFake(function(e) { console.log("Abort called") });
            var remoteFile = 'http://cordova.apache.org/downloads/BlueZedEx.mp3';
            var localFileName = remoteFile.substring(remoteFile.lastIndexOf('/')+1);
            var startTime = +new Date();
                
            this.after(function() {
                deleteFile(localFileName);
            });
            runs(function() {
                var ft = new FileTransfer();
                ft.abort(); // should be a no-op.
                ft.download(remoteFile, root.toURL() + "/" + localFileName, downloadWin, downloadFail);
                ft.abort();
                ft.abort(); // should be a no-op.
            });
                
            waitsForAny(downloadFail);
        });
        it("filetransfer.spec.12 should get http status on failure", function() {
            var downloadWin = createDoNotCallSpy('downloadWin');

            var remoteFile = server + "/404";
            var localFileName = remoteFile.substring(remoteFile.lastIndexOf('/')+1);
            var downloadFail = jasmine.createSpy().andCallFake(function(error) {
                expect(error.http_status).toBe(404);
                expect(error.http_status).not.toBe(401, "Ensure " + remoteFile + " is in the white list");
            });

            this.after(function() {
                deleteFile(localFileName);
            });
            runs(function() {
                var ft = new FileTransfer();
                ft.download(remoteFile, root.toURL() + "/" + localFileName, downloadWin, downloadFail);
            });

            waitsForAny(downloadWin, downloadFail);
        });
        it("filetransfer.spec.13 should get response body on failure", function() {
            var downloadWin = createDoNotCallSpy('downloadWin');

            var remoteFile = server + "/404";
            var localFileName = remoteFile.substring(remoteFile.lastIndexOf('/')+1);
            var downloadFail = jasmine.createSpy().andCallFake(function(error) {
                expect(error.body).toBeDefined();
                expect(error.body).toMatch('You requested a 404');
            });

            this.after(function() {
                deleteFile(localFileName);
            });
            runs(function() {
                var ft = new FileTransfer();
                ft.download(remoteFile, root.toURL() + "/" + localFileName, downloadWin, downloadFail);
            });

            waitsForAny(downloadWin, downloadFail);
        });
        it("filetransfer.spec.14 should handle malformed urls", function() {
            var downloadWin = createDoNotCallSpy('downloadWin');

            var remoteFile = getMalformedUrl();
            var localFileName = "download_malformed_url.txt";
            var downloadFail = jasmine.createSpy().andCallFake(function(error) {
                // Note: Android needs the bad protocol to be added to the access list
                // <access origin=".*"/> won't match because ^https?:// is prepended to the regex
                // The bad protocol must begin with http to avoid automatic prefix
                expect(error.http_status).not.toBe(401, "Ensure " + remoteFile + " is in the white list");
                expect(error.code).toBe(FileTransferError.INVALID_URL_ERR);
            });

            this.after(function() {
                deleteFile(localFileName);
            });
            runs(function() {
                var ft = new FileTransfer();
                ft.download(remoteFile, root.toURL() + "/" + localFileName, downloadWin, downloadFail);
            });

            waitsForAny(downloadWin, downloadFail);
        });
        it("filetransfer.spec.15 should handle unknown host", function() {
            var downloadWin = createDoNotCallSpy('downloadWin');

            var remoteFile = "http://foobar.apache.org/index.html";
            var localFileName = remoteFile.substring(remoteFile.lastIndexOf('/')+1);
            var downloadFail = jasmine.createSpy().andCallFake(function(error) {
                expect(error.code).toBe(FileTransferError.CONNECTION_ERR);
            });

            runs(function() {
                var ft = new FileTransfer();
                ft.download(remoteFile, root.toURL() + "/" + localFileName, downloadWin, downloadFail);
            });

            waitsForAny(downloadWin, downloadFail);
        });
        it("filetransfer.spec.16 should handle bad file path", function() {
            var downloadWin = createDoNotCallSpy('downloadWin');

            var remoteFile = server;
            var badFilePath = "c:\\54321";
            var downloadFail = jasmine.createSpy();

            runs(function() {
                var ft = new FileTransfer();
                ft.download(remoteFile, badFilePath, downloadWin, downloadFail);
            });

            waitsForAny(downloadWin, downloadFail);
        });
        it("filetransfer.spec.17 progress should work with gzip encoding", function() {

           //lengthComputable false on bb10 when downloading gzip 
           if (cordova.platformId === 'blackberry10') {
                return;
           }

           var downloadFail = createDoNotCallSpy('downloadFail');
           var remoteFile = "http://www.apache.org/";
           var localFileName = "index.html";
           var lastProgressEvent = null;
           
           var downloadWin = jasmine.createSpy().andCallFake(function(entry) {
               expect(entry.name).toBe(localFileName);
               expect(lastProgressEvent.loaded).toBeGreaterThan(1, 'loaded');
               expect(lastProgressEvent.total).not.toBeLessThan(lastProgressEvent.loaded);
               expect(lastProgressEvent.lengthComputable).toBe(true, 'lengthComputable');
           });

           this.after(function() {
                      deleteFile(localFileName);
                      });
           runs(function() {
               var ft = new FileTransfer();
               ft.onprogress = function(e) {
                   lastProgressEvent = e;
               };
               ft.download(remoteFile, root.toURL() + "/" + localFileName, downloadWin, downloadFail);
           });
           waitsForAny(downloadWin, downloadFail);
        });
    });
    describe('upload method', function() {
        it("filetransfer.spec.18 should be able to upload a file", function() {
            var remoteFile = server + "/upload";
            var localFileName = "upload.txt";
            var fileContents = 'This file should upload';

            var fileFail = createDoNotCallSpy('fileFail');
            var uploadFail = createDoNotCallSpy('uploadFail', "Ensure " + remoteFile + " is in the white list");
            var lastProgressEvent = null;

            var uploadWin = jasmine.createSpy().andCallFake(function(uploadResult) {
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
            });

            var fileWin = function(fileEntry) {
                ft = new FileTransfer();

                var options = new FileUploadOptions();
                options.fileKey = "file";
                options.fileName = localFileName;
                options.mimeType = "text/plain";

                var params = new Object();
                params.value1 = "test";
                params.value2 = "param";
                options.params = params;

                ft.onprogress = function(e) {
                    lastProgressEvent = e;
                    expect(e.lengthComputable).toBe(true);
                    expect(e.total).toBeGreaterThan(0);
                    expect(e.loaded).toBeGreaterThan(0);
                    expect(lastProgressEvent.total).not.toBeLessThan(lastProgressEvent.loaded);
                };

                // removing options cause Android to timeout
                ft.upload(fileEntry.toURL(), remoteFile, uploadWin, uploadFail, options);
            };

            this.after(function() {
                deleteFile(localFileName);
            });
            runs(function() {
                writeFile(localFileName, fileContents, fileWin, fileFail);
            });

            waitsForAny(uploadWin, uploadFail, fileFail);
        });
        it("filetransfer.spec.19 should be able to upload a file with http basic auth", function() {
            var remoteFile = server_with_credentials + "/upload_basic_auth";
            var localFileName = "upload.txt";
            var fileContents = 'This file should upload';

            var fileFail = createDoNotCallSpy('fileFail');
            var uploadFail = createDoNotCallSpy('uploadFail', "Ensure " + remoteFile + " is in the white list");
            var lastProgressEvent = null;

            var uploadWin = jasmine.createSpy().andCallFake(function(uploadResult) {
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
            });

            var fileWin = function(fileEntry) {
                ft = new FileTransfer();

                var options = new FileUploadOptions();
                options.fileKey = "file";
                options.fileName = localFileName;
                options.mimeType = "text/plain";

                var params = new Object();
                params.value1 = "test";
                params.value2 = "param";
                options.params = params;

                ft.onprogress = function(e) {
                    expect(e.lengthComputable).toBe(true);
                    expect(e.total).toBeGreaterThan(0);
                    expect(e.loaded).toBeGreaterThan(0);
                    lastProgressEvent = e;
                };

                // removing options cause Android to timeout
                ft.upload(fileEntry.toURL(), remoteFile, uploadWin, uploadFail, options);
            };

            this.after(function() {
                deleteFile(localFileName);
            });
            runs(function() {
                writeFile(localFileName, fileContents, fileWin, fileFail);
            });

            waitsForAny(uploadWin, uploadFail, fileFail);
            runs(function() {
                expect(lastProgressEvent).not.toBeNull('expected progress events');
                expect(lastProgressEvent.loaded).toBeGreaterThan(1, 'loaded');
                expect(lastProgressEvent.total).not.toBeLessThan(lastProgressEvent.loaded);
            });
        });
        it("filetransfer.spec.6 should get http status on basic auth failure", function() {
            var fileFail = createDoNotCallSpy('fileFail');
            var uploadWin = createDoNotCallSpy('uploadWin');

            var remoteFile = server + "/upload_basic_auth";
            var localFileName = "upload_expect_fail.txt";
            var uploadFail = jasmine.createSpy().andCallFake(function(error) {
                expect(error.http_status).toBe(401);
                expect(error.http_status).not.toBe(404, "Ensure " + remoteFile + " is in the white list");
            });

            var fileWin = function(fileEntry) {
                var ft = new FileTransfer();

                var options = new FileUploadOptions();
                options.fileKey="file";
                options.fileName=fileEntry.name;
                options.mimeType="text/plain";

                ft.upload(fileEntry.toURL(), remoteFile, uploadWin, uploadFail, options);
            };

            this.after(function() {
                deleteFile(localFileName);
            });
            runs(function() {
                writeFile(localFileName, "this file should fail to upload", fileWin, fileFail);
            });

            waitsForAny(uploadWin, uploadFail, fileFail);
        });
        it("filetransfer.spec.21 should be stopped by abort() right away.", function() {
            var remoteFile = server + "/upload";
            var localFileName = "upload.txt";

            var fileFail = createDoNotCallSpy('fileFail');
            var uploadWin = createDoNotCallSpy('uploadWin', 'Should have been aborted');
            var startTime;

            var uploadFail = jasmine.createSpy().andCallFake(function(e) {
                expect(e.code).toBe(FileTransferError.ABORT_ERR);
                expect(new Date() - startTime).toBeLessThan(300);
            });

            var fileWin = function(fileEntry) {
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

            this.after(function() {
                deleteFile(localFileName);
            });
            runs(function() {
                writeFile(localFileName, new Array(10000).join('aborttest!'), fileWin, fileFail);
            });

            waitsForAny(uploadWin, uploadFail, fileFail);
        });
        it("filetransfer.spec.12 should get http status on failure", function() {
            var fileFail = createDoNotCallSpy('fileFail');
            var uploadWin = createDoNotCallSpy('uploadWin');

            var remoteFile = server + "/403";
            var localFileName = "upload_expect_fail.txt";
            var uploadFail = jasmine.createSpy().andCallFake(function(error) {
                expect(error.http_status).toBe(403);
                expect(error.http_status).not.toBe(401, "Ensure " + remoteFile + " is in the white list");
            });

            var fileWin = function(fileEntry) {
                var ft = new FileTransfer();

                var options = new FileUploadOptions();
                options.fileKey="file";
                options.fileName=fileEntry.name;
                options.mimeType="text/plain";

                ft.upload(fileEntry.toURL(), remoteFile, uploadWin, uploadFail, options);
            };

            this.after(function() {
                deleteFile(localFileName);
            });
            runs(function() {
                writeFile(localFileName, "this file should fail to upload", fileWin, fileFail);
            });

            waitsForAny(uploadWin, uploadFail, fileFail);
        });
        it("filetransfer.spec.14 should handle malformed urls", function() {
            var fileFail = createDoNotCallSpy('fileFail');
            var uploadWin = createDoNotCallSpy('uploadWin');

            var remoteFile = getMalformedUrl();
            var localFileName = "malformed_url.txt";
            var uploadFail = jasmine.createSpy().andCallFake(function(error) {
                expect(error.code).toBe(FileTransferError.INVALID_URL_ERR);
                expect(error.http_status).not.toBe(401, "Ensure " + remoteFile + " is in the white list");
            });
            var fileWin = function(fileEntry) {
                var ft = new FileTransfer();
                ft.upload(fileEntry.toURL(), remoteFile, uploadWin, uploadFail, {});
            };

            this.after(function() {
                deleteFile(localFileName);
            });
            runs(function() {
                writeFile(localFileName, "Some content", fileWin, fileFail);
            });

            waitsForAny(uploadWin, uploadFail, fileFail);
        });
        it("filetransfer.spec.15 should handle unknown host", function() {
            var fileFail = createDoNotCallSpy('fileFail');
            var uploadWin = createDoNotCallSpy('uploadWin');

            var remoteFile = "http://foobar.apache.org/robots.txt";
            var localFileName = remoteFile.substring(remoteFile.lastIndexOf('/')+1);
            var uploadFail = jasmine.createSpy().andCallFake(function(error) {
                expect(error.code).toBe(FileTransferError.CONNECTION_ERR);
                expect(error.http_status).not.toBe(401, "Ensure " + remoteFile + " is in the white list");
            });
            var fileWin = function(fileEntry) {
                var ft = new FileTransfer();
                ft.upload(fileEntry.toURL(), remoteFile, uploadWin, uploadFail, {});
            };

            this.after(function() {
                deleteFile(localFileName);
            });
            runs(function() {
                writeFile(localFileName, "# allow all", fileWin, fileFail);
            });

            waitsForAny(uploadWin, uploadFail, fileFail);
        });
        it("filetransfer.spec.25 should handle missing file", function() {
            var uploadWin = createDoNotCallSpy('uploadWin');

            var remoteFile = server + "/upload";
            var localFileName = "does_not_exist.txt";

            var uploadFail = jasmine.createSpy().andCallFake(function(error) {
                expect(error.code).toBe(FileTransferError.FILE_NOT_FOUND_ERR);
                expect(error.http_status).not.toBe(401, "Ensure " + remoteFile + " is in the white list");
            });

            runs(function() {
                var ft = new FileTransfer();
                ft.upload(root.toURL() + "/" + localFileName, remoteFile, uploadWin, uploadFail);
            });

            waitsForAny(uploadWin, uploadFail);
        });
        it("filetransfer.spec.16 should handle bad file path", function() {
            var uploadWin = createDoNotCallSpy('uploadWin');

            var remoteFile = server + "/upload";

            var uploadFail = jasmine.createSpy().andCallFake(function(error) {
                expect(error.http_status).not.toBe(401, "Ensure " + remoteFile + " is in the white list");
            });

            runs(function() {
                var ft = new FileTransfer();
                ft.upload("/usr/local/bad/file/path.txt", remoteFile, uploadWin, uploadFail);
            });

            waitsForAny(uploadWin, uploadFail);
        });
        it("filetransfer.spec.27 should be able to set custom headers", function() {
            var remoteFile = "http://whatheaders.com";
            var localFileName = "upload.txt";

            var fileFail = function() {};
            var uploadFail = createDoNotCallSpy('uploadFail', "Ensure " + remoteFile + " is in the white list and that Content-Length header is being set.");

            var uploadWin = jasmine.createSpy().andCallFake(function(uploadResult) {
                expect(uploadResult.bytesSent).toBeGreaterThan(0);
                expect(uploadResult.responseCode).toBe(200);
                expect(uploadResult.response).toBeDefined();
                var responseHtml = decodeURIComponent(uploadResult.response);
                expect(responseHtml).toMatch(/CustomHeader1[\s\S]*CustomValue1/i);
                expect(responseHtml).toMatch(/CustomHeader2[\s\S]*CustomValue2[\s\S]*CustomValue3/i, "Should allow array values");
            });

            var fileWin = function(fileEntry) {
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

            this.after(function() {
                deleteFile(localFileName);
            });
            runs(function() {
                writeFile(localFileName, "this file should upload", fileWin, fileFail);
            });

            waitsForAny(uploadWin, uploadFail);
        });
    });
    describe('Backwards compatibility', function() {
        /* These specs exist to test that the previously supported API still works with
         * the new version of file-transfer.
         * They rely on an undocumented interface to File which provides absolute file
         * paths, which are not used internally anymore.
         * If that interface is not present, then these tests will silently succeed.
         */
        it("filetransfer.spec.28 should be able to download a file using local paths", function() {
            var fail = createDoNotCallSpy('downloadFail');
            var remoteFile = server + "/robots.txt"
            var localFileName = remoteFile.substring(remoteFile.lastIndexOf('/')+1);
            var localURL = root.toURL() + "/" + localFileName;
            var lastProgressEvent = null;

            var downloadWin = jasmine.createSpy().andCallFake(function(entry) {
                expect(entry.name).toBe(localFileName);
                expect(lastProgressEvent.loaded).toBeGreaterThan(1);
            });
            var unsupportedOperation = jasmine.createSpy("Operation not supported");

            this.after(function() {
                deleteFile(localFileName);
            });
            runs(function() {
                /* This is an undocumented interface to File which exists only for testing
                 * backwards compatibilty. By obtaining the raw filesystem path of the download
                 * location, we can pass that to ft.download() to make sure that previously-stored
                 * paths are still valid.
                 */
                cordova.exec(function(localPath) {
                    var ft = new FileTransfer();
                    ft.onprogress = function(e) {
                        lastProgressEvent = e;
                        if (lastProgressEvent.lengthComputable) {
                            expect(lastProgressEvent.total).not.toBeLessThan(lastProgressEvent.loaded);
                        } else {
                            expect(lastProgressEvent.total).toBe(0);
                        }
                    };
                    ft.download(remoteFile, localPath, downloadWin, fail);
                }, unsupportedOperation, 'File', '_getLocalFilesystemPath', [localURL]);
            });

            waitsForAny(downloadWin, fail, unsupportedOperation);
        });
        it("filetransfer.spec.29 should be able to upload a file using local paths", function() {
            var remoteFile = server + "/upload";
            var localFileName = "upload.txt";
            var fileContents = 'This file should upload';

            var fileFail = createDoNotCallSpy('fileFail');
            var uploadFail = createDoNotCallSpy('uploadFail', "Ensure " + remoteFile + " is in the white list");
            var unsupportedOperation = jasmine.createSpy("Operation not supported");
            var lastProgressEvent = null;

            var uploadWin = jasmine.createSpy().andCallFake(function(uploadResult) {
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
            });

            var fileWin = function(fileEntry) {
                ft = new FileTransfer();

                var options = new FileUploadOptions();
                options.fileKey = "file";
                options.fileName = localFileName;
                options.mimeType = "text/plain";

                var params = new Object();
                params.value1 = "test";
                params.value2 = "param";
                options.params = params;

                ft.onprogress = function(e) {
                    expect(e.lengthComputable).toBe(true);
                    expect(e.total).toBeGreaterThan(0);
                    expect(e.loaded).toBeGreaterThan(0);
                    lastProgressEvent = e;
                };

                // removing options cause Android to timeout

                /* This is an undocumented interface to File which exists only for testing
                 * backwards compatibilty. By obtaining the raw filesystem path of the download
                 * location, we can pass that to ft.download() to make sure that previously-stored
                 * paths are still valid.
                 */
                cordova.exec(function(localPath) {
                    ft.upload(localPath, remoteFile, uploadWin, uploadFail, options);
                }, unsupportedOperation, 'File', '_getLocalFilesystemPath', [fileEntry.toURL()]);

            };

            this.after(function() {
                deleteFile(localFileName);
            });
            runs(function() {
                writeFile(localFileName, fileContents, fileWin, fileFail);
            });

            waitsForAny(uploadWin, uploadFail, fileFail, unsupportedOperation);
            runs(function() {
                if (!unsupportedOperation.wasCalled) {
                    expect(lastProgressEvent).not.toBeNull('expected progress events');
                    expect(lastProgressEvent.loaded).toBeGreaterThan(1);
                    expect(lastProgressEvent.total).not.toBeLessThan(lastProgressEvent.loaded);
                }
            });
        });
    });
    describe('native URL interface', function() {
        it("filetransfer.spec.30 downloaded file entries should have a toNativeURL method", function() {
            var fail = createDoNotCallSpy('downloadFail');
            var remoteFile = server + "/robots.txt";
            var localFileName = remoteFile.substring(remoteFile.lastIndexOf('/')+1)+".spec30";

            var downloadWin = jasmine.createSpy().andCallFake(function(entry) {
                expect(entry.toNativeURL).toBeDefined();
                expect(typeof entry.toNativeURL).toBe("function");
                var nativeURL = entry.toNativeURL();
                expect(typeof nativeURL).toBe("string");
                expect(nativeURL.substring(0,7)).toBe('file://');
            });

            this.after(function() {
                deleteFile(localFileName);
            });
            runs(function() {
                var ft = new FileTransfer();
                ft.download(remoteFile, root.toURL() + "/" + localFileName, downloadWin, fail);
            });

            waitsForAny(downloadWin, fail);
        });
    });
});
