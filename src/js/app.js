/*
 * This file is part of the Keys Digital Delivery
 *
 * Author: Sulaeman <me@sulaeman.com>.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
 
var React = require('react');

var TodoApp = require('./components/TodoApp.react');
var TodoAPIUtils = require('./utils/TodoAPIUtils');

TodoAPIUtils.getAllTodos(function() {});

React.render(
  <TodoApp />,
  document.getElementById('todo-app')
);