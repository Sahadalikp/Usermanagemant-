import React, { useState } from 'react'
import './CSSFILES/Sign.css'
import SignImage from '../assets/officemrp.png'
import { useDispatch, useSelector } from 'react-redux';
import { SignUp } from '../Redux/authSlice';
import { NavLink, useNavigate } from 'react-router-dom';

function SignUpPage() {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const[fromdata,setFromdata]=useState({
    name:"",
    email:"",
    password:""
  });

  const handleChange = (e)=>{

    setFromdata({...fromdata ,
      [e.target.name] : e.target.value
    })
  }

  let {loading,error} = useSelector((state)=>state.auth)

  const handlesubmit = async(e)=>{
    e.preventDefault()
    try {
      let responce = await dispatch(SignUp(fromdata)).unwrap()
      navigate('/')
    } catch (error) {
      alert(error)
    }

  }


  return (
 <div className="signup-container">

  <div className="signup-image">
    <img src={SignImage} alt="Signup" />
  </div>

  <div className="signup-form-side">
    <div className="signup-card">

      <h2>Create Account</h2>
      <p>Sign up to get started</p>

      <form onSubmit={handlesubmit}>

        <label>Name :</label>
        <input type="text" 
        placeholder="Name"
        required
         name="name"
         onChange={handleChange}
         />

        <label>Email :</label>
        <input type="email"
         placeholder="@gmail.com" 
         name="email" 
         required
         onChange={handleChange}
         />

        <label>Password :</label>
        <input
        placeholder="Create password"
        required
        minLength={6}
        type="password"
        name="password"
        autoComplete="new-password"
        onChange={handleChange}
           />

        <button type="submit"
        >
          {loading ? "Loading..." : "SignUp"}
          </button>
          <p>I have a account <NavLink to={'/'}>Login</NavLink></p>
      </form>

    </div>
  </div>

</div>
  )
}

export default SignUpPage