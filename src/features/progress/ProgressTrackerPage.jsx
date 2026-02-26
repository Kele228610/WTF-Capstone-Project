import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProgressTrackerPage.module.css';
import Notificationbell from '../../assets/icons/Notificationbell.png';
import AsideSidebarDrawerNavigation from '../../components/layout/AsideSidebarDrawerNavigation';

const SUBJECTS = [
  { id: 'math', icon: 'Σ', name: 'Mathematics', topic: 'Calculus I', score: '92%', grade: 'Grade: A', progress: 92, tone: 'blue' },
  { id: 'science', icon: '⚗', name: 'Science', topic: 'Human Anatomy', score: '90%', grade: 'Grade: A', progress: 90, tone: 'purple' },
  { id: 'history', icon: '✉', name: 'World History', topic: 'Renaissance Period', score: '85%', grade: 'Grade: B+', progress: 85, tone: 'orange' },
];

const ACTIVITIES = [
  { id: 1, title: 'Assessment: Human Anatomy', subtitle: 'Syncing...', status: 'syncing' },
  { id: 2, title: 'Lesson: Human Anatomy', subtitle: 'Synced 1m ago', status: 'done' },
  { id: 3, title: 'Lesson: Calculus I', subtitle: 'Synced 2m ago', status: 'done' },
  { id: 4, title: 'Lesson: Periodic Table', subtitle: 'Synced 15m ago', status: 'done' },
];

const ProgressTrackerPage = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className={styles.page}>
      <AsideSidebarDrawerNavigation isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Menu"
            onClick={() => setIsSidebarOpen(true)}
          >
            &#9776;
          </button>
          <b className={styles.brand}>EduLearn</b>
        </div>
        <img className={styles.notificationIcon} src={Notificationbell} alt="Notifications" />
      </header>

      <main className={styles.main}>
        <div className={styles.topBar}>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigate('/returning-home')}
            aria-label="Go back"
          >
            &#8592;
          </button>
          <h1 className={styles.title}>Progress Tracker</h1>
        </div>

        <section className={styles.syncCard}>
          <p className={styles.syncCopy}>Your data is being secured on our servers.</p>

          <div className={styles.scoreRingWrap}>
            <div className={styles.scoreRing}>
              <div className={styles.scoreInner}>
                <p className={styles.scoreValue}>90%</p>
                <p className={styles.scoreLabel}>data Uploaded</p>
              </div>
            </div>
          </div>

          <div className={styles.metrics}>
            <article className={styles.metricCard}>
              <p className={styles.metricLabel}>Lessons</p>
              <p className={styles.metricValue}>20</p>
            </article>
            <article className={styles.metricCard}>
              <p className={styles.metricLabel}>Assessment</p>
              <p className={styles.metricValue}>20</p>
            </article>
            <article className={styles.metricCard}>
              <p className={styles.metricLabel}>Study Time</p>
              <p className={styles.metricValue}>42h</p>
            </article>
          </div>

          <div className={styles.syncFooter}>↺ Syncing in progress.</div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Subject Performance</h2>
          <div className={styles.subjectList}>
            {SUBJECTS.map((item) => (
              <article key={item.id} className={styles.subjectCard}>
                <div className={`${styles.subjectIcon} ${styles[item.tone]}`}>{item.icon}</div>
                <div className={styles.subjectContent}>
                  <div className={styles.subjectRow}>
                    <div>
                      <p className={styles.subjectName}>{item.name}</p>
                      <p className={styles.subjectTopic}>{item.topic}</p>
                    </div>
                    <div className={styles.scoreGroup}>
                      <p className={styles.subjectScore}>{item.score}</p>
                      <p className={styles.subjectGrade}>{item.grade}</p>
                    </div>
                  </div>
                  <div className={styles.progressTrack}>
                    <span className={`${styles.progressFill} ${styles[item.tone]}`} style={{ width: `${item.progress}%` }} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Sync Activity</h2>
            <p className={styles.liveTag}>LIVE UPDATES</p>
          </div>

          <div className={styles.activityList}>
            {ACTIVITIES.map((item) => (
              <article key={item.id} className={`${styles.activityCard} ${item.status === 'syncing' ? styles.syncingCard : ''}`}>
                <div className={`${styles.activityIcon} ${item.status === 'syncing' ? styles.syncingIcon : styles.doneIcon}`}>
                  {item.status === 'syncing' ? '⏱' : '☑'}
                </div>
                <div className={styles.activityText}>
                  <p className={styles.activityTitle}>{item.title}</p>
                  <p className={`${styles.activitySub} ${item.status === 'syncing' ? styles.syncingText : ''}`}>{item.subtitle}</p>
                </div>
                <div className={`${styles.activityStatus} ${item.status === 'syncing' ? styles.syncingText : styles.doneText}`}>
                  {item.status === 'syncing' ? '⟳' : '✓'}
                </div>
              </article>
            ))}
          </div>
        </section>

        <p className={styles.backupText}>Last full backup: Today, 10:42 AM</p>
      </main>
    </div>
  );
};

export default ProgressTrackerPage;
