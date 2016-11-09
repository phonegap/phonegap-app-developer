import { h, Component } from 'preact';
import { connect } from 'preact-redux'
import { hashHistory } from 'react-router';
import * as pgbActions from 'actions/pgbSessionActions';

import CloudLoginPane from 'components/CloudLoginPane';

class CloudTabLogin extends Component {
  // There _will_ be a button here at some point...
  // @TODO revove the lint disable when this method actually does something
  handleLoginButtonClick(button) { // eslint-disable-line class-methods-use-this
    console.log(`${button} clicked`);

    this.props.dispatch(pgbActions.login());
  }

  render() {
    return (
      <CloudLoginPane
        handleLoginButtonClick={ this.handleLoginButtonClick.bind(this) }
      />
    );
  }
}

export default connect()(CloudTabLogin)
