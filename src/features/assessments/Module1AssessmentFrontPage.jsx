import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Module1AssessmentFrontPage.module.css';
import Notificationbell from '../../assets/icons/Notificationbell.png';
import AsideSidebarDrawerNavigation from '../../components/layout/AsideSidebarDrawerNavigation';
import { downloadSubmoduleProgress, getModuleAssessment } from '../../api/lessons';
import { readLessonContext, saveLessonContext } from '../lessons/lessonContext';
import { getDownloadedAssessment, saveDownloadedAssessment } from '../lessons/offlineLessonStorage';

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
    correctAnswer:
      question?.correctAnswer ||
      question?.answer ||
      question?.correctOption ||
      question?.correct_option ||
      '',
  }));
}

const Module1AssessmentFrontPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const storedContext = readLessonContext();
  const pageContext = location.state || storedContext || {};
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [offlineMessage, setOfflineMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadAssessment() {
      const assessmentSubmoduleId = pageContext.assessmentSubmoduleId || pageContext.submoduleId;
      if (!assessmentSubmoduleId) {
        setError('No assessment was selected.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const data = await getModuleAssessment(assessmentSubmoduleId);
        if (cancelled) return;

        const normalizedQuestions = normalizeQuestions(data);
        setQuestions(normalizedQuestions);
        setOfflineMessage('');
        saveLessonContext({
          ...pageContext,
          assessmentSubmoduleId,
        });
        try {
          const downloadPayload = await downloadSubmoduleProgress(assessmentSubmoduleId);
          if (cancelled) return;
          await saveDownloadedAssessment({
            assessmentSubmoduleId,
            cachedAt: Date.now(),
            downloadPayload,
            questions: normalizedQuestions,
            context: {
              moduleTitle: pageContext.moduleTitle || 'Foundations of Anatomy',
            },
          });
        } catch {
          // Keep assessment usable online even if download caching fails.
        }
      } catch (loadError) {
        if (cancelled) return;
        try {
          const cached = await getDownloadedAssessment(assessmentSubmoduleId);
          if (cancelled) return;

          if (Array.isArray(cached?.questions) && cached.questions.length > 0) {
            setQuestions(cached.questions);
            setOfflineMessage('Showing your downloaded assessment offline.');
            setError('');
          } else {
            setError(loadError?.message || 'Unable to load assessment.');
          }
        } catch {
          if (cancelled) return;
          setError(loadError?.message || 'Unable to load assessment.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAssessment();

    return () => {
      cancelled = true;
    };
  }, [pageContext.assessmentSubmoduleId, pageContext.submoduleId]);

  const moduleTitle = pageContext.moduleTitle || 'Foundations of Anatomy';

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
          className={styles.backRow}
          onClick={() => navigate('/lesson/human-anatomy')}
          aria-label="Back to lesson notes"
        >
          <span className={styles.backArrow}>&#8592;</span>
          <span className={styles.backText}>Module 1 Assessment</span>
        </button>

        <section className={styles.heroCard}>
          <h1 className={styles.heroTitle}>{moduleTitle}</h1>
          <p className={styles.heroSubtitle}>
            Validate your mastery of the concepts covered in this module.
          </p>
          <div className={styles.readyRow}>
            <span className={styles.readyDot} />
            <span className={styles.readyText}>{loading ? 'Loading assessment' : 'Ready to Begin'}</span>
          </div>
          {offlineMessage ? <p className={styles.heroSubtitle}>{offlineMessage}</p> : null}
        </section>

        <section className={styles.statsGrid}>
          <article className={styles.statCard}>
            <div className={styles.statIcon}>?</div>
            <div className={styles.statLabel}>Questions</div>
            <div className={styles.statValue}>{questions.length || 0}</div>
          </article>
          <article className={styles.statCard}>
            <div className={styles.statIcon}>T</div>
            <div className={styles.statLabel}>Status</div>
            <div className={styles.statValue}>{loading ? '...' : 'Live'}</div>
          </article>
          <article className={styles.statCard}>
            <div className={styles.statIconRed}>!</div>
            <div className={styles.statLabel}>Errors</div>
            <div className={styles.statValueRed}>{error ? 1 : 0}</div>
          </article>
        </section>

        <section className={styles.tutorCard}>
          <div className={styles.tutorAvatarWrap}>
            <div className={styles.tutorAvatar}>AI</div>
            <span className={styles.onlineDot} />
          </div>
          <div className={styles.tutorTextWrap}>
            <b className={styles.tutorName}>EduAI Tutor</b>
            <p className={styles.tutorText}>
              {error || 'Your assessment is ready. Start when you are ready to answer the backend-provided questions.'}
            </p>
          </div>
        </section>

        <button
          type="button"
          className={styles.startButton}
          onClick={() =>
            navigate('/assessment/module-1/questions', {
              state: {
                ...pageContext,
                assessmentSubmoduleId: pageContext.assessmentSubmoduleId || pageContext.submoduleId,
                questions,
              },
            })
          }
          disabled={loading || Boolean(error)}
        >
          Start Assessment
        </button>
        <button type="button" className={styles.reviewButton} onClick={() => navigate('/lesson/human-anatomy')}>
          Back to Module
        </button>
      </main>
    </div>
  );
};

export default Module1AssessmentFrontPage;
