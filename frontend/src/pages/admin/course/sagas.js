import { call, put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  updateCourseStatus,
  setCourseList
} from "./slice";
import { endPoints, httpRequest } from "../../../request";

function* getAllCoursesSaga(action) {
  const { page = 1, limit = 10, onSuccess, onFailure } = action.payload || {};
  try {
    const response = yield call(httpRequest.get, `${endPoints.CourseList}?page=${page}&limit=${limit}&include_drafts=true`);
    yield put(setCourseList(response?.data || []));
    if (onSuccess) yield call(onSuccess, response?.data);
  } catch (err) {
    const errorMessage = err.message || "Failed to fetch courses";
    toast.error(errorMessage);
    if (onFailure) yield call(onFailure, { message: errorMessage });
  }
}

function* createCourseSaga(action) {
  const { onSuccess, onFailure, ...data } = action.payload;
  try {
    const response = yield call(httpRequest.post, endPoints.CreateCourse, data);
    if (onSuccess) yield call(onSuccess, { message: response?.message, data: response?.data });
  } catch (err) {
    const errorMessage = err.message || "Failed to create course";
    toast.error(errorMessage);
    if (onFailure) yield call(onFailure, { message: errorMessage });
  }
}

function* updateCourseSaga(action) {
  const { id, onSuccess, onFailure, ...data } = action.payload;
  try {
    const response = yield call(httpRequest.post, endPoints.UpdateCourse, { courseId: id, ...data });
    if (onSuccess) yield call(onSuccess, { message: response?.message, data: response?.data });
  } catch (err) {
    const errorMessage = err.message || "Failed to update course";
    toast.error(errorMessage);
    if (onFailure) yield call(onFailure, { message: errorMessage });
  }
}

function* updateCourseStatusSaga(action) {
  const { id, status, onSuccess, onFailure } = action.payload;
  try {
    const response = yield call(httpRequest.patch, endPoints.UpdateCourseStatus, { id, status });
    if (onSuccess) yield call(onSuccess, { message: response?.message, data: response?.data });
  } catch (err) {
    const errorMessage = err.message || "Failed to update status";
    toast.error(errorMessage);
    if (onFailure) yield call(onFailure, { message: errorMessage });
  }
}

function* deleteCourseSaga(action) {
  const { id, onSuccess, onFailure } = action.payload;
  try {
    const response = yield call(httpRequest.delete, `${endPoints.DeleteCourse}/${id}`);
    if (onSuccess) yield call(onSuccess, { message: response?.message, data: response?.data });
  } catch (err) {
    const errorMessage = err.message || "Failed to delete course";
    toast.error(errorMessage);
    if (onFailure) yield call(onFailure, { message: errorMessage });
  }
}

export function* courseSagas() {
  yield takeLatest(getAllCourses.type, getAllCoursesSaga);
  yield takeLatest(createCourse.type, createCourseSaga);
  yield takeLatest(updateCourse.type, updateCourseSaga);
  yield takeLatest(updateCourseStatus.type, updateCourseStatusSaga);
  yield takeLatest(deleteCourse.type, deleteCourseSaga);
}
