---
license: Licensed to the Apache Software Foundation (ASF) under one
         or more contributor license agreements.  See the NOTICE file
         distributed with this work for additional information
         regarding copyright ownership.  The ASF licenses this file
         to you under the Apache License, Version 2.0 (the
         "License"); you may not use this file except in compliance
         with the License.  You may obtain a copy of the License at

           http://www.apache.org/licenses/LICENSE-2.0

         Unless required by applicable law or agreed to in writing,
         software distributed under the License is distributed on an
         "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
         KIND, either express or implied.  See the License for the
         specific language governing permissions and limitations
         under the License.
---

batterylow
===========

This is an event that fires when a Cordova application detects the battery has reached the low level threshold.

    window.addEventListener("batterylow", yourCallbackFunction, false);

Details
-------

This event that fires when a Cordova application detects the percentage of battery has reached the low battery threshold. This value is device specific.

The batterylow handler will be called with an object that contains two properties:

- __level:__ The percentage of battery (0-100). _(Number)_
- __isPlugged:__ A boolean that represents whether or not the device is plugged in or not. _(Boolean)_

Typically, you will want to attach an event listener with `document.addEventListener` once you receive the Cordova 'deviceready' event.

Supported Platforms
-------------------

- iOS
- Android
- BlackBerry WebWorks (OS 5.0 and higher)
- Tizen
- Windows Phone 8

Quick Example
-------------

    window.addEventListener("batterylow", onBatteryLow, false);

    function onBatteryLow(info) {
        // Handle the battery low event
       	alert("Battery Level Low " + info.level + "%"); 
    }

Full Example
------------

    <!DOCTYPE html>
    <html>
      <head>
        <title>Cordova Device Ready Example</title>

        <script type="text/javascript" charset="utf-8" src="cordova-x.x.x.js"></script>
        <script type="text/javascript" charset="utf-8">

        // Call onDeviceReady when Cordova is loaded.
        //
        // At this point, the document has loaded but cordova-x.x.x.js has not.
        // When Cordova is loaded and talking with the native device,
        // it will call the event `deviceready`.
        // 
	    function onLoad() {
    	    document.addEventListener("deviceready", onDeviceReady, false);
    	}

        // Cordova is loaded and it is now safe to make calls Cordova methods
        //
        function onDeviceReady() {
		    window.addEventListener("batterylow", onBatteryLow, false);
        }

        // Handle the batterylow event
        //
        function onBatteryLow(info) {
	       	alert("Battery Level Low " + info.level + "%"); 
        }
        
        </script>
      </head>
      <body onload="onLoad()">
      </body>
    </html>
