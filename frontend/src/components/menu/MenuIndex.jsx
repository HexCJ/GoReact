import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DeleteModal from '../common/DeleteModal';

const MenuIndex = ({ onSelectMenu, onCreateMenu }) => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await fetch('/api/menus');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMenus(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSelectMenu = (menu) => {
    if (onSelectMenu) {
      onSelectMenu(menu);
    } else {
      navigate(`/menu/${menu.id}/edit`);
    }
  };

  const handleCreateMenu = () => {
    if (onCreateMenu) {
      onCreateMenu();
    } else {
      navigate('/menu/create');
    }
  };

    const handleDeleteMenu = async () => {
    try {
        const response = await fetch(`/api/menus/${deleteId}`, {
        method: "DELETE",
        });

        if (!response.ok) {
        throw new Error("Failed to delete menu");
        }

        setDeleteId(null);
        fetchMenus();
    } catch (err) {
        alert(err.message);
    }
    };


  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Menu Management</h2>
        <button
          onClick={handleCreateMenu}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Add Menu
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Permissions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>

            <tbody className="bg-white divide-y divide-gray-200">
            {menus.length === 0 ? (
                <tr>
                <td colSpan="5" className="px-6 py-6 text-center text-gray-500">
                    No menu data available
                </td>
                </tr>
            ) : (
                menus.map((menu, index) => (
                <tr
                    key={menu.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleSelectMenu(menu)}
                >
                    <td className="px-6 py-4 text-sm text-gray-500">
                    {index + 1}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {menu.nama_menu}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                    {menu.url_menu}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                    {menu.permissions && menu.permissions.length > 0
                        ? menu.permissions.map(p => p.nama).join(', ')
                        : '-'}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500 space-x-2">
                    <button
                        onClick={(e) => {
                        e.stopPropagation();
                        handleSelectMenu(menu);
                        }}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                        Edit
                    </button>

                    <button
                        onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(menu.id);
                        }}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    >
                        Delete
                    </button>
                    </td>
                </tr>
                ))
            )}
            </tbody>
        </table>
      </div>
        <DeleteModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteMenu}
        title="Menu"
      />
    </div>
  );
};

export default MenuIndex;
