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

/*global Windows:true */

var MediaFile = require('org.apache.cordova.media-capture.MediaFile');
var CaptureError = require('org.apache.cordova.media-capture.CaptureError');
var CaptureAudioOptions = require('org.apache.cordova.media-capture.CaptureAudioOptions');
var CaptureImageOptions = require('org.apache.cordova.media-capture.CaptureImageOptions');
var CaptureVideoOptions = require('org.apache.cordova.media-capture.CaptureVideoOptions');
var MediaFileData = require('org.apache.cordova.media-capture.MediaFileData');

module.exports = {

    captureAudio:function(successCallback, errorCallback, args) {
        var options = args[0];

        var audioOptions = new CaptureAudioOptions();
        if (typeof(options.duration) == 'undefined') {
            audioOptions.duration = 3600; // Arbitrary amount, need to change later
        } else if (options.duration > 0) {
            audioOptions.duration = options.duration;
        } else {
            errorCallback(new CaptureError(CaptureError.CAPTURE_INVALID_ARGUMENT));
            return;
        }

        var cameraCaptureAudioDuration = audioOptions.duration;
        var mediaCaptureSettings;
        var initCaptureSettings = function () {
            mediaCaptureSettings = null;
            mediaCaptureSettings = new Windows.Media.Capture.MediaCaptureInitializationSettings();
            mediaCaptureSettings.streamingCaptureMode = Windows.Media.Capture.StreamingCaptureMode.audio;
        };

        initCaptureSettings();
        var mediaCapture = new Windows.Media.Capture.MediaCapture();
        mediaCapture.initializeAsync(mediaCaptureSettings).done(function () {
            Windows.Storage.KnownFolders.musicLibrary.createFileAsync("captureAudio.mp3", Windows.Storage.NameCollisionOption.generateUniqueName).then(function (storageFile) {
                var mediaEncodingProfile = new Windows.Media.MediaProperties.MediaEncodingProfile.createMp3(Windows.Media.MediaProperties.AudioEncodingQuality.auto);
                var stopRecord = function () {
                    mediaCapture.stopRecordAsync().then(function (result) {
                        storageFile.getBasicPropertiesAsync().then(function (basicProperties) {
                            var results = [];
                            results.push(new MediaFile(storageFile.name, storageFile.path, storageFile.contentType, basicProperties.dateModified, basicProperties.size));
                            successCallback(results);
                        }, function () {
                            errorCallback(new CaptureError(CaptureError.CAPTURE_NO_MEDIA_FILES));
                        });
                    }, function () { errorCallback(new CaptureError(CaptureError.CAPTURE_NO_MEDIA_FILES)); });
                };
                mediaCapture.startRecordToStorageFileAsync(mediaEncodingProfile, storageFile).then(function () {
                    setTimeout(stopRecord, cameraCaptureAudioDuration * 1000);
                }, function () { errorCallback(new CaptureError(CaptureError.CAPTURE_NO_MEDIA_FILES)); });
            }, function () { errorCallback(new CaptureError(CaptureError.CAPTURE_NO_MEDIA_FILES)); });
        });
    },

    captureImage:function (successCallback, errorCallback, args) {
        var options = args[0];
        var imageOptions = new CaptureImageOptions();
        var cameraCaptureUI = new Windows.Media.Capture.CameraCaptureUI();
        cameraCaptureUI.photoSettings.allowCropping = true;
        cameraCaptureUI.photoSettings.maxResolution = Windows.Media.Capture.CameraCaptureUIMaxPhotoResolution.highestAvailable;
        cameraCaptureUI.photoSettings.format = Windows.Media.Capture.CameraCaptureUIPhotoFormat.jpeg;
        cameraCaptureUI.captureFileAsync(Windows.Media.Capture.CameraCaptureUIMode.photo).then(function (file) {
            file.moveAsync(Windows.Storage.KnownFolders.picturesLibrary, "cameraCaptureImage.jpg", Windows.Storage.NameCollisionOption.generateUniqueName).then(function () {
                file.getBasicPropertiesAsync().then(function (basicProperties) {
                    var results = [];
                    results.push(new MediaFile(file.name, file.path, file.contentType, basicProperties.dateModified, basicProperties.size));
                    successCallback(results);
                }, function () {
                    errorCallback(new CaptureError(CaptureError.CAPTURE_NO_MEDIA_FILES));
                });
            }, function () {
                errorCallback(new CaptureError(CaptureError.CAPTURE_NO_MEDIA_FILES));
            });
        }, function () { errorCallback(new CaptureError(CaptureError.CAPTURE_NO_MEDIA_FILES)); });
    },

    captureVideo:function (successCallback, errorCallback, args) {
        var options = args[0];
        var videoOptions = new CaptureVideoOptions();
        if (options.duration && options.duration > 0) {
            videoOptions.duration = options.duration;
        }
        if (options.limit > 1) {
            videoOptions.limit = options.limit;
        }
        var cameraCaptureUI = new Windows.Media.Capture.CameraCaptureUI();
        cameraCaptureUI.videoSettings.allowTrimming = true;
        cameraCaptureUI.videoSettings.format = Windows.Media.Capture.CameraCaptureUIVideoFormat.mp4;
        cameraCaptureUI.videoSettings.maxDurationInSeconds = videoOptions.duration;
        cameraCaptureUI.captureFileAsync(Windows.Media.Capture.CameraCaptureUIMode.video).then(function (file) {
            file.moveAsync(Windows.Storage.KnownFolders.videosLibrary, "cameraCaptureVedio.mp4", Windows.Storage.NameCollisionOption.generateUniqueName).then(function () {
                file.getBasicPropertiesAsync().then(function (basicProperties) {
                    var results = [];
                    results.push(new MediaFile(file.name, file.path, file.contentType, basicProperties.dateModified, basicProperties.size));
                    successCallback(results);
                }, function () {
                    errorCallback(new CaptureError(CaptureError.CAPTURE_NO_MEDIA_FILES));
                });
            }, function () {
                errorCallback(new CaptureError(CaptureError.CAPTURE_NO_MEDIA_FILES));
            });
        }, function () { errorCallback(new CaptureError(CaptureError.CAPTURE_NO_MEDIA_FILES)); });

    },

    getFormatData: function (successCallback, errorCallback, args) {
        Windows.Storage.StorageFile.getFileFromPathAsync(args[0]).then(
            function (storageFile) {
                var mediaTypeFlag = String(storageFile.contentType).split("/")[0].toLowerCase();
                if (mediaTypeFlag === "audio") {
                    storageFile.properties.getMusicPropertiesAsync().then(function (audioProperties) {
                        successCallback(new MediaFileData(null, audioProperties.bitrate, 0, 0, audioProperties.duration / 1000));
                    }, function () {
                        errorCallback(new CaptureError(CaptureError.CAPTURE_INVALID_ARGUMENT));
                    });
                }
                else if (mediaTypeFlag === "video") {
                    storageFile.properties.getVideoPropertiesAsync().then(function (videoProperties) {
                        successCallback(new MediaFileData(null, videoProperties.bitrate, videoProperties.height, videoProperties.width, videoProperties.duration / 1000));
                    }, function () {
                        errorCallback(new CaptureError(CaptureError.CAPTURE_INVALID_ARGUMENT));
                    });
                }
                else if (mediaTypeFlag === "image") {
                    storageFile.properties.getImagePropertiesAsync().then(function (imageProperties) {
                        successCallback(new MediaFileData(null, 0, imageProperties.height, imageProperties.width, 0));
                    }, function () {
                        errorCallback(new CaptureError(CaptureError.CAPTURE_INVALID_ARGUMENT));
                    });
                }
                else { errorCallback(new CaptureError(CaptureError.CAPTURE_INVALID_ARGUMENT)); }
            }, function () {
                errorCallback(new CaptureError(CaptureError.CAPTURE_INVALID_ARGUMENT));
            }
        );
    }
};

require("cordova/exec/proxy").add("Capture",module.exports);
