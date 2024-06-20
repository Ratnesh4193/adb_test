import React from "react";
import "./TodoItem.css";
import { AiFillDelete } from "react-icons/ai";

const TodoItem = ({ todo, toggleTodo, deleteTodo }) => {
  return (
    <div className="todo-list-item">
      <div className="task">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={(e) => toggleTodo(todo.id)}
        />
        <p id="t_task" className={todo.completed ? "strike" : ""}>
          {todo.text}
        </p>
      </div>
      <div className="btn-container">
        <div className="del">
          <AiFillDelete size={25} onClick={() => deleteTodo(todo.id)} />
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
