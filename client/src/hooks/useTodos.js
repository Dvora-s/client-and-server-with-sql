import { useEffect, useState } from 'react'
import { getUserTodos, addTodo, updateTodo, deleteTodo } from '../services/api'

export const useTodos = (userId) => {
  const [todos, setTodos] = useState([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('id')
  const [completed, setCompleted] = useState('')
  const [page, setPage] = useState(1)
  const LIMIT = 5

  const fetchTodos = (s = search, o = sort, p = page, c = completed) =>
    getUserTodos(userId, s, o, p, c).then(({ data }) => {
      setTodos(Array.isArray(data) ? data : (data.todos || []))
      setTotal(Array.isArray(data) ? data.length : (data.total || 0))
    })

  useEffect(() => { fetchTodos() }, [])

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setPage(1)
    fetchTodos(e.target.value, sort, 1)
  }

  const handleSort = (e) => {
    setSort(e.target.value)
    setPage(1)
    fetchTodos(search, e.target.value, 1, completed)
  }

  const handleCompleted = (e) => {
    setCompleted(e.target.value)
    setPage(1)
    fetchTodos(search, sort, 1, e.target.value)
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
    fetchTodos(search, sort, newPage)
  }

  const handleAdd = async (title) => {
    await addTodo(userId, title)
    fetchTodos(search, sort, page)
  }

  const handleToggle = async (todo) => {
    await updateTodo(todo.id, todo.title, !todo.completed)
    fetchTodos(search, sort, page)
  }

  const handleEditSave = async (todo, editTitle) => {
    await updateTodo(todo.id, editTitle.trim(), todo.completed)
    fetchTodos(search, sort, page)
  }

  const handleDelete = async (id) => {
    await deleteTodo(id)
    fetchTodos(search, sort, page)
  }

  return {
    todos, total, search, sort, completed, page, LIMIT,
    handleSearch, handleSort, handleCompleted, handlePageChange,
    handleAdd, handleToggle, handleEditSave, handleDelete
  }
}
