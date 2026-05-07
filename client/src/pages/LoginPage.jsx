import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const { form, error, handleChange, handleLogin } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <form onSubmit={handleLogin}>
          <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit">Login</button>
        </form>
        <div className="auth-toggle">
          Don't have an account?
          <button onClick={() => navigate('/register')}>Register</button>
        </div>
      </div>
    </div>
  )
}
