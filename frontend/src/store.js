import { configureStore } from '@reduxjs/toolkit'
import taskReducer from './reducers/taskReducer'
import isEditReducer from './reducers/isEditReducer'
import lastPositionsReducer from './reducers/lastPositionsReducer'
import notificationReducer from './reducers/notificationReducer'
import userReducer from './reducers/userReducer'

const store = configureStore({
  reducer: {
    tasks: taskReducer,
    isEdit: isEditReducer,
    lastPositions: lastPositionsReducer,
    notification: notificationReducer,
    user: userReducer
  }
})

export default store