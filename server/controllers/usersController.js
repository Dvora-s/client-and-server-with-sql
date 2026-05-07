import * as usersDal from '../dal/usersDal.js';
import { getCache, clearCache } from '../cache.js';

export const update = async (req, res) => {
  const { name, username, email } = req.body;
  if (req.user.id != req.params.id)
    return res.status(403).json({ message: 'Not authorized' });
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
  if (req.user.id != req.params.id)
    return res.status(403).json({ message: 'Not authorized' });
  try {
    const affected = await usersDal.deleteUser(req.params.id);
    if (!affected) return res.status(404).json({ message: 'User not found' });
    clearCache('users_');
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
