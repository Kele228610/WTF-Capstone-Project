import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './VerifyAccountPage.module.css';

export default function VerifyAccountPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // If you pass email from SignIn, it will show nicely (optional)
  const email = useMemo(() => location.state?.email || '', [location.state]);

  const [resent, setResent] = useState(false);

  const handleGotIt = () => {
    // Choose where to go next after verification popup
    // Example: go back home or dashboard
    navigate('/returning-home');
  };

  const handleResend = (e) => {
    e.preventDefault();
    setResent(true);

    // simulate: hide message after a bit
    setTimeout(() => setResent(false), 2500);

    // Later: call your backend/API to resend verification email
    // await api.resendVerification(email);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.card} role="dialog" aria-modal="true" aria-label="Verify your account">
        <div className={styles.headerArc}>
          <div className={styles.iconWrap} aria-hidden="true">
            <div className={styles.iconSquare}>
              <GraduationCapIcon />
            </div>
          </div>
          <p className={styles.brand}>EduLearn</p>
        </div>

        <h1 className={styles.title}>Verify Your Account</h1>

        <p className={styles.description}>
          We just sent a verification link to your email.
          <br />
          Click on it and get started.
          {email ? (
            <>
              <br />
              <span className={styles.emailText}>{email}</span>
            </>
          ) : null}
        </p>

        <button type="button" className={styles.primaryBtn} onClick={handleGotIt}>
          GOT IT
        </button>

        <p className={styles.footerText}>
          Didn’t see the email? Click here to{' '}
          <a href="#resend" className={styles.resendLink} onClick={handleResend}>
            resend it
          </a>
        </p>

        {resent && (
          <div className={styles.toast} role="status" aria-live="polite">
            Verification email resent{email ? ` to ${email}` : ''}.
          </div>
        )}
      </div>
    </div>
  );
}

function GraduationCapIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
