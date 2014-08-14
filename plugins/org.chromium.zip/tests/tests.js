exports.init = function() {
  eval(require('org.apache.cordova.test-framework.test').injectJasmineInterface(this, 'this'));
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 75000;

  var zip = require('org.chromium.zip.Zip');

  describe('Zip', function () {
    var fail = function(done, why) {
      if (typeof why !== 'undefined') {
        console.error(why);
      }
      expect(true).toBe(false);
      done();
    };

    describe("unzip", function() {
      it("should be defined", function() {
        expect(typeof zip.unzip).toBeDefined();
      });

      var fileUrl = null;
      var dirUrl = null;

      it("downloading zip file", function(done) {
        window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
        var onError = fail.bind(null, done);

        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://archive.apache.org/dist/cordova/cordova-2.9.1-src.zip', true);
        xhr.responseType = 'blob';
        xhr.onerror = onError;
        xhr.onprogress = console.log.bind(console);
        xhr.onload = function(e) {

          window.requestFileSystem(PERSISTENT, 1024 * 1024, function(fs) {
            fs.root.getFile('cordova-2.9.1-src.zip', {create: true}, function(fileEntry) {
              fileEntry.createWriter(function(writer) {

                writer.onwrite = done;
                writer.onerror = onError;

                var blob = new Blob([xhr.response]);
                writer.write(blob);
                fileUrl = fileEntry.toNativeURL();
              }, onError);
            }, onError);

            fs.root.getDirectory('zipOutput', {create: true}, function(fileEntry) {
              dirUrl = fileEntry.toNativeURL();
            }, onError);
          }, onError);
        };

        xhr.send();
      });

      it("should unzip", function(done) {
        zip.unzip(fileUrl, dirUrl, function(result) {
          expect(result).toBe(0);
          done();
        });
      });

      it("should have progress events", function(done) {
        var progress = 0;
        zip.unzip(fileUrl, dirUrl, function(result) {
          expect(result).toBe(0);
          expect(progress).toBe(1.0);
          done();
        }, function(progressEvent) {
          progress = progressEvent.loaded / progressEvent.total;
          console.log(progress);
        });
      });
    });
  });
};

