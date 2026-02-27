import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserAdd from './UserAdd';
import UserProfile from './UserProfile';

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && id !== 'create') {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/users/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const userData = await response.json();
      setUser(userData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching user:', err);
      setLoading(false);
    }
  };

  const handleSave = (savedUser) => {
    setUser(savedUser);
    navigate('/users');
  };

  const handleCancel = () => {
    navigate('/users');
  };

  if (loading) return <div className="p-4">Loading...</div>;

  if (id === 'create') {
    return <UserAdd onSave={handleSave} onCancel={handleCancel} />;
  }

  return (
    <div>
      <div className="header-actions mb-6">
        <button
          onClick={() => navigate('/users')}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Back to List
        </button>
      </div>
      <UserAdd user={user} onSave={handleSave} onCancel={handleCancel} />
      <UserProfile userId={user?.id} />
    </div>
  );
};

export default UserEdit;
