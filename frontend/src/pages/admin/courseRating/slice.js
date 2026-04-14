import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const courseRatingSlice = createSlice({
  name: "adminCourseRating",
  initialState,
  reducers: {
    fetchCourseRatings: (state) => { state.loading = true; },
    fetchCourseRatingsSuccess: (state, action) => { state.loading = false; state.list = action.payload; },
    fetchCourseRatingsFailure: (state, action) => { state.loading = false; state.error = action.payload; },
    
    deleteCourseRating: (state) => { state.loading = true; },
    deleteCourseRatingSuccess: (state) => { state.loading = false; },
    deleteCourseRatingFailure: (state, action) => { state.loading = false; state.error = action.payload; },
  },
});

export const {
  fetchCourseRatings, fetchCourseRatingsSuccess, fetchCourseRatingsFailure,
  deleteCourseRating, deleteCourseRatingSuccess, deleteCourseRatingFailure
} = courseRatingSlice.actions;

export default courseRatingSlice.reducer;
