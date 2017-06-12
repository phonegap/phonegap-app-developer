(function () {

    /*!
     * Create export namespace.
     */

    if (!window.phonegap) window.phonegap = {};
    if (!window.phonegap.app) window.phonegap.app = {};

    /*!
     * Configuration.
     */

    if (!window.phonegap.app.analytic) {
        window.phonegap.app.analytic = {};
    }

    /**
     * Enabled or disable analytics
     *
     * Options:
     *   - `config` {object} config object that holds the app's data
     *   - `permissionVal` {boolean} optIn value
     */

     window.phonegap.app.analytic.setPermission = function(config, permissionVal) {
        config.optIn = permissionVal;
        window.phonegap.app.config.save(config, function() {});
    };

    /**
     * Get the text status of the permission
     *   - `config` {object} config object that holds the app's data
     */

     window.phonegap.app.analytic.getPermissionStatus = function(config) {
        return config.optIn;
    };

    /**
     * Send Event information to Google Analytics
     *
     * Options:
     *   - `config` {object} config object that holds the app's data
     *   - `category` {string} is the type of Event.
     *   - `action` {string} is the specific instance of the Event.
     *   - `label` {string} misc. info about the Event.
     */

    window.phonegap.app.analytic.logEvent = function (config, category, action, label) {
        var eventInfo = {
            v : 1,                                                  // version
            tid : 'UA-94271-34',                                    // tracking id
            cid : device.uuid,                                      // client id
            t : 'event',                                            // event type
            ec : (typeof category != 'undefined' ? category : ''),  // event category
            ea : (typeof action != 'undefined' ? action : ''),      // event action
            el : (typeof label != 'undefined' ? label : '')         // event label
        };

        if(config.optIn) sendEvent(eventInfo);
    };

    /**
     * Returns if the app is production or development
     */

    function getDebugFlag() {
        return /adhoc/.test($('#version').html());
    }

    /**
     * Returns the version of the app
     */

    function getVersion() {
        return $('#version').html().split(':')[1].trim().split('<')[0];
    };

    /**
     * Returns an object for basic GELF analytic messages
     */

    function basicGELF() {
        return {
            "version": "1.1",
            "host": "dev app",
            "short_message": "",
            "_userID": nacl.util.encodeBase64(nacl.hash(nacl.util.decodeUTF8(device.uuid))),
            "_platform": device.platform,
            "_appVersion": getVersion(),
            "_env": getDebugFlag() ? 1 : 0
        };
    };

    /*!
     * Internal function that sends the analytic info to google
     */

    function sendEvent(eventInfo) {
        var gaURL = 'https://www.google-analytics.com/collect?';
        var metricsURL = 'https://metrics.phonegap.com/gelf';
        var jsonPayload = basicGELF();
        jsonPayload.short_message = eventInfo.ec + ' ' + eventInfo.ea;
        jsonPayload._error_msg = eventInfo.el;

        $.ajax({ type: 'GET', url: gaURL + $.param(eventInfo) });
        $.ajax( { type: 'POST', url: metricsURL, data: JSON.stringify(jsonPayload) } );
    }
})();