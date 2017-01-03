import { cloneElement, h, Component } from 'preact';
import { Children } from 'preact-compat';
import { connect } from 'preact-redux';

class CloudTab extends Component {
  // There _will_ be a button here at some point...
  // @TODO revove the lint disable when this method actually does something
  handleButtonClick(button) { // eslint-disable-line class-methods-use-this
    console.log(`${button} clicked`);
  }

  render() {
    const { push } = this.props;
    const childProps = {
      push,
    };
    return (
      <div>
        { cloneElement(Children.only(this.props.children), childProps) }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { ...state };
}

export default connect(mapStateToProps)(CloudTab);
