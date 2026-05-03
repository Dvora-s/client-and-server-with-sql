import pool from '../config/db.js';

export const getAllUsers = async () => {
  const [rows] = await pool.query('SELECT id, name, username, email FROM users');
  return rows;
};

export const getUserById = async (id) => {
  const [rows] = await pool.query('SELECT id, name, username, email FROM users WHERE id = ?', [id]);
  return rows[0];
};

export const createUser = async (name, username, email, password) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.query('INSERT INTO users (name, username, email) VALUES (?, ?, ?)', [name, username, email]);
    await conn.query('INSERT INTO passwords (user_id, password) VALUES (?, ?)', [result.insertId, password]);
    await conn.commit();
    return result.insertId;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const updateUser = async (id, name, username, email) => {
  const [result] = await pool.query(
    'UPDATE users SET name = ?, username = ?, email = ? WHERE id = ?',
    [name, username, email, id]
  );
  return result.affectedRows;
};

export const deleteUser = async (id) => {
  const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows;
};
