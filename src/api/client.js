// import { a } from "motion/react-client";

// src/api/client.js
const API_URL = import.meta.env.VITE_API_URL;

const AUTH_REFRESH_PATH = "/api/v1/auth/refresh-token";
const NO_REFRESH_RETRY_PATHS = ["/api/v1/auth/login", "/api/v1/auth/refresh-token"];
const SESSION_HINT_KEY = "edulearn_session_expected";
const PUBLIC_AUTH_PATHS = ["/login", "/register", "/verify-account", "/verify-email"];
let accessTokenMemory = null;


export function getAccessToken() {
  return accessTokenMemory;
}

function setSessionHint(enabled) {
  if (enabled) {
    localStorage.setItem(SESSION_HINT_KEY, "1");
  } else {
    localStorage.removeItem(SESSION_HINT_KEY);
  }
}

function hasSessionHint() {
  return localStorage.getItem(SESSION_HINT_KEY) === "1";
}

export function setTokens({ accessToken }) {
  accessTokenMemory = accessToken || null;
  if (accessToken) setSessionHint(true);
}

export function clearTokens() {
  accessTokenMemory = null;
  setSessionHint(false);
}

export function extractAccessToken(data) {
  return data?.accessToken || data?.token || data?.data?.accessToken || data?.data?.token || null;
}

let refreshPromise = null;

async function parseResponse(res) {
  const text = await res.text();
  let data;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  return data;
}

function createRequestHeaders({ auth, headers }) {
  const accessToken = getAccessToken();

  return {
    "Content-Type": "application/json",
    ...(auth && accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(headers || {}),
  };
}

function shouldRetryWithRefresh({ status, auth, path, retried }) {
  if (status !== 401 || !auth || retried) return false;
  return !NO_REFRESH_RETRY_PATHS.includes(path);
}

function redirectToLoginIfNeeded() {
  if (typeof window === "undefined") return;

  const currentPath = window.location.pathname;
  if (PUBLIC_AUTH_PATHS.includes(currentPath)) return;

  window.location.assign("/login");
}

export async function refreshAccessToken() {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const res = await fetch(`${API_URL}${AUTH_REFRESH_PATH}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await parseResponse(res);

    if (!res.ok) {
      clearTokens();
      redirectToLoginIfNeeded();
      const message = data?.message || data?.error || "Session expired";
      const err = new Error(message);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    const accessToken = extractAccessToken(data);
    if (!accessToken) {
      clearTokens();
      redirectToLoginIfNeeded();
      throw new Error("No access token returned from refresh endpoint");
    }

    setTokens({ accessToken });
    return data;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

export async function bootstrapAuthSession() {
  if (!hasSessionHint()) return false;

  try {
    await refreshAccessToken();
    return true;
  } catch {
    clearTokens();
    return false;
  }
}

export async function apiFetch(
  path,
  { method = "GET", body, headers, auth = true, retried = false } = {}
) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    credentials: "include",
    headers: createRequestHeaders({ auth, headers }),
    body: body ? JSON.stringify(body) : undefined,
  });

  if (shouldRetryWithRefresh({ status: res.status, auth, path, retried })) {
    await refreshAccessToken();
    return apiFetch(path, { method, body, headers, auth, retried: true });
  }

  const data = await parseResponse(res);

  if (!res.ok) {
    const message = data?.message || data?.error || "Request failed";
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}
