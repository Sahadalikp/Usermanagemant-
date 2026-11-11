
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Updateser } from '../Redux/authSlice'
import { api } from '../Api'
import './PagesCSS/Profile.css'

// Image Compression
const compressImage = (file) => {

  return new Promise((resolve, reject) => {

    const img = new Image()
    const reader = new FileReader()

    reader.onload = () => {
      img.src = reader.result
    }

    reader.onerror = reject

    img.onload = () => {

      const canvas = document.createElement('canvas')
      const maxSize = 500

      let width = img.width
      let height = img.height

      if (width > height) {

        if (width > maxSize) {
          height = height * (maxSize / width)
          width = maxSize
        }

      } else {

        if (height > maxSize) {
          width = width * (maxSize / height)
          height = maxSize
        }

      }

      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')

      ctx.drawImage(img, 0, 0, width, height)

      const compressedImage = canvas.toDataURL(
        'image/jpeg',
        0.7
      )

      resolve(compressedImage)

    }

    img.onerror = reject

    reader.readAsDataURL(file)

  })

}


function Profile() {

  const { user } = useSelector((state) => state.auth)

  const dispatch = useDispatch()

  // Image States
  const [image, setImage] = useState(user?.image || '')
  const [loading, setLoading] = useState(false)

  // Edit Profile States
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [profileLoading, setProfileLoading] = useState(false)

  // Change Password States
  const [showPassword, setShowPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)


  // CHANGE PROFILE IMAGE
  const handlechange = async (e) => {

    if (!user?.id) {
      alert('Please login first')
      return
    }

    const file = e.target.files[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image')
      e.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      e.target.value = ''
      return
    }

    try {

      setLoading(true)

      const base64Image = await compressImage(file)

      const response = await api.patch(
        `/users/${user.id}`,
        {
          image: base64Image
        }
      )

      setImage(response.data.image)

      dispatch(Updateser({
        ...user,
        ...response.data
      }))

      alert('Profile image updated successfully!')

    } catch (error) {

      console.log('Upload Error:', error)
      alert('Image upload failed: ' + error.message)

    } finally {

      setLoading(false)
      e.target.value = ''

    }

  }


  // EDIT PROFILE
  const handleUpdateProfile = async (e) => {

    e.preventDefault()

    if (!name.trim() || !email.trim()) {
      alert('Please fill all fields')
      return
    }

    try {

      setProfileLoading(true)

      const response = await api.patch(
        `/users/${user.id}`,
        {
          name: name.trim(),
          email: email.trim()
        }
      )

      dispatch(Updateser({
        ...user,
        ...response.data
      }))

      setIsEditing(false)

      alert('Profile updated successfully')

    } catch (error) {

      console.log('Profile Error:', error)
      alert('Profile update failed')

    } finally {

      setProfileLoading(false)

    }

  }


  // CHANGE PASSWORD
  const handleChangePassword = async (e) => {

    e.preventDefault()

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill all fields')
      return
    }

    if (newPassword.length < 6) {
      alert('Password must contain at least 6 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match')
      return
    }

    try {

      setPasswordLoading(true)

      const response = await api.get(`/users/${user.id}`)

      if (response.data.password !== currentPassword) {
        alert('Current password is incorrect')
        return
      }

      await api.patch(
        `/users/${user.id}`,
        {
          password: newPassword
        }
      )

      alert('Password changed successfully!')

      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setShowPassword(false)

    } catch (error) {

      console.log('Password Error:', error)
      alert('Password change failed')

    } finally {

      setPasswordLoading(false)

    }

  }


  return (

    <div className="profile-container">

      {user ? (

        <div className="profile-card">

          {/* PROFILE IMAGE */}

          <div className="profile-avatar">

            {image ? (

              <img
                src={image}
                alt="Profile"
                className="profile-image"
              />

            ) : (

              user.name?.charAt(0).toUpperCase()

            )}

          </div>


          {/* CHANGE PHOTO */}

          <label
            htmlFor="profile-upload"
            className="upload-btn"
          >
            {loading ? 'Uploading...' : 'Change Photo'}
          </label>

          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            onChange={handlechange}
            className="file-input"
            disabled={loading}
          />


          <h2>{user.name}</h2>

          <p className="profile-role">
            My Account
          </p>


          {/* EDIT PROFILE FORM */}

          {isEditing ? (

            <form
              onSubmit={handleUpdateProfile}
              className="profile-edit-form"
            >

              <label>Full Name</label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />

              <label>Email Address</label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />

              <button
                type="submit"
                disabled={profileLoading}
              >
                {profileLoading ? 'Saving...' : 'Save Changes'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setName(user.name)
                  setEmail(user.email)
                  setIsEditing(false)
                }}
              >
                Cancel
              </button>

            </form>

          ) : (

            <>

              {/* PROFILE DETAILS */}

              <div className="profile-details">

                <div className="detail-item">

                  <label>Full Name</label>

                  <p>{user.name}</p>

                </div>

                <div className="detail-item">

                  <label>Email Address</label>

                  <p>{user.email}</p>

                </div>

              </div>


              {/* EDIT PROFILE BUTTON */}

              <button
                className="edit-profile"
                onClick={() => {
                  setName(user.name)
                  setEmail(user.email)
                  setIsEditing(true)
                }}
              >
                Edit Profile
              </button>


              {/* CHANGE PASSWORD BUTTON */}

              <button
                className="edit-profile"
                onClick={() => setShowPassword(!showPassword)}
              >
                Change Password
              </button>


              {/* CHANGE PASSWORD FORM */}

              {showPassword && (

                <form
                  className="profile-edit-form"
                  onSubmit={handleChangePassword}
                >

                  <h3>Change Password</h3>

                  <label>Current Password</label>

                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />

                  <label>New Password</label>

                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />

                  <label>Confirm Password</label>

                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />

                  <button
                    type="submit"
                    disabled={passwordLoading}
                  >
                    {passwordLoading ? 'Updating...' : 'Update Password'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowPassword(false)
                      setCurrentPassword('')
                      setNewPassword('')
                      setConfirmPassword('')
                    }}
                  >
                    Cancel
                  </button>

                </form>

              )}

            </>

          )}

        </div>

      ) : (

        <h2>Please Login First</h2>

      )}

    </div>

  )

}

export default Profile
