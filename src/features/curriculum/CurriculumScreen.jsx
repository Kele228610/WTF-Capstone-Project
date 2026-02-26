import { useState } from 'react';
import styles from './CurriculumScreen.module.css';
import { useNavigate } from 'react-router-dom';
import AsideSidebarDrawerNavigation from '../../components/layout/AsideSidebarDrawerNavigation';
import Hamburger from '../../assets/icons/Hamburger.png';
import Notificationbell from '../../assets/icons/Notificationbell.png';
import Aistars from '../../assets/icons/Aistars.png';
import Humananatomy from '../../assets/images/Human-anatomy-background.png';
import Calculus from '../../assets/images/Calculus-image.png';
import Additionicon from '../../assets/icons/Additionicon.png';


const CurriculumScreen = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className={styles['curriculum-screen']}>
      <AsideSidebarDrawerNavigation isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className={styles['header-search']}>
        <div className={styles['container']}>
          <div className={styles['container2']}>
            <div className={styles['heading-1']}>
              <b className={styles['subjects']}>Subjects</b>
            </div>
          </div>
        </div>

        {/* <div className={styles['container3']}>
          <div className={styles['input']}>
            <div className={styles['container4']}>
              <div className={styles['search-subjects-or']}>Search subjects or lessons...</div>
            </div>
          </div>
          <div className={styles['container5']}>
            <div className={styles['text']}>search</div>
          </div>
        </div> */}
      </div>
      <div className={styles['header']}>
        <div className={styles['container6']}>
          <button
            type="button"
            className={styles['button']}
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open sidebar navigation"
          >
            <div className={styles['container7']}>
              {/* <div className={styles['text2']}>menu</div> */}
              <img className={styles['hamburger-icon']} src={Hamburger} alt="Menu" />
            </div>
          </button>
          <div className={styles['heading-12']}>
            <b className={styles['subjects']}>EduLearn</b>
          </div>
        </div>
        <div className={styles['button2']}>
          <div className={styles['container8']}>
            <img className={styles['notification-bell-icon']} src={Notificationbell} alt="Notifications" />
            {/* <div className={styles['text2']}>Notifications</div> */}
          </div>
          <div className={styles['backgroundborder']} />
        </div>
      </div>

      <div className={styles['my-courses-section']} />
      <div className={styles['main']}>
        <div className={styles['section-1-my-courses']}>
          <div className={styles['container9']}>
            <div clasName={styles['container2']}>
              <div className={styles['my-courses']}>My Courses</div>
            </div>
            <div className={styles['button3']}>
              <div className={styles['my-courses']}>See All</div>
            </div>
          </div>
          <div className={styles['container10']}>
            <div className={styles['biology-card']}>
              <img className={styles['background-icon']} src={Humananatomy} alt="Human Anatomy" />
              <div className={styles['container11']}>
                <div className={styles['container12']}>
                  <div className={styles['heading-1']}>
                    <b className={styles['human-anatomy']}>Human Anatomy</b>
                  </div>
                  <div className={styles['container13']}>
                    <div className={styles['subjects']}>Introduction to the Human Body Systems</div>
                  </div>
                </div>
                <div className={styles['container14']}>
                  <div className={styles['container15']}>
                    <div className={styles['heading-1']}>
                      <div className={styles['lessons-available-offline-container']}>
                        <span className={styles['lessons']}>{`2/9 Lessons    `}</span>
                        <span className={styles['available-offline']}>Available Offline</span>
                      </div>
                    </div>
                    <div className={styles['container17']}>
                      <div className={styles['subjects']}>35%</div>
                    </div>
                  </div>
                  <div className={styles['background']}>
                    <div className={styles['background2']} />
                  </div>
                </div>
                <button
                  type="button"
                  className={styles['button4']}
                  onClick={() => navigate('/lesson/human-anatomy')}
                >
                  <div className={styles['container7']}>
                    <b className={styles['subjects']}>Continue</b>
                  </div>
                  <div className={styles['container19']} />
                </button>
              </div>
            </div>
            <div className={styles['biology-card']}>
              <img className={styles['image-icon']} src={Calculus} alt="Calculus" />
              <div className={styles['container11']}>
                
                <div className={styles['container12']}>
                   
                  <div className={styles['heading-1']}>
                   
                    <b className={styles['calculus-i']}>Calculus I</b>
                  </div>
                  <div className={styles['container13']}>
                    <div className={styles['mastering-derivatives-limits']}>Mastering derivatives, limits, and integral<br/>fundamentals.</div>
                  </div>
                </div>
                <div className={styles['container23']}>
                  <div className={styles['container15']}>
                    <div className={styles['heading-1']}>
                      <div className={styles['lessons-available-offline-container']}>
                        <span className={styles['lessons']}>{`5/15 Lessons   `}</span>
                        <span className={styles['available-offline']}> Available Offline</span>
                      </div>
                    </div>
                    <div className={styles['container17']}>
                      <div className={styles['div2']}>33%</div>
                    </div>
                  </div>
                  <div className={styles['background']}>
                    <div className={styles['background4']} />
                  </div>
                </div>
                <div className={styles['button5']}>
                  <div className={styles['container7']}>
                    <b className={styles['subjects']}>Continue</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles['section-2-my-interests']}>
            <div className={styles['heading-1']}>
              <b className={styles['subjects']}>My Subjects</b>
            </div>
            <div className={styles['container28']}>
              <div className={styles['overlayborder']}>
                <div className={styles['my-courses']}>Math</div>
              </div>
              <div className={styles['overlayborder']}>
                <div className={styles['my-courses']}>Science</div>
              </div>
              <div className={styles['overlayborder']}>
                <div className={styles['my-courses']}>English</div>
              </div>
              <div className={styles['overlayborder']}>
                <div className={styles['my-courses']}>ICT</div>
              </div>
            </div>
          </div>
          <div className={styles['section-3-add-new-subjects']}>
            <img className={styles['addition-icon']} src={Additionicon} alt="Add new subjects" />
            <div className={styles['container7']}>
              <b className={styles['add-new-subjects']}>Add New Subjects</b>
            </div>
            <div className={styles['container30']}>
              <div className={styles['subjects']}>Explore our catalog of 200+ courses</div>
            </div>
          </div>
        </div>
        <div className={styles['floating-ai-assistant-button']}>
          <div className={styles['floating-ai-assistant-button2']} />
          <div className={styles['container31']}>
            {/* <div className={styles['text4']}>auto_awesome</div> */}
            <img className={styles.aistarsIcon} src={Aistars} alt="AI Stars" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumScreen;
