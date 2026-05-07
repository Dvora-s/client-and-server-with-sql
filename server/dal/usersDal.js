import pool from '../config/db.js';

export const createUser = async (name, username, email, password, phone, address) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.query(
      'INSERT INTO users (name, username, email, phone, address) VALUES (?, ?, ?, ?, ?)',
      [name, username, email, phone, address]
    );
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

export const deleteUser = async (id) => {
  const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows;
};
