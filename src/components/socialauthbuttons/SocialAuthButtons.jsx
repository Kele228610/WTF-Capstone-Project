import React from 'react';
import GoogleSvg from '../../assets/icons/Google.svg';
import AppleSvg from '../../assets/icons/Apple.svg';
import styles from './SocialAuthButtons.module.css';

const SocialAuthButtons = () => {
  const handleGoogleSignIn = () => {
    console.log('Sign in with Google');
  };

  const handleAppleSignIn = () => {
    console.log('Sign in with Apple');
  };

  return (
    <div className={styles.container}>
      {/* Google Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        className={styles.socialButton}
      >
        <img src={GoogleSvg} alt="Google" className={styles.icon} />
        <span className={styles.buttonText}>Google</span>
      </button>

      {/* Apple Button */}
      <button
        type="button"
        onClick={handleAppleSignIn}
        className={styles.socialButton}
      >
        <img src={AppleSvg} alt="Apple" className={styles.icon} />
        <span className={styles.buttonText}>Apple</span>
      </button>
    </div>
  );
};

export default SocialAuthButtons;
