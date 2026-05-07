import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteUser } from '../services/api'

export const useUser = () => JSON.parse(localStorage.getItem('user'))

export const useUserActions = () => {
  const user = useUser()
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleDelete = async () => {
    setError('')
    try {
      await deleteUser(user.id)
      localStorage.removeItem('user')
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
  }

  return { error, handleDelete }
}
