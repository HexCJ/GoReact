import { useState, useEffect } from 'react';

const UserProfile = ({ userId }) => {
  const [profile, setProfile] = useState({ 
    phone: '', 
    address: '',
    bio: '',
    website: '',
    company: '',
    position: ''
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/profile`);
      if (response.status === 404) {
        // Profile doesn't exist yet, set empty profile
        setProfile({ 
          phone: '', 
          address: '',
          bio: '',
          website: '',
          company: '',
          position: ''
        });
        setLoading(false);
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProfile(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const method = profile.id ? 'PUT' : 'POST';
      const url = profile.id
        ? `/api/users/${userId}/profile`
        : `/api/users/${userId}/profile`;

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: profile.phone,
          address: profile.address,
          bio: profile.bio,
          website: profile.website,
          company: profile.company,
          position: profile.position
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleCancel = () => {
    setEditing(false);
    fetchProfile(); // Revert changes
  };

  if (!userId) {
    return <div className="p-4">Select a user to view/edit profile</div>;
  }

  if (loading) return <div className="p-4">Loading profile...</div>;

  if (editing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Edit Profile</h2>
          <button
            onClick={handleCancel}
            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
          >
            Cancel
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                value={profile.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                id="website"
                name="website"
                type="text"
                value={profile.website}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                id="company"
                name="company"
                type="text"
                value={profile.company}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <input
                id="position"
                name="position"
                type="text"
                value={profile.position}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={profile.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 mr-2"
            >
              Save
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
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">User Profile</h2>
        <button
          onClick={() => setEditing(true)}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Edit Profile
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="mb-2"><strong className="text-gray-700">Phone:</strong> <span className="text-gray-600">{profile.phone || 'Not set'}</span></p>
          <p className="mb-2"><strong className="text-gray-700">Address:</strong> <span className="text-gray-600">{profile.address || 'Not set'}</span></p>
          <p className="mb-2"><strong className="text-gray-700">Website:</strong> <span className="text-gray-600">{profile.website || 'Not set'}</span></p>
        </div>
        <div>
          <p className="mb-2"><strong className="text-gray-700">Company:</strong> <span className="text-gray-600">{profile.company || 'Not set'}</span></p>
          <p className="mb-2"><strong className="text-gray-700">Position:</strong> <span className="text-gray-600">{profile.position || 'Not set'}</span></p>
          <p className="mb-2"><strong className="text-gray-700">Bio:</strong> <span className="text-gray-600">{profile.bio || 'Not set'}</span></p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;