import { cloneElement, h, Component } from 'preact';
import { Children } from 'preact-compat';
import animateView from 'react-animated-views';
import { IconButton, TabBar } from 'topcoat-preact';
import TransitionGroup from 'preact-transition-group';
import { connect } from 'preact-redux';

import MainHeader from 'components/MainHeader';

class MainPage extends Component {
  // @TODO revove the lint disable when this method actually does something
  handleIconButtonClick(buttonName) { // eslint-disable-line class-methods-use-this
    console.log(`${buttonName} icon button clicked`);
    const { push } = this.props;
    push(`/${buttonName}`, 'slideUp');
  }

  handleTabBarButtonClick(tab) {
    const { push } = this.props;
    push(`/main/${tab}`);
    console.log(`${tab} tab clicked`);
  }

  render(props, state) {
    const {
      style,
      location: { pathname: key, action: direction },
      push,
    } = props;

    const childProps = {
      key,
      direction: direction.toLowerCase(),
      push,
    };
    const leftButton = (
      <IconButton
        aria-label="Settings"
        title="settings"
        clickHandler={ () => this.handleIconButtonClick('settings') }
      >
        <span
          style={ {
            width: '100%',
            height: '100%',
            display: 'block',
            background: 'url(assets/img/S_Settings_24_N.svg) center center no-repeat',
          } }
        />
      </IconButton>
    );
    const rightButton = (
      <IconButton
        aria-label="Help"
        title="Help"
        clickHandler={ () => this.handleIconButtonClick('help') }
      >
        <span
          style={ {
            width: '100%',
            height: '100%',
            display: 'block',
            background: 'url(assets/img/S_Help_24_N.svg) center center no-repeat',
          } }
        />
      </IconButton>
    );

    const title = (
      <span>
        <img src="./assets/img/PhoneGap-Symbol-Black.svg" alt="Logo" />
        <span>PhoneGap</span>
      </span>
    );

    // Determine which tab is selected
    const pathArray = key.split('/');
    return (
      <div className="page" style={ style }>
        <MainHeader
          leftButton={ leftButton }
          rightButton={ rightButton }
          title={ title }
        />
        <TabBar
          full
          name="app-load-options"
          clickHandler={ tab => this.handleTabBarButtonClick(tab) }
        >
          <span key="connect" selected={ pathArray.indexOf('connect') > -1 }>Connect</span>
          <span key="cloud" selected={ pathArray.indexOf('cloud') > -1 }>Cloud</span>
        </TabBar>
        { /* Nested route: the children are the containers for each tab */ }
        <TransitionGroup className="transitiongroup">
          { cloneElement(Children.only(this.props.children), childProps) }
        </TransitionGroup>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { ...state };
}

export default animateView(connect(mapStateToProps)(MainPage));
