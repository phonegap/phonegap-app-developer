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
exports.defineAutoTests = function () {
    var fail = function (done) {
        expect(true).toBe(false);
        done();
    },
    succeed = function (done) {
        expect(true).toBe(true);
        done();
    };

    describe('Geolocation (navigator.geolocation)', function () {

        it("geolocation.spec.1 should exist", function () {
            expect(navigator.geolocation).toBeDefined();
        });

        it("geolocation.spec.2 should contain a getCurrentPosition function", function () {
            expect(typeof navigator.geolocation.getCurrentPosition).toBeDefined();
            expect(typeof navigator.geolocation.getCurrentPosition == 'function').toBe(true);
        });

        it("geolocation.spec.3 should contain a watchPosition function", function () {
            expect(typeof navigator.geolocation.watchPosition).toBeDefined();
            expect(typeof navigator.geolocation.watchPosition == 'function').toBe(true);
        });

        it("geolocation.spec.4 should contain a clearWatch function", function () {
            expect(typeof navigator.geolocation.clearWatch).toBeDefined();
            expect(typeof navigator.geolocation.clearWatch == 'function').toBe(true);
        });

    });

    describe('getCurrentPosition method', function () {

        describe('error callback', function () {

            it("geolocation.spec.5 should be called if we set timeout to 0 and maximumAge to a very small number", function (done) {
                navigator.geolocation.getCurrentPosition(
                    fail.bind(null, done),
                    succeed.bind(null, done),
                    {
                        maximumAge: 0,
                        timeout: 0
                    });
            });

        });

        describe('success callback', function () {

            it("geolocation.spec.6 should be called with a Position object", function (done) {
                navigator.geolocation.getCurrentPosition(function (p) {
                    expect(p.coords).toBeDefined();
                    expect(p.timestamp).toBeDefined();
                    done();
                },
                fail.bind(null, done),
                {
                    maximumAge: 300000 // 5 minutes maximum age of cached position
                });
            });

        });

    });

    describe('watchPosition method', function () {

        describe('error callback', function () {

            var errorWatch = null;
            afterEach(function () {
                navigator.geolocation.clearWatch(errorWatch);
            });

            it("geolocation.spec.7 should be called if we set timeout to 0 and maximumAge to a very small number", function (done) {
                errorWatch = navigator.geolocation.watchPosition(
                    fail.bind(null, done),
                    succeed.bind(null, done),
                    {
                        maximumAge: 0,
                        timeout: 0
                    });
            });

        });

        describe('success callback', function () {

            var successWatch = null;
            afterEach(function () {
                navigator.geolocation.clearWatch(successWatch);
            });

            it("geolocation.spec.8 should be called with a Position object", function (done) {

                successWatch = navigator.geolocation.watchPosition(
                    function (p) {
                        expect(p.coords).toBeDefined();
                        expect(p.timestamp).toBeDefined();
                        done();
                    },
                    fail.bind(null, done),
                    {
                        maximumAge: (5 * 60 * 1000) // 5 minutes maximum age of cached position
                    });

            });

        });

    });

};

/******************************************************************************/
/******************************************************************************/
/******************************************************************************/

exports.defineManualTests = function (contentEl, createActionButton) {
    var newGeolocation = navigator.geolocation;
    var origGeolocation = cordova.require('cordova/modulemapper').getOriginalSymbol(window, 'navigator.geolocation');
    if (!origGeolocation) {
        origGeolocation = newGeolocation;
        newGeolocation = null;
    }

    var watchLocationId = null;

    /**
     * Start watching location
     */
    var watchLocation = function (usePlugin) {
        console.log("watchLocation()");
        var geo = usePlugin ? newGeolocation : origGeolocation;
        if (!geo) {
            alert('geolocation object is missing. usePlugin = ' + usePlugin);
            return;
        }

        // Success callback
        var success = function (p) {
            setLocationDetails(p);
        };

        // Fail callback
        var fail = function (e) {
            console.log("watchLocation fail callback with error code " + e);
            stopLocation(geo);
        };

        // Get location
        watchLocationId = geo.watchPosition(success, fail, { enableHighAccuracy: true });
        setLocationStatus("Running");
    };

    /**
     * Stop watching the location
     */
    var stopLocation = function (usePlugin) {
        console.log("stopLocation()");
        var geo = usePlugin ? newGeolocation : origGeolocation;
        if (!geo) {
            alert('geolocation object is missing. usePlugin = ' + usePlugin);
            return;
        }
        setLocationStatus("Stopped");
        if (watchLocationId) {
            geo.clearWatch(watchLocationId);
            watchLocationId = null;
        }
    };

    /**
     * Get current location
     */
    var getLocation = function (usePlugin, opts) {
        console.log("getLocation()");
        var geo = usePlugin ? newGeolocation : origGeolocation;
        if (!geo) {
            alert('geolocation object is missing. usePlugin = ' + usePlugin);
            return;
        }

        // Stop location if running
        stopLocation(geo);

        // Success callback
        var success = function (p) {
            setLocationDetails(p);
            setLocationStatus("Done");
        };

        // Fail callback
        var fail = function (e) {
            console.log("getLocation fail callback with error code " + e.code);
            setLocationStatus("Error: " + e.code);
        };

        setLocationStatus("Retrieving location...");

        // Get location
        geo.getCurrentPosition(success, fail, opts || { enableHighAccuracy: true }); //, {timeout: 10000});

    };

    /**
     * Set location status
     */
    var setLocationStatus = function (status) {
        document.getElementById('location_status').innerHTML = status;
    };
    var setLocationDetails = function (p) {
        var date = (new Date(p.timestamp));
        document.getElementById('latitude').innerHTML = p.coords.latitude;
        document.getElementById('longitude').innerHTML = p.coords.longitude;
        document.getElementById('altitude').innerHTML = p.coords.altitude;
        document.getElementById('accuracy').innerHTML = p.coords.accuracy;
        document.getElementById('heading').innerHTML = p.coords.heading;
        document.getElementById('speed').innerHTML = p.coords.speed;
        document.getElementById('altitude_accuracy').innerHTML = p.coords.altitudeAccuracy;
        document.getElementById('timestamp').innerHTML = date.toDateString() + " " + date.toTimeString();
    }

    /******************************************************************************/

    var location_div = '<div id="info">' +
            '<b>Status:</b> <span id="location_status">Stopped</span>' +
            '<table width="100%">',
        latitude = '<tr>' +
            '<td><b>Latitude:</b></td>' +
            '<td id="latitude">&nbsp;</td>' +
            '<td>(decimal degrees) geographic coordinate [<a href="http://dev.w3.org/geo/api/spec-source.html#lat">#ref]</a></td>' +
            '</tr>',
        longitude = '<tr>' +
            '<td><b>Longitude:</b></td>' +
            '<td id="longitude">&nbsp;</td>' +
            '<td>(decimal degrees) geographic coordinate [<a href="http://dev.w3.org/geo/api/spec-source.html#lat">#ref]</a></td>' +
            '</tr>',
        altitude = '<tr>' +
            '<td><b>Altitude:</b></td>' +
            '<td id="altitude">&nbsp;</td>' +
            '<td>null if not supported;<br>' +
            '(meters) height above the [<a href="http://dev.w3.org/geo/api/spec-source.html#ref-wgs">WGS84</a>] ellipsoid. [<a href="http://dev.w3.org/geo/api/spec-source.html#altitude">#ref]</a></td>' +
            '</tr>',
        accuracy = '<tr>' +
            '<td><b>Accuracy:</b></td>' +
            '<td id="accuracy">&nbsp;</td>' +
            '<td>(meters; non-negative; 95% confidence level) the accuracy level of the latitude and longitude coordinates. [<a href="http://dev.w3.org/geo/api/spec-source.html#accuracy">#ref]</a></td>' +
            '</tr>',
        heading = '<tr>' +
            '<td><b>Heading:</b></td>' +
            '<td id="heading">&nbsp;</td>' +
            '<td>null if not supported;<br>' +
            'NaN if speed == 0;<br>' +
            '(degrees; 0° ≤ heading < 360°) direction of travel of the hosting device- counting clockwise relative to the true north. [<a href="http://dev.w3.org/geo/api/spec-source.html#heading">#ref]</a></td>' +
            '</tr>',
        speed = '<tr>' +
            '<td><b>Speed:</b></td>' +
            '<td id="speed">&nbsp;</td>' +
            '<td>null if not supported;<br>' +
            '(meters per second; non-negative) magnitude of the horizontal component of the hosting device current velocity. [<a href="http://dev.w3.org/geo/api/spec-source.html#speed">#ref]</a></td>' +
            '</tr>',
        altitude_accuracy = '<tr>' +
            '<td><b>Altitude Accuracy:</b></td>' +
            '<td id="altitude_accuracy">&nbsp;</td>' +
            '<td>null if not supported;<br>(meters; non-negative; 95% confidence level) the accuracy level of the altitude. [<a href="http://dev.w3.org/geo/api/spec-source.html#altitude-accuracy">#ref]</a></td>' +
            '</tr>',
        time = '<tr>' +
            '<td><b>Time:</b></td>' +
            '<td id="timestamp">&nbsp;</td>' +
            '<td>(DOMTimeStamp) when the position was acquired [<a href="http://dev.w3.org/geo/api/spec-source.html#timestamp">#ref]</a></td>' +
            '</tr>' +
            '</table>' +
            '</div>',
        actions =
            '<h2>Use Built-in WebView navigator.geolocation</h2>' +
            '<div id="built-in-getLocation"></div>' +
            'Expected result: Will update all applicable values in status box for current location. Status will read Retrieving Location (may not see this if location is retrieved immediately) then Done.' +
            '<p/> <div id="built-in-watchLocation"></div>' +
            'Expected result: Will update all applicable values in status box for current location and update as location changes. Status will read Running.' +
            '<p/> <div id="built-in-stopLocation"></div>' +
            'Expected result: Will stop watching the location so values will not be updated. Status will read Stopped.' +
            '<p/> <div id="built-in-getOld"></div>' +
            'Expected result: Will update location values with a cached position that is up to 30 seconds old. Verify with time value. Status will read Done.' +
            '<h2>Use Cordova Geolocation Plugin</h2>' +
            '<div id="cordova-getLocation"></div>' +
            'Expected result: Will update all applicable values in status box for current location. Status will read Retrieving Location (may not see this if location is retrieved immediately) then Done.' +
            '<p/> <div id="cordova-watchLocation"></div>' +
            'Expected result: Will update all applicable values in status box for current location and update as location changes. Status will read Running.' +
            '<p/> <div id="cordova-stopLocation"></div>' +
            'Expected result: Will stop watching the location so values will not be updated. Status will read Stopped.' +
            '<p/> <div id="cordova-getOld"></div>' +
            'Expected result: Will update location values with a cached position that is up to 30 seconds old. Verify with time value. Status will read Done.',
        values_info =
            '<h3>Details about each value are listed below in the status box</h3>',
        note = 
            '<h3>Allow use of current location, if prompted</h3>';

    contentEl.innerHTML = values_info + location_div + latitude + longitude + altitude + accuracy + heading + speed
        + altitude_accuracy + time + note + actions;

    createActionButton('Get Location', function () {
        getLocation(false);
    }, 'built-in-getLocation');

    createActionButton('Start Watching Location', function () {
        watchLocation(false);
    }, 'built-in-watchLocation');

    createActionButton('Stop Watching Location', function () {
        stopLocation(false);
    }, 'built-in-stopLocation');

    createActionButton('Get Location Up to 30 Sec Old', function () {
        getLocation(false, { maximumAge: 30000 });
    }, 'built-in-getOld');

    createActionButton('Get Location', function () {
        getLocation(true);
    }, 'cordova-getLocation');

    createActionButton('Start Watching Location', function () {
        watchLocation(true);
    }, 'cordova-watchLocation');

    createActionButton('Stop Watching Location', function () {
        stopLocation(true);
    }, 'cordova-stopLocation');

    createActionButton('Get Location Up to 30 Sec Old', function () {
        getLocation(true, { maximumAge: 30000 });
    }, 'cordova-getOld');
};
