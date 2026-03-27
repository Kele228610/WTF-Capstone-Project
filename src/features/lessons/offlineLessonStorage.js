const DB_NAME = 'edulearn-offline';
const DB_VERSION = 2;
const SUBMODULE_STORE = 'downloaded-submodules';
const ASSESSMENT_STORE = 'downloaded-assessments';

function buildOfflineKey(userId, itemId) {
  return `${userId || 'anonymous'}:${itemId}`;
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (db.objectStoreNames.contains(SUBMODULE_STORE)) {
        db.deleteObjectStore(SUBMODULE_STORE);
      }
      if (!db.objectStoreNames.contains(SUBMODULE_STORE)) {
        const store = db.createObjectStore(SUBMODULE_STORE, { keyPath: 'offlineKey' });
        store.createIndex('cachedAt', 'cachedAt');
        store.createIndex('userId', 'userId');
      }
      if (db.objectStoreNames.contains(ASSESSMENT_STORE)) {
        db.deleteObjectStore(ASSESSMENT_STORE);
      }
      if (!db.objectStoreNames.contains(ASSESSMENT_STORE)) {
        const store = db.createObjectStore(ASSESSMENT_STORE, { keyPath: 'offlineKey' });
        store.createIndex('cachedAt', 'cachedAt');
        store.createIndex('userId', 'userId');
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

export async function saveDownloadedSubmodule(userId, record) {
  return runTransaction(SUBMODULE_STORE, 'readwrite', (store) =>
    store.put({
      ...record,
      userId: userId || 'anonymous',
      offlineKey: buildOfflineKey(userId, record.submoduleId),
    })
  );
}

export async function getDownloadedSubmodule(userId, submoduleId) {
  return runTransaction(SUBMODULE_STORE, 'readonly', (store) =>
    store.get(buildOfflineKey(userId, submoduleId))
  );
}

export async function listDownloadedSubmodules(userId) {
  return runTransaction(SUBMODULE_STORE, 'readonly', (store) => store.index('userId').getAll(userId || 'anonymous'));
}

export async function listAllDownloadedSubmodules() {
  return runTransaction(SUBMODULE_STORE, 'readonly', (store) => store.getAll());
}

export async function saveDownloadedAssessment(userId, record) {
  return runTransaction(ASSESSMENT_STORE, 'readwrite', (store) =>
    store.put({
      ...record,
      userId: userId || 'anonymous',
      offlineKey: buildOfflineKey(userId, record.assessmentSubmoduleId),
    })
  );
}

export async function getDownloadedAssessment(userId, assessmentSubmoduleId) {
  return runTransaction(ASSESSMENT_STORE, 'readonly', (store) =>
    store.get(buildOfflineKey(userId, assessmentSubmoduleId))
  );
}
