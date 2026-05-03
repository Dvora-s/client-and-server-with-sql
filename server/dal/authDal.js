import pool from '../config/db.js';

export const getUserByUsername = async (username) => {
  const [rows] = await pool.query(
    'SELECT u.*, p.password FROM users u JOIN passwords p ON u.id = p.user_id WHERE u.username = ?',
    [username]
  );
  return rows[0];
};
