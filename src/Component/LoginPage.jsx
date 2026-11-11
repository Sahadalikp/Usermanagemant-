
import React, { useState } from 'react'
import SignImage from '../assets/officemrp.png'
import { NavLink, useNavigate } from 'react-router-dom'
import '../Component/CSSFILES/login.css'
import { useDispatch, useSelector } from 'react-redux'
import { Login } from '../Redux/authSlice'

function LoginPage() {

  const [fromdata, setFromdata] = useState({
    email: "",
    password: ""
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { loading } = useSelector((state) => state.auth)

  const handleChange = (e) => {
    setFromdata({
      ...fromdata,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await dispatch(Login(fromdata)).unwrap()

      if (response.role === "admin") {
        navigate('/admin/dashboard')
      } else {
        navigate('/home')
      }

    } catch (error) {
      alert(error)
    }
  }

  return (
    <div className="login-container">

      <div className="login-image">
        <img src={SignImage} alt="Office" />
      </div>

      <div className="login-form-side">
        <div className="login-card">

          <h2>Welcome Back!</h2>
          <p>Login to your account</p>

          <form onSubmit={handleSubmit}>

            <label>Email :</label>
            <input
              type="email"
              placeholder="Enter email"
              name="email"
              required
              value={fromdata.email}
              onChange={handleChange}
            />

            <label>Password :</label>
            <input
              type="password"
              placeholder="Enter password"
              name="password"
              required
              minLength={6}
              autoComplete="current-password"
              value={fromdata.password}
              onChange={handleChange}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </button>

            <p className="signup-link">
              Create a new account <NavLink to="/sign">Signup</NavLink>
            </p>

          </form>

        </div>
      </div>

    </div>
  )
}

export default LoginPage
