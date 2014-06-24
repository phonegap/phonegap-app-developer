var deviceReady = false;

function interceptBackbutton() {
  eventOutput("Back button intercepted");
}
function interceptMenubutton() {
  eventOutput("Menu button intercepted");
}
function interceptSearchbutton() {
  eventOutput("Search button intercepted");
}
function interceptResume() {
  eventOutput("Resume event intercepted");
}
function interceptPause() {
  eventOutput("Pause event intercepted");
}
function interceptOnline() {
  eventOutput("Online event intercepted");
}
function interceptOffline() {
  eventOutput("Offline event intercepted");
}

var eventOutput = function(s) {
    var el = document.getElementById("results");
    el.innerHTML = el.innerHTML + s + "<br>";
};


/**
 * Function called when page has finished loading.
 */
function init() {
    document.addEventListener("deviceready", function() {
            deviceReady = true;
            console.log("Device="+device.platform+" "+device.version);
            eventOutput("deviceready event: "+device.platform+" "+device.version);
        }, false);
    window.setTimeout(function() {
      if (!deviceReady) {
        alert("Error: Apache Cordova did not initialize.  Demo will not run correctly.");
      }
    },1000);
}


window.onload = function() {
  addListenerToClass('interceptBackButton', function() {
    document.addEventListener('backbutton', interceptBackbutton, false);
  });
  addListenerToClass('stopInterceptOfBackButton', function() {
    document.removeEventListener('backbutton', interceptBackbutton, false);
  });
  addListenerToClass('interceptMenuButton', function() {
    document.addEventListener('menubutton', interceptMenubutton, false);
  });
  addListenerToClass('stopInterceptOfMenuButton', function() {
    document.removeEventListener('menubutton', interceptMenubutton, false);
  });
  addListenerToClass('interceptSearchButton', function() {
    document.addEventListener('searchbutton', interceptSearchbutton, false);
  });
  addListenerToClass('stopInterceptOfSearchButton', function() {
    document.removeEventListener('searchbutton', interceptSearchbutton, false);
  });
  addListenerToClass('interceptResume', function() {
    document.addEventListener('resume', interceptResume, false);
  });
  addListenerToClass('stopInterceptOfResume', function() {
    document.removeEventListener('resume', interceptResume, false);
  });
  addListenerToClass('interceptPause', function() {
    document.addEventListener('pause', interceptPause, false);
  });
  addListenerToClass('stopInterceptOfPause', function() {
    document.removeEventListener('pause', interceptPause, false);
  });
  addListenerToClass('interceptOnline', function() {
    document.addEventListener('online', interceptOnline, false);
  });
  addListenerToClass('stopInterceptOfOnline', function() {
    document.removeEventListener('online', interceptOnline, false);
  });
  addListenerToClass('interceptOffline', function() {
    document.addEventListener('offline', interceptOffline, false);
  });
  addListenerToClass('stopInterceptOfOffline', function() {
    document.removeEventListener('offline', interceptOffline, false);
  });

  addListenerToClass('backBtn', backHome);
  init();
}
