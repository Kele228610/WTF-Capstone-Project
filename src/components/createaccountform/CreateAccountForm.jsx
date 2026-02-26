import { useState } from 'react';
import InputField from '../inputfield/InputField';
import styles from './CreateAccountForm.module.css';
import GoogleSvg from '../../assets/icons/Google.svg';
import AppleSvg from '../../assets/icons/Apple.svg';
import { Link, useNavigate } from "react-router-dom";


export default function CreateAccountForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    location: ''
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [classLevel, setClassLevel] = useState('senior');
  const [selectedSubjects, setSelectedSubjects] = useState(['mathematics', 'english']);
  const [dailyGoal, setDailyGoal] = useState('30mins');

  const subjects = [
    { id: 'mathematics', label: 'Mathematics', icon: 'S' },
    { id: 'science', label: 'Science', icon: 'A' },
    { id: 'ict', label: 'ICT', icon: '<>' },
    { id: 'english', label: 'English', icon: 'E' },
    { id: 'history', label: 'History', icon: 'O' },
    { id: 'arts', label: 'Arts', icon: '*' }
  ];

  const goals = [
    { id: '15mins', title: '15 mins', subtitle: 'Casual', icon: 'C', tone: 'green' },
    { id: '30mins', title: '30 mins', subtitle: 'Regular', icon: 'B', tone: 'blue' },
    { id: '1hour', title: '1 hour', subtitle: 'Intense', icon: '!', tone: 'red' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getPasswordStrength = (password) => {
    if (!password) return { label: '', strength: 0, color: '' };
    if (password.length < 6) return { label: 'Weak', strength: 33, color: '#eb1414' };
    if (password.length < 10) return { label: 'Medium', strength: 66, color: '#f59e0b' };
    return { label: 'Strong', strength: 100, color: '#10b981' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreedToTerms) {
      alert('Please agree to the Terms & Conditions');
      return;
    }
    setOnboardingStep(1);
    setShowOnboarding(true);
  };

  const handleSubjectToggle = (subjectId) => {
    setSelectedSubjects((prev) => {
      if (prev.includes(subjectId)) {
        return prev.filter((item) => item !== subjectId);
      }
      return [...prev, subjectId];
    });
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    // Handle social login
  };

  return (
    <>
    <div className={styles.formContainer}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Create Account</h1>
        <p className={styles.subheading}>
          Join our community of learners today and
          <br />
          start your journey.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <InputField
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={handleChange}
          name="fullName"
        />

        <InputField
          label="Email"
          type="email"
          placeholder="example@email.com"
          value={formData.email}
          onChange={handleChange}
          name="email"
        />

        <div className={styles.passwordField}>
          <InputField
            label="Create Password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            name="password"
            showPasswordToggle={true}
          />
          {formData.password && (
            <div className={styles.passwordStrength}>
              <div className={styles.strengthHeader}>
                <span className={styles.strengthLabel}>Password strength:</span>
                <span className={styles.strengthValue} style={{ color: passwordStrength.color }}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className={styles.strengthBar}>
                <div 
                  className={styles.strengthFill} 
                  style={{ 
                    width: `${passwordStrength.strength}%`,
                    backgroundColor: passwordStrength.color 
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <InputField
          label="Location"
          type="text"
          placeholder="Enter your country,city. eg. Ghana, Accra"
          value={formData.location}
          onChange={handleChange}
          name="location"
        />

        <div className={styles.termsContainer}>
          <input
            type="checkbox"
            id="terms"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className={styles.checkbox}
          />
          <label htmlFor="terms" className={styles.termsLabel}>
            By creating an account, I agree to the{' '}
            <a href="#" className={styles.link}>Terms & Conditions</a>{' '}
            and{' '}
            <a href="#" className={styles.link}>Privacy Policy</a>.
          </label>
        </div>

        <button type="submit" className={styles.submitButton}>
          Create Free Account
        </button>

        <div className={styles.divider}>
          <span className={styles.dividerText}>Or continue with</span>
        </div>

        <div className={styles.socialButtons}>
          <button 
            type="button" 
            className={styles.socialButton}
            onClick={() => handleSocialLogin('Google')}
          >
            {/* <svg className={styles.socialIcon} viewBox="0 0 20 20" fill="none">
              <path d={svgPaths.p29ad9380} fill="#4285F4" />
              <path d={svgPaths.p73c0a80} fill="#34A853" />
              <path d={svgPaths.p1f69ba00} fill="#FBBC05" />
              <path d={svgPaths.p3d0b3f00} fill="#EA4335" />
            </svg> */}
            <img src={GoogleSvg} alt="Google" className={styles.icon} />
            <span>Google</span>
          </button>
          <button 
            type="button" 
            className={styles.socialButton}
            onClick={() => handleSocialLogin('Apple')}
          >
            <svg className={styles.socialIcon} viewBox="0 0 20 20" fill="none">
              <g clipPath="url(#clip0_3_131)">
                {/* <path d={svgPaths.p20a2c000} fill="#0F172A" /> */}
                <img src={AppleSvg} alt="Apple" className={styles.icon} />
              </g>
              <defs>
                <clipPath id="clip0_3_131">
                  <rect fill="white" height="20" width="20" />
                </clipPath>
              </defs>
            </svg>
            <span>Apple</span>
          </button>
        </div>

        <div className={styles.footer}>
          <span className={styles.footerText}>Already have an account?</span>{' '}
          {/* <a href="#" className={styles.link}>Log in</a> */}
          <Link to="/login" className={styles.link}>
            Log in
            </Link>

        </div>
      </form>
    </div>
    {showOnboarding ? (
      <div
        className={styles.onboardingOverlay}
        role="dialog"
        aria-modal="true"
        aria-label={`Onboarding step ${onboardingStep}`}
      >
        <section className={styles.onboardingCard}>
          {onboardingStep === 1 ? (
            <>
              <div className={styles.progressHeader}>
                <div className={styles.stepLabel}>Step 1 of 3</div>
                <div className={styles.stepPercent}>35% Complete</div>
              </div>
              <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: '35%' }} />
              </div>

              <div className={styles.promptRow}>
                <div className={styles.promptIcon}>+</div>
                <div className={styles.promptBubble}>Great choices! What is your current class level?</div>
              </div>

              <button
                type="button"
                className={`${styles.levelOption} ${classLevel === 'junior' ? styles.levelOptionActive : ''}`}
                onClick={() => setClassLevel('junior')}
              >
                <div className={styles.levelIcon}>B</div>
                <div className={styles.levelCopy}>
                  <div className={styles.levelTitle}>Junior High School</div>
                  <div className={styles.levelSubtitle}>Grades 1 to 8</div>
                </div>
                <span className={`${styles.radio} ${classLevel === 'junior' ? styles.radioActive : ''}`} />
              </button>

              <button
                type="button"
                className={`${styles.levelOption} ${classLevel === 'senior' ? styles.levelOptionActive : ''}`}
                onClick={() => setClassLevel('senior')}
              >
                <div className={styles.levelIcon}>G</div>
                <div className={styles.levelCopy}>
                  <div className={styles.levelTitle}>Senior High School</div>
                  <div className={styles.levelSubtitle}>Grades 9 to 12</div>
                </div>
                <span className={`${styles.radio} ${classLevel === 'senior' ? styles.radioActive : ''}`} />
              </button>

              <div className={styles.onboardingFooter}>
                <button type="button" className={styles.continueButton} onClick={() => setOnboardingStep(2)}>
                  Continue &rarr;
                </button>
              </div>
            </>
          ) : onboardingStep === 2 ? (
            <>
              <div className={styles.progressHeader}>
                <div className={styles.stepLabel}>Step 2 of 3</div>
                <div className={styles.stepPercent}>65% Complete</div>
              </div>
              <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: '65%' }} />
              </div>

              <div className={styles.promptRow}>
                <div className={styles.promptIcon}>+</div>
                <div className={styles.promptBubble}>
                  Welcome! I'm your learning assistant. What subjects are you most interested in?
                </div>
              </div>

              <div className={styles.subjectsGrid}>
                {subjects.map((subject) => {
                  const isActive = selectedSubjects.includes(subject.id);

                  return (
                    <button
                      key={subject.id}
                      type="button"
                      className={`${styles.subjectCard} ${isActive ? styles.subjectCardActive : ''}`}
                      onClick={() => handleSubjectToggle(subject.id)}
                    >
                      <div className={`${styles.subjectIcon} ${isActive ? styles.subjectIconActive : ''}`}>{subject.icon}</div>
                      <div className={styles.subjectTitle}>{subject.label}</div>
                    </button>
                  );
                })}
              </div>

              <div className={styles.onboardingFooter}>
                <button type="button" className={styles.continueButton} onClick={() => setOnboardingStep(3)}>
                  Continue &rarr;
                </button>
              </div>
            </>
          ) : (
            <>
              <div className={styles.progressHeader}>
                <div className={styles.stepLabel}>Step 3 of 3</div>
                <div className={styles.stepPercent}>100% Complete</div>
              </div>
              <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: '100%' }} />
              </div>

              <div className={styles.promptRow}>
                <div className={styles.promptIcon}>+</div>
                <div className={styles.promptBubble}>Last step! What is your daily goal?</div>
              </div>

              <div className={styles.goalsList}>
                {goals.map((goal) => {
                  const isActive = dailyGoal === goal.id;
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      className={`${styles.goalOption} ${isActive ? styles.goalOptionActive : ''}`}
                      onClick={() => setDailyGoal(goal.id)}
                    >
                      <div className={`${styles.goalIcon} ${styles[`goalIcon${goal.tone.charAt(0).toUpperCase() + goal.tone.slice(1)}`]}`}>
                        {goal.icon}
                      </div>
                      <div className={styles.levelCopy}>
                        <div className={styles.levelTitle}>{goal.title}</div>
                        <div className={styles.levelSubtitle}>{goal.subtitle}</div>
                      </div>
                      <span className={`${styles.radio} ${isActive ? styles.radioActive : ''}`} />
                    </button>
                  );
                })}
              </div>

              <div className={styles.onboardingFooter}>
                <button
                  type="button"
                  className={styles.continueButton}
                  onClick={() => {
                    setShowOnboarding(false);
                    setOnboardingStep(1);
                    navigate('/new-user-home');
                  }}
                >
                  Finish & Setup &rarr;
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    ) : null}
    </>
  );
}
