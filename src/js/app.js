var React = require('react');

var TodoApp = require('./components/TodoApp.react');
var TodoAPIUtils = require('./utils/TodoAPIUtils');

TodoAPIUtils.getAllTodos(function() {});

React.render(
  <TodoApp />,
  document.getElementById('todo-app')
);