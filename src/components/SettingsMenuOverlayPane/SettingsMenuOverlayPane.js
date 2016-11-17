import { h } from 'preact';

import styles from './index.less';

const SettingsMenuOverlayPane = (props, state) => {
  const { menuOverlayTriggerChoiceHandler } = props;

  return (
    <div className={ styles.settingsMenuOverlayPane } />
  );
};

export default SettingsMenuOverlayPane;
