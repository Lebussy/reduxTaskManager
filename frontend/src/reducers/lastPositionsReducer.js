import { createSlice } from "@reduxjs/toolkit";

const positionsSlice = createSlice({
  name: 'lastPositions',
  initialState: {
    done: 0,
    notDone:0
  },
  reducers: {
    setLastDonePosition(state, action){
      state.done = action.payload
    },
    setLastNotDonePosition(state, action){
      state.notDone = action.payload
    },
    addToLastDonePosition(state, action){
      state.done += action.payload
    },
    addToLastNotDonePosition(state, action){
      state.notDone += action.payload
    }
    
  }
})

export const { setLastDonePosition, setLastNotDonePosition, addToLastDonePosition, addToLastNotDonePosition } = positionsSlice.actions

export default positionsSlice.reducer