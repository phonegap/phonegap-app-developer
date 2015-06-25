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

/************************************************************************
    This class is intended to supply the minimum expected browser behavior 
    for console.log|warn|info ...
    js code that is loaded in a minimal cordova application running on a device 
    or emulator will output console.log calls to Visual Studio's output window 
    when run from Visual Studio.
    
    For more advanced/complete console logging functions, 
    look at cordova-plugin-console.
************************************************************************/

using Microsoft.Phone.Controls;
using Microsoft.Phone.Shell;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.IO.IsolatedStorage;
using System.Linq;
using System.Text;

namespace WPCordovaClassLib.CordovaLib
{
    class ConsoleHelper : IBrowserDecorator
    {

        public WebBrowser Browser { get; set; }

        protected bool hasListener = false;



        public void InjectScript()
        {
            using(IsolatedStorageFileStream file = new IsolatedStorageFileStream("debugOutput.txt", FileMode.Create, FileAccess.Write, IsolatedStorageFile.GetUserStoreForApplication()))
            {
            }

            string script = 
    @"(function(win) {
        function stringify() { 
            // Convert arguments to strings and concat them with comma.
            return Array.prototype.map.call( arguments, function argumentToString( argument ) { 
                        // Return primitives as string.
                        if( typeof argument === 'string' || typeof argument === 'number' ) {
                            return argument;
                        }
                        if( typeof argument === 'function' ) {
                            return argument.toString();
                        }
                        // Convert complex arguments to JSON.
                        try {
                            return JSON.stringify( argument );
                        } catch( ignored ) {
                            return argument.toString();
                        }
                    } )
                        .join( ',' ); 
        }
        function exec() { window.external.Notify( 'ConsoleLog/' + stringify.apply( null, arguments ) ); }
        var cons = win.console = win.console || {};
        cons.log = exec;
        cons.debug = cons.debug || cons.log;
        cons.info = cons.info   || function() { exec( 'INFO:' + stringify.apply( null, arguments ) ); };
        cons.warn = cons.warn   || function() { exec( 'WARN:' + stringify.apply( null, arguments ) ); };
        cons.error = cons.error || function() { exec( 'ERROR:' + stringify.apply( null, arguments ) ); };
    })(window);";

            Browser.InvokeScript("eval", new string[] { script });
        }

        void OnServiceClosing(object sender, ClosingEventArgs e)
        {
            using (IsolatedStorageFileStream file = new IsolatedStorageFileStream("debugOutput.txt", FileMode.Append, FileAccess.Write, IsolatedStorageFile.GetUserStoreForApplication()))
            {
                using (StreamWriter writeFile = new StreamWriter(file))
                {
                    writeFile.WriteLine("EXIT");
                    writeFile.Close();
                }
                file.Close();
            }
        }

        public bool HandleCommand(string commandStr)
        {
            string output = commandStr.Substring("ConsoleLog/".Length);
            Debug.WriteLine(output);
            using (IsolatedStorageFileStream file = new IsolatedStorageFileStream("debugOutput.txt", FileMode.Append, FileAccess.Write, IsolatedStorageFile.GetUserStoreForApplication()))
            {
                using (StreamWriter writeFile = new StreamWriter(file))
                {
                    writeFile.WriteLine(output);
                    writeFile.Close();
                }
                file.Close();
            }
            return true;
        }

        public void AttachNativeHandlers()
        {
            PhoneApplicationService.Current.Closing += OnServiceClosing;
        }

        public void DetachNativeHandlers()
        {
            PhoneApplicationService.Current.Closing -= OnServiceClosing;
        }

    }
}
