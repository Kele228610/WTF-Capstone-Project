import React from 'react';
import styles from './CourseCard.module.css';

const CourseCard = ({ icon, iconColor, title, titleColor, bgColor }) => {
  return (
    <div className={styles.card} style={{ backgroundColor: bgColor }}>
      <div className={styles.icon}>
        <span className="material-icons" style={{ color: iconColor }}>
          {icon}
        </span>
      </div>
      <h3 className={styles.title} style={{ color: titleColor }}>
        {title}
      </h3>
    </div>
  );
};

export default CourseCard;

