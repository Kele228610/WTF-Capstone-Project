import { apiFetch } from './client';

export function assignCourses(courseNames) {
  return apiFetch('/api/v1/courses/assign', {
    method: 'POST',
    body: { courseNames },
  });
}
