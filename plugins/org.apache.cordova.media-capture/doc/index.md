<!---
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
-->

# org.apache.cordova.media-capture

This plugin provides access to the device's audio, image, and video capture capabilities.

__WARNING__: Collection and use of images, video, or
audio from the device's camera or microphone raises important privacy
issues.  Your app's privacy policy should discuss how the app uses
such sensors and whether the data recorded is shared with any other
parties.  In addition, if the app's use of the camera or microphone is
not apparent in the user interface, you should provide a just-in-time
notice before the app accesses the camera or microphone (if the
device operating system doesn't do so already). That notice should
provide the same information noted above, as well as obtaining the
user's permission (e.g., by presenting choices for __OK__ and __No
Thanks__).  Note that some app marketplaces may require your app to
provide just-in-time notice and obtain permission from the user prior
to accessing the camera or microphone.  For more information, please
see the Privacy Guide.

## Installation

    cordova plugin add org.apache.cordova.media-capture

## Supported Platforms

- Amazon Fire OS
- Android
- BlackBerry 10
- iOS
- Windows Phone 7 and 8
- Windows 8

## Objects

- Capture
- CaptureAudioOptions
- CaptureImageOptions
- CaptureVideoOptions
- CaptureCallback
- CaptureErrorCB
- ConfigurationData
- MediaFile
- MediaFileData

## Methods

- capture.captureAudio
- capture.captureImage
- capture.captureVideo
- MediaFile.getFormatData

## Properties

- __supportedAudioModes__: The audio recording formats supported by the device. (ConfigurationData[])

- __supportedImageModes__: The recording image sizes and formats supported by the device. (ConfigurationData[])

- __supportedVideoModes__: The recording video resolutions and formats supported by the device. (ConfigurationData[])

## capture.captureAudio

> Start the audio recorder application and return information about captured audio clip files.

    navigator.device.capture.captureAudio(
        CaptureCB captureSuccess, CaptureErrorCB captureError,  [CaptureAudioOptions options]
    );

### Description

Starts an asynchronous operation to capture audio recordings using the
device's default audio recording application.  The operation allows
the device user to capture multiple recordings in a single session.

The capture operation ends when either the user exits the audio
recording application, or the maximum number of recordings specified
by `CaptureAudioOptions.limit` is reached.  If no `limit` parameter
value is specified, it defaults to one (1), and the capture operation
terminates after the user records a single audio clip.

When the capture operation finishes, the `CaptureCallback` executes
with an array of `MediaFile` objects describing each captured audio
clip file.  If the user terminates the operation before an audio clip
is captured, the `CaptureErrorCallback` executes with a `CaptureError`
object, featuring the `CaptureError.CAPTURE_NO_MEDIA_FILES` error
code.

### Supported Platforms

- Amazon Fire OS
- Android
- BlackBerry 10
- iOS
- Windows Phone 7 and 8
- Windows 8

### Example

    // capture callback
    var captureSuccess = function(mediaFiles) {
        var i, path, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            path = mediaFiles[i].fullPath;
            // do something interesting with the file
        }
    };

    // capture error callback
    var captureError = function(error) {
        navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
    };

    // start audio capture
    navigator.device.capture.captureAudio(captureSuccess, captureError, {limit:2});


### BlackBerry 10 Quirks

- Cordova for BlackBerry 10 attempts to launch the __Voice Notes Recorder__ application, provided by RIM, to capture audio recordings. The app receives a `CaptureError.CAPTURE_NOT_SUPPORTED` error code if the application is not installed on the device.

### iOS Quirks

- iOS does not have a default audio recording application, so a simple user interface is provided.

### Windows Phone 7 and 8 Quirks

- Windows Phone 7 does not have a default audio recording application, so a simple user interface is provided.

## CaptureAudioOptions

> Encapsulates audio capture configuration options.

### Properties

- __limit__: The maximum number of audio clips the device user can record in a single capture operation.  The value must be greater than or equal to 1 (defaults to 1).

- __duration__: The maximum duration of an audio sound clip, in seconds.

### Example

    // limit capture operation to 3 media files, no longer than 10 seconds each
    var options = { limit: 3, duration: 10 };

    navigator.device.capture.captureAudio(captureSuccess, captureError, options);

### Amazon Fire OS Quirks

- The `duration` parameter is not supported.  Recording lengths cannot be limited programmatically.

### Android Quirks

- The `duration` parameter is not supported.  Recording lengths can't be limited programmatically.

### BlackBerry 10 Quirks

- The `duration` parameter is not supported.  Recording lengths can't be limited programmatically.

### iOS Quirks

- The `limit` parameter is not supported, so only one recording can be created for each invocation.

## capture.captureImage

> Start the camera application and return information about captured image files.

    navigator.device.capture.captureImage(
        CaptureCB captureSuccess, CaptureErrorCB captureError, [CaptureImageOptions options]
    );

### Description

Starts an asynchronous operation to capture images using the device's
camera application.  The operation allows users to capture more than
one image in a single session.

The capture operation ends either when the user closes the camera
application, or the maximum number of recordings specified by
`CaptureAudioOptions.limit` is reached.  If no `limit` value is
specified, it defaults to one (1), and the capture operation
terminates after the user captures a single image.

When the capture operation finishes, it invokes the `CaptureCB`
callback with an array of `MediaFile` objects describing each captured
image file.  If the user terminates the operation before capturing an
image, the `CaptureErrorCB` callback executes with a `CaptureError`
object featuring a `CaptureError.CAPTURE_NO_MEDIA_FILES` error code.

### Supported Platforms

- Amazon Fire OS
- Android
- BlackBerry 10
- iOS
- Windows Phone 7 and 8
- Windows 8

### Windows Phone 7 Quirks

Invoking the native camera application while your device is connected
via Zune does not work, and the error callback executes.

### Example

    // capture callback
    var captureSuccess = function(mediaFiles) {
        var i, path, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            path = mediaFiles[i].fullPath;
            // do something interesting with the file
        }
    };

    // capture error callback
    var captureError = function(error) {
        navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
    };

    // start image capture
    navigator.device.capture.captureImage(captureSuccess, captureError, {limit:2});



## CaptureImageOptions

> Encapsulates image capture configuration options.

### Properties

- __limit__: The maximum number of images the user can capture in a single capture operation. The value must be greater than or equal to 1 (defaults to 1).

### Example

    // limit capture operation to 3 images
    var options = { limit: 3 };

    navigator.device.capture.captureImage(captureSuccess, captureError, options);

### iOS Quirks

- The __limit__ parameter is not supported, and only one image is taken per invocation.

## capture.captureVideo

> Start the video recorder application and return information about captured video clip files.

    navigator.device.capture.captureVideo(
        CaptureCB captureSuccess, CaptureErrorCB captureError, [CaptureVideoOptions options]
    );

### Description

Starts an asynchronous operation to capture video recordings using the
device's video recording application.  The operation allows the user
to capture more than one recordings in a single session.

The capture operation ends when either the user exits the video
recording application, or the maximum number of recordings specified
by `CaptureVideoOptions.limit` is reached.  If no `limit` parameter
value is specified, it defaults to one (1), and the capture operation
terminates after the user records a single video clip.

When the capture operation finishes, it the `CaptureCB` callback
executes with an array of `MediaFile` objects describing each captured
video clip file.  If the user terminates the operation before
capturing a video clip, the `CaptureErrorCB` callback executes with a
`CaptureError` object featuring a
`CaptureError.CAPTURE_NO_MEDIA_FILES` error code.

### Supported Platforms

- Amazon Fire OS
- Android
- BlackBerry 10
- iOS
- Windows Phone 7 and 8
- Windows 8

### Example

    // capture callback
    var captureSuccess = function(mediaFiles) {
        var i, path, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            path = mediaFiles[i].fullPath;
            // do something interesting with the file
        }
    };

    // capture error callback
    var captureError = function(error) {
        navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
    };

    // start video capture
    navigator.device.capture.captureVideo(captureSuccess, captureError, {limit:2});


### BlackBerry 10 Quirks

- Cordova for BlackBerry 10 attempts to launch the __Video Recorder__ application, provided by RIM, to capture video recordings. The app receives a `CaptureError.CAPTURE_NOT_SUPPORTED` error code if the application is not installed on the device.


## CaptureVideoOptions

> Encapsulates video capture configuration options.

### Properties

- __limit__: The maximum number of video clips the device's user can capture in a single capture operation.  The value must be greater than or equal to 1 (defaults to 1).

- __duration__: The maximum duration of a video clip, in seconds.

### Example

    // limit capture operation to 3 video clips
    var options = { limit: 3 };

    navigator.device.capture.captureVideo(captureSuccess, captureError, options);

### BlackBerry 10 Quirks

- The __duration__ parameter is not supported, so the length of recordings can't be limited programmatically.

### iOS Quirks

- The __limit__ parameter is not supported.  Only one video is recorded per invocation.


## CaptureCB

> Invoked upon a successful media capture operation.

    function captureSuccess( MediaFile[] mediaFiles ) { ... };

### Description

This function executes after a successful capture operation completes.
At this point a media file has been captured, and either the user has
exited the media capture application, or the capture limit has been
reached.

Each `MediaFile` object describes a captured media file.

### Example

    // capture callback
    function captureSuccess(mediaFiles) {
        var i, path, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            path = mediaFiles[i].fullPath;
            // do something interesting with the file
        }
    };

## CaptureError

> Encapsulates the error code resulting from a failed media capture operation.

### Properties

- __code__: One of the pre-defined error codes listed below.

### Constants

- `CaptureError.CAPTURE_INTERNAL_ERR`: The camera or microphone failed to capture image or sound.

- `CaptureError.CAPTURE_APPLICATION_BUSY`: The camera or audio capture application is currently serving another capture request.

- `CaptureError.CAPTURE_INVALID_ARGUMENT`: Invalid use of the API (e.g., the value of `limit` is less than one).

- `CaptureError.CAPTURE_NO_MEDIA_FILES`: The user exits the camera or audio capture application before capturing anything.

- `CaptureError.CAPTURE_NOT_SUPPORTED`: The requested capture operation is not supported.

## CaptureErrorCB

> Invoked if an error occurs during a media capture operation.

    function captureError( CaptureError error ) { ... };

### Description

This function executes if an error occurs when trying to launch a
media capture operation. Failure scenarios include when the capture
application is busy, a capture operation is already taking place, or
the user cancels the operation before any media files are captured.

This function executes with a `CaptureError` object containing an
appropriate error `code`.

### Example

    // capture error callback
    var captureError = function(error) {
        navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
    };

## ConfigurationData

> Encapsulates a set of media capture parameters that a device supports.

### Description

Describes media capture modes supported by the device.  The
configuration data includes the MIME type, and capture dimensions for
video or image capture.

The MIME types should adhere to [RFC2046](http://www.ietf.org/rfc/rfc2046.txt).  Examples:

- `video/3gpp`
- `video/quicktime`
- `image/jpeg`
- `audio/amr`
- `audio/wav`

### Properties

- __type__: The ASCII-encoded lowercase string representing the media type. (DOMString)

- __height__: The height of the image or video in pixels.  The value is zero for sound clips. (Number)

- __width__: The width of the image or video in pixels.  The value is zero for sound clips. (Number)

### Example

    // retrieve supported image modes
    var imageModes = navigator.device.capture.supportedImageModes;

    // Select mode that has the highest horizontal resolution
    var width = 0;
    var selectedmode;
    for each (var mode in imageModes) {
        if (mode.width > width) {
            width = mode.width;
            selectedmode = mode;
        }
    }

Not supported by any platform.  All configuration data arrays are empty.

## MediaFile.getFormatData

> Retrieves format information about the media capture file.

    mediaFile.getFormatData(
        MediaFileDataSuccessCB successCallback,
        [MediaFileDataErrorCB errorCallback]
    );

### Description

This function asynchronously attempts to retrieve the format
information for the media file.  If successful, it invokes the
`MediaFileDataSuccessCB` callback with a `MediaFileData` object.  If
the attempt fails, this function invokes the `MediaFileDataErrorCB`
callback.

### Supported Platforms

- Amazon Fire OS
- Android
- BlackBerry 10
- iOS
- Windows Phone 7 and 8
- Windows 8

### Amazon Fire OS Quirks

The API to access media file format information is limited, so not all
`MediaFileData` properties are supported.

### BlackBerry 10 Quirks

Does not provide an API for information about media files, so all
`MediaFileData` objects return with default values.

### Android Quirks

The API to access media file format information is limited, so not all
`MediaFileData` properties are supported.

### iOS Quirks

The API to access media file format information is limited, so not all
`MediaFileData` properties are supported.

## MediaFile

> Encapsulates properties of a media capture file.

### Properties

- __name__: The name of the file, without path information. (DOMString)

- __fullPath__: The full path of the file, including the name. (DOMString)

- __type__: The file's mime type (DOMString)

- __lastModifiedDate__: The date and time when the file was last modified. (Date)

- __size__: The size of the file, in bytes. (Number)

### Methods

- __MediaFile.getFormatData__: Retrieves the format information of the media file.

## MediaFileData

> Encapsulates format information about a media file.

### Properties

- __codecs__: The actual format of the audio and video content. (DOMString)

- __bitrate__: The average bitrate of the content.  The value is zero for images. (Number)

- __height__: The height of the image or video in pixels. The value is zero for audio clips. (Number)

- __width__: The width of the image or video in pixels. The value is zero for audio clips. (Number)

- __duration__: The length of the video or sound clip in seconds. The value is zero for images. (Number)

### BlackBerry 10 Quirks

No API provides format information for media files, so the
`MediaFileData` object returned by `MediaFile.getFormatData` features
the following default values:

- __codecs__: Not supported, and returns `null`.

- __bitrate__: Not supported, and returns zero.

- __height__: Not supported, and returns zero.

- __width__: Not supported, and returns zero.

- __duration__: Not supported, and returns zero.

### Amazon Fire OS Quirks

Supports the following `MediaFileData` properties:

- __codecs__: Not supported, and returns `null`.

- __bitrate__: Not supported, and returns zero.

- __height__: Supported: image and video files only.

- __width__: Supported: image and video files only.

- __duration__: Supported: audio and video files only

### Android Quirks

Supports the following `MediaFileData` properties:

- __codecs__: Not supported, and returns `null`.

- __bitrate__: Not supported, and returns zero.

- __height__: Supported: image and video files only.

- __width__: Supported: image and video files only.

- __duration__: Supported: audio and video files only.

### iOS Quirks

Supports the following `MediaFileData` properties:

- __codecs__: Not supported, and returns `null`.

- __bitrate__: Supported on iOS4 devices for audio only. Returns zero for images and videos.

- __height__: Supported: image and video files only.

- __width__: Supported: image and video files only.

- __duration__: Supported: audio and video files only.
