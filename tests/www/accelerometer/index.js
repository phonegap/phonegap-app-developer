var deviceReady = false;

function roundNumber(num) {
    var dec = 3;
    var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
    return result;
}

//-------------------------------------------------------------------------
// Acceleration
//-------------------------------------------------------------------------
var watchAccelId = null;

/**
 * Start watching acceleration
 */
var watchAccel = function() {
    console.log("watchAccel()");

    // Success callback
    var success = function(a){
        document.getElementById('x').innerHTML = roundNumber(a.x);
        document.getElementById('y').innerHTML = roundNumber(a.y);
        document.getElementById('z').innerHTML = roundNumber(a.z);
        console.log("watchAccel success callback");
    };

    // Fail callback
    var fail = function(e){
        console.log("watchAccel fail callback with error code "+e);
        stopAccel();
        setAccelStatus(Accelerometer.ERROR_MSG[e]);
    };

    // Update acceleration every 1 sec
    var opt = {};
    opt.frequency = 1000;
    watchAccelId = navigator.accelerometer.watchAcceleration(success, fail, opt);

    setAccelStatus("Running");
};

/**
 * Stop watching the acceleration
 */
var stopAccel = function() {
	console.log("stopAccel()");
    setAccelStatus("Stopped");
    if (watchAccelId) {
        navigator.accelerometer.clearWatch(watchAccelId);
        watchAccelId = null;
    }
};

/**
 * Get current acceleration
 */
var getAccel = function() {
    console.log("getAccel()");

    // Stop accel if running
    stopAccel();

    // Success callback
    var success = function(a){
        document.getElementById('x').innerHTML = roundNumber(a.x);
        document.getElementById('y').innerHTML = roundNumber(a.y);
        document.getElementById('z').innerHTML = roundNumber(a.z);
    };

    // Fail callback
    var fail = function(e){
        console.log("getAccel fail callback with error code "+e);
        setAccelStatus(Accelerometer.ERROR_MSG[e]);
    };

    // Make call
    var opt = {};
    navigator.accelerometer.getCurrentAcceleration(success, fail, opt);
};

/**
 * Set accelerometer status
 */
var setAccelStatus = function(status) {
    document.getElementById('accel_status').innerHTML = status;
};

/**
 * Function called when page has finished loading.
 */
function init() {
    console.log("accelerometer.init()");
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
  addListenerToClass('getAccel', getAccel);
  addListenerToClass('watchAccel', watchAccel);
  addListenerToClass('stopAccel', stopAccel);
  addListenerToClass('backBtn', backHome);
  init();
}
