
import React, { useEffect, useState } from 'react'
import { api } from '../Api'
import './PagesCSS/AdminUsers.css'

// Image compress function
const compressImage = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = () => {
            const img = new Image()

            img.onload = () => {
                const canvas = document.createElement('canvas')
                const maxSize = 400

                let width = img.width
                let height = img.height

                if (width > height && width > maxSize) {
                    height = (height * maxSize) / width
                    width = maxSize
                } else if (height > maxSize) {
                    width = (width * maxSize) / height
                    height = maxSize
                }

                canvas.width = width
                canvas.height = height

                const ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0, width, height)

                resolve(canvas.toDataURL('image/jpeg', 0.7))
            }

            img.onerror = reject
            img.src = reader.result
        }

        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

function AdminUsers() {

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)

    const [selectedUser, setSelectedUser] = useState(null)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [image, setImage] = useState('')
    const [saving, setSaving] = useState(false)

    const [viewUser, setViewUser] = useState(null)

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    // Fetch users
    const fetchUsers = async () => {
        try {
            setLoading(true)

            const response = await api.get('users')

            const normalUsers = response.data.filter(
                (user) => user.role !== 'admin'
            )

            setUsers(normalUsers)

        } catch (error) {
            alert('Users fetch failed')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    // Search and filter logic
    const filteredUsers = users.filter((user) => {

        const searchMatch =
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase())

        const statusMatch =
            statusFilter === 'all' ||
            (statusFilter === 'active' && user.active !== false) ||
            (statusFilter === 'inactive' && user.active === false)

        return searchMatch && statusMatch
    })

    // Edit button
    const handleEdit = (user) => {
        setSelectedUser(user)
        setName(user.name || '')
        setEmail(user.email || '')
        setImage(user.image || '')
    }

    // Image upload
    const handleImage = async (e) => {
        const file = e.target.files[0]

        if (!file) return

        if (!file.type.startsWith('image/')) {
            alert('Please select an image')
            e.target.value = ''
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be below 5MB')
            e.target.value = ''
            return
        }

        try {
            const compressedImage = await compressImage(file)
            setImage(compressedImage)
        } catch (error) {
            alert('Image processing failed')
        }

        e.target.value = ''
    }

    // Save edited user
    const handleUpdate = async (e) => {
        e.preventDefault()

        if (!name.trim() || !email.trim()) {
            alert('Name and email are required')
            return
        }

        try {
            setSaving(true)

            const response = await api.patch(
                `users/${selectedUser.id}`,
                {
                    name: name.trim(),
                    email: email.trim(),
                    image: image
                }
            )

            setUsers((previousUsers) =>
                previousUsers.map((user) =>
                    user.id === selectedUser.id
                        ? response.data
                        : user
                )
            )

            setSelectedUser(null)
            alert('User updated successfully')

        } catch (error) {
            alert('User update failed')
        } finally {
            setSaving(false)
        }
    }

    // Delete user
    const handleDelete = async (user) => {

        const confirmDelete = window.confirm(
            `Are you sure you want to delete ${user.name}?`
        )

        if (!confirmDelete) return

        try {
            await api.delete(`users/${user.id}`)

            setUsers((previousUsers) =>
                previousUsers.filter((item) => item.id !== user.id)
            )

            alert('User deleted successfully')

        } catch (error) {
            alert('User delete failed')
        }
    }

    // Activate / Deactivate
    const handleStatus = async (user) => {

        const currentlyActive = user.active !== false
        const newStatus = !currentlyActive

        const confirmStatus = window.confirm(
            `Are you sure you want to ${newStatus ? 'activate' : 'deactivate'} ${user.name}?`
        )

        if (!confirmStatus) return

        try {
            const response = await api.patch(
                `users/${user.id}`,
                { active: newStatus }
            )

            setUsers((previousUsers) =>
                previousUsers.map((item) =>
                    item.id === user.id ? response.data : item
                )
            )

        } catch (error) {
            alert('Status update failed')
        }
    }

    // Clear search and filter
    const handleClear = () => {
        setSearchTerm('')
        setStatusFilter('all')
    }
    const handleMakeAdmin = async (user) => {
        const confirmAdmin = window.confirm(
            `${user.name} ne Admin aakkan aano?`
        )

        if (!confirmAdmin) return

        try {
            await api.patch(`users/${user.id}`, {
                role: 'admin'
            })

            setUsers((prevUsers) =>
                prevUsers.filter((item) => item.id !== user.id)
            )

            alert('User successfully promoted to Admin!')
        } catch (error) {
            alert('Failed to make Admin')
        }
    }

    return (
        <div className="admin-users">

            <h2>Manage Users</h2>
            <p>View and manage registered users</p>

            {/* Search and Filter */}
            <div className="user-filters">

                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All Users</option>
                    <option value="active">Active Users</option>
                    <option value="inactive">Inactive Users</option>
                </select>

                <button
                    type="button"
                    onClick={handleClear}
                >
                    Clear
                </button>

            </div>

            {/* User count */}
            <p className="user-count">
                Showing {filteredUsers.length} of {users.length} users
            </p>

            {/* Users Table */}
            {loading ? (
                <p>Loading users...</p>
            ) : (
                <div className="users-table">

                    <table>

                        <thead>
                            <tr>
                                <th>Photo</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {filteredUsers.length > 0 ? (

                                filteredUsers.map((user) => (

                                    <tr key={user.id}>

                                        <td>
                                            {user.image ? (
                                                <img
                                                    className="user-photo"
                                                    src={user.image}
                                                    alt={user.name}
                                                />
                                            ) : (
                                                <div className="user-avatar">
                                                    {user.name?.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </td>

                                        <td>{user.name}</td>

                                        <td>{user.email}</td>

                                        <td>
                                            <span className={
                                                user.active === false
                                                    ? 'status inactive'
                                                    : 'status active'
                                            }>
                                                {user.active === false
                                                    ? 'Inactive'
                                                    : 'Active'}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="user-actions">

                                                <button
                                                    className="edit-btn"
                                                    onClick={() => handleEdit(user)}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="status-btn"
                                                    onClick={() => handleStatus(user)}
                                                >
                                                    {user.active === false
                                                        ? 'Activate'
                                                        : 'Deactivate'}
                                                </button>

                                                <button
                                                    className="view-btn"
                                                    onClick={() => setViewUser(user)}
                                                >
                                                    View
                                                </button>

                                                <button
                                                    className="delete-btn"
                                                    onClick={() => handleDelete(user)}
                                                >
                                                    Delete
                                                </button>

                                                <button
                                                    className="admin-btn"
                                                    onClick={() => handleMakeAdmin(user)}
                                                >
                                                    Make Admin
                                                </button>

                                            </div>
                                        </td>

                                    </tr>
                                ))

                            ) : (
                                <tr>
                                    <td colSpan="5">
                                        No users found
                                    </td>
                                </tr>
                            )}

                        </tbody>

                    </table>

                </div>
            )}
            {/* View User Details */}
            {viewUser && (
                <div className="edit-overlay">

                    <div className="view-user-card">

                        <h3>User Details</h3>

                        <div className="view-user-photo">
                            {viewUser.image ? (
                                <img
                                    src={viewUser.image}
                                    alt={viewUser.name}
                                />
                            ) : (
                                <div className="user-avatar">
                                    {viewUser.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        <div className="user-detail">
                            <strong>Name:</strong>
                            <span>{viewUser.name}</span>
                        </div>

                        <div className="user-detail">
                            <strong>Email:</strong>
                            <span>{viewUser.email}</span>
                        </div>

                        <div className="user-detail">
                            <strong>User ID:</strong>
                            <span>{viewUser.id}</span>
                        </div>

                        <div className="user-detail">
                            <strong>Role:</strong>
                            <span>{viewUser.role || 'user'}</span>
                        </div>

                        <div className="user-detail">
                            <strong>Status:</strong>
                            <span>
                                {viewUser.active === false
                                    ? 'Inactive'
                                    : 'Active'}
                            </span>
                        </div>

                        <button
                            className="close-view-btn"
                            onClick={() => setViewUser(null)}
                        >
                            Close
                        </button>

                    </div>

                </div>
            )}

            {/* Edit User Form */}
            {selectedUser && (

                <div className="edit-overlay">

                    <form
                        className="edit-user-form"
                        onSubmit={handleUpdate}
                    >

                        <h3>Edit User</h3>

                        <div className="edit-photo">

                            {image ? (
                                <img
                                    src={image}
                                    alt="Profile preview"
                                />
                            ) : (
                                <div className="user-avatar">
                                    {name.charAt(0).toUpperCase()}
                                </div>
                            )}

                            <label htmlFor="admin-user-image">
                                Change Photo
                            </label>

                            <input
                                id="admin-user-image"
                                type="file"
                                accept="image/*"
                                onChange={handleImage}
                            />

                        </div>

                        <label>Name</label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <label>Email</label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <div className="edit-buttons">

                            <button
                                type="submit"
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>

                            <button
                                type="button"
                                onClick={() => setSelectedUser(null)}
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>
            )}

        </div>
    )
}

export default AdminUsers
