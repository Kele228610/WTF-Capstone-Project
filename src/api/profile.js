import { apiFetch } from './client';

const PROFILE_IDENTITY_KEY = 'edulearn_profile_identity';

export function readStoredProfileIdentity() {
  if (typeof window === 'undefined') return null;

  try {
    return window.localStorage.getItem(PROFILE_IDENTITY_KEY);
  } catch {
    return null;
  }
}

export function storeProfileIdentity(userId) {
  if (typeof window === 'undefined') return;

  try {
    if (userId) {
      window.localStorage.setItem(PROFILE_IDENTITY_KEY, userId);
    }
  } catch {
    // Ignore storage write failures.
  }
}

export function getProfile() {
  return apiFetch('/api/v1/profile/me');
}

export async function getProfileIdentity() {
  const data = await getProfile();
  const payload = data?.data || data;
  const userId = payload?.id || payload?._id || payload?.userId || payload?.studentId || null;
  storeProfileIdentity(userId);
  return userId;
}

export function updateProfile(profileData) {
  return apiFetch('/api/v1/profile/me', {
    method: 'PATCH',
    body: profileData,
  });
}
