(function () {

    /* global LocalFileSystem, FileReader, ContentSync  */

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

    window.phonegap.app.config.load = function (callback) {
        readFile('config.json', function (e, text) {
            var config = parseAsJSON(text);

            // load defaults
            config.address = config.address || '127.0.0.1:3000';
            config.optIn = config.optIn || false;
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

    window.phonegap.app.config.save = function (data, callback) {
        saveFile('config.json', data, function (e) {
            callback();
        });
    };

    /*!
     * Configuration helper functions.
     */

    function readFile (filepath, callback) {
        window.requestFileSystem(
            LocalFileSystem.PERSISTENT,
            0,
            function (fileSystem) {
                fileSystem.root.getFile(
                    filepath,
                    null,
                    function gotFileEntry (fileEntry) {
                        fileEntry.file(
                            function gotFile (file) {
                                var reader = new FileReader();
                                reader.onloadend = function (evt) {
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
                            function (error) {
                                callback(error);
                            }
                        );
                    },
                    function (error) {
                        callback(error);
                    }
                );
            },
            function (error) {
                callback(error);
            }
        );
    }

    function saveFile (filepath, data, callback) {
        data = (typeof data === 'string') ? data : JSON.stringify(data);

        window.requestFileSystem(
            LocalFileSystem.PERSISTENT,
            0,
            function (fileSystem) {
                fileSystem.root.getFile(
                    filepath,
                    { create: true, exclusive: false },
                    function (fileEntry) {
                        fileEntry.createWriter(
                            function (writer) {
                                writer.onwriteend = function (evt) {
                                    callback();
                                };
                                writer.write(data);
                            },
                            function (e) {
                                callback(e);
                            }
                        );
                    },
                    function (e) {
                        callback(e);
                    }
                );
            },
            function (e) {
                callback(e);
            }
        );
    }

    function parseAsJSON (text) {
        try {
            return JSON.parse(text);
        } catch (e) {
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

    window.phonegap.app.downloadZip = function (options) {
        var uri;
        var sync;
        var theHeaders = options.headers;
        if (options.update === true) {
            uri = encodeURI(options.address + '/__api__/update');
            sync = ContentSync.sync({ src: uri, id: 'phonegapdevapp', type: 'merge', copyCordovaAssets: false, headers: theHeaders });
            sync.on('complete', function (data) {
                window.location.reload();
            });
        } else {
            uri = encodeURI(options.address + '/__api__/appzip');
            sync = ContentSync.sync({ src: uri, id: 'phonegapdevapp', type: 'replace', copyCordovaAssets: true, headers: theHeaders });
            sync.on('complete', function (data) {
                window.location.href = data.localPath + '/www/index.html';
            });
        }

        sync.on('progress', function (data) {
            if (options.onProgress) {
                options.onProgress(data);
            }
        });

        sync.on('error', function (e) {
            if (options.onDownloadError) {
                setTimeout(function () {
                    options.onDownloadError(e);
                }, 10);
            }
            console.log('download error ' + e);
        });

        document.addEventListener('cancelSync', function (e) {
            sync.cancel();
        });

        sync.on('cancel', function (e) {
            if (options.onCancel) {
                setTimeout(function () {
                    options.onCancel(e);
                }, 10);
            }
            console.log('download cancelled by user');
        });
    };

})();
