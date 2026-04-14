import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categoryList: [],
  pagination: {
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
  },
  isLoading: false,
  error: null,
};

const courseCategorySlice = createSlice({
  name: "courseCategory",
  initialState,
  reducers: {
    getAllCategories: (state) => {
      state.isLoading = true;
    },
    setCategoryList: (state, action) => {
      if (action.payload?.items) {
        state.categoryList = action.payload.items;
        state.pagination = action.payload.pagination;
      } else {
        state.categoryList = action.payload;
      }
      state.isLoading = false;
    },
    createCategory: (state) => {
      state.isLoading = true;
    },
    updateCategory: (state) => {
      state.isLoading = true;
    },
    deleteCategory: (state) => {
      state.isLoading = true;
    },
    reorderCategories: (state) => {
      state.isLoading = true;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  getAllCategories,
  setCategoryList,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
  setLoading,
  setError,
} = courseCategorySlice.actions;

export default courseCategorySlice.reducer;
