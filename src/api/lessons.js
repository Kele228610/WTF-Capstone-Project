import { apiFetch, getAccessToken } from './client';

export function startLessonSession() {
  return apiFetch('/api/v1/session/start');
}

export function getLessonById(lessonId) {
  return apiFetch(`/api/v1/lesson/${lessonId}`);
}

export function getModulesByLessonId(lessonId) {
  return apiFetch(`/api/v1/module/all/${lessonId}`);
}

export function getModuleById(moduleId) {
  return apiFetch(`/api/v1/module/${moduleId}`);
}

export function getModuleProgress(moduleId) {
  return apiFetch(`/api/v1/progress/module/${moduleId}`);
}

export function getSubmodulesByModuleId(moduleId) {
  return apiFetch(`/api/v1/submodule/all/${moduleId}`);
}

export function getSubmoduleById(submoduleId) {
  return apiFetch(`/api/v1/submodule/${submoduleId}`);
}

export function getSubmoduleQuiz(submoduleId) {
  return apiFetch(`/api/v1/submodule/quiz/${submoduleId}/quiz`);
}

export function getModuleAssessment(submoduleId) {
  return apiFetch(`/api/v1/submodule/quiz/module-all/${submoduleId}`);
}

export function markSubmoduleComplete(submoduleId) {
  return apiFetch('/api/v1/progress/mark-complete', {
    method: 'POST',
    body: { submoduleId },
  });
}

export async function downloadSubmoduleProgress(submoduleId) {
  const token = getAccessToken();
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/progress/download/${submoduleId}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const text = await response.text();
  let data;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const message = data?.message || data?.error || 'Unable to download this lesson right now.';
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
