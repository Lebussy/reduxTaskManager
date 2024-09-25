import { configureStore } from '@reduxjs/toolkit'
import taskReducer from './reducers/taskReducer'
import isEditReducer from './reducers/isEditReducer'
import positionsReducer from './reducers/positionsReducer'

const store = configureStore({
  reducer: {
    tasks: taskReducer,
    isEdit: isEditReducer,
    positions: positionsReducer
  }
})

export default store