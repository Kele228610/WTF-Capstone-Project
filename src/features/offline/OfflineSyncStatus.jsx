import { useEffect, useState } from 'react';
import styles from './OfflineSyncStatus.module.css';
import { startOfflineSyncManager, subscribeOfflineSync } from './offlineSync';

export default function OfflineSyncStatus() {
  const [syncState, setSyncState] = useState({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isSyncing: false,
    queueLength: 0,
  });

  useEffect(() => {
    const stopManager = startOfflineSyncManager();
    const unsubscribe = subscribeOfflineSync(setSyncState);

    return () => {
      unsubscribe();
      stopManager();
    };
  }, []);

  const showOfflineBanner = !syncState.isOnline;
  const showSyncPopup = syncState.isSyncing;

  return (
    <>
      {showOfflineBanner ? (
        <div className={styles.offlineBanner}>
          You are offline. Downloaded lessons remain available and progress will sync when connection returns.
        </div>
      ) : null}

      {showSyncPopup ? (
        <div className={styles.syncOverlay} role="status" aria-live="polite">
          <div className={styles.syncCard}>
            <div className={styles.syncSpinner} />
            <h2 className={styles.syncTitle}>Syncing progress...</h2>
            <p className={styles.syncCopy}>
              Hold on while EduLearn updates your offline progress to the server.
            </p>
            <p className={styles.syncMeta}>
              {syncState.queueLength} item{syncState.queueLength === 1 ? '' : 's'} pending
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}

