import { createAsyncThunk } from '@reduxjs/toolkit';
import apiCall from '../../services';
import { setLoading, setScreenLoading, showMessage } from '../common/commonSlice';
import { persister, RootState } from '../store';
import {
  resetState,
  saveAllEstablishmentTypes,
  saveCurrentEstablishmentDetails,
  saveFilteredEstablishmentSearchResult,
  saveFilteredResultMetaData,
  saveFilteredSearchResult,
  saveLocation,
  saveLocationName,
  saveRecentSearches,
  setAboutContent,
  setAvailableFacilities,
  setEmergencyConatct,
  setFaqsContent,
  setPreferences,
  setPrivacyContent,
  setProfile,
  setRole,
  setSignupToken,
  setTermsContent,
  setToken,
  setUser
} from './UserSlice';

export const login = createAsyncThunk(
  'login',
  async (data: { email: string; password: string }, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: 'login',
        method: 'POST',
        body: data,
      });
      if (res.success === true) {
        console.log(res, 'res');
        dispatch(setUser(res.data));
        dispatch(setRole(res.data?.user.role_id));
        dispatch(setToken(res.data?.token));
        dispatch(setLoading(false));
        dispatch(saveLocationName(''));
        dispatch(saveLocation(null));
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

export const signUp = createAsyncThunk(
  'signUp',
  async (data: any, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: 'register',
        method: 'POST',
        body: data,
        isForm: true,
      });
      if (res.success === true) {
        dispatch(setLoading(false));
        dispatch(showMessage(res.message));
        dispatch(setRole(res.data?.user.role_id));
        dispatch(setSignupToken(res.data?.token));
        dispatch(setUser(res.data));
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

export const logout = createAsyncThunk(
  'logout',
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    const token = state.userSlice.token;
    try {
      dispatch(setLoading(false));
      const res = await apiCall({
        path: 'logout',
        method: 'POST',
        token: token,
      });
      if (res.success === true) {
        dispatch(setLoading(false));
        dispatch(setToken(null));
        dispatch(resetState());
        await persister.purge();
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

export const forgetPassword = createAsyncThunk(
  'forgetPassword',
  async (data: { email: string }, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: 'forgot-password',
        method: 'POST',
        body: data,
      });

      if (res.success === true) {
        console.log(res, 'res');
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
export const sendOtp = createAsyncThunk(
  'email-verification-otp-send',
  async (data: { email: string }, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: 'email-verification-otp-send',
        method: 'POST',
        body: data,
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
export const getOtp = createAsyncThunk(
  'validate-otp-email',
  async (data: { email: string; otp: string }, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: 'validate-otp-email',
        method: 'GET',
        params: data,
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

export const emergencyContact = createAsyncThunk(
  'emergencyContact',
  async (data: { emergency_contacts: string[] }, { dispatch, getState }) => {
    const state = getState() as RootState;
    const signupToken = state.userSlice.signupToken;
    const token = state.userSlice.token;
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: 'user/update-emergency-contacts',
        method: 'POST',
        body: data,
        token: token || signupToken,
      });
      if (res.success === true) {
        dispatch(showMessage(res.message));
        dispatch(setLoading(false));
        console.log(res, 'res');
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
export const fetchEmergencyContacts = createAsyncThunk(
  'user/emergency-contacts',
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    const token = state.userSlice.token;

    try {
      dispatch(setScreenLoading(true));
      const res = await apiCall({
        path: 'user/emergency-contacts',
        method: 'GET',
        token: token,
      });
      if (res.success === true) {
        dispatch(setEmergencyConatct(res?.data?.emergency_contacts));
        return res;
      } else {
        dispatch(showMessage(res.message));
        return res;
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      dispatch(setScreenLoading(false));
    }
  },
);

export const updatePreferences = createAsyncThunk(
  'updatePreferences',
  async (
    data: {
      gender: string;
      age?: number;
      religion: string;
      skin_tone: string;
      disability: string;
    },
    { dispatch, getState },
  ) => {
    const state = getState() as RootState;
    const signupToken = state.userSlice.signupToken;
    const token = state.userSlice.token;
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: 'user/update-preferences',
        method: 'POST',
        body: data,
        token: token || signupToken,
      });
      if (res.success === true) {
        dispatch(setPreferences(res?.data));
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
export const fetchPersonalPreferences = createAsyncThunk(
  'user/personal-preferences',
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    const signupToken = state.userSlice.signupToken;
    const token = state.userSlice.token;
    try {
      dispatch(setScreenLoading(true));
      const res = await apiCall({
        path: 'user/personal-preferences',
        method: 'GET',
        token: token || signupToken,
      });
      if (res.success === true) {
        dispatch(setPreferences(res?.data));

        return res;
      } else {
        dispatch(showMessage(res.message));

        return res;
      }
    } catch (error) {
      console.log('fetchPersonalPreferences error', error);
    } finally {
      dispatch(setScreenLoading(false));
    }
  },
);
export const updateOwnerProfile = createAsyncThunk(
  'establishment-update-owner-profile',
  async (
    { data, apiPath }: { data: any; apiPath: string },
    { dispatch, getState },
  ) => {
    const state = getState() as RootState;
    const token = state.userSlice.token;
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: apiPath,
        method: 'POST',
        body: data,
        token: token,
      });
      console.log(res, 'res');

      if (res.success === true) {
        dispatch(showMessage(res.message));
        dispatch(setLoading(false));
        dispatch(setProfile(res?.data));
        dispatch(setUser({ user: res.data }));
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

export const changePassword = createAsyncThunk(
  'changePassword',
  async (
    data: {
      current_password: string;
      new_password: string;
      new_password_confirmation: string;
    },
    { dispatch, getState },
  ) => {
    const state = getState() as RootState;
    const token = state.userSlice.token;
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: 'update-password',
        method: 'POST',
        body: data,
        token: token,
      });

      if (res.success === true) {
        console.log(res, 'res');
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

export const app_info = createAsyncThunk(
  'app_info',
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    const token = state.userSlice.token;
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: 'profile_app_info',
        method: 'GET',
        token: token,
      });

      console.log(res, 'res');
      if (res.success === true) {
        console.log(res, 'res');
        dispatch(setAboutContent(res?.about_content));
        dispatch(setTermsContent(res?.terms_content));
        dispatch(setPrivacyContent(res?.privacy_content));
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
export const faqs_info = createAsyncThunk(
  'app_info',
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    const token = state.userSlice.token;
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: 'faqs',
        method: 'GET',
        token: token,
      });

      console.log(res, 'res');
      if (res.success === true) {
        console.log(res, 'res');
        dispatch(setFaqsContent(res?.faqs));
        return res;
      } else {
        return res;
      }
    } catch (error) {
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const getRecentSearches = createAsyncThunk(
  'user/establishments-filter',
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    const token = state.userSlice.token;
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: `user/establishments-filter`,
        method: 'GET',
        token: token,
      });
      if (res.success === true) {
        dispatch(setLoading(false));
        dispatch(saveRecentSearches(res.recent_searches));
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
export const getFilteredSearchResult = createAsyncThunk(
  'user/establishments-filter',
  async (data: string, { dispatch, getState }) => {
    const state = getState() as RootState;
    const token = state.userSlice.token;
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: `user/establishments-filter`,
        method: 'GET',
        params: { name: data },
        token: token,
      });
      if (res.success === true) {
        dispatch(setLoading(false));
        dispatch(saveFilteredSearchResult(res.data));
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

export const getEstablishmentDetails = createAsyncThunk(
  'user/establishments',
  async (id: string, { dispatch, getState }) => {
    const state = getState() as RootState;
    const token = state.userSlice.token;
    dispatch(setLoading(true));
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: `user/establishments/${id}`,
        method: 'GET',
        token: token,
      });
      if (res.success === true) {
        dispatch(saveCurrentEstablishmentDetails(res.data));
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

export const updateProfileImage = createAsyncThunk(
  'update/profile/picture',
  async (data: any, { dispatch, getState }) => {
    const state = getState() as RootState;
    const token = state.userSlice.token;
    try {
      const res = await apiCall({
        path: `update/profile/picture`,
        method: 'POST',
        token: token,
        body: data,
        isForm: true,
      });
      console.log('profile res ===>', res);
      if (res.success === true) {
        dispatch(showMessage(res.message));
        dispatch(setUser(res));
        return res;
      } else {
        dispatch(showMessage(res.message));
        return res;
      }
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error);
    }
  },
);

export const getFilteredEstablishmentSearchResult = createAsyncThunk(
  'user/establishments-filter',
  async (
    data: { id: number; current_page: number; per_page: number },
    { dispatch, getState },
  ) => {
    console.log('data', data);
    const state = getState() as RootState;
    const token = state.userSlice.token;
    try {
      let paramsObject = {};
      dispatch(setLoading(true));
      if (data.id) {
        paramsObject.establishment_types = [data.id];
      }
      if (data.current_page) {
        paramsObject.page = data.current_page;
      }
      if (data.per_page) {
        paramsObject.per_page = data.per_page;
      }
      const res = await apiCall({
        path: `user/establishments-filter`,
        method: 'GET',
        params: paramsObject,
        token: token,
      });
      if (res.success === true) {
        dispatch(saveFilteredEstablishmentSearchResult(res));
        dispatch(saveFilteredResultMetaData(res));
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

export const getEstablishmentTypes = createAsyncThunk(
  'establishment-types',
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    const token = state.userSlice.token;
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: `establishment-types`,
        method: 'GET',
      });
      if (res.success === true) {
        dispatch(setLoading(false));
        dispatch(saveAllEstablishmentTypes(res.data));
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

export const socialLogin = createAsyncThunk(
  'social-signup-and-login-merged',
  async (data: any, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: `social/signup/and/login/${data?.type}/callback`,
        method: 'POST',
        body:
          data?.type == 'apple'
            ? { email: data?.email, code: data?.code, role_id: data?.role_id }
            : { code: data?.code, role_id: data?.role_id },
      });
      dispatch(setLoading(false));
      if (res.success === true) {
        dispatch(setUser({ user: res.user }));
        dispatch(setRole(res.user.role_id));
        dispatch(setToken(res.token));
        dispatch(setLoading(false));
        return res;
      } else {
        console.log(res.message, 'messagemessagemessage');

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

export const sendPanicAlert = createAsyncThunk(
  'social-signup-and-login-merged',
  async (data: any, { dispatch, getState }) => {
    const state = getState() as RootState;
    const token = state.userSlice.token;
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: 'user/send-panic-alert',
        method: 'POST',
        token: token,
        body: data,
      });
      console.log(res, 'res');
      dispatch(setLoading(false));
      if (res.success === true) {
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

export const getAllFacilities = createAsyncThunk(
  'get-all-facilities',
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    const token = state.userSlice.token;
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: 'get-all-facilities',
        method: 'GET',
        token: token,
      });
      console.log(res, 'res');
      dispatch(setLoading(false));
      if (res.success === true) {
        dispatch(setAvailableFacilities(res.data));
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
