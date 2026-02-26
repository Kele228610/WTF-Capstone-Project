import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HumanAnatomyLessonPage.module.css';
import Notificationbell from '../../assets/icons/Notificationbell.png';
import AsideSidebarDrawerNavigation from '../../components/layout/AsideSidebarDrawerNavigation';
import Scienceflask from '../../assets/icons/Scienceflaskicon.png';
import upchevron from '../../assets/icons/upchevronicon.png';
import Greylock from '../../assets/icons/Greylockicon.png';
import Notesicon from '../../assets/icons/NotesIcon.svg';
import Lessonplay from '../../assets/icons/Lessonplayicon.png';
import Question from '../../assets/icons/Questionicon.png';
import CloudIcon from '../../assets/icons/Cloudicon.png';

const HumanAnatomyLessonPage = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModuleOpen, setIsModuleOpen] = useState(true);

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
          aria-label="Go back"
          onClick={() => navigate('/curriculum')}
        >
          &#8592;
        </button>

        <section className={styles.courseCard}>
          <div className={styles.topRow}>
            <div className={styles.pill}>SCIENCE</div>
            <img className={styles.scienceflaskIcon} src={Scienceflask} alt="Science icon" />
          </div>

          <h1 className={styles.title}>Human Anatomy</h1>
          <div className={styles.progressRow}>
            <span className={styles.progressLabel}>Course Progress</span>
            <span className={styles.progressValue}>35%</span>
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} />
          </div>
        </section>

        <h2 className={styles.sectionTitle}>Course Content</h2>

        <section className={styles.moduleCard}>
          <div className={styles.moduleHeader}>
            <div className={styles.moduleNumber}>1</div>
            <b className={styles.moduleTitle}>Foundations of Anatomy</b>
            <button
              type="button"
              className={styles.chevronButton}
              aria-label={isModuleOpen ? 'Collapse module' : 'Expand module'}
              aria-expanded={isModuleOpen}
              onClick={() => setIsModuleOpen((prev) => !prev)}
            >
              <img
                className={`${styles.chevron} ${isModuleOpen ? styles.chevronOpen : styles.chevronClosed}`}
                src={upchevron}
                alt=""
              />
            </button>
          </div>

          {isModuleOpen && (
            <>
              <div className={styles.lessonRow}>
                <img className={styles.notesIcon} src={Notesicon} alt="Notes icon" />
                <div className={styles.lessonBody}>
                  <b className={styles.lessonName}>Introduction to Anatomical Terms</b>
                  <div className={styles.lessonMeta}>Reading - 10 mins</div>
                  <div className={styles.completedOk}>Completed</div>
                </div>
                {/* <div className={styles.statusDone}>OK</div> */}
                <img className={styles.cloudIcon} src={CloudIcon} alt="Completed" />
              </div>

              <div className={styles.lessonRowActive}>
                <img className={styles.lessonIconPlay} src={Lessonplay} alt="Play icon" />
                <div className={styles.lessonBody}>
                  <b className={styles.lessonNameActive}>Body Planes and Cavities</b>
                  <div className={styles.lessonMeta}>Video - 15 mins</div>
                  <div className={styles.downloadBad}>Not Downloaded</div>
                </div>
                <div className={styles.statusCircle} />
              </div>

              <div className={styles.lessonRow}>
                {/* <div className={styles.lessonIconLock}>Q</div> */}
                <img className={styles.lessonIconLock} src={Question} alt="Question icon" />
                <div className={styles.lessonBody}>
                  <b className={styles.lessonName}>Module 1 Assessment</b>
                  <div className={styles.lessonMeta}>- 5 mins</div>
                  <div className={styles.lessonMeta}>Available offline</div>
                </div>
                <img className={styles.lockIcon} src={Greylock} alt="Locked" />
              </div>
            </>
          )}
        </section>

        <section className={styles.moduleCollapsed}>
          <div className={styles.moduleNumberMuted}>2</div>
          <b className={styles.moduleMutedText}>The Skeletal System</b>
          <span className={styles.chevronMuted}>v</span>
        </section>

        <section className={styles.moduleCollapsed}>
          <div className={styles.moduleNumberMuted}>3</div>
          <b className={styles.moduleMutedText}>Muscular System</b>
          <span className={styles.chevronMuted}>v</span>
        </section>

        <div className={styles.footerAction}>
          <button
            type="button"
            className={styles.nextButton}
            onClick={() => navigate('/lesson/human-anatomy/notes')}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default HumanAnatomyLessonPage;
