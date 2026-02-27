import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen, onClose, currentUser }) => {
  const [menus, setMenus] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchMenus();
  }, [location]);

  const fetchMenus = async () => {
    try {
      const response = await fetch("/api/menus");

      if (!response.ok) {
        throw new Error("Failed to load menus");
      }

      const data = await response.json();

      // Optional: filter hanya menu aktif
      const activeMenus = data.filter(menu => menu.status_menu === 1 || menu.status_menu === null);

      const fetchMenus = async () => {
        try {
          const response = await fetch("/api/menus");
          if (!response.ok) throw new Error("Failed to load menus");

          const data = await response.json();

          // Ambil permission user dari role
          const userPermissions =
            currentUser?.role?.permissions?.map(p => p.nama) || [];

          // Filter menu berdasarkan permission
          const filteredMenus = data.filter(menu =>
            menu.permissions?.some(menuPerm =>
              userPermissions.includes(menuPerm.nama)
            )
          );

          setMenus(filteredMenus);
        } catch (err) {
          console.error(err.message);
        }
      };

      setMenus(activeMenus);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white transition-transform duration-300 ease-in-out transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 lg:relative lg:h-screen flex flex-col`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-900">
        <h1 className="text-xl font-bold">GoReact Admin</h1>
        <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
          ✕
        </button>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menus.map((menu) => (
            <li key={menu.id}>
              <button
                onClick={() => handleNavigation(menu.url_menu)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 flex items-center ${
                  location.pathname.startsWith(menu.url_menu)
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <span className="mr-3 text-lg">
                  {menu.icon ? menu.icon : "📁"}
                </span>
                <span>{menu.nama_menu}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700 bg-gray-900 mt-auto">
        <div className="flex items-center">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
          <div className="ml-3">
            <p className="text-sm font-medium text-white">
              {currentUser?.name || "Admin User"}
            </p>
            <p className="text-xs text-gray-400">
              {currentUser?.email || "admin@example.com"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;