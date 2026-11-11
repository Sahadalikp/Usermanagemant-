import React from 'react'
import { useSelector } from 'react-redux'

function HomePage() {
  const {user}= useSelector((state)=>state.auth)
  return (
    <div>
      <h2>hello {user.name} ✌️ </h2>
    </div>
  )
}

export default HomePage