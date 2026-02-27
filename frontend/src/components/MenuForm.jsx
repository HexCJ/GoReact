import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MenuForm = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    nama_menu: "",
    level_menu: "",
    url_menu: "",
    api_menu: "",
    icon: "",
    no_urut: "",
    status_menu: "",
    master_menu: "",
    permissions: [{ nama: "" }],
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handlePermissionChange = (index, value) => {
    const updated = [...form.permissions];
    updated[index].nama = value;

    setForm({
      ...form,
      permissions: updated,
    });
  };

  const addPermission = () => {
    setForm({
      ...form,
      permissions: [...form.permissions, { nama: "" }],
    });
  };

  const removePermission = (index) => {
    const updated = form.permissions.filter((_, i) => i !== index);
    setForm({
      ...form,
      permissions: updated,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Convert empty string → null untuk field nullable
    const payload = {
      ...form,
      level_menu: form.level_menu ? parseInt(form.level_menu) : null,
      no_urut: form.no_urut ? parseInt(form.no_urut) : null,
      status_menu: form.status_menu ? parseInt(form.status_menu) : null,
      master_menu: form.master_menu ? parseInt(form.master_menu) : null,
      icon: form.icon ? form.icon : null,
    };

    try {
      const response = await fetch("/api/menus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to create menu");
      }

       setSuccess(true);

        setTimeout(() => {
        navigate("/menu", { state: { refresh: true } });
        }, 1500);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add Menu</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input type="text" name="nama_menu" placeholder="Nama Menu"
          value={form.nama_menu} onChange={handleChange}
          required className="w-full border rounded px-3 py-2" />

        <input type="number" name="level_menu" placeholder="Level Menu"
          value={form.level_menu} onChange={handleChange}
          className="w-full border rounded px-3 py-2" />

        <input type="text" name="url_menu" placeholder="URL Menu"
          value={form.url_menu} onChange={handleChange}
          required className="w-full border rounded px-3 py-2" />

        <input type="text" name="api_menu" placeholder="API Menu"
          value={form.api_menu} onChange={handleChange}
          required className="w-full border rounded px-3 py-2" />

        <input type="text" name="icon" placeholder="Icon"
          value={form.icon} onChange={handleChange}
          className="w-full border rounded px-3 py-2" />

        <input type="number" name="no_urut" placeholder="No Urut"
          value={form.no_urut} onChange={handleChange}
          className="w-full border rounded px-3 py-2" />

        <input type="number" name="status_menu" placeholder="Status Menu"
          value={form.status_menu} onChange={handleChange}
          className="w-full border rounded px-3 py-2" />

        <input type="number" name="master_menu" placeholder="Master Menu"
          value={form.master_menu} onChange={handleChange}
          className="w-full border rounded px-3 py-2" />

        {/* Permissions */}
        <div>
          <label className="block font-medium mb-2">Permissions</label>

          {form.permissions.map((perm, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={perm.nama}
                onChange={(e) =>
                  handlePermissionChange(index, e.target.value)
                }
                placeholder="create / edit / delete"
                className="flex-1 border rounded px-3 py-2"
              />

              <button
                type="button"
                onClick={() => removePermission(index)}
                className="bg-red-500 text-white px-3 rounded"
              >
                X
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addPermission}
            className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
          >
            + Add Permission
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
      {success && (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
        <div className="text-green-600 text-2xl mb-3">✔</div>
        <h3 className="text-lg font-semibold mb-2">
            Success
        </h3>
        <p className="text-gray-600 text-sm">
            Data berhasil diedit
        </p>
        </div>
    </div>
    )}
    </div>
  );
};

export default MenuForm;
