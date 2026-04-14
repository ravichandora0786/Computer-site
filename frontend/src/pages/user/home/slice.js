import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {
    about: [],
    courses: [],
    mentors: [],
    ratings: [],
  },
  loading: false,
  error: null,
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    fetchHomeData: (state) => {
      state.loading = true;
    },
    fetchHomeSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    fetchHomeFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchHomeData, fetchHomeSuccess, fetchHomeFailure } = homeSlice.actions;
export default homeSlice.reducer;
