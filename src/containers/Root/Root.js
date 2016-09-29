import { cloneElement, h } from 'preact';
import { Children } from 'preact-compat';
import TransitionGroup from 'preact-transition-group';

const Root = (props, state) => {
  const {
    location: { pathname: key, action: direction },
  } = props;

  const childProps = {
    key,
    direction: direction.toLowerCase(),
  };

  return (
    <TransitionGroup className="transitiongroup">
      { cloneElement(Children.only(props.children) || <div />, childProps) }
    </TransitionGroup>
  );
};

export default Root;
