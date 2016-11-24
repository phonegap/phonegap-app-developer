import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { hashHistory } from 'react-router';
import * as pgbActions from 'actions/pgbSessionActions';

import Modal from 'containers/Modal';
import ModalPane from 'components/ModalPane';
import CloudLoginPane from 'components/CloudLoginPane';

class CloudTabLogin extends Component {
  constructor() {
    super();
    this.state.isLoadingModalOpen = false;
  }

  componentWillMount() {
    const { pgb: { accessToken, loading } } = this.props;
    this.setState({
      isLoadingModalOpen: loading,
    });
    if (accessToken) {
      hashHistory.replace('/main/cloud/user');
    }
  }

  componentWillReceiveProps(nextProps) {
    const { pgb: { accessToken, loading } } = nextProps;
    this.setState({
      isLoadingModalOpen: loading,
    });
    if (accessToken) {
      hashHistory.replace('/main/cloud/user');
    }
  }

  // There _will_ be a button here at some point...
  handleLoginButtonClick(button) {
    const { dispatch } = this.props;
    console.log(`${button} clicked`);
    dispatch(pgbActions.login());
  }

  handleModalDismiss() {
    this.setState({ isLoadingModalOpen: false });
    console.log('login modal dismissed');
  }

  render(props) {
    const { pgb } = props;
    return (
      <CloudLoginPane
        handleLoginButtonClick={ () => this.handleLoginButtonClick('login') }
      >
        <Modal>
          <ModalPane
            open={ this.state.isLoadingModalOpen }
            onDismiss={ () => this.handleModalDismiss() }
          >
            <p>Logging in...</p>
          </ModalPane>
        </Modal>
      </CloudLoginPane>
    );
  }
}

function mapStateToProps(state) {
  const { pgb } = state;
  return {
    pgb,
  };
}

export default connect(mapStateToProps)(CloudTabLogin);
