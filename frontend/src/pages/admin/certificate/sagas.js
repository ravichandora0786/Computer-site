import { takeLatest, call, put, all } from 'redux-saga/effects'
import { httpRequest, endPoints } from '@/request'
import { toast } from 'react-toastify'
import * as actions from './slice'

function* fetchRequestsSaga() {
  try {
    const response = yield call(httpRequest.get, endPoints.AllCertificates)
    yield put(actions.fetchRequestsSuccess(response.data))
  } catch (error) {
    yield put(actions.fetchRequestsFailure(error.message))
  }
}

function* fetchOptionsSaga() {
  try {
    const [uRes, cRes] = yield all([
      call(httpRequest.get, endPoints.UserOptions + '?user_type=student'),
      call(httpRequest.get, endPoints.CourseList)
    ])
    yield put(actions.fetchOptionsSuccess({
      users: uRes.data?.items || uRes.data,
      courses: cRes.data?.items || cRes.data
    }))
  } catch (error) {
    console.error(error)
  }
}

function* approveRequestSaga(action) {
  try {
    yield call(httpRequest.post, `${endPoints.ApproveCertificate}/${action.payload}`)
    toast.success("Certificate approved successfully!")
    yield put(actions.fetchRequests())
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to approve")
  }
}

function* generateDirectlySaga(action) {
  const { data, callback } = action.payload
  try {
    yield call(httpRequest.post, endPoints.GenerateCertificate, data)
    toast.success("Certificate generated successfully!")
    yield put(actions.generateDirectlySuccess())
    yield put(actions.fetchRequests())
    if (callback) callback()
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to generate")
    yield put(actions.generateDirectlyFailure())
  }
}

export default function* certificateSagas() {
  yield takeLatest(actions.fetchRequests.type, fetchRequestsSaga)
  yield takeLatest(actions.fetchOptions.type, fetchOptionsSaga)
  yield takeLatest(actions.approveRequest.type, approveRequestSaga)
  yield takeLatest(actions.generateDirectly.type, generateDirectlySaga)
}
