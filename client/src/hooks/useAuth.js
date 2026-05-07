import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser, registerUser } from '../services/api'

export const useAuth = () => {
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', phone: '', address: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const saveAndRedirect = (data) => {
    localStorage.setItem('user', JSON.stringify(data))
    navigate(`/users/${data.username}/info`)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const { data } = await loginUser(form.username, form.password)
      saveAndRedirect(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const { data } = await registerUser(form.name, form.username, form.email, form.password, form.phone, form.address)
      saveAndRedirect(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
  }

  return { form, error, handleChange, handleLogin, handleRegister }
}
