import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './HumanAnatomyLessonPage.module.css';
import Notificationbell from '../../assets/icons/Notificationbell.png';
import AsideSidebarDrawerNavigation from '../../components/layout/AsideSidebarDrawerNavigation';
import Scienceflask from '../../assets/icons/Scienceflaskicon.png';
import upchevron from '../../assets/icons/upchevronicon.png';
import Greylock from '../../assets/icons/Greylockicon.png';
import Notesicon from '../../assets/icons/NotesIcon.svg';
import Lessonplay from '../../assets/icons/Lessonplayicon.png';
import Question from '../../assets/icons/Questionicon.png';
import cloudicon from '../../assets/icons/cloud-icon.png';
import { getLessonById, getModulesByLessonId, startLessonSession } from '../../api/lessons';
import { getProfile } from '../../api/profile';

function extractPayload(data) {
  return data?.data || data;
}

function extractLessonId(payload) {
  return payload?.lessonId || payload?.lesson?.id || payload?.lesson?._id || null;
}

function extractModuleId(payload) {
  return payload?.moduleId || payload?.module?.id || payload?.module?._id || payload?.currentModuleId || null;
}

function extractModules(data) {
  const payload = extractPayload(data);
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.modules)) return payload.modules;
  return [];
}

const HumanAnatomyLessonPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openModuleId, setOpenModuleId] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [modules, setModules] = useState([]);
  const [profile, setProfile] = useState(null);
  const [pageError, setPageError] = useState('');
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadLessonPage() {
      try {
        setPageLoading(true);
        setPageError('');

        const initialSession = location.state?.session;
        const sessionPayload = initialSession || extractPayload(await startLessonSession());
        const lessonId = location.state?.lessonId || extractLessonId(sessionPayload);
        const moduleId = location.state?.moduleId || extractModuleId(sessionPayload);

        if (!lessonId) {
          throw new Error('No lesson session was returned from the backend.');
        }

        const [lessonData, modulesData, profileData] = await Promise.all([
          getLessonById(lessonId),
          getModulesByLessonId(lessonId),
          getProfile(),
        ]);

        if (cancelled) return;

        const lessonPayload = extractPayload(lessonData);
        const modulesPayload = extractModules(modulesData);
        const profilePayload = extractPayload(profileData);

        setLesson(lessonPayload);
        setModules(modulesPayload);
        setProfile(profilePayload);
        setOpenModuleId(moduleId || modulesPayload[0]?.id || modulesPayload[0]?._id || null);
      } catch (error) {
        if (cancelled) return;
        setPageError(error?.message || 'Unable to load lesson.');
      } finally {
        if (!cancelled) setPageLoading(false);
      }
    }

    loadLessonPage();

    return () => {
      cancelled = true;
    };
  }, [location.state]);

  const lessonTitle = lesson?.title || 'Human Anatomy';
  const lessonSubject = lesson?.courseName || lesson?.subject || 'SCIENCE';
  const progressValue = profile?.lessonProgress ?? lesson?.progress ?? 35;

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
            <div className={styles.pill}>{String(lessonSubject).toUpperCase()}</div>
            <img className={styles.scienceflaskIcon} src={Scienceflask} alt="Science icon" />
          </div>

          <h1 className={styles.title}>{pageLoading ? 'Loading lesson...' : lessonTitle}</h1>
          <div className={styles.progressRow}>
            <span className={styles.progressLabel}>Course Progress</span>
            <span className={styles.progressValue}>{progressValue}%</span>
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progressValue}%` }} />
          </div>
          {pageError ? <p className={styles.pageError}>{pageError}</p> : null}
        </section>

        <h2 className={styles.sectionTitle}>Course Content</h2>

        {modules.map((module, index) => {
          const moduleId = module?.id || module?._id || `module-${index}`;
          const isOpen = openModuleId === moduleId;
          const moduleTitle = module?.title || `Module ${index + 1}`;

          if (!isOpen) {
            return (
              <section key={moduleId} className={styles.moduleCollapsed}>
                <div className={styles.moduleNumberMuted}>{index + 1}</div>
                <b className={styles.moduleMutedText}>{moduleTitle}</b>
                <button
                  type="button"
                  className={styles.chevronMutedButton}
                  onClick={() => setOpenModuleId(moduleId)}
                >
                  <span className={styles.chevronMuted}>v</span>
                </button>
              </section>
            );
          }

          return (
            <section key={moduleId} className={styles.moduleCard}>
              <div className={styles.moduleHeader}>
                <div className={styles.moduleNumber}>{index + 1}</div>
                <b className={styles.moduleTitle}>{moduleTitle}</b>
                <button
                  type="button"
                  className={styles.chevronButton}
                  aria-label="Collapse module"
                  aria-expanded="true"
                  onClick={() => setOpenModuleId(null)}
                >
                  <img className={styles.chevronOpen} src={upchevron} alt="" />
                </button>
              </div>

              <div className={styles.lessonRow}>
                <img className={styles.notesIcon} src={Notesicon} alt="Notes icon" />
                <div className={styles.lessonBody}>
                  <b className={styles.lessonName}>{lessonTitle}</b>
                  <div className={styles.lessonMeta}>Module content</div>
                  <div className={styles.completedOk}>Current lesson</div>
                </div>
                <img className={styles.cloudIcon} src={cloudicon} alt="Current module" />
              </div>

              <div className={styles.lessonRowActive}>
                <img className={styles.lessonIconPlay} src={Lessonplay} alt="Play icon" />
                <div className={styles.lessonBody}>
                  <b className={styles.lessonNameActive}>{moduleTitle}</b>
                  <div className={styles.lessonMeta}>Active module</div>
                  <div className={styles.downloadBad}>Ready to continue</div>
                </div>
                <div className={styles.statusCircle} />
              </div>

              <div className={styles.lessonRow}>
                <img className={styles.lessonIconLock} src={Question} alt="Question icon" />
                <div className={styles.lessonBody}>
                  <b className={styles.lessonName}>Module Assessment</b>
                  <div className={styles.lessonMeta}>Available after completion</div>
                  <div className={styles.lessonMeta}>Available offline</div>
                </div>
                <img className={styles.lockIcon} src={Greylock} alt="Locked" />
              </div>
            </section>
          );
        })}

        {!pageLoading && modules.length === 0 ? (
          <section className={styles.moduleCollapsed}>
            <div className={styles.moduleNumberMuted}>0</div>
            <b className={styles.moduleMutedText}>No modules returned from backend</b>
            <span className={styles.chevronMuted}>-</span>
          </section>
        ) : null}

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
