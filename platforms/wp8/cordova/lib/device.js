/*
       Licensed to the Apache Software Foundation (ASF) under one
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
*/

var Q     = require('q'),
    fs    = require('fs'),
    path  = require('path'),
    shell = require('shelljs'),
    utils = require('./utils');

// returns one of available devices which name match with parovided string
// return rejected promise if device with name specified not found
module.exports.findDevice = function (target) {
    target = target.toLowerCase();
    return module.exports.listDevices().then(function(deviceList) {
        // CB-7616 since we use partial match shorter names should go first,
        // example case is ['Emulator WVGA 512MB', 'Emulator WVGA']
        var sortedList = deviceList.concat().sort(function (l, r) { return l.length > r.length; });
        for (var idx in sortedList) {
            if (sortedList[idx].toLowerCase().indexOf(target) > -1) {
                // we should return index based on original list
                return Q.resolve(deviceList.indexOf(sortedList[idx]));
            }
        }
        return Q.reject('Specified device not found');
    });
};

// returns array of available devices names
module.exports.listDevices = function () {
    return utils.getXapDeploy()
    .then(function(xapDeploy) {
        return utils.exec('"' + xapDeploy + '" /enumeratedevices')
        .then(function(output) {
            return Q.resolve(output.split('\n').map(function(line) {
                var match = /\s*(\d)+\s+(.*)/.exec(line);
                return match && match[2];
            }).filter(function (line) {
                return line;
            }));
        });
    });
};