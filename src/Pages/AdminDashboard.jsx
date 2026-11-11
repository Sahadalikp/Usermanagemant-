
import React, { useEffect, useState } from 'react'
import { api } from '../Api'
import './PagesCSS/AdminDashboard.css'

function AdminDashboard() {

  const [users, setUsers] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {

    const fetchDashboardData = async () => {
      try {

        const [userResponse, taskResponse] = await Promise.all([
          api.get('users'),
          api.get('tasks')
        ])

        setUsers(userResponse.data)
        setTasks(taskResponse.data)

      } catch (error) {
        setError('Dashboard data loading failed')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()

  }, [])

  // Admin users exclude cheyyunnu
  const normalUsers = users.filter(
    (user) => user.role !== 'admin'
  )

  // User calculations
  const totalUsers = normalUsers.length

  const activeUsers = normalUsers.filter(
    (user) => user.active !== false
  ).length

  const inactiveUsers = normalUsers.filter(
    (user) => user.active === false
  ).length



  if (loading) {
    return <h2>Loading Dashboard...</h2>
  }

  if (error) {
    return <p>{error}. Check JSON Server.</p>
  }

  return (
    <div className="admin-dashboard">

      <h2>Admin Dashboard</h2>
      <p>Welcome to Admin Panel</p>

      <div className="dashboard-cards">

        <div className="dashboard-card">
          <h3>Total Users</h3>
          <h1>{totalUsers}</h1>
        </div>

        <div className="dashboard-card">
          <h3>Active Users</h3>
          <h1>{activeUsers}</h1>
        </div>

        <div className="dashboard-card">
          <h3>Inactive Users</h3>
          <h1>{inactiveUsers}</h1>
        </div>



      </div>

    </div>
  )
}

export default AdminDashboard
