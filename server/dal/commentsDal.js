import pool from '../config/db.js';

export const getCommentsByPostId = async (postId) => {
  const [rows] = await pool.query('SELECT * FROM comments WHERE post_id = ? ORDER BY id', [postId]);
  return rows;
};

export const createComment = async (postId, userId, name, body) => {
  const [result] = await pool.query(
    'INSERT INTO comments (post_id, user_id, name, body) VALUES (?, ?, ?, ?)',
    [postId, userId, name, body]
  );
  return result.insertId;
};

export const updateCommentIfOwner = async (id, userId, name, body) => {
  const [check] = await pool.query('SELECT user_id FROM comments WHERE id = ?', [id]);
  if (!check[0]) return null;
  if (check[0].user_id != userId) return false;
  await pool.query('UPDATE comments SET name = ?, body = ? WHERE id = ?', [name, body, id]);
  return true;
};

export const deleteCommentIfOwner = async (id, userId) => {
  const [check] = await pool.query('SELECT user_id FROM comments WHERE id = ?', [id]);
  if (!check[0]) return null;
  if (check[0].user_id != userId) return false;
  await pool.query('DELETE FROM comments WHERE id = ?', [id]);
  return true;
};
