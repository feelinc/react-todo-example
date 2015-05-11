var React = require('react');
var TodoActions = require('../actions/TodoActions');
var TodoTextInput = require('./TodoTextInput.react');

var Header = React.createClass({

  /**
   * @return {object}
   */
  render: function() {
    var controls;
    var allTodos = this.props.allTodos;

    var completed = 0;
    var isDeleting = 0;
    for (var key in allTodos) {
      if (allTodos[key].complete) {
        completed++;
      }
      
      if (allTodos[key].isDeleting === true) {
        isDeleting++;
      }
    }

    delete allTodos;
    
    if (completed > 0 && isDeleting === 0) {
      controls = (
        <ul className="panel-controls">
          <li>
            <a href="javascript:void(0);" title="Clear completed todo's" onClick={this._onClearCompletedClick}>
              <span className="glyphicon glyphicon-ok-sign"></span>
            </a>
          </li>
        </ul>
      );
    }

    return (
      <div className="panel-heading clearfix">
        <h3 className="panel-title"><i className="fa fa-bookmark"></i> Todo's</h3>
        {controls}
      </div>
    );
  },

  /**
   * Event handler to delete all completed TODOs
   */
  _onClearCompletedClick: function() {
    TodoActions.destroyCompleted();
  }

});

module.exports = Header;