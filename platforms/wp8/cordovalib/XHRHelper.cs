/*  
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    
    http://www.apache.org/licenses/LICENSE-2.0
    
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

using Microsoft.Phone.Controls;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.IO.IsolatedStorage;
using System.Linq;
using System.Text;
using System.Windows;

namespace WPCordovaClassLib.CordovaLib
{
    public class XHRHelper : IBrowserDecorator
    {

        public WebBrowser Browser { get; set; }
        public PhoneApplicationPage Page { get; set; }

        public void InjectScript()
        {
            string script = @"(function(win, doc) {

    if (!win.__XHRShimAliases) {
        win.__XHRShimAliases = {};
    }
    else {
        return; // already initialized, this happens when navigating to #
    }

    win.__onXHRLocalCallback = function (responseCode, responseText, reqId) {
        if (win.__XHRShimAliases[reqId]){
            var alias = win.__XHRShimAliases[reqId];
            if (alias){
                delete win.__XHRShimAliases[reqId];
                if (responseCode == '200'){
                    alias.onResult && alias.onResult(responseText);
                    Object.defineProperty(alias, 'responseXML', {
                        get: function () {
                            return new DOMParser().parseFromString(this.responseText, 'text/xml');
                        }
                    });
                } else {
                    alias.onError && alias.onError(responseText);
                }
            }
        }
    };

    var docDomain = null;
    try {
        docDomain = doc.domain;
    } catch (err) {}

    if (!docDomain || docDomain.length === 0) {

        var aliasXHR = win.XMLHttpRequest;

        var XHRShim = function() {};
        win.XMLHttpRequest = XHRShim;
        XHRShim.noConflict = aliasXHR;
        XHRShim.UNSENT = 0;
        XHRShim.OPENED = 1;
        XHRShim.HEADERS_RECEIVED = 2;
        XHRShim.LOADING = 3;
        XHRShim.DONE = 4;
        XHRShim.prototype = {
            isAsync: false,
            onreadystatechange: null,
            readyState: 0,
            _url: '',
            timeout: 0,
            withCredentials: false,
            _requestHeaders: null,
            open: function (reqType, uri, isAsync, user, password) {

                if (uri && uri.indexOf('http') === 0) {
                    if (!this.wrappedXHR) {
                        this.wrappedXHR = new aliasXHR();
                        var self = this;
                        if (this.timeout > 0) {
                            this.wrappedXHR.timeout = this.timeout;
                        }
                        Object.defineProperty(this, 'timeout', {
                            set: function(val) {
                                this.wrappedXHR.timeout = val;
                            },
                            get: function() {
                                return this.wrappedXHR.timeout;
                            }
                        });
                        if (this.withCredentials) {
                            this.wrappedXHR.withCredentials = this.withCredentials;
                        }
                        Object.defineProperty(this, 'withCredentials', {
                            set: function(val) {
                                this.wrappedXHR.withCredentials = val;
                            },
                            get: function() {
                                return this.wrappedXHR.withCredentials;
                            }
                        });
                        Object.defineProperty(this, 'status', {
                            get: function() {
                                return this.wrappedXHR.status;
                            }
                        });
                        Object.defineProperty(this, 'responseText', {
                            get: function() {
                                return this.wrappedXHR.responseText;
                            }
                        });
                        Object.defineProperty(this, 'statusText', {
                            get: function() {
                                return this.wrappedXHR.statusText;
                            }
                        });
                        Object.defineProperty(this, 'responseXML', {
                            get: function() {
                                return this.wrappedXHR.responseXML;
                            }
                        });
                        Object.defineProperty(this, 'response', {
                            get: function() {
                                return this.wrappedXHR.response;
                            }
                        });
                        Object.defineProperty(this, 'responseType', {
                            set: function(val) {
                                return this.wrappedXHR.responseType = val;
                            }
                        });
                        this.getResponseHeader = function(header) {
                            return this.wrappedXHR.getResponseHeader(header);
                        };
                        this.getAllResponseHeaders = function() {
                            return this.wrappedXHR.getAllResponseHeaders();
                        };
                        this.wrappedXHR.onreadystatechange = function() {
                            self.changeReadyState(self.wrappedXHR.readyState);
                        };
                    }
                    return this.wrappedXHR.open(reqType, uri, isAsync, user, password);
                }
                else
                {
                    this.isAsync = isAsync;
                    this.reqType = reqType;
                    this._url = uri;
                }
            },
            statusText: '',
            changeReadyState: function(newState) {
                this.readyState = newState;
                if (this.onreadystatechange) {
                    // mimic simple 'readystatechange' event which should be passed as per spec
                    var evt = {type: 'readystatechange', target: this, timeStamp: new Date().getTime()};
                    this.onreadystatechange(evt);
                }
                if (this.readyState == XHRShim.DONE){
                    this.onload && this.onload();
                }
            },
            addEventListener: function (type, listener, useCapture){
                if (this.wrappedXHR) {
                    this.wrappedXHR.addEventListener(type, listener, useCapture);
                } else {
                    this['on' + type] = listener;
                }
            },
            removeEventListener: function (type, listener, useCapture){
                if (this.wrappedXHR) {
                    this.wrappedXHR.removeEventListener(type, listener, useCapture);
                } else {
                    if (this['on' + type] == listener) { // if listener is currently used
                        delete this['on' + type];
                    }
                }
            },
            setRequestHeader: function(header, value) {
                if (this.wrappedXHR) {
                    this.wrappedXHR.setRequestHeader(header, value);
                }
            },
            getResponseHeader: function(header) {
                return this.wrappedXHR ? this.wrappedXHR.getResponseHeader(header) : '';
            },
            getAllResponseHeaders: function() {
                return this.wrappedXHR ? this.wrappedXHR.getAllResponseHeaders() : '';
            },
            overrideMimeType: function(mimetype) {
                return this.wrappedXHR ? this.wrappedXHR.overrideMimeType(mimetype) : '';
            },
            responseText: '',
            responseXML: '',
            onResult: function(res) {
                this.status = 200;
                if (typeof res == 'object') {
                    res = JSON.stringify(res);
                }
                this.responseText = res;
                this.responseXML = res;
                this.changeReadyState(XHRShim.DONE);
            },
            onError: function(err) {
                this.status = 404;
                this.changeReadyState(XHRShim.DONE);
            },
            abort: function() {
                if (this.wrappedXHR) {
                    return this.wrappedXHR.abort();
                }
            },
            send: function(data) {
                if (this.wrappedXHR) {
                    return this.wrappedXHR.send(data);
                }
                else {
                    this.changeReadyState(XHRShim.OPENED);
                    var alias = this;

                    var root = window.location.href.split('#')[0];   // remove hash
                    
                    var rootPath = root.substr(0,root.lastIndexOf('/')) + '/';
                    // Removing unwanted slashes after x-wmapp0 from the basePath, URI cannot process x-wmapp0: /www or //www
                    var basePath = rootPath.replace(/:\/+/gi, ':');

                    //console.log( 'Stripping protocol if present and removing leading / characters' );
                    var resolvedUrl =
                            // remove protocol from the beginning of the url if present
                            ( this._url.indexOf( window.location.protocol ) === 0 ?
                                this._url.substring( window.location.protocol.length ) :
                                this._url )
                            // get rid of all the starting slashes
                            .replace(/^[/]*/, '')
                            .split('#')[0]; // remove hash

                    var wwwFolderPath = navigator.userAgent.indexOf('MSIE 9.0') > -1 ? 'app/www/' : 'www/';

                    // handle special case where url is of form app/www but we are loaded just from /www
                    if( resolvedUrl.indexOf('app/www') == 0 ) {
                        resolvedUrl = window.location.protocol  + wwwFolderPath + resolvedUrl.substr(7);
                    }
                    else if( resolvedUrl.indexOf('www') == 0) {
                        resolvedUrl = window.location.protocol  + wwwFolderPath + resolvedUrl.substr(4);
                    }

                    if(resolvedUrl.indexOf(':') < 0) {
                        resolvedUrl = basePath + resolvedUrl; // consider it relative
                    }

                    // Generate unique request ID
                    var reqId = new Date().getTime().toString() + Math.random();

                    var funk = function () {
                        __XHRShimAliases[reqId] = alias;

                        alias.changeReadyState(XHRShim.LOADING);
                        window.external.Notify('XHRLOCAL/' + reqId + '/' + resolvedUrl);
                    };

                    this.isAsync ? setTimeout(funk, 0) : funk();
                }
            },
            status: 404
        };
    }
})(window, document); ";


            Browser.InvokeScript("eval", new string[] { script });
        }

        public bool HandleCommand(string commandStr)
        {
            if (commandStr.IndexOf("XHRLOCAL") == 0)
            {
                var reqStr = commandStr.Replace("XHRLOCAL/", "").Split(new char[] {'/'}, 2);
                string reqId = reqStr[0];
                string url = reqStr[1];

                Uri uri = new Uri(url, UriKind.RelativeOrAbsolute);
                try
                {
                    using (IsolatedStorageFile isoFile = IsolatedStorageFile.GetUserStoreForApplication())
                    {
                        if (isoFile.FileExists(uri.AbsolutePath))
                        {
                            using (TextReader reader = new StreamReader(isoFile.OpenFile(uri.AbsolutePath, FileMode.Open, FileAccess.Read)))
                            {
                                string text = reader.ReadToEnd();
                                Browser.InvokeScript("__onXHRLocalCallback", new string[] { "200", text, reqId });
                                return true;
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    Debug.WriteLine("ERROR: Exception in HandleCommand: " + ex);
                }

                Uri relUri = new Uri(uri.AbsolutePath, UriKind.Relative);

                var resource = Application.GetResourceStream(relUri);
                try
                {
                    if (resource == null)
                    {
                        // 404 ?
                        Browser.InvokeScript("__onXHRLocalCallback", new string[] { "404", string.Empty, reqId });
                        return true;
                    }
                    else
                    {
                        using (StreamReader streamReader = new StreamReader(resource.Stream))
                        {
                            string text = streamReader.ReadToEnd();
                            Browser.InvokeScript("__onXHRLocalCallback", new string[] { "200", text, reqId });
                            return true;
                        }
                    }
                }
                catch (Exception ex)
                {
                    Debug.WriteLine("ERROR: Exception in HandleCommand: " + ex);
                }
            }

            return false;
        }

        public void AttachNativeHandlers()
        {
            // nothing todo
        }

        public void DetachNativeHandlers()
        {
            // nothing to do
        }
    }
}
