import { call, put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus,
  setUserList
} from "./slice";
import { endPoints, httpRequest } from "../../../request";

function* getAllUsersSaga(action) {
  const { data, onSuccess, onFailure } = action.payload || {};
  try {
    const response = yield call(httpRequest.get, endPoints.UserList, { params: data });
    yield put(setUserList(response?.data || []));
    if (onSuccess) yield call(onSuccess, { message: response?.message, data: response?.data });
  } catch (err) {
    const errorMessage = err.message || "Failed to fetch users";
    toast.error(errorMessage);
    if (onFailure) yield call(onFailure, { message: errorMessage });
  }
}

function* createUserSaga(action) {
  const { onSuccess, onFailure, ...data } = action.payload;
  try {
    const response = yield call(httpRequest.post, endPoints.CreateUser, data);
    if (onSuccess) yield call(onSuccess, { message: response?.message, data: response?.data });
  } catch (err) {
    const errorMessage = err.message || "Failed to create user";
    toast.error(errorMessage);
    if (onFailure) yield call(onFailure, { message: errorMessage });
  }
}

function* updateUserStatusSaga(action) {
  const { id, status, onSuccess, onFailure } = action.payload;
  try {
    // Backend expects camelCase accountStatus
    const response = yield call(httpRequest.put, `${endPoints.UpdateUserStatus}/${id}`, { accountStatus: status });
    if (onSuccess) yield call(onSuccess, { message: response?.message, data: response?.data });
  } catch (err) {
    const errorMessage = err.message || "Failed to update status";
    toast.error(errorMessage);
    if (onFailure) yield call(onFailure, { message: errorMessage });
  }
}

function* deleteUserSaga(action) {
  const { id, onSuccess, onFailure } = action.payload;
  try {
    const response = yield call(httpRequest.delete, `${endPoints.DeleteUser}/${id}`);
    if (onSuccess) yield call(onSuccess, { message: response?.message, data: response?.data });
  } catch (err) {
    const errorMessage = err.message || "Failed to delete user";
    toast.error(errorMessage);
    if (onFailure) yield call(onFailure, { message: errorMessage });
  }
}

export function* userSagas() {
  yield takeLatest(getAllUsers.type, getAllUsersSaga);
  yield takeLatest(createUser.type, createUserSaga);
  yield takeLatest(updateUserStatus.type, updateUserStatusSaga);
  yield takeLatest(deleteUser.type, deleteUserSaga);
}
