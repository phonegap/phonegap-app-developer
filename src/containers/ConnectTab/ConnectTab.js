import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { save, load, scanQRCode, downloadZip, cleanAddress } from 'utils/deploy';

import ConnectPane from 'components/ConnectPane';

function connectToServer(address) {
  console.log(address);
  const config = { address };
  save(config, () => console.log(`Saved server address ${address}`));
  DeveloperMode.addHostAddress(address);
  DeveloperMode.setCurrentHostAddress(address);
  DeveloperMode.deploy.downloadZip(config);
}

class ConnectTab extends Component {
  constructor() {
    super();
    this.state.url = '';
  }

  componentDidMount() {
    // load in last saved address
    load((loaded) => {
      const addr = loaded.address;
      this.setState({ url: addr });
    });
  }

  handleButtonClick(button) {
    console.log(`${button} button clicked`);

    switch (button) {
      case 'scan':
        scanQRCode((result) => {
          const address = cleanAddress(result.text);
          this.setState({ url: address });
          connectToServer(this.state.url);
        },
        (error) => {
          navigator.notification.alert(`Unable to scan: ${error}`);
        });
        break;
      case 'connect':
        {
          // block scope for address
          const address = cleanAddress(this.state.url);
          this.setState({ url: address });
          connectToServer(address);
        }
        break;
      default:
        console.log(button);
    }
  }

  handleTextChange(e, { newValue, method }) {
    this.setState({ url: newValue });
  }

  render() {
    // @TODO other handlers like those for the combobox will be passed as well
    return (
      <ConnectPane
        connectURL={ this.state.url }
        handleButtonClick={ button => this.handleButtonClick(button) }
        handleOnChange={
          (e, autosuggestData) => this.handleTextChange(e, autosuggestData)
        }
      />
    );
  }
}

function mapStateToProps(state) {
  return { ...state };
}

export default connect(mapStateToProps)(ConnectTab);
