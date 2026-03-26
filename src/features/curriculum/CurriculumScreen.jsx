import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './CurriculumScreen.module.css';
import { useNavigate } from 'react-router-dom';
import AsideSidebarDrawerNavigation from '../../components/layout/AsideSidebarDrawerNavigation';
import Hamburger from '../../assets/icons/Hamburger.png';
import Notificationbell from '../../assets/icons/Notificationbell.png';
import Aistars from '../../assets/icons/Aistars.png';
import Humananatomy from '../../assets/images/Human-anatomy-background.png';
import Calculus from '../../assets/images/Calculus-image.png';
import Additionicon from '../../assets/icons/Additionicon.png';
import { getProfile } from '../../api/profile';
import { sendAiChat } from '../../api/ai';
import { getLessonById, getModuleProgress, startLessonSession } from '../../api/lessons';

const assistantChips = [
  'Explain simply',
  'Give a real-life example',
  'Summarize this',
];

function extractPayload(data) {
  return data?.data || data || {};
}

function extractLessonId(payload) {
  return payload?.lessonId || payload?.lesson?.id || payload?.lesson?._id || null;
}

function extractModuleId(payload) {
  return payload?.moduleId || payload?.module?.id || payload?.module?._id || payload?.currentModuleId || null;
}

function extractProgressValue(payload) {
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


const CurriculumScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [primaryLesson, setPrimaryLesson] = useState(null);
  const [primaryLessonProgress, setPrimaryLessonProgress] = useState(0);
  const [primaryLessonContext, setPrimaryLessonContext] = useState(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantInput, setAssistantInput] = useState('');
  const [assistantMessages, setAssistantMessages] = useState([]);
  const [assistantSending, setAssistantSending] = useState(false);
  const [assistantError, setAssistantError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadCurriculumData() {
      try {
        const [profileData, sessionData] = await Promise.all([
          getProfile(),
          startLessonSession(),
        ]);

        const profilePayload = extractPayload(profileData);
        const sessionPayload = extractPayload(sessionData);
        const lessonId = extractLessonId(sessionPayload);
        const moduleId = extractModuleId(sessionPayload);

        if (cancelled) return;

        setProfile(profilePayload);
        setPrimaryLessonContext({
          lessonId,
          moduleId,
          session: sessionPayload,
        });

        if (!lessonId || !moduleId) return;

        const [lessonData, progressData] = await Promise.all([
          getLessonById(lessonId),
          getModuleProgress(moduleId),
        ]);

        if (cancelled) return;

        setPrimaryLesson(extractPayload(lessonData));
        setPrimaryLessonProgress(extractProgressValue(extractPayload(progressData)));
      } catch {
        if (!cancelled) {
          setProfile(null);
          setPrimaryLesson(null);
          setPrimaryLessonProgress(0);
          setPrimaryLessonContext(null);
        }
      }
    }

    loadCurriculumData();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isAssistantOpen) return undefined;

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isAssistantOpen]);

  const mySubjects = useMemo(() => {
    if (Array.isArray(profile?.courseNames) && profile.courseNames.length > 0) {
      return profile.courseNames;
    }
    if (Array.isArray(profile?.courses) && profile.courses.length > 0) {
      return profile.courses.map((course) =>
        typeof course === 'string' ? course : course?.title || course?.name || ''
      ).filter(Boolean);
    }
    return ['Math', 'Science', 'English', 'ICT'];
  }, [profile]);

  const primaryLessonTitle = primaryLesson?.title || 'Human Anatomy';
  //  console.log(primaryLesson.description);
  const primaryLessonDescription = primaryLesson?.description || 'Introduction to the Human Body Systems';
  const primaryLessonProgressLabel = `${primaryLessonProgress}%`;
  const primaryLessonCtaLabel = location.state?.entryFlow === 'new' ? 'Start' : 'Continue';

  const handleOpenAssistant = () => setIsAssistantOpen(true);
  const handleCloseAssistant = () => setIsAssistantOpen(false);

  const handleAssistantChip = (text) => {
    setAssistantInput(text);
  };

  const handleAssistantSubmit = async (event) => {
    event?.preventDefault?.();

    const question = assistantInput.trim();
    if (!question || assistantSending) return;

    setAssistantMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        role: 'user',
        text: question,
      },
    ]);
    setAssistantInput('');
    setAssistantError('');
    setAssistantSending(true);

    try {
      const data = await sendAiChat(question);
      setAssistantMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          text: data.answer || 'No response was returned from the assistant.',
        },
      ]);
    } catch (error) {
      const message = error?.message || 'Unable to send message right now.';
      setAssistantError(message);
      setAssistantMessages((prev) => [
        ...prev,
        {
          id: `assistant-error-${Date.now()}`,
          role: 'assistant',
          text: message,
        },
      ]);
    } finally {
      setAssistantSending(false);
    }
  };

  const handleAssistantKeyDown = (event) => {
    if (event.key !== 'Enter' || event.shiftKey) return;
    event.preventDefault();
    handleAssistantSubmit();
  };

  const handleContinuePrimaryLesson = () => {
    navigate('/lesson/human-anatomy', {
      state: primaryLessonContext || undefined,
    });
  };

  return (
    <div className={styles['curriculum-screen']}>
      <AsideSidebarDrawerNavigation isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className={styles['header-search']}>
        <div className={styles['container']}>
          <div className={styles['container2']}>
            <div className={styles['heading-1']}>
              <b className={styles['subjects']}>Subjects</b>
            </div>
          </div>
        </div>

      </div>
      <div className={styles['header']}>
        <div className={styles['container6']}>
          <button
            type="button"
            className={styles['button']}
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open sidebar navigation"
          >
            <div className={styles['container7']}>
              <img className={styles['hamburger-icon']} src={Hamburger} alt="Menu" />
            </div>
          </button>
          <div className={styles['heading-12']}>
            <b className={styles['subjects']}>EduLearn</b>
          </div>
        </div>
        <div className={styles['button2']}>
          <div className={styles['container8']}>
            <img className={styles['notification-bell-icon']} src={Notificationbell} alt="Notifications" />
          </div>
          <div className={styles['backgroundborder']} />
        </div>
      </div>

      <div className={styles['my-courses-section']} />
      <div className={styles['main']}>
        <div className={styles['section-1-my-courses']}>
          <div className={styles['container9']}>
            <div clasName={styles['container2']}>
              <div className={styles['my-courses']}>My Lesson</div>
            </div>
            <div className={styles['button3']}>
              <div className={styles['my-courses']}>See All</div>
            </div>
          </div>
          <div className={styles['container10']}>
            <div className={styles['biology-card']}>
              <img className={styles['background-icon']} src={Humananatomy} alt="Human Anatomy" />
              <div className={styles['container11']}>
                <div className={styles['container12']}>
                  <div className={styles['heading-1']}>
                    <b className={styles['human-anatomy']}>{primaryLessonTitle}</b>
                  </div>
                  <div className={styles['container13']}>
                    <div className={styles['subjects']}>{primaryLessonDescription}</div>
                  </div>
                </div>
                <div className={styles['container14']}>
                  <div className={styles['container15']}>
                    <div className={styles['heading-1']}>
                      <div className={styles['lessons-available-offline-container']}>
                        <span className={styles['lessons']}>{`1/2 Lessons    `}</span>
                        <span className={styles['available-offline']}>Available Offline</span>
                      </div>
                    </div>
                    <div className={styles['container17']}>
                      <div className={styles['subjects']}>{primaryLessonProgressLabel}</div>
                    </div>
                  </div>
                  <div className={styles['background']}>
                    <div className={styles['background2']} style={{ width: primaryLessonProgressLabel }} />
                  </div>
                </div>
                <button
                  type="button"
                  className={styles['button4']}
                  onClick={handleContinuePrimaryLesson}
                >
                  <div className={styles['container7']}>
                    <b className={styles['subjects']}>{primaryLessonCtaLabel}</b>
                  </div>
                  <div className={styles['container19']} />
                </button>
              </div>
            </div>
            <div className={styles['biology-card']}>
              <img className={styles['image-icon']} src={Calculus} alt="Calculus" />
              <div className={styles['container11']}>
                
                <div className={styles['container12']}>
                   
                  <div className={styles['heading-1']}>
                   
                    <b className={styles['calculus-i']}>Calculus I</b>
                  </div>
                  <div className={styles['container13']}>
                    <div className={styles['mastering-derivatives-limits']}>Mastering derivatives, limits, and integral<br/>fundamentals.</div>
                  </div>
                </div>
                <div className={styles['container23']}>
                  <div className={styles['container15']}>
                    <div className={styles['heading-1']}>
                      <div className={styles['lessons-available-offline-container']}>
                        <span className={styles['lessons']}>{`1/2 Lessons   `}</span>
                        <span className={styles['available-offline']}> Available Offline</span>
                      </div>
                    </div>
                    <div className={styles['container17']}>
                      <div className={styles['div2']}>0%</div>
                    </div>
                  </div>
                  <div className={styles['background']}>
                    <div className={styles['background4']} />
                  </div>
                </div>
                <div className={styles['button5']}>
                  <div className={styles['container7']}>
                    <b className={styles['subjects']}>Start</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles['section-2-my-interests']}>
            <div className={styles['heading-1']}>
              <b className={styles['subjects']}>My Subjects</b>
            </div>
            <div className={styles['container28']}>
              {mySubjects.map((subject) => (
                <div key={subject} className={styles['overlayborder']}>
                  <div className={styles['my-courses']}>{subject}</div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles['section-3-add-new-subjects']}>
            <img className={styles['addition-icon']} src={Additionicon} alt="Add new subjects" />
            <div className={styles['container7']}>
              <b className={styles['add-new-subjects']}>Add New Subjects</b>
            </div>
            <div className={styles['container30']}>
              <div className={styles['subjects']}>Explore our catalog of 200+ courses</div>
            </div>
          </div>
        </div>
        <button
          type="button"
          className={styles['floating-ai-assistant-button']}
          onClick={handleOpenAssistant}
          aria-label="Open AI assistant"
        >
          <div className={styles['floating-ai-assistant-button2']} />
          <div className={styles['container31']}>
            <img className={styles.aistarsIcon} src={Aistars} alt="AI Stars" />
          </div>
        </button>
      </div>

      {isAssistantOpen ? (
        <div className={styles.assistantOverlay} role="dialog" aria-modal="true" aria-label="EduAI Assistant">
          <div className={styles.assistantCard}>
            <div className={styles.assistantHandle} />

            <header className={styles.assistantHeader}>
              <div className={styles.assistantHeaderLeft}>
                <div className={styles.assistantAvatar}>
                  <img className={styles.aistarsIcon} src={Aistars} alt="AI assistant avatar" />
                </div>
                <div>
                  <b className={styles.assistantTitle}>EduAI Assistant</b>
                  <div className={styles.assistantStatusRow}>
                    <span className={styles.statusDot} />
                    <span className={styles.assistantStatus}>Online</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className={styles.assistantCloseButton}
                onClick={handleCloseAssistant}
                aria-label="Close AI assistant"
              >
                x
              </button>
            </header>

            <section className={styles.assistantMessages}>
              <p className={styles.assistantTime}>Today, 10:45 AM</p>
              {assistantMessages.length === 0 ? (
                <div className={styles.assistantEmptyState}>
                  <p className={styles.assistantEmptyTitle}>Start a new conversation</p>
                  <p className={styles.assistantEmptyCopy}>
                    Ask any lesson question and your AI assistant will help right here.
                  </p>
                </div>
              ) : (
                <div className={styles.assistantThread}>
                  {assistantMessages.map((message) => (
                    <div
                      key={message.id}
                      className={
                        message.role === 'user' ? styles.userMessageRow : styles.assistantMessageRow
                      }
                    >
                      <div
                        className={
                          message.role === 'user' ? styles.userMessageBubble : styles.assistantMessageBubble
                        }
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {assistantSending ? (
                <div className={styles.assistantMessageRow}>
                  <div className={styles.assistantTypingBubble}>Thinking...</div>
                </div>
              ) : null}
            </section>

            <footer className={styles.assistantComposer}>
              <div className={styles.assistantChipRow}>
                {assistantChips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    className={styles.assistantChip}
                    onClick={() => handleAssistantChip(chip)}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <div className={styles.assistantInputRow}>
                <button type="button" className={styles.assistantIconButton} aria-label="Attach file">
                  +
                </button>
                <input
                  type="text"
                  className={styles.assistantInput}
                  placeholder="Ask EDUlearn AI anything..."
                  aria-label="Ask AI assistant"
                  value={assistantInput}
                  onChange={(event) => setAssistantInput(event.target.value)}
                  onKeyDown={handleAssistantKeyDown}
                />
                <button type="button" className={styles.assistantIconButton} aria-label="Voice input">
                  o
                </button>
                <button
                  type="button"
                  className={styles.sendButton}
                  aria-label="Send message"
                  disabled={assistantSending || !assistantInput.trim()}
                  onClick={handleAssistantSubmit}
                >
                  &gt;
                </button>
              </div>
              {assistantError ? <p className={styles.assistantError}>{assistantError}</p> : null}
            </footer>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CurriculumScreen;
