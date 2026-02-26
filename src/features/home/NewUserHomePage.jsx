import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NewUserHomePage.module.css';
import AsideSidebarDrawerNavigation from '../../components/layout/AsideSidebarDrawerNavigation';
import Hamburger from '../../assets/icons/Hamburger.png';
import Notificationbell from '../../assets/icons/Notificationbell.png';
import Aistars from '../../assets/icons/Aistars.png';
import Bluequestion from '../../assets/icons/Bluequestion.png';
import Notebook from '../../assets/icons/Notebook.png';

const lessonCards = [
  {
    id: 'periodic-table',
    title: 'The Periodic Table',
    subtitle: '12 Lessons - 3.5 Hours',
    rating: '4.9',
    image: Bluequestion
  },
  {
    id: 'derivatives',
    title: 'Derivatives',
    subtitle: '8 Lessons - 2 Hours',
    rating: '4.7',
    image: Notebook
  }
];

const NewUserHomePage = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <main className={styles.page}>
      <AsideSidebarDrawerNavigation isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Open navigation"
            onClick={() => setIsSidebarOpen(true)}
          >
            <img src={Hamburger} alt="" />
          </button>
          <h1 className={styles.brand}>EduLearn</h1>
        </div>
        <button type="button" className={styles.iconButton} aria-label="View notifications">
          <img src={Notificationbell} alt="" />
          <span className={styles.notificationDot} />
        </button>
      </header>

      <section className={styles.heroCard}>
        <p className={styles.kicker}>AI LEARNING PLAN</p>
        <h2 className={styles.heroTitle}>Hi Simone! Your study plan for Biology is ready.</h2>
        <p className={styles.heroSubtitle}>
          Let&apos;s start with Human Anatomy and build your foundation.
        </p>
        <button type="button" className={styles.primaryCta} onClick={() => navigate('/lesson/human-anatomy')}>
          Start Lesson <span aria-hidden="true">{'>'}</span>
        </button>
      </section>

      <section className={styles.goalCard}>
        <div>
          <h3 className={styles.goalTitle}>Daily Goal</h3>
          <div className={styles.goalValue}>0 <span>/ 30m</span></div>
          <p className={styles.goalHint}>Keep your streak alive!</p>
        </div>
        <div className={styles.goalRing}>
          <span>0%</span>
        </div>
      </section>

      <section className={styles.badgesSection}>
        <div className={styles.sectionHead}>
          <h3>Unlock Your First Badge</h3>
          <button type="button" className={styles.linkButton}>View All</button>
        </div>
        <div className={styles.badgeGrid}>
          <article className={styles.badgeItem}>
            <div className={styles.badgeCircle}>T</div>
            <p>First Lesson</p>
          </article>
          <article className={styles.badgeItem}>
            <div className={styles.badgeCircle}>S</div>
            <p>Top Learner</p>
          </article>
          <article className={styles.badgeItem}>
            <div className={styles.badgeCircle}>L</div>
            <p>Day 1 Streak</p>
          </article>
        </div>
      </section>

      <section className={styles.lessonsSection}>
        <div className={styles.sectionHead}>
          <h3>Recommended Lessons</h3>
          <button type="button" className={styles.aiHeaderButton} aria-label="Open AI assistant">
            <img src={Aistars} alt="" />
          </button>
          <button type="button" className={styles.linkButton}>View All</button>
        </div>
        <div className={styles.lessonList}>
          {lessonCards.map((lesson) => (
            <article key={lesson.id} className={styles.lessonCard}>
              <img src={lesson.image} alt={lesson.title} className={styles.lessonImage} />
              <div className={styles.lessonContent}>
                <h4>{lesson.title}</h4>
                <p>{lesson.subtitle}</p>
                <span>* {lesson.rating}</span>
              </div>
              <button type="button" className={styles.arrowButton} aria-label={`Open ${lesson.title}`}>
                {'>'}
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default NewUserHomePage;
