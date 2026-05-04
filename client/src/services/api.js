import axios from 'axios'

const API = axios.create({ baseURL: 'http://localhost:3002' })

export const loginUser = (username, password) =>
  API.post('/auth/login', { username, password })

export const registerUser = (name, username, email, password) =>
  API.post('/auth/register', { name, username, email, password })

export const getUserTodos = (userId) =>
  API.get('/todos', { params: { userId } })

export const getUserPosts = (userId) =>
  API.get('/posts', { params: { userId } })
