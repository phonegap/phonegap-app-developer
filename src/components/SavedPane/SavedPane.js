import { h } from 'preact';

import styles from './index.less';

// TODO This will probably be refactored to accept children
const SavedPane = (props, state) => (
  <div className={ styles.savedPane }>
    <p>
      You have no saved projects
    </p>
  </div>
);

export default SavedPane;
