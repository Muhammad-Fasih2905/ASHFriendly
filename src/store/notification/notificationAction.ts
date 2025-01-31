import { createAsyncThunk } from '@reduxjs/toolkit';
import apiCall from '../../services';
import { setLoading, showMessage } from '../common/commonSlice';
import { RootState } from '../Store';
import { saveNotifications } from './notificationSlice';

export const fetchNotifications = createAsyncThunk(
  'notifications',
  async (_, {dispatch, getState}) => {
    const state = getState() as RootState;
    const token = state.userSlice.token;
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: `notifications`,
        method: 'GET',
        token: token,
      });
      if (res.success === true) {
        dispatch(setLoading(false));
        dispatch(saveNotifications(res.data));
        
        return res;
      } else {
        dispatch(showMessage(res.message));
        dispatch(setLoading(false));
        return res;
      }
    } catch (error) {
      dispatch(setLoading(false));
    }
  },
);

export const storeFCMTokenInDB = createAsyncThunk(
  'store-fcm-token',
  async (FCMToken: string, {dispatch, getState}) => {
    const state = getState() as RootState;
    const token = state.userSlice.token;
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: `store-fcm-token`,
        method: 'POST',
        token: token,
        params: {fcm_token: FCMToken},
      }); 

      if (res.success === true) {
        dispatch(setLoading(false));

        return res;
      } else {
        dispatch(showMessage(res.message));
        return res;
      }
    } catch (error) {
      dispatch(setLoading(false));
    }
  },
);
