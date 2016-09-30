import { h, Component } from 'preact';

import SavedPane from 'components/SavedPane';

class SavedTab extends Component {
  // There _will_ be a button here at some point...
  // @TODO revove the lint disable when this method actually does something
  handleButtonClick(button) { // eslint-disable-line class-methods-use-this
    console.log(`${button} clicked`);
  }

  render() {
    return (
      <SavedPane handleButtonClick={ this.handleButtonClick } />
    );
  }
}

export default SavedTab;
