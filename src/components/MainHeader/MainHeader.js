import { h } from 'preact';

import {
  IconButton,
} from 'phonegap-topcoat-react';

import styles from './index.less';

const MainHeader = (props, state) => (
  <div className={ styles.mainHeader }>
    <IconButton
      quiet
      clickHandler={ () => props.handleIconButtonClick('settings') }
      onTouchEnd={ () => props.handleIconButtonClick('settings') }
      style={ { background: 'url(assets/img/ic_settings_black_24px.svg) center center no-repeat' } }
      title="Settings"
    />
    <div className={ styles.logo }>
      <img src="assets/img/PhoneGap-Symbol-Black.svg" alt="logo" />
    </div>
    <IconButton
      quiet
      clickHandler={ () => props.handleIconButtonClick('help') }
      onTouchEnd={ () => props.handleIconButtonClick('help') }
      style={ { background: 'url(assets/img/ic_help_black_24px.svg) center center no-repeat' } }
      title="Help"
    />
  </div>
);

export default MainHeader;
