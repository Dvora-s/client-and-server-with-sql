import axios from 'axios'

const API = axios.create({ baseURL: 'http://localhost:3002' })

export const loginUser = (username, password) =>
  API.post('/auth/login', { username, password })

export const registerUser = (name, username, email, password, phone, address) =>
  API.post('/auth/register', { name, username, email, password, phone, address })

export const getUserTodos = (userId) =>
  API.get('/todos', { params: { userId } })

export const addTodo = (userId, title) =>
  API.post('/todos', { userId, title, completed: false })

export const updateTodo = (id, title, completed) =>
  API.put(`/todos/${id}`, { title, completed })

export const deleteTodo = (id) =>
  API.delete(`/todos/${id}`)

export const getUserPosts = (userId) =>
  API.get('/posts', { params: { userId } })
