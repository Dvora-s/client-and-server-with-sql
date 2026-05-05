import pool from '../config/db.js';
import { getPaginated, getCount } from './paginationDal.js';

export const getAllTodos = async () => {
  const [rows] = await pool.query('SELECT * FROM todos ORDER BY id');
  return rows;
};

export const getTodosByUserId = (userId, search = '', sort = 'id', limit = 5, offset = 0) => {
  const validSorts = { id: 'id', title: 'title', date: 'created_at', completed: 'completed' };
  const orderBy = validSorts[sort] || 'id';
  return getPaginated('todos', 'user_id = ? AND title LIKE ?', [userId, `%${search}%`], orderBy, limit, offset);
};

export const countTodosByUserId = (userId, search = '') =>
  getCount('todos', 'user_id = ? AND title LIKE ?', [userId, `%${search}%`]);

export const getTodoById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM todos WHERE id = ?', [id]);
  return rows[0];
};

export const createTodo = async (userId, title, completed = false) => {
  const [result] = await pool.query(
    'INSERT INTO todos (user_id, title, completed) VALUES (?, ?, ?)',
    [userId, title, completed]
  );
  return result.insertId;
};

export const updateTodo = async (id, title, completed) => {
  const [result] = await pool.query(
    'UPDATE todos SET title = ?, completed = ? WHERE id = ?',
    [title, completed, id]
  );
  return result.affectedRows;
};

export const deleteTodo = async (id) => {
  const [result] = await pool.query('DELETE FROM todos WHERE id = ?', [id]);
  return result.affectedRows;
};
