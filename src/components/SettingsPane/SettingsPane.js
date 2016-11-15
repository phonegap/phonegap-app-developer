import { h, Component } from 'preact';
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
  const { itemClickHandler } = props;

  return (
    <div className={ styles.settingsPane }>
      <List>
        <ListHeader />
        <ListContainer>
          <ListItem>
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
          <ListItem clickHandler={ () => itemClickHandler('/terms') }>
            <div className={ styles.chevronItem }>
              Terms of service
            </div>
          </ListItem>
          <ListItem clickHandler={ () => itemClickHandler('/privacy') }>
            <div className={ styles.chevronItem }>
              Privacy policy
            </div>
          </ListItem>
        </ListContainer>
      </List>
      <div className={ styles.padded10px }>
        <Button full>Sign out of PhoneGapBuild</Button>
      </div>
    </div>
  );
};

export default SettingsPane;
