import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import animateView from 'react-animated-views';
import { hashHistory } from 'react-router';
import { IconButton, Button } from 'topcoat-preact';

import Modal from 'containers/Modal';
import ModalPane from 'components/ModalPane';
import CloudAppsDetailPane from 'components/CloudAppsDetailPane';
import MainHeader from 'components/MainHeader';
import SettingsPane from 'components/SettingsPane';
import { pgbAppsRequested, fetchApps, createSampleApp, analyzePlugins, checkPhonegapVersion, fetchAppZipUrl } from 'actions/pgbSessionActions';

class CloudAppsDetail extends Component {
  constructor() {
    super();
    this.state = {
      ...this.state,
      isModalOpen: false,
    };
  }

  componentDidMount() {
    // @TODO - fetch app by its appId
    const { dispatch, pgb: { apps, loading, accessToken } } = this.props;
    if (!accessToken) {
      hashHistory.replace('/main/cloud');
      return;
    }
  }

  handleModalDismiss() {
    this.setState({ isModalOpen: false });
    console.log('modal dismissed');
  }

  //handleButtonClick(button, e) {
    //console.log(`${button} clicked`);
    //const { dispatch } = this.props;
    ////this.setState({ isModalOpen: true });
    //this.setState({ loading: true });
    //dispatch(createSampleApp(this.props.pgb.accessToken))
    //.then(() => dispatch(fetchApps(this.props.pgb.accessToken)));
  //}

  //handleAppListItemClick = (app) => {
    //const { dispatch } = this.props;
    //console.log('handleAppListItemClick', app);
    //// dispatch(analyzePlugins(app.id, this.props.pgb.accessToken));
    //// dispatch(checkPhonegapVersion(app));
    //// dispatch(fetchAppZipUrl(app.id, this.props.pgb.accessToken));
  //};

  handleIconButtonClick() {
    const { pop } = this.props;
    pop('slideLeft');
  }

  render(props, state) {
    const { style, pgb: { loading, appsById }, params: { appId } } = props;
    const app = appsById[appId];

    const backButton = (
      <IconButton
        aria-label="Back"
        quiet
        title="Back"
        clickHandler={ () => this.handleIconButtonClick() }
      >
        <span
          style={ {
            width: '100%',
            height: '100%',
            display: 'block',
            background: 'url(assets/img/ic_arrow_back_black_24px.svg) center center no-repeat',
          } }
        />
      </IconButton>
    );
    const rightButton = (
      <span />
    );

    return (
      <div className="page" style={ style }>
        <MainHeader
          leftButton={ backButton }
          rightButton={ rightButton }
          title="Details"
        />
        <CloudAppsDetailPane app={ app } />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { pgb } = state;
  return {
    pgb,
  };
}

export default animateView(connect(mapStateToProps)(CloudAppsDetail));
