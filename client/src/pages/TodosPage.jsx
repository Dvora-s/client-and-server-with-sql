import { useState } from 'react'
import { useUser } from '../hooks/useUser'
import { useTodos } from '../hooks/useTodos'

export default function TodosPage() {
  const user = useUser()
  const {
    todos, total, search, sort, completed, page, LIMIT,
    handleSearch, handleSort, handleCompleted, handlePageChange,
    handleAdd, handleToggle, handleEditSave, handleDelete
  } = useTodos(user.id)

  const [newTitle, setNewTitle] = useState('')
  const [editId, setEditId] = useState(null)
  const [editTitle, setEditTitle] = useState('')

  const onAdd = async (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    await handleAdd(newTitle.trim())
    setNewTitle('')
  }

  const onEditSave = async (todo) => {
    if (!editTitle.trim()) return
    await handleEditSave(todo, editTitle)
    setEditId(null)
  }

  return (
    <div className="page">
      <h2>{user.username}'s Todos</h2>

      <form className="todo-add-form" onSubmit={onAdd}>
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
        <select value={completed} onChange={handleCompleted}>
          <option value="">All</option>
          <option value="false">Pending</option>
          <option value="true">Completed</option>
        </select>
      </div>

      <div className="todo-list">
        {todos.length === 0 && <p className="todo-empty">No todos found.</p>}
        {todos.map((todo) => (
          <div key={todo.id} className={`todo-item ${todo.completed ? 'done' : ''}`}>
            <input type="checkbox" checked={!!todo.completed} onChange={() => handleToggle(todo)} />
            {editId === todo.id ? (
              <>
                <input className="todo-edit-input" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && onEditSave(todo)} autoFocus />
                <button className="todo-btn save" onClick={() => onEditSave(todo)}>Save</button>
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
