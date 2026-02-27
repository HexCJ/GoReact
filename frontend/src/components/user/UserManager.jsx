import { useState } from 'react';
import UserIndex from './UserIndex';
import UserAdd from './UserAdd';
import UserProfile from './UserProfile';

const UserManager = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'create', 'edit'
  const [selectedUser, setSelectedUser] = useState(null);

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
          <UserIndex
            onSelectUser={handleSelectUser}
            onCreateUser={handleCreateUser}
          />
        );
      case 'create':
        return <UserAdd onSave={handleSaveUser} onCancel={handleCancel} />;
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
            <UserAdd user={selectedUser} onSave={handleSaveUser} onCancel={handleCancel} />
            <UserProfile userId={selectedUser?.id} />
          </div>
        );
      default:
        return <UserIndex onSelectUser={handleSelectUser} />;
    }
  };

  return renderCurrentView();
};

export default UserManager;
