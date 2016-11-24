import { h } from 'preact';

import { Button } from 'topcoat-preact';

import styles from './index.less';

// @TODO This will probably be refactored to accept children
const CloudUserPane = (props, state) => {
  //const { apps, loading } = props;
  const { apps, loading } = props;
  const emptyState = (
    <span>
      <p>You have no saved projects on PhoneGap Build, yet.</p>
      <p>Try it out right now by creating our sample app Star Track</p>
      <Button
        cta
        full
        aria-label="Create Sample App"
        clickHandler={ e => props.handleButtonClick('button', e) }
      >
        Create Sample App
      </Button>
      <p>Visit build.phonegap.com to create your own apps.</p>
    </span>
  );
  // @TODO Facebook style placeholder rectangles UX here
  const loadingState = (
    <span>
      <p>Loading apps...</p>
    </span>
  );
  const errorState = (
    <span>
      <p>Error loading apps</p>
    </span>
  );
  const appsList = (
    <span>
      <p>&lt; <em>Apps List Goes Here</em> &gt;</p>
    </span>
  );

  let content = <div />; // default
  if (loading) {
    content = loadingState;
  } else if (apps && !apps.length) {
    content = emptyState;
  } else if (apps) {
    content = appsList;
  } else if (!loading && !apps) {
    content = errorState;
  }

  return (
    <div className={ styles.cloudUserPane }>
      { content }
      { props.children }
    </div>
  );
};

export default CloudUserPane;
