import { apiFetch } from '../../api/client';

const PROGRESS_QUEUE_KEY = 'edulearn_offline_progress_queue';

const listeners = new Set();

const state = {
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  isSyncing: false,
  queueLength: 0,
};

function notify() {
  state.queueLength = readQueuedProgress().length;
  listeners.forEach((listener) => listener({ ...state }));
}

function readQueue() {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(PROGRESS_QUEUE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeQueue(progress) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PROGRESS_QUEUE_KEY, JSON.stringify(progress));
  notify();
}

export function readQueuedProgress() {
  return readQueue();
}

export function queueOfflineProgress(item) {
  const queue = readQueue();
  const nextQueue = queue.filter((entry) => entry.submoduleId !== item.submoduleId);
  nextQueue.push({
    submoduleId: item.submoduleId,
    completed: Boolean(item.completed),
  });
  writeQueue(nextQueue);
}

export function subscribeOfflineSync(listener) {
  listeners.add(listener);
  listener({ ...state, queueLength: readQueuedProgress().length });

  return () => {
    listeners.delete(listener);
  };
}

export async function syncQueuedProgress() {
  const progress = readQueue();
  if (progress.length === 0 || typeof navigator !== 'undefined' && !navigator.onLine) {
    return false;
  }

  state.isSyncing = true;
  notify();

  try {
    await apiFetch('/api/v1/session/progress/sync', {
      method: 'POST',
      body: { progress },
    });
    writeQueue([]);
    return true;
  } finally {
    state.isSyncing = false;
    notify();
  }
}

export function startOfflineSyncManager() {
  if (typeof window === 'undefined') return () => {};

  const handleOnline = async () => {
    state.isOnline = true;
    notify();
    try {
      await syncQueuedProgress();
    } catch {
      notify();
    }
  };

  const handleOffline = () => {
    state.isOnline = false;
    notify();
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  notify();
  if (navigator.onLine) {
    void syncQueuedProgress().catch(() => {});
  }

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

