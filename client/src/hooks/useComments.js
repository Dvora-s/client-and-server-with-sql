import { useState } from 'react'
import { getComments, addComment, updateComment, deleteComment } from '../services/api'

export const useComments = (userId, username) => {
  const [comments, setComments] = useState({})
  const [openComments, setOpenComments] = useState({})
  const [newComment, setNewComment] = useState({})
  const [editComment, setEditComment] = useState(null)

  const toggleComments = async (postId) => {
    if (openComments[postId]) {
      setOpenComments(prev => ({ ...prev, [postId]: false }))
      return
    }
    const { data } = await getComments(postId)
    setComments(prev => ({ ...prev, [postId]: data }))
    setOpenComments(prev => ({ ...prev, [postId]: true }))
  }

  const handleAddComment = async (postId) => {
    const body = newComment[postId]
    if (!body?.trim()) return
    const { data } = await addComment(postId, userId, username, body.trim())
    setComments(prev => ({ ...prev, [postId]: [...(prev[postId] || []), data] }))
    setNewComment(prev => ({ ...prev, [postId]: '' }))
  }

  const handleUpdateComment = async (comment) => {
    await updateComment(comment.id, editComment.name, editComment.body, userId)
    setComments(prev => ({
      ...prev,
      [comment.post_id]: prev[comment.post_id].map(c =>
        c.id === comment.id ? { ...c, ...editComment } : c
      )
    }))
    setEditComment(null)
  }

  const handleDeleteComment = async (comment) => {
    await deleteComment(comment.id, userId)
    setComments(prev => ({
      ...prev,
      [comment.post_id]: prev[comment.post_id].filter(c => c.id !== comment.id)
    }))
  }

  return {
    comments, openComments, newComment, setNewComment, editComment, setEditComment,
    toggleComments, handleAddComment, handleUpdateComment, handleDeleteComment
  }
}
