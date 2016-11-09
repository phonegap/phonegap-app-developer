import { h, Component } from 'preact';
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

  render() {
    const { style } = this.props;
    const leftButton = (
      <IconButton
        aria-label="Settings"
        quiet
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
        quiet
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

    return (
      <div className="page" style={ style }>
        <MainHeader
          leftButton={ leftButton }
          rightButton={ rightButton }
          title="PhoneGap"
        />
        <TabBar
          full
          name="app-load-options"
          clickHandler={ tab => this.handleTabBarButtonClick(tab) }
        >
          <span key="connect">Connect</span>
          <span key="cloud">Cloud</span>
        </TabBar>
        { /* Nested route: the children are the containers for each tab */ }
        <TransitionGroup className="transitiongroup">
          { this.props.children }
        </TransitionGroup>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { ...state };
}

export default animateView(connect(mapStateToProps)(MainPage));
