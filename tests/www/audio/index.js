var defaultaudio = "http://cordova.apache.org/downloads/BlueZedEx.mp3";
var deviceReady = false;

//-------------------------------------------------------------------------
// Audio player
//-------------------------------------------------------------------------
var media1 = null;
var media1Timer = null;
var audioSrc = null;
var recordSrc = "myRecording.mp3";

/**
 * Play audio
 */
function playAudio(url) {
    console.log("playAudio()");
    console.log(" -- media="+media1);

  var src = defaultaudio;
    
    if (url) {
        src = url;
    }

    // Stop playing if src is different from currently playing source
    if (src != audioSrc) {
        if (media1 != null) {
            stopAudio();
            media1 = null;
        }
    }

    if (media1 == null) {


        // TEST STREAMING AUDIO PLAYBACK
        //var src = "http://nunzioweb.com/misc/Bon_Jovi-Crush_Mystery_Train.mp3";   // works
        //var src = "http://nunzioweb.com/misc/Bon_Jovi-Crush_Mystery_Train.m3u"; // doesn't work
        //var src = "http://www.wav-sounds.com/cartoon/bugsbunny1.wav"; // works
        //var src = "http://www.angelfire.com/fl5/html-tutorial/a/couldyou.mid"; // doesn't work
        //var src = "MusicSearch/mp3/train.mp3";    // works
        //var src = "bryce.mp3";  // works
        //var src = "/android_asset/www/bryce.mp3"; // works

        media1 = new Media(src,
            function() {
                console.log("playAudio():Audio Success");
            },
            function(err) {
                console.log("playAudio():Audio Error: "+err.code);
                setAudioStatus("Error: " + err.code);
            },
            function(status) {
                console.log("playAudio():Audio Status: "+status);
                setAudioStatus(Media.MEDIA_MSG[status]);

                // If stopped, then stop getting current position
                if (Media.MEDIA_STOPPED == status) {
                    clearInterval(media1Timer);
                    media1Timer = null;
                    setAudioPosition("0 sec");
                }
            });
    }
    audioSrc = src;
    document.getElementById('audio_duration').innerHTML = "";
    // Play audio
    media1.play();
    if (media1Timer == null && media1.getCurrentPosition) {
        media1Timer = setInterval(
            function() {
                media1.getCurrentPosition(
                    function(position) {
                        console.log("Pos="+position);
                        if (position >= 0.0) {
                            setAudioPosition(position+" sec");
                        }
                    },
                    function(e) {
                        console.log("Error getting pos="+e);
                        setAudioPosition("Error: "+e);
                    }
                );
            },
            1000
        );
    }

    // Get duration
    var counter = 0;
    var timerDur = setInterval(
        function() {
            counter = counter + 100;
            if (counter > 2000) {
                clearInterval(timerDur);
            }
            var dur = media1.getDuration();
            if (dur > 0) {
                clearInterval(timerDur);
                document.getElementById('audio_duration').innerHTML = dur + " sec";
            }
        }, 100);
}

/**
 * Pause audio playback
 */
function pauseAudio() {
    console.log("pauseAudio()");
    if (media1) {
        media1.pause();
    }
}

/**
 * Stop audio
 */
function stopAudio() {
    console.log("stopAudio()");
    if (media1) {
        media1.stop();
    }
    clearInterval(media1Timer);
    media1Timer = null;
}

/**
 * Release audio
 */
function releaseAudio() {
  console.log("releaseAudio()");
  if (media1) {
  	media1.stop(); //imlied stop of playback, resets timer
  	media1.release();
  }
}


/**
 * Set audio status
 */
function setAudioStatus(status) {
    document.getElementById('audio_status').innerHTML = status;
};

/**
 * Set audio position
 */
function setAudioPosition(position) {
    document.getElementById('audio_position').innerHTML = position;
};

//-------------------------------------------------------------------------
// Audio recorder
//-------------------------------------------------------------------------
var mediaRec = null;
var recTime = 0;

/**
 * Record audio
 */
function recordAudio() {
    console.log("recordAudio()");
    console.log(" -- media="+mediaRec);
    if (mediaRec == null) {

        var src = recordSrc;
        mediaRec = new Media(src,
                function() {
                    console.log("recordAudio():Audio Success");
                },
                function(err) {
                    console.log("recordAudio():Audio Error: "+err.code);
                    setAudioStatus("Error: " + err.code);
                },
                function(status) {
                    console.log("recordAudio():Audio Status: "+status);
                    setAudioStatus(Media.MEDIA_MSG[status]);
                }
            );
    }

    navigator.notification.beep(1);

    // Record audio
    mediaRec.startRecord();

    // Stop recording after 10 sec
    recTime = 0;
    var recInterval = setInterval(function() {
        recTime = recTime + 1;
        setAudioPosition(recTime+" sec");
        if (recTime >= 10) {
            clearInterval(recInterval);
            if (mediaRec.stopAudioRecord){
                mediaRec.stopAudioRecord();
            } else {
                mediaRec.stopRecord();
            }
            console.log("recordAudio(): stop");
            navigator.notification.beep(1);
        }
    }, 1000);
}

/**
 * Play back recorded audio
 */
function playRecording() {
    playAudio(recordSrc);
}

/**
 * Function to create a file for iOS recording
 */
function getRecordSrc() {
    var fsFail = function(error) {
        console.log("error creating file for iOS recording");
    };
    var gotFile = function(file) {
        recordSrc = file.fullPath;
        //console.log("recording Src: " + recordSrc);
    };
    var gotFS = function(fileSystem) {
        fileSystem.root.getFile("iOSRecording.wav", {create: true}, gotFile, fsFail);
    };
    window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, gotFS, fsFail);
}

/**
 * Function to create a file for BB recording
 */
function getRecordSrcBB() {
    var fsFail = function(error) {
        console.log("error creating file for BB recording");
    };
    var gotFile = function(file) {
        recordSrc = file.fullPath;
    };
    var gotFS = function(fileSystem) {
        fileSystem.root.getFile("BBRecording.amr", {create: true}, gotFile, fsFail);
    };
    window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, gotFS, fsFail);
}

/**
 * Function called when page has finished loading.
 */
function init() {
    document.addEventListener("deviceready", function() {
            deviceReady = true;
            if (device.platform.indexOf("iOS") !=-1)
            {
                 getRecordSrc();
            } else if (typeof blackberry !== 'undefined') {
                getRecordSrcBB();
            }
            console.log("Device="+device.platform+" "+device.version);
        }, false);
    window.setTimeout(function() {
    	if (!deviceReady) {
    		alert("Error: Apache Cordova did not initialize.  Demo will not run correctly.");
    	}
    },1000);
}

/**
 * for forced updates of position after a successful seek
 */
function updatePosition() {
    media1.getCurrentPosition(
        function(position) {
            console.log("Pos="+position);
            if (position >= 0.0) {
                setAudioPosition(position+" sec");
            }
        },
        function(e) {
            console.log("Error getting pos="+e);
            setAudioPosition("Error: "+e);
        });
}

/**
 *
 */
function seekAudio(mode) {
    var time = document.getElementById("seekinput").value;
    if (time == "") {
        time = 5000;
    } else {
        time = time * 1000; //we expect the input to be in seconds
    }
    if (media1 == null) {
        console.log("seekTo requested while media1 is null");
        if (audioSrc == null) {
            audioSrc = defaultaudio;
        }
        media1 = new Media(audioSrc,
            function() {
                console.log("seekToAudio():Audio Success");
            },
            function(err) {
                console.log("seekAudio():Audio Error: "+err.code);
                setAudioStatus("Error: " + err.code);
            },
            function(status) {
                console.log("seekAudio():Audio Status: "+status);
                setAudioStatus(Media.MEDIA_MSG[status]);

                // If stopped, then stop getting current position
                if (Media.MEDIA_STOPPED == status) {
                    clearInterval(media1Timer);
                    media1Timer = null;
                    setAudioPosition("0 sec");
                }
            });
    }
    
    media1.getCurrentPosition(
        function (position) {
            var deltat = time;
            if (mode == "by") {
                deltat = time + position * 1000;   
            }
            media1.seekTo(deltat,
                function () {
                    console.log("seekAudioTo():Audio Success");
                    //force an update on the position display
                    updatePosition();
                },
                function (err) {
                    console.log("seekAudioTo():Audio Error: " + err.code);
                });
        },
        function(e) {
            console.log("Error getting pos="+e);
            setAudioPosition("Error: "+e);
        });
}

window.onload = function() {
  addListenerToClass('playAudio', function () {
    playAudio();
  });
  addListenerToClass('pauseAudio', pauseAudio);
  addListenerToClass('stopAudio', stopAudio);
  addListenerToClass('releaseAudio', releaseAudio);
  addListenerToClass('seekAudioBy', seekAudio, 'by');
  addListenerToClass('seekAudioTo', seekAudio, 'to');
  addListenerToClass('recordAudio', recordAudio);
  addListenerToClass('playRecording', playRecording);

  addListenerToClass('backBtn', backHome);
  init();
}
