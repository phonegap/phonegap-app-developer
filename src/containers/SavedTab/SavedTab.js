import { h, Component } from 'preact';

import SavedPane from 'components/SavedPane';

class SavedTab extends Component {

  // There _will_ be a button here at some point...
  handleButtonClick(button) {
    console.log(`${button} clicked`);
  }

  render() {
    return (
      <SavedPane handleButtonClick={ this.handleButtonClick } />
    );
  }
}

export default SavedTab;
