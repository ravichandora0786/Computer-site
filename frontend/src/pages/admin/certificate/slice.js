import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  requests: [],
  loading: false,
  error: null,
  users: [],
  courses: [],
  generating: false
}

const certificateSlice = createSlice({
  name: 'adminCertificate',
  initialState,
  reducers: {
    fetchRequests: (state) => {
      state.loading = true
    },
    fetchRequestsSuccess: (state, action) => {
      state.loading = false
      state.requests = action.payload
    },
    fetchRequestsFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    fetchOptions: (state) => {},
    fetchOptionsSuccess: (state, action) => {
      state.users = action.payload.users
      state.courses = action.payload.courses
    },
    approveRequest: (state, action) => {},
    generateDirectly: (state, action) => {
      state.generating = true
    },
    generateDirectlySuccess: (state) => {
      state.generating = false
    },
    generateDirectlyFailure: (state) => {
      state.generating = false
    }
  }
})

export const {
  fetchRequests,
  fetchRequestsSuccess,
  fetchRequestsFailure,
  fetchOptions,
  fetchOptionsSuccess,
  approveRequest,
  generateDirectly,
  generateDirectlySuccess,
  generateDirectlyFailure
} = certificateSlice.actions

export default certificateSlice.reducer
