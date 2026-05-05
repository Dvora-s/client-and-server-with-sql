import { useEffect, useState } from 'react'
import { getUserTodos, addTodo, updateTodo, deleteTodo } from '../services/api'

export default function TodosPage() {
  const user = JSON.parse(localStorage.getItem('user'))
  const [todos, setTodos] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [editId, setEditId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('id')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const LIMIT = 5

  const fetchTodos = (s = search, o = sort, p = page) =>
    getUserTodos(user.id, s, o, p).then(({ data }) => {
      const todos = Array.isArray(data) ? data : (data.todos || [])
      const total = Array.isArray(data) ? data.length : (data.total || 0)
      setTodos(todos)
      setTotal(total)
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
    fetchTodos(search, e.target.value, 1)
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
    fetchTodos(search, sort, newPage)
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    await addTodo(user.id, newTitle.trim())
    setNewTitle('')
    fetchTodos(search, sort, page)
  }

  const handleToggle = async (todo) => {
    await updateTodo(todo.id, todo.title, !todo.completed)
    fetchTodos(search, sort, page)
  }

  const handleEditSave = async (todo) => {
    if (!editTitle.trim()) return
    await updateTodo(todo.id, editTitle.trim(), todo.completed)
    setEditId(null)
    fetchTodos(search, sort, page)
  }

  const handleDelete = async (id) => {
    await deleteTodo(id)
    fetchTodos(search, sort, page)
  }

  return (
    <div className="page">
      <h2>{user.username}'s Todos</h2>

      <form className="todo-add-form" onSubmit={handleAdd}>
        <input placeholder="New todo..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
        <button type="submit">Add</button>
      </form>

      <div className="todo-filters">
        <input placeholder="🔍 Search..." value={search} onChange={handleSearch} />
        <select value={sort} onChange={handleSort}>
          <option value="id">Sort by ID</option>
          <option value="title">Sort by Title</option>
          <option value="date">Sort by Date</option>
          <option value="completed">Sort by Status</option>
        </select>
      </div>

      <div className="todo-list">
        {todos.length === 0 && <p className="todo-empty">No todos found.</p>}
        {todos.map((todo) => (
          <div key={todo.id} className={`todo-item ${todo.completed ? 'done' : ''}`}>
            <input type="checkbox" checked={!!todo.completed} onChange={() => handleToggle(todo)} />
            {editId === todo.id ? (
              <>
                <input className="todo-edit-input" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleEditSave(todo)} autoFocus />
                <button className="todo-btn save" onClick={() => handleEditSave(todo)}>Save</button>
                <button className="todo-btn cancel" onClick={() => setEditId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span className="todo-title">{todo.title}</span>
                {todo.created_at && <span className="todo-date">{new Date(todo.created_at).toLocaleDateString()}</span>}
                <button className="todo-btn edit" onClick={() => { setEditId(todo.id); setEditTitle(todo.title) }}>Edit</button>
                <button className="todo-btn delete" onClick={() => handleDelete(todo.id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="pagination">
        <button disabled={page === 1} onClick={() => handlePageChange(page - 1)}>◀ Prev</button>
        <span>Page {page} of {Math.ceil(total / LIMIT) || 1}</span>
        <button disabled={page >= Math.ceil(total / LIMIT)} onClick={() => handlePageChange(page + 1)}>Next ▶</button>
      </div>
    </div>
  )
}
