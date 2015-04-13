/* globals jasmine */
(function() {
    /**
     * Generates NUnit XML for the given spec run.
     * Allows the test results to be used in java based CI
     * systems like Jenkins.
     *
     * Originally from https://github.com/gmusick/jasmine-reporters. Adapted
     * to support file output via PhantomJS/Rhino/Node.js like JUnitXmlReporter.
     * Also fixed a couple minor bugs (ie month being reported incorrectly) and
     * added a few options to control how / where the file is generated.
     *
     * @param {object} [options]
     * @param {string} [options.savePath] directory to save the files (default: '')
     * @param {string} [options.filename] name of xml output file (default: 'nunit-results.xml')
     * @param {string} [options.reportName] name for parent test-results node (default: 'Jasmine Results')
     */
    jasmine.NUnitXmlReporter = function(options) {
        options = options || {};
        this.savePath = options.savePath || '';
        this.filename = options.filename || 'nunit-results.xml';
        this.reportName = options.reportName || 'Jasmine Results';
        this.testSuites = {};
        this.testSpecs = {};
        this.testRun = {
            suites: []
        };
    };

    jasmine.NUnitXmlReporter.prototype = {
        reportRunnerStarting: function(runner) {
            var suites = runner.suites();

            for (var i = 0; i < suites.length; i++) {
                var currentSuite = suites[i];

                var suite = {
                    elapsed: 0,
                    executed: false,
                    id: currentSuite.id,
                    name: currentSuite.description,
                    specs: [],
                    success: false,
                    suites: []
                };

                this.testSuites[currentSuite.id] = suite;

                var parent = this.testRun.suites;
                if (currentSuite.parentSuite) {
                    parent = this.testSuites[currentSuite.parentSuite.id].suites;
                }

                parent.push(suite);
            }
        },

        reportSpecStarting: function(spec) {
            spec.startTime = new Date();
        },

        reportRunnerResults: function(runner) {
            var output = printTestResults(runner, this);
            this.writeFile(output);
        },

        reportSuiteResults: function(suite) {
            var id = suite.id;

            var results = suite.results();

            var testSuite = this.testSuites[id];
            testSuite.executed = true;
            testSuite.success = results.passed();
        },

        reportSpecResults: function(spec) {
            var elapsed = spec.startTime ? (new Date() - spec.startTime) / 1000 : 0;
            var results = spec.results();
            var skipped = !!results.skipped;
            var id = spec.id;
            var suite = spec.suite;
            var testSuite = this.testSuites[suite.id];
            var testSpec = {
                elapsed: elapsed,
                executed: !skipped,
                failures: [],
                id: spec.id,
                name: spec.description,
                success: results.passed()
            };
            this.testSpecs[spec.id] = testSpec;
            testSuite.specs.push(testSpec);

            if (!testSpec.success) {
                var items = results.getItems();

                for (var i = 0; i < items.length; i++) {
                    var result = items[i];
                    if (result.passed && !result.passed()) {
                        var failure = {
                            message: result.toString(),
                            stack: result.trace.stack ? result.trace.stack : ""
                        };
                        testSpec.failures.push(failure);
                    }
                }
            }

            while (suite) {
                testSuite = this.testSuites[suite.id];
                testSuite.elapsed = testSuite.elapsed ? (testSuite.elapsed + elapsed) : elapsed;
                suite = suite.parentSuite;
            }
        },

        writeFile: function(text) {
            var errors = [];
            var path = this.savePath;
            var filename = this.filename;
            function getQualifiedFilename(separator) {
                if (path && path.substr(-1) !== separator && filename.substr(0) !== separator) {
                    path += separator;
                }
                return path + filename;
            }

            function rhinoWrite(path, filename, text) {
                if (path) {
                    // turn filename into a qualified path
                    filename = getQualifiedFilename(java.lang.System.getProperty("file.separator"));
                    // create parent dir and ancestors if necessary
                    var file = java.io.File(filename);
                    var parentDir = file.getParentFile();
                    if (!parentDir.exists()) {
                        parentDir.mkdirs();
                    }
                }
                // finally write the file
                var out = new java.io.BufferedWriter(new java.io.FileWriter(filename));
                out.write(text);
                out.close();
            }

            function phantomWrite(path, filename, text) {
                // turn filename into a qualified path
                filename = getQualifiedFilename(window.fs_path_separator);
                // write via a method injected by phantomjs-testrunner.js
                __phantom_writeFile(filename, text);
            }

            function nodeWrite(path, filename, text) {
                var fs = require("fs");
                var nodejs_path = require("path");
                require("mkdirp").sync(path); // make sure the path exists
                var filepath = nodejs_path.join(path, filename);
                var xmlfile = fs.openSync(filepath, "w");
                fs.writeSync(xmlfile, text, 0);
                fs.closeSync(xmlfile);
            }

            // Attempt writing with each possible environment.
            // Track errors in case no write succeeds
            try {
                rhinoWrite(path, filename, text);
                return;
            } catch (e) {
                errors.push('  Rhino attempt: ' + e.message);
            }

            try {
                phantomWrite(path, filename, text);
                return;
            } catch (f) {
                errors.push('  PhantomJs attempt: ' + f.message);
            }

            try {
                nodeWrite(path, filename, text);
                return;
            } catch (g) {
                errors.push('  NodeJS attempt: ' + g.message);
            }

            // If made it here, no write succeeded.  Let user know.
            console.log("Warning: writing junit report failed for '" + path + "', '" +
                filename + "'. Reasons:\n" +
                errors.join("\n")
            );
        }
    };

    function dateString(date) {
        var year = date.getFullYear();
        var month = date.getMonth()+1; // 0-based
        var day = date.getDate();
        return year + "-" + formatAsTwoDigits(month) + "-" + formatAsTwoDigits(day);
    }

    function timeString(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        return hours + ":" + formatAsTwoDigits(minutes) + ":" + formatAsTwoDigits(seconds);
    }

    function formatAsTwoDigits(digit) {
        return (digit < 10) ? "0" + digit : "" + digit;
    }

    function escapeInvalidXmlChars(str) {
        return str.replace(/</g, "&lt;")
            .replace(/\>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/\'/g, "&apos;")
            .replace(/\&/g, "&amp;");
    }

    function getSkippedCount(specs) {
        if (!specs.length) { return 0; }
        for (var i = 0, count = 0; i < specs.length; i++) {
            if (specs[i].results().skipped) {
                count++;
            }
        }
        return count;
    }

    function printTestResults(runner, reporter) {
        var testRun = reporter.testRun;
        var output = "<?xml version=\"1.0\" encoding=\"utf-8\" ?>";

        var date = new Date();
        var results = runner.results();
        var specs = runner.specs();
        var specCount = specs.length;
        var skippedCount = getSkippedCount(specs);

        output += "<test-results name=\"" + escapeInvalidXmlChars(reporter.reportName) + "\" ";
        output += "total=\"" + specCount + "\" ";
        output += "failures=\"" + results.failedCount + "\" ";
        output += "not-run=\"" + skippedCount + "\" ";
        output += "date=\"" + dateString(date) + "\" ";
        output += "time=\"" + timeString(date) + "\">";

        output += printSuites(testRun.suites);

        output += "</test-results>";

        return output;
    }

    function printSuites(suites) {
        var output = "";

        for (var i = 0; i < suites.length; i++) {
            output += "<test-suite ";
            output += "name=\"" + escapeInvalidXmlChars(suites[i].name) + "\" ";
            output += "executed=\"" + suites[i].executed + "\" ";
            output += "success=\"" + suites[i].success + "\" ";
            output += "time=\"" + suites[i].elapsed + "\">";
            output += "<results>";

            output += printSuites(suites[i].suites);

            if (suites[i].specs.length > 0) {
                output += printSpecs(suites[i].specs);
            }

            output += "</results>";
            output += "</test-suite>";
        }

        return output;
    }

    function printSpecs(specs) {
        var output = "";

        for (var i = 0; i < specs.length; i++) {
            var spec = specs[i];

            output += "<test-case ";
            output += "name=\"" + escapeInvalidXmlChars(spec.name) + "\" ";
            output += "executed=\"" + spec.executed + "\" ";
            output += "success=\"" + spec.success + "\" ";
            output += "time=\"" + spec.elapsed + "\">";

            for (var j = 0; j < spec.failures.length; j++) {
                var failure = spec.failures[j];

                output += "<failure>";
                output += "<message><![CDATA[" + failure.message + "]]></message>";
                output += "<stack-trace><![CDATA[" + failure.stack + "]]></stack-trace>";
                output += "</failure>";
            }

            output += "</test-case>";
        }

        return output;
    }
})();
