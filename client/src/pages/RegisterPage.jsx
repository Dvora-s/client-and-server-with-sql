import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export default function RegisterPage() {
  const { form, error, handleChange, handleRegister } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Create Account</h2>
        <form onSubmit={handleRegister}>
          <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
          <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
          <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit">Register</button>
        </form>
        <div className="auth-toggle">
          Already have an account?
          <button onClick={() => navigate('/login')}>Login</button>
        </div>
      </div>
    </div>
  )
}
