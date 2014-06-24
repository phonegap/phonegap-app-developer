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

var PLAT;
(function getPlatform() {
    var platforms = {
        amazon_fireos: /cordova-amazon-fireos/,
        android: /Android/,
        ios: /(iPad)|(iPhone)|(iPod)/,
        blackberry10: /(BB10)/,
        blackberry: /(PlayBook)|(BlackBerry)/,
        windows8: /MSAppHost/,
        windowsphone: /Windows Phone/,
        firefoxos: /Firefox/
    };
    for (var key in platforms) {
        if (platforms[key].exec(navigator.userAgent)) {
            PLAT = key;
            break;
        }
    }
})();

var scripts = document.getElementsByTagName('script');
var currentPath = scripts[scripts.length - 1].src;
if (PLAT !== "blackberry10" && PLAT !== "firefoxos" && PLAT !== 'windowsphone') {
    currentPath += '?paramShouldBeIgnored';
}
var cordovaPath = currentPath.replace("cordova-incl.js", "cordova.js");

if (!window._doNotWriteCordovaScript) {
    if (PLAT != "windows8") {
        document.write('<script type="text/javascript" charset="utf-8" src="' + cordovaPath + '"></script>');
    } else {
        var s = document.createElement('script');
        s.src = cordovaPath;
        document.head.appendChild(s);
    }
}

function addListenerToClass(className, listener, argsArray, action, doNotWrap) {
    if (!action) {
      action='click';
    }
    var elements = document.getElementsByClassName(className);
    // choose Event target as a scope (like inline scripts)
    if (!doNotWrap) {
      if (argsArray && !Array.isArray(argsArray)) {
        argsArray = [argsArray];
      }
      function callListener(e) {
        listener.apply(null, argsArray);
      }
    } else {
      callListener = listener;
    }
    for (var i = 0; i < elements.length; ++i) {
      var item = elements[i];  
      item.addEventListener(action, callListener, false);
    }
};

function backHome() {
    if (window.device && device.platform && (device.platform.toLowerCase() == 'android' || device.platform.toLowerCase() == 'amazon-fireos')) {
        navigator.app.backHistory();
    }
    else {
        window.history.go(-1);
    }
}
