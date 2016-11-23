import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { Button } from 'topcoat-preact';

import Modal from 'containers/Modal';
import ModalPane from 'components/ModalPane';
import CloudUserPane from 'components/CloudUserPane';

class CloudTabUser extends Component {
  constructor() {
    super();
    this.state = {
      ...this.state,
      isModalOpen: false,
    };
  }

  componentWillMount() {
    const { pgb: { loading } } = this.props;
  }

  componentWillReceiveProps(nextProps) {
    const { pgb: { loading } } = nextProps;
  }

  handleModalDismiss() {
    this.setState({ isModalOpen: false });
    console.log('modal dismissed');
  }

  handleButtonClick(button, e) {
    this.setState({ isModalOpen: true });
    console.log(`${button} clicked`);
  }

  render(props, state) {
    const { pgb: { loading, apps: { apps } } } = props;
    return (
      <CloudUserPane
        handleButtonClick={ (button, e) => this.handleButtonClick(button, e) }
        loading={ loading }
        apps={ apps }
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
