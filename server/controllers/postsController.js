import * as postsDal from '../dal/postsDal.js';
import { getCache, setCache, clearCache } from '../cache.js';

export const getAll = async (req, res) => {
  try {
    const { userId, search = '', filterUserId = '', sort = 'id', page = 1 } = req.query;
    const key = `posts_${userId}_${search}_${filterUserId}_${sort}_${page}`;
    if (getCache(key)) return res.json(getCache(key));
    const limit = 5;
    const offset = (parseInt(page) - 1) * limit;
    let result;
    if (userId) {
      const posts = await postsDal.getPostsByUserId(userId, search);
      result = { posts, total: posts.length };
    } else {
      const [posts, total] = await Promise.all([
        postsDal.getAllPosts(search, filterUserId, sort, 'DESC', limit, offset),
        postsDal.countAllPosts(search, filterUserId)
      ]);
      result = { posts, total };
    }
    setCache(key, result);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getById = async (req, res) => {
  try {
    const post = await postsDal.getPostById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const create = async (req, res) => {
  const { userId, title, body } = req.body;
  try {
    const id = await postsDal.createPost(userId, title, body);
    clearCache('posts_');
    res.status(201).json({ id, userId, title, body });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const update = async (req, res) => {
  const { title, body, userId } = req.body;
  try {
    const affected = await postsDal.updatePostIfOwner(req.params.id, userId, title, body);
    if (affected === null) return res.status(404).json({ message: 'Post not found' });
    if (affected === false) return res.status(403).json({ message: 'Not authorized' });
    clearCache('posts_');
    res.json({ id: req.params.id, title, body });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const remove = async (req, res) => {
  const { userId } = req.body;
  try {
    const affected = await postsDal.deletePostIfOwner(req.params.id, userId);
    if (affected === null) return res.status(404).json({ message: 'Post not found' });
    if (affected === false) return res.status(403).json({ message: 'Not authorized' });
    clearCache('posts_');
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
