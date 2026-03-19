import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BodyPlanesAndCavitiesPage.module.css';
import Notificationbell from '../../assets/icons/Notificationbell.png';
import AsideSidebarDrawerNavigation from '../../components/layout/AsideSidebarDrawerNavigation';
import Lessonthumbnail from '../../assets/images/Lessonthumbnail.jpg';
import NotesIcon from '../../assets/icons/NotesIcon.svg';
import KnowledgeIcon from '../../assets/icons/KnowledgeIcon.svg';
import Downloadicon from '../../assets/icons/Downloadicon.png';

const ANSWERS = ['Nervous System', 'Skeletal System', 'Muscular System'];

const BodyPlanesAndCavitiesPage = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

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
          className={styles.backButton}
          aria-label="Back to notes"
          onClick={() => navigate('/lesson/human-anatomy/notes')}
        >
          &#8592;
        </button>

        <div className={styles.lessonHeadingRow}>
          <span className={styles.lessonHeadingBar} />
          <h1 className={styles.lessonHeading}>Body Planes and Cavities</h1>
        </div>

        <section className={styles.videoCard}>
          <img className={styles.videoImage} src={Lessonthumbnail} alt="Body planes and cavities lesson" />
          <div className={styles.playOverlay}>&#9654;</div>
          <div className={styles.videoControls}>
            <span className={styles.controlMini}>II</span>
            <div className={styles.timeline}>
              <div className={styles.timelineFill} />
            </div>
            <span className={styles.timeText}>05:02 / 15:00</span>
            <span className={styles.controlMini}>[]</span>
          </div>
        </section>

        <section className={styles.notesSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionHeadLeft}>
              <img className={styles.sectionIcon} src={NotesIcon} alt="Lesson notes icon" />
              <h2 className={styles.sectionTitle}>Lesson Notes</h2>
            </div>
            <button type="button" className={styles.downloadLink}>
              <img className={styles.downloadIcon} src={Downloadicon} alt="Download icon" />
              <span>Download All</span>
            </button>
          </div>

          <div className={styles.noteCard}>
            In this lesson, we explore the core design principles as applied to biological systems.
            We&apos;ll examine how form follows function in the skeletal framework and the structural
            efficiency of the human body.
          </div>
        </section>

        <section className={styles.quizCard}>
          <div className={styles.sectionHeadLeft}>
            <img className={styles.sectionIcon} src={KnowledgeIcon} alt="Knowledge check icon" />
            <h2 className={styles.sectionTitle}>Knowledge Check</h2>
          </div>

          <p className={styles.question}>Which system provides the structural framework for the body?</p>

          <div className={styles.answersList}>
            {ANSWERS.map((answer) => {
              const isSelected = selectedAnswer === answer;

              return (
                <button
                  key={answer}
                  type="button"
                  className={isSelected ? styles.optionActive : styles.option}
                  onClick={() => setSelectedAnswer(answer)}
                  aria-pressed={isSelected}
                >
                  <span className={isSelected ? styles.radioActive : styles.radio} />
                  <span className={styles.optionLabel}>{answer}</span>
                </button>
              );
            })}
          </div>

          <button type="button" className={styles.submitButton}>
            Submit Answer
          </button>
        </section>

        <div className={styles.bottomActions}>
          <button type="button" className={styles.outlineButton}>
            Mark as completed
          </button>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => navigate('/assessment/module-1')}
          >
            Take Quiz
          </button>
        </div>
      </main>
    </div>
  );
};

export default BodyPlanesAndCavitiesPage;
