(function() {

    /*!
     * Create export namespace.
     */

    if (!window.phonegap) window.phonegap = {};
    if (!window.phonegap.app) window.phonegap.app = {};

    /*!
     * Configuration.
     */

    if (!window.phonegap.app.config) window.phonegap.app.config = {};

    /**
     * Load Configuration.
     *
     * Options:
     *   - `callback` {Function} is triggered on completion
     *     - `data` {Object} is the configuration data
     */

    window.phonegap.app.config.load = function(callback) {
        readFile('config.json', function(e, text) {
            config = parseAsJSON(text);

            // load defaults
            config.address = config.address || '127.0.0.1:3000';

            callback(config);
        });
    };

    /**
     * Save Configuration.
     *
     * Options:
     *   - `data` {Object} is the data to save to the config file.
     *   - `callback` {Function} is triggered on completion.
     */

    window.phonegap.app.config.save = function(data, callback) {
        saveFile('config.json', data, function(e) {
            callback();
        });
    };

    /*!
     * Configuration helper functions.
     */

    function readFile(filepath, callback) {
        window.requestFileSystem(
            LocalFileSystem.PERSISTENT,
            0,
            function(fileSystem) {
                fileSystem.root.getFile(
                    filepath,
                    null,
                    function gotFileEntry(fileEntry) {
                        fileEntry.file(
                            function gotFile(file){
                                var reader = new FileReader();
                                reader.onloadend = function(evt) {
                                    // #72 - Fix WP8 loading of config.json
                                    // On WP8, `evt.target.result` is returned as an object instead
                                    // of a string. Since WP8 is using a newer version of the File API
                                    // this may be a platform quirk or an API update.
                                    var text = evt.target.result;
                                    text = (typeof text === 'object') ? JSON.stringify(text) : text;
                                    callback(null, text); // text is a string
                                };
                                reader.readAsText(file);
                            },
                            function(error) {
                                callback(error);
                            }
                        );
                    },
                    function(error) {
                        callback(error);
                    }
                );
            },
            function(error) {
                callback(error);
            }
        );
    }

    function saveFile(filepath, data, callback) {
        data = (typeof data === 'string') ? data : JSON.stringify(data);

        window.requestFileSystem(
            LocalFileSystem.PERSISTENT,
            0,
            function(fileSystem) {
                fileSystem.root.getFile(
                    filepath,
                    { create: true, exclusive: false },
                    function(fileEntry) {
                        fileEntry.createWriter(
                            function(writer) {
                                writer.onwriteend = function(evt) {
                                    callback();
                                };
                                writer.write(data);
                            },
                            function(e) {
                                callback(e);
                            }
                        );
                    },
                    function(e) {
                        callback(e);
                    }
                );
            },
            function(e) {
                callback(e);
            }
        );
    }

    function parseAsJSON(text) {
        try {
            return JSON.parse(text);
        } catch(e) {
            return {};
        }
    }

    /**
     * Download, Extract, and Deploy App.
     *
     * Options:
     *   - `options` {Object}
     *     - `address` {String} is the server address.
     */

    window.phonegap.app.downloadZip = function(options) {
        window.requestFileSystem(
            LocalFileSystem.PERSISTENT,
            0,
            function(fileSystem) {
                var fileTransfer = new FileTransfer();
                var uri = encodeURI(options.address + '/__api__/zip');
                var timeStamp = Math.round(+new Date()/1000);
                var downloadPath = fileSystem.root.toURL() + 'app' + timeStamp + '.zip';
                var dirPath =  fileSystem.root.toURL() + 'app' + timeStamp;

                fileTransfer.download(
                    uri,
                    downloadPath,
                    function(entry) {
                        console.log("download complete: " + entry.toURL());

                        zip.unzip(downloadPath, dirPath, function(statusCode) {
                            if (statusCode === 0) {
                                console.log('[fileUtils] successfully extracted the update payload');
                                var plugins = cordova.require('cordova/plugin_list');

                                var localFiles = [
                                    'cordova.js',
                                    'cordova_plugins.js',
                                    'js/deploy.js',
                                    'js/fileUtils.js'
                                ];

                                for(var i = 0; i < plugins.length; i++){
                                    localFiles.push(plugins[i].file);
                                }

                                window.phonegap.fileUtils.getDirectory('app' + timeStamp, function(appDirEntry){
                                    window.phonegap.fileUtils.copyFiles(localFiles, appDirEntry, function(){
                                        window.location.href = dirPath + '/index.html';
                                    }, function(){
                                        // error out copying over localFiles
                                    });
                                });
                            }
                            else {
                                console.error('[fileUtils] error: failed to extract update payload');
                                console.log(zipPath, dirPath);
                            }
                        });
                    },
                    function(error) {
                        if (options.onDownloadError) {
                            setTimeout(function() {
                                options.onDownloadError(error);
                            }, 10);
                        }
                        console.log("download error source " + error.source);
                        console.log("download error target " + error.target);
                        console.log("upload error code" + error.code);
                    },
                    false
                );
            },
            function(e) {
                callback(e);
            }
        );
    };

})();
