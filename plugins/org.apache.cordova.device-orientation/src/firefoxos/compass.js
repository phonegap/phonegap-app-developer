
var Compass = {
    getHeading: function(success, error) {
        var listener = function(ev) {
            var orient = {
                trueHeading: ev.alpha,
                magneticHeading: ev.alpha,
                headingAccuracy: 0,
                timestamp: new Date().getTime()
            }
            success(orient);
            // remove listener after first response
            window.removeEventListener('deviceorientation', listener, false);
        }
        return window.addEventListener('deviceorientation', listener, false);
    },
};

var firefoxos = require('cordova/platform');

module.exports = Compass;
require('cordova/firefoxos/commandProxy').add('Compass', Compass);

