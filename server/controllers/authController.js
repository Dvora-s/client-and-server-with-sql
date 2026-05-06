import jwt from 'jsonwebtoken';
import { getUserByUsername } from '../dal/authDal.js';
import { createUser } from '../dal/usersDal.js';

const signToken = (user) =>
  jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '24h' });

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await getUserByUsername(username);
    if (!user || user.password !== password)
      return res.status(401).json({ message: 'Invalid username or password' });
    const { password: _, ...userWithoutPassword } = user;
    const token = signToken(user);
    res.json({ ...userWithoutPassword, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const register = async (req, res) => {
  const { name, username, email, password, phone, address } = req.body;
  try {
    const existing = await getUserByUsername(username);
    if (existing) return res.status(409).json({ message: 'Username already taken' });
    const id = await createUser(name, username, email, password, phone, address);
    const user = await getUserByUsername(username);
    const { password: _, ...userWithoutPassword } = user;
    const token = signToken(user);
    res.status(201).json({ ...userWithoutPassword, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
