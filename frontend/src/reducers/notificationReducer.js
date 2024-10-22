import {createSlice} from '@reduxjs/toolkit'

// Creates a slice of the redux store, with an initialState and reducers for that slice of the state
const notificationSlice = createSlice({
  name: 'notificaiton',
  initialState: {
    message: null,
    type: null
  },
  reducers: {
    setNotification (_state, action) {
      return action.payload
    },
    clearNotification (_state, _action){
      return {
        message: null,
        type: null
      }
    }
  }
})

// The slice.actions attribute stores action creators for the reducers specified in the recuers object of the slice
export const { setNotification, clearNotification } = notificationSlice.actions

// Exports the default reducer for the slice
export default notificationSlice.reducer