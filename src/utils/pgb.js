/*global cordova*/
/*global PhonegapBuildOauth*/
/*global device*/

import fetch from 'isomorphic-fetch';
import semver from 'semver';

const apiHost = 'https://build.phonegap.com';
const persistLogin = false;

function simulateFetchApps() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fetch('assets/fakeapps.json')
      .then(response =>
        response.json().then((json) => {
          resolve(json.apps);
        })
      );
    }, 2000);
  });
}

function simulateLogin() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('AmandaHugnkiss');
    }, 2000);
  });
}

function getClientID() {
  return new Promise((resolve, reject) => {
    PhonegapBuildOauth.getClientID((id) => {
      resolve(id);
    });
  });
}

function getQueryString(url) {
  const a = url.slice((url.indexOf('?') + 1)).split('&');
  if (a === '') return {};
  const b = {};
  a.forEach((i) => {
    const p = i.split('=', 2);
    if (p.length === 1) {
      b[p[0]] = '';
    } else {
      b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, ' '));
    }
  });
  return b;
}

function showAuthWindow(clientID) {
  const authWindow = cordova.InAppBrowser.open(
    `${apiHost}/authorize?client_id=${clientID}`,
    '_blank',
    'clearcache=yes,location=no'
  );

  return new Promise((resolve, reject) => {
    authWindow.addEventListener('loadstart', (e) => {
      const url = e.url;
      if (url.match(/^(https?:\/\/)phonegap\.com\/?\?(code|error)=[a-zA-Z0-9_]*$/)) {
        console.log('Callback url found.');
        const qs = getQueryString(url);
        if (qs.code || qs.error) {
          authWindow.close();
          resolve(qs.code, qs.error);
        } else if (qs.error) {
          authWindow.close();
          reject(qs.error);
        }
      }
    });
  });
}

function handleAuth(authCode, err) {
  return new Promise((resolve, reject) => {
    if (authCode) {
      PhonegapBuildOauth.authorizeByCode(authCode, (a) => {
        window.localStorage.setItem('access_token', a.access_token);
        resolve(a.access_token);
      }, (a) => {
        console.log(`Authentication failure (${a.message})`);
        reject();
      });
    } else if (err) {
      console.log(`Authentication failure: ${err}`);
      reject();
    }
  });
}

export function fetchApps(accessToken) {
  if (typeof cordova === 'undefined' || cordova.platformId === 'browser') {
    return simulateFetchApps();
  }

  return (fetch(`${apiHost}/api/v1/apps?access_token=${accessToken}`)
  .then(response =>
    response.json().then(json => json.apps)
  ));
}

export function login() {
  if (typeof cordova === 'undefined' || cordova.platformId === 'browser') {
    return simulateLogin();
  }

  const accessToken = window.localStorage.getItem('access_token');
  if (persistLogin && accessToken) {
    return new Promise((resolve, reject) => {
      resolve(accessToken);
    });
  }

  return getClientID()
  .then(showAuthWindow)
  .then(handleAuth);
}

export function createSampleApp(accessToken) {
  const json = JSON.stringify({
    create_method: 'remote_repo',
    repo: 'https://github.com/phonegap/phonegap-app-star-track.git',
  });
  return (fetch(`${apiHost}/api/v1/apps?access_token=${accessToken}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `data=${json}`,
  }));
}

function checkPlugins(remotePlugins) {
  if (typeof remotePlugins === 'undefined') {
    return null;
  }

  const pluginList = [];
  const availablePlugins = cordova.require('cordova/plugin_list').metadata;

  remotePlugins.forEach((p) => {
    const remoteVersion = p.version.replace(/^~/, '');
    const localVersion = availablePlugins[p.name];

    const plugin = {
      id: p.name,
      remoteVersion,
      localVersion,
    };

    if (typeof localVersion === 'undefined') {
      plugin.state = 'missing';
    } else {
      try {
        plugin.state = semver.diff(remoteVersion, localVersion) || 'match';
      } catch (ex) {
        console.log(`Semver: ${ex.message}`);
        plugin.state = 'major';
      }
    }

    pluginList.push(plugin);
  });

  return pluginList;
}

export function checkPhonegapVersion(app) {
  const platform = device.platform.toLowerCase().replace('windows', 'winphone');
  const remoteVersion = app.phonegap_versions[platform];

  try {
    return semver.diff(remoteVersion, cordova.version) || 'match';
  } catch (ex) {
    console.log(`Semver: ${ex.message}`);
    return 'major';
  }
}

export function analyzePlugins(appID, accessToken) {
  return (fetch(`${apiHost}/api/v1/apps/${appID}/plugins?access_token=${accessToken}`)
  .then(response =>
    response.json().then(json => json.plugins)
  )
  .then(plugins =>
    checkPlugins(plugins)
  ));
}

