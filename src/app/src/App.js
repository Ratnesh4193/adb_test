// src/App.js
import React from "react";
import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";
import useTodos from "./hooks/useTodos";
import "./App.css";

const App = () => {
  const { todos, loading, error, addTodo, toggleTodo, deleteTodo } = useTodos();

  return (
    <div className="todo-container">
      {loading ? (
        <div>
          <h1>Loading...</h1>
        </div>
      ) : error ? (
        <div>
          <h1>{error.message}</h1>
        </div>
      ) : (
        <>
          <TodoForm addTodo={addTodo} />
          <TodoList
            todos={todos}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
          />
        </>
      )}
    </div>
  );
};

export default App;
