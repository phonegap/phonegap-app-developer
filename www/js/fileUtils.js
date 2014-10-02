(function() {

    /*!
     * Create export namespace.
     */

    if (!window.phonegap) window.phonegap = {};
    if (!window.phonegap.fileUtils) window.phonegap.fileUtils = {};

    /*
     * Global variables.
     */

    var fileSystem = null;

    /**
     * Get Directory Handle.
     */

    window.phonegap.fileUtils.getDirectory = function(path, success, error) {
        window.requestFileSystem(
            LocalFileSystem.PERSISTENT,
            0,
            function(fileSystem) {
                fileSystem.root.getDirectory(
                    path,
                    { create: true, exclusive: false },
                    function(dirEntry) {
                        success(dirEntry);
                    },
                    function() {
                        console.log('[fileUtils] error: failed to getDirectory');
                        error();
                    }
                );
            }
        );
    };

    /**
     * Copy Files
     */

    window.phonegap.fileUtils.copyFiles = function(fileList, destEntry, success) {
        asyncLoop(
            fileList,
            function(i, next) {
                var file = fileList[i];
                window.phonegap.fileUtils.copyFile(
                    file,
                    destEntry,
                    function() {
                        next();
                    },
                    function(e) {
                        console.error('[fileUtils][ERROR] Could not copy over files');
                        next(e);
                    }
                );
            },
            function(e) {
                success(e);
            }
        );
    };

    /**
     * Copy a File.
     */

    window.phonegap.fileUtils.copyFile = function(filePath, destinationDirectoryEntry, success, error) {
        var relativePathToFile = filePath;
        var absolutePathToFile = getPathToWWWDir() + relativePathToFile;

        window.phonegap.fileUtils.createPath(
            destinationDirectoryEntry,
            relativePathToFile,
            function(e) {
                destinationDirectoryEntry.getFile(
                    relativePathToFile,
                    { create: true },
                    function(newFile) {
                        console.log('[fileUtils] successfully CREATED the new file: [' + newFile.name + ']');
                        console.log('[fileUtils] copying file from: [' + absolutePathToFile + '] to: [' + newFile.toURL() + ']');

                        var fileTransfer = new FileTransfer();
                        fileTransfer.download(
                            absolutePathToFile,
                            newFile.toInternalURL(),
                            function() {
                                //copy success
                                console.log('[fileUtils] successfully COPIED the new file: [' + newFile.name + ']');
                                success();
                            },
                            function(e) {
                                console.log(
                                    '[fileUtils][ERROR] failed to COPY the new file: [' + relativePathToFile +
                                    '] error code: [' + e.code + '] source: [' + e.source +
                                    '] target: [' + e.target + '] http_status: [' + e.http_status + ']'
                                );
                                console.log(e);
                                error(e);
                            }
                        );
                    },
                    function(e) {
                        console.log('[fileUtils][ERROR] failed to GET a handle on the new file: [' + relativePathToFile + '] error code: [' + e.code + ']');
                        error(e);
                    }
                );
            }
        );
    };

    /**
     * Create Path.
     */

    window.phonegap.fileUtils.createPath = function(entry, filename, callback) {
        var parentDirectories = filename.split("/");
        parentDirectories.pop(); // remove the filename
        if (parentDirectories.length <= 0) {
            // There are no directories in this path
            callback();
        }
        else {
            asyncLoop(
                parentDirectories,
                function(i, next) {
                    var path = parentDirectories.slice(0, i+1).join("/");
                    entry.getDirectory(
                        path,
                        { create: true, exclusive: true },
                        function () {
                            console.log("[fileUtils] Created directory " + path);
                            next();
                        },
                        function(error) {
                            // error in this case means the directory already exists.
                            next();
                        }
                    );
                },
                function(e) {
                    callback(e);
                }
            );
        }
    };

    /*!
     * Helper to Get WWW Directory Path.
     */

    function getPathToWWWDir() {
        var currentLocation = window.location.href;
        var pathToWWW = currentLocation.substring(
            0,
            currentLocation.lastIndexOf('/') + 1
        );
        var indexOfWWW = currentLocation.indexOf('/www/');
        if (indexOfWWW != -1) {
            pathToWWW = currentLocation.substring(0, indexOfWWW + 5);
        }
        return pathToWWW;
    }

    /*!
     * Helper for Async Loop.
     */

    function asyncLoop(elements, callback, complete) {
        var index = 0,
            length = elements.length;

        var nextElementCallback = function() {
            if (index < length) {
                callback(index, function(e) {
                    index++;
                    if (e) {
                        complete(e);
                    }
                    else {
                        nextElementCallback();
                    }
                });
            }
            else {
                complete();
            }
        };

        nextElementCallback();
    }

})();
