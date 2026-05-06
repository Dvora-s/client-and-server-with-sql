import * as postsDal from '../dal/postsDal.js';
import { getCache, setCache, clearCache } from '../cache.js';

export const getAll = async (req, res) => {
  try {
<<<<<<< HEAD
    const { userId, search = '', filterUserId = '', page = 1 } = req.query;
    const key = `posts_${userId}_${search}_${filterUserId}_${page}`;
    if (getCache(key)) return res.json(getCache(key));
    const limit = 5;
    const offset = (parseInt(page) - 1) * limit;
    let result;
=======
    const {
      userId,
      _limit = 5,
      _page = 1,
      _sort = 'id',
      _order = 'DESC',
      ...filters
    } = req.query;

    const limit = parseInt(_limit);
    const offset = (parseInt(_page) - 1) * limit;
    const search = filters.q || filters.title_like || '';
    const filterUserId = filters.user_id || filters.filterUserId || '';

>>>>>>> 94c3a3b58b7481d0a28878c13902ebf13bbd4e04
    if (userId) {
      const posts = await postsDal.getPostsByUserId(userId, search);
      result = { posts, total: posts.length };
    } else {
      const [posts, total] = await Promise.all([
        postsDal.getAllPosts(search, filterUserId, limit, offset),
        postsDal.countAllPosts(search, filterUserId)
      ]);
      result = { posts, total };
    }
<<<<<<< HEAD
    setCache(key, result);
    res.json(result);
=======

    const [posts, total] = await Promise.all([
      postsDal.getAllPosts(search, filterUserId, _sort, _order, limit, offset),
      postsDal.countAllPosts(search, filterUserId)
    ]);

    res.set('X-Total-Count', total);
    res.json({ posts, total });
>>>>>>> 94c3a3b58b7481d0a28878c13902ebf13bbd4e04
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
