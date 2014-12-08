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

    describe('Battery (navigator.battery)', function () {

        it("battery.spec.1 should exist", function () {
            expect(navigator.battery).toBeDefined();
        });
    });

    describe('Battery Events', function () {
        // BatteryStatus
        beforeEach(function () {
            // Custom Matcher
            jasmine.Expectation.addMatchers({
                toBatteryStatus : function () {
                    return {
                        compare : function (status, message) {
                            var pass = status;
                            return {
                                pass : pass,
                                message : message
                            };
                        }
                    };
                }
            });
        });

        it("battery.spec.2 should fire batterystatus events", function (done) {
            var onEvent = function () {
                window.removeEventListener("batterystatus", onEvent, false);
                onEventFlag = true;
            },
            onEventFlag = false;
            // batterystatus -> 30
            window.addEventListener("batterystatus", onEvent, false);

            navigator.battery._status({
                level : 30,
                isPlugged : false
            });
            setTimeout(function () {
                expect(onEventFlag).toBatteryStatus('Listener: "batterystatus" event, it did not fire');
                done();
            }, 100);

        });

        it("battery.spec.3 should fire batterylow event (30 -> 20)", function (done) {

            var onEvent = function () {
                window.removeEventListener("batterylow", onEvent, false);
                onEventFlag = true;
            },
            onEventFlag = false;
            // batterylow 30 -> 20
            navigator.battery._status({
                level : 30,
                isPlugged : false
            });
            window.addEventListener("batterylow", onEvent, false);
            navigator.battery._status({
                level : 20,
                isPlugged : false
            });

            setTimeout(function () {
                expect(onEventFlag).toBatteryStatus('Listener: "batterylow" event (30 -> 20), it did not fire');
                done();
            }, 100);

        });

        it("battery.spec.3.1 should fire batterylow event (30 -> 19)", function (done) {

            var onEvent = function () {
                window.removeEventListener("batterylow", onEvent, false);
                onEventFlag = true;
            },
            onEventFlag = false;

            // batterylow 30 -> 19

            navigator.battery._status({
                level : 30,
                isPlugged : false
            });
            window.addEventListener("batterylow", onEvent, false);
            navigator.battery._status({
                level : 19,
                isPlugged : false
            });

            setTimeout(function () {
                expect(onEventFlag).toBatteryStatus('Listener: "batterylow" event (30 -> 19), it did not fire');
                done();
            }, 100);
        });

        it("battery.spec.3.2 should not fire batterylow event (5 -> 20)", function (done) {

            var onEvent = function () {
                window.removeEventListener("batterylow", onEvent, false);
                onEventFlag = false;
            },
            onEventFlag = true;

            // batterylow should not fire when level increases (5->20) ( CB-4519 )

            navigator.battery._status({
                level : 5,
                isPlugged : false
            });
            window.addEventListener("batterylow", onEvent, false);
            navigator.battery._status({
                level : 20,
                isPlugged : false
            });

            setTimeout(function () {
                expect(onEventFlag).toBatteryStatus('Listener: "batterylow" event (5 -> 20), should not be fired');
                done();
            }, 100);
        });

        it("battery.spec.3.3 batterylow event(21 -> 20) should not fire if charging", function (done) {

            var onEvent = function () {
                window.removeEventListener("batterylow", onEvent, false);
                onEventFlag = false;
            },
            onEventFlag = true;

            // batterylow should NOT fire if we are charging   ( CB-4520 )

            navigator.battery._status({
                level : 21,
                isPlugged : true
            });
            window.addEventListener("batterylow", onEvent, false);
            navigator.battery._status({
                level : 20,
                isPlugged : true
            });

            setTimeout(function () {
                expect(onEventFlag).toBatteryStatus('Listener: "batterylow" event (21 -> 20), should not be fired if charging');
                done();
            }, 100);
        });

        it("battery.spec.4 should fire batterycritical events (19 -> 5)", function (done) {
            var onEvent = function () {
                window.removeEventListener("batterycritical", onEvent, false);
                onEventFlag = true;
            },
            onEventFlag = false;

            // batterycritical 19->5
            navigator.battery._status({
                level : 19,
                isPlugged : false
            });
            window.addEventListener("batterycritical", onEvent, false);
            navigator.battery._status({
                level : 5,
                isPlugged : false
            });

            setTimeout(function () {
                expect(onEventFlag).toBatteryStatus('Listener: "batterycritical" event (19 -> 5), it did not fire');
                done();
            }, 100);

        });

        it("battery.spec.4.1 should fire batterycritical (19 -> 4) events", function (done) {
            var onEvent = function () {
                window.removeEventListener("batterycritical", onEvent, false);
                onEventFlag = true;
            },
            onEventFlag = false;

            // batterycritical 19->4
            navigator.battery._status({
                level : 19,
                isPlugged : false
            });
            window.addEventListener("batterycritical", onEvent, false);
            navigator.battery._status({
                level : 4,
                isPlugged : false
            });

            setTimeout(function () {
                expect(onEventFlag).toBatteryStatus('Listener: "batterycritical" event (19 -> 4), it did not fire');
                done();
            }, 100);

        });

        it("battery.spec.4.2 should fire batterycritical event (100 -> 4) when decreases", function (done) {
            var onEvent = function () {
                window.removeEventListener("batterycritical", onEvent, false);
                onEventFlag = true;
            },
            onEventFlag = false;

            // setup: batterycritical should fire when level decreases (100->4) ( CB-4519 )
            navigator.battery._status({
                level : 100,
                isPlugged : false
            });
            window.addEventListener("batterycritical", onEvent, false);
            navigator.battery._status({
                level : 4,
                isPlugged : false
            });

            setTimeout(function () {
                expect(onEventFlag).toBatteryStatus('Listener: "batterycritical" event (100 -> 4), it did not fire');
                done();
            }, 100);
        });

        it("battery.spec.4.3 should not fire batterycritical event (4 -> 5) when increasing", function (done) {
            var onEvent = function () {
                window.removeEventListener("batterycritical", onEvent, false);
                onEventFlag = false;
            },
            onEventFlag = true;

            // batterycritical should not fire when level increases (4->5)( CB-4519 )
            navigator.battery._status({
                level : 4,
                isPlugged : false
            });
            window.addEventListener("batterycritical", onEvent, false);
            navigator.battery._status({
                level : 5,
                isPlugged : false
            });

            setTimeout(function () {
                expect(onEventFlag).toBatteryStatus('Listener: "batterycritical" event (4 -> 5), should not be fired');
                done();
            }, 100);
        });

        it("battery.spec.4.4 should not fire batterycritical event (6 -> 5) if charging", function (done) {
            var onEvent = function () {
                window.removeEventListener("batterycritical", onEvent, false);
                onEventFlag = false;
            },
            onEventFlag = true;

            // batterycritical should NOT fire if we are charging   ( CB-4520 )
            navigator.battery._status({
                level : 6,
                isPlugged : true
            });
            window.addEventListener("batterycritical", onEvent, false);
            navigator.battery._status({
                level : 5,
                isPlugged : true
            });

            setTimeout(function () {
                expect(onEventFlag).toBatteryStatus('Listener: "batterycritical" event (6 -> 5), should not be fired if charging');
                done();
            }, 100);
        });

    });
};

//******************************************************************************************
//***************************************Manual Tests***************************************
//******************************************************************************************

exports.defineManualTests = function (contentEl, createActionButton) {

    /* Battery */
    function updateInfo(info) {
        document.getElementById('levelValue').innerText = info.level;
        document.getElementById('pluggedValue').innerText = info.isPlugged;
        if (info.level > 5) {
            document.getElementById('criticalValue').innerText = "false";
        }
        if (info.level > 20) {
            document.getElementById('lowValue').innerText = "false";
        }
    }

    function batteryLow(info) {
        document.getElementById('lowValue').innerText = "true";
    }

    function batteryCritical(info) {
        document.getElementById('criticalValue').innerText = "true";
    }

    function addBattery() {
        window.addEventListener("batterystatus", updateInfo, false);
    }

    function removeBattery() {
        window.removeEventListener("batterystatus", updateInfo, false);
    }

    function addLow() {
        window.addEventListener("batterylow", batteryLow, false);
    }

    function removeLow() {
        window.removeEventListener("batterylow", batteryLow, false);
    }

    function addCritical() {
        window.addEventListener("batterycritical", batteryCritical, false);
    }

    function removeCritical() {
        window.removeEventListener("batterycritical", batteryCritical, false);
    }
    
    //Generate Dynamic Table
    function generateTable(tableId, rows, cells, elements) {
        var table = document.createElement('table');
        for (var r = 0; r < rows; r++) {
            var row = table.insertRow(r);
            for (var c = 0; c < cells; c++) {
                var cell = row.insertCell(c);
                cell.setAttribute("align", "center");
                for (var e in elements) {
                    if (elements[e].position.row == r && elements[e].position.cell == c) {
                        var htmlElement = document.createElement(elements[e].tag);
                        var content;

                        if (elements[e].content !== "") {
                            content = document.createTextNode(elements[e].content);
                            htmlElement.appendChild(content);
                        }
                        if (elements[e].type) {
                            htmlElement.type = elements[e].type;
                        }
                        htmlElement.setAttribute("id", elements[e].id);
                        cell.appendChild(htmlElement);
                    }
                }
            }
        }
        table.setAttribute("align", "center");
        table.setAttribute("id", tableId);
        return table;
    }
    // Battery Elements
    var batteryElements =
        [{
            id : "statusTag",
            content : "Status:",
            tag : "div",
            position : {
                row : 0,
                cell : 0
            }
        }, {
            id : "statusValue",
            content : "",
            tag : "div",
            position : {
                row : 0,
                cell : 1
            }
        }, {
            id : "levelTag",
            content : "Level:",
            tag : "div",
            position : {
                row : 1,
                cell : 0
            }
        }, {
            id : "levelValue",
            content : "",
            tag : "div",
            position : {
                row : 1,
                cell : 1
            }
        }, {
            id : "pluggedTag",
            content : "Plugged:",
            tag : "div",
            position : {
                row : 2,
                cell : 0
            }
        }, {
            id : "pluggedValue",
            content : "",
            tag : "div",
            position : {
                row : 2,
                cell : 1
            }
        }, {
            id : "lowTag",
            content : "Low:",
            tag : "div",
            position : {
                row : 3,
                cell : 0
            }
        }, {
            id : "lowValue",
            content : "",
            tag : "div",
            position : {
                row : 3,
                cell : 1
            }
        }, {
            id : "criticalTag",
            content : "Critical:",
            tag : "div",
            position : {
                row : 4,
                cell : 0
            }
        }, {
            id : "criticalValue",
            content : "",
            tag : "div",
            position : {
                row : 4,
                cell : 1
            }
        }
    ];
    
    //Title audio results
    var div = document.createElement('h2');
    div.appendChild(document.createTextNode('Battery Status'));
    div.setAttribute("align", "center");
    contentEl.appendChild(div);

    var batteryTable = generateTable('info', 5, 3, batteryElements);
    contentEl.appendChild(batteryTable);
    
    div = document.createElement('h2');
    div.appendChild(document.createTextNode('Actions'));
    div.setAttribute("align", "center");
    contentEl.appendChild(div);

    contentEl.innerHTML += '<h3>Battery Status Tests</h3>' +
        'Will update values for level and plugged when they change. If battery low and critical values are false, they will get updated in status box, but only once' +
        '<div id="addBS"></div><div id="remBs"></div>' +
        '<h3>Battery Low Tests</h3>' +
        '</p> Will update value for battery low to true when battery is below 20%' +
        '<div id="addBl"></div><div id="remBl"></div>' +
        '<h3>Battery Critical Tests</h3>' +
        '</p> Will update value for battery critical to true when battery is below 5%' +
        '<div id="addBc"></div><div id="remBc"></div>';

    createActionButton('Add "batterystatus" listener', function () {
        addBattery();
    }, 'addBS');
    createActionButton('Remove "batterystatus" listener', function () {
        removeBattery();
    }, 'remBs');
    createActionButton('Add "batterylow" listener', function () {
        addLow();
    }, 'addBl');
    createActionButton('Remove "batterylow" listener', function () {
        removeLow();
    }, 'remBl');
    createActionButton('Add "batterycritical" listener', function () {
        addCritical();
    }, 'addBc');
    createActionButton('Remove "batterycritical" listener', function () {
        removeCritical();
    }, 'remBc');
};
