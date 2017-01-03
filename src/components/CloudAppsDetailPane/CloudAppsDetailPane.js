import { h } from 'preact';
import { IconButton, Button } from 'topcoat-preact';

import styles from './index.less';

const CloudAppsDetailPane = (props, state) => {
  const { app } = props;

  const playButtonHandler = (e) => {
    console.log(app);
  };

  return (
    <div className={ styles.cloudAppsDetail }>
      <div className={ styles.header }>
        <div className={ styles.infoContainer }>
          <img src={ app.icon.link } alt="icon" className={ styles.icon } />
          <div>{ app.title }</div>
          <div>{ `v${app.version}` }</div>
        </div>
        <div className={ styles.playButtonContainer }>
          <IconButton
            aria-label="Play"
            quiet
            title="play"
            clickHandler={ e => playButtonHandler(e) }
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
