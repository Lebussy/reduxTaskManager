import { createSlice } from "@reduxjs/toolkit";
import { notify } from "./notificationReducer";
import loginService from '../services/login'
import taskService from '../services/tasks'
import userHelper from './reducerHelpers/userHelper'

// Slice for storing the user data
const userSlice = createSlice({
  name:'user',
  // Lazy initialiser which reads user data from localstorage if it exists
  initialState: userHelper.getInitialUserState() || {loggedIn:false},
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
      window.localStorage.setItem('user', JSON.stringify({username, name, token}))
    } catch (error) {
      dispatch(notify(error.response.data.error, 'Login Failed', 5))
    }
  }
}

// Action creator that logs the user out and clears all notification messages
export const logOut = () => {
  return async (dispatch) => {
    dispatch(clearUser())
    window.localStorage.removeItem('user')
  }
}

export default userSlice.reducer