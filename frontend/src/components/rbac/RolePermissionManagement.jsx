import { useState, useEffect } from 'react';

const RolePermissionManagement = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [rolePermissions, setRolePermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');

      // Fetch roles
      const rolesResponse = await fetch('/api/roles', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!rolesResponse.ok) throw new Error(`HTTP error! status: ${rolesResponse.status}`);
      const rolesData = await rolesResponse.json();
      setRoles(rolesData);

      // Fetch permissions
      const permissionsResponse = await fetch('/api/permissions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!permissionsResponse.ok) throw new Error(`HTTP error! status: ${permissionsResponse.status}`);
      const permissionsData = await permissionsResponse.json();
      setPermissions(permissionsData);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setLoading(false);
    }
  };

  const fetchRolePermissions = async (roleId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/roles/${roleId}/permissions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      // Convert to map for easier lookup
      const permissionMap = {};
      data.forEach(p => {
        permissionMap[p.id] = true;
      });

      setRolePermissions(prev => ({
        ...prev,
        [roleId]: permissionMap
      }));
    } catch (err) {
      console.error('Error fetching role permissions:', err);
    }
  };

  const handleRoleChange = (e) => {
    const roleId = e.target.value;
    setSelectedRole(roleId);

    // Fetch permissions for this role if not already loaded
    if (!rolePermissions[roleId]) {
      fetchRolePermissions(roleId);
    }
  };

  const togglePermission = async (roleId, permissionId) => {
    try {
      const token = localStorage.getItem('token');
      const rolePerm = rolePermissions[roleId] || {};
      const hasPermission = !!rolePerm[permissionId];

      let response;
      if (hasPermission) {
        // Remove permission from role
        response = await fetch(`/api/roles/${roleId}/permissions/${permissionId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } else {
        // Add permission to role
        response = await fetch(`/api/roles/${roleId}/permissions/${permissionId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      // Update local state
      setRolePermissions(prev => {
        const newRolePerm = { ...prev };
        if (!newRolePerm[roleId]) newRolePerm[roleId] = {};
        newRolePerm[roleId][permissionId] = !hasPermission;
        return newRolePerm;
      });
    } catch (err) {
      console.error('Error toggling permission:', err);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Role-Permission Management</h2>
        <div className="mt-2">
          <label htmlFor="role-select" className="block text-sm font-medium text-gray-700 mb-1">
            Select Role
          </label>
          <select
            id="role-select"
            value={selectedRole}
            onChange={handleRoleChange}
            className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choose a role</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedRole && (
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Permissions for: {roles.find(r => r.id === parseInt(selectedRole))?.name}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {permissions.map(permission => {
              const rolePerm = rolePermissions[selectedRole] || {};
              const hasPermission = !!rolePerm[permission.id];

              return (
                <div
                  key={permission.id}
                  className={`p-3 border rounded-md flex items-center ${
                    hasPermission ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    id={`perm-${permission.id}`}
                    checked={hasPermission}
                    onChange={() => togglePermission(parseInt(selectedRole), permission.id)}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`perm-${permission.id}`}
                    className="ml-2 text-sm font-medium text-gray-700"
                  >
                    <span className="font-semibold">{permission.name}</span>
                    <br />
                    <span className="text-xs text-gray-500">
                      {permission.action} {permission.resource ? `on ${permission.resource}` : ''}
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

export default RolePermissionManagement;
