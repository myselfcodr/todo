const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Todo = require("./models/Todo");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Todo API is running" });
});

// Routes
app.get("/todos", async (_req, res) => {
  const todos = await Todo.find().sort({ createdAt: -1 });
  res.json(todos);
});

app.post("/todos", async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: "Text is required" });
  const todo = await Todo.create({ text: text.trim() });
  res.status(201).json(todo);
});

app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const update = {};
  if (typeof req.body.text === "string") update.text = req.body.text;
  if (typeof req.body.completed === "boolean") update.completed = req.body.completed;
  const todo = await Todo.findByIdAndUpdate(id, update, { new: true });
  if (!todo) return res.status(404).json({ error: "Not found" });
  res.json(todo);
});

app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const deleted = await Todo.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ error: "Not found" });
  res.json({ message: "Deleted" });
});

// DB + Server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ Missing MONGO_URI in environment variables");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Mongo connection error:", err.message);
    process.exit(1);
  });
