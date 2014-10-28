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

/*jslint sloppy:true */
/*global Windows:true, require, document, setTimeout, window, module */



var cordova = require('cordova'),
    channel = require('cordova/channel');

var browserWrap,
    popup;

// x-ms-webview is available starting from Windows 8.1 (platformId is 'windows')
// http://msdn.microsoft.com/en-us/library/windows/apps/dn301831.aspx
var isWebViewAvailable = cordova.platformId == 'windows';

function attachNavigationEvents(element, callback) {
    if (isWebViewAvailable) {
        element.addEventListener("MSWebViewNavigationStarting", function (e) {
            callback({ type: "loadstart", url: e.uri}, {keepCallback: true} );
        });
        element.addEventListener("MSWebViewNavigationCompleted", function (e) {
            callback({ type: e.isSuccess ? "loadstop" : "loaderror", url: e.uri}, {keepCallback: true});
        });
        element.addEventListener("MSWebViewUnviewableContentIdentified", function (e) {
            // WebView found the content to be not HTML.
            // http://msdn.microsoft.com/en-us/library/windows/apps/dn609716.aspx
            callback({ type: "loaderror", url: e.uri}, {keepCallback: true});
        });
    } else {
        var onError = function () {
            callback({ type: "loaderror", url: this.contentWindow.location}, {keepCallback: true});
        };

        element.addEventListener("unload", function () {
            callback({ type: "loadstart", url: this.contentWindow.location}, {keepCallback: true});
        });
        element.addEventListener("load", function () {
            callback({ type: "loadstop", url: this.contentWindow.location}, {keepCallback: true});
        });

        element.addEventListener("error", onError);
        element.addEventListener("abort", onError);
    }
}

var IAB = {
    close: function (win, lose) {
        if (browserWrap) {
            if (win) win({ type: "exit" });

            browserWrap.parentNode.removeChild(browserWrap);
            browserWrap = null;
            popup = null;
        }
    },
    show: function (win, lose) {
        if (browserWrap) {
            browserWrap.style.display = "block";
        }
    },
    open: function (win, lose, args) {
        var strUrl = args[0],
            target = args[1],
            features = args[2],
            url;

        if (target === "_system") {
            url = new Windows.Foundation.Uri(strUrl);
            Windows.System.Launcher.launchUriAsync(url);
        } else if (target === "_blank") {
            if (!browserWrap) {
                browserWrap = document.createElement("div");
                browserWrap.style.position = "absolute";
                browserWrap.style.borderWidth = "40px";
                browserWrap.style.width = "calc(100% - 80px)";
                browserWrap.style.height = "calc(100% - 80px)";
                browserWrap.style.borderStyle = "solid";
                browserWrap.style.borderColor = "rgba(0,0,0,0.25)";

                browserWrap.onclick = function () {
                    setTimeout(function () {
                        IAB.close();
                    }, 0);
                };

                document.body.appendChild(browserWrap);
            }

            if (features.indexOf("hidden=yes") !== -1) {
                browserWrap.style.display = "none";
            }

            popup = document.createElement(isWebViewAvailable ? "x-ms-webview" : "iframe");
            popup.style.borderWidth = "0px";
            popup.style.width = "100%";
            popup.style.height = "100%";
            popup.src = strUrl;

            // start listening for navigation events
            attachNavigationEvents(popup, win);

            browserWrap.appendChild(popup);
            
        } else {
            window.location = strUrl;
        }
    },

    injectScriptCode: function (win, fail, args) {
        var code = args[0],
            hasCallback = args[1];

        if (isWebViewAvailable && browserWrap && popup) {
            var op = popup.invokeScriptAsync("eval", code);
            op.oncomplete = function () { hasCallback && win([]); };
            op.onerror = function () { };
            op.start();
        }
    },
    injectScriptFile: function (win, fail, args) {
        var file = args[0],
            hasCallback = args[1];

        if (isWebViewAvailable && browserWrap && popup) {
            Windows.Storage.FileIO.readTextAsync(file).done(function (code) {
                var op = popup.invokeScriptAsync("eval", code);
                op.oncomplete = function () { hasCallback && win([]); };
                op.onerror = function () { };
                op.start();
            });
        }
    }
};

module.exports = IAB;

require("cordova/exec/proxy").add("InAppBrowser", module.exports);