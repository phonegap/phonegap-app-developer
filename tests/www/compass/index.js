var deviceReady = false;

function roundNumber(num) {
    var dec = 3;
    var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
    return result;
}

//-------------------------------------------------------------------------
// Compass
//-------------------------------------------------------------------------
var watchCompassId = null;

/**
 * Start watching compass
 */
var watchCompass = function() {
    console.log("watchCompass()");

    // Success callback
    var success = function(a){
        document.getElementById('compassHeading').innerHTML = roundNumber(a.magneticHeading);
    };

    // Fail callback
    var fail = function(e){
        console.log("watchCompass fail callback with error code "+e);
        stopCompass();
        setCompassStatus(e);
    };

    // Update heading every 1 sec
    var opt = {};
    opt.frequency = 1000;
    watchCompassId = navigator.compass.watchHeading(success, fail, opt);

    setCompassStatus("Running");
};

/**
 * Stop watching the acceleration
 */
var stopCompass = function() {
    setCompassStatus("Stopped");
    if (watchCompassId) {
        navigator.compass.clearWatch(watchCompassId);
        watchCompassId = null;
    }
};

/**
 * Get current compass
 */
var getCompass = function() {
    console.log("getCompass()");

    // Stop compass if running
    stopCompass();

    // Success callback
    var success = function(a){
        document.getElementById('compassHeading').innerHTML = roundNumber(a.magneticHeading);
    };

    // Fail callback
    var fail = function(e){
        console.log("getCompass fail callback with error code "+e);
        setCompassStatus(e);
    };

    // Make call
    var opt = {};
    navigator.compass.getCurrentHeading(success, fail, opt);
};

/**
 * Set compass status
 */
var setCompassStatus = function(status) {
    document.getElementById('compass_status').innerHTML = status;
};

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
}

window.onload = function() {
  addListenerToClass('getCompass', getCompass);
  addListenerToClass('watchCompass', watchCompass);
  addListenerToClass('stopCompass', stopCompass);
  addListenerToClass('backBtn', backHome);
  init();
}
