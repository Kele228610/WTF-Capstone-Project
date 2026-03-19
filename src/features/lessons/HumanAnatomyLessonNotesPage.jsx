import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './HumanAnatomyLessonNotesPage.module.css';
import Notificationbell from '../../assets/icons/Notificationbell.png';
import AsideSidebarDrawerNavigation from '../../components/layout/AsideSidebarDrawerNavigation';
import NotesIcon from '../../assets/icons/NotesIcon.svg';
import KnowledgeIcon from '../../assets/icons/KnowledgeIcon.svg';
import Downloadicon from '../../assets/icons/Downloadicon.png';
import { getSubmoduleById, getSubmoduleQuiz } from '../../api/lessons';
import { readLessonContext, saveLessonContext } from './lessonContext';

function extractPayload(data) {
  return data?.data || data;
}

function normalizeNoteLines(contentText) {
  if (!contentText) return [];
  return String(contentText)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
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
    title: payload?.title || payload?.contentTitle || payload?.submoduleTitle || 'Lesson',
    contentText: payload?.contentText || payload?.content || payload?.notes || '',
  };
}

function answersMatch(selectedAnswer, correctAnswer) {
  return String(selectedAnswer || '').trim().toLowerCase() === String(correctAnswer || '').trim().toLowerCase();
}

export default function HumanAnatomyLessonNotesPage() {
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
  const [submodule, setSubmodule] = useState({
    title: pageContext.submoduleTitle || 'Introduction to Anatomical Terms',
    contentText: '',
  });
  const [quiz, setQuiz] = useState({
    question: '',
    options: [],
    correctAnswer: '',
  });

  useEffect(() => {
    let cancelled = false;

    async function loadSubmoduleContent() {
      if (!pageContext.submoduleId) {
        setError('No submodule was selected.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

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
          submoduleHasVideo: false,
        });
      } catch (loadError) {
        if (cancelled) return;
        setError(loadError?.message || 'Unable to load lesson notes.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSubmoduleContent();

    return () => {
      cancelled = true;
    };
  }, [pageContext.submoduleId]);

  const noteLines = normalizeNoteLines(submodule.contentText);
  const isCorrect = quizSubmitted && answersMatch(selectedAnswer, quiz.correctAnswer);

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

  const handleMarkCompleted = () => {
    if (!quizSubmitted || !answersMatch(selectedAnswer, quiz.correctAnswer)) {
      setCompletionMessage('You need the correct answer before marking this lesson as completed.');
      return;
    }

    navigate('/lesson/human-anatomy');
  };

  const handleNext = () => {
    const nextContext = {
      ...pageContext,
      submoduleId: pageContext.nextSubmoduleId,
      submoduleTitle: pageContext.nextSubmoduleTitle,
      submoduleHasVideo: pageContext.nextSubmoduleHasVideo,
      submoduleIsAssessment: pageContext.nextSubmoduleIsAssessment,
    };

    saveLessonContext(nextContext);

    if (pageContext.nextSubmoduleIsAssessment) {
      navigate('/assessment/module-1', { state: nextContext });
      return;
    }

    if (pageContext.nextSubmoduleHasVideo) {
      navigate('/lesson/human-anatomy/body-planes-cavities', { state: nextContext });
      return;
    }

    navigate('/lesson/human-anatomy', { state: nextContext });
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
          aria-label="Back to lesson"
          onClick={() => navigate('/lesson/human-anatomy')}
        >
          &#8592;
        </button>

        <div className={styles.lessonHeadingRow}>
          <span className={styles.lessonHeadingBar} />
          <h1 className={styles.lessonHeading}>{submodule.title}</h1>
        </div>

        <section className={styles.notesSection}>
          <div className={styles.sectionHeader}>
            <img className={styles.sectionIcon} src={NotesIcon} alt="Lesson notes icon" />
            <h2 className={styles.sectionTitle}>Lesson Notes</h2>
          </div>

          <div className={styles.noteCard}>
            {loading ? <p className={styles.noteLine}>Loading lesson notes...</p> : null}
            {!loading && error ? <p className={styles.feedbackError}>{error}</p> : null}
            {!loading && !error && noteLines.length === 0 ? (
              <p className={styles.noteLine}>No notes were returned for this submodule.</p>
            ) : null}
            {!loading && !error
              ? noteLines.map((line, index) => (
                  <p key={`${line}-${index}`} className={styles.noteLine}>
                    {line}
                  </p>
                ))
              : null}
          </div>

          <button type="button" className={styles.downloadLink}>
            <span className={styles.downloadIcon}>
              <img src={Downloadicon} alt="Download icon" />
            </span>
            Download
          </button>
        </section>

        <section className={styles.quizCard}>
          <div className={styles.sectionHeader}>
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
          <button type="button" className={styles.outlineButton} onClick={handleMarkCompleted}>
            Mark as completed
          </button>
          <button type="button" className={styles.primaryButton} onClick={handleNext}>
            Next
          </button>
        </div>
      </main>
    </div>
  );
}
