/*global cordova*/
/*global PhonegapBuildOauth*/

import fetch from 'isomorphic-fetch';

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

// stub for in browser dev
function simulateLogin() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('1234');
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
    `https://build.phonegap.com/authorize?client_id=${clientID}`,
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
        resolve(a.access_token);
      }, (a) => {
        console.log(`Auth failure: ${a.message}`);
        alert('Login failed', 'Error');
        reject();
      });
    } else if (err) {
      console.log(`Auth failure: ${err}`);
      alert('Login failed', 'Error');
      reject();
    }
  });
}

export function fetchApps(accessToken) {
  if (typeof cordova === 'undefined' || cordova.platformId === 'browser') {
    return simulateFetchApps();
  }

  return (fetch(`https://build.phonegap.com/api/v1/apps?access_token=${accessToken}`)
  .then(response =>
    response.json().then(json => json.apps)
  ));
}

export function login() {
  if (typeof cordova === 'undefined' || cordova.platformId === 'browser') {
    return simulateLogin();
  }

  return getClientID()
  .then(showAuthWindow)
  .then(handleAuth);
}
