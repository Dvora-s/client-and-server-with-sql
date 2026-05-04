import pool from '../config/db.js';

export const getAllPosts = async (search = '') => {
  const [rows] = await pool.query(
    'SELECT * FROM posts WHERE title LIKE ? OR body LIKE ? ORDER BY id',
    [`%${search}%`, `%${search}%`]
  );
  return rows;
};

export const getPostsByUserId = async (userId, search = '') => {
  const [rows] = await pool.query(
    'SELECT * FROM posts WHERE user_id = ? AND (title LIKE ? OR body LIKE ?) ORDER BY id',
    [userId, `%${search}%`, `%${search}%`]
  );
  return rows;
};

export const getPostById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM posts WHERE id = ?', [id]);
  return rows[0];
};

export const createPost = async (userId, title, body) => {
  const [result] = await pool.query(
    'INSERT INTO posts (user_id, title, body) VALUES (?, ?, ?)',
    [userId, title, body]
  );
  return result.insertId;
};

export const updatePost = async (id, title, body) => {
  const [result] = await pool.query(
    'UPDATE posts SET title = ?, body = ? WHERE id = ?',
    [title, body, id]
  );
  return result.affectedRows;
};

export const deletePost = async (id) => {
  const [result] = await pool.query('DELETE FROM posts WHERE id = ?', [id]);
  return result.affectedRows;
};
