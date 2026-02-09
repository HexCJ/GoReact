import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose, currentUser }) => {
  const [activeItem, setActiveItem] = useState('users');
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/' },
    { id: 'users', label: 'Users', icon: '👥', path: '/users' },
    { id: 'rbac', label: 'RBAC', icon: '🔐', path: '/rbac' },
    { id: 'posts', label: 'Posts', icon: '📝', path: '/users' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/users' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setActiveItem(menuItems.find(item => item.path === path)?.id || '');
    onClose(); // Close sidebar on mobile after navigation
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white transition-transform duration-300 ease-in-out transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:relative lg:h-screen flex flex-col`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-900">
        <h1 className="text-xl font-bold">GoReact Admin</h1>
        <button
          onClick={onClose}
          className="lg:hidden text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleNavigation(item.path)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 flex items-center ${
                  window.location.pathname.startsWith(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700 bg-gray-900 mt-auto">
        <div className="flex items-center">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{currentUser?.name || 'Admin User'}</p>
            <p className="text-xs text-gray-400">{currentUser?.email || 'admin@example.com'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;