import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Module1AssessmentFrontPage.module.css';
import Notificationbell from '../../assets/icons/Notificationbell.png';
import AsideSidebarDrawerNavigation from '../../components/layout/AsideSidebarDrawerNavigation';
import { getModuleAssessment } from '../../api/lessons';
import { getProfile } from '../../api/profile';
import { readLessonContext, saveLessonContext } from '../lessons/lessonContext';

import { getDownloadedAssessment, saveDownloadedAssessment } from '../lessons/offlineLessonStorage';

import BluequestionIcon from '../../assets/icons/Bluequestion.png';

import TimeIcon from '../../assets/icons/TimeIcon.png';

import AttemptIcon from '../../assets/icons/AttemptIcon.png';

import ResumeIcon from '../../assets/icons/Resume icon.png';
 
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
 
const Module1AssessmentFrontPage = () => {

  const navigate = useNavigate();

  const location = useLocation();

  const storedContext = readLessonContext();

  const pageContext = {
    ...(storedContext || {}),
    ...(location.state || {}),
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [questions, setQuestions] = useState([]);

  const [loading, setLoading] = useState(true);

  const [offlineMessage, setOfflineMessage] = useState('');
  const [userId, setUserId] = useState('anonymous');

  const attempts = Number(pageContext.attemptCount ?? 0);

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
 
    async function loadAssessment() {

      try {

        setLoading(true);

        const data = await getModuleAssessment();

        if (cancelled) return;
 
        const normalizedQuestions = normalizeQuestions(data);

        setQuestions(normalizedQuestions);

        setOfflineMessage('');
 
        saveLessonContext({

          ...pageContext,

          assessmentSubmoduleId: ASSESSMENT_CACHE_KEY,

        });
 
        await saveDownloadedAssessment(userId, {

          assessmentSubmoduleId: ASSESSMENT_CACHE_KEY,

          cachedAt: Date.now(),

          downloadPayload: null,

          questions: normalizedQuestions,

          context: {

            moduleTitle: pageContext.moduleTitle || 'Foundations of Anatomy',

          },

        });

      } catch (loadError) {

        console.error(loadError); // 👈 log error silently
 
        if (cancelled) return;
 
        try {

          const cached = await getDownloadedAssessment(userId, ASSESSMENT_CACHE_KEY);

          if (cancelled) return;
 
          if (Array.isArray(cached?.questions) && cached.questions.length > 0) {

            setQuestions(cached.questions);

            setOfflineMessage('Showing your downloaded assessment offline.');

          }

        } catch (cacheError) {

          console.error(cacheError); // 👈 also log cache errors

        }

      } finally {

        if (!cancelled) setLoading(false);

      }

    }
 
    loadAssessment();
 
    return () => {

      cancelled = true;

    };

  }, [pageContext.moduleTitle, userId]);
 
  const moduleTitle = pageContext.moduleTitle || 'Foundations of Anatomy';

  const submitSubmoduleId = pageContext.assessmentSubmoduleId || pageContext.submoduleId || null;
 
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
<span className={styles.readyText}>

              {loading ? 'Loading assessment' : 'Ready to Begin'}
</span>
</div>
 
          {offlineMessage ? (
<p className={styles.heroSubtitle}>{offlineMessage}</p>

          ) : null}
</section>
 
        <section className={styles.statsGrid}>
<article className={styles.statCard}>
<img className={styles.statImageIcon} src={BluequestionIcon} alt="Questions" />
<div className={styles.statLabel}>Questions</div>
<div className={styles.statValue}>{questions.length || 10}</div>
</article>
 
          <article className={styles.statCard}>
<img className={styles.statImageIcon} src={TimeIcon} alt="Time" />
<div className={styles.statLabel}>Time</div>
<div className={styles.statValue}>{loading ? '...' : '15 mins'}</div>
</article>
 
          <article className={styles.statCard}>
<img className={styles.statImageIcon} src={AttemptIcon} alt="Attempts" />
<div className={styles.statLabel}>Attempts</div>
<div className={styles.statValueRed}>{attempts || 0}/3</div>
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
Great job completing the module.Before we dive into the assessment, would you like to do a quick 2-
minute review of the key concepts?
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

                assessmentSubmoduleId: submitSubmoduleId,

                assessmentCacheKey: ASSESSMENT_CACHE_KEY,

                questions,

              },

            })

          }
>
<img className={styles.startIcon} src={ResumeIcon} alt="Start Assessment" />

          Start Assessment
</button>
 
        <button

          type="button"

          className={styles.reviewButton}

          onClick={() => navigate('/lesson/human-anatomy')}
>

          Review Key Concepts
</button>
</main>
</div>

  );

};
 
export default Module1AssessmentFrontPage;
 
