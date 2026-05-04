export default function InfoPage() {
  const user = JSON.parse(localStorage.getItem('user'))

  return (
    <div style={{ padding: 24 }}>
      <h2>Personal Info</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  )
}
