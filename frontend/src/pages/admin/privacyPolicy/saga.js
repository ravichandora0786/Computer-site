import { call, put, takeLatest } from "redux-saga/effects";
import { httpRequest } from "@/request";
import endPoints from "@/request/endpoints";
import { toast } from "react-toastify";
import {
  fetchPolicies, fetchPoliciesSuccess, fetchPoliciesFailure,
  createPolicy, createPolicySuccess, createPolicyFailure,
  updatePolicy, updatePolicySuccess, updatePolicyFailure,
  deletePolicy, deletePolicySuccess, deletePolicyFailure
} from "./slice";

function* handleFetchPolicies() {
  try {
    const response = yield call(httpRequest.get, `${endPoints.PrivacyPoliciesList}?all=true`);
    yield put(fetchPoliciesSuccess(response.data.items || response.data));
  } catch (error) {
    yield put(fetchPoliciesFailure(error.message));
  }
}

function* handleCreatePolicy(action) {
  const { onSuccess, onFailure, ...data } = action.payload;
  try {
    yield call(httpRequest.post, endPoints.CreatePolicy, data);
    yield put(createPolicySuccess());
    toast.success("Policy created successfully");
    if (onSuccess) yield call(onSuccess);
    yield put(fetchPolicies());
  } catch (error) {
    yield put(createPolicyFailure(error.message));
    toast.error(error.message);
    if (onFailure) yield call(onFailure);
  }
}

function* handleUpdatePolicy(action) {
  const { id, onSuccess, onFailure, ...data } = action.payload;
  try {
    yield call(httpRequest.post, endPoints.UpdatePolicy, { id, ...data });
    yield put(updatePolicySuccess());
    toast.success("Policy updated successfully");
    if (onSuccess) yield call(onSuccess);
    yield put(fetchPolicies());
  } catch (error) {
    yield put(updatePolicyFailure(error.message));
    toast.error(error.message);
    if (onFailure) yield call(onFailure);
  }
}

function* handleDeletePolicy(action) {
  const { id, onSuccess, onFailure } = action.payload;
  try {
    yield call(httpRequest.post, endPoints.DeletePolicy, { id });
    yield put(deletePolicySuccess());
    toast.success("Policy deleted successfully");
    if (onSuccess) yield call(onSuccess);
    yield put(fetchPolicies());
  } catch (error) {
    yield put(deletePolicyFailure(error.message));
    toast.error(error.message);
    if (onFailure) yield call(onFailure);
  }
}

export function* privacyPolicySagas() {
  yield takeLatest(fetchPolicies.type, handleFetchPolicies);
  yield takeLatest(createPolicy.type, handleCreatePolicy);
  yield takeLatest(updatePolicy.type, handleUpdatePolicy);
  yield takeLatest(deletePolicy.type, handleDeletePolicy);
}
