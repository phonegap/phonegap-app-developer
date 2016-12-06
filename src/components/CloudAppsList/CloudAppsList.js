import { h } from 'preact';
import { ListContainer, ListItem } from 'topcoat-preact';

import styles from './index.less';

// @TODO This will probably be refactored to accept children
const CloudAppsList = (props, state) => {
  const { apps, clickHandler } = props;
  console.log(apps);
  const appsList = apps.map(app => (
    <ListItem className={ styles.appsListItem } clickHandler={ () => clickHandler(app) }>
      <div className={ styles.media }>
        <img className={ styles.mediaFigure } src={ app.icon.link } alt="" />
        <div className={ styles.mediaBody }>
          <div><strong>{ app.title }</strong></div>
          <div>{ `v${app.version}` }</div>
          <a href="#">Details</a>
        </div>
      </div>
    </ListItem>
  ));
  return (
    <ListContainer>{ appsList }</ListContainer>
  );
};

export default CloudAppsList;
