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

var Q    = require('Q'),
    fs   = require('fs'),
    path = require('path'),
    proc = require('child_process'),
    msbuildTools = require('./MSBuildTools');

// returns path to XapDeploy util from Windows Phone 8.1 SDK
module.exports.getXapDeploy = function () {
    var xapDeployUtils = path.join((process.env["ProgramFiles(x86)"] || process.env["ProgramFiles"]),
        'Microsoft SDKs', 'Windows Phone', 'v8.0', 'Tools', 'Xap Deployment', 'XapDeployCmd.exe');
    // Check if XapDeployCmd is exists
    if (!fs.existsSync(xapDeployUtils)) {
        console.warn("WARNING: XapDeploy tool (XapDeployCmd.exe) didn't found. Assume that it's in %PATH%");
        return Q.resolve("XapDeployCmd");
    }
    return Q.resolve(xapDeployUtils);
};

module.exports.getOSVersion = function () {
    return module.exports.exec('reg query "HKLM\\Software\\Microsoft\\Windows NT\\CurrentVersion" /v CurrentVersion')
    .then(function(output) {
        // fetch msbuild path from 'reg' output
        var version = /CurrentVersion\s+REG_SZ\s+(.*)/i.exec(output);
        if (version) {
            return Q.resolve(version[1]);
        }
        return Q.reject('Can\'t fetch version number from reg output');
    }, function (err) {
        return Q.reject('Failed to query OS version ' + err);
    });
};

module.exports.getSDKVersion = function () {
    var is64bitSystem = process.env["PROCESSOR_ARCHITECTURE"] != 'x86';
    return msbuildTools.findAvailableVersion(is64bitSystem)
    .then(function (msbuild) {
        return module.exports.exec(module.exports.quote(path.join(msbuild.path, 'msbuild')) + ' -version')
        .then(function (output) {
            var version = /\.NET\sFramework\,\s[a-z]+\s(\d+\.\d+\.\d+)/gi.exec(output);
            if (version) {
                return Q.resolve(version[1]);
            }
            return Q.reject('Unable to get the .NET Framework version');
        }, function (err) {
            return Q.reject('Unable to get the .NET Framework version: ' + err);
        });
    });
};

// checks to see if a .jsproj file exists in the project root
module.exports.isCordovaProject = function (platformpath) {
    if (fs.existsSync(platformpath)) {
        var files = fs.readdirSync(platformpath);
        for (var i in files){
            if (path.extname(files[i]) == '.csproj'){
                return true;
            }
        }
    }
    return false;
};

// Takes a command and optional current working directory.
// Returns a promise that either resolves with the stdout, or
// rejects with an error message and the stderr.
module.exports.exec = function(cmd, opt_cwd) {
    var d = Q.defer();
    try {
        proc.exec(cmd, {cwd: opt_cwd, maxBuffer: 1024000}, function(err, stdout, stderr) {
            if (err) d.reject('Error executing "' + cmd + '": ' + stderr);
            else d.resolve(stdout);
        });
    } catch(e) {
        console.error('error caught: ' + e);
        d.reject(e);
    }
    return d.promise;
};

// Takes a command and optional current working directory.
module.exports.spawn = function(cmd, args, opt_cwd) {
    var d = Q.defer();
    try {
        var child = proc.spawn(cmd, args, {cwd: opt_cwd, stdio: 'inherit'});
        child.on('exit', function(code) {
            if (code) {
                d.reject('Error code ' + code + ' for command: ' + cmd + ' with args: ' + args);
            } else {
                d.resolve();
            }
        });
    } catch(e) {
        console.error('error caught: ' + e);
        d.reject(e);
    }
    return d.promise;
};

module.exports.quote = function(str) {
    return '"' + str + '"';
};
