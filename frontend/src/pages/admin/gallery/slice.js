import { createAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  galleryList: [],
  pagination: {
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
  },
  loading: false,
};

const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setGalleryList(state, action) {
      if (action.payload?.items) {
        state.galleryList = action.payload.items;
        state.pagination = action.payload.pagination;
      } else {
        state.galleryList = action.payload;
      }
    },
  },
});

export default gallerySlice.reducer;

// Actions
export const {
  setLoading,
  setGalleryList,
} = gallerySlice.actions;

// Async Actions (Saga Handlers)
export const getGalleryItems = createAction("GALLERY/GET_ITEMS");
export const createGalleryItem = createAction("GALLERY/CREATE_ITEM");
export const deleteGalleryItem = createAction("GALLERY/DELETE_ITEM");
