<!--
#
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
#  KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
#
-->

## Creating the mobile-spec app

`createmobilespec` is a script for creating a test app that has:

  * the mobile-spec code from the local `cordova-mobile-spec` git repo
  * a `cordova.js` file that is freshly built from the local `cordova-js`
    git repo
  * the platform (i.e., Android) from the local platform git repo (i.e., 
    `cordova-android`)
  * all the plugins from the local plugin repos (i.e., cordova-plugin-device)
  * it was built using the local `cordova-cli` and `cordova-plugman` git repos

In other words, it is a great way to test your local development efforts.

The script also has options for creating the test app using a
globally-installed npm module, a way to use the platform's `cordova.js` file
instead of building it from the local `cordova-js` git repo, and a way to
use the platform-centered workflow instead of the CLI.

### Requirements

See the README.md in the parent directory (cordova-mobile-spec).

Each git repo should be checked out to the state or edited with the content
that you want to test. It does not download content from the
[plugin registry](http://plugins.cordova.io)
nor does it fetch platforms from the npm repository.

Before running `createmobilespec.js` for the first time, run `npm install` from
within the `createmobilespec` directory to install the requisite third-party
Node modules. This should be a one-time activity, unless there is a change
in the pre-reqs.

### Running

The `createmobilespec.js` script needs to be invoked from a specific
current working directory: the one where you have all the git repos
cloned. So if you were to do an `ls` in that directory, you should see all
the git repos including `cordova-mobile-spec`. Thus an invocation should
look like:

        cordova-mobile-spec/createmobilespec/createmobilespec.js

To see the options available in the script, run it with the `-h` option to
print the online help.

After you have run the script to create the app, then you can run the app on a
device or simulator, using the standard method for that platform(s). For
example on Android:

        cd mobilespec
        ./cordova run android

