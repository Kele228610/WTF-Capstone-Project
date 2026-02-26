import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ReturningUserHomePage.module.css';
import AsideSidebarDrawerNavigation from '../../components/layout/AsideSidebarDrawerNavigation';
import Hamburger from '../../assets/icons/Hamburger.png';
import Notificationbell from '../../assets/icons/Notificationbell.png';
import ClockIcon from '../../assets/icons/ClockIcon.png';
import Clouddownload from '../../assets/icons/Clouddownload.png';
import Badgecup from '../../assets/icons/Badgecup.png';
import Aistars from '../../assets/icons/Aistars.png';
import Bluequestion from '../../assets/icons/Bluequestion.png';
import Notebook from '../../assets/icons/Notebook.png';


const ReturningUserHomePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenSidebar = () => setIsSidebarOpen(true);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  return (
    <div className={styles['returning-user-homepage']}>
      <AsideSidebarDrawerNavigation isOpen={isSidebarOpen} onClose={handleCloseSidebar} />

      <div className={styles.header}>
        <div className={styles.container}>
          <button
            type="button"
            className={styles.button}
            onClick={handleOpenSidebar}
            aria-label="Open sidebar navigation"
          >
            <div className={styles.container2}>
              <img className={styles.hamburgerIcon} src={Hamburger} alt="Hamburger" />
            </div>
          </button>

          <div className={styles['heading-1']}>
            <b className={styles.edulearn}>EduLearn</b>
          </div>
        </div>

        <div className={styles.button2}>
          <div className={styles.container3}>
            <img className={styles.notificationbellIcon} src={Notificationbell} alt="Notification Bell" />
          </div>
          <div className={styles.backgroundborder} />
        </div>
      </div>

      <div className={styles['welcome-section']}>
        <div className={styles['heading-12']}>
          <b className={styles['welcome-back-winnie']}>Welcome back, Winnie! 👋</b>
        </div>
        <div className={styles.container4}>
          <div className={styles.edulearn}>Ready to continue your learning journey?</div>
        </div>
      </div>

      <div className={styles['section-ai-recommendation-ca']}>
        <div className={styles.container5}>
          <div className={styles.text3}>psychology</div>
        </div>

        <div className={styles.container6}>
          <div className={styles.overlay}>
            <div className={styles['ai-recommended']}>AI RECOMMENDED</div>
          </div>

          <div className={styles['heading-2']}>
            <b className={styles['welcome-back-winnie']}>Human Anatomy</b>
          </div>

          <div className={styles.container7}>
            <div className={styles.edulearn}>Body Planes and Cavities</div>
          </div>

          <div className={styles.container8}>
            <div className={styles.overlay2}>
              <div className={styles.background} />
            </div>

            <div className={styles.container9}>
              <div className={styles.div}>80%</div>
            </div>
          </div>

          <button
            type="button"
            className={styles.button3}
            onClick={() => navigate('/lesson/human-anatomy')}
            aria-label="Resume Human Anatomy lesson"
          >
            <div className={styles.buttonshadow} />
            <b className={styles['resume-lesson']}>Resume Lesson</b>
          </button>
        </div>
      </div>

      <div className={styles['section-daily-quiz-card']}>
        <div className={styles.container10}>
          <div className={styles.container9}>
            <b className={styles['welcome-back-winnie']}>Your Progress</b>
          </div>
          <div className={styles.link} />
        </div>
      </div>

      <div className={styles['frame-parent']}>
        <div className={styles['backgroundbordershadow-parent']}>
          <div className={styles.backgroundbordershadow}>
            <div className={styles.container11}>
              <b className={styles['welcome-back-winnie']}>24</b>
            </div>

            <div className={styles.container12}>
              <div className={styles.container13} />
            </div>

            <div className={styles.paragraph}>
              <div className={styles['of-monthly-goal']}>75% of monthly goal</div>
            </div>

            <div className={styles.paragraph2} />

            <div className={styles.text4}>
              <b className={styles['lessons-completed']}>Lessons Completed</b>
            </div>
          </div>

          <div className={styles.backgroundbordershadow2}>
            <div className={styles.container14}>
              <div className={styles.text5}>
                {/* <div className={styles.schedule}>schedule</div> */}
                <img className={styles.scheduleIcon} src={ClockIcon} alt="Schedule" />
              </div>
              <div className={styles.text6}>
               
                <b className={styles['time-spent']}>Time Spent</b>
              </div>
            </div>

            <div className={styles.container15}>
              <b className={styles['welcome-back-winnie']}>12.5 hrs</b>
            </div>

            <div className={styles.paragraph3}>
              <div className={styles['of-monthly-goal']}>This week</div>
            </div>
          </div>
        </div>

        <div className={styles['section-storage-achievemen']}>
          <div className={styles.backgroundbordershadow3}>
            <div className={styles.container16}>
              <div className={styles.container9}>
                <img className={styles.clouddownloadIcon} src={Clouddownload} alt="Cloud Download" />
              </div>
              <div className={styles.container18}>
                <b className={styles.schedule}>Storage</b>
              </div>
            </div>

            <div className={styles.container19}>
              <b className={styles['welcome-back-winnie']}>1.2 GB</b>
            </div>

            <div className={styles.overlay3}>
              <div className={styles.background2} />
            </div>

            <div className={styles.container20}>
              <div className={styles['of-5gb-used']}>24% of 5GB used</div>
            </div>
          </div>

          <div className={styles.backgroundbordershadow4}>
            <div className={styles.container21}>
              <div className={styles.container9}>
                <img className={styles.Badgecup} src={Badgecup} alt="Badge cup" />
                {/* <div className={styles['emoji-events']}>emoji_events</div> */}
              </div>
              <div className={styles.container18}>
                <b className={styles.schedule}>Badges</b>
              </div>
            </div>

            <div className={styles.container24}>
              <b className={styles['welcome-back-winnie']}>12 Earned</b>
            </div>

            <div className={styles.container25}>
              <div className={styles.backgroundborder2}>
                <div className={styles.container9}>
                  <div className={styles.text8}>bolt</div>
                </div>
              </div>

              <div className={styles.margin}>
                <div className={styles.backgroundborder3}>
                  <div className={styles.container9}>
                    <div className={styles.text8}>star</div>
                  </div>
                </div>
              </div>

              <div className={styles.margin}>
                <div className={styles.backgroundborder4}>
                  <div className={styles.container9}>
                    <div className={styles.text8}>verified</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Recommended lessons */}

      <div className={styles['suggested-for-you']}>
        <div className={styles['heading-12']}>
          <b className={styles['recommended-lessons']}>Recommended Lessons</b>
        </div>

        <div className={styles.container29}>
          {/* Lesson card 1 */}
          <div className={styles['lesson-1']}>
            {/* <img className={styles['background-icon']} alt="" src={Bluequestion} /> */}
            <img className={styles['Bluequestion']} alt="" src={Bluequestion} />
            <div className={styles.container30}>
              <div className={styles['heading-4']}>
                <b className={styles.schedule}>Intro to Genetics</b>
              </div>
              <div className={styles.container31}>
                <div className={styles.background3}>
                  <div className={styles.lesson}>LESSON</div>
                </div>
                <div className={styles.container32}>
                  {/* <img className={styles['container-icon']} alt="" /> */}
                  <div className={styles.edulearn}>15m</div>
                </div>
              </div>
            </div>
            <div className={styles.button4}>
              <b className={styles.start}>Start</b>
            </div>
          </div>

          {/* Lesson card 2 */}
          <div className={styles['lesson-1']}>
            <img className={styles['Notebook']} alt="" src={Notebook} />
            <div className={styles.container30}>
              <div className={styles['heading-4']}>
                <b className={styles.schedule}>Derivatives</b>
              </div>
              <div className={styles.container31}>
                <div className={styles.background3}>
                  <div className={styles.lesson}>LESSON</div>
                </div>
                <div className={styles.container32}>
                  <img className={styles['container-icon']} alt="" />
                  <div className={styles.edulearn}>12m</div>
                </div>
              </div>
            </div>
            <div className={styles.button4}>
              <b className={styles.start}>Start</b>
            </div>
          </div>

          {/* Lesson card 3 */}
          <div className={styles['lesson-1']}>
            {/* <img className={styles['background-icon']} alt="" /> */}
             <img className={styles['Notebook']} alt="" src={Notebook} />
            <div className={styles.container30}>
              <div className={styles['heading-4']}>
                <b className={styles.schedule}>Linear Inequalities</b>
              </div>
              <div className={styles.container31}>
                <div className={styles.background3}>
                  <div className={styles.lesson}>LESSON</div>
                </div>
                <div className={styles.container32}>
                  <img className={styles['container-icon']} alt="" />
                  <div className={styles.edulearn}>20m</div>
                </div>
              </div>
            </div>
            <div className={styles.button4}>
              <b className={styles.start}>Start</b>
            </div>
          </div>

          {/* Lesson card 4 */}
          <div className={styles['lesson-1']}>
            {/* <img className={styles['background-icon']} alt="" /> */}
            <img className={styles['Notebook']} alt="" src={Notebook} />
            <div className={styles.container30}>
              <div className={styles['heading-4']}>
                <b className={styles.schedule}>The Periodic Table</b>
              </div>
              <div className={styles.container31}>
                <div className={styles.background3}>
                  <div className={styles.lesson}>LESSON</div>
                </div>
                <div className={styles.container32}>
                  <img className={styles['container-icon']} alt="" />
                  <div className={styles.edulearn}>25m</div>
                </div>
              </div>
            </div>
            <div className={styles.button4}>
              <b className={styles.start}>Start</b>
            </div>
          </div>
        </div>
      </div>

      <div className={styles['floating-ai-assistant-button']}>
        <div className={styles['floating-ai-assistant-button2']} />
        <div className={styles.container42}>
          <img className={styles.aistarsIcon} src={Aistars} alt="AI Stars" />
          {/* <div className={styles.text11}></div> */}
        </div>
      </div>
    </div>
  );
};

export default ReturningUserHomePage;
