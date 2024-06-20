import React, { useState } from "react";
import "./TodoForm.css";

const TodoForm = ({ addTodo }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      addTodo(input);
      setInput("");
    }
  };

  return (
    <div className="todo-search">
      <form
        onSubmit={(e) => {
          if (input !== "") handleSubmit(e);
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new todo"
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default TodoForm;
