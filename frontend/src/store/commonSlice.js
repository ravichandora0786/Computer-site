import { createAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  accessToken: null,
  refreshToken: null,
  rolePermissionsMap: [],
  fullScreenLoader: false,
};

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },
    setRefreshToken(state, action) {
      state.refreshToken = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    setRolePermissionsMap(state, action) {
      state.rolePermissionsMap = action.payload;
    },
    setFullScreenLoader(state, action) {
      state.fullScreenLoader = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutApp, () => {
      return initialState;
    });
  },
});

// Reducer
export const commonReducer = commonSlice.reducer;

// Actions
export const {
  setUser,
  setAccessToken,
  setRefreshToken,
  setRolePermissionsMap,
  setFullScreenLoader,
} = commonSlice.actions;

// Other Actions
export const loginApp = createAction("COMMON/LOGIN");
export const logoutApp = createAction("COMMON/LOGOUT");
export const logoutWithBackend = createAction("COMMON/LOGOUT_WITH_BACKEND");
export const resetPassword = createAction("COMMON/RESET_PASSWORD");

export default commonSlice;
