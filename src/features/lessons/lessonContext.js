const LESSON_CONTEXT_KEY = 'edulearn_lesson_context';

export function saveLessonContext(context) {
  if (typeof window === 'undefined') return;

  const current = readLessonContext();
  const next = {
    ...(current || {}),
    ...(context || {}),
  };

  window.sessionStorage.setItem(LESSON_CONTEXT_KEY, JSON.stringify(next));
}

export function readLessonContext() {
  if (typeof window === 'undefined') return null;

  const raw = window.sessionStorage.getItem(LESSON_CONTEXT_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearLessonContext() {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(LESSON_CONTEXT_KEY);
}
