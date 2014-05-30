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

describe("XMLHttpRequest", function () {

    var createXHR = function (url, bAsync, win, lose) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, bAsync);
        xhr.onload = win;
        xhr.onerror = lose;
        xhr.send();
        return xhr;
    }

        it("XMLHttpRequest.spec.1 should exist", function () {
            expect(window.XMLHttpRequest).toBeDefined();
            expect(window.XMLHttpRequest.UNSENT).toBe(0);
            expect(window.XMLHttpRequest.OPENED).toBe(1);
            expect(window.XMLHttpRequest.HEADERS_RECEIVED).toBe(2);
            expect(window.XMLHttpRequest.LOADING).toBe(3);
            expect(window.XMLHttpRequest.DONE).toBe(4);
        });

        it("XMLHttpRequest.spec.2 should be able to create new XHR", function () {

        	var xhr = new XMLHttpRequest();
        	expect(xhr).toBeDefined();

    // abort
        	expect(xhr.abort).toBeDefined();
        	expect(typeof xhr.abort == 'function').toBe(true);

    // getResponseHeader
        	expect(xhr.getResponseHeader).toBeDefined();
        	expect(typeof xhr.getResponseHeader == 'function').toBe(true);

    // getAllResponseHeaders
        	expect(xhr.getAllResponseHeaders).toBeDefined();
        	expect(typeof xhr.getAllResponseHeaders == 'function').toBe(true);

    // overrideMimeType
        	expect(xhr.overrideMimeType).toBeDefined();
        	expect(typeof xhr.overrideMimeType == 'function').toBe(true);
        	return;
    // open
        	expect(xhr.open).toBeDefined();
        	expect(typeof xhr.open == 'function').toBe(true);
    // send
        	expect(xhr.send).toBeDefined();
        	expect(typeof xhr.send == 'function').toBe(true);
    // setRequestHeader
        	expect(xhr.setRequestHeader).toBeDefined();
        	expect(typeof xhr.setRequestHeader == 'function').toBe(true);
        });

        it("XMLHttpRequest.spec.2 should be able to load the current page", function () {
            var win = jasmine.createSpy().andCallFake(function (res) {});
            var lose = createDoNotCallSpy('xhrFail');
            var xhr = createXHR("localXHR.html", true, win, lose);
            waitsForAny(win, lose);

        });

        it("XMLHttpRequest.spec.9 calls onload from successful http get", function () {
            var win = jasmine.createSpy().andCallFake(function (res) { });
            var lose = createDoNotCallSpy('xhrFail');
            var xhr = createXHR("http://cordova-filetransfer.jitsu.com", true, win, lose);
            waitsForAny(win, lose);
        });

        it("XMLHttpRequest.spec.3 should be able to load the current page", function () {
            var win = jasmine.createSpy().andCallFake(function (res) {});
            var lose = createDoNotCallSpy('xhrFail');
            var xhr = createXHR(window.location.href, true, win, lose);
            waitsForAny(win, lose);
        });

        it("XMLHttpRequest.spec.4 should be able to load the parent folder page ../index.html", function () {
            var win = jasmine.createSpy().andCallFake(function (res) {});
            var lose = createDoNotCallSpy('xhrFail');
            var xhr = createXHR("../index.html", true, win, lose);
            waitsForAny(win, lose);
        });

        it("XMLHttpRequest.spec.5 should be able to load the current page ./???.html", function () {
            var win = jasmine.createSpy().andCallFake(function (res) { });
            var lose = createDoNotCallSpy('xhrFail');
            var fileName = window.location.href.split('#')[0].split('/').pop();
            var xhr = createXHR("./" + fileName, true, win, lose);
            waitsForAny(win, lose);
        });

        it("XMLHttpRequest.spec.6 adds hash-path and loads file okay", function () {
            window.location = window.location.href + "#asd/asd/asdasd";
            var win = jasmine.createSpy().andCallFake(function (res) { });
            var lose = createDoNotCallSpy('xhrFail');
            var xhr = createXHR(window.location.href, true, win, lose);
            waitsForAny(win, lose);
        });

    it("XMLHttpRequest.spec.10 overlapping async calls are not muxed", function () {

        var order = "";

        var winA = jasmine.createSpy("spyWinA").andCallFake(function(){
            order += "A";  
        });
        var winB = jasmine.createSpy("spyWinB").andCallFake(function(){
            order += "B";  
        });
        var lose = createDoNotCallSpy('xhrFail');
        var fileName = window.location.href.split('#')[0].split('/').pop();
        createXHR(fileName, true, winA, lose);
        createXHR(fileName, false, winB, lose);

        waitsFor(function () {
            return lose.wasCalled ||
                (winA.wasCalled && winB.wasCalled);
        }, "Expecting both callbacks to be called.", Tests.TEST_TIMEOUT);

        runs(function () {
            expect(lose).not.toHaveBeenCalled();
            expect(winA).toHaveBeenCalled();
            expect(winB).toHaveBeenCalled();
            console.log("order = " + order);
        });
    });


});

// only add these tests if we are testing on windows phone

if (/Windows Phone/.exec(navigator.userAgent)) {

    var createXHR = function (url, bAsync, win, lose) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, bAsync);
        xhr.onload = win;
        xhr.onerror = lose;
        xhr.send();
        return xhr;
    }

    describe("XMLHttpRequest Windows Phone", function () {

        console.log("running special windows tests");
        it("XMLHttpRequest.spec.7 should be able to load the (WP8 backwards compatability) root page www/index.html", function () {
            var win = jasmine.createSpy().andCallFake(function (res) { });
            var lose = createDoNotCallSpy('xhrFail');
            var xhr = createXHR("www/index.html", true, win, lose);
            waitsForAny(win, lose);
        });

        it("XMLHttpRequest.spec.8 should be able to load the (WP7 backwards compatability) root page app/www/index.html", function () {
            var win = jasmine.createSpy().andCallFake(function (res) { });
            var lose = createDoNotCallSpy('xhrFail');
            var xhr = createXHR("app/www/index.html", true, win, lose);
            waitsForAny(win, lose);
        });

        it("XMLHttpRequest.spec.11 should be able to load the current page using window.location with extra / [CB-6299]", function () {
            var path = window.location.protocol + "/" + window.location.toString().substr(window.location.protocol.length);
            var win = jasmine.createSpy().andCallFake(function (res) { });
            var lose = createDoNotCallSpy('xhrFail');
            var xhr = createXHR(path, true, win, lose);
            waitsForAny(win, lose);
        });

    });
}