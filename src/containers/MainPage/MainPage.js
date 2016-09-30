import { h, Component } from 'preact';
import animateView from 'react-animated-views';
import { TabBar } from 'topcoat-preact';

import MainHeader from 'components/MainHeader';

class MainPage extends Component {

  handleIconButtonClick(buttonName) { // eslint-disable-line class-methods-use-this
    console.log(`${buttonName} icon button clicked`);
  }

  handleTabBarButtonClick(tab) {
    const { router } = this.context;
    router.push(`/main/${tab}`);
    console.log(`${tab} tab clicked`);
  }

  render() {
    return (
      <div className="page">
        <MainHeader handleIconButtonClick={ this.handleIconButtonClick } />
        <TabBar
          name="app-load-options"
          clickHandler={ tab => this.handleTabBarButtonClick(tab) }
        >
          <span key="connect">Connect</span>
          <span key="saved">Saved Projects</span>
        </TabBar>
        { /* Nested route: the children are the containers for each tab */ }
        { this.props.children }
      </div>
    );
  }
}

export default animateView(MainPage);
