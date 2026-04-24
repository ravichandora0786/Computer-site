import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  token: null,
  loading: false,
  error: null,
  isLoginModalOpen: false,
  isSignupModalOpen: false,
  dashboardStats: null,
};

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    // Modal controls
    openLoginModal: (state) => {
      state.isLoginModalOpen = true;
      state.isSignupModalOpen = false;
      state.error = null;
    },
    closeLoginModal: (state) => {
      state.isLoginModalOpen = false;
    },
    openSignupModal: (state) => {
      state.isSignupModalOpen = true;
      state.isLoginModalOpen = false;
      state.error = null;
    },
    closeSignupModal: (state) => {
      state.isSignupModalOpen = false;
    },
    
    // Auth actions
    userLoginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    userLoginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      state.isLoginModalOpen = false; // Close modal on success
      state.error = null;
    },
    userLoginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    userRegisterRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    userRegisterSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      state.isSignupModalOpen = false; // Close modal on success
      state.error = null;
    },
    userRegisterFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    userLogout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    enrollCourseSuccess: (state, action) => {
      if (state.user) {
        if (!state.user.enrolled_courses) {
          state.user.enrolled_courses = [];
        }
        state.user.enrolled_courses.push(action.payload);
      }
    },
    updateProfileSuccess: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    setDashboardStats: (state, action) => {
      state.dashboardStats = action.payload;
    }
  },
});

export const {
  openLoginModal,
  closeLoginModal,
  openSignupModal,
  closeSignupModal,
  userLoginRequest,
  userLoginSuccess,
  userLoginFailure,
  userRegisterRequest,
  userRegisterSuccess,
  userRegisterFailure,
  userLogout,
  clearAuthError,
  enrollCourseSuccess,
  updateProfileSuccess,
  setDashboardStats
} = userAuthSlice.actions;

export default userAuthSlice.reducer;
