// import 'lie';
// import 'isomorphic-fetch';
import { options, h, render } from 'preact';
import { IntlProvider } from 'react-intl';
// Attempt to circumvent the 300ms delay
import 'react-fastclick';

import './topcoat-mobile-light.min.css';
import './index.less';

options.debounceRendering = f => f();
options.syncComponentUpdates = true;

let root;
function init() {
  window.navigator && window.navigator.splashscreen && window.navigator.splashscreen.hide();
  const App = require('./containers/App').default; // eslint-disable-line global-require

  root = render(
    <IntlProvider locale="en"><App /></IntlProvider>,
    document.getElementById('application'),
    root
  );
}

if (!window.cordova) {
  console.log('Cordova not found, starting anyways');
  init();
} else {
  console.log('Cordova found, starting now');
  document.addEventListener('deviceready', init, false);
}

if (module.hot) {
  // optional: mute HMR/WDS logs
  const log = console.log;
  const logs = [];
  console.log = (t, ...args) => {
    if (typeof t === 'string' && t.match(/^\[(HMR|WDS)\]/)) {
      if (t.match(/(up to date|err)/i)) logs.push(t.replace(/^.*?\]\s*/m, ''), ...args);
    } else {
      log.call(console, t, ...args);
    }
  };
  const flushLogs = () => console.log(`%c🚀 ${logs.splice(0, logs.length).join(' ')}`, 'color:#888;');
  module.hot.accept('./containers/App', () => requestAnimationFrame(() => {
    flushLogs();
    init();
  }));
}
