import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Module1AssessmentPage.module.css';
import Notificationbell from '../../assets/icons/Notificationbell.png';
import AsideSidebarDrawerNavigation from '../../components/layout/AsideSidebarDrawerNavigation';


const QUESTIONS = [
  {
    id: 1,
    text: 'Which plane divides the body into equal left and right halves?',
    options: ['Midsagittal', 'Transverse', 'Frontal', 'Oblique'],
    initial: 'Midsagittal',
  },
  {
    id: 2,
    text: 'The brain is located in which body cavity?',
    options: ['Thoracic', 'Cranial', 'Abdominal', 'Pelvic'],
    initial: 'Cranial',
  },
  {
    id: 3,
    text: 'Which plane divides the body into anterior and posterior portions?',
    options: ['Sagittal', 'Transverse', 'Frontal', 'Horizontal'],
    initial: 'Frontal',
  },
  {
    id: 4,
    text: 'The stomach and intestines are primarily found in the:',
    options: ['Thoracic Cavity', 'Abdominal Cavity', 'Vertebral Cavity', 'Cranial Cavity'],
    initial: 'Abdominal Cavity',
  },
  {
    id: 5,
    text: "What plane is also known as a horizontal plane?",
    options: ['Transverse', 'Frontal', 'Sagittal', 'Coronal'],
    initial: 'Transverse',
  },
  {
    id: 6,
    text: 'The spinal cord is protected within the:',
    options: ['Ventral Cavity', 'Thoracic Cavity', 'Vertebral Cavity', 'Pelvic Cavity'],
    initial: 'Vertebral Cavity',
  },
  {
    id: 7,
    text: 'Which cavity is separated from the abdominal cavity by the diaphragm?',
    options: ['Thoracic', 'Pelvic', 'Cranial', 'Dorsal'],
    initial: 'Thoracic',
  },
  {
    id: 8,
    text: 'The urinary bladder and reproductive organs are in the:',
    options: ['Abdominal Cavity', 'Pelvic Cavity', 'Thoracic Cavity', 'Cranial Cavity'],
    initial: 'Pelvic Cavity',
  },
  {
    id: 9,
    text: "The term 'coronal' is another name for which plane?",
    options: ['Sagittal', 'Frontal', 'Transverse', 'Median'],
    initial: 'Frontal',
  },
  {
    id: 10,
    text: 'Which of these is part of the dorsal body cavity?',
    options: ['Cranial Cavity', 'Thoracic Cavity', 'Abdominal Cavity', 'Ventral Cavity'],
    initial: 'Cranial Cavity',
  },
];

const ANSWER_KEY = {
  1: 'Midsagittal',
  2: 'Cranial',
  3: 'Frontal',
  4: 'Abdominal Cavity',
  5: 'Transverse',
  6: 'Vertebral Cavity',
  7: 'Thoracic',
  8: 'Pelvic Cavity',
  9: 'Frontal',
  10: 'Thoracic Cavity',
};

const PASS_MARK = 7;

const Module1AssessmentPage = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState(() => {
    const defaults = {};
    QUESTIONS.forEach((q) => {
      defaults[q.id] = q.initial;
    });
    return defaults;
  });

  const selectOption = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmitAssessment = () => {
    const correctCount = QUESTIONS.reduce((count, question) => {
      return answers[question.id] === ANSWER_KEY[question.id] ? count + 1 : count;
    }, 0);

    setScore(correctCount);
    setShowResultPopup(true);
  };

  const handleRetakeAssessment = () => {
    setShowResultPopup(false);
  };

  const percentage = Math.round((score / 10) * 100);
  const isPassed = score >= PASS_MARK;

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

        <section className={styles.questions}>
          {QUESTIONS.map((q) => (
            <article key={q.id} className={styles.questionCard}>
              <div className={styles.questionHead}>
                <span className={styles.qNumber}>{q.id}</span>
                <h2 className={styles.qText}>{q.text}</h2>
              </div>

              <div className={styles.optionsGrid}>
                {q.options.map((option) => {
                  const isSelected = answers[q.id] === option;
                  const isWrong = q.id === 10 && option === 'Cranial Cavity' && isSelected;
                  const optionClass = isWrong
                    ? styles.optionWrong
                    : isSelected
                    ? styles.optionSelected
                    : styles.option;

                  return (
                    <button
                      key={option}
                      type="button"
                      className={optionClass}
                      onClick={() => selectOption(q.id, option)}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </article>
          ))}
        </section>

        <p className={styles.helperText}>Ensure all 10 questions are answered before submitting.</p>

        <button
          type="button"
          className={styles.submitButton}
          onClick={handleSubmitAssessment}
        >
          Submit Assessment
        </button>

        <p className={styles.syncText}>Answers saved locally will sync when online.</p>
      </main>

      {showResultPopup ? (
        <div className={styles.popupOverlay} role="dialog" aria-modal="true">
          <section className={styles.popupCard}>
            <h6 className={styles.popupTitle}>Assessment Results</h6>

            <div className={styles.scoreRingWrap}>
              <div
                className={`${styles.scoreRing} ${!isPassed ? styles.scoreRingFail : ''}`}
                style={{ '--score-deg': `${Math.round((score / 10) * 360)}deg` }}
              >
                <div className={styles.scoreRingInner}>
                  <p className={`${styles.popupScore} ${!isPassed ? styles.popupScoreFail : ''}`}>
                    {percentage}%
                  </p>
                  <p className={styles.scoreLabel}>SCORE</p>
                </div>
              </div>
            </div>

            {isPassed ? (
              <>
                <h3 className={styles.popupHeading}>Great job, Winnie!</h3>
                <p className={styles.popupSubtext}>
                  You&apos;ve mastered the basics of Human Anatomy Module 1.
                </p>
              </>
            ) : (
              <>
                <h3 className={styles.popupHeading}>Keep Practicing Winnie!</h3>
                <p className={styles.popupSubtext}>You can retake assessment to improve your score.</p>
              </>
            )}

            <section className={styles.popupStats}>
              <article className={styles.statCard}>
                <p className={styles.statTop}>Overall</p>
                <p className={styles.statValue}>{isPassed ? '+15%' : '+5%'}</p>
                <p className={styles.statCaption}>PROGRESS GAINED</p>
              </article>
              <article className={styles.statCard}>
                <p className={styles.statTop}>Time</p>
                <p className={styles.statValue}>{isPassed ? '12m 45s' : '14m 45s'}</p>
                <p className={styles.statCaption}>TIME SPENT</p>
              </article>
            </section>

            {isPassed ? (
              <section className={styles.badgeCard}>
                <div className={styles.badgeIcon}>*</div>
                <div>
                  <p className={styles.badgeLabel}>BADGE UNLOCKED</p>
                  <p className={styles.badgeTitle}>Anatomy Expert</p>
                </div>
              </section>
            ) : null}

            <section className={styles.breakdownCard}>
              <p className={styles.breakdownLabel}>MODULE BREAKDOWN</p>
              <div className={styles.breakdownRow}>
                <p className={styles.breakdownTitle}>Anatomy Module 1</p>
                <p className={styles.breakdownScore}>{score}/10 Correct</p>
              </div>
              <div className={`${styles.breakdownTrack} ${!isPassed ? styles.breakdownTrackFail : ''}`}>
                <span className={`${styles.breakdownFill} ${!isPassed ? styles.breakdownFillFail : ''}`} style={{ width: `${score * 10}%` }} />
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
