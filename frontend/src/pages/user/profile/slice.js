import { createAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profileData",
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export default profileSlice.reducer;

// Actions
export const { setLoading, setError } = profileSlice.actions;

// Saga Triggers
export const updateProfileTrigger = createAction("PROFILE/UPDATE_PROFILE");
