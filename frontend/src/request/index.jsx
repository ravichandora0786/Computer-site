import axios from "axios";
import endPoints from "./endpoints";
import { store } from "../redux/store";
import {
  logoutApp,
  setAccessToken,
  setFullScreenLoader,
} from "../pages/admin/common/slice";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const apiTimeout = 30000;

const httpRequest = axios.create({
  baseURL,
  timeout: apiTimeout,
  headers: {
    "Content-Type": "application/json",
  },
});

let requestCount = 0;

const showLoader = () => {
  requestCount++;
  if (requestCount === 1) {
    store.dispatch(setFullScreenLoader(true));
  }
};

const hideLoader = () => {
  requestCount--;
  if (requestCount <= 0) {
    requestCount = 0;
    store.dispatch(setFullScreenLoader(false));
  }
};

httpRequest.interceptors.request.use((config) => {
  if (!config.silent) {
    showLoader();
  }
  const state = store.getState();
  const isAdminPath = typeof window !== "undefined" && window.location.pathname.startsWith("/admin");
  
  // Prioritize tokens based on context (Admin vs User)
  const token = isAdminPath 
    ? (state.common.accessToken || state.userAuth.token)
    : (state.userAuth.token || state.common.accessToken);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  hideLoader();
  return Promise.reject(error);
});

httpRequest.interceptors.response.use(
  (res) => {
    if (!res.config?.silent) {
      hideLoader();
    }
    if (res?.data?.error) {
      return Promise.reject(new Error(res?.data?.error));
    }
    return res.data;
  },
  async (err) => {
    if (!err.config?.silent) {
      hideLoader();
    }
    const originalRequest = err.config;
    const isAuthRequest = originalRequest.url.includes("/auth/");

    // If it's a 401 and NOT an auth request (like login), try to refresh token
    if (err?.response?.status === 401 && !isAuthRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt refresh token
        const res = await axios.post(`${baseURL}${endPoints.RefreshToken}`, {
          refreshToken: store.getState().common.refreshToken,
        });

        const accessToken = res?.data?.accessToken;

        if (!accessToken) throw new Error("No access token returned");

        store.dispatch(setAccessToken(accessToken));

        // attach new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return httpRequest(originalRequest);
      } catch (refreshError) {
        console.error("Refresh Token FAILED:", refreshError);

        // FORCE LOGOUT
        store.dispatch(logoutApp());

        // redirect to admin login ONLY if the user is already in the /admin context
        if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
          // window.location.href = "/admin/login";
        }

        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(new Error(getErrorMessage(err)));
  }
);

// Utility to extract safe error message
const getErrorMessage = (error) => {
  const fallback = "Something went wrong. Try again!";

  if (!error) return fallback;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message === "Network Error")
    return "Network error. Please check your connection.";
  if (typeof error?.message === "string") return error.message;

  return fallback;
};

export { httpRequest, endPoints };
