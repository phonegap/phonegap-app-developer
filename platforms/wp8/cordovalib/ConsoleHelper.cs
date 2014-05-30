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

            Browser.InvokeScript("execScript", new string[] { script });
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

    }
}
