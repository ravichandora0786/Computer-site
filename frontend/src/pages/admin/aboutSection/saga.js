import { call, put, takeLatest } from "redux-saga/effects";
import { httpRequest } from "@/request";
import endPoints from "@/request/endpoints";
import { toast } from "react-toastify";
import {
  fetchAboutSections, fetchAboutSectionsSuccess, fetchAboutSectionsFailure,
  createAboutSection, createAboutSectionSuccess, createAboutSectionFailure,
  updateAboutSection, updateAboutSectionSuccess, updateAboutSectionFailure,
  deleteAboutSection, deleteAboutSectionSuccess, deleteAboutSectionFailure,
} from "./slice";

function* handleFetchAboutSections() {
  try {
    const response = yield call(httpRequest.get, `${endPoints.AboutSectionsList}?all=true`);
    yield put(fetchAboutSectionsSuccess(response.data.items || response.data));
  } catch (error) {
    yield put(fetchAboutSectionsFailure(error.message));
  }
}

function* handleCreateAboutSection(action) {
  const { onSuccess, onFailure, ...data } = action.payload;
  try {
    yield call(httpRequest.post, endPoints.CreateAboutSection, data);
    yield put(createAboutSectionSuccess());
    toast.success("Section created successfully");
    if (onSuccess) yield call(onSuccess);
    yield put(fetchAboutSections());
  } catch (error) {
    yield put(createAboutSectionFailure(error.message));
    toast.error(error.message);
    if (onFailure) yield call(onFailure);
  }
}

function* handleUpdateAboutSection(action) {
  const { id, onSuccess, onFailure, ...data } = action.payload;
  try {
    yield call(httpRequest.post, endPoints.UpdateAboutSection, { id, ...data });
    yield put(updateAboutSectionSuccess());
    toast.success("Section updated successfully");
    if (onSuccess) yield call(onSuccess);
    yield put(fetchAboutSections());
  } catch (error) {
    yield put(updateAboutSectionFailure(error.message));
    toast.error(error.message);
    if (onFailure) yield call(onFailure);
  }
}

function* handleDeleteAboutSection(action) {
  try {
    yield call(httpRequest.post, endPoints.DeleteAboutSection, { id: action.payload });
    yield put(deleteAboutSectionSuccess());
    toast.success("Section deleted successfully");
    yield put(fetchAboutSections());
  } catch (error) {
    yield put(deleteAboutSectionFailure(error.message));
    toast.error(error.message);
  }
}

export function* aboutSectionSagas() {
  yield takeLatest(fetchAboutSections.type, handleFetchAboutSections);
  yield takeLatest(createAboutSection.type, handleCreateAboutSection);
  yield takeLatest(updateAboutSection.type, handleUpdateAboutSection);
  yield takeLatest(deleteAboutSection.type, handleDeleteAboutSection);
}
