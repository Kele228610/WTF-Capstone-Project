import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SettingsPage.module.css';
import Icon1 from '../../assets/icons/Icon-1.svg';
import Icon2 from '../../assets/icons/Icon-2.svg';
import Icon3 from '../../assets/icons/Icon-3.svg';
import Icon4 from '../../assets/icons/Icon-4.svg';
import Icon5 from '../../assets/icons/Icon-5.svg';
import Icon6 from '../../assets/icons/Icon-6.svg';
import Icon7 from '../../assets/icons/Icon-7.svg';
import Icon8 from '../../assets/icons/Icon-8.svg';
import Icon9 from '../../assets/icons/Icon-9.svg';
import Icon10 from '../../assets/icons/Icon-10.svg';
// import Icon11 from '../../assets/icons/Icon-11.svg';
import Icon12 from '../../assets/icons/Icon-12.svg';
import Icon13 from '../../assets/icons/Icon-13.svg';
import Icon14 from '../../assets/icons/Icon-14.svg';
import Icon15 from '../../assets/icons/Icon-15.svg';
import Icon16 from '../../assets/icons/Icon-16.svg';

const ChevronRow = ({ iconSrc, iconAlt, title, subtitle }) => (
  <button type="button" className={styles.rowButton}>
    <div className={styles.rowLeft}>
      <div className={styles.iconBox}>
        <img className={styles.iconImage} src={iconSrc} alt={iconAlt} />
      </div>
      <div className={styles.copyBlock}>
        <p className={styles.rowTitle}>{title}</p>
        {subtitle ? <p className={styles.rowSubtitle}>{subtitle}</p> : null}
      </div>
    </div>
    <span className={styles.chevron}>&#8250;</span>
  </button>
);

const ToggleRow = ({ iconSrc, iconAlt, title, subtitle, checked, onToggle }) => (
  <div className={styles.rowStatic}>
    <div className={styles.rowLeft}>
      <div className={styles.iconBox}>
        <img className={styles.iconImage} src={iconSrc} alt={iconAlt} />
      </div>
      <div className={styles.copyBlock}>
        <p className={styles.rowTitle}>{title}</p>
        {subtitle ? <p className={styles.rowSubtitle}>{subtitle}</p> : null}
      </div>
    </div>
    <button
      type="button"
      className={`${styles.switch} ${checked ? styles.switchOn : ''}`}
      onClick={onToggle}
      aria-label={`Toggle ${title}`}
    >
      <span className={styles.switchKnob} />
    </button>
  </div>
);

const SettingsPage = () => {
  const navigate = useNavigate();
  const [toggles, setToggles] = useState({
    offlineMode: false,
    autoDownload: true,
    reminders: true,
    courseUpdates: true,
  });

  const onToggle = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate('/returning-home')}
          aria-label="Back to home"
        >
          &#8592;
        </button>
        <div>
          <h1 className={styles.title}>Settings</h1>
          <p className={styles.subtitle}>Manage your preferences</p>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>ACCOUNT</h2>
          <div className={styles.card}>
            <ChevronRow iconSrc={Icon1} iconAlt="Profile" title="Profile" />
            <ChevronRow iconSrc={Icon2} iconAlt="Email" title="Email" />
            <ChevronRow iconSrc={Icon3} iconAlt="Password" title="Password" />
            <ChevronRow iconSrc={Icon4} iconAlt="Linked Accounts" title="Linked Accounts" />
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>DATA &amp; STORAGE</h2>
          <div className={styles.card}>
            <ToggleRow
              iconSrc={Icon5}
              iconAlt="Offline mode"
              title="Offline Mode"
              subtitle="Access downloaded content offline"
              checked={toggles.offlineMode}
              onToggle={() => onToggle('offlineMode')}
            />
            <ToggleRow
              iconSrc={Icon6}
              iconAlt="Auto-download"
              title="Auto-Download"
              subtitle="Download new lessons automatically"
              checked={toggles.autoDownload}
              onToggle={() => onToggle('autoDownload')}
            />
            <div className={styles.storageRow}>
              <div className={styles.rowLeft}>
                <div className={styles.iconBox}>
                  <img className={styles.iconImage} src={Icon7} alt="Storage" />
                </div>
                <div className={styles.copyBlock}>
                  <p className={styles.rowTitle}>Storage</p>
                  <p className={styles.rowSubtitle}>1.5 GB used of 5 GB</p>
                </div>
              </div>
            </div>
            <div className={styles.storageTrack}>
              <span className={styles.storageFill} />
            </div>
            <button type="button" className={styles.linkButton}>Manage Downloads</button>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>NOTIFICATIONS</h2>
          <div className={styles.card}>
            <ToggleRow
              iconSrc={Icon8}
              iconAlt="Reminders"
              title="Reminders"
              subtitle=""
              checked={toggles.reminders}
              onToggle={() => onToggle('reminders')}
            />
            <ToggleRow
              iconSrc={Icon9}
              iconAlt="Course updates"
              title="Course Updates"
              subtitle=""
              checked={toggles.courseUpdates}
              onToggle={() => onToggle('courseUpdates')}
            />
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>PRIVACY &amp; SECURITY</h2>
          <div className={styles.card}>
            <ChevronRow iconSrc={Icon10} iconAlt="Privacy settings" title="Privacy Settings" subtitle="Control your data visibility" />
            <ChevronRow iconSrc={Icon13} iconAlt="Two-factor authentication" title="Two-Factor Authentication" subtitle="Add an extra layer of security" />
            <ChevronRow iconSrc={Icon12} iconAlt="Devices" title="Devices" subtitle="Manage logged-in devices" />
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>SUPPORT &amp; ABOUT</h2>
          <div className={styles.card}>
            <ChevronRow iconSrc={Icon13} iconAlt="Help center" title="Help Center" subtitle="FAQs and support articles" />
            <ChevronRow iconSrc={Icon14} iconAlt="Contact support" title="Contact Support" subtitle="Get help from our team" />
            <div className={styles.rowStatic}>
              <div className={styles.rowLeft}>
                <div className={styles.iconBox}>
                  <img className={styles.iconImage} src={Icon15} alt="About EDUlearn" />
                </div>
                <div className={styles.copyBlock}>
                  <p className={styles.rowTitle}>About EDUlearn</p>
                  <p className={styles.rowSubtitle}>Version 2.4.1</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <button type="button" className={styles.logoutButton}>
          <img className={styles.logoutIcon} src={Icon16} alt="" />
          Logout
        </button>

        <p className={styles.footerText}>&copy; 2024 EDUlearn Inc. All rights reserved.</p>
      </main>
    </div>
  );
};

export default SettingsPage;
