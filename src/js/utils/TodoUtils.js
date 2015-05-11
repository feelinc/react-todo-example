module.exports = {

  convertRawTodo: function(rawTodo) {
    return {
      id: rawTodo.unique_id,
      isSaving: false,
      isDeleting: false,
      color: rawTodo.color,
      text: rawTodo.description,
      complete: rawTodo.is_completed
    };
  }

};