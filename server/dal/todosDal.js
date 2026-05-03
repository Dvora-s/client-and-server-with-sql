import pool from '../config/db.js';

export const getAllTodos = async () => {
  const [rows] = await pool.query('SELECT * FROM todos ORDER BY id');
  return rows;
};

export const getTodosByUserId = async (userId) => {
  const [rows] = await pool.query('SELECT * FROM todos WHERE user_id = ? ORDER BY id', [userId]);
  return rows;
};

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
