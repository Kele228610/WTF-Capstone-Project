import { useNavigate } from 'react-router-dom';
import styles from './ProfilePage.module.css';
import UserProfileImage from '../../assets/images/User3.png';
import Icon16 from '../../assets/icons/Icon-16.svg';

const stats = [
  { value: '2', label: 'SUBJECTS' },
  { value: '20', label: 'LESSONS' },
  { value: '42h', label: 'STUDY' },
];

const achievements = [
  { id: 'first', title: 'First Lesson', icon: 'Bk', tone: 'blue', locked: false },
  { id: 'quiz', title: 'Quiz Master', icon: 'Qz', tone: 'gold', locked: false },
  { id: 'scholar', title: 'Scholar', icon: 'Sc', tone: 'muted', locked: true },
  { id: 'master', title: 'Master Mind', icon: 'MM', tone: 'muted', locked: true },
  { id: 'week', title: 'Week Warrior', icon: 'WW', tone: 'muted', locked: true },
];

const courses = [
  {
    id: 'anatomy',
    title: 'Human Anatomy',
    subtitle: '12/16 lessons completed',
    progress: 75,
    accent: 'dark',
    glyph: 'HA',
  },
  {
    id: 'calculus',
    title: 'Calculus 1',
    subtitle: '9/20 lessons completed',
    progress: 45,
    accent: 'light',
    glyph: 'C1',
  },
];

const ProfilePage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate('/settings')}
          aria-label="Back to settings"
        >
          &#8592;
        </button>
        <h1 className={styles.title}>Profile</h1>
      </header>

      <main className={styles.main}>
        <section className={styles.profileBlock}>
          <div className={styles.avatarWrap}>
            <img className={styles.avatar} src={UserProfileImage} alt="Winnie Jones" />
            <button type="button" className={styles.editAvatarButton} aria-label="Edit profile photo">
              &#9998;
            </button>
          </div>
          <h2 className={styles.name}>Winnie Jones</h2>
          <p className={styles.role}>Senior High Student</p>
          <button type="button" className={styles.editProfileButton}>Edit Profile</button>
        </section>

        <section className={styles.statsGrid} aria-label="Profile summary">
          {stats.map((item) => (
            <article key={item.label} className={styles.statCard}>
              <p className={styles.statValue}>{item.value}</p>
              <p className={styles.statLabel}>{item.label}</p>
            </article>
          ))}
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Achievements</h3>
            <button
              type="button"
              className={styles.linkButton}
              onClick={() => navigate('/achievements')}
            >
              View All
            </button>
          </div>
          <div className={styles.achievementGrid}>
            {achievements.map((badge) => (
              <article key={badge.id} className={styles.badgeCard}>
                <div className={`${styles.badgeCircle} ${styles[`badge${badge.tone}`]}`}>
                  <span>{badge.icon}</span>
                </div>
                <p className={`${styles.badgeTitle} ${badge.locked ? styles.badgeTitleMuted : ''}`}>{badge.title}</p>
                {badge.locked ? <span className={styles.lockChip}>L</span> : null}
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Continue Learning</h3>
          <div className={styles.courseList}>
            {courses.map((course) => (
              <article key={course.id} className={styles.courseCard}>
                <div className={styles.courseTopRow}>
                  <div className={styles.courseIcon}>{course.glyph}</div>
                  <div className={styles.courseMeta}>
                    <p className={styles.courseTitle}>{course.title}</p>
                    <p className={styles.courseSubtitle}>{course.subtitle}</p>
                  </div>
                </div>
                <div className={styles.progressRow}>
                  <span className={styles.progressLabel}>Progress</span>
                  <span className={course.accent === 'dark' ? styles.progressPercentDark : styles.progressPercentLight}>
                    {course.progress}%
                  </span>
                </div>
                <div className={styles.progressTrack}>
                  <span
                    className={course.accent === 'dark' ? styles.progressFillDark : styles.progressFillLight}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </article>
            ))}
          </div>
        </section>

        <button type="button" className={styles.logoutButton}>
          <img className={styles.logoutIcon} src={Icon16} alt="" />
          Logout
        </button>

        <p className={styles.footerText}>&copy; 2024 EDUlearn Inc. All rights reserved.</p>
      </main>
    </div>
  );
};

export default ProfilePage;
