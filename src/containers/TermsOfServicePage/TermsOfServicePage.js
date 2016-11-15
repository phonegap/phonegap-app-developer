import { h, Component } from 'preact';
import animateView from 'react-animated-views';
import { connect } from 'preact-redux';

import { IconButton } from 'topcoat-preact';

import MainHeader from 'components/MainHeader';
import TermsOfServicePane from 'components/TermsOfServicePane';

class TermsOfServicePage extends Component {
  handleIconButtonClick() {
    const { pop } = this.props;
    pop('slideLeft');
  }

  render() {
    const { style } = this.props;
    const backButton = (
      <IconButton
        aria-label="Help"
        quiet
        title="Help"
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
          title="Terms of Service"
        />
        <TermsOfServicePane />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { ...state };
}

export default animateView(connect(mapStateToProps)(TermsOfServicePage));
