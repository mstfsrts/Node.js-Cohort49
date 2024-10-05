import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import newDatabase from './database.js';

const SECRET_KEY = 'your_jwt_secret_key';
const database = newDatabase({ isPersistent: false });

export const register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = database.create({ username, password: hashedPassword });

  res.status(201).json({ id: user.id, username: user.username });
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  const user = database.getById(username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
  res.status(201).json({ token });
};

export const getProfile = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = database.getById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ username: user.username });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const logout = (req, res) => {
  res.status(204).send();
};
