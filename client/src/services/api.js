import axios from 'axios'

const API = axios.create({ baseURL: 'http://localhost:3002' })

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`
  return config
})

const cache = {}

const getCache = (key) => cache[key]
const setCache = (key, data) => { cache[key] = data }
export const clearCache = (prefix) => {
  Object.keys(cache).forEach(k => { if (k.startsWith(prefix)) delete cache[k] })
}

export const loginUser = (username, password) =>
  API.post('/auth/login', { username, password })

export const registerUser = (name, username, email, password, phone, address) =>
  API.post('/auth/register', { name, username, email, password, phone, address })

export const getUserTodos = async (userId, search = '', sort = 'id', page = 1, completed = '') => {
  const key = `todos_${userId}_${search}_${sort}_${page}_${completed}`
  if (getCache(key)) return { data: getCache(key) }
  const res = await API.get('/todos', { params: { userId, q: search, _sort: sort, _page: page, _limit: 10, completed } })
  setCache(key, res.data)
  return res
}

export const addTodo = async (userId, title) => {
  const res = await API.post('/todos', { userId, title, completed: false })
  clearCache('todos_')
  return res
}

export const updateTodo = async (id, title, completed) => {
  const res = await API.put(`/todos/${id}`, { title, completed })
  clearCache('todos_')
  return res
}

export const deleteTodo = async (id) => {
  const res = await API.delete(`/todos/${id}`)
  clearCache('todos_')
  return res
}

export const getAllPosts = async (search = '', filterUserId = '', sort = 'id', page = 1) => {
  const key = `posts_${search}_${filterUserId}_${sort}_${page}`
  if (getCache(key)) return { data: getCache(key) }
  const res = await API.get('/posts', { params: { q: search, user_id: filterUserId || undefined, _sort: sort, _order: sort === 'id' ? 'DESC' : 'ASC', _page: page, _limit: 5 } })
  setCache(key, res.data)
  return res
}

export const getUserPosts = (userId) =>
  API.get('/posts', { params: { userId } })

export const addPost = async (userId, title, body) => {
  const res = await API.post('/posts', { userId, title, body })
  clearCache('posts_')
  return res
}

export const updatePost = async (id, title, body, userId) => {
  const res = await API.put(`/posts/${id}`, { title, body, userId })
  clearCache('posts_')
  return res
}

export const deletePost = async (id, userId) => {
  const res = await API.delete(`/posts/${id}`, { data: { userId } })
  clearCache('posts_')
  return res
}

export const getComments = (postId) =>
  API.get('/comments', { params: { postId } })

export const addComment = (postId, userId, name, body) =>
  API.post('/comments', { postId, userId, name, body })

export const updateComment = (id, name, body, userId) =>
  API.put(`/comments/${id}`, { name, body, userId })

export const deleteComment = (id, userId) =>
  API.delete(`/comments/${id}`, { data: { userId } })
