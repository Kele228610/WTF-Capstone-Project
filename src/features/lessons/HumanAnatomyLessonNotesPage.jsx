import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styles from './HumanAnatomyLessonNotesPage.module.css';
import Notificationbell from '../../assets/icons/Notificationbell.png';
import AsideSidebarDrawerNavigation from '../../components/layout/AsideSidebarDrawerNavigation';
// import HumanAnatomyImage from '../../assets/images/Human-anatomy-background.png';
import Lessonthumbnail from '../../assets/images/Lessonthumbnail.jpg';
import NotesIcon from '../../assets/icons/NotesIcon.svg';
import KnowledgeIcon from '../../assets/icons/KnowledgeIcon.svg';
import Downloadicon from '../../assets/icons/Downloadicon.png';


const HumanAnatomyLessonNotesPage = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('skeletal');

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
          <div className={styles.headerContainer}>
            <img className={styles.notesIcon} src={NotesIcon} alt="Notes icon" />
            <h2 className={styles.sectionTitle}>Lesson Notes</h2>
            <button type="button" className={styles.downloadButton}>
              <img className={styles.downloadIcon} src={Downloadicon} alt="Download notes" />
              <span className={styles.downloadText}>Download All</span>
            </button>
          </div>

          <div className={styles.noteCard}>
            In this lesson, we explore the core design principles as applied to biological systems. We&apos;ll
            examine how form follows function in the skeletal framework and the structural efficiency of the
            human body.
          </div>
        </section>

        <section className={styles.quizCard}>
          <div className={styles.knowledgeContainer}>
            <img className={styles.notesIcon} src={KnowledgeIcon} alt="Knowledge check icon" />
            <h2 className={styles.sectionTitle}>Knowledge Check</h2>
          </div>
          
          <p className={styles.question}>Which system provides the structural framework for the body?</p>
          

          <button
            type="button"
            className={selectedAnswer === 'nervous' ? styles.optionActive : styles.option}
            onClick={() => setSelectedAnswer('nervous')}
            aria-pressed={selectedAnswer === 'nervous'}
          >
            <span className={selectedAnswer === 'nervous' ? styles.radioActive : styles.radio} />
            Nervous System
          </button>
          <button
            type="button"
            className={selectedAnswer === 'skeletal' ? styles.optionActive : styles.option}
            onClick={() => setSelectedAnswer('skeletal')}
            aria-pressed={selectedAnswer === 'skeletal'}
          >
            <span className={selectedAnswer === 'skeletal' ? styles.radioActive : styles.radio} />
            Skeletal System
          </button>
          <button
            type="button"
            className={selectedAnswer === 'muscular' ? styles.optionActive : styles.option}
            onClick={() => setSelectedAnswer('muscular')}
            aria-pressed={selectedAnswer === 'muscular'}
          >
            <span className={selectedAnswer === 'muscular' ? styles.radioActive : styles.radio} />
            Muscular System
          </button>

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

export default HumanAnatomyLessonNotesPage;
