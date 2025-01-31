import { createSlice } from '@reduxjs/toolkit';

export interface AccessibilityQuestionTypes {
  id: number,
  question: string,
  answer_type: string,
  options: null | []
}
export interface metaDataTypes {
  totalQuestions: number,
  from: number,
  to: number,
  currentPage: number,
}
const establishmentSlice = createSlice({
  name: 'establishment',
  initialState: {
    isLoading: false as boolean,
    questions: [] as AccessibilityQuestionTypes[],
    metaData: {} as metaDataTypes,
    establishments: {
      establishment_types: [],
      featured_establishments: [],
      nearby_restaurants: [],
      nearby_hotels: [],
    },
    establishmentTypes: [],
    establishmentOwnerDetails: [],
    establishmentImages: [],
    ownerEstablishmentDetails: {},
  },
  reducers: {
    saveEstablishments: (state, {payload}) => {
      if (payload.type === 'all') {
        state.establishments = payload.data;
      }
    },
    saveEstablishmentTypes: (state, {payload}) => {
      state.establishmentTypes = payload;
    },
    saveQuestions: (state, {payload}) => {
      state.questions = payload;
    },
    saveMetaData: (state, {payload}) => {
      state.metaData = payload;
    },
    saveEstablishmentOwnerDetails: (state, {payload}) => {
      state.establishmentOwnerDetails = payload;
    },
    saveEstablishmentImages: (state, {payload}) => {
      state.establishmentImages = payload;
    },
    saveOwnerEstablishmentDetails: (state, {payload}) => {
      state.ownerEstablishmentDetails = payload;
    },
    saveFilteredEstablishment: (state, {payload}) => {
      state.establishments = {
        ...state.establishments,
        featured_establishments: payload,
      };
    },
  },
});

export const {
  saveMetaData,
  saveQuestions,
  saveEstablishments,
  saveEstablishmentTypes,
  saveEstablishmentOwnerDetails,
  saveEstablishmentImages,
  saveOwnerEstablishmentDetails,
  saveFilteredEstablishment,
} = establishmentSlice.actions;

export default establishmentSlice.reducer;
