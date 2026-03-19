import { apiFetch } from './client';

export function startLessonSession() {
  return apiFetch('/api/v1/session/start');
}

export function getLessonById(lessonId) {
  return apiFetch(`/api/v1/lesson/${lessonId}`);
}

export function getModulesByLessonId(lessonId) {
  return apiFetch(`/api/v1/module/all/${lessonId}`);
}
