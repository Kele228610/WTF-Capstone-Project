import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Module1AssessmentFrontPage.module.css';
import Notificationbell from '../../assets/icons/Notificationbell.png';
import AsideSidebarDrawerNavigation from '../../components/layout/AsideSidebarDrawerNavigation';

const Module1AssessmentFrontPage = () => {
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
        <button
          type="button"
          className={styles.backRow}
          onClick={() => navigate('/lesson/human-anatomy/notes')}
          aria-label="Back to lesson notes"
        >
          <span className={styles.backArrow}>&#8592;</span>
          <span className={styles.backText}>Module 1 Assessment</span>
        </button>

        <section className={styles.heroCard}>
          <h1 className={styles.heroTitle}>Foundations of Anatomy</h1>
          <p className={styles.heroSubtitle}>
            Validate your mastery of anatomical terminology and spatial orientation.
          </p>
          <div className={styles.readyRow}>
            <span className={styles.readyDot} />
            <span className={styles.readyText}>Ready to Begin</span>
          </div>
        </section>

        <section className={styles.statsGrid}>
          <article className={styles.statCard}>
            <div className={styles.statIcon}>?</div>
            <div className={styles.statLabel}>Questions</div>
            <div className={styles.statValue}>10</div>
          </article>
          <article className={styles.statCard}>
            <div className={styles.statIcon}>◔</div>
            <div className={styles.statLabel}>Time</div>
            <div className={styles.statValue}>15m</div>
          </article>
          <article className={styles.statCard}>
            <div className={styles.statIconRed}>↻</div>
            <div className={styles.statLabel}>Attempts</div>
            <div className={styles.statValueRed}>0/3</div>
          </article>
        </section>

        <section className={styles.tutorCard}>
          <div className={styles.tutorAvatarWrap}>
            <div className={styles.tutorAvatar}>✦</div>
            <span className={styles.onlineDot} />
          </div>
          <div className={styles.tutorTextWrap}>
            <b className={styles.tutorName}>EduAI Tutor</b>
            <p className={styles.tutorText}>
              &quot;Great job completing the module! Before we dive into the assessment, would you like to do a
              quick 2-minute review of the key concepts?&quot;
            </p>
          </div>
        </section>

        <button type="button" className={styles.startButton} onClick={() => navigate('/assessment/module-1/questions')}>
          ▶ Start Assessment
        </button>
        <button type="button" className={styles.reviewButton}>
          ⌘ Review Key Concepts
        </button>
      </main>
    </div>
  );
};

export default Module1AssessmentFrontPage;

