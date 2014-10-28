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

/*global Windows:true, URL:true */


    var cordova = require('cordova'),
        Camera = require('./Camera');

module.exports = {

    // args will contain :
    //  ...  it is an array, so be careful
    // 0 quality:50,
    // 1 destinationType:Camera.DestinationType.FILE_URI,
    // 2 sourceType:Camera.PictureSourceType.CAMERA,
    // 3 targetWidth:-1,
    // 4 targetHeight:-1,
    // 5 encodingType:Camera.EncodingType.JPEG,
    // 6 mediaType:Camera.MediaType.PICTURE,
    // 7 allowEdit:false,
    // 8 correctOrientation:false,
    // 9 saveToPhotoAlbum:false,
    // 10 popoverOptions:null
    // 11 cameraDirection:0

    takePicture: function (successCallback, errorCallback, args) {
        var encodingType = args[5];
        var targetWidth = args[3];
        var targetHeight = args[4];
        var sourceType = args[2];
        var destinationType = args[1];
        var mediaType = args[6];
        var allowCrop = !!args[7];
        var saveToPhotoAlbum = args[9];
        var cameraDirection = args[11];

        // resize method :)
        var resizeImage = function (file) {
            var tempPhotoFileName = "";
            if (encodingType == Camera.EncodingType.PNG) {
                tempPhotoFileName = "camera_cordova_temp_return.png";
            } else {
                tempPhotoFileName = "camera_cordova_temp_return.jpg";
            }

            var storageFolder = Windows.Storage.ApplicationData.current.localFolder;
            file.copyAsync(storageFolder, file.name, Windows.Storage.NameCollisionOption.replaceExisting).then(function (storageFile) {
                Windows.Storage.FileIO.readBufferAsync(storageFile).then(function(buffer) {
                    var strBase64 = Windows.Security.Cryptography.CryptographicBuffer.encodeToBase64String(buffer);
                    var imageData = "data:" + file.contentType + ";base64," + strBase64;
                    var image = new Image();
                    image.src = imageData;
                    image.onload = function() {
                        var imageWidth = targetWidth,
                            imageHeight = targetHeight;
                        var canvas = document.createElement('canvas');

                        canvas.width = imageWidth;
                        canvas.height = imageHeight;

                        canvas.getContext("2d").drawImage(this, 0, 0, imageWidth, imageHeight);

                        var fileContent = canvas.toDataURL(file.contentType).split(',')[1];

                        var storageFolder = Windows.Storage.ApplicationData.current.localFolder;

                        storageFolder.createFileAsync(tempPhotoFileName, Windows.Storage.CreationCollisionOption.generateUniqueName).done(function (storagefile) {
                            var content = Windows.Security.Cryptography.CryptographicBuffer.decodeFromBase64String(fileContent);
                            Windows.Storage.FileIO.writeBufferAsync(storagefile, content).then(function () {
                                successCallback("ms-appdata:///local/" + storagefile.name);
                            }, function () {
                                errorCallback("Resize picture error.");
                            });
                        });
                    };
                });
            }, function () {
                errorCallback("Can't access localStorage folder");
            });

        };

        // because of asynchronous method, so let the successCallback be called in it.
        var resizeImageBase64 = function (file) {

            Windows.Storage.FileIO.readBufferAsync(file).done( function(buffer) {
                var strBase64 = Windows.Security.Cryptography.CryptographicBuffer.encodeToBase64String(buffer);
                var imageData = "data:" + file.contentType + ";base64," + strBase64;

                var image = new Image();
                image.src = imageData;

                image.onload = function() {
                    var imageWidth = targetWidth,
                        imageHeight = targetHeight;
                    var canvas = document.createElement('canvas');

                    canvas.width = imageWidth;
                    canvas.height = imageHeight;

                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(this, 0, 0, imageWidth, imageHeight);

                    // The resized file ready for upload
                    var finalFile = canvas.toDataURL(file.contentType);

                    // Remove the prefix such as "data:" + contentType + ";base64," , in order to meet the Cordova API.
                    var arr = finalFile.split(",");
                    var newStr = finalFile.substr(arr[0].length + 1);
                    successCallback(newStr);
                };
            });
        };

        if (sourceType != Camera.PictureSourceType.CAMERA) {

            // TODO: Add WP8.1 support
            // WP8.1 doesn't allow to use of pickSingleFileAsync method
            // see http://msdn.microsoft.com/en-us/library/windows/apps/br207852.aspx for details
            // replacement of pickSingleFileAsync - pickSingleFileAndContinue method
            // will take application to suspended state and this require additional logic to wake application up
            if (navigator.appVersion.indexOf('Windows Phone 8.1') >= 0 ) {
                errorCallback('Not supported');
                return;
            }

            var fileOpenPicker = new Windows.Storage.Pickers.FileOpenPicker();
            fileOpenPicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.picturesLibrary;
            if (mediaType == Camera.MediaType.PICTURE) {
                fileOpenPicker.fileTypeFilter.replaceAll([".png", ".jpg", ".jpeg"]);
            }
            else if (mediaType == Camera.MediaType.VIDEO) {
                fileOpenPicker.fileTypeFilter.replaceAll([".avi", ".flv", ".asx", ".asf", ".mov", ".mp4", ".mpg", ".rm", ".srt", ".swf", ".wmv", ".vob"]);
            }
            else {
                fileOpenPicker.fileTypeFilter.replaceAll(["*"]);
            }

            fileOpenPicker.pickSingleFileAsync().done(function (file) {
                if (file) {
                    if (destinationType == Camera.DestinationType.FILE_URI || destinationType == Camera.DestinationType.NATIVE_URI) {
                        if (targetHeight > 0 && targetWidth > 0) {
                            resizeImage(file);
                        }
                        else {

                            var storageFolder = Windows.Storage.ApplicationData.current.localFolder;
                            file.copyAsync(storageFolder, file.name, Windows.Storage.NameCollisionOption.replaceExisting).then(function (storageFile) {
                                successCallback(URL.createObjectURL(storageFile));
                            }, function () {
                                errorCallback("Can't access localStorage folder.");
                            });

                        }
                    }
                    else {
                        if (targetHeight > 0 && targetWidth > 0) {
                            resizeImageBase64(file);
                        } else {
                            Windows.Storage.FileIO.readBufferAsync(file).done(function (buffer) {
                                var strBase64 = Windows.Security.Cryptography.CryptographicBuffer.encodeToBase64String(buffer);
                                successCallback(strBase64);
                            });
                        }

                    }

                } else {
                    errorCallback("User didn't choose a file.");
                }
            }, function () {
                errorCallback("User didn't choose a file.");
            });

        } else {

            var CaptureNS = Windows.Media.Capture;

            // Check if necessary API available
            if (!CaptureNS.CameraCaptureUI) {
                // We are running on WP8.1 which lacks CameraCaptureUI class
                // so we need to use MediaCapture class instead and implement custom UI for camera

                var capturePreview = null,
                    captureCancelButton = null,
                    capture = null,
                    captureSettings = null;

                var createCameraUI = function () {

                    // Create fullscreen preview
                    capturePreview = document.createElement("video");

                    // z-order style element for capturePreview and captureCancelButton elts
                    // is necessary to avoid overriding by another page elements, -1 sometimes is not enough
                    capturePreview.style.cssText = "position: fixed; left: 0; top: 0; width: 100%; height: 100%; z-order: 999";

                    // Create cancel button
                    captureCancelButton = document.createElement("button");
                    captureCancelButton.innerText = "Cancel";
                    captureCancelButton.style.cssText = "position: fixed; right: 0; bottom: 0; display: block; margin: 20px; z-order: 1000";

                    capture = new CaptureNS.MediaCapture();

                    captureSettings = new CaptureNS.MediaCaptureInitializationSettings();
                    captureSettings.streamingCaptureMode = CaptureNS.StreamingCaptureMode.video;
                };

                var startCameraPreview = function () {

                    // Search for available camera devices
                    // This is necessary to detect which camera (front or back) we should use
                    var expectedPanel = cameraDirection === 1 ? Windows.Devices.Enumeration.Panel.front : Windows.Devices.Enumeration.Panel.back;
                    Windows.Devices.Enumeration.DeviceInformation.findAllAsync(Windows.Devices.Enumeration.DeviceClass.videoCapture)
                    .done(function (devices) {
                        if (devices.length > 0) {
                            devices.forEach(function(currDev) {
                                if (currDev.enclosureLocation.panel && currDev.enclosureLocation.panel == expectedPanel) {
                                    captureSettings.videoDeviceId = currDev.id;
                                }
                            });

                            capture.initializeAsync(captureSettings).done(function () {
                                // This is necessary since WP8.1 MediaCapture outputs video stream rotated 90 degrees CCW
                                // TODO: This can be not consistent across devices, need additional testing on various devices
                                capture.setPreviewRotation(Windows.Media.Capture.VideoRotation.clockwise90Degrees);
                                // msdn.microsoft.com/en-us/library/windows/apps/hh452807.aspx
                                capturePreview.msZoom = true;
                                capturePreview.src = URL.createObjectURL(capture);
                                capturePreview.play();

                                // Insert preview frame and controls into page
                                document.body.appendChild(capturePreview);
                                document.body.appendChild(captureCancelButton);

                                // Bind events to controls
                                capturePreview.addEventListener('click', captureAction);
                                captureCancelButton.addEventListener('click', function () {
                                    destroyCameraPreview();
                                    errorCallback('Cancelled');
                                }, false);
                            }, function (err) {
                                destroyCameraPreview();
                                errorCallback('Camera intitialization error ' + err);
                            });
                        } else {
                            destroyCameraPreview();
                            errorCallback('Camera not found');
                        }
                    });
                };

                var destroyCameraPreview = function () {
                    capturePreview.pause();
                    capturePreview.src = null;
                    [capturePreview, captureCancelButton].forEach(function(elem) {
                        if (elem /* && elem in document.body.childNodes */) {
                            document.body.removeChild(elem);
                        }
                    });
                    if (capture) {
                        capture.stopRecordAsync();
                        capture = null;
                    }
                };

                var captureAction = function () {

                    var encodingProperties,
                        fileName,
                        generateUniqueCollisionOption = Windows.Storage.CreationCollisionOption.generateUniqueName,
                        tempFolder = Windows.Storage.ApplicationData.current.temporaryFolder;

                    if (encodingType == Camera.EncodingType.PNG) {
                        fileName = 'photo.png';
                        encodingProperties = Windows.Media.MediaProperties.ImageEncodingProperties.createPng();
                    } else {
                        fileName = 'photo.jpg';
                        encodingProperties = Windows.Media.MediaProperties.ImageEncodingProperties.createJpeg();
                    }

                    tempFolder.createFileAsync(fileName, generateUniqueCollisionOption).done(function(capturedFile) {
                        capture.capturePhotoToStorageFileAsync(encodingProperties, capturedFile).done(function() {

                            destroyCameraPreview();

                            // success callback for capture operation
                            var success = function(capturedfile) {
                                if (destinationType == Camera.DestinationType.FILE_URI || destinationType == Camera.DestinationType.NATIVE_URI) {
                                    if (targetHeight > 0 && targetWidth > 0) {
                                        resizeImage(capturedfile);
                                    } else {
                                        capturedfile.copyAsync(Windows.Storage.ApplicationData.current.localFolder, capturedfile.name, generateUniqueCollisionOption).done(function(copiedfile) {
                                            successCallback("ms-appdata:///local/" + copiedfile.name);
                                        }, errorCallback);
                                    }
                                } else {
                                    if (targetHeight > 0 && targetWidth > 0) {
                                        resizeImageBase64(capturedfile);
                                    } else {
                                        Windows.Storage.FileIO.readBufferAsync(capturedfile).done(function(buffer) {
                                            var strBase64 = Windows.Security.Cryptography.CryptographicBuffer.encodeToBase64String(buffer);
                                            capturedfile.deleteAsync().done(function() {
                                                successCallback(strBase64);
                                            }, function(err) {
                                                console.error(err);
                                                successCallback(strBase64);
                                            });
                                        }, errorCallback);
                                    }
                                }
                            };

                            if (saveToPhotoAlbum) {
                                capturedFile.copyAsync(Windows.Storage.KnownFolders.picturesLibrary, capturedFile.name, generateUniqueCollisionOption)
                                .done(function() {
                                    success(capturedFile);
                                }, errorCallback);
                            } else {
                                success(capturedFile);
                            }


                        }, function(err) {
                            destroyCameraPreview();
                            errorCallback(err);
                        });
                    }, function(err) {
                        destroyCameraPreview();
                        errorCallback(err);
                    });
                };

                try {
                    createCameraUI();
                    startCameraPreview();
                } catch (ex) {
                    errorCallback(ex);
                }

            } else {

                var cameraCaptureUI = new Windows.Media.Capture.CameraCaptureUI();
                cameraCaptureUI.photoSettings.allowCropping = allowCrop;

                if (encodingType == Camera.EncodingType.PNG) {
                    cameraCaptureUI.photoSettings.format = Windows.Media.Capture.CameraCaptureUIPhotoFormat.png;
                } else {
                    cameraCaptureUI.photoSettings.format = Windows.Media.Capture.CameraCaptureUIPhotoFormat.jpeg;
                }

                // decide which max pixels should be supported by targetWidth or targetHeight.
                if (targetWidth >= 1280 || targetHeight >= 960) {
                    cameraCaptureUI.photoSettings.maxResolution = Windows.Media.Capture.CameraCaptureUIMaxPhotoResolution.large3M;
                } else if (targetWidth >= 1024 || targetHeight >= 768) {
                    cameraCaptureUI.photoSettings.maxResolution = Windows.Media.Capture.CameraCaptureUIMaxPhotoResolution.mediumXga;
                } else if (targetWidth >= 800 || targetHeight >= 600) {
                    cameraCaptureUI.photoSettings.maxResolution = Windows.Media.Capture.CameraCaptureUIMaxPhotoResolution.mediumXga;
                } else if (targetWidth >= 640 || targetHeight >= 480) {
                    cameraCaptureUI.photoSettings.maxResolution = Windows.Media.Capture.CameraCaptureUIMaxPhotoResolution.smallVga;
                } else if (targetWidth >= 320 || targetHeight >= 240) {
                    cameraCaptureUI.photoSettings.maxResolution = Windows.Media.Capture.CameraCaptureUIMaxPhotoResolution.verySmallQvga;
                } else {
                    cameraCaptureUI.photoSettings.maxResolution = Windows.Media.Capture.CameraCaptureUIMaxPhotoResolution.highestAvailable;
                }

                cameraCaptureUI.captureFileAsync(Windows.Media.Capture.CameraCaptureUIMode.photo).then(function(picture) {
                    if (picture) {
                        // save to photo album successCallback
                        var success = function() {
                            if (destinationType == Camera.DestinationType.FILE_URI) {
                                if (targetHeight > 0 && targetWidth > 0) {
                                    resizeImage(picture);
                                } else {

                                    var storageFolder = Windows.Storage.ApplicationData.current.localFolder;
                                    picture.copyAsync(storageFolder, picture.name, Windows.Storage.NameCollisionOption.replaceExisting).then(function(storageFile) {
                                        successCallback("ms-appdata:///local/" + storageFile.name);
                                    }, function() {
                                        errorCallback("Can't access localStorage folder.");
                                    });
                                }
                            } else {
                                if (targetHeight > 0 && targetWidth > 0) {
                                    resizeImageBase64(picture);
                                } else {
                                    Windows.Storage.FileIO.readBufferAsync(picture).done(function(buffer) {
                                        var strBase64 = Windows.Security.Cryptography.CryptographicBuffer.encodeToBase64String(buffer);
                                        successCallback(strBase64);
                                    });
                                }
                            }
                        };
                        // save to photo album errorCallback
                        var fail = function() {
                            //errorCallback("FileError, code:" + fileError.code);
                            errorCallback("Save fail.");
                        };

                        if (saveToPhotoAlbum) {
                            Windows.Storage.StorageFile.getFileFromPathAsync(picture.path).then(function(storageFile) {
                                storageFile.copyAsync(Windows.Storage.KnownFolders.picturesLibrary, picture.name, Windows.Storage.NameCollisionOption.generateUniqueName).then(function(storageFile) {
                                    success();
                                }, function() {
                                    fail();
                                });
                            });
                        } else {
                            success();
                        }
                    } else {
                        errorCallback("User didn't capture a photo.");
                    }
                }, function() {
                    errorCallback("Fail to capture a photo.");
                });
            }
        }
    }
};

require("cordova/exec/proxy").add("Camera",module.exports);
