import { h, Component } from 'preact';

import CloudUserPane from 'components/CloudUserPane';

class CloudTabLogin extends Component {
  // There _will_ be a button here at some point...
  // @TODO revove the lint disable when this method actually does something
  handleButtonClick(button) { // eslint-disable-line class-methods-use-this
    console.log(`${button} clicked`);
  }

  render() {
    return (
      <CloudUserPane handleButtonClick={ this.handleButtonClick } />
    );
  }
}

export default CloudTabLogin;
