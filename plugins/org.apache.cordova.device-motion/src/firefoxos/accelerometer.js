
function listener(success, ev) {
    var acc = ev.accelerationIncludingGravity;
    acc.timestamp = new Date().getTime();
    success(acc);
}

var Accelerometer = {
    start: function start(success, error) {
        return window.addEventListener('devicemotion', function(ev) {
            listener(success, ev);
        }, false);
    },

    stop: function stop() {
        window.removeEventListener('devicemotion', listener, false);
    }
};

module.exports = Accelerometer;
require('cordova/firefoxos/commandProxy').add('Accelerometer', Accelerometer);
