(function() {

/*---------------------------------------------------
    Globals
---------------------------------------------------*/

var config = {};

/*---------------------------------------------------
    General
---------------------------------------------------*/

$().ready(function() {
    // Add events
    $('#login-form').submit(buildSubmit);
    $('a[target="_system"]').on('click', function(e) {
        e.preventDefault();
        window.open($(this).attr('href'), '_system');
    });

    // Issue #27
    // When input box is selected, the soft-keyboard is shown
    // but the input box focus is in the incorrect position.
    $('#address').on('touchstart', function() {
        $('#address').focus();
    });

    // On input selection, backup the current address.
    $('#address').on('focus', function() {
        $('#address').attr('currentValue', getAddressField());
    });

    // On input de-selection, restore backup if there is no content.
    $('#address').on('blur', function() {
        var $address = $('#address'),
            whitespaceRegex = /^\s*$/;

        if (whitespaceRegex.test(getAddressField())) {
            $address.val($address.attr('currentValue'));
        }
        $address.attr('currentValue', '');
    });

    // Work around CSS browser issues.
    supportBrowserQuirks();
});

$(document).on('deviceready', function() {
    // Add slight delay to allow DOM rendering to finish.
    // Avoids flicker on slower devices.
    setTimeout(function() {
        // allow the screen to dim when returning from the served app
        window.plugins.insomnia.allowSleepAgain();

        navigator.splashscreen.hide();
        $('.footer').removeClass('faded');

        // Load configuration
        loadConfig(function() {
            setTimeout( function() {
                $('.alert').removeClass('alert');
                $('.visor').removeClass('pulse');
                $('.visor label').html('Hi!');
                $('.visor .eye').removeClass('faded');
            }, 1750);

            setTimeout( openBot, 2750);
            setTimeout( function() {
                $('.visor .eye').addClass('hidden');
            }, 3350 );
        });
    }, 350);
});

/*---------------------------------------------------
    App - Configuration
---------------------------------------------------*/

function loadConfig(callback) {
    readFile('config.json', function(e, text) {
        config = parseAsJSON(text);

        // load defaults
        config.address = config.address || '127.0.0.1:3000';

        // load server address
        if (config.address) {
            $('#address').val(config.address);
        }

        callback();
    });
}

function saveConfig(callback) {
    // this URL
    config.URL = document.URL;

    // server address
    config.address = getAddressField();

    // save config
    saveFile('config.json', config, function(e) {
        callback();
    });
}

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

/*---------------------------------------------------
    UI - General
---------------------------------------------------*/

function openBot() {
    $('.monitor form').removeClass('hidden');
    setTimeout( function() {
        $('.panel.top').addClass('open');
        $('.visor').addClass('fade-out');
        $('.monitor form').removeClass('faded');
        setTimeout( function() {
            $('.visor').addClass('hidden');
        }, 550);
    }, 50);
}

function closeBot() {
    $('.visor').removeClass('hidden');
    setTimeout( function() {
        $('.panel.top').removeClass('open');
        $('.visor').removeClass('fade-out');
        $('.monitor form').addClass('faded');
        setTimeout( function() {
            $('.monitor form').addClass('hidden');
        }, 550);
    }, 50);
}

// Note that the bot needs to be closed to be able to view this
function updateMessage( msg ) {
    $('.visor').removeClass('pulse');
    $('.visor label').html( msg.toUpperCase() );
}

function errorMessage( msg ) {
    updateMessage( msg );
    $('.visor').removeClass('pulse');
    $('.monitor').addClass('alert');
}

function pulsingMessage( msg ) {
    updateMessage( msg );
    $('.visor').addClass('pulse');
}

/*---------------------------------------------------
    UI - Form
---------------------------------------------------*/

function buildSubmit() {
    closeBot();
    updateMessage('');
    setTimeout(function() {
        pulsingMessage( 'Connecting...' );
        registerWithServer();
    }, 500);

    // Placeholder
    //setTimeout(onBuildSubmitError,2000);
    return false;
}

function onBuildSubmitSuccess() {
    updateMessage( 'Success!' );
    saveConfig(function() {
        // don't allow the screen to dim when serving an app
        window.plugins.insomnia.keepAwake();

        setTimeout( function() {
            downloadZip();
        }, 1000 );
    });
}

function onBuildSubmitError(message) {
    errorMessage('Error!');
    setTimeout(function() {
        errorMessage('Timed out!');
    }, 1500);

    setTimeout(function() {
        $('.monitor').removeClass('alert');
        updateMessage('');
        openBot();
    }, 3500);
}

function downloadZip(){
    window.requestFileSystem(
        LocalFileSystem.PERSISTENT,
        0,
        function(fileSystem) {
            var fileTransfer = new FileTransfer();
            var uri = encodeURI(getAddress() + '/__api__/zip');
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
                            window.location.href = dirPath + '/index.html'; 
                        }
                        else {
                            console.error('[fileUtils] error: failed to extract update payload');
                            console.log(zipPath, dirPath);
                        }
                    });
                },
                function(error) {
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
}

function registerWithServer() {
    $.ajax({
        type: 'POST',
        url: getAddress('/__api__/register'),
        dataType: 'json',
        data: {
            platform: device.platform,
            version: device.cordova
        },
        timeout: 1000 * 10,
        success: function(data) {
            onBuildSubmitSuccess();
        },
        error: function(xhr, type) {
            // support older servers that do not support /register
            $.ajax({
                type: 'GET',
                url: getAddress(),
                dataType: 'text',
                timeout: 1000 * 10,
                success: function(data) {
                    onBuildSubmitSuccess();
                },
                error: function(xhr, type) {
                    onBuildSubmitError();
                }
            });

        }
    });
}

function getAddressField() {
    var $address = $('#address'),
        address = $address.val() || $address.attr('placeholder');

    return address;
}

function getAddress(path) {
    var address = getAddressField();

    // default to http:// when no protocol exists
    address = (address.match(/^(.*:\/\/)/)) ? address : 'http://' + address;

    // append an optional path
    if (path) {
        address += '/' + path;

        // replace double forward slashes with a single forward-slash
        // except after the protocol (://)
        address = address.replace(/([^:])\/\//g, '$1/');
    }

    return address;
}

/*---------------------------------------------------
    Browser - Quirks
---------------------------------------------------*/

function supportBrowserQuirks() {
    // Issue #51
    // Windows Phone 8 does not support border-image
    if (/IEMobile\/10/.test(window.navigator.userAgent)) {
        var element = document.createElement('style');
        element.setAttribute('type', 'text/css');
        element.innerHTML = [
            '#bot .monitor .cover {',
            '   background-image: url(img/frame.png);',
            '   background-size: 270px 220px;',
            '   background-repeat: no-repeat;',
            '   border: none;',
            '}'
        ].join('\n');
        document.body.appendChild(element);
    }
}

})();
