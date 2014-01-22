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
if (/cordova-amazon-fireos/.exec(navigator.userAgent)) {
    PLAT = 'amazon-fireos';
} else if (/Android/.exec(navigator.userAgent)) {
    PLAT = 'android';
} else if (/(iPad)|(iPhone)|(iPod)/.exec(navigator.userAgent)) {
    PLAT = 'ios';
} else if (/(BB10)|(PlayBook)|(BlackBerry)/.exec(navigator.userAgent)) {
    PLAT = 'blackberry';
}

var scripts = document.getElementsByTagName('script');
var currentPath = scripts[scripts.length - 1].src;
var platformCordovaPath = currentPath.replace("cordova-incl.js", "cordova." + PLAT + ".js");
var normalCordovaPath = currentPath.replace("cordova-incl.js", "cordova.js");
var cordovaPath = normalCordovaPath;

if (PLAT) {
    // XHR to local file is an error on some platforms, windowsphone for one 
    try {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", platformCordovaPath, false);
        xhr.onreadystatechange = function() {

            if (this.readyState == this.DONE && this.responseText.length > 0) {
                if(parseInt(this.status) >= 400){
                    cordovaPath = normalCordovaPath;
                }else{
                    cordovaPath = platformCordovaPath;
                }
            }
        };
        xhr.send(null);
    }
    catch(e){
        cordovaPath = normalCordovaPath;
    } // access denied!
}

if (!window._doNotWriteCordovaScript) {
    document.write('<script type="text/javascript" charset="utf-8" src="' + cordovaPath + '"></script>');
}

function backHome() {
	if (window.device && device.platform && (device.platform.toLowerCase() == 'android' || device.platform.toLowerCase() == 'amazon-fireos')) {
            navigator.app.backHistory();
	}
	else {
	    window.history.go(-1);
	}
}
