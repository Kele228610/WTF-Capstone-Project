import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ReturningUserHomePage.module.css';
import AsideSidebarDrawerNavigation from '../../components/layout/AsideSidebarDrawerNavigation';
import Hamburger from '../../assets/icons/Hamburger.png';
import Notificationbell from '../../assets/icons/Notificationbell.png';
import ClockIcon from '../../assets/icons/ClockIcon.png';
import Clouddownload from '../../assets/icons/Clouddownload.png';
import Badgecup from '../../assets/icons/Badgecup.png';
import Aistars from '../../assets/icons/Aistars.png';
import Bluequestion from '../../assets/icons/Bluequestion.png';
import Notebook from '../../assets/icons/Notebook.png';
import { sendAiChat } from '../../api/ai';
import { getProfile } from '../../api/profile';
import { getCompletedSubmodules, getModuleProgress, startLessonSession } from '../../api/lessons';

function getCurrentTime() {
  const now = new Date();

  return now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

const assistantChips = [
  'Explain simply',
  'Give a real-life example',
  'Summarize this',
];

function getFirstName(profile) {
  const fullName = profile?.fullName || profile?.name || '';
  return fullName.trim().split(/\s+/)[0] || 'Student';
}

function extractPayload(data) {
  return data?.data || data || {};
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

function extractCompletedSubmodulesCount(payload) {
  if (Array.isArray(payload)) return payload.length;
  if (Array.isArray(payload?.completedSubmodules)) return payload.completedSubmodules.length;
  if (Array.isArray(payload?.submodules)) return payload.submodules.length;

  const count =
    payload?.count ??
    payload?.completedCount ??
    payload?.completedSubmodulesCount ??
    payload?.totalCompleted ??
    0;

  const numericCount = Number(count);
  return Number.isFinite(numericCount) ? numericCount : 0;
}

const ReturningUserHomePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantInput, setAssistantInput] = useState('');
  const [assistantMessages, setAssistantMessages] = useState([]);
  const [assistantSending, setAssistantSending] = useState(false);
  const [assistantError, setAssistantError] = useState('');
  const [profile, setProfile] = useState(null);
  const [moduleProgress, setModuleProgress] = useState(0);
  const [completedLessonsCount, setCompletedLessonsCount] = useState(0);
  const navigate = useNavigate();

  const handleOpenSidebar = () => setIsSidebarOpen(true);
  const handleCloseSidebar = () => setIsSidebarOpen(false);
  const handleOpenAssistant = () => setIsAssistantOpen(true);
  const handleCloseAssistant = () => setIsAssistantOpen(false);

  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    if (!isAssistantOpen) return;

    const updateTime = () => setCurrentTime(getCurrentTime());

    updateTime();

    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, [isAssistantOpen]);


  useEffect(() => {
    if (!isAssistantOpen) return undefined;

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isAssistantOpen]);

  useEffect(() => {
    let cancelled = false;

    async function loadProfileAndProgress() {
      try {
        const [profileData, sessionData] = await Promise.all([
          getProfile(),
          startLessonSession(),
        ]);
        const sessionPayload = extractPayload(sessionData);
        const moduleId = extractModuleId(sessionPayload);

        let progressValue = 0;
        let completedCount = 0;
        if (moduleId) {
          const [progressData, completedSubmodulesData] = await Promise.all([
            getModuleProgress(moduleId),
            getCompletedSubmodules(moduleId),
          ]);
          progressValue = extractProgressValue(extractPayload(progressData));
          completedCount = extractCompletedSubmodulesCount(extractPayload(completedSubmodulesData));
        }

        if (cancelled) return;
        setProfile(extractPayload(profileData));
        setModuleProgress(progressValue);
        setCompletedLessonsCount(completedCount);
      } catch {
        if (!cancelled) {
          setProfile(null);
          setModuleProgress(0);
          setCompletedLessonsCount(0);
        }
      }
    }

    loadProfileAndProgress();

    return () => {
      cancelled = true;
    };
  }, []);

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

  const firstName = getFirstName(profile);
  const moduleProgressLabel = `${moduleProgress}%`;

  return (
    <div className={styles['returning-user-homepage']}>
      <AsideSidebarDrawerNavigation isOpen={isSidebarOpen} onClose={handleCloseSidebar} />

      <div className={styles.header}>
        <div className={styles.container}>
          <button
            type="button"
            className={styles.button}
            onClick={handleOpenSidebar}
            aria-label="Open sidebar navigation"
          >
            <div className={styles.container2}>
              <img className={styles.hamburgerIcon} src={Hamburger} alt="Hamburger" />
            </div>
          </button>

          <div className={styles['heading-1']}>
            <b className={styles.edulearn}>EduLearn</b>
          </div>
        </div>

        <div className={styles.button2}>
          <div className={styles.container3}>
            <img className={styles.notificationbellIcon} src={Notificationbell} alt="Notification Bell" />
          </div>
          <div className={styles.backgroundborder} />
        </div>
      </div>

      <div className={styles['welcome-section']}>
        <div className={styles['heading-12']}>
          <b className={styles['welcome-back-winnie']}>Welcome back, {firstName}!</b>
        </div>
        <div className={styles.container4}>
          <div className={styles.edulearn}>Ready to continue your learning journey?</div>
        </div>
      </div>

      <div className={styles['section-ai-recommendation-ca']}>
        <div className={styles.container5}>
          <div className={styles.text3}>psychology</div>
        </div>

        <div className={styles.container6}>
          <div className={styles.overlay}>
            <div className={styles['ai-recommended']}>AI RECOMMENDED</div>
          </div>

          <div className={styles['heading-2']}>
            <b className={styles['welcome-back-winnie']}>Human Anatomy</b>
          </div>

          <div className={styles.container7}>
            <div className={styles.edulearn}>Body Planes and Cavities</div>
          </div>

          <div className={styles.container8}>
            <div className={styles.overlay2}>
              <div className={styles.background} style={{ width: moduleProgressLabel }} />
            </div>

            <div className={styles.container9}>
              <div className={styles.div}>{moduleProgressLabel}</div>
            </div>
          </div>

          <button
            type="button"
            className={styles.button3}
            onClick={() => navigate('/curriculum', { state: { entryFlow: 'returning' } })}
            aria-label="Go to curriculum"
          >
            <div className={styles.buttonshadow} />
            <b className={styles['resume-lesson']}>Resume Lesson</b>
          </button>
        </div>
      </div>

      <div className={styles['section-daily-quiz-card']}>
        <div className={styles.container10}>
          <div className={styles.container9}>
            <b className={styles['welcome-back-winnie']}>Your Progress</b>
          </div>
          <div className={styles.link} />
        </div>
      </div>

      <div className={styles['frame-parent']}>
        <div className={styles['backgroundbordershadow-parent']}>
          <div className={styles.backgroundbordershadow}>
            <div className={styles.container11}>
              <b className={styles['welcome-back-winnie']}>{completedLessonsCount}</b>
            </div>

            <div className={styles.container12}>
              <div className={styles.container13} />
            </div>

            <div className={styles.paragraph}>
              <div className={styles['of-monthly-goal']}>75% of monthly goal</div>
            </div>

            <div className={styles.paragraph2} />

            <div className={styles.text4}>
              <b className={styles['lessons-completed']}>Lessons Completed</b>
            </div>
          </div>

          <div className={styles.backgroundbordershadow2}>
            <div className={styles.container14}>
              <div className={styles.text5}>
                <img className={styles.scheduleIcon} src={ClockIcon} alt="Schedule" />
              </div>
              <div className={styles.text6}>
                <b className={styles['time-spent']}>Time Spent</b>
              </div>
            </div>

            <div className={styles.container15}>
              <b className={styles['welcome-back-winnie']}>12.5 hrs</b>
            </div>

            <div className={styles.paragraph3}>
              <div className={styles['of-monthly-goal']}>This week</div>
            </div>
          </div>
        </div>

        <div className={styles['section-storage-achievemen']}>
          <div className={styles.backgroundbordershadow3}>
            <div className={styles.container16}>
              <div className={styles.container9}>
                <img className={styles.clouddownloadIcon} src={Clouddownload} alt="Cloud Download" />
              </div>
              <div className={styles.container18}>
                <b className={styles.schedule}>Storage</b>
              </div>
            </div>

            <div className={styles.container19}>
              <b className={styles['welcome-back-winnie']}>1.2 GB</b>
            </div>

            <div className={styles.overlay3}>
              <div className={styles.background2} />
            </div>

            <div className={styles.container20}>
              <div className={styles['of-5gb-used']}>24% of 5GB used</div>
            </div>
          </div>

          <div className={styles.backgroundbordershadow4}>
            <div className={styles.container21}>
              <div className={styles.container9}>
                <img className={styles.Badgecup} src={Badgecup} alt="Badge cup" />
              </div>
              <div className={styles.container18}>
                <b className={styles.schedule}>Badges</b>
              </div>
            </div>

            <div className={styles.container24}>
              <b className={styles['welcome-back-winnie']}>12 Earned</b>
            </div>

            <div className={styles.container25}>
              <div className={styles.backgroundborder2}>
                <div className={styles.container9}>
                  <div className={styles.text8}>bolt</div>
                </div>
              </div>

              <div className={styles.margin}>
                <div className={styles.backgroundborder3}>
                  <div className={styles.container9}>
                    <div className={styles.text8}>star</div>
                  </div>
                </div>
              </div>

              <div className={styles.margin}>
                <div className={styles.backgroundborder4}>
                  <div className={styles.container9}>
                    <div className={styles.text8}>verified</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles['suggested-for-you']}>
        <div className={styles['heading-12']}>
          <b className={styles['recommended-lessons']}>Recommended Lessons</b>
        </div>

        <div className={styles.container29}>
          <div className={styles['lesson-1']}>
            <img className={styles.Bluequestion} alt="" src={Bluequestion} />
            <div className={styles.container30}>
              <div className={styles['heading-4']}>
                <b className={styles.schedule}>Intro to Genetics</b>
              </div>
              <div className={styles.container31}>
                <div className={styles.background3}>
                  <div className={styles.lesson}>LESSON</div>
                </div>
                <div className={styles.container32}>
                  <div className={styles.edulearn}>15m</div>
                </div>
              </div>
            </div>
            <div className={styles.button4}>
              <b className={styles.start}>Start</b>
            </div>
          </div>

          <div className={styles['lesson-1']}>
            <img className={styles.Notebook} alt="" src={Notebook} />
            <div className={styles.container30}>
              <div className={styles['heading-4']}>
                <b className={styles.schedule}>Derivatives</b>
              </div>
              <div className={styles.container31}>
                <div className={styles.background3}>
                  <div className={styles.lesson}>LESSON</div>
                </div>
                <div className={styles.container32}>
                  <div className={styles.edulearn}>12m</div>
                </div>
              </div>
            </div>
            <div className={styles.button4}>
              <b className={styles.start}>Start</b>
            </div>
          </div>

          <div className={styles['lesson-1']}>
            <img className={styles.Notebook} alt="" src={Notebook} />
            <div className={styles.container30}>
              <div className={styles['heading-4']}>
                <b className={styles.schedule}>Linear Inequalities</b>
              </div>
              <div className={styles.container31}>
                <div className={styles.background3}>
                  <div className={styles.lesson}>LESSON</div>
                </div>
                <div className={styles.container32}>
                  <div className={styles.edulearn}>20m</div>
                </div>
              </div>
            </div>
            <div className={styles.button4}>
              <b className={styles.start}>Start</b>
            </div>
          </div>

          <div className={styles['lesson-1']}>
            <img className={styles.Notebook} alt="" src={Notebook} />
            <div className={styles.container30}>
              <div className={styles['heading-4']}>
                <b className={styles.schedule}>The Periodic Table</b>
              </div>
              <div className={styles.container31}>
                <div className={styles.background3}>
                  <div className={styles.lesson}>LESSON</div>
                </div>
                <div className={styles.container32}>
                  <div className={styles.edulearn}>25m</div>
                </div>
              </div>
            </div>
            <div className={styles.button4}>
              <b className={styles.start}>Start</b>
            </div>
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
        <div className={styles.container42}>
          <img className={styles.aistarsIcon} src={Aistars} alt="AI Stars" />
        </div>
      </button>

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
                ×
              </button>
            </header>

            <section className={styles.assistantMessages}>
              <p className={styles.assistantTime}>Today, {currentTime}</p>
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
                <button type="button" className={styles.iconButton} aria-label="Attach file">
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
                <button type="button" className={styles.iconButton} aria-label="Voice input">
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

export default ReturningUserHomePage;
