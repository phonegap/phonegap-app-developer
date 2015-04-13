#phonegap-plugin-push [![Build Status][travis-ci-img]][travis-ci-url]

> Register and receive push notifications

_This plugin is a work in progress and it is not production ready._

## Installation

```
phonegap plugin add https://github.com/phonegap/phonegap-plugin-push
```

## Supported Platforms

- Android
- iOS
- WP8


## Quick Example

```
    var push = PushNotification.init({ "android": {"senderId": "12345679"},
    	 "ios": {}, "wp": {"channelName": "12345679"} } );

    push.on('registration', function(data) {
        // data.registrationId
    });

    push.on('notification', function(data) {
        // data.message,
        // data.title,
        // data.count,
        // data.sound,
        // data.additionalData
    });

    push.on('error', function(e) {
        // e.message
    });
```

## API

### PushNotification.init(options)

Parameter | Description
--------- | ------------
`options` | `JSON Object` platform specific initialization options.

#### Returns

- Instance of `PushNotification`.

#### Example

```javascript
    var push = PushNotification.init({ "android": {"senderId": "12345679"},
    	 "ios": {}, "wp": {"channelName": "12345679"} } );
```

### sync.on(event, callback)

Parameter | Description
--------- | ------------
`event` | `String` Name of the event to listen to. See below for all the event names.
`callback` | `Function` is called when the event is triggered.

### sync.on('registration', callback)

The event `registration` will be triggered on each successful registration with the 3rd party push service.

Callback Parameter | Description
------------------ | -----------
`data.registrationId` | `String` The registration ID provided by the 3rd party remote push service.

#### Example

```javascript
sync.on('registration', function(data) {
    // data.registrationId
});
```

### sync.on('notification', callback)

The event `notification` will be triggered each time a push notification is received by a 3rd party push service on the device.

Callback Parameter | Description
------------------ | -----------
`data.message` | `String` The text of the push message sent from the 3rd party service.
`data.title` | `String` The optional title of the push message sent from the 3rd party service.
`data.count` | `Integer` The number of messages to be displayed in the badge iOS or message count in the notification shade in Android.
`data.sound` | `String` The name of the sound file to be played upon receipt of the notification.
`data.additionalData` | `JSON Object` An optional collection of data sent by the 3rd party push service that does not fit in the above properties.

#### Example

```javascript    
    sync.on('notification', function(data) {
        // data.message,
        // data.title,
        // data.count,
        // data.sound,
        // data.additionalData
    });
```

### sync.on('error', callback)

The event `error` will trigger when an internal error occurs and the cache is aborted.

Callback Parameter | Description
------------------ | -----------
`e` | `Error` Standard JavaScript error object that describes the error.

#### Example

```javascript
sync.on('error', function(e) {
    // e.message
});
```
```

## Native Requirements

- There should be no dependency on any other plugins.
- All platforms should use the same API!

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
