var React = require('react');
var ReactPropTypes = React.PropTypes;
var TodoActions = require('../actions/TodoActions');
var TodoTextInput = require('./TodoTextInput.react');

var cx = require('react/lib/cx');

var ENTER_KEY_CODE = 13;

var TodoItem = React.createClass({

  propTypes: {
   todo: ReactPropTypes.object.isRequired
  },

  getInitialState: function() {
    var isSaving = true;
    if (typeof this.props.todo.isSaving != 'undefined') {
      isSaving = this.props.todo.isSaving;
    }

    var isDeleting = false;
    if (typeof this.props.todo.isDeleting != 'undefined') {
      isDeleting = this.props.todo.isDeleting;
    }

    return {
      isSaving: isSaving, 
      isEditing: false, 
      isDeleting: isDeleting, 
      color: this.props.todo.color, 
      value: this.props.todo.text
    };
  },

  componentDidMount: function() {
    this._renderCheckbox(this.props.todo);
  },

  componentDidUpdate: function() {
    this._renderCheckbox(this.props.todo);
  },

  componentWillReceiveProps: function() {
    if (typeof this.props.todo.isDeleting != 'undefined') {
      this.setState({isDeleting: this.props.todo.isDeleting});
    }

    if (typeof this.props.todo.isSaving != 'undefined') {
      this.setState({isSaving: this.props.todo.isSaving});
    }
  },

  /**
   * @return {object}
   */
  render: function() {
    var todo = this.props.todo;
    var styles = {
      backgroundColor: todo.color
    };

    var itemText = todo.text;
    
    if (this.state.isSaving || this.state.isDeleting) {
      var itemContent = 
        <div className="todo-item-loading pull-left">&nbsp;</div>;
    } else {
      var itemContent = 
        <input
          id={'todo-item-checkbox-' + todo.id}
          className="icheckbox toggle mr10"
          type="checkbox"
          checked={todo.complete}
          onChange={this._onToggleComplete}
        />;
    }

    if (this.state.isEditing) {
      var colorStyle = {
        backgroundColor: todo.color
      };

      itemContent = 
        <div id={'todo-colorpicker-input-group-' + todo.id} className="input-group color"
         data-color={this.state.color} data-color-format="hex">
          <span className="input-group-addon"><i style={colorStyle}></i></span>
          <input id={'todo-colorpicker-input-' + todo.id} type="hidden" />
          <input type="text" value={this.state.value} className="form-control dont-fill-color edit"
           onChange={this._onChange} onKeyDown={this._onKeyDown} autoFocus={true} />
        </div>
      itemText = '';
    }

    var editAction;
    if ( ! todo.complete && ! this.state.isSaving && ! this.state.isEditing && ! this.state.isDeleting) {
      editAction = 
        <a href="javascript:void(0);" onClick={this._onEditClick}>
          <span className="glyphicon glyphicon-pencil"></span>
        </a>;
    }

    var deleteAction;
    if ( ! this.state.isSaving && ! this.state.isEditing && ! this.state.isDeleting) {
      deleteAction = 
        <a id={'btn-todo-item-destroy-' + todo.id} href="javascript:void(0);" onClick={this._onDestroyClick}>
          <span className="glyphicon glyphicon-trash"></span>
        </a>;
    }

    // List items should get the class 'editing' when editing
    // and 'completed' when marked as completed.
    // Note that 'completed' is a classification while 'complete' is a state.
    // This differentiation between classification and state becomes important
    // in the naming of view actions toggleComplete() vs. destroyCompleted().
    return (
      <div
        id={todo.id}
        className={cx({
          'list-group-item': true,
          'completed': todo.complete, 
          'editing': this.state.isEditing, 
          'dark-background-item': (this._checkColor(todo.color) < 130)
        })}
        style={styles}
        key={todo.id}>
        <div className="todo-item">{itemContent}{itemText}</div>
        <div className="list-group-controls">
          {editAction}
          {deleteAction}
        </div>
      </div>
    );
  },

  _onToggleComplete: function(event) {
    TodoActions.toggleComplete(this.props.todo);
  },

  _onEditClick: function() {
    this.setState({isEditing: true});
  },

  /**
   * Event handler called within TodoTextInput.
   * Defining this here allows TodoTextInput to be used in multiple places
   * in different ways.
   * @param  {string} text
   */
  _update: function(text) {
    TodoActions.destroyAllError();
    TodoActions.updateText(
      this.props.todo.id, 
      {color: this.props.todo.color, text: this.props.todo.value}, 
      {color: this.state.color, text: this.state.value}
    );
    this.setState({isEditing: false});
    this.setState({isSaving: true});
  },

  _onDestroyClick: function() {
    TodoActions.destroyAllError();
    this.setState({isDeleting: true});
    TodoActions.destroy(this.props.todo.id);
  },

  /**
   * @param {object} event
   */
  _onChange: function(event) {
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
      this._update();
    }
  },

  _renderCheckbox: function(todo) {
    var dom = jQuery('#todo-item-checkbox-' + todo.id);

    if ( ! dom.parent().hasClass('icheckbox_polaris') && ! dom.parent().hasClass('icheckbox_minimal-grey')) {
      var cls = 'icheckbox_polaris';
      if (this._checkColor(todo.color) < 130) {
        cls = 'icheckbox_minimal-grey';
      }

      dom.iCheck({checkboxClass: cls})
      .on('ifChecked', todo.complete)
      .on('ifChanged', this._onToggleComplete);

      jQuery('#todo-colorpicker-input-group-' + todo.id).colorpicker({
        input: '#todo-colorpicker-input-' + todo.id
      }).on('changeColor', this._onColorChange);
    }
  },

  _checkColor: function(color) {
    var c = color.substring(1); // strip #
    var rgb = parseInt(c, 16);  // convert rrggbb to decimal
    var r = (rgb >> 16) & 0xff; // extract red
    var g = (rgb >>  8) & 0xff; // extract green
    var b = (rgb >>  0) & 0xff; // extract blue

    return luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
  }

});

module.exports = TodoItem;