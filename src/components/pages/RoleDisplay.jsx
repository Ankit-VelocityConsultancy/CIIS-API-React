import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { useRecoilValue } from "recoil";
import { baseURLAtom, accessTokenAtom } from "@/recoil/atoms";
import { useNavigate } from "react-router-dom";

const RoleDisplay = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [editRoleId, setEditRoleId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");

  const baseURL = useRecoilValue(baseURLAtom);
  const accessToken = useRecoilValue(accessTokenAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${baseURL}api/get_roles/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (Array.isArray(response.data)) {
          setRoles(response.data);
        } else {
          setError("No roles found.");
        }
      } catch (err) {
        console.error("Error fetching roles:", err);
        setError("Failed to fetch roles.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [baseURL, accessToken]);

  const handleSaveRole = async () => {
    if (!newRoleName.trim()) {
      alert("Please enter a role name.");
      return;
    }

    try {
      if (editMode && editRoleId !== null) {
        const response = await axios.put(
          `${baseURL}api/edit_role/${editRoleId}/`,
          { name: newRoleName },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        alert("Role updated successfully!");
        setRoles((prev) =>
          prev.map((role) =>
            role.id === editRoleId ? { ...role, name: newRoleName } : role
          )
        );
      } else {
        const response = await axios.post(
          `${baseURL}api/create_role/`,
          { name: newRoleName },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        alert("Role created successfully!");
        setRoles((prev) => [...prev, response.data]);
      }

      setShowModal(false);
      setNewRoleName("");
      setEditMode(false);
      setEditRoleId(null);
    } catch (error) {
      console.error("Error saving role:", error.response?.data || error.message);
      alert("Error saving role.");
    }
  };

  if (loading) return <div className="p-4 text-gray-700">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 bg-white bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">
              {editMode ? "Edit Role" : "Create New Role"}
            </h2>
            <input
              type="text"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              placeholder="Enter role name"
              className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
            />
            <div className="flex justify-end gap-4">
              <Button
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  setShowModal(false);
                  setNewRoleName("");
                  setEditMode(false);
                  setEditRoleId(null);
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleSaveRole}
              >
                {editMode ? "Update" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header + Search + Add Button */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h1 className="text-xl font-semibold">Roles</h1>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-300 rounded px-3 py-2 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow"
            onClick={() => {
              setEditMode(false);
              setNewRoleName("");
              setShowModal(true);
            }}
          >
            + Add New Role
          </Button>
        </div>
      </div>

      {/* Roles Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full table-auto border border-gray-300 text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Sr No</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Permissions</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {roles
              .filter((role) =>
                role.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((role, index) => (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{role.name}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <Button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow"
                      onClick={() =>
                        navigate(`/role-permissions/${role.id}`, {
                          state: { roleName: role.name },
                        })
                      }
                    >
                      View Permissions
                    </Button>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <Button
                      className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded shadow"
                      onClick={() => {
                        setEditRoleId(role.id);
                        setNewRoleName(role.name);
                        setEditMode(true);
                        setShowModal(true);
                      }}
                    >
                      ✎
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoleDisplay;
