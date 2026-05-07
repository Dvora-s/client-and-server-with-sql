import { useEffect, useState } from 'react'
import { getAllPosts, addPost, updatePost, deletePost } from '../services/api'

export const usePosts = (userId) => {
  const [posts, setPosts] = useState([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [filterUserId, setFilterUserId] = useState('')
  const [sort, setSort] = useState('id')
  const [page, setPage] = useState(1)
  const [newPost, setNewPost] = useState({ title: '', body: '' })
  const [editPost, setEditPost] = useState(null)
  const LIMIT = 5

  const fetchPosts = (s = search, f = filterUserId, o = sort, p = page) =>
    getAllPosts(s, f, o, p).then(({ data }) => {
      setPosts(Array.isArray(data) ? data : (data.posts || []))
      setTotal(Array.isArray(data) ? data.length : (data.total || 0))
    })

  useEffect(() => { fetchPosts() }, [])

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setPage(1)
    fetchPosts(e.target.value, filterUserId, sort, 1)
  }

  const handleFilterUser = (e) => {
    setFilterUserId(e.target.value)
    setPage(1)
    fetchPosts(search, e.target.value, sort, 1)
  }

  const handleSort = (e) => {
    setSort(e.target.value)
    setPage(1)
    fetchPosts(search, filterUserId, e.target.value, 1)
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
    fetchPosts(search, filterUserId, sort, newPage)
  }

  const handleAddPost = async (e) => {
    e.preventDefault()
    if (!newPost.title.trim() || !newPost.body.trim()) return
    await addPost(userId, newPost.title.trim(), newPost.body.trim())
    setNewPost({ title: '', body: '' })
    fetchPosts(search, filterUserId, sort, page)
  }

  const handleUpdatePost = async (post) => {
    await updatePost(post.id, editPost.title, editPost.body, userId)
    setEditPost(null)
    fetchPosts(search, filterUserId, sort, page)
  }

  const handleDeletePost = async (id) => {
    await deletePost(id, userId)
    fetchPosts(search, filterUserId, sort, page)
  }

  return {
    posts, total, search, filterUserId, sort, page, LIMIT,
    newPost, setNewPost, editPost, setEditPost,
    handleSearch, handleFilterUser, handleSort, handlePageChange,
    handleAddPost, handleUpdatePost, handleDeletePost
  }
}
