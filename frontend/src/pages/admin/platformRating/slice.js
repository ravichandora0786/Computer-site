import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const platformRatingSlice = createSlice({
  name: "adminPlatformRating",
  initialState,
  reducers: {
    fetchPlatformRatings: (state) => { state.loading = true; },
    fetchPlatformRatingsSuccess: (state, action) => { state.loading = false; state.list = action.payload; },
    fetchPlatformRatingsFailure: (state, action) => { state.loading = false; state.error = action.payload; },
    
    deletePlatformRating: (state) => { state.loading = true; },
    deletePlatformRatingSuccess: (state) => { state.loading = false; },
    deletePlatformRatingFailure: (state, action) => { state.loading = false; state.error = action.payload; },
  },
});

export const {
  fetchPlatformRatings, fetchPlatformRatingsSuccess, fetchPlatformRatingsFailure,
  deletePlatformRating, deletePlatformRatingSuccess, deletePlatformRatingFailure
} = platformRatingSlice.actions;

export default platformRatingSlice.reducer;
