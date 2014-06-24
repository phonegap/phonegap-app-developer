var root, temp_root, persistent_root;

document.addEventListener('deviceready', function () {
    // one-time retrieval of the root file system entry
    var onError = function(e) {
        console.log('[ERROR] Problem setting up root filesystem for test running! Error to follow.');
        console.log(JSON.stringify(e));
    };

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
        function(fileSystem) {
            console.log('File API test Init: Setting PERSISTENT FS.');
            root = fileSystem.root; // set in file.tests.js
            persistent_root = root;

            // Once root is set up, fire off tests
            var jasmineEnv = jasmine.getEnv();
            jasmineEnv.updateInterval = 1000;

            var htmlReporter = new jasmine.HtmlReporter();

            jasmineEnv.addReporter(htmlReporter);

            jasmineEnv.specFilter = function(spec) {
              return htmlReporter.specFilter(spec);
            };

            jasmineEnv.execute();
        }, onError);
    window.requestFileSystem(LocalFileSystem.TEMPORARY, 0,
        function(fileSystem) {
            console.log('File API test Init: Setting TEMPORARY FS.');
            temp_root = fileSystem.root; // set in file.tests.js
        }, onError);
}, false);

window.onload = function() {
  addListenerToClass('backBtn', backHome);
}
