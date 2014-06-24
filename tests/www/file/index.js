var deviceReady = false;

var imageURL = "http://apache.org/images/feather-small.gif";
var videoURL = "http://techslides.com/demos/sample-videos/small.mp4";

/**
 * Function called when page has finished loading.
 */
function init() {
    document.addEventListener("deviceready", function() {
            deviceReady = true;
            console.log("Device="+device.platform+" "+device.version);
            bindEvents();
            document.body.classList.add(device.platform.toLowerCase() + "-platform");
        }, false);
    window.setTimeout(function() {
        if (!deviceReady) {
            alert("Error: Apache Cordova did not initialize.  Demo will not run correctly.");
        }
    },1000);
}

function bindEvents() {
    document.getElementById('downloadImgCDV').addEventListener('click', downloadImgCDV, false);
    document.getElementById('downloadImgNative').addEventListener('click', downloadImgNative, false);
    document.getElementById('downloadVideoCDV').addEventListener('click', downloadVideoCDV, false);
    document.getElementById('downloadVideoNative').addEventListener('click', downloadVideoNative, false);
    document.getElementById('testPrivateURL').addEventListener('click', testPrivateURL, false);
    var fsButtons = document.querySelectorAll('.resolveFs');
    for (var i=0; i < fsButtons.length; ++i) {
        fsButtons[i].addEventListener('click', resolveFs, false);
    }
}

function clearLog() {
    var log = document.getElementById("log");
    log.innerHTML = "";
}

function logMessage(message, color) {
    var log = document.getElementById("log");
    var logLine = document.createElement('div');
    if (color) {
        logLine.style.color = color;
    }
    logLine.innerHTML = message;
    log.appendChild(logLine);
}

function logError(serviceName) {
    return function(err) {
        logMessage("ERROR: " + serviceName + " " + JSON.stringify(err), "red");
    };
}

function downloadImgCDV(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    downloadImg(imageURL, function(entry) { return entry.toURL(); }, new Image());
}

function downloadImgNative(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    downloadImg(imageURL, function(entry) { return entry.toNativeURL(); }, new Image);
}

function downloadVideoCDV(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    var videoElement = document.createElement('video');
    videoElement.controls = "controls";
    downloadImg(videoURL, function(entry) { return entry.toURL(); }, videoElement);
}

function downloadVideoNative(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    var videoElement = document.createElement('video');
    videoElement.controls = "controls";
    downloadImg(videoURL, function(entry) { return entry.toNativeURL(); }, videoElement);
}

function downloadImg(source, urlFn, element) {
    var filename = source.substring(source.lastIndexOf("/")+1);
    function download(fileSystem) {
        var ft = new FileTransfer();
        logMessage("Starting download");
        ft.download(source, fileSystem.root.toURL() + filename, function(entry) {
            logMessage("Download complete")
            element.src = urlFn(entry)
            logMessage("Src URL is " + element.src, "green");
            logMessage("Inserting element");
            document.getElementById("output").appendChild(element);
        }, logError("ft.download"));
    }
    clearLog();
    logMessage("Requesting filesystem");
    requestFileSystem(TEMPORARY, 0, function(fileSystem) {
        logMessage("Checking for existing file");
        fileSystem.root.getFile(filename, {create: false}, function(entry) {
            logMessage("Removing existing file");
            entry.remove(function() {
                download(fileSystem);
            }, logError("entry.remove"));
        }, function() {
            download(fileSystem);
        });
    }, logError("requestFileSystem"));
}

function testPrivateURL(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    requestFileSystem(TEMPORARY, 0, function(fileSystem) {
        logMessage("Temporary root is at " + fileSystem.root.toNativeURL());
        fileSystem.root.getFile("testfile", {create: true}, function(entry) {
            logMessage("Temporary file is at " + entry.toNativeURL());
            if (entry.toNativeURL().substring(0,12) == "file:///var/") {
                logMessage("File starts with /var/, trying /private/var");
                var newURL = "file://localhost/private/var/" + entry.toNativeURL().substring(12) + "?and=another_thing";
                //var newURL = entry.toNativeURL();
                logMessage(newURL, 'blue');
                resolveLocalFileSystemURL(newURL, function(newEntry) {
                    logMessage("Successfully resolved.", 'green');
                    logMessage(newEntry.toURL(), 'blue');
                    logMessage(newEntry.toNativeURL(), 'blue');
                }, logError("resolveLocalFileSystemURL"));
            }
        }, logError("getFile"));
    }, logError("requestFileSystem"));
}

function resolveFs(ev) {
    var fsURL = "cdvfile://localhost/" + ev.target.getAttribute('data-fsname') + "/";
    logMessage("Resolving URL: " + fsURL);
    resolveLocalFileSystemURL(fsURL, function(entry) {
        logMessage("Success", 'green');
        logMessage(entry.toURL(), 'blue');
        logMessage(entry.toInternalURL(), 'blue');
        logMessage("Resolving URL: " + entry.toURL());
        resolveLocalFileSystemURL(entry.toURL(), function(entry2) {
            logMessage("Success", 'green');
            logMessage(entry2.toURL(), 'blue');
            logMessage(entry2.toInternalURL(), 'blue');
        }, logError("resolveLocalFileSystemURL"));
    }, logError("resolveLocalFileSystemURL"));
}

window.onload = function() {
  addListenerToClass('backBtn', backHome);
  init();
}
