var deviceReady = false;

var log = function(message) {
    message = message.replace(/\n/g, "<br/>");
    console.log(message);
    info.innerHTML += message + "<br/>";
    info.scrollTop = info.scrollHeight;
};

var isEnabled = function() {
    ble.isEnabled(
        function() {
            log("Bluetooth is enabled");
        },
        function() {
            log("Bluetooth is *not* enabled");
        }
    );
};

var showSettings = function() {

    if (cordova.platformId !== 'ios') {
        ble.showBluetoothSettings();
    } else {
        log("Show Bluetooth Settings is not available on " + cordova.platformId);
    }
};

var enable = function() {

    if (cordova.platformId === 'android') {
        ble.enable(
            function() {
                log("Bluetooth is enabled");
            },
            function() {
                log("The user did *not* enable Bluetooth");
            }
        );
    } else {
        log("Enable Bluetooth is not available on " + cordova.platformId);
    }

};

var scan = function() {
     var scanSeconds = 5;
        log("Scanning for BLE peripherals for " + scanSeconds + " seconds.");
        ble.startScan([], function(device) {
            log(JSON.stringify(device, null, 2));
        }, function(reason) {
            log("BLE Scan failed " + reason);
        });

        setTimeout(ble.stopScan,
            scanSeconds * 1000,
            function() { log("Scan complete"); },
            function() { log("stopScan failed"); }
        );
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
  addListenerToClass('isEnabled', isEnabled);
  addListenerToClass('settings', showSettings);
  addListenerToClass('enable', enable);
  addListenerToClass('scan', scan);

  addListenerToClass('backBtn', backHome);
  init();
};
