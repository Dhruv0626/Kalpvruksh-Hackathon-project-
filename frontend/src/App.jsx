import { useState, useEffect } from 'react';
import Login from './Login';
import StudentHome from './pages/StudentHome';
import TeacherHome from './pages/TeacherHome';
import CreateClass from './pages/CreateClass';
import JoinClass from './pages/JoinClass';
import LiveClass from './pages/LiveClass';
import TeacherDashboard from './pages/TeacherDashboard';
import ClassSummary from './pages/ClassSummary';

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('edunova_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [activeClass, setActiveClass] = useState(() => {
    const savedClass = localStorage.getItem('edunova_active_class');
    return savedClass ? JSON.parse(savedClass) : null;
  });

  const [currentPage, setCurrentPage] = useState(() => {
    const savedUser = localStorage.getItem('edunova_user');
    if (!savedUser) return 'login';
    const user = JSON.parse(savedUser);
    return user.role === 'teacher' ? 'teacher_home' : 'student_home';
  });

  // Keep active class synced in storage
  useEffect(() => {
    if (activeClass) {
      localStorage.setItem('edunova_active_class', JSON.stringify(activeClass));
    }
  }, [activeClass]);

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('edunova_user', JSON.stringify(userData));
    if (userData.role === 'teacher') {
      setCurrentPage('teacher_home');
    } else {
      setCurrentPage('student_home');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveClass(null);
    setCurrentPage('login');
    localStorage.removeItem('edunova_user');
    localStorage.removeItem('edunova_token');
    localStorage.removeItem('edunova_active_class');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectClass = (cls) => {
    setActiveClass(cls);
  };

  if (!currentUser || currentPage === 'login') {
    return (
      <main className="w-full min-h-screen">
        <Login onLoginSuccess={handleLoginSuccess} />
      </main>
    );
  }

  // Page Routing based on currentPage state
  switch (currentPage) {
    case 'student_home':
      return (
        <StudentHome
          user={currentUser}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          onSelectClass={handleSelectClass}
        />
      );

    case 'teacher_home':
      return (
        <TeacherHome
          user={currentUser}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          onSelectClass={handleSelectClass}
        />
      );

    case 'create_class':
      return (
        <CreateClass
          user={currentUser}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          onSelectClass={handleSelectClass}
        />
      );

    case 'join_class':
      return (
        <JoinClass
          user={currentUser}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          onSelectClass={handleSelectClass}
        />
      );

    case 'live_class':
      return (
        <LiveClass
          user={currentUser}
          activeClass={activeClass}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );

    case 'teacher_dashboard':
      return (
        <TeacherDashboard
          user={currentUser}
          activeClass={activeClass}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );

    case 'class_summary':
      return (
        <ClassSummary
          user={currentUser}
          activeClass={activeClass}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );

    default:
      if (currentUser.role === 'teacher') {
        return (
          <TeacherHome
            user={currentUser}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
            onSelectClass={handleSelectClass}
          />
        );
      }
      return (
        <StudentHome
          user={currentUser}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          onSelectClass={handleSelectClass}
        />
      );
  }
}

export default App;
