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

var cordova = require('cordova');

var batteryListenerId = null;

module.exports = {
    start: function(successCallback, errorCallback) {
        var batterySuccessCallback = function(power) {
            if (successCallback) {
                successCallback({level: Math.round(power.level * 100), isPlugged: power.isCharging});
            }
        };

        if (batteryListenerId === null) {
            batteryListenerId = tizen.systeminfo.addPropertyValueChangeListener("BATTERY", batterySuccessCallback);
        }

        tizen.systeminfo.getPropertyValue("BATTERY", batterySuccessCallback, errorCallback);
    },

    stop: function(successCallback, errorCallback) {
        tizen.systeminfo.removePropertyValueChangeListener(batteryListenerId);
        batteryListenerId = null;
    }
};

require("cordova/tizen/commandProxy").add("Battery", module.exports);
