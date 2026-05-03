import * as usersDal from '../dal/usersDal.js';

export const getAll = async (req, res) => {
  try {
    const users = await usersDal.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getById = async (req, res) => {
  try {
    const user = await usersDal.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const create = async (req, res) => {
  const { name, username, email, password } = req.body;
  try {
    const id = await usersDal.createUser(name, username, email, password);
    res.status(201).json({ id, name, username, email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const update = async (req, res) => {
  const { name, username, email } = req.body;
  try {
    const affected = await usersDal.updateUser(req.params.id, name, username, email);
    if (!affected) return res.status(404).json({ message: 'User not found' });
    res.json({ id: req.params.id, name, username, email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    const affected = await usersDal.deleteUser(req.params.id);
    if (!affected) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
