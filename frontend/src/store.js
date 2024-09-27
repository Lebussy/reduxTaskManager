import { configureStore } from '@reduxjs/toolkit'
import taskReducer from './reducers/taskReducer'
import isEditReducer from './reducers/isEditReducer'
import lastPositionsReducer from './reducers/lastPositionsReducer'

const store = configureStore({
  reducer: {
    tasks: taskReducer,
    isEdit: isEditReducer,
    lastPositions: lastPositionsReducer
  }
})

export default store