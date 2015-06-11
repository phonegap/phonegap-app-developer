/* globals jasmine, describe, beforeEach, afterEach, it, expect, spyOn */
(function(){
    var env, suite, subSuite, subSubSuite, siblingSuite, reporter, runner;
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

    describe("NUnitXmlReporter", function(){

        beforeEach(function(){
            env = new jasmine.Env();
            env.updateInterval = 0;
            runner = new jasmine.Runner(env);

            suite = fakeSuite("ParentSuite");
            subSuite = fakeSuite("SubSuite", suite);
            subSubSuite = fakeSuite("SubSubSuite", subSuite);
            siblingSuite = fakeSuite("SiblingSuite With Invalid Chars & < > \" ' | : \\ /");
            var spec = fakeSpec(suite, "should be a dummy with invalid characters: & < >");
            var failedSpec = fakeSpec(suite, "should be failed");
            failedSpec.fail(Error("I failed"));
            var subSpec = fakeSpec(subSuite, "should be one level down");
            var subSubSpec1 = fakeSpec(subSubSuite, "(1) should be two levels down");
            var subSubSpec2 = fakeSpec(subSubSuite, "(2) should be two levels down");
            var subSubSpec3 = fakeSpec(subSubSuite, "(3) should be two levels down");
            var siblingSpec = fakeSpec(siblingSuite, "should be a sibling of Parent");
            reporter = new jasmine.NUnitXmlReporter({reportName: "<Bad Character Report>"});
        });

        describe("constructor", function(){
            it("should default path to an empty string", function(){
                reporter = new jasmine.NUnitXmlReporter();
                expect(reporter.savePath).toBe("");
            });
            it("should allow a custom path to be provided", function() {
                reporter = new jasmine.NUnitXmlReporter({savePath:"/tmp"});
                expect(reporter.savePath).toBe("/tmp");
            });
            it("should default filename to 'nunit-results.xml'", function(){
                reporter = new jasmine.NUnitXmlReporter();
                expect(reporter.filename).toBe("nunit-results.xml");
            });
            it("should allow a custom filename to be provided", function() {
                reporter = new jasmine.NUnitXmlReporter({filename:"results.xml"});
                expect(reporter.filename).toBe("results.xml");
            });
            it("should default reportName to 'Jasmine Results'", function(){
                reporter = new jasmine.NUnitXmlReporter();
                expect(reporter.reportName).toBe("Jasmine Results");
            });
            it("should allow a custom reportName to be provided", function() {
                reporter = new jasmine.NUnitXmlReporter({reportName:"Test Results"});
                expect(reporter.reportName).toBe("Test Results");
            });
        });

        describe("reportRunnerResults", function(){
            var output, xmldoc;

            beforeEach(function(){
                spyOn(reporter, "writeFile");
                reporter.reportRunnerStarting(runner);
                triggerSuiteEvents([suite, siblingSuite, subSuite, subSubSuite]);
                reporter.reportRunnerResults(runner);
                output = reporter.writeFile.mostRecentCall.args[0];
                xmldoc = (new DOMParser()).parseFromString(output, "text/xml");
            });
            it("should escape invalid xml chars from report name", function() {
                expect(output).toContain('name="&amp;lt;Bad Character Report&amp;gt;"');
            });
            it("should escape invalid xml chars from suite names", function() {
                expect(output).toContain('name="SiblingSuite With Invalid Chars &amp; &amp;lt; &amp;gt; &amp;quot; &amp;apos; | : \\ /"');
            });
            it("should escape invalid xml chars from spec names", function() {
                expect(output).toContain('name="should be a dummy with invalid characters: &amp; &amp;lt; &amp;gt;');
            });
            describe("xml structure", function() {
                var rootNode, suites, specs;
                beforeEach(function() {
                    rootNode = xmldoc.getElementsByTagName("test-results")[0];
                    suites = rootNode.getElementsByTagName("test-suite");
                    specs = rootNode.getElementsByTagName("test-case");
                });
                it("should report the date / time that the tests were run", function() {
                    function twoDigits(number) { return number >= 10 ? number : ("0" + number); }
                    var now = new Date();
                    var date = now.getFullYear() + "-" + twoDigits(now.getMonth()+1) + "-" + twoDigits(now.getDate());
                    var time = now.getHours() + ":" + twoDigits(now.getMinutes()) + ":" + twoDigits(now.getSeconds());
                    expect(rootNode.getAttribute("date")).toBe(date);
                    expect(rootNode.getAttribute("time")).toBe(time); // this could fail extremely rarely
                });
                it("should report the appropriate number of suites", function() {
                    expect(suites.length).toBe(4);
                });
                it("should order suites appropriately", function() {
                    expect(suites[0].getAttribute("name")).toContain("ParentSuite");
                    expect(suites[1].getAttribute("name")).toContain("SubSuite");
                    expect(suites[2].getAttribute("name")).toContain("SubSubSuite");
                    expect(suites[3].getAttribute("name")).toContain("SiblingSuite");
                });
                it("should nest suites appropriately", function() {
                    expect(suites[0].parentNode).toBe(rootNode);
                    expect(suites[1].parentNode).toBe(suites[0].getElementsByTagName("results")[0]);
                    expect(suites[2].parentNode).toBe(suites[1].getElementsByTagName("results")[0]);
                    expect(suites[3].parentNode).toBe(rootNode);
                });
                it("should report the execution time for test specs", function() {
                    var time;
                    for (var i = 0; i < specs.length; i++) {
                        time = specs[i].getAttribute("time");
                        expect(time.length).toBeGreaterThan(0);
                        expect(time).not.toContain(":"); // as partial seconds, not a timestamp
                    }
                });
                it("should include a test-case for each spec and report the total number of specs on the root node", function() {
                    expect(rootNode.getAttribute("total")).toBe(specs.length.toString());
                });
                describe("passed specs", function() {
                    it("should indicate that the test case was successful", function() {
                        expect(specs[0].getAttribute("success")).toBe("true");
                    });
                });
                describe("failed specs", function() {
                    var failedSpec;
                    beforeEach(function() {
                        failedSpec = rootNode.getElementsByTagName("message")[0].parentNode.parentNode;
                    });
                    it("should report the number of failed specs on the root node", function() {
                        expect(rootNode.getAttribute("failures")).toBe("1");
                    });
                    it("should indicate that the test case was not successful", function() {
                        expect(failedSpec.getAttribute("success")).toBe("false");
                    });
                    it("should include the error for failed specs", function() {
                        expect(failedSpec.getElementsByTagName("message")[0].textContent).toContain("I failed");
                    });
                });
            });
        });
    });
})();

