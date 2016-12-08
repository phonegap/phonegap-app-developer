import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { hashHistory } from 'react-router';
import { Button } from 'topcoat-preact';

import Modal from 'containers/Modal';
import ModalPane from 'components/ModalPane';
import CloudUserPane from 'components/CloudUserPane';
import { pgbAppsRequested, fetchApps, createSampleApp, analyzePlugins, checkPhonegapVersion } from 'actions/pgbSessionActions';

class CloudTabUser extends Component {
  constructor() {
    super();
    this.state = {
      ...this.state,
      isModalOpen: false,
    };
  }

  componentWillMount() {
    const { dispatch, pgb: { apps, loading, accessToken } } = this.props;
    if (!accessToken) {
      hashHistory.replace('/main/cloud/login');
      return;
    }
    if (!apps) {
      dispatch(fetchApps(accessToken));
    }
  }

  componentWillReceiveProps(nextProps) {
    const { pgb: { apps, loading } } = nextProps;
  }

  handleModalDismiss() {
    this.setState({ isModalOpen: false });
    console.log('modal dismissed');
  }

  handleButtonClick(button, e) {
    console.log(`${button} clicked`);
    const { dispatch } = this.props;
    //this.setState({ isModalOpen: true });
    this.setState({ loading: true });
    dispatch(createSampleApp(this.props.pgb.accessToken))
    .then(() => dispatch(fetchApps(this.props.pgb.accessToken)));
  }

  handleAppListItemClick = (app) => {
    const { dispatch } = this.props;
    console.log('handleAppListItemClick', app);
    // dispatch(analyzePlugins(app.id, this.props.pgb.accessToken));
    // dispatch(checkPhonegapVersion(app));
  };

  render(props, state) {
    const { pgb: { loading, apps } } = props;
    return (
      <CloudUserPane
        handleButtonClick={ (button, e) => this.handleButtonClick(button, e) }
        loading={ loading }
        apps={ apps }
        handleAppListItemClick={ app => this.handleAppListItemClick(app) }
      >
        <Modal>
          <ModalPane
            open={ state.isModalOpen }
            onDismiss={ () => this.handleModalDismiss() }
          >
            <p>This is a modal. Close it below.</p>
            <Button clickHandler={ () => this.handleModalDismiss() }>
              <img src="assets/img/S_Close_24_N.svg" alt="close" />
              <span>Cancel</span>
            </Button>
          </ModalPane>
        </Modal>
      </CloudUserPane>
    );
  }
}

function mapStateToProps(state) {
  const { pgb } = state;
  return {
    pgb,
  };
}

export default connect(mapStateToProps)(CloudTabUser);
