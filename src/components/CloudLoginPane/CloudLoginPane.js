import { h } from 'preact';

import { Button } from 'topcoat-preact';

import styles from './index.less';

// @TODO This will probably be refactored to accept children
const CloudLoginPane = (props, state) => (
  <div className={ styles.cloudLoginPane }>
    <p>
      Access your PhoneGap Build apps
    </p>
    <Button
      cta
      full
      clickHandler={ e => props.handleLoginButtonClick('login button') }
    >
      Sign in with Adobe ID
    </Button>
  </div>
);

export default CloudLoginPane;
