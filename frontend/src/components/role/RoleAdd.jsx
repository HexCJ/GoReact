import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RoleAdd = () => {
  const navigate = useNavigate();

  const [menus, setMenus] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    const res = await fetch("http://127.0.0.1:8081/api/menus");
    const data = await res.json();
    setMenus(data || []);
  };

  const togglePermission = (id) => {
    if (selectedPermissions.includes(id)) {
      setSelectedPermissions(
        selectedPermissions.filter((p) => p !== id)
      );
    } else {
      setSelectedPermissions([...selectedPermissions, id]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://127.0.0.1:8081/api/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        permission_ids: selectedPermissions,
      }),
    });

    navigate("/roles");
  };

  return (
    <div className="bg-white shadow rounded p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Create Role</h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        <input
          placeholder="Role Name"
          className="w-full border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <textarea
          placeholder="Description"
          className="w-full border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        {/* MENU + PERMISSION GRID */}
        <div className="grid grid-cols-2 gap-6">
          {menus.map((menu) => (
            <div key={menu.id} className="border p-4 rounded">
              <h3 className="font-semibold mb-2">
                {menu.nama_menu}
              </h3>

              {menu.permissions.map((perm) => (
                <label
                  key={perm.id}
                  className="flex items-center space-x-2 mb-1"
                >
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(perm.id)}
                    onChange={() =>
                      togglePermission(perm.id)
                    }
                  />
                  <span>{perm.nama}</span>
                </label>
              ))}
            </div>
          ))}
        </div>

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Save Role
        </button>
      </form>
    </div>
  );
};

export default RoleAdd;
