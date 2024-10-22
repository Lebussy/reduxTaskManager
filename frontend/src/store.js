import { configureStore } from '@reduxjs/toolkit'
import taskReducer from './reducers/taskReducer'
import isEditReducer from './reducers/isEditReducer'
import lastPositionsReducer from './reducers/lastPositionsReducer'
import notificationReducer from './reducers/notificationReducer'

const store = configureStore({
  reducer: {
    tasks: taskReducer,
    isEdit: isEditReducer,
    lastPositions: lastPositionsReducer,
    notification: notificationReducer,
  }
})

export default store