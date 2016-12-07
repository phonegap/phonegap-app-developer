import { h } from 'preact';
import { IconButton, ListContainer, ListItem } from 'topcoat-preact';

import styles from './index.less';

// @TODO This will probably be refactored to accept children
const CloudAppsList = (props, state) => {
  const { apps, clickHandler, playButtonHandler } = props;
  console.log(apps);
  const appsList = apps.map(app => (
    <ListItem className={ styles.appsListItem } clickHandler={ () => clickHandler(app) }>
      <div className={ styles.media }>
        <div className={ styles.mediaFigure }>
          <img
            className={ styles.mediaFigureImg }
            src={ app.icon.link }
            alt={ `${app.title} icon` }
          />
        </div>
        <div className={ styles.mediaBody }>
          <div className={ styles.appTitle }><strong>{ app.title }</strong></div>
          <div>{ `v${app.version}` }</div>
          <a>Details</a>
        </div>
        <IconButton
          aria-label="Play"
          quiet
          title="play"
          clickHandler={ e => playButtonHandler(e, app) }
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
    </ListItem>
  ));
  return (
    <ListContainer>{ appsList }</ListContainer>
  );
};

export default CloudAppsList;
