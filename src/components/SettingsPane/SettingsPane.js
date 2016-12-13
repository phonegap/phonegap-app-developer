import { h } from 'preact';
import {
  Button,
  List,
  ListContainer,
  ListHeader,
  ListItem,
  Switch,
} from 'topcoat-preact';

import styles from './index.less';

const SettingsPane = (props, state) => {
  const { itemClickHandler, dispatch } = props;

  return (
    <div className={ styles.settingsPane }>
      <List>
        <ListHeader />
        <ListContainer>
          <ListItem clickHandler={ () => itemClickHandler('/settings/menu') }>
            <div className={ styles.chevronItem }>
              Menu overlay trigger
            </div>
          </ListItem>
        </ListContainer>
        <ListHeader />
        <ListContainer>
          <ListItem>
            Clear server history
          </ListItem>
        </ListContainer>
        <ListHeader />
        <ListContainer>
          <ListItem>
            App version
          </ListItem>
        </ListContainer>
        <ListHeader />
        <ListContainer>
          <ListItem>
            <div className={ styles.item }>
              <div>Share usage data</div>
              <Switch checked />
            </div>
          </ListItem>
          <ListItem clickHandler={ () => window.open('http://www.adobe.com/special/misc/terms.html') }>
            <div className={ styles.chevronItem }>
              Terms of service
            </div>
          </ListItem>
          <ListItem clickHandler={ () => window.open('http://www.adobe.com/special/misc/privacy.html') }>
            <div className={ styles.chevronItem }>
              Privacy policy
            </div>
          </ListItem>
        </ListContainer>
      </List>
      <div className={ styles.padded10px }>
        <Button clickHandler={ () => itemClickHandler('signout') } full>Sign out of PhoneGapBuild</Button>
      </div>
    </div>
  );
};

export default SettingsPane;
