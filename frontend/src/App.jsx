import { useState, useEffect } from 'react';
import Login from './components/Login';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import UserProfile from './components/UserProfile';
import Layout from './components/layout/Layout';
import './App.css';

const AppContent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('list'); // 'list', 'create', 'edit'
  const [selectedUser, setSelectedUser] = useState(null);

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
    setCurrentView('list');
    setSelectedUser(null);
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setCurrentView('edit');
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setCurrentView('create');
  };

  const handleSaveUser = (user) => {
    if (!selectedUser) {
      // Creating new user
      setCurrentView('list');
    } else {
      // Updating existing user
      setSelectedUser(user);
      setCurrentView('edit');
    }
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedUser(null);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'list':
        return (
          <div>
            <div className="header-actions mb-6">
              <button
                onClick={handleCreateUser}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Create New User
              </button>
            </div>
            <UserList onSelectUser={handleSelectUser} />
          </div>
        );
      case 'create':
        return <UserForm onSave={handleSaveUser} onCancel={handleCancel} />;
      case 'edit':
        return (
          <div>
            <div className="header-actions mb-6">
              <button
                onClick={() => setCurrentView('list')}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Back to List
              </button>
            </div>
            <UserForm user={selectedUser} onSave={handleSaveUser} onCancel={handleCancel} />
            <UserProfile userId={selectedUser?.id} />
          </div>
        );
      default:
        return <UserList onSelectUser={handleSelectUser} />;
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout onLogout={handleLogout} currentUser={currentUser}>
      {renderCurrentView()}
    </Layout>
  );
};

const App = () => {
  return <AppContent />;
};

export default App;