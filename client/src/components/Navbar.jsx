import { NavLink, useNavigate } from 'react-router-dom'

export default function Navbar({ username }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  const base = `/users/${username}`

  return (
    <nav style={{ display: 'flex', gap: 16, padding: 12, background: '#eee' }}>
      <NavLink to={`${base}/info`}>Info</NavLink>
      <NavLink to={`${base}/todos`}>Todos</NavLink>
      <NavLink to={`${base}/posts`}>Posts</NavLink>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  )
}
