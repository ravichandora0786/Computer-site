import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const aboutSectionSlice = createSlice({
  name: "adminAboutSection",
  initialState,
  reducers: {
    fetchAboutSections: (state) => { state.loading = true; },
    fetchAboutSectionsSuccess: (state, action) => { state.loading = false; state.list = action.payload; },
    fetchAboutSectionsFailure: (state, action) => { state.loading = false; state.error = action.payload; },
    
    createAboutSection: (state) => { state.loading = true; },
    createAboutSectionSuccess: (state) => { state.loading = false; },
    createAboutSectionFailure: (state, action) => { state.loading = false; state.error = action.payload; },
    
    updateAboutSection: (state) => { state.loading = true; },
    updateAboutSectionSuccess: (state) => { state.loading = false; },
    updateAboutSectionFailure: (state, action) => { state.loading = false; state.error = action.payload; },
    
    deleteAboutSection: (state) => { state.loading = true; },
    deleteAboutSectionSuccess: (state) => { state.loading = false; },
    deleteAboutSectionFailure: (state, action) => { state.loading = false; state.error = action.payload; },
  },
});

export const {
  fetchAboutSections, fetchAboutSectionsSuccess, fetchAboutSectionsFailure,
  createAboutSection, createAboutSectionSuccess, createAboutSectionFailure,
  updateAboutSection, updateAboutSectionSuccess, updateAboutSectionFailure,
  deleteAboutSection, deleteAboutSectionSuccess, deleteAboutSectionFailure,
} = aboutSectionSlice.actions;

export default aboutSectionSlice.reducer;
