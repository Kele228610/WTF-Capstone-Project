import React from 'react';
import styles from './TestimonialCard.module.css';

const TestimonialCard = ({ quote, name, role }) => {
  return (
    <div className={styles.card}>
      <div className={styles.quoteIcon}>
        <span className="material-icons">format_quote</span>
      </div>
      <p className={styles.quote}>"{quote}"</p>
      <div className={styles.author}>
        <span className={styles.name}>{name}</span>
        <span className={styles.divider}>•</span>
        <span className={styles.role}>{role}</span>
      </div>
    </div>
  );
};

export default TestimonialCard
