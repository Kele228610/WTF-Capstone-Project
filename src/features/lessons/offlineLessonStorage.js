const DB_NAME = 'edulearn-offline';
const DB_VERSION = 1;
const SUBMODULE_STORE = 'downloaded-submodules';
const ASSESSMENT_STORE = 'downloaded-assessments';

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(SUBMODULE_STORE)) {
        const store = db.createObjectStore(SUBMODULE_STORE, { keyPath: 'submoduleId' });
        store.createIndex('cachedAt', 'cachedAt');
      }
      if (!db.objectStoreNames.contains(ASSESSMENT_STORE)) {
        const store = db.createObjectStore(ASSESSMENT_STORE, { keyPath: 'assessmentSubmoduleId' });
        store.createIndex('cachedAt', 'cachedAt');
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Unable to open offline storage.'));
  });
}

function runTransaction(storeName, mode, handler) {
  return openDatabase().then((db) => new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);

    let request;

    try {
      request = handler(store);
    } catch (error) {
      reject(error);
      return;
    }

    transaction.oncomplete = () => resolve(request?.result);
    transaction.onerror = () => reject(transaction.error || new Error('Offline storage transaction failed.'));
    transaction.onabort = () => reject(transaction.error || new Error('Offline storage transaction aborted.'));
  }));
}

export async function saveDownloadedSubmodule(record) {
  return runTransaction(SUBMODULE_STORE, 'readwrite', (store) => store.put(record));
}

export async function getDownloadedSubmodule(submoduleId) {
  return runTransaction(SUBMODULE_STORE, 'readonly', (store) => store.get(submoduleId));
}

export async function listDownloadedSubmodules() {
  return runTransaction(SUBMODULE_STORE, 'readonly', (store) => store.getAll());
}

export async function saveDownloadedAssessment(record) {
  return runTransaction(ASSESSMENT_STORE, 'readwrite', (store) => store.put(record));
}

export async function getDownloadedAssessment(assessmentSubmoduleId) {
  return runTransaction(ASSESSMENT_STORE, 'readonly', (store) => store.get(assessmentSubmoduleId));
}
