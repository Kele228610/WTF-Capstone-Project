import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AsideSidebarDrawerNavigation.module.css';
import Crosscloseicon from '../../assets/icons/Crosscloseicon.png';
import Homeicon from '../../assets/icons/homeicon.png';
import Subjectsicon from '../../assets/icons/Subjecticon.png';
import Progressicon from '../../assets/icons/Progresstrackericon.png';
import Achievementsicon from '../../assets/icons/Achievementsicon.png';
import Settingsicon from '../../assets/icons/Settingsicon.png';
import Signout from '../../assets/icons/Signouticon.png';
import Chevronright from '../../assets/icons/Chevronright.png';
import UserProfile from '../../assets/images/User Profile.png';

const AsideSidebarDrawerNavigation = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    onClose?.();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <aside
        className={styles['aside-sidebar-drawer-navigat']}
        onClick={(event) => event.stopPropagation()}
        aria-label="Sidebar navigation"
      >
        <div className={styles['aside-sidebar-drawer-navigat2']} />

        <div className={styles['drawer-header-user-profile']}>
          <button type="button" className={styles['close-button']} aria-label="Close sidebar" onClick={onClose}>
            <img className={styles['close-icon']} src={Crosscloseicon} alt="Close" />
          </button>

          <div className={styles.container}>
            <div className={styles.container2}>
              <img className={styles['UserProfile']} src={UserProfile} alt="User Profile" />
              <div className={styles.backgroundborder} />
            </div>

            <div className={styles.container3}>
              <div className={styles['heading-2']}>
                <b className={styles['winnie-jones']}>Winnie Jones</b>
              </div>
              <div className={styles.container4}>
                <div className={styles['senior-high-student']}>Senior High Student</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles['navigation-list']}>
          <div className={styles.list}>
            <button
              type="button"
              className={styles['item-home-active-link']}
              onClick={() => handleNavigate('/returning-home')}
              aria-label="Go to home"
            >
              {/* <div className={styles.margin}>
                <div className={styles.text}>home</div>
              </div> */}
              <img className={styles.homeicon} src={Homeicon} alt="Home" />
              <div className={styles.container5}>
                <div className={styles.home}>Home</div>
                
              </div>
              <img className={styles.chevronrighticon} src={Chevronright} alt="Chevron Right" />
              {/* <div className={styles.container6}>
                <div className={styles.text2}>chevron_right</div>
              </div> */}
            </button>

            <button
              type="button"
              className={styles['item-curriculum-link']}
              onClick={() => handleNavigate('/curriculum')}
              aria-label="Go to curriculum"
            >
              {/* <div className={styles.margin2}>
                <div className={styles.text}>auto_stories</div>
              </div> */}

              <img className={styles.subjectsicon} src={Subjectsicon} alt="Subjects" />
              <div className={styles.container5}>
                <div className={styles.home}>Subjects</div>
              </div>
              <img className={styles.chevronrighticon} src={Chevronright} alt="Chevron Right" />
              {/* <div className={styles.container3}>
                <div className={styles.text2}>chevron_right</div>
              </div> */}
              
            </button>

            <button
              type="button"
              className={styles['item-curriculum-link']}
              onClick={() => handleNavigate('/progress-tracker')}
              aria-label="Go to progress tracker"
            >
              {/* <div className={styles.margin2}>
                <div className={styles.text}>leaderboard</div>
              </div> */}
              <img className={styles.progressicon} src={Progressicon} alt="Progress Tracker" />
              <div className={styles.container5}>
                <div className={styles.home}>Progress Tracker</div>
              </div>
              <img className={styles.chevronrighticon} src={Chevronright} alt="Chevron Right" />
              {/* <div className={styles.container3}>
                <div className={styles.text2}>chevron_right</div>
              </div> */}
            </button>

            <button
              type="button"
              className={styles['item-curriculum-link']}
              onClick={() => handleNavigate('/achievements')}
              aria-label="Go to achievements"
            >
              {/* <div className={styles.margin2}>
                <div className={styles.text}>emoji_events</div>
              </div> */}
              <img className={styles.achievementsicon} src={Achievementsicon} alt="Achievements" />
              <div className={styles.container5}>
                <div className={styles.home}>Achievements</div>
              </div>
              <img className={styles.chevronrighticon} src={Chevronright} alt="Chevron Right" />
              {/* <div className={styles.container3}>
                <div className={styles.text2}>chevron_right</div>
              </div> */}
            </button>

            <div className={styles['horizontal-divider']} />

            <button
              type="button"
              className={styles['item-curriculum-link']}
              onClick={() => handleNavigate('/settings')}
              aria-label="Go to settings"
            >
              <img className={styles.settingsicon} src={Settingsicon} alt="Settings" />
              <div className={styles.container5}>
                <div className={styles.home}>Settings</div>
              </div>
              <img className={styles.chevronrighticon} src={Chevronright} alt="Chevron Right" />
            </button>

          </div>
        </div>

        <div className={styles['drawer-footer']}>
          <button type="button" className={styles.button}>
            {/* <div className={styles.margin6}>
              <div className={styles.container15}>
                <div className={styles.text11}>logout</div>
              </div>
            </div> */}
            <img className={styles.signouticon} src={Signout} alt="Sign Out" />
            <div className={styles.container16}>
              <div className={styles['sign-out']}>Sign Out</div>
            </div>
          </button>
        </div>
      </aside>
    </div>
  );
};

export default AsideSidebarDrawerNavigation;
