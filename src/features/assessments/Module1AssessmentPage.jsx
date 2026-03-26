import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Module1AssessmentPage.module.css';
import Notificationbell from '../../assets/icons/Notificationbell.png';
import AsideSidebarDrawerNavigation from '../../components/layout/AsideSidebarDrawerNavigation';
import { getModuleAssessment, submitModuleAssessment } from '../../api/lessons';
import { getProfile } from '../../api/profile';
import { readLessonContext, saveLessonContext } from '../lessons/lessonContext';
import { getDownloadedAssessment } from '../lessons/offlineLessonStorage';

const ASSESSMENT_CACHE_KEY = 'module-all';

function extractPayload(data) {
  return data?.data || data;
}

function normalizeOption(option) {
  if (typeof option === 'string') {
    return { id: option, label: option, value: option };
  }

  const label = option?.label || option?.text || option?.optionText || option?.value || option?.name || '';
  const value = option?.value || label;
  const id = option?.id || option?._id || option?.optionId || value || label;
  return { id, label, value };
}

function normalizeQuestions(data) {
  const payload = extractPayload(data);
  const list = payload?.questions || payload?.quiz || payload?.items || payload;

  if (!Array.isArray(list)) return [];

  return list.map((question, index) => ({
    id: question?.id || question?._id || question?.questionId || index + 1,
    text: question?.question || question?.prompt || question?.text || `Question ${index + 1}`,
    options: Array.isArray(question?.options || question?.choices || question?.answers)
      ? (question.options || question.choices || question.answers).map(normalizeOption)
      : [],
  }));
}

const PASS_MARK = 0.7;

function extractSubmissionMetrics(data, totalQuestions) {
  const payload = extractPayload(data);
  const score =
    payload?.score ??
    payload?.correctCount ??
    payload?.correctAnswers ??
    payload?.data?.score ??
    payload?.data?.correctCount ??
    0;
  const percentage =
    payload?.percentage ??
    payload?.percent ??
    payload?.scorePercentage ??
    payload?.data?.percentage ??
    payload?.data?.percent;
  const normalizedScore = Number(score);
  const normalizedPercentage = Number(percentage);
  const finalScore = Number.isFinite(normalizedScore) ? normalizedScore : 0;
  const finalPercentage = Number.isFinite(normalizedPercentage)
    ? normalizedPercentage
    : totalQuestions > 0
    ? Math.round((finalScore / totalQuestions) * 100)
    : 0;
  const passedValue =
    payload?.passed ??
    payload?.isPassed ??
    payload?.success ??
    payload?.data?.passed ??
    payload?.data?.isPassed;
  const attemptCount =
    payload?.attemptCount ??
    payload?.attempts ??
    payload?.data?.attemptCount ??
    payload?.data?.attempts ??
    0;

  return {
    score: finalScore,
    percentage: finalPercentage,
    isPassed: typeof passedValue === 'boolean' ? passedValue : totalQuestions > 0 ? finalScore / totalQuestions >= PASS_MARK : false,
    attemptCount: Number.isFinite(Number(attemptCount)) ? Number(attemptCount) : 0,
  };
}

const Module1AssessmentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const storedContext = readLessonContext();
  const pageContext = location.state || storedContext || {};
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState(Array.isArray(location.state?.questions) ? location.state.questions : []);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(!Array.isArray(location.state?.questions));
  const [error, setError] = useState('');
  const [offlineMessage, setOfflineMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState('anonymous');

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

    async function loadAssessmentQuestions() {
      if (questions.length > 0) return;

      try {
        setLoading(true);
        setError('');
        const data = await getModuleAssessment();
        if (cancelled) return;
        setQuestions(normalizeQuestions(data));
        setOfflineMessage('');
      } catch (loadError) {
        if (cancelled) return;
        try {
          const cached = await getDownloadedAssessment(userId, pageContext.assessmentCacheKey || ASSESSMENT_CACHE_KEY);
          if (cancelled) return;

          if (Array.isArray(cached?.questions) && cached.questions.length > 0) {
            setQuestions(cached.questions);
            setOfflineMessage('Showing your downloaded assessment offline.');
            setError('');
          } else {
            setError(loadError?.message || 'Unable to load assessment questions.');
          }
        } catch {
          if (cancelled) return;
          setError(loadError?.message || 'Unable to load assessment questions.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAssessmentQuestions();

    return () => {
      cancelled = true;
    };
  }, [pageContext.assessmentCacheKey, questions.length, userId]);

  const selectOption = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmitAssessment = async () => {
    if (!pageContext.assessmentSubmoduleId) {
      setError('No assessment submodule was selected.');
      return;
    }

    const formattedAnswers = questions
      .filter((question) => answers[question.id])
      .map((question) => ({
        questionId: question.id,
        optionId: answers[question.id],
      }));

    if (formattedAnswers.length !== questions.length) {
      setError('Answer all questions before submitting.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const result = await submitModuleAssessment(pageContext.assessmentSubmoduleId, formattedAnswers);
      const metrics = extractSubmissionMetrics(result, questions.length);
      setScore(metrics.score);
      setShowResultPopup(true);
      const popupPercentage = metrics.percentage;
      setDerivedPercentage(popupPercentage);
      setDerivedPassed(metrics.isPassed);
      saveLessonContext({
        attemptCount: metrics.attemptCount,
      });
    } catch (submitError) {
      setError(submitError?.message || 'Unable to submit assessment right now.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetakeAssessment = () => {
    setAnswers({});
    setScore(0);
    setShowResultPopup(false);
    setDerivedPercentage(0);
    setDerivedPassed(false);
  };

  const [derivedPercentage, setDerivedPercentage] = useState(0);
  const [derivedPassed, setDerivedPassed] = useState(false);
  const percentage = derivedPercentage || (questions.length ? Math.round((score / questions.length) * 100) : 0);
  const isPassed = showResultPopup ? derivedPassed || (questions.length > 0 ? score / questions.length >= PASS_MARK : false) : false;

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
        <div className={styles.topBar}>
          <button
            type="button"
            className={styles.topAction}
            aria-label="Go back"
            onClick={() => navigate('/assessment/module-1')}
          >
            &#8592;
          </button>
          <button
            type="button"
            className={styles.topAction}
            aria-label="Close assessment"
            onClick={() => navigate('/assessment/module-1')}
          >
            &#10005;
          </button>
        </div>

        <h1 className={styles.title}>Module 1 Assessment</h1>
        <p className={styles.subtitle}>Select the best answer for each question.</p>

        {loading ? <p className={styles.helperText}>Loading assessment questions...</p> : null}
        {error ? <p className={styles.failedText}>{error}</p> : null}
        {offlineMessage ? <p className={styles.helperText}>{offlineMessage}</p> : null}

        <section className={styles.questions}>
          {questions.map((q, index) => (
            <article key={q.id} className={styles.questionCard}>
              <div className={styles.questionHead}>
                <span className={styles.qNumber}>{index + 1}</span>
                <h2 className={styles.qText}>{q.text}</h2>
              </div>

              <div className={styles.optionsGrid}>
                {q.options.map((option) => {
                  const isSelected = answers[q.id] === option.id;
                  const optionClass = isSelected ? styles.optionSelected : styles.option;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      className={optionClass}
                      onClick={() => selectOption(q.id, option.id)}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </article>
          ))}
        </section>

        <p className={styles.helperText}>Ensure all questions are answered before submitting.</p>

        <button
          type="button"
          className={styles.submitButton}
          onClick={handleSubmitAssessment}
          disabled={loading || questions.length === 0 || submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Assessment'}
        </button>

        {/* <p className={styles.syncText}>Assessment data is loaded from the backend.</p> */}
      </main>

      {showResultPopup ? (
        <div className={styles.popupOverlay} role="dialog" aria-modal="true">
          <section className={styles.popupCard}>
            <h6 className={styles.popupTitle}>Assessment Results</h6>

            <div className={styles.scoreRingWrap}>
              <div
                className={`${styles.scoreRing} ${!isPassed ? styles.scoreRingFail : ''}`}
                style={{ '--score-deg': `${Math.round((percentage / 100) * 360)}deg` }}
              >
                <div className={styles.scoreRingInner}>
                  <p className={`${styles.popupScore} ${!isPassed ? styles.popupScoreFail : ''}`}>
                    {percentage}%
                  </p>
                  <p className={styles.scoreLabel}>SCORE</p>
                </div>
              </div>
            </div>

            <h3 className={styles.popupHeading}>{isPassed ? 'Assessment passed' : 'Assessment not passed'}</h3>
            <p className={styles.popupSubtext}>
              {isPassed
                ? 'You answered enough questions correctly to complete this module assessment.'
                : 'Review the module content and try again to improve your score.'}
            </p>

            <section className={styles.popupStats}>
              <article className={styles.statCard}>
                <p className={styles.statTop}>Correct</p>
                <p className={styles.statValue}>
                  {score}/{questions.length}
                </p>
                <p className={styles.statCaption}>QUESTIONS CORRECT</p>
              </article>
              <article className={styles.statCard}>
                <p className={styles.statTop}>Module</p>
                <p className={styles.statValue}>{pageContext.moduleTitle || 'Assessment'}</p>
                <p className={styles.statCaption}>COMPLETED TOPIC</p>
              </article>
            </section>

            <section className={styles.breakdownCard}>
              <p className={styles.breakdownLabel}>MODULE BREAKDOWN</p>
              <div className={styles.breakdownRow}>
                <p className={styles.breakdownTitle}>{pageContext.moduleTitle || 'Module 1'}</p>
                <p className={styles.breakdownScore}>
                  {score}/{questions.length} Correct
                </p>
              </div>
              <div className={`${styles.breakdownTrack} ${!isPassed ? styles.breakdownTrackFail : ''}`}>
                <span
                  className={`${styles.breakdownFill} ${!isPassed ? styles.breakdownFillFail : ''}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </section>

            <div className={styles.popupActions}>
              <button
                type="button"
                className={styles.popupPrimaryButton}
                onClick={isPassed ? () => navigate('/curriculum') : handleRetakeAssessment}
              >
                {isPassed ? 'Next Lesson' : 'Retake Assessment'}
              </button>
              <button
                type="button"
                className={styles.popupSecondaryButton}
                onClick={() => setShowResultPopup(false)}
              >
                Review Answers
              </button>
              <button
                type="button"
                className={styles.popupTertiaryButton}
                onClick={() => navigate('/returning-home')}
              >
                Back to Home
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
};

export default Module1AssessmentPage;
