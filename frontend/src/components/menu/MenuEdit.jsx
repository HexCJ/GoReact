import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const MenuEdit = () => {
  const { id } = useParams();
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
    permissions: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await fetch(`/api/menus/${id}`);
      if (!response.ok) {
        throw new Error("Failed to load menu");
      }

      const data = await response.json();

      setForm({
        nama_menu: data.nama_menu || "",
        level_menu: data.level_menu ?? "",
        url_menu: data.url_menu || "",
        api_menu: data.api_menu || "",
        icon: data.icon ?? "",
        no_urut: data.no_urut ?? "",
        status_menu: data.status_menu ?? "",
        master_menu: data.master_menu ?? "",
        permissions:
          data.permissions && data.permissions.length > 0
            ? data.permissions
            : [{ nama: "" }],
      });

      setLoading(false);
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  };

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
    setSaving(true);

    const payload = {
      ...form,
      level_menu: form.level_menu ? parseInt(form.level_menu) : null,
      no_urut: form.no_urut ? parseInt(form.no_urut) : null,
      status_menu: form.status_menu ? parseInt(form.status_menu) : null,
      master_menu: form.master_menu ? parseInt(form.master_menu) : null,
      icon: form.icon ? form.icon : null,
    };

    try {
      const response = await fetch(`/api/menus/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to update menu");
      }

      setSuccess(true);

        setTimeout(() => {
        navigate("/menu", { state: { refresh: true } });
        }, 1500);

    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Edit Menu</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="nama_menu"
          value={form.nama_menu}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="number"
          name="level_menu"
          value={form.level_menu}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="text"
          name="url_menu"
          value={form.url_menu}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="text"
          name="api_menu"
          value={form.api_menu}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="text"
          name="icon"
          value={form.icon}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="number"
          name="no_urut"
          value={form.no_urut}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="number"
          name="status_menu"
          value={form.status_menu}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="number"
          name="master_menu"
          value={form.master_menu}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />

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
          disabled={saving}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
        >
          {saving ? "Updating..." : "Update"}
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

export default MenuEdit;
