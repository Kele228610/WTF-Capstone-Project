import React from 'react';
import TestimonialCard from '../../../../components/ui/TestimonalCard';
import imgUser1 from '../../../../assets/images/User1.png';
import imgUser2 from '../../../../assets/images/User2.png';
import imgUser3 from '../../../../assets/images/User3.png';
import styles from './Testimonials.module.css';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "The offline feature is a lifesaver for my commute. I've finished three courses this month alone!",
      name: 'Sarah Jenkins',
      role: 'Junior High School Student',
      avatar: imgUser1
    },
    {
      quote: "AI Support helps me whenever I'm stuck on a math problem. It's like having a personal tutor.",
      name: 'Marcus Chen',
      role: 'Senior High School Junior',
      avatar: imgUser2
    }
  ];

  const userAvatars = [imgUser1, imgUser2, imgUser3];

  return (
    <section className={styles.testimonials}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.avatars}>
            {userAvatars.map((avatar, index) => (
              <div key={index} className={styles.avatar}>
                <img src={avatar} alt={`User ${index + 1}`} />
              </div>
            ))}
            <div className={styles.count}>
              <span>50k+</span>
            </div>
          </div>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className="material-icons">star</span>
            ))}
          </div>
          <p className={styles.subtitle}>Join 50,000+ Students</p>
        </div>
        <div className={styles.grid}>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
