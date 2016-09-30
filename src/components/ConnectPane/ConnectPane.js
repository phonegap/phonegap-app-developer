import { h, Component } from 'preact';

import { Button, TextInput } from 'topcoat-preact';

import './index.less';

let connectURL;
// TODO This might be refactored to just accept children
class ConnectPane extends Component {
  render() {
    return (
      <div className="connect-pane">
        <Button
          full
          clickHandler={ () => this.props.handleButtonClick('scan') }
          onTouchEnd={ () => this.props.handleButtonClick('scan') }
        >
          <img src="assets/img/ic_fullscreen_black_24px.svg" alt="scan icon" />
          <span> Scan a QR Code</span>
        </Button>
        <div className="or-spacer">
          - or -
        </div>
        <label htmlFor="connectURL">Enter server address
          <TextInput
            name="connectURL"
            value={ this.props.connectURL }
            onChange={ e => this.props.handleOnChange(e) }
            ref={ (node) => { this.connectURL = node; } }
            full
          />
        </label>
        <Button
          full
          cta
          clickHandler={ () => this.props.handleButtonClick('connect', this.connectURL.input.value) }
          onTouchEnd={ () => this.props.handleButtonClick('connect', this.connectURL.input.value) }
        >
          Connect
        </Button>
      </div>
    );
  }
}

export default ConnectPane;
