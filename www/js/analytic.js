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
     * Ask user to ask if they want to opt in to analytics or not
     *
     * Options:
     *   - `config` {object} the config object that holds app config data.
     */

    window.phonegap.app.analytic.askPermission = function(config) {
        function onConfirm(buttonIndex) {
            config.optIn = (buttonIndex === 0) ? true : false;
            config.askedToOptIn = true;
            window.phonegap.app.config.save(config, function() {});
        }

        navigator.notification.confirm(
            'Would you like to opt in to analytics?',
            onConfirm,
            'Opt In to Analytics',
            ['Yes', 'No'] );
    };

    /**
     * Send Event information to Google Analytics
     *
     * Options:
     *   - `category` {string} is the type of Event.
     *   - `action` {string} is the specific instance of the Event.
     *   - `label` {string} misc. info about the Event.
     */

    window.phonegap.app.analytic.logEvent = function (category, action, label) {
        var eventInfo = {
            v : 1,                                                  // version
            tid : 'UA-94271-34',                                    // tracking id
            cid : device.uuid,                                      // client id
            t : 'event',                                            // event type
            ec : (typeof category != 'undefined' ? category : ''),  // event category
            ea : (typeof action != 'undefined' ? action : ''),      // event action
            el : (typeof label != 'undefined' ? label : '')         // event label
        };

        if(window.phonegap.app.config.optIn) sendEvent(eventInfo);
    };

    /*!
     * Internal function that sends the analytic info to google
     */

    function sendEvent(eventInfo) {
        var gaURL = 'https://www.google-analytics.com/collect?';
        $.ajax({ type: 'GET', url: gaURL + $.param(eventInfo) });
    }

})();