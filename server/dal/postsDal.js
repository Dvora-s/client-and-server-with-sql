import pool from '../config/db.js';

export const getAllPosts = async (search = '', filterUserId = '', sort = 'id', order = 'DESC', limit = 5, offset = 0) => {
  const validSorts = { id: 'id', title: 'title', user: 'user_id', user_id: 'user_id' };
  const orderBy = validSorts[sort] || 'id';
  const dir = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  let where = '(title LIKE ? OR body LIKE ?)';
  let params = [`%${search}%`, `%${search}%`];
  if (filterUserId) { where += ' AND user_id = ?'; params.push(filterUserId); }
  const [rows] = await pool.query(
    `SELECT * FROM posts WHERE ${where} ORDER BY ${orderBy} ${dir} LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );
  return rows;
};

export const countAllPosts = async (search = '', filterUserId = '') => {
  let where = '(title LIKE ? OR body LIKE ?)';
  let params = [`%${search}%`, `%${search}%`];
  if (filterUserId) { where += ' AND user_id = ?'; params.push(filterUserId); }
  const [[{ total }]] = await pool.query(`SELECT COUNT(*) as total FROM posts WHERE ${where}`, params);
  return total;
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

export const updatePostIfOwner = async (id, userId, title, body) => {
  const [check] = await pool.query('SELECT user_id FROM posts WHERE id = ?', [id]);
  if (!check[0]) return null;
  if (check[0].user_id != userId) return false;
  await pool.query('UPDATE posts SET title = ?, body = ? WHERE id = ?', [title, body, id]);
  return true;
};

export const deletePostIfOwner = async (id, userId) => {
  const [check] = await pool.query('SELECT user_id FROM posts WHERE id = ?', [id]);
  if (!check[0]) return null;
  if (check[0].user_id != userId) return false;
  await pool.query('DELETE FROM posts WHERE id = ?', [id]);
  return true;
};
