(function () {

    /*!
     * Create export namespace.
     */

    if (!window.phonegap) window.phonegap = {};
    if (!window.phonegap.app) window.phonegap.app = {};

    /*!
     * Configuration.
     */

    if (!window.phonegap.app.analytic) window.phonegap.app.analytic = {};

    /**
     * Send Event information to Google Analytics
     *
     * Options:
     *   - `category` {string} is the type of Event.
     *   - `action` {string} is the specific instance of the Event.
     *   - `label` {string} misc. info about the Event.
     */

    window.phonegap.app.analytic.logEvent = function (category, action, label){
        var eventInfo = {
            v : 1,                                                  // version
            tid : 'UA-94271-34',                                    // tracking id
            cid : device.uuid,                                      // client id
            t : 'event',                                            // event type
            ec : (typeof category != 'undefined' ? category : ''),  // event category
            ea : (typeof action != 'undefined' ? action : ''),      // event action
            el : (typeof label != 'undefined' ? label : '')         // event label
        };

        sendEvent(eventInfo);
    };

    /*!
     * Internal function that sends the analytic info to google
     */

    function sendEvent(eventInfo) {
        var gaURL = 'https://www.google-analytics.com/collect?';
        $.ajax({ type: 'GET', url: gaURL + $.param(eventInfo) });
    }

})();