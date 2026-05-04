import { useEffect, useState } from 'react'
import { getAllPosts, addPost, updatePost, deletePost, getComments, addComment, updateComment, deleteComment } from '../services/api'

export default function PostsPage() {
  const user = JSON.parse(localStorage.getItem('user'))
  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState('')
  const [newPost, setNewPost] = useState({ title: '', body: '' })
  const [editPost, setEditPost] = useState(null)
  const [openComments, setOpenComments] = useState({})
  const [comments, setComments] = useState({})
  const [newComment, setNewComment] = useState({})
  const [editComment, setEditComment] = useState(null)

  const fetchPosts = (s = search) =>
    getAllPosts(s).then(({ data }) => setPosts(data))

  useEffect(() => { fetchPosts() }, [])

  const handleSearch = (e) => {
    setSearch(e.target.value)
    fetchPosts(e.target.value)
  }

  const handleAddPost = async (e) => {
    e.preventDefault()
    if (!newPost.title.trim() || !newPost.body.trim()) return
    const { data } = await addPost(user.id, newPost.title.trim(), newPost.body.trim())
    setPosts(prev => [...prev, data])
    setNewPost({ title: '', body: '' })
  }

  const handleUpdatePost = async (post) => {
    await updatePost(post.id, editPost.title, editPost.body, user.id)
    setPosts(posts.map(p => p.id === post.id ? { ...p, ...editPost } : p))
    setEditPost(null)
  }

  const handleDeletePost = async (id) => {
    await deletePost(id, user.id)
    setPosts(posts.filter(p => p.id !== id))
  }

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
    const { data } = await addComment(postId, user.id, user.username, body.trim())
    setComments(prev => ({ ...prev, [postId]: [...(prev[postId] || []), data] }))
    setNewComment(prev => ({ ...prev, [postId]: '' }))
  }

  const handleUpdateComment = async (comment) => {
    await updateComment(comment.id, editComment.name, editComment.body, user.id)
    setComments(prev => ({
      ...prev,
      [comment.post_id]: prev[comment.post_id].map(c =>
        c.id === comment.id ? { ...c, ...editComment } : c
      )
    }))
    setEditComment(null)
  }

  const handleDeleteComment = async (comment) => {
    await deleteComment(comment.id, user.id)
    setComments(prev => ({
      ...prev,
      [comment.post_id]: prev[comment.post_id].filter(c => c.id !== comment.id)
    }))
  }

  return (
    <div className="page">
      <h2>All Posts</h2>

      <form className="post-add-form" onSubmit={handleAddPost}>
        <input placeholder="Title" value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })} />
        <textarea placeholder="Write something..." value={newPost.body} onChange={e => setNewPost({ ...newPost, body: e.target.value })} rows={2} />
        <button type="submit">Add Post</button>
      </form>

      <div className="todo-filters">
        <input placeholder="🔍 Search posts..." value={search} onChange={handleSearch} />
      </div>

      {posts.map(post => (
        <div key={post.id} className="post-card">
          {editPost?.id === post.id ? (
            <div className="post-edit-form">
              <input value={editPost.title} onChange={e => setEditPost({ ...editPost, title: e.target.value })} />
              <textarea value={editPost.body} onChange={e => setEditPost({ ...editPost, body: e.target.value })} rows={3} />
              <div className="post-edit-actions">
                <button className="todo-btn save" onClick={() => handleUpdatePost(post)}>Save</button>
                <button className="todo-btn cancel" onClick={() => setEditPost(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div className="post-header">
                <h4>{post.title}</h4>
                {post.user_id === user.id && (
                  <div className="post-actions">
                    <button className="todo-btn edit" onClick={() => setEditPost({ id: post.id, title: post.title, body: post.body })}>Edit</button>
                    <button className="todo-btn delete" onClick={() => handleDeletePost(post.id)}>Delete</button>
                  </div>
                )}
              </div>
              <p className="post-body">{post.body}</p>
            </>
          )}

          <button className="comments-toggle" onClick={() => toggleComments(post.id)}>
            {openComments[post.id] ? '▲ Hide Comments' : '▼ Show Comments'}
          </button>

          {openComments[post.id] && (
            <div className="comments-section">
              {(comments[post.id] || []).map(comment => (
                <div key={comment.id} className="comment-item">
                  {editComment?.id === comment.id ? (
                    <>
                      <input className="todo-edit-input" value={editComment.body} onChange={e => setEditComment({ ...editComment, body: e.target.value })} autoFocus />
                      <button className="todo-btn save" onClick={() => handleUpdateComment(comment)}>Save</button>
                      <button className="todo-btn cancel" onClick={() => setEditComment(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <div className="comment-content">
                        <span className="comment-author">{comment.name}</span>
                        <span className="comment-body">{comment.body}</span>
                      </div>
                      {comment.user_id === user.id && (
                        <div className="comment-actions">
                          <button className="todo-btn edit" onClick={() => setEditComment({ id: comment.id, name: comment.name, body: comment.body })}>Edit</button>
                          <button className="todo-btn delete" onClick={() => handleDeleteComment(comment)}>Delete</button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
              <div className="comment-add">
                <input
                  placeholder="Add a comment..."
                  value={newComment[post.id] || ''}
                  onChange={e => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && handleAddComment(post.id)}
                />
                <button className="todo-btn save" onClick={() => handleAddComment(post.id)}>Post</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
