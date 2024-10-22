import { createSlice } from "@reduxjs/toolkit";
import { clearNotification, notify } from "./notificationReducer";
import loginService from '../services/login'
import taskService from '../services/tasks'

// Slice for storing the user data
const userSlice = createSlice({
  name:'user',
  initialState: {loggedIn:false},
  reducers: {
    // Sets the user data in the store
    setUser (state, action) {
      const {username, name, token} = action.payload
      return ({username, name, token, loggedIn: true})
    },
    // Clears the user data and sets logged in to false
    clearUser (_state, _action) {
      return ({loggedIn:false})
    }
  }
})

export const { setUser, clearUser } = userSlice.actions

// Asynchronous action creator (thunk function) that tries to log in and sets the user data
export const login = (credentials) => {
  return async (dispatch) => {
    try {
      const {username, name, token} = await loginService.login(credentials)
      dispatch(setUser({username, name, token}))
      taskService.setAuthToken(token)
    } catch (error) {
      dispatch(notify(error.response.data.error, 'Login Failed', 5))
    }
  }
}

// Action creator that logs the user out and clears all notification messages
export const logOut = () => {
  return async (dispatch) => {
    dispatch(clearUser())
    dispatch(clearNotification())
  }
}

export default userSlice.reducer