import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import InfoPage from './pages/InfoPage'
import TodosPage from './pages/TodosPage'
import PostsPage from './pages/PostsPage'
import Navbar from './components/Navbar'
import { useUser } from './hooks/useUser'

function AccessDenied() {
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2 style={{ color: '#e53e3e' }}>אין לך גישה למשאב זה</h2>
    </div>
  )
}

function ProtectedLayout() {
  const user = useUser()
  const { username } = useParams()
  if (!user) return <Navigate to="/login" replace />
  return (
    <>
      <Navbar username={user.username} />
      <Routes>
        <Route path="info" element={user.username === username ? <InfoPage /> : <AccessDenied />} />
        <Route path="todos" element={user.username === username ? <TodosPage /> : <AccessDenied />} />
        <Route path="posts" element={user.username === username ? <PostsPage /> : <AccessDenied />} />
        <Route path="*" element={<Navigate to="info" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/users/:username/*" element={<ProtectedLayout />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
