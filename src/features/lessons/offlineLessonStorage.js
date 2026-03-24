const DB_NAME = 'edulearn-offline';
const DB_VERSION = 1;
const SUBMODULE_STORE = 'downloaded-submodules';

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(SUBMODULE_STORE)) {
        const store = db.createObjectStore(SUBMODULE_STORE, { keyPath: 'submoduleId' });
        store.createIndex('cachedAt', 'cachedAt');
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Unable to open offline storage.'));
  });
}

function runTransaction(mode, handler) {
  return openDatabase().then((db) => new Promise((resolve, reject) => {
    const transaction = db.transaction(SUBMODULE_STORE, mode);
    const store = transaction.objectStore(SUBMODULE_STORE);

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
  return runTransaction('readwrite', (store) => store.put(record));
}

export async function getDownloadedSubmodule(submoduleId) {
  return runTransaction('readonly', (store) => store.get(submoduleId));
}

