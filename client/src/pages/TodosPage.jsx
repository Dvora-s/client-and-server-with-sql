import { useEffect, useState } from 'react'
import { getUserTodos } from '../services/api'

export default function TodosPage() {
  const user = JSON.parse(localStorage.getItem('user'))
  const [todos, setTodos] = useState([])

  useEffect(() => {
    getUserTodos(user.id).then(({ data }) => setTodos(data))
  }, [])

  return (
    <div style={{ padding: 24 }}>
      <h2>{user.username}'s Todos</h2>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
            {todo.title}
          </li>
        ))}
      </ul>
    </div>
  )
}
