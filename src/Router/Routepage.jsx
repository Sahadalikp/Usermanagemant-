
import React from 'react'
import { Route, Routes, Outlet } from 'react-router-dom'

import Login from '../Component/LoginPage'
import SignUpPage from '../Component/SignUpPage'
import Navbar from '../Pages/Navbar'
import Profile from '../Pages/Profile'
import HomePage from '../Component/HomePage'

import Protected from '../Component/Protected'
import AdminProtected from '../Component/AdminProtected'

import AdminLayout from '../Pages/AdminLayout'
import AdminDashboard from '../Pages/AdminDashboard'
import AdminUsers from '../Pages/AdminUsers'

function Routepage() {
  return (
    <div>
      <Routes>

        {/* Normal user pages */}
        <Route path='/' element={<Login />} />
        <Route path='/sign' element={<SignUpPage />} />

        <Route element={<Protected />}>
          <Route element={<NavbarLayout />}>
            <Route path='/home' element={<HomePage />} />
            <Route path='/profile' element={<Profile />} />
          </Route>
        </Route>

        {/* Admin pages */}
        <Route element={<AdminProtected />}>
          <Route element={<AdminLayout />}>
            <Route path='/admin/dashboard' element={<AdminDashboard />} />
           <Route path="/admin/users" element={<AdminUsers/>} />
          </Route>
        </Route>

      </Routes>
    </div>
  )
}

function NavbarLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default Routepage
