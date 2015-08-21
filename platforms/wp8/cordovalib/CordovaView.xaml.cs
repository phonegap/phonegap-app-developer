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

using System.Globalization;
using Microsoft.Phone.Controls;
using Microsoft.Phone.Shell;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.IO;
using System.IO.IsolatedStorage;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using WPCordovaClassLib.Cordova;
using WPCordovaClassLib.Cordova.JSON;
using WPCordovaClassLib.CordovaLib;



namespace WPCordovaClassLib
{
    public partial class CordovaView : UserControl
    {

        /// <summary>
        /// Indicates whether web control has been loaded and no additional initialization is needed.
        /// Prevents data clearing during page transitions.
        /// </summary>
        private bool IsBrowserInitialized = false;

        /// <summary>
        /// Set when the user attaches a back button handler inside the WebBrowser
        /// </summary>
        private bool OverrideBackButton = false;

        /// <summary>
        /// Sentinal to keep track of page changes as a result of the hardware back button
        /// Set to false when the back-button is pressed, which calls js window.history.back()
        /// If the page changes as a result of the back button the event is cancelled.
        /// </summary>
        private bool PageDidChange = false;

        private static string AppRoot = "";


        /// <summary>
        /// Handles native api calls
        /// </summary>
        private NativeExecution nativeExecution;

        protected BrowserMouseHelper bmHelper;

        private ConfigHandler configHandler;

        protected bool IsExiting = false;

        private Dictionary<string, IBrowserDecorator> browserDecorators;

        public System.Windows.Controls.Grid _LayoutRoot
        {
            get
            {
                return ((System.Windows.Controls.Grid)(this.FindName("LayoutRoot")));
            }
        }

        public WebBrowser Browser
        {
            get
            {
                return CordovaBrowser;
            }
        }



        /*
         * Setting StartPageUri only has an effect if called before the view is loaded.
         **/
        protected Uri _startPageUri = null;
        public Uri StartPageUri
        {
            get
            {
                if (_startPageUri == null)
                {
                    // default

                    return new Uri(AppRoot + "www/index.html", UriKind.Relative);
                }
                else
                {
                    return _startPageUri;
                }
            }
            set
            {
                if (!this.IsBrowserInitialized)
                {
                    _startPageUri = value;
                }
            }
        }

        /// <summary>
        /// Gets or sets whether to suppress bouncy scrolling of
        /// the WebBrowser control;
        /// </summary>
        public bool DisableBouncyScrolling
        {
            get;
            set;
        }

        public CordovaView()
        {

            InitializeComponent();

            if (DesignerProperties.IsInDesignTool)
            {
                return;
            }

            // initializes native execution logic
            configHandler = new ConfigHandler();
            configHandler.LoadAppPackageConfig();

            if (configHandler.ContentSrc != null)
            {
                if (Uri.IsWellFormedUriString(configHandler.ContentSrc, UriKind.Absolute))
                {
                    this.StartPageUri = new Uri(configHandler.ContentSrc, UriKind.Absolute);
                }
                else
                {
                    this.StartPageUri = new Uri(AppRoot + "www/" + configHandler.ContentSrc, UriKind.Relative);
                }
            }

            browserDecorators = new Dictionary<string, IBrowserDecorator>();

            nativeExecution = new NativeExecution(ref this.CordovaBrowser);
            bmHelper = new BrowserMouseHelper(ref this.CordovaBrowser);

            ApplyConfigurationPreferences();

            CreateDecorators();
        }

        /// <summary>
        /// Applies configuration preferences. Only BackgroundColor+fullscreen is currently supported.
        /// </summary>
        private void ApplyConfigurationPreferences()
        {
            string bgColor = configHandler.GetPreference("backgroundcolor");

            if (!String.IsNullOrEmpty(bgColor))
            {
                try
                {
                    Browser.Background = new SolidColorBrush(ColorFromHex(bgColor));
                }
                catch (Exception ex)
                {
                    Debug.WriteLine("Unable to parse BackgroundColor value '{0}'. Error: {1}", bgColor, ex.Message);
                }
            }

            string disallowOverscroll = configHandler.GetPreference("disallowoverscroll");
            if (!String.IsNullOrEmpty(disallowOverscroll))
            {
                try
                {
                    this.DisableBouncyScrolling = bool.Parse(disallowOverscroll);
                }
                catch (Exception ex)
                {
                    Debug.WriteLine("Unable to parse DisallowOverscroll value '{0}'. Error: {1}", disallowOverscroll, ex.Message);
                }
            }
        }

        /*
         *   browserDecorators are a collection of plugin-like classes (IBrowserDecorator) that add some bit of functionality to the browser.
         *   These are somewhat different than plugins in that they are usually not async and patch a browser feature that we would
         *   already expect to have.  Essentially these are browser polyfills that are patched from the outside in.
         * */
        void CreateDecorators()
        {
            XHRHelper xhrProxy = new XHRHelper();
            xhrProxy.Browser = CordovaBrowser;
            browserDecorators.Add("XHRLOCAL", xhrProxy);

            OrientationHelper orientHelper = new OrientationHelper();
            orientHelper.Browser = CordovaBrowser;
            browserDecorators.Add("Orientation", orientHelper);

            ConsoleHelper console = new ConsoleHelper();
            console.Browser = CordovaBrowser;
            browserDecorators.Add("ConsoleLog", console);

        }

        void AppClosing(object sender, ClosingEventArgs e)
        {
            Debug.WriteLine("AppClosing");
        }

        void AppDeactivated(object sender, DeactivatedEventArgs e)
        {
            Debug.WriteLine("INFO: AppDeactivated because " + e.Reason);
            try
            {
                CordovaBrowser.InvokeScript("eval", new string[] { "cordova.fireDocumentEvent('pause');" });
            }
            catch (Exception)
            {
                Debug.WriteLine("ERROR: Pause event error");
            }
        }

        void AppLaunching(object sender, LaunchingEventArgs e)
        {
            Debug.WriteLine("INFO: AppLaunching");
        }

        void AppActivated(object sender, Microsoft.Phone.Shell.ActivatedEventArgs e)
        {
            Debug.WriteLine("INFO: AppActivated");
            try
            {
                CordovaBrowser.InvokeScript("eval", new string[] { "cordova.fireDocumentEvent('resume');" });
            }
            catch (Exception)
            {
                Debug.WriteLine("ERROR: Resume event error");
            }
        }

        void CordovaBrowser_Loaded(object sender, RoutedEventArgs e)
        {
          
            PhoneApplicationService service = PhoneApplicationService.Current;
            service.Activated += new EventHandler<Microsoft.Phone.Shell.ActivatedEventArgs>(AppActivated);
            service.Launching += new EventHandler<LaunchingEventArgs>(AppLaunching);
            service.Deactivated += new EventHandler<DeactivatedEventArgs>(AppDeactivated);
            service.Closing += new EventHandler<ClosingEventArgs>(AppClosing);

            foreach (IBrowserDecorator iBD in browserDecorators.Values)
            {
                iBD.AttachNativeHandlers();
            }


            this.bmHelper.ScrollDisabled = this.DisableBouncyScrolling;

            if (DesignerProperties.IsInDesignTool)
            {
                return;
            }

            // prevents refreshing web control to initial state during pages transitions
            if (this.IsBrowserInitialized) return;


            try
            {

                // Before we possibly clean the ISO-Store, we need to grab our generated UUID, so we can rewrite it after.
                string deviceUUID = "";

                using (IsolatedStorageFile appStorage = IsolatedStorageFile.GetUserStoreForApplication())
                {
                    try
                    {
                        IsolatedStorageFileStream fileStream = new IsolatedStorageFileStream("DeviceID.txt", FileMode.Open, FileAccess.Read, appStorage);

                        using (StreamReader reader = new StreamReader(fileStream))
                        {
                            deviceUUID = reader.ReadLine();
                        }
                    }
                    catch (Exception /*ex*/)
                    {
                        deviceUUID = Guid.NewGuid().ToString();
                        Debug.WriteLine("Updating IsolatedStorage for APP:DeviceID :: " + deviceUUID);
                        IsolatedStorageFileStream file = new IsolatedStorageFileStream("DeviceID.txt", FileMode.Create, FileAccess.Write, appStorage);
                        using (StreamWriter writeFile = new StreamWriter(file))
                        {
                            writeFile.WriteLine(deviceUUID);
                            writeFile.Close();
                        }
                    }
                }

                CordovaBrowser.Navigate(StartPageUri);
                IsBrowserInitialized = true;
                AttachHardwareButtonHandlers();
            }
            catch (Exception ex)
            {
                Debug.WriteLine("ERROR: Exception in CordovaBrowser_Loaded :: {0}", ex.Message);
            }
        }

        private void CordovaBrowser_Unloaded(object sender, RoutedEventArgs e)
        {
            PhoneApplicationService service = PhoneApplicationService.Current;
            service.Activated -= new EventHandler<Microsoft.Phone.Shell.ActivatedEventArgs>(AppActivated);
            service.Launching -= new EventHandler<LaunchingEventArgs>(AppLaunching);
            service.Deactivated -= new EventHandler<DeactivatedEventArgs>(AppDeactivated);
            service.Closing -= new EventHandler<ClosingEventArgs>(AppClosing);

            foreach (IBrowserDecorator iBD in browserDecorators.Values)
            {
                iBD.DetachNativeHandlers();
            }
        }

        void AttachHardwareButtonHandlers()
        {
            PhoneApplicationFrame frame = Application.Current.RootVisual as PhoneApplicationFrame;
            if (frame != null)
            {
                PhoneApplicationPage page = frame.Content as PhoneApplicationPage;

                if (page != null)
                {
                    page.BackKeyPress += new EventHandler<CancelEventArgs>(page_BackKeyPress);
                    // CB-2347 -jm
                    string fullscreen = configHandler.GetPreference("fullscreen");
                    bool bFullScreen = false;
                    if (bool.TryParse(fullscreen, out bFullScreen) && bFullScreen)
                    {
                        SystemTray.SetIsVisible(page, false);
                    }
                }
            }
        }

        void page_BackKeyPress(object sender, CancelEventArgs e)
        {

            if (OverrideBackButton)
            {
                try
                {
                    CordovaBrowser.InvokeScript("eval", new string[] { "cordova.fireDocumentEvent('backbutton', {}, true);" });
                    e.Cancel = true;
                }
                catch (Exception ex)
                {
                    Debug.WriteLine("Exception while invoking backbutton into cordova view: " + ex.Message);
                }
            }
            else
            {
                try
                {
                    PageDidChange = false;

                    Uri uriBefore = this.Browser.Source;
                    // calling js history.back with result in a page change if history was valid.
                    CordovaBrowser.InvokeScript("eval", new string[] { "(function(){window.history.back();})()" });

                    Uri uriAfter = this.Browser.Source;

                    e.Cancel = PageDidChange || (uriBefore != uriAfter);
                }
                catch (Exception)
                {
                    e.Cancel = false; // exit the app ... ?
                }
            }
        }

        void CordovaBrowser_LoadCompleted(object sender, System.Windows.Navigation.NavigationEventArgs e)
        {
            if (IsExiting)
            {
                // Special case, we navigate to about:blank when we are about to exit.
                IsolatedStorageSettings.ApplicationSettings.Save();
                Application.Current.Terminate();
                return;
            }

            Debug.WriteLine("CordovaBrowser_LoadCompleted");

            string version = "?";
            System.Windows.Resources.StreamResourceInfo streamInfo = Application.GetResourceStream(new Uri("VERSION", UriKind.Relative));
            if (streamInfo != null)
            {
                using(StreamReader sr = new StreamReader(streamInfo.Stream))
                {
                    version = sr.ReadLine();
                }
            }
            Debug.WriteLine("Apache Cordova native platform version " + version + " is starting");

            string[] autoloadPlugs = this.configHandler.AutoloadPlugins;
            foreach (string plugName in autoloadPlugs)
            {
                nativeExecution.AutoLoadCommand(plugName);
            }

            // send js code to fire ready event
            string nativeReady = "(function(){ cordova.require('cordova/channel').onNativeReady.fire()})();";
            try
            {
                CordovaBrowser.InvokeScript("eval", new string[] { nativeReady });
            }
            catch (Exception /*ex*/)
            {
                Debug.WriteLine("Error calling js to fire nativeReady event. Did you include cordova.js in your html script tag?");
            }
            // attach js code to dispatch exitApp 
            string appExitHandler = "(function(){navigator.app = navigator.app || {}; navigator.app.exitApp= function(){cordova.exec(null,null,'CoreEvents','__exitApp',[]); }})();";
            try
            {
                CordovaBrowser.InvokeScript("eval", new string[] { appExitHandler });
            }
            catch (Exception /*ex*/)
            {
                Debug.WriteLine("Error calling js to add appExit funtion.");
            }

            if (this.CordovaBrowser.Opacity < 1)
            {
                FadeIn.Begin();
            }
        }


        void CordovaBrowser_Navigating(object sender, NavigatingEventArgs e)
        {
            if (!configHandler.URLIsAllowed(e.Uri.ToString()))
            {
                Debug.WriteLine("Whitelist exception: Stopping browser from navigating to :: " + e.Uri.ToString());
                e.Cancel = true;
                return;
            }

            this.PageDidChange = true;
            this.nativeExecution.ResetAllCommands();
        }

        /*
         *  This method does the work of routing commands
         *  NotifyEventArgs.Value contains a string passed from JS
         *  If the command already exists in our map, we will just attempt to call the method(action) specified, and pass the args along
         *  Otherwise, we create a new instance of the command, add it to the map, and call it ...
         *  This method may also receive JS error messages caught by window.onerror, in any case where the commandStr does not appear to be a valid command
         *  it is simply output to the debugger output, and the method returns.
         *
         **/
        void CordovaBrowser_ScriptNotify(object sender, NotifyEventArgs e)
        {
            string commandStr = e.Value;

            string commandName = commandStr.Split('/').FirstOrDefault();

            if (browserDecorators.ContainsKey(commandName))
            {
                browserDecorators[commandName].HandleCommand(commandStr);
                return;
            }

            CordovaCommandCall commandCallParams = CordovaCommandCall.Parse(commandStr);

            if (commandCallParams == null)
            {
                // ERROR
                Debug.WriteLine("ScriptNotify :: " + commandStr);
            }
            else if (commandCallParams.Service == "CoreEvents")
            {
                switch (commandCallParams.Action.ToLower())
                {
                    case "overridebackbutton":
                        string arg0 = JsonHelper.Deserialize<string[]>(commandCallParams.Args)[0];
                        this.OverrideBackButton = (arg0 != null && arg0.Length > 0 && arg0.ToLower() == "true");
                        break;
                    case "__exitapp":
                        Debug.WriteLine("Received exitApp command from javascript, app will now exit.");
                        CordovaBrowser.InvokeScript("eval", new string[] { "cordova.fireDocumentEvent('pause');" });
                        CordovaBrowser.InvokeScript("eval", new string[] { "setTimeout(function(){ cordova.fireDocumentEvent('exit'); cordova.exec(null,null,'CoreEvents','__finalexit',[]); },0);" });
                        break;
                    case "__finalexit":
                        IsExiting = true;
                        // hide the browser to prevent white flashes, since about:blank seems to always be white
                        CordovaBrowser.Opacity = 0d; 
                        CordovaBrowser.Navigate(new Uri("about:blank", UriKind.Absolute));
                        break;
                }
            }
            else
            {
                if (configHandler.IsPluginAllowed(commandCallParams.Service))
                {
                    commandCallParams.Namespace = configHandler.GetNamespaceForCommand(commandCallParams.Service);
                    nativeExecution.ProcessCommand(commandCallParams);
                }
                else
                {
                    Debug.WriteLine("Error::Plugin not allowed in config.xml. " + commandCallParams.Service);
                }
            }
        }

        public void LoadPage(string url)
        {
            if (this.configHandler.URLIsAllowed(url))
            {
                this.CordovaBrowser.Navigate(new Uri(url, UriKind.RelativeOrAbsolute));
            }
            else
            {
                Debug.WriteLine("Oops, Can't load url based on config.xml :: " + url);
            }
        }

        private void CordovaBrowser_NavigationFailed(object sender, System.Windows.Navigation.NavigationFailedEventArgs e)
        {
            Debug.WriteLine("CordovaBrowser_NavigationFailed :: " + e.Uri.ToString());
        }

        private void CordovaBrowser_Navigated(object sender, System.Windows.Navigation.NavigationEventArgs e)
        {
            foreach (IBrowserDecorator iBD in browserDecorators.Values)
            {
                iBD.InjectScript();
            }
        }

        /// <summary>
        /// Converts hex color string to a new System.Windows.Media.Color structure.
        /// If the hex is only rgb, it will be full opacity.
        /// </summary>
        protected Color ColorFromHex(string hexString)
        {
            string cleanHex = hexString.Replace("#", "").Replace("0x", "");
            // turn #FFF into #FFFFFF
            if (cleanHex.Length == 3)
            {
                cleanHex = "" + cleanHex[0] + cleanHex[0] + cleanHex[1] + cleanHex[1] + cleanHex[2] + cleanHex[2];
            }
            // add an alpha 100% if it is missing
            if (cleanHex.Length == 6)
            {
                cleanHex = "FF" + cleanHex;
            }
            int argb = Int32.Parse(cleanHex, NumberStyles.HexNumber);
            Color clr = Color.FromArgb((byte)((argb & 0xff000000) >> 0x18),
                              (byte)((argb & 0xff0000) >> 0x10),
                              (byte)((argb & 0xff00) >> 8),
                              (byte)(argb & 0xff));
            return clr;
        }

        ~CordovaView()
        {
            //Debug.WriteLine("CordovaView is destroyed");
        }
    }
}
