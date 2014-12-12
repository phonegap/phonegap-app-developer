# PhoneGap Developer App FAQ

### What is Autoreload?

Autoreload is a feature that will automatically refresh your previewed app
when a file changes in the `www/` directory. This allows you to immediately
preview your changes without four-finger tapping the devices screen. It's
especially useful when previewing multiple devices at the same time.

Autoreload is a developer feature that only works while connected to the
PhoneGap CLI. If the CLI server stops, then autoreload will stop working.

By default, autoreload is enabled. However, you can force it to be enabled
or disabled with the following commands:

```
$ phonegap serve --autoreload
$ phonegap serve --no-autoreload
```

[See discussion details.](https://github.com/phonegap/phonegap-app-developer/issues/246#issuecomment-66759619)
