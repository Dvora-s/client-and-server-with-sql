import * as usersDal from '../dal/usersDal.js';
import { getCache, setCache, clearCache } from '../cache.js';

export const getAll = async (req, res) => {
  try {
    if (getCache('users_all')) return res.json(getCache('users_all'));
    const users = await usersDal.getAllUsers();
    setCache('users_all', users);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getById = async (req, res) => {
  try {
    const key = `users_${req.params.id}`;
    if (getCache(key)) return res.json(getCache(key));
    const user = await usersDal.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    setCache(key, user);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const update = async (req, res) => {
  const { name, username, email } = req.body;
  try {
    const affected = await usersDal.updateUser(req.params.id, name, username, email);
    if (!affected) return res.status(404).json({ message: 'User not found' });
    clearCache('users_');
    res.json({ id: req.params.id, name, username, email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    const affected = await usersDal.deleteUser(req.params.id);
    if (!affected) return res.status(404).json({ message: 'User not found' });
    clearCache('users_');
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
