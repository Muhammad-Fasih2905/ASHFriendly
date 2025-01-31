import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'reviewSlice',
  initialState: {
    notifications: [],
  },
  reducers: {
    saveNotifications: (state, {payload})=> {
      state.notifications = payload;
    },
  },
});

export const {saveNotifications} = notificationSlice.actions;

export default notificationSlice.reducer;
