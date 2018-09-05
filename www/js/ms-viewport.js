/**
 * Issue #65 and #68
 * Reference: http://mattstow.com/responsive-design-in-ie10-on-windows-phone-8.html#the-fix
 * Usage: must be included in <head> to apply before rendering the page.
 */
(function () {
    if ('-ms-user-select' in document.documentElement.style && navigator.userAgent.match(/IEMobile/)) {
        var msViewportStyle = document.createElement('style');
        msViewportStyle.appendChild(
            document.createTextNode('@-ms-viewport{width:auto!important}')
        );
        document.getElementsByTagName('head')[0].appendChild(msViewportStyle);
    }
})();
