import { call, put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import { endPoints, httpRequest } from "../../../request";
import {
  setModules,
  setCurrentTest,
  setBatches,
  getModulesByCourse,
  createModuleAction,
  updateModuleAction,
  deleteModuleAction,
  createLessonAction,
  updateLessonAction,
  deleteLessonAction,
  createPageAction,
  updatePageAction,
  deletePageAction,
  getTestByModule,
  createTestAction,
  updateTestAction,
  deleteTestAction,
  createQuestionAction,
  updateQuestionAction,
  deleteQuestionAction,
  getBatchesByCourse,
  createBatchAction,
  updateBatchAction,
  deleteBatchAction
} from "./courseContentSlice";

// Modules
function* getModulesSaga(action) {
  const { id, onSuccess } = action.payload;
  try {
    const response = yield call(httpRequest.get, `${endPoints.ModuleList}/course/${id}`);
    yield put(setModules(response?.data || []));
    if (onSuccess) yield call(onSuccess, response?.data);
  } catch (err) {
    toast.error(err.message || "Failed to fetch modules");
  }
}

function* createModuleSaga(action) {
  const { onSuccess, ...data } = action.payload;
  try {
    const response = yield call(httpRequest.post, endPoints.CreateModule, data);
    toast.success(response?.message || "Module created");
    if (onSuccess) yield call(onSuccess, response?.data);
  } catch (err) {
    toast.error(err.message || "Failed to create module");
  }
}

function* updateModuleSaga(action) {
  const { id, onSuccess, ...data } = action.payload;
  try {
    const response = yield call(httpRequest.post, `${endPoints.UpdateModule}/${id}`, data);
    toast.success(response?.message || "Module updated");
    if (onSuccess) yield call(onSuccess, response?.data);
  } catch (err) {
    toast.error(err.message || "Failed to update module");
  }
}

function* deleteModuleSaga(action) {
  const { id, onSuccess } = action.payload;
  try {
    const response = yield call(httpRequest.delete, `${endPoints.DeleteModule}/${id}`);
    toast.success(response?.message || "Module deleted");
    if (onSuccess) yield call(onSuccess);
  } catch (err) {
    toast.error(err.message || "Failed to delete module");
  }
}

// Lessons
function* createLessonSaga(action) {
  const { onSuccess, ...data } = action.payload;
  try {
    const response = yield call(httpRequest.post, endPoints.CreateLesson, data);
    toast.success(response?.message || "Lesson created");
    if (onSuccess) yield call(onSuccess, response?.data);
  } catch (err) {
    toast.error(err.message || "Failed to create lesson");
  }
}

function* updateLessonSaga(action) {
  const { id, onSuccess, ...data } = action.payload;
  try {
    const response = yield call(httpRequest.post, `${endPoints.UpdateLesson}/${id}`, data);
    toast.success(response?.message || "Lesson updated");
    if (onSuccess) yield call(onSuccess, response?.data);
  } catch (err) {
    toast.error(err.message || "Failed to update lesson");
  }
}

function* deleteLessonSaga(action) {
  const { id, onSuccess } = action.payload;
  try {
    const response = yield call(httpRequest.delete, `${endPoints.DeleteLesson}/${id}`);
    toast.success(response?.message || "Lesson deleted");
    if (onSuccess) yield call(onSuccess);
  } catch (err) {
    toast.error(err.message || "Failed to delete lesson");
  }
}

// Lesson Pages
function* createPageSaga(action) {
  const { onSuccess, ...data } = action.payload;
  try {
    const response = yield call(httpRequest.post, `${endPoints.lesson_pages}/create`, data);
    toast.success(response?.message || "Page created");
    if (onSuccess) yield call(onSuccess, response?.data);
  } catch (err) {
    toast.error(err.message || "Failed to create page");
  }
}

function* updatePageSaga(action) {
  const { id, onSuccess, ...data } = action.payload;
  try {
    const response = yield call(httpRequest.post, `${endPoints.lesson_pages}/update/${id}`, data);
    toast.success(response?.message || "Page updated");
    if (onSuccess) yield call(onSuccess, response?.data);
  } catch (err) {
    toast.error(err.message || "Failed to update page");
  }
}

function* deletePageSaga(action) {
  const { id, onSuccess } = action.payload;
  try {
    const response = yield call(httpRequest.delete, `${endPoints.lesson_pages}/delete/${id}`);
    toast.success(response?.message || "Page deleted");
    if (onSuccess) yield call(onSuccess);
  } catch (err) {
    toast.error(err.message || "Failed to delete page");
  }
}

// Tests
function* getTestSaga(action) {
  const { moduleId, onSuccess } = action.payload;
  try {
    const response = yield call(httpRequest.get, `${endPoints.ModuleTest}/module/${moduleId}`);
    yield put(setCurrentTest(response?.data));
    if (onSuccess) yield call(onSuccess, response?.data);
  } catch (err) {
    // If not found, it's fine for the UI
    yield put(setCurrentTest(null));
  }
}

function* createTestSaga(action) {
  const { onSuccess, ...data } = action.payload;
  try {
    const response = yield call(httpRequest.post, endPoints.CreateModuleTest, data);
    toast.success(response?.message || "Test created");
    if (onSuccess) yield call(onSuccess, response?.data);
  } catch (err) {
    toast.error(err.message || "Failed to create test");
  }
}

function* updateTestSaga(action) {
  const { id, onSuccess, ...data } = action.payload;
  try {
    const response = yield call(httpRequest.post, `${endPoints.UpdateModuleTest}/${id}`, data);
    toast.success(response?.message || "Test updated");
    if (onSuccess) yield call(onSuccess, response?.data);
  } catch (err) {
    toast.error(err.message || "Failed to update test");
  }
}

// Questions
function* createQuestionSaga(action) {
  const { onSuccess, ...data } = action.payload;
  try {
    const response = yield call(httpRequest.post, endPoints.TestQuestions + '/create', data);
    toast.success(response?.message || "Question created");
    if (onSuccess) yield call(onSuccess, response?.data);
  } catch (err) {
    toast.error(err.message || "Failed to create question");
  }
}

function* updateQuestionSaga(action) {
  const { id, onSuccess, ...data } = action.payload;
  try {
    const response = yield call(httpRequest.post, `${endPoints.TestQuestions}/update/${id}`, data);
    toast.success(response?.message || "Question updated");
    if (onSuccess) yield call(onSuccess, response?.data);
  } catch (err) {
    toast.error(err.message || "Failed to update question");
  }
}

function* deleteQuestionSaga(action) {
  const { id, onSuccess } = action.payload;
  try {
    const response = yield call(httpRequest.delete, `${endPoints.TestQuestions}/delete/${id}`);
    toast.success(response?.message || "Question deleted");
    if (onSuccess) yield call(onSuccess);
  } catch (err) {
    toast.error(err.message || "Failed to delete question");
  }
}

// Batches
function* getBatchesSaga(action) {
  const { id, onSuccess } = action.payload;
  try {
    const response = yield call(httpRequest.get, `/batches/course/${id}`);
    yield put(setBatches(response?.data || []));
    if (onSuccess) yield call(onSuccess, response?.data);
  } catch (err) {
    toast.error(err.message || "Failed to fetch batches");
  }
}

function* createBatchSaga(action) {
  const { onSuccess, ...data } = action.payload;
  try {
    const response = yield call(httpRequest.post, "/batches/create", data);
    toast.success(response?.message || "Batch created");
    if (onSuccess) yield call(onSuccess, response?.data);
  } catch (err) {
    toast.error(err.message || "Failed to create batch");
  }
}

function* updateBatchSaga(action) {
  const { id, onSuccess, ...data } = action.payload;
  try {
    const response = yield call(httpRequest.post, `/batches/update/${id}`, data);
    toast.success(response?.message || "Batch updated");
    if (onSuccess) yield call(onSuccess, response?.data);
  } catch (err) {
    toast.error(err.message || "Failed to update batch");
  }
}

function* deleteBatchSaga(action) {
  const { id, onSuccess } = action.payload;
  try {
    const response = yield call(httpRequest.delete, `/batches/delete/${id}`);
    toast.success(response?.message || "Batch deleted");
    if (onSuccess) yield call(onSuccess);
  } catch (err) {
    toast.error(err.message || "Failed to delete batch");
  }
}

export function* courseContentSagas() {
  yield takeLatest(getModulesByCourse.type, getModulesSaga);
  yield takeLatest(createModuleAction.type, createModuleSaga);
  yield takeLatest(updateModuleAction.type, updateModuleSaga);
  yield takeLatest(deleteModuleAction.type, deleteModuleSaga);

  yield takeLatest(createLessonAction.type, createLessonSaga);
  yield takeLatest(updateLessonAction.type, updateLessonSaga);
  yield takeLatest(deleteLessonAction.type, deleteLessonSaga);

  yield takeLatest(createPageAction.type, createPageSaga);
  yield takeLatest(updatePageAction.type, updatePageSaga);
  yield takeLatest(deletePageAction.type, deletePageSaga);

  yield takeLatest(getTestByModule.type, getTestSaga);
  yield takeLatest(createTestAction.type, createTestSaga);
  yield takeLatest(updateTestAction.type, updateTestSaga);

  yield takeLatest(createQuestionAction.type, createQuestionSaga);
  yield takeLatest(updateQuestionAction.type, updateQuestionSaga);
  yield takeLatest(deleteQuestionAction.type, deleteQuestionSaga);

  yield takeLatest(getBatchesByCourse.type, getBatchesSaga);
  yield takeLatest(createBatchAction.type, createBatchSaga);
  yield takeLatest(updateBatchAction.type, updateBatchSaga);
  yield takeLatest(deleteBatchAction.type, deleteBatchSaga);
}
