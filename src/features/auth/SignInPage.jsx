import React from 'react';
import SignInForm from '../../components/signinform/SignInForm';
import SocialAuthButtons from '../../components/socialauthbuttons/SocialAuthButtons';
import styles from './SignInPage.module.css';
import AuthHeader from '../../components/layout/AuthHeader';



const SignInPage = () => {
  return (
    <div className={styles.page}>
      <AuthHeader />
      {/* Main Sign In Section */}
      <div className={styles.mainSection}>
        <h4 className={styles.pageTitle}>Sign In</h4>
        <SignInForm />
        
        {/* Divider */}
        <div className={styles.divider}>
          <span className={styles.dividerText}>Or continue with</span>
        </div>

        {/* Social Auth Buttons */}
        <SocialAuthButtons />
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <p className={styles.footerText}>
          Don't have an account?{' '}
          {/* <a href="/signup" className={styles.footerLink}>
            Create one
          </a> */}
          <a href="/register" className={styles.footerLink}>Create one</a>
        
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
