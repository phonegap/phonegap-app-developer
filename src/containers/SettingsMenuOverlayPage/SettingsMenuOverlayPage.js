import { h, Component } from 'preact';
import animateView from 'react-animated-views';
import { connect } from 'preact-redux';

import {
  IconButton,
  List,
  ListContainer,
  ListHeader,
  ListItem,
  NavigationBar,
  NavigationBarItem,
  NavigationBarTitle,
} from 'topcoat-preact';

import MainHeader from 'components/MainHeader';
import SettingsMenuOverlayPane from 'components/SettingsMenuOverlayPane';

class SettingsMenuOverlayPage extends Component {
  handleIconButtonClick() {
    const { pop } = this.props;
    pop('slideLeft');
  }

  render() {
    const { style } = this.props;

    const backButton = (
      <IconButton
        aria-label="Back"
        title="Back"
        clickHandler={ () => this.handleIconButtonClick() }
      >
        <span
          style={ {
            width: '100%',
            height: '100%',
            display: 'block',
            background: 'url(assets/img/ic_arrow_back_black_24px.svg) center center no-repeat',
          } }
        />
      </IconButton>
    );
    const rightButton = (
      <span />
    );

    return (
      <div className="page" style={ style }>
        <MainHeader
          leftButton={ backButton }
          rightButton={ rightButton }
          title="Menu Overlay Trigger"
        />
        <SettingsMenuOverlayPane />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { ...state };
}

export default animateView(connect(mapStateToProps)(SettingsMenuOverlayPage));

