var TodoServerActions = require('../actions/TodoServerActions');
var assign = require('object-assign');

// !!! Please Note !!!
// We are using localStorage as an example, but in a real-world scenario, this
// would involve XMLHttpRequest, or perhaps a newer client-server protocol.
// The function signatures below might be similar to what you would build, but
// the contents of the functions are just trying to simulate client-server
// communication and server-side processing.

module.exports = {

  getAllTodos: function(errorCallback) {
    // simulate retrieving data from a database
    var rawTodos = JSON.parse(localStorage.getItem('todos'));

    if (rawTodos === null) {
      rawTodos = [];
    }

    // simulate success callback
    TodoServerActions.receiveAll(rawTodos);

    /*
    jQuery.ajax({
      type: 'GET',
      url: todoServiceUrl,
      dataType: 'json',
      error: function(jqXHR, textStatus, errorThrown) {
        errorCallback(jqXHR, textStatus, errorThrown);
      },
      success: function(data) {
        TodoServerActions.receiveAll(data);
      }
    });
    */
  },

  createTodo: function(todo, successCallback, errorCallback) {
    // simulate writing to a database
    var rawTodos = JSON.parse(localStorage.getItem('todos'));

    if (rawTodos === null) {
      rawTodos = [];
    }

    var timestamp = Date.now();
    var id = 'm_' + timestamp;
    
    var createdTodo = {
      id: id,
      unique_id: todo.id,
      color: todo.color,
      title: todo.text,
      description: todo.text,
      is_completed: false,
      timestamp: timestamp
    };

    rawTodos.push(createdTodo);

    localStorage.setItem('todos', JSON.stringify(rawTodos));

    // simulate success callback
    setTimeout(function() {
      successCallback(createdTodo);
    }, 0);

    /*
    jQuery.ajax({
      type: 'POST',
      url: todoServiceUrl,
      data: todo,
      dataType: 'json',
      error: function(jqXHR) {
        var error;
        if (typeof jqXHR.responseJSON != 'undefined') {
          error = jqXHR.responseJSON;
        }

        errorCallback(todo.id, error);
      },
      success: function(data) {
        successCallback(data);
      }
    });
    */
  },

  updateTodo: function(id, previousData, newData, successCallback, errorCallback) {
    // simulate updating to a database
    var rawTodos = JSON.parse(localStorage.getItem('todos'));

    if (rawTodos === null) {
      rawTodos = [];
    }

    var i = 0;
    for (i = 0; i < rawTodos.length; i++) {
      if (rawTodos[i].unique_id == id) {
        rawTodos[i].color = newData.color;
        rawTodos[i].text = newData.text;
        rawTodos[i].description = newData.text;
      }
    }

    localStorage.setItem('todos', JSON.stringify(rawTodos));

    // simulate success callback
    setTimeout(function() {
      successCallback(id, newData);
    }, 0);

    /*
    jQuery.ajax({
      type: 'PATCH',
      url: todoServiceUrl + '/task/' + id,
      data: newData,
      dataType: 'json',
      error: function(jqXHR) {
        var error;
        if (typeof jqXHR.responseJSON != 'undefined') {
          error = jqXHR.responseJSON;
        }

        errorCallback(id, previousData, error);
      },
      success: function(data) {
        successCallback(id, newData);
      }
    });
    */
  },

  setCompleteState: function(id, errorCallback) {
    this.toggleCompleteState(id, true, errorCallback);
  },

  setUndoCompleteState: function(id, errorCallback) {
    this.toggleCompleteState(id, false, errorCallback);
  },

  toggleCompleteState: function(id, isCompleted, errorCallback) {
    // simulate updating to a database
    var rawTodos = JSON.parse(localStorage.getItem('todos'));

    var i = 0;
    for (i = 0; i < rawTodos.length; i++) {
      if (rawTodos[i].unique_id == id) {
        rawTodos[i].is_completed = isCompleted;
      }
    }

    localStorage.setItem('todos', JSON.stringify(rawTodos));

    /*
    jQuery.ajax({
      type: 'PATCH',
      url: todoServiceUrl + '/task/' + id,
      data: {
        is_completed: isCompleted
      },
      dataType: 'json',
      error: function(jqXHR) {
        var error;
        if (typeof jqXHR.responseJSON != 'undefined') {
          error = jqXHR.responseJSON;
        }

        errorCallback(id, error);
      }
    });
    */
  },

  destroyTodo: function(id, successCallback, errorCallback) {
    // simulate deleting to a database
    var rawTodos = JSON.parse(localStorage.getItem('todos'));

    var i = 0;
    for (i = 0; i < rawTodos.length; i++) {
      if (rawTodos[i].unique_id == id) {
        rawTodos.splice(i, 1);
      }
    }

    localStorage.setItem('todos', JSON.stringify(rawTodos));

    // simulate success callback
    setTimeout(function() {
      successCallback(id);
    }, 0);

    /*
    jQuery.ajax({
      type: 'DELETE',
      url: todoServiceUrl + '/task/' + id,
      dataType: 'json',
      error: function(jqXHR, error) {
        var error;
        if (typeof jqXHR.responseJSON != 'undefined') {
          error = jqXHR.responseJSON;
        }

        errorCallback(id, error);
      },
      success: function() {
        successCallback(id);
      }
    });
    */
  },

  destroyCompletedTodo: function(ids, successCallback, errorCallback) {
    // simulate deleting to a database
    var rawTodos = JSON.parse(localStorage.getItem('todos'));

    console.log(rawTodos);
    var i = 0;
    var j = 0;
    for (i = 0; i < rawTodos.length; i++) {
      for (j = 0; j < ids.length; j++) {
        if (rawTodos[i].unique_id == ids[j]) {
          rawTodos.splice(i, 1);
        }
      }
    }

    localStorage.setItem('todos', JSON.stringify(rawTodos));

    // simulate success callback
    setTimeout(function() {
      successCallback(ids);
    }, 0);

    /*
    jQuery.ajax({
      type: 'DELETE',
      url: todoServiceUrl + '/tasks',
      data: {ids: ids},
      dataType: 'json',
      error: function(jqXHR, error) {
        var error;
        if (typeof jqXHR.responseJSON != 'undefined') {
          error = jqXHR.responseJSON;
        }

        errorCallback(ids, error);
      },
      success: function(data) {
        successCallback(data);
      }
    });
    */
  }

};