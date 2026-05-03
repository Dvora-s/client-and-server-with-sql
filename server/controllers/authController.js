import { getUserByUsername } from '../dal/authDal.js';
import { createUser } from '../dal/usersDal.js';

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await getUserByUsername(username);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const register = async (req, res) => {
  const { name, username, email, password } = req.body;
  try {
    const existing = await getUserByUsername(username);
    if (existing) return res.status(409).json({ message: 'Username already taken' });
    const id = await createUser(name, username, email, password);
    res.status(201).json({ id, name, username, email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
