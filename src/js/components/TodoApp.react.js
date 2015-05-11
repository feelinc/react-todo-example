var TodoStore = require('../stores/TodoStore');
var ErrorStore = require('../stores/ErrorStore');
var Footer = require('./Footer.react');
var Header = require('./Header.react');
var MainSection = require('./MainSection.react');
var React = require('react');

/**
 * Retrieve the current TODO data from the TodoStore
 */
function getTodoState() {
  return {
    allErrors: ErrorStore.getAll(),
    allTodos: TodoStore.getAll()
  };
}

var TodoApp = React.createClass({

  getInitialState: function() {
    return getTodoState();
  },

  componentDidMount: function() {
    TodoStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    TodoStore.removeChangeListener(this._onChange);
  },

  /**
   * @return {object}
   */
  render: function() {
    return (
      <div className="panel panel-primary">
        <Header allTodos={this.state.allTodos} />
        <MainSection allTodos={this.state.allTodos} />
        <Footer allErrors={this.state.allErrors} />
      </div>
    );
  },

  /**
   * Event handler for 'change' events coming from the TodoStore
   */
  _onChange: function() {
    this.setState(getTodoState());
  }

});

module.exports = TodoApp;