/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);

        document.getElementById("syncBtn").onclick = this.sync;
        document.getElementById("downloadExtractBtn").onclick = this.download;
    },

    setProgress: function(progress) {
        if(progress.status) {
            switch(progress.status) {
                case 1:
                    document.getElementById('status').innerHTML = "Downloading...";
                    break;
                case 2:
                    document.getElementById('status').innerHTML = "Extracting...";
                    break;
                case 3:
                    document.getElementById('status').innerHTML = "Complete!";
                    break;
                default:
                    document.getElementById('status').innerHTML = "";
            }
        }
        if(progress.progress) {
            var progressBar = document.getElementById('progressbar').children[0];
            progressBar.style.width = progress.progress + '%';
        }
     },


    sync: function() {
        var url = "https://github.com/timkim/zipTest/archive/master.zip"; 
        var sync = ContentSync.sync({ src: url, id: 'myapps/myapp', type: 'replace', copyCordovaAssets: false, headers: false });
        
        var setProgress = this.setProgress; 

        sync.on('progress', function(progress) {
            console.log("Progress event", progress);
            app.setProgress(progress);
        });
        sync.on('complete', function(data) {
            console.log("Complete", data);
            //document.location = data.localPath + "/zipTest-master/index.html";
        });

        sync.on('error', function(e) {
            console.log("Something went wrong: ", e);
            document.getElementById('status').innerHTML = e;
        });
    },
    download: function() {
        document.getElementById("downloadExtractBtn").disabled = true;
        var url = "https://github.com/timkim/zipTest/archive/master.zip"; 
        var extract = this.extract;
        var setProgress = this.setProgress; 
        var callback = function(response) {
            console.log(response);
            if(response.progress) {
                app.setProgress(response);

            }
            if(response.archiveURL) {
                var archiveURL = response.archiveURL;
               document.getElementById("downloadExtractBtn").disabled = false;
               document.getElementById("downloadExtractBtn").innerHTML = "Extract";
               document.getElementById("downloadExtractBtn").onclick = function() {
                    app.extract(archiveURL);   
               };
               document.getElementById("status").innerHTML = archiveURL;
            }
        }; 
        ContentSync.download(url, callback);
    },
    extract: function(archiveURL) {
        window.requestFileSystem(PERSISTENT, 1024 * 1024, function(fs) {
            fs.root.getDirectory('zipOutPut', {create: true}, function(fileEntry) {
                var dirUrl = fileEntry.toURL();
                var callback = function(response) {
                    console.log(response);
                    document.getElementById("downloadExtractBtn").style.display = "none";
                    document.getElementById("status").innerHTML = "Extracted";
                }
                console.log(dirUrl, archiveURL);
                Zip.unzip(archiveURL, dirUrl, callback);
            });
        });
    }
};

app.initialize();
