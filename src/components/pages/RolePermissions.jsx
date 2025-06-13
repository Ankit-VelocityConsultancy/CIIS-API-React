import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const RolePermissions = () => {
  const { roleId } = useParams();
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Fetch role permissions
    const fetchRole = async () => {
      try {
        const response = await axios.get(`/api/get_role_permissions/${roleId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setRole(response.data.role);
      } catch (err) {
        console.error("Error fetching role permissions:", err);
      }
    };

    fetchRole();
  }, [roleId]);

  return (
    <div>
      <h1>Permissions for Role: {role?.name}</h1>
      {/* Render role permissions here */}
    </div>
  );
};

export default RolePermissions;
