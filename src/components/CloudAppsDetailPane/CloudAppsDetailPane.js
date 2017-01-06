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
            quiet
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
    </div>
  );
};

export default CloudAppsDetailPane;
