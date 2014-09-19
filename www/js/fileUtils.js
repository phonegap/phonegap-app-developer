(function() {

    // app namespace
    $.app = $.app || {};

    // global variables
    var fileSystem = null;

    // exposed fileUtils object
    $.app.fileUtils = {

        getFileSystem: function() {
            var deferred = $q.defer();
            if (fileSystem === null) {
                // Ask for access to the persistent file system via PhoneGap
                requestFileSystem(LocalFileSystem.PERSISTENT, 0,
                    function(fs) {
                        fileSystem = fs;
                        deferred.resolve(fs);
                    },
                    function(error) {
                        console.error("[fileUtils] failed to request access to the local file system");
                        deferred.reject(error);
                    }
                );
            } else {
                deferred.resolve(fileSystem);
            }
            return deferred.promise;
        },

        download: function (remoteUrl, localUrl) {
            console.log('[fileUtils] requesting file: ' + remoteUrl);
            var deferred = $q.defer();
            var fileTransfer = new FileTransfer();
            fileTransfer.download(
                remoteUrl,
                localUrl,
                function (entry) {
                    console.log('[fileUtils] successfully downloaded to: ' + entry.fullPath);
                    deferred.resolve(entry);
                },
                function (error) {
                    console.error('[fileUtils] download error source ' + error.source);
                    console.error('[fileUtils] download error target ' + error.target);
                    console.error('[fileUtils] error code ' + error.code);
                    deferred.reject(error);
                }
            );
            return {
                fileTransfer: fileTransfer,
                promise : deferred.promise
            };
        },

        remove: function(entry, recursive) {
            var deferred = $q.defer();
            if (recursive) {
                entry.removeRecursively(function() {
                        deferred.resolve();
                    },
                    function(error) {
                        deferred.reject(error);
                    });
            } else {
                entry.remove(function() {
                        deferred.resolve();
                    },
                    function(error) {
                        deferred.reject(error);
                    });
            }
            return deferred.promise;
        },

        getDirectory: function(path, parentDir) {
            var deferred = $q.defer();
            if (!parentDir) {
                this.getFileSystem()
                    .then(function(fileSystem) {
                        _getDirectory(fileSystem.root, path)
                            .then(function(entry) {
                                deferred.resolve(entry);
                            })
                            .catch(function(error){
                                deferred.reject(error);
                            });
                    })
            } else {
                _getDirectory(parentDir, path)
                    .then(function(entry) {
                        deferred.resolve(entry);
                    })
                    .catch(function(error){
                        deferred.reject(error);
                    });
            }
            return deferred.promise;
        },

        unzip: function (zipEntry, dirEntry) {
            var self = this,
                // FIXME: literally a hack
                getAbsPath = function(uri) {
                    var parser = document.createElement('a');
                    parser.href = uri;
                    return unescape(parser.pathname);
                },
                deferred = $q.defer(),
                zipPath = getAbsPath(zipEntry.nativeURL),
                dirPath = getAbsPath(dirEntry.nativeURL);
            zip.unzip(zipPath, dirPath, function(statusCode) {
                if (statusCode === 0) {
                    console.log('[fileUtils] successfully extracted the update payload');
                    deferred.resolve(dirEntry);
                }
                else {
                    console.error('[fileUtils] error: failed to extract update payload');
                    console.log(zipPath, dirPath);
                    deferred.reject();
                }
            });

            return deferred.promise;
        },

        copyFiles: function(fileList, destEntry) {
            return copyFilesToWritableDirectory(fileList, destEntry);
        },

        getNativePath: function(url) {
            var deferred = $q.defer();
            window.cordova.exec(function(path) {
                console.log('[fileUtils] local filesystem path obtained: ' + path);
                deferred.resolve(path);
            }, function(error) {
                console.log('[fileUtils][ERROR] failed to obtain local filesystem path');
                deferred.reject(error);
            }, "File", "_getLocalFilesystemPath", [url]);
            return deferred.promise;
        },

        readFile: function(filepath, entry) {
            var deferred = $q.defer();

            entry.getFile(
                filepath,
                null,
                function gotFileEntry(fileEntry) {
                    fileEntry.file(
                        function gotFile(file){
                            var reader = new FileReader();
                            reader.onloadend = function(evt) {
                                deferred.resolve(evt.target.result);
                            };
                            reader.readAsText(file);
                        },
                        function(error) {
                            deferred.reject(error);
                        }
                    );
                },
                function(error) {
                    deferred.reject(error);
                }
            );

            return deferred.promise;
        }

    };

    //
    // Helper functions
    //
    function getPathToWWWDir() {
        var currentLocation = window.location.href;
        var pathToWWW = null;
        var indexOfWWW = currentLocation.indexOf('/www/');
        if (indexOfWWW != -1) {
            pathToWWW = currentLocation.substring(0, indexOfWWW + 5);
        }
        return pathToWWW;
    }

    function copyFilesToWritableDirectory(fileList, destinationDirectoryEntry) {
        var fileCount = 0,
            copyCount = 0;

        for (var i = 0; i < fileList.length; i++) {
            (function() {
                var relativePathToFile = fileList[i];
                var absolutePathToFile = getPathToWWWDir() + relativePathToFile;

                createPath(destinationDirectoryEntry, relativePathToFile, function(e) {
                    destinationDirectoryEntry.getFile(relativePathToFile, {create: true},
                        function(newFile) {
                            console.log('[fileUtils] successfully CREATED the new file: [' + newFile.name + ']');

                            var fileTransfer = new FileTransfer();
                            console.log('[fileUtils] copying file from: [' + absolutePathToFile + '] to: [' + newFile.fullPath + ']');
                            fileTransfer.download(
                                absolutePathToFile,
                                newFile.toInternalURL(),
                                function() {
                                    //copy success
                                    copyCount++;
                                    console.log('[fileUtils] successfully COPIED the new file: [' + newFile.name + ']');
                                    checkPosition();
                                },
                                function(error) {
                                    console.log('[fileUtils][ERROR] failed to COPY the new file: [' + relativePathToFile +
                                        '] error code: [' + error.code + '] source: [' + error.source +
                                        '] target: [' + error.target + '] http_status: [' + error.http_status + ']');
                                    checkPosition();
                                }
                            );
                        },
                        function(error) {
                            console.log('[fileUtils][ERROR] failed to GET a handle on the new file: [' + relativePathToFile + '] error code: [' + error.code + ']');
                            checkPosition();
                        });
                });
            })();
        }

        function checkPosition(position) {
            // All done?
            fileCount++;
            if (fileCount === fileList.length) {
                console.log('[fileUtils] successfully copied ' + copyCount + ' of ' + fileList.length + ' files.');
            }
        }
    }

    function createPath(entry, filename, callback) {
        var parentDirectories = filename.split("/");
        if (parentDirectories.length === 1) {
            // There are no directories in this path
            callback();
        }
        else {
            for (var i = 0, l = parentDirectories.length - 1; i < l; ++i) {
                (function () { // Create a closure for the path variable to be correct when logging it
                    var path = parentDirectories.slice(0, i+1).join("/");
                    entry.getDirectory(path, { create: true, exclusive: true },
                        function () {
                            console.log("[fileUtils] Created directory " + path);
                            callback();
                        },
                        function(error) {
                            // error in this case means the directory already exists.
                            callback(error);
                        });
                })();
            }
        }
    }

    function _getDirectory(parentEntry, path) {
        var deferred = $q.defer();
        parentEntry.getDirectory(path, { create: true, exclusive: false },
            function (dirEntry) {
                console.log("[fileUtils] Created directory " + path);
                deferred.resolve(dirEntry);
            },
            function(error) {
                deferred.reject(error);
            });
        return deferred.promise;
    }
})();
