(function () {

    /* global $, nacl, device */
    /* TODO: track down device ... */

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

    window.phonegap.app.analytic.setPermission = function (config, permissionVal) {
        config.optIn = permissionVal;
        window.phonegap.app.config.save(config, function () {});
    };

    /**
     * Get the text status of the permission
     *   - `config` {object} config object that holds the app's data
     */

    window.phonegap.app.analytic.getPermissionStatus = function (config) {
        return config.optIn;
    };

    /**
     * Send Event information to Google Analytics
     *
     * Options:
     *   - `gelfObject` {object} config object that holds the app's data
     */

    window.phonegap.app.analytic.logEvent = function (config, gelfObject) {
        if (config.optIn) {
            var metricsURL = 'https://metrics.phonegap.com/gelf';
            $.ajax({ type: 'POST', url: metricsURL, data: JSON.stringify(gelfObject) });
        }
    };

    /**
     * Helper function to help construct analytic object
     */

    window.phonegap.app.analytic.basicGELF = function () {
        return {
            'version': '1.1',
            'host': 'dev app',
            'short_message': '',
            '_userID': nacl.util.encodeBase64(nacl.hash(nacl.util.decodeUTF8(device.uuid))),
            '_platform': device.platform,
            '_appVersion': getVersion(),
            '_env': getDebugFlag() ? 1 : 0
        };
    };

    /**
     * Returns if the app is production or development
     */

    function getDebugFlag () {
        return /adhoc/.test($('#version').html());
    }

    /**
     * Returns the version of the app
     */

    function getVersion () {
        var versionStringSplit = $('#version').html().split(':');
        if (versionStringSplit.length >= 1) {
            return '0.0.0';
        } else {
            return versionStringSplit[1].trim().split('<')[0];
        }
    }
})();
