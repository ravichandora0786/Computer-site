import { createAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  courseList: [],
  courseDetail: null,
  pagination: {
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
  },
};

const courseSlice = createSlice({
  name: "courseData",
  initialState,
  reducers: {
    setCourseList(state, action) {
      if (action.payload?.items) {
        state.courseList = action.payload.items;
        state.pagination = action.payload.pagination;
      } else {
        state.courseList = action.payload;
      }
    },
    setCourseDetail(state, action) {
      state.courseDetail = action.payload;
    },
  },
});

export default courseSlice.reducer;

// Actions
export const {
  setCourseList,
  setCourseDetail,
} = courseSlice.actions;

// Saga Triggers
export const getAllCourses = createAction("COURSE/GET_ALL_COURSES");
export const createCourse = createAction("COURSE/CREATE_COURSE");
export const updateCourse = createAction("COURSE/UPDATE_COURSE");
export const deleteCourse = createAction("COURSE/DELETE_COURSE");
export const updateCourseStatus = createAction("COURSE/UPDATE_STATUS");
