import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NewUserHomePage.module.css';
import AsideSidebarDrawerNavigation from '../../components/layout/AsideSidebarDrawerNavigation';
import Hamburger from '../../assets/icons/Hamburger.png';
import Notificationbell from '../../assets/icons/Notificationbell.png';
import Aistars from '../../assets/icons/Aistars.png';
import Bluequestion from '../../assets/icons/Bluequestion.png';
import Notebook from '../../assets/icons/Notebook.png';
import { getProfile } from '../../api/profile';
import { startLessonSession } from '../../api/lessons';
import { sendAiChat } from '../../api/ai';

function getCurrentTime() {
  const now = new Date();

  return now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

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

const assistantChips = [
  'Explain simply',
  'Give a real-life example',
  'Summarize this',
];

function getFirstName(profile) {
  const fullName = profile?.fullName || profile?.name || '';
  return fullName.trim().split(/\s+/)[0] || 'Student';
}

function getPrimaryCourse(profile) {
  if (Array.isArray(profile?.courseNames) && profile.courseNames.length > 0) {
    return profile.courseNames[0];
  }
  if (Array.isArray(profile?.courses) && profile.courses.length > 0) {
    const firstCourse = profile.courses[0];
    return typeof firstCourse === 'string' ? firstCourse : firstCourse?.title || firstCourse?.name || '';
  }
  return '';
}

function formatCourseName(courseName) {
  if (!courseName) return 'your selected course';
  return courseName
    .toString()
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

const NewUserHomePage = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [profileError, setProfileError] = useState('');
  const [startingLesson, setStartingLesson] = useState(false);
  const [lessonStartError, setLessonStartError] = useState('');
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantInput, setAssistantInput] = useState('');
  const [assistantMessages, setAssistantMessages] = useState([]);
  const [assistantSending, setAssistantSending] = useState(false);
  const [assistantError, setAssistantError] = useState('');

  const [currentTime, setCurrentTime] = useState('');

   useEffect(() => {
    if (!isAssistantOpen) return;

    const updateTime = () => setCurrentTime(getCurrentTime());

    updateTime();

    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, [isAssistantOpen]);


  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const data = await getProfile();
        if (cancelled) return;
        setProfile(data?.data || data);
      } catch (error) {
        if (cancelled) return;
        setProfileError(error?.message || 'Unable to load profile.');
      }
    }

    loadProfile();

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

  const lessonProgress = profile?.lessonProgress ?? 0;
  const dailyGoal = profile?.dailyGoal || '30mins';
  const firstName = getFirstName(profile);
  const primaryCourse = formatCourseName(getPrimaryCourse(profile));

  const handleStartLesson = async () => {
    try {
      setStartingLesson(true);
      setLessonStartError('');
      await startLessonSession();
      navigate('/curriculum');
    } catch (error) {
      setLessonStartError(error?.message || 'Unable to start lesson.');
    } finally {
      setStartingLesson(false);
    }
  };

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
        <h2 className={styles.heroTitle}>Hi {firstName}! Your study plan for {primaryCourse} is ready.</h2>
        <p className={styles.heroSubtitle}>
          Let&apos;s start with Human Anatomy and build your foundation.
        </p>
        <button type="button" className={styles.primaryCta} onClick={handleStartLesson} disabled={startingLesson}>
          {startingLesson ? 'Starting...' : 'Start Lesson'} <span aria-hidden="true">{'>'}</span>
        </button>
        {lessonStartError ? <p className={styles.heroError}>{lessonStartError}</p> : null}
      </section>

      <section className={styles.goalCard}>
        <div>
          <h3 className={styles.goalTitle}>Daily Goal</h3>
          <div className={styles.goalValue}>{lessonProgress} <span>/ {dailyGoal}</span></div>
          <p className={styles.goalHint}>{profileError || 'Keep your streak alive!'}</p>
        </div>
        <div className={styles.goalRing}>
          <span>{lessonProgress}%</span>
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
          <button
            type="button"
            className={styles.aiHeaderButton}
            aria-label="Open AI assistant"
            onClick={handleOpenAssistant}
          >
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

      {isAssistantOpen ? (
        <div className={styles.assistantOverlay} role="dialog" aria-modal="true" aria-label="EduAI Assistant">
          <div className={styles.assistantCard}>
            <div className={styles.assistantHandle} />

            <header className={styles.assistantHeader}>
              <div className={styles.assistantHeaderLeft}>
                <div className={styles.assistantAvatar}>
                  <img className={styles.assistantAvatarIcon} src={Aistars} alt="AI assistant avatar" />
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
                <button type="button" className={styles.assistantIconButton} aria-label="Attach file">
                  +
                </button>
                <input
                  type="text"
                  className={styles.assistantInput}
                  placeholder="Ask EduLearn AI anything..."
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
    </main>
  );
};

export default NewUserHomePage;
