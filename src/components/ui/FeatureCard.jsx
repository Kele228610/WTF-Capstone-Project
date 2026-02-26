import React from 'react';
import styles from './FeatureCard.module.css';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>
        <span className="material-icons">{icon}</span>
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
};

export default FeatureCard;

