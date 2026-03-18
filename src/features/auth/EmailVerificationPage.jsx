import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './EmailVerificationPage.module.css';

const VERIFY_EMAIL_ENDPOINT =
  'https://wtf-capstone-project.vercel.app/api/v1/auth/verify-email';

export default function EmailVerificationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Verifying...');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Invalid or expired link.');
      return undefined;
    }

    const controller = new AbortController();
    let redirectTimerId;

    async function verifyEmail() {
      try {
        const response = await fetch(`${VERIFY_EMAIL_ENDPOINT}?token=${encodeURIComponent(token)}`, {
          method: 'GET',
          signal: controller.signal,
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.message || data?.error || 'Invalid or expired link.'
          );
        }

        setStatus('success');
        setMessage(data?.message || 'Email verified successfully.');
        redirectTimerId = window.setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        if (error.name === 'AbortError') return;

        setStatus('error');
        setMessage(error.message || 'Invalid or expired link.');
      }
    }

    verifyEmail();

    return () => {
      controller.abort();
      if (redirectTimerId) window.clearTimeout(redirectTimerId);
    };
  }, [navigate, searchParams]);

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-live="polite">
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
              <p className={styles.helperText}>Redirecting to login...</p>
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
