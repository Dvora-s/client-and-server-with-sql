import { useUser } from '../hooks/useUser'
import { usePosts } from '../hooks/usePosts'
import { useComments } from '../hooks/useComments'

export default function PostsPage() {
  const user = useUser()
  const {
    posts, total, search, filterUserId, sort, page, LIMIT,
    newPost, setNewPost, editPost, setEditPost,
    handleSearch, handleFilterUser, handleSort, handlePageChange,
    handleAddPost, handleUpdatePost, handleDeletePost
  } = usePosts(user.id)

  const {
    comments, openComments, newComment, setNewComment, editComment, setEditComment,
    toggleComments, handleAddComment, handleUpdateComment, handleDeleteComment
  } = useComments(user.id, user.username)

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
        <select value={filterUserId} onChange={handleFilterUser}>
          <option value="">Written by: Everyone</option>
          <option value={user.id}>Written by: Me</option>
        </select>
        <select value={sort} onChange={handleSort}>
          <option value="id">Sort by Newest</option>
          <option value="title">Sort by Title</option>
          <option value="user">Sort by Author</option>
        </select>
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

      <div className="pagination">
        <button disabled={page === 1} onClick={() => handlePageChange(page - 1)}>◀ Prev</button>
        <span>Page {page} of {Math.ceil(total / LIMIT)}</span>
        <button disabled={page >= Math.ceil(total / LIMIT)} onClick={() => handlePageChange(page + 1)}>Next ▶</button>
      </div>
    </div>
  )
}
