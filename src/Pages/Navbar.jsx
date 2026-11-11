
import React from 'react'
import './PagesCSS/Navbar.css'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Logout } from '../Redux/authSlice'

function Navbar() {

  const navigat = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)

  return (
    <div>
      {user && (
        <nav>

          <div>
            <h2>
              {user.role === 'admin' ? 'Admin Panel' : 'User Panel'}
            </h2>
          </div>

          <ul>

            {user.role === 'admin' ? (
              <>
                <li>
                  <NavLink to="/admin/dashboard">Dashboard</NavLink>
                </li>

                <li>
                  <NavLink to="/admin/users">Manage Users</NavLink>
                </li>

                <li>
                  <NavLink to="/admin/tasks">Manage Tasks</NavLink>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/home">Home</NavLink>
                </li>

                <li>
                  <NavLink to="/profile">Profile</NavLink>
                </li>
              </>
            )}

          </ul>

          <div>
            <button onClick={() => dispatch(Logout())}>
              Logout
            </button>
          </div>

        </nav>
      )}
    </div>
  )
}

export default Navbar
