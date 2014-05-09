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

/* This test requires some extra code to run, because we want benchmark results */

/*
 It's never going to be OVER 9000
 http://youtu.be/SiMHTK15Pik 
*/
var FENCEPOST = 9000;

var exec = cordova.require('cordova/exec'),
    echo = cordova.require('cordova/plugin/echo'),
    startTime,
    endTime,
    callCount,
    durationMs = 1000,
    asyncEcho,
    useSetTimeout,
    payloadSize,
    payload;

var vanillaWin = function(result) {
    callCount++;
    if (result != payload) {
        console.log('Wrong echo data!');
    }
    var elapsedMs = new Date - startTime;
    if (elapsedMs < durationMs) {
        if (useSetTimeout) {
            setTimeout(echoMessage, 0);
        } else {
            echoMessage();
        }
    } else {
        endTime = +new Date;
    }
}

var reset = function()
{
    endTime = null;
    callCount = 0;
    useSetTimeout = false;
    payloadSize = 5;
    callsPerSecond = 0;
}

var echoMessage = function()
{
    echo(vanillaWin, fail, payload, asyncEcho);
}

var fail = function() {
    expect(false).toBe(true);
};

function createTestCase(jsToNativeModeName, nativeToJsModeName, testAsyncEcho) {
    it(jsToNativeModeName + '+' + nativeToJsModeName + ': Async='+testAsyncEcho, function() {
        if(jsToNativeModeName) expect(exec.jsToNativeModes[jsToNativeModeName]).toBeDefined();
        if(nativeToJsModeName) expect(exec.nativeToJsModes[nativeToJsModeName]).toBeDefined();
        reset();
        payload = new Array(payloadSize * 10 + 1).join('012\n\n 6789');
        asyncEcho = testAsyncEcho;
        if(jsToNativeModeName) exec.setJsToNativeBridgeMode(exec.jsToNativeModes[jsToNativeModeName]);
        if(nativeToJsModeName) exec.setNativeToJsBridgeMode(exec.nativeToJsModes[nativeToJsModeName]);

        waits(300);
        runs(function() {
            startTime = +new Date,
            echoMessage();
        });
        waitsFor(function() { return endTime; }, "never completed", durationMs * 2);
        runs(function() {
            var elapsedMs = endTime - startTime,
                callsPerSecond = callCount * 1000 / elapsedMs;
            expect(callsPerSecond).toBeLessThan(FENCEPOST);
        });
    });
};

// Wait so that the first benchmark doesn't have contention.
describe('Wait for page to load.', function() {
    it('waiting...', function() {
        waits(1000);
    });
});

// Before running on Android, set the following constants in NativeToJsMessagingBridge:
// - ENABLE_LOCATION_CHANGE_EXEC_MODE = true
// - DISABLE_EXEC_CHAINING = true
describe('Bridge with', function() {
    var AsyncModes = [true,false];
    for(var asmode in AsyncModes){
        console.log("Bridge in Async: "+asmode);
        if (exec.jsToNativeModes) {
        	for(var jnmode in exec.jsToNativeModes ) {
                console.log("Bridge js->native: "+ jnmode );
        	    if(exec.nativeToJsModes){
                    for(var njmode in exec.nativeToJsModes ){
                        console.log("Bridge native->: "+ njmode);
                        createTestCase( jnmode, njmode, asmode);
                    }
                } else {
                    console.log("Bridge js->native: none");
                    createTestCase(jnmode, '', asmode);
                }
        	}
        } else {
            console.log("Bridge js->native: none");
            for(var njmode in exec.nativeToJsModes ){
                console.log("Bridge native->: "+ njmode);
                createTestCase('', njmode , asmode);
            }
        }
    }
});
