var AppDispatcher = require('../dispatcher/AppDispatcher');
var TodoConstants = require('../constants/TodoConstants');
var TodoStore = require('../stores/TodoStore');
var TodoAPIUtils = require('../utils/TodoAPIUtils');
var TodoUtils = require('../utils/TodoUtils');

var TodoActions = {

  /**
   * @param  {string} color
   * @param  {string} text
   */
  create: function(color, text) {
    // Using the current timestamp + random number in place of a real id.
    var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);

    AppDispatcher.dispatch({
      actionType: TodoConstants.TODO_CREATE,
      id: id, 
      color: color, 
      text: text
    });

    TodoAPIUtils.createTodo(
      TodoStore.getCreatedData(id, color, text), 
      this.successCreate.bind(this), 
      this.errorCreate.bind(this)
    );
  },

  /**
   * @param  {object} data
   */
  successCreate: function(data) {
    this.destroy(data.unique_id, false);

    AppDispatcher.dispatch({
      actionType: TodoConstants.TODO_RECEIVE_RAW_ALL, 
      rawTodos: [data]
    });
  },

  /**
   * @param  {string} id
   * @param  {object} error
   */
  errorCreate: function(id, error) {
    AppDispatcher.dispatch({
      actionType: TodoConstants.TODO_CREATE_ERROR, 
      code: error.code, 
      text: error.message
    });

    this.destroy(id, false);
  },

  /**
   * @param  {string} id The ID of the ToDo item
   * @param  {object} previousData
   * @param  {object} newData
   */
  updateText: function(id, previousData, newData) {
    TodoAPIUtils.updateTodo(
      id, previousData, newData, 
      this.successUpdate.bind(this), 
      this.errorUpdate.bind(this)
    );
  },

  /**
   * @param  {string} id
   * @param  {object} data
   */
  successUpdate: function(id, data) {
    AppDispatcher.dispatch({
      actionType: TodoConstants.TODO_UPDATE_TEXT,
      id: id,
      color: data.color, 
      text: data.text
    });

    AppDispatcher.dispatch({
      actionType: TodoConstants.TODO_UPDATE_TEXT_SUCCESS,
      id: id
    });
  },

  /**
   * @param  {string} id
   * @param  {object} previousData
   * @param  {object} error
   */
  errorUpdate: function(id, previousData, error) {
    AppDispatcher.dispatch({
      actionType: TodoConstants.TODO_CREATE_ERROR, 
      code: error.code, 
      text: error.message
    });


  },

  /**
   * Toggle whether a single ToDo is complete
   * @param  {object} todo
   * @param  {boolean} withAPIRequest
   */
  toggleComplete: function(todo) {
    var actionType = todo.complete ?
        TodoConstants.TODO_UNDO_COMPLETE :
        TodoConstants.TODO_COMPLETE;

    AppDispatcher.dispatch({
      actionType: actionType,
      id: todo.id
    });

    if (todo.complete) {
      TodoAPIUtils.setUndoCompleteState(
        todo.id, 
        this.errorUndoComplete.bind(this)
      );
    } else {
      TodoAPIUtils.setCompleteState(
        todo.id, 
        this.errorComplete.bind(this)
      );
    }
  },

  /**
   * @param  {string} id
   * @param  {object} error
   */
  errorUndoComplete: function(id, error) {
    AppDispatcher.dispatch({
      actionType: TodoConstants.TODO_CREATE_ERROR, 
      code: error.code, 
      text: error.message
    });
    
    AppDispatcher.dispatch({
      actionType: TodoConstants.TODO_COMPLETE,
      id: id
    });
  },

  /**
   * @param  {string} id
   * @param  {object} error
   */
  errorComplete: function(id, error) {
    AppDispatcher.dispatch({
      actionType: TodoConstants.TODO_CREATE_ERROR, 
      code: error.code, 
      text: error.message
    });

    AppDispatcher.dispatch({
      actionType: TodoConstants.TODO_UNDO_COMPLETE,
      id: id
    });
  },

  /**
   * Mark all ToDos as complete
   */
  toggleCompleteAll: function() {
    AppDispatcher.dispatch({
      actionType: TodoConstants.TODO_TOGGLE_COMPLETE_ALL
    });
  },

  /**
   * @param  {string} id
   * @param  {boolean} doAPICall
   */
  destroy: function(id, doAPICall) {
    if (typeof doAPICall == 'undefined') {
      doAPICall = true;
    }

    if (doAPICall) {
      TodoAPIUtils.destroyTodo(
        id, 
        this.successDestroy.bind(this), 
        this.errorDestroy.bind(this)
      );
    } else {
      this.successDestroy(id);
    }
  },

  /**
   * @param  {string} id
   */
  successDestroy: function(id) {
    AppDispatcher.dispatch({
      actionType: TodoConstants.TODO_DESTROY,
      id: id
    });
  },

  /**
   * @param  {object} id
   * @param  {object} error
   */
  errorDestroy: function(id, error) {
    AppDispatcher.dispatch({
      actionType: TodoConstants.TODO_DESTROY_CANCEL, 
      id: id
    });
  },

  /**
   * Delete all the completed ToDos
   */
  destroyCompleted: function() {
    AppDispatcher.dispatch({
      actionType: TodoConstants.TODO_DESTROY_COMPLETED_REQUEST
    });

    var allTodos = TodoStore.getAll();
    var todoIds = [];

    for (var id in allTodos) {
      if (allTodos[id].complete) {
        todoIds.push(id);
      }
    }

    delete allTodos;
    
    TodoAPIUtils.destroyCompletedTodo(
      todoIds, 
      this.successDestroyCompleted.bind(this), 
      this.errorDestroyCompleted.bind(this)
    );
  },

  /**
   * @param  {array} deletedIds
   */
  successDestroyCompleted: function(deletedIds) {
    AppDispatcher.dispatch({
      actionType: TodoConstants.TODO_DESTROY_COMPLETED,
      ids: deletedIds
    });
  },

  /**
   * @param  {array} ids
   * @param  {object} error
   */
  errorDestroyCompleted: function(ids, error) {
    AppDispatcher.dispatch({
      actionType: TodoConstants.TODO_CREATE_ERROR, 
      code: error.code, 
      text: error.message
    });

    if (error.deleted_ids.length > 0) {
      var i, j;
      for (i = error.deleted_ids.length - 1; i >= 0; i -= 1) {
        for (j = ids.length - 1; j >= 0; j -= 1) {
          if (error.deleted_ids[i] === ids[j]) {
            ids.splice(j, 1);
          }
        }
      }

      AppDispatcher.dispatch({
        actionType: TodoConstants.TODO_DESTROY_COMPLETED,
        ids: error.deleted_ids
      });

      if (ids.length > 0) {
        AppDispatcher.dispatch({
          actionType: TodoConstants.TODO_DESTROY_COMPLETED_CANCEL,
          ids: ids
        });
      }
    }
  },

  /**
   * Delete all the errors
   */
  destroyAllError: function() {
    AppDispatcher.dispatch({
      actionType: TodoConstants.TODO_DESTROY_ALL_ERROR
    });
  }

};

module.exports = TodoActions;