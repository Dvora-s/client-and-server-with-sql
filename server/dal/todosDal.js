import pool from '../config/db.js';

export const getTodosByUserId = async (userId, search = '', sort = 'id', order = 'ASC', limit = 10, offset = 0, completed) => {
  const validSorts = { id: 'id', title: 'title', date: 'created_at', completed: 'completed', created_at: 'created_at' };
  const orderBy = validSorts[sort] || 'id';
  const dir = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  let where = 'user_id = ? AND title LIKE ?';
  let params = [userId, `%${search}%`];
  if (completed !== undefined && completed !== '') {
    where += ' AND completed = ?';
    params.push(completed === 'true' ? 1 : 0);
  }
  const [rows] = await pool.query(
    `SELECT * FROM todos WHERE ${where} ORDER BY ${orderBy} ${dir} LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );
  return rows;
};

export const countTodosByUserId = async (userId, search = '', completed) => {
  let where = 'user_id = ? AND title LIKE ?';
  let params = [userId, `%${search}%`];
  if (completed !== undefined && completed !== '') {
    where += ' AND completed = ?';
    params.push(completed === 'true' ? 1 : 0);
  }
  const [[{ total }]] = await pool.query(`SELECT COUNT(*) as total FROM todos WHERE ${where}`, params);
  return total;
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
