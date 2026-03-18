// src/api/auth.js
import { apiFetch, setTokens, clearTokens, extractAccessToken, refreshAccessToken } from "./client";

const AUTH = "/api/v1/auth";

// 1) Register
export function register(payload) {
  return apiFetch(`${AUTH}/register`, {
    method: "POST",
    body: payload,
    auth: false
  });
}

// 2) Verify email (token is sent as query param)
export async function verifyEmail(token) {
  const data = await apiFetch(`${AUTH}/verify-email?token=${encodeURIComponent(token)}`, {
    auth: false
  });
  const accessToken = extractAccessToken(data);
  if (accessToken) setTokens({ accessToken });
  return data;
}

// 3) Resend verification email
export function resendVerification(payload) {
  // payload might be { email } depending on backend
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
export async function refreshToken() {
  return refreshAccessToken();
}

// 6) Forgot password
export function forgotPassword(payload) {
  // payload usually { email }
  return apiFetch(`${AUTH}/forgot-password`, {
    method: "POST",
    body: payload,
    auth: false
  });
}

// 7) Reset password
export function resetPassword(payload) {
  // payload varies by backend:
  // could be { token, newPassword } or { token, password }
  return apiFetch(`${AUTH}/reset-password`, {
    method: "POST",
    body: payload,
    auth: false
  });
}

// 8) Password resend verification (if your flow uses it)
export function passwordResendVerification(payload) {
  return apiFetch(`${AUTH}/password-resend-verification`, {
    method: "POST",
    body: payload,
    auth: false
  });
}

// 9) Logout
export async function logout() {
  try {
    await apiFetch(`${AUTH}/logout`, { method: "POST" });
  } finally {
    clearTokens();
  }
}
