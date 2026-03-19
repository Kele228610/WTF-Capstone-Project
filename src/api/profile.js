import { apiFetch } from './client';

export function getProfile() {
  return apiFetch('/api/v1/profile/me');
}

export function updateProfile(profileData) {
  return apiFetch('/api/v1/profile/me', {
    method: 'PATCH',
    body: profileData,
  });
}
