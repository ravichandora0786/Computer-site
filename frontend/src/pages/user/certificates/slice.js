import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  certificates: [],
  loading: false,
  error: null,
  applying: null // Stores courseId of currently applying certificate
}

const userCertificateSlice = createSlice({
  name: 'userCertificate',
  initialState,
  reducers: {
    fetchUserCertificates: (state) => {
      state.loading = true
    },
    fetchUserCertificatesSuccess: (state, action) => {
      state.loading = false
      state.certificates = action.payload
    },
    fetchUserCertificatesFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    applyForCertificate: (state, action) => {
      state.applying = action.payload.courseId
    },
    applyForCertificateSuccess: (state) => {
      state.applying = null
    },
    applyForCertificateFailure: (state) => {
      state.applying = null
    }
  }
})

export const {
  fetchUserCertificates,
  fetchUserCertificatesSuccess,
  fetchUserCertificatesFailure,
  applyForCertificate,
  applyForCertificateSuccess,
  applyForCertificateFailure
} = userCertificateSlice.actions

export default userCertificateSlice.reducer
