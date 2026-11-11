
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../Api'

const getUser = () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
}

const InitialState = {
    user: getUser(),
    loading: false,
    error: null
}

export const SignUp = createAsyncThunk(
    'sign',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.post('users', data)

            const { password, ...safeUser } = response.data

            localStorage.setItem('user', JSON.stringify(safeUser))

            return safeUser

        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const Login = createAsyncThunk(
    'login',
    async (data, { rejectWithValue }) => {
        try {
            console.log("Login started:", data.email)

            const response = await api.get(`users?email=${data.email}`)

            const user = response.data[0]

            if (!user) {
                return rejectWithValue('User not found')
            }
            if (user.active === false) {
            return rejectWithValue('Your account is deactivated')
            }

            if (user.password !== data.password) {
                return rejectWithValue('Wrong password')
            }
          

            const { password, ...safeUser } = user

            localStorage.setItem('user', JSON.stringify(safeUser))

            return safeUser

        } catch (error) {
             console.log("Login error:", error)
            return rejectWithValue(error.message)
        }
    }
)

export const authSlice = createSlice({
    name: 'auth',
    initialState: InitialState,

    reducers: {
        Logout: (state) => {
            state.user = null
            state.error = null
            localStorage.removeItem('user')
        },

        Updateser: (state, action) => {
            state.user = action.payload
            localStorage.setItem('user', JSON.stringify(action.payload))
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(SignUp.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(SignUp.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload
            })
            .addCase(SignUp.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            .addCase(Login.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(Login.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload
            })
            .addCase(Login.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export const { Logout, Updateser } = authSlice.actions

export default authSlice.reducer
