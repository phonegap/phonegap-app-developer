import { h, Component } from 'preact';
import { hashHistory } from 'react-router';

import CloudLoginPane from 'components/CloudLoginPane';

class CloudTabLogin extends Component {
  // There _will_ be a button here at some point...
  // @TODO revove the lint disable when this method actually does something
  handleLoginButtonClick(button) { // eslint-disable-line class-methods-use-this
    console.log(`${button} clicked`);
    hashHistory.replace('/main/cloud/user/1');
  }

  render() {
    return (
      <CloudLoginPane
        handleLoginButtonClick={ this.handleLoginButtonClick }
      />
    );
  }
}

export default CloudTabLogin;
