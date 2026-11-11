
import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Logout } from '../Redux/authSlice'
import './PagesCSS/AdminSidebar.css'

function AdminSidebar() {

    const [open, setOpen] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = () => {
        dispatch(Logout())
        navigate('/')
    }

    return (
        <>
            <button
                className="menu-btn"
                onClick={() => setOpen(!open)}
            >
                ☰
            </button>

            <aside className={`admin-sidebar ${open ? 'show' : ''}`}>

                <h2>Admin Panel</h2>

                <ul>
                    <li>
                        <NavLink to="/admin/dashboard" end onClick={() => setOpen(false)}>
                            Dashboard
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/admin/users" onClick={() => setOpen(false)}>
                            Manage Users
                        </NavLink>
                    </li>

                   
                </ul>

                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>

            </aside>
        </>
    )
}

export default AdminSidebar
