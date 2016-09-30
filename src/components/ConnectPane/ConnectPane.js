import { h, Component } from 'preact';

import { Button, TextInput } from 'topcoat-preact';

import styles from './index.less';

// TODO This might be refactored to just accept children
export default class ConnectPane extends Component {
  render() {
    return (
      <div className={ styles.connectPane }>
        <Button
          full
          clickHandler={ () => this.props.handleButtonClick('scan') }
        >
          <img src="assets/img/ic_fullscreen_black_24px.svg" alt="scan icon" />
          <span> Scan a QR Code</span>
        </Button>
        <div className={ styles.orSpacer }>
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
        >
          Connect
        </Button>
      </div>
    );
  }
}
