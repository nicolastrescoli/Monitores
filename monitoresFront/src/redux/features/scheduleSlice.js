import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activities: [],
};

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    addActivity: (state, action) => {
      state.activities.push(action.payload);
    },
    removeActivity: (state, action) => {
      state.activities = state.activities.filter(
        act => act.id !== action.payload
      );
    },
    updateActivity: (state, action) => {
      const index = state.activities.findIndex(
        act => act.id === action.payload.id
      );
      if (index !== -1) {
        state.activities[index] = action.payload;
      }
    },
  },
});

export const { addActivity, removeActivity, updateActivity } =
  scheduleSlice.actions;

export default scheduleSlice.reducer;
