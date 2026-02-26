import React from 'react';
import { useParams, Link } from 'react-router-dom';

const courseData = {
  1: { 
    title: 'Web Development Fundamentals', 
    category: 'Programming', 
    lessons: 24,
    description: 'Learn the foundations of web development including HTML, CSS, and JavaScript. This comprehensive course takes you from beginner to building your own websites.',
    instructor: 'John Smith',
    duration: '12 hours'
  },
  2: { 
    title: 'Data Science with Python', 
    category: 'Data Science', 
    lessons: 32,
    description: 'Master data analysis, visualization, and machine learning with Python. Perfect for those looking to enter the field of data science.',
    instructor: 'Sarah Johnson',
    duration: '16 hours'
  },
  3: { 
    title: 'UI/UX Design Masterclass', 
    category: 'Design', 
    lessons: 18,
    description: 'Create beautiful, user-friendly interfaces. Learn design principles, prototyping, and user research techniques.',
    instructor: 'Emily Chen',
    duration: '9 hours'
  },
  4: { 
    title: 'Mobile App Development', 
    category: 'Programming', 
    lessons: 28,
    description: 'Build cross-platform mobile apps with React Native. Create iOS and Android apps from a single codebase.',
    instructor: 'Michael Brown',
    duration: '14 hours'
  },
  5: { 
    title: 'Digital Marketing Essentials', 
    category: 'Marketing', 
    lessons: 15,
    description: 'Learn SEO, social media marketing, and content strategies to grow your business online.',
    instructor: 'Lisa Davis',
    duration: '8 hours'
  },
  6: { 
    title: 'Cloud Computing Basics', 
    category: 'Technology', 
    lessons: 20,
    description: 'Get started with cloud computing using AWS, Azure, and Google Cloud. Understand core concepts and services.',
    instructor: 'David Wilson',
    duration: '10 hours'
  },
};

const CourseDetailPage = () => {
  const { id } = useParams();
  const course = courseData[id];

  if (!course) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h1>Course not found</h1>
        <Link to="/courses" style={{ color: '#2563eb', textDecoration: 'none' }}>Back to courses</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <Link to="/courses" style={{ color: '#666', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
        ← Back to Courses
      </Link>
      
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        padding: '3rem',
        color: 'white',
        marginBottom: '2rem'
      }}>
        <span style={{ 
          background: 'rgba(255,255,255,0.2)', 
          padding: '0.25rem 0.75rem', 
          borderRadius: '20px',
          fontSize: '0.875rem'
        }}>
          {course.category}
        </span>
        <h1 style={{ fontSize: '2.5rem', margin: '1rem 0' }}>{course.title}</h1>
        <p style={{ fontSize: '1.125rem', opacity: 0.9 }}>{course.description}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1.5rem', background: '#f9f9f9', borderRadius: '12px', textAlign: 'center' }}>
          <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Lessons</p>
          <p style={{ fontSize: '1.5rem', fontWeight: '600' }}>{course.lessons}</p>
        </div>
        <div style={{ padding: '1.5rem', background: '#f9f9f9', borderRadius: '12px', textAlign: 'center' }}>
          <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Duration</p>
          <p style={{ fontSize: '1.5rem', fontWeight: '600' }}>{course.duration}</p>
        </div>
        <div style={{ padding: '1.5rem', background: '#f9f9f9', borderRadius: '12px', textAlign: 'center' }}>
          <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Instructor</p>
          <p style={{ fontSize: '1.5rem', fontWeight: '600' }}>{course.instructor}</p>
        </div>
      </div>

      <button style={{ 
        width: '100%',
        background: '#2563eb', 
        color: 'white', 
        padding: '1rem', 
        borderRadius: '8px', 
        border: 'none', 
        fontSize: '1.125rem', 
        fontWeight: '600',
        cursor: 'pointer'
      }}>
        Enroll Now - Free
      </button>
    </div>
  );
};

export default CourseDetailPage;
