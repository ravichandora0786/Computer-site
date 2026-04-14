import { createAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  modules: [],
  currentTest: null,
  batches: [],
};

const courseContentSlice = createSlice({
  name: "courseContent",
  initialState,
  reducers: {
    setModules(state, action) {
      state.modules = action.payload;
    },
    setCurrentTest(state, action) {
      state.currentTest = action.payload;
    },
    setBatches(state, action) {
      state.batches = action.payload;
    },
  },
});

export default courseContentSlice.reducer;

// Actions
export const {
  setModules,
  setCurrentTest,
  setBatches,
} = courseContentSlice.actions;

// Saga Triggers
// Modules
export const getModulesByCourse = createAction("CONTENT/GET_MODULES");
export const createModuleAction = createAction("CONTENT/CREATE_MODULE");
export const updateModuleAction = createAction("CONTENT/UPDATE_MODULE");
export const deleteModuleAction = createAction("CONTENT/DELETE_MODULE");

// Lessons
export const createLessonAction = createAction("CONTENT/CREATE_LESSON");
export const updateLessonAction = createAction("CONTENT/UPDATE_LESSON");
export const deleteLessonAction = createAction("CONTENT/DELETE_LESSON");

// Lesson Pages
export const createPageAction = createAction("CONTENT/CREATE_PAGE");
export const updatePageAction = createAction("CONTENT/UPDATE_PAGE");
export const deletePageAction = createAction("CONTENT/DELETE_PAGE");

// Tests
export const getTestByModule = createAction("CONTENT/GET_TEST");
export const createTestAction = createAction("CONTENT/CREATE_TEST");
export const updateTestAction = createAction("CONTENT/UPDATE_TEST");
export const deleteTestAction = createAction("CONTENT/DELETE_TEST");

// Questions
export const createQuestionAction = createAction("CONTENT/CREATE_QUESTION");
export const updateQuestionAction = createAction("CONTENT/UPDATE_QUESTION");
export const deleteQuestionAction = createAction("CONTENT/DELETE_QUESTION");

// Batches
export const getBatchesByCourse = createAction("CONTENT/GET_BATCHES");
export const createBatchAction = createAction("CONTENT/CREATE_BATCH");
export const updateBatchAction = createAction("CONTENT/UPDATE_BATCH");
export const deleteBatchAction = createAction("CONTENT/DELETE_BATCH");
