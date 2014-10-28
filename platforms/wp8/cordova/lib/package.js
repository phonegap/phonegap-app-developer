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
    device = require ('./device'),
    utils = require('./utils');

function Package (packagepath) {
    this.packagePath = packagepath;
}

Package.prototype.deployTo = function (deployTarget) {
    var pkg = this;
    return utils.getXapDeploy()
    .then(function (xapDeploy) {
        var getTarget = deployTarget == "device" ? Q("de") :
            deployTarget == "emulator" ? Q("xd") : device.findDevice(deployTarget);

        return getTarget.then(function (target) {
            return utils.spawn(xapDeploy, ['/installlaunch', pkg.packagePath, '/targetdevice:' + target]);
        });
    });
};

// returns full path to package with chip architecture, build and project types specified
module.exports.getPackage = function (buildtype, buildarch) {
    var projectPath = path.resolve(path.join(__dirname, '..', '..'));
    var buildFolder = buildarch.toLowerCase() == 'anycpu' ?
        path.join(projectPath, 'Bin', buildtype) :
        path.join(projectPath, 'Bin', buildarch, buildtype);

    // reject promise if buildFolder folder doesn't exists
    if (!fs.existsSync(buildFolder)) {
        return Q.reject('Directory with build artefacts doesn\'t exists');
    }

    // search for first .appx file in specified folder
    var appxFiles = shell.ls(path.join(buildFolder, '*.xap'));
    if (appxFiles && appxFiles[0]) {
        // resolve with full path to file if found
        return Q.resolve(new Package(appxFiles[0]));
    }
    // else reject with error
    return Q.reject('Can\'t find package with ' + buildtype + ' build type and ' + buildarch + ' chip architecture');
};
