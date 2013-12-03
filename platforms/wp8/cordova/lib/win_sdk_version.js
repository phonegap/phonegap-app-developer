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

var wscript_shell = WScript.CreateObject("WScript.Shell");

// log to stdout or stderr
function Log(msg, error) {
    if (error) {
        WScript.StdErr.WriteLine(msg);
    }
    else {
        WScript.StdOut.WriteLine(msg);
    }
}

// gets the output from a command, failing with the given error message
function check_command(cmd, fail_msg) {
    try {
        var out = wscript_shell.Exec(cmd);
    } catch(exception) {
        Log(fail_msg, true);
        WScript.Quit(1);
    }
    while (out.Status == 0) {
        WScript.Sleep(100);
    }

    //Check that command executed
    if (!out.StdErr.AtEndOfStream) {
        var line = out.StdErr.ReadLine();
        Log(fail_msg, true);
        Log('Output : ' + line, true);
        WScript.Quit(1);
    }

    if (!out.StdOut.AtEndOfStream) {
        var line = out.StdOut.ReadAll();
        return line;
    }
    else {
         Log('Unable to get output from command "' + cmd + '"', true);
         WScript.Quit(1);
    }
}

// Returns the sdk version of the .Net Framework
function getSdkVersion() {
    var cmd = 'msbuild -version'
    var fail_msg = 'The command `msbuild` failed. Make sure you have the latest Windows Phone SDKs installed, AND have the latest .NET framework added to your path (i.e C:\\Windows\\Microsoft.NET\\Framework\\v4.0.30319).'
    var output = check_command(cmd, fail_msg);
	var msversion = '';
	var msversion_reg = /\.NET\sFramework\,\s[a-z]+\s\d+\.\d+\.\d+/gi;
	if(msversion_reg.test(output)){
		msversion = output.match(msversion_reg)[0].match(/\d+\.\d+\.\d+/g);
		Log(msversion);
	}else {
		Log('Unable to get the .NET Framework version.',true);
        Log('Make sure the "msbuild" command is in your path', true);
        WScript.Quit(1);
    }
}

getSdkVersion();