import { useState, useEffect } from "react";
import axios from "axios";

const modules = [
  "Dashboard", "Report", "Department", "Categories", "Subcategories", "Paymentmodes",
  "Sources", "Statuses", "Tags", "Colors", "Countries", "States", "Templates", "Leads", "Settings"
];

const permissionTypes = ["View", "Store", "Update", "Delete"];

const RolePermissionMatrixSimple = ({ roleName = "Sales Coordinator" }) => {
  const [permissions, setPermissions] = useState({});

  // Initialize permission state on mount
  useEffect(() => {
    const initial = {};
    modules.forEach((mod) => {
      permissionTypes.forEach((perm) => {
        initial[`${mod}_${perm}`] = false;
      });
    });
    setPermissions(initial);
  }, []);

  const handleToggle = (module, action) => {
    const key = `${module}_${action}`;
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    const formattedPayload = modules.map((mod) => {
      const permObject = { module: mod };
      permissionTypes.forEach((type) => {
        permObject[type.toLowerCase()] = permissions[`${mod}_${type}`] || false;
      });
      return permObject;
    });

    console.log("Sending to API:", formattedPayload);

    try {
      await axios.post("/api/roles/save-permissions", {
        role_name: roleName,
        permissions: formattedPayload,
      });
      alert("Permissions saved successfully!");
    } catch (error) {
      console.error("Error saving permissions:", error);
      alert("Error saving permissions.");
    }
  };

  return (
    <div className="p-6 max-w-full overflow-auto bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{roleName}</h2>
      <p className="mb-6 text-sm text-gray-500">Select which actions this role is allowed to perform.</p>

      <div className="overflow-x-auto border rounded-xl shadow-lg bg-white">
        <table className="min-w-max table-auto border-collapse w-full text-sm">
          <thead className="bg-[#d24845] from-blue-600 to-blue-400 text-white">
            <tr>
              <th className="text-left px-6 py-3 font-semibold border border-blue-500">Module</th>
              {permissionTypes.map((type) => (
                <th key={type} className="text-center px-6 py-3 font-semibold border border-blue-500">
                  {type}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modules.map((mod, idx) => (
              <tr key={mod} className={idx % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                <td className="px-6 py-3 font-medium border border-gray-300 text-gray-700">{mod}</td>
                {permissionTypes.map((type) => {
                  const key = `${mod}_${type}`;
                  return (
                    <td key={key} className="text-center border border-gray-300 py-2">
                      <button
                        onClick={() => handleToggle(mod, type)}
                        className={`w-10 h-5 flex items-center rounded-full p-1 duration-300 transition-colors focus:outline-none focus:ring-2 ${
                          permissions[key] ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full shadow-md transform duration-300 ${
                            permissions[key] ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={handleSave}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-md shadow-md"
        >
          Save Permissions
        </button>
        <button
          className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-6 rounded-md shadow-md"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RolePermissionMatrixSimple;
