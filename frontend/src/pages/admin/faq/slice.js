import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const faqSlice = createSlice({
  name: "adminFaq",
  initialState,
  reducers: {
    fetchFaqs: (state) => { state.loading = true; },
    fetchFaqsSuccess: (state, action) => { state.loading = false; state.list = action.payload; },
    fetchFaqsFailure: (state, action) => { state.loading = false; state.error = action.payload; },
    
    createFaq: (state) => { state.loading = true; },
    createFaqSuccess: (state) => { state.loading = false; },
    createFaqFailure: (state, action) => { state.loading = false; state.error = action.payload; },
    
    updateFaq: (state) => { state.loading = true; },
    updateFaqSuccess: (state) => { state.loading = false; },
    updateFaqFailure: (state, action) => { state.loading = false; state.error = action.payload; },
    
    deleteFaq: (state) => { state.loading = true; },
    deleteFaqSuccess: (state) => { state.loading = false; },
    deleteFaqFailure: (state, action) => { state.loading = false; state.error = action.payload; },
  },
});

export const {
  fetchFaqs, fetchFaqsSuccess, fetchFaqsFailure,
  createFaq, createFaqSuccess, createFaqFailure,
  updateFaq, updateFaqSuccess, updateFaqFailure,
  deleteFaq, deleteFaqSuccess, deleteFaqFailure,
} = faqSlice.actions;

export default faqSlice.reducer;
