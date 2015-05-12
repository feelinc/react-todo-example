var React = require('react');
var ReactPropTypes = React.PropTypes;

var ENTER_KEY_CODE = 13;
var DEFAULT_COLOR = '#dff0d8';

var TodoTextInput = React.createClass({

  propTypes: {
    id: ReactPropTypes.string,
    placeholder: ReactPropTypes.string,
    onSave: ReactPropTypes.func.isRequired,
    color: ReactPropTypes.string,
    value: ReactPropTypes.string
  },

  getInitialState: function() {
    return {
      color: this.props.color || DEFAULT_COLOR, 
      value: this.props.value || ''
    };
  },

  componentDidMount: function() {
    jQuery('#todo-colorpicker-input-group').colorpicker({
      input: '#todo-colorpicker-input'
    }).on('changeColor', this._onColorChange);
  },

  /**
   * @return {object}
   */
  render: function() /*object*/ {
    var colorStyle = {
      backgroundColor: this.state.color
    };

    return (
      <div id="todo-colorpicker-input-group" className="input-group color"
       data-color={this.state.color} data-color-format="hex">
        <span className="input-group-addon"><i style={colorStyle}></i></span>
        <input id="todo-colorpicker-input" type="hidden" value={this.state.color} />
        <input id={this.props.id} type="text" className="form-control dont-fill-color"
         placeholder={this.props.placeholder}
          onChange={this._onChange} onKeyDown={this._onKeyDown}
           value={this.state.value} autoFocus={true} />
        <span className="input-group-btn">
          <button className="btn btn-default" type="button" onClick={this._save}>ADD</button>
        </span>
      </div>
    );
  },

  /**
   * Invokes the callback passed in as onSave, allowing this component to be
   * used in different ways.
   */
  _save: function() {
    this.props.onSave(this.state.color, this.state.value);
    this.setState({
      color: DEFAULT_COLOR, 
      value: ''
    });
  },

  /**
   * @param {object} event
   */
  _onChange: function(/*object*/ event) {
    this.setState({
      value: event.target.value
    });
  },

  /**
   * @param {object} event
   */
  _onColorChange: function(event) {
    this.setState({
      color: event.color.toHex()
    });
  },

  /**
   * @param  {object} event
   */
  _onKeyDown: function(event) {
    if (event.keyCode === ENTER_KEY_CODE) {
      this._save();
    }
  }

});

module.exports = TodoTextInput;