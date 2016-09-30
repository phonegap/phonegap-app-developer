import { h, Component } from 'preact';
import { save, load, scanQRCode, downloadZip, cleanAddress } from 'utils/deploy';

import ConnectPane from 'components/ConnectPane';

function connectToServer(address) {
  console.log(address);
  const config = { address };
  save(config, () => console.log(`Saved server address ${address}`));
  downloadZip(config);
}

class ConnectTab extends Component {
  constructor() {
    super();
    this.state.data = {};
  }

  componentDidMount() {
    // load in last saved address
    load((loaded) => {
      const addr = loaded.address;
      this.setState({ data: addr });
    });
  }

  handleButtonClick(button, data) {
    console.log(`${button} button clicked`);

    switch (button) {
      case 'scan':
        scanQRCode((result) => {
          const address = cleanAddress(result.text);
          this.setState({ data: address });
          connectToServer(this.state.data);
        },
        (error) => {
          navigator.notification.alert(`Unable to scan: ${error}`);
        });
        break;
      case 'connect':
        {
          // block scope for address
          const address = cleanAddress(data);
          this.setState({ data: address });
          connectToServer(address);
        }
        break;
      default:
        console.log(button);
    }
  }

  handleTextChange(e) {
    this.setState({ data: e.target.value });
  }

  render() {
    // TODO other handlers like those for the combobox will be passed as well
    return (
      <ConnectPane
        connectURL={ this.state.data }
        handleButtonClick={ (button, data) => this.handleButtonClick(button, data) }
        handleOnChange={ e => this.handleTextChange(e) }
      />
    );
  }
}

export default ConnectTab;
