import { takeLatest, put, call } from 'redux-saga/effects';
import { loginApp, logoutApp } from './slice';
import { toast } from 'react-toastify';

function* loginAppSaga(action) {
  // Common login saga if needed
}

function* logoutAppSaga(action) {
  // Clear logic or dispatch toast
  toast.success('Logged out successfully');
}

export function* commonSagas() {
  yield takeLatest(loginApp.type, loginAppSaga);
  yield takeLatest(logoutApp.type, logoutAppSaga);
}
