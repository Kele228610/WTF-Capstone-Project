import React from 'react';
import Hero from './sections/Hero/Hero';
import Features from './sections/Features/Features';
import CourseExplorer from './sections/CourseExplorer/CourseExplorer';
import Testimonials from './sections/Testimonials/Testimonials';
import CallToAction from './sections/CallToAction/CallToAction';


const HomePage = () => {
  return (
    <>
      <Hero />
      <Features />
      <CourseExplorer />
      <Testimonials />
      <CallToAction />
    </>
  );
};

export default HomePage;