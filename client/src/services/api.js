import axios from 'axios'

const API = axios.create({ baseURL: 'http://localhost:3002' })

export const loginUser = (username, password) =>
  API.post('/auth/login', { username, password })

export const registerUser = (name, username, email, password, phone, address) =>
  API.post('/auth/register', { name, username, email, password, phone, address })

export const getUserTodos = (userId, search = '', sort = 'id') =>
  API.get('/todos', { params: { userId, search, sort } })

export const addTodo = (userId, title) =>
  API.post('/todos', { userId, title, completed: false })

export const updateTodo = (id, title, completed) =>
  API.put(`/todos/${id}`, { title, completed })

export const deleteTodo = (id) =>
  API.delete(`/todos/${id}`)

export const getAllPosts = (search = '') =>
  API.get('/posts', { params: { search } })

export const getUserPosts = (userId) =>
  API.get('/posts', { params: { userId } })

export const addPost = (userId, title, body) =>
  API.post('/posts', { userId, title, body })

export const updatePost = (id, title, body, userId) =>
  API.put(`/posts/${id}`, { title, body, userId })

export const deletePost = (id, userId) =>
  API.delete(`/posts/${id}`, { data: { userId } })

export const getComments = (postId) =>
  API.get('/comments', { params: { postId } })

export const addComment = (postId, userId, name, body) =>
  API.post('/comments', { postId, userId, name, body })

export const updateComment = (id, name, body, userId) =>
  API.put(`/comments/${id}`, { name, body, userId })

export const deleteComment = (id, userId) =>
  API.delete(`/comments/${id}`, { data: { userId } })
