import { configureStore } from '@reduxjs/toolkit'
import taskReducer from './reducers/taskReducer'
import isEditReducer from './reducers/isEditReducer'
import lastPositionsReducer from './reducers/lastPositionsReducer'
import notificaionReducer from './reducers/notificationReducer'

const store = configureStore({
  reducer: {
    tasks: taskReducer,
    isEdit: isEditReducer,
    lastPositions: lastPositionsReducer,
    notificaion: notificaionReducer,
  }
})

export default store