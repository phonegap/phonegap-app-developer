/* global cordova:false */

/*!
 * Module dependencies.
 */

var exec = cordova.require('cordova/exec');

/**
 * ContentSync constructor.
 *
 * @param {Object} options to initiate a new content synchronization.
 *   @param {String} src is a URL to the content sync end-point.
 *   @param {String} id is used as a unique identifier for the sync operation
 *   @param {Object} type defines the sync strategy applied to the content.
 *     @param {String} replace completely removes existing content then copies new content.
 *     @param {String} merge   does not modify existing content, but adds new content.
 *   @param {Object} headers are used to set the headers for when we send a request to the src URL
 * @return {ContentSync} instance that can be monitored and cancelled.
 */

var ContentSync = function(options) {
    this._handlers = {
        'progress': [],
        'cancel': [],
        'error': [],
        'complete': []
    };

    // require options parameter
    if (typeof options === 'undefined') {
        throw new Error('The options argument is required.');
    }

    // require options.src parameter
    if (typeof options.src === 'undefined') {
        throw new Error('The options.src argument is required.');
    }

    // require options.id parameter
    if (typeof options.id === 'undefined') {
        throw new Error('The options.id argument is required.');
    }

    // define synchronization strategy
    //
    //     replace: This is the normal behavior. Existing content is replaced
    //              completely by the imported content, i.e. is overridden or
    //              deleted accordingly.
    //     merge:   Existing content is not modified, i.e. only new content is
    //              added and none is deleted or modified.
    //
    if (typeof options.type === 'undefined') {
        options.type = 'replace';
    }

    if (typeof options.headers === 'undefined') {
        options.headers = null;
    }

    if (typeof options.copyCordovaAssets === 'undefined') {
        options.copyCordovaAssets = false;
    }

    // store the options to this object instance
    this.options = options;

    // triggered on update and completion
    var that = this;
    var success = function(result) {
        if (result && typeof result.progress !== 'undefined') {
            that.emit('progress', result);
        } else if (result && typeof result.localPath !== 'undefined') {
            that.emit('complete', result);
        }
    };

    // triggered on error
    var fail = function(msg) {
        var e = (typeof msg === 'string') ? new Error(msg) : msg;
        that.emit('error', e);
    };

    // wait at least one process tick to allow event subscriptions
    setTimeout(function() {
        exec(success, fail, 'Sync', 'sync', [options.src, options.id, options.type, options.headers, options.copyCordovaAssets]);
    }, 10);
};

/**
 * Cancel the Content Sync
 *
 * After successfully canceling the content sync process, the `cancel` event
 * will be emitted.
 */

ContentSync.prototype.cancel = function() {
    var that = this;
    var onCancel = function() {
        that.emit('cancel');
    };
    setTimeout(function() {
        exec(onCancel, onCancel, 'Sync', 'cancel', [ that.options.id ]);
    }, 10);
};

/**
 * Listen for an event.
 *
 * The following events are supported:
 *
 *   - progress
 *   - cancel
 *   - error
 *   - completion
 *
 * @param {String} eventName to subscribe to.
 * @param {Function} callback triggered on the event.
 */

ContentSync.prototype.on = function(eventName, callback) {
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

ContentSync.prototype.emit = function() {
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
 * Content Sync Plugin.
 */

module.exports = {
    /**
     * Synchronize the content.
     *
     * This method will instantiate a new copy of the ContentSync object
     * and start synchronizing.
     *
     * @param {Object} options
     * @return {ContentSync} instance
     */

    sync: function(options) {
        return new ContentSync(options);
    },

    /**
     * Unzip
     *
     * This call is to replicate Zip::unzip plugin
     *
     */

    unzip: function(fileUrl, dirUrl, callback, progressCallback) {
        var win = function(result) {
            if (result && result.progress) {
                if (progressCallback) {
                    progressCallback(result);
                }
            } else if (callback) {
                callback(0);
            }
        };
        var fail = function(result) {
            if (callback) {
                callback(-1);
            }
        };
        exec(win, fail, 'Zip', 'unzip', [fileUrl, dirUrl]);
    },

    /**
     * Download
     *
     * This call is to replicate nothing but might be used instead of FileTransfer
     *
     */

    download: function(url, headers, cb) {
        var callback = (typeof headers == "function" ? headers : cb);
        exec(callback, callback, 'Sync', 'download', [url, null, headers]);
    },


    /**
     * ContentSync Object.
     *
     * Expose the ContentSync object for direct use
     * and testing. Typically, you should use the
     * .sync helper method.
     */

    ContentSync: ContentSync,

    /**
     * PROGRESS_STATE enumeration.
     *
     * Maps to the `progress` event's `status` object.
     * The plugin user can customize the enumeration's mapped string
     * to a value that's appropriate for their app.
     */

    PROGRESS_STATE: {
        0: 'STOPPED',
        1: 'DOWNLOADING',
        2: 'EXTRACTING',
        3: 'COMPLETE'
    },

    /**
     * ERROR_STATE enumeration.
     *
     * Maps to the `error` event's `status` object.
     * The plugin user can customize the enumeration's mapped string
     * to a value that's appropriate for their app.
     */

    ERROR_STATE: {
        1: 'INVALID_URL_ERR',
        2: 'CONNECTION_ERR',
        3: 'UNZIP_ERR'
    }
};
