import { call, put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import {
  getGalleryItems,
  createGalleryItem,
  deleteGalleryItem,
  setLoading,
  setGalleryList,
} from "./slice";
import { endPoints, httpRequest } from "../../../request";

function* getGalleryItemsSaga(action) {
  const { page = 1, limit = 10, filterType, filterCategory, onSuccess, onFailure } = action.payload || {};
  yield put(setLoading(true));
  try {
    let url = `${endPoints.Gallery}?page=${page}&limit=${limit}`;
    if (filterType && filterType !== "all") url += `&type=${filterType}`;
    if (filterCategory && filterCategory !== "all") url += `&category=${filterCategory}`;

    const response = yield call(httpRequest.get, url);
    yield put(setGalleryList(response?.data || []));
    if (onSuccess) yield call(onSuccess, response?.data);
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Failed to fetch gallery assets";
    toast.error(errorMessage);
    if (onFailure) yield call(onFailure, { message: errorMessage });
  } finally {
    yield put(setLoading(false));
  }
}

function* createGalleryItemSaga(action) {
  const { onSuccess, onFailure, ...data } = action.payload;
  try {
    const response = yield call(httpRequest.post, endPoints.GalleryCreate, data);
    if (onSuccess) yield call(onSuccess, { message: response?.message, data: response?.data });
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Failed to commit asset";
    toast.error(errorMessage);
    if (onFailure) yield call(onFailure, { message: errorMessage });
  }
}

function* deleteGalleryItemSaga(action) {
  const { id, onSuccess, onFailure } = action.payload;
  try {
    const response = yield call(httpRequest.delete, `${endPoints.GalleryDelete}/${id}`);
    if (onSuccess) yield call(onSuccess, { message: response?.message, data: response?.data });
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Failed to purge asset";
    toast.error(errorMessage);
    if (onFailure) yield call(onFailure, { message: errorMessage });
  }
}

export function* gallerySagas() {
  yield takeLatest(getGalleryItems.type, getGalleryItemsSaga);
  yield takeLatest(createGalleryItem.type, createGalleryItemSaga);
  yield takeLatest(deleteGalleryItem.type, deleteGalleryItemSaga);
}
