import { takeLatest, call, put } from 'redux-saga/effects'
import { httpRequest, endPoints } from '@/request'
import { toast } from 'react-toastify'
import * as actions from './slice'

function* fetchUserCertificatesSaga() {
  try {
    const response = yield call(httpRequest.get, endPoints.UserCertificates)
    yield put(actions.fetchUserCertificatesSuccess(response.data.data))
  } catch (error) {
    yield put(actions.fetchUserCertificatesFailure(error.message))
  }
}

function* applyForCertificateSaga(action) {
  const { courseId, custom_name } = action.payload
  try {
    yield call(httpRequest.post, endPoints.ApplyCertificate, { courseId, custom_name })
    toast.success("Certificate application submitted successfully!")
    yield put(actions.applyForCertificateSuccess())
    yield put(actions.fetchUserCertificates())
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to apply")
    yield put(actions.applyForCertificateFailure())
  }
}

export default function* userCertificateSagas() {
  yield takeLatest(actions.fetchUserCertificates.type, fetchUserCertificatesSaga)
  yield takeLatest(actions.applyForCertificate.type, applyForCertificateSaga)
}
