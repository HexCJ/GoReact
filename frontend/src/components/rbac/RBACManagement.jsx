import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import RoleManagement from './RoleManagement';
import PermissionManagement from './PermissionManagement';
import RolePermissionManagement from './RolePermissionManagement';
import UserRoleManagement from './UserRoleManagement';

const RBACManagement = () => {
  const [activeTab, setActiveTab] = useState('roles');
  const navigate = useNavigate();
  const location = useLocation();

  // Extract tab from URL path
  const currentTab = location.pathname.split('/').pop() || 'roles';
  const effectiveTab = ['roles', 'permissions', 'role-permissions', 'user-roles'].includes(currentTab) ? currentTab : 'roles';

  // Update active tab when location changes
  if (effectiveTab !== activeTab) {
    setActiveTab(effectiveTab);
  }

  const tabs = [
    { id: 'roles', label: 'Roles', path: '/rbac/roles' },
    { id: 'permissions', label: 'Permissions', path: '/rbac/permissions' },
    { id: 'role-permissions', label: 'Role-Permission Assignment', path: '/rbac/role-permissions' },
    { id: 'user-roles', label: 'User-Role Assignment', path: '/rbac/user-roles' },
  ];

  const renderTabContent = () => {
    switch (effectiveTab) {
      case 'roles':
        return <RoleManagement />;
      case 'permissions':
        return <PermissionManagement />;
      case 'role-permissions':
        return <RolePermissionManagement />;
      case 'user-roles':
        return <UserRoleManagement />;
      default:
        return <RoleManagement />;
    }
  };

  const handleTabChange = (tabId) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      navigate(tab.path);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">RBAC Management</h1>
        <button
          onClick={() => navigate('/users')}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Back to Users
        </button>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                effectiveTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default RBACManagement;
