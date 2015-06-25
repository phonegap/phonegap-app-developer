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

/* jshint sub:true */

var Q     = require('Q'),
    path  = require('path'),
    nopt  = require('nopt'),
    utils = require('./utils'),
    shell = require('shelljs'),
    MSBuildTools = require('./MSBuildTools');

// Platform project root folder
var ROOT = path.join(__dirname, '..', '..');

function parseAndValidateArgs(argv) {
    // parse and validate args
    var args = nopt({'debug': Boolean, 'release': Boolean, 'archs': [String]}, {'-r': '--release'}, argv);
    // Validate args
    if (args.debug && args.release) {
        return Q.reject('Only one of "debug"/"release" options should be specified');
    }
    // get build options/defaults and resolvew with buildopts object
    return Q.resolve({
        buildType: args.release ? 'release' : 'debug',
        buildArchs: args.archs ? args.archs.split(' ') : ['anycpu'],
    });
}

// help/usage function
module.exports.help = function () {
    console.log('');
    console.log('Usage: build [ --debug | --release ] [--archs="<list of architectures...>"]');
    console.log('    --help    : Displays this dialog.');
    console.log('    --debug   : Cleans and builds project in debug mode.');
    console.log('    --release : Cleans and builds project in release mode.');
    console.log('    --release : Cleans and builds project in release mode.');
    console.log('    --archs   : Builds project binaries for specific chip architectures. `arm` and `x86` are supported for wp8');
    console.log('examples:');
    console.log('    build ');
    console.log('    build --debug');
    console.log('    build --release');
    console.log('    build --release --archs="arm x86"');
    console.log('');
};

// builds cordova-windows application with parameters provided.
// See 'help' function for args list
module.exports.run = function (argv) {
    if (!utils.isCordovaProject(ROOT)){
        return Q.reject('Could not find project at ' + ROOT);
    }

    return parseAndValidateArgs(argv)
    .then(function (buildopts) {
        // WP8 requires x86 version of MSBuild, CB-6732
        var is64bitSystem = process.env['PROCESSOR_ARCHITECTURE'] != 'x86';

        // Get available msbuild tools
        return MSBuildTools.findAvailableVersion(is64bitSystem)
        .then(function (msbuildTools) {
            // then build all architectures specified
            // chain promises each after previous with reduce function
            return buildopts.buildArchs.reduce(function (promise, buildarch) {
                return promise.then(function () {
                    buildarch = buildarch == 'anycpu' ? 'any cpu' : buildarch;
                    // search for first solution file found
                    // this is performed due to solution file can be renamed in create
                    var solutionFiles = shell.ls(path.join(ROOT, '*.sln'));
                    if (solutionFiles && solutionFiles[0]) {
                      return msbuildTools.buildProject(solutionFiles[0], buildopts.buildType, buildarch);
                    }
                    return Q.reject('No solution files found in project directory');
                });
            }, Q());
        });
    });
};