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

//cordova-js/lib/common/plugin/CaptureError.js
var INTERNAL_ERROR_CODE = 0,
    APPLICATION_BUSY_ERROR_CODE = 1,
    INVALID_ARGUMENT_ERROR_CODE = 2,
    NO_MEDIA_FILES_ERROR_CODE = 3,
    NOT_SUPPORTED_ERROR_CODE = 20;

function capture(action, options, result, webview) {
    var noop = function () {},
        limit = options.limit || 1,
        fail = function (error) {
            result.callbackError({code: INTERNAL_ERROR_CODE});
        },
        onCaptured = function (path) {
            var sb = webview.setFileSystemSandbox;
            webview.setFileSystemSandbox = false;
            window.webkitRequestFileSystem(window.PERSISTENT, 1024, function (fs) {
                fs.root.getFile(path, {}, function (fe) {
                    fe.file(function (file) {
                        file.fullPath = fe.fullPath;
                        webview.setFileSystemSandbox = sb;
                        result.callbackOk([file]);
                    }, fail);
                }, fail);
            }, fail);
        },
        onCancelled = function () {
            result.callbackError({code: NO_MEDIA_FILES_ERROR_CODE });
        },
        onInvoked = function (error) {
            if (error) {
                result.callbackError({code: APPLICATION_BUSY_ERROR_CODE});
            }
        };

    if (limit < 0) {
        result.error({code: INVALID_ARGUMENT_ERROR_CODE});
    } else {
        window.qnx.webplatform.getApplication().cards.camera.open(action, onCaptured, onCancelled, onInvoked);
        result.noResult(true);
    }
}

module.exports = {
    getSupportedAudioModes: function (success, fail, args, env) {
        var result = new PluginResult(args, env);
        result.ok([]);
    },
    getSupportedImageModes: function (win, fail, args, env) {
        var result = new PluginResult(args, env);
        result.ok([]);
    },
    getSupportedVideoModes: function (win, fail, args, env) {
        var result = new PluginResult(args, env);
        result.ok([]);
    },
    captureImage: function (win, fail, args, env) {
        var result = new PluginResult(args, env),
            options = args[0] === "undefined" ? {} : JSON.parse(decodeURIComponent(args[0]));

        capture("photo", options,  result, env.webview);
    },
    captureVideo: function (win, fail, args, env) {
        var result = new PluginResult(args, env),
            options = args[0] === "undefined" ? {} : JSON.parse(decodeURIComponent(args[0]));

        capture("video", options, result, env.webview);
    },
    captureAudio: function (win, fail, args, env) {
        var result = new PluginResult(args, env);
        result.error({code: NOT_SUPPORTED_ERROR_CODE});
    }
};
