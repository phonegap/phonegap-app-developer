var deviceReady = false;

//-------------------------------------------------------------------------
// Vibrations
//-------------------------------------------------------------------------

var vibrate = function(){
  navigator.notification.vibrate(2500);
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
  addListenerToClass('vibrate', vibrate);
  addListenerToClass('backBtn', backHome);
  init();
}
