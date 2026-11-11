
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

function AdminProtected() {

  const { user } = useSelector((state) => state.auth)

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (user.role !== 'admin') {
    return <Navigate to="/home" replace />
  }

  return <Outlet />
}

export default AdminProtected
