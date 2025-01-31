import { createAsyncThunk } from "@reduxjs/toolkit";
import apiCall from "../../services";
import { setLoading, showMessage } from "../common/commonSlice";

export const UpdatePassword = createAsyncThunk('update-password',async (
    data: {
        current_password: string;
        new_password: string;
        new_password_confirmation: string; 
    },
    {dispatch},
  ) => {
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: 'update-password',
        method: 'POST',
        body: data,
      });
      if (res.success === true) {
        dispatch(setLoading(false));
        dispatch(showMessage(res.message));
        return res;
      } else {
        dispatch(showMessage(res.message));
        dispatch(setLoading(false));
        return res;
      }
    } catch (error) {
      dispatch(setLoading(false));
    }
});

export const UpdatePwnerProfile = createAsyncThunk('establishment/update-owner-profile',async (data: {name: string;phone_number: number;},{dispatch}) => {
   
});
