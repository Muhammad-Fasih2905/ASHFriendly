import { createAsyncThunk } from '@reduxjs/toolkit';
import apiCall from '../../services';
import { setLoading, setScreenLoading, showMessage } from '../common/commonSlice';
import { RootState } from '../Store';
import { setGlobalDestination, setHotelLocation } from '../user/UserSlice';
import {
  saveEstablishmentImages,
  saveEstablishmentOwnerDetails,
  saveEstablishments,
  saveEstablishmentTypes,
  saveOwnerEstablishmentDetails,
  saveQuestions
} from './establishmentSlice';
import { saveEstablishmentDetails } from './establishmentSliceDetails';

export const getEstablishments = createAsyncThunk(
  'establishments',
  async (token: string | null, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: 'user/home-screen',
        method: 'GET',
        token: token,
      });

      if (res.success === true) {
        dispatch(setLoading(false));
        dispatch(saveEstablishments({ type: 'all', data: res.data }));
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

export const getEstablishmentTypes = createAsyncThunk(
  'establishment-types',
  async (_, { dispatch }) => {
    try {
      // dispatch(setLoading(true));
      const res = await apiCall({
        path: 'establishment-types',
        method: 'GET',
      });
      if (res.success === true) {
        dispatch(saveEstablishmentTypes(res.data));
        dispatch(setLoading(false));
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

export const addEstablishmentDetails = createAsyncThunk(
  'establishment-types',
  async (data: any, { dispatch, getState }) => {
    const state = getState() as RootState;
    const signupToken = state.userSlice.signupToken;
    const token = state.userSlice.token;
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: 'establishment/store-establishment-detail',
        method: 'POST',
        body: data,
        token: signupToken || token,
      });
      if (res.success === true) {
        dispatch(showMessage(res.message));
        dispatch(setLoading(false));
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

export const addEstablishmentImage = createAsyncThunk(
  'establishment-add-update-images',
  async (data: any, { dispatch, getState }) => {
    console.log('establishment-add-update-images data: ----', data);
    const state = getState() as RootState;
    const signupToken = state.userSlice.signupToken;
    const token = state.userSlice.token;
    console.log(signupToken);
    console.log(token);
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: 'establishment/add-update-images',
        method: 'POST',
        body: data,
        token: signupToken || token,
        isForm: true,
      });
      console.log('res, upload=========== ', res);
      if (res.success === true) {
        dispatch(showMessage(res.message));
        dispatch(setLoading(false));
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

export const updateEstablishmentImage = createAsyncThunk(
  'establishment/update-image',
  async (data: any, { dispatch, getState }) => {
    const state = getState() as RootState;
    const token = state.userSlice.token;

    try {
      const res = await apiCall({
        path: 'establishment/update-image',
        method: 'POST',
        body: data,
        token: token,
        isForm: true,
      });
      if (res.success === true) {
        dispatch(showMessage(res.message));
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

export const getEstablishmentsDetails = createAsyncThunk(
  'getEstablishmentsDetails',
  async (data: { token: string | null; id: number }, { dispatch }) => {
    try {
      const res = await apiCall({
        path: `user/establishments/${data?.id}`,
        method: 'GET',
        token: data?.token,
      });
      // console.log(res?.data, 'user/establishments/');
      if (res.success === true) {
        dispatch(saveEstablishmentDetails({ meta: res?.meta, data: res?.data }));
        dispatch(
          setHotelLocation({
            ...res.data.coordinates,
            title: res.data?.address?.full,
          }),
        );
        dispatch(
          setGlobalDestination({
            ...res.data.coordinates,
            title: res.data?.address?.full,
          }),
        );
        return res;
      } else {
        dispatch(showMessage(res.message));
        return res;
      }
    } catch (error) {
      console.log(error, "===> error");
    }
  },
);

export const getEstablishmentsDashboard = createAsyncThunk(
  'establishment/dashboard',
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    const token = state.userSlice.token;
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: 'establishment/dashboard',
        method: 'GET',
        token: token,
      });
      if (res.success === true) {
        dispatch(saveEstablishmentOwnerDetails(res.data));
        dispatch(setLoading(false));
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

export const getEstablishmentImages = createAsyncThunk(
  'establishment/get-images',
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    const token = state.userSlice.token;
    try {
      const res = await apiCall({
        path: 'establishment/get-images',
        method: 'GET',
        token: token,
      });
      console.log('imggg', res);
      if (res.success === true) {
        dispatch(saveEstablishmentImages(res.data));
        return res;
      } else {
        dispatch(showMessage(res.message));
        return res;
      }
    } catch (error) {
      console.log(error, 'error');
    }
  },
);

export const getFilter = createAsyncThunk(
  'user/establishments-filter',
  async (data: {}, { dispatch, getState }) => {
    // console.log('data: ', data);
    const state = getState() as RootState;
    const token = state.userSlice.token;
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: `user/establishments-filter?`,
        method: 'GET',
        params: data,
        token: token,
      });
      if (res.success === true) {
        // dispatch(saveEstablishments({type: 'all', data: res.data}));
        return res;
      } else {
        dispatch(showMessage(res.message));
        return res;
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const getQuestions = createAsyncThunk(
  'questions',
  async (_, { dispatch }) => {
    try {
      dispatch(setScreenLoading(true));
      const res = await apiCall({
        path: `accessibility-questions`,
      });
      if (res.success === true) {
        if (res?.data?.questions?.length > 0) {
          const updatedQuestion = res?.data?.questions?.map((item: any) => {
            if (item?.answer_type == 'option') {
              return {
                ...item,
                is_answered: false,
                options: item?.options?.map((opt: any) => {
                  return {
                    ...opt,
                    is_selected: false,
                  };
                }),
              };
            } else {
              return { ...item, is_answered: false };
            }
          });
          dispatch(saveQuestions(updatedQuestion));
        }
        dispatch(setScreenLoading(false));
        return res;
      } else {
        dispatch(setScreenLoading(false));
        return res;
      }
    } catch (error) {
      console.log('qs error', error);
      dispatch(setScreenLoading(false));
    }
  },
);

export const saveAnswers = createAsyncThunk(
  'answers',
  async (data: any, { dispatch, getState }) => {
    console.log('data: ', data);
    const state = getState() as RootState;
    const token = state.userSlice.signupToken;
    const Apptoken = state.userSlice.token;
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: `establishment/store-accessibility-answers`,
        method: 'POST',
        body: { answers: data },
        token: token || Apptoken,
      });
      if (res.success === true) {
        dispatch(setLoading(false));
        return res;
      } else {
        dispatch(setLoading(false));
        return res;
      }
    } catch (error) {
      dispatch(setLoading(false));
    }
  },
);
export const getAnswers = createAsyncThunk(
  'getanswers',
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    const token = state.userSlice.token;
    try {
      dispatch(setScreenLoading(true));
      console.log(token, 'tokentoken');
      const res = await apiCall({
        path: `establishment/get-accessibility-answers`,
        method: 'GET',
        token: token,
      });

      if (res.success === true) {
        dispatch(saveQuestions(res.data.questions));
        dispatch(setScreenLoading(false));
        return res.data;
      } else {
        dispatch(setScreenLoading(false));
        return res;
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      dispatch(setScreenLoading(false));
    }
  },
);
export const getEstablishmentDetails = createAsyncThunk(
  'establishment/details',
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    const token = state.userSlice.token;
    try {
      const res = await apiCall({
        path: `establishment/details`,
        method: 'GET',
        token: token,
      });
      if (res.success === true) {
        dispatch(saveOwnerEstablishmentDetails(res.data));
        dispatch(setLoading(false));
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

export const updateEstablishmentDetails = createAsyncThunk(
  'establishment-types',
  async (data: any, { dispatch, getState }) => {
    const state = getState() as RootState;
    const signupToken = state.userSlice.signupToken;
    const token = state.userSlice.token;
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: 'establishment/store-establishment-detail',
        method: 'POST',
        body: data,
        token: signupToken || token,
      });
      if (res.success === true) {
        dispatch(showMessage(res.message));
        dispatch(getEstablishmentsDashboard());
        dispatch(setLoading(false));
        return res;
      } else {
        dispatch(showMessage(res.message));
        dispatch(setLoading(false));
        return res;
      }
    } catch (error) {
      console.log(error);
      dispatch(setLoading(false));
    }
  },
);
