import * as postsDal from '../dal/postsDal.js';

export const getAll = async (req, res) => {
  try {
    const { userId, search = '', page = 1 } = req.query;
    const limit = 5;
    const offset = (parseInt(page) - 1) * limit;
    if (userId) {
      const posts = await postsDal.getPostsByUserId(userId, search);
      return res.json({ posts, total: posts.length });
    }
    const [posts, total] = await Promise.all([
      postsDal.getAllPosts(search, limit, offset),
      postsDal.countAllPosts(search)
    ]);
    res.json({ posts, total });
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
    res.status(201).json({ id, userId, title, body });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const update = async (req, res) => {
  const { title, body, userId } = req.body;
  try {
    const post = await postsDal.getPostById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.user_id != userId) return res.status(403).json({ message: 'Not authorized' });
    await postsDal.updatePost(req.params.id, title, body);
    res.json({ id: req.params.id, title, body });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const remove = async (req, res) => {
  const { userId } = req.body;
  try {
    const post = await postsDal.getPostById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.user_id != userId) return res.status(403).json({ message: 'Not authorized' });
    await postsDal.deletePost(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
