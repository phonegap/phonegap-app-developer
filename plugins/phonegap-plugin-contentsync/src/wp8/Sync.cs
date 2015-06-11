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

using System;
using System.Collections.Generic;
using System.IO;
using System.IO.IsolatedStorage;
using System.Net;
using System.Runtime.Serialization;
using System.Windows;
using System.Security;
using System.Diagnostics;

namespace WPCordovaClassLib.Cordova.Commands
{
    public class Sync : BaseCommand
    {
        public class DownloadRequestState
        {
            // This class stores the State of the request.
            public HttpWebRequest request;
            public TransferOptions options;
            public bool isCancelled;

            public DownloadRequestState()
            {
                request = null;
                options = null;
                isCancelled = false;
            }
        }

        public class TransferOptions
        {
            /// File path to upload  OR File path to download to
            public string FilePath { get; set; }

            public string Url { get; set; }
            /// Flag to recognize if we should trust every host (only in debug environments)
            public bool TrustAllHosts { get; set; }
            public string Id { get; set; }
            public string Headers { get; set; }
            public string CallbackId { get; set; }
            public bool ChunkedMode { get; set; }
            public int Type { get; set; }
            public bool CopyCordovaAssets { get; set; }
            /// Server address
            public string Server { get; set; }
            /// File key
            public string FileKey { get; set; }
            /// File name on the server
            public string FileName { get; set; }
            /// File Mime type
            public string MimeType { get; set; }
            /// Additional options
            public string Params { get; set; }
            public string Method { get; set; }

            public TransferOptions()
            {
                FileKey = "file";
                FileName = "image.jpg";
                MimeType = "image/jpeg";
            }
        }

        /// <summary>
        /// Boundary symbol
        /// </summary>
        private string Boundary = "----------------------------" + DateTime.Now.Ticks.ToString("x");

        // Error codes
        public const int InvalidUrlError = 1;
        public const int ConnectionError = 2;
        public const int UnzipError = 3;
        public const int AbortError = 4; // not really an error, but whatevs

        // Sync strategy codes
        public const int Replace = 1;
        public const int Merge = 2;

        private static Dictionary<string, DownloadRequestState> InProcDownloads = new Dictionary<string,DownloadRequestState>();

        /// <summary>
        /// Represents transfer error codes for callback
        /// </summary>
        [DataContract]
        public class SyncError
        {
            /// <summary>
            /// Error code
            /// </summary>
            [DataMember(Name = "code", IsRequired = true)]
            public int Code { get; set; }

            /// <summary>
            /// The source URI
            /// </summary>
            [DataMember(Name = "source", IsRequired = true)]
            public string Source { get; set; }

            /// <summary>
            /// The target URI
            /// </summary>
            ///
            [DataMember(Name = "target", IsRequired = true)]
            public string Target { get; set; }

            [DataMember(Name = "body", IsRequired = true)]
            public string Body { get; set; }

            /// <summary>
            /// The http status code response from the remote URI
            /// </summary>
            [DataMember(Name = "http_status", IsRequired = true)]
            public int HttpStatus { get; set; }

            /// <summary>
            /// Creates SyncError object
            /// </summary>
            /// <param name="errorCode">Error code</param>
            public SyncError(int errorCode)
            {
                this.Code = errorCode;
                this.Source = null;
                this.Target = null;
                this.HttpStatus = 0;
                this.Body = "";
            }
            public SyncError(int errorCode, string source, string target, int status, string body = "")
            {
                this.Code = errorCode;
                this.Source = source;
                this.Target = target;
                this.HttpStatus = status;
                this.Body = body;
            }
        }

        /// <summary>
        /// Represents a singular progress event to be passed back to javascript
        /// </summary>
        [DataContract]
        public class SyncProgress
        {
            /// <summary>
            /// Is the length of the response known?
            /// </summary>
            [DataMember(Name = "lengthComputable", IsRequired = true)]
            public bool LengthComputable { get; set; }
            /// <summary>
            /// amount of bytes loaded
            /// </summary>
            [DataMember(Name = "loaded", IsRequired = true)]
            public long BytesLoaded { get; set; }
            /// <summary>
            /// Total bytes
            /// </summary>
            [DataMember(Name = "total", IsRequired = false)]
            public long BytesTotal { get; set; }

            public SyncProgress(long bTotal = 0, long bLoaded = 0)
            {
                LengthComputable = bTotal > 0;
                BytesLoaded = bLoaded;
                BytesTotal = bTotal;
            }
        }

        // example : "{\"Authorization\":\"Basic Y29yZG92YV91c2VyOmNvcmRvdmFfcGFzc3dvcmQ=\"}"
        protected Dictionary<string,string> parseHeaders(string jsonHeaders)
        {
            try
            {
                Dictionary<string, string> result = new Dictionary<string, string>();

                string temp = jsonHeaders.StartsWith("{") ? jsonHeaders.Substring(1) : jsonHeaders;
                temp = temp.EndsWith("}") ? temp.Substring(0, temp.Length - 1) : temp;

                string[] strHeaders = temp.Split(',');
                for (int n = 0; n < strHeaders.Length; n++)
                {
                    // we need to use indexOf in order to WP7 compatible
                    int splitIndex = strHeaders[n].IndexOf(':');
                    if (splitIndex > 0)
                    {
                        string[] split = new string[2];
                        split[0] = strHeaders[n].Substring(0, splitIndex);
                        split[1] = strHeaders[n].Substring(splitIndex + 1);

                        split[0] = JSON.JsonHelper.Deserialize<string>(split[0]);
                        split[1] = JSON.JsonHelper.Deserialize<string>(split[1]);
                        result[split[0]] = split[1];
                    }
                }
                return result;
            }
            catch (Exception)
            {
                Debug.WriteLine("Failed to parseHeaders from string :: " + jsonHeaders);
            }
            return null;
        }

        public void sync(string options)
        {
            TransferOptions downloadOptions = null;
            HttpWebRequest webRequest = null;
            string callbackId;

            try
            {
                // options.src, options.type, options.headers, options.id
                string[] optionStrings = JSON.JsonHelper.Deserialize<string[]>(options);

                downloadOptions = new TransferOptions();
                downloadOptions.Url = optionStrings[0];

                bool trustAll = false;
                downloadOptions.TrustAllHosts = trustAll;

                downloadOptions.Id = optionStrings[1];

                downloadOptions.FilePath = "content_sync/downloads/" + downloadOptions.Id;

                if (String.Equals(optionStrings[2], "replace"))
                {
                    downloadOptions.Type = Replace;
                }
                else
                {
                    downloadOptions.Type = Merge;
                }

                downloadOptions.Headers = optionStrings[3];

                bool copyCordovaAssets = false;
                bool.TryParse(optionStrings[4], out copyCordovaAssets);
                downloadOptions.CopyCordovaAssets = copyCordovaAssets;

                downloadOptions.CallbackId = callbackId = optionStrings[5];
            }
            catch (Exception)
            {
                DispatchCommandResult(new PluginResult(PluginResult.Status.JSON_EXCEPTION));
                return;
            }

            try
            {
                // not sure if we still need this
                // is the URL a local app file?
                if (downloadOptions.Url.StartsWith("x-wmapp0") || downloadOptions.Url.StartsWith("file:"))
                {
                    using (IsolatedStorageFile isoFile = IsolatedStorageFile.GetUserStoreForApplication())
                    {
                        string cleanUrl = downloadOptions.Url.Replace("x-wmapp0:", "").Replace("file:", "").Replace("//","");

                        // pre-emptively create any directories in the FilePath that do not exist
                        string directoryName = getDirectoryName(downloadOptions.FilePath);
                        if (!string.IsNullOrEmpty(directoryName) && !isoFile.DirectoryExists(directoryName))
                        {
                            isoFile.CreateDirectory(directoryName);
                        }

                        // just copy from one area of iso-store to another ...
                        if (isoFile.FileExists(downloadOptions.Url))
                        {
                            isoFile.CopyFile(downloadOptions.Url, downloadOptions.FilePath);
                        }
                        else
                        {
                            // need to unpack resource from the dll
                            Uri uri = new Uri(cleanUrl, UriKind.Relative);
                            var resource = Application.GetResourceStream(uri);

                            if (resource != null)
                            {
                                // create the file destination
                                if (!isoFile.FileExists(downloadOptions.FilePath))
                                {
                                    var destFile = isoFile.CreateFile(downloadOptions.FilePath);
                                    destFile.Close();
                                }

                                using (FileStream fileStream = new IsolatedStorageFileStream(downloadOptions.FilePath, FileMode.Create, FileAccess.Write, isoFile))
                                {
                                    long totalBytes = resource.Stream.Length;
                                    int bytesRead = 0;
                                    using (BinaryReader reader = new BinaryReader(resource.Stream))
                                    {
                                        using (BinaryWriter writer = new BinaryWriter(fileStream))
                                        {
                                            int BUFFER_SIZE = 1024;
                                            byte[] buffer;

                                            while (true)
                                            {
                                                buffer = reader.ReadBytes(BUFFER_SIZE);
                                                // fire a progress event ?
                                                bytesRead += buffer.Length;
                                                if (buffer.Length > 0)
                                                {
                                                    writer.Write(buffer);
                                                    DispatchSyncProgress(bytesRead, totalBytes, 1, callbackId);
                                                }
                                                else
                                                {
                                                    writer.Close();
                                                    reader.Close();
                                                    fileStream.Close();
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    string result = "{ \"localPath\": \"" + downloadOptions.FilePath + "\" , \"Id\" : \"" + downloadOptions.Id + "\"}";
                    if (result != null)
                    {
                        DispatchCommandResult(new PluginResult(PluginResult.Status.OK, result), callbackId);
                    }
                    else
                    {
                        DispatchCommandResult(new PluginResult(PluginResult.Status.ERROR, 0), callbackId);
                    }

                    return;
                }
                else
                {
                    // otherwise it is web-bound, we will actually download it
                    //Debug.WriteLine("Creating WebRequest for url : " + downloadOptions.Url);
                    webRequest = (HttpWebRequest)WebRequest.Create(downloadOptions.Url);
                }
            }
            catch (Exception /*ex*/)
            {
                DispatchCommandResult(new PluginResult(PluginResult.Status.ERROR,
                                      new SyncError(InvalidUrlError, downloadOptions.Url, null, 0)));
                return;
            }

            if (downloadOptions != null && webRequest != null)
            {
                DownloadRequestState state = new DownloadRequestState();
                state.options = downloadOptions;
                state.request = webRequest;
                InProcDownloads[downloadOptions.Id] = state;

                if (!string.IsNullOrEmpty(downloadOptions.Headers))
                {
                    Dictionary<string, string> headers = parseHeaders(downloadOptions.Headers);
                    foreach (string key in headers.Keys)
                    {
                        webRequest.Headers[key] = headers[key];
                    }
                }

                try
                {
                    webRequest.BeginGetResponse(new AsyncCallback(downloadCallback), state);
                }
                catch (WebException)
                {
                    DispatchCommandResult(new PluginResult(PluginResult.Status.ERROR,
                                      new SyncError(InvalidUrlError, downloadOptions.Url, null, 0)));
                }
                // dispatch an event for progress ( 0 )
                lock (state)
                {
                    if (!state.isCancelled)
                    {
                        var plugRes = new PluginResult(PluginResult.Status.OK, new SyncProgress());
                        plugRes.KeepCallback = true;
                        plugRes.CallbackId = callbackId;
                        DispatchCommandResult(plugRes, callbackId);
                    }
                }
            }
        }

        public void cancel(string options)
        {
            Debug.WriteLine("cancel :: " + options);
            string[] optionStrings = JSON.JsonHelper.Deserialize<string[]>(options);
            string id = optionStrings[0];
            string callbackId = optionStrings[1];

            if (InProcDownloads.ContainsKey(id))
            {
                DownloadRequestState state = InProcDownloads[id];
                if (!state.isCancelled)
                { // prevent multiple callbacks for the same cancel
                    state.isCancelled = true;
                    if (!state.request.HaveResponse)
                    {
                        state.request.Abort();
                        InProcDownloads.Remove(id);
                        //callbackId = state.options.CallbackId;
                        //state = null;
                        DispatchCommandResult(new PluginResult(PluginResult.Status.ERROR,
                                                               new SyncError(Sync.AbortError)),
                                                               state.options.CallbackId);
                    }
                }
            }
            else
            {
                DispatchCommandResult(new PluginResult(PluginResult.Status.IO_EXCEPTION), callbackId); // TODO: is it an IO exception?
            }
        }

        private void DispatchSyncProgress(long bytesLoaded, long bytesTotal, int status, string callbackId, bool keepCallback = true)
        {
            //Debug.WriteLine("DispatchSyncProgress : " + callbackId);
            // send a progress change event
            SyncProgress progEvent = new SyncProgress(bytesTotal);
            progEvent.BytesLoaded = bytesLoaded;

            int percent = (int)((bytesLoaded / (double)bytesTotal) * 100);

            // jump from 50 to 100 once unzip is done
            if(bytesLoaded != bytesTotal && status != 3){
                percent = percent / 2;
            }

            string result = "{\"progress\":" + percent + ", \"status\":" + status + "}";

            PluginResult plugRes = new PluginResult(PluginResult.Status.OK, result);
            plugRes.KeepCallback = keepCallback;
            plugRes.CallbackId = callbackId;
            DispatchCommandResult(plugRes, callbackId);
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="asynchronousResult"></param>
        private void downloadCallback(IAsyncResult asynchronousResult)
        {
            DownloadRequestState reqState = (DownloadRequestState)asynchronousResult.AsyncState;
            HttpWebRequest request = reqState.request;

            string callbackId = reqState.options.CallbackId;
            try
            {
                HttpWebResponse response = (HttpWebResponse)request.EndGetResponse(asynchronousResult);

                // send a progress change event
                DispatchSyncProgress(0, response.ContentLength, 0, callbackId);

                using (IsolatedStorageFile isoFile = IsolatedStorageFile.GetUserStoreForApplication())
                {
                    // create any directories in the path that do not exist
                    string directoryName = getDirectoryName(reqState.options.FilePath);
                    if (!string.IsNullOrEmpty(directoryName) && !isoFile.DirectoryExists(directoryName))
                    {
                        isoFile.CreateDirectory(directoryName);
                    }

                    // make sure we delete the file if it exists
                    if(isoFile.FileExists(reqState.options.FilePath))
                    {
                        isoFile.DeleteFile(reqState.options.FilePath);
                    }

                    if (!isoFile.FileExists(reqState.options.FilePath))
                    {
                        var file = isoFile.CreateFile(reqState.options.FilePath);
                        file.Close();
                    }

                    using (FileStream fileStream = new IsolatedStorageFileStream(reqState.options.FilePath, FileMode.Open, FileAccess.Write, isoFile))
                    {
                        long totalBytes = response.ContentLength;
                        int bytesRead = 0;
                        using (BinaryReader reader = new BinaryReader(response.GetResponseStream()))
                        {
                            using (BinaryWriter writer = new BinaryWriter(fileStream))
                            {
                                int BUFFER_SIZE = 1024;
                                byte[] buffer;

                                while (true)
                                {
                                    buffer = reader.ReadBytes(BUFFER_SIZE);
                                    // fire a progress event ?
                                    bytesRead += buffer.Length;
                                    if (buffer.Length > 0 && !reqState.isCancelled)
                                    {
                                        writer.Write(buffer);
                                        DispatchSyncProgress(bytesRead, totalBytes, 1, callbackId);
                                    }
                                    else
                                    {
                                        writer.Close();
                                        reader.Close();
                                        fileStream.Close();
                                        break;
                                    }
                                    System.Threading.Thread.Sleep(1);
                                }
                            }
                        }
                    }
                    if (reqState.isCancelled)
                    {
                        isoFile.DeleteFile(reqState.options.FilePath);
                    }
                }

                if (reqState.isCancelled)
                {
                    DispatchCommandResult(new PluginResult(PluginResult.Status.ERROR, new SyncError(AbortError)),
                  callbackId);
                }
                else
                {
                    UnZip unzipper = new UnZip();
                    string destFilePath = "www/" + reqState.options.FilePath;
                    // at this point, bytesLoaded = bytesTotal so we'll just put the as '1'
                    DispatchSyncProgress(1, 1, 2, callbackId);
                    unzipper.unzip(reqState.options.FilePath, destFilePath, reqState.options.Type);

                    if(reqState.options.CopyCordovaAssets)
                    {
                        copyCordovaAssets(destFilePath);
                    }

                    DispatchSyncProgress(1, 1, 3, callbackId);
                    string result = "{ \"localPath\": \"" + reqState.options.FilePath + "\" , \"Id\" : \"" + reqState.options.Id + "\"}";
                    DispatchCommandResult(new PluginResult(PluginResult.Status.OK, result), callbackId);
                }
            }
            catch (IsolatedStorageException)
            {
                // Trying to write the file somewhere within the IsoStorage.
                DispatchCommandResult(new PluginResult(PluginResult.Status.ERROR, new SyncError(UnzipError)),
                                      callbackId);
            }
            catch (SecurityException)
            {
                // Trying to write the file somewhere not allowed.
                DispatchCommandResult(new PluginResult(PluginResult.Status.ERROR, new SyncError(UnzipError)),
                                      callbackId);
            }
            catch (WebException webex)
            {
                // TODO: probably need better work here to properly respond with all http status codes back to JS
                // Right now am jumping through hoops just to detect 404.
                HttpWebResponse response = (HttpWebResponse)webex.Response;
                if ((webex.Status == WebExceptionStatus.ProtocolError && response.StatusCode == HttpStatusCode.NotFound)
                    || webex.Status == WebExceptionStatus.UnknownError)
                {
                    // Weird MSFT detection of 404... seriously... just give us the f(*&#$@ status code as a number ffs!!!
                    // "Numbers for HTTP status codes? Nah.... let's create our own set of enums/structs to abstract that stuff away."
                    // FACEPALM
                    // Or just cast it to an int, whiner ... -jm
                    int statusCode = (int)response.StatusCode;
                    string body = "";

                    using (Stream streamResponse = response.GetResponseStream())
                    {
                        using (StreamReader streamReader = new StreamReader(streamResponse))
                        {
                            body = streamReader.ReadToEnd();
                        }
                    }
                    SyncError ftError = new SyncError(ConnectionError, null, null, statusCode, body);
                    DispatchCommandResult(new PluginResult(PluginResult.Status.ERROR, ftError),
                                          callbackId);
                }
                else
                {
                    lock (reqState)
                    {
                        if (!reqState.isCancelled)
                        {
                            DispatchCommandResult(new PluginResult(PluginResult.Status.ERROR,
                                                                   new SyncError(ConnectionError)),
                                                  callbackId);
                        }
                        else
                        {
                            Debug.WriteLine("It happened");
                        }
                    }
                }
            }
            catch (Exception)
            {
                DispatchCommandResult(new PluginResult(PluginResult.Status.ERROR,
                                                        new SyncError(UnzipError)),
                                      callbackId);
            }

            //System.Threading.Thread.Sleep(1000);
            if (InProcDownloads.ContainsKey(reqState.options.Id))
            {
                InProcDownloads.Remove(reqState.options.Id);
            }
        }

        // Gets the full path without the filename
        private string getDirectoryName(String filePath)
        {
            string directoryName;
            try
            {
                directoryName = filePath.Substring(0, filePath.LastIndexOf('/'));
            }
            catch
            {
                directoryName = "";
            }
            return directoryName;
        }

        private void copyCordovaAssets(string destFilePath)
        {
            copyCordovaPlugins("x-wmapp0:www/cordova.js", destFilePath + "/www/cordova.js");
            copyCordovaPlugins("x-wmapp0:www/cordova_plugins.js", destFilePath + "/www/cordova_plugins.js");

            Uri uri = new Uri("x-wmapp0:www/cordova_plugins.js", UriKind.RelativeOrAbsolute);
            Uri relUri = new Uri(uri.AbsolutePath, UriKind.Relative);
            var resource = Application.GetResourceStream(relUri);

            using (StreamReader streamReader = new StreamReader(resource.Stream))
            {
                // have to parse cordova_plugins.js to find all the file paths - kinda messy
                string cordovaPluginsText = streamReader.ReadToEnd();
                string parsedCordovaPlugins = cordovaPluginsText;
                string[] result;
                string[] jsonSepOne = new string[] { "module.exports=" };
                string[] jsonSepTwo = new string[] { ";module.exports.metadata" };

                parsedCordovaPlugins = parsedCordovaPlugins.Replace(" ", "");
                parsedCordovaPlugins = parsedCordovaPlugins.Replace("\n", "");

                result = parsedCordovaPlugins.Split(jsonSepOne, StringSplitOptions.RemoveEmptyEntries);
                result = result[1].Split(jsonSepTwo, StringSplitOptions.RemoveEmptyEntries);
                cordova_plugin[] pluginsJSON = JSON.JsonHelper.Deserialize<cordova_plugin[]>(result[0]);

                streamReader.Close();
                for(var i=0;i<pluginsJSON.Length;i++)
                {
                    //Debug.WriteLine("x-wmapp0:www/" + pluginsJSON[i].file + " to " + destFilePath + "/" + pluginsJSON[i].file);
                    copyCordovaPlugins("x-wmapp0:www/" + pluginsJSON[i].file, destFilePath + "/www/" + pluginsJSON[i].file);
                }
            }
        }

        private void copyCordovaPlugins(string srcURL, string destURL)
        {
            using (IsolatedStorageFile isoFile = IsolatedStorageFile.GetUserStoreForApplication())
            {
                string directoryName = getDirectoryName(destURL);
                if (!string.IsNullOrEmpty(directoryName) && !isoFile.DirectoryExists(directoryName))
                {
                    isoFile.CreateDirectory(directoryName);
                }

                Uri uri = new Uri(srcURL, UriKind.RelativeOrAbsolute);
                Uri relUri = new Uri(uri.AbsolutePath, UriKind.Relative);
                var resource = Application.GetResourceStream(relUri);

                if (resource != null)
                {
                    // create the file destination
                    if (!isoFile.FileExists(destURL))
                    {
                        var destFile = isoFile.CreateFile(destURL);
                        destFile.Close();
                    }

                    using (FileStream fileStream = new IsolatedStorageFileStream(destURL, FileMode.Create, FileAccess.Write, isoFile))
                    {
                        long totalBytes = resource.Stream.Length;
                        int bytesRead = 0;
                        using (BinaryReader reader = new BinaryReader(resource.Stream))
                        {
                            using (BinaryWriter writer = new BinaryWriter(fileStream))
                            {
                                int BUFFER_SIZE = 1024;
                                byte[] buffer;

                                //Debug.WriteLine("Copying url : " + srcURL + " to : " + destURL);
                                while (true)
                                {
                                    buffer = reader.ReadBytes(BUFFER_SIZE);
                                    // fire a progress event ?
                                    bytesRead += buffer.Length;
                                    if (buffer.Length > 0)
                                    {
                                        writer.Write(buffer);
                                    }
                                    else
                                    {
                                        writer.Close();
                                        reader.Close();
                                        fileStream.Close();
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        public class cordova_plugin
        {
            public string file;
            public string id;
        }
    }
}
