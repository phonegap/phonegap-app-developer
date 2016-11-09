import fetch from 'isomorphic-fetch'

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
    type: 'PGB_LOGOUT_REQUESTED'
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

export function login() {

  return function(dispatch) {

    dispatch(pgbLoginRequested());

    getClientID()
    .then(showAuthWindow)
    .then(handleAuth)
    .then(access_token => {
      dispatch(pgbLoginReceived(access_token));
      dispatch(pgbAppsRequested());
      return access_token;
    }).then(fetchApps)
    .then(function(apps) {
      dispatch(pgbAppsReceived(apps));
    })
  }
}

function getClientID() {
  return new Promise((resolve, reject) => {
    PhonegapBuildOauth.getClientID(function(id) {
      resolve(id);
    });
  })
}

function showAuthWindow(client_id) {
  let authWindow = cordova.InAppBrowser.open(
    "https://build.phonegap.com/authorize?client_id=" + client_id, 
    "_blank", 
    "clearcache=yes,location=no"
  );

  return new Promise((resolve, reject) => {
    authWindow.addEventListener('loadstart', function(e) {
      let url = e.url;
      if (url.match(/^(https?:\/\/)phonegap\.com\/?\?(code|error)=[a-zA-Z0-9_]*$/)) {
        console.log('Callback url found.')
        let qs = getQueryString(url);
        if (qs['code'] || qs['error']) {
          authWindow.close();
          resolve(qs['code'], qs['error']);
        }
      }
    });
  })
}

function handleAuth(auth_code, err) {
  return new Promise((resolve, reject) => {
    if (auth_code) {
      PhonegapBuildOauth.authorizeByCode(auth_code, function(a) {
        resolve(a.access_token)
      }, function(a) {
        console.log("Auth failure: " + a.message);
        alert('Login failed', 'Error');
        reject();
      });
    } else if (err) {
      console.log("Auth failure: " + err);
      alert('Login failed', 'Error');
      reject();
    }
  })
}

function fetchApps(access_token) {
  return (fetch("https://build.phonegap.com/api/v1/apps?access_token=" + access_token)
  .then(response => {
    return response.json().then(json => {
      console.log(json.apps.length + " apps found");
      return json.apps;
    });
  }));
}

function getQueryString(url) {
    let a = url.slice((url.indexOf('?') + 1)).split('&')
    if (a == "") return {};
    let b = {};
    a.forEach(i => {
      let p = i.split('=', 2);
      if (p.length == 1)
          b[p[0]] = "";
      else
          b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    });
    return b;
}