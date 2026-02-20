import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const RoleEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [menus, setMenus] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchMenus();
    fetchRole();
  }, []);

  const fetchMenus = async () => {
    const res = await fetch("http://127.0.0.1:8081/api/menus");
    const data = await res.json();
    setMenus(data || []);
  };

  const fetchRole = async () => {
    const res = await fetch(`http://127.0.0.1:8081/api/roles/${id}`);
    const data = await res.json();

    setForm({
      name: data.name,
      description: data.description,
    });

    setSelectedPermissions(data.permission_ids || []);
  };

  const togglePermission = (pid) => {
    if (selectedPermissions.includes(pid)) {
      setSelectedPermissions(
        selectedPermissions.filter((p) => p !== pid)
      );
    } else {
      setSelectedPermissions([...selectedPermissions, pid]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`http://127.0.0.1:8081/api/roles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        permission_ids: selectedPermissions,
      }),
    });

    alert("Role updated successfully");
    navigate("/roles");
  };

  return (
    <div className="bg-white shadow p-6 rounded max-w-4xl mx-auto">
      <h2 className="text-xl mb-4 font-semibold">Edit Role</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          className="w-full border p-2 rounded"
        />

        <textarea
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className="w-full border p-2 rounded"
        />

        {/* MENU GROUP */}
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
                    onChange={() => togglePermission(perm.id)}
                  />
                  <span>{perm.nama}</span>
                </label>
              ))}
            </div>
          ))}
        </div>

        <button className="bg-yellow-600 text-white px-4 py-2 rounded">
          Update
        </button>
      </form>
    </div>
  );
};

export default RoleEdit;