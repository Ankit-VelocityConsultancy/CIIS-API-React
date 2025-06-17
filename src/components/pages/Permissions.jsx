import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { baseURLAtom, accessTokenAtom } from "@/recoil/atoms";
import { useNavigate } from "react-router-dom";


const modules = [
  "Dashboard", "User", "Report", "Department", "Categories", "Subcategories",
  "Paymentmodes", "Sources", "Statuses", "Tags", "Colors", "Countries",
  "States", "Templates", "Leads", "Settings"
];

const permissionTypes = ["View", "Add", "Edit", "Delete"];

const RolePermissionMatrixSimple = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const roleName = location.state?.roleName || "Role";

  const baseURL = useRecoilValue(baseURLAtom);
  const accessToken = useRecoilValue(accessTokenAtom);

  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    const initial = {};
    modules.forEach((mod) => {
      permissionTypes.forEach((perm) => {
        initial[`${mod}_${perm}`] = false;
      });
    });
    setPermissions(initial);
  }, []);

  useEffect(() => {
  const fetchPermissions = async () => {
    try {
      const response = await axios.get(`${baseURL}api/roles/permissions/${roleName}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const fetchedPermissions = response.data.permissions || {};
      const newPermissions = {};

      modules.forEach((mod) => {
        const modKey = mod.toLowerCase();
        permissionTypes.forEach((perm) => {
          const isActive = fetchedPermissions[modKey]?.[perm.toLowerCase()] === 1;
          newPermissions[`${mod}_${perm}`] = isActive;
        });
      });

      setPermissions(newPermissions);
    } catch (err) {
      console.error("Error fetching permissions:", err.response?.data || err.message);
    }
  };

  fetchPermissions();
}, [baseURL, accessToken, roleName]);


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

  try {
    const response = await axios.post(
      `${baseURL}api/roles/save-permissions`,
      {
        role_name: roleName,
        permissions: formattedPayload,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      alert("Permissions saved successfully!");
      setTimeout(() => navigate("/view-roles"), 100); // ✅ prevent race condition
      return;
    } else {
      throw new Error("Unexpected response status");
    }

  } catch (error) {
    console.error("Error saving permissions:", error.response?.data || error.message);
    alert("Error saving permissions.");
  }
};


  return (
    <div className="p-6 max-w-full overflow-auto bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{roleName}</h2>
      <p className="mb-6 text-sm text-gray-500">
        Select which actions this role is allowed to perform.
      </p>

      <div className="overflow-x-auto border rounded-xl shadow-lg bg-white">
        <table className="min-w-max table-auto border-collapse w-full text-sm">
          <thead className="bg-[#d24845] text-white">
            <tr>
              <th className="text-left px-6 py-3 font-semibold border border-blue-500">
                Module
              </th>
              {permissionTypes.map((type) => (
                <th
                  key={type}
                  className="text-center px-6 py-3 font-semibold border border-blue-500"
                >
                  {type}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modules.map((mod, idx) => (
              <tr
                key={mod}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                <td className="px-6 py-3 font-medium border border-gray-300 text-gray-700">
                  {mod}
                </td>
                {permissionTypes.map((type) => {
                  const key = `${mod}_${type}`;
                  const isViewOnlyModule = ["Dashboard", "Report"].includes(mod);

                  if (isViewOnlyModule && type !== "View") {
                    return (
                      <td
                        key={key}
                        className="text-center border border-gray-300 py-2 text-gray-400 italic"
                      >
                        —
                      </td>
                    );
                  }

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
                            permissions[key]
                              ? "translate-x-5"
                              : "translate-x-0"
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
        <button   onClick={() => navigate("/view-roles")}
          className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-6 rounded-md shadow-md"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RolePermissionMatrixSimple;
