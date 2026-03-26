import { apiFetch } from './client';

export function getProfile() {
  return apiFetch('/api/v1/profile/me');
}

export async function getProfileIdentity() {
  const data = await getProfile();
  const payload = data?.data || data;
  return payload?.id || payload?._id || payload?.userId || payload?.studentId || null;
}

export function updateProfile(profileData) {
  return apiFetch('/api/v1/profile/me', {
    method: 'PATCH',
    body: profileData,
  });
}
