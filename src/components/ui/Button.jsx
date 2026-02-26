import React from 'react';
import styles from './Button.module.css';

const Button = ({ children, variant = 'primary', onClick, className = '' }) => {
  const buttonClass = `${styles.button} ${styles[variant]} ${className}`;
  
  return (
    <button className={buttonClass} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;

