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

describe('Whitelist API (cordova.whitelist)', function () {
	it("should exist", function() {
        expect(cordova.whitelist).toBeDefined();
	});

    describe("Match function", function() {
        function expectMatchWithResult(result) {
            return (function(url, patterns, description) {
                description = description || ((result ? "should accept " : "should reject ") + url + " for " + JSON.stringify(patterns));
                it(description, function() {
                    var cb = jasmine.createSpy();
                    runs(function() {
                        cordova.whitelist.match(url, patterns, cb);
                    });
                    waitsFor(function() { return cb.wasCalled; }, "success callback never called", Tests.TEST_TIMEOUT);
                    runs(function() {
                        expect(cb).toHaveBeenCalledWith(result);
                    });
                });
            });
        }

        var itShouldMatch = expectMatchWithResult(true);
        var itShouldNotMatch = expectMatchWithResult(false);

        it("should exist", function() {
            expect(cordova.whitelist.match).toBeDefined();
            expect(typeof cordova.whitelist.match).toBe("function");
        });

        itShouldMatch('http://www.apache.org/',['*'], "should accept any domain for *");
        itShouldNotMatch('http://www.apache.org/',[], "should not accept any domain for []");

        itShouldMatch('http://apache.org/', ['http://*.apache.org']);
        itShouldMatch('http://www.apache.org/', ['http://*.apache.org']);
        itShouldMatch('http://www.apache.org/some/path', ['http://*.apache.org']);
        itShouldMatch('http://some.domain.under.apache.org/', ['http://*.apache.org']);
        itShouldMatch('http://user:pass@apache.org/', ['http://*.apache.org']);
        itShouldMatch('http://user:pass@www.apache.org/', ['http://*.apache.org']);
        itShouldMatch('http://www.apache.org/?some=params', ['http://*.apache.org']);
        itShouldNotMatch('http://apache.com/', ['http://*.apache.org']);
        itShouldNotMatch('http://www.evil.com/?url=www.apache.org', ['http://*.apache.org']);
        itShouldNotMatch('http://www.evil.com/?url=http://www.apache.org', ['http://*.apache.org']);
        itShouldNotMatch('http://www.evil.com/?url=http%3A%2F%2Fwww%2Eapache%2Eorg', ['http://*.apache.org']);
        itShouldNotMatch('https://apache.org/', ['http://*.apache.org']);
        itShouldNotMatch('http://www.apache.org:pass@evil.com/', ['http://*.apache.org']);
        itShouldNotMatch('http://www.apache.org.evil.com/', ['http://*.apache.org']);

        itShouldMatch('http://www.apache.org/',['http://*.apache.org','https://*.apache.org']);
        itShouldMatch('https://www.apache.org/',['http://*.apache.org','https://*.apache.org']);
        itShouldNotMatch('ftp://www.apache.org/',['http://*.apache.org','https://*.apache.org']);
        itShouldNotMatch('http://www.apache.com/',['http://*.apache.org','https://*.apache.org']);

        itShouldMatch('http://www.apache.org/',['http://www.apache.org']);
        itShouldNotMatch('http://build.apache.org/',['http://www.apache.org']);
        itShouldNotMatch('http://apache.org/',['http://www.apache.org']);

        itShouldMatch('http://www.apache.org/', ['http://*/*']);
        itShouldMatch('http://www.apache.org/foo/bar.html', ['http://*/*']);

        itShouldMatch('http://www.apache.org/foo', ['http://*/foo*']);
        itShouldMatch('http://www.apache.org/foo/bar.html', ['http://*/foo*']);
        itShouldNotMatch('http://www.apache.org/', ['http://*/foo*']);

        itShouldMatch('file:///foo', ['file:///*']);

        itShouldMatch('file:///foo', ['file:///foo*']);
        itShouldMatch('file:///foo/bar.html', ['file:///foo*']);
        itShouldNotMatch('file:///etc/foo', ['file:///foo*']);
        itShouldNotMatch('http://www.apache.org/foo', ['file:///foo*']);

        itShouldMatch('http://www.apache.org/', ['*://www.apache.org/*']);
        itShouldMatch('https://www.apache.org/', ['*://www.apache.org/*']);
        itShouldMatch('ftp://www.apache.org/', ['*://www.apache.org/*']);
        itShouldMatch('file://www.apache.org/', ['*://www.apache.org/*']);
        itShouldMatch('content://www.apache.org/', ['*://www.apache.org/*']);
        itShouldMatch('foo://www.apache.org/', ['*://www.apache.org/*']);
        itShouldNotMatch('http://www.apache.com/', ['*://www.apache.org/*']);

        itShouldMatch('http://www.apache.org/', ['*.apache.org']);
        itShouldMatch('https://www.apache.org/', ['*.apache.org']);
        itShouldNotMatch('ftp://www.apache.org/', ['*.apache.org']);

        itShouldMatch('http://www.apache.org:81/', ['http://www.apache.org:81/*']);
        itShouldMatch('http://user:pass@www.apache.org:81/foo/bar.html', ['http://www.apache.org:81/*']);
        itShouldNotMatch('http://www.apache.org:80/', ['http://www.apache.org:81/*']);
        itShouldNotMatch('http://www.apache.org/', ['http://www.apache.org:81/*']);
        itShouldNotMatch('http://www.apache.org:foo/', ['http://www.apache.org:81/*']);
        itShouldNotMatch('http://www.apache.org:81@www.apache.org/', ['http://www.apache.org:81/*']);
        itShouldNotMatch('http://www.apache.org:81@www.evil.com/', ['http://www.apache.org:81/*']);
    });

    describe("Test function", function() {
        function expectTestWithResult(result) {
            return (function(url, description) {
                description = description || ((result ? "should accept " : "should reject ") + url);
                it(description, function() {
                    var cb = jasmine.createSpy();
                    runs(function() {
                        cordova.whitelist.test(url, cb);
                    });
                    waitsFor(function() { return cb.wasCalled; }, "success callback never called", Tests.TEST_TIMEOUT);
                    runs(function() {
                        expect(cb).toHaveBeenCalledWith(result);
                    });
                });
            });
        }

        var itShouldAccept = expectTestWithResult(true);
        var itShouldReject = expectTestWithResult(false);

        it("should exist", function() {
            expect(cordova.whitelist.test).toBeDefined();
            expect(typeof cordova.whitelist.test).toBe("function");
        });

        itShouldAccept('http://apache.org');
        itShouldAccept('http://apache.org/');
        itShouldAccept('http://www.apache.org/');
        itShouldAccept('http://www.apache.org/some/path');
        itShouldAccept('http://some.domain.under.apache.org/');
        itShouldAccept('http://user:pass@apache.org/');
        itShouldAccept('http://user:pass@www.apache.org/');
        itShouldAccept('https://www.apache.org/');
        itShouldReject('ftp://www.apache.org/');
        itShouldReject('http://www.apache.com/');
        itShouldReject('http://www.apache.org:pass@evil.com/');
        itShouldReject('http://www.apache.org.evil.com/');
        itShouldAccept('file:///foo');
        itShouldAccept('content:///foo');
    });
});
