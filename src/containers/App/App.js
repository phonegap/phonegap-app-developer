import { Provider, connect } from 'preact-redux';
import { cloneElement, h, Children, Component } from 'preact';
import { hashHistory, IndexRedirect, Router, Route } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import Root from 'containers/Root';
import MainPage from 'containers/MainPage';
import SettingsPage from 'containers/SettingsPage';
import TermsOfServicePage from 'containers/TermsOfServicePage';
import PrivacyPolicyPage from 'containers/PrivacyPolicyPage';
import ConnectTab from 'containers/ConnectTab';
import CloudTab from 'containers/CloudTab';
import CloudTabLogin from 'containers/CloudTabLogin';
import CloudTabUser from 'containers/CloudTabUser';
import configureStore from 'stores/configureStore';

const store = configureStore();
// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(hashHistory, store);

// This needs to be a class to keep HMR working
export default class App extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Provider store={ store }>
        <Router history={ history }>
          <Route path="/" component={ Root }>
            <Route path="main" component={ MainPage }>
              <Route path="connect" component={ ConnectTab } />
              <Route path="cloud" component={ CloudTab }>
                <Route path="user/:userID" component={ CloudTabUser } />
                <Route path="login" component={ CloudTabLogin } />
                <IndexRedirect to="login" />
              </Route>
            </Route>
            <Route path="settings" component={ SettingsPage } />
            <Route path="terms" component={ TermsOfServicePage } />
            <Route path="privacy" component={ PrivacyPolicyPage } />
            <IndexRedirect to="main/connect" />
          </Route>
        </Router>
      </Provider>
    );
  }
}
