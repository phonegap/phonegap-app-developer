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
var PictureSourceType = {
        PHOTOLIBRARY : 0,    // Choose image from picture library (same as SAVEDPHOTOALBUM for Android)
        CAMERA : 1,          // Take picture from camera
        SAVEDPHOTOALBUM : 2  // Choose image from picture library (same as PHOTOLIBRARY for Android)
    },
    DestinationType = {
        DATA_URL: 0,         // Return base64 encoded string
        FILE_URI: 1,         // Return file uri (content://media/external/images/media/2 for Android)
        NATIVE_URI: 2        // Return native uri (eg. asset-library://... for iOS)
    },
    savePath = window.qnx.webplatform.getApplication().getEnv("HOME").replace('/data', '') + '/shared/camera/',
    invokeAvailable = true;

//check for camera card - it isn't currently availble in work perimeter
window.qnx.webplatform.getApplication().invocation.queryTargets(
    {
        type: 'image/jpeg',
        action: 'bb.action.CAPTURE',
        target_type: 'CARD'
    },
    function (error, targets) {
        invokeAvailable = !error && targets && targets instanceof Array &&
            targets.filter(function (t) { return t.default === 'sys.camera.card' }).length > 0;
    }
);

//open a webview with getUserMedia camera card implementation when camera card not available
function showCameraDialog (done, cancel, fail) {
    var wv = qnx.webplatform.createWebView(function () {
        wv.url = 'local:///chrome/camera.html';
        wv.allowQnxObject = true;
        wv.allowRpc = true;
        wv.zOrder = 1;
        wv.setGeometry(0, 0, screen.width, screen.height);
        wv.backgroundColor = 0x00000000;
        wv.active = true;
        wv.visible = true;
        wv.on('UserMediaRequest', function (evt, args) {
            wv.allowUserMedia(JSON.parse(args).id, 'CAMERA_UNIT_REAR');
        });
        wv.on('JavaScriptCallback', function (evt, data) {
            var args = JSON.parse(data).args;
            if (args[0] === 'org.apache.cordova.camera') {
                if (args[1] === 'cancel') {
                    cancel('User canceled');
                } else if (args[1] === 'error') {
                    fail(args[2]);
                } else {
                    saveImage(args[1], done, fail);
                }
                wv.un('JavaScriptCallback', arguments.callee);
                wv.visible = false;
                wv.destroy();
                qnx.webplatform.getApplication().unlockRotation();
            }
        });
        wv.on('Destroyed', function () {
            wv.delete();
        });
        qnx.webplatform.getApplication().lockRotation();
        qnx.webplatform.getController().dispatchEvent('webview.initialized', [wv]);
    });
}

//create unique name for saved file (same pattern as BB10 camera app)
function imgName() {
    var date = new Date(),
        pad = function (n) { return n < 10 ? '0' + n : n };
    return 'IMG_' + date.getFullYear() + pad(date.getMonth() + 1) + pad(date.getDate()) + '_' +
            pad(date.getHours()) + pad(date.getMinutes()) + pad(date.getSeconds()) + '.png';
}

//convert dataURI to Blob
function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]),
        mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0],
        arrayBuffer = new ArrayBuffer(byteString.length),
        ia = new Uint8Array(arrayBuffer),
        i;
    for (i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([new DataView(arrayBuffer)], { type: mimeString });
}

//save dataURI to file system and call success with path
function saveImage(data, success, fail) {
    var name = savePath + imgName();
    require('lib/webview').setSandbox(false);
    window.webkitRequestFileSystem(window.PERSISTENT, 0, function (fs) {
        fs.root.getFile(name, { create: true }, function (entry) {
            entry.createWriter(function (writer) {
                writer.onwriteend = function () {
                    success(name);
                };
                writer.onerror = fail;
                writer.write(dataURItoBlob(data));
            });
        }, fail);
    }, fail);
}

function encodeBase64(filePath, callback) {
    var sandbox = window.qnx.webplatform.getController().setFileSystemSandbox, // save original sandbox value
        errorHandler = function (err) {
            var msg = "An error occured: ";

            switch (err.code) {
            case FileError.NOT_FOUND_ERR:
                msg += "File or directory not found";
                break;

            case FileError.NOT_READABLE_ERR:
                msg += "File or directory not readable";
                break;

            case FileError.PATH_EXISTS_ERR:
                msg += "File or directory already exists";
                break;

            case FileError.TYPE_MISMATCH_ERR:
                msg += "Invalid file type";
                break;

            default:
                msg += "Unknown Error";
                break;
            };

            // set it back to original value
            window.qnx.webplatform.getController().setFileSystemSandbox = sandbox;
            callback(msg);
        },
        gotFile = function (fileEntry) {
            fileEntry.file(function (file) {
                var reader = new FileReader();

                reader.onloadend = function (e) {
                    // set it back to original value
                    window.qnx.webplatform.getController().setFileSystemSandbox = sandbox;
                    callback(this.result);
                };

                reader.readAsDataURL(file);
            }, errorHandler);
        },
        onInitFs = function (fs) {
            window.qnx.webplatform.getController().setFileSystemSandbox = false;
            fs.root.getFile(filePath, {create: false}, gotFile, errorHandler);
        };

    window.webkitRequestFileSystem(window.TEMPORARY, 10 * 1024 * 1024, onInitFs, errorHandler); // set size to 10MB max
}

module.exports = {
    takePicture: function (success, fail, args, env) {
        var destinationType = JSON.parse(decodeURIComponent(args[1])),
            sourceType = JSON.parse(decodeURIComponent(args[2])),
            result = new PluginResult(args, env),
            done = function (data) {
                if (destinationType === DestinationType.FILE_URI) {
                    data = "file://" + data;
                    result.callbackOk(data, false);
                } else {
                    encodeBase64(data, function (data) {
                        if (/^data:/.test(data)) {
                            data = data.slice(data.indexOf(",") + 1);
                            result.callbackOk(data, false);
                        } else {
                            result.callbackError(data, false);
                        }
                    });
                }
            },
            cancel = function (reason) {
                result.callbackError(reason, false);
            },
            invoked = function (error) {
                if (error) {
                    result.callbackError(error, false);
                }
            };

        switch(sourceType) {
        case PictureSourceType.CAMERA:
            if (invokeAvailable) {
                window.qnx.webplatform.getApplication().cards.camera.open("photo", done, cancel, invoked);
            } else {
                showCameraDialog(done, cancel, fail);
            }
            break;

        case PictureSourceType.PHOTOLIBRARY:
        case PictureSourceType.SAVEDPHOTOALBUM:
            window.qnx.webplatform.getApplication().cards.filePicker.open({
                mode: "Picker",
                type: ["picture"]
            }, done, cancel, invoked);
            break;
        }

        result.noResult(true);
    }
};
