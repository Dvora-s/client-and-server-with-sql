import { useUser } from '../hooks/useUser'

export default function InfoPage() {
  const user = useUser()

  return (
    <div className="page">
      <h2>Personal Info</h2>
      <div className="info-card">
        <div className="info-row">
          <span className="info-label">Name</span>
          <span>{user.name}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Username</span>
          <span>{user.username}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Email</span>
          <span>{user.email}</span>
        </div>
        {user.phone && (
          <div className="info-row">
            <span className="info-label">Phone</span>
            <span>{user.phone}</span>
          </div>
        )}
        {user.address && (
          <div className="info-row">
            <span className="info-label">Address</span>
            <span>{user.address}</span>
          </div>
        )}
      </div>
    </div>
  )
}
