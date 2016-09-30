import { h } from 'preact';

import {
  IconButton,
  NavigationBar,
  NavigationBarItem,
  NavigationBarTitle,
} from 'topcoat-preact';

import styles from './index.less';

const MainHeader = (props, state) => (
  <NavigationBar>
    <NavigationBarItem quarter left>
      <IconButton />
    </NavigationBarItem>
    <NavigationBarItem half center>
      <NavigationBarTitle>
        PhoneGap
      </NavigationBarTitle>
    </NavigationBarItem>
    <NavigationBarItem quarter right>
      <IconButton />
    </NavigationBarItem>
  </NavigationBar>
);

export default MainHeader;
