import { h } from 'preact';
import { IconButton, Button } from 'topcoat-preact';

import styles from './index.less';

const CloudAppsDetailPane = (props, state) => {
  const { app, handlePlayButtonClick } = props;

  return (
    <div className={ styles.cloudAppsDetail }>
      <div className={ styles.header }>
        <div className={ styles.infoContainer }>
          <div className={ styles.iconContainer }>
            <img src={ app.icon.link } alt="icon" className={ styles.icon } />
          </div>
          <div>{ app.title }</div>
          <div>{ `v${app.version}` }</div>
        </div>
        <div className={ styles.playButtonContainer }>
          <IconButton
            aria-label="Play"
            title="play"
            clickHandler={ e => handlePlayButtonClick(app, e) }
          >
            <span
              style={ {
                width: '100%',
                height: '100%',
                display: 'block',
                background: 'url(assets/img/ic_play_circle_outline_black_24px.svg) center center no-repeat',
              } }
            />
          </IconButton>
        </div>
      </div>
      <div className={ styles.phoneGapVersionContainer }>
        <div className={ styles.phoneGapVersion }>
          <span>PhoneGap Version:</span>
          <span>{ app.phonegap_version }</span>
        </div>
      </div>
      <div className={ styles.pluginCompatibilityContainer }>
        <Button
          aria-label="Check Plugin Compatibility"
          full
          clickHandler={ () => {} }
          title="Check Plugin Compatibility"
        >
          Check Plugin Compatibility
        </Button>
        <p>Attempts to determine if the PhoneGap Developer App includes the
          required plugins to run your app.</p>
      </div>
      <div className={ styles.installContainer }>
        <Button
          aria-label="Install"
          full
          clickHandler={ () => {} }
          title="Install"
        >
          Install
        </Button>
      </div>
    </div>
  );
};

export default CloudAppsDetailPane;
