const STORAGE_KEY = 'edulearn_lesson_ui_state';

function readStore() {
  if (typeof window === 'undefined') return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeStore(store) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function buildKey(userId, submoduleId) {
  return `${userId || 'anonymous'}:${submoduleId}`;
}

export function readLessonUiState(userId, submoduleId) {
  if (!submoduleId) return null;
  const store = readStore();
  return store[buildKey(userId, submoduleId)] || null;
}

export function saveLessonUiState(userId, submoduleId, state) {
  if (!submoduleId) return;
  const store = readStore();
  store[buildKey(userId, submoduleId)] = {
    ...state,
    updatedAt: Date.now(),
  };
  writeStore(store);
}
