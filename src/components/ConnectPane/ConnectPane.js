import { h, Component } from 'preact';
import { FormattedMessage } from 'react-intl';

import { Button, TextInput } from 'topcoat-preact';

import styles from './index.less';

// TODO This might be refactored to just accept children
export default class ConnectPane extends Component {
  render() {
    return (
      <div className={ styles.connectPane }>
        <Button
          aria-label="Scan QR Code"
          full
          clickHandler={ () => this.props.handleButtonClick('scan') }
        >
          <img src="assets/img/ic_fullscreen_black_24px.svg" alt="scan icon" />
          <FormattedMessage
            id="scan-a-qr-code-button"
            defaultMessage={ 'Scan a QR Code' }
          />
        </Button>
        <div className={ styles.orSpacer }>
          <FormattedMessage
            id="or-spacer"
            defaultMessage={ '- or -' }
          />
        </div>
        <label htmlFor="connectURL">
          <FormattedMessage
            id="enter-server-address"
            defaultMessage={ 'Enter server address' }
          />
          <TextInput
            name="connectURL"
            value={ this.props.connectURL }
            onChange={ e => this.props.handleOnChange(e) }
            ref={ (node) => { this.connectURL = node; } }
            full
          />
        </label>
        <Button
          aria-label="Connect"
          full
          cta
          clickHandler={ () => this.props.handleButtonClick('connect', this.connectURL.input.value) }
        >
          <FormattedMessage
            id="connect-buton"
            defaultMessage={ 'Connect' }
          />
        </Button>
      </div>
    );
  }
}
