import React from 'react';
import { Link } from 'react-router-dom';

const courses = [
  { id: 1, title: 'Web Development Fundamentals', category: 'Programming', lessons: 24, image: 'https://via.placeholder.com/300x200' },
  { id: 2, title: 'Data Science with Python', category: 'Data Science', lessons: 32, image: 'https://via.placeholder.com/300x200' },
  { id: 3, title: 'UI/UX Design Masterclass', category: 'Design', lessons: 18, image: 'https://via.placeholder.com/300x200' },
  { id: 4, title: 'Mobile App Development', category: 'Programming', lessons: 28, image: 'https://via.placeholder.com/300x200' },
  { id: 5, title: 'Digital Marketing Essentials', category: 'Marketing', lessons: 15, image: 'https://via.placeholder.com/300x200' },
  { id: 6, title: 'Cloud Computing Basics', category: 'Technology', lessons: 20, image: 'https://via.placeholder.com/300x200' },
];

const CoursesPage = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Browse Courses</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Explore our collection of courses</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {courses.map((course) => (
          <Link 
            to={`/courses/${course.id}`} 
            key={course.id}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{ 
              border: '1px solid #eee', 
              borderRadius: '12px', 
              overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
              background: 'white'
            }}>
              <div style={{ 
                height: '180px', 
                background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '3rem'
              }}>
                📚
              </div>
              <div style={{ padding: '1.5rem' }}>
                <span style={{ 
                  background: '#f0f0f0', 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  color: '#666'
                }}>
                  {course.category}
                </span>
                <h3 style={{ fontSize: '1.25rem', margin: '1rem 0 0.5rem' }}>{course.title}</h3>
                <p style={{ color: '#666', fontSize: '0.875rem' }}>{course.lessons} lessons</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
