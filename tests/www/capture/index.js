var deviceReady = false;
var platformId = cordova.require('cordova/platform').id;
var pageStartTime = +new Date();

//-------------------------------------------------------------------------
// Camera
//-------------------------------------------------------------------------

function log(value) {
    console.log(value);
    document.getElementById('camera_status').textContent += (new Date() - pageStartTime) / 1000 + ': ' + value + '\n';
}

function captureAudioWin(mediaFiles){
    var path = mediaFiles[0].fullPath;
    log('Audio captured: ' + path);
    var m = new Media(path);
    m.play(); 
}

function captureAudioFail(e){
    log('Error getting audio: ' + e.code);
}

function getAudio(){
    clearStatus();
    var options = { limit: 1, duration: 10};
    navigator.device.capture.captureAudio(captureAudioWin, captureAudioFail, options);
}

function captureImageWin(mediaFiles){
    var path = mediaFiles[0].fullPath;
    log('Image captured: ' + path);    
    document.getElementById('camera_image').src = path;    
}

function captureImageFail(e){
    log('Error getting image: ' + e.code);
}

function getImage(){
    clearStatus();
    var options = { limit: 1 };
    navigator.device.capture.captureImage(captureImageWin, captureImageFail, options);    
}    

function captureVideoWin(mediaFiles){
    var path = mediaFiles[0].fullPath;
    log('Video captured: ' + path);
    
    // need to inject the video element into the html
    // doesn't seem to work if you have a pre-existing video element and
    // add in a source tag
    var vid = document.createElement('video');
    vid.id="theVideo";
    vid.width = "320";
    vid.height= "240";
    vid.controls = "true";
    var source_vid = document.createElement('source');
    source_vid.id = "theSource";
    source_vid.src = path;
    vid.appendChild(source_vid);
    document.getElementById('video_container').appendChild(vid);    
}

function captureVideoFail(e){
    log('Error getting video: ' + e.code);
}

function getVideo(){
    clearStatus();
    var options = { limit: 1, duration: 10 };
    navigator.device.capture.captureVideo(captureVideoWin, captureVideoFail, options);      
}

function resolveMediaFileURL(mediaFile, callback) {
    resolveLocalFileSystemURL(mediaFile.localURL, function(entry) {
        log("Resolved by URL: " + mediaFile.localURL);
        if (callback) callback();
    }, function(err) {
        log("Failed to resolve by URL: " + mediaFile.localURL);
        log("Error: " + JSON.stringify(err));
        if (callback) callback();
    });
}

function resolveMediaFile(mediaFile, callback) {
    resolveLocalFileSystemURL(mediaFile.fullPath, function(entry) {
        log("Resolved by path: " + mediaFile.fullPath);
        if (callback) callback();
    }, function(err) {
        log("Failed to resolve by path: " + mediaFile.fullPath);
        log("Error: " + JSON.stringify(err));
        if (callback) callback();
    });
}
    
function resolveVideo() {
    clearStatus();
    var options = { limit: 1, duration: 5 };
    navigator.device.capture.captureVideo(function(mediaFiles) {
        captureVideoWin(mediaFiles);
        resolveMediaFile(mediaFiles[0], function() {
            resolveMediaFileURL(mediaFiles[0]);
        });
    }, captureVideoFail, options);      
}

function clearStatus() {
    document.getElementById('camera_status').innerHTML = '';
    document.getElementById('camera_image').src = 'about:blank';
}

/**
 * Function called when page has finished loading.
 */
function init() {
    document.addEventListener("deviceready", function() {
        deviceReady = true;
        console.log("Device="+device.platform+" "+device.version);
    }, false);
    window.setTimeout(function() {
        if (!deviceReady) {
            alert("Error: Apache Cordova did not initialize.  Demo will not run correctly.");
        }
    },1000);
};


window.onload = function() {
  addListenerToClass('getAudio', getAudio);
  addListenerToClass('getImage', getImage);
  addListenerToClass('getVideo', getVideo);
  addListenerToClass('resolveVideo', resolveVideo);
  addListenerToClass('backBtn', backHome);
  init();
}
