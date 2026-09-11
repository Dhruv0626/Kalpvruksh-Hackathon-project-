import { useState, useEffect } from 'react';
import Login from './Login';
import StudentDashboard from './components/StudentDashboard';
import FacultyDashboard from './components/FacultyDashboard';

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('edunova_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('edunova_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('edunova_user');
    localStorage.removeItem('edunova_token');
  };

  if (currentUser) {
    if (currentUser.role === 'teacher') {
      return <FacultyDashboard user={currentUser} onLogout={handleLogout} />;
    }
    return <StudentDashboard user={currentUser} onLogout={handleLogout} />;
  }

  return (
    <main className="w-full min-h-screen">
      <Login onLoginSuccess={handleLoginSuccess} />
    </main>
  );
}

export default App;
