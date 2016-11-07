import { h } from 'preact';

import { Button } from 'topcoat-preact';

import styles from './index.less';

console.log(styles);

const ModalPane = ({ children, modal, onDismiss, open }, state) => (
  <div className={ `${styles.modal} ${open ? styles.open : ''}` }>
    { children }
    <div className={ styles.center }>
      <Button clickHandler={ e => onDismiss() }>Close</Button>
    </div>
  </div>
);

export default ModalPane;
