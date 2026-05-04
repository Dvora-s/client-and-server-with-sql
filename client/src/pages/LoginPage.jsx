import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser, registerUser } from '../services/api'

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false)
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', phone: '', address: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (isRegister) {
        const { data } = await registerUser(form.name, form.username, form.email, form.password, form.phone, form.address)
        localStorage.setItem('user', JSON.stringify(data))
        navigate(`/users/${data.username}/info`)
      } else {
        const { data } = await loginUser(form.username, form.password)
        localStorage.setItem('user', JSON.stringify(data))
        navigate(`/users/${data.username}/info`)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
          )}
          <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
          {isRegister && (
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          )}
          {isRegister && (
            <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
          )}
          {isRegister && (
            <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
          )}
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
        </form>
        <div className="auth-toggle">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button onClick={() => { setIsRegister(!isRegister); setError('') }}>
            {isRegister ? 'Login' : 'Register'}
          </button>
        </div>
      </div>
    </div>
  )
}
