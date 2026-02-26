import React from 'react';
import CourseCard from '../../../../components/ui/CourseCard';
import styles from './CourseExplorer.module.css';

const CourseExplorer = () => {
  const courses = [
    {
      icon: 'functions',
      iconColor: '#5283ef',
      title: 'Mathematics',
      titleColor: '#0e3a9a',
      bgColor: '#b0c6f8'
    },
    {
      icon: 'biotech',
      iconColor: '#1a9849',
      title: 'Science',
      titleColor: '#0b411f',
      bgColor: '#92ecb3'
    },
    {
      icon: 'translate',
      iconColor: '#f37272',
      title: 'English',
      titleColor: '#bc1010',
      bgColor: '#fbd0d0'
    },
    {
      icon: 'code',
      iconColor: '#f59e0b',
      title: 'ICT',
      titleColor: '#623f04',
      bgColor: '#fbd89d'
    }
  ];

  return (
    <section className={styles.courseExplorer}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Course Explorer</h2>
          {/* <button className={styles.seeAllBtn}>See all</button> */}
        </div>
        <div className={styles.grid}>
          {courses.map((course, index) => (
            <CourseCard key={index} {...course} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseExplorer;
