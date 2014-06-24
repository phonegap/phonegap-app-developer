var origGeolocation = null;
var newGeolocation = null;

//-------------------------------------------------------------------------
// Location
//-------------------------------------------------------------------------
var watchLocationId = null;

/**
 * Start watching location
 */
var watchLocation = function(usePlugin) {
    var geo = usePlugin ? newGeolocation : origGeolocation;
    if (!geo) {
        alert('geolocation object is missing. usePlugin = ' + usePlugin);
        return;
    }

    // Success callback
    var success = function(p){
          console.log('watch location success');
          setLocationDetails(p);
    };

    // Fail callback
    var fail = function(e){
        console.log("watchLocation fail callback with error code "+e);
        stopLocation(geo);
    };

    // Get location
    watchLocationId = geo.watchPosition(success, fail, {enableHighAccuracy: true});
    setLocationStatus("Running");
};

/**
 * Stop watching the location
 */
var stopLocation = function(usePlugin) {
    var geo = usePlugin ? newGeolocation : origGeolocation;
    if (!geo) {
        alert('geolocation object is missing. usePlugin = ' + usePlugin);
        return;
    }
    setLocationStatus("Stopped");
    if (watchLocationId) {
        geo.clearWatch(watchLocationId);
        watchLocationId = null;
    }
};

/**
 * Get current location
 */
var getLocation = function(usePlugin, opts) {
    var geo = usePlugin ? newGeolocation : origGeolocation;
    if (!geo) {
        alert('geolocation object is missing. usePlugin = ' + usePlugin);
        return;
    }

    // Stop location if running
    stopLocation(geo);

    // Success callback
    var success = function(p){
        console.log('get location success');
        setLocationDetails(p);
        setLocationStatus("Done");
    };

    // Fail callback
    var fail = function(e){
        console.log("getLocation fail callback with error code "+e.code);
        setLocationStatus("Error: "+e.code);
    };

    setLocationStatus("Retrieving location...");

    // Get location
    geo.getCurrentPosition(success, fail, opts || {enableHighAccuracy: true}); //, {timeout: 10000});

};

/**
 * Set location status
 */
var setLocationStatus = function(status) {
    document.getElementById('location_status').innerHTML = status;
};
var setLocationDetails = function(p) {
var date = (new Date(p.timestamp));
        document.getElementById('latitude').innerHTML = p.coords.latitude;
        document.getElementById('longitude').innerHTML = p.coords.longitude;
        document.getElementById('altitude').innerHTML = p.coords.altitude;
        document.getElementById('accuracy').innerHTML = p.coords.accuracy;
        document.getElementById('heading').innerHTML = p.coords.heading;
        document.getElementById('speed').innerHTML = p.coords.speed;
        document.getElementById('altitude_accuracy').innerHTML = p.coords.altitudeAccuracy;
        document.getElementById('timestamp').innerHTML =  date.toDateString() + " " + date.toTimeString();
}

/**
 * Function called when page has finished loading.
 */
function init() {
    document.addEventListener("deviceready", function() {
        newGeolocation = navigator.geolocation;
        origGeolocation = cordova.require('cordova/modulemapper').getOriginalSymbol(window, 'navigator.geolocation');
        if (!origGeolocation) {
            origGeolocation = newGeolocation;
            newGeolocation = null;
        }
    }, false);
}

window.onload = function() {
  addListenerToClass('getWebViewLocation', getLocation, [false]);
  addListenerToClass('watchWebViewLocation', watchLocation, [false]);
  addListenerToClass('stopWebViewLocation', stopLocation, [false]);
  addListenerToClass('getWebViewLocation30', getLocation, [false, {maximumAge:30000}]);
  addListenerToClass('getLocation', getLocation, [true]);
  addListenerToClass('watchLocation', watchLocation, [true]);
  addListenerToClass('stopLocation', stopLocation, [true]);
  addListenerToClass('getLocation30', getLocation, [true, {maximumAge:30000}]);
  addListenerToClass('backBtn', backHome);
  init();
}
