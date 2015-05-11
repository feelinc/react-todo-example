var React = require('react');
var TodoActions = require('../actions/TodoActions');
var TodoTextInput = require('./TodoTextInput.react');
var ErrorStore = require('../stores/ErrorStore');

var Footer = React.createClass({

  /**
   * @return {object}
   */
  render: function() {
    var allErrors = this.props.allErrors;
    var errors = [];

    for (var key in allErrors) {
      errors.push(<div className="alert alert-danger  pt5 pb5 push-up-5" key={'todo-error-' + key}>
        {allErrors[key].text}
      </div>);
    }

    return (
      <div className="panel-footer">
        <TodoTextInput
          id="new-todo"
          onSave={this._onSave}
        />
        {errors}
      </div>
    );
  },

  /**
   * Event handler called within TodoTextInput.
   * Defining this here allows TodoTextInput to be used in multiple places
   * in different ways.
   * @param {string} color
   * @param {string} text
   */
  _onSave: function(color, text) {
    TodoActions.destroyAllError();

    if (text.trim()){
      TodoActions.create(color, text);
    }
  }

});

module.exports = Footer;