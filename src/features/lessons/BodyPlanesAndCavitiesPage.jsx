import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './BodyPlanesAndCavitiesPage.module.css';
import Notificationbell from '../../assets/icons/Notificationbell.png';
import AsideSidebarDrawerNavigation from '../../components/layout/AsideSidebarDrawerNavigation';
import Lessonthumbnail from '../../assets/images/Lessonthumbnail.jpg';
import NotesIcon from '../../assets/icons/NotesIcon.svg';
import KnowledgeIcon from '../../assets/icons/KnowledgeIcon.svg';
import Downloadicon from '../../assets/icons/Downloadicon.png';
import {
  downloadSubmoduleProgress,
  getSubmoduleById,
  getSubmoduleQuiz,
  markSubmoduleComplete,
} from '../../api/lessons';
import { getProfile } from '../../api/profile';
import { readLessonContext, saveLessonContext } from './lessonContext';
import { getDownloadedSubmodule, saveDownloadedSubmodule } from './offlineLessonStorage';
import { readLessonUiState, saveLessonUiState } from './lessonUiState';

function extractPayload(data) {
  return data?.data || data;
}

function normalizeOption(option) {
  if (typeof option === 'string') {
    return { id: option, label: option, value: option };
  }

  const label = option?.label || option?.text || option?.optionText || option?.value || option?.name || '';
  const value = option?.value || label;
  const id = option?.id || option?._id || value || label;
  return { id, label, value };
}

function normalizeQuiz(data) {
  const payload = extractPayload(data);
  const quiz = payload?.quiz || payload;
  const rawOptions = quiz?.options || quiz?.choices || quiz?.answers || [];
  const options = Array.isArray(rawOptions) ? rawOptions.map(normalizeOption) : [];
  const correctAnswer =
    quiz?.correctAnswer ||
    quiz?.answer ||
    quiz?.correctOption ||
    quiz?.correct_option ||
    quiz?.correctAnswerText ||
    '';

  return {
    question: quiz?.question || quiz?.prompt || quiz?.text || 'Knowledge check unavailable.',
    options,
    correctAnswer: typeof correctAnswer === 'object' ? normalizeOption(correctAnswer).value : correctAnswer,
  };
}

function normalizeSubmodule(data) {
  const payload = extractPayload(data);
  return {
    id: payload?.id || payload?._id || payload?.submoduleId || null,
    title: payload?.title || payload?.contentTitle || payload?.submoduleTitle || 'Video Lesson',
    contentText: payload?.contentText || payload?.content || payload?.notes || '',
    contentUrl: payload?.contentUrl || payload?.videoUrl || payload?.url || '',
  };
}

function answersMatch(selectedAnswer, correctAnswer) {
  return String(selectedAnswer || '').trim().toLowerCase() === String(correctAnswer || '').trim().toLowerCase();
}

export default function BodyPlanesAndCavitiesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const storedContext = readLessonContext();
  const pageContext = location.state || storedContext || {};
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [completionMessage, setCompletionMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadState, setDownloadState] = useState('');
  const [isOfflineContent, setIsOfflineContent] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [userId, setUserId] = useState('anonymous');
  const [submodule, setSubmodule] = useState({
    title: pageContext.submoduleTitle || 'Body Planes and Cavities',
    contentText: '',
    contentUrl: '',
  });
  const [quiz, setQuiz] = useState({
    question: '',
    options: [],
    correctAnswer: '',
  });

  useEffect(() => {
    let cancelled = false;

    async function loadProfileIdentity() {
      try {
        const data = await getProfile();
        if (cancelled) return;
        const payload = extractPayload(data);
        setUserId(payload?.id || payload?._id || payload?.userId || payload?.studentId || 'anonymous');
      } catch {
        if (!cancelled) {
          setUserId('anonymous');
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

    async function loadVideoLesson() {
      if (!pageContext.submoduleId) {
        setError('No submodule was selected.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        setIsOfflineContent(false);

        const [submoduleData, quizData] = await Promise.all([
          getSubmoduleById(pageContext.submoduleId),
          getSubmoduleQuiz(pageContext.submoduleId),
        ]);

        if (cancelled) return;

        const submodulePayload = normalizeSubmodule(submoduleData);
        const quizPayload = normalizeQuiz(quizData);

        setSubmodule(submodulePayload);
        setQuiz(quizPayload);
        saveLessonContext({
          ...pageContext,
          submoduleId: submodulePayload.id,
          submoduleTitle: submodulePayload.title,
          submoduleHasVideo: true,
        });
      } catch (loadError) {
        if (cancelled) return;
        try {
          const cached = await getDownloadedSubmodule(pageContext.submoduleId);
          if (cancelled) return;

          if (cached?.submodule) {
            setSubmodule(cached.submodule);
            setQuiz(cached.quiz || { question: '', options: [], correctAnswer: '' });
            setIsOfflineContent(true);
            setDownloadState('Showing your downloaded video lesson offline.');
            setError('');
          } else {
            setError(loadError?.message || 'Unable to load video lesson.');
          }
        } catch {
          if (cancelled) return;
          setError(loadError?.message || 'Unable to load video lesson.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadVideoLesson();

    return () => {
      cancelled = true;
    };
  }, [pageContext.submoduleId]);

  useEffect(() => {
    const submoduleId = submodule.id || pageContext.submoduleId;
    if (!submoduleId) return;

    const savedState = readLessonUiState(userId, submoduleId);
    if (!savedState) return;

    setSelectedAnswer(savedState.selectedAnswer || null);
    setQuizSubmitted(Boolean(savedState.quizSubmitted));
    setIsCompleted(Boolean(savedState.isCompleted));
    if (savedState.completionMessage) {
      setCompletionMessage(savedState.completionMessage);
    }
  }, [userId, submodule.id, pageContext.submoduleId]);

  const isCorrect = quizSubmitted && answersMatch(selectedAnswer, quiz.correctAnswer);

  useEffect(() => {
    const submoduleId = submodule.id || pageContext.submoduleId;
    if (!submoduleId) return;

    saveLessonUiState(userId, submoduleId, {
      selectedAnswer,
      quizSubmitted,
      isCompleted,
      completionMessage,
    });
  }, [userId, submodule.id, pageContext.submoduleId, selectedAnswer, quizSubmitted, isCompleted, completionMessage]);

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) {
      setQuizSubmitted(false);
      setCompletionMessage('Select an answer before submitting.');
      return;
    }

    setQuizSubmitted(true);
    setCompletionMessage(
      answersMatch(selectedAnswer, quiz.correctAnswer)
        ? 'Correct answer. You can now mark this lesson as completed.'
        : 'Incorrect answer. You need the correct answer before marking this lesson as completed.'
    );
  };

  const handleMarkCompleted = async () => {
    if (!quizSubmitted || !answersMatch(selectedAnswer, quiz.correctAnswer)) {
      setCompletionMessage('You need the correct answer before marking this lesson as completed.');
      return;
    }

    const submoduleId = submodule.id || pageContext.submoduleId;
    if (!submoduleId) {
      setCompletionMessage('No submodule was selected to mark as completed.');
      return;
    }

    try {
      setMarkingComplete(true);
      await markSubmoduleComplete(submoduleId);
      setCompletionMessage('Lesson marked as completed successfully.');
      setIsCompleted(true);
    } catch (completeError) {
      setCompletionMessage(completeError?.message || 'Unable to mark this lesson as completed right now.');
    } finally {
      setMarkingComplete(false);
    }
  };

  const handleNext = () => {
    const assessmentContext = {
      ...pageContext,
      submoduleId: pageContext.assessmentSubmoduleId,
      submoduleTitle: pageContext.assessmentTitle,
      submoduleIsAssessment: true,
    };

    saveLessonContext(assessmentContext);
    navigate('/assessment/module-1', { state: assessmentContext });
  };

  const handleDownload = async () => {
    if (!pageContext.submoduleId || downloading) return;

    try {
      setDownloading(true);
      setDownloadState('');

      const downloadPayload = await downloadSubmoduleProgress(pageContext.submoduleId);

      await saveDownloadedSubmodule({
        submoduleId: pageContext.submoduleId,
        cachedAt: Date.now(),
        downloadPayload,
        submodule,
        quiz,
        context: {
          lessonId: pageContext.lessonId || null,
          moduleId: pageContext.moduleId || null,
          submoduleTitle: submodule.title,
        },
      });

      setDownloadState('Video lesson downloaded. This submodule is now available offline.');
    } catch (downloadError) {
      setDownloadState(downloadError?.message || 'Unable to download this lesson right now.');
    } finally {
      setDownloading(false);
    }
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
          aria-label="Back to notes"
          onClick={() => navigate('/lesson/human-anatomy')}
        >
          &#8592;
        </button>

        <div className={styles.lessonHeadingRow}>
          <span className={styles.lessonHeadingBar} />
          <h1 className={styles.lessonHeading}>{submodule.title}</h1>
        </div>

        <section className={styles.videoCard}>
          {submodule.contentUrl ? (
            <video className={styles.videoImage} controls poster={Lessonthumbnail}>
              <source src={submodule.contentUrl} />
              Your browser does not support the video tag.
            </video>
          ) : (
            <>
              <img className={styles.videoImage} src={Lessonthumbnail} alt={submodule.title} />
              <div className={styles.playOverlay}>&#9654;</div>
            </>
          )}
        </section>

        <section className={styles.notesSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionHeadLeft}>
              <img className={styles.sectionIcon} src={NotesIcon} alt="Lesson notes icon" />
              <h2 className={styles.sectionTitle}>Lesson Notes</h2>
            </div>
            <button type="button" className={styles.downloadLink} onClick={handleDownload} disabled={downloading}>
              <img className={styles.downloadIcon} src={Downloadicon} alt="Download icon" />
              <span>{downloading ? 'Downloading...' : 'Download All'}</span>
            </button>
          </div>
          {downloadState ? (
            <p className={isOfflineContent ? styles.feedbackSuccess : styles.feedbackInfo}>{downloadState}</p>
          ) : null}

          <div className={styles.noteCard}>
            {loading ? 'Loading lesson content...' : error || submodule.contentText || 'No lesson notes were returned.'}
          </div>
        </section>

        <section className={styles.quizCard}>
          <div className={styles.sectionHeadLeft}>
            <img className={styles.sectionIcon} src={KnowledgeIcon} alt="Knowledge check icon" />
            <h2 className={styles.sectionTitle}>Knowledge Check</h2>
          </div>

          <p className={styles.question}>{quiz.question || 'Knowledge check unavailable.'}</p>

          <div className={styles.answersList}>
            {quiz.options.map((answer) => {
              const isSelected = selectedAnswer === answer.value;

              return (
                <button
                  key={answer.id}
                  type="button"
                  className={isSelected ? styles.optionActive : styles.option}
                  onClick={() => setSelectedAnswer(answer.value)}
                  aria-pressed={isSelected}
                >
                  <span className={isSelected ? styles.radioActive : styles.radio} />
                  <span className={styles.optionLabel}>{answer.label}</span>
                </button>
              );
            })}
          </div>

          <button type="button" className={styles.submitButton} onClick={handleSubmitAnswer}>
            Submit Answer
          </button>
          {completionMessage ? (
            <p className={isCorrect ? styles.feedbackSuccess : styles.feedbackError}>{completionMessage}</p>
          ) : null}
        </section>

        <div className={styles.bottomActions}>
          <button
            type="button"
            className={styles.outlineButton}
            onClick={handleMarkCompleted}
            disabled={markingComplete || isCompleted}
          >
            {markingComplete ? 'Marking...' : isCompleted ? 'Completed' : 'Mark as completed'}
          </button>
          <button type="button" className={styles.primaryButton} onClick={handleNext}>
            Take Quiz
          </button>
        </div>
      </main>
    </div>
  );
}
