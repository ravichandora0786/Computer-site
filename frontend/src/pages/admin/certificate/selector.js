export const selectCertificateState = (state) => state.adminCertificate || {}

export const selectRequests = (state) => (state.adminCertificate || {}).requests || []
export const selectLoading = (state) => (state.adminCertificate || {}).loading || false
export const selectGenerating = (state) => (state.adminCertificate || {}).generating || false
export const selectOptions = (state) => ({
  users: (state.adminCertificate || {}).users || [],
  courses: (state.adminCertificate || {}).courses || []
})
