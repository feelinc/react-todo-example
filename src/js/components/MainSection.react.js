var React = require('react');
var ReactPropTypes = React.PropTypes;
var TodoItem = require('./TodoItem.react');

var MainSection = React.createClass({

  propTypes: {
    allTodos: ReactPropTypes.object.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    // This section should be hidden by default
    // and shown when there are todos.
    if (Object.keys(this.props.allTodos).length < 1) {
      return null;
    }

    var allTodos = this.props.allTodos;
    var todos = [];

    for (var key in allTodos) {
      todos.push(<TodoItem key={key} todo={allTodos[key]} />);
    }

    return (
      <div className="panel-body list-group todo-list">{todos}</div>
    );
  }

});

module.exports = MainSection;