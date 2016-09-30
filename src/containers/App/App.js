import { cloneElement, h, Children, Component } from 'preact';
import { hashHistory, Redirect, Router, Route } from 'react-router';

import Root from 'containers/Root';
import MainPage from 'containers/MainPage';
import ConnectTab from 'containers/ConnectTab';
import SavedTab from 'containers/SavedTab';

// This needs to be a class to keep HMR working
export default class App extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Router history={ hashHistory }>
        <Route component={ Root }>
          <Route path="main" component={ MainPage }>
            <Route path="connect" component={ ConnectTab } />
            <Route path="saved" component={ SavedTab } />
          </Route>
        </Route>
        <Redirect from="/" to="/main/connect" />
      </Router>
    );
  }
}
