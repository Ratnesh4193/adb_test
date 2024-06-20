// src/hooks/useTodos.js
import { useState, useEffect } from "react";

const API_URL = "http://localhost:8000/todos";

const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllTodos = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (text) => {
    const newTodo = { id: Date.now(), text, completed: false };
    console.log(newTodo);
    try {
      const response = await fetch(`${API_URL}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      await response.json();
      setTodos([...todos, newTodo]);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (id) => {
    const todo = todos.find((todo) => todo.id === id);

    if (!todo) return;

    const updatedTodo = { ...todo, completed: !todo.completed };

    try {
      const response = await fetch(`${API_URL}/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTodo),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      await response.json();
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTodos();
  }, []);

  return { todos, loading, error, addTodo, toggleTodo, deleteTodo };
};

export default useTodos;
