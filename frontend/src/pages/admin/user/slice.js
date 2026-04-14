import { createAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  userList: [],
  userDetail: null,
};

const userSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setUserList(state, action) {
      state.userList = action.payload;
    },
    setUserDetail(state, action) {
      state.userDetail = action.payload;
    },
  },
});

export default userSlice.reducer;

// Actions
export const {
  setUserList,
  setUserDetail,
} = userSlice.actions;

// Saga Triggers
export const getAllUsers = createAction("USER/GET_ALL_USERS");
export const createUser = createAction("USER/CREATE_USER");
export const updateUser = createAction("USER/UPDATE_USER");
export const deleteUser = createAction("USER/DELETE_USER");
export const updateUserStatus = createAction("USER/UPDATE_STATUS");
