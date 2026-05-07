import * as commentsDal from '../dal/commentsDal.js';
import { getCache, setCache, clearCache } from '../cache.js';

export const getAll = async (req, res) => {
  try {
    const { postId } = req.query;
    if (!postId) return res.status(400).json({ message: 'postId is required' });
    const key = `comments_${postId}`;
    if (getCache(key)) return res.json(getCache(key));
    const comments = await commentsDal.getCommentsByPostId(postId);
    setCache(key, comments);
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const create = async (req, res) => {
  const { postId, userId, name, body } = req.body;
  try {
    const id = await commentsDal.createComment(postId, userId, name, body);
    clearCache('comments_');
    res.status(201).json({ id, post_id: postId, user_id: userId, name, body });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const update = async (req, res) => {
  const { name, body, userId } = req.body;
  try {
    const affected = await commentsDal.updateCommentIfOwner(req.params.id, userId, name, body);
    if (affected === null) return res.status(404).json({ message: 'Comment not found' });
    if (affected === false) return res.status(403).json({ message: 'Not authorized' });
    clearCache('comments_');
    res.json({ id: req.params.id, name, body });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const remove = async (req, res) => {
  const { userId } = req.body;
  try {
    const affected = await commentsDal.deleteCommentIfOwner(req.params.id, userId);
    if (affected === null) return res.status(404).json({ message: 'Comment not found' });
    if (affected === false) return res.status(403).json({ message: 'Not authorized' });
    clearCache('comments_');
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
