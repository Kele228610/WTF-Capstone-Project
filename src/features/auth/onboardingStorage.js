const PENDING_ONBOARDING_KEY = 'edulearn_pending_onboarding';

export function savePendingOnboarding(data) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PENDING_ONBOARDING_KEY, JSON.stringify(data));
}

export function readPendingOnboarding() {
  if (typeof window === 'undefined') return null;

  const raw = window.localStorage.getItem(PENDING_ONBOARDING_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearPendingOnboarding() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(PENDING_ONBOARDING_KEY);
}
