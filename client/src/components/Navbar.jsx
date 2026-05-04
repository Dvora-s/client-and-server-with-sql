import { NavLink, useNavigate } from 'react-router-dom'

export default function Navbar({ username }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  const base = `/users/${username}`

  return (
    <nav className="navbar">
      <NavLink to={`${base}/info`}>Info</NavLink>
      <NavLink to={`${base}/todos`}>Todos</NavLink>
      <NavLink to={`${base}/posts`}>Posts</NavLink>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </nav>
  )
}
