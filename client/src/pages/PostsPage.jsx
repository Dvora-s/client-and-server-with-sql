import { useEffect, useState } from 'react'
import { getUserPosts } from '../services/api'

export default function PostsPage() {
  const user = JSON.parse(localStorage.getItem('user'))
  const [posts, setPosts] = useState([])

  useEffect(() => {
    getUserPosts(user.id).then(({ data }) => setPosts(data))
  }, [])

  return (
    <div style={{ padding: 24 }}>
      <h2>{user.username}'s Posts</h2>
      {posts.map((post) => (
        <div key={post.id} style={{ marginBottom: 16, borderBottom: '1px solid #ccc', paddingBottom: 8 }}>
          <h4>{post.title}</h4>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  )
}
