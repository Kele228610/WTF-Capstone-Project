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
