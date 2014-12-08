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

            if (!hasListener)
            {
                PhoneApplicationService.Current.Closing += OnServiceClosing;
                hasListener = true;
            }


            string script = @"(function(win) {
        function exec(msg) { window.external.Notify('ConsoleLog/' + msg); }
        var cons = win.console = win.console || {};
        cons.log = exec;
        cons.debug = cons.debug || cons.log;
        cons.info = cons.info   || function(msg) { exec('INFO:' + msg ); };     
        cons.warn = cons.warn   || function(msg) { exec('WARN:' + msg ); };
        cons.error = cons.error || function(msg) { exec('ERROR:' + msg ); };
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

        public void DetachHandler()
        {
            if (hasListener)
            {
                PhoneApplicationService.Current.Closing -= OnServiceClosing;
                hasListener = false;
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

    }
}
