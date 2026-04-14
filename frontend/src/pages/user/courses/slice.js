import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  pagination: null,
  loading: false,
  error: null,
  filters: {
    category_id: "",
    access_type: "",
    course_mode: "",
    search: "",
  },
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    fetchCourses: (state) => {
      state.loading = true;
    },
    fetchCoursesSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload.items;
      state.pagination = action.payload.pagination;
    },
    fetchCoursesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const { 
  fetchCourses, 
  fetchCoursesSuccess, 
  fetchCoursesFailure, 
  setFilters, 
  resetFilters 
} = coursesSlice.actions;

export default coursesSlice.reducer;
