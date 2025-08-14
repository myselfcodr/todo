import { useState, useEffect } from "react";
import axios from "axios";

// Replace after backend deploy on Render:
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get(`${API_URL}/todos`)
      .then(res => setTodos(res.data))
      .catch(() => setError("Failed to fetch todos"))
      .finally(() => setLoading(false));
  }, []);

  async function addTodo() {
    if (!text.trim()) return;
    const res = await axios.post(`${API_URL}/todos`, { text });
    setTodos(prev => [res.data, ...prev]);
    setText("");
  }

  async function toggleTodo(id, completed) {
    const res = await axios.put(`${API_URL}/todos/${id}`, { completed: !completed });
    setTodos(prev => prev.map(t => t._id === id ? res.data : t));
  }

  async function deleteTodo(id) {
    await axios.delete(`${API_URL}/todos/${id}`);
    setTodos(prev => prev.filter(t => t._id !== id));
  }

  if (loading) return <p style={{padding: 20}}>Loading...</p>;
  if (error) return <p style={{padding: 20, color: 'red'}}>{error}</p>;

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1>✅ Todo App (MERN)</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new task..."
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map(todo => (
          <li key={todo._id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <input
              type="checkbox"
              checked={!!todo.completed}
              onChange={() => toggleTodo(todo._id, todo.completed)}
            />
            <span
              onClick={() => toggleTodo(todo._id, todo.completed)}
              style={{ textDecoration: todo.completed ? "line-through" : "none", cursor: "pointer", flex: 1 }}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
