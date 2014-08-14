zip
===================

A Cordova plugin to unzip files in Android and iOS.

##Installation

    cordova plugin add https://github.com/MobileChromeApps/zip.git

##Usage

    zip.unzip(<source zip>, <destination dir>, <callback>, [<progressCallback>]);

Both source and destination arguments can be URLs obtained from the HTML File
interface or absolute paths to files on the device.

The callback argument will be executed when the unzip is complete, or when an
error occurs. It will be called with a single argument, which will be 0 on
success, or -1 on failure.

The progressCallback argument is optional and will be executed whenever a new ZipEntry
has been extracted. E.g.:

    var progressCallback = function(progressEvent) {
        $( "#progressbar" ).progressbar("value", Math.round((progressEvent.loaded / progressEvent.total) * 100));
    };

The values `loaded` and `total` are the number of compressed bytes processed and total. Total is the
file size of the zip file.

## Release Notes

### 2.1.0 (May 1, 2014)
* Added progress events
* Fix iOS path handling when given file: URLs as src/target
