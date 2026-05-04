import * as commentsDal from '../dal/commentsDal.js';

export const getAll = async (req, res) => {
  try {
    const postId = req.query.postId;
    const comments = postId
      ? await commentsDal.getCommentsByPostId(postId)
      : await commentsDal.getAllComments();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getById = async (req, res) => {
  try {
    const comment = await commentsDal.getCommentById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const create = async (req, res) => {
  const { postId, userId, name, body } = req.body;
  try {
    const id = await commentsDal.createComment(postId, userId, name, body);
    res.status(201).json({ id, postId, userId, name, body });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const update = async (req, res) => {
  const { name, body, userId } = req.body;
  try {
    const comment = await commentsDal.getCommentById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.user_id != userId) return res.status(403).json({ message: 'Not authorized' });
    await commentsDal.updateComment(req.params.id, name, body);
    res.json({ id: req.params.id, name, body });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const remove = async (req, res) => {
  const { userId } = req.body;
  try {
    const comment = await commentsDal.getCommentById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.user_id != userId) return res.status(403).json({ message: 'Not authorized' });
    await commentsDal.deleteComment(req.params.id);
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
