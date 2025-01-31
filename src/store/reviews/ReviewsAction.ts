import { createAsyncThunk } from '@reduxjs/toolkit';
import apiCall from '../../services';
import { setLoading, showMessage } from '../common/commonSlice';
import { RootState } from '../Store';
import { setEstablishment, setReviews } from './ReviewsSlice';

export const getReviewDetails = createAsyncThunk(
    'getReviewDetails',
    async (data: { id: number }, { dispatch, getState }) => {
        const state = getState() as RootState;
        const token = state.userSlice.token;
        try {
            dispatch(setLoading(true));
            const res = await apiCall({
                path: `establishments/${data?.id}/reviews`,
                method: 'GET',
                token: token
            });
            if (res.success === true) {
                dispatch(setLoading(false));
                dispatch(setEstablishment(res?.data?.establishment));
                dispatch(setReviews(res?.data?.reviews));
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
export const addRview = createAsyncThunk(
    'user/establishment/review',
    async (data: any, { dispatch, getState }) => {
        const state = getState() as RootState;
        const token = state.userSlice.token;
        try {
            dispatch(setLoading(true));
            const res = await apiCall({
                path: `user/establishment/review`,
                method: 'POST',
                body: data,
                isForm: true,
                token: token
            });
            console.log("write review res", res)
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
    },
);