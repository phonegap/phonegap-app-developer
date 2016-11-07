import { h, Component } from 'preact';

import Modal from 'containers/Modal';
import CloudUserPane from 'components/CloudUserPane';
import ModalPane from 'components/ModalPane';

class CloudTabLogin extends Component {
  constructor() {
    super();
    this.state.isModalOpen = false;
  }

  // @TODO revove the lint disable when this method actually does something
  handleModalDismiss() {
    this.setState({ isModalOpen: false });
    console.log('modal dismissed');
  }

  // There _will_ be a button here at some point...
  // @TODO revove the lint disable when this method actually does something
  handleButtonClick(button, e) {
    this.setState({ isModalOpen: true });
    console.log(`${button} clicked`);
  }

  render() {
    return (
      <CloudUserPane handleButtonClick={ (button, e) => this.handleButtonClick(button, e) }>
        <Modal>
          <ModalPane
            open={ this.state.isModalOpen }
            onDismiss={ () => this.handleModalDismiss() }
          >
            <p>This is a modal. Close it below.</p>
          </ModalPane>
        </Modal>
      </CloudUserPane>
    );
  }
}

export default CloudTabLogin;
