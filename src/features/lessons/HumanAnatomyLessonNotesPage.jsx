import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './HumanAnatomyLessonNotesPage.module.css';
import Notificationbell from '../../assets/icons/Notificationbell.png';
import AsideSidebarDrawerNavigation from '../../components/layout/AsideSidebarDrawerNavigation';
import NotesIcon from '../../assets/icons/NotesIcon.svg';
import KnowledgeIcon from '../../assets/icons/KnowledgeIcon.svg';

const NOTE_LINES = [
  'In this lesson, we learn that anatomical terminology provides standardized words used by healthcare professionals to describe the location, position, and relationship of body structures clearly and accurately. All descriptions are based on the anatomical position, where the body stands upright, faces forward, arms are at the sides, palms face forward, and feet are slightly apart. Common directional terms help describe where one body part is relative to another:',
  '- Superior: toward the head',
  '- Inferior: toward the feet',
  '- Anterior: front of the body',
  '- Posterior: back of the body',
  "- Medial: closer to the body's midline",
  '- Lateral: farther from the midline',
  '- Proximal: closer to the point of attachment',
  '- Distal: farther from the point of attachment',
];

const ANSWERS = ['Lateral', 'Medial', 'Distal'];

const HumanAnatomyLessonNotesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('Medial');

  const lessonTitle = location.state?.lessonTitle || 'Introduction to Anatomical Terms';

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
          aria-label="Back to lesson"
          onClick={() => navigate('/lesson/human-anatomy')}
        >
          &#8592;
        </button>

        <div className={styles.lessonHeadingRow}>
          <span className={styles.lessonHeadingBar} />
          <h1 className={styles.lessonHeading}>{lessonTitle}</h1>
        </div>

        <section className={styles.notesSection}>
          <div className={styles.sectionHeader}>
            <img className={styles.sectionIcon} src={NotesIcon} alt="Lesson notes icon" />
            <h2 className={styles.sectionTitle}>Lesson Notes</h2>
          </div>

          <div className={styles.noteCard}>
            {NOTE_LINES.map((line, index) => (
              <p key={`${line}-${index}`} className={styles.noteLine}>
                {line}
              </p>
            ))}
          </div>

          <button type="button" className={styles.downloadLink}>
            <span className={styles.downloadGlyph}>+</span>
            Download
          </button>
        </section>

        <section className={styles.quizCard}>
          <div className={styles.sectionHeader}>
            <img className={styles.sectionIcon} src={KnowledgeIcon} alt="Knowledge check icon" />
            <h2 className={styles.sectionTitle}>Knowledge Check</h2>
          </div>

          <p className={styles.question}>
            Which anatomical term describes a structure that is closer to the midline of the body?
          </p>

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
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default HumanAnatomyLessonNotesPage;
