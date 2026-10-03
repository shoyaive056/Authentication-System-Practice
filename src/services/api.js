import axios from "axios";

// Access token lives in memory only (never localStorage) so XSS can't read it.
// The long-lived refresh token is an httpOnly cookie the browser sends automatically.
let accessToken = null;
let onAuthFailure = () => {};

export const setAccessToken = (token) => {
  accessToken = token;
};
export const registerAuthFailureHandler = (fn) => {
  onAuthFailure = fn;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  withCredentials: true,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// One in-flight refresh shared by every caller (refresh tokens rotate, so parallel refreshes would fail).
let refreshPromise = null;
export function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${api.defaults.baseURL}/api/auth/refresh`, null, { withCredentials: true, timeout: 15000 })
      .then((res) => {
        setAccessToken(res.data.access_token);
        return res.data.access_token;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

const NO_RETRY = ["/api/auth/login", "/api/auth/register", "/api/auth/refresh", "/api/auth/logout"];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    if (status === 401 && original && !original._retried && !NO_RETRY.includes(original.url)) {
      original._retried = true;
      try {
        const token = await refreshAccessToken(); // expired access token -> silently renew
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch {
        setAccessToken(null);
        onAuthFailure(); // refresh token invalid/expired -> send user to login
      }
    }
    return Promise.reject(error);
  }
);

// Turns any axios error into a short, user-friendly message (never a stack trace).
export function getErrorMessage(error) {
  if (!error.response) {
    return error.code === "ECONNABORTED"
      ? "The request timed out. Please try again."
      : "Cannot reach the server. Check your connection and try again.";
  }
  const { status, data } = error.response;
  if (status === 422 && Array.isArray(data?.errors) && data.errors.length) return data.errors[0].message;
  if (status === 429) return "Too many attempts. Please wait a moment and try again.";
  if (status >= 500) return "Something went wrong on our side. Please try again shortly.";
  return typeof data?.detail === "string" ? data.detail : "Something went wrong. Please try again.";
}

export function getFieldErrors(error) {
  const out = {};
  const list = error.response?.data?.errors;
  if (error.response?.status === 422 && Array.isArray(list)) {
    list.forEach((e) => {
      out[e.field] = out[e.field] || e.message;
    });
  }
  return out;
}

export default api;
