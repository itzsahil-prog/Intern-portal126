
import React, { useState, useEffect } from 'react';
import { User, UserRole } from './types';
import { db, seedInitialData } from './services/dbService';
import LoginPage from './pages/LoginPage';
import InternDashboard from './pages/InternDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { Toaster, toast } from 'react-hot-toast';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activePage, setActivePage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    seedInitialData();
    const session = localStorage.getItem('velox_session');
    if (session) {
      const sessionUser = db.users.getById(JSON.parse(session).userId);
      if (sessionUser) {
        setUser(sessionUser);
      }
    }
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('velox_session', JSON.stringify({ userId: loggedInUser.id }));
    toast.success(`Welcome back, ${loggedInUser.name}!`);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('velox_session');
    toast.success('Logged out successfully');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <LoginPage onLogin={handleLogin} />
        <Toaster position="bottom-right" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        activePage={activePage} 
        setActivePage={setActivePage} 
        role={user.role}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <Header 
          user={user} 
          isSidebarOpen={isSidebarOpen} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        
        <main className="p-6 overflow-auto">
          {user.role === UserRole.INTERN ? (
            <InternDashboard 
              user={user} 
              activePage={activePage} 
              setActivePage={setActivePage}
              onUserUpdate={setUser}
            />
          ) : (
            <AdminDashboard 
              user={user} 
              activePage={activePage} 
              setActivePage={setActivePage} 
            />
          )}
        </main>
      </div>

      <Toaster position="bottom-right" />
    </div>
  );
};

export default App;
