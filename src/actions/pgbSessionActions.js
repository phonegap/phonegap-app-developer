/*global cordova*/
/*global PhonegapBuildOauth*/

import fetch from 'isomorphic-fetch';

export function pgbLoginRequested() {
  return {
    type: 'PGB_LOGIN_REQUESTED',
  };
}

export function pgbLoginReceived(accessToken) {
  return {
    type: 'PGB_LOGIN_RECEIVED',
    accessToken,
  };
}

export function pgbLogoutRequested(accessToken) {
  return {
    type: 'PGB_LOGOUT_REQUESTED',
  };
}

export function pgbLogoutReceived() {
  return {
    type: 'PGB_LOGOUT_RECEIVED',
  };
}

export function pgbAppsRequested() {
  return {
    type: 'PGB_REQUEST_APPS',
  };
}

export function pgbAppsReceived(apps) {
  return {
    type: 'PGB_APPS_RECEIVED',
    apps,
  };
}

function simulateFetchApps(dispatch) {
  setTimeout(() => {
    fetch('assets/fakeapps.json')
    .then(response =>
      response.json().then((apps) => {
        console.log(apps);
        dispatch(pgbAppsReceived(apps));
      })
    );
  }, 2000);
}

// stub for in browser dev
function simulateLogin(dispatch) {
  setTimeout(() => {
    dispatch(pgbLoginReceived('1234'));
    dispatch(pgbAppsRequested());
    simulateFetchApps(dispatch);
  }, 2000);
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

function fetchApps(accessToken) {
  return (fetch(`https://build.phonegap.com/api/v1/apps?access_token=${accessToken}`)
  .then(response =>
    response.json().then((json) => {
      console.log(`${json.apps.length} apps found`);
      return json.apps;
    })
  ));
}

export function login() {
  return (dispatch) => {
    dispatch(pgbLoginRequested());

    // stub for in browser dev
    if (typeof cordova === 'undefined' || cordova.platformId === 'browser') {
      return simulateLogin(dispatch);
    }

    return getClientID()
    .then(showAuthWindow)
    .then(handleAuth)
    .then((accessToken) => {
      dispatch(pgbLoginReceived(accessToken));
      dispatch(pgbAppsRequested());
      return accessToken;
    })
    .then(fetchApps)
    .then((apps) => {
      dispatch(pgbAppsReceived(apps));
    });
  };
}
