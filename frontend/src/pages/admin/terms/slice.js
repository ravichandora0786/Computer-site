import { createAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  termsAndConditionsList: [],
  pagination: {
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
  },
  loading: false,
};

const termsAndConditionsSlice = createSlice({
  name: "termsAndConditions",
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setTermsAndConditionsList(state, action) {
      if (action.payload?.items) {
        state.termsAndConditionsList = action.payload.items;
        state.pagination = action.payload.pagination;
      } else {
        state.termsAndConditionsList = action.payload;
      }
    },
  },
});

export default termsAndConditionsSlice.reducer;

// Reducer Actions
export const {
  setLoading,
  setTermsAndConditionsList,
} = termsAndConditionsSlice.actions;

// Async Actions (Saga Handlers)
export const getTermsAndConditions = createAction("TERMS_AND_CONDITIONS/GET_ALL");
export const createTermsAndConditions = createAction("TERMS_AND_CONDITIONS/CREATE");
export const updateTermsAndConditions = createAction("TERMS_AND_CONDITIONS/UPDATE");
export const deleteTermsAndConditions = createAction("TERMS_AND_CONDITIONS/DELETE");
