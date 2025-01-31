import { createSlice } from '@reduxjs/toolkit';
import { Alert, Platform, ToastAndroid } from 'react-native';

const commonSlice = createSlice({
  name: 'common',
  initialState: {
    isLoading: false,
    isScreenLoading: false,
  },
  reducers: {
    setLoading: (state, { payload }) => {
      state.isLoading = payload;
    },
    setScreenLoading: (state, { payload }) => {
      state.isScreenLoading = payload;
    },
    showMessage: (_, { payload }) => {
      if (Platform.OS === 'android') {
        ToastAndroid.show(payload, ToastAndroid.SHORT);
      } else {
        Alert.alert('', payload);
      }
    },
  },
});

export const { setLoading, showMessage, setScreenLoading } = commonSlice.actions;

export default commonSlice.reducer;
