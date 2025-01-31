import { createSlice } from '@reduxjs/toolkit';
import { originObjTypes } from '../../interfaces/interfaces';

interface ProfileType {
  phone_number: string;
  name: string;
  dob: number;
  address?: string;
}
interface UserState {
  token: string | null;
  role: number | string;
  isLogin: boolean;
  user: null | any;
  emergency_contact:
    | null
    | {emergency_contact: string; id: number; user_id: number}[];
  preferencesData: null;
  profile: ProfileType | null;
  signupToken: string;
  location: null | {
    latitude: number;
    longitude: number;
  };
  my_location: null | {
    latitude: number;
    longitude: number;
  };
  location_name: string;
  about_content: any;
  terms_content: any;
  privacy_content: any;
  faqs_content: any;
  recent_searches: any[];
  filteredSearchResult: any[];
  filteredEstablishmentSearchResult: any[];
  currentEstablishmentDetails: any[];
  allEstablishmentTypes: any[];
  filteredResultMetaData: object;
  hotelLocation: {
    latitude: number;
    longitude: number;
    title: string;
  } | null;
  globalOrigin: null | originObjTypes;
  globalDestination: null | originObjTypes;
  availableFacilities: string[];
}

const initialState: UserState = {
  token: null,
  role: 2,
  isLogin: false,
  user: null,
  profile: null,
  signupToken: '',
  location: null,
  my_location: null,
  location_name: '',
  about_content: null,
  terms_content: null,
  faqs_content: null,
  privacy_content: null,
  preferencesData: null,
  emergency_contact: null,
  recent_searches: [],
  filteredSearchResult: [],
  filteredEstablishmentSearchResult: [],
  filteredResultMetaData: {},
  currentEstablishmentDetails: [],
  allEstablishmentTypes: [],
  hotelLocation: null,
  globalOrigin: null,
  globalDestination: null,
  availableFacilities: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken: (state, {payload}) => {
      state.token = payload;
    },
    setGlobalOrigin: (state, {payload}) => {
      state.globalOrigin = payload;
    },
    setGlobalDestination: (state, {payload}) => {
      state.globalDestination = payload;
    },
    setRole: (state, {payload}) => {
      state.role = payload;
    },
    setUser: (state, {payload}) => {
      state.user = payload;
    },
    updateLatLng: (state, {payload}) => {
      state.user.latitude = payload.latitude;
      state.user.longitude = payload.longitude;
    },
    setEmergencyConatct: (state, {payload}) => {
      state.emergency_contact = payload;
    },
    setProfile: (state, {payload}) => {
      state.profile = payload;
    },
    setSignupToken: (state, {payload}) => {
      state.signupToken = payload;
    },
    saveLocation: (state, {payload}) => {
      state.location = payload;
    },
    saveLocationName: (state, {payload}) => {
      state.location_name = payload;
    },
    saveMyLocation: (state, {payload}) => {
      state.my_location = payload;
    },
    saveRecentSearches: (state, {payload}) => {
      state.recent_searches = payload;
    },
    saveFilteredSearchResult: (state, {payload}) => {
      state.filteredSearchResult = payload;
    },
    updateSpecificEstablishment: (state, {payload}) => {
      const id = payload.id;
      const rating = payload.rating;
      console.log('payload id', id, 'payload rating, ', rating);
      const estabs = state.filteredEstablishmentSearchResult;
      const estabs2 = state.filteredEstablishmentSearchResult;
      const index = estabs.findIndex(item => {
        return item.id === id;
      });
      console.log('index 1 is', index);
      const index2 = estabs2.findIndex(item => {
        return item.id === id;
      });
      console.log('index 2 is', index2);
      if (index !== -1) {
        state.filteredEstablishmentSearchResult[index].rating = rating;
      }
      if (index2 !== -1) {
        state.filteredSearchResult[index].rating = rating;
      }
    },
    saveFilteredEstablishmentSearchResult: (state, {payload}) => {
      if (payload.meta.current_page === 1) {
        state.filteredEstablishmentSearchResult = payload.data;
      } else {
        state.filteredEstablishmentSearchResult = [
          ...state.filteredEstablishmentSearchResult,
          ...payload.data,
        ];
      }
    },
    saveFilteredEstablishmentFilterResult: (state, {payload}) => {
      state.filteredEstablishmentSearchResult = payload;
    },
    saveFilteredResultMetaData: (state, {payload}) => {
      state.filteredResultMetaData = payload.meta;
    },
    saveAllEstablishmentTypes: (state, {payload}) => {
      state.allEstablishmentTypes = payload;
    },
    saveCurrentEstablishmentDetails: (state, {payload}) => {
      state.currentEstablishmentDetails = payload;
    },
    setAboutContent: (state, {payload}) => {
      state.about_content = payload;
    },
    setTermsContent: (state, {payload}) => {
      state.terms_content = payload;
    },
    setPrivacyContent: (state, {payload}) => {
      state.privacy_content = payload;
    },
    setFaqsContent: (state, {payload}) => {
      state.faqs_content = payload;
    },
    setPreferences: (state, {payload}) => {
      state.preferencesData = payload;
    },
    setHotelLocation: (state, {payload}) => {
      state.hotelLocation = payload;
    },
    setIsLogin: (state, {payload}) => {
      state.isLogin = payload;
    },
    setAvailableFacilities: (state, {payload}) => {
      state.availableFacilities = payload;
    },
    resetState: () => initialState,
  },
});

export const {
  updateSpecificEstablishment,
  setGlobalOrigin,
  setGlobalDestination,
  saveAllEstablishmentTypes,
  saveFilteredEstablishmentSearchResult,
  saveCurrentEstablishmentDetails,
  saveFilteredSearchResult,
  saveRecentSearches,
  setToken,
  setRole,
  setUser,
  setSignupToken,
  saveLocation,
  saveMyLocation,
  saveLocationName,
  updateLatLng,
  setAboutContent,
  setTermsContent,
  setPrivacyContent,
  saveFilteredResultMetaData,
  setProfile,
  setFaqsContent,
  setPreferences,
  resetState,
  setEmergencyConatct,
  saveFilteredEstablishmentFilterResult,
  setHotelLocation,
  setIsLogin,
  setAvailableFacilities,
} = userSlice.actions;

export default userSlice.reducer;
