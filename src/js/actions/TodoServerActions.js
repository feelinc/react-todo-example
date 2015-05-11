var AppDispatcher = require('../dispatcher/AppDispatcher');
var TodoConstants = require('../constants/TodoConstants');
var TodoActions = require('./TodoActions');

module.exports = {

  receiveAll: function(rawTodos) {
    AppDispatcher.dispatch({
      actionType: TodoConstants.TODO_RECEIVE_RAW_ALL,
      rawTodos: rawTodos
    });
  }

};