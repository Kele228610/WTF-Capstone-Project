// src/api/auth.js
import { apiFetch, getAccessToken, setTokens, clearTokens, extractAccessToken } from "./client";

const AUTH = "/api/v1/auth";

// 1) Register
export function register(payload) {
  return apiFetch(`${AUTH}/register`, {
    method: "POST",
    body: payload,
    auth: false
  });
}

// 2) Verify email
export async function verifyEmail(token) {
  const data = await apiFetch(`${AUTH}/verify-email`, {
    method: "POST",
    body: { token },
    auth: false
  });
  const accessToken = extractAccessToken(data);
  if (accessToken) setTokens({ accessToken });
  return data;
}

// 3) Resend verification email
export async function resendVerification(payload) {
  return apiFetch(`${AUTH}/resend-verification`, {
    method: "POST",
    body: payload,
    auth: false
  });
}

// 4) Login
export async function login(payload) {
  const data = await apiFetch(`${AUTH}/login`, {
    method: "POST",
    body: payload,
    auth: false
  });

  const accessToken = extractAccessToken(data);
  if (!accessToken) throw new Error("No access token returned from login");
  setTokens({ accessToken });
  return data;
}

// 5) Refresh token
export async function refreshToken(token = getAccessToken()) {
  return apiFetch(`${AUTH}/refresh-token`, {
    method: "POST",
    auth: false,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined
  });
}

// 6) Forgot password
export async function forgotPassword(payload) {
  return apiFetch(`${AUTH}/forgot-password`, {
    method: "POST",
    body: payload,
    auth: false
  });
}

// 7) Reset password
export async function resetPassword(payload) {
  return apiFetch(`${AUTH}/reset-password`, {
    method: "POST",
    body: payload,
    auth: false
  });
}

// 8) Password resend verification (if your flow uses it)
export async function resendPasswordVerification(payload) {
  await apiFetch(`${AUTH}/password-resend-verification`, {
    method: "POST",
    body: payload,
    auth: false
  });
  return true;
}

// 9) Logout
export async function logoutUser(token = getAccessToken()) {
  try {
    await apiFetch(`${AUTH}/logout`, {
      method: "POST",
      auth: false,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
  } finally {
    localStorage.removeItem("token");
    clearTokens();
  }
}

export const passwordResendVerification = resendPasswordVerification;
export const logout = logoutUser;
