import { useState, useEffect, useCallback } from 'react';
import Login from './Login';
import StudentHome from './pages/StudentHome';
import TeacherHome from './pages/TeacherHome';
import CreateClass from './pages/CreateClass';
import JoinClass from './pages/JoinClass';
import LiveClass from './pages/LiveClass';
import TeacherDashboard from './pages/TeacherDashboard';
import ClassSummary from './pages/ClassSummary';

// URL Path to Page Mapping
const ROUTE_MAP = {
  '/': null,
  '/login': 'login',
  '/student': 'student_home',
  '/student-home': 'student_home',
  '/teacher': 'teacher_home',
  '/teacher-home': 'teacher_home',
  '/create-class': 'create_class',
  '/join-class': 'join_class',
  '/live-class': 'live_class',
  '/teacher-dashboard': 'teacher_dashboard',
  '/class-summary': 'class_summary',
  '/summary': 'class_summary',
};

// Page Key to Canonical URL Path
const PAGE_TO_PATH = {
  login: '/login',
  student_home: '/student',
  teacher_home: '/teacher',
  create_class: '/create-class',
  join_class: '/join-class',
  live_class: '/live-class',
  teacher_dashboard: '/teacher-dashboard',
  class_summary: '/class-summary',
};

function getPageFromPath(path, user) {
  const normalized = path.toLowerCase().replace(/\/$/, '') || '/';
  if (ROUTE_MAP[normalized]) {
    return ROUTE_MAP[normalized];
  }
  if (!user) return 'login';
  return user.role === 'teacher' ? 'teacher_home' : 'student_home';
}

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
    const initialPath = window.location.pathname;
    const savedUser = localStorage.getItem('edunova_user');
    const user = savedUser ? JSON.parse(savedUser) : null;
    return getPageFromPath(initialPath, user);
  });

  // Synchronize Browser URL when currentPage changes
  const updateUrl = useCallback((page) => {
    const targetPath = PAGE_TO_PATH[page] || '/';
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ page }, '', targetPath);
    }
  }, []);

  // Listen for browser Back/Forward (popstate) buttons
  useEffect(() => {
    const handlePopState = () => {
      const page = getPageFromPath(window.location.pathname, currentUser);
      setCurrentPage(page);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentUser]);

  // Keep active class synced in localStorage (strip ended classes)
  useEffect(() => {
    if (activeClass && activeClass.status !== 'ended') {
      localStorage.setItem('edunova_active_class', JSON.stringify(activeClass));
    } else {
      localStorage.removeItem('edunova_active_class');
    }
  }, [activeClass]);

  // Ensure current URL matches initial page
  useEffect(() => {
    const currentPath = window.location.pathname;
    const expectedPath = PAGE_TO_PATH[currentPage] || (currentUser?.role === 'teacher' ? '/teacher' : '/student');
    if (currentPath === '/' || !ROUTE_MAP[currentPath]) {
      window.history.replaceState({ page: currentPage }, '', expectedPath);
    }
  }, [currentPage, currentUser]);

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('edunova_user', JSON.stringify(userData));
    const defaultPage = userData.role === 'teacher' ? 'teacher_home' : 'student_home';
    setCurrentPage(defaultPage);
    updateUrl(defaultPage);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveClass(null);
    setCurrentPage('login');
    localStorage.removeItem('edunova_user');
    localStorage.removeItem('edunova_token');
    localStorage.removeItem('edunova_active_class');
    updateUrl('login');
  };

  const handleNavigate = (pageOrPath) => {
    let targetPage = pageOrPath;
    if (pageOrPath.startsWith('/')) {
      targetPage = getPageFromPath(pageOrPath, currentUser);
    }
    setCurrentPage(targetPage);
    updateUrl(targetPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectClass = (cls) => {
    setActiveClass(cls);
  };

  const handleExitClass = () => {
    setActiveClass(null);
    localStorage.removeItem('edunova_active_class');
  };

  // Auth Guard: If not signed in and requesting protected route
  if (!currentUser || currentPage === 'login') {
    return (
      <main className="w-full min-h-screen">
        <Login onLoginSuccess={handleLoginSuccess} />
      </main>
    );
  }

  // Path / Page Routing Switch
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
          onExitClass={handleExitClass}
        />
      );

    case 'teacher_dashboard':
      return (
        <TeacherDashboard
          user={currentUser}
          activeClass={activeClass}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          onExitClass={handleExitClass}
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
