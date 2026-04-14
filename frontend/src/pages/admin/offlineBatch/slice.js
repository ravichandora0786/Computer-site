import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const offlineBatchSlice = createSlice({
  name: "adminOfflineBatch",
  initialState,
  reducers: {
    fetchBatches: (state) => { state.loading = true; },
    fetchBatchesSuccess: (state, action) => { state.loading = false; state.list = action.payload; },
    fetchBatchesFailure: (state, action) => { state.loading = false; state.error = action.payload; },
    
    createBatch: (state) => { state.loading = true; },
    createBatchSuccess: (state) => { state.loading = false; },
    createBatchFailure: (state, action) => { state.loading = false; state.error = action.payload; },
    
    updateBatch: (state) => { state.loading = true; },
    updateBatchSuccess: (state) => { state.loading = false; },
    updateBatchFailure: (state, action) => { state.loading = false; state.error = action.payload; },
    
    deleteBatch: (state) => { state.loading = true; },
    deleteBatchSuccess: (state) => { state.loading = false; },
    deleteBatchFailure: (state, action) => { state.loading = false; state.error = action.payload; },
  },
});

export const {
  fetchBatches, fetchBatchesSuccess, fetchBatchesFailure,
  createBatch, createBatchSuccess, createBatchFailure,
  updateBatch, updateBatchSuccess, updateBatchFailure,
  deleteBatch, deleteBatchSuccess, deleteBatchFailure,
} = offlineBatchSlice.actions;

export default offlineBatchSlice.reducer;
