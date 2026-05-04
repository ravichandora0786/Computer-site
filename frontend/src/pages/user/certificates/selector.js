export const selectUserCertificateState = (state) => state.userCertificate || {}
  
export const selectUserCertificates = (state) => (state.userCertificate || {}).certificates || []
export const selectUserLoading = (state) => (state.userCertificate || {}).loading || false
export const selectApplyingStatus = (state) => (state.userCertificate || {}).applying || null
