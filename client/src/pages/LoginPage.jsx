import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser, registerUser } from '../services/api'

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false)
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (isRegister) {
        const { data } = await registerUser(form.name, form.username, form.email, form.password)
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
    <div style={{ maxWidth: 300, margin: '100px auto' }}>
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div>
            <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
          </div>
        )}
        <div>
          <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
        </div>
        {isRegister && (
          <div>
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          </div>
        )}
        <div>
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      </form>
      <p>
        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button onClick={() => { setIsRegister(!isRegister); setError('') }} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', padding: 0 }}>
          {isRegister ? 'Login' : 'Register'}
        </button>
      </p>
    </div>
  )
}
