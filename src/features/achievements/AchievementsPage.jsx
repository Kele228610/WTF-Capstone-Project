import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AchievementsPage.module.css';
import Notificationbell from '../../assets/icons/Notificationbell.png';
import AsideSidebarDrawerNavigation from '../../components/layout/AsideSidebarDrawerNavigation';

const UNLOCKED = [
  { id: 'first-lesson', icon: '📖', title: 'First Lesson', type: 'NEWCOMER', time: 'Earned 2d ago' },
  { id: 'first-quiz', icon: '🧪', title: 'First Quiz', type: 'QUIZ WHIZ', time: 'Earned 1d ago' },
];

const LOCKED = [
  { id: 'week-warrior', icon: '📅', title: 'Week Warrior', subtitle: 'Complete 7 consecutive days of learning' },
  { id: 'scholar', icon: '🎓', title: 'Scholar', subtitle: 'Complete your first full course' },
  { id: 'mastermind', icon: '✪', title: 'Mastermind', subtitle: 'Get 100% on a final assessment' },
  { id: 'community', icon: '👥', title: 'Community', subtitle: 'Join a study group and post' },
];

const AchievementsPage = () => {
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
        <h1 className={styles.title}>Achievements &amp; Badges</h1>

        <section className={styles.heroCard}>
          <p className={styles.heroHeading}>Keep it up, Alex!</p>
          <p className={styles.heroSub}>You&apos;re in the top 10% this week!</p>
          <div className={styles.goalCard}>
            <p className={styles.goalTitle}>Weekly Goal: 15 Study Hours</p>
            <div className={styles.goalTrack}>
              <span className={styles.goalFill} />
            </div>
            <p className={styles.goalMeta}>12.3 / 15 hrs completed</p>
          </div>
          <div className={styles.heroShape} />
        </section>

        <section className={styles.kpiGrid}>
          <article className={styles.kpiCard}>
            <p className={styles.kpiLabel}>LESSONS</p>
            <p className={styles.kpiValue}>24 <span>+12%</span></p>
          </article>
          <article className={styles.kpiCard}>
            <p className={styles.kpiLabel}>AVG. SCORE</p>
            <p className={styles.kpiValue}>88% <span>+5%</span></p>
          </article>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Unlocked Achievements</h2>
            <span className={styles.newTag}>2 NEW</span>
          </div>
          <div className={styles.unlockedGrid}>
            {UNLOCKED.map((item) => (
              <article key={item.id} className={styles.unlockedCard}>
                <div className={styles.unlockedIcon}>{item.icon}</div>
                <p className={styles.unlockedTitle}>{item.title}</p>
                <p className={styles.unlockedType}>{item.type}</p>
                <p className={styles.unlockedTime}>{item.time}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Locked Achievements</h2>
          <div className={styles.lockedGrid}>
            {LOCKED.map((item) => (
              <article key={item.id} className={styles.lockedCard}>
                <div className={styles.lockBadge}>🔒</div>
                <div className={styles.lockedIcon}>{item.icon}</div>
                <p className={styles.lockedTitle}>{item.title}</p>
                <p className={styles.lockedSub}>{item.subtitle}</p>
              </article>
            ))}
          </div>
        </section>

        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate('/returning-home')}
        >
          Back to Home
        </button>
      </main>
    </div>
  );
};

export default AchievementsPage;
