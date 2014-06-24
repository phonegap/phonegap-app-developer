var deviceReady = false;

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
  addListenerToClass('backBtn', backHome);
  init();

  if (!localStorage.pageLoadCount) {
      localStorage.pageLoadCount = 0;
  }
  localStorage.pageLoadCount = parseInt(localStorage.pageLoadCount) + 1;
  document.getElementById('count').textContent = localStorage.pageLoadCount;
}
