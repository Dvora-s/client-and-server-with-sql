import pool from '../config/db.js';

export const getAllPosts = async (search = '', filterUserId = '', limit = 5, offset = 0) => {
  let where = '(title LIKE ? OR body LIKE ?)'
  let params = [`%${search}%`, `%${search}%`]
  if (filterUserId) { where += ' AND user_id = ?'; params.push(filterUserId) }
  const [rows] = await pool.query(`SELECT * FROM posts WHERE ${where} ORDER BY id DESC LIMIT ? OFFSET ?`, [...params, limit, offset]);
  return rows;
};

export const countAllPosts = async (search = '', filterUserId = '') => {
  let where = '(title LIKE ? OR body LIKE ?)'
  let params = [`%${search}%`, `%${search}%`]
  if (filterUserId) { where += ' AND user_id = ?'; params.push(filterUserId) }
  const [rows] = await pool.query(`SELECT COUNT(*) as count FROM posts WHERE ${where}`, params);
  return rows[0].count;
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
