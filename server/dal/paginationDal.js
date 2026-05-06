import pool from '../config/db.js';

const ALLOWED_TABLES = ['posts', 'todos']
const ALLOWED_ORDER = ['id', 'id DESC', 'title', 'created_at', 'completed', 'user_id']

export const getPaginated = async (table, where, params, orderBy, limit, offset) => {
  if (!ALLOWED_TABLES.includes(table)) throw new Error('Invalid table')
  if (!ALLOWED_ORDER.includes(orderBy)) throw new Error('Invalid order')
  const [rows] = await pool.query(
    `SELECT * FROM ${table} WHERE ${where} ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
    [...params, parseInt(limit), parseInt(offset)]
  );
  return rows;
};

export const getCount = async (table, where, params) => {
  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) as total FROM ${table} WHERE ${where}`,
    params
  );
  return total;
};
