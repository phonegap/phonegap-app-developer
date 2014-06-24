var deviceReady = false;

function roundNumber(num) {
    var dec = 3;
    var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
    return result;
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
}

window.onload = function() {
  addListenerToClass('telLocation', function() {
    document.location='tel:5551212';
  });
  addListenerToClass('backBtn', backHome);
  init();
}
