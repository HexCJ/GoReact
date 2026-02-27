import { useState, useEffect } from 'react';
import { BrowserRouter, Navigate } from 'react-router-dom';
import Login from './components/common/Login';
import AppRoutes from './components/AppRoutes';
import Layout from './components/layout/Layout';
import './App.css';

const AppContent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Cek apakah pengguna sudah login dari sebelumnya
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        setCurrentUser(parsedUser);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Hapus data yang rusak
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Hapus data login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout onLogout={handleLogout} currentUser={currentUser}>
      <AppRoutes isLoggedIn={isLoggedIn} />
    </Layout>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;