/* global cordova:false */

/*!
 * Module dependencies.
 */

var exec = cordova.require('cordova/exec');

/**
 * PushNotification constructor.
 *
 * @param {Object} options to initiate Push Notifications.
 * @return {PushNotification} instance that can be monitored and cancelled.
 */

var PushNotification = function(options) {
    this._handlers = {
        'registration': [],
        'notification': [],
        'error': []
    };

    // require options parameter
    if (typeof options === 'undefined') {
        throw new Error('The options argument is required.');
    }

    // store the options to this object instance
    this.options = options;

    // triggered on registration and notification
    var that = this;
    var success = function(result) {
        if (result && typeof result.registrationId !== 'undefined') {
            that.emit('registration', result);
        } else if (result && typeof result.notification !== 'undefined') {
            that.emit('notification', result);
        }
    };

    // triggered on error
    var fail = function(msg) {
        var e = (typeof msg === 'string') ? new Error(msg) : msg;
        that.emit('error', e);
    };

    // wait at least one process tick to allow event subscriptions
    setTimeout(function() {
        exec(success, fail, 'PushNotification', 'init', [options]);
    }, 10);
};

/**
 * Listen for an event.
 *
 * The following events are supported:
 *
 *   - registration
 *   - notification
 *   - error
 *
 * @param {String} eventName to subscribe to.
 * @param {Function} callback triggered on the event.
 */

PushNotification.prototype.on = function(eventName, callback) {
    if (this._handlers.hasOwnProperty(eventName)) {
        this._handlers[eventName].push(callback);
    }
};

/**
 * Emit an event.
 *
 * This is intended for internal use only.
 *
 * @param {String} eventName is the event to trigger.
 * @param {*} all arguments are passed to the event listeners.
 *
 * @return {Boolean} is true when the event is triggered otherwise false.
 */

PushNotification.prototype.emit = function() {
    var args = Array.prototype.slice.call(arguments);
    var eventName = args.shift();

    if (!this._handlers.hasOwnProperty(eventName)) {
        return false;
    }

    for (var i = 0, length = this._handlers[eventName].length; i < length; i++) {
        this._handlers[eventName][i].apply(undefined,args);
    }

    return true;
};

/*!
 * Push Notification Plugin.
 */

module.exports = {
    /**
     * Register for Push Notifications.
     *
     * This method will instantiate a new copy of the PushNotification object
     * and start the registration process.
     *
     * @param {Object} options
     * @return {PushNotification} instance
     */

    init: function(options) {
        return new PushNotification(options);
    },

    /**
     * PushNotification Object.
     *
     * Expose the PushNotification object for direct use
     * and testing. Typically, you should use the
     * .init helper method.
     */

    PushNotification: PushNotification
};
