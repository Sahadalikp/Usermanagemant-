import {configureStore} from '@reduxjs/toolkit'
import authReduser from './authSlice'


export const Store = configureStore({
    reducer:{
        auth:authReduser
    }
})
