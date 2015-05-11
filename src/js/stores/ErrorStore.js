var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var TodoConstants = require('../constants/TodoConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _errors = {};

/**
 * Create a error item.
 * @param  {string} code
 * @param  {string} text
 */
function create(code, text) {
  _errors[code] = {
    code: code, 
    text: text
  };
}

/**
 * Delete a error item.
 * @param  {string} code
 */
function destroy(code) {
  delete _errors[code];
}

/**
 * Delete all the error items.
 */
function destroyAll() {
  for (var code in _errors) {
    destroy(code);
  }
}

var ErrorStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  getAll: function() {
    return _errors;
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
  }
});

// Register callback to handle all updates
ErrorStore.dispatchToken = AppDispatcher.register(function(action) {
  var code, text;

  switch(action.actionType) {
    case TodoConstants.TODO_CREATE_ERROR:
      code = action.code;
      text = action.text.trim();
      if (code !== '' && text !== '') {
        create(code, text);
        ErrorStore.emitChange();
      }
      break;

    case TodoConstants.TODO_DESTROY_ERROR:
      destroy(action.code);
      ErrorStore.emitChange();
      break;

    case TodoConstants.TODO_DESTROY_ALL_ERROR:
      destroyAll();
      ErrorStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = ErrorStore;