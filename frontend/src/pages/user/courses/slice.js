import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  pagination: null,
  loading: false,
  error: null,
  courseDetail: null,
  detailLoading: false,
  detailError: null,
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
    fetchCourseDetail: (state) => {
      state.detailLoading = true;
      state.detailError = null;
    },
    fetchCourseDetailSuccess: (state, action) => {
      state.detailLoading = false;
      state.courseDetail = action.payload;
    },
    fetchCourseDetailFailure: (state, action) => {
      state.detailLoading = false;
      state.detailError = action.payload;
    },
  },
});

export const { 
  fetchCourses, 
  fetchCoursesSuccess, 
  fetchCoursesFailure, 
  setFilters, 
  resetFilters,
  fetchCourseDetail,
  fetchCourseDetailSuccess,
  fetchCourseDetailFailure
} = coursesSlice.actions;

export default coursesSlice.reducer;
