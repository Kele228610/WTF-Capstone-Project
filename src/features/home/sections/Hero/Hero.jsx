import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../../components/ui/Button';
import imgHero from '../../../../assets/images/Frame 9.png';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.imageWrapper}>
          <img 
            src={imgHero} 
            alt="Student learning with laptop" 
            className={styles.image}
          />
        </div>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Learn Anywhere.<br />
            <span className={styles.highlight}>Even Offline.</span>
          </h1>
          <p className={styles.description}>
            Master new skills with AI-powered support and seamless offline accessibility designed for your pace.
          </p>
          <div className={styles.buttons}>
            <Link to="/register">
              <Button variant="primary">Get Started</Button>
            </Link>
            <Link to="/courses">
              <Button variant="secondary">Browse Subjects</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
