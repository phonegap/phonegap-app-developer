(function(){
    var env, spec, suite, reporter, runner;
    function fakeSpec(suite, name) {
        var s = new jasmine.Spec(env, suite, name);
        suite.add(s);
        return s;
    }
    function fakeSuite(name, parentSuite) {
        var s = new jasmine.Suite(env, name, null, parentSuite || null);
        if (parentSuite) {
            parentSuite.add(s);
        }
        runner.add(s);
        return s;
    }

    // make sure reporter is set before calling this
    function triggerSuiteEvents(suites) {
        for (var i=0; i<suites.length; i++) {
            var s = suites[i];
            for (var j=0; j<s.specs().length; j++) {
                reporter.reportSpecStarting(s.specs()[j]);
                reporter.reportSpecResults(s.specs()[j]);
            }
            reporter.reportSuiteResults(s);
        }
    }

    describe("JUnitXmlReporter", function(){

        beforeEach(function(){
            env = new jasmine.Env();
            env.updateInterval = 0;
            runner = new jasmine.Runner(env);

            suite = fakeSuite("ParentSuite");
            spec = fakeSpec(suite, "should be a dummy with invalid characters: & < > \" '");
            reporter = new jasmine.JUnitXmlReporter();
        });

        describe("constructor", function(){
            it("should default path to an empty string", function(){
                expect(reporter.savePath).toEqual("");
            });
            it("should default consolidate to true", function(){
                expect(reporter.consolidate).toBe(true);
            });
            it("should default useDotNotation to true", function(){
                expect(reporter.useDotNotation).toBe(true);
            });

            describe("file prepend", function(){
                it("should default output file prepend to \'TEST-\'", function () {
                    expect(reporter.filePrefix).toBe("TEST-");
                });
                it("should allow the user to override the default xml output file prepend", function () {
                    reporter = new jasmine.JUnitXmlReporter("", true, true, "alt-prepend-");
                    expect(reporter.filePrefix).toBe("alt-prepend-");
                });
                it("should output the file with the modified prepend", function () {

                    reporter = new jasmine.JUnitXmlReporter("", true, true, "alt-prepend-");

                    spyOn(reporter, "writeFile");

                    triggerSuiteEvents([suite]);

                    reporter.reportRunnerResults(runner);

                    expect(reporter.writeFile).toHaveBeenCalledWith(reporter.savePath, "alt-prepend-ParentSuite.xml", jasmine.any(String));
                });
            });
        });

        describe("reportSpecStarting", function(){
            it("should add start time", function(){
                reporter.reportSpecStarting(spec);
                expect(spec.startTime).not.toBeUndefined();
            });
            it("should add start time to the suite", function(){
                expect(suite.startTime).toBeUndefined();
                reporter.reportSpecStarting(spec);
                expect(suite.startTime).not.toBeUndefined();
            });
            it("should not add start time to the suite if it already exists", function(){
                var a = new Date();
                suite.startTime = a;
                reporter.reportSpecStarting(spec);
                expect(suite.startTime).toBe(a);
            });
        });

        describe("reportSpecResults", function(){
            beforeEach(function(){
                reporter.reportSpecStarting(spec);
                //spec.results_ = fakeResults();
                reporter.reportSpecResults(spec);
            });

            it("should compute duration", function(){
                expect(spec.duration).not.toBeUndefined();
            });

            it("should generate <testcase> output", function(){
                expect(spec.output).not.toBeUndefined();
                expect(spec.output).toContain("<testcase");
            });

            it("should escape bad xml characters in spec description", function() {
                expect(spec.output).toContain("&amp; &amp;lt; &amp;gt; &amp;quot; &amp;apos;");
            });

            it("should generate valid xml <failure> output if test failed", function(){
                spec = fakeSpec(suite, "should be a dummy");
                reporter.reportSpecStarting(spec);

                var expectationResult = new jasmine.ExpectationResult({
                    matcherName: "toEqual", passed: false,
                    message: "Expected 'a' to equal '&'.",
                    trace: { stack: "in test1.js:12\nin test2.js:123" }
                });

                var results = {
                    passed: function() { return false; },
                    getItems: function() { return [expectationResult]; }
                };

                spyOn(spec, "results").andReturn(results);

                reporter.reportSpecResults(spec);

                expect(spec.output).toContain("<failure");
                expect(spec.output).toContain("type=\"" + expectationResult.type + "\"");
                expect(spec.output).toContain("message=\"Expected &amp;apos;a&amp;apos; to equal &amp;apos;&amp;&amp;apos;.\"");
                expect(spec.output).toContain(">in test1.js:12\nin test2.js:123</failure>");
            });
        });

        describe("reportSuiteResults", function(){
            beforeEach(function(){
                triggerSuiteEvents([suite]);
            });
            it("should compute duration", function(){
                expect(suite.duration).not.toBeUndefined();
            });
            it("should generate startTime if no specs were executed", function(){
                suite = fakeSuite("just a fake suite");
                triggerSuiteEvents([suite]);
                expect(suite.startTime).not.toBeUndefined();
            });
            it("should generate <testsuite> output", function(){
                expect(suite.output).not.toBeUndefined();
                expect(suite.output).toContain("<testsuite");
            });
            it("should contain <testcase> output from specs", function(){
                expect(suite.output).toContain("<testcase");
            });
        });

        describe("reportRunnerResults", function(){
            var subSuite, subSubSuite, siblingSuite;

            beforeEach(function(){
                subSuite = fakeSuite("SubSuite", suite);
                subSubSuite = fakeSuite("SubSubSuite", subSuite);
                siblingSuite = fakeSuite("SiblingSuite With Invalid Chars & < > \" ' | : \\ /");
                var subSpec = fakeSpec(subSuite, "should be one level down");
                var subSubSpec = fakeSpec(subSubSuite, "should be two levels down");
                var siblingSpec = fakeSpec(siblingSuite, "should be a sibling of Parent");

                spyOn(reporter, "writeFile");
                spyOn(reporter, "getNestedOutput").andCallThrough();
                triggerSuiteEvents([suite, subSuite, subSubSuite, siblingSuite]);
            });

            describe("general functionality", function() {
                beforeEach(function() {
                    reporter.reportRunnerResults(runner);
                });
                it("should remove invalid filename chars from the filename", function() {
                    expect(reporter.writeFile).toHaveBeenCalledWith(reporter.savePath, "TEST-SiblingSuiteWithInvalidChars.xml", jasmine.any(String));
                });
                it("should remove invalid xml chars from the classname", function() {
                    expect(siblingSuite.output).toContain("SiblingSuite With Invalid Chars &amp; &amp;lt; &amp;gt; &amp;quot; &amp;apos; | : \\ /");
                });
            });

            describe("consolidated is true and consolidatedAll is false", function(){
                beforeEach(function(){
                    reporter.reportRunnerResults(runner);
                });
                it("should write one file per parent suite", function(){
                    expect(reporter.writeFile.callCount).toEqual(2);
                });
                it("should consolidate suite output", function(){
                    expect(reporter.getNestedOutput.callCount).toEqual(4);
                });
                it("should wrap output in <testsuites>", function(){
                    expect(reporter.writeFile.mostRecentCall.args[2]).toContain("<testsuites>");
                });
                it("should include xml header in every file", function(){
                    for (var i = 0; i < reporter.writeFile.callCount; i++) {
                        expect(reporter.writeFile.argsForCall[i][2]).toContain("<?xml");
                    }
                });
            });

            describe("consolidated is false and consolidatedAll is false", function(){
                beforeEach(function(){
                    reporter.consolidate = false;
                    reporter.reportRunnerResults(runner);
                });
                it("should write one file per suite", function(){
                    expect(reporter.writeFile.callCount).toEqual(4);
                });
                it("should not wrap results in <testsuites>", function(){
                    expect(reporter.writeFile.mostRecentCall.args[2]).not.toContain("<testsuites>");
                });
                it("should include xml header in every file", function(){
                    for (var i = 0; i < reporter.writeFile.callCount; i++) {
                        expect(reporter.writeFile.argsForCall[i][2]).toContain("<?xml");
                    }
                });
            });

            describe("consolidatedAll is true", function(){
                beforeEach(function(){
                    reporter.consolidateAll = true;
                    reporter.reportRunnerResults(runner);
                });
                it("should write one file for all test suites", function(){
                    expect(reporter.writeFile.callCount).toEqual(1);
                });
                it("should consolidate suites output", function(){
                    expect(reporter.getNestedOutput.callCount).toEqual(4);
                });
                it("should wrap output in <testsuites>", function(){
                    expect(reporter.writeFile.mostRecentCall.args[2]).toContain("<testsuites>");
                });
                it("should include xml header in the file", function(){
                    expect(reporter.writeFile.argsForCall[0][2]).toContain("<?xml");
                });
            });
            describe("dot notation is true", function(){
                beforeEach(function(){
                    reporter.reportRunnerResults(runner);
                });
                it("should separate descriptions with dot notation", function(){
                    expect(subSubSuite.output).toContain('classname="ParentSuite.SubSuite.SubSubSuite"');
                });
            });

            describe("dot notation is false", function(){
                beforeEach(function(){
                    reporter.useDotNotation = false;
                    triggerSuiteEvents([suite, subSuite, subSubSuite, siblingSuite]);
                    reporter.reportRunnerResults(runner);
                });
                it("should separate descriptions with whitespace", function(){
                    expect(subSubSuite.output).toContain('classname="ParentSuite SubSuite SubSubSuite"');
                });
            });
        });
    });
})();

