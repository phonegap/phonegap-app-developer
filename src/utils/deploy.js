/* eslint no-param-reassign:0 */

const readFile = (filepath, callback) => {
  window.requestFileSystem(
    window.LocalFileSystem.PERSISTENT,
    0,
    (fileSystem) => {
      fileSystem.root.getFile(
        filepath,
        null,
        (fileEntry) => {
          fileEntry.file(
            (file) => {
              const reader = new FileReader();
              reader.onloadend = (evt) => {
                // #72 - Fix WP8 loading of config.json
                // On WP8, `evt.target.result` is returned as an object instead
                // of a string. Since WP8 is using a newer version of the File API
                // this may be a platform quirk or an API update.
                let text = evt.target.result;
                text = (typeof text === 'object') ? JSON.stringify(text) : text;
                callback(null, text); // text is a string
              };
              reader.readAsText(file);
            },
            error => callback(error)
          );
        },
        error => callback(error)
      );
    },
    error => callback(error)
  );
};

const saveFile = (filepath, data, callback) => {
  data = (typeof data === 'string') ? data : JSON.stringify(data);

  window.requestFileSystem(
    window.LocalFileSystem.PERSISTENT,
    0,
    (fileSystem) => {
      fileSystem.root.getFile(
        filepath,
        { create: true, exclusive: false },
        (fileEntry) => {
          fileEntry.createWriter(
            (writer) => {
              writer.onwriteend = () => {
                callback();
              };
              writer.write(data);
            },
            error => callback(error)
          );
        },
        error => callback(error)
      );
    },
    error => callback(error)
  );
};

const parseAsJSON = (text) => {
  try {
    return JSON.parse(text);
  } catch (e) {
    return {};
  }
};

export const load = (callback) => {
  if (typeof cordova === 'undefined') {
    // use localStorage fallback
    const config = parseAsJSON(localStorage.getItem('config.json') || '{}');

    // load defaults
    config.address = config.address || '127.0.0.1:3000';
    config.optIn = config.optIn || false;
    callback(config);
  } else {
    readFile('config.json', (e, text) => {
      const config = parseAsJSON(text);

      // load defaults
      config.address = config.address || '127.0.0.1:3000';
      config.optIn = config.optIn || false;
      callback(config);
    });
  }
};

export const save = (data, callback) => {
  console.log(data);
  if (typeof cordova === 'undefined') {
    // use localStorage fallback
    localStorage.setItem('config.json', data);
    callback();
  } else {
    saveFile('config.json', data, () => {
      callback();
    });
  }
};

export const downloadZip = (options) => {
  let uri;
  let sync;
  const theHeaders = null;
  if (typeof cordova === 'undefined') {
    console.log('window.ContentSync not found');
  } else {
    if (options.update === true) {
      uri = encodeURI(`${options.address}/__api__/update`);
      sync = window.ContentSync.sync({
        src: uri,
        id: 'phonegapdevapp',
        type: 'merge',
        copyCordovaAssets: false,
        headers: theHeaders,
      });
      sync.on('complete', () => {
        window.location.reload();
      });
    } else {
      uri = encodeURI(`${options.address}/__api__/appzip`);
      console.log(uri);
      sync = window.ContentSync.sync({
        src: uri,
        id: 'phonegapdevapp',
        type: 'replace',
        copyCordovaAssets: true,
        headers: theHeaders,
      });
      sync.on('complete', (data) => {
        window.location.href = `${data.localPath}/www/index.html`;
      });
    }

    sync.on('progress', (data) => {
      if (options.onProgress) {
        options.onProgress(data);
      }
    });

    sync.on('error', (e) => {
      if (options.onDownloadError) {
        setTimeout(() => {
          options.onDownloadError(e);
        }, 10);
      }
      console.log(`download error ${e}`);
    });

    document.addEventListener('cancelSync', () => {
      sync.cancel();
    });

    sync.on('cancel', (e) => {
      if (options.onCancel) {
        setTimeout(() => {
          options.onCancel(e);
        }, 10);
      }
      console.log('download cancelled by user');
    });
  }
};

export const scanQRCode = (success, error) => {
  window.cordova.plugins.barcodeScanner.scan(
  success,
  error,
    {
      preferFrontCamera: false,
      showFlipCameraButton: true,
      prompt: 'Place QR code for server address in the scan area',
      formats: 'QR_CODE,PDF_417',
    }
  );
};

export const cleanAddress = (address) => {
  // default to http:// when no protocol exists
  address = (address.match(/^(.*:\/\/)/)) ? address : `http://${address}`;
  return address;
};
