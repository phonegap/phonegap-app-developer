#phonegap-plugin-contentsync [![Build Status](https://travis-ci.org/phonegap/phonegap-plugin-contentsync.svg?branch=master)](https://travis-ci.org/phonegap/phonegap-plugin-contentsync) [![bitHound Score][bithound-img]][bithound-url]

> Download and cache remotely hosted content.

## Installation

This requires phonegap 5.0+ ( current stable v1.0.0 )

```
phonegap plugin add phonegap-plugin-contentsync
```

It is also possible to install via repo url directly ( unstable )

```
phonegap plugin add https://github.com/phonegap/phonegap-plugin-contentsync
```

## Supported Platforms

- Android
- iOS
- WP8


## Quick Example

```javascript
var sync = ContentSync.sync({ src: 'http://myserver/assets/movie-1', id: 'movie-1' });

sync.on('progress', function(data) {
    // data.progress
});

sync.on('complete', function(data) {
    // data.localPath
});

sync.on('error', function(e) {
    // e
});

sync.on('cancel', function() {
    // triggered if event is cancelled
});
```

## API

### ContentSync.sync(options)

Parameter | Description
--------- | ------------
`options.src` | `String` URL to the remotely hosted content.
`options.id` | `String` Unique identifer to reference the cached content.
`options.type` | `String` _(Optional)_ Defines the copy strategy for the cached content.<br/>The type `replace` is the default behaviour that deletes the old content and caches the new content.<br/> The type `merge` will add the new content to the existing content. This will replace existing files, add new files, but never delete files.<br/>The type `local` returns the full path to the cached content if it exists or downloads it from `options.src` if it doesn't. `options.src` is not required if cached content actually exists.
`options.headers` | `Object` _(Optional)_ Set of headers to use when requesting the remote content from `options.src`.
`options.copyCordovaAssets` | `Boolean` _(Optional)_ Copies `cordova.js`, `cordova_plugins.js` and `plugins/` to sync'd folder. This operation happens after the source content has been cached, so it will override any existing Cordova assets. Default is `false`.

#### Returns

- Instance of `ContentSync`.

#### Example

```javascript
var sync = ContentSync.sync({ src: 'http://myserver/app/1', id: 'app-1' });
```

### sync.on(event, callback)

Parameter | Description
--------- | ------------
`event` | `String` Name of the event to listen to. See below for all the event names.
`callback` | `Function` is called when the event is triggered.

### sync.on('progress', callback)

The event `progress` will be triggered on each update as the native platform downloads and caches the content.

Callback Parameter | Description
------------------ | -----------
`data.progress` | `Integer` Progress percentage between `0 - 100`. The progress includes all actions required to cache the remote content locally. This is different on each platform, but often includes requesting, downloading, and extracting the cached content along with any system cleanup tasks.
`data.status` | `Integer` Enumeration of `PROGRESS_STATE` to describe the current progress state.

#### Example

```javascript
sync.on('progress', function(data) {
    // data.progress
    // data.status
});
```

### sync.on('complete', callback)

The event `complete` will be triggered when the content has been successfully cached onto the device.

Callback Parameter | Description
------------------ | -----------
`data.localPath` | `String` The file path to the cached content. The file path will be different on each platform and may be relative or absolute. However, it is guaraneteed to be a compatible reference in the browser.
`data.cached` | `Boolean` Set to `true` if options.type is set to `local` and cached content exists. Set to `false` otherwise.

#### Example

```javascript
sync.on('complete', function(data) {
    // data.localPath
    // data.cached
});
```

### sync.on('error', callback)

The event `error` will trigger when an internal error occurs and the cache is aborted.

Callback Parameter | Description
------------------ | -----------
`e` | `Integer` Enumeration of `ERROR_STATE` to describe the current error 

#### Example

```javascript
sync.on('error', function(e) {
    // e
});
```

### sync.on('cancel', callback)

The event `cancel` will trigger when `sync.cancel` is called.

Callback Parameter | Description
------------------ | -----------
`no parameters` |

#### Example

```javascript
sync.on('cancel', function() {
    // user cancelled the sync operation
});
```

### sync.cancel()

Cancels the content sync operation and triggers the cancel callback.

```javascript
var sync = ContentSync.sync({ src: 'http://myserver/app/1', id: 'app-1' });

sync.on('cancel', function() {
    console.log('content sync was cancelled');
});

sync.cancel();
```

### ContentSync.PROGRESS_STATE

An enumeration that describes the current progress state. The mapped `String`
values can be customized for the user's app.

Integer | Description
------- | -----------
`0`     | `STOPPED`
`1`     | `DOWNLOADING`
`2`     | `EXTRACTING`
`3`     | `COMPLETE`

### ContentSync.ERROR_STATE

An enumeration that describes the received error. The mapped `String`
values can be customized for the user's app.

Error Code | Description
------------------ | -----------
`1` | `INVALID_URL_ERR`
`2` | `CONNECTION_ERR`
`3` | `UNZIP_ERR`

### ContentSync.unzip || Zip.unzip - ContentSync.download

If you are using the [Chromium Zip plugin](https://github.com/MobileChromeApps/zip) this plugin won't work for you on iOS. However, it supports the same interface so you don't have to install both.

```javascript

zip.unzip(<source zip>, <destination dir>, <callback>, [<progressCallback>]);

```

There is also an extra convenience method that can be used to download an archive

```javascript

ContentSync.download(url, headers, cb)

```

The progress events described above also apply for these methods.

#### Example

```javascript
ContentSync.PROGRESS_STATE[1] = 'Downloading the media content...';
```

## Native Requirements

- There should be no dependency on the existing File or FileTransfer plugins.
- The native cached file path should be uniquely identifiable with the `id` parameter. This will allow the Content Sync plugin to lookup the file path at a later time using the `id` parameter.
- The first version of the plugin assumes that all cached content is downloaded as a compressed ZIP. The native implementation must properly extract content and clean up any temporary files, such as the downloaded zip.
- The locally compiled Cordova web assets should be copied to the cached content. This includes `cordova.js`, `cordova_plugins.js`, and `plugins/**/*`.
- Multiple syncs should be supported at the same time.

## Running Tests

```
npm test
```

## Contributing

### Editor Config

The project uses [.editorconfig](http://editorconfig.org/) to define the coding
style of each file. We recommend that you install the Editor Config extension
for your preferred IDE.

### JSHint

The project uses [.jshint](http://jshint.com/docs) to define the JavaScript
coding conventions. Most editors now have a JSHint add-on to provide on-save
or on-edit linting.

#### Install JSHint for vim

1. Install [jshint](https://www.npmjs.com/package/jshint).
1. Install [jshint.vim](https://github.com/wookiehangover/jshint.vim).

#### Install JSHint for Sublime

1. Install [Package Control](https://packagecontrol.io/installation)
1. Restart Sublime
1. Type `CMD+SHIFT+P`
1. Type _Install Package_
1. Type _JSHint Gutter_
1. Sublime -> Preferences -> Package Settings -> JSHint Gutter
1. Set `lint_on_load` and `lint_on_save` to `true`

[travis-ci-img]: https://travis-ci.org/phonegap/phonegap-plugin-contentsync.svg?branch=master
[travis-ci-url]: http://travis-ci.org/phonegap/phonegap-plugin-contentsync
[bithound-img]: https://www.bithound.io/github/phonegap/phonegap-plugin-contentsync/badges/score.svg
[bithound-url]: https://www.bithound.io/github/phonegap/phonegap-plugin-contentsync

