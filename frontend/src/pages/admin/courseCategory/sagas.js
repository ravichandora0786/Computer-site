import { call, put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import { httpRequest } from "@/request";
import { endPoints } from "../../../request";
import {
  getAllCategories,
  setCategoryList,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
  setLoading,
} from "./slice";

function* getAllCategoriesSaga(action) {
  const { page = 1, limit = 10, onSuccess, onFailure } = action.payload || {};
  try {
    const response = yield call(httpRequest.get, `${endPoints.CourseCategoryList}?page=${page}&limit=${limit}`);
    yield put(setCategoryList(response?.data || []));
    if (onSuccess) yield call(onSuccess, response);
  } catch (err) {
    const errorMsg = err.message || "Failed to fetch categories";
    toast.error(errorMsg);
    if (onFailure) yield call(onFailure, err);
  } finally {
    yield put(setLoading(false));
  }
}

function* createCategorySaga(action) {
  const { onSuccess, onFailure, ...data } = action.payload;
  try {
    const response = yield call(httpRequest.post, endPoints.CreateCourseCategory, data);
    toast.success(response?.message || "Category created successfully");
    if (onSuccess) yield call(onSuccess, response);
  } catch (err) {
    const errorMsg = err.message || "Failed to create category";
    toast.error(errorMsg);
    if (onFailure) yield call(onFailure, err);
  } finally {
    yield put(setLoading(false));
  }
}

function* updateCategorySaga(action) {
  const { id, onSuccess, onFailure, ...data } = action.payload;
  try {
    const response = yield call(httpRequest.post, endPoints.UpdateCourseCategory, { id, ...data });
    toast.success(response?.message || "Category updated successfully");
    if (onSuccess) yield call(onSuccess, response);
  } catch (err) {
    const errorMsg = err.message || "Failed to update category";
    toast.error(errorMsg);
    if (onFailure) yield call(onFailure, err);
  } finally {
    yield put(setLoading(false));
  }
}

function* deleteCategorySaga(action) {
  const { id, onSuccess, onFailure } = action.payload;
  try {
    const response = yield call(httpRequest.post, endPoints.DeleteCourseCategory, { id });
    toast.success(response?.message || "Category deleted successfully");
    if (onSuccess) yield call(onSuccess, response);
  } catch (err) {
    const errorMsg = err.message || "Failed to delete category";
    toast.error(errorMsg);
    if (onFailure) yield call(onFailure, err);
  } finally {
    yield put(setLoading(false));
  }
}

function* reorderCategoriesSaga(action) {
  const { categoryIds, onSuccess, onFailure } = action.payload;
  try {
    const response = yield call(httpRequest.patch, endPoints.ReorderCourseCategory, { categoryIds });
    toast.success(response?.message || "Categories reordered successfully");
    yield put(getAllCategories()); // Refresh list to get new sort_orders
    if (onSuccess) yield call(onSuccess, response);
  } catch (err) {
    const errorMsg = err.message || "Failed to reorder categories";
    toast.error(errorMsg);
    if (onFailure) yield call(onFailure, err);
  } finally {
    yield put(setLoading(false));
  }
}

export function* courseCategorySagas() {
  yield takeLatest(getAllCategories.type, getAllCategoriesSaga);
  yield takeLatest(createCategory.type, createCategorySaga);
  yield takeLatest(updateCategory.type, updateCategorySaga);
  yield takeLatest(deleteCategory.type, deleteCategorySaga);
  yield takeLatest(reorderCategories.type, reorderCategoriesSaga);
}
