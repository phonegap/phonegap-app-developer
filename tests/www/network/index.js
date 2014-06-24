function eventOutput(s) {
    var el = document.getElementById("results");
    el.innerHTML = el.innerHTML + s + "<br>";
}

function printNetwork() {
    eventOutput("navigator.connection.type=" + navigator.connection.type);
    eventOutput("navigator.network.connection.type=" + navigator.network.connection.type);
}

/**
 * Function called when page has finished loading.
 */
function init() {
    var deviceReady = false;
    function onEvent(e) {
        eventOutput('Event of type: ' + e.type);
        printNetwork();
    }
    document.addEventListener('online', onEvent, false);
    document.addEventListener('offline', onEvent, false);
    document.addEventListener("deviceready", function() {
        deviceReady = true;
        eventOutput("Device="+device.platform+" "+device.version);
        printNetwork();
    }, false);
    window.setTimeout(function() {
        if (!deviceReady) {
            alert("Error: Cordova did not initialize.  Demo will not run correctly.");
        }
    }, 1000);
}

window.onload = function() {
  addListenerToClass('printNetwork', printNetwork);
  addListenerToClass('backBtn', backHome);
  init();
}
