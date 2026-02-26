import React from 'react';
import FeatureCard from '../../../../components/ui/FeatureCard';
import styles from './Features.module.css';

const Features = () => {
  const features = [
    {
      icon: 'cloud_off',
      title: 'Offline Access',
      description: 'Download lessons and study without needing an active internet connection.'
    },
    {
      icon: 'smart_toy',
      title: 'AI Support',
      description: 'Get instant answers and guidance from our 24/7 learning companion bot.'
    },
    {
      icon: 'bar_chart',
      title: 'Track Progress',
      description: 'Visualize your growth with detailed analytics and performance metrics.'
    }
  ];

  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <h2 className={styles.title}>Why EduLearn Works</h2>
        <div className={styles.grid}>
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
