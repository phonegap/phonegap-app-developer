var deviceReady = false;

/**
 * Function called when page has finished loading.
 */
function init() {
    document.addEventListener("deviceready", function() {
            deviceReady = true;
            console.log("Device="+device.platform+" "+device.version);
        }, false);
    function updateUserAgent() {
        document.getElementById("user-agent").textContent = navigator.userAgent;
    }
    updateUserAgent();
    window.setInterval(updateUserAgent, 1500);
    window.setTimeout(function() {
      if (!deviceReady) {
        alert("Error: Apache Cordova did not initialize.  Demo will not run correctly.");
      }
    },1000);
}

function doOpen(url, target, params, numExpectedRedirects) {
    numExpectedRedirects = numExpectedRedirects || 0;
    var iab = window.open(url, target, params);
    if (!iab) {
        alert('window.open returned ' + iab);
        return;
    }
    var counts;
    var lastLoadStartURL;
    var wasReset = false;
    function reset()  {
        counts = {
            'loaderror': 0,
            'loadstart': 0,
            'loadstop': 0,
            'exit': 0
        };
        lastLoadStartURL = '';
    }
    reset();

    function logEvent(e) {
        console.log('IAB event=' + JSON.stringify(e));
        counts[e.type]++;
        // Verify that event.url gets updated on redirects.
        if (e.type == 'loadstart') {
            if (e.url == lastLoadStartURL) {
                alert('Unexpected: loadstart fired multiple times for the same URL.');
            }
            lastLoadStartURL = e.url;
        }
        // Verify the right number of loadstart events were fired.
        if (e.type == 'loadstop' || e.type == 'loaderror') {
            if (e.url != lastLoadStartURL) {
                alert('Unexpected: ' + e.type + ' event.url != loadstart\'s event.url');
            }
            if (numExpectedRedirects === 0 && counts['loadstart'] !== 1) {
                // Do allow a loaderror without a loadstart (e.g. in the case of an invalid URL).
                if (!(e.type == 'loaderror' && counts['loadstart'] === 0)) {
                    alert('Unexpected: got multiple loadstart events. (' + counts['loadstart'] + ')');
                }
            } else if (numExpectedRedirects > 0 && counts['loadstart'] < (numExpectedRedirects+1)) {
                alert('Unexpected: should have got at least ' + (numExpectedRedirects+1) + ' loadstart events, but got ' + counts['loadstart']);
            }
            wasReset = true;
            numExpectedRedirects = 0;
            reset();
        }
        // Verify that loadend / loaderror was called.
        if (e.type == 'exit') {
            var numStopEvents = counts['loadstop'] + counts['loaderror'];
            if (numStopEvents === 0 && !wasReset) {
                alert('Unexpected: browser closed without a loadstop or loaderror.')
            } else if (numStopEvents > 1) {
                alert('Unexpected: got multiple loadstop/loaderror events.');
            }
        }
    }
    iab.addEventListener('loaderror', logEvent);
    iab.addEventListener('loadstart', logEvent);
    iab.addEventListener('loadstop', logEvent);
    iab.addEventListener('exit', logEvent);

    return iab;
}

function openWithStyle(url, cssUrl, useCallback) {
    var iab = doOpen(url, '_blank', 'location=yes');
    var callback = function(results) {
        if (results && results.length === 0) {
            alert('Results verified');
        } else {
            console.log(results);
            alert('Got: ' + typeof(results) + '\n' + JSON.stringify(results));
        }
    };
    if (cssUrl) {
        iab.addEventListener('loadstop', function(event) {
            iab.insertCSS({file: cssUrl}, useCallback && callback);
        });
    } else {
        iab.addEventListener('loadstop', function(event) {
            iab.insertCSS({code:'#style-update-literal { \ndisplay: block !important; \n}'},
                          useCallback && callback);
        });
    }
}

function openWithScript(url, jsUrl, useCallback) {
    var iab = doOpen(url, '_blank', 'location=yes');
    if (jsUrl) {
        iab.addEventListener('loadstop', function(event) {
            iab.executeScript({file: jsUrl}, useCallback && function(results) {
                if (results && results.length === 0) {
                    alert('Results verified');
                } else {
                    console.log(results);
                    alert('Got: ' + typeof(results) + '\n' + JSON.stringify(results));
                }
            });
        });
    } else {
        iab.addEventListener('loadstop', function(event) {
            var code = '(function(){\n' +
              '    var header = document.getElementById("header");\n' +
              '    header.innerHTML = "Script literal successfully injected";\n' +
              '    return "abc";\n' +
              '})()';
            iab.executeScript({code:code}, useCallback && function(results) {
                if (results && results.length === 1 && results[0] === 'abc') {
                    alert('Results verified');
                } else {
                    console.log(results);
                    alert('Got: ' + typeof(results) + '\n' + JSON.stringify(results));
                }
            });
        });
    }
}
var hiddenwnd=null;
var loadlistener = function(event) { alert('background window loaded ' ); };
function openHidden(url, startHidden) {
    var shopt =(startHidden) ? 'hidden=yes' : '';
    hiddenwnd = window.open(url,'random_string',shopt);
    if (!hiddenwnd) {
        alert('window.open returned ' + hiddenwnd);
        return;
    }
    if(startHidden) hiddenwnd.addEventListener('loadstop', loadlistener);
}
function showHidden() {
    if(!!hiddenwnd ) {
        hiddenwnd.show();
    }
}
function closeHidden() {
   if(!!hiddenwnd ) {
       hiddenwnd.removeEventListener('loadstop',loadlistener);
       hiddenwnd.close();
       hiddenwnd=null;
   }
}

window.onload = function() {
  addListenerToClass('openLocal', doOpen, 'local.html');
  addListenerToClass('openLocalSelf', doOpen, ['local.html', '_self']);
  addListenerToClass('openLocalSystem', doOpen, ['local.html', '_system']);
  addListenerToClass('openLocalBlank', doOpen, ['local.html', '_blank']);
  addListenerToClass('openLocalRandomNoLocation', doOpen, 
      ['local.html', 'random_string', 'location=no,disallowoverscroll=yes']);
  addListenerToClass('openLocalRandomToolBarBottom', doOpen,
      ['local.html', 'random_string', 'toolbarposition=bottom']);
  addListenerToClass('openLocalRandomToolBarTop', doOpen, 
      ['local.html', 'random_string', 'toolbarposition=top']);
  addListenerToClass('openLocalRandomToolBarTopNoLocation', doOpen, 
      ['local.html', 'random_string', 'toolbarposition=top,location=no']);
  addListenerToClass('openWhiteListed', doOpen, 'http://www.google.com');
  addListenerToClass('openWhiteListedSelf', doOpen, 
      ['http://www.google.com', '_self']);
  addListenerToClass('openWhiteListedSystem', doOpen,
      ['http://www.google.com', '_system']);
  addListenerToClass('openWhiteListedBlank', doOpen, 
      ['http://www.google.com', '_blank']);
  addListenerToClass('openWhiteListedRandom', doOpen,
      ['http://www.google.com', 'random_string']);
  addListenerToClass('openWhiteListedRandomNoLocation', doOpen,
      ['http://www.google.com', 'random_string', 'location=no']);
  addListenerToClass('openNonWhiteListed', doOpen, 'http://www.apple.com');
  addListenerToClass('openNonWhiteListedSelf', doOpen, 
      ['http://www.apple.com', '_self']);
  addListenerToClass('openNonWhiteListedSystem', doOpen, 
      ['http://www.apple.com', '_system']);
  addListenerToClass('openNonWhiteListedBlank', doOpen, 
      ['http://www.apple.com', '_blank']);
  addListenerToClass('openNonWhiteListedRandom', doOpen,
      ['http://www.apple.com', 'random_string']);
  addListenerToClass('openNonWhiteListedRandomNoLocation', doOpen, 
      ['http://www.apple.com', 'random_string', 'location=no']);
  addListenerToClass('openRedirect301', doOpen, 
      ['http://google.com', 'random_string', '', 1]);
  addListenerToClass('openRedirect302', doOpen, 
      ['http://goo.gl/pUFqg', 'random_string', '', 2]);
  addListenerToClass('openPDF', doOpen, 'http://www.stluciadance.com/prospectus_file/sample.pdf');
  addListenerToClass('openPDFBlank', doOpen, ['local.pdf', '_blank']);
  addListenerToClass('openInvalidScheme', doOpen, 
      ['x-ttp://www.invalid.com/', '_blank']);
  addListenerToClass('openInvalidHost', doOpen, 
      ['http://www.inv;alid.com/', '_blank']);
  addListenerToClass('openInvalidMissing', doOpen, ['nonexistent.html', '_blank']);
  addListenerToClass('openOriginalDocument', doOpen, ['inject.html', '_blank']);
  addListenerToClass('openCSSInjection', openWithStyle, 
      ['inject.html','inject.css']);
  addListenerToClass('openCSSInjectionCallback', openWithStyle, 
      ['inject.html','inject.css', true]);
  addListenerToClass('openCSSLiteralInjection', openWithStyle, 'inject.html');
  addListenerToClass('openCSSLiteralInjectionCallback', openWithStyle, 
    ['inject.html', null, true]);
  addListenerToClass('openScriptInjection', openWithScript, 
    ['inject.html', 'inject.js']);
  addListenerToClass('openScriptInjectionCallback', openWithScript, 
    ['inject.html', 'inject.js', true]);
  addListenerToClass('openScriptLiteralInjection', openWithScript, 'inject.html');
  addListenerToClass('openScriptLiteralInjectionCallback', openWithScript, 
    ['inject.html', null, true]);
  addListenerToClass('openHidden', openHidden, ['http://google.com', true]);
  addListenerToClass('showHidden', showHidden);
  addListenerToClass('closeHidden', closeHidden);
  addListenerToClass('openHiddenShow', openHidden, ['http://google.com', false]);
  addListenerToClass('openClearCache', doOpen, 
    ['http://www.google.com', '_blank', 'clearcache=yes']);
  addListenerToClass('openClearSessionCache', doOpen, 
    ['http://www.google.com', '_blank', 'clearsessioncache=yes']);
  addListenerToClass('openRemoteVideo', doOpen, ['video.html', '_blank']);
  addListenerToClass('openAnchor1', doOpen, ['local.html#anchor1', '_blank']);
  addListenerToClass('openAnchor2', doOpen, ['local.html#anchor2', '_blank']);


  addListenerToClass('backBtn', backHome);
  init();
}
