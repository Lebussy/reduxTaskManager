import { createSlice } from "@reduxjs/toolkit";

const positionsSlice = createSlice({
  name: 'positions',
  initialState: {lastPositions: {
    done: 0,
    notDone:0
  }},
  reducers: {
    setLastDonePosition(state, action){
      state.lastPositions.done = action.payload
    },
    setLastNotDonePosition(state, action){
      state.lastPositions.notDone = action.payload
    },
    addToLastDonePosition(state, action){
      state.lastPositions.done += action.payload
    },
    addToLastNotDonePosition(state, action){
      state.lastPositions.notDone += action.payload
    }
    
  }
})

export const { setLastDonePosition, setLastNotDonePosition, addToLastDonePosition, addToLastNotDonePosition } = positionsSlice.actions

export default positionsSlice.reducer