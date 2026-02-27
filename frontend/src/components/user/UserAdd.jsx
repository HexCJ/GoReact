import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const UserAdd = ({ user: propUser, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role_id: ''
  });
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  // Load user data if editing
  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (id && id !== 'create' && !propUser) {
      fetchUserData();
    } else if (propUser) {
      setFormData({
        name: propUser.name || '',
        email: propUser.email || '',
        password: '',
        confirmPassword: '',
        role_id: propUser.role?.id || ''
      });
    }
  }, [id, propUser]);

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/roles');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRoles(data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/users/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const userData = await response.json();
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        password: '',
        confirmPassword: '',
        role_id: userData.role?.id || ''
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      alert('Password and Confirm Password must match!');
      return;
    }

    try {
      const isCreate = !propUser && (!id || id === 'create');
      const method = isCreate ? 'POST' : 'PUT';
      const url = propUser ? `/api/users/${propUser.id}` : (id && id !== 'create') ? `/api/users/${id}` : '/api/users';

      const payload = {
        name: formData.name,
        email: formData.email,
        role_id: parseInt(formData.role_id)
      };

      // Add password for create or if provided in edit mode
      if (isCreate) {
        payload.password = formData.password;
      } else if (formData.password) {
        payload.password = formData.password;
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const savedUser = await response.json();

      if (onSave) {
        onSave(savedUser);
      } else {
        // If no onSave callback provided, navigate back to user list
        navigate('/users');
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/users');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{id && id !== 'create' ? 'Edit User' : 'Create User'}</h2>
        <button
          onClick={handleCancel}
          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="role_id" className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            id="role_id"
            name="role_id"
            value={formData.role_id}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password {id && id !== 'create' && '(leave empty to keep current)'}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required={id === 'create' || !propUser}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required={id === 'create' || !propUser}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className={`px-4 py-2 text-white rounded-md mr-2 ${
              id && id !== 'create' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {id && id !== 'create' ? 'Update' : 'Create'}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserAdd;
