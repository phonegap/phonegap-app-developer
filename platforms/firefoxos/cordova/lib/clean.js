#!/usr/bin/env node

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 
var fs = require('fs'),
    shjs = require('shelljs'),
    path = require('path'),
    check_reqs = require('./check_reqs'),
    platformBuildDir = path.join('platforms', 'firefoxos', 'build');

exports.cleanProject = function(){

    // Check that requirements are (stil) met
    if (!check_reqs.run()) {
        console.error('Please make sure you meet the software requirements in order to clean an firefoxos cordova project');
        process.exit(2);
    }
    
    console.log('Cleaning Firefoxos project');
    try {
        if (fs.existsSync(platformBuildDir)) {
            shjs.rm('-r', platformBuildDir);
        }
    }
    catch(err) {
        console.log('could not remove '+platformBuildDir+' : '+err.message);
    }


}

