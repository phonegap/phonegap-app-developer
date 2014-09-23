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

var mozBattery = cordova.require('cordova/modulemapper').getOriginalSymbol(window, 'navigator.battery') || navigator.mozBattery;

var Battery = {
    start: function(successCB, failCB, args, env) {
        if (mozBattery) {
            Battery.attachListeners(successCB);
        } else {
            failCB('Could not get window.navigator.battery');
        }
    },

    stop: function() {
        Battery.detachListeners();
    },

    attachListeners: function(_callBack) {

        Battery.updateBatteryStatus(_callBack); // send a battery status event

        mozBattery.addEventListener("chargingchange", function(){
            _callBack({level: (mozBattery.level * 100), isPlugged: mozBattery.charging});
        });

        mozBattery.addEventListener("levelchange", function(){
            _callBack({level: (mozBattery.level * 100), isPlugged: mozBattery.charging});
        });
    },

    detachListeners: function() {

        mozBattery.removeEventListener("chargingchange", null);
        mozBattery.removeEventListener("levelchange", null);
    },

    updateBatteryStatus: function(_callBack) {
        _callBack({level: (mozBattery.level * 100), isPlugged: mozBattery.charging});
    }
};

require("cordova/exec/proxy").add("Battery", Battery);
