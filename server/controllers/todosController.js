import * as todosDal from '../dal/todosDal.js';
import { getCache, setCache, clearCache } from '../cache.js';

export const getAll = async (req, res) => {
  try {
    const { userId, search = '', sort = 'id', page = 1 } = req.query;
    if (!userId) return res.status(400).json({ message: 'userId is required' });
    const key = `todos_${userId}_${search}_${sort}_${page}`;
    if (getCache(key)) return res.json(getCache(key));
    const limit = 5;
    const offset = (parseInt(page) - 1) * limit;
    const [todos, total] = await Promise.all([
      todosDal.getTodosByUserId(userId, search, sort, 'ASC', limit, offset),
      todosDal.countTodosByUserId(userId, search)
    ]);
    const result = { todos, total };
    setCache(key, result);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const create = async (req, res) => {
  const { userId, title, completed } = req.body;
  try {
    const id = await todosDal.createTodo(userId, title, completed);
    clearCache('todos_');
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
    clearCache('todos_');
    res.json({ id: req.params.id, title, completed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    const affected = await todosDal.deleteTodo(req.params.id);
    if (!affected) return res.status(404).json({ message: 'Todo not found' });
    clearCache('todos_');
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
