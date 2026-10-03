import api, { refreshAccessToken, setAccessToken } from "./api.js";

export async function registerUser({ fullName, email, password, confirmPassword }) {
  const { data } = await api.post("/api/auth/register", {
    full_name: fullName,
    email,
    password,
    confirm_password: confirmPassword,
  });
  return data;
}

export async function loginUser({ email, password }) {
  const { data } = await api.post("/api/auth/login", { email, password });
  setAccessToken(data.access_token);
  return data.user;
}

export async function logoutUser() {
  try {
    await api.post("/api/auth/logout");
  } finally {
    setAccessToken(null); // always clear local state, even if the network call failed
  }
}

export const refreshToken = refreshAccessToken;

export async function getCurrentUser() {
  const { data } = await api.get("/api/users/me");
  return data;
}

export async function getServerInfo() {
  const { data } = await api.get("/api/server-info");
  return data;
}
