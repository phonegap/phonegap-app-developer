import { h } from 'preact';

import {
  NavigationBar,
  NavigationBarItem,
  NavigationBarTitle,
} from 'topcoat-preact';

import styles from './index.less';

const MainHeader = (props, state) => {
  const { leftButton, rightButton, title = 'PhoneGap' } = props;

  return (
    <NavigationBar className={ styles.mainHeader }>
      <NavigationBarItem quarter left>
        { leftButton }
      </NavigationBarItem>
      <NavigationBarItem half center>
        <span className={ styles.title }>{ title }</span>
      </NavigationBarItem>
      <NavigationBarItem quarter right>
        { rightButton }
      </NavigationBarItem>
    </NavigationBar>
  );
};

export default MainHeader;
