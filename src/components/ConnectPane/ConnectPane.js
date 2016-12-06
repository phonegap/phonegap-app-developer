import { h, Component } from 'preact';
import { FormattedMessage } from 'react-intl';

import { Button, ComboBox, TextInput } from 'topcoat-preact';

import styles from './index.less';

// @TODO This might be refactored to just accept children
export default class ConnectPane extends Component {

  // @TODO these should come from the config
  suggestions = [
    {
      value: '192.168.1.1:3000',
    },
    {
      value: '192.168.1.6:3000',
    },
  ];

  componentDidMount() {
    var that = this;
    DeveloperMode.on('load', function() {
      that.suggestions = DeveloperMode.getHostAddresses().map(function(addr){
        var addrObj = { 'value' : addr };
        return addrObj;
      });
    });
  }

  render() {
    const { connectURL, handleButtonClick, handleOnChange } = this.props;
    return (
      <div className={ styles.connectPane }>
        <Button
          aria-label="Scan QR Code"
          full
          clickHandler={ () => handleButtonClick('scan') }
        >
          <span>
            <img src="assets/img/S_FullScreen_24_N.svg" alt="scan icon" />
            <FormattedMessage
              id="scan-a-qr-code-button"
              defaultMessage={ 'Scan a QR Code' }
            />
          </span>
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
          <ComboBox
            value={ connectURL }
            suggestions={ this.suggestions }
            changeHandler={ handleOnChange }
            placeholder="192.168.1.1:3000"
            full
            inputProps={ {
              name: 'connectUrl',
            } }
            focusInputOnSuggestionClick={ false }
          />
        </label>
        <Button
          aria-label="Connect"
          full
          cta
          clickHandler={ () => handleButtonClick('connect', '') }
        >
          <span>
            <FormattedMessage
              id="connect-buton"
              defaultMessage={ 'Connect' }
            />
          </span>
        </Button>
      </div>
    );
  }
}
