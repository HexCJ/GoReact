import { useState, useEffect } from 'react';

const UserRoleManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [userRoles, setUserRoles] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');

      // Fetch users
      const usersResponse = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!usersResponse.ok) throw new Error(`HTTP error! status: ${usersResponse.status}`);
      const usersData = await usersResponse.json();
      setUsers(usersData);

      // Fetch roles
      const rolesResponse = await fetch('/api/roles', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!rolesResponse.ok) throw new Error(`HTTP error! status: ${rolesResponse.status}`);
      const rolesData = await rolesResponse.json();
      setRoles(rolesData);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setLoading(false);
    }
  };

  const fetchUserRoles = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users/${userId}/roles`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      // Convert to map for easier lookup
      const roleMap = {};
      data.forEach(r => {
        roleMap[r.id] = true;
      });

      setUserRoles(prev => ({
        ...prev,
        [userId]: roleMap
      }));
    } catch (err) {
      console.error('Error fetching user roles:', err);
    }
  };

  const handleUserChange = (e) => {
    const userId = e.target.value;
    setSelectedUser(userId);

    // Fetch roles for this user if not already loaded
    if (!userRoles[userId]) {
      fetchUserRoles(userId);
    }
  };

  const toggleUserRole = async (userId, roleId) => {
    try {
      const token = localStorage.getItem('token');
      const userRole = userRoles[userId] || {};
      const hasRole = !!userRole[roleId];

      let response;
      if (hasRole) {
        // Remove role from user
        response = await fetch(`/api/users/${userId}/roles/${roleId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } else {
        // Add role to user
        response = await fetch(`/api/users/${userId}/roles/${roleId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      // Update local state
      setUserRoles(prev => {
        const newUserRole = { ...prev };
        if (!newUserRole[userId]) newUserRole[userId] = {};
        newUserRole[userId][roleId] = !hasRole;
        return newUserRole;
      });
    } catch (err) {
      console.error('Error toggling user role:', err);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">User-Role Management</h2>
        <div className="mt-2">
          <label htmlFor="user-select" className="block text-sm font-medium text-gray-700 mb-1">
            Select User
          </label>
          <select
            id="user-select"
            value={selectedUser}
            onChange={handleUserChange}
            className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choose a user</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
            ))}
          </select>
        </div>
      </div>

      {selectedUser && (
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Roles for: {users.find(u => u.id === parseInt(selectedUser))?.name}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map(role => {
              const userRole = userRoles[selectedUser] || {};
              const hasRole = !!userRole[role.id];

              return (
                <div
                  key={role.id}
                  className={`p-3 border rounded-md flex items-center ${
                    hasRole ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    id={`role-${role.id}`}
                    checked={hasRole}
                    onChange={() => toggleUserRole(parseInt(selectedUser), role.id)}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`role-${role.id}`}
                    className="ml-2 text-sm font-medium text-gray-700"
                  >
                    <span className="font-semibold">{role.name}</span>
                    <br />
                    <span className="text-xs text-gray-500">
                      {role.description || 'No description'}
                    </span>
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRoleManagement;
