import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import InfoPage from './pages/InfoPage'
import TodosPage from './pages/TodosPage'
import PostsPage from './pages/PostsPage'
import Navbar from './components/Navbar'

function ProtectedLayout() {
  const user = JSON.parse(localStorage.getItem('user'))
  if (!user) return <Navigate to="/login" replace />
  return (
    <>
      <Navbar username={user.username} />
      <Routes>
        <Route path="info" element={<InfoPage />} />
        <Route path="todos" element={<TodosPage />} />
        <Route path="posts" element={<PostsPage />} />
        <Route path="*" element={<Navigate to="info" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/users/:username/*" element={<ProtectedLayout />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
