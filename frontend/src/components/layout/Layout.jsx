import { useState } from 'react';
import Sidebar from './Sidebar';
import HeaderBar from './HeaderBar';

const Layout = ({ children, onLogout, currentUser }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} currentUser={currentUser} />

      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
        <HeaderBar onMenuToggle={toggleSidebar} onLogout={onLogout} currentUser={currentUser} />

        <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Layout;