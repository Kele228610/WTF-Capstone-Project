// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Header from '../components/layout/Header';
// import Footer from '../components/layout/Footer';
// import HomePage from '../features/home/HomePage';
// import SignInPage from '../features/auth/SignInPage';
// import CreateAccountPage from '../features/auth/CreateAccountPage';
// import CoursesPage from '../features/courses/CoursesPage';
// import CourseDetailPage from '../features/courses/CourseDetailPage';
// import '../styles/global.css';

// const App = () => {
//   return (
//     <Router>
//       <div className="app">
//         <Header />
//         <main>
//           <Routes>
//             <Route path="/" element={<HomePage />} />
//             <Route path="/login" element={<SignInPage />} />
//             <Route path="/register" element={<CreateAccountPage />} />
//             <Route path="/courses" element={<CoursesPage />} />
//             <Route path="/courses/:id" element={<CourseDetailPage />} />
//           </Routes>
//         </main>
//         <Footer />
//       </div>
//     </Router>
//   );
// };

// export default App;



import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';

import HomePage from '../features/home/HomePage';
import SignInPage from '../features/auth/SignInPage';
import CreateAccount from '../pages/CreateAccount';
import CoursesPage from '../features/courses/CoursesPage';
import CourseDetailPage from '../features/courses/CourseDetailPage';
import VerifyAccountPage from '../features/auth/VerifyAccountPage';
import ReturningUserHomePage from '../features/home/ReturningUserHomePage';
import NewUserHomePage from '../features/home/NewUserHomePage';
import CurriculumScreen from '../features/curriculum/CurriculumScreen';
import HumanAnatomyLessonPage from '../features/lessons/HumanAnatomyLessonPage';
import HumanAnatomyLessonNotesPage from '../features/lessons/HumanAnatomyLessonNotesPage';
import Module1AssessmentFrontPage from '../features/assessments/Module1AssessmentFrontPage';
import Module1AssessmentPage from '../features/assessments/Module1AssessmentPage';
import ProgressTrackerPage from '../features/progress/ProgressTrackerPage';
import AchievementsPage from '../features/achievements/AchievementsPage';
import SettingsPage from '../features/settings/SettingsPage';
// import Dashboard from '../features/home/Dashboard';

import '../styles/global.css';

const App = () => {
  return (
    <Router>
      <Routes>

        {/* ✅ Pages WITH header/footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
        </Route>

        {/* ✅ Auth pages WITHOUT header/footer */}
        <Route path="/login" element={<SignInPage />} />
        <Route path="/register" element={<CreateAccount />} />
        <Route path="/verify-account" element={<VerifyAccountPage />} />
        <Route path="/returning-home" element={<ReturningUserHomePage />} />
        <Route path="/new-user-home" element={<NewUserHomePage />} />
        <Route path="/curriculum" element={<CurriculumScreen />} />
        <Route path="/curriculum-screen" element={<CurriculumScreen />} />
        <Route path="/lesson/human-anatomy" element={<HumanAnatomyLessonPage />} />
        <Route path="/lesson/human-anatomy/notes" element={<HumanAnatomyLessonNotesPage />} />
        <Route path="/assessment/module-1" element={<Module1AssessmentFrontPage />} />
        <Route path="/assessment/module-1/questions" element={<Module1AssessmentPage />} />
        <Route path="/progress-tracker" element={<ProgressTrackerPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
