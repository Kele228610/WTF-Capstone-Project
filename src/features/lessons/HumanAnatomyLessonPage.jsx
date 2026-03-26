import { useEffect, useRef, useState } from 'react';
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
import {
  getLessonById,
  getModuleById,
  getModuleProgress,
  getModulesByLessonId,
  getSubmodulesByModuleId,
  startLessonSession,
} from '../../api/lessons';
import { getProfile, readStoredProfileIdentity, storeProfileIdentity } from '../../api/profile';
import { readLessonContext, saveLessonContext } from './lessonContext';
import { getDownloadedSubmodule, listDownloadedSubmodules } from './offlineLessonStorage';
import { readLessonUiState } from './lessonUiState';

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

function extractSubmodules(data) {
  const payload = extractPayload(data);
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.submodules)) return payload.submodules;
  return [];
}

function getEntityId(item, fallback) {
  return item?.id || item?._id || item?.submoduleId || item?.moduleId || fallback;
}

function normalizeModuleTitle(module, fallback) {
  return module?.title || module?.moduleTitle || module?.name || fallback;
}

function normalizeSubmodule(item, index, moduleTitle) {
  const rawTitle = item?.title || item?.submoduleTitle || item?.contentTitle || item?.name || `Lesson ${index + 1}`;
  const loweredTitle = String(rawTitle).trim().toLowerCase();
  const normalizedModuleTitle = String(moduleTitle || '').trim().toLowerCase();
  const contentType = String(item?.contentType || item?.type || item?.mediaType || item?.format || '').toLowerCase();
  const hasVideo = Boolean(item?.contentUrl) || contentType.includes('video');
  const isAssessment =
    contentType.includes('assessment') ||
    contentType.includes('quiz') ||
    loweredTitle.includes('assessment');

  let title = rawTitle;
  if (
    normalizedModuleTitle === 'foundations of anatomy' &&
    index === 1 &&
    loweredTitle === 'human anatomy'
  ) {
    title = 'Body Planes and Cavities';
  }

  return {
    ...item,
    id: getEntityId(item, `submodule-${index}`),
    title,
    hasVideo,
    isAssessment,
  };
}

function extractProgressValue(data) {
  const payload = extractPayload(data);
  const progress =
    payload?.progress ??
    payload?.moduleProgress ??
    payload?.completionPercentage ??
    payload?.percentage ??
    payload?.percent ??
    0;

  const numericProgress = Number(progress);
  if (Number.isFinite(numericProgress)) {
    return Math.max(0, Math.min(100, numericProgress));
  }

  return 0;
}

function buildOfflineLessonState(downloadedSubmodules, fallbackContext) {
  const fallbackLessonId = fallbackContext?.lessonId || null;
  const validSubmodules = downloadedSubmodules.filter((record) => {
    if (!record?.submodule || !record?.submoduleId) return false;
    return true;
  });

  const lessonMatchedSubmodules = fallbackLessonId
    ? validSubmodules.filter((record) => record?.context?.lessonId === fallbackLessonId)
    : validSubmodules;
  const filteredSubmodules = lessonMatchedSubmodules.length > 0 ? lessonMatchedSubmodules : validSubmodules;

  if (filteredSubmodules.length === 0) {
    throw new Error('No downloaded lessons are available offline yet.');
  }

  const lessonTitle =
    filteredSubmodules[0]?.context?.lessonTitle ||
    fallbackContext?.lessonTitle ||
    'Human Anatomy';
  const lessonId = filteredSubmodules[0]?.context?.lessonId || fallbackLessonId || 'offline-lesson';
  const modulesMap = new Map();

  filteredSubmodules.forEach((record, index) => {
    const moduleId = record?.context?.moduleId || `offline-module-${index + 1}`;
    const moduleTitle = record?.context?.moduleTitle || `Downloaded Module ${modulesMap.size + 1}`;

    if (!modulesMap.has(moduleId)) {
      modulesMap.set(moduleId, {
        id: moduleId,
        title: moduleTitle,
        submodules: [],
      });
    }

    const moduleEntry = modulesMap.get(moduleId);
    moduleEntry.submodules.push(
      normalizeSubmodule(
        {
          ...record.submodule,
          submoduleId: record.submoduleId,
        },
        moduleEntry.submodules.length,
        moduleTitle
      )
    );
  });

  const modules = Array.from(modulesMap.values()).map(({ ...moduleEntry }) => moduleEntry);
  const submodulesByModuleId = Object.fromEntries(
    Array.from(modulesMap.entries()).map(([moduleId, value]) => [moduleId, value.submodules])
  );
  const firstModuleId = modules[0]?.id || null;

  return {
    lesson: {
      id: lessonId,
      title: lessonTitle,
      subject: fallbackContext?.lessonSubject || 'SCIENCE',
    },
    modules,
    submodulesByModuleId,
    firstModuleId,
    moduleIds: modules.map((module) => module.id),
  };
}

const HumanAnatomyLessonPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const storedContext = readLessonContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openModuleId, setOpenModuleId] = useState(null);
  const [selectedLessonItem, setSelectedLessonItem] = useState(
    location.state?.submoduleId || storedContext?.submoduleId || null
  );
  const [lesson, setLesson] = useState(null);
  const [modules, setModules] = useState([]);
  const [moduleProgress, setModuleProgress] = useState(0);
  const [submodulesByModuleId, setSubmodulesByModuleId] = useState({});
  const [submoduleStatusById, setSubmoduleStatusById] = useState({});
  const [loadingModuleId, setLoadingModuleId] = useState(null);
  const [moduleErrors, setModuleErrors] = useState({});
  const [pageError, setPageError] = useState('');
  const [pageInfo, setPageInfo] = useState('');
  const [pageLoading, setPageLoading] = useState(true);
  const [userId, setUserId] = useState(() => readStoredProfileIdentity() || 'anonymous');
  const lastLessonLoadKeyRef = useRef('');
  const loadedSubmoduleModuleIdsRef = useRef(new Set());

  useEffect(() => {
    let cancelled = false;

    async function loadProfileIdentity() {
      try {
        const data = await getProfile();
        if (cancelled) return;
        const payload = extractPayload(data);
        const resolvedUserId = payload?.id || payload?._id || payload?.userId || payload?.studentId || 'anonymous';
        storeProfileIdentity(resolvedUserId);
        setUserId(resolvedUserId);
      } catch {
        if (!cancelled) {
          setUserId(readStoredProfileIdentity() || 'anonymous');
        }
      }
    }

    loadProfileIdentity();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const lessonIdHint = location.state?.lessonId || storedContext?.lessonId || 'session';
    const moduleIdHint = location.state?.moduleId || storedContext?.moduleId || 'default';
    const loadKey = `${lessonIdHint}:${moduleIdHint}`;

    if (lastLessonLoadKeyRef.current === loadKey && lesson && modules.length > 0) {
      return undefined;
    }

    async function loadLessonPage() {
      try {
        if (!lesson) {
          setPageLoading(true);
        }
        setPageError('');
        setPageInfo('');

        const initialSession = location.state?.session || storedContext?.session;
        const sessionPayload = initialSession || extractPayload(await startLessonSession());
        const lessonId = location.state?.lessonId || storedContext?.lessonId || extractLessonId(sessionPayload);
        const moduleId = location.state?.moduleId || storedContext?.moduleId || extractModuleId(sessionPayload);

        if (!lessonId) {
          throw new Error('No lesson session was returned from the backend.');
        }

        const [lessonData, modulesData] = await Promise.all([
          getLessonById(lessonId),
          getModulesByLessonId(lessonId),
        ]);

        if (cancelled) return;

        const lessonPayload = extractPayload(lessonData);
        const modulesPayload = extractModules(modulesData);
        const defaultModuleId = moduleId || getEntityId(modulesPayload[0], null);

        setLesson(lessonPayload);
        setModules(modulesPayload);
        setOpenModuleId(defaultModuleId);
        setModuleProgress(0);
        setSubmodulesByModuleId({});
        setModuleErrors({});
        loadedSubmoduleModuleIdsRef.current = new Set();
        lastLessonLoadKeyRef.current = loadKey;

        saveLessonContext({
          session: sessionPayload,
          lessonId,
          lessonTitle: lessonPayload?.title || 'Human Anatomy',
          moduleId: defaultModuleId,
        });
      } catch (error) {
        if (cancelled) return;
        try {
          const downloadedSubmodules = await listDownloadedSubmodules(userId);
          if (cancelled) return;

          const offlineState = buildOfflineLessonState(downloadedSubmodules, {
            lessonId: location.state?.lessonId || storedContext?.lessonId || null,
            lessonTitle: location.state?.lessonTitle || storedContext?.lessonTitle || null,
            lessonSubject: lesson?.courseName || lesson?.subject || 'SCIENCE',
          });

          setLesson(offlineState.lesson);
          setModules(offlineState.modules);
          setOpenModuleId(offlineState.firstModuleId);
          setModuleProgress(0);
          setSubmodulesByModuleId(offlineState.submodulesByModuleId);
          setModuleErrors({});
          loadedSubmoduleModuleIdsRef.current = new Set(offlineState.moduleIds);
          lastLessonLoadKeyRef.current = loadKey;
          setPageError('');
          setPageInfo('You are offline. Showing downloaded lessons from this device.');
        } catch (offlineError) {
          if (cancelled) return;
          setPageInfo('');
          setPageError(offlineError?.message || error?.message || 'Unable to load lesson.');
        }
      } finally {
        if (!cancelled) setPageLoading(false);
      }
    }

    loadLessonPage();

    return () => {
      cancelled = true;
    };
  }, [lesson, location.state?.lessonId, location.state?.moduleId, location.state?.session, modules.length, storedContext?.lessonId, storedContext?.moduleId, storedContext?.session, userId]);

  useEffect(() => {
    if (!openModuleId) return undefined;

    let cancelled = false;

    async function loadModuleProgress() {
      try {
        const progressData = await getModuleProgress(openModuleId);
        if (cancelled) return;
        setModuleProgress(extractProgressValue(progressData));
      } catch {
        if (!cancelled) {
          setModuleProgress(0);
        }
      }
    }

    loadModuleProgress();

    return () => {
      cancelled = true;
    };
  }, [openModuleId]);

  useEffect(() => {
    if (!openModuleId || modules.length === 0) return;
    if (loadedSubmoduleModuleIdsRef.current.has(openModuleId)) return;

    const module = modules.find((entry) => getEntityId(entry) === openModuleId);
    if (!module) return;

    let cancelled = false;

    async function loadModuleSubmodules() {
      try {
        setLoadingModuleId(openModuleId);
        setModuleErrors((prev) => ({ ...prev, [openModuleId]: '' }));

        const [moduleData, submodulesData] = await Promise.all([
          getModuleById(openModuleId),
          getSubmodulesByModuleId(openModuleId),
        ]);

        if (cancelled) return;

        const modulePayload = extractPayload(moduleData);
        const mergedModule = {
          ...module,
          ...modulePayload,
        };
        const moduleTitle = normalizeModuleTitle(mergedModule, module?.title || 'Module');
        const normalizedSubmodules = extractSubmodules(submodulesData).map((item, index) =>
          normalizeSubmodule(item, index, moduleTitle)
        );

        setModules((prev) =>
          prev.map((entry) =>
            getEntityId(entry) === openModuleId
              ? {
                  ...entry,
                  ...modulePayload,
                  title: moduleTitle,
                }
              : entry
          )
        );
        setSubmodulesByModuleId((prev) => ({ ...prev, [openModuleId]: normalizedSubmodules }));
        loadedSubmoduleModuleIdsRef.current.add(openModuleId);
      } catch (error) {
        if (cancelled) return;
        setModuleErrors((prev) => ({
          ...prev,
          [openModuleId]: error?.message || 'Unable to load lessons for this module.',
        }));
      } finally {
        if (!cancelled) setLoadingModuleId(null);
      }
    }

    loadModuleSubmodules();

    return () => {
      cancelled = true;
    };
  }, [modules, openModuleId]);

  useEffect(() => {
    let cancelled = false;

    async function loadSubmoduleStatuses() {
      const submodules = Object.values(submodulesByModuleId).flat();

      if (submodules.length === 0) {
        setSubmoduleStatusById({});
        return;
      }

      const entries = await Promise.all(
        submodules.map(async (submodule) => {
          const savedUiState = readLessonUiState(userId, submodule.id);
          const cachedSubmodule = await getDownloadedSubmodule(userId, submodule.id);

          return [
            submodule.id,
            {
              isCompleted: Boolean(savedUiState?.isCompleted),
              isDownloaded: Boolean(cachedSubmodule?.submodule),
            },
          ];
        })
      );

      if (cancelled) return;
      setSubmoduleStatusById(Object.fromEntries(entries));
    }

    loadSubmoduleStatuses();

    return () => {
      cancelled = true;
    };
  }, [submodulesByModuleId, userId]);

  const lessonTitle = lesson?.title || 'Human Anatomy';
  const lessonSubject = lesson?.courseName || lesson?.subject || 'SCIENCE';
  const progressValue = moduleProgress;
  const currentModuleSubmodules = openModuleId ? submodulesByModuleId[openModuleId] || [] : [];

  const openSubmodule = (module, submodule, index) => {
    const moduleId = getEntityId(module);
    const moduleSubmodules = submodulesByModuleId[moduleId] || [];
    const nextSubmodule = moduleSubmodules[index + 1] || null;
    const assessmentSubmodule =
      moduleSubmodules.find((item) => item.isAssessment) || moduleSubmodules[moduleSubmodules.length - 1] || null;
    const context = {
      lessonId: getEntityId(lesson, storedContext?.lessonId),
      lessonTitle,
      moduleId,
      moduleTitle: normalizeModuleTitle(module, `Module ${index + 1}`),
      submoduleId: submodule.id,
      submoduleTitle: submodule.title,
      submoduleHasVideo: submodule.hasVideo,
      submoduleIsAssessment: submodule.isAssessment,
      nextSubmoduleId: nextSubmodule?.id || null,
      nextSubmoduleTitle: nextSubmodule?.title || null,
      nextSubmoduleHasVideo: nextSubmodule?.hasVideo || false,
      nextSubmoduleIsAssessment: nextSubmodule?.isAssessment || false,
      assessmentSubmoduleId: assessmentSubmodule?.id || null,
      assessmentTitle: assessmentSubmodule?.title || 'Module Assessment',
    };

    setSelectedLessonItem(submodule.id);
    saveLessonContext(context);

    if (submodule.isAssessment) {
      navigate('/assessment/module-1', { state: context });
      return;
    }

    if (submodule.hasVideo) {
      navigate('/lesson/human-anatomy/body-planes-cavities', { state: context });
      return;
    }

    navigate('/lesson/human-anatomy/notes', { state: context });
  };

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
          {pageInfo ? <p className={styles.pageInfo}>{pageInfo}</p> : null}
          {pageError ? <p className={styles.pageError}>{pageError}</p> : null}
        </section>

        <h2 className={styles.sectionTitle}>Course Content</h2>

        {modules.map((module, index) => {
          const moduleId = getEntityId(module, `module-${index}`);
          const isOpen = openModuleId === moduleId;
          const moduleTitle = normalizeModuleTitle(module, `Module ${index + 1}`);
          const submodules = submodulesByModuleId[moduleId] || [];
          const moduleError = moduleErrors[moduleId];
          const isModuleLoading = loadingModuleId === moduleId;

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

              {isModuleLoading ? <p className={styles.pageError}>Loading module content...</p> : null}
              {moduleError ? <p className={styles.pageError}>{moduleError}</p> : null}

              {submodules.map((submodule) => {
                const isSelected = selectedLessonItem === submodule.id;
                const rowClass = isSelected ? styles.lessonRowActive : styles.lessonRow;
                const lessonNameClass = isSelected ? styles.lessonNameActive : styles.lessonName;
                const icon = submodule.isAssessment ? Question : submodule.hasVideo ? Lessonplay : Notesicon;
                const persistedStatus = submoduleStatusById[submodule.id] || {};
                const availabilityLabel = persistedStatus.isCompleted
                  ? 'Completed'
                  : persistedStatus.isDownloaded
                  ? 'Downloaded'
                  : 'Available now';
                const trailing = submodule.isAssessment ? (
                  <img className={styles.lockIcon} src={Greylock} alt="Assessment" />
                ) : submodule.hasVideo ? (
                  isSelected ? <div className={styles.statusCircle} /> : null
                ) : (
                  <img className={styles.cloudIcon} src={cloudicon} alt="Reading lesson" />
                );

                return (
                  <button
                    key={submodule.id}
                    type="button"
                    className={rowClass}
                    onClick={() => openSubmodule(module, submodule, submodules.indexOf(submodule))}
                  >
                    <img
                      className={submodule.isAssessment ? styles.lessonIconLock : submodule.hasVideo ? styles.lessonIconPlay : styles.notesIcon}
                      src={icon}
                      alt=""
                    />
                    <div className={styles.lessonBody}>
                      <b className={lessonNameClass}>{submodule.title}</b>
                      <div className={styles.lessonMeta}>
                        {submodule.isAssessment
                          ? 'Assessment'
                          : submodule.hasVideo
                          ? 'Video lesson'
                          : 'Reading lesson'}
                      </div>
                      <div className={submodule.isAssessment ? styles.lessonMeta : submodule.hasVideo ? styles.downloadBad : styles.completedOk}>
                        {submodule.isAssessment ? 'Open assessment' : availabilityLabel}
                      </div>
                    </div>
                    {trailing}
                  </button>
                );
              })}
            </section>
          );
        })}

        {!pageLoading && modules.length === 0 ? (
          <section className={styles.moduleCollapsed}>
            <div className={styles.moduleNumberMuted}>0</div>
            <b className={styles.moduleMutedText}>No modules available</b>
            <span className={styles.chevronMuted}>-</span>
          </section>
        ) : null}

        <div className={styles.footerAction}>
          <button
            type="button"
            className={styles.nextButton}
            onClick={() => {
              const firstSubmodule = currentModuleSubmodules[0];
              const currentModule = modules.find((item) => getEntityId(item) === openModuleId);
              if (firstSubmodule && currentModule) {
                openSubmodule(currentModule, firstSubmodule, 0);
              }
            }}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default HumanAnatomyLessonPage;
