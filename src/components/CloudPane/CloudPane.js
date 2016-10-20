import { h } from 'preact';

import { Button } from 'topcoat-preact';

import styles from './index.less';

// @TODO This will probably be refactored to accept children
const CloudPane = (props, state) => (
  <div className={ styles.cloudPane }>
    <p>
      Access your PhoneGap Build apps
    </p>
    <Button cta full>Sign in with Adobe ID</Button>
  </div>
);

export default CloudPane;
