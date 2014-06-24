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

describe('Battery (navigator.battery)', function () {

    // used to keep the count of event listeners > 0, in order to avoid battery level being updated with the real value when adding the first listener during test cases
    var dummyOnEvent = jasmine.createSpy();
    beforeEach(function () {
        window.addEventListener("batterycritical", dummyOnEvent, false);
    });

    afterEach(function () {
        window.removeEventListener("batterystatus", dummyOnEvent, false);
    });


    it("battery.spec.1 should exist", function() {
        expect(navigator.battery).toBeDefined();
    });

    it("battery.spec.2 should fire batterystatus events", function () {

        // batterystatus
        var onEvent;
        
        runs(function () {
            onEvent = jasmine.createSpy().andCallFake(function () {
                window.removeEventListener("batterystatus", onEvent, false);
            });
            window.addEventListener("batterystatus", onEvent, false);
            navigator.battery._status({ level: 30, isPlugged: false });
        });
        waitsFor(function () { return onEvent.wasCalled; }, "batterystatus onEvent was not called", 100);
        runs(function () {
            expect(onEvent).toHaveBeenCalled();
        });

    });

    it("battery.spec.3 should fire batterylow events", function () {

        var onEvent;
        
        // batterylow 30 -> 20
        runs(function () {
            onEvent = jasmine.createSpy().andCallFake(function () {
                //console.log("batterylow fake callback called");
                window.removeEventListener("batterylow", onEvent, false);
            });
            window.addEventListener("batterylow", onEvent, false);
            navigator.battery._status({ level: 20, isPlugged: false });
        });
        waitsFor(function () { return onEvent.wasCalled; }, "batterylow onEvent was not called when level goes from 30->20", 100);
        runs(function () {
            expect(onEvent).toHaveBeenCalled();
        });

        // batterylow 30 -> 19
        runs(function () {
            onEvent = jasmine.createSpy().andCallFake(function () {
                //console.log("batterylow fake callback called");
                window.removeEventListener("batterylow", onEvent, false);
            });
            navigator.battery._status({ level: 30, isPlugged: false });
            window.addEventListener("batterylow", onEvent, false);
            navigator.battery._status({ level: 19, isPlugged: false });
        });
        waitsFor(function () { return onEvent.wasCalled; }, "batterylow onEvent was not called when level goes from 30->19", 100);
        runs(function () {
            expect(onEvent).toHaveBeenCalled();
        });

    });

    it("battery.spec.4 should fire batterycritical events", function () {

        var onEvent;

        // batterycritical 19->5
        runs(function () {
            onEvent = jasmine.createSpy().andCallFake(function () {
                window.removeEventListener("batterycritical", onEvent, false);
            });
            window.addEventListener("batterycritical", onEvent, false);
            navigator.battery._status({ level: 5, isPlugged: false });
        });
        waitsFor(function () { return onEvent.wasCalled; }, "batterycritical onEvent was not called  when level goes from 19->5", 100);
        runs(function () {
            expect(onEvent).toHaveBeenCalled();
        });
        
        // batterycritical 19->4
        runs(function () {
            onEvent = jasmine.createSpy().andCallFake(function () {
                window.removeEventListener("batterycritical", onEvent, false);
            });
            navigator.battery._status({ level: 19, isPlugged: false });
            window.addEventListener("batterycritical", onEvent, false);
            navigator.battery._status({ level: 4, isPlugged: false });
        });
        waitsFor(function () { return onEvent.wasCalled; }, "batterycritical onEvent was not called  when level goes from 19->4", 100);
        runs(function () {
            expect(onEvent).toHaveBeenCalled();
        });
    });

    it("battery.spec.5 should NOT fire events when charging or level is increasing", function () {
       var onEvent;
       // setup: batterycritical should fire when level decreases (100->4) ( CB-4519 )
       runs(function () {
            onEvent = jasmine.createSpy("onbatterycritical");
            navigator.battery._status({ level: 100, isPlugged: false });
            window.addEventListener("batterycritical", onEvent, false);
            navigator.battery._status({ level: 4, isPlugged: false });
            });
       waits(100);
       runs(function () {
            expect(onEvent).toHaveBeenCalled();
            });
       
       // batterycritical should not fire when level increases (4->5)( CB-4519 )
       runs(function () {
            onEvent = jasmine.createSpy("onbatterycritical");
            navigator.battery._status({ level: 4, isPlugged: false });
            window.addEventListener("batterycritical", onEvent, false);
            navigator.battery._status({ level: 5, isPlugged: false });
            });
       waits(100);
       runs(function () {
            expect(onEvent).not.toHaveBeenCalled();
            });
        // batterylow should not fire when level increases (5->20) ( CB-4519 )
        runs(function () {
            onEvent = jasmine.createSpy("onbatterylow");
            window.addEventListener("batterylow", onEvent, false);
            navigator.battery._status({ level: 20, isPlugged: false });
        });
        waits(100);
        runs(function () {
            expect(onEvent).not.toHaveBeenCalled();
        });

        // batterylow should NOT fire if we are charging   ( CB-4520 )
        runs(function () {
            onEvent = jasmine.createSpy("onbatterylow");
            navigator.battery._status({ level: 21, isPlugged: true });
            window.addEventListener("batterylow", onEvent, false);
            navigator.battery._status({ level: 20, isPlugged: true });
        });
        waits(100);
        runs(function () {
            expect(onEvent).not.toHaveBeenCalled();
        });

        // batterycritical should NOT fire if we are charging   ( CB-4520 )
        runs(function () {
            onEvent = jasmine.createSpy("onbatterycritical");
            navigator.battery._status({ level: 6, isPlugged: true });
            window.addEventListener("batterycritical", onEvent, false);
            navigator.battery._status({ level: 5, isPlugged: true });
            
        });
        waits(100);
        runs(function () {
            expect(onEvent).not.toHaveBeenCalled();
        });
    });

});
