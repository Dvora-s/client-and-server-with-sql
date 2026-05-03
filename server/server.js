import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import todosRoutes from './routes/todos.js';
import postsRoutes from './routes/posts.js';
import commentsRoutes from './routes/comments.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/todos', todosRoutes);
app.use('/posts', postsRoutes);
app.use('/comments', commentsRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
