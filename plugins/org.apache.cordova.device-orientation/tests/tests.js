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
    var fail = function (done, message) {
        message = (typeof message !== 'string') ? "Forced failure: wrong callback called" : message;
        expect(true).toFailWithMessage(message);
        done();
    },
        unexpectedSuccess = "Forced failure: success callback should not have been called",
        unexpectedFailure = "Forced failure: error callback should not have been called";

    describe('Compass (navigator.compass)', function () {
        var hardwarefailure = false;
        beforeEach(function () {
            jasmine.Expectation.addMatchers({
                toFailWithMessage: function () {
                    return {
                        compare: function (actual, customMessage) {
                            var pass = false;
                            if (customMessage === undefined) {
                                customMessage = "Forced failure: wrong callback called";
                            }
                            return {
                                pass: pass,
                                message: customMessage
                            };
                        }
                    };
                }
            });
        });

        it("compass.hardwarecheck is compass supported", function (done) {
            navigator.compass.getCurrentHeading(function onSuccess() { done(); },
                function onError(error) {
                    if (error.code == CompassError.COMPASS_NOT_SUPPORTED) {
                        hardwarefailure = true;
                        expect(this).toFailWithMessage("The device does not have compass support. Any tests relying on support will be marked pending.");
                    }
                    done();
                });
        });

        it("compass.spec.1 should exist", function () {
            console.log("In spec 1");
            expect(navigator.compass).toBeDefined();
        });

        it("compass.spec.2 should contain a getCurrentHeading function", function () {
            expect(navigator.compass.getCurrentHeading).toBeDefined();
            expect(typeof navigator.compass.getCurrentHeading == 'function').toBe(true);
        });

        it("compass.spec.3 getCurrentHeading success callback should be called with a Heading object", function (done) {
            if (hardwarefailure) {
                pending();
            }
            navigator.compass.getCurrentHeading(function (a) {
                expect(a instanceof CompassHeading).toBe(true);
                expect(a.magneticHeading).toBeDefined();
                expect(typeof a.magneticHeading == 'number').toBe(true);
                expect(a.trueHeading).not.toBe(undefined);
                expect(typeof a.trueHeading == 'number' || a.trueHeading === null).toBe(true);
                expect(a.headingAccuracy).not.toBe(undefined);
                expect(typeof a.headingAccuracy == 'number' || a.headingAccuracy === null).toBe(true);
                expect(typeof a.timestamp == 'number').toBe(true);
                done();
            }, fail.bind(null, done, unexpectedFailure));
        });

        it("compass.spec.4 should contain a watchHeading function", function () {
            expect(navigator.compass.watchHeading).toBeDefined();
            expect(typeof navigator.compass.watchHeading == 'function').toBe(true);
        });

        it("compass.spec.5 should contain a clearWatch function", function () {
            expect(navigator.compass.clearWatch).toBeDefined();
            expect(typeof navigator.compass.clearWatch == 'function').toBe(true);
        });

        describe('Compass Constants (window.CompassError)', function () {
            it("compass.spec.1 should exist", function () {
                expect(window.CompassError).toBeDefined();
                expect(window.CompassError.COMPASS_INTERNAL_ERR).toBe(0);
                expect(window.CompassError.COMPASS_NOT_SUPPORTED).toBe(20);
            });
        });

        describe('Compass Heading model (CompassHeading)', function () {
            it("compass.spec.1 should exist", function () {
                expect(CompassHeading).toBeDefined();
            });

            it("compass.spec.8 should be able to create a new CompassHeading instance with no parameters", function () {
                var h = new CompassHeading();
                expect(h).toBeDefined();
                expect(h.magneticHeading).toBeUndefined();
                expect(h.trueHeading).toBeUndefined();
                expect(h.headingAccuracy).toBeUndefined();
                expect(typeof h.timestamp == 'number').toBe(true);
            });

            it("compass.spec.9 should be able to create a new CompassHeading instance with parameters", function () {
                var h = new CompassHeading(1, 2, 3, 4);
                expect(h.magneticHeading).toBe(1);
                expect(h.trueHeading).toBe(2);
                expect(h.headingAccuracy).toBe(3);
                expect(h.timestamp.valueOf()).toBe(4);
                expect(typeof h.timestamp == 'number').toBe(true);
            });
        });
    });
};

/******************************************************************************/
/******************************************************************************/
/******************************************************************************/

exports.defineManualTests = function (contentEl, createActionButton) {
    function roundNumber(num) {
        var dec = 3;
        var result = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
        return result;
    }

    var watchCompassId = null;

    /**
     * Start watching compass
     */
    var watchCompass = function () {
        console.log("watchCompass()");

        // Success callback
        var success = function (a) {
            document.getElementById('compassHeading').innerHTML = roundNumber(a.magneticHeading);
        };

        // Fail callback
        var fail = function (e) {
            console.log("watchCompass fail callback with error code " + e);
            stopCompass();
            setCompassStatus(e);
        };

        // Stop compass if running
        stopCompass();

        // Update heading every 1 sec
        var opt = {};
        opt.frequency = 1000;
        watchCompassId = navigator.compass.watchHeading(success, fail, opt);

        setCompassStatus("Running");
    };

    /**
     * Stop watching the acceleration
     */
    var stopCompass = function () {
        setCompassStatus("Stopped");
        if (watchCompassId) {
            navigator.compass.clearWatch(watchCompassId);
            watchCompassId = null;
        }
    };

    /**
     * Get current compass
     */
    var getCompass = function () {
        console.log("getCompass()");

        // Stop compass if running
        stopCompass();

        // Success callback
        var success = function (a) {
            document.getElementById('compassHeading').innerHTML = roundNumber(a.magneticHeading);
        };

        // Fail callback
        var fail = function (e) {
            console.log("getCompass fail callback with error code " + e.toString);
            setCompassStatus(e);
        };

        // Make call
        var opt = {};
        navigator.compass.getCurrentHeading(success, fail, opt);
    };

    /**
     * Set compass status
     */
    var setCompassStatus = function (status) {
        document.getElementById('compass_status').innerHTML = status;
    };

    /******************************************************************************/

    var orientation_tests = '<h3>iOS devices may bring up a calibration screen when initiating these tests</h3>' +
        '<div id="getCompass"></div>' +
        'Expected result: Will update the status box with current heading. Status will read "Stopped"' +
        '<p/> <div id="watchCompass"></div>' +
        'Expected result: When pressed, will start a watch on the compass and update the heading value when heading changes. Status will read "Running"' +
        '<p/> <div id="stopCompass"></div>' +
        'Expected result: Will clear the compass watch, so heading value will no longer be updated. Status will read "Stopped"';

    contentEl.innerHTML = '<div id="info"><b>Status: </b>' +
        '<span id="compass_status">Stopped</span>' +
        '<table width="100%"><tr>' +
        '<td width="33%">Heading: <span id="compassHeading"></span>' +
        '</td></tr></table></div>' +
        orientation_tests;

    createActionButton('Get Compass', function () {
        getCompass();
    }, 'getCompass');

    createActionButton('Start Watching Compass', function () {
        watchCompass();
    }, 'watchCompass');

    createActionButton('Stop Watching Compass', function () {
        stopCompass();
    }, 'stopCompass');
};
