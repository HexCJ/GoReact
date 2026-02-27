import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../common/DeleteModal";

const RoleIndex = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    const res = await fetch("/api/roles");
    const data = await res.json();
    setRoles(data || []);
  };

  const handleDelete = async () => {
    await fetch(`/api/roles/${deleteId}`, { method: "DELETE" });
    setDeleteId(null);
    fetchRoles();
  };

  return (
    <div className="bg-white shadow rounded p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Role Management</h2>
        <button
          onClick={() => navigate("/roles/create")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Role
        </button>
      </div>

      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">No</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-left">Permissions</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {roles.map((role, index) => (
            <tr key={role.id} className="border-t">
              <td className="p-3">{index + 1}</td>
              <td className="p-3">{role.name}</td>
              <td className="p-3">{role.description}</td>
              <td className="p-3">
                {role.permissions?.map(p => p.nama).join(", ")}
              </td>
              <td className="p-3 space-x-2">
                <button
                  onClick={() => navigate(`/roles/${role.id}/edit`)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => setDeleteId(role.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <DeleteModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Role"
      />
    </div>
  );
};

export default RoleIndex;
