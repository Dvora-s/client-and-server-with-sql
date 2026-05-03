import * as todosDal from '../dal/todosDal.js';

export const getAll = async (req, res) => {
  try {
    const userId = req.query.userId;
    const todos = userId
      ? await todosDal.getTodosByUserId(userId)
      : await todosDal.getAllTodos();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getById = async (req, res) => {
  try {
    const todo = await todosDal.getTodoById(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const create = async (req, res) => {
  const { userId, title, completed } = req.body;
  try {
    const id = await todosDal.createTodo(userId, title, completed);
    res.status(201).json({ id, userId, title, completed: completed || false });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const update = async (req, res) => {
  const { title, completed } = req.body;
  try {
    const affected = await todosDal.updateTodo(req.params.id, title, completed);
    if (!affected) return res.status(404).json({ message: 'Todo not found' });
    res.json({ id: req.params.id, title, completed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    const affected = await todosDal.deleteTodo(req.params.id);
    if (!affected) return res.status(404).json({ message: 'Todo not found' });
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
