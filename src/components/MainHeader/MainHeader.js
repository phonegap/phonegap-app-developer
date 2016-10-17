import { h } from 'preact';

import {
  IconButton,
  NavigationBar,
  NavigationBarItem,
  NavigationBarTitle,
} from 'topcoat-preact';

import styles from './index.less';

const MainHeader = (props, state) => (
  <NavigationBar className={ styles.mainHeader }>
    <NavigationBarItem quarter left>
      <IconButton
        aria-label="Settings"
        quiet
        title="settings"
        clickHandler={ () => props.handleIconButtonClick('settings') }
      >
        <span className={ styles.settingsButton } />
      </IconButton>
    </NavigationBarItem>
    <NavigationBarItem half center>
      PhoneGap
    </NavigationBarItem>
    <NavigationBarItem quarter right>
      <IconButton
        aria-label="Help"
        quiet
        title="Help"
        clickHandler={ () => props.handleIconButtonClick('help') }
      >
        <span className={ styles.helpButton } />
      </IconButton>
    </NavigationBarItem>
  </NavigationBar>
);

export default MainHeader;
