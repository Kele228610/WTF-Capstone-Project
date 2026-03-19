import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { verifyEmail } from '../../api/auth';
import styles from './EmailVerificationPage.module.css';
import { clearPendingOnboarding, readPendingOnboarding } from './onboardingStorage';

export default function EmailVerificationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState(token ? 'loading' : 'error');
  const [message, setMessage] = useState(token ? 'Verifying...' : 'Invalid or expired verification link.');

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    let redirectTimerId;
    let cancelled = false;

    async function runVerification() {
      try {
        const data = await verifyEmail(token);
        if (cancelled) return;

        setStatus('success');
        setMessage(data?.message || 'Your email has been verified successfully.');

        redirectTimerId = window.setTimeout(() => {
          const pendingOnboarding = readPendingOnboarding();

          if (pendingOnboarding?.prefill) {
            navigate('/register', {
              state: {
                startOnboarding: true,
                prefill: pendingOnboarding.prefill,
              },
            });
            return;
          }

          clearPendingOnboarding();
          navigate('/new-user-home');
        }, 3000);
      } catch (error) {
        if (cancelled) return;


        setStatus('error');
        setMessage(error?.message || 'Invalid or expired verification link.');
      }
    }

    runVerification();

    return () => {
      cancelled = true;
      if (redirectTimerId) window.clearTimeout(redirectTimerId);
    };
  }, [navigate, token]);

  return (
    <main className={styles.page}>
      <section className={styles.card} role="dialog" aria-modal="true" aria-live="polite">
        <div className={styles.headerArc}>
          <div className={styles.iconWrap} aria-hidden="true">
            <div className={styles.iconSquare}>
              <GraduationCapIcon />
            </div>
          </div>
          <p className={styles.brand}>EduLearn</p>
        </div>

        <div className={styles.content}>
          {status === 'loading' ? (
            <>
              <h1 className={styles.title}>Verifying...</h1>
              <span className={styles.spinner} aria-hidden="true" />
            </>
          ) : null}

          {status === 'success' ? (
            <>
              <h1 className={styles.title}>Verified</h1>
              <p className={styles.message}>{message}</p>
              <p className={styles.helperText}>Preparing your onboarding...</p>
            </>
          ) : null}

          {status === 'error' ? (
            <>
              <h1 className={styles.title}>Verification failed</h1>
              <p className={styles.message}>{message}</p>
            </>
          ) : null}
        </div>
      </section>
    </main>
  );
}

function GraduationCapIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3L1.8 8.1 12 13.2 22.2 8.1 12 3Z"
        fill="white"
        opacity="0.95"
      />
      <path
        d="M5.2 10.6V15.2C5.2 15.2 7.6 17.6 12 17.6C16.4 17.6 18.8 15.2 18.8 15.2V10.6"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22.2 8.1V13.6"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
