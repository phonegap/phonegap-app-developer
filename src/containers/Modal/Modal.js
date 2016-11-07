import { h } from 'preact';
import Portal from 'preact-portal';

const Modal = ({ children }, state) => (
  <Portal into="body">
    { children }
  </Portal>
);

export default Modal;
