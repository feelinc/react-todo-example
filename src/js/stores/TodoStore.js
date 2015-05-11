var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var TodoConstants = require('../constants/TodoConstants');
var TodoUtils = require('../utils/TodoUtils');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _todos = {};

/**
 * Add list of raw TODO item.
 * @param  {string} id
 * @param {object} updates An object literal containing only the data to be
 *     updated.
 */
function addTodos(rawTodos) {
  rawTodos.forEach(function(todo) {
    if (!_todos[todo.unique_id]) {
      _todos[todo.unique_id] = TodoUtils.convertRawTodo(todo);
    }
  });
}

/**
 * Update a TODO item.
 * @param  {string} id
 * @param {object} updates An object literal containing only the data to be
 *     updated.
 */
function update(id, updates) {
  _todos[id] = assign({}, _todos[id], updates);
}

/**
 * Update all of the TODO items with the same object.
 *     the data to be updated.  Used to mark all TODOs as completed.
 * @param  {object} updates An object literal containing only the data to be
 *     updated.
 */
function updateAll(updates) {
  for (var id in _todos) {
    update(id, updates);
  }
}

/**
 * Delete a TODO item.
 * @param  {string} id
 */
function destroy(id) {
  delete _todos[id];
}

/**
 * Delete all the completed TODO items.
 * @param  {array} deletedIds
 */
function destroyCompleted(deletedIds) {
  for (var id in deletedIds) {
    if (_todos[deletedIds[id]].complete) {
      destroy(deletedIds[id]);
    }
  }
}

/**
 * Change isDeleting state for all completed TODO items.
 */
function destroyCompletedRequest() {
  for (var id in _todos) {
    if (_todos[id].complete) {
      update(id, {isDeleting: true});
    }
  }
}

/**
 * Delete all the completed TODO items.
 * @param  {array} deletedIds
 */
function destroyCompletedCancel(ids) {
  for (var id in ids) {
    update(ids[id], {isDeleting: false});
  }
}

var TodoStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  getAll: function() {
    return _todos;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  /**
   * Get a TODO item.
   * @param  {string} id The ID of the TODO
   * @param  {string} color The color of the TODO
   * @param  {string} text The content of the TODO
   */
  getCreatedData: function(id, color, text) {
    return {
      id: id,
      complete: false,
      color: color,
      text: text
    };
  }
});

// Register callback to handle all updates
TodoStore.dispatchToken = AppDispatcher.register(function(action) {
  var text;

  switch(action.actionType) {
    case TodoConstants.TODO_CREATE:
      id = action.id;
      color = action.color.trim();
      text = action.text.trim();
      if (id !== '' && color !== '' && text !== '') {
        todo = TodoStore.getCreatedData(id, color, text);
        _todos[id] = todo;
        TodoStore.emitChange();
      }
      break;

    case TodoConstants.TODO_TOGGLE_COMPLETE_ALL:
      if (TodoStore.areAllComplete()) {
        updateAll({complete: false});
      } else {
        updateAll({complete: true});
      }
      TodoStore.emitChange();
      break;

    case TodoConstants.TODO_UNDO_COMPLETE:
      update(action.id, {complete: false});
      TodoStore.emitChange();
      break;

    case TodoConstants.TODO_COMPLETE:
      update(action.id, {complete: true});
      TodoStore.emitChange();
      break;

    case TodoConstants.TODO_UPDATE_TEXT:
      color = action.color.trim();
      text = action.text.trim();
      isSaving = action.isSaving;
      if (color !== '' && text !== '') {
        update(action.id, {color: color, text: text, isSaving: isSaving});
        TodoStore.emitChange();
      }
      break;

    case TodoConstants.TODO_UPDATE_TEXT_SUCCESS:
      update(action.id, {isSaving: false});
      TodoStore.emitChange();
      break;

    case TodoConstants.TODO_DESTROY:
      destroy(action.id);
      TodoStore.emitChange();
      break;

    case TodoConstants.TODO_DESTROY_CANCEL:
      update(action.id, {isDeleting: false});
      TodoStore.emitChange();
      break;

    case TodoConstants.TODO_DESTROY_COMPLETED_REQUEST:
      destroyCompletedRequest();
      TodoStore.emitChange();
      break;

    case TodoConstants.TODO_DESTROY_COMPLETED:
      destroyCompleted(action.ids);
      TodoStore.emitChange();
      break;

    case TodoConstants.TODO_DESTROY_COMPLETED_CANCEL:
      destroyCompletedCancel(action.ids);
      TodoStore.emitChange();
      break;

    case TodoConstants.TODO_RECEIVE_RAW_ALL:
      addTodos(action.rawTodos);
      TodoStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = TodoStore;